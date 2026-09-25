'use client'

import { useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'
import { isValidEmail } from '@/lib/validators'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const supabase = createClient()

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    if (!isValidEmail(email)) {
      setError('Please enter a valid email address.')
      return
    }

    setLoading(true)
    setError(null)

    const { error: resetError } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/callback?type=recovery`,
    })

    setLoading(false)

    if (resetError) {
      setError('Something went wrong. Please try again.')
      return
    }

    // Always show "sent" even if email doesn't exist — prevents email enumeration
    setSent(true)
  }

  if (sent) {
    return (
      <div className="min-h-screen bg-orange-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="text-5xl mb-4">📧</div>
          <h1 className="text-2xl font-bold text-orange-800 mb-2 plasterFont">
            Check Your Email
          </h1>
          <p className="text-orange-700 mb-6">
            If an account exists for <strong>{email}</strong>, you&apos;ll receive
            a password reset link within a few minutes.
          </p>
          <Link
            href="/auth/login"
            className="text-orange-800 font-semibold hover:underline"
          >
            Back to sign in
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-800 mb-2 plasterFont">
            Forgot Password?
          </h1>
          <p className="text-orange-700">
            Enter your email and we&apos;ll send you a reset link.
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-orange-800 font-medium mb-2"
            >
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
              autoComplete="email"
              className="w-full border border-orange-200 rounded-lg px-4 py-3 focus:border-orange-500 focus:outline-none text-orange-900 placeholder-orange-300"
            />
          </div>

          {error && (
            <p className="text-red-600 text-sm mb-4">{error}</p>
          )}

          <button
            type="submit"
            disabled={loading || !email.trim()}
            className="w-full bg-orange-700 text-white py-3 rounded-lg font-semibold hover:bg-orange-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>
        </form>

        <div className="mt-6 text-center">
          <Link href="/auth/login" className="text-orange-600 text-sm hover:underline">
            Back to sign in
          </Link>
        </div>
      </div>
    </div>
  )
}
