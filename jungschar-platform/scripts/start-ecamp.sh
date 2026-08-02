#!/usr/bin/env bash
# Starts eCamp from vendors/ecamp3 as a separate compose project.
# Does NOT recreate supabase / notfallblatt / nextcloud stacks.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
ECAMP_DIR="${ROOT}/vendors/ecamp3"

if [[ ! -f "${ECAMP_DIR}/docker-compose.yml" ]]; then
  echo "eCamp Vendor fehlt. Zuerst: npm run sync:vendors"
  exit 1
fi

cd "${ECAMP_DIR}"
docker compose \
  -p jungschar-ecamp \
  -f docker-compose.yml \
  -f "${ROOT}/deploy/ecamp.ports.yml" \
  up -d "$@"

echo "eCamp Frontend: http://127.0.0.1:3020"
echo "In der Plattform: Modul eCamp (NEXT_PUBLIC_MODULE_ECAMP_URL)"
