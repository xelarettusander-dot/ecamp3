# Vendors

Lokale Spiegel der bestehenden Apps. Produktions-Hosts werden nicht verändert.

| Prio | Ordner | Quelle | Live |
|---|---|---|---|
| 0 | `notfallblatt/` | https://github.com/xelarettusander-dot/notfallblatt | https://notfallblatt.jungschar-gelterkinden.ch |
| 2 | `ecamp3/` | https://github.com/xelarettusander-dot/ecamp3 (`devel`) | lokal/NAS via `npm run start:ecamp` → `:3020` |

```bash
npm run sync:vendors   # GitHub-Updates holen
npm run start:ecamp    # eCamp-Stack separat starten (NAS/Docker)
```

Hinweis: Das Notfallblatt-GitHub-Repo war zum Zeitpunkt des Scaffoldings
nicht öffentlich erreichbar. Die Live-App ist trotzdem im Modul eingebunden.
