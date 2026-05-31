import { createServiceRoleClient } from '@/lib/supabase-server'
import { AppError } from '@/lib/api-helpers'
import { sessionStoragePath } from '@/lib/session-storage'
import { Booking, BookingStatus, ClientSession } from '@/types'

export type CreateSessionInput = {
  client_name: string
  client_email: string
  userId: string
  tokenExpiresAt: string
}

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

  async confirmBooking(id: string): Promise<Booking> {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'confirmed' })
      .eq('id', id)
      .eq('status', 'pending')
      .select()
      .single()

    if (error) throw new Error(error.message)
    if (!data) throw new AppError('Booking not found or not pending', 404)
    return data
  },

  async setBookingStatus(id: string, status: BookingStatus): Promise<void> {
    const supabase = createServiceRoleClient()
    const { error } = await supabase
      .from('bookings')
      .update({ status })
      .eq('id', id)

    if (error) throw new Error(error.message)
  },

  async clearAllBookings(): Promise<void> {
    const supabase = createServiceRoleClient()
    // Supabase requires at least one filter on DELETE to prevent accidental full-table deletes.
    const { error } = await supabase
      .from('bookings')
      .delete()
      .neq('id', '00000000-0000-0000-0000-000000000000')

    if (error) throw new Error(error.message)
  },

  async getAllSessions(): Promise<ClientSession[]> {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('client_sessions')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  },

  async createSession(input: CreateSessionInput): Promise<ClientSession> {
    const supabase = createServiceRoleClient()
    const slug = `${input.client_name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    const folderPath = slug

    const { data, error } = await supabase
      .from('client_sessions')
      .insert({
        client_name: input.client_name,
        client_email: input.client_email.toLowerCase().trim(),
        folder_path: folderPath,
        user_id: input.userId,
        token_expires_at: input.tokenExpiresAt,
      })
      .select()
      .single()

    if (error) throw new Error(error.message)
    if (!data) throw new Error('Failed to create session')
    return data
  },

  async uploadSessionFile(
    folderPath: string,
    fileName: string,
    file: Blob
  ): Promise<void> {
    const supabase = createServiceRoleClient()
    const { error } = await supabase.storage
      .from('sessions')
      .upload(sessionStoragePath(folderPath, 'originals', fileName), file, { upsert: true })

    if (error) throw new Error(error.message)
  },
}
