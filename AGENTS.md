# AGENTS.md

The default branch of this project is `devel` branch of the `ecamp/ecamp3` repository. Base new work on it.

## Dev environment tips

Before you do anything, start the dev environment:

```bash
docker compose up -d
docker compose --profile=playwright-cli up -d
```

### Key Directories

- `/api/` Symfony/API Platform backend.
- `/frontend/` Main Vue 3 frontend served by Vite.
- `/frontend-old/` Legacy Vue 2 frontend; NEVER CHANGE THIS.
- `/common/` Shared JavaScript utilities, ESLint rules, and locale files used by the Node-based apps.
- `/frontend/src/pdf/` Client-side PDF rendering code used by the frontend.
- `/print/` Separate, Nuxt-based print backend.
- `/e2e/` Playwright end-to-end tests.
- `/.helm/` Helm chart and Kubernetes deployment configuration.
- `/.ops/` Operational tooling such as performance tests.

## General development instructions

Think extra hard when developing. Do not just use the easiest way to achieve a goal.
Try to achieve the goal with minimal changes.
If you hit a problem, read the docs for this problem to find the correct solution.
Always ask before you remove assertions or expectations in tests.
Explain your changes in the commit message.

Always run commands in the existing Docker services with `docker compose exec <service> ...`.
Use the package manager scripts from the affected directory instead of invoking tools directly.

For documentation, YAML, and JSON changes at the repository root, use the root npm scripts:

```bash
docker compose run --rm prettier npm run lint:check
docker compose run --rm prettier npm run lint
```

## /api directory

### Development instructions

Use composer to run scripts, don't use phpunit directly.

### Testing instructions

> **Note**: PHP test take very long to run, never run them all at once.
> Only run specific tests or tests for one entity when needed

```bash
docker compose exec api composer test <path to test from api directory>

# always run cs fix before a commit
docker compose exec api composer cs-fix

# lint
docker compose exec api composer psalm
docker compose exec api composer phpstan
```

## /frontend directory

Main Vue 3 frontend. The Docker service name is `frontend`, and commands run from `/app` inside the container.

```bash
docker compose exec frontend npm run lint
docker compose exec frontend npm run test:unit
docker compose exec frontend npm run build
```

For targeted frontend changes, prefer focused unit tests or lint checks before running broader commands.

## /frontend-old directory

Legacy Vue 2 frontend. The Docker service name is `frontend-old`.
NEVER CHANGE THIS

## /common directory

Shared code and locale files are mounted into the Node-based services.
When changing shared code, run checks for every affected consumer, commonly `frontend`, or `print`.
When changing shared locale files, also consider the `/translation` instructions.

## /print directory

Nuxt-based print backend. The Docker service name is `print`.

```bash
docker compose exec print npm run lint:check
docker compose exec print npm run lint
docker compose exec print npm run test
docker compose exec print npm run build
```

## /e2e directory

Playwright end-to-end tests. The service uses the `e2e` Docker profile, so start it when needed.
See [README.md](e2e/README.md)

## Playwright CLI service

The `playwright-cli` Docker service provides Playwright browser automation.
It uses `network_mode: host` so URLs like `http://localhost:3000` work the same as on the host.
The container stays running so the playwright-cli session daemon persists across commands.

```bash
docker compose exec playwright-cli playwright-cli open http://localhost:3000
docker compose exec playwright-cli playwright-cli snapshot
docker compose exec playwright-cli playwright-cli close
```

For one-shot scripts, use `exec` against the running container:

```bash
docker compose exec playwright-cli node /workspace/.playwright-cli/my-script.js
```

Screenshots and snapshots are saved to `.playwright-cli/`.
Find the skill here: [skills](.agents/skills).

## Infrastructure and operations

