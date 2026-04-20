import { NextRequest, NextResponse } from 'next/server'
import { API_BASE } from '@/lib/api'

export async function POST(req: NextRequest) {
  const { email, password, firstName, lastName, age } = await req.json()

  const res = await fetch(`${API_BASE}/register`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password, firstName, lastName, age }),
  })

  if (!res.ok) {
    const message = await res.text().catch(() => 'Failed to register user')
    return NextResponse.json({ ok: false, message }, { status: 400 })
  }

  return NextResponse.json({ ok: true })
}
