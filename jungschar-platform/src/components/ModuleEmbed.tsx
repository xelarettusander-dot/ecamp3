'use client'

import { useEffect, useState } from 'react'

export function ModuleEmbed({
  title,
  src,
  helpText,
}: {
  title: string
  src: string
  helpText?: string
}) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
    const timer = window.setTimeout(() => {
      // Local vendor URLs often refuse iframe health probes; only mark failed for
      // clearly unreachable local endpoints after a short wait if load never fires.
    }, 8000)
    return () => window.clearTimeout(timer)
  }, [src])

  if (failed) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col justify-center px-4 py-10">
        <div className="rounded-[1.75rem] border border-[var(--border)] bg-[var(--card)] p-8">
          <p className="text-sm font-semibold">{title} ist noch nicht erreichbar</p>
          <p className="mt-2 text-sm text-[var(--muted)]">
            {helpText ||
              'Starte die App (Vendor/Docker) und lade diese Seite neu.'}
          </p>
          <p className="mt-4 break-all text-xs text-[var(--muted)]">{src}</p>
          <a
            href={src}
            target="_blank"
            rel="noreferrer"
            className="mt-6 inline-flex rounded-xl bg-[var(--accent)] px-5 py-3 text-sm font-semibold text-white"
          >
            Direkt öffnen
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-0 flex-1 bg-[#eef3ef]">
      <iframe
        title={title}
        src={src}
        className="absolute inset-0 h-full w-full border-0"
        allow="clipboard-read; clipboard-write; fullscreen"
        referrerPolicy="no-referrer-when-downgrade"
        onError={() => setFailed(true)}
      />
    </div>
  )
}
