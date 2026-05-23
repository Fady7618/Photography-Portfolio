import Link from 'next/link'
import AuthForm from '@/components/auth/AuthForm'

export default function LoginPage() {
  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-orange-800 mb-2 plasterFont">
            Welcome Back
          </h1>
          <p className="text-orange-700">Sign in to your account</p>
        </div>

        <AuthForm mode="login" />

        <div className="mt-6 text-center">
          <p className="text-orange-700">
            Don&apos;t have an account?{' '}
            <Link href="/auth/register" className="text-orange-800 font-semibold hover:underline">
              Sign up
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
