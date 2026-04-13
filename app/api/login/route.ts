import { cookies } from 'next/headers'
import { NextRequest, NextResponse } from 'next/server'
import { API_BASE } from '@/lib/api'

function extractToken(raw: string): string {
  try {
    const parsed = JSON.parse(raw)
    if (typeof parsed === 'string') return parsed
    if (typeof parsed?.token === 'string') return parsed.token
    if (typeof parsed?.Token === 'string') return parsed.Token
    if (typeof parsed?.accessToken === 'string') return parsed.accessToken
    if (typeof parsed?.AccessToken === 'string') return parsed.AccessToken
  } catch {}

  return raw
}

export async function POST(req: NextRequest) {
  console.log('[login] received POST request')

  const { email, password } = await req.json()
  console.log('[login] parsed body - email:', email, '| password length:', password?.length ?? 0)

  const attempts: Array<{ label: string; run: () => Promise<Response> }> = [
    {
      label: 'POST /login with camelCase body',
      run: () =>
        fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        }),
    },
    {
      label: 'POST /login with PascalCase body',
      run: () =>
        fetch(`${API_BASE}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ Email: email, Password: password }),
        }),
    },
    {
      label: 'POST /login/{email}?password=...',
      run: () =>
        fetch(
          `${API_BASE}/login/${encodeURIComponent(email)}?password=${encodeURIComponent(password)}`,
          { method: 'POST' }
        ),
    },
    {
      label: 'GET /login/{email}?password=...',
      run: () =>
        fetch(
          `${API_BASE}/login/${encodeURIComponent(email)}?password=${encodeURIComponent(password)}`
        ),
    },
  ]

  let res: Response | null = null

  for (const attempt of attempts) {
    console.log('[login] trying backend variant:', attempt.label)
    const candidate = await attempt.run()
    console.log('[login] backend response status:', candidate.status, candidate.statusText)
    if (candidate.ok) {
      res = candidate
      break
    }
  }

  if (!res) {
    console.log('[login] backend rejected credentials, returning 401')
    return NextResponse.json({ ok: false }, { status: 401 })
  }

  const raw = await res.text()
  const token = extractToken(raw)
  console.log('[login] received token, length:', token?.length ?? 0)

  if (!token) {
    return NextResponse.json({ ok: false }, { status: 502 })
  }

  const cookieStore = await cookies()
  const hadExistingToken = cookieStore.has('token')
  console.log('[login] existing token cookie present:', hadExistingToken)

  cookieStore.set('token', token, { httpOnly: true, sameSite: 'lax', path: '/' })
  console.log('[login] token cookie set, returning ok')

  return NextResponse.json({ ok: true })
}
