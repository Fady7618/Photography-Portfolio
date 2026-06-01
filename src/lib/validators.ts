import { BookingFormData } from '@/types'
import { AppError } from './api-helpers'

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
const TIME_REGEX = /^\d{2}:\d{2}$/

function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email)
}

export function validateBookingBody(body: unknown): BookingFormData {
  if (!body || typeof body !== 'object') {
    throw new AppError('Invalid request body', 400)
  }

  const { client_name, client_email, session_date, session_time, notes } =
    body as Record<string, unknown>

  if (!client_name || typeof client_name !== 'string') {
    throw new AppError('client_name is required', 400)
  }
  if (!client_email || typeof client_email !== 'string' || !isValidEmail(client_email)) {
    throw new AppError('A valid client_email is required', 400)
  }
  if (!session_date || typeof session_date !== 'string') {
    throw new AppError('session_date is required', 400)
  }
  if (!session_time || typeof session_time !== 'string' || !TIME_REGEX.test(session_time)) {
    throw new AppError('session_time is required (HH:MM format)', 400)
  }

  return {
    client_name,
    client_email,
    session_date,
    session_time,
    notes: typeof notes === 'string' ? notes : undefined,
  }
}

export function validateTimeSlotsArray(slots: unknown): string[] {
  if (!Array.isArray(slots) || slots.length === 0) {
    throw new AppError('slots must be a non-empty array', 400)
  }
  if (slots.some((s) => typeof s !== 'string' || !TIME_REGEX.test(s))) {
    throw new AppError('Invalid slots format. Use HH:MM for each slot.', 400)
  }
  return slots as string[]
}

export type CreateClientInput = {
  client_name: string
  client_email: string
  session_id: string
}

export function validateCreateClientBody(body: unknown): CreateClientInput {
  if (!body || typeof body !== 'object') {
    throw new AppError('Invalid request body', 400)
  }

  const { client_name, client_email, session_id } = body as Record<string, unknown>

  if (!client_name || typeof client_name !== 'string') {
    throw new AppError('client_name is required', 400)
  }
  if (!client_email || typeof client_email !== 'string' || !isValidEmail(client_email)) {
    throw new AppError('A valid client_email is required', 400)
  }
  if (!session_id || typeof session_id !== 'string') {
    throw new AppError('session_id is required', 400)
  }

  return { client_name, client_email, session_id }
}
