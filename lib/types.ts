export type RegistrationStatus = "NotRegistered" | "Pending" | "Accepted" | "Waitlisted" | "Declined";
export type RoleLevel = "Participant" | "Manager" | "Admin" | "Judge";

export type UserRow = {
	id: string;
	first_name: string | null;
	last_name: string | null;
	role_level?: RoleLevel | null;
	registration_status?: RegistrationStatus | null;
};

export type AchievementCategory = "Result" | "Team" | "Dev" | "Engagement" | "Special" | "EasterEgg";

export type AchievementRow = {
	id: string;
	key: string;
	name: string;
	description: string;
	points: number;
	difficulty: "EASY" | "MEDIUM" | "HARD";
	category: AchievementCategory;
	icon: string | null;
	easter_egg: boolean;
	sort_order: number;
};

export type AchievementData = {
	key: string;
	name: string;
	badge_url: string;
	points: number;
	difficulty: "EASY" | "MEDIUM" | "HARD";
	description: string;
};

export type Judge = {
	name: string;
	role: string;
	image?: string;
	headshotPath?: string;
	links?: {
		linkedin?: string;
		github?: string;
		website?: string;
	};
};

export type DisplayBadge = {
	name: string;
	badge_path: string;
};

export type PublicRosterUser = {
	id: string;
	first_name: string | null;
	last_name: string | null;
	about_me: string | null;
	university: string | null;
	major: string | null;
	level_of_study: string | null;
	highest_education: string | null;
	residing_country: string | null;
	linkedin_url: string | null;
	github_url: string | null;
	github_public: boolean;
	role_interest?: string | null;
	track_interest?: string | null;
	has_team: boolean;
	is_current_user: boolean;
	imageUrl?: string | null;
	display_badges: DisplayBadge[];
	total_points: number;
};

export type ProjectMember = {
	id: string;
	name: string;
	university?: string | null;
	major?: string | null;
	level_of_study?: string | null;
};

export type ArchivedProject = {
	id: string;
	name: string;
	tagline: string;
	tech_stack: string;
	description: string;
	video_url: string;
	submission_url?: string | null;
	github_url?: string | null;
	team_name?: string | null;
	image_urls: string[];
	qh_track: string | null;
	mlh_tracks: string[];
	members: ProjectMember[];
};

export function getFullName(user: Pick<UserRow, "first_name" | "last_name">) {
	return `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim() || "Anonymous";
}
