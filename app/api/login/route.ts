import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/login/${encodeURIComponent(email)}?password=${encodeURIComponent(password)}`
  )

  if (!res.ok) {
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const token = await res.text()
  const cookieStore = await cookies()
  cookieStore.set('token', token, { httpOnly: true, sameSite: 'lax', path: '/' })
  return NextResponse.json({ ok: true })
}