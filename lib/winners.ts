import { getProjectById } from "@/lib/archive";
import type { ArchivedProject } from "@/lib/types";

/**
 * QuackHacks 3 award results.
 *
 * The archive `projects.json` does not carry a `prize_won` value, so the
 * canonical winner → track mapping lives here. Each project id below is a real
 * slug present in `data/projects.json` (validated at build via getProjectById).
 */

export type WinnerPlacement = 1 | 2 | 3;

export type Sponsor =
	| "QuackHacks"
	| "Base44"
	| "Pipeworks"
	| "Google"
	| "MongoDB"
	| "MLH";

export type TrackWinnerRef = {
	projectId: string;
	/** Present only for tracks judged with a 1st/2nd/3rd podium. */
	placement?: WinnerPlacement;
};

export type WinnerTrackDef = {
	/** Stable key used for React keys + scroll anchors (not a route segment). */
	id: string;
	/** Display name of the track / award. */
	name: string;
	sponsor: Sponsor;
	/** One-line descriptor shown under the track heading. */
	blurb?: string;
	winners: TrackWinnerRef[];
};

/** The overall grand prize — rendered as the hero podium. */
export const GRAND_PRIZE: WinnerTrackDef = {
	id: "grand",
	name: "QuackHacks Grand Prize",
	sponsor: "QuackHacks",
	blurb: "The best overall projects of QuackHacks 3.",
	winners: [
		{ projectId: "er-overwatch", placement: 1 },
		{ projectId: "touchpoint", placement: 2 },
		{ projectId: "oncoscope", placement: 3 },
	],
};

/** Sponsor tracks judged with a full 1st / 2nd / 3rd podium. */
export const PODIUM_TRACKS: WinnerTrackDef[] = [
	{
		id: "pipeworks",
		name: "Pipeworks",
		sponsor: "Pipeworks",
		blurb: "Top three builds in this track.",
		winners: [
			{ projectId: "carcosa", placement: 1 },
			{ projectId: "signninja", placement: 2 },
			{ projectId: "poses-for-dummies", placement: 3 },
		],
	},
	{
		id: "base44",
		name: "Base44",
		sponsor: "Base44",
		blurb: "Top three builds in this track.",
		winners: [
			{ projectId: "portflo", placement: 1 },
			{ projectId: "safereturn", placement: 2 },
			{ projectId: "dizzero", placement: 3 },
		],
	},
];

/** Partner tracks with a single winning project. */
export const PARTNER_TRACKS: WinnerTrackDef[] = [
	{
		id: "google",
		name: "Google",
		sponsor: "Google",
		blurb: "Best use of sponsor technology.",
		winners: [{ projectId: "find-it" }],
	},
	{
		id: "mongodb",
		name: "MongoDB",
		sponsor: "MongoDB",
		blurb: "Best use of sponsor technology.",
		winners: [{ projectId: "medledger" }],
	},
];

/** MLH prize tracks — one winning project each. */
export const MLH_TRACKS: WinnerTrackDef[] = [
	{ id: "mlh-gemini", name: "Google Gemini API", sponsor: "MLH", winners: [{ projectId: "farmos" }] },
	{ id: "mlh-snowflake", name: "Snowflake", sponsor: "MLH", winners: [{ projectId: "wander-lore" }] },
	{ id: "mlh-elevenlabs", name: "ElevenLabs", sponsor: "MLH", winners: [{ projectId: "secondmind" }] },
	{ id: "mlh-digitalocean", name: "DigitalOcean", sponsor: "MLH", winners: [{ projectId: "agent-studio" }] },
	{ id: "mlh-solana", name: "Solana", sponsor: "MLH", winners: [{ projectId: "shakedown" }] },
	{ id: "mlh-tech-domains", name: ".Tech Domains", sponsor: "MLH", winners: [{ projectId: "curate" }] },
	{ id: "mlh-backboard", name: "Backboard", sponsor: "MLH", winners: [{ projectId: "fixfirst" }] },
];

