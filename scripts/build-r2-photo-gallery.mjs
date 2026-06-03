#!/usr/bin/env node
import crypto from "node:crypto";
import { existsSync, readFileSync } from "node:fs";
import { copyFile, mkdir, readdir, writeFile } from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import sharp from "sharp";

const supportedExtensions = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif", ".tif", ".tiff"]);

function loadDotEnv(filePath = ".env") {
	if (!existsSync(filePath)) return;

	const lines = readFileSync(filePath, "utf8").split(/\r?\n/);
	for (const line of lines) {
		const trimmed = line.trim();
		if (!trimmed || trimmed.startsWith("#")) continue;

		const match = trimmed.match(/^(?:export\s+)?([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
		if (!match) continue;

		const [, key, rawValue] = match;
		if (process.env[key] !== undefined) continue;

		process.env[key] = rawValue
			.trim()
			.replace(/^(['"])(.*)\1$/, "$2");
	}
}

loadDotEnv();

const defaultPublicBase =
	process.env.PHOTO_GALLERY_PUBLIC_BASE ??
	process.env.NEXT_PUBLIC_PHOTO_GALLERY_PUBLIC_BASE ??
	process.env.PHOTO_GALLERY_MANIFEST_URL?.replace(/\/manifest\.json$/i, "") ??
	process.env.NEXT_PUBLIC_PHOTO_GALLERY_MANIFEST_URL?.replace(/\/manifest\.json$/i, "") ??
	"";

function parseArgs(argv) {
	const args = {
		input: "",
		output: "dist/photo-gallery",
		publicBase: defaultPublicBase,
		fullPrefix: "full",
		thumbPrefix: "thumbs",
	};

	for (let index = 0; index < argv.length; index += 1) {
		const arg = argv[index];
		if (arg === "--input") args.input = argv[++index] ?? "";
		else if (arg === "--output") args.output = argv[++index] ?? args.output;
		else if (arg === "--public-base") args.publicBase = argv[++index] ?? "";
		else if (arg === "--full-prefix") args.fullPrefix = argv[++index] ?? args.fullPrefix;
		else if (arg === "--thumb-prefix") args.thumbPrefix = argv[++index] ?? args.thumbPrefix;
		else if (arg === "--help") {
			printHelp();
			process.exit(0);
		}
	}

	return args;
}

function printHelp() {
	console.log(`
Usage:
  node scripts/build-r2-photo-gallery.mjs --input ./photos/originals

Options:
  --input         Local folder of original photos. Required.
  --output        Local output folder. Default: dist/photo-gallery
  --public-base   Public R2 base URL. Defaults to PHOTO_GALLERY_PUBLIC_BASE, NEXT_PUBLIC_PHOTO_GALLERY_PUBLIC_BASE, or manifest URL env without /manifest.json.
  --full-prefix   Output prefix for originals. Default: full
  --thumb-prefix  Output prefix for thumbnails. Default: thumbs
`);
}

async function walk(directory) {
	const entries = await readdir(directory, { withFileTypes: true });
	const files = await Promise.all(
		entries.map(async (entry) => {
			const fullPath = path.join(directory, entry.name);
			if (entry.isDirectory()) return walk(fullPath);
			if (!entry.isFile()) return [];
			return [fullPath];
		}),
	);
	return files.flat();
}

function toPosix(value) {
	return value.split(path.sep).join("/");
}

function cleanPathSegment(value) {
	return value
		.normalize("NFKD")
		.replace(/[^\w.-]+/g, "-")
		.replace(/-+/g, "-")
		.replace(/^-|-$/g, "")
		.toLowerCase();
}

function buildOutputPath(relativePath) {
	const parsed = path.parse(relativePath);
	const directory = parsed.dir
		.split(path.sep)
		.filter(Boolean)
		.map(cleanPathSegment)
		.join(path.sep);
	const name = cleanPathSegment(parsed.name) || crypto.randomUUID();
	const extension = parsed.ext.toLowerCase();
	return path.join(directory, `${name}${extension}`);
}

function joinUrl(...parts) {
	return parts
		.map((part, index) => {
			const text = String(part);
			if (index === 0) return text.replace(/\/+$/g, "");
			return text.replace(/^\/+|\/+$/g, "");
		})
		.filter(Boolean)
		.join("/");
}

function getAlbum(relativePath) {
	const directory = path.dirname(relativePath);
	if (!directory || directory === ".") return undefined;
	return toPosix(directory).split("/")[0];
}

async function processPhoto({ inputFile, inputRoot, outputRoot, publicBase, fullPrefix, thumbPrefix }) {
	const relativePath = path.relative(inputRoot, inputFile);
	const originalRelativePath = buildOutputPath(relativePath);
	const thumbRelativePath = originalRelativePath.replace(/\.[^.]+$/, ".webp");
	const fullOutputPath = path.join(outputRoot, fullPrefix, originalRelativePath);
	const thumb480Path = path.join(outputRoot, thumbPrefix, "480", thumbRelativePath);
	const thumb1200Path = path.join(outputRoot, thumbPrefix, "1200", thumbRelativePath);

	await mkdir(path.dirname(fullOutputPath), { recursive: true });
	await mkdir(path.dirname(thumb480Path), { recursive: true });
	await mkdir(path.dirname(thumb1200Path), { recursive: true });

	const image = sharp(inputFile, { failOn: "none" }).rotate();
	const metadata = await image.metadata();
	const width = metadata.width ?? 1;
	const height = metadata.height ?? 1;

	await Promise.all([
		copyFile(inputFile, fullOutputPath),
		sharp(inputFile, { failOn: "none" })
			.rotate()
			.resize({ width: 480, withoutEnlargement: true })
			.webp({ quality: 78 })
			.toFile(thumb480Path),
		sharp(inputFile, { failOn: "none" })
			.rotate()
			.resize({ width: 1200, withoutEnlargement: true })
			.webp({ quality: 82 })
			.toFile(thumb1200Path),
	]);

	const title = path.parse(relativePath).name;
	const id = crypto
		.createHash("sha1")
		.update(toPosix(relativePath))
		.digest("hex")
		.slice(0, 12);

	return {
		id,
		title,
		album: getAlbum(relativePath),
		width,
		height,
		aspectRatio: Number((width / height).toFixed(4)),
		urls: {
			full: joinUrl(publicBase, fullPrefix, toPosix(originalRelativePath)),
			thumb480: joinUrl(publicBase, thumbPrefix, "480", toPosix(thumbRelativePath)),
			thumb1200: joinUrl(publicBase, thumbPrefix, "1200", toPosix(thumbRelativePath)),
		},
	};
}

async function main() {
	const args = parseArgs(process.argv.slice(2));
	if (!args.input || !args.publicBase) {
		printHelp();
		process.exit(1);
	}

	const inputRoot = path.resolve(args.input);
	const outputRoot = path.resolve(args.output);
	const allFiles = await walk(inputRoot);
	const imageFiles = allFiles.filter((file) => supportedExtensions.has(path.extname(file).toLowerCase()));

	await mkdir(outputRoot, { recursive: true });

	const photos = [];
	for (const inputFile of imageFiles) {
		const photo = await processPhoto({
			inputFile,
			inputRoot,
			outputRoot,
			publicBase: args.publicBase,
			fullPrefix: args.fullPrefix,
			thumbPrefix: args.thumbPrefix,
		});
		photos.push(photo);
		console.log(`processed ${path.relative(inputRoot, inputFile)}`);
	}

	photos.sort((a, b) => a.id.localeCompare(b.id));

	const manifest = {
		generatedAt: new Date().toISOString(),
		photoCount: photos.length,
		photos,
	};

	await writeFile(path.join(outputRoot, "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`);
	console.log(`wrote ${photos.length} photos to ${outputRoot}`);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
