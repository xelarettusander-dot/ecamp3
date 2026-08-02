'use client'

import { FormEvent, Suspense, useState } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import { TEST_ACCOUNT } from '@/lib/auth/demo'
import { createClient } from '@/lib/supabase/client'

function LoginFormInner() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const next = searchParams.get('next') || '/dashboard'

  const [email, setEmail] = useState<string>(TEST_ACCOUNT.email)
  const [password, setPassword] = useState<string>(TEST_ACCOUNT.password)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function tryDemoLogin(): Promise<boolean> {
    const response = await fetch('/auth/demo-login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, next }),
    })
    if (!response.ok) return false
    const data = (await response.json()) as { next?: string }
    router.replace(data.next || next)
    router.refresh()
    return true
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault()
    setLoading(true)
    setError(null)

    try {
      // 1) Real Supabase (same server as Notfallblatt)
      try {
        const supabase = createClient()
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (!signInError) {
          router.replace(next)
          router.refresh()
          return
        }
      } catch {
        // fall through to demo login
      }

      // 2) Local demo/test fallback
      if (await tryDemoLogin()) return

      setError('Login fehlgeschlagen. Test-Account: test@example.com / test12')
      setLoading(false)
    } catch (err) {
      const demoOk = await tryDemoLogin().catch(() => false)
      if (demoOk) return

      setError(
        err instanceof Error
          ? err.message
          : 'Login fehlgeschlagen. Prüfe die Supabase-Umgebungsvariablen.'
      )
      setLoading(false)
    }
  }

  return (
    <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm">
      <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-ink)]">
        Login
      </p>
      <h1 className="mt-2 text-3xl font-semibold tracking-tight">Anmelden</h1>
      <p className="mt-2 text-sm text-[var(--muted)]">
        Bestehender Supabase-Server oder lokaler Test-Account.
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

      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">E-Mail</span>
          <input
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 outline-none ring-[var(--accent)] focus:ring-2"
          />
        </label>
        <label className="block text-sm">
          <span className="mb-1.5 block font-medium">Passwort</span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-[var(--border)] bg-white px-3 py-2.5 outline-none ring-[var(--accent)] focus:ring-2"
          />
        </label>

        {error ? (
          <p className="rounded-xl bg-red-50 px-3 py-2 text-sm text-red-800">{error}</p>
        ) : null}

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-[var(--accent)] px-4 py-3 text-sm font-semibold text-white disabled:opacity-60"
        >
          {loading ? 'Anmelden…' : 'Anmelden'}
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
