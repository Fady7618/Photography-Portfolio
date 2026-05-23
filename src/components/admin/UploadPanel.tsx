'use client'

import { useState, useCallback } from 'react'
import { createClient } from '@/lib/supabase'

interface UploadPanelProps {
  folderPath: string
  onUploadComplete: () => void
}

export default function UploadPanel({ folderPath, onUploadComplete }: UploadPanelProps) {
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<Record<string, 'uploading' | 'done' | 'error'>>({})
  const supabase = createClient()

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...dropped])
  }, [])

  async function handleUpload() {
    if (!files.length) return
    setUploading(true)

    for (const file of files) {
      setProgress((p) => ({ ...p, [file.name]: 'uploading' }))
      const { error } = await supabase.storage
        .from('sessions')
        .upload(`${folderPath}/${file.name}`, file, { upsert: true })

      setProgress((p) => ({ ...p, [file.name]: error ? 'error' : 'done' }))
    }

    setUploading(false)
    setFiles([])
    onUploadComplete()
  }

  return (
    <div className="upload-panel">
      <div
        className="dropzone"
        onDrop={handleDrop}
        onDragOver={(e) => e.preventDefault()}
        onClick={() => document.getElementById('file-input')?.click()}
      >
        <input
          id="file-input"
          type="file"
          multiple
          accept="image/*,video/*"
          style={{ display: 'none' }}
          onChange={(e) => setFiles(Array.from(e.target.files || []))}
        />
        <p>Drag & drop photos/videos here, or click to browse</p>
      </div>

      {files.length > 0 && (
        <div className="file-list">
          {files.map((f) => (
            <div key={f.name} className="file-item">
              <span>{f.name}</span>
              <span>{progress[f.name] || 'ready'}</span>
            </div>
          ))}
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : `Upload ${files.length} file(s)`}
          </button>
        </div>
      )}
    </div>
  )
}
