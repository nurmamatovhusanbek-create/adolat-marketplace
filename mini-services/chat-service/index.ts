// Load .env from project root first
import { config } from "dotenv";
config({ path: "../../.env" });

import { createServer, IncomingMessage, ServerResponse } from "http";
import { Server, Socket } from "socket.io";
import { PrismaClient } from "@prisma/client";
import { jwtVerify } from "jose";
import { nanoid } from "nanoid";
import { promises as fs } from "fs";
import path from "path";

console.log("[chat] starting chat service...");
console.log("[chat] NEXTAUTH_SECRET:", process.env.NEXTAUTH_SECRET ? "set" : "NOT SET");

const db = new PrismaClient();
const PORT = 3003;
const UPLOAD_DIR = path.join(process.cwd(), "storage", "uploads");
const NEXTAUTH_SECRET = process.env.NEXTAUTH_SECRET || "";
const MAX_FILE_SIZE = 10 * 1024 * 1024;
const ALLOWED_MIME = [
  "image/jpeg", "image/png", "image/webp", "image/gif",
  "application/pdf", "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain", "text/plain; charset=utf-8",
];

fs.mkdir(UPLOAD_DIR, { recursive: true }).catch(console.error);

// === JWT ===
async function verifyToken(token: string): Promise<{ id: string; role: string; email: string } | null> {
  if (!NEXTAUTH_SECRET) return null;
  try {
    const secret = new TextEncoder().encode(NEXTAUTH_SECRET);
    const { payload } = await jwtVerify(token, secret, { algorithms: ["HS256"] });
    if (!payload.sub || !payload.role) return null;
    return { id: payload.sub as string, role: payload.role as string, email: payload.email as string };
  } catch { return null; }
}

// === HTTP server ===
const httpServer = createServer((req: IncomingMessage, res: ServerResponse) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  if (req.method === "OPTIONS") { res.writeHead(204); res.end(); return; }

  if (req.url === "/health") {
    res.writeHead(200, { "Content-Type": "application/json" });
    res.end(JSON.stringify({ status: "ok", service: "chat", ts: Date.now() }));
    return;
  }

  if (req.url === "/upload" && req.method === "POST") {
    handleFileUpload(req, res).catch(err => {
      console.error("[chat] upload error:", err);
      if (!res.headersSent) { res.writeHead(500); res.end(JSON.stringify({ error: "Server error" })); }
    });
    return;
  }

  if (req.url?.startsWith("/files/") && req.method === "GET") {
    serveUploadedFile(req, res).catch(err => {
      console.error("[chat] serve error:", err);
      if (!res.headersSent) { res.writeHead(500); res.end(JSON.stringify({ error: "Server error" })); }
    });
    return;
  }

  // Let socket.io handle / and /socket.io paths
  if (req.url === "/" || req.url?.startsWith("/?") || req.url?.startsWith("/socket.io")) return;

  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Not found" }));
});

// === File upload ===
async function handleFileUpload(req: IncomingMessage, res: ServerResponse) {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) {
    res.writeHead(401); res.end(JSON.stringify({ error: "Unauthorized" })); return;
  }
  const user = await verifyToken(authHeader.slice(7));
  if (!user) { res.writeHead(401); res.end(JSON.stringify({ error: "Invalid token" })); return; }

  const contentType = req.headers["content-type"] || "";
  if (!contentType.startsWith("multipart/form-data")) {
    res.writeHead(400); res.end(JSON.stringify({ error: "Expected multipart/form-data" })); return;
  }
  const boundary = contentType.split("boundary=")[1];
  if (!boundary) { res.writeHead(400); res.end(JSON.stringify({ error: "No boundary" })); return; }

  const chunks: Buffer[] = [];
  await new Promise<void>((resolve, reject) => {
    req.on("data", (c: Buffer) => chunks.push(c));
    req.on("end", () => resolve());
    req.on("error", reject);
  });
  const body = Buffer.concat(chunks);
  if (body.length > MAX_FILE_SIZE) {
    res.writeHead(413); res.end(JSON.stringify({ error: "File too large (max 10 MB)" })); return;
  }

  const parts = parseMultipart(body, boundary);
  const filePart = parts.find(p => p.filename);
  if (!filePart) { res.writeHead(400); res.end(JSON.stringify({ error: "No file" })); return; }
  if (!ALLOWED_MIME.includes(filePart.contentType)) {
    res.writeHead(415); res.end(JSON.stringify({ error: "Unsupported file type", mime: filePart.contentType })); return;
  }

  const ext = path.extname(filePart.filename || "").toLowerCase();
  const safeExt = [".jpg",".jpeg",".png",".webp",".gif",".pdf",".doc",".docx",".xls",".xlsx",".txt"].includes(ext) ? ext : "";
  const filename = `${nanoid(16)}${safeExt}`;
  await fs.writeFile(path.join(UPLOAD_DIR, filename), filePart.data);
  console.log(`[chat] file uploaded: ${filename} (${filePart.data.length} bytes) by ${user.id}`);

  res.writeHead(200, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ ok: true, file: { filename, originalName: filePart.filename, size: filePart.data.length, mimeType: filePart.contentType, url: `/files/${filename}` } }));
}

