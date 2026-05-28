'use client'

import { useEffect, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import PortfolioGrid from '@/components/gallery/PortfolioGrid'
import { useAuth } from '@/hooks/useAuth'

function GalleryContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const urlToken = searchParams.get('token')

  useEffect(() => {
    if (urlToken) {
      router.replace(`/gallery/sessions?token=${encodeURIComponent(urlToken)}`)
    }
  }, [urlToken, router])

  if (urlToken) {
    return (
      <div className="min-h-screen bg-orange-100 flex items-center justify-center">
        <p className="text-orange-700">Redirecting...</p>
      </div>
    )
  }

  return <GalleryPageBody />
}

function GalleryPageBody() {
  const { isAuthenticated, isAdmin, loading } = useAuth()
  const showSessionsLink = !loading && isAuthenticated && !isAdmin

  return <PortfolioGrid showSessionsLink={showSessionsLink} />
}

export default function GalleryPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-orange-100 flex items-center justify-center">
          <p className="text-orange-700">Loading...</p>
        </div>
      }
    >
      <GalleryContent />
    </Suspense>
  )
}
