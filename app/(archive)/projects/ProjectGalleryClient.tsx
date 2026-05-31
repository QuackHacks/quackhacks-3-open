"use client";

import { useMemo, useState } from "react";
import { SubmissionCard, type SubmissionCardData } from "./SubmissionCard";

type TrackFilter = "All" | "Base44" | "Google" | "Pipeworks" | "General";
type MlhFilter =
	| "All"
	| "gemini_api"
	| "snowflake_api"
	| "elevenlabs"
	| "digitalocean"
	| "solana"
	| "tech_domains"
	| "backboard";

const TRACK_FILTERS: TrackFilter[] = ["All", "General", "Base44", "Google", "Pipeworks"];

const TRACK_META: Record<TrackFilter, { label: string; cls: string }> = {
	All: {
		label: "All",
		cls: "bg-neutral-100 text-neutral-700 border-neutral-300 data-[active=true]:bg-neutral-900 data-[active=true]:text-white data-[active=true]:border-neutral-900",
	},
	General: {
		label: "General",
		cls: "bg-amber-50 text-amber-800 border-amber-300 data-[active=true]:bg-amber-500 data-[active=true]:text-white data-[active=true]:border-amber-500",
	},
	Base44: {
		label: "Base44",
		cls: "bg-violet-50 text-violet-800 border-violet-300 data-[active=true]:bg-violet-600 data-[active=true]:text-white data-[active=true]:border-violet-600",
	},
	Google: {
		label: "Google",
		cls: "bg-sky-50 text-sky-800 border-sky-300 data-[active=true]:bg-sky-600 data-[active=true]:text-white data-[active=true]:border-sky-600",
	},
	Pipeworks: {
		label: "Pipeworks",
		cls: "bg-rose-50 text-rose-800 border-rose-300 data-[active=true]:bg-rose-600 data-[active=true]:text-white data-[active=true]:border-rose-600",
	},
};

const MLH_FILTERS: MlhFilter[] = [
	"All",
	"gemini_api",
	"snowflake_api",
	"elevenlabs",
	"digitalocean",
	"solana",
	"tech_domains",
	"backboard",
];

const MLH_LABEL: Record<MlhFilter, string> = {
	All: "All",
	gemini_api: "Gemini",
	snowflake_api: "Snowflake",
	elevenlabs: "ElevenLabs",
	digitalocean: "Digital Ocean",
	solana: "Solana",
	tech_domains: ".Tech Domains",
	backboard: "Backboard",
};

const MLH_PILL_CLS =
	"bg-neutral-50 text-neutral-700 border-neutral-300 data-[active=true]:bg-neutral-900 data-[active=true]:text-white data-[active=true]:border-neutral-900";

