import { createAuthServerClient } from '@/lib/supabase-server'
import { Profile } from '@/types'
import { User } from '@supabase/supabase-js'

export const AuthService = {
  async getSession(): Promise<{ user: User | null }> {
    const supabase = await createAuthServerClient()
    const { data: { user } } = await supabase.auth.getUser()
    return { user }
  },

  async getProfile(userId: string): Promise<Profile | null> {
    const supabase = await createAuthServerClient()
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error || !data) return null
    return data
  },

  async getProfileWithSession(): Promise<{ user: User | null; profile: Profile | null }> {
    const { user } = await this.getSession()
    if (!user) return { user: null, profile: null }

    const profile = await this.getProfile(user.id)
    return { user, profile }
  },
}
