# Jungschar Gelterkinden · Planungsplattform

App zum Planen von Lagern und Events.

- **URL:** https://dev.jungschar-gelterkinden.ch
- **Auth:** bestehender **Supabase**-Server
- **Runtime:** **Docker** + **Nginx**-Proxy

## Architektur

```
Browser → Nginx (Docker) → Next.js App → Supabase (bestehend)
```

## Geschützte bestehende Dienste

Nicht verändern / nicht ersetzen:

1. `supabase.jungschar-gelterkinden.ch`
2. `notfallblatt.jungschar-gelterkinden.ch`
3. `dateien.jungschar-gelterkinden.ch`
4. `app.jungschar-gelterkinden.ch`

## Start mit Docker + Nginx

```bash
cp .env.example .env
# Supabase Anon-Key eintragen (gleicher Server wie Notfallblatt)

chmod +x scripts/docker-up.sh
./scripts/docker-up.sh
# oder:
docker compose up -d --build
```

Öffnen: **http://localhost:8080**

Details: [`docs/DEPLOY_NAS.md`](docs/DEPLOY_NAS.md)

## Test-Account

- E-Mail: `test@example.com`
- Passwort: `test12`

## Module

| Prio | Modul | Einbindung |
|---|---|---|
| 0 | Notfallblatt | Live-App |
| 2 | eCamp | Vendor + optional `/apps/ecamp` |
| 5 | Nextcloud | Live-Link |

## Lokal (ohne Docker)

```bash
cp .env.example .env
npm install
npm run dev
```

## Tech

- Next.js (App Router)
- Supabase Auth (`@supabase/ssr`)
- Docker Compose (`web` + `nginx`)
- Tailwind CSS
