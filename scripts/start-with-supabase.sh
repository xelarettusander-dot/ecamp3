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

if [ -n "${SUPABASE_DATABASE_URL:-}" ]; then
  umask 077
  printf 'SUPABASE_DATABASE_URL=%s\n' "$SUPABASE_DATABASE_URL" > .env
elif [ ! -f .env ]; then
  echo "Missing SUPABASE_DATABASE_URL. Set the secret or copy .env.supabase.example to .env" >&2
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

echo "Starting eCamp3 with external Supabase Postgres..."
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