- `docker-compose.yml` and `docker-compose.override.yml` define the local development services.
- `reverse-proxy-nginx.conf` configures the local reverse proxy.
- `/.helm/` contains deployment manifests and environment examples; validate changes with Helm tooling when available.
- `/.ops/performance-test/` contains performance test tooling; keep generated artifacts out of commits unless explicitly requested.

## PR instructions

- Ensure tests are green
- Ensure code is formatted
- Ensure code is linted

## Cursor Cloud specific instructions

The default dev stack is self-contained via Docker Compose (local Postgres, nginx reverse-proxy, mock OAuth, maildev). You can optionally point the API at **external Postgres**, e.g. self-hosted Supabase on your NAS.

### Using Supabase Postgres (`supabase.jungschar-gelterkinden.ch`)

eCamp3 uses Supabase **only as PostgreSQL** — not Supabase Auth, Realtime, or Storage. Login remains eCamp JWT + OAuth providers.

1. In Supabase Studio, create a database (e.g. `ecamp3`) and copy the Postgres connection string.
2. Copy `.env.supabase.example` → `.env` and set `SUPABASE_DATABASE_URL`.
3. Start **without** the local `database` container:

```bash
./scripts/start-with-supabase.sh
```

Or manually:

```bash
DB_CPU_LIMIT=4 docker compose \
  -f docker-compose.yml \
  -f docker-compose.override.yml \
  -f docker-compose.supabase.yml \
  -f .cursor/docker-compose.cloud.override.yml \
  up -d --wait
```

The `SUPABASE_DATABASE_URL` secret (or a root `.env` file) is read automatically by Compose. On Cloud Agent VMs, the update script writes `.env` from the secret on pod startup.

4. Run migrations and ensure JWT keys exist (see below).

Use port **5432** (direct) for migrations. Pooler port **6543** is optional for runtime. Add `&sslmode=require` to the URL if your instance enforces TLS.

To use local Postgres again, add `--profile local-db` and omit `docker-compose.supabase.yml`.

### Docker in Cloud VMs

Cloud agent VMs run Docker-in-Docker. Before `docker compose up`, configure the daemon once per VM (not in the update script):

```bash
sudo mkdir -p /etc/docker
printf '%s\n' '{' '  "storage-driver": "fuse-overlayfs",' '  "default-cgroupns-mode": "host",' '  "exec-opts": ["native.cgroupdriver=cgroupfs"]' '}' | sudo tee /etc/docker/daemon.json
sudo apt-get install -y fuse-overlayfs iptables
sudo update-alternatives --set iptables /usr/sbin/iptables-legacy
sudo update-alternatives --set ip6tables /usr/sbin/ip6tables-legacy
# start dockerd (e.g. in tmux): sudo dockerd
sudo chmod 666 /var/run/docker.sock
```

### Starting the stack

Use **both** compose files plus the cloud override (removes Postgres CPU limits that fail on 4-core VMs and nested cgroups):

```bash
DB_CPU_LIMIT=4 docker compose -f docker-compose.yml -f docker-compose.override.yml -f .cursor/docker-compose.cloud.override.yml up -d --wait
```

App URL: **http://localhost:3000**

First-time API setup (if login returns 500):

1. Ensure JWT keys exist: `api/config/jwt/private.pem` and `public.pem` (generated automatically by the API entrypoint when missing; if login fails with JWT errors, regenerate per `api/docker/php/docker-entrypoint.sh`).
2. Run migrations if needed: `docker compose exec api php bin/console doctrine:migrations:migrate --no-interaction`

### Verify / hello-world

Default dev login: `test@example.com` / `test`

```bash
bash wait-for-container-startup.sh
docker compose exec frontend npm run lint
docker compose --profile e2e run --rm e2e npm ci
docker compose --profile e2e run --rm e2e npx playwright test tests/5-cross-browser-tests/login.spec.ts --grep "can login" --project=chromium
```

The behavior test `tests/9-behavior-tests/category/create-category.ts` (project `behavior-tests`) logs in, creates a camp via UI, and adds a category — a good end-to-end smoke test.
