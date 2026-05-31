'use client'

import Link from 'next/link'
import type { ReactNode } from 'react'

export const galleryNavButtonClass =
  'inline-flex items-center gap-2 bg-orange-800 hover:bg-orange-900 text-white px-4 py-2 rounded-lg font-medium transition-colors shrink-0'

interface GalleryNavLinkProps {
  href: string
  icon: ReactNode
  label: string
}

export function GalleryNavLink({ href, icon, label }: GalleryNavLinkProps) {
  return (
    <Link href={href} className={galleryNavButtonClass}>
      {icon}
      <span>{label}</span>
    </Link>
  )
}

interface GalleryPageHeaderProps {
  title: string
  subtitle?: string
  left?: ReactNode
  right?: ReactNode
}

export default function GalleryPageHeader({
  title,
  subtitle,
  left,
  right,
}: GalleryPageHeaderProps) {
  return (
    <header className="flex items-center justify-between gap-4 mb-12">
      <div className="flex w-[140px] shrink-0 items-center justify-start">
        {left}
      </div>

      <div className="min-w-0 flex-1 text-center px-2">
        <h1 className="text-2xl sm:text-4xl md:text-5xl font-bold text-orange-800 mb-1 plasterFont truncate">
          {title}
        </h1>
        {subtitle && (
          <p className="text-sm sm:text-lg text-orange-700 truncate">{subtitle}</p>
        )}
      </div>

      <div className="flex w-[140px] shrink-0 items-center justify-end">
        {right}
      </div>
    </header>
  )
}
