'use client'

import { useState } from 'react'
import { Images } from 'lucide-react'
import { portfolioImages } from '@/data/portfolio'
import type { PortfolioImage } from '@/data/portfolio'
import LazyImage from '@/components/ui/LazyImage'
import ImageModal from './ImageModal'
import GalleryPageHeader, { GalleryNavLink } from './GalleryPageHeader'

type Category = 'all' | 'wedding' | 'portrait' | 'event'

interface PortfolioGridProps {
  showSessionsLink?: boolean
}

export default function PortfolioGrid({ showSessionsLink = false }: PortfolioGridProps) {
  const [selectedCategory, setSelectedCategory] = useState<Category>('all')
  const [modalIndex, setModalIndex] = useState<number | null>(null)

  const filteredImages =
    selectedCategory === 'all'
      ? portfolioImages
      : portfolioImages.filter((img) => img.category === selectedCategory)

  const categories: { id: Category; label: string }[] = [
    { id: 'all', label: 'All' },
    { id: 'wedding', label: 'Weddings' },
    { id: 'portrait', label: 'Portraits' },
    { id: 'event', label: 'Events' },
  ]

  function openModal(image: PortfolioImage) {
    const index = filteredImages.findIndex((img) => img.id === image.id)
    if (index >= 0) setModalIndex(index)
  }

  return (
    <div className="min-h-screen bg-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <GalleryPageHeader
          title="Our Portfolio"
          subtitle="Capturing your most precious moments with creativity and passion"
          right={
            showSessionsLink ? (
              <GalleryNavLink
                href="/gallery/sessions"
                icon={<Images className="h-4 w-4" />}
                label="My Sessions"
              />
            ) : undefined
          }
        />

        <div className="flex justify-center gap-2 mb-8 flex-wrap">
          {categories.map((category) => (
            <button
              key={category.id}
              type="button"
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
          {filteredImages.map((image) => (
            <LazyImage
              key={image.id}
              src={image.src}
              alt={image.title}
              onClick={() => openModal(image)}
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

      {modalIndex !== null && (
        <ImageModal
          images={filteredImages}
          currentIndex={modalIndex}
          onClose={() => setModalIndex(null)}
          onNavigate={setModalIndex}
        />
      )}
    </div>
  )
}
