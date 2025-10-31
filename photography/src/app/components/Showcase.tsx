import React, { useState, useEffect } from 'react';
import ImageGrid from '../gallery/components/ImageGrid';
import Pagination from '../gallery/components/Pagination';
import ImageSkeleton from '../gallery/components/ImageSkeleton';
import { fetchImages } from '../lib/imageService';
import { Image } from '../types/image';

const Showcase = () => {
  const [images, setImages] = useState<Image[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    const loadImages = async () => {
      setLoading(true);
      const { images: fetchedImages, total } = await fetchImages(currentPage);
      setImages(fetchedImages);
      setTotalPages(total);
      setLoading(false);
    };

    loadImages();
  }, [currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  return (
    <div className="p-4">
      <h1 className="text-4xl font-bold text-center mb-6">Featured Wedding Photos</h1>
      {loading ? (
        <ImageSkeleton />
      ) : (
        <ImageGrid images={images} />
      )}
      <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default Showcase;