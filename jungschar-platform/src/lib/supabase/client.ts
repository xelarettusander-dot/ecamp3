import { createBrowserClient } from '@supabase/ssr'
import { getSupabasePublicKey, getSupabaseUrl } from '@/lib/env'

export function createClient() {
  return createBrowserClient(getSupabaseUrl(), getSupabasePublicKey())
}
