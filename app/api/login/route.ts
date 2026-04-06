import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { API_BASE } from '@/lib/api'

export async function POST(req: NextRequest) {
  console.log('[login] received POST request')

  const { email, password } = await req.json()
  console.log('[login] parsed body — email:', email, '| password length:', password?.length ?? 0)

  const backendUrl = `${API_BASE}/login/${encodeURIComponent(email)}?password=${encodeURIComponent(password)}`
  console.log('[login] calling backend:', backendUrl.replace(/password=[^&]+/, 'password=***'))

  const res = await fetch(backendUrl)
  console.log('[login] backend response status:', res.status, res.statusText)

  if (!res.ok) {
    console.log('[login] backend rejected credentials, returning 401')
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const token = await res.json() as string
  console.log('[login] received token, length:', token?.length ?? 0)

  const cookieStore = await cookies()
  const hadExistingToken = cookieStore.has('token')
  console.log('[login] existing token cookie present:', hadExistingToken)

  cookieStore.set('token', token, { httpOnly: true, sameSite: 'lax', path: '/' })
  console.log('[login] token cookie set, returning ok')

  return NextResponse.json({ ok: true })
}