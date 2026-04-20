'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import RequiredMark from '@/components/ui/RequiredMark'

export default function Signup() {
  const router = useRouter()
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [email, setEmail] = useState('')
  const [dateOfBirth, setDateOfBirth] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.SyntheticEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const res = await fetch('/api/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, firstName, lastName, dateOfBirth }),
      })

      if (res.ok) {
        router.push('/login')
      } else {
        const data = await res.json().catch(() => ({}))
        setError(data.message ?? 'Registration failed. Please try again.')
      }
    } catch {
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
          <p className="mb-6 text-md text-text text-center">Create an account</p>

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="firstName" className="block text-sm font-medium text-text mb-1.5">
                First name <RequiredMark />
              </label>
              <input
                id="firstName"
                type="text"
                autoComplete="given-name"
                placeholder="Your first name"
                value={firstName}
                onChange={e => setFirstName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="lastName" className="block text-sm font-medium text-text mb-1.5">
                Last name <RequiredMark />
              </label>
              <input
                id="lastName"
                type="text"
                autoComplete="family-name"
                placeholder="Your last name"
                value={lastName}
                onChange={e => setLastName(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-text mb-1.5">
                Email <RequiredMark />
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
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-text mb-1.5">
                Date of birth <RequiredMark />
              </label>
              <input
                id="dateOfBirth"
                type="date"
                value={dateOfBirth}
                onChange={e => setDateOfBirth(e.target.value)}
                className="input-field"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-text mb-1.5">
                Password <RequiredMark />
              </label>
              <input
                id="password"
                type="password"
                autoComplete="new-password"
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
              {loading ? 'Creating account…' : 'Sign up'}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-sm text-text-muted">
          Already have an account?{' '}
          <a href="/login" className="font-medium text-text hover:underline">
            Sign in
          </a>
        </p>
      </div>
    </div>
  )
}
