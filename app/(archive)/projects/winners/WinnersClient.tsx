"use client";

import Link from "next/link";
import Image from "next/image";
import { motion, type Variants } from "motion/react";
import { ArrowUpRight } from "lucide-react";
import type { Sponsor, WinnerCard, WinnersView, WinnerPlacement } from "@/lib/winners";
import { PLACEMENT_BADGE, SponsorChip, placementMeta } from "./_shared";
import { WinnersBackground } from "./WinnersBackground";

// ── Shared motion variants ──────────────────────────────────────────────────

const sectionV: Variants = {
	hidden: { opacity: 0, y: 24 },
	show: {
		opacity: 1,
		y: 0,
		transition: { duration: 0.5, ease: "easeOut", staggerChildren: 0.09 },
	},
};

const itemV: Variants = {
	hidden: { opacity: 0, y: 18 },
	show: { opacity: 1, y: 0, transition: { duration: 0.45, ease: "easeOut" } },
};

// Nested container that cascades its direct motion children once revealed.
const staggerWrap: Variants = {
	hidden: {},
	show: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
};

const inView = { initial: "hidden", whileInView: "show", viewport: { once: true, margin: "-70px" } } as const;

function initials(name: string) {
	return name
		.split(/\s+/)
		.map((w) => w[0])
		.filter(Boolean)
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

// ── Project image / placeholder ──────────────────────────────────────────────

function CardImage({ card, className, zoom = true }: { card: WinnerCard; className: string; zoom?: boolean }) {
	if (card.image) {
		return (
			// eslint-disable-next-line @next/next/no-img-element
			<img
				src={card.image}
				alt={`${card.name} preview`}
				className={`h-full w-full object-cover ${zoom ? "transition-transform duration-500 group-hover:scale-[1.05]" : ""} ${className}`}
			/>
		);
	}
	return (
		<div className={`flex h-full w-full items-center justify-center bg-linear-to-br from-neutral-100 to-neutral-200 ${className}`}>
			<span className="font-instrument-serif text-3xl font-bold text-neutral-400">{initials(card.name)}</span>
		</div>
	);
}

// ── Grand prize podium column ─────────────────────────────────────────────────

const PEDESTAL: Record<WinnerPlacement, { h: string; order: string; grad: string }> = {
	1: { h: "h-24 sm:h-28", order: "order-2", grad: "from-amber-300 via-amber-200 to-amber-100" },
	2: { h: "h-14 sm:h-16", order: "order-1", grad: "from-slate-300 via-slate-200 to-slate-100" },
	3: { h: "h-9 sm:h-10", order: "order-3", grad: "from-orange-300 via-amber-200 to-amber-100" },
};

function PodiumColumn({ card }: { card: WinnerCard }) {
	const place = (card.placement ?? 1) as WinnerPlacement;
	const m = placementMeta(place);
	const ped = PEDESTAL[place];
	const badge = PLACEMENT_BADGE[place];

	const isFirst = place === 1;
	const imgH = isFirst ? "h-32 sm:h-44" : "h-24 sm:h-32";

	return (
		<motion.div variants={itemV} className={`flex min-w-0 flex-1 flex-col ${ped.order}`}>
			<Link
				href={`/projects/winners/${card.id}`}
				className="group relative flex flex-col rounded-t-xl focus:outline-none focus-visible:ring-2 focus-visible:ring-brand-500 focus-visible:ring-offset-2"
			>
				{/* Glow behind the champion */}
				{isFirst && (
					<motion.div
						aria-hidden
						className={`pointer-events-none absolute -inset-3 -z-10 rounded-3xl ${m.glow} blur-2xl`}
						animate={{ opacity: [0.45, 0.85, 0.45], scale: [0.97, 1.03, 0.97] }}
						transition={{ duration: 3.4, repeat: Infinity, ease: "easeInOut" }}
					/>
				)}

				<div
					className={`relative flex flex-col items-center gap-2 overflow-hidden rounded-t-xl border bg-linear-to-b ${m.cardTint} px-2 pb-4 pt-5 shadow-sm transition-all duration-300 group-hover:-translate-y-1 group-hover:shadow-xl ${isFirst ? "border-amber-200 ring-1 ring-amber-200" : "border-neutral-200"}`}
				>
					{/* Shimmer sweep (desktop only) */}
					<motion.div
						aria-hidden
						className="pointer-events-none absolute inset-0 hidden sm:block"
						style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%)", backgroundSize: "200% 100%" }}
						animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
						transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: place * 0.6 + 0.8 }}
					/>

					{/* Image */}
					<div className={`relative w-full ${imgH} overflow-hidden rounded-lg border ${isFirst ? "border-amber-200" : "border-neutral-200"} bg-neutral-100`}>
						<CardImage card={card} className="" />
						{/* QuackHacks place badge */}
						<Image
							src={badge.src}
							alt={badge.alt}
							width={64}
							height={64}
							className={`absolute left-1.5 top-1.5 z-10 object-contain drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] ${isFirst ? "h-14 w-14" : "h-11 w-11"}`}
						/>
					</div>

					{/* Name + team */}
					<div className="flex w-full flex-col items-center text-center">
						<p className={`w-full truncate font-instrument-serif font-bold text-neutral-900 ${isFirst ? "text-base sm:text-xl" : "text-sm sm:text-base"} transition-colors group-hover:text-brand-600`}>
							{card.name}
						</p>
						{card.teamName && (
							<p className="mt-0.5 w-full truncate font-mono text-[9px] uppercase tracking-superwide text-neutral-500">
								Team {card.teamName}
							</p>
						)}
						<span className="mt-2 inline-flex items-center gap-1 font-mono text-[9px] uppercase tracking-[0.18em] text-neutral-400 transition-colors group-hover:text-brand-600">
							View
							<ArrowUpRight className="h-3 w-3 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
						</span>
					</div>
				</div>

				{/* Pedestal */}
				<div className={`relative flex ${ped.h} items-center justify-center overflow-hidden rounded-b-sm bg-linear-to-b ${ped.grad} shadow-inner ${isFirst ? "gold-background" : ""}`}>
					<span className={`font-mono text-sm font-black tracking-widest ${m.accentText} opacity-60`}>{m.roman}</span>
				</div>
			</Link>
		</motion.div>
	);
}

