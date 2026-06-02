#!/usr/bin/env node
import { execFile } from "node:child_process";
import { mkdir, mkdtemp, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";

const ROOT = process.cwd();
const DATA_DIR = path.join(ROOT, "data");
const PUBLIC_ARCHIVE_DIR = path.join(ROOT, "public", "archive");
const DEFAULT_ENV_FILES = [
	path.join(ROOT, "..", "quackhacks-3", "quackhacks3_f", ".env"),
	path.join(ROOT, "..", "quackhacks-3", "quackhacks3_ops", ".env"),
];

const args = new Set(process.argv.slice(2));
const WRITE = args.has("--write");
const DRY_RUN = args.has("--dry-run") || !WRITE;
const DOWNLOAD_IMAGES = !args.has("--no-download-images");
const execFileAsync = promisify(execFile);
const MAGICK_BIN = process.env.MAGICK_BIN ?? "magick";
const WEBP_QUALITY = "82";

const BADGE_MAP = {
	top_1: "/badgess/QH3_achievement_goldenDuck.png",
	top_2: "/badgess/QH3_achievement_silverQuacker.png",
	top_3: "/badgess/QH3_achievement_bronzeBeak.png",
	top_6: "/badgess/QH3_achievement_eliteQuacker.png",
	lone_goose: "/badgess/QH3_Achievementbadge_TheLoneGoose.png",
	track_winner: "/badgess/QH3_achievement_masterOfThePond.png",
	chosen_duck: "/badgess/ChosenDuckAchievementPRINT.png",
	solo_duckling: "/badgess/SoloDuckAchievementPRINTGradient.png",
	team_creator: "/badgess/QH3_Achievementbadge_FounderOftheFlock.png",
	joined_team: "/badgess/QH3_Achievementbadge_JoinThePond.png",
	squad_2: "/badgess/QH3_achievement_dynamicDUO.png",
	squad_4: "/badgess/QH3_QuadQuackers.png",
	team_builder: "/badgess/QH3_Achievementbadge_theduckfather.png",
	github_connected: "/badgess/QH3_achievement_RepoRanger.png",
	project_submitted: "/badgess/QH3_achievement_shipItQuacker.png",
	commit_stormer: "/badgess/QH3_achievement_commitStormer.png",
	speed_runner: "/badgess/QH3_Achievementbadge_TerminalVelocity.png",
	quacker_clicker: "/badgess/QH3_achievement_quackClicker.png",
	speed_quacker: "/badgess/QH3_Achievementbadge_SpeedQuack.png",
	discord_joined: "/badgess/QH3_achievement_intoTheFlock.png",
	perfect_attendance: "/badgess/QH3_achievement_touchGrass.png",
	first_blood: "/badgess/QH3_Achievementbadge_FirstBlood.png",
	century: "/badgess/QH3_Achievementbadge_masterOfThePond.png",
	achievement_hunter: "/badgess/QH3_achievement_AchievementHunter.png",
	voice_of_the_pond: "/badgess/VoiceOfThePond.png",
};

const MLH_TRACK_ALIASES = {
	digitalocean: "digitalocean",
	elevenlabs: "elevenlabs",
	geminiapi: "gemini_api",
	gemini_api: "gemini_api",
	snowflakeapi: "snowflake_api",
	snowflake_api: "snowflake_api",
	solana: "solana",
	techdomains: "tech_domains",
	tech_domains: "tech_domains",
	backboard: "backboard",
};

function parseEnv(text) {
	const env = {};
	for (const rawLine of text.split(/\r?\n/)) {
		const line = rawLine.trim();
		if (!line || line.startsWith("#")) continue;
		const match = line.match(/^([A-Za-z_][A-Za-z0-9_]*)=(.*)$/);
		if (!match) continue;
		let value = match[2].trim();
		if (
			(value.startsWith('"') && value.endsWith('"')) ||
			(value.startsWith("'") && value.endsWith("'"))
		) {
			value = value.slice(1, -1);
		}
		env[match[1]] = value.replace(/\\n/g, "\n");
	}
	return env;
}

async function loadEnv() {
	const merged = { ...process.env };
	for (const file of DEFAULT_ENV_FILES) {
		try {
			Object.assign(merged, parseEnv(await readFile(file, "utf8")));
		} catch (error) {
			if (error.code !== "ENOENT") throw error;
		}
	}
	return merged;
}

function normalizeDifficulty(value) {
	const text = String(value ?? "Easy").toUpperCase();
	if (text === "MEDIUM" || text === "HARD") return text;
	return "EASY";
}

export function normalizeMlhTrack(value) {
	const key = String(value ?? "")
		.trim()
		.toLowerCase()
		.replace(/[^a-z0-9_]+/g, "");
	return MLH_TRACK_ALIASES[key] ?? value;
}

function slugify(value, fallback = "item") {
	const slug = String(value ?? "")
		.toLowerCase()
		.normalize("NFKD")
		.replace(/[\u0300-\u036f]/g, "")
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
	return slug || fallback;
}

function uniqueSlug(value, used, fallback) {
	const base = slugify(value, fallback);
	let slug = base;
	let i = 2;
	while (used.has(slug)) {
		slug = `${base}-${i}`;
		i += 1;
	}
	used.add(slug);
	return slug;
}

function fullName(user) {
	return `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() || "Anonymous";
}

function byUserId(rows) {
	const map = new Map();
	for (const row of rows) map.set(row.user_id, row);
	return map;
}

function groupBy(rows, key) {
	const map = new Map();
	for (const row of rows) {
		const value = row[key];
		const list = map.get(value) ?? [];
		list.push(row);
		map.set(value, list);
	}
	return map;
}

function publicEducation(registration, privacy) {
	if (!registration || privacy?.education_public === false) {
		return {
			university: null,
			major: null,
			level_of_study: null,
			highest_education: null,
		};
	}
	return {
		university: registration.university ?? null,
		major: registration.major ?? null,
		level_of_study: registration.level_of_study ?? null,
		highest_education: registration.highest_education ?? null,
	};
}

function projectUrl(submission) {
	return submission.used_tech_domain
		? submission.tech_domain_url || submission.submission_url
		: submission.submission_url;
}

class SupabaseRest {
	constructor({ url, key }) {
		this.url = url.replace(/\/$/, "");
		this.key = key;
	}

	async select(table, { select = "*", order, filters = {} } = {}) {
		const pageSize = 1000;
		const rows = [];
		for (let from = 0; ; from += pageSize) {
			const url = new URL(`${this.url}/rest/v1/${table}`);
			url.searchParams.set("select", select);
			if (order) url.searchParams.set("order", order);
			for (const [key, value] of Object.entries(filters)) {
				url.searchParams.set(key, value);
			}

			const res = await fetch(url, {
				headers: {
					apikey: this.key,
					authorization: `Bearer ${this.key}`,
					range: `${from}-${from + pageSize - 1}`,
					"range-unit": "items",
				},
			});
			if (!res.ok) {
				const text = await res.text();
				throw new Error(`Supabase ${table} failed (${res.status}): ${text}`);
			}

			const page = await res.json();
			rows.push(...page);
			if (page.length < pageSize) break;
		}
		return rows;
	}
}

async function writeCompressedWebp(bytes, outputFile) {
	const outputDir = path.dirname(outputFile);
	const tempDir = await mkdtemp(path.join(outputDir, ".tmp-"));
	const inputFile = path.join(tempDir, "source-image");
	try {
		await writeFile(inputFile, bytes);
		await execFileAsync(MAGICK_BIN, [
			inputFile,
			"-strip",
			"-quality",
			WEBP_QUALITY,
			"-define",
			"webp:method=6",
			outputFile,
		]);
	} finally {
		await rm(tempDir, { recursive: true, force: true });
	}
}

async function downloadProjectImage(url, projectSlug, index) {
	if (!url || !DOWNLOAD_IMAGES || DRY_RUN) return url;
	try {
		const res = await fetch(url);
		if (!res.ok) throw new Error(`HTTP ${res.status}`);
		const bytes = Buffer.from(await res.arrayBuffer());
		const dir = path.join(PUBLIC_ARCHIVE_DIR, "projects", projectSlug);
		await mkdir(dir, { recursive: true });
		const filename = `image-${String(index + 1).padStart(2, "0")}.webp`;
		await writeCompressedWebp(bytes, path.join(dir, filename));
		return `/archive/projects/${projectSlug}/${filename}`;
	} catch (error) {
		console.warn(`WARN image download failed for ${projectSlug}: ${url} (${error.message})`);
		return url;
	}
}

async function writeJson(name, data) {
	const file = path.join(DATA_DIR, `${name}.json`);
	if (DRY_RUN) return;
	await mkdir(DATA_DIR, { recursive: true });
	await writeFile(file, `${JSON.stringify(data, null, 2)}\n`);
}

function makeArchiveIds(users, achievements, projects) {
	const userIds = new Map();
	users
		.map((user) => ({ user, name: fullName(user).toLowerCase() }))
		.sort((a, b) => a.name.localeCompare(b.name) || a.user.id.localeCompare(b.user.id))
		.forEach(({ user }, index) => {
			userIds.set(user.id, `participant-${String(index + 1).padStart(3, "0")}`);
		});

	const achievementIds = new Map();
	for (const achievement of achievements) {
		achievementIds.set(achievement.id, `achievement-${slugify(achievement.key, achievement.name)}`);
	}

	const projectIds = new Map();
	const usedProjectSlugs = new Set();
	for (const project of projects) {
		projectIds.set(project.id, uniqueSlug(project.name, usedProjectSlugs, "project"));
	}

	return { userIds, achievementIds, projectIds };
}

async function main() {
	const env = await loadEnv();
	const url = env.NEXT_PUBLIC_SUPABASE_URL;
	const key = env.SUPABASE_SERVICE_ROLE_KEY ?? env.SUPABASE_SERVICE_KEY;
	if (!url || !key) {
		throw new Error("Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in sibling env.");
	}

	const supabase = new SupabaseRest({ url, key });

	const [
		achievementRows,
		userRows,
		registrationRows,
		privacyRows,
		preferenceRows,
		userAchievementRows,
		teamRows,
		submissionRows,
		submissionImageRows,
	] = await Promise.all([
		supabase.select("achievements", {
			select: "id,key,name,description,points,difficulty,category,icon,easter_egg,sort_order",
			order: "sort_order.asc",
		}),
		supabase.select("users", {
			select: "id,first_name,last_name,about_me,registration_status,role_level,team_id,total_points,points_updated_at,created_at,checked_in",
			order: "created_at.asc",
			filters: {
				registration_status: "eq.Accepted",
				role_level: "in.(Participant,Manager)",
			},
		}),
		supabase.select("registrations", {
			select: "user_id,university,major,level_of_study,highest_education,residing_country,linkedin_url,github_url",
		}),
		supabase.select("registration_privacy", {
			select: "user_id,education_public,country_public,linkedin_public,github_public",
		}),
		supabase.select("team_builder_preferences", {
			select: "user_id,technical_role,preferred_track",
		}),
		supabase.select("user_achievements", {
			select: "user_id,achievement_id,display,earned_at",
			order: "earned_at.asc",
		}),
		supabase.select("teams", {
			select: "id,team_name,bio,hex_color,created_by_user_id",
		}),
		supabase.select("submissions", {
			select: "id,name,tagline,tech_stack,description,video_url,submission_url,github_url,team_id,qh_track,mlh_tracks,used_tech_domain,tech_domain_url,prize_won",
			order: "name.asc",
		}),
		supabase.select("submission_images", {
			select: "project_id,img_url,caption",
		}),
	]);

	const { userIds, achievementIds, projectIds } = makeArchiveIds(
		userRows,
		achievementRows,
		submissionRows,
	);
	const registrationsByUser = byUserId(registrationRows);
	const privacyByUser = byUserId(privacyRows);
	const preferencesByUser = byUserId(preferenceRows);
	const userAchievementsByUser = groupBy(userAchievementRows, "user_id");
	const teamsById = new Map(teamRows.map((team) => [team.id, team]));
	const usersByTeam = groupBy(userRows, "team_id");
	const imagesBySubmission = groupBy(submissionImageRows, "project_id");
	const achievementsById = new Map(achievementRows.map((achievement) => [achievement.id, achievement]));

	const achievements = achievementRows.map((achievement) => ({
		id: achievementIds.get(achievement.id),
		key: achievement.key,
		name: achievement.name,
		description: achievement.description,
		points: achievement.points ?? 0,
		difficulty: normalizeDifficulty(achievement.difficulty),
		category: achievement.category,
		icon: achievement.icon,
		easter_egg: Boolean(achievement.easter_egg),
		sort_order: achievement.sort_order ?? 0,
	}));

	const roster = userRows.filter((user) => user.checked_in).map((user) => {
		const registration = registrationsByUser.get(user.id);
		const privacy = privacyByUser.get(user.id);
		const preferences = preferencesByUser.get(user.id);
		const education = publicEducation(registration, privacy);
		const displayBadges = (userAchievementsByUser.get(user.id) ?? [])
			.filter((row) => row.display)
			.map((row) => achievementsById.get(row.achievement_id))
			.filter(Boolean)
			.slice(0, 3)
			.map((achievement) => ({
				name: achievement.name,
				badge_path: BADGE_MAP[achievement.key],
			}))
			.filter((badge) => badge.badge_path);

		return {
			id: userIds.get(user.id),
			first_name: user.first_name ?? null,
			last_name: user.last_name ?? null,
			about_me: user.about_me ?? null,
			...education,
			residing_country: privacy?.country_public === false ? null : registration?.residing_country ?? null,
			linkedin_url: privacy?.linkedin_public === false ? null : registration?.linkedin_url ?? null,
			github_url: privacy?.github_public === false ? null : registration?.github_url ?? null,
			github_public: privacy?.github_public ?? true,
			role_interest: preferences?.technical_role ?? null,
			track_interest: preferences?.preferred_track ?? null,
			has_team: Boolean(user.team_id),
			is_current_user: false,
			imageUrl: null,
			display_badges: displayBadges,
			total_points: user.total_points ?? 0,
		};
	});

	const leaderboard = userRows
		.filter((user) => (user.total_points ?? 0) > 0)
		.map((user) => ({
			id: userIds.get(user.id),
			name: fullName(user),
			total_points: user.total_points ?? 0,
			achievement_ids: (userAchievementsByUser.get(user.id) ?? [])
				.map((row) => achievementIds.get(row.achievement_id))
				.filter(Boolean),
			_sort_updated_at: user.points_updated_at,
		}))
		.sort((a, b) => b.total_points - a.total_points || String(a._sort_updated_at).localeCompare(String(b._sort_updated_at)))
		.map((entry) => ({
			id: entry.id,
			name: entry.name,
			total_points: entry.total_points,
			achievement_ids: entry.achievement_ids,
		}));

	const projects = [];
	for (const submission of submissionRows) {
		const projectSlug = projectIds.get(submission.id);
		const team = teamsById.get(submission.team_id);
		const rawImages = (imagesBySubmission.get(submission.id) ?? [])
			.map((image) => image.img_url)
			.filter(Boolean);
		const image_urls = [];
		for (const [index, url] of rawImages.entries()) {
			image_urls.push(await downloadProjectImage(url, projectSlug, index));
		}

		const members = (usersByTeam.get(submission.team_id) ?? []).map((member) => {
			const registration = registrationsByUser.get(member.id);
			const privacy = privacyByUser.get(member.id);
			const education = publicEducation(registration, privacy);
			return {
				id: userIds.get(member.id),
				name: fullName(member),
				university: education.university,
				major: education.major,
				level_of_study: education.level_of_study,
			};
		});

		projects.push({
			id: projectSlug,
			name: submission.name,
			tagline: submission.tagline,
			tech_stack: submission.tech_stack,
			description: submission.description,
			video_url: submission.video_url,
			submission_url: projectUrl(submission) ?? null,
			github_url: submission.github_url ?? null,
			team_name: team?.team_name ?? null,
			image_urls,
			qh_track: submission.qh_track ?? null,
			mlh_tracks: Array.isArray(submission.mlh_tracks)
				? [...new Set(submission.mlh_tracks.map(normalizeMlhTrack))]
				: [],
			prize_won: submission.prize_won ?? null,
			members,
		});
	}

	const redactions = {
		user_ids_replaced: userIds.size,
		achievement_ids_replaced: achievementIds.size,
		project_ids_replaced: projectIds.size,
		registrations_considered: registrationRows.length,
		education_hidden: roster.filter((user) => !user.university && !user.major && !user.level_of_study).length,
		country_hidden: roster.filter((user) => !user.residing_country).length,
		linkedin_hidden: roster.filter((user) => !user.linkedin_url).length,
		github_hidden: roster.filter((user) => !user.github_url).length,
	};

	const summary = {
		mode: DRY_RUN ? "dry-run" : "write",
		download_images: DOWNLOAD_IMAGES && WRITE,
		source: "supabase-rest",
		counts: {
			achievements: achievements.length,
			leaderboard: leaderboard.length,
			roster: roster.length,
			projects: projects.length,
			submission_images: submissionImageRows.length,
		},
		redactions,
		outputs: ["data/achievements.json", "data/leaderboard.json", "data/roster.json", "data/projects.json"],
	};

	await Promise.all([
		writeJson("achievements", achievements),
		writeJson("leaderboard", leaderboard),
		writeJson("roster", roster),
		writeJson("projects", projects),
	]);

	console.log(JSON.stringify(summary, null, 2));
}

if (process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1])) {
	main().catch((error) => {
		console.error(error instanceof Error ? error.message : error);
		process.exit(1);
	});
}
