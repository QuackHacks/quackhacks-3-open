# QuackHacks 3 Archive

Static archive of the QuackHacks 3 site.

## Run

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
```

## Archive Data

Public archive data lives in `data/*.json`.

- `data/achievements.json`
- `data/leaderboard.json`
- `data/roster.json`
- `data/projects.json`

Keep exported data conservative. Do not archive auth IDs, emails, phone numbers, addresses, resumes, internal notes, private profile fields, or database-only metadata.
