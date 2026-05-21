'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase'
import UploadPanel from './UploadPanel'
import { ClientSession } from '@/types'
import { showAlert } from '@/utils/alert'

export default function SessionManager() {
  const [sessions, setSessions] = useState<ClientSession[]>([])
  const [activeSession, setActiveSession] = useState<ClientSession | null>(null)
  const [newSession, setNewSession] = useState({ client_name: '', client_email: '' })
  const [creating, setCreating] = useState(false)
  const supabase = createClient()

  useEffect(() => { loadSessions() }, [])

  async function loadSessions() {
    const { data } = await supabase.from('client_sessions').select('*').order('created_at', { ascending: false })
    setSessions(data || [])
  }

  async function createSession() {
    if (!newSession.client_name || !newSession.client_email) return
    setCreating(true)

    const slug = `${newSession.client_name.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`
    const folderPath = `sessions/${slug}`

    const { data, error } = await supabase
      .from('client_sessions')
      .insert({ ...newSession, folder_path: folderPath })
      .select()
      .single()

    if (!error && data) {
      setSessions((prev) => [data, ...prev])
      setActiveSession(data)
      setNewSession({ client_name: '', client_email: '' })
    }
    setCreating(false)
  }

  const galleryLink = (token: string) =>
    `${typeof window !== 'undefined' ? window.location.origin : ''}/gallery?token=${token}`

  return (
    <div className="session-manager">
      <h2>Client Sessions</h2>

      <div className="create-session">
        <h3>Create New Session</h3>
        <input
          type="text"
          placeholder="Client name"
          value={newSession.client_name}
          onChange={(e) => setNewSession({ ...newSession, client_name: e.target.value })}
        />
        <input
          type="email"
          placeholder="Client email"
          value={newSession.client_email}
          onChange={(e) => setNewSession({ ...newSession, client_email: e.target.value })}
        />
        <button onClick={createSession} disabled={creating}>
          {creating ? 'Creating...' : 'Create Session'}
        </button>
      </div>

      {activeSession && (
        <div className="active-upload">
          <h3>Upload to: {activeSession.client_name}</h3>
          <p>
            Share this link with the client:{' '}
            <a href={galleryLink(activeSession.access_token)} target="_blank" rel="noopener noreferrer">
              {galleryLink(activeSession.access_token)}
            </a>
            <button onClick={() => navigator.clipboard.writeText(galleryLink(activeSession.access_token))}>
              Copy
            </button>
          </p>
          <UploadPanel
            folderPath={activeSession.folder_path}
            onUploadComplete={() => showAlert.success('Upload Complete!', 'Your files have been uploaded successfully.')}
          />
        </div>
      )}

      <div className="sessions-list">
        <h3>All Sessions</h3>
        {sessions.map((session) => (
          <div key={session.id} className="session-item">
            <div>
              <strong>{session.client_name}</strong>
              <span>{session.client_email}</span>
              <span>{new Date(session.created_at).toLocaleDateString()}</span>
            </div>
            <div>
              <button onClick={() => setActiveSession(session)}>Upload Files</button>
              <button onClick={() => navigator.clipboard.writeText(galleryLink(session.access_token))}>
                Copy Link
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
