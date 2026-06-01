'use client'

import { useState, useEffect } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg, EventInput } from '@fullcalendar/core'
import { formatTimeLabel } from '@/utils/formatters'
import { LoaderCircle } from 'lucide-react'

interface SelectedBooking {
  name: string
  email: string
  status: string
  notes?: string
  date: string
  time: string
}

export default function BookingsCalendar() {
  const [events, setEvents] = useState<EventInput[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<SelectedBooking | null>(null)

  useEffect(() => {
    let active = true

    fetch('/api/admin/bookings/calendar')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to load calendar')
        return res.json()
      })
      .then((data) => {
        if (!active) return
        setEvents(data.events ?? [])
        setLoading(false)
      })
      .catch(() => {
        if (active) setLoading(false)
      })

    return () => {
      active = false
    }
  }, [])

  function handleEventClick(info: EventClickArg) {
    const props = info.event.extendedProps as {
      email: string
      status: string
      notes?: string
      time: string
    }

    setSelectedBooking({
      name: info.event.title,
      email: props.email,
      status: props.status,
      notes: props.notes,
      date:
        info.event.start?.toLocaleDateString('en-US', {
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric',
        }) ?? '',
      time: formatTimeLabel(props.time) || props.time,
    })
  }

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 flex gap-2">
        <LoaderCircle className="animate-spin text-orange-800" />
        <p className="text-orange-800">Loading calendar...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-xl font-semibold text-orange-800 mb-4">Bookings Calendar</h2>

      <div className="bookings-calendar [&_.fc]:text-orange-900">
        <FullCalendar
          plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
          initialView="timeGridWeek"
          headerToolbar={{
            left: 'prev,next today',
            center: 'title',
            right: 'dayGridMonth,timeGridWeek,timeGridDay',
          }}
          events={events}
          eventClick={handleEventClick}
          slotMinTime="08:00:00"
          slotMaxTime="22:00:00"
          height="auto"
          nowIndicator
          slotDuration="01:00:00"
          eventDisplay="block"
          dayMaxEvents
        />
      </div>

      {selectedBooking && (
        <div className="mt-6 border border-orange-200 rounded-lg overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 bg-orange-50 border-b border-orange-200">
            <h3 className="text-lg font-semibold text-orange-800">{selectedBooking.name}</h3>
            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              className="text-orange-600 hover:text-orange-900 text-2xl leading-none px-2"
              aria-label="Close"
            >
              ×
            </button>
          </div>
          <div className="p-4 space-y-2 text-sm text-orange-900">
            <p>
              <strong>Email:</strong> {selectedBooking.email}
            </p>
            <p>
              <strong>Date:</strong> {selectedBooking.date}
            </p>
            <p>
              <strong>Time:</strong> {selectedBooking.time}
            </p>
            <p>
              <strong>Status:</strong>{' '}
              <span
                className={`inline-flex px-2 py-0.5 text-xs font-semibold rounded-full ${
                  selectedBooking.status === 'confirmed'
                    ? 'bg-green-100 text-green-800'
                    : selectedBooking.status === 'cancelled'
                      ? 'bg-red-100 text-red-800'
                      : 'bg-yellow-100 text-yellow-800'
                }`}
              >
                {selectedBooking.status}
              </span>
            </p>
            {selectedBooking.notes && (
              <p>
                <strong>Notes:</strong> {selectedBooking.notes}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
