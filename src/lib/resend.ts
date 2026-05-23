import { Resend } from 'resend'
import { getServerEnv } from './env'

export function createResendClient(): Resend {
  const { resendApiKey } = getServerEnv()
  return new Resend(resendApiKey)
}
