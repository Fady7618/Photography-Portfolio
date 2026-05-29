import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
        <h1 className="text-6xl font-bold text-orange-800 mb-2 plasterFont">404</h1>
        <h2 className="text-2xl font-semibold text-orange-800 mb-4">Page Not Found</h2>
        <p className="text-orange-700 mb-6">
          The page you are looking for does not exist or may have been moved.
        </p>
        <Link
          href="/"
          className="inline-block bg-orange-800 hover:bg-orange-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
        >
          Back to Home
        </Link>
      </div>
    </div>
  )
}
