'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GalleryImage } from '@/app/types/image';

interface LazyImageProps {
  image: GalleryImage;
  onClick: (image: GalleryImage) => void;
  className?: string;
}

export default function LazyImage({ image, onClick, className = '' }: LazyImageProps) {
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const handleImageLoad = () => {
    setIsLoading(false);
    console.log('✅ Image loaded successfully:', image.title, image.imageUrl);
  };

  const handleImageError = (error: any) => {
    setIsLoading(false);
    setHasError(true);
    console.error('❌ Failed to load image:', image.title);
    console.error('URL:', image.imageUrl);
    console.error('Error:', error);
  };

  // Log every image URL for debugging
  console.log(`🖼️ Attempting to load: ${image.title}`, image.imageUrl);

  if (hasError) {
    return (
      <div className={`bg-red-100 border-2 border-red-300 flex items-center justify-center aspect-[4/3] ${className}`}>
        <div className="text-red-600 text-center p-4">
          <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.464 0L4.35 16.5c-.77.833.192 2.5 1.732 2.5z" />
          </svg>
          <p className="text-sm font-bold">IMAGE FAILED</p>
          <p className="text-xs mt-1">{image.title}</p>
          <p className="text-xs mt-1 break-all">{image.imageUrl}</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`relative overflow-hidden cursor-pointer group aspect-[4/3] border-2 border-blue-300 ${className}`}
      onClick={() => onClick(image)}
    >
      {/* Loading skeleton */}
      {isLoading && (
        <div className="absolute inset-0 bg-yellow-200 animate-pulse flex items-center justify-center">
          <div className="text-yellow-800 text-center">
            <svg className="w-8 h-8 animate-spin mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
            <p className="text-xs mt-2">Loading...</p>
            <p className="text-xs">{image.title}</p>
          </div>
        </div>
      )}

      {/* Image - using original URL without any transformations */}
      <Image
        src={image.imageUrl}
        alt={image.title}
        fill
        className={`
          object-cover transition-all duration-300
          group-hover:scale-105
          ${isLoading ? 'opacity-0' : 'opacity-100'}
        `}
        onLoad={handleImageLoad}
        onError={handleImageError}
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        unoptimized // Disable Next.js optimization to test raw URLs
      />

      {/* Simple overlay on hover */}
      <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-30 transition-all duration-300" />
      
      {/* Image title overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300">
        <h3 className="text-white font-semibold text-sm">{image.title}</h3>
      </div>
    </div>
  );
}