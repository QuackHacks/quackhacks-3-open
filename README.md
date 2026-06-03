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

Build public S3/CloudFront-ready originals, thumbnails, and manifest from local originals:

```bash
PHOTO_GALLERY_PUBLIC_BASE=https://photo.quackhacks.org/qh3/photos
PHOTO_GALLERY_MANIFEST_URL=https://photo.quackhacks.org/qh3/photos/manifest.json
```

Then build public S3/CloudFront-ready originals, thumbnails, and manifest from local originals:

```bash
npm run photos:build -- --input ./photos/originals/qh3-deduped --output ./dist/qh3-photos/qh3/photos --public-base https://photo.quackhacks.org/qh3/photos --full-prefix originals --thumb-prefix thumbs
```

Dry-run the S3 upload:

```bash
scripts/upload-qh3-photos-s3.sh --dry-run
```

Execute the S3 upload:

```bash
scripts/upload-qh3-photos-s3.sh --execute
```

The gallery route is `/photos`. In S3, originals stay under `qh3/photos/originals/`; generated WebP thumbnails live under `qh3/photos/thumbs/480/` and `qh3/photos/thumbs/1200/`.

## Archive Data

Public archive data lives in `data/*.json`.

- `data/achievements.json`
- `data/leaderboard.json`
- `data/roster.json`
- `data/projects.json`

Keep exported data conservative. Do not archive auth IDs, emails, phone numbers, addresses, resumes, internal notes, private profile fields, or database-only metadata.
