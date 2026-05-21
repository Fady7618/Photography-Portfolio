import { createServerClient as createSSRServerClient } from '@supabase/ssr'
import { createClient } from '@supabase/supabase-js'
import { cookies } from 'next/headers'
import { getServerEnv, publicEnv } from './env'

export async function createAuthServerClient() {
  const cookieStore = await cookies()

  return createSSRServerClient(
    publicEnv.supabaseUrl,
    publicEnv.supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll()
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {
            // Server Component can't set cookies
          }
        },
      },
    }
  )
}

export function createServiceRoleClient() {
  const { supabaseServiceRoleKey } = getServerEnv()
  return createClient(publicEnv.supabaseUrl, supabaseServiceRoleKey)
}
