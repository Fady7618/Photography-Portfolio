import { NextRequest } from 'next/server'
import { SettingsService } from '@/services/settings.service'
import { validateTimeSlotsArray } from '@/lib/validators'
import { handleApiError, successResponse, AppError } from '@/lib/api-helpers'
import { AuthService } from '@/services/auth.service'

export async function GET() {
  try {
    const slots = await SettingsService.getAvailableSlots()
    return successResponse({ slots })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function PUT(req: NextRequest) {
  try {
    const { user, profile } = await AuthService.getProfileWithSession()
    if (!user || profile?.role !== 'admin') {
      throw new AppError('Unauthorized', 403)
    }

    const body = await req.json()
    const slots = validateTimeSlotsArray(body?.slots)
    const saved = await SettingsService.upsertAvailableSlots(slots)
    return successResponse({ success: true, slots: saved })
  } catch (error) {
    return handleApiError(error)
  }
}
