'use client'

import { useEffect, useCallback } from 'react'
import Image from 'next/image'
import { X, ChevronLeft, ChevronRight } from 'lucide-react'
import type { PortfolioImage } from '@/data/portfolio'

interface ImageModalProps {
  images: PortfolioImage[]
  currentIndex: number
  onClose: () => void
  onNavigate: (index: number) => void
}

export default function ImageModal({
  images,
  currentIndex,
  onClose,
  onNavigate,
}: ImageModalProps) {
  const image = images[currentIndex]
  const hasPrev = currentIndex > 0
  const hasNext = currentIndex < images.length - 1

  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
      if (e.key === 'ArrowLeft' && hasPrev) onNavigate(currentIndex - 1)
      if (e.key === 'ArrowRight' && hasNext) onNavigate(currentIndex + 1)
    },
    [onClose, onNavigate, currentIndex, hasPrev, hasNext]
  )

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [handleKeyDown])

  if (!image) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={image.title}
    >
      <button
        type="button"
        onClick={onClose}
        className="absolute top-4 right-4 text-white hover:text-orange-200 transition-colors z-10"
        aria-label="Close"
      >
        <X className="h-8 w-8" />
      </button>

      {hasPrev && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(currentIndex - 1)
          }}
          className="absolute left-4 text-white hover:text-orange-200 transition-colors z-10"
          aria-label="Previous image"
        >
          <ChevronLeft className="h-10 w-10" />
        </button>
      )}

      {hasNext && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation()
            onNavigate(currentIndex + 1)
          }}
          className="absolute right-4 text-white hover:text-orange-200 transition-colors z-10"
          aria-label="Next image"
        >
          <ChevronRight className="h-10 w-10" />
        </button>
      )}

      <div
        className="relative max-w-5xl max-h-[85vh] w-full aspect-[4/3]"
        onClick={(e) => e.stopPropagation()}
      >
        <Image
          src={image.src}
          alt={image.title}
          fill
          unoptimized
          className="object-contain"
          sizes="100vw"
          priority
        />
        <p className="absolute bottom-0 left-0 right-0 text-center text-white py-4 bg-gradient-to-t from-black/80 to-transparent">
          {image.title}
        </p>
      </div>
    </div>
  )
}
