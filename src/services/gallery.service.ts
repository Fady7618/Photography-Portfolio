import { createServiceRoleClient } from '@/lib/supabase-server'
import { AppError } from '@/lib/api-helpers'
import { sessionStoragePath } from '@/lib/session-storage'
import { ClientSession, SessionFile, GalleryPagination } from '@/types'

const PAGE_SIZE = 20
const THUMBNAIL_URL_EXPIRY = 24 * 60 * 60

const IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'webp', 'heic', 'tiff']
const VIDEO_EXTENSIONS = ['mp4', 'mov', 'avi', 'webm']

function getFileType(fileName: string): SessionFile['type'] {
  const ext = fileName.split('.').pop()?.toLowerCase() || ''
  if (IMAGE_EXTENSIONS.includes(ext)) return 'image'
  if (VIDEO_EXTENSIONS.includes(ext)) return 'video'
  return 'other'
}

export const GalleryService = {
  async verifyToken(token: string): Promise<ClientSession> {
    const supabase = createServiceRoleClient()

    const { data: session, error } = await supabase
      .from('client_sessions')
      .select('*')
      .eq('access_token', token)
      .single()

    if (error || !session) {
      throw new AppError('Invalid or expired token', 401)
    }

    if (session.token_expires_at && new Date(session.token_expires_at) < new Date()) {
      throw new AppError('This link has expired', 401)
    }

    return session
  },

  async getUserSessions(userId: string): Promise<ClientSession[]> {
    const supabase = createServiceRoleClient()

    const { data, error } = await supabase
      .from('client_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  },

  async getSessionFilesPage(
    folderPath: string,
    page: number
  ): Promise<{ files: SessionFile[]; pagination: GalleryPagination }> {
    const supabase = createServiceRoleClient()
    const originalFolder = sessionStoragePath(folderPath, 'originals')
    const offset = (page - 1) * PAGE_SIZE

    const { data: allOriginals, error: listError } = await supabase.storage
      .from('sessions')
      .list(originalFolder, { limit: 1000, sortBy: { column: 'name', order: 'asc' } })

    if (listError) throw new Error(listError.message)

    const entries = (allOriginals || []).filter(
      (f) => f.name && f.id !== null && !f.name.startsWith('.')
    )
    const totalFiles = entries.length
    const totalPages = Math.max(1, Math.ceil(totalFiles / PAGE_SIZE))
    const pageEntries = entries.slice(offset, offset + PAGE_SIZE)

    // Batch-sign all thumbnail paths in one request instead of N individual calls
    const imageEntries = pageEntries.filter((f) => getFileType(f.name) === 'image')
    const thumbPaths = imageEntries.map((f) =>
      sessionStoragePath(folderPath, 'thumbnails', f.name)
    )

    const signedUrlMap: Record<string, string> = {}
    if (thumbPaths.length > 0) {
      const { data: signedList } = await supabase.storage
        .from('sessions')
        .createSignedUrls(thumbPaths, THUMBNAIL_URL_EXPIRY)

      if (signedList) {
        for (const entry of signedList) {
          if (entry.signedUrl) {
            // key by the final segment (filename) so lookup is O(1)
            const name = (entry.path ?? '').split('/').pop() ?? ''
            signedUrlMap[name] = entry.signedUrl
          }
        }
      }
    }

    const files: SessionFile[] = pageEntries.map((file) => ({
      name: file.name,
      thumbnailUrl: signedUrlMap[file.name] ?? '',
      size: file.metadata?.size || 0,
      type: getFileType(file.name),
      created_at: file.created_at || '',
    }))

    return {
      files,
      pagination: {
        page,
        pageSize: PAGE_SIZE,
        totalFiles,
        totalPages,
        hasNextPage: page < totalPages,
      },
    }
  },

  async getOriginalDownloadUrl(
    folderPath: string,
    fileName: string
  ): Promise<string> {
    const supabase = createServiceRoleClient()
    const originalPath = sessionStoragePath(folderPath, 'originals', fileName)

    const { data, error } = await supabase.storage
      .from('sessions')
      .createSignedUrl(originalPath, 60 * 5, { download: true })

    if (error || !data?.signedUrl) {
      throw new AppError('Could not generate download link', 500)
    }

    return data.signedUrl
  },
}