interface MultiPart { name: string; filename?: string; contentType: string; data: Buffer; }

function parseMultipart(body: Buffer, boundary: string): MultiPart[] {
  const parts: MultiPart[] = [];
  const boundaryBuf = Buffer.from(`--${boundary}`);
  let start = 0;
  while (true) {
    const bStart = body.indexOf(boundaryBuf, start);
    if (bStart === -1) break;
    const nextStart = body.indexOf(boundaryBuf, bStart + boundaryBuf.length);
    if (nextStart === -1) break;
    const partData = body.slice(bStart + boundaryBuf.length + 2, nextStart - 2);
    const headerEnd = partData.indexOf("\r\n\r\n");
    if (headerEnd !== -1) {
      const headersStr = partData.slice(0, headerEnd).toString("utf-8");
      const data = partData.slice(headerEnd + 4);
      const headers = headersStr.split("\r\n");
      const cd = headers.find(h => h.toLowerCase().startsWith("content-disposition:"));
      const ct = headers.find(h => h.toLowerCase().startsWith("content-type:"));
      let name = "", filename: string | undefined;
      if (cd) {
        const nm = cd.match(/name="([^"]+)"/); if (nm) name = nm[1];
        const fm = cd.match(/filename="([^"]*)"/); if (fm) filename = fm[1];
      }
      parts.push({ name, filename, contentType: ct ? ct.split(":")[1].trim() : "application/octet-stream", data });
    }
    start = nextStart;
    if (body.indexOf(Buffer.from(`--${boundary}--`), nextStart) !== -1) break;
  }
  return parts;
}

// === Serve files ===
async function serveUploadedFile(req: IncomingMessage, res: ServerResponse) {
  const filename = path.basename(req.url!.replace("/files/", ""));
  if (!/^[A-Za-z0-9_-]+\.(jpg|jpeg|png|webp|gif|pdf|doc|docx|xls|xlsx|txt)$/.test(filename)) {
    res.writeHead(400); res.end(JSON.stringify({ error: "Invalid filename" })); return;
  }
  try {
    const data = await fs.readFile(path.join(UPLOAD_DIR, filename));
    const ext = path.extname(filename).slice(1).toLowerCase();
    const mimeMap: Record<string,string> = {
      jpg:"image/jpeg", jpeg:"image/jpeg", png:"image/png", webp:"image/webp", gif:"image/gif",
      pdf:"application/pdf", doc:"application/msword",
      docx:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      xls:"application/vnd.ms-excel",
      xlsx:"application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      txt:"text/plain; charset=utf-8",
    };
    res.writeHead(200, { "Content-Type": mimeMap[ext] || "application/octet-stream", "Content-Length": data.length, "Cache-Control": "private, max-age=86400", "X-Content-Type-Options": "nosniff" });
    res.end(data);
  } catch {
    res.writeHead(404); res.end(JSON.stringify({ error: "File not found" }));
  }
}

// === Socket.io ===
const io = new Server(httpServer, {
  path: "/socket.io/",
  cors: { origin: "*", methods: ["GET", "POST"] },
  pingTimeout: 60000,
  pingInterval: 25000,
  maxHttpBufferSize: 1e6,
});

const onlineUsers = new Map<string, string>();

io.use(async (socket: Socket, next) => {
  try {
    const token = socket.handshake.auth?.token as string | undefined;
    if (!token) return next(new Error("No token"));
    const user = await verifyToken(token);
    if (!user) return next(new Error("Invalid token"));
    (socket as any).user = user;
    next();
  } catch (err) {
    next(err as Error);
  }
});

