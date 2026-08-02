'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { TEST_ACCOUNT } from '@/lib/auth/demo'

function LoginFormInner() {
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'
  const error = searchParams.get('error')

  return (
    <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-ink)]">
        Login
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Anmelden</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Login über den bestehenden Supabase-Server (wie Notfallblatt).
      </p>

      <div className="mt-5 rounded-2xl bg-[var(--accent-soft)] px-4 py-3 text-sm text-[var(--accent-ink)]">
        <p className="font-semibold">Test-Account</p>
        <p className="mt-1">
          E-Mail: <code>{TEST_ACCOUNT.email}</code>
        </p>
        <p>
          Passwort: <code>{TEST_ACCOUNT.password}</code>
        </p>
      </div>

      <form action="/auth/login" method="post" className="mt-8 space-y-4">
        <input type="hidden" name="next" value={next} />
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">E-Mail</span>
          <input
            type="email"
            name="email"
            required
            autoComplete="email"
            defaultValue={TEST_ACCOUNT.email}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 outline-none ring-[var(--accent)] focus:ring-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Passwort</span>
          <input
            type="password"
            name="password"
            required
            autoComplete="current-password"
            defaultValue={TEST_ACCOUNT.password}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 outline-none ring-[var(--accent)] focus:ring-2"
          />
        </label>

        {error ? (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">
            Login fehlgeschlagen. Nutze {TEST_ACCOUNT.email} / {TEST_ACCOUNT.password}
          </p>
        ) : null}

        <button
          type="submit"
          className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white"
        >
          Anmelden
        </button>
      </form>

      <p className="mt-6 text-center text-sm text-[var(--muted)]">
        <Link href="/" className="font-medium text-[var(--accent-ink)]">
          Zur Startseite
        </Link>
      </p>
    </div>
  )
}

export function LoginForm() {
  return (
    <Suspense fallback={<div className="rounded-[1.75rem] bg-[var(--card)] p-8">Laden…</div>}>
      <LoginFormInner />
    </Suspense>
  )
}
