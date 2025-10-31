// filepath: c:\Users\Alfred\Desktop\PhotographyNext\photography\src\app\components\Images.tsx
import React, { useState, useEffect } from 'react';
import ImageGrid from '../gallery/components/ImageGrid';
import ImageModal from '../gallery/components/ImageModal';
import ImageSkeleton from '../gallery/components/ImageSkeleton';
import Pagination from '../gallery/components/Pagination';
import { fetchImages } from '../lib/imageService';
import { Image } from '../types/image';

const Images = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      const { images: fetchedImages, total } = await fetchImages(currentPage);
      setImages(fetchedImages);
      setTotalPages(Math.ceil(total / 10)); // Assuming 10 images per page
      setLoading(false);
    };

    loadImages();
  }, [currentPage]);

  const handleImageClick = (image: Image) => {
    setSelectedImage(image);
  };

  const handleCloseModal = () => {
    setSelectedImage(null);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div>
      {loading ? (
        <ImageSkeleton />
      ) : (
        <>
          <ImageGrid images={images} onImageClick={handleImageClick} />
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
        </>
      )}
      {selectedImage && <ImageModal image={selectedImage} onClose={handleCloseModal} />}
    </div>
  );
};

export default Images;