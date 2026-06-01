import { createServiceRoleClient } from '@/lib/supabase-server'
import { EmailService } from './email.service'
import { SettingsService } from './settings.service'
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

    const byDate = new Map<string, 'pending' | 'confirmed'>()
    for (const row of data ?? []) {
      const date = String(row.session_date).split('T')[0]
      const status = row.status === 'confirmed' ? 'confirmed' : 'pending'
      const existing = byDate.get(date)
      if (!existing || status === 'confirmed') {
        byDate.set(date, status)
      }
    }

    return Array.from(byDate.entries()).map(([date, status]) => ({ date, status }))
  },

  async getFullyBookedDates(): Promise<string[]> {
    const supabase = createServiceRoleClient()

    const [allSlots, { data: bookings, error }] = await Promise.all([
      SettingsService.getAvailableSlots(),
      supabase
        .from('bookings')
        .select('session_date, session_time')
        .in('status', ['pending', 'confirmed']),
    ])

    if (error) throw new Error(error.message)

    const bookedByDate: Record<string, string[]> = {}
    for (const b of bookings ?? []) {
      const date = String(b.session_date).split('T')[0]
      const time = b.session_time as string | null
      if (!time) continue
      if (!bookedByDate[date]) bookedByDate[date] = []
      if (!bookedByDate[date].includes(time)) {
        bookedByDate[date].push(time)
      }
    }

    return Object.entries(bookedByDate)
      .filter(([, times]) => allSlots.every((slot) => times.includes(slot)))
      .map(([date]) => date)
  },

  async getBookedTimesForDate(date: string): Promise<string[]> {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('bookings')
      .select('session_time')
      .eq('session_date', date)
      .in('status', ['pending', 'confirmed'])

    if (error) throw new Error(error.message)

    return (data ?? [])
      .map((row) => row.session_time as string | null)
      .filter((t): t is string => typeof t === 'string' && t.length > 0)
  },

  async create(input: BookingInput): Promise<Booking> {
    const supabase = createServiceRoleClient()

    const { data: existing } = await supabase
      .from('bookings')
      .select('id')
      .eq('session_date', input.session_date)
      .eq('session_time', input.session_time)
      .in('status', ['pending', 'confirmed'])
      .maybeSingle()

    if (existing) {
      throw new AppError(
        'This time slot is no longer available. Please choose another.',
        409
      )
    }

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
