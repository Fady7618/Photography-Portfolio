import { useState, useEffect } from 'react';
import { GalleryImage, PaginationData, GalleryFilters } from '@/app/types/image';

export function useImageLoader(initialFilters: GalleryFilters = {}) {
  const [data, setData] = useState<PaginationData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<GalleryFilters>(initialFilters);

  const fetchImages = async (newFilters: GalleryFilters = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedFilters = { ...filters, ...newFilters };
      const searchParams = new URLSearchParams();
      
      Object.entries(mergedFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          searchParams.append(key, String(value));
        }
      });

      const response = await fetch(`/api/gallery?${searchParams}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch images');
      }
      
      const result = await response.json();
      setData(result);
      setFilters(mergedFilters);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const loadNextPage = () => {
    if (data?.hasNextPage) {
      fetchImages({ page: data.currentPage + 1 });
    }
  };

  const loadPreviousPage = () => {
    if (data?.hasPreviousPage) {
      fetchImages({ page: data.currentPage - 1 });
    }
  };

  const goToPage = (page: number) => {
    fetchImages({ page });
  };

  const applyFilters = (newFilters: GalleryFilters) => {
    fetchImages({ ...newFilters, page: 1 });
  };

  return {
    data,
    loading,
    error,
    filters,
    loadNextPage,
    loadPreviousPage,
    goToPage,
    applyFilters,
    refetch: () => fetchImages(filters),
  };
}