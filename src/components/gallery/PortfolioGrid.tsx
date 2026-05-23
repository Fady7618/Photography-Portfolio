'use client'

import { useState } from 'react'
import { portfolioImages } from '@/data/portfolio'
import LazyImage from '@/components/ui/LazyImage'

type Category = 'all' | 'wedding' | 'portrait' | 'event'

export default function PortfolioGrid() {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')

  const filteredImages = selectedCategory === 'all'
    ? portfolioImages
    : portfolioImages.filter(img => img.category === selectedCategory)

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'wedding', label: 'Weddings' },
    { id: 'portrait', label: 'Portraits' },
    { id: 'event', label: 'Events' },
  ]

  return (
    <div className="min-h-screen bg-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-800 mb-4 plasterFont">
            Our Portfolio
          </h1>
          <p className="text-lg text-orange-700 max-w-2xl mx-auto">
            Capturing your most precious moments with creativity and passion
          </p>
        </div>

        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {categories.map(category => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-2 rounded-full font-medium transition-all duration-300 ${
                selectedCategory === category.id
                  ? 'bg-orange-800 text-white shadow-lg'
                  : 'bg-white text-orange-800 hover:bg-orange-100 border border-orange-200'
              }`}
            >
              {category.label}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredImages.map(image => (
            <LazyImage
              key={image.id}
              src={image.src}
              alt={image.title}
              className="shadow-lg hover:shadow-xl transition-shadow duration-300"
            />
          ))}
        </div>

        {filteredImages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-orange-600 text-lg">No images found in this category</p>
          </div>
        )}
      </div>
    </div>
  )
}
