'use client'

import Image from 'next/image'
import { SessionFile } from '@/types'
import { formatBytes } from '@/utils/formatters'

interface FileCardProps {
  file: SessionFile
  onDownload: (fileName: string) => void
  downloading?: boolean
}

export default function FileCard({ file, onDownload, downloading = false }: FileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {file.type === 'image' && file.thumbnailUrl && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={file.thumbnailUrl}
            alt={file.name}
            fill
            className="object-cover hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        </div>
      )}
      {file.type === 'image' && !file.thumbnailUrl && (
        <div className="relative aspect-[4/3] overflow-hidden bg-orange-100 flex items-center justify-center">
          <span className="text-orange-600 text-sm">Processing preview...</span>
        </div>
      )}
      {file.type === 'video' && (
        <div className="relative aspect-video overflow-hidden bg-orange-900 flex items-center justify-center">
          <span className="text-white font-medium">Video</span>
        </div>
      )}
      {file.type === 'other' && (
        <div className="relative aspect-[4/3] overflow-hidden bg-orange-100 flex items-center justify-center">
          <span className="text-orange-700 text-sm">File</span>
        </div>
      )}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-orange-800 truncate">{file.name}</p>
          <p className="text-xs text-orange-600">{formatBytes(file.size)}</p>
        </div>
        <button
          type="button"
          onClick={() => onDownload(file.name)}
          disabled={downloading}
          className="flex items-center justify-center gap-2 w-full bg-orange-800 hover:bg-orange-900 disabled:bg-orange-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          {downloading ? 'Preparing...' : 'Download'}
        </button>
      </div>
    </div>
  )
}
