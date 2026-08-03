#!/usr/bin/env bash
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

COMPOSE=(docker compose
  -f docker-compose.yml
  -f docker-compose.override.yml
  -f docker-compose.supabase.yml
  -f .cursor/docker-compose.cloud.override.yml
)

DB_HOST="${SUPABASE_DB_HOST:-supabase.jungschar-gelterkinden.ch}"
DB_NAME="${SUPABASE_DB_NAME:-postgres}"
DB_PORT="${SUPABASE_DB_PORT:-5432}"

write_env_url() {
  umask 077
  printf 'SUPABASE_DATABASE_URL=%s\n' "$1" > .env
}

if [ -n "${SUPABASE_DATABASE_URL:-}" ]; then
  write_env_url "${SUPABASE_DATABASE_URL}"
elif [ -n "${POSTGRES_PASSWORD:-}" ]; then
  write_env_url "postgresql://postgres:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?serverVersion=15&charset=utf8"
elif [ -f .env ] && grep -q '^SUPABASE_DATABASE_URL=.\+' .env; then
  :
elif [ -f .env ] && grep -q '^POSTGRES_PASSWORD=.\+' .env; then
  set -a
  # shellcheck disable=SC1091
  source .env
  set +a
  write_env_url "postgresql://postgres:${POSTGRES_PASSWORD}@${DB_HOST}:${DB_PORT}/${DB_NAME}?serverVersion=15&charset=utf8"
else
  echo "Missing database credentials." >&2
  echo "Set Cursor Secret POSTGRES_PASSWORD or SUPABASE_DATABASE_URL, or copy .env.supabase.example → .env" >&2
  exit 1
fi

set -a
# shellcheck disable=SC1091
source .env
set +a

if [ -z "${SUPABASE_DATABASE_URL:-}" ]; then
  echo "SUPABASE_DATABASE_URL is empty in environment and .env" >&2
  exit 1
fi

export DB_CPU_LIMIT="${DB_CPU_LIMIT:-4}"

echo "Starting eCamp3 with external Supabase Postgres (${DB_HOST})..."
"${COMPOSE[@]}" up -d --wait --remove-orphans

echo "Ensuring JWT keys exist..."
if [ ! -f api/config/jwt/private.pem ]; then
  JWT_PASSPHRASE=$(grep '^JWT_PASSPHRASE=' api/.env | cut -d= -f2)
  mkdir -p api/config/jwt
  echo "$JWT_PASSPHRASE" | openssl genpkey -out api/config/jwt/private.pem -pass stdin -aes256 -algorithm rsa -pkeyopt rsa_keygen_bits:4096
  echo "$JWT_PASSPHRASE" | openssl pkey -in api/config/jwt/private.pem -passin stdin -out api/config/jwt/public.pem -pubout
fi

echo "Running database migrations on Supabase..."
"${COMPOSE[@]}" exec -T api php bin/console doctrine:migrations:migrate --no-interaction

echo "Waiting for services..."
bash wait-for-container-startup.sh

echo "Testing login endpoint..."
curl -sf -X POST http://localhost:3000/api/authentication_token \
  -H 'Content-Type: application/json' \
  -d '{"identifier":"test@example.com","password":"test"}' >/dev/null \
  && echo "Login API OK" \
  || echo "Login API failed (seed data may be missing on fresh Supabase DB)"

echo "App ready at http://localhost:3000"
