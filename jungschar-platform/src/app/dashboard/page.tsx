import { SiteHeader } from '@/components/SiteHeader'
import { ModuleCard } from '@/components/ModuleCard'
import { getCurrentUser } from '@/lib/auth/current-user'
import { MODULES, PROTECTED_HOSTNAMES } from '@/lib/modules/registry'

export default async function DashboardPage() {
  const user = await getCurrentUser()
  const email = user?.email ?? null

  return (
    <div className="min-h-screen">
      <SiteHeader email={email} />
      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <section className="mb-8 rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.18em] text-[var(--accent-ink)]">
            Dashboard
          </p>
          <h2 className="mt-2 text-3xl font-semibold tracking-tight">
            Module nach Priorität
          </h2>
          <p className="mt-3 max-w-3xl text-sm leading-relaxed text-[var(--muted)] sm:text-base">
            Punkt 0 (Notfallblatt) und Punkt 2 (eCamp) bleiben an die bestehenden
            GitHub-Repos gebunden. Bestehende Dienste (
            {PROTECTED_HOSTNAMES.join(', ')}) dürfen nicht verändert oder
            gestört werden — wenn sie ausfallen, haben sie Priorität 1.
          </p>
          {email ? (
            <p className="mt-4 text-sm text-[var(--muted)]">
              Angemeldet als <strong>{email}</strong>
            </p>
          ) : (
            <p className="mt-4 rounded-xl bg-amber-50 px-3 py-2 text-sm text-amber-950">
              Supabase-Login noch nicht konfiguriert oder nicht angemeldet. Setze
              die Env-Vars und melde dich an.
            </p>
          )}
        </section>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {MODULES.map((module) => (
            <ModuleCard key={module.slug} module={module} />
          ))}
        </div>
      </main>
    </div>
  )
}
