import type { Metadata } from 'next'
import Link from 'next/link'
import { Camera, Heart, Sparkles } from 'lucide-react'

export const metadata: Metadata = {
  title: 'About',
  description:
    'Meet our photographer — specializing in weddings, portraits, and events with a documentary, light-filled style.',
}

const specialties = [
  {
    title: 'Weddings',
    description: 'From intimate ceremonies to full-day celebrations, capturing every meaningful moment.',
    icon: Heart,
  },
  {
    title: 'Portraits',
    description: 'Natural, flattering portraits for individuals, couples, and families.',
    icon: Sparkles,
  },
  {
    title: 'Events',
    description: 'Corporate gatherings, parties, and milestones documented with a candid eye.',
    icon: Camera,
  },
] as const

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-800 mb-4 plasterFont">
            About FUJIFILM Photography
          </h1>
          <p className="text-lg text-orange-700 max-w-2xl mx-auto">
            We believe every story deserves to be told beautifully — with warmth, authenticity, and
            attention to the details that matter most.
          </p>
        </header>

        <section className="bg-white rounded-xl shadow-lg p-8 border border-orange-200">
          <h2 className="text-2xl font-bold text-orange-800 mb-4 plasterFont">The Photographer</h2>
          <p className="text-orange-700 leading-relaxed mb-4">
            With over a decade behind the lens, our lead photographer specializes in documentary-style
            coverage that feels natural and unposed. Whether it is the quiet glance before vows or the
            laughter at a family reunion, the goal is always the same: images you will want to live with
            for years.
          </p>
          <p className="text-orange-700 leading-relaxed">
            Based locally and available for travel, sessions are tailored to your vision — from golden-hour
            portraits to full wedding weekends.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-orange-800 mb-6 text-center plasterFont">
            What We Shoot
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {specialties.map(({ title, description, icon: Icon }) => (
              <div
                key={title}
                className="bg-white rounded-xl shadow-md p-6 border border-orange-200 text-center"
              >
                <div className="inline-flex items-center justify-center w-12 h-12 rounded-full bg-orange-100 text-orange-800 mb-4">
                  <Icon className="h-6 w-6" aria-hidden />
                </div>
                <h3 className="text-lg font-semibold text-orange-800 mb-2">{title}</h3>
                <p className="text-sm text-orange-600">{description}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="bg-orange-800 rounded-xl shadow-lg p-8 text-orange-100">
          <h2 className="text-2xl font-bold mb-4 plasterFont">Equipment &amp; Approach</h2>
          <p className="leading-relaxed mb-4 text-orange-100/90">
            Sessions are shot with professional mirrorless bodies and fast prime lenses for sharp,
            low-light performance. We deliver fully edited, color-graded galleries — ready to print,
            share, or download.
          </p>
          <ul className="list-disc list-inside space-y-2 text-orange-100/90 text-sm">
            <li>Natural light preferred; off-camera flash when needed</li>
            <li>High-resolution files suitable for large prints</li>
            <li>Private online galleries for every client session</li>
          </ul>
        </section>

        <section className="text-center">
          <h2 className="text-2xl font-bold text-orange-800 mb-4 plasterFont">Ready to work together?</h2>
          <p className="text-orange-700 mb-6">
            Check availability and send a booking request — we typically respond within 24 hours.
          </p>
          <Link
            href="/reservation"
            className="inline-block bg-orange-800 hover:bg-orange-900 text-white font-semibold py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Book a Session
          </Link>
        </section>
      </div>
    </div>
  )
}
