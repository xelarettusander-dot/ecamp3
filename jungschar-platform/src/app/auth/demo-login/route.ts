import { NextResponse } from 'next/server'
import {
  DEMO_COOKIE,
  demoSessionValue,
  isDemoAuthEnabled,
  isTestAccount,
} from '@/lib/auth/demo'

export async function POST(request: Request) {
  if (!isDemoAuthEnabled()) {
    return NextResponse.json(
      { error: 'Demo-Login ist deaktiviert.' },
      { status: 403 }
    )
  }

  const body = (await request.json().catch(() => null)) as {
    email?: string
    password?: string
    next?: string
  } | null

  const email = body?.email ?? ''
  const password = body?.password ?? ''
  const nextPath =
    body?.next && body.next.startsWith('/') ? body.next : '/dashboard'

  if (!isTestAccount(email, password)) {
    return NextResponse.json(
      { error: 'Ungültige Test-Zugangsdaten.' },
      { status: 401 }
    )
  }

  const response = NextResponse.json({ ok: true, next: nextPath })
  response.cookies.set(DEMO_COOKIE, demoSessionValue(), {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24 * 7,
  })
  return response
}
