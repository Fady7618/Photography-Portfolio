import { NextRequest } from 'next/server'
import { AuthService } from '@/services/auth.service'
import { ClientService } from '@/services/client.service'
import { handleApiError, successResponse, AppError } from '@/lib/api-helpers'
import { validateCreateClientBody } from '@/lib/validators'

async function requireAdmin(): Promise<void> {
  const { user, profile } = await AuthService.getProfileWithSession()
  if (!user || profile?.role !== 'admin') {
    throw new AppError('Unauthorized', 403)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = validateCreateClientBody(await req.json())
    const userId = await ClientService.createOrFindUser(body.client_email, body.client_name)
    const tokenExpiresAt = await ClientService.linkUserToSession(body.session_id, userId)

    return successResponse(
      {
        success: true,
        user_id: userId,
        token_expires_at: tokenExpiresAt,
      },
      201
    )
  } catch (error) {
    return handleApiError(error)
  }
}
