# AGENTS.md

Jungschar Gelterkinden Planungsplattform.

## Hard rules

1. Never modify or redeploy existing production stacks for:
   - `supabase.jungschar-gelterkinden.ch`
   - `notfallblatt.jungschar-gelterkinden.ch`
   - `dateien.jungschar-gelterkinden.ch`
2. If those services break, fixing them is priority over new features.
3. This app only adds `dev.jungschar-gelterkinden.ch`.
4. Priorities 0 (Notfallblatt) and 2 (eCamp) sync from GitHub vendors; do not rewrite those apps inside this repo.
5. Use the existing Supabase project — do not install a second Supabase on the NAS for this app.

## Local commands

```bash
npm run dev
npm run lint
npm run typecheck
npm run build
npm run sync:vendors
```

## Deploy

See `docs/DEPLOY_NAS.md`.
