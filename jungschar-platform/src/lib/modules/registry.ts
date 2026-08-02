export type ModuleStatus = 'live' | 'linked' | 'planned'

export type LaunchMode = 'iframe' | 'external' | 'planned'

export type PlatformModule = {
  /** Priority order from the product backlog (lower = sooner). */
  priority: number
  slug: string
  title: string
  shortTitle: string
  description: string
  status: ModuleStatus
  launchMode: LaunchMode
  /** URL opened/embedded when the module is usable. */
  appUrl?: string
  /** Existing production hostname that must never be broken. */
  existingHostname?: string
  /** Upstream GitHub repo used as source of truth when status is linked/live. */
  githubUrl?: string
  vendorDir?: string
}

function envUrl(name: string, fallback?: string): string | undefined {
  const value = process.env[name]?.trim()
  if (value) return value.replace(/\/$/, '')
  return fallback
}

/**
 * Product modules ordered by priority.
 * 0 and 2 already exist as working apps — synced from GitHub / live hosts.
 */
export const MODULES: PlatformModule[] = [
  {
    priority: 0,
    slug: 'notfallblatt',
    title: 'Notfallblatt',
    shortTitle: 'Notfallblatt',
    description:
      'Live-App für Notfallinformationen, Events und Anmeldungen. Eingebunden von der bestehenden Installation; Code-Updates folgen dem GitHub-Repo.',
    status: 'live',
    launchMode: 'iframe',
    appUrl: envUrl(
      'NEXT_PUBLIC_MODULE_NOTFALLBLATT_URL',
      'https://notfallblatt.jungschar-gelterkinden.ch'
    ),
    existingHostname: 'notfallblatt.jungschar-gelterkinden.ch',
    githubUrl: 'https://github.com/xelarettusander-dot/notfallblatt',
    vendorDir: 'vendors/notfallblatt',
  },
  {
    priority: 1,
    slug: 'inventar',
    title: 'Inventar',
    shortTitle: 'Inventar',
    description:
      'Jungschar-Inventar mit eCamp-Verknüpfung, letzter Kontrolle, Intervallen und Gebrauchsrechten.',
    status: 'planned',
    launchMode: 'planned',
  },
  {
    priority: 2,
    slug: 'ecamp',
    title: 'eCamp',
    shortTitle: 'eCamp',
    description:
      'Lagerplanung (Picasso, Blöcke, Material). Code aus dem eCamp3-Fork unter vendors/ecamp3; auf dem NAS per Docker gestartet und hier eingebunden.',
    status: 'linked',
    launchMode: 'iframe',
    appUrl: envUrl('NEXT_PUBLIC_MODULE_ECAMP_URL', 'http://127.0.0.1:3020'),
    githubUrl: 'https://github.com/xelarettusander-dot/ecamp3',
    vendorDir: 'vendors/ecamp3',
  },
  {
    priority: 3,
    slug: 'sitzungsprotokolle',
    title: 'Sitzungsprotokolle',
    shortTitle: 'Protokolle',
    description: 'Sitzungsprotokolle erstellen und ablegen.',
    status: 'planned',
    launchMode: 'planned',
  },
  {
    priority: 4,
    slug: 'lagergeschichten',
    title: 'Lagergeschichten-Bibliothek',
    shortTitle: 'Geschichten',
    description:
      'Bibliothek vergangener Lagergeschichten zum Inspirieren und Kopieren.',
    status: 'planned',
    launchMode: 'planned',
  },
  {
    priority: 5,
    slug: 'nextcloud',
    title: 'Nextcloud / WebDAV',
    shortTitle: 'Nextcloud',
    description:
      'Anbindung an den bestehenden Nextcloud-/WebDAV-Server (dateien.jungschar-gelterkinden.ch).',
    status: 'live',
    launchMode: 'external',
    appUrl: envUrl(
      'NEXT_PUBLIC_MODULE_NEXTCLOUD_URL',
      'https://dateien.jungschar-gelterkinden.ch'
    ),
    existingHostname: 'dateien.jungschar-gelterkinden.ch',
  },
  {
    priority: 6,
    slug: 'buch',
    title: 'Buch / Wiki',
    shortTitle: 'Wiki',
    description: 'Internes Wiki für Gruppenwissen.',
    status: 'planned',
    launchMode: 'planned',
  },
  {
    priority: 7,
    slug: 'safetool',
    title: 'Safetool',
    shortTitle: 'Safetool',
    description:
      'Sicherheitsdokumente: 3×3 Wanderungen, Sicherheitskonzepte, Notfallkärtchen, Notfall-Organisation.',
    status: 'planned',
    launchMode: 'planned',
  },
  {
    priority: 8,
    slug: 'wander',
    title: 'Wanderplanung',
    shortTitle: 'Wander',
    description:
      'Wanderungen mit Swisstopo-Karten, Marschzeittabellen und Höhenprofilen.',
    status: 'planned',
    launchMode: 'planned',
  },
  {
    priority: 9,
    slug: 'andachten',
    title: 'Andachten',
    shortTitle: 'Andachten',
    description: 'Andachten erstellen mit Bibeltexten und Geschichten-Suche.',
    status: 'planned',
    launchMode: 'planned',
  },
  {
    priority: 10,
    slug: 'liederbuch',
    title: 'Liederbuch',
    shortTitle: 'Lieder',
    description:
      'Lagerlieder-Bibliothek (PDF/Word), eigene Liederbücher zusammenstellen und als PDF exportieren.',
    status: 'planned',
    launchMode: 'planned',
  },
  {
    priority: 11,
    slug: 'menuplanung',
    title: 'Menüplanung',
    shortTitle: 'Küche',
    description:
      'Kompletter Menüplan für die Lagerküche mit Rezepten, Einkaufsliste und Druckansicht.',
    status: 'planned',
    launchMode: 'planned',
  },
  {
    priority: 12,
    slug: 'kalender',
    title: 'Jungschar-Kalender',
    shortTitle: 'Kalender',
    description:
      'Gruppen/Personen können Events anbieten und Anmeldungen entgegennehmen (wie im Notfallblatt).',
    status: 'planned',
    launchMode: 'planned',
  },
  {
    priority: 13,
    slug: 'cevi-kleinanzeigen',
    title: 'Cevi-Kleinanzeigen',
    shortTitle: 'Kleinanzeigen',
    description:
      'Sachen anbieten oder gesucht melden – gruppenübergreifend.',
    status: 'planned',
    launchMode: 'planned',
  },
  {
    priority: 14,
    slug: 'chat',
    title: 'Chat',
    shortTitle: 'Chat',
    description: 'Chat mit anderen Personen auf der Plattform.',
    status: 'planned',
    launchMode: 'planned',
  },
  {
    priority: 15,
    slug: 'webseite',
    title: 'Gruppen-Webseite',
    shortTitle: 'Profil',
    description: 'Gruppen-Profilseite zur Vorstellung der eigenen Gruppe.',
    status: 'planned',
    launchMode: 'planned',
  },
]

export function getModuleBySlug(slug: string): PlatformModule | undefined {
  return MODULES.find((module) => module.slug === slug)
}

export const PROTECTED_HOSTNAMES = [
  'supabase.jungschar-gelterkinden.ch',
  'notfallblatt.jungschar-gelterkinden.ch',
  'dateien.jungschar-gelterkinden.ch',
  'app.jungschar-gelterkinden.ch',
] as const

export const APP_HOSTNAME = 'dev.jungschar-gelterkinden.ch'
