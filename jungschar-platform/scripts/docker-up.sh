#!/usr/bin/env bash
# Start Jungschar platform: Docker web + Nginx, Auth via existing Supabase.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "${ROOT}"

if [[ ! -f .env ]]; then
  cp .env.example .env
  echo "Created .env from .env.example"
fi

# Merge Cursor Cloud / host secrets into .env without printing secrets.
upsert_env() {
  local key="$1"
  local value="$2"
  [[ -z "${value}" ]] && return 0
  if grep -q "^${key}=" .env; then
    # Escape sed replacement delimiters
    local escaped
    escaped=$(printf '%s' "${value}" | sed -e 's/[&|]/\\&/g')
    sed -i "s|^${key}=.*|${key}=${escaped}|" .env
  else
    printf '%s=%s\n' "${key}" "${value}" >> .env
  fi
}

ANON_KEY="${NEXT_PUBLIC_SUPABASE_ANON_KEY:-${SUPABASE_ANON_KEY:-}}"
upsert_env NEXT_PUBLIC_SUPABASE_ANON_KEY "${ANON_KEY}"

upsert_env NEXT_PUBLIC_SUPABASE_URL \
  "${NEXT_PUBLIC_SUPABASE_URL:-https://app.jungschar-gelterkinden.ch/sb}"

# Build Postgres URL for tools that need it.
# Inside the NAS Docker network use supabase-db; from Cursor Cloud use the public host.
if [[ -n "${SUPABASE_DATABASE_URL:-}" ]]; then
  upsert_env SUPABASE_DATABASE_URL "${SUPABASE_DATABASE_URL}"
elif [[ -n "${POSTGRES_PASSWORD:-}" ]]; then
  DB_HOST="${SUPABASE_DB_HOST:-supabase.jungschar-gelterkinden.ch}"
  upsert_env SUPABASE_DATABASE_URL \
    "postgresql://postgres:${POSTGRES_PASSWORD}@${DB_HOST}:5432/postgres"
  upsert_env POSTGRES_PASSWORD "${POSTGRES_PASSWORD}"
fi

if ! grep -q '^NEXT_PUBLIC_SUPABASE_ANON_KEY=.\+' .env; then
  echo "Missing anon key. Set Cursor Secret NEXT_PUBLIC_SUPABASE_ANON_KEY (or SUPABASE_ANON_KEY) and re-run." >&2
  exit 1
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