// ── Generic track winner card ─────────────────────────────────────────────────

type CardVariant = "podium" | "partner" | "compact";

function TrackWinnerCard({
	card,
	sponsor,
	trackName,
	variant,
	emphasize = false,
}: {
	card: WinnerCard;
	sponsor: Sponsor;
	trackName: string;
	variant: CardVariant;
	emphasize?: boolean;
}) {
	const m = placementMeta(card.placement);
	const imgH = variant === "partner" ? "h-44" : variant === "podium" ? "h-36" : "h-28";
	const showTagline = variant === "partner";
	const isSponsorAward = sponsor !== "MLH";
	const isTopSponsorAward = isSponsorAward && (card.placement === 1 || !card.placement);
	const sponsorLabel = isSponsorAward
		? card.placement
			? `${sponsor} ${m.label}`
			: `${sponsor} 1st`
		: undefined;
	const detailLabel = isSponsorAward
		? null
		: card.placement
			? `${m.label} · ${trackName}`
			: `${trackName} Winner`;

	return (
		<motion.div variants={itemV} className="min-w-0">
			<Link
				href={`/projects/winners/${card.id}`}
				className={`group relative flex h-full flex-col overflow-hidden rounded-xl border bg-white shadow-[0_14px_34px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_22px_50px_rgba(0,0,0,0.10)] ${
					emphasize || isTopSponsorAward ? "border-amber-300 ring-1 ring-amber-200" : "border-neutral-200 hover:border-neutral-900/70"
				}`}
			>
				{/* Image */}
				<div className={`relative ${imgH} overflow-hidden border-b border-neutral-200 bg-neutral-100`}>
					<CardImage card={card} className="" />
					<div className="pointer-events-none absolute inset-x-0 bottom-0 h-14 bg-linear-to-t from-black/25 to-transparent" />

					{/* Sponsor chip */}
					<div className="absolute right-2.5 top-2.5">
						<SponsorChip sponsor={sponsor} label={sponsorLabel} className="bg-white/90 backdrop-blur-sm" />
					</div>
				</div>

				{/* Body */}
				<div className="flex grow flex-col gap-1.5 p-4">
					{detailLabel && (
						<p className="font-mono text-[9px] uppercase tracking-superwide text-neutral-400">
							{detailLabel}
						</p>
					)}
					<h3 className="font-instrument-serif text-xl font-bold leading-tight text-neutral-900 transition-colors group-hover:text-brand-600">
						{card.name}
					</h3>
					{card.teamName && (
						<p className="font-mono text-[10px] uppercase tracking-[0.14em] text-neutral-500">
							Team {card.teamName}
						</p>
					)}
					{showTagline && card.tagline && (
						<p className="mt-0.5 line-clamp-2 font-sans text-[0.82rem] italic leading-snug text-neutral-600">
							{card.tagline}
						</p>
					)}
					<div className="mt-auto flex items-center justify-between border-t border-neutral-100 pt-2.5">
						<span className="font-mono text-[10px] uppercase tracking-[0.18em] text-neutral-500 transition-colors group-hover:text-neutral-900">
							View project
						</span>
						<ArrowUpRight className="h-4 w-4 text-neutral-400 transition-all group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-brand-600" />
					</div>
				</div>
			</Link>
		</motion.div>
	);
}

