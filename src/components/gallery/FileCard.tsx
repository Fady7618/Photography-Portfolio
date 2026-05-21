'use client'

import { SessionFile } from '@/types'
import { formatBytes } from '@/utils/formatters'

interface FileCardProps {
  file: SessionFile
}

export default function FileCard({ file }: FileCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
      {file.type === 'image' && (
        <div className="relative aspect-[4/3] overflow-hidden">
          <img 
            src={file.url} 
            alt={file.name} 
            loading="lazy"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      {file.type === 'video' && (
        <div className="relative aspect-video overflow-hidden bg-black">
          <video 
            src={file.url} 
            controls 
            preload="metadata"
            className="w-full h-full"
          />
        </div>
      )}
      <div className="p-4 space-y-3">
        <div className="space-y-1">
          <p className="text-sm font-medium text-orange-800 truncate">{file.name}</p>
          <p className="text-xs text-orange-600">{formatBytes(file.size)}</p>
        </div>
        <a
          href={file.url}
          download={file.name}
          className="flex items-center justify-center gap-2 w-full bg-orange-800 hover:bg-orange-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300"
          target="_blank"
          rel="noopener noreferrer"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Download
        </a>
      </div>
    </div>
  )
}
