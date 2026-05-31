import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Portfolio',
  description:
    'Browse our wedding, portrait, and event photography portfolio. View your private client sessions when signed in.',
}

export default function GalleryLayout({ children }: { children: React.ReactNode }) {
  return children
}
