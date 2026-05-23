import { NextRequest } from 'next/server'
import { AdminService } from '@/services/admin.service'
import { handleApiError, successResponse, AppError } from '@/lib/api-helpers'
import { AuthService } from '@/services/auth.service'

export async function GET() {
  try {
    const { user, profile } = await AuthService.getProfileWithSession()
    if (!user || profile?.role !== 'admin') {
      throw new AppError('Unauthorized', 403)
    }

    const bookings = await AdminService.getAllBookings()
    return successResponse({ bookings })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { user, profile } = await AuthService.getProfileWithSession()
    if (!user || profile?.role !== 'admin') {
      throw new AppError('Unauthorized', 403)
    }

    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')
    const clearAll = searchParams.get('clearAll') === 'true'

    if (clearAll) {
      await AdminService.clearAllBookings()
      return successResponse({ message: 'All bookings cleared' })
    }

    if (!id) {
      throw new AppError('Booking ID is required', 400)
    }

    await AdminService.cancelBooking(id)
    return successResponse({ message: 'Booking cancelled' })
  } catch (error) {
    return handleApiError(error)
  }
}
