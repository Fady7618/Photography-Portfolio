import { Booking } from '@/types'
import { escapeHtml } from '@/utils/formatters'

export function buildBookingEmailHtml(booking: Booking): string {
  const name = escapeHtml(booking.client_name)
  const email = escapeHtml(booking.client_email)
  const date = escapeHtml(booking.session_date)
  const notes = booking.notes ? escapeHtml(booking.notes) : ''

  return `
    <h2>New Booking Request</h2>
    <p><strong>Client:</strong> ${name}</p>
    <p><strong>Email:</strong> ${email}</p>
    <p><strong>Date:</strong> ${date}</p>
    ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
  `
}

export function buildConfirmationEmailHtml(booking: Booking): string {
  const name = escapeHtml(booking.client_name)
  const date = escapeHtml(booking.session_date)
  const notes = booking.notes ? escapeHtml(booking.notes) : ''

  return `
    <h2>Your Session Is Confirmed</h2>
    <p>Hi ${name},</p>
    <p>Your photography session has been approved and confirmed.</p>
    <p><strong>Date:</strong> ${date}</p>
    ${notes ? `<p><strong>Notes:</strong> ${notes}</p>` : ''}
    <p>We look forward to seeing you. If you need to make changes, please contact us.</p>
  `
}
