'use client'

import { ArrowLeft } from 'lucide-react'
import type { ReactNode } from 'react'
import GalleryPageHeader, { GalleryNavLink } from './GalleryPageHeader'

interface SessionsPageLayoutProps {
  title: string
  subtitle?: string
  children: ReactNode
}

export default function SessionsPageLayout({
  title,
  subtitle,
  children,
}: SessionsPageLayoutProps) {
  return (
    <div className="min-h-screen bg-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <GalleryPageHeader
          title={title}
          subtitle={subtitle}
          left={
            <GalleryNavLink
              href="/gallery"
              icon={<ArrowLeft className="h-4 w-4" />}
              label="Portfolio"
            />
          }
        />
        {children}
      </div>
    </div>
  )
}
