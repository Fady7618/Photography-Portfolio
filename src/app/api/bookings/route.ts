import { NextRequest } from 'next/server'
import { BookingService } from '@/services/booking.service'
import { validateBookingBody } from '@/lib/validators'
import { AppError, handleApiError, successResponse } from '@/lib/api-helpers'
import { AuthService } from '@/services/auth.service'

export async function GET(req: NextRequest) {
  try {
    const dateParam = req.nextUrl.searchParams.get('date')

    if (dateParam) {
      const bookedTimes = await BookingService.getBookedTimesForDate(dateParam)
      return successResponse({ bookedTimes })
    }

    const [fullyBookedDates, dateStatuses] = await Promise.all([
      BookingService.getFullyBookedDates(),
      BookingService.getBookedDates(),
    ])

    return successResponse({ fullyBookedDates, dateStatuses })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await AuthService.getSession()

    if (!user) {
      throw new AppError('You must be signed in to book a session.', 401)
    }

    const body = await req.json()
    const validatedData = validateBookingBody(body)
    const booking = await BookingService.create({ ...validatedData, user_id: user.id })
    return successResponse(booking, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
