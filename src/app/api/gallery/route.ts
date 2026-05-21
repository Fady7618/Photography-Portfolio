import { NextRequest } from 'next/server'
import { GalleryService } from '@/services/gallery.service'
import { handleApiError, successResponse, AppError } from '@/lib/api-helpers'

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token')

    if (!token) {
      throw new AppError('Token required', 400)
    }

    const session = await GalleryService.verifyToken(token)
    const files = await GalleryService.getSessionFiles(session.folder_path)

    return successResponse({
      session: { client_name: session.client_name },
      files,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
