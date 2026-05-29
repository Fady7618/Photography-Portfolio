'use client'

import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { GalleryGrid } from '@/components/gallery'
import UserSessionsList from '@/components/gallery/UserSessionsList'
import SessionsPageLayout from '@/components/gallery/SessionsPageLayout'
import { SessionFile, ClientSession } from '@/types'
import { useAuth } from '@/hooks/useAuth'

function isExpiredError(message: string): boolean {
  return message.toLowerCase().includes('expired')
}

function SessionsContent() {
  const searchParams = useSearchParams()
  const urlToken = searchParams.get('token')
  const { user, loading: authLoading } = useAuth()

  const [files, setFiles] = useState<SessionFile[]>([])
  const [clientName, setClientName] = useState('')
  const [loading, setLoading] = useState(Boolean(urlToken))
  const [error, setError] = useState<string | null>(null)
  const [tokenExpired, setTokenExpired] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [selectedSession, setSelectedSession] = useState<ClientSession | null>(null)

  function handleGalleryError(message: string): void {
    if (isExpiredError(message)) {
      setTokenExpired(true)
      setError(null)
    } else {
      setError(message)
    }
  }

  async function fetchGallery(t: string): Promise<void> {
    setLoading(true)
    setError(null)
    setTokenExpired(false)

    try {
      const res = await fetch(`/api/gallery?token=${encodeURIComponent(t)}`)
      const data = await res.json()

      if (!res.ok) {
        handleGalleryError(data.error || 'Invalid or expired link.')
        return
      }

      setFiles(data.files)
      setClientName(data.session.client_name)
      setAuthenticated(true)
    } catch {
      setError('Something went wrong. Please refresh the page.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (!urlToken) return

    let active = true

    ;(async () => {
      setLoading(true)
      setError(null)
      setTokenExpired(false)

      try {
        const res = await fetch(`/api/gallery?token=${encodeURIComponent(urlToken)}`)
        const data = await res.json()
        if (!active) return

        if (!res.ok) {
          const message = data.error || 'Invalid or expired link.'
          if (isExpiredError(message)) {
            setTokenExpired(true)
            setError(null)
          } else {
            setError(message)
          }
          return
        }

        setFiles(data.files)
        setClientName(data.session.client_name)
        setAuthenticated(true)
      } catch {
        if (!active) return
        setError('Something went wrong. Please refresh the page.')
      } finally {
        if (active) setLoading(false)
      }
    })()

    return () => {
      active = false
    }
  }, [urlToken])

  async function handleSessionSelect(session: ClientSession): Promise<void> {
    setSelectedSession(session)
    await fetchGallery(session.access_token)
  }

  if (tokenExpired) {
    return (
      <div className="min-h-screen bg-orange-100 flex items-center justify-center px-4">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-orange-800 mb-4 plasterFont">This Link Has Expired</h2>
          <p className="text-orange-700 mb-6">
            Session links are valid for 5 days. Please log in to access your photos.
          </p>
          <Link
            href="/auth/login"
            className="inline-block bg-orange-800 hover:bg-orange-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
          >
            Log In
          </Link>
        </div>
      </div>
    )
  }

  if (authLoading && !urlToken) {
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
      return (
        <div className="min-h-screen bg-orange-100 flex items-center justify-center px-4">
          <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
            <h2 className="text-2xl font-bold text-orange-800 mb-4 plasterFont">Unable to Load Gallery</h2>
            <p className="text-red-600 text-sm">{error || 'Invalid session link.'}</p>
          </div>
        </div>
      )
    }
    return (
      <SessionsPageLayout
        title={`Welcome, ${clientName}!`}
        subtitle={`${files.length} file${files.length !== 1 ? 's' : ''} in your session`}
      >
        <GalleryGrid files={files} clientName={clientName} embedded />
      </SessionsPageLayout>
    )
  }

  if (user) {
    if (selectedSession) {
      return (
        <SessionsPageLayout
          title={`Welcome, ${clientName}!`}
          subtitle={`${files.length} file${files.length !== 1 ? 's' : ''} in your session`}
        >
          <GalleryGrid files={files} clientName={clientName} embedded />
        </SessionsPageLayout>
      )
    }
    return (
      <SessionsPageLayout
        title="Your Photo Sessions"
        subtitle="Select a session to view your photos"
      >
        <UserSessionsList onSessionSelect={handleSessionSelect} />
      </SessionsPageLayout>
    )
  }

  return (
    <div className="min-h-screen bg-orange-100 flex items-center justify-center px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
        <h2 className="text-2xl font-bold text-orange-800 mb-4 plasterFont">Sign In Required</h2>
        <p className="text-orange-700 mb-6">Please log in to view your sessions.</p>
        <Link
          href="/auth/login"
          className="inline-block bg-orange-800 hover:bg-orange-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300"
        >
          Log In
        </Link>
      </div>
    </div>
  )
}

export default function GallerySessionsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-orange-100 flex items-center justify-center">
          <p className="text-orange-700">Loading...</p>
        </div>
      }
    >
      <SessionsContent />
    </Suspense>
  )
}
