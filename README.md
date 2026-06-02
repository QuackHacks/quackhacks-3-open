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

## Photo Gallery

Build public R2-ready originals, thumbnails, and manifest from local originals:

```bash
PHOTO_GALLERY_PUBLIC_BASE=https://photos.quackhacks.com
PHOTO_GALLERY_MANIFEST_URL=https://photos.quackhacks.com/manifest.json
```

Then build public R2-ready originals, thumbnails, and manifest from local originals:

```bash
npm run photos:build -- --input ./photos/originals --output ./dist/photo-gallery
```

Upload `dist/photo-gallery` to the R2 bucket root. CLI override:

```bash
npm run photos:build -- --input ./photos/originals --public-base https://pub-xxxxx.r2.dev
```

The gallery route is `/photos`. Originals stay under `full/`; generated WebP thumbnails live under `thumbs/480/` and `thumbs/1200/`.

## Archive Data

Public archive data lives in `data/*.json`.

- `data/achievements.json`
- `data/leaderboard.json`
- `data/roster.json`
- `data/projects.json`

Keep exported data conservative. Do not archive auth IDs, emails, phone numbers, addresses, resumes, internal notes, private profile fields, or database-only metadata.
