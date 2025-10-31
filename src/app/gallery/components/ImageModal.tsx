'use client';

import { useState } from 'react';
import Image from 'next/image';
import { GalleryImage } from '@/app/types/image';

interface ImageModalProps {
  image: GalleryImage;
  isOpen: boolean;
  onClose: () => void;
  onNext?: () => void;
  onPrevious?: () => void;
}

export default function ImageModal({ image, isOpen, onClose, onNext, onPrevious }: ImageModalProps) {
  if (!isOpen) return null;

  // Get high resolution URL for modal
  const getHighResUrl = (imageUrl: string) => {
    if (imageUrl.includes('cloudinary.com')) {
      return imageUrl.replace('/upload/', '/upload/c_fit,w_800,h_600,q_auto,f_auto/');
    }
    return imageUrl;
  };

  return (
    <div 
      className="fixed inset-0 z-50 bg-black bg-opacity-90 flex items-center justify-center p-4"
      onClick={onClose} // Close when clicking backdrop
    >
      <div 
        className="relative max-w-5xl max-h-[90vh] w-full bg-white rounded-lg overflow-hidden"
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking modal content
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Navigation buttons */}
        {onPrevious && (
          <button
            onClick={onPrevious}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
        )}

        {onNext && (
          <button
            onClick={onNext}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-black bg-opacity-50 text-white rounded-full p-2 hover:bg-opacity-70 transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </button>
        )}

        <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
          {/* Image Container */}
          <div className="flex-1 relative bg-gray-100">
            <div className="relative h-64 sm:h-80 lg:h-[70vh] w-full">
              <Image
                src={getHighResUrl(image.imageUrl)}
                alt={image.title}
                fill
                className="object-contain"
                priority
                sizes="(max-width: 1024px) 100vw, 70vw"
              />
            </div>
          </div>

          {/* Image Info Sidebar */}
          <div className="w-full lg:w-80 bg-white p-6 overflow-y-auto">
            <h2 className="text-xl lg:text-2xl font-bold text-gray-900 mb-3">{image.title}</h2>
            
            {image.description && (
              <p className="text-gray-600 mb-4 text-sm lg:text-base">{image.description}</p>
            )}
            
            {/* Metadata */}
            <div className="space-y-2 text-sm text-gray-500 mb-4">
              <div className="flex justify-between">
                <span className="font-medium">Category:</span>
                <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs">
                  {image.category}
                </span>
              </div>
              
              <div className="flex justify-between">
                <span className="font-medium">Created:</span>
                <span>{new Date(image.createdAt).toLocaleDateString()}</span>
              </div>
              
              {image.featured && (
                <div className="flex justify-between">
                  <span className="font-medium">Status:</span>
                  <span className="flex items-center text-yellow-600 text-xs">
                    <svg className="w-3 h-3 mr-1" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                    Featured
                  </span>
                </div>
              )}
            </div>

            {/* Tags */}
            {image.tags && image.tags.length > 0 && (
              <div className="mb-4">
                <span className="font-medium text-sm text-gray-700 block mb-2">Tags:</span>
                <div className="flex flex-wrap gap-1">
                  {image.tags.map((tag, index) => (
                    <span 
                      key={index}
                      className="inline-block bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Download Button */}
            <button className="w-full bg-orange-600 hover:bg-orange-700 text-white py-2 px-4 rounded-lg transition-colors text-sm font-medium">
              Download Image
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}