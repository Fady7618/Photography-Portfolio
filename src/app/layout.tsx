import './globals.css'
import type { Metadata } from 'next'
import { Plaster, Rubik_Dirt } from 'next/font/google'
import { AuthProvider } from '@/context/AuthContext'
import LayoutClient from '@/components/LayoutClient'
import { rootMetadata, rootViewport } from '@/lib/site-metadata'

const plaster = Plaster({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-plaster',
})

const rubikDirt = Rubik_Dirt({
  weight: '400',
  subsets: ['latin'],
  variable: '--font-rubik-dirt',
})

export const metadata: Metadata = rootMetadata
export const viewport = rootViewport

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${plaster.variable} ${rubikDirt.variable}`}>
      <body suppressHydrationWarning>
        <AuthProvider>
          <LayoutClient>{children}</LayoutClient>
        </AuthProvider>
      </body>
    </html>
  )
}
