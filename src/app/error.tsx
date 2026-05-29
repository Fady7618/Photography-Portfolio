'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('[App Error]', error)
  }, [error])

  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-orange-800 mb-4 plasterFont">Something Went Wrong</h2>
        <p className="text-orange-700 mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <button
          type="button"
          onClick={reset}
          className="bg-orange-800 hover:bg-orange-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
        >
          Try Again
        </button>
      </div>
    </div>
  )
}
