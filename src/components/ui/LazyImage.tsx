'use client'

import { useState } from 'react'
import Image from 'next/image'
import ImageSkeleton from './ImageSkeleton'

interface LazyImageProps {
  src: string
  alt: string
  onClick?: () => void
  className?: string
}

export default function LazyImage({ src, alt, onClick, className = '' }: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleImageLoad = () => {
    setIsLoading(false)
  }

  const handleImageError = () => {
    setIsLoading(false)
    setHasError(true)
  }

  if (hasError) {
    return (
      <div className={`bg-red-100 border-2 border-red-300 flex items-center justify-center aspect-[4/3] rounded-lg ${className}`}>
        <div className="text-red-600 text-center p-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-sm font-bold">Failed to load image</p>
          <p className="text-xs mt-1">{alt}</p>
        </div>
      </div>
    )
  }

  return (
    <div 
      className={`relative overflow-hidden cursor-pointer group aspect-[4/3] rounded-lg ${className}`}
      onClick={onClick}
    >
      {isLoading && (
        <div className="absolute inset-0">
          <ImageSkeleton />
        </div>
      )}

      <Image
        src={src}
        alt={alt}
        fill
        className={`
          object-cover transition-all duration-300
          group-hover:scale-105
          ${isLoading ? 'opacity-0' : 'opacity-100'}
        `}
        onLoad={handleImageLoad}
        onError={handleImageError}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
      />

      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all duration-300" />
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white font-semibold text-sm">{alt}</h3>
      </div>
    </div>
  )
}
