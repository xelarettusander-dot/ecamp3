import { cookies } from 'next/headers'
import { DEMO_COOKIE, isDemoAuthEnabled, parseDemoSession } from '@/lib/auth/demo'
import { hasSupabaseConfig } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'

export type CurrentUser = {
  email: string
  displayName?: string | null
  source: 'demo' | 'supabase'
}

export async function getCurrentUser(): Promise<CurrentUser | null> {
  if (isDemoAuthEnabled()) {
    const cookieStore = await cookies()
    const demo = parseDemoSession(cookieStore.get(DEMO_COOKIE)?.value)
    if (demo) {
      return { email: demo.email, displayName: demo.displayName, source: 'demo' }
    }
  }

  if (!hasSupabaseConfig()) return null

  try {
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()
    if (!user?.email) return null
    return {
      email: user.email,
      displayName: user.user_metadata?.display_name ?? null,
      source: 'supabase',
    }
  } catch {
    return null
  }
}
