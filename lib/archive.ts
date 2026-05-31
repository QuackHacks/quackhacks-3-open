import achievementsJson from "@/data/achievements.json";
import leaderboardJson from "@/data/leaderboard.json";
import projectsJson from "@/data/projects.json";
import rosterJson from "@/data/roster.json";
import type { AchievementRow, ArchivedProject, PublicRosterUser } from "@/lib/types";

export type LeaderboardEntry = {
	id: string;
	name: string;
	total_points: number;
	achievement_ids: string[];
};

export const achievements = [...achievementsJson].sort(
	(a, b) => a.sort_order - b.sort_order,
) as AchievementRow[];

export const leaderboard = [...leaderboardJson]
	.sort((a, b) => b.total_points - a.total_points)
	.map((entry, index) => ({ ...entry, rank: index + 1 })) as Array<
	LeaderboardEntry & { rank: number }
>;

export const roster = rosterJson as PublicRosterUser[];

export const projects = projectsJson as ArchivedProject[];

export function getProjectById(id: string) {
	return projects.find((project) => project.id === id) ?? null;
}

export function getAchievementIdsByUser() {
	return Object.fromEntries(
		leaderboard.map((entry) => [entry.id, entry.achievement_ids]),
	);
}
