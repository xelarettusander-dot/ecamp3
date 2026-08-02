#!/usr/bin/env bash
# Syncs existing apps from GitHub without modifying their production deploys.
set -euo pipefail

ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
VENDOR_DIR="${ROOT}/vendors"
mkdir -p "${VENDOR_DIR}"

sync_repo() {
  local name="$1"
  local url="$2"
  local branch="${3:-main}"
  local target="${VENDOR_DIR}/${name}"

  echo "==> Sync ${name} (${url} @ ${branch})"

  if ! git ls-remote --exit-code "${url}" &>/dev/null; then
    echo "    SKIP: Repo nicht erreichbar: ${url}"
    mkdir -p "${target}"
    if [[ ! -f "${target}/README.md" ]]; then
      cat > "${target}/README.md" <<EOF
# ${name}

Upstream noch nicht geklont / Repo privat oder fehlend.

Erwartete Quelle: ${url}

Für Notfallblatt läuft die Live-App unter:
https://notfallblatt.jungschar-gelterkinden.ch
EOF
    fi
    return 0
  fi

  if [[ ! -d "${target}/.git" ]]; then
    git clone --depth 1 --branch "${branch}" "${url}" "${target}"
  else
    git -C "${target}" fetch --depth 1 origin "${branch}"
    git -C "${target}" checkout "${branch}"
    git -C "${target}" reset --hard "origin/${branch}"
  fi

  echo "    OK: $(git -C "${target}" rev-parse --short HEAD)"
}

sync_repo "notfallblatt" "https://github.com/xelarettusander-dot/notfallblatt.git" "main"
sync_repo "ecamp3" "https://github.com/xelarettusander-dot/ecamp3.git" "devel"

echo "Done. Production hosts remain untouched."
