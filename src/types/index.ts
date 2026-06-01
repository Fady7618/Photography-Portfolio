export type BookingStatus = 'pending' | 'confirmed' | 'cancelled'

export type UserRole = 'admin' | 'client'

export type Booking = {
  id: string
  client_name: string
  client_email: string
  session_date: string
  session_time?: string
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
  thumbnailUrl: string
  downloadUrl?: string
  size: number
  type: 'image' | 'video' | 'other'
  created_at: string
}

export type GalleryPagination = {
  page: number
  pageSize: number
  totalFiles: number
  totalPages: number
  hasNextPage: boolean
}

export type BookingFormData = {
  client_name: string
  client_email: string
  session_date: string
  session_time: string
  notes?: string
}

export type TimeSlot = {
  time: string
  label: string
  available: boolean
}

export type PhotographerSettings = {
  available_time_slots: string[]
}

export type Profile = {
  id: string
  full_name: string
  email: string
  role: UserRole
  created_at: string
}
