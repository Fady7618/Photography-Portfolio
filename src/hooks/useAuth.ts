'use client'

import { useState, useEffect, useMemo } from 'react'
import { createClient } from '@/lib/supabase'
import { Profile } from '@/types'
import { User } from '@supabase/supabase-js'

type AuthState = {
  user: User | null
  profile: Profile | null
  loading: boolean
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  })

  const supabase = useMemo(() => createClient(), [])

  useEffect(() => {
    async function loadUser() {
      const { data: { user } } = await supabase.auth.getUser()

      if (!user) {
        setState({ user: null, profile: null, loading: false })
        return
      }

      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single()

      setState({ user, profile, loading: false })
    }

    loadUser()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single()

        setState({ user: session.user, profile, loading: false })
      } else {
        setState({ user: null, profile: null, loading: false })
      }
    })

    return () => {
      subscription.unsubscribe()
    }
  }, [supabase])

  async function signOut(): Promise<void> {
    await supabase.auth.signOut()
    setState({ user: null, profile: null, loading: false })
  }

  return {
    user: state.user,
    profile: state.profile,
    loading: state.loading,
    isAdmin: state.profile?.role === 'admin',
    isAuthenticated: !!state.user,
    signOut,
  }
}
