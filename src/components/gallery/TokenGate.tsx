'use client'

import { useState } from 'react'

interface TokenGateProps {
  onTokenSubmit: (token: string) => void
  error: string | null
}

export default function TokenGate({ onTokenSubmit, error }: TokenGateProps) {
  const [token, setToken] = useState('')

  return (
    <div className="min-h-screen bg-orange-50 flex items-center justify-center px-4 py-12">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8">
        <div className="text-center mb-6">
          <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-orange-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-orange-800 mb-2 plasterFont">Access Your Photos</h2>
          <p className="text-orange-700">Enter the access code provided by your photographer</p>
        </div>
        
        <div className="space-y-4">
          <input
            type="text"
            placeholder="Enter your access code"
            value={token}
            onChange={(e) => setToken(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && token.trim() && onTokenSubmit(token.trim())}
            className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
          
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <p className="text-red-600 text-sm">{error}</p>
            </div>
          )}
          
          <button 
            onClick={() => onTokenSubmit(token.trim())} 
            disabled={!token.trim()}
            className="w-full bg-orange-800 hover:bg-orange-900 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            View My Photos
          </button>
        </div>
      </div>
    </div>
  )
}
