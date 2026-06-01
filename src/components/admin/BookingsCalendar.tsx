'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import FullCalendar from '@fullcalendar/react'
import dayGridPlugin from '@fullcalendar/daygrid'
import timeGridPlugin from '@fullcalendar/timegrid'
import interactionPlugin from '@fullcalendar/interaction'
import type { EventClickArg, EventInput } from '@fullcalendar/core'
import { formatTimeLabel } from '@/utils/formatters'
import { LoaderCircle, X } from 'lucide-react'

const CONTAINER_MOBILE_BREAKPOINT = 600

interface SelectedBooking {
  name: string
  email: string
  status: string
  notes?: string
  date: string
  time: string
}

function targetViewForWidth(width: number): 'timeGridDay' | 'timeGridWeek' {
  return width < CONTAINER_MOBILE_BREAKPOINT ? 'timeGridDay' : 'timeGridWeek'
}

export default function BookingsCalendar() {
  const [events, setEvents] = useState<EventInput[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedBooking, setSelectedBooking] = useState<SelectedBooking | null>(null)
  const [isMobile, setIsMobile] = useState(false)
  const calendarRef = useRef<InstanceType<typeof FullCalendar>>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const syncViewToContainer = useCallback((width: number) => {
    const mobile = width < CONTAINER_MOBILE_BREAKPOINT
    setIsMobile(mobile)
    const api = calendarRef.current?.getApi()
    if (!api) return
    const target = targetViewForWidth(width)
    if (api.view.type !== target) api.changeView(target)
  }, [])

  useEffect(() => {
    const el = containerRef.current
    if (!el) return

    const observer = new ResizeObserver(([entry]) => {
      syncViewToContainer(entry.contentRect.width)
    })

    observer.observe(el)
    return () => observer.disconnect()
  }, [syncViewToContainer])

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

  const handleEventClick = useCallback((info: EventClickArg) => {
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
  }, [])

  const handleWindowResize = useCallback(
    (arg: { view: { type: string; calendar: { changeView: (view: string) => void } } }) => {
      const width = containerRef.current?.offsetWidth ?? 0
      const target = targetViewForWidth(width)
      if (arg.view.type !== target) arg.view.calendar.changeView(target)
    },
    []
  )

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow p-8 flex gap-2 items-center">
        <LoaderCircle className="animate-spin text-orange-800" />
        <p className="text-orange-800">Loading calendar...</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow p-4 sm:p-6">
      <h2 className="text-xl font-semibold text-orange-800 mb-4 text-center lg:text-start">
        Bookings Calendar
      </h2>

      <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0">
        <div
          ref={containerRef}
          className="min-w-[280px] [&_.fc]:text-orange-900 [&_.fc-toolbar-title]:text-sm [&_.fc-toolbar-title]:sm:text-base [&_.fc-toolbar-title]:md:text-xl [&_.fc-toolbar]:flex-wrap [&_.fc-toolbar]:gap-2"
        >
          <FullCalendar
            ref={calendarRef}
            plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={
              isMobile
                ? {
                    left: 'prev,next',
                    center: 'title',
                    right: 'today',
                  }
                : {
                    left: 'prev,next today',
                    center: 'title',
                    right: 'dayGridMonth,timeGridWeek,timeGridDay',
                  }
            }
            footerToolbar={
              isMobile
                ? {
                    center: 'dayGridMonth,timeGridWeek,timeGridDay',
                  }
                : false
            }
            buttonText={{
              today: 'Today',
              month: 'Month',
              week: 'Week',
              day: 'Day',
            }}
            views={{
              timeGridWeek: {
                dayHeaderFormat: {
                  weekday: 'short',
                  month: 'numeric',
                  day: 'numeric',
                  omitCommas: true,
                },
              },
              timeGridDay: {
                dayHeaderFormat: {
                  weekday: 'long',
                  month: 'short',
                  day: 'numeric',
                },
              },
            }}
            events={events}
            eventClick={handleEventClick}
            windowResize={handleWindowResize}
            slotMinTime="08:00:00"
            slotMaxTime="22:00:00"
            height="auto"
            aspectRatio={1.8}
            nowIndicator
            slotDuration="01:00:00"
            // slotLabelInterval="02:00"
            eventDisplay="block"
            dayMaxEvents
            slotLabelFormat={{ hour: 'numeric', meridiem: 'short' }}
          />
        </div>
      </div>

      {selectedBooking && (
        <div className="mt-6 border border-orange-200 rounded-lg overflow-hidden">
          <div className="flex justify-between items-center px-4 py-3 bg-orange-50 border-b border-orange-200">
            <h3 className="text-base font-semibold text-orange-800">{selectedBooking.name}</h3>
            <button
              type="button"
              onClick={() => setSelectedBooking(null)}
              className="p-1 rounded text-orange-500 hover:text-orange-900 hover:bg-orange-100 transition-colors"
              aria-label="Close booking details"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2 text-sm text-orange-900">
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
              <p className="sm:col-span-2">
                <strong>Notes:</strong> {selectedBooking.notes}
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