export const ALL_TRACKS: WinnerTrackDef[] = [
	GRAND_PRIZE,
	...PODIUM_TRACKS,
	...PARTNER_TRACKS,
	...MLH_TRACKS,
];

// ── Reverse lookup: project id → which award it won ─────────────────────────

export type WinnerLookup = {
	track: WinnerTrackDef;
	placement?: WinnerPlacement;
};

const winnerByProjectId = new Map<string, WinnerLookup>();
for (const track of ALL_TRACKS) {
	for (const ref of track.winners) {
		winnerByProjectId.set(ref.projectId, { track, placement: ref.placement });
	}
}

export function getWinnerByProjectId(id: string): WinnerLookup | null {
	return winnerByProjectId.get(id) ?? null;
}

export function getAllWinnerProjectIds(): string[] {
	return [...winnerByProjectId.keys()];
}

// ── Award label helper (pure — safe for client import) ──────────────────────

export type AwardMeta = {
	placement?: WinnerPlacement;
	/** e.g. "1st Place Overall", "Track Winner". */
	placeLabel: string;
	/** e.g. "QuackHacks Grand Prize", "ElevenLabs". */
	trackName: string;
	sponsor: Sponsor;
	isGrand: boolean;
	hasPodium: boolean;
};

const ORDINAL: Record<WinnerPlacement, string> = { 1: "1st", 2: "2nd", 3: "3rd" };

export function getAwardMeta({ track, placement }: WinnerLookup): AwardMeta {
	const isGrand = track.id === GRAND_PRIZE.id;
	const hasPodium = track.winners.length > 1;
	const placeLabel = placement
		? `${ORDINAL[placement]} Place${isGrand ? " Overall" : ""}`
		: "Track Winner";
	return {
		placement,
		placeLabel,
		trackName: track.name,
		sponsor: track.sponsor,
		isGrand,
		hasPodium,
	};
}

// ── Resolved view models for the listing page (server-side) ─────────────────

/** Lean, serializable shape passed to client podium/cards. */
export type WinnerCard = {
	id: string;
	name: string;
	tagline: string;
	teamName: string | null;
	image: string | null;
	placement?: WinnerPlacement;
};

export type ResolvedTrackView = {
	id: string;
	name: string;
	sponsor: Sponsor;
	blurb?: string;
	hasPodium: boolean;
	winners: WinnerCard[];
};

function toCard(ref: TrackWinnerRef, project: ArchivedProject): WinnerCard {
	return {
		id: project.id,
		name: project.name,
		tagline: project.tagline,
		teamName: project.team_name ?? null,
		image: project.image_urls[0] ?? null,
		placement: ref.placement,
	};
}

function resolveTrack(def: WinnerTrackDef): ResolvedTrackView {
	const winners = def.winners
		.map((ref) => {
			const project = getProjectById(ref.projectId);
			return project ? toCard(ref, project) : null;
		})
		.filter((c): c is WinnerCard => c !== null)
		.sort((a, b) => (a.placement ?? 99) - (b.placement ?? 99));

	return {
		id: def.id,
		name: def.name,
		sponsor: def.sponsor,
		blurb: def.blurb,
		hasPodium: def.winners.length > 1,
		winners,
	};
}

export type WinnersView = {
	grand: ResolvedTrackView;
	podiumTracks: ResolvedTrackView[];
	partnerTracks: ResolvedTrackView[];
	mlhTracks: ResolvedTrackView[];
};

export function getWinnersView(): WinnersView {
	return {
		grand: resolveTrack(GRAND_PRIZE),
		podiumTracks: PODIUM_TRACKS.map(resolveTrack),
		partnerTracks: PARTNER_TRACKS.map(resolveTrack),
		mlhTracks: MLH_TRACKS.map(resolveTrack),
	};
}
