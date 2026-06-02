import { RegistrationStatus, RoleLevel } from "../lib/types";
import { AchievementData, Judge } from "../lib/types";
export type NavLink = {
	href: string;
	label: string;
	icon?: React.ReactNode;
	requiredStatus?: RegistrationStatus;
	requiredRole?: RoleLevel;
	gatedBy?: "submissions_open" | "github_repo_open" | "event_started";
	requiresTeam?: boolean;
};

// EXTREMELY IMPORTANT, these define all of the navigation links across the website
export const kHomeLinks: NavLink[] = [
	{ href: "/", label: "Home" },
	{ href: "/about", label: "About" },
	{ href: "/timeline", label: "Timeline" },
	{ href: "/judges", label: "Judges" },
	{ href: "/roster", label: "Roster" },
	{ href: "/achievements", label: "Achievements" },
	{ href: "/projects", label: "Projects" },
	{ href: "/photos", label: "Photos" },
];

/** Badge image paths served from /public — keyed by achievement.key. */
export const BADGE_MAP: Record<string, string> = {
	// Result
	top_1:              "/badgess/QH3_achievement_goldenDuck.png",
	top_2:              "/badgess/QH3_achievement_silverQuacker.png",
	top_3:              "/badgess/QH3_achievement_bronzeBeak.png",
	top_6:              "/badgess/QH3_achievement_eliteQuacker.png",
	lone_goose:         "/badgess/QH3_Achievementbadge_TheLoneGoose.png",
	track_winner:       "/badgess/QH3_achievement_masterOfThePond.png",
	chosen_duck:        "/badgess/ChosenDuckAchievementPRINT.png",
	solo_duckling:      "/badgess/SoloDuckAchievementPRINTGradient.png",
	// Team
	team_creator:       "/badgess/QH3_Achievementbadge_FounderOftheFlock.png",
	joined_team:        "/badgess/QH3_Achievementbadge_JoinThePond.png",
	squad_2:            "/badgess/QH3_achievement_dynamicDUO.png",
	squad_4:            "/badgess/QH3_QuadQuackers.png",
	team_builder:       "/badgess/QH3_Achievementbadge_theduckfather.png",
	// Dev
	github_connected:   "/badgess/QH3_achievement_RepoRanger.png",
	project_submitted:  "/badgess/QH3_achievement_shipItQuacker.png",
	commit_stormer:     "/badgess/QH3_achievement_commitStormer.png",
	speed_runner:       "/badgess/QH3_Achievementbadge_TerminalVelocity.png",
	// Engagement
	quacker_clicker:    "/badgess/QH3_achievement_quackClicker.png",
	speed_quacker:      "/badgess/QH3_Achievementbadge_SpeedQuack.png",
	discord_joined:     "/badgess/QH3_achievement_intoTheFlock.png",
	perfect_attendance: "/badgess/QH3_achievement_touchGrass.png",
	// Special
	first_blood:        "/badgess/QH3_Achievementbadge_FirstBlood.png",
	century:            "/badgess/QH3_Achievementbadge_masterOfThePond.png",
	achievement_hunter: "/badgess/QH3_achievement_AchievementHunter.png",
	voice_of_the_pond:  "/badgess/VoiceOfThePond.png",
};


