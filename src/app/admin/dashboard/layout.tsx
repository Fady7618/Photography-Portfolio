import type { Metadata } from 'next'
import { adminRobots } from '@/lib/site-metadata'

export const metadata: Metadata = {
  title: 'Reservation Dashboard',
  robots: adminRobots,
}

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return children
}
