import { createServiceRoleClient } from '@/lib/supabase-server'
import { AppError } from '@/lib/api-helpers'

const TOKEN_EXPIRY_DAYS = 5
const TOKEN_EXPIRY_MS = TOKEN_EXPIRY_DAYS * 24 * 60 * 60 * 1000

export const ClientService = {
  async createOrFindUser(email: string, name: string): Promise<string> {
    const supabase = createServiceRoleClient()

    const { data: newUser, error: createError } = await supabase.auth.admin.createUser({
      email,
      email_confirm: true,
      user_metadata: { full_name: name },
    })

    if (!createError) {
      return newUser.user.id
    }

    if (createError.message.includes('already been registered')) {
      const { data: existingUsers, error: listError } = await supabase.auth.admin.listUsers()

      if (listError) {
        throw new Error(listError.message)
      }

      const existing = existingUsers?.users.find((u) => u.email === email)
      if (!existing) {
        throw new AppError('User exists but could not be found', 500)
      }

      return existing.id
    }

    throw new Error(createError.message)
  },

  async linkUserToSession(sessionId: string, userId: string): Promise<string> {
    const supabase = createServiceRoleClient()
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRY_MS).toISOString()

    const { error } = await supabase
      .from('client_sessions')
      .update({
        user_id: userId,
        token_expires_at: expiresAt,
      })
      .eq('id', sessionId)

    if (error) {
      throw new Error(error.message)
    }

    return expiresAt
  },
}
