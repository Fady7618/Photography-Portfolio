'use client'

import { useState } from 'react'
import { BookingCalendar, BookingForm, TimeSlotPicker } from '@/components/reservation'
import { showAlert } from '@/utils/alert'
import { formatTimeLabel } from '@/utils/formatters'

type Step = 'calendar' | 'timeslot' | 'form' | 'success'

export default function ReservationClient() {
  const [step, setStep] = useState<Step>('calendar')
  const [selectedDate, setSelectedDate] = useState<Date | undefined>()
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [bookingsRefresh, setBookingsRefresh] = useState(0)

  function handleDateSelect(date: Date) {
    setSelectedDate(date)
    setSelectedTime(null)
    setStep('timeslot')
  }

  function handleTimeSelect(time: string) {
    setSelectedTime(time)
    setStep('form')
  }

  if (step === 'success') {
    const dateLabel = selectedDate?.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
    const timeLabel = selectedTime ? formatTimeLabel(selectedTime) : ''

    return (
      <div className="min-h-screen bg-orange-100 flex items-center justify-center px-4 py-12">
        <div className="max-w-md w-full bg-white rounded-xl shadow-xl p-8 text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-orange-800 mb-4 plasterFont">
            Booking Request Sent!
          </h2>
          <p className="text-orange-700 mb-6">
            Your request for{' '}
            <span className="font-semibold">
              {dateLabel}
              {timeLabel ? ` at ${timeLabel}` : ''}
            </span>{' '}
            has been received. You will be contacted to confirm.
          </p>
          <button
            type="button"
            onClick={() => {
              setSelectedDate(undefined)
              setSelectedTime(null)
              setBookingsRefresh((n) => n + 1)
              setStep('calendar')
            }}
            className="w-full bg-orange-800 hover:bg-orange-900 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
          >
            Book Another Session
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-orange-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-orange-800 mb-4 plasterFont">
            Book a Session
          </h1>
          <p className="text-lg text-orange-700">
            {step === 'calendar' && 'Select an available date to begin your booking'}
            {step === 'timeslot' && 'Choose an available time slot'}
            {step === 'form' && 'Complete your booking details'}
          </p>
        </div>

        {step === 'calendar' && (
          <BookingCalendar
            onDateSelect={handleDateSelect}
            selectedDate={selectedDate}
            refreshTrigger={bookingsRefresh}
          />
        )}

        {step === 'timeslot' && selectedDate && (
          <TimeSlotPicker
            selectedDate={selectedDate}
            onSlotSelect={handleTimeSelect}
            selectedTime={selectedTime}
            onBack={() => setStep('calendar')}
          />
        )}

        {step === 'form' && selectedDate && selectedTime && (
          <BookingForm
            selectedDate={selectedDate}
            selectedTime={selectedTime}
            onSuccess={async () => {
              await showAlert.success(
                'Booking Confirmed!',
                'Your reservation has been submitted successfully.'
              )
              setBookingsRefresh((n) => n + 1)
              setStep('success')
            }}
            onCancel={() => setStep('timeslot')}
          />
        )}
      </div>
    </div>
  )
}
