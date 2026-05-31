'use client'

import { useState, useCallback, useMemo } from 'react'
import DashboardStats from '@/components/admin/DashboardStats'
import ReservationTable from '@/components/admin/ReservationTable'
import { Booking } from '@/types'
import { showAlert } from '@/utils/alert'
import { useFetch } from '@/hooks/useFetch'

type BookingsResponse = {
  bookings: Booking[]
}

export default function DashboardClient() {
  const [refreshKey, setRefreshKey] = useState(0)
  const { data, loading } = useFetch<BookingsResponse>(`/api/admin/bookings?_v=${refreshKey}`)
  const bookings = useMemo(() => data?.bookings ?? [], [data?.bookings])

  const refresh = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  const stats = useMemo(
    () => ({
      total: bookings.length,
      pending: bookings.filter((b) => b.status === 'pending').length,
      confirmed: bookings.filter((b) => b.status === 'confirmed').length,
      cancelled: bookings.filter((b) => b.status === 'cancelled').length,
    }),
    [bookings]
  )

  async function handleApprove(id: string): Promise<void> {
    const confirmed = await showAlert.confirm(
      'Approve Booking?',
      'This will confirm the reservation and send a confirmation email to the client.'
    )
    if (!confirmed) return

    const res = await fetch(`/api/admin/bookings?id=${id}`, { method: 'PATCH' })
    const responseData = await res.json().catch(() => ({}))
    if (res.ok) {
      await showAlert.success(
        'Booking Approved',
        'The booking has been confirmed and the client has been notified.'
      )
      refresh()
    } else {
      await showAlert.error(
        'Approval Failed',
        typeof responseData.error === 'string'
          ? responseData.error
          : 'Failed to approve the booking. Please try again.'
      )
    }
  }

  async function handleCancel(id: string): Promise<void> {
    const confirmed = await showAlert.confirm(
      'Cancel Booking?',
      'Are you sure you want to cancel this booking?'
    )
    if (!confirmed) return

    const res = await fetch(`/api/admin/bookings?id=${id}`, { method: 'DELETE' })
    if (res.ok) {
      await showAlert.success('Booking Cancelled', 'The booking has been cancelled successfully.')
      refresh()
    } else {
      await showAlert.error('Error', 'Failed to cancel the booking. Please try again.')
    }
  }

  async function handleClearAll(): Promise<void> {
    const confirmed = await showAlert.warning(
      'Clear All Bookings?',
      'This will delete all bookings permanently. This action cannot be undone!'
    )
    if (!confirmed) return

    const res = await fetch('/api/admin/bookings?clearAll=true', { method: 'DELETE' })
    if (res.ok) {
      await showAlert.success('All Cleared', 'All bookings have been removed.')
      refresh()
    } else {
      await showAlert.error('Error', 'Failed to clear bookings. Please try again.')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-orange-100 p-8">
        <div className="max-w-7xl mx-auto">
          <div className="animate-pulse">
            <div className="h-8 bg-orange-200 rounded w-64 mb-6" />
            <div className="grid grid-cols-4 gap-4 mb-6">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-24 bg-orange-200 rounded" />
              ))}
            </div>
            <div className="h-96 bg-orange-200 rounded" />
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
          onApprove={handleApprove}
          onCancel={handleCancel}
          onClearAll={handleClearAll}
        />
      </div>
    </div>
  )
}
