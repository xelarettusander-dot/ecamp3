import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import {
  DEMO_COOKIE,
  demoSessionValue,
  isDemoAuthEnabled,
  isTestAccount,
  TEST_ACCOUNT,
} from '@/lib/auth/demo'
import { getSupabasePublicKey, getSupabaseUrl, hasSupabaseConfig } from '@/lib/env'

function safeNext(value: FormDataEntryValue | null): string {
  if (typeof value !== 'string' || !value.startsWith('/')) return '/dashboard'
  return value
}

function redirectTo(path: string, request: Request) {
  return NextResponse.redirect(new URL(path, request.url), { status: 303 })
}

function attachDemoCookie(response: NextResponse) {
  response.cookies.set(DEMO_COOKIE, demoSessionValue(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: false,
    maxAge: 60 * 60 * 24 * 7,
  })
  return response
}

export async function POST(request: Request) {
  const form = await request.formData()
  const email = String(form.get('email') || '')
  const password = String(form.get('password') || '')
  const nextPath = safeNext(form.get('next'))
  const usingTestAccount = isTestAccount(email, password)

  // Fast path: local/demo test account (also used as fallback cookie)
  if (isDemoAuthEnabled() && usingTestAccount) {
    // Still try Supabase so the same user works against the shared Auth project.
    if (hasSupabaseConfig()) {
      try {
        let response = redirectTo(nextPath, request)
        const supabase = createServerClient(getSupabaseUrl(), getSupabasePublicKey(), {
          cookies: {
            getAll() {
              return request.cookies.getAll()
            },
            setAll(cookiesToSet) {
              cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
              response = redirectTo(nextPath, request)
              cookiesToSet.forEach(({ name, value, options }) =>
                response.cookies.set(name, value, options)
              )
            },
          },
        })
        await supabase.auth.signInWithPassword({
          email: TEST_ACCOUNT.email,
          password: TEST_ACCOUNT.password,
        })
        return attachDemoCookie(response)
      } catch {
        // demo cookie alone is enough for the shell
      }
    }

    return attachDemoCookie(redirectTo(nextPath, request))
  }

  if (hasSupabaseConfig()) {
    try {
      let response = redirectTo(nextPath, request)
      const supabase = createServerClient(getSupabaseUrl(), getSupabasePublicKey(), {
        cookies: {
          getAll() {
            return request.cookies.getAll()
          },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
            response = redirectTo(nextPath, request)
            cookiesToSet.forEach(({ name, value, options }) =>
              response.cookies.set(name, value, options)
            )
          },
        },
      })

      const { error } = await supabase.auth.signInWithPassword({ email, password })
      if (!error) return response
    } catch {
      // fall through
    }
  }

  const fail = new URL('/login', request.url)
  fail.searchParams.set('error', 'login_failed')
  fail.searchParams.set('next', nextPath)
  return NextResponse.redirect(fail, { status: 303 })
}
