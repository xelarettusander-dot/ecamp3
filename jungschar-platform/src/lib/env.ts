/**
 * Public Supabase config for the self-hosted instance at
 * https://supabase.jungschar-gelterkinden.ch
 *
 * Self-hosted stacks often still expose the legacy `anon` key.
 * Newer projects may use a publishable key — both are supported.
 */
export function getSupabaseUrl(): string {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim()
  if (!url) {
    throw new Error('NEXT_PUBLIC_SUPABASE_URL is not set')
  }
  return url.replace(/\/$/, '')
}

export function getSupabasePublicKey(): string {
  const key =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY?.trim() ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.trim()

  if (!key) {
    throw new Error(
      'Set NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY or NEXT_PUBLIC_SUPABASE_ANON_KEY'
    )
  }

  return key
}

export function hasSupabaseConfig(): boolean {
  try {
    getSupabaseUrl()
    getSupabasePublicKey()
    return true
  } catch {
    return false
  }
}
