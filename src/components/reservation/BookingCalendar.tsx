'use client'

import { useState, useEffect, useMemo } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

type BookedDateEntry = {
  date: Date
  status: 'pending' | 'confirmed'
}

interface BookingCalendarProps {
  onDateSelect: (date: Date) => void
  selectedDate: Date | undefined
}

function parseSessionDate(dateStr: string): Date {
  const [year, month, day] = dateStr.split('-').map(Number)
  return new Date(year, month - 1, day)
}

export default function BookingCalendar({ onDateSelect, selectedDate }: BookingCalendarProps) {
  const [bookedDates, setBookedDates] = useState<BookedDateEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/bookings')
      .then((res) => res.json())
      .then(({ bookedDates: dates }) => {
        setBookedDates(
          (dates ?? []).map((entry: { date: string; status: 'pending' | 'confirmed' }) => ({
            date: parseSessionDate(entry.date),
            status: entry.status,
          }))
        )
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const pendingDates = useMemo(
    () => bookedDates.filter((b) => b.status === 'pending').map((b) => b.date),
    [bookedDates]
  )

  const confirmedDates = useMemo(
    () => bookedDates.filter((b) => b.status === 'confirmed').map((b) => b.date),
    [bookedDates]
  )

  const allBookedDates = useMemo(() => bookedDates.map((b) => b.date), [bookedDates])

  return (
    <div className="w-full max-w-md mx-auto">
      {loading ? (
        <div className="space-y-4">
          <div className="animate-pulse">
            <div className="h-8 bg-orange-200 rounded w-3/4 mx-auto mb-4"></div>
            <div className="bg-orange-100 rounded-lg p-6 space-y-3">
              <div className="h-6 bg-orange-200 rounded"></div>
              <div className="h-6 bg-orange-200 rounded"></div>
              <div className="h-6 bg-orange-200 rounded"></div>
            </div>
          </div>
        </div>
      ) : (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <DayPicker
            mode="single"
            selected={selectedDate}
            onSelect={(date) => date && onDateSelect(date)}
            disabled={[{ before: today }, ...allBookedDates]}
            modifiers={{ pending: pendingDates, confirmed: confirmedDates }}
            className="rdp-custom w-full"
          />

          <div className="mt-6 pt-4 border-t border-orange-100 flex flex-wrap justify-center gap-4 text-sm text-orange-800">
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: '#fef3c7', border: '1px solid #92400e' }}
              />
              <span>Pending</span>
            </div>
            <div className="flex items-center gap-2">
              <span
                className="inline-block w-3 h-3 rounded-full"
                style={{ backgroundColor: '#dcfce7', border: '1px solid #166534' }}
              />
              <span>Confirmed</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="inline-block w-3 h-3 rounded-full border border-orange-300 bg-white" />
              <span>Available</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
