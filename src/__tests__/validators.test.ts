import { describe, it, expect } from 'vitest'
import { validateBookingBody, validateCreateClientBody } from '@/lib/validators'
import { AppError } from '@/lib/api-helpers'

describe('validateBookingBody', () => {
  it('returns validated booking data for valid input', () => {
    const result = validateBookingBody({
      client_name: 'Jane Doe',
      client_email: 'jane@example.com',
      session_date: '2026-06-15',
      notes: 'Outdoor shoot',
    })

    expect(result).toEqual({
      client_name: 'Jane Doe',
      client_email: 'jane@example.com',
      session_date: '2026-06-15',
      notes: 'Outdoor shoot',
    })
  })

  it('throws when client_name is missing', () => {
    expect(() =>
      validateBookingBody({
        client_email: 'jane@example.com',
        session_date: '2026-06-15',
      })
    ).toThrow(AppError)
  })

  it('throws when email is invalid', () => {
    expect(() =>
      validateBookingBody({
        client_name: 'Jane',
        client_email: 'not-an-email',
        session_date: '2026-06-15',
      })
    ).toThrow(AppError)
  })

  it('throws for non-object body', () => {
    expect(() => validateBookingBody(null)).toThrow(AppError)
  })
})

describe('validateCreateClientBody', () => {
  it('returns validated client input', () => {
    const result = validateCreateClientBody({
      client_name: 'John',
      client_email: 'john@example.com',
      session_id: 'sess-123',
    })

    expect(result).toEqual({
      client_name: 'John',
      client_email: 'john@example.com',
      session_id: 'sess-123',
    })
  })

  it('throws when session_id is missing', () => {
    expect(() =>
      validateCreateClientBody({
        client_name: 'John',
        client_email: 'john@example.com',
      })
    ).toThrow(AppError)
  })
})
