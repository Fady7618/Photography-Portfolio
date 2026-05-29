import { describe, it, expect } from 'vitest'
import {
  buildBookingEmailHtml,
  buildConfirmationEmailHtml,
} from '@/utils/email-templates'
import type { Booking } from '@/types'

const baseBooking: Booking = {
  id: '1',
  client_name: 'Jane Doe',
  client_email: 'jane@example.com',
  session_date: '2026-06-15',
  status: 'pending',
  created_at: '2026-01-01T00:00:00Z',
}

describe('buildBookingEmailHtml', () => {
  it('escapes HTML in user-provided fields', () => {
    const html = buildBookingEmailHtml({
      ...baseBooking,
      client_name: '<b>Evil</b>',
      notes: '<img src=x onerror=alert(1)>',
    })

    expect(html).not.toContain('<b>Evil</b>')
    expect(html).toContain('&lt;b&gt;Evil&lt;/b&gt;')
    expect(html).not.toContain('<img')
    expect(html).toContain('&lt;img')
  })
})

describe('buildConfirmationEmailHtml', () => {
  it('escapes client name in greeting', () => {
    const html = buildConfirmationEmailHtml({
      ...baseBooking,
      client_name: '<script>alert(1)</script>',
    })

    expect(html).not.toContain('<script>')
    expect(html).toContain('&lt;script&gt;')
  })
})
