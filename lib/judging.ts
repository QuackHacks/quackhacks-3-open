// Shared constants/helpers for the judging system.
// Preliminary + finals scoring: 1st = 3, 2nd = 2, 3rd = 1, 4th & 5th = 0.
// Tiebreaker scoring:           1st = 1, everyone else = 0.
// rank_position is 0-indexed (0 → 1st place).

export type RoundType = "preliminary" | "finals" | "tiebreaker";

export const RANK_POINTS: readonly number[] = [3, 2, 1, 0, 0];
export const FINALS_POINTS: readonly number[] = [3, 2, 1, 0, 0];
export const TIEBREAKER_POINTS: readonly number[] = [1, 0];

export function pointsForRank(rankPosition: number): number {
	if (rankPosition < 0) return 0;
	if (rankPosition < RANK_POINTS.length) return RANK_POINTS[rankPosition];
	return 0;
}

export function pointsForRankInRound(rankPosition: number, roundType: RoundType): number {
	if (rankPosition < 0) return 0;
	const table =
		roundType === "tiebreaker"
			? TIEBREAKER_POINTS
			: roundType === "finals"
				? FINALS_POINTS
				: RANK_POINTS;
	return rankPosition < table.length ? table[rankPosition] : 0;
}

export function roundLabel(roundType: RoundType): string {
	if (roundType === "finals") return "Final Round";
	if (roundType === "tiebreaker") return "Tiebreaker";
	return "Preliminary";
}

export type JudgingConfig = {
	id: string;
	projects_per_batch: number;
	max_views_per_project: number;
	current_round: number;
	round_started_at: string | null;
	round_type: RoundType;
	finalist_count: number;
	updated_at: string;
};

export type JudgingAssignment = {
	id: string;
	judge_user_id: string;
	submission_id: string;
	round_number: number;
	batch_number: number;
	status: "active" | "completed" | "cancelled";
	notes: string | null;
	assigned_at: string;
};

// Deterministic fallback accent color when teams.hex_color is null.
export function fallbackAccent(seed: string): string {
	const palette = [
		"#347c45",
		"#1d4ed8",
		"#7c3aed",
		"#059669",
		"#b45309",
		"#0891b2",
		"#be123c",
		"#0f766e",
		"#7c2d12",
		"#4338ca",
	];
	let hash = 0;
	for (let i = 0; i < seed.length; i++) {
		hash = (hash * 31 + seed.charCodeAt(i)) | 0;
	}
	return palette[Math.abs(hash) % palette.length];
}
