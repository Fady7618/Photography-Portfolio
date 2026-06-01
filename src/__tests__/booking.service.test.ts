import { describe, it, expect, vi, beforeEach } from 'vitest'
import { BookingService } from '@/services/booking.service'
import { AppError } from '@/lib/api-helpers'

const mockMaybeSingle = vi.fn()
const mockInsertSelectSingle = vi.fn()
const mockIn = vi.fn()
const mockEqSessionTime = vi.fn()
const mockEqSessionDate = vi.fn()
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

vi.mock('@/services/settings.service', () => ({
  SettingsService: {
    getAvailableSlots: vi.fn().mockResolvedValue(['10:00', '14:00', '18:00']),
  },
}))

function chainSelectExisting(data: unknown) {
  mockSelect.mockReturnValue({
    eq: mockEqSessionDate.mockReturnValue({
      eq: mockEqSessionTime.mockReturnValue({
        in: mockIn.mockReturnValue({
          maybeSingle: mockMaybeSingle.mockResolvedValue({ data }),
        }),
      }),
    }),
  })
}

const validInput = {
  client_name: 'Jane',
  client_email: 'jane@example.com',
  session_date: '2026-06-15',
  session_time: '10:00',
}

describe('BookingService.create', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('throws AppError when time slot is already booked', async () => {
    chainSelectExisting({ id: 'existing-booking' })

    await expect(BookingService.create(validInput)).rejects.toThrow(AppError)

    await expect(BookingService.create(validInput)).rejects.toThrow(
      'This time slot is no longer available. Please choose another.'
    )
  })

  it('creates booking when slot is available', async () => {
    chainSelectExisting(null)

    const booking = {
      id: 'new-id',
      client_name: 'Jane',
      client_email: 'jane@example.com',
      session_date: '2026-06-15',
      session_time: '10:00',
      status: 'pending' as const,
      created_at: '2026-01-01T00:00:00Z',
    }

    mockInsertSelectSingle.mockResolvedValue({ data: booking, error: null })

    const result = await BookingService.create(validInput)

    expect(result).toEqual(booking)
  })
})
