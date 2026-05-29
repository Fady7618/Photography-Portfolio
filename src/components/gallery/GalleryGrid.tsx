'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { SessionFile, GalleryPagination } from '@/types'
import FileCard from './FileCard'
import { downloadSessionZip } from '@/utils/downloadZip'
import { triggerFileDownload } from '@/utils/triggerFileDownload'

interface GalleryGridProps {
  token: string
  clientName: string
  embedded?: boolean
}

interface GalleryApiResponse {
  session: { client_name: string }
  files: SessionFile[]
  pagination: GalleryPagination
  error?: string
}

export default function GalleryGrid({ token, clientName, embedded = false }: GalleryGridProps) {
  const [files, setFiles] = useState<SessionFile[]>([])
  const [page, setPage] = useState(1)
  const [hasNextPage, setHasNextPage] = useState(true)
  const [loadingMore, setLoadingMore] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)
  const [totalFiles, setTotalFiles] = useState(0)
  const [downloadingFile, setDownloadingFile] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [selectedFiles, setSelectedFiles] = useState<Set<string>>(new Set())
  const [selectMode, setSelectMode] = useState(false)
  const [downloading, setDownloading] = useState(false)
  const [zippingSession, setZippingSession] = useState(false)
  const observerRef = useRef<IntersectionObserver | null>(null)
  const sentinelRef = useRef<HTMLDivElement | null>(null)
  const loadingRef = useRef(false)

  const loadPage = useCallback(
    async (pageNum: number) => {
      if (!token || loadingRef.current) return
      loadingRef.current = true
      setLoadingMore(true)
      if (pageNum === 1) setInitialLoading(true)

      try {
        const res = await fetch(
          `/api/gallery?token=${encodeURIComponent(token)}&page=${pageNum}`
        )
        const data = (await res.json()) as GalleryApiResponse

        if (!res.ok) {
          setError(data.error || 'Failed to load gallery')
          return
        }

        setFiles((prev) => (pageNum === 1 ? data.files : [...prev, ...data.files]))
        setHasNextPage(data.pagination.hasNextPage)
        setTotalFiles(data.pagination.totalFiles)
        setPage(pageNum)
        setError(null)
      } catch {
        setError('Something went wrong. Please refresh the page.')
      } finally {
        loadingRef.current = false
        setLoadingMore(false)
        setInitialLoading(false)
      }
    },
    [token]
  )

  useEffect(() => {
    setFiles([])
    setPage(1)
    setHasNextPage(true)
    loadPage(1)
  }, [token, loadPage])

  useEffect(() => {
    if (!hasNextPage || loadingMore || initialLoading) return

    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && hasNextPage && !loadingRef.current) {
          loadPage(page + 1)
        }
      },
      { threshold: 0.1 }
    )

    const sentinel = sentinelRef.current
    if (sentinel) {
      observerRef.current.observe(sentinel)
    }

    return () => observerRef.current?.disconnect()
  }, [hasNextPage, loadingMore, initialLoading, page, loadPage])

  function handleDownload(fileName: string): void {
    setDownloadingFile(fileName)
    const url = `/api/gallery/download?token=${encodeURIComponent(token)}&file=${encodeURIComponent(fileName)}`
    triggerFileDownload(url)
    window.setTimeout(() => setDownloadingFile(null), 1500)
  }

  function toggleSelect(fileName: string) {
    setSelectedFiles((prev) => {
      const next = new Set(prev)
      next.has(fileName) ? next.delete(fileName) : next.add(fileName)
      return next
    })
  }

  function toggleSelectAll() {
    if (selectedFiles.size === files.length) {
      setSelectedFiles(new Set())
    } else {
      setSelectedFiles(new Set(files.map((f) => f.name)))
    }
  }

  async function downloadSelected(): Promise<void> {
    if (!selectedFiles.size) return
    setDownloading(true)
    for (const fileName of selectedFiles) {
      const url = `/api/gallery/download?token=${encodeURIComponent(token)}&file=${encodeURIComponent(fileName)}`
      triggerFileDownload(url)
      await new Promise((resolve) => setTimeout(resolve, 800))
    }
    setDownloading(false)
  }

  function handleZipDownload(): void {
    setZippingSession(true)
    downloadSessionZip(token, clientName)
    setTimeout(() => setZippingSession(false), 3000)
  }

  const images = files.filter((f) => f.type === 'image')
  const videos = files.filter((f) => f.type === 'video')
  const others = files.filter((f) => f.type === 'other')

  function renderCard(file: SessionFile) {
    return (
      <div
        key={file.name}
        className={`relative${selectMode && selectedFiles.has(file.name) ? ' ring-2 ring-orange-600 rounded-lg' : ''}`}
        onClick={() => selectMode && toggleSelect(file.name)}
        style={selectMode ? { cursor: 'pointer' } : undefined}
      >
        {selectMode && (
          <div className="absolute top-2 left-2 z-10">
            <input
              type="checkbox"
              checked={selectedFiles.has(file.name)}
              onChange={() => toggleSelect(file.name)}
              onClick={(e) => e.stopPropagation()}
              className="w-5 h-5 accent-orange-700 cursor-pointer"
            />
          </div>
        )}
        <FileCard
          file={file}
          onDownload={selectMode ? () => toggleSelect(file.name) : handleDownload}
          downloading={downloadingFile === file.name}
        />
      </div>
    )
  }

  const content = (
    <>
      {!embedded && (
        <div className="text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-orange-800 mb-2 plasterFont">
            Welcome, {clientName}!
          </h2>
          <p className="text-orange-700">
            {totalFiles > 0
              ? `${totalFiles} file${totalFiles !== 1 ? 's' : ''} in your session`
              : 'Loading your session...'}
          </p>
        </div>
      )}

      {!initialLoading && files.length > 0 && (
        <div className="flex flex-wrap items-center gap-3 mb-6">
          <button
            type="button"
            className="bg-orange-800 hover:bg-orange-900 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
            onClick={() => {
              setSelectMode((prev) => {
                if (prev) setSelectedFiles(new Set())
                return !prev
              })
            }}
          >
            {selectMode ? 'Cancel' : 'Select Photos'}
          </button>

          {selectMode && (
            <>
              <button
                type="button"
                className="bg-orange-100 hover:bg-orange-200 text-orange-800 font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                onClick={toggleSelectAll}
              >
                {selectedFiles.size === files.length ? 'Deselect All' : 'Select All'}
              </button>

              <span className="text-orange-700 text-sm font-medium">
                {selectedFiles.size} selected
              </span>

              {selectedFiles.size > 0 && (
                <button
                  type="button"
                  className="bg-orange-700 hover:bg-orange-800 disabled:bg-orange-400 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
                  onClick={downloadSelected}
                  disabled={downloading}
                >
                  {downloading
                    ? `Downloading... (${selectedFiles.size} files)`
                    : `Download Selected (${selectedFiles.size})`}
                </button>
              )}
            </>
          )}

          <button
            type="button"
            className="ml-auto bg-white border border-orange-800 hover:bg-orange-50 disabled:opacity-50 text-orange-800 font-semibold py-2 px-4 rounded-lg transition-all duration-300 text-sm"
            onClick={handleZipDownload}
            disabled={zippingSession}
          >
            {zippingSession ? 'Preparing ZIP...' : 'Download All as ZIP'}
          </button>
        </div>
      )}

      {error && (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      )}

      {initialLoading && (
        <div className="text-center py-12">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-orange-800 mx-auto mb-4" />
          <p className="text-orange-700">Loading your gallery...</p>
        </div>
      )}

      {!initialLoading && images.length > 0 && (
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-orange-800 mb-6">
            Photos ({images.length}
            {totalFiles > images.length ? ` of ${totalFiles}` : ''})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {images.map(renderCard)}
          </div>
        </section>
      )}

      {!initialLoading && videos.length > 0 && (
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-orange-800 mb-6">
            Videos ({videos.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {videos.map(renderCard)}
          </div>
        </section>
      )}

      {!initialLoading && others.length > 0 && (
        <section className="mb-12">
          <h3 className="text-2xl font-semibold text-orange-800 mb-6">
            Other Files ({others.length})
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {others.map(renderCard)}
          </div>
        </section>
      )}

      {!initialLoading && files.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-orange-600 text-lg">No files available yet</p>
        </div>
      )}

      {hasNextPage && !initialLoading && (
        <div ref={sentinelRef} className="py-8 text-center">
          {loadingMore && <p className="text-orange-700">Loading more...</p>}
        </div>
      )}

      {!hasNextPage && files.length > 0 && (
        <p className="text-center text-orange-600 py-4">
          All {totalFiles} file{totalFiles !== 1 ? 's' : ''} loaded
        </p>
      )}
    </>
  )

  if (embedded) {
    return <div>{content}</div>
  }

  return (
    <div className="min-h-screen bg-orange-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">{content}</div>
    </div>
  )
}
