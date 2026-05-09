import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { Agent, fetch as undiciFetch } from "undici";
import { API_BASE } from "@/lib/api";
import { isJwtExpired } from "@/lib/auth";

// bodyTimeout=0 so SSE connections can stay open indefinitely without undici killing them.
const dispatcher = new Agent({
  bodyTimeout: 0,
  headersTimeout: 0,
});

async function forward(req: Request, path: string[]) {
  if (!API_BASE) {
    return NextResponse.json(
      { error: "NEXT_PUBLIC_API_BASE not set in .env.local" },
      { status: 500 }
    );
  }

  const { search } = new URL(req.url);
  const url = `${API_BASE}/${path.join("/")}${search}`;

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
    dispatcher,
    signal: req.signal,
  });

  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("text/event-stream")) {
    return new NextResponse(res.body as unknown as ReadableStream, {
      status: res.status,
      headers: {
        "Content-Type": "text/event-stream",
        "Cache-Control": "no-cache",
        "Connection": "keep-alive",
        "X-Accel-Buffering": "no",
      },
    });
  }

  const body = await res.text();

  // A 401 only means "your session is dead" if the JWT we sent was actually
  // expired. Otherwise the 401 is about this specific request (e.g. password
  // re-verify, role check) and the session must be left intact.
  if (res.status === 401 && isJwtExpired(token)) {
    const expired = await cookies();
    expired.delete("token");
  }

  return new NextResponse(body || null, {
    status: res.status,
    headers: contentType ? { "Content-Type": contentType } : {},
  });
}

// Next.js expects params to be async in your version
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
