import { Metadata } from "next";
import { achievements, getAchievementIdsByUser, leaderboard } from "@/lib/archive";
import { LeaderboardClient } from "../leaderboard/LeaderboardClient";

export const metadata: Metadata = {
	title: "Badges | QuackHacks",
	description: "Archived QuackHacks point rankings and achievement showcase",
};

export default function GalleryPage() {
	const rankings = leaderboard.slice(0, 10).map((entry) => ({
		rank: entry.rank,
		id: entry.id,
		name: entry.name,
		total_points: entry.total_points,
	}));
	const usersAchievementsMap = getAchievementIdsByUser();

	return (
		<LeaderboardClient
			rankings={rankings}
			achievements={achievements}
			usersAchievementsMap={usersAchievementsMap}
		/>
	);
}
