import type { Metadata, Viewport } from 'next'

export const siteConfig = {
  name: 'FUJIFILM Photography',
  description:
    'Professional wedding, portrait, and event photography. Book your session and view your private gallery online.',
  url: process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000',
}

export const rootMetadata: Metadata = {
  metadataBase: new URL(siteConfig.url),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  openGraph: {
    type: 'website',
    locale: 'en_US',
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
  },
  twitter: {
    card: 'summary_large_image',
    title: siteConfig.name,
    description: siteConfig.description,
  },
  icons: {
    icon: '/logo.ico',
    apple: '/apple-touch-icon.png',
  },
}

export const adminRobots: Metadata['robots'] = {
  index: false,
  follow: false,
}

export const rootViewport: Viewport = {
  themeColor: '#ea580c',
}
