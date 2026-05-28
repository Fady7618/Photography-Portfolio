export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export type UserRole = 'admin' | 'client'

export type Booking = {
  id: string
  client_name: string
  client_email: string
  session_date: string
  notes?: string
  status: BookingStatus
  created_at: string
  user_id?: string
}

export type ClientSession = {
  id: string
  client_name: string
  client_email: string
  folder_path: string
  access_token: string
  token_expires_at: string | null
  created_at: string
  user_id: string | null
}

export type SessionFile = {
  name: string
  url: string
  size: number
  type: 'image' | 'video' | 'other'
  created_at: string
}

export type BookingFormData = {
  client_name: string
  client_email: string
  session_date: string
  notes?: string
}

export type Profile = {
  id: string
  full_name: string
  email: string
  role: UserRole
  created_at: string
}
