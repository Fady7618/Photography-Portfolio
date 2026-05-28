'use client'

import { useState, useCallback, useId } from 'react'
import { Upload } from 'lucide-react'

interface UploadPanelProps {
  folderPath: string
  onUploadComplete: () => void
}

type FileStatus = 'ready' | 'uploading' | 'done' | 'error'

function statusBadgeClass(status: FileStatus): string {
  const base = 'inline-flex px-2 py-0.5 text-xs font-semibold rounded-full capitalize'
  switch (status) {
    case 'uploading':
      return `${base} bg-yellow-100 text-yellow-800`
    case 'done':
      return `${base} bg-green-100 text-green-800`
    case 'error':
      return `${base} bg-red-100 text-red-800`
    default:
      return `${base} bg-orange-100 text-orange-800`
  }
}

export default function UploadPanel({ folderPath, onUploadComplete }: UploadPanelProps) {
  const inputId = useId()
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<Record<string, FileStatus>>({})

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...dropped])
    setProgress((p) => {
      const next = { ...p }
      dropped.forEach((f) => {
        if (!next[f.name]) next[f.name] = 'ready'
      })
      return next
    })
  }, [])

  function handleFileSelect(selected: File[]) {
    setFiles((prev) => [...prev, ...selected])
    setProgress((p) => {
      const next = { ...p }
      selected.forEach((f) => {
        if (!next[f.name]) next[f.name] = 'ready'
      })
      return next
    })
  }

  async function handleUpload() {
    if (!files.length) return
    setUploading(true)

    for (const file of files) {
      setProgress((p) => ({ ...p, [file.name]: 'uploading' }))
      const formData = new FormData()
      formData.append('folderPath', folderPath)
      formData.append('file', file)

      const res = await fetch('/api/admin/sessions/upload', {
        method: 'POST',
        body: formData,
      })

      setProgress((p) => ({ ...p, [file.name]: res.ok ? 'done' : 'error' }))
    }

    setUploading(false)
    setFiles([])
    onUploadComplete()
  }

  return (
    <div className="space-y-4">
      <div
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            document.getElementById(inputId)?.click()
          }
        }}
        className="border-2 border-dashed border-orange-300 rounded-xl bg-orange-50 p-8 text-center cursor-pointer hover:border-orange-500 hover:bg-orange-100 transition-all"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById(inputId)?.click()}
      >
        <input
          id={inputId}
          type="file"
          multiple
          accept="image/*,video/*"
          className="hidden"
          onChange={(e) => {
            const selected = Array.from(e.target.files || [])
            handleFileSelect(selected)
            e.target.value = ''
          }}
        />
        <Upload className="h-10 w-10 text-orange-600 mx-auto mb-3" />
        <p className="text-orange-800 font-medium">Drag & drop photos/videos here</p>
        <p className="text-sm text-orange-600 mt-1">or click to browse</p>
      </div>

      {files.length > 0 && (
        <div className="border border-orange-200 rounded-lg overflow-hidden">
          <ul className="divide-y divide-orange-100">
            {files.map((f) => (
              <li
                key={`${f.name}-${f.size}`}
                className="flex items-center justify-between gap-4 px-4 py-3 bg-white hover:bg-orange-50 transition-colors"
              >
                <span className="text-sm text-orange-900 truncate flex-1">{f.name}</span>
                <span className={statusBadgeClass(progress[f.name] || 'ready')}>
                  {progress[f.name] || 'ready'}
                </span>
              </li>
            ))}
          </ul>
          <div className="p-4 bg-orange-50 border-t border-orange-200">
            <button
              type="button"
              onClick={handleUpload}
              disabled={uploading}
              className="w-full bg-orange-800 hover:bg-orange-900 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
            >
              {uploading ? 'Uploading...' : `Upload ${files.length} file(s)`}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
