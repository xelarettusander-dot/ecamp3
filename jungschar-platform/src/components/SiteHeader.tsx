import Link from 'next/link'
import { APP_HOSTNAME } from '@/lib/modules/registry'

export function SiteHeader({
  email,
}: {
  email?: string | null
}) {
  return (
    <header className="border-b border-[var(--border)] bg-[var(--card)]/90 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <Link href="/dashboard" className="min-w-0">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--accent-ink)]">
            Jungschar Gelterkinden
          </p>
          <h1 className="truncate text-xl font-semibold tracking-tight text-[var(--ink)]">
            Planungsplattform
          </h1>
          <p className="truncate text-xs text-[var(--muted)]">{APP_HOSTNAME}</p>
        </Link>
        <nav className="flex items-center gap-3 text-sm">
          <Link
            href="/dashboard"
            className="rounded-lg px-3 py-2 text-[var(--ink)] hover:bg-[var(--accent-soft)]"
          >
            Module
          </Link>
          {email ? (
            <form action="/auth/signout" method="post">
              <button
                type="submit"
                className="rounded-lg bg-[var(--ink)] px-3 py-2 font-medium text-white hover:opacity-90"
              >
                Abmelden
              </button>
            </form>
          ) : (
            <Link
              href="/login"
              className="rounded-lg bg-[var(--accent)] px-3 py-2 font-medium text-white hover:opacity-90"
            >
              Anmelden
            </Link>
          )}
        </nav>
      </div>
    </header>
  )
}