export const BADGE_MAP_WITH_DATA: AchievementData[] = [
	// Result
	{
		key: "top_1",
		name: "The Golden Duck",
		badge_url: "/badgess/QH3_achievement_goldenDuck.png",
		points: 80,
		difficulty: "HARD",
		description: "Your team placed 1st overall.",
	},
	{
		key: "top_2",
		name: "Silver Duck",
		badge_url: "/badgess/QH3_achievement_silverQuacker.png",
		points: 50,
		difficulty: "HARD",
		description: "Your team placed 2nd overall.",
	},
	{
		key: "top_3",
		name: "Bronze Beak",
		badge_url: "/badgess/QH3_achievement_bronzeBeak.png",
		points: 30,
		difficulty: "HARD",
		description: "Your team placed 3rd overall.",
	},
	{
		key: "top_6",
		name: "Quack Elite",
		badge_url: "/badgess/QH3_achievement_eliteQuacker.png",
		points: 10,
		difficulty: "MEDIUM",
		description: "Your team placed in the top 6.",
	},
	{
		key: "lone_goose",
		name: "The Lone Goose",
		badge_url: "/badgess/QH3_Achievementbadge_TheLoneGoose.png",
		points: 100,
		difficulty: "HARD",
		description: "Solo hacker placing in the top 6.",
	},
	{
		key: "track_winner",
		name: "Master of the Pond",
		badge_url: "/badgess/QH3_achievement_masterOfThePond.png",
		points: 75,
		difficulty: "HARD",
		description: "Won a track.",
	},

	// Team
	{
		key: "team_creator",
		name: "Founder of the Flock",
		badge_url: "/badgess/QH3_Achievementbadge_FounderOftheFlock.png",
		points: 15,
		difficulty: "EASY",
		description: "Created a team.",
	},
	{
		key: "joined_team",
		name: "Join the Pond",
		badge_url: "/badgess/QH3_Achievementbadge_JoinThePond.png",
		points: 10,
		difficulty: "EASY",
		description: "Joined a team.",
	},
	{
		key: "solo_duckling",
		name: "Solo Duckling",
		badge_url: "/badgess/SoloDuckAchievementPRINTGradient.png",
		points: 40,
		difficulty: "MEDIUM",
		description: "Competed as a team of one.",
	},
	{
		key: "squad_2",
		name: "Dynamic Duo",
		badge_url: "/badgess/QH3_achievement_dynamicDUO.png",
		points: 5,
		difficulty: "EASY",
		description: "Be in a team of 2.",
	},
	{
		key: "squad_4",
		name: "Quad Quackers",
		badge_url: "/badgess/QH3_QuadQuackers.png",
		points: 20,
		difficulty: "EASY",
		description: "Be in a team of four.",
	},
	{
		key: "team_builder",
		name: "The Duck Father",
		badge_url: "/badgess/QH3_Achievementbadge_theduckfather.png",
		points: 25,
		difficulty: "HARD",
		description: "Had 4 members join the team you started.",
	},

	// Dev
	{
		key: "commit_stormer",
		name: "Commit Stormer",
		badge_url: "/badgess/QH3_achievement_commitStormer.png",
		points: 30,
		difficulty: "HARD",
		description: "Most commits by your team during the event.",
	},
	{
		key: "github_connected",
		name: "Repo Ranger",
		badge_url: "/badgess/QH3_achievement_RepoRanger.png",
		points: 15,
		difficulty: "EASY",
		description: "Connected Repo Stats and selected a GitHub repository for your team.",
	},
	{
		key: "project_submitted",
		name: "Ship it Quicker!",
		badge_url: "/badgess/QH3_achievement_shipItQuacker.png",
		points: 30,
		difficulty: "EASY",
		description: "Submitted your project.",
	},
	{
		key: "speed_runner",
		name: "Terminal Velocity",
		badge_url: "/badgess/QH3_Achievementbadge_TerminalVelocity.png",
		points: 50,
		difficulty: "HARD",
		description: "Submit your project within the last 2 minutes before the deadline.",
	},

	// Engagement
	{
		key: "discord_joined",
		name: "Into the Flock",
		badge_url: "/badgess/QH3_achievement_intoTheFlock.png",
		points: 10,
		difficulty: "EASY",
		description: "Joined the QuackHacks Discord server.",
	},
	{
		key: "quacker_clicker",
		name: "Quick Clicker",
		badge_url: "/badgess/QH3_achievement_quackClicker.png",
		points: 30,
		difficulty: "MEDIUM",
		description: "Have the most clicks on the duck at one time.",
	},
	{
		key: "speed_quacker",
		name: "Speed Quack",
		badge_url: "/badgess/QH3_Achievementbadge_SpeedQuack.png",
		points: 30,
		difficulty: "MEDIUM",
		description: "Created a team within 10 minutes of check-in.",
	},
	{
		key: "perfect_attendance",
		name: "Touch Grass",
		badge_url: "/badgess/QH3_achievement_touchGrass.png",
		points: 40,
		difficulty: "HARD",
		description: "Leave the building and return after being checked in for 8+ hours.",
	},
	{
		key: "voice_of_the_pond",
		name: "Voice of the Pond",
		badge_url: "/badgess/VoiceOfThePond.png",
		points: 10,
		difficulty: "EASY",
		description: "Provide feedback about the event.",
	},

	// Special
	{
		key: "first_blood",
		name: "First Blood",
		badge_url: "/badgess/QH3_Achievementbadge_FirstBlood.png",
		points: 50,
		difficulty: "HARD",
		description: "Be the first to earn any achievement.",
	},
	{
		key: "century",
		name: "Century",
		badge_url: "/badgess/QH3_Achievementbadge_masterOfThePond.png",
		points: 30,
		difficulty: "MEDIUM",
		description: "Reach 100 total points.",
	},
	{
		key: "achievement_hunter",
		name: "Achievement Hunter",
		badge_url: "/badgess/QH3_achievement_AchievementHunter.png",
		points: 25,
		difficulty: "MEDIUM",
		description: "Earn 5 or more achievements.",
	},
	{
		key: "chosen_duck",
		name: "The Chosen Duck",
		badge_url: "/badgess/ChosenDuckAchievementPRINT.png",
		points: 100,
		difficulty: "HARD",
		description: "Randomly selected as a special participant.",
	},
]

