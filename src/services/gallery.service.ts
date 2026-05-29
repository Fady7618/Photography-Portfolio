import { createServiceRoleClient } from '@/lib/supabase-server'
import { AppError } from '@/lib/api-helpers'
import { ClientSession, SessionFile } from '@/types'

export const GalleryService = {
  async verifyToken(token: string): Promise<ClientSession> {
    const supabase = createServiceRoleClient()

    const { data: session, error } = await supabase
      .from('client_sessions')
      .select('*')
      .eq('access_token', token)
      .single()

    if (error || !session) {
      throw new AppError('Invalid or expired token', 401)
    }

    if (session.token_expires_at && new Date(session.token_expires_at) < new Date()) {
      throw new AppError('This link has expired', 401)
    }

    return session
  },

  async getUserSessions(userId: string): Promise<ClientSession[]> {
    const supabase = createServiceRoleClient()

    const { data, error } = await supabase
      .from('client_sessions')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })

    if (error) throw new Error(error.message)
    return data || []
  },

  async getSessionFiles(folderPath: string): Promise<SessionFile[]> {
    const supabase = createServiceRoleClient()

    const { data: files, error } = await supabase.storage
      .from('sessions')
      .list(folderPath, { limit: 1000, sortBy: { column: 'name', order: 'asc' } })

    if (error) throw new Error(error.message)

    const signedFiles: SessionFile[] = await Promise.all(
      (files || []).map(async (file) => {
        const filePath = `${folderPath}/${file.name}`
        // 24h TTL: balances UX (long gallery sessions) vs. link exposure if URL is shared
        const { data: urlData } = await supabase.storage
          .from('sessions')
          .createSignedUrl(filePath, 86400)

        const ext = file.name.split('.').pop()?.toLowerCase() || ''
        const type: SessionFile['type'] = ['jpg','jpeg','png','webp','heic'].includes(ext)
          ? 'image'
          : ['mp4','mov','avi','webm'].includes(ext)
          ? 'video'
          : 'other'

        return {
          name: file.name,
          url: urlData?.signedUrl || '',
          size: file.metadata?.size || 0,
          type,
          created_at: file.created_at || '',
        }
      })
    )

    return signedFiles
  },
}
