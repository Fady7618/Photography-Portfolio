import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BookingService } from '@/services/booking.service'
import { AppError } from '@/lib/api-helpers'

const mockSingle = vi.fn()
const mockInsertSelectSingle = vi.fn()
const mockIn = vi.fn()
const mockEq = vi.fn()
const mockSelect = vi.fn()

vi.mock('@/lib/supabase-server', () => ({
  createServiceRoleClient: () => ({
    from: () => ({
      select: mockSelect,
      insert: () => ({
        select: () => ({
          single: mockInsertSelectSingle,
        }),
      }),
    }),
  }),
}))

vi.mock('@/services/email.service', () => ({
  EmailService: {
    sendBookingNotification: vi.fn().mockResolvedValue(undefined),
  },
}))

function chainSelectExisting(data: unknown) {
  mockSelect.mockReturnValue({
    eq: mockEq.mockReturnValue({
      in: mockIn.mockReturnValue({
        single: mockSingle.mockResolvedValue({ data }),
      }),
    }),
  })
}

describe('BookingService.create', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('throws AppError when date is already booked', async () => {
    chainSelectExisting({ id: 'existing-booking' })

    await expect(
      BookingService.create({
        client_name: 'Jane',
        client_email: 'jane@example.com',
        session_date: '2026-06-15',
      })
    ).rejects.toThrow(AppError)

    await expect(
      BookingService.create({
        client_name: 'Jane',
        client_email: 'jane@example.com',
        session_date: '2026-06-15',
      })
    ).rejects.toThrow('This date is already booked')
  })

  it('creates booking when date is available', async () => {
    chainSelectExisting(null)

    const booking = {
      id: 'new-id',
      client_name: 'Jane',
      client_email: 'jane@example.com',
      session_date: '2026-06-15',
      status: 'pending' as const,
      created_at: '2026-01-01T00:00:00Z',
    }

    mockInsertSelectSingle.mockResolvedValue({ data: booking, error: null })

    const result = await BookingService.create({
      client_name: 'Jane',
      client_email: 'jane@example.com',
      session_date: '2026-06-15',
    })

    expect(result).toEqual(booking)
  })
})
