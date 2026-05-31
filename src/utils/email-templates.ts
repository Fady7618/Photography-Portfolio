import { Booking } from '@/types'
import { escapeHtml } from '@/utils/formatters'

function wrapEmailDocument(title: string, bodyContent: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
</head>
<body style="margin:0;padding:0;background-color:#fff7ed;font-family:Arial,Helvetica,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#fff7ed;padding:24px 0;">
    <tr>
      <td align="center">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:#ffffff;border-radius:8px;border:1px solid #fed7aa;overflow:hidden;">
          <tr>
            <td style="background-color:#9a3412;padding:20px 24px;">
              <h1 style="margin:0;color:#ffffff;font-size:22px;font-weight:bold;">FUJIFILM Photography</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:24px;color:#431407;font-size:16px;line-height:1.6;">
              ${bodyContent}
            </td>
          </tr>
          <tr>
            <td style="padding:16px 24px;background-color:#ffedd5;border-top:1px solid #fed7aa;">
              <p style="margin:0;color:#9a3412;font-size:12px;">This is an automated message. Please do not reply directly to this email.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`
}

export function buildBookingEmailHtml(booking: Booking): string {
  const name = escapeHtml(booking.client_name)
  const email = escapeHtml(booking.client_email)
  const date = escapeHtml(booking.session_date)
  const notes = booking.notes ? escapeHtml(booking.notes) : ''

  const body = `
    <h2 style="margin:0 0 16px;color:#9a3412;font-size:20px;">New Booking Request</h2>
    <p style="margin:0 0 8px;"><strong>Client:</strong> ${name}</p>
    <p style="margin:0 0 8px;"><strong>Email:</strong> ${email}</p>
    <p style="margin:0 0 8px;"><strong>Date:</strong> ${date}</p>
    ${notes ? `<p style="margin:0;"><strong>Notes:</strong> ${notes}</p>` : ''}
  `

  return wrapEmailDocument('New Booking Request', body)
}

export function buildConfirmationEmailHtml(booking: Booking): string {
  const name = escapeHtml(booking.client_name)
  const date = escapeHtml(booking.session_date)
  const notes = booking.notes ? escapeHtml(booking.notes) : ''

  const body = `
    <h2 style="margin:0 0 16px;color:#9a3412;font-size:20px;">Your Session Is Confirmed</h2>
    <p style="margin:0 0 12px;">Hi ${name},</p>
    <p style="margin:0 0 12px;">Your photography session has been approved and confirmed.</p>
    <p style="margin:0 0 8px;"><strong>Date:</strong> ${date}</p>
    ${notes ? `<p style="margin:0 0 12px;"><strong>Notes:</strong> ${notes}</p>` : ''}
    <p style="margin:0;">We look forward to seeing you. If you need to make changes, please contact us.</p>
  `

  return wrapEmailDocument('Session Confirmed', body)
}