// ── Section heading ───────────────────────────────────────────────────────────

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
	return (
		<motion.div variants={itemV} className="mb-6">
			<h2 className="font-liebling text-2xl font-bold text-neutral-900 md:text-3xl">{title}</h2>
			{subtitle && <p className="mt-1 max-w-2xl text-sm leading-relaxed text-neutral-500">{subtitle}</p>}
		</motion.div>
	);
}

// ── Page ───────────────────────────────────────────────────────────────────────

export function WinnersClient({ view }: { view: WinnersView }) {
	const { grand, podiumTracks, partnerTracks, mlhTracks } = view;

	return (
		<main className="relative min-h-full overflow-x-hidden bg-[#f4f4f4]">
			<WinnersBackground />
			<section className="relative mx-auto max-w-6xl px-5 pb-24 pt-24 md:px-8">
				{/* ── Header ── */}
				<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="mb-12">
					<div className="flex items-center gap-3">
						<h1 className="font-liebling text-4xl font-bold leading-[0.95] text-neutral-900 md:text-6xl">
							<span className="qh-color-text mt-5">Winners</span>
						</h1>
					</div>
				</motion.div>

				{/* ── Grand prize podium ── */}
				<motion.section variants={sectionV} {...inView} className="mb-20">
					<SectionHeading title={grand.name} subtitle={grand.blurb} />
					<motion.div variants={staggerWrap} className="mx-auto flex max-w-3xl items-end gap-2 sm:gap-4">
						{grand.winners.map((card) => (
							<PodiumColumn key={card.id} card={card} />
						))}
					</motion.div>
				</motion.section>

				{/* ── Sponsor podium tracks ── */}
				<motion.section variants={sectionV} {...inView} className="mb-16">
					<SectionHeading title="Sponsor Tracks" subtitle="Winners from each of our sponsor tracks." />
					<div className="flex flex-col gap-10">
						{[...podiumTracks, ...partnerTracks].map((track) => (
							<div key={track.id}>
								<motion.div variants={itemV} className="mb-4 flex flex-wrap items-center gap-3">
									<h3 className="font-instrument-serif text-2xl font-bold text-neutral-900">{track.name}</h3>
								</motion.div>
								<motion.div variants={staggerWrap} className="grid grid-cols-1 gap-5 sm:grid-cols-3">
									{track.winners.map((card) => (
										<TrackWinnerCard
											key={card.id}
											card={card}
											sponsor={track.sponsor}
											trackName={track.name}
											variant="podium"
											emphasize={card.placement === 1}
										/>
									))}
								</motion.div>
							</div>
						))}
					</div>
				</motion.section>

				{/* ── MLH tracks ── */}
				<motion.section variants={sectionV} {...inView}>
					<SectionHeading
						title="MLH Tracks"
						subtitle="Best use of each sponsor technology, judged by Major League Hacking."
					/>
					<motion.div variants={staggerWrap} className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
						{mlhTracks.map((track) => (
							<TrackWinnerCard
								key={track.id}
								card={track.winners[0]}
								sponsor={track.sponsor}
								trackName={track.name}
								variant="compact"
							/>
						))}
					</motion.div>
				</motion.section>
			</section>
		</main>
	);
}
