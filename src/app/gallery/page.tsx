'use client'

import { useState, useEffect, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import { TokenGate, GalleryGrid } from '@/components/gallery'
import PortfolioGrid from '@/components/gallery/PortfolioGrid'
import UserSessionsList from '@/components/gallery/UserSessionsList'
import { SessionFile, ClientSession } from '@/types'
import { useAuth } from '@/hooks/useAuth'

function GalleryContent() {
  const searchParams = useSearchParams()
  const urlToken = searchParams.get('token')
  const { user, loading: authLoading } = useAuth()

  const [token, setToken] = useState<string | null>(urlToken)
  const [files, setFiles] = useState<SessionFile[]>([])
  const [clientName, setClientName] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [authenticated, setAuthenticated] = useState(false)
  const [selectedSession, setSelectedSession] = useState<ClientSession | null>(null)

  async function fetchGallery(t: string) {
    setLoading(true)
    setError(null)

    const res = await fetch(`/api/gallery?token=${encodeURIComponent(t)}`)
    const data = await res.json()

    if (!res.ok) {
      setError(data.error || 'Invalid token')
      setLoading(false)
      return
    }

    setFiles(data.files)
    setClientName(data.session.client_name)
    setAuthenticated(true)
    setLoading(false)
  }

  useEffect(() => {
    if (urlToken) fetchGallery(urlToken)
  }, [urlToken])

  async function handleSessionSelect(session: ClientSession) {
    setSelectedSession(session)
    fetchGallery(session.access_token)
  }

  function handleTokenSubmit(t: string) {
    setToken(t)
    fetchGallery(t)
  }

  if (authLoading) {
    return (
      <div className="min-h-screen bg-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-800 mx-auto mb-4"></div>
          <p className="text-orange-700">Loading...</p>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-800 mx-auto mb-4"></div>
          <p className="text-orange-700">Loading your gallery...</p>
        </div>
      </div>
    )
  }

  if (urlToken) {
    if (!authenticated) {
      return <TokenGate onTokenSubmit={handleTokenSubmit} error={error} />
    }
    return <GalleryGrid files={files} clientName={clientName} />
  }

  if (user && !urlToken) {
    if (selectedSession) {
      return <GalleryGrid files={files} clientName={clientName} />
    }
    return <UserSessionsList onSessionSelect={handleSessionSelect} />
  }

  return <PortfolioGrid />
}

export default function GalleryPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-orange-100 flex items-center justify-center">
        <p className="text-orange-700">Loading...</p>
      </div>
    }>
      <GalleryContent />
    </Suspense>
  )
}
