/**
 * Startup script — runs on container start (Render / Docker).
 *
 * Order:
 * 1. Wait for DB to be reachable (Render DB may take a few seconds to accept connections)
 * 2. Run `prisma db push` to sync schema
 * 3. Run the seed script to import all 54 court-claims templates
 * 4. Start the Next.js standalone server
 *
 * Why this exists:
 * - DATABASE_URL is only available at runtime (not build time)
 * - Render's Docker deploy doesn't have a separate "release" phase
 * - So we run migrations + seed right before starting the server, every deploy
 * - The seed is idempotent (uses upsert) so re-running is safe
 */

const { spawn } = require("node:child_process");
const { execSync } = require("node:child_process");

const DB_URL = process.env.DATABASE_URL;

if (!DB_URL) {
  console.error("❌ DATABASE_URL is not set. Cannot start.");
  process.exit(1);
}

console.log("=".repeat(60));
console.log("Adolat Marketplace — starting up");
console.log("=".repeat(60));
console.log("DATABASE_URL:", DB_URL.replace(/:[^:@]+@/, ":***@"));
console.log("");

// ----------------------------------------------------------------------------
// 1. Wait for DB to be reachable (max 30 retries, 2s each = 60s)
// ----------------------------------------------------------------------------
function waitForDb(maxRetries = 30, delayMs = 2000) {
  return new Promise((resolve, reject) => {
    let attempts = 0;

    function tryConnect() {
      attempts++;
      console.log(`[db] Attempt ${attempts}/${maxRetries} to connect...`);

      // Use prisma to ping the DB — if `prisma db push --accept-data-loss` works, we're good
      // We'll do a lightweight connection test via a quick node script
      try {
        const { PrismaClient } = require("@prisma/client");
        const prisma = new PrismaClient({
          log: ["error"],
        });
        // $queryRaw is the lightest possible call
        prisma.$queryRaw`SELECT 1`.then(() => {
          return prisma.$disconnect();
        }).then(() => {
          console.log("[db] ✓ Connected");
          resolve();
        }).catch((err) => {
          if (attempts >= maxRetries) {
            reject(new Error(`DB unreachable after ${maxRetries} attempts: ${err.message}`));
            return;
          }
          setTimeout(tryConnect, delayMs);
        });
      } catch (err) {
        if (attempts >= maxRetries) {
          reject(new Error(`Prisma client failed to load: ${err.message}`));
          return;
        }
        setTimeout(tryConnect, delayMs);
      }
    }

    tryConnect();
  });
}

// ----------------------------------------------------------------------------
// 2. Run a shell command and inherit stdio
// ----------------------------------------------------------------------------
function run(cmd, args, label) {
  console.log(`\n[${label}] Running: ${cmd} ${args.join(" ")}`);
  return new Promise((resolve, reject) => {
    const child = spawn(cmd, args, {
      stdio: "inherit",
      cwd: process.cwd(),
      env: process.env,
    });
    child.on("close", (code) => {
      if (code === 0) {
        console.log(`[${label}] ✓ Done`);
        resolve();
      } else {
        reject(new Error(`[${label}] Failed with code ${code}`));
      }
    });
    child.on("error", (err) => {
      reject(new Error(`[${label}] Spawn error: ${err.message}`));
    });
  });
}

/**
 * Run prisma CLI — tries multiple invocation methods since the Docker image
 * only has `bun` (no `node`), and the .bin symlinks may or may not work.
 */
async function runPrisma(args, label) {
  // Try 1: bunx prisma (works if .bin symlinks are intact)
  try {
    await run("bunx", ["prisma", ...args], label);
    return;
  } catch (e) {
    console.log(`[${label}] bunx prisma failed, trying direct path...`);
  }
  // Try 2: bun run node_modules/prisma/build/index.js
  await run("bun", ["run", "node_modules/prisma/build/index.js", ...args], label);
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------
async function main() {
  // 1. Wait for DB
  await waitForDb();

  // 2. Sync schema (idempotent — creates tables if missing, alters if changed)
  await runPrisma(["db", "push", "--accept-data-loss"], "schema");

  // 3. Seed court-claims templates (idempotent — uses upsert)
  try {
    await run("bun", ["scripts/seed-court-claims.js"], "seed");
  } catch (err) {
    // Seed failure shouldn't block startup — server can still run,
    // templates just won't be in the DB (but /api/court-claims reads from JSON anyway)
    console.error("[seed] ⚠️  Seed failed (non-fatal):", err.message);
    console.error("[seed] Server will still start — /api/court-claims works without DB");
  }

  // 4. Start Next.js standalone server
  console.log("\n" + "=".repeat(60));
  console.log("[server] Starting Next.js standalone server...");
  console.log("=".repeat(60) + "\n");

  const server = spawn("bun", ["server.js"], {
    stdio: "inherit",
    cwd: process.cwd(),
    env: process.env,
  });

  // Forward signals to the server process
  process.on("SIGTERM", () => {
    console.log("[startup] Received SIGTERM, forwarding to server");
    server.kill("SIGTERM");
  });
  process.on("SIGINT", () => {
    console.log("[startup] Received SIGINT, forwarding to server");
    server.kill("SIGINT");
  });

  server.on("close", (code) => {
    console.log(`[startup] Server exited with code ${code}`);
    process.exit(code ?? 0);
  });
}

main().catch((err) => {
  console.error("\n" + "=".repeat(60));
  console.error("STARTUP FAILED");
  console.error("=".repeat(60));
  console.error(err);
  process.exit(1);
});
