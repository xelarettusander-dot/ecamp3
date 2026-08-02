import { NextResponse } from 'next/server'
import { DEMO_COOKIE, isDemoAuthEnabled } from '@/lib/auth/demo'
import { hasSupabaseConfig } from '@/lib/env'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
  const { origin } = new URL(request.url)
  const response = NextResponse.redirect(`${origin}/login`, { status: 303 })

  if (isDemoAuthEnabled()) {
    response.cookies.set(DEMO_COOKIE, '', {
      httpOnly: true,
      sameSite: 'lax',
      path: '/',
      maxAge: 0,
    })
  }

  if (hasSupabaseConfig()) {
    try {
      const supabase = await createClient()
      await supabase.auth.signOut()
    } catch {
      // ignore when Supabase is misconfigured
    }
  }

  return response
}
