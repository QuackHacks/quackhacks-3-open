"use client";

import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "motion/react";
import {
	Award,
	Calendar,
	CalendarCheck,
	FileCheck,
	Github,
	LayersIcon,
	Moon,
	Rocket,
	Sparkles,
	Star,
	Sun,
	Sunrise,
	TrendingUp,
	Trophy,
	UserPlus,
	Users,
	Zap,
} from "lucide-react";
import { BADGE_MAP } from "@/app/constants";
import type { AchievementCategory, AchievementRow } from "@/lib/types";

const CATEGORY_ORDER: AchievementCategory[] = ["Result", "Team", "Dev", "Engagement", "Special", "EasterEgg"];

type IconComponent = React.ComponentType<{ className?: string }>;

const CATEGORY_META: Record<string, { label: string; icon: IconComponent; color: string }> = {
	Result: { label: "Result", icon: Trophy, color: "bg-amber-100 text-amber-800 border-amber-200 data-[active=true]:bg-amber-500 data-[active=true]:text-white data-[active=true]:border-amber-500" },
	Team: { label: "Team", icon: Users, color: "bg-blue-100 text-blue-800 border-blue-200 data-[active=true]:bg-blue-500 data-[active=true]:text-white data-[active=true]:border-blue-500" },
	Dev: { label: "Build & Ship", icon: Github, color: "bg-violet-100 text-violet-800 border-violet-200 data-[active=true]:bg-violet-500 data-[active=true]:text-white data-[active=true]:border-violet-500" },
	Engagement: { label: "Engagement", icon: Zap, color: "bg-emerald-100 text-emerald-800 border-emerald-200 data-[active=true]:bg-emerald-500 data-[active=true]:text-white data-[active=true]:border-emerald-500" },
	Special: { label: "Special", icon: Sparkles, color: "bg-rose-100 text-rose-800 border-rose-200 data-[active=true]:bg-rose-500 data-[active=true]:text-white data-[active=true]:border-rose-500" },
	EasterEgg: { label: "Hidden", icon: Award, color: "bg-neutral-100 text-neutral-600 border-neutral-200 data-[active=true]:bg-neutral-800 data-[active=true]:text-white data-[active=true]:border-neutral-800" },
};

const ICON_MAP: Record<string, React.ComponentType<{ className?: string }>> = {
	trophy: Trophy,
	award: Award,
	github: Github,
	users: Users,
	rocket: Rocket,
	"user-plus": UserPlus,
	"layout-dashboard": LayersIcon,
	"file-check": FileCheck,
	sunrise: Sunrise,
	star: Star,
	"trending-up": TrendingUp,
	zap: Zap,
	sun: Sun,
	moon: Moon,
	calendar: Calendar,
	"calendar-check": CalendarCheck,
	sparkles: Sparkles,
};

function AchievementArchiveCard({
	achievement,
	index,
}: {
	achievement: AchievementRow;
	index: number;
}) {
	const Icon = achievement.icon && ICON_MAP[achievement.icon] ? ICON_MAP[achievement.icon] : Award;
	const badgeSrc = achievement.key ? BADGE_MAP[achievement.key] : null;
	const difficulty = achievement.difficulty?.toLowerCase() ?? "easy";
	const difficultyConfig =
		{
			easy: { cls: "bg-neutral-100 text-neutral-700", label: "Easy" },
			medium: { cls: "bg-amber-100 text-amber-700", label: "Medium" },
			hard: { cls: "bg-red-100 text-red-700", label: "Hard" },
		}[difficulty] ?? { cls: "bg-neutral-100 text-neutral-600", label: difficulty };

	return (
		<motion.div
			layout
			initial={{ opacity: 0, scale: 0.95 }}
			animate={{ opacity: 1, scale: 1 }}
			exit={{ opacity: 0, scale: 0.9 }}
			transition={{ delay: index * 0.03, duration: 0.25 }}
			className="relative flex min-h-40 items-center gap-5 overflow-hidden rounded-sm border border-neutral-200 bg-white/85 p-5 shadow-[0_14px_34px_rgba(0,0,0,0.035)] transition-all duration-200 hover:border-neutral-300 hover:bg-white hover:shadow-[0_18px_42px_rgba(0,0,0,0.055)]"
		>
			<div className="flex h-24 w-24 shrink-0 items-center justify-center">
				{badgeSrc ? (
					<Image
						src={badgeSrc}
						alt={achievement.name}
						width={96}
						height={96}
						className="h-24 w-24 object-contain"
					/>
				) : (
					<div className="flex h-24 w-24 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
						<Icon className="h-10 w-10" />
					</div>
				)}
			</div>

			<div className="min-w-0 flex-1">
				<div className="mb-2 flex flex-wrap items-center gap-2">
					<h3 className="font-sans text-xl font-bold leading-tight text-neutral-900">
						{achievement.name}
					</h3>
					<span className={`rounded-md px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${difficultyConfig.cls}`}>
						{difficultyConfig.label}
					</span>
				</div>

				<div className="mb-2 font-mono text-sm font-semibold text-neutral-500">
					+{achievement.points} pts
				</div>

				<p className="text-sm leading-relaxed text-neutral-600">
					{achievement.description}
				</p>
			</div>
		</motion.div>
	);
}

