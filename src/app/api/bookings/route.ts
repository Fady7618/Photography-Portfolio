import { NextRequest } from 'next/server'
import { BookingService } from '@/services/booking.service'
import { validateBookingBody } from '@/lib/validators'
import { handleApiError, successResponse } from '@/lib/api-helpers'
import { AuthService } from '@/services/auth.service'

export async function GET() {
  try {
    const bookedDates = await BookingService.getBookedDates()
    return successResponse({ bookedDates })
  } catch (error) {
    return handleApiError(error)
  }
}

export async function POST(req: NextRequest) {
  try {
    const { user } = await AuthService.getSession()
    const body = await req.json()
    const validatedData = validateBookingBody(body)
    
    const bookingData = user 
      ? { ...validatedData, user_id: user.id }
      : validatedData
    
    const booking = await BookingService.create(bookingData)
    return successResponse(booking, 201)
  } catch (error) {
    return handleApiError(error)
  }
}
