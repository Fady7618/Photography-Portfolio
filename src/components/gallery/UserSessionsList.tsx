'use client'

import { useState, useEffect } from 'react'
import { ClientSession } from '@/types'
import { formatDateShort } from '@/utils/formatters'

interface UserSessionsListProps {
  onSessionSelect: (session: ClientSession) => void
}

export default function UserSessionsList({ onSessionSelect }: UserSessionsListProps) {
  const [sessions, setSessions] = useState<ClientSession[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true

    ;(async () => {
      const res = await fetch('/api/user-sessions')
      if (!active) return
      if (res.ok) {
        const data = await res.json()
        setSessions(data.sessions)
      }
      setLoading(false)
    })()

    return () => {
      active = false
    }
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-800 mx-auto mb-4"></div>
          <p className="text-orange-700">Loading your sessions...</p>
        </div>
      </div>
    )
  }

  if (sessions.length === 0) {
    return (
      <div className="min-h-screen bg-orange-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-orange-800 mb-4 plasterFont">
            No Sessions Yet
          </h2>
          <p className="text-orange-700">
            You don&apos;t have any photo sessions yet. Once the photographer uploads your photos, they will appear here.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {sessions.map((session) => (
        <button
          key={session.id}
          type="button"
          onClick={() => onSessionSelect(session)}
          className="bg-white rounded-lg shadow-md hover:shadow-xl transition-shadow p-6 text-left"
        >
          <h3 className="text-xl font-semibold text-orange-800 mb-4">{session.client_name}</h3>
          <p className="text-sm text-orange-600 mb-2">
            Created: {formatDateShort(session.created_at)}
          </p>
          <p className="text-sm text-orange-500">Click to view photos</p>
        </button>
      ))}
    </div>
  )
}
