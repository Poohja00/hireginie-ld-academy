import { sb, useSB } from './store.js'

function assertSB() {
  if (!useSB) throw new Error('Account settings require Supabase to be configured.')
}

export const Account = {
  async uploadAvatar(userId, file) {
    assertSB()
    const ext = (file.name.split('.').pop() || 'jpg').toLowerCase()
    const path = `${userId}/avatar.${ext}`
    const { error } = await sb.storage.from('avatars').upload(path, file, { upsert: true, cacheControl: '3600' })
    if (error) throw error
    const { data } = sb.storage.from('avatars').getPublicUrl(path)
    return data.publicUrl + '?t=' + Date.now()
  },

  async updateProfile(fields) {
    assertSB()
    const { error } = await sb.rpc('update_my_profile', {
      p_full_name: fields.full_name || null,
      p_avatar_url: fields.avatar_url || null,
      p_bio: fields.bio || null,
      p_location: fields.location || null,
      p_github: fields.github || null,
      p_linkedin: fields.linkedin || null,
      p_twitter: fields.twitter || null,
      p_website: fields.website || null,
      p_workplace: fields.workplace || null,
    })
    if (error) throw error
  },
}