io.on("connection", (socket: Socket) => {
  const user = (socket as any).user;
  console.log(`[chat] connected: ${user.id}`);
  onlineUsers.set(socket.id, user.id);
  socket.broadcast.emit("user-online", { userId: user.id });

  socket.on("conversation:join", async (data: { conversationId: string }, ack?: Function) => {
    try {
      const conv = await db.conversation.findUnique({ where: { id: data.conversationId }, select: { id: true, participants: { select: { id: true } } } });
      if (!conv) { ack?.({ ok: false, error: "Not found" }); return; }
      if (!conv.participants.some(p => p.id === user.id)) { ack?.({ ok: false, error: "Forbidden" }); return; }
      socket.join(`conv:${data.conversationId}`);
      ack?.({ ok: true });
    } catch (err) { console.error("[chat] join error:", err); ack?.({ ok: false, error: "Server error" }); }
  });

  socket.on("conversation:leave", (data: { conversationId: string }) => {
    socket.leave(`conv:${data.conversationId}`);
  });

  socket.on("message:send", async (data: { conversationId: string; receiverId: string; content: string; attachments?: any[] }, ack?: Function) => {
    try {
      if (!data.content?.trim() && (!data.attachments || data.attachments.length === 0)) {
        ack?.({ ok: false, error: "Empty" }); return;
      }
      if (data.content && data.content.length > 2000) { ack?.({ ok: false, error: "Too long" }); return; }
      if (data.attachments && data.attachments.length > 5) { ack?.({ ok: false, error: "Max 5 files" }); return; }

      const conv = await db.conversation.findUnique({ where: { id: data.conversationId }, select: { participants: { select: { id: true } } } });
      if (!conv) { ack?.({ ok: false, error: "Not found" }); return; }
      if (!conv.participants.some(p => p.id === user.id)) { ack?.({ ok: false, error: "Forbidden" }); return; }

      const msg = await db.message.create({
        data: { id: nanoid(), conversationId: data.conversationId, senderId: user.id, receiverId: data.receiverId, content: data.content || "", attachments: JSON.stringify(data.attachments || []) },
      });
      await db.conversation.update({ where: { id: data.conversationId }, data: { lastMessageAt: new Date() } });

      const payload = { id: msg.id, conversationId: msg.conversationId, senderId: msg.senderId, receiverId: msg.receiverId, content: msg.content, attachments: data.attachments || [], createdAt: msg.createdAt };
      io.to(`conv:${data.conversationId}`).emit("message:new", payload);
      ack?.({ ok: true, message: payload });
    } catch (err) { console.error("[chat] send error:", err); ack?.({ ok: false, error: "Server error" }); }
  });

  socket.on("typing:start", (data: { conversationId: string }) => {
    socket.to(`conv:${data.conversationId}`).emit("typing:start", { userId: user.id });
  });
  socket.on("typing:stop", (data: { conversationId: string }) => {
    socket.to(`conv:${data.conversationId}`).emit("typing:stop", { userId: user.id });
  });

  socket.on("messages:read", async (data: { conversationId: string }) => {
    try {
      await db.message.updateMany({ where: { conversationId: data.conversationId, receiverId: user.id, isRead: false }, data: { isRead: true, readAt: new Date() } });
      socket.to(`conv:${data.conversationId}`).emit("messages:read", { userId: user.id });
    } catch (err) { console.error("[chat] read error:", err); }
  });

  socket.on("disconnect", () => {
    onlineUsers.delete(socket.id);
    const stillOnline = Array.from(onlineUsers.values()).includes(user.id);
    if (!stillOnline) socket.broadcast.emit("user-offline", { userId: user.id });
  });

  socket.on("error", (err: Error) => console.error(`[chat] socket error:`, err));
});

httpServer.listen(PORT, () => console.log(`[chat] running on port ${PORT}`));

process.on("uncaughtException", (err) => console.error("[chat] uncaughtException:", err));
process.on("unhandledRejection", (err) => console.error("[chat] unhandledRejection:", err));
process.on("SIGTERM", () => { io.close(); httpServer.close(); db.$disconnect().finally(() => process.exit(0)); });
process.on("SIGINT", () => { io.close(); httpServer.close(); db.$disconnect().finally(() => process.exit(0)); });