export function ProjectGalleryClient({ cards }: { cards: SubmissionCardData[] }) {
	const [query, setQuery] = useState("");
	const [activeTrack, setActiveTrack] = useState<TrackFilter>("All");
	const [activeMlh, setActiveMlh] = useState<MlhFilter>("All");

	const trackCounts = useMemo(() => {
		const counts: Record<TrackFilter, number> = {
			All: cards.length,
			General: 0,
			Base44: 0,
			Google: 0,
			Pipeworks: 0,
		};
		for (const c of cards) {
			if (!c.qh_track) counts.General += 1;
			else if (c.qh_track in counts) counts[c.qh_track as TrackFilter] += 1;
		}
		return counts;
	}, [cards]);

	const mlhCounts = useMemo(() => {
		const counts: Record<MlhFilter, number> = {
			All: cards.length,
			gemini_api: 0,
			snowflake_api: 0,
			elevenlabs: 0,
			digitalocean: 0,
			solana: 0,
			tech_domains: 0,
			backboard: 0,
		};
		for (const c of cards) {
			for (const t of c.mlh_tracks) {
				if (t in counts) counts[t as MlhFilter] += 1;
			}
		}
		return counts;
	}, [cards]);

	const filteredCards = useMemo(() => {
		const q = query.trim().toLowerCase();
		return cards.filter((c) => {
			if (activeTrack !== "All") {
				if (activeTrack === "General") {
					if (c.qh_track) return false;
				} else if (c.qh_track !== activeTrack) {
					return false;
				}
			}
			if (activeMlh !== "All" && !c.mlh_tracks.includes(activeMlh)) {
				return false;
			}
			if (!q) return true;
			return c.name.toLowerCase().includes(q);
		});
	}, [cards, query, activeTrack, activeMlh]);

	const totalProjects = cards.length;
	const totalTeams = useMemo(
		() => new Set(cards.map((c) => c.team_name).filter(Boolean)).size,
		[cards],
	);
	const uniqueTechs = useMemo(
		() =>
			new Set(
				cards.flatMap((c) =>
					c.tech_stack
						.split(",")
						.map((t) => t.trim())
						.filter(Boolean),
				),
			).size,
		[cards],
	);

	return (
		<>
			{totalProjects > 0 ? (
				<div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-10">
					{[
						{ label: "Submissions", value: String(totalProjects) },
						{ label: "Teams", value: String(totalTeams) },
						{ label: "Unique Techs", value: String(uniqueTechs) },
					].map((s) => (
						<div
							key={s.label}
							className="bg-white border border-neutral-200 p-4 shadow-[0_18px_40px_rgba(0,0,0,0.04)]"
						>
							<p className="text-[9px] font-mono uppercase tracking-superwide text-neutral-400 mb-1">
								{s.label}
							</p>
							<p className="font-instrument-serif text-2xl font-bold text-neutral-900">
								{s.value}
							</p>
						</div>
					))}
				</div>
			) : null}

			{totalProjects > 0 ? (
				<div className="mb-6 flex flex-col gap-4">
					<div className="relative">
						<svg
							aria-hidden="true"
							viewBox="0 0 24 24"
							fill="none"
							stroke="currentColor"
							strokeWidth="2"
							className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-neutral-400"
						>
							<circle cx="11" cy="11" r="7" />
							<path d="m21 21-4.3-4.3" strokeLinecap="round" />
						</svg>
						<input
							type="search"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="Search projects by name..."
							className="w-full bg-white border border-neutral-300 pl-10 pr-3 py-2.5 text-sm placeholder:text-neutral-400 focus:outline-none focus:border-neutral-900 transition-colors"
						/>
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<p className="font-mono text-[9px] uppercase tracking-superwide text-neutral-500 mr-1">
							&gt; QH Track:
						</p>
						{TRACK_FILTERS.map((t) => {
							const meta = TRACK_META[t];
							return (
								<button
									key={t}
									type="button"
									onClick={() => setActiveTrack(t)}
									data-active={activeTrack === t}
									className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ${meta.cls}`}
								>
									{meta.label}
									<span className="font-mono text-[10px] opacity-70">
										{trackCounts[t]}
									</span>
								</button>
							);
						})}
					</div>

					<div className="flex flex-wrap items-center gap-2">
						<p className="font-mono text-[9px] uppercase tracking-superwide text-neutral-500 mr-1">
							&gt; MLH Track:
						</p>
						{MLH_FILTERS.map((m) => (
							<button
								key={m}
								type="button"
								onClick={() => setActiveMlh(m)}
								data-active={activeMlh === m}
								className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-semibold transition-colors duration-150 ${MLH_PILL_CLS}`}
							>
								{MLH_LABEL[m]}
								<span className="font-mono text-[10px] opacity-70">
									{mlhCounts[m]}
								</span>
							</button>
						))}
					</div>
				</div>
			) : null}

			{cards.length === 0 ? (
				<div className="bg-white border border-neutral-200 shadow-[0_18px_40px_rgba(0,0,0,0.04)] p-12 text-center">
					<h2 className="font-instrument-serif font-bold text-3xl text-neutral-900 mb-2">
						No submissions yet
					</h2>
					<p className="font-sans text-neutral-600 text-sm max-w-md mx-auto">
						Once teams start submitting projects, they&apos;ll show up here for
						everyone to browse.
					</p>
				</div>
			) : filteredCards.length === 0 ? (
				<div className="bg-white border border-neutral-200 shadow-[0_18px_40px_rgba(0,0,0,0.04)] p-12 text-center">
					<h2 className="font-instrument-serif font-bold text-2xl text-neutral-900 mb-2">
						No projects match your filters
					</h2>
					<p className="font-sans text-neutral-600 text-sm max-w-md mx-auto">
						Try a different search term or clear the track filter.
					</p>
					<button
						type="button"
						onClick={() => {
							setQuery("");
							setActiveTrack("All");
							setActiveMlh("All");
						}}
						className="mt-5 inline-flex items-center font-mono text-[11px] uppercase tracking-[0.18em] border border-neutral-900 bg-neutral-900 text-white px-4 py-2 hover:bg-neutral-800 transition-colors"
					>
						Reset filters
					</button>
				</div>
			) : (
				<div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
					{filteredCards.map((submission) => (
						<SubmissionCard
							key={submission.id}
							submission={submission}
							href={`/projects/${submission.id}`}
						/>
					))}
				</div>
			)}
		</>
	);
}
