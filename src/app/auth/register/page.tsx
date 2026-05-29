import type { Metadata } from 'next'
import Link from 'next/link'
import AuthForm from '@/components/auth/AuthForm'

export const metadata: Metadata = {
  title: 'Create Account',
  description: 'Create an account to book photography sessions and access your photo galleries.',
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-800 mb-2 plasterFont">
            Create Account
          </h1>
          <p className="text-orange-700">Sign up to book sessions and view your photos</p>
        </div>

        <AuthForm mode="register" />

        <div className="mt-6 text-center">
          <p className="text-orange-700">
            Already have an account?{' '}
            <Link href="/auth/login" className="text-orange-800 font-semibold hover:underline">
              Sign in
            </Link>
          </p>
        </div>

        <div className="mt-4 text-center">
          <Link href="/" className="text-orange-600 text-sm hover:underline">
            Back to home
          </Link>
        </div>
      </div>
    </div>
  )
}
