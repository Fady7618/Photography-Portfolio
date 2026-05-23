'use client'

import { useState, useEffect } from 'react'
import DashboardStats from '@/components/admin/DashboardStats'
import ReservationTable from '@/components/admin/ReservationTable'
import { Booking } from '@/types'
import { showAlert } from '@/utils/alert'

export default function DashboardPage() {
  const [bookings, setBookings] = useState<Booking[]>([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ total: 0, pending: 0, confirmed: 0, cancelled: 0 })

  useEffect(() => {
    loadBookings()
  }, [])

  useEffect(() => {
    const newStats = {
      total: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    }
    setStats(newStats)
  }, [bookings])

  async function loadBookings() {
    setLoading(true)
    const res = await fetch('/api/admin/bookings')
    const data = await res.json()
    setBookings(data.bookings || [])
    setLoading(false)
  }

  async function handleCancel(id: string) {
    const confirmed = await showAlert.confirm(
      'Cancel Booking?',
      'Are you sure you want to cancel this booking?'
    )
    if (!confirmed) return

    const res = await fetch(`/api/admin/bookings?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      await showAlert.success('Booking Cancelled', 'The booking has been cancelled successfully.')
      loadBookings()
    } else {
      await showAlert.error('Error', 'Failed to cancel the booking. Please try again.')
    }
  }

  async function handleClearAll() {
    const confirmed = await showAlert.warning(
      'Clear All Bookings?',
      'This will delete all bookings permanently. This action cannot be undone!'
    )
    if (!confirmed) return

    const res = await fetch('/api/admin/bookings?clearAll=true', { method: 'DELETE' })
    if (res.ok) {
      await showAlert.success('All Cleared', 'All bookings have been removed.')
      loadBookings()
    } else {
      await showAlert.error('Error', 'Failed to clear bookings. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-orange-200 rounded w-64 mb-6"></div>
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-orange-200 rounded"></div>
              ))}
            </div>
            <div className="h-96 bg-orange-200 rounded"></div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-100 p-8">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold text-orange-800 mb-6 plasterFont">Reservation Dashboard</h1>
        
        <DashboardStats {...stats} />
        
        <ReservationTable 
          bookings={bookings} 
          onCancel={handleCancel} 
          onClearAll={handleClearAll} 
        />
      </div>
    </div>
  )
}
