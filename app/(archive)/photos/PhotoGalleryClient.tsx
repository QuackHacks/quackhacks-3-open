"use client";

/* eslint-disable @next/next/no-img-element */

import { useEffect, useMemo, useState } from "react";
import { DownloadIcon, ExternalLinkIcon, ImageIcon, SearchIcon, XIcon } from "lucide-react";
import type { GalleryPhoto } from "./types";

type Props = {
	photos: GalleryPhoto[];
};

function formatTitle(title: string) {
	return title
		.replace(/[-_]+/g, " ")
		.replace(/\s+/g, " ")
		.trim();
}

export function PhotoGalleryClient({ photos }: Props) {
	const [query, setQuery] = useState("");
	const [activeAlbum, setActiveAlbum] = useState("All");
	const [activeIndex, setActiveIndex] = useState<number | null>(null);

	const albums = useMemo(() => {
		const values = photos.map((photo) => photo.album).filter(Boolean) as string[];
		return ["All", ...Array.from(new Set(values)).sort()];
	}, [photos]);

	const filteredPhotos = useMemo(() => {
		const q = query.trim().toLowerCase();
		return photos.filter((photo) => {
			if (activeAlbum !== "All" && photo.album !== activeAlbum) return false;
			if (!q) return true;
			return `${photo.title} ${photo.album ?? ""}`.toLowerCase().includes(q);
		});
	}, [activeAlbum, photos, query]);

	const activePhoto = activeIndex === null ? null : filteredPhotos[activeIndex] ?? null;
	const activePosition = activeIndex ?? 0;

	useEffect(() => {
		if (!activePhoto) return;

		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") setActiveIndex(null);
			if (event.key === "ArrowLeft") {
				setActiveIndex((index) => (index === null ? null : Math.max(index - 1, 0)));
			}
			if (event.key === "ArrowRight") {
				setActiveIndex((index) =>
					index === null ? null : Math.min(index + 1, filteredPhotos.length - 1),
				);
			}
		};

		document.body.style.overflow = "hidden";
		window.addEventListener("keydown", onKeyDown);
		return () => {
			document.body.style.overflow = "";
			window.removeEventListener("keydown", onKeyDown);
		};
	}, [activePhoto, filteredPhotos.length]);

	useEffect(() => {
		setActiveIndex(null);
	}, [activeAlbum, query]);

	if (!photos.length) {
		return (
			<div className="flex min-h-80 flex-col items-center justify-center border border-neutral-950/15 bg-white/80 p-10 text-center">
				<ImageIcon className="h-8 w-8 text-brand-700" />
				<h2 className="mt-4 font-liebling text-3xl font-bold text-neutral-950">
					No photos yet
				</h2>
				<p className="mt-2 max-w-md text-sm leading-6 text-neutral-600">
					The manifest loaded, but it does not contain any photos.
				</p>
			</div>
		);
	}

	return (
		<>
			<div className="mb-7 grid gap-3 md:grid-cols-[1fr_auto] md:items-center">
				<div className="relative">
					<SearchIcon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
					<input
						type="search"
						value={query}
						onChange={(event) => setQuery(event.target.value)}
						placeholder="Search photos..."
						className="h-11 w-full border border-neutral-950/15 bg-white/85 pl-10 pr-3 text-sm text-neutral-900 outline-none transition-colors placeholder:text-neutral-400 focus:border-brand-700"
					/>
				</div>

				{albums.length > 1 ? (
					<div className="flex flex-wrap gap-2">
						{albums.map((album) => (
							<button
								key={album}
								type="button"
								onClick={() => setActiveAlbum(album)}
								data-active={activeAlbum === album}
								className="border border-neutral-950/15 bg-white/75 px-3 py-2 font-mono text-[10px] uppercase tracking-superwide text-neutral-600 transition-colors hover:border-brand-700 data-[active=true]:border-brand-700 data-[active=true]:bg-brand-700 data-[active=true]:text-white"
							>
								{album}
							</button>
						))}
					</div>
				) : null}
			</div>

			<div className="columns-1 gap-4 sm:columns-2 lg:columns-3 xl:columns-4">
				{filteredPhotos.map((photo, index) => (
					<button
						key={photo.id}
						type="button"
						onClick={() => setActiveIndex(index)}
						className="group mb-4 block w-full break-inside-avoid overflow-hidden border border-neutral-950/15 bg-white text-left shadow-[0_14px_35px_rgba(38,88,53,0.08)] transition-transform duration-200 hover:-translate-y-0.5"
					>
						<img
							src={photo.urls.thumb1200}
							srcSet={`${photo.urls.thumb480} 480w, ${photo.urls.thumb1200} 1200w`}
							sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
							alt={formatTitle(photo.title)}
							loading="lazy"
							width={photo.width}
							height={photo.height}
							className="h-auto w-full bg-neutral-200 object-cover transition-transform duration-300 group-hover:scale-[1.015]"
						/>
						<div className="flex items-center justify-between gap-3 px-3 py-2.5">
							<p className="truncate text-xs font-semibold text-neutral-800">
								{formatTitle(photo.title)}
							</p>
							{photo.album ? (
								<span className="shrink-0 font-mono text-[9px] uppercase tracking-superwide text-brand-700">
									{photo.album}
								</span>
							) : null}
						</div>
					</button>
				))}
			</div>

			{filteredPhotos.length === 0 ? (
				<div className="border border-neutral-950/15 bg-white/80 p-8 text-center text-sm text-neutral-600">
					No matching photos.
				</div>
			) : null}

			{activePhoto ? (
				<div
					role="dialog"
					aria-modal="true"
					className="fixed inset-0 z-80 flex flex-col bg-neutral-950/95 text-white"
				>
					<div className="flex h-14 items-center justify-between border-b border-white/10 px-4">
						<div className="min-w-0">
							<p className="truncate text-sm font-semibold">{formatTitle(activePhoto.title)}</p>
							<p className="font-mono text-[10px] uppercase tracking-superwide text-white/45">
								{activePosition + 1} / {filteredPhotos.length}
							</p>
						</div>
						<div className="flex items-center gap-2">
							<a
								href={activePhoto.urls.full}
								download
								className="inline-flex h-10 w-10 items-center justify-center border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
								aria-label="Download photo"
							>
								<DownloadIcon className="h-4 w-4" />
							</a>
							<a
								href={activePhoto.urls.full}
								target="_blank"
								rel="noreferrer"
								className="inline-flex h-10 w-10 items-center justify-center border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
								aria-label="Open full photo"
							>
								<ExternalLinkIcon className="h-4 w-4" />
							</a>
							<button
								type="button"
								onClick={() => setActiveIndex(null)}
								className="inline-flex h-10 w-10 items-center justify-center border border-white/15 bg-white/10 text-white transition-colors hover:bg-white/20"
								aria-label="Close"
							>
								<XIcon className="h-4 w-4" />
							</button>
						</div>
					</div>

					<div className="grid min-h-0 flex-1 grid-cols-[auto_1fr_auto] items-center gap-2 px-3 py-4 md:gap-4 md:px-5">
						<button
							type="button"
							onClick={() => setActiveIndex((index) => Math.max((index ?? 0) - 1, 0))}
							disabled={activePosition === 0}
							className="h-12 w-10 border border-white/15 bg-white/10 font-mono text-xl text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 md:w-12"
							aria-label="Previous photo"
						>
							&lt;
						</button>
						<img
							src={activePhoto.urls.full}
							alt={formatTitle(activePhoto.title)}
							className="mx-auto max-h-full min-h-0 max-w-full object-contain"
						/>
						<button
							type="button"
							onClick={() =>
								setActiveIndex((index) =>
									Math.min((index ?? 0) + 1, filteredPhotos.length - 1),
								)
							}
							disabled={activePosition === filteredPhotos.length - 1}
							className="h-12 w-10 border border-white/15 bg-white/10 font-mono text-xl text-white transition-colors hover:bg-white/20 disabled:cursor-not-allowed disabled:opacity-30 md:w-12"
							aria-label="Next photo"
						>
							&gt;
						</button>
					</div>
				</div>
			) : null}
		</>
	);
}
