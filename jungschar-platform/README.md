# Jungschar Gelterkinden · Planungsplattform

Grundgerüst für eine App, mit der Jungschar-Organisationen Lager und Events planen.

- **URL (Ziel):** https://dev.jungschar-gelterkinden.ch
- **Login:** bestehender Supabase-Server (`https://supabase.jungschar-gelterkinden.ch`)
- **Runtime:** Docker auf Ugreen NAS hinter Nginx

## Geschützte bestehende Dienste

Diese Apps/Hosts dürfen **nicht** verändert oder ersetzt werden:

1. `supabase.jungschar-gelterkinden.ch`
2. `notfallblatt.jungschar-gelterkinden.ch`
3. `dateien.jungschar-gelterkinden.ch`

Wenn sie ausfallen, haben sie Vorrang vor neuen Features.

## Module

Siehe Dashboard oder [`docs/ROADMAP.md`](docs/ROADMAP.md).

**Bereits eingebunden und nutzbar:**

| Prio | Modul | Einbindung |
|---|---|---|
| 0 | Notfallblatt | Live-App im Modul-iframe (`notfallblatt.jungschar-gelterkinden.ch`) |
| 2 | eCamp | Code aus GitHub in `vendors/ecamp3`, Start mit `npm run start:ecamp`, UI unter Modul eCamp |
| 5 | Nextcloud | Extern-Link auf `dateien.jungschar-gelterkinden.ch` |

Updates von GitHub: `npm run sync:vendors`

### Test-Account

- E-Mail: `test@example.com`
- Passwort: `test12`

## Lokal starten

```bash
cp .env.example .env
# Keys aus dem bestehenden Supabase-Projekt eintragen
npm install
npm run dev
```

## NAS / Docker

Siehe [`docs/DEPLOY_NAS.md`](docs/DEPLOY_NAS.md).

```bash
docker compose up -d --build
```

App lauscht intern auf `127.0.0.1:3010`. Nginx-VHost nur für `dev.jungschar-gelterkinden.ch` hinzufügen.

## Tech

- Next.js (App Router)
- Supabase Auth (`@supabase/ssr`)
- Tailwind CSS
- Docker standalone output