export const JUDGES_MAP: Judge[] = [
	// Amazon / AWS
	{
		name: "Diksha Padte",
		role: "SWE @ Amazon",
	},
	{
		name: "Dikshita Padte",
		role: "Data Engineer @ Amazon",
		headshotPath: "/photos/judges/DikshitaPadte.webp",
	},
	{
		name: "Francisco Cilia",
		role: "SDE I @ Amazon",
		headshotPath: "/photos/judges/FranciscoCilia.webp",
	},
	{
		name: "Shabbir Hussain",
		role: "Senior SDE @ Amazon",
	},
	{
		name: "Young Lin",
		role: "SWE @ AWS",
		headshotPath: "/photos/judges/YoungLin.webp",
	},

	// Meta
	{
		name: "Ayan Gupta",
		role: "SWE @ Meta",
		headshotPath: "/photos/judges/AyanGupta.webp",
	},
	{
		name: "Bill McCann",
		role: "SWE @ Meta",
		headshotPath: "/photos/judges/BillMcCann.webp",
	},
	{
		name: "Brent Lee",
		role: "Product Content Engineering @ Meta",
		headshotPath: "/photos/judges/BrentLee.webp",
	},
	{
		name: "Hari Panjwani",
		role: "SWE @ Meta",
		headshotPath: "/photos/judges/HariPanjwani.webp",
	},
	{
		name: "Himanshu Srivastava",
		role: "SWE Manager @ Meta",
		headshotPath: "/photos/judges/HimanshuSrivastava.webp",
	},

	// SentinelOne
	{
		name: "Miguel Nungaray",
		role: "Staff Professional Services Consultant @ SentinelOne",
		headshotPath: "/photos/judges/MiguelNungaray.webp",
	},
	{
		name: "Naookie Sato",
		role: "Staff Professional Services Consultant @ SentinelOne",
		headshotPath: "/photos/judges/NaookieSato.webp",
	},
	{
		name: "Nicholas Eskie",
		role: "Staff Professional Services Consultant @ SentinelOne",
	},

	// Walmart
	{
		name: "Komal Mukadam",
		role: "Senior SWE @ Walmart",
		headshotPath: "/photos/judges/KomalMukadam.webp",
	},
	{
		name: "Tejas Desai",
		role: "Staff SWE @ Walmart",
		headshotPath: "/photos/judges/TejasDesai.webp",
	},

	// Other Companies
	{
		name: "Antonio Ortega",
		role: "Application Engineer @ Natera",
		headshotPath: "/photos/judges/AntonioOrtega.webp",
	},
	{
		name: "Brian Ikei",
		role: "Consulting Director @ Huron",
		headshotPath: "/photos/judges/BrianIkei.webp",
	},
	{
		name: "Daniel Carlier",
		role: "Offensive Security Engineer @ Casco (YC X25)",
		headshotPath: "/photos/judges/DanielCarlier.webp",
	},
	{
		name: "Ernest Lessenger",
		role: "Chief Platform Architect at Run Consultants",
		headshotPath: "/photos/judges/ErnestLessenger.webp"
	},
	{
		name: "George Purvis",
		role: "Entreprise Account Executive @ Base44",
		headshotPath: "/photos/judges/GeorgePurvis.webp",
	},
	{
		name: "Michael Lynch",
		role: "Principal Software Architect @ Consumer Products Company",
		headshotPath: "/photos/judges/MichaelLynch.webp",
	},
	{
		name: "Morgan Mann",
		role: "VP Ops & Chief of Staff of Common Hardware Group @ Cisco",
		headshotPath: "/photos/judges/MorganMann.webp",
	},
	{
		name: "Philip Faulconer",
		role: "President Propeller Development",
		headshotPath: "/photos/judges/PhilipFaulconer.webp",
	},
	{
		name: "Santhosh Baradwaj",
		role: "SWE @ Intel",
		headshotPath: "/photos/judges/SanthoshBaradwaj.webp",
	},
	{
		name: "Sumer Patel",
		role: "Mobile Engineer @ Mascot Media",
		headshotPath: "/photos/judges/SumerPatel.webp",
	},

	// Independent / Other Roles
	{
		name: "Andrew Joliet",
		role: "Applied AI Supply Chain Researcher",
		headshotPath: "/photos/judges/AndrewJoliet.webp",
	},
	{
		name: "Komal Shriavastava",
		role: "Stealth AI Startup",
	},
	{
		name: "Melanie Lo",
		role: "Director of Educational Innovation",
		headshotPath: "/photos/judges/MelanieLo.webp",
	},
	{
		name: "Michael Birchmeier",
		role: "Quality and Operations Engineer",
		headshotPath: "/photos/judges/MichaelBirchmeier.webp",
	},
	{
		name: "Ryan R. Olds",
		role: "Principal Engineer @ Digital Buttes",
		headshotPath: "/photos/judges/RyanOlds.webp"
	},
	//

	{
		name: "Deepak Sharma",
		role: "Senior SWE @ Qualtrics"
	},
	{
		name: "Dishant Shahani",
		role: "AI Infrastructure & Applied AI Engineer @ Meta",
		headshotPath: "/photos/judges/DishantShahani.webp"
	},
	{
		name: "Vishal P.",
		role: "Principal Data & Applied Scientist @ SAP"
	},
	{
		name: "Jason Haggart",
		role: "CRO AI Transformation Executive @ Shelter Forest International",
		headshotPath: "/photos/judges/JasonHaggart.webp"
	},
	{
		name: "Yash Shukla",
		role: "SWE @ Google"
	},
	{
		name: "Megh Gandhi",
		role: "Data Enginer @ Tmobile",
		headshotPath: "/photos/judges/MeghGandhi.webp"
	},
	{
		name: "Katrina Li",
		role: "SWE @ Meta"
	},
	{
		name: "Tanish Dhanjal",
		role: "AI Search Engineer @ Exa",
		headshotPath: "/photos/judges/TanishDhanjal.webp"
	},
	{
		name: "Nidhi Bhardwaj",
		role: "SWE @ Meta",
		headshotPath: "/photos/judges/NidhiBhardwaj.webp"
	},
	{
		name: "Akshay Choudhary",
		role: "SDE II @ Amazon",
		headshotPath: "/photos/judges/AkshayChoudhary.webp"
	},
	{
		name: "Laxman Balaji Balasubramanian",
		role: "SDE @ Meta",
		headshotPath: "/photos/judges/LaxmanBalajiBalasubramanian.webp"
	},
	{
		name: "Ryan W",
		role: "Senior SWE @ Google"
	}
];
