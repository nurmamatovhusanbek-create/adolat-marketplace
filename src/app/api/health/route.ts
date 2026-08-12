import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// GET /api/health — health check endpoint for Docker + Render
export async function GET() {
  return NextResponse.json({
    status: "ok",
    service: "adolat",
    version: "0.7.0",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    environment: process.env.NODE_ENV ?? "development",
  });
}
