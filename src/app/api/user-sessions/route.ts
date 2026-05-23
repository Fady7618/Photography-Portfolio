import { AuthService } from '@/services/auth.service'
import { GalleryService } from '@/services/gallery.service'
import { handleApiError, successResponse, AppError } from '@/lib/api-helpers'

export async function GET() {
  try {
    const { user } = await AuthService.getSession()
    
    if (!user) {
      throw new AppError('Unauthorized', 401)
    }

    const sessions = await GalleryService.getUserSessions(user.id)
    
    return successResponse({ sessions })
  } catch (error) {
    return handleApiError(error)
  }
}
