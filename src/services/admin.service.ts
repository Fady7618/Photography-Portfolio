import { createServiceRoleClient } from '@/lib/supabase-server'
import { Booking } from '@/types'
import { AppError } from '@/lib/api-helpers'

export const AdminService = {
  async getAllBookings(): Promise<Booking[]> {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('bookings')
      .select('*')
      .order('session_date', { ascending: true })

    if (error) throw new Error(error.message)
    return data || []
  },

  async cancelBooking(id: string): Promise<void> {
    const supabase = createServiceRoleClient()
    const { error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('id', id)

    if (error) throw new Error(error.message)
  },

  async clearAllBookings(): Promise<void> {
    const supabase = createServiceRoleClient()
    const { error} = await supabase
      .from('bookings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (error) throw new Error(error.message)
  },

  async getBookingStats(): Promise<{
    total: number
    pending: number
    confirmed: number
    cancelled: number
  }> {
    const bookings = await this.getAllBookings()

    return {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    }
  },
}
