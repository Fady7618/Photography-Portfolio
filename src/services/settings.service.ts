import { createServiceRoleClient } from '@/lib/supabase-server'

const SETTING_KEY = 'available_time_slots'
const DEFAULT_SLOTS = ['10:00', '14:00', '18:00']

export const SettingsService = {
  async getAvailableSlots(): Promise<string[]> {
    const supabase = createServiceRoleClient()
    const { data, error } = await supabase
      .from('photographer_settings')
      .select('setting_value')
      .eq('setting_key', SETTING_KEY)
      .single()

    if (error || !data?.setting_value) {
      return [...DEFAULT_SLOTS]
    }

    const value = data.setting_value
    if (Array.isArray(value) && value.every((s) => typeof s === 'string')) {
      return value as string[]
    }

    return [...DEFAULT_SLOTS]
  },

  async upsertAvailableSlots(slots: string[]): Promise<string[]> {
    const supabase = createServiceRoleClient()
    const sorted = [...slots].sort()

    const { error } = await supabase.from('photographer_settings').upsert(
      {
        setting_key: SETTING_KEY,
        setting_value: sorted,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'setting_key' }
    )

    if (error) throw new Error(error.message)
    return sorted
  },
}
