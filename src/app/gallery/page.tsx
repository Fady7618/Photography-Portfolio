'use client';

import { useState } from 'react';
import { useImageLoader } from '@/app/hooks/useImageLoader';
import ImageGrid from './components/ImageGrid';
import Pagination from './components/Pagination';

const categories = ['all', 'wedding', 'portrait', 'event', 'engagement'];

export default function Gallery() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [showFeaturedOnly, setShowFeaturedOnly] = useState(false);

  const { data, loading, error, applyFilters, goToPage } = useImageLoader({
    category: activeCategory === 'all' ? undefined : activeCategory,
    featured: showFeaturedOnly || undefined,
    limit: 20,
  });

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    applyFilters({
      category: category === 'all' ? undefined : category,
      featured: showFeaturedOnly || undefined,
      limit: 20,
    });
  };

  const handleFeaturedToggle = () => {
    const newFeaturedState = !showFeaturedOnly;
    setShowFeaturedOnly(newFeaturedState);
    applyFilters({
      category: activeCategory === 'all' ? undefined : activeCategory,
      featured: newFeaturedState || undefined,
      limit: 20,
    });
  };

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Error Loading Gallery</h1>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-orange-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-orange-800 mb-4 plasterFont">
            Wedding Gallery
          </h1>
          <p className="text-xl text-orange-700 max-w-2xl mx-auto">
            Explore our collection of beautiful moments captured throughout our photography journey
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8 space-y-4">
          {/* Category Filter */}
          <div className="flex flex-wrap justify-center gap-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  activeCategory === category
                    ? 'bg-orange-600 text-white'
                    : 'bg-white text-orange-600 hover:bg-orange-100 border border-orange-200'
                }`}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </button>
            ))}
          </div>

          {/* Featured Toggle */}
          <div className="flex justify-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={showFeaturedOnly}
                onChange={handleFeaturedToggle}
                className="sr-only"
              />
              <div className={`relative w-10 h-6 rounded-full transition-colors ${
                showFeaturedOnly ? 'bg-orange-600' : 'bg-gray-300'
              }`}>
                <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  showFeaturedOnly ? 'transform translate-x-4' : ''
                }`}></div>
              </div>
              <span className="ml-3 text-sm font-medium text-gray-700">
                Featured photos only
              </span>
            </label>
          </div>
        </div>

        {/* Results count */}
        {data && !loading && (
          <div className="mb-6 text-center text-gray-600">
            Showing {data.images.length} of {data.totalCount} photos
          </div>
        )}

        {/* Image Grid */}
        <ImageGrid 
          images={data?.images || []} 
          loading={loading} 
        />

        {/* Pagination */}
        {data && data.totalPages > 1 && (
          <Pagination
            currentPage={data.currentPage}
            totalPages={data.totalPages}
            onPageChange={goToPage}
            hasNextPage={data.hasNextPage}
            hasPreviousPage={data.hasPreviousPage}
          />
        )}

        {/* Empty state */}
        {data && data.images.length === 0 && !loading && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <svg className="w-24 h-24 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No photos found</h3>
            <p className="text-gray-600">Try adjusting your filters or check back later for new content.</p>
          </div>
        )}
      </div>
    </div>
  );
}