'use client'

import { useState, useEffect, useCallback } from 'react'
import { Plus, Link2, Copy, Upload, X } from 'lucide-react'
import UploadPanel from './UploadPanel'
import { ClientSession } from '@/types'
import { showAlert } from '@/utils/alert'

const inputClass =
  'w-full px-4 py-3 border-2 border-orange-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent transition-all'

const primaryBtnClass =
  'inline-flex items-center justify-center gap-2 bg-orange-800 hover:bg-orange-900 disabled:bg-orange-300 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg'

const outlineBtnClass =
  'inline-flex items-center justify-center gap-2 border-2 border-orange-800 text-orange-800 font-semibold py-2 px-4 rounded-lg hover:bg-orange-50 transition-all duration-300'

export default function SessionManager() {
  const [sessions, setSessions] = useState<ClientSession[]>([])
  const [activeSession, setActiveSession] = useState<ClientSession | null>(null)
  const [newSession, setNewSession] = useState({ client_name: '', client_email: '' })
  const [creating, setCreating] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [createWarning, setCreateWarning] = useState<string | null>(null)

  const loadSessions = useCallback(async () => {
    setError(null)
    const res = await fetch('/api/admin/sessions')
    if (!res.ok) {
      const data = await res.json().catch(() => ({}))
      setError(data.error || 'Failed to load sessions')
      setSessions([])
      return
    }
    const data = await res.json()
    setSessions(data.sessions || [])
  }, [])

  useEffect(() => {
    let active = true
    ;(async () => {
      setLoading(true)
      await loadSessions()
      if (active) setLoading(false)
    })()
    return () => {
      active = false
    }
  }, [loadSessions])

  async function createSession(): Promise<void> {
    if (!newSession.client_name || !newSession.client_email) return
    setCreating(true)
    setError(null)
    setCreateWarning(null)

    try {
      const res = await fetch('/api/admin/sessions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newSession),
      })

      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setError((data as { error?: string }).error || 'Failed to create session')
        return
      }

      const data = await res.json()
      const session = (data as { session?: ClientSession }).session

      if (!session) {
        setError('Failed to create session')
        return
      }

      const clientRes = await fetch('/api/admin/create-client', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          client_name: newSession.client_name,
          client_email: newSession.client_email,
          session_id: session.id,
        }),
      })

      if (!clientRes.ok) {
        const clientData = await clientRes.json().catch(() => ({}))
        setCreateWarning(
          `Session created but could not create client account: ${(clientData as { error?: string }).error || 'Unknown error'}`
        )
      }

      setSessions((prev) => [session, ...prev])
      setActiveSession(session)
      setNewSession({ client_name: '', client_email: '' })
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error('[SessionManager] createSession error:', err)
    } finally {
      setCreating(false)
    }
  }

  async function copyGalleryLink(token: string) {
    await navigator.clipboard.writeText(galleryLink(token))
    await showAlert.success('Link Copied', 'Gallery link copied to clipboard.')
  }

  const galleryLink = (token: string) =>
    `${typeof window !== 'undefined' ? window.location.origin : ''}/gallery/sessions?token=${token}`

  return (
    <div className="space-y-6">
      {/* Card 1 — Create New Session */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-orange-800 mb-4 plasterFont">Create New Session</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <div>
            <label htmlFor="client-name" className="block text-sm font-medium text-orange-800 mb-1">
              Client Name
            </label>
            <input
              id="client-name"
              type="text"
              placeholder="John Doe"
              value={newSession.client_name}
              onChange={(e) => setNewSession({ ...newSession, client_name: e.target.value })}
              className={inputClass}
            />
          </div>
          <div>
            <label htmlFor="client-email" className="block text-sm font-medium text-orange-800 mb-1">
              Client Email
            </label>
            <input
              id="client-email"
              type="email"
              placeholder="john@example.com"
              value={newSession.client_email}
              onChange={(e) => setNewSession({ ...newSession, client_email: e.target.value })}
              className={inputClass}
            />
          </div>
        </div>
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
            <p className="text-red-600 text-sm">{error}</p>
          </div>
        )}
        {createWarning && (
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3 mb-4">
            <p className="text-amber-800 text-sm">{createWarning}</p>
          </div>
        )}
        <button
          type="button"
          onClick={createSession}
          disabled={creating || !newSession.client_name || !newSession.client_email}
          className={primaryBtnClass}
        >
          <Plus className="h-4 w-4" />
          {creating ? 'Creating...' : 'Create Session'}
        </button>
      </div>

      {/* Card 2 — Active Upload */}
      {activeSession && (
        <div className="bg-white rounded-xl shadow-lg overflow-hidden">
          <div className="p-4 bg-orange-50 border-b border-orange-200 flex items-center justify-between">
            <h3 className="text-lg font-semibold text-orange-800 plasterFont">
              Upload to: {activeSession.client_name}
            </h3>
            <button
              type="button"
              onClick={() => setActiveSession(null)}
              className="p-2 text-orange-700 hover:bg-orange-100 rounded-lg transition-colors"
              title="Close upload panel"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
          <div className="p-6">
            <p className="text-sm font-medium text-orange-800 mb-2">Share this link with the client</p>
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 bg-orange-50 border border-orange-200 rounded-lg p-3 mb-6">
              <Link2 className="h-5 w-5 text-orange-600 shrink-0 hidden sm:block" />
              <a
                href={galleryLink(activeSession.access_token)}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-orange-700 truncate flex-1 hover:text-orange-900 underline-offset-2 hover:underline"
              >
                {galleryLink(activeSession.access_token)}
              </a>
              <button
                type="button"
                onClick={() => copyGalleryLink(activeSession.access_token)}
                className={outlineBtnClass}
              >
                <Copy className="h-4 w-4" />
                Copy
              </button>
            </div>
            <UploadPanel
              folderPath={activeSession.folder_path}
              onUploadComplete={() =>
                showAlert.success('Upload Complete!', 'Your files have been uploaded successfully.')
              }
            />
          </div>
        </div>
      )}

      {/* Card 3 — All Sessions */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="p-4 bg-orange-50 border-b border-orange-200">
          <h3 className="text-lg font-semibold text-orange-800">All Sessions</h3>
        </div>

        {loading ? (
          <div className="p-8 animate-pulse space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-12 bg-orange-200 rounded" />
            ))}
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-8 text-center">
            <p className="text-orange-700">No sessions yet. Create one above to get started.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-orange-100">
                <tr>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-orange-800">Client</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-orange-800">Email</th>
                  <th className="px-4 py-3 text-left text-sm font-semibold text-orange-800">Date</th>
                  <th className="px-4 py-3 text-center text-sm font-semibold text-orange-800">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-orange-100">
                {sessions.map((session) => (
                  <tr
                    key={session.id}
                    className={`hover:bg-orange-50 transition-colors ${
                      activeSession?.id === session.id ? 'bg-orange-50' : ''
                    }`}
                  >
                    <td className="px-4 py-3 text-sm font-medium text-orange-900">
                      {session.client_name}
                    </td>
                    <td className="px-4 py-3 text-sm text-orange-700">{session.client_email}</td>
                    <td className="px-4 py-3 text-sm text-orange-700">
                      {new Date(session.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                      })}
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex flex-wrap items-center justify-center gap-2">
                        <button
                          type="button"
                          onClick={() => setActiveSession(session)}
                          className={outlineBtnClass}
                        >
                          <Upload className="h-4 w-4" />
                          Upload Files
                        </button>
                        <button
                          type="button"
                          onClick={() => copyGalleryLink(session.access_token)}
                          className={outlineBtnClass}
                        >
                          <Copy className="h-4 w-4" />
                          Copy Link
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
