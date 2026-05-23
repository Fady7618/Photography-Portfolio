'use client'

import { useState, useEffect } from 'react'
import { DayPicker } from 'react-day-picker'
import 'react-day-picker/dist/style.css'

interface BookingCalendarProps {
  onDateSelect: (date: Date) => void
  selectedDate: Date | undefined
}

export default function BookingCalendar({ onDateSelect, selectedDate }: BookingCalendarProps) {
  const [bookedDates, setBookedDates] = useState<Date[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/bookings')
      .then((res) => res.json())
      .then(({ bookedDates }) => {
        setBookedDates(bookedDates.map((d: string) => new Date(d)))
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const today = new Date()
  today.setHours(0, 0, 0, 0)

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
            disabled={[
              { before: today },
              ...bookedDates,
            ]}
            className="rdp-custom"
          />
        </div>
      )}
    </div>
  )
}
