import { createServiceRoleClient } from '@/lib/supabase-server'
import { EmailService } from './email.service'
import { AppError } from '@/lib/api-helpers'
import { Booking, BookingFormData } from '@/types'

type BookingInput = BookingFormData & { user_id?: string }

export const BookingService = {
  async getBookedDates(): Promise<{ date: string; status: 'pending' | 'confirmed' }[]> {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('bookings')
      .select('session_date, status')
      .in('status', ['pending', 'confirmed'])

    if (error) throw new Error(error.message)
    return (data ?? []).map((row) => ({
      date: String(row.session_date).split('T')[0],
      status: row.status === 'confirmed' ? 'confirmed' : 'pending',
    }))
  },

  async create(input: BookingInput): Promise<Booking> {
    const supabase = createServiceRoleClient()

    const { data: existing } = await supabase
      .from('bookings')
      .select('id')
      .eq('session_date', input.session_date)
      .in('status', ['pending', 'confirmed'])
      .single()

    if (existing) throw new AppError('This date is already booked', 409)

    const { data, error } = await supabase
      .from('bookings')
      .insert(input)
      .select()
      .single()

    if (error) throw new Error(error.message)

    await EmailService.sendBookingNotification(data)

    return data
  },
}
