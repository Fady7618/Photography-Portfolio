'use client'

import { SessionFile } from '@/types'
import FileCard from './FileCard'

interface GalleryGridProps {
  files: SessionFile[]
  clientName: string
}

export default function GalleryGrid({ files, clientName }: GalleryGridProps) {
  const images = files.filter((f) => f.type === 'image')
  const videos = files.filter((f) => f.type === 'video')
  const others = files.filter((f) => f.type === 'other')

  return (
    <div className="min-h-screen bg-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-orange-800 mb-2 plasterFont">
            Welcome, {clientName}!
          </h2>
          <p className="text-orange-700">
            {files.length} file{files.length !== 1 ? 's' : ''} in your session
          </p>
        </div>

        {images.length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-semibold text-orange-800 mb-6">
              Photos ({images.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {images.map((file) => <FileCard key={file.name} file={file} />)}
            </div>
          </section>
        )}

        {videos.length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-semibold text-orange-800 mb-6">
              Videos ({videos.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {videos.map((file) => <FileCard key={file.name} file={file} />)}
            </div>
          </section>
        )}

        {others.length > 0 && (
          <section className="mb-12">
            <h3 className="text-2xl font-semibold text-orange-800 mb-6">
              Other Files ({others.length})
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {others.map((file) => <FileCard key={file.name} file={file} />)}
            </div>
          </section>
        )}

        {files.length === 0 && (
          <div className="text-center py-12">
            <p className="text-orange-600 text-lg">No files available yet</p>
          </div>
        )}
      </div>
    </div>
  )
}
