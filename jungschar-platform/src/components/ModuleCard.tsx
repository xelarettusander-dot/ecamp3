import Link from 'next/link'
import type { PlatformModule } from '@/lib/modules/registry'

const statusLabel: Record<PlatformModule['status'], string> = {
  live: 'Live',
  linked: 'Eingebunden',
  planned: 'Geplant',
}

const statusClass: Record<PlatformModule['status'], string> = {
  live: 'bg-emerald-100 text-emerald-900',
  linked: 'bg-sky-100 text-sky-900',
  planned: 'bg-amber-100 text-amber-950',
}

export function ModuleCard({ module }: { module: PlatformModule }) {
  const ready = Boolean(module.appUrl) && module.launchMode !== 'planned'
  // Open working apps via hard navigation (/go/...), not a broken iframe shell.
  const href = ready ? `/go/${module.slug}` : `/modules/${module.slug}`

  return (
    <Link
      href={href}
      aria-label={`${module.title} starten`}
      data-module={module.slug}
      className="group flex h-full flex-col rounded-2xl border border-[var(--border)] bg-[var(--card)] p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--accent)] hover:shadow-md"
    >
      <div className="mb-3 flex items-start justify-between gap-3">
        <span className="rounded-full bg-[var(--accent-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--accent-ink)]">
          Prio {module.priority}
        </span>
        <span
          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClass[module.status]}`}
        >
          {statusLabel[module.status]}
        </span>
      </div>
      <h2 className="text-lg font-semibold tracking-tight text-[var(--ink)] group-hover:text-[var(--accent-ink)]">
        {module.title}
      </h2>
      <p className="mt-2 flex-1 text-sm leading-relaxed text-[var(--muted)]">
        {module.description}
      </p>
      <div className="mt-4 flex items-center justify-between gap-2 text-xs font-semibold">
        <span className={ready ? 'text-[var(--accent-ink)]' : 'text-[var(--muted)]'}>
          {ready ? 'App starten →' : 'In Planung'}
        </span>
        {module.existingHostname ? (
          <span className="truncate text-[var(--muted)]">{module.existingHostname}</span>
        ) : null}
      </div>
    </Link>
  )
}
