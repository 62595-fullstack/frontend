'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function Login() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    console.log('[Login] form submitted — email:', email, '| password length:', password.length)

    try {
      console.log('[Login] sending POST /api/login')
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      console.log('[Login] response status:', res.status, res.statusText)

      if (res.ok) {
        console.log('[Login] login successful, redirecting to /')
        router.push('/')
      } else {
        console.log('[Login] login failed, showing error')
        setError('Invalid email or password.')
      }
    } catch (err) {
      console.error('[Login] fetch error:', err)
      setError('Could not reach the server. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="page justify-center p-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold tracking-tight text-text">BookFace</h1>
        </div>

        <div className="popup-brand">
          <p className="mb-6 text-md text-text text-center">Sign in to your account</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">
                Email
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                placeholder="you@example.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-text">
                  Password
                </label>
                <a href="#" className="text-xs text-gray-500 hover:text-gray-900 transition">
                  {/*Forgot password?*/}
                </a>
              </div>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>

            {error && (
              <p className="text-danger text-sm">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-brand mt-2 w-full font-semibold disabled:opacity-50"
            >
              {loading ? 'Signing in…' : 'Sign in'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-text-muted">
          Don&apos;t have an account?{' '}
          <a href="/signup" className="font-medium text-text hover:underline">
            Sign up
          </a>
        </p>
      </div>
    </div>
  );
}
