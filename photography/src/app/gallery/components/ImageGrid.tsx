import React from 'react';
import LazyImage from './LazyImage';
import ImageSkeleton from './ImageSkeleton';
import { Image } from '../../../types/image';

interface ImageGridProps {
  images: Image[];
  isLoading: boolean;
  onImageClick: (image: Image) => void;
}

const ImageGrid: React.FC<ImageGridProps> = ({ images, isLoading, onImageClick }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
      {isLoading ? (
        Array.from({ length: 8 }).map((_, index) => <ImageSkeleton key={index} />)
      ) : (
        images.map((image) => (
          <div key={image.id} className="cursor-pointer" onClick={() => onImageClick(image)}>
            <LazyImage src={image.url} alt={image.title} />
          </div>
        ))
      )}
    </div>
  );
};

export default ImageGrid;