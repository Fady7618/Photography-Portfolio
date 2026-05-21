function requireEnv(key: string, value: string | undefined): string {
  if (!value) throw new Error(`Missing required environment variable: ${key}`)
  return value
}

/** Safe for client bundles — only NEXT_PUBLIC_* variables */
export const publicEnv = {
  supabaseUrl: requireEnv(
    'NEXT_PUBLIC_SUPABASE_URL',
    process.env.NEXT_PUBLIC_SUPABASE_URL
  ),
  supabaseAnonKey: requireEnv(
    'NEXT_PUBLIC_SUPABASE_ANON_KEY',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ),
}

/** Server-only — call inside API routes / services, never from client components */
export function getServerEnv() {
  return {
    supabaseServiceRoleKey: requireEnv(
      'SUPABASE_SERVICE_ROLE_KEY',
      process.env.SUPABASE_SERVICE_ROLE_KEY
    ),
    resendApiKey: requireEnv('RESEND_API_KEY', process.env.RESEND_API_KEY),
    photographerEmail: requireEnv(
      'PHOTOGRAPHER_EMAIL',
      process.env.PHOTOGRAPHER_EMAIL
    ),
  }
}
