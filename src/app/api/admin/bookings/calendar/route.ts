import { AdminService } from '@/services/admin.service'
import { AuthService } from '@/services/auth.service'
import { handleApiError, successResponse, AppError } from '@/lib/api-helpers'
import { Booking } from '@/types'

const SESSION_DURATION_MS = 90 * 60 * 1000

function bookingToCalendarEvent(booking: Booking) {
  const time = booking.session_time || '10:00'
  const startDate = new Date(`${booking.session_date}T${time}:00`)
  const endDate = new Date(startDate.getTime() + SESSION_DURATION_MS)

  const isConfirmed = booking.status === 'confirmed'
  const isCancelled = booking.status === 'cancelled'
  const backgroundColor = isCancelled
    ? '#9ca3af'
    : isConfirmed
      ? '#0F6E56'
      : '#534AB7'
  const borderColor = backgroundColor

  return {
    id: booking.id,
    title: booking.client_name,
    start: startDate.toISOString(),
    end: endDate.toISOString(),
    extendedProps: {
      email: booking.client_email,
      status: booking.status,
      notes: booking.notes,
      time,
    },
    backgroundColor,
    borderColor,
  }
}

export async function GET() {
  try {
    const { user, profile } = await AuthService.getProfileWithSession()
    if (!user || profile?.role !== 'admin') {
      throw new AppError('Unauthorized', 403)
    }

    const bookings = await AdminService.getAllBookings()
    const events = bookings.map(bookingToCalendarEvent)
    return successResponse({ events })
  } catch (error) {
    return handleApiError(error)
  }
}
