'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { User } from '@supabase/supabase-js'
import { createClient } from '@/lib/supabase'
import { Profile } from '@/types'

type AuthState = {
  user: User | null
  profile: Profile | null
  loading: boolean
}

export type AuthContextValue = {
  user: User | null
  profile: Profile | null
  loading: boolean
  isAdmin: boolean
  isAuthenticated: boolean
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    profile: null,
    loading: true,
  })

  const supabase = useMemo(() => createClient(), [])
  const mountedRef = useRef(true)

  const fetchProfile = useCallback(
    async (userId: string): Promise<Profile | null> => {
      const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      return profile
    },
    [supabase]
  )

  useEffect(() => {
    mountedRef.current = true

    async function loadUser(): Promise<void> {
      try {
        const {
          data: { user },
        } = await supabase.auth.getUser()

        if (!mountedRef.current) return

        if (!user) {
          setState({ user: null, profile: null, loading: false })
          return
        }

        const profile = await fetchProfile(user.id)

        if (!mountedRef.current) return

        setState({ user, profile, loading: false })
      } catch {
        if (!mountedRef.current) return
        setState({ user: null, profile: null, loading: false })
      }
    }

    loadUser()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mountedRef.current) return

      if (session?.user) {
        setTimeout(() => {
          void (async () => {
            try {
              const profile = await fetchProfile(session.user.id)

              if (!mountedRef.current) return

              setState({ user: session.user, profile, loading: false })
            } catch {
              if (!mountedRef.current) return

              setState({ user: session.user, profile: null, loading: false })
            }
          })()
        }, 0)
      } else {
        setState({ user: null, profile: null, loading: false })
      }
    })

    return () => {
      mountedRef.current = false
      subscription.unsubscribe()
    }
  }, [supabase, fetchProfile])

  const signOut = useCallback(async (): Promise<void> => {
    await supabase.auth.signOut()

    if (mountedRef.current) {
      setState({ user: null, profile: null, loading: false })
    }
  }, [supabase])

  const value: AuthContextValue = {
    user: state.user,
    profile: state.profile,
    loading: state.loading,
    isAdmin: state.profile?.role === 'admin',
    isAuthenticated: !!state.user,
    signOut,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuthContext(): AuthContextValue {
  const context = useContext(AuthContext)

  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }

  return context
}
