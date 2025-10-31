'use client';

import { useState } from 'react';
import { GalleryImage } from '@/app/types/image';
import LazyImage from './LazyImage';
import ImageModal from './ImageModal';
import ImageSkeleton from './ImageSkeleton';

interface ImageGridProps {
  images: GalleryImage[];
  loading?: boolean;
}

export default function ImageGrid({ images, loading }: ImageGridProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null);

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
  };

  const handleCloseModal = () => {
    setSelectedImageIndex(null);
  };

  const handleNextImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex < images.length - 1) {
      setSelectedImageIndex(selectedImageIndex + 1);
    }
  };

  const handlePreviousImage = () => {
    if (selectedImageIndex !== null && selectedImageIndex > 0) {
      setSelectedImageIndex(selectedImageIndex - 1);
    }
  };

  // Handle keyboard navigation
  const handleKeyDown = (e: KeyboardEvent) => {
    if (selectedImageIndex === null) return;
    
    switch (e.key) {
      case 'Escape':
        handleCloseModal();
        break;
      case 'ArrowRight':
        handleNextImage();
        break;
      case 'ArrowLeft':
        handlePreviousImage();
        break;
    }
  };

  // Add keyboard event listener when modal is open
  useState(() => {
    if (selectedImageIndex !== null) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  });

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {loading ? (
          // Show skeleton loading
          Array.from({ length: 20 }).map((_, index) => (
            <ImageSkeleton key={index} />
          ))
        ) : (
          // Show actual images
          images.map((image, index) => (
            <LazyImage
              key={image.id}
              image={image}
              onClick={() => handleImageClick(index)}
              className="h-full"
            />
          ))
        )}
      </div>

      {/* Image Modal */}
      {selectedImageIndex !== null && (
        <ImageModal
          image={images[selectedImageIndex]}
          isOpen={true}
          onClose={handleCloseModal}
          onNext={selectedImageIndex < images.length - 1 ? handleNextImage : undefined}
          onPrevious={selectedImageIndex > 0 ? handlePreviousImage : undefined}
        />
      )}
    </>
  );
}