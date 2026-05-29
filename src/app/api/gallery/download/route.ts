import { NextRequest } from 'next/server'
import { createServiceRoleClient } from '@/lib/supabase-server'
import { sessionStoragePath } from '@/lib/session-storage'
import { GalleryService } from '@/services/gallery.service'
import { handleApiError, AppError } from '@/lib/api-helpers'

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token')
    const fileName = req.nextUrl.searchParams.get('file')

    if (!token || !fileName) {
      throw new AppError('Missing token or file', 400)
    }

    const session = await GalleryService.verifyToken(token)
    const supabase = createServiceRoleClient()
    const originalPath = sessionStoragePath(session.folder_path, 'originals', fileName)

    const { data, error } = await supabase.storage.from('sessions').download(originalPath)

    if (error || !data) {
      throw new AppError('Could not download file', 404)
    }

    const buffer = Buffer.from(await data.arrayBuffer())

    return new Response(buffer, {
      headers: {
        'Content-Type': data.type || 'application/octet-stream',
        'Content-Disposition': `attachment; filename="${fileName.replace(/"/g, '')}"; filename*=UTF-8''${encodeURIComponent(fileName)}`,
        'Content-Length': String(buffer.byteLength),
        'Cache-Control': 'no-store',
      },
    })
  } catch (error) {
    return handleApiError(error)
  }
}
