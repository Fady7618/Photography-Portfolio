'use client'

import { type ReactNode } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { getLoginUrl, RESERVATION_PATH } from '@/lib/auth-redirect'
import { showAlert } from '@/utils/alert'

interface BookNowLinkProps {
  className?: string
  children: ReactNode
  onClick?: () => void
}

export default function BookNowLink({ className, children, onClick }: BookNowLinkProps) {
  const router = useRouter()
  const { isAuthenticated, loading } = useAuth()

  async function handleClick() {
    onClick?.()

    if (!loading && !isAuthenticated) {
      await showAlert.toast('Please sign in to book a session', 'info')
      router.push(getLoginUrl(RESERVATION_PATH))
      return
    }

    router.push(RESERVATION_PATH)
  }

  return (
    <button type="button" onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
