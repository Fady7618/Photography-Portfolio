import { createResendClient } from '@/lib/resend'
import { getServerEnv } from '@/lib/env'
import { Booking } from '@/types'

export const EmailService = {
  async sendBookingNotification(booking: Booking): Promise<void> {
    const resend = createResendClient()
    const { photographerEmail } = getServerEnv()

    await resend.emails.send({
      from: 'bookings@resend.dev',
      to: photographerEmail,
      subject: `New booking — ${booking.session_date}`,
      html: buildBookingEmailHtml(booking),
    })
  },
}

function buildBookingEmailHtml(booking: Booking): string {
  return `
    <h2>New Booking Request</h2>
    <p><strong>Client:</strong> ${booking.client_name}</p>
    <p><strong>Email:</strong> ${booking.client_email}</p>
    <p><strong>Date:</strong> ${booking.session_date}</p>
    ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
  `
}
