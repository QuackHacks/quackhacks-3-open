import type { Metadata } from "next";
import { CameraIcon, CloudIcon } from "lucide-react";
import { PhotoGalleryClient } from "./PhotoGalleryClient";
import type { GalleryManifest } from "./types";

export const metadata: Metadata = {
	title: "Photos | QuackHacks",
	description: "Browse photos from QuackHacks 3.",
};

const manifestUrl =
	process.env.PHOTO_GALLERY_MANIFEST_URL ?? process.env.NEXT_PUBLIC_PHOTO_GALLERY_MANIFEST_URL;

async function getGalleryManifest(): Promise<GalleryManifest | null> {
	if (!manifestUrl) return null;

	try {
		const response = await fetch(manifestUrl, {
			next: { revalidate: 300 },
		});

		if (!response.ok) return null;

		const data = (await response.json()) as GalleryManifest;
		if (!Array.isArray(data.photos)) return null;

		return data;
	} catch {
		return null;
	}
}

export default async function PhotosPage() {
	const manifest = await getGalleryManifest();
	const photos = manifest?.photos ?? [];

	return (
		<main className="relative min-h-screen overflow-hidden bg-[#f3f4ef] text-neutral-950">
			<div aria-hidden="true" className="pointer-events-none absolute inset-0">
				<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(255,255,255,0.82),rgba(243,244,239,0.45)_38%,rgba(223,231,213,0.72)),radial-gradient(70%_60%_at_82%_8%,rgba(52,124,69,0.20),transparent_62%)]" />
				<div className="absolute inset-0 opacity-[0.14] bg-[linear-gradient(#265835_1px,transparent_1px),linear-gradient(90deg,#265835_1px,transparent_1px)] [background-size:38px_38px]" />
				<div className="absolute left-6 top-28 hidden h-28 w-28 rotate-12 border-2 border-neutral-950/20 bg-white/50 md:block" />
				<div className="absolute bottom-20 right-8 hidden h-20 w-44 -rotate-6 border-2 border-dashed border-brand-700/35 md:block" />
			</div>

			<section className="relative mx-auto w-full max-w-350 px-5 pb-20 pt-24 md:px-8">
				<div className="mb-8 grid gap-6 border-b border-neutral-950/15 pb-7 md:grid-cols-[1fr_auto] md:items-end">
					<div>
						<p className="mb-3 inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-superwide text-brand-700">
							<CameraIcon className="h-3.5 w-3.5" />
							Event archive
						</p>
						<h1 className="font-liebling text-5xl font-black leading-[0.9] tracking-normal text-neutral-950 md:text-7xl">
							Photo Roll
						</h1>
						<p className="mt-4 max-w-2xl font-sans text-sm leading-6 text-neutral-600 md:text-base">
							Browse the QuackHacks 3 camera roll. Thumbnails load from Cloudflare R2;
							full-size originals stay one click away.
						</p>
					</div>

					<div className="grid grid-cols-2 gap-3 md:min-w-72">
						<div className="border border-neutral-950/15 bg-white/75 p-4">
							<p className="font-mono text-[9px] uppercase tracking-superwide text-neutral-500">
								Photos
							</p>
							<p className="mt-1 font-liebling text-3xl font-bold text-neutral-950">
								{photos.length}
							</p>
						</div>
						<div className="border border-neutral-950/15 bg-white/75 p-4">
							<p className="font-mono text-[9px] uppercase tracking-superwide text-neutral-500">
								Source
							</p>
							<p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-neutral-900">
								<CloudIcon className="h-4 w-4 text-brand-700" />
								R2
							</p>
						</div>
					</div>
				</div>

				{manifest ? (
					<PhotoGalleryClient photos={photos} />
				) : (
					<div className="border border-neutral-950/15 bg-white/80 p-8 shadow-[0_18px_45px_rgba(38,88,53,0.08)]">
						<p className="font-mono text-[10px] uppercase tracking-superwide text-neutral-500">
							Manifest missing
						</p>
						<h2 className="mt-3 font-liebling text-3xl font-bold text-neutral-950">
							Set PHOTO_GALLERY_MANIFEST_URL
						</h2>
						<p className="mt-3 max-w-2xl text-sm leading-6 text-neutral-600">
							Point it at the public R2 manifest URL, then rebuild. Example:
							{" "}
							<code className="border border-neutral-200 bg-neutral-50 px-1.5 py-0.5 font-mono text-xs">
								https://photos.quackhacks.com/manifest.json
							</code>
						</p>
					</div>
				)}
			</section>
		</main>
	);
}
