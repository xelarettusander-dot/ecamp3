import Link from 'next/link'
import { ModuleEmbed } from '@/components/ModuleEmbed'
import type { PlatformModule } from '@/lib/modules/registry'

function embedHelp(platformModule: PlatformModule): string | undefined {
  if (platformModule.slug === 'ecamp') {
    return 'eCamp-Code liegt unter vendors/ecamp3. Auf dem NAS starten mit: npm run sync:vendors && npm run start:ecamp'
  }
  return undefined
}

export function ModuleWorkspace({
  platformModule,
}: {
  platformModule: PlatformModule
}) {
  const canEmbed =
    platformModule.launchMode === 'iframe' && Boolean(platformModule.appUrl)
  const canOpen =
    Boolean(platformModule.appUrl) &&
    (platformModule.launchMode === 'iframe' ||
      platformModule.launchMode === 'external')

  return (
    <div className="flex min-h-[calc(100vh-5.5rem)] flex-col">
      <div className="border-b border-[var(--border)] bg-[var(--card)]/95 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <Link
              href="/dashboard"
              className="text-xs font-medium text-[var(--accent-ink)] hover:underline"
            >
              ← Module
            </Link>
            <h1 className="truncate text-lg font-semibold tracking-tight">
              {platformModule.title}
              <span className="ml-2 text-sm font-normal text-[var(--muted)]">
                Prio {platformModule.priority}
              </span>
            </h1>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {canOpen ? (
              <a
                href={platformModule.appUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg bg-[var(--accent)] px-3 py-2 text-sm font-semibold text-white"
              >
                In neuem Tab öffnen
              </a>
            ) : null}
            {platformModule.githubUrl ? (
              <a
                href={platformModule.githubUrl}
                target="_blank"
                rel="noreferrer"
                className="rounded-lg border border-[var(--border)] bg-white px-3 py-2 text-sm font-medium"
              >
                GitHub
              </a>
            ) : null}
          </div>
        </div>
      </div>

      {canEmbed && platformModule.appUrl ? (
        <ModuleEmbed
          title={platformModule.title}
          src={platformModule.appUrl}
          helpText={embedHelp(platformModule)}
        />
      ) : canOpen ? (
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-10">
          <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-8">
            <p className="text-sm text-[var(--muted)]">
              Diese App erlaubt kein Einbetten (iframe) und öffnet sich deshalb
              extern — die Live-Installation bleibt unverändert.
            </p>
            <a
              href={platformModule.appUrl}
              target="_blank"
              rel="noreferrer"
              className="mt-6 inline-flex rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
            >
              {platformModule.title} öffnen
            </a>
            <p className="mt-4 break-all text-xs text-[var(--muted)]">
              {platformModule.appUrl}
            </p>
          </div>
        </div>
      ) : (
        <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-10">
          <div className="rounded-[1.75rem] border border-dashed border-[var(--border)] bg-[var(--card)] p-8">
            <p className="text-sm font-semibold text-[var(--ink)]">
              Noch nicht angebunden
            </p>
            <p className="mt-2 text-sm text-[var(--muted)]">
              {platformModule.description}
            </p>
            {platformModule.vendorDir ? (
              <p className="mt-4 text-xs text-[var(--muted)]">
                Vendor: <code>{platformModule.vendorDir}</code> — Sync mit{' '}
                <code>npm run sync:vendors</code>
              </p>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
