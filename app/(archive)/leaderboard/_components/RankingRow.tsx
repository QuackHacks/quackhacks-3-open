import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import Image from "next/image";
import { ChevronDown, Award } from "lucide-react";
import { BADGE_MAP } from "@/app/constants";
import { AchievementRow } from "@/lib/types";
import { RankingDesc } from "../LeaderboardClient";

export default function RankingRow({
	rank,
	isCurrentUser,
	showYouBadge,
	achievements,
	userEarnedIds = [],
	onAchievementClick,
}: {
	rank: RankingDesc;
	isCurrentUser: boolean;
	showYouBadge?: boolean;
	achievements: AchievementRow[];
	userEarnedIds: string[];
	onAchievementClick: (ach: AchievementRow) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const earnedAchievements = achievements.filter((a) => userEarnedIds.includes(a.id));

	return (
		<li
			onClick={() => earnedAchievements.length > 0 && setIsOpen(!isOpen)}
			className={`flex flex-col px-3 sm:px-5 py-3.5 ${isCurrentUser ? "bg-brand-50" : "hover:bg-neutral-50"} ${earnedAchievements.length > 0 ? "cursor-pointer" : ""} transition-colors`}
		>
			<div className="flex items-center gap-2 sm:gap-4 w-full">
				{/* Rank badge */}
				<span
					className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full font-mono text-xs font-bold ${
						isCurrentUser
							? "bg-brand-500 text-white"
							: "bg-neutral-100 text-neutral-500"
					}`}
				>
					{rank.rank}
				</span>

				{/* Name */}
				<span className={`min-w-0 flex-1 text-sm font-semibold truncate ${isCurrentUser ? "text-brand-800" : "text-neutral-800"}`}>
					{rank.name}
				</span>

				{/* You badge */}
				{showYouBadge && (
					<span className="shrink-0 px-2 py-0.5 bg-brand-500 text-white text-[9px] font-mono uppercase tracking-wider rounded-sm">
						You
					</span>
				)}

				{/* Points */}
				<span className={`shrink-0 font-mono text-sm font-semibold ${isCurrentUser ? "text-brand-700" : "text-neutral-600"}`}>
					{rank.total_points} pts
				</span>

				{/* View Achievements Button */}
				{earnedAchievements.length > 0 && (
					<button
						onClick={(e) => {
							e.stopPropagation();
							setIsOpen(!isOpen);
						}}
						className="shrink-0 flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 rounded-lg text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 border border-brand-500/20 shadow-2xs transition-all cursor-pointer hover:scale-102"
					>
						{/* Full label on sm+, compact count pill on mobile */}
						<span className="hidden sm:inline">{isOpen ? "Hide Achievements" : "View Achievements"}</span>
						<span className="inline sm:hidden font-mono text-[10px] font-bold">{earnedAchievements.length}</span>
						<span className="hidden sm:flex items-center justify-center bg-brand-500 text-white rounded-full w-4 h-4 text-[9px] font-mono font-bold leading-none">
							{earnedAchievements.length}
						</span>
						<motion.div
							animate={{ rotate: isOpen ? 180 : 0 }}
							transition={{ duration: 0.2 }}
							className="flex items-center"
						>
							<ChevronDown className="h-3.5 w-3.5 text-brand-600" />
						</motion.div>
					</button>
				)}
			</div>

			{/* Expandable badges panel */}
			<AnimatePresence initial={false}>
				{isOpen && earnedAchievements.length > 0 && (
					<motion.div
						initial={{ height: 0, opacity: 0, marginTop: 0 }}
						animate={{ height: "auto", opacity: 1, marginTop: 12 }}
						exit={{ height: 0, opacity: 0, marginTop: 0 }}
						transition={{ duration: 0.2, ease: "easeInOut" }}
						className="overflow-hidden w-full border-t border-neutral-100"
					>
						<div className="pt-2 pb-0.5 grid grid-cols-3 sm:grid-cols-5 gap-1.5">
							{earnedAchievements.map((ach) => {
								const badgeSrc = ach.key ? BADGE_MAP[ach.key] : null;
								return (
									<div
										key={ach.id}
										className="flex items-center gap-1.5 py-1 px-1.5 rounded-lg bg-neutral-50/50 hover:bg-neutral-50 border border-neutral-200/40 transition-colors cursor-pointer"
										onClick={(e) => {
											e.stopPropagation();
											onAchievementClick(ach);
										}}
									>
										<div className="relative w-9 h-9 shrink-0 flex items-center justify-center bg-white rounded-full border border-neutral-200/50 p-0.5 shadow-2xs">
											{badgeSrc ? (
												<Image src={badgeSrc} alt={ach.name} width={32} height={32} className="object-contain" />
											) : (
												<Award className="h-4 w-4 text-brand-500" />
											)}
										</div>
										<div className="min-w-0 flex-1">
											<span className="block text-[8px] text-neutral-800 truncate">
												{ach.name}
											</span>
										</div>
									</div>
								);
							})}
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</li>
	);
}
