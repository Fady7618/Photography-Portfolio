import { NextRequest } from 'next/server'
import { GalleryService } from '@/services/gallery.service'
import { handleApiError, successResponse, AppError } from '@/lib/api-helpers'

export async function GET(req: NextRequest) {
  try {
    const token = req.nextUrl.searchParams.get('token')
    const page = parseInt(req.nextUrl.searchParams.get('page') || '1', 10)

    if (!token) {
      throw new AppError('Token required', 400)
    }

    if (Number.isNaN(page) || page < 1) {
      throw new AppError('Invalid page', 400)
    }

    const session = await GalleryService.verifyToken(token)
    const { files, pagination } = await GalleryService.getSessionFilesPage(
      session.folder_path,
      page
    )

    return successResponse({
      session: { client_name: session.client_name },
      files,
      pagination,
    })
  } catch (error) {
    return handleApiError(error)
  }
}
