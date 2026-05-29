'use client'

import { useState, useCallback, useId } from 'react'
import { Upload } from 'lucide-react'
import * as tus from 'tus-js-client'
import { createClient } from '@/lib/supabase'
import { publicEnv } from '@/lib/env'
import { sessionStoragePath } from '@/lib/session-storage'

interface UploadPanelProps {
  folderPath: string
  onUploadComplete: () => void
}

interface UploadProgress {
  status: 'queued' | 'uploading' | 'processing' | 'done' | 'error'
  percent: number
  error?: string
}

function statusBadgeClass(status: UploadProgress['status']): string {
  const base = 'inline-flex px-2 py-0.5 text-xs font-semibold rounded-full capitalize'
  switch (status) {
    case 'uploading':
    case 'processing':
      return `${base} bg-yellow-100 text-yellow-800`
    case 'done':
      return `${base} bg-green-100 text-green-800`
    case 'error':
      return `${base} bg-red-100 text-red-800`
    default:
      return `${base} bg-orange-100 text-orange-800`
  }
}

function statusLabel(p: UploadProgress | undefined): string {
  if (!p) return 'queued'
  if (p.status === 'uploading') return `${p.percent}%`
  return p.status
}

function isRlsOrForbiddenError(message: string): boolean {
  const lower = message.toLowerCase()
  return (
    lower.includes('403') ||
    lower.includes('forbidden') ||
    lower.includes('row-level security')
  )
}

export default function UploadPanel({ folderPath, onUploadComplete }: UploadPanelProps) {
  const inputId = useId()
  const [files, setFiles] = useState<File[]>([])
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState<Record<string, UploadProgress>>({})

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const dropped = Array.from(e.dataTransfer.files)
    setFiles((prev) => [...prev, ...dropped])
  }, [])

  function handleFileSelect(selected: File[]) {
    setFiles((prev) => [...prev, ...selected])
  }

  async function getAuthToken(): Promise<string> {
    const supabase = createClient()
    const {
      data: { session },
    } = await supabase.auth.getSession()
    if (!session?.access_token) {
      throw new Error('You must be logged in as admin to upload files.')
    }
    return session.access_token
  }

  async function uploadViaServer(file: File, isFallback = false): Promise<void> {
    // After TUS reaches 100%, do not reset the bar — keep full progress while server upload runs
    setProgress((p) => ({
      ...p,
      [file.name]: {
        status: isFallback ? 'processing' : 'uploading',
        percent: isFallback ? 100 : 0,
      },
    }))

    const formData = new FormData()
    formData.append('folderPath', folderPath)
    formData.append('file', file)

    const res = await fetch('/api/admin/sessions/upload', {
      method: 'POST',
      body: formData,
    })

    if (!res.ok) {
      const data = (await res.json().catch(() => ({}))) as { error?: string }
      throw new Error(data.error || `Server upload failed (${res.status})`)
    }

    setProgress((p) => ({
      ...p,
      [file.name]: { status: 'processing', percent: 100 },
    }))
  }

  async function uploadViaTus(file: File, authToken: string): Promise<void> {
    const filePath = sessionStoragePath(folderPath, 'originals', file.name)

    return new Promise((resolve, reject) => {
      const upload = new tus.Upload(file, {
        endpoint: `${publicEnv.supabaseUrl}/storage/v1/upload/resumable`,
        retryDelays: [0, 3000, 5000, 10000, 20000],
        headers: {
          authorization: `Bearer ${authToken}`,
          'x-upsert': 'true',
        },
        uploadDataDuringCreation: true,
        removeFingerprintOnSuccess: true,
        metadata: {
          bucketName: 'sessions',
          objectName: filePath,
          contentType: file.type || 'application/octet-stream',
          cacheControl: '3600',
        },
        chunkSize: 6 * 1024 * 1024,
        onError(error) {
          // RLS fallback will retry via server — avoid flashing error then 0% progress
          if (isRlsOrForbiddenError(error.message)) {
            reject(error)
            return
          }
          setProgress((p) => ({
            ...p,
            [file.name]: { status: 'error', percent: 0, error: error.message },
          }))
          reject(error)
        },
        onProgress(bytesUploaded, bytesTotal) {
          if (bytesTotal <= 0) return
          const percent = Math.min(100, Math.round((bytesUploaded / bytesTotal) * 100))
          setProgress((p) => {
            const current = p[file.name]
            if (current?.status === 'processing' || current?.status === 'done') {
              return p
            }
            return {
              ...p,
              [file.name]: { status: 'uploading', percent },
            }
          })
        },
        onSuccess() {
          setProgress((p) => ({
            ...p,
            [file.name]: { status: 'processing', percent: 100 },
          }))
          resolve()
        },
      })

      upload.findPreviousUploads().then((previousUploads) => {
        if (previousUploads.length) {
          upload.resumeFromPreviousUpload(previousUploads[0])
        }
        upload.start()
      })
    })
  }

  async function uploadFile(file: File, authToken: string): Promise<void> {
    try {
      await uploadViaTus(file, authToken)
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err)
      if (!isRlsOrForbiddenError(message)) {
        throw err
      }
      await uploadViaServer(file, true)
    }
  }

  async function handleUpload() {
    if (!files.length || !folderPath) return
    setUploading(true)

    // Only queue files that haven't already succeeded
    const pendingFiles = files.filter((f) => progress[f.name]?.status !== 'done')
    if (!pendingFiles.length) {
      setUploading(false)
      return
    }

    setProgress((prev) => {
      const next = { ...prev }
      pendingFiles.forEach((f) => {
        next[f.name] = { status: 'queued', percent: 0 }
      })
      return next
    })

    let authToken: string
    try {
      authToken = await getAuthToken()
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Not authenticated'
      setProgress((p) => {
        const next = { ...p }
        files.forEach((f) => {
          next[f.name] = { status: 'error', percent: 0, error: message }
        })
        return next
      })
      setUploading(false)
      return
    }

    let successCount = 0

    for (const file of pendingFiles) {
      try {
        await uploadFile(file, authToken)
        await fetch('/api/admin/generate-thumbnail', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            folderPath,
            fileName: file.name,
            fileType: file.type,
          }),
        })
        setProgress((p) => ({
          ...p,
          [file.name]: { status: 'done', percent: 100 },
        }))
        successCount++
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed'
        setProgress((p) => ({
          ...p,
          [file.name]: { status: 'error', percent: 0, error: message },
        }))
      }
    }

    setUploading(false)
    // Remove only successfully uploaded files; keep failed ones so the user can retry
    if (successCount > 0) {
      setFiles((prev) => prev.filter((f) => progress[f.name]?.status !== 'done'))
      onUploadComplete()
    }
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
            {files.map((f) => {
              const p = progress[f.name]
              return (
                <li
                  key={`${f.name}-${f.size}`}
                  className="px-4 py-3 bg-white hover:bg-orange-50 transition-colors space-y-2"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="text-sm text-orange-900 truncate flex-1">{f.name}</span>
                    <span className={statusBadgeClass(p?.status || 'queued')}>
                      {statusLabel(p)}
                    </span>
                  </div>
                  {(p?.status === 'uploading' || p?.status === 'processing') && (
                    <div className="h-1.5 w-full bg-orange-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-orange-600 transition-all duration-300"
                        style={{ width: `${p.percent}%` }}
                      />
                    </div>
                  )}
                  {p?.status === 'error' && p.error && (
                    <p className="text-xs text-red-600">{p.error}</p>
                  )}
                </li>
              )
            })}
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
