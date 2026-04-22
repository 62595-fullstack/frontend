import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { API_BASE } from "@/lib/api";

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

  const res = await fetch(url, {
    method: req.method,
    headers: {
      "Content-Type": req.headers.get("content-type") ?? "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body:
      req.method === "GET" || req.method === "HEAD"
        ? undefined
        : await req.text(),
    cache: "no-store",
  });

  const body = await res.text();

  if (res.status === 401) {
    const cookieStore = await cookies();
    cookieStore.delete("token");
  }

  const contentType = res.headers.get("content-type");
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