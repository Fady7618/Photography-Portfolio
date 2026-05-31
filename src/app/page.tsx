import type { Metadata } from 'next'
import HomeClient from '@/components/HomeClient'

export const metadata: Metadata = {
  title: 'Book Your Session',
  description:
    'Professional wedding, portrait, and event photography. Explore our portfolio and book your session today.',
}

export default function HomePage() {
  return <HomeClient />
}
