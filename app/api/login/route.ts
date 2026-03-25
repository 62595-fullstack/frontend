import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  const { email, password } = await req.json()

  // DEV BYPASS - TODO: REMOVE BEFORE PROD
  if (process.env.NODE_ENV === 'development') {
    const cookieStore = await cookies()
    cookieStore.set('session', '1', { httpOnly: true, sameSite: 'lax', path: '/' })
    return NextResponse.json({ ok: true })
  }
  // END DEV BYPASS

  const body = JSON.stringify({ Email: email, PasswordHash: password })
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_API_BASE}/login/${encodeURIComponent(body)}`
  )
  const text = await res.text()

  if (text.toLowerCase() === 'true') {
    const cookieStore = await cookies()
    cookieStore.set('session', '1', { httpOnly: true, sameSite: 'lax', path: '/' })
    return NextResponse.json({ ok: true })
  }

  return NextResponse.json({ ok: false }, { status: 401 })
}