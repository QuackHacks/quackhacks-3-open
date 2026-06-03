#!/usr/bin/env bash
set -euo pipefail

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
DIST_DIR="${ROOT_DIR}/dist/qh3-photos/qh3/photos"
BUCKET="qh-photos-prod"
PREFIX="qh3/photos"
DRY_RUN="--dryrun"

if [[ "${1:-}" == "--execute" ]]; then
	DRY_RUN=""
elif [[ "${1:-}" != "" && "${1:-}" != "--dry-run" ]]; then
	echo "usage: $0 [--dry-run|--execute]" >&2
	exit 2
fi

if ! command -v aws >/dev/null 2>&1; then
	echo "aws CLI not found. Install/configure aws CLI, then rerun." >&2
	exit 1
fi

if [[ ! -f "${DIST_DIR}/manifest.json" ]]; then
	echo "missing ${DIST_DIR}/manifest.json; run photos:build first." >&2
	exit 1
fi

echo "bucket: s3://${BUCKET}/${PREFIX}"
echo "source: ${DIST_DIR}"
if [[ -n "${DRY_RUN}" ]]; then
	echo "mode: dry-run"
else
	echo "mode: execute"
fi

aws s3 sync "${DIST_DIR}/originals" "s3://${BUCKET}/${PREFIX}/originals" \
	${DRY_RUN} \
	--only-show-errors \
	--cache-control "public,max-age=31536000,immutable"

aws s3 sync "${DIST_DIR}/thumbs" "s3://${BUCKET}/${PREFIX}/thumbs" \
	${DRY_RUN} \
	--only-show-errors \
	--cache-control "public,max-age=31536000,immutable"

aws s3 cp "${DIST_DIR}/manifest.json" "s3://${BUCKET}/${PREFIX}/manifest.json" \
	${DRY_RUN} \
	--only-show-errors \
	--content-type "application/json" \
	--cache-control "public,max-age=60"
