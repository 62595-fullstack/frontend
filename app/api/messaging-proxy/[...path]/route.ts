import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Agent, fetch as undiciFetch } from "undici";

const MESSAGING_BASE = process.env.NEXT_PUBLIC_MESSAGING_BASE?.replace(/\/$/, "");

// Messaging dev server uses a self-signed cert.
const insecureDispatcher = new Agent({
  connect: { rejectUnauthorized: false },
});

async function forward(req: Request, path: string[]) {
  if (!MESSAGING_BASE) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_MESSAGING_BASE not set in .env.local" },
      { status: 500 }
    );
  }

  const { search } = new URL(req.url);
  const url = `${MESSAGING_BASE}/${path.join("/")}${search}`;

  const cookieStore = await cookies();
  const token = cookieStore.get("token")?.value;

  const res = await undiciFetch(url, {
    method: req.method,
    headers: {
      "Content-Type": req.headers.get("content-type") ?? "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body:
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : await req.text(),
    dispatcher: insecureDispatcher,
  });

  const body = await res.text();

  if (res.status === 401) {
    const expired = await cookies();
    expired.delete("token");
  }

  const contentType = res.headers.get("content-type");
  return new NextResponse(body || null, {
    status: res.status,
    headers: contentType ? { "Content-Type": contentType } : {},
  });
}

type Ctx = { params: Promise<{ path: string[] }> };

export async function GET(req: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path);
}

export async function POST(req: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path);
}

export async function PUT(req: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path);
}

export async function PATCH(req: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path);
}

export async function DELETE(req: Request, ctx: Ctx) {
  const { path } = await ctx.params;
  return forward(req, path);
}
