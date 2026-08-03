# Deploy auf Ugreen NAS — Supabase + Docker + Nginx
# Ziel-Host: https://dev.jungschar-gelterkinden.ch

## Architektur

```
Browser
  └─ Nginx (Container jungschar-platform-nginx)
       └─ Next.js web (Container jungschar-platform-web)
            └─ Auth/API → bestehender Supabase
                 (https://app.jungschar-gelterkinden.ch/sb
                  bzw. https://supabase.jungschar-gelterkinden.ch)
```

**Kein neuer Supabase-Server.** Auth läuft über den bestehenden Stack.

## Nicht anfassen

Diese Hosts / Stacks bleiben unverändert:

- `supabase.jungschar-gelterkinden.ch`
- `notfallblatt.jungschar-gelterkinden.ch`
- `dateien.jungschar-gelterkinden.ch`
- `app.jungschar-gelterkinden.ch`

Wenn einer davon ausfällt: **sofort dort reparieren**.

## Schnellstart (Docker inkl. Nginx)

```bash
cd jungschar-platform   # oder /volume1/docker/jungschar-platform
cp .env.example .env
# NEXT_PUBLIC_SUPABASE_ANON_KEY aus dem bestehenden Supabase eintragen

docker compose up -d --build
```

Danach:

| Umgebung | URL |
|---|---|
| Lokal / NAS intern | http://localhost:8080 |
| Mit Host-Nginx + TLS | https://dev.jungschar-gelterkinden.ch |

Healthcheck: `http://localhost:8080/api/health`

## Variante A — Docker-Nginx (empfohlen zum Start)

`docker compose up` startet:

1. `jungschar-platform-web` (Next.js, nur intern)
2. `jungschar-platform-nginx` (Port `8080→80`)

Host-Nginx (bestehend) kann als zusätzlicher TLS-Terminator davor:

```nginx
# Nur neuer VHost — andere Sites nicht ändern
server {
    listen 443 ssl http2;
    server_name dev.jungschar-gelterkinden.ch;
    # ssl_certificate ...;
    location / {
        proxy_pass http://127.0.0.1:8080;
        proxy_set_header Host $host;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

Vorlage: `deploy/nginx/dev.jungschar-gelterkinden.ch.conf`

## Variante B — TLS direkt im Compose-Stack

```bash
# Zertifikate nach deploy/certs/fullchain.pem + privkey.pem
docker compose --profile tls up -d --build
```

Ports 80/443 werden dann vom Container `jungschar-platform-nginx-tls` belegt.
**Nur nutzen, wenn kein anderer Dienst diese Ports braucht.**

## Supabase

1. Anon-Key aus dem bestehenden Projekt holen (wie in Notfallblatt `config.js`)
2. Optional SQL anwenden:
   - `supabase/migrations/20260802120000_platform_foundation.sql`
   - Test-User in Studio: `test@example.com` / `test12` (Auto Confirm)

## Module

| Modul | Betrieb |
|---|---|
| Notfallblatt | Live-URL (bestehende App) |
| eCamp | separat starten, Nginx-Pfad `/apps/ecamp/` |
| Nextcloud | Live-URL `dateien.…` |

```bash
npm run sync:vendors
npm run start:ecamp   # optional, eigener Compose-Projektname
```
