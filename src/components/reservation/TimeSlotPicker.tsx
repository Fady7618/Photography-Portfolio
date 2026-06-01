'use client'

import { useState, useEffect } from 'react'
import { TimeSlot } from '@/types'
import { formatTimeLabel, toISODate } from '@/utils/formatters'

interface TimeSlotPickerProps {
  selectedDate: Date
  onSlotSelect: (time: string) => void
  selectedTime: string | null
  onBack: () => void
}

export default function TimeSlotPicker({
  selectedDate,
  onSlotSelect,
  selectedTime,
  onBack,
}: TimeSlotPickerProps) {
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [loadedDateStr, setLoadedDateStr] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  const dateStr = toISODate(selectedDate)
  const loading = loadedDateStr !== dateStr
  const displaySlots = loadedDateStr === dateStr ? slots : []
  const hasAvailableSlots = displaySlots.some((s) => s.available)

  const dateLabel = selectedDate.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })

  useEffect(() => {
    let active = true

    Promise.all([
      fetch('/api/settings/time-slots').then((r) => r.json()),
      fetch(`/api/bookings?date=${dateStr}`).then((r) => r.json()),
    ])
      .then(([settingsData, bookingsData]) => {
        if (!active) return
        const allSlots: string[] = settingsData.slots ?? ['10:00', '14:00', '18:00']
        const bookedTimes: string[] = bookingsData.bookedTimes ?? []

        setError(null)
        setSlots(
          allSlots.map((time) => ({
            time,
            label: formatTimeLabel(time),
            available: !bookedTimes.includes(time),
          }))
        )
        setLoadedDateStr(dateStr)
      })
      .catch(() => {
        if (!active) return
        setError('Could not load time slots. Please refresh.')
        setLoadedDateStr(dateStr)
      })

    return () => {
      active = false
    }
  }, [dateStr])

  if (loading) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <p className="text-orange-700 text-center">Loading available times...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
        <p className="text-red-600 text-sm text-center">{error}</p>
        <button
          type="button"
          onClick={onBack}
          className="mt-4 w-full px-6 py-3 border-2 border-orange-800 text-orange-800 font-semibold rounded-lg hover:bg-orange-50 transition-all"
        >
          Back
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
      <h3 className="text-2xl font-bold text-orange-800 mb-2 text-center plasterFont">
        Choose a Time
      </h3>
      <p className="text-orange-700 text-center mb-6">Select a time for {dateLabel}</p>

      {!hasAvailableSlots ? (
        <p className="text-orange-700 text-center mb-6">
          No slots available on this date. Please pick another day.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-6">
          {displaySlots.map((slot) => {
            const isSelected = selectedTime === slot.time
            return (
              <button
                key={slot.time}
                type="button"
                onClick={() => slot.available && onSlotSelect(slot.time)}
                disabled={!slot.available}
                aria-pressed={isSelected}
                className={[
                  'px-4 py-3 rounded-lg border-2 font-semibold transition-all text-sm',
                  !slot.available
                    ? 'border-orange-100 bg-orange-50 text-orange-300 cursor-not-allowed'
                    : isSelected
                      ? 'border-orange-800 bg-orange-800 text-white shadow-md'
                      : 'border-orange-200 text-orange-800 hover:border-orange-500 hover:bg-orange-50',
                ].join(' ')}
              >
                {slot.label}
                {!slot.available && (
                  <span className="block text-xs font-normal mt-0.5 opacity-80">Booked</span>
                )}
              </button>
            )
          })}
        </div>
      )}

      <button
        type="button"
        onClick={onBack}
        className="w-full px-6 py-3 border-2 border-orange-800 text-orange-800 font-semibold rounded-lg hover:bg-orange-50 transition-all"
      >
        Back
      </button>
    </div>
  )
}
