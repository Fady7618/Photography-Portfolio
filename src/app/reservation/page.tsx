import type { Metadata } from 'next'
import ReservationClient from '@/components/reservation/ReservationClient'

export const metadata: Metadata = {
  title: 'Book a Session',
  description: 'Choose an available date and submit your photography session booking request.',
}

export default function ReservationPage() {
  return <ReservationClient />
}
