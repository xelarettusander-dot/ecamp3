import Link from 'next/link'
import { APP_HOSTNAME, MODULES, PROTECTED_HOSTNAMES } from '@/lib/modules/registry'

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-5xl flex-col justify-center px-4 py-16 sm:px-6">
      <div className="rounded-[2rem] border border-[var(--border)] bg-[var(--card)] p-8 shadow-sm sm:p-12">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[var(--accent-ink)]">
          Jungschar Gelterkinden
        </p>
        <h1 className="mt-3 max-w-2xl text-4xl font-semibold tracking-tight text-[var(--ink)] sm:text-5xl">
          Planungsplattform
        </h1>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-[var(--muted)] sm:text-lg">
          Grundgerüst für Lager, Events und Gruppenarbeit. Login läuft über den
          bestehenden Supabase-Server. Erreichbar unter{' '}
          <strong>{APP_HOSTNAME}</strong>.
        </p>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            href="/login"
            className="rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
          >
            Mit Supabase anmelden
          </Link>
          <Link
            href="/dashboard"
            className="rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold text-[var(--ink)]"
          >
            Module ansehen
          </Link>
        </div>

        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          <div className="rounded-2xl bg-[var(--accent-soft)] p-4">
            <p className="text-sm font-semibold text-[var(--accent-ink)]">
              {MODULES.length} Module
            </p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Priorisiert von Notfallblatt bis Gruppen-Webseite.
            </p>
          </div>
          <div className="rounded-2xl bg-white/70 p-4">
            <p className="text-sm font-semibold text-[var(--ink)]">Bestehende Apps</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              {PROTECTED_HOSTNAMES.length} Hostnamen bleiben unangetastet.
            </p>
          </div>
          <div className="rounded-2xl bg-white/70 p-4">
            <p className="text-sm font-semibold text-[var(--ink)]">NAS-ready</p>
            <p className="mt-1 text-sm text-[var(--muted)]">
              Docker + eigener Nginx-VHost für {APP_HOSTNAME}.
            </p>
          </div>
        </div>
      </div>
    </main>
  )
}
