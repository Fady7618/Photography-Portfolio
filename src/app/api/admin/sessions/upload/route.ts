import { NextRequest } from 'next/server'
import { AdminService } from '@/services/admin.service'
import { handleApiError, successResponse, AppError } from '@/lib/api-helpers'
import { AuthService } from '@/services/auth.service'

export async function POST(req: NextRequest) {
  try {
    const { user, profile } = await AuthService.getProfileWithSession()
    if (!user || profile?.role !== 'admin') {
      throw new AppError('Unauthorized', 403)
    }

    const formData = await req.formData()
    const folderPath = formData.get('folderPath')?.toString()
    const file = formData.get('file')

    if (!folderPath) {
      throw new AppError('folderPath is required', 400)
    }

    if (!(file instanceof File)) {
      throw new AppError('file is required', 400)
    }

    await AdminService.uploadSessionFile(folderPath, file.name, file)
    return successResponse({ message: 'Upload complete' })
  } catch (error) {
    return handleApiError(error)
  }
}
