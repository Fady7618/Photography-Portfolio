'use client'

import { Booking } from '@/types'
import { formatDate } from '@/utils/formatters'
import { Check, Trash2, X } from 'lucide-react'

interface ReservationTableProps {
  bookings: Booking[]
  onApprove: (id: string) => void
  onCancel: (id: string) => void
  onClearAll: () => void
}

export default function ReservationTable({ bookings, onApprove, onCancel, onClearAll }: ReservationTableProps) {
  if (bookings.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-8 text-center">
        <p className="text-orange-700">No reservations yet</p>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="p-4 bg-orange-50 border-b border-orange-200 flex justify-between items-center">
        <h3 className="text-lg font-semibold text-orange-800">All Reservations</h3>
        <button
          onClick={onClearAll}
          className="flex items-center space-x-2 px-4 py-2 bg-red-600 hover:bg-red-700 text-white border border-red-700 rounded-lg transition-colors"
        >
          <Trash2 className="h-4 w-4" />
          <span>Clear All</span>
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-orange-100">
            <tr>
              <th className="px-4 py-3 text-left text-sm font-semibold text-orange-800">Date</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-orange-800">Client Name</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-orange-800">Email</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-orange-800">Status</th>
              <th className="px-4 py-3 text-left text-sm font-semibold text-orange-800">Notes</th>
              <th className="px-4 py-3 text-center text-sm font-semibold text-orange-800">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-orange-100">
            {bookings.map((booking) => (
              <tr key={booking.id} className="hover:bg-orange-50 transition-colors">
                <td className="px-4 py-3 text-sm text-orange-900">
                  {formatDate(booking.session_date)}
                </td>
                <td className="px-4 py-3 text-sm font-medium text-orange-900">
                  {booking.client_name}
                </td>
                <td className="px-4 py-3 text-sm text-orange-700">{booking.client_email}</td>
                <td className="px-4 py-3">
                  <span
                    className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      booking.status === 'confirmed'
                        ? 'bg-green-100 text-green-800'
                        : booking.status === 'cancelled'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-yellow-100 text-yellow-800'
                    }`}
                  >
                    {booking.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-sm text-orange-700 max-w-xs truncate">
                  {booking.notes || '-'}
                </td>
                <td className="px-4 py-3 text-center">
                  <div className="flex items-center justify-center gap-2">
                    {booking.status === 'pending' && (
                      <button
                        onClick={() => onApprove(booking.id)}
                        className="p-2 text-green-600 border border-green-300 hover:bg-green-50 hover:border-green-500 rounded-lg transition-colors cursor-pointer"
                        title="Approve booking"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                    )}
                    {(booking.status === 'pending' || booking.status === 'confirmed') && (
                      <button
                        onClick={() => onCancel(booking.id)}
                        className="p-2 text-red-600 border border-red-300 hover:bg-red-50 hover:border-red-500 rounded-lg transition-colors cursor-pointer"
                        title="Cancel booking"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
