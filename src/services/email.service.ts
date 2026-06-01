import { createResendClient } from '@/lib/resend'
import { getServerEnv } from '@/lib/env'
import { AppError } from '@/lib/api-helpers'
import { Booking } from '@/types'
import { formatTimeLabel } from '@/utils/formatters'
import {
  buildBookingEmailHtml,
  buildConfirmationEmailHtml,
} from '@/utils/email-templates'

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
    const timePart = formatTimeLabel(booking.session_time)
    const subjectSuffix = timePart
      ? `${booking.session_date} at ${timePart}`
      : booking.session_date

    await sendEmail({
      to: photographerEmail,
      subject: `New booking — ${subjectSuffix}`,
      html: buildBookingEmailHtml(booking),
    })
  },

  async sendConfirmationEmail(booking: Booking): Promise<void> {
    const timePart = formatTimeLabel(booking.session_time)
    const subjectSuffix = timePart
      ? `${booking.session_date} at ${timePart}`
      : booking.session_date

    await sendEmail({
      to: booking.client_email,
      subject: `Your photography session is confirmed — ${subjectSuffix}`,
      html: buildConfirmationEmailHtml(booking),
    })
  },
}
