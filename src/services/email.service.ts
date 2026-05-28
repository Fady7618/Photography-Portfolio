import { createResendClient } from '@/lib/resend'
import { getServerEnv } from '@/lib/env'
import { AppError } from '@/lib/api-helpers'
import { Booking } from '@/types'

async function sendEmail(params: {
  to: string
  subject: string
  html: string
}): Promise<void> {
  const resend = createResendClient()
  const { resendFromEmail } = getServerEnv()

  const { error } = await resend.emails.send({
    from: resendFromEmail,
    to: params.to.trim(),
    subject: params.subject,
    html: params.html,
  })

  if (error) {
    const isSandboxRestriction =
      error.message?.includes('only send testing emails') ||
      error.message?.includes('verify a domain') ||
      error.message?.includes('resend.dev')

    const message = isSandboxRestriction
      ? 'Could not email the client. Add and verify your domain in Resend, then set RESEND_FROM_EMAIL to an address on that domain (e.g. bookings@yourdomain.com).'
      : error.message || 'Failed to send email'

    throw new AppError(message, 502)
  }
}

export const EmailService = {
  async sendBookingNotification(booking: Booking): Promise<void> {
    const { photographerEmail } = getServerEnv()

    await sendEmail({
      to: photographerEmail,
      subject: `New booking — ${booking.session_date}`,
      html: buildBookingEmailHtml(booking),
    })
  },

  async sendConfirmationEmail(booking: Booking): Promise<void> {
    await sendEmail({
      to: booking.client_email,
      subject: `Your photography session is confirmed — ${booking.session_date}`,
      html: buildConfirmationEmailHtml(booking),
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

function buildConfirmationEmailHtml(booking: Booking): string {
  return `
    <h2>Your Session Is Confirmed</h2>
    <p>Hi ${booking.client_name},</p>
    <p>Your photography session has been approved and confirmed.</p>
    <p><strong>Date:</strong> ${booking.session_date}</p>
    ${booking.notes ? `<p><strong>Notes:</strong> ${booking.notes}</p>` : ''}
    <p>We look forward to seeing you. If you need to make changes, please contact us.</p>
  `
}
