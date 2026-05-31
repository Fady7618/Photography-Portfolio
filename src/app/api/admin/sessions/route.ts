import { NextRequest } from 'next/server'
import { AdminService } from '@/services/admin.service'
import { ClientService } from '@/services/client.service'
import { handleApiError, successResponse, AppError } from '@/lib/api-helpers'
import { AuthService } from '@/services/auth.service'

async function requireAdmin() {
  const { user, profile } = await AuthService.getProfileWithSession()
  if (!user || profile?.role !== 'admin') {
    throw new AppError('Unauthorized', 403)
  }
}

export async function GET() {
  try {
    await requireAdmin()
    const sessions = await AdminService.getAllSessions()
    return successResponse({ sessions })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    await requireAdmin()
    const body = await req.json()
    const client_name = body?.client_name?.trim()
    const client_email = body?.client_email?.trim()

    if (!client_name || !client_email) {
      throw new AppError('Client name and email are required', 400)
    }

    const userId = await ClientService.findUserByEmail(client_email)
    if (!userId) {
      throw new AppError(
        `No account found for ${client_email}. The client must sign up at /auth/register before you can create a session.`,
        400
      )
    }

    const session = await AdminService.createSession({
      client_name,
      client_email,
      userId,
      tokenExpiresAt: ClientService.getDefaultTokenExpiresAt(),
    })
    return successResponse({ session }, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
