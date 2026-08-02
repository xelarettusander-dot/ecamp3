import Link from 'next/link'
import { notFound, redirect } from 'next/navigation'
import { SiteHeader } from '@/components/SiteHeader'
import { getCurrentUser } from '@/lib/auth/current-user'
import { getModuleBySlug, MODULES } from '@/lib/modules/registry'

export function generateStaticParams() {
  return MODULES.map((module) => ({ slug: module.slug }))
}

export default async function ModulePage({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ embed?: string; offline?: string }>
}) {
  const { slug } = await params
  const { embed, offline } = await searchParams
  const platformModule = getModuleBySlug(slug)
  if (!platformModule) notFound()

  // Jump straight into the real app unless we were sent back as offline/embed.
  if (
    platformModule.appUrl &&
    platformModule.launchMode !== 'planned' &&
    embed !== '1'
  ) {
    redirect(`/go/${platformModule.slug}`)
  }

  const user = await getCurrentUser()
  const isEcamp = platformModule.slug === 'ecamp'

  return (
    <div className="min-h-screen">
      <SiteHeader email={user?.email ?? null} />
      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
        <Link
          href="/dashboard"
          className="text-sm font-medium text-[var(--accent-ink)] hover:underline"
        >
          ← Zurück zu den Modulen
        </Link>
        <article className="mt-4 rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-6 sm:p-8">
          <p className="text-sm font-semibold text-[var(--accent-ink)]">
            Priorität {platformModule.priority}
          </p>
          <h1 className="mt-2 text-3xl font-semibold tracking-tight">
            {platformModule.title}
          </h1>
          <p className="mt-4 text-base leading-relaxed text-[var(--muted)]">
            {platformModule.description}
          </p>

          {offline === '1' ? (
            <div className="mt-6 rounded-2xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
              <p className="font-semibold">App gerade nicht erreichbar</p>
              {isEcamp ? (
                <div className="mt-2 space-y-2">
                  <p>
                    eCamp muss als eigener Docker-Stack laufen (Code unter{' '}
                    <code>vendors/ecamp3</code> bzw. im Repo-Root).
                  </p>
                  <pre className="overflow-x-auto rounded-xl bg-white/80 p-3 text-xs">
{`# Im Repo-Root / auf dem NAS:
docker compose up -d
# Frontend lokal unter http://127.0.0.1:3020
# oder via Nginx: https://dev.jungschar-gelterkinden.ch/apps/ecamp`}
                  </pre>
                </div>
              ) : (
                <p className="mt-2">
                  Ziel-URL: <code>{platformModule.appUrl}</code>
                </p>
              )}
            </div>
          ) : null}

          {platformModule.appUrl ? (
            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={`/go/${platformModule.slug}`}
                className="inline-flex rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
              >
                Erneut versuchen / App starten
              </a>
              <a
                href={platformModule.appUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex rounded-xl border border-[var(--border)] bg-white px-5 py-3 text-sm font-semibold"
              >
                Direkt öffnen
              </a>
            </div>
          ) : (
            <p className="mt-6 text-sm text-[var(--muted)]">Noch nicht angebunden.</p>
          )}

          {platformModule.githubUrl ? (
            <p className="mt-6 break-all text-xs text-[var(--muted)]">
              GitHub:{' '}
              <a className="underline" href={platformModule.githubUrl}>
                {platformModule.githubUrl}
              </a>
            </p>
          ) : null}
        </article>
      </main>
    </div>
  )
}
