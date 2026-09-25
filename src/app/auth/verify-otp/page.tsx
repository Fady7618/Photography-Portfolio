'use client'

import { useState, useEffect, useRef, useSyncExternalStore } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase'

function subscribeNoop() {
  return () => {}
}

function getPendingEmail(): string | null {
  return sessionStorage.getItem('pending_verification_email')
}

export default function VerifyOTPPage() {
  const router = useRouter()
  const email = useSyncExternalStore(subscribeNoop, getPendingEmail, () => null)
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [resending, setResending] = useState(false)
  const [resent, setResent] = useState(false)
  const inputRefs = useRef<(HTMLInputElement | null)[]>([])
  const supabase = createClient()

  useEffect(() => {
    if (!email) {
      router.push('/auth/register')
    }
  }, [email, router])

  function handleDigitChange(index: number, value: string) {
    if (!/^\d*$/.test(value)) return

    const newOtp = [...otp]
    newOtp[index] = value.slice(-1)
    setOtp(newOtp)

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }
  }

  function handleKeyDown(index: number, e: React.KeyboardEvent) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  function handlePaste(e: React.ClipboardEvent) {
    e.preventDefault()
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6)
    if (pasted.length === 6) {
      setOtp(pasted.split(''))
      inputRefs.current[5]?.focus()
    }
  }

  async function handleVerify() {
    if (!email) return

    const token = otp.join('')
    if (token.length !== 6) {
      setError('Please enter all 6 digits')
      return
    }

    setLoading(true)
    setError(null)

    const { error: verifyError } = await supabase.auth.verifyOtp({
      email,
      token,
      type: 'signup',
    })

    if (verifyError) {
      setError('Invalid or expired code. Please try again or request a new code.')
      setLoading(false)
      return
    }

    sessionStorage.removeItem('pending_verification_email')
    router.push('/')
  }

  async function handleResend() {
    if (!email) return

    setResending(true)
    setError(null)

    const { error: resendError } = await supabase.auth.resend({
      type: 'signup',
      email,
    })

    setResending(false)

    if (resendError) {
      setError('Could not resend code. Please try again.')
      return
    }

    setResent(true)
    setTimeout(() => setResent(false), 30000)
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-orange-100 flex items-center justify-center px-4 py-12">
        <p className="text-orange-700">Redirecting...</p>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-800 mb-2 plasterFont">
            Verify Your Email
          </h1>
          <p className="text-orange-700">We sent a 6-digit code to</p>
          <p className="text-orange-800 font-semibold mt-1">{email}</p>
        </div>

        <div className="flex gap-3 justify-center mb-6" onPaste={handlePaste}>
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleDigitChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className="w-12 h-14 text-center text-2xl font-bold border-2 border-orange-200 rounded-lg focus:border-orange-500 focus:outline-none text-orange-800"
              aria-label={`Digit ${index + 1}`}
            />
          ))}
        </div>

        {error && (
          <p className="text-red-600 text-sm text-center mb-4">{error}</p>
        )}

        {resent && (
          <p className="text-green-600 text-sm text-center mb-4">
            A new code has been sent to your email.
          </p>
        )}

        <button
          onClick={handleVerify}
          disabled={loading || otp.join('').length !== 6}
          className="w-full bg-orange-700 text-white py-3 rounded-lg font-semibold hover:bg-orange-800 transition disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Verifying...' : 'Verify Email'}
        </button>

        <div className="mt-6 text-center">
          <p className="text-orange-700 text-sm">
            Didn&apos;t receive the code?{' '}
            <button
              onClick={handleResend}
              disabled={resending || resent}
              className="text-orange-800 font-semibold hover:underline disabled:opacity-50"
            >
              {resending ? 'Sending...' : resent ? 'Code sent!' : 'Resend code'}
            </button>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/auth/register" className="text-orange-600 text-sm hover:underline">
            Back to registration
          </Link>
        </div>
      </div>
    </div>
  )
}
