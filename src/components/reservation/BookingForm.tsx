'use client'

import { useState } from 'react'
import { useMutation } from '@/hooks/useMutation'
import { BookingFormData, Booking } from '@/types'
import { toISODate } from '@/utils/formatters'

interface BookingFormProps {
  selectedDate: Date
  onSuccess: () => void | Promise<void>
  onCancel: () => void
}

export default function BookingForm({ selectedDate, onSuccess, onCancel }: BookingFormProps) {
  const [form, setForm] = useState({ client_name: '', client_email: '', notes: '' })
  const { loading, error, mutate } = useMutation<Booking, BookingFormData>('/api/bookings')

  const formattedDate = toISODate(selectedDate)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()

    const payload: BookingFormData = {
      ...form,
      session_date: formattedDate,
    }

    const result = await mutate(payload)
    if (result) onSuccess()
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto bg-white rounded-xl shadow-lg p-8 space-y-6">
      <div className="text-center">
        <h3 className="text-2xl font-bold text-orange-800 mb-2 plasterFont">
          Book Your Session
        </h3>
        <p className="text-orange-700">
          {selectedDate.toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })}
        </p>
      </div>

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-orange-800 mb-1">
            Your Name
          </label>
          <input
            id="name"
            type="text"
            placeholder="John Doe"
            required
            value={form.client_name}
            onChange={(e) => setForm({ ...form, client_name: e.target.value })}
            className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-orange-800 mb-1">
            Your Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="john@example.com"
            required
            value={form.client_email}
            onChange={(e) => setForm({ ...form, client_email: e.target.value })}
            className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all"
          />
        </div>

        <div>
          <label htmlFor="notes" className="block text-sm font-medium text-orange-800 mb-1">
            Notes or Requests (Optional)
          </label>
          <textarea
            id="notes"
            placeholder="Tell us about your vision..."
            value={form.notes}
            onChange={(e) => setForm({ ...form, notes: e.target.value })}
            rows={4}
            className="w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all resize-none"
          />
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-red-600 text-sm">{error}</p>
        </div>
      )}

      <div className="flex gap-3">
        <button 
          type="button" 
          onClick={onCancel}
          className="flex-1 px-6 py-3 border-2 border-orange-800 text-orange-800 font-semibold rounded-lg hover:bg-orange-50 transition-all duration-300"
        >
          Back
        </button>
        <button 
          type="submit" 
          disabled={loading}
          className="flex-1 bg-orange-800 hover:bg-orange-900 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg"
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </div>
    </form>
  )
}
