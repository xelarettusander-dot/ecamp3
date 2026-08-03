#!/usr/bin/env bash
# Start Jungschar platform: Docker web + Nginx, Auth via existing Supabase.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from .env.example — set NEXT_PUBLIC_SUPABASE_ANON_KEY before production use."
fi

echo "==> Building and starting web + nginx (Supabase = existing external server)"
docker compose up -d --build

echo
echo "Stack:"
docker compose ps
echo
echo "Open:  http://localhost:${HTTP_PORT:-8080}"
echo "Health: http://localhost:${HTTP_PORT:-8080}/api/health"
echo
echo "Existing services remain untouched:"
echo "  supabase / notfallblatt / dateien / app"