export function AllAchievementsBoard({ achievements }: { achievements: AchievementRow[] }) {
	const [activeCategory, setActiveCategory] = useState<AchievementCategory | "All">("All");

	const byCategory = new Map<AchievementCategory, AchievementRow[]>();
	for (const achievement of achievements) {
		const category = (achievement.category as AchievementCategory) || "Special";
		if (!byCategory.has(category)) byCategory.set(category, []);
		byCategory.get(category)!.push(achievement);
	}

	const orderedCategories = CATEGORY_ORDER.filter(
		(category) => byCategory.has(category) && (byCategory.get(category)?.length ?? 0) > 0,
	);

	const filteredAchievements =
		activeCategory === "All"
			? achievements
			: (byCategory.get(activeCategory as AchievementCategory) ?? []);

	return (
		<section id="achievements" className="scroll-mt-24">
			<div className="flex items-baseline justify-between mb-5">
				<div>
					<p className="font-mono text-[9px] uppercase tracking-superwide text-neutral-400 mb-1">
						Achievement Board
					</p>
					<h2 className="font-liebling font-bold text-2xl text-neutral-900">All Achievements</h2>
				</div>
			</div>

			<div className="flex flex-wrap gap-2 mb-6">
				<button
					type="button"
					onClick={() => setActiveCategory("All")}
					data-active={activeCategory === "All"}
					className="inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-150
						bg-neutral-100 text-neutral-600 border-neutral-200
						data-[active=true]:bg-neutral-900 data-[active=true]:text-white data-[active=true]:border-neutral-900"
				>
					All
					<span className="font-mono text-[10px] opacity-70">{achievements.length}</span>
				</button>
				{orderedCategories.map((category) => {
					const meta = CATEGORY_META[category] ?? {
						label: category,
						icon: Award,
						color: "bg-neutral-100 text-neutral-600 border-neutral-200 data-[active=true]:bg-neutral-800 data-[active=true]:text-white data-[active=true]:border-neutral-800",
					};
					const CategoryIcon = meta.icon;
					const items = byCategory.get(category) ?? [];
					return (
						<button
							key={category}
							type="button"
							onClick={() => setActiveCategory(category)}
							data-active={activeCategory === category}
							className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-semibold transition-all duration-150 ${meta.color}`}
						>
							<CategoryIcon className="h-3 w-3" />
							{meta.label}
							<span className="font-mono text-[10px] opacity-70">
								{items.length}
							</span>
						</button>
					);
				})}
			</div>

			<motion.div layout className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				<AnimatePresence mode="popLayout">
					{filteredAchievements.map((achievement, index) => (
						<AchievementArchiveCard
							key={achievement.id}
							achievement={achievement}
							index={index}
						/>
					))}
				</AnimatePresence>
			</motion.div>

			{filteredAchievements.length === 0 && (
				<div className="text-center py-16 text-neutral-400 text-sm">
					No achievements in this category yet.
				</div>
			)}
		</section>
	);
}
