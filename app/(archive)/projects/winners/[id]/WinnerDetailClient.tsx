"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "motion/react";
import { ArrowLeft } from "lucide-react";
import type { ArchivedProject } from "@/lib/types";
import type { AwardMeta } from "@/lib/winners";
import { PLACEMENT_BADGE, SponsorChip, placementMeta } from "../_shared";

const sectionV: Variants = {
	hidden: { opacity: 0, y: 22 },
	show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.08 } },
};
const itemV: Variants = {
	hidden: { opacity: 0, y: 16 },
	show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};
const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-60px" } } as const;

function Panel({ title, children }: { title: string; children: React.ReactNode }) {
	return (
		<motion.div
			variants={itemV}
			className="border border-neutral-200 bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)] md:p-8"
		>
			<h3 className="mb-3 font-mono text-[10px] uppercase tracking-superwide text-neutral-500">{title}</h3>
			{children}
		</motion.div>
	);
}

export function WinnerDetailClient({
	project,
	award,
	embedUrl,
	tags,
}: {
	project: ArchivedProject;
	award: AwardMeta;
	embedUrl: string | null;
	tags: string[];
}) {
	const m = placementMeta(award.placement);
	// QuackHacks result badge — only the overall top three earn one.
	const placeBadge = award.isGrand && award.placement ? PLACEMENT_BADGE[award.placement] : null;
	// Grand prize → celebratory gold banner; track winners → deep brand-green banner.
	const goldBanner = award.isGrand;

	return (
		<main className="relative min-h-full overflow-x-hidden bg-[#f4f4f4]">
			<section className="relative mx-auto w-full max-w-300 px-5 pb-20 pt-24 md:px-8">
				{/* Breadcrumb */}
				<div className="mb-6 flex items-center justify-between">
					<p className="font-mono text-[9px] uppercase tracking-superwide text-neutral-500">
						&gt; Archive /{" "}
						<Link href="/projects" className="transition-colors hover:text-neutral-900">
							Projects
						</Link>{" "}
						/{" "}
						<Link href="/projects/winners" className="transition-colors hover:text-neutral-900">
							Winners
						</Link>{" "}
						/ {project.name}
					</p>
					<Link
						href="/projects/winners"
						className="hidden items-center gap-1.5 border border-neutral-300 bg-white px-3 py-1.5 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 md:inline-flex"
					>
						<ArrowLeft className="h-3 w-3" />
						All winners
					</Link>
				</div>

				{/* ── Champion hero banner ── */}
				<motion.header
					initial={{ opacity: 0, y: 18 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ duration: 0.55, ease: "easeOut" }}
					className={`relative mb-10 overflow-hidden rounded-2xl border p-7 shadow-[0_24px_60px_rgba(0,0,0,0.12)] md:p-10 ${
						goldBanner
							? "gold-background border-amber-300 bg-linear-to-br from-amber-500 via-amber-600 to-yellow-600"
							: "border-brand-700 bg-linear-to-br from-brand-600 via-brand-700 to-brand-900"
					}`}
				>
					{/* Moving sheen */}
					<motion.div
						aria-hidden
						className="pointer-events-none absolute inset-0"
						style={{ background: "linear-gradient(105deg, transparent 42%, rgba(255,255,255,0.22) 50%, transparent 58%)", backgroundSize: "220% 100%" }}
						animate={{ backgroundPosition: ["-220% 0", "220% 0"] }}
						transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
					/>
					{/* Soft glow blob */}
					<div className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-white/15 blur-3xl" />

					<div className="relative flex flex-col gap-5 sm:flex-row sm:items-center">
						{/* QuackHacks place badge — overall top three only */}
						{placeBadge && (
							<motion.div
								initial={{ scale: 0.6, rotate: -12, opacity: 0 }}
								animate={{ scale: 1, rotate: 0, opacity: 1 }}
								transition={{ type: "spring", stiffness: 260, damping: 16, delay: 0.15 }}
								className="shrink-0"
							>
								<motion.div
									animate={{ y: [0, -6, 0] }}
									transition={{ duration: 3.6, repeat: Infinity, ease: "easeInOut" }}
								>
									<Image
										src={placeBadge.src}
										alt={placeBadge.alt}
										width={112}
										height={112}
										className="h-20 w-20 object-contain drop-shadow-lg sm:h-28 sm:w-28"
									/>
								</motion.div>
							</motion.div>
						)}

						<div className="min-w-0 flex-1">
							{/* Award eyebrow */}
							<div className="mb-2 flex flex-wrap items-center gap-2">
								<span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
									{award.placeLabel}
								</span>
								<SponsorChip sponsor={award.sponsor} className="border-white/30 bg-white/90" />
								<span className="font-mono text-[11px] uppercase tracking-superwide text-white/80">{award.trackName}</span>
							</div>

							{project.team_name && (
								<p className="mb-1 font-mono text-[10px] uppercase tracking-superwide text-white/70">
									&gt; Team {project.team_name}
								</p>
							)}
							<h1 className="font-liebling text-4xl font-bold leading-[0.95] text-white drop-shadow-sm md:text-6xl">
								{project.name}
							</h1>
							{project.tagline && (
								<p className="mt-3 max-w-3xl font-sans text-base italic leading-snug text-white/90 md:text-lg">
									{project.tagline}
								</p>
							)}
						</div>
					</div>
				</motion.header>

				{/* ── Body (same information as the standard project page) ── */}
				<motion.div variants={sectionV} {...inView} className="grid grid-cols-1 items-start gap-6 lg:grid-cols-3">
					<div className="flex flex-col gap-6 lg:col-span-2">
						{/* Hero image */}
						<motion.div variants={itemV} className="overflow-hidden border border-neutral-200 bg-white shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
							<div className="relative h-[260px] border-b border-neutral-200 bg-neutral-100 md:h-[420px]">
								{project.image_urls[0] ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img src={project.image_urls[0]} alt={project.name} className="h-full w-full object-cover" />
								) : (
									<div className="flex h-full w-full items-center justify-center">
										<p className="font-mono text-[9px] uppercase tracking-superwide text-neutral-400">No preview image</p>
									</div>
								)}
							</div>
						</motion.div>

						{/* Video */}
						{embedUrl && (
							<Panel title="Video Demo">
								<div className="aspect-video w-full border border-neutral-200">
									<iframe
										src={embedUrl}
										title={`${project.name} demo`}
										className="h-full w-full"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
									/>
								</div>
							</Panel>
						)}

						{/* About */}
						<Panel title="About this project">
							<p className="whitespace-pre-line font-sans text-[0.95rem] leading-7 text-neutral-800">
								{project.description || "No description provided."}
							</p>
						</Panel>

						{/* Gallery */}
						{project.image_urls.length > 1 && (
							<Panel title="Gallery">
								<div className="grid grid-cols-2 gap-3 md:grid-cols-3">
									{project.image_urls.slice(1).map((url) => (
										<div key={url} className="aspect-video overflow-hidden border border-neutral-200 bg-neutral-100">
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img src={url} alt="" className="h-full w-full object-cover transition-transform duration-300 hover:scale-[1.04]" />
										</div>
									))}
								</div>
							</Panel>
						)}
					</div>

					{/* Aside */}
					<aside className="flex flex-col gap-6 lg:sticky lg:top-24">
						{/* Award summary */}
						<motion.div variants={itemV} className={`overflow-hidden rounded-xl border bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)] ${goldBanner ? "border-amber-200" : "border-brand-200"}`}>
							<h3 className="mb-3 font-mono text-[10px] uppercase tracking-superwide text-neutral-500">Award</h3>
							<div className="flex items-center gap-3">
								{placeBadge && (
									<Image
										src={placeBadge.src}
										alt={placeBadge.alt}
										width={56}
										height={56}
										className="h-14 w-14 shrink-0 object-contain drop-shadow"
									/>
								)}
								<div className="min-w-0">
									<p className={`font-instrument-serif text-lg font-bold leading-tight ${m.accentText}`}>{award.placeLabel}</p>
									<p className="truncate font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">{award.trackName}</p>
								</div>
							</div>
						</motion.div>

						{/* Built with */}
						{tags.length > 0 && (
							<motion.div variants={itemV} className="border border-neutral-200 bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
								<h3 className="mb-3 font-mono text-[10px] uppercase tracking-superwide text-neutral-500">Built With</h3>
								<div className="flex flex-wrap gap-1.5">
									{tags.map((tag) => (
										<span
											key={tag}
											className="inline-flex h-[24px] items-center border border-brand-300 bg-brand-100 px-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-brand-800"
										>
											{tag}
										</span>
									))}
								</div>
							</motion.div>
						)}

						{/* Links */}
						{(project.submission_url || project.github_url || project.video_url) && (
							<motion.div variants={itemV} className="flex flex-col gap-3 border border-neutral-200 bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
								<h3 className="font-mono text-[10px] uppercase tracking-superwide text-neutral-500">Links</h3>
								{project.submission_url && (
									<a
										href={project.submission_url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex w-full items-center justify-center border border-neutral-800 bg-neutral-900 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-brand-500 hover:bg-brand-500"
									>
										Try it out
									</a>
								)}
								{project.github_url && (
									<a
										href={project.github_url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex w-full items-center justify-center border border-neutral-800 bg-white py-3 text-xs font-bold uppercase tracking-[0.18em] text-neutral-900 transition-colors hover:bg-neutral-900 hover:text-white"
									>
										GitHub
									</a>
								)}
								{project.video_url && (
									<a
										href={project.video_url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex w-full items-center justify-center border border-neutral-800 bg-brand-500 py-3 text-xs font-bold uppercase tracking-[0.18em] text-white transition-colors hover:border-neutral-900 hover:bg-neutral-900"
									>
										Watch demo
									</a>
								)}
							</motion.div>
						)}

						{/* Tracks */}
						{(project.qh_track || project.mlh_tracks.length > 0) && (
							<motion.div variants={itemV} className="border border-neutral-200 bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
								<h3 className="mb-3 font-mono text-[10px] uppercase tracking-superwide text-neutral-500">Tracks</h3>
								<div className="flex flex-wrap gap-1.5">
									{project.qh_track && (
										<span className="inline-flex h-[24px] items-center border border-green-300 bg-green-100 px-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-green-800">
											QH · {project.qh_track}
										</span>
									)}
									{project.mlh_tracks.map((track) => (
										<span
											key={track}
											className="inline-flex h-[24px] items-center border border-amber-300 bg-amber-100 px-2 font-mono text-[0.7rem] uppercase tracking-[0.12em] text-amber-800"
										>
											MLH · {track}
										</span>
									))}
								</div>
							</motion.div>
						)}

						{/* Team members */}
						{project.members.length > 0 && (
							<motion.div variants={itemV} className="border border-neutral-200 bg-white p-6 shadow-[0_18px_40px_rgba(0,0,0,0.06)]">
								<h3 className="mb-3 font-mono text-[10px] uppercase tracking-superwide text-neutral-500">Team Members</h3>
								<ul className="flex flex-col gap-3">
									{project.members.map((member) => (
										<li key={member.id} className="border border-neutral-200 p-3">
											<p className="font-mono text-[0.85rem] font-semibold text-neutral-900">{member.name}</p>
											{member.university && <p className="mt-1 text-[0.7rem] text-neutral-600">{member.university}</p>}
										</li>
									))}
								</ul>
							</motion.div>
						)}

						<Link
							href="/projects/winners"
							className="inline-flex items-center justify-center gap-1.5 border border-neutral-300 bg-white px-3 py-3 font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-700 transition-colors hover:border-neutral-900 hover:text-neutral-900 md:hidden"
						>
							<ArrowLeft className="h-3 w-3" />
							All winners
						</Link>
					</aside>
				</motion.div>
			</section>
		</main>
	);
}
