# Deploy auf Ugreen NAS (`dev.jungschar-gelterkinden.ch`)

## Nicht anfassen

Diese Hosts / Stacks bleiben unverändert:

- `supabase.jungschar-gelterkinden.ch`
- `notfallblatt.jungschar-gelterkinden.ch`
- `dateien.jungschar-gelterkinden.ch`

Wenn einer davon ausfällt: **sofort dort reparieren** (Priorität vor neuen Features).

## Voraussetzungen

- Docker auf dem NAS
- Nginx (bestehend) mit Möglichkeit für einen **zusätzlichen** VHost
- Zugriff auf Supabase Anon/Publishable Key aus dem bestehenden Projekt

## Schritte

1. Repo auf das NAS klonen, z.B. nach `/volume1/docker/jungschar-platform`
2. `.env` aus `.env.example` erstellen und Keys eintragen
3. Optional Schema anwenden (Supabase SQL Editor / `psql` gegen bestehendes Projekt):
   `supabase/migrations/20260802120000_platform_foundation.sql`
4. Starten:

```bash
docker compose up -d --build
```

5. Nginx-Site aus `deploy/nginx/dev.jungschar-gelterkinden.ch.conf` **neu** anlegen
6. DNS `dev.jungschar-gelterkinden.ch` → NAS
7. TLS-Zertifikat nur für `dev.…` ausstellen
8. `nginx -t` und reload — ohne andere Sites zu überschreiben
9. Healthcheck: `https://dev.jungschar-gelterkinden.ch/api/health`

## Vendor-Sync (Notfallblatt / eCamp)

```bash
npm run sync:vendors
```

Aktualisiert nur lokale Spiegel unter `vendors/`. Produktions-Container der bestehenden Apps werden nicht neu gestartet.
