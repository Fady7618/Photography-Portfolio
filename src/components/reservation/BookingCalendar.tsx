'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { DayButton, DayPicker, type DayButtonProps } from 'react-day-picker'
import 'react-day-picker/dist/style.css'
import { toISODate } from '@/utils/formatters'

type BookingStatus = 'pending' | 'confirmed'

interface BookingCalendarProps {
  onDateSelect: (date: Date) => void
  selectedDate: Date | undefined
  refreshTrigger?: number
}

function StatusDayButton({
  statusByDate,
  day,
  className,
  ...props
}: DayButtonProps & { statusByDate: Map<string, BookingStatus> }) {
  const status = statusByDate.get(toISODate(day.date))
  const statusClass =
    status === 'pending'
      ? 'rdp-status-pending'
      : status === 'confirmed'
        ? 'rdp-status-confirmed'
        : ''

  return (
    <DayButton
      day={day}
      className={[className, statusClass].filter(Boolean).join(' ')}
      {...props}
    />
  )
}

export default function BookingCalendar({
  onDateSelect,
  selectedDate,
  refreshTrigger = 0,
}: BookingCalendarProps) {
  const [statusByDate, setStatusByDate] = useState<Map<string, BookingStatus>>(new Map())
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)

    fetch('/api/bookings')
      .then((res) => res.json())
      .then(({ bookedDates: dates }) => {
        if (!active) return
        const map = new Map<string, BookingStatus>()
        for (const entry of dates ?? []) {
          const iso = String(entry.date).split('T')[0]
          const status = String(entry.status).toLowerCase().trim()
          map.set(iso, status === 'confirmed' ? 'confirmed' : 'pending')
        }
        setStatusByDate(map)
        setLoading(false)
      })
      .catch(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [refreshTrigger])

  const today = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    return d
  }, [])

  const isDateBooked = useCallback(
    (date: Date) => statusByDate.has(toISODate(date)),
    [statusByDate]
  )

  const components = useMemo(
    () => ({
      DayButton: (props: DayButtonProps) => (
        <StatusDayButton {...props} statusByDate={statusByDate} />
      ),
    }),
    [statusByDate]
  )

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
            disabled={[{ before: today }, isDateBooked]}
            components={components}
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
