'use client'

import { Plus, Trash2 } from 'lucide-react'
import { useState, useEffect } from 'react'

const DEFAULT_SLOTS = ['10:00', '14:00', '18:00']

export default function TimeSlotSettings() {
  const [slots, setSlots] = useState<string[]>(DEFAULT_SLOTS)
  const [newSlot, setNewSlot] = useState('')
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetch('/api/settings/time-slots')
      .then((r) => r.json())
      .then((data) => setSlots(data.slots ?? DEFAULT_SLOTS))
      .catch(() => setError('Could not load time slots'))
  }, [])

  function addSlot() {
    if (!newSlot) return
    // <input type="time"> may return "HH:MM" or "HH:MM:SS" — normalise to "HH:MM"
    const normalized = newSlot.slice(0, 5)
    if (!/^\d{2}:\d{2}$/.test(normalized)) return
    if (slots.includes(normalized)) return
    setSlots((prev) => [...prev, normalized].sort())
    setNewSlot('')
    setSaved(false)
  }

  function removeSlot(slot: string) {
    setSlots((prev) => prev.filter((s) => s !== slot))
    setSaved(false)
  }

  async function saveSlots() {
    setSaving(true)
    setError(null)

    try {
      const res = await fetch('/api/settings/time-slots', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ slots }),
      })

      const data = await res.json().catch(() => ({}))

      if (res.ok) {
        setSlots(data.slots ?? slots)
        setSaved(true)
        setTimeout(() => setSaved(false), 2000)
      } else {
        setError(typeof data.error === 'string' ? data.error : 'Failed to save')
      }
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-xl font-semibold text-orange-800 mb-2">Available Time Slots</h3>
      <p className="text-sm text-orange-700 mb-4">
        These are the times clients can choose when booking a session.
      </p>

      <ul className="space-y-2 mb-4">
        {slots.map((slot) => (
          <li
            key={slot}
            className="flex items-center justify-between px-4 py-2 bg-orange-50 rounded-lg border border-orange-100"
          >
            <span className="font-medium text-orange-900">{slot}</span>
            <button
              type="button"
              onClick={() => removeSlot(slot)}
              aria-label={`Remove ${slot} time slot`}
              className="inline-flex items-center gap-1.5 rounded-lg border border-red-200 bg-white px-2.5 py-1.5 text-sm font-medium text-red-600 shadow-sm transition-all duration-200 ease-out hover:border-red-400 hover:bg-red-50 hover:text-red-700 hover:shadow-md active:scale-[0.97] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-red-400 focus-visible:ring-offset-1"
            >
              <Trash2 className="h-4 w-4" aria-hidden />
              Remove
            </button>
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2 mb-4">
        <input
          type="time"
          value={newSlot}
          onChange={(e) => setNewSlot(e.target.value)}
          className="px-3 py-2 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
        />
        <button
          type="button"
          onClick={addSlot}
          className="inline-flex items-center gap-1.5 px-4 py-2 bg-orange-100 text-orange-800 font-semibold rounded-lg hover:bg-orange-200 transition-colors"
        >
          <Plus className="h-4 w-4" aria-hidden />
          <span>Add Slot</span>
        </button>
      </div>

      {error && (
        <p className="text-red-600 text-sm mb-3">{error}</p>
      )}

      <button
        type="button"
        onClick={saveSlots}
        disabled={saving}
        className="px-6 py-2 bg-orange-800 hover:bg-orange-900 disabled:bg-orange-300 text-white font-semibold rounded-lg transition-colors"
      >
        {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
      </button>
    </div>
  )
}
