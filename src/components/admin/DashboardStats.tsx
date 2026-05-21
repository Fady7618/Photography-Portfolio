'use client'

import { Calendar, CheckCircle, Clock, XCircle } from 'lucide-react'

interface DashboardStatsProps {
  total: number
  pending: number
  confirmed: number
  cancelled: number
}

export default function DashboardStats({ total, pending, confirmed, cancelled }: DashboardStatsProps) {
  const stats = [
    { label: 'Total Bookings', value: total, icon: Calendar, color: 'bg-blue-100 text-blue-800' },
    { label: 'Pending', value: pending, icon: Clock, color: 'bg-yellow-100 text-yellow-800' },
    { label: 'Confirmed', value: confirmed, icon: CheckCircle, color: 'bg-green-100 text-green-800' },
    { label: 'Cancelled', value: cancelled, icon: XCircle, color: 'bg-red-100 text-red-800' },
  ]

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <div key={stat.label} className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-orange-600 font-medium">{stat.label}</p>
                <p className="text-3xl font-bold text-orange-900 mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg ${stat.color}`}>
                <Icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
