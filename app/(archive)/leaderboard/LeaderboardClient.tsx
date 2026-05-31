"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { AchievementRow } from "@/lib/types";
import { Crown, Star, Trophy, Award, X, ChevronDown, Watch } from "lucide-react";
import Image from "next/image";
import { BADGE_MAP } from "@/app/constants";
import { AllAchievementsBoard } from "../gallery/AllAchievementsBoard";
import { BadgesBackground } from "./BadgesBackground";
import RankingRow from "./_components/RankingRow";

export type RankingDesc = {
	rank: number;
	id: string;
	name: string;
	total_points: number;
};

type Props = {
	rankings: RankingDesc[];
	achievements: AchievementRow[];
	usersAchievementsMap?: Record<string, string[]>;
};

function getInitials(name: string) {
	return name
		.split(" ")
		.map((n) => n[0])
		.slice(0, 2)
		.join("")
		.toUpperCase();
}

function PodiumCard({
	entry,
	place,
	isCurrentUser,
	delay,
	achievements,
	userEarnedIds = [],
	onAchievementClick,
}: {
	entry: RankingDesc;
	place: 1 | 2 | 3;
	isCurrentUser: boolean;
	delay: number;
	achievements: AchievementRow[];
	userEarnedIds: string[];
	onAchievementClick: (ach: AchievementRow) => void;
}) {
	const [isOpen, setIsOpen] = useState(false);
	const containerRef = useRef<HTMLDivElement>(null);

	const earnedAchievements = achievements.filter((a) => userEarnedIds.includes(a.id));

	useEffect(() => {
		if (!isOpen) return;
		const handleOutsideClick = (e: MouseEvent) => {
			if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("mousedown", handleOutsideClick);
		return () => document.removeEventListener("mousedown", handleOutsideClick);
	}, [isOpen]);

	const configs = {
		1: {
			avatarBg: "bg-linear-to-br from-amber-100 via-amber-200 to-amber-300",
			avatarText: "text-amber-800",
			pedestalBg: "bg-linear-to-b from-amber-300 via-amber-200 to-amber-100",
			pedestalH: "h-20",
			pedestalText: "text-amber-800",
			cardBg: isCurrentUser
				? "bg-linear-to-b from-white to-amber-50 ring-2 ring-amber-200"
				: "bg-linear-to-b from-white to-amber-50",
			borderColor: "border-amber-200",
			nameSz: "text-sm font-bold",
			ptsSz: "text-xs",
			iconColor: "text-amber-400",
			order: "order-2",
			rankLabel: "I",
		},
		2: {
			avatarBg: "bg-linear-to-br from-slate-100 via-slate-200 to-slate-300",
			avatarText: "text-slate-600",
			pedestalBg: "bg-linear-to-b from-slate-200 via-slate-250 to-slate-350",
			pedestalH: "h-12",
			pedestalText: "text-slate-600",
			cardBg: isCurrentUser
				? "bg-linear-to-b from-white to-slate-50 ring-2 ring-slate-200"
				: "bg-linear-to-b from-white to-slate-50",
			borderColor: "border-slate-200",
			nameSz: "text-xs font-semibold",
			ptsSz: "text-[11px]",
			iconColor: "text-slate-400",
			order: "order-1",
			rankLabel: "II",
		},
		3: {
			avatarBg: "bg-linear-to-br from-orange-100 via-orange-200 to-amber-300",
			avatarText: "text-orange-700",
			pedestalBg: "bg-linear-to-b from-orange-200 via-amber-250 to-amber-350",
			pedestalH: "h-8",
			pedestalText: "text-orange-700",
			cardBg: isCurrentUser
				? "bg-linear-to-b from-white to-orange-50 ring-2 ring-orange-200"
				: "bg-linear-to-b from-white to-orange-50",
			borderColor: "border-orange-200",
			nameSz: "text-xs font-semibold",
			ptsSz: "text-[11px]",
			iconColor: "text-amber-500",
			order: "order-3",
			rankLabel: "III",
		},
	};

	const c = configs[place];

	return (
		<motion.div
			ref={containerRef}
			initial={{ opacity: 0, y: 20 }}
			animate={{ opacity: 1, y: 0 }}
			transition={{ delay, duration: 0.4, ease: "easeOut" }}
			className={`flex flex-col items-stretch ${c.order} flex-1 relative ${isOpen ? "z-50" : "z-0"}`}
		>
			{/* Card */}
			<div className={`relative rounded-t-xl border ${c.borderColor} ${c.cardBg} px-3 py-4 flex flex-col items-center gap-2 shadow-sm overflow-visible`}>
				{/* Shimmer sweep — hidden on mobile to reduce paint cost */}
				<motion.div
					className="hidden sm:block absolute inset-0 rounded-t-xl pointer-events-none"
					style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.55) 50%, transparent 60%)", backgroundSize: "200% 100%" }}
					animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
					transition={{ duration: 3.5, repeat: Infinity, ease: "easeInOut", delay: delay + 1 }}
				/>
				{place === 1 && (
					<motion.div className="hidden sm:flex" animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
						<Crown className={`h-5 w-5 ${c.iconColor} mb-0.5`} />
					</motion.div>
				)}
				{place === 1 && <Crown className={`h-5 w-5 ${c.iconColor} mb-0.5 sm:hidden`} />}
				{place === 2 && (
					<motion.div className="hidden sm:flex" animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
						<Star className={`h-4 w-4 ${c.iconColor} mb-0.5`} />
					</motion.div>
				)}
				{place === 2 && <Star className={`h-4 w-4 ${c.iconColor} mb-0.5 sm:hidden`} />}
				{place === 3 && (
					<motion.div className="hidden sm:flex" animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.15, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}>
						<Trophy className={`h-4 w-4 ${c.iconColor} mb-0.5`} />
					</motion.div>
				)}
				{place === 3 && <Trophy className={`h-4 w-4 ${c.iconColor} mb-0.5 sm:hidden`} />}

				{/* Avatar */}
				<div className={`${place === 1 ? "h-12 w-12" : "h-10 w-10"} rounded-full ${c.avatarBg} flex items-center justify-center shadow-md`}>
					<span className={`font-bold ${place === 1 ? "text-base" : "text-sm"} ${c.avatarText}`}>
						{getInitials(entry.name)}
					</span>
				</div>

				<div className="text-center min-w-0 w-full flex flex-col items-center">
					<p className={`${c.nameSz} text-neutral-900 truncate w-full`}>{entry.name}</p>
					<p className={`font-mono ${c.ptsSz} text-neutral-500 mt-0.5`}>{entry.total_points} pts</p>
					{isCurrentUser && (
						<span className="inline-block mt-1 px-1.5 py-0.5 bg-brand-500 text-white text-[9px] font-mono uppercase tracking-wider rounded-sm">
							You
						</span>
					)}
					{earnedAchievements.length > 0 && (
						<div className="relative mt-2.5 z-50">
							<button
								onClick={() => setIsOpen(!isOpen)}
								className="relative z-10 flex min-h-10 items-center gap-1.5 rounded-full border border-brand-500/25 bg-brand-50 px-3.5 py-1.5 text-[10px] font-bold text-brand-700 shadow-xs cursor-pointer transition-[background-color,border-color,box-shadow,transform] duration-150 hover:scale-105 hover:bg-brand-100 active:scale-[0.96]"
								aria-expanded={isOpen}
							>
								<span>View Achievements</span>
								<span className="flex items-center justify-center bg-brand-500 text-white rounded-full w-4 h-4 text-[9px] font-mono font-bold leading-none tabular-nums">
									{earnedAchievements.length}
								</span>
								<motion.div
									animate={{ rotate: isOpen ? 180 : 0 }}
									transition={{ duration: 0.2 }}
									className="flex items-center"
								>
									<ChevronDown className="h-3 w-3 text-brand-600" />
								</motion.div>
							</button>

							{/* Attached dropdown */}
							<AnimatePresence initial={false}>
								{isOpen && (
									<motion.div
										initial={{ opacity: 0, y: -4, scale: 0.98 }}
										animate={{ opacity: 1, y: 0, scale: 1 }}
										exit={{ opacity: 0, y: -4, scale: 0.98 }}
										transition={{ type: "spring", duration: 0.28, bounce: 0 }}
										className={`absolute top-[calc(100%-1px)] z-0 w-[min(20rem,calc(100vw-2rem))] rounded-2xl border border-brand-500/25 bg-white p-3 shadow-xl shadow-neutral-900/10 ${place === 2 ? "left-0" : place === 3 ? "right-0" : "left-1/2 -translate-x-1/2"}`}
									>
										<div className="flex items-center justify-between border-b border-neutral-100 pb-2">
											<span className="font-mono text-[9px] font-bold uppercase tracking-wider text-neutral-400">Earned Badges</span>
											<button
												onClick={() => setIsOpen(false)}
												className="flex h-7 w-7 items-center justify-center rounded-full text-neutral-400 transition-colors hover:bg-neutral-100 hover:text-neutral-600"
												aria-label="Close earned badges"
											>
												<X className="h-3.5 w-3.5" />
											</button>
										</div>
										<div className="mt-2 grid max-h-64 grid-cols-3 gap-2 overflow-y-auto pr-1">
											{earnedAchievements.map(ach => {
												const badgeSrc = ach.key ? BADGE_MAP[ach.key] : null;
												return (
													<button
														key={ach.id}
														type="button"
														className="flex min-h-24 flex-col items-center rounded-xl border border-neutral-200/60 bg-neutral-50/50 p-2 text-center transition-[background-color,border-color,transform] hover:border-brand-500/20 hover:bg-brand-50/80 active:scale-[0.96]"
														onClick={() => onAchievementClick(ach)}
													>
														<span className="relative flex h-12 w-12 items-center justify-center rounded-full bg-white p-1 shadow-2xs ring-1 ring-neutral-900/5">
															{badgeSrc ? (
																<Image src={badgeSrc} alt={ach.name} width={44} height={44} className="object-contain" />
															) : (
																<Award className="h-5 w-5 text-brand-500" />
															)}
														</span>
														<span className="mt-1.5 line-clamp-2 w-full text-[9px] leading-tight text-neutral-800">
															{ach.name}
														</span>
													</button>
												);
											})}
										</div>
									</motion.div>
								)}
							</AnimatePresence>
						</div>
					)}
				</div>
			</div>

			{/* Pedestal */}
			<div className={`${c.pedestalBg} ${c.pedestalH} rounded-b-sm flex items-center justify-center shadow-inner`}>
				<span className={`font-mono text-sm font-black ${c.pedestalText} tracking-widest opacity-60`}>
					{c.rankLabel}
				</span>
			</div>
		</motion.div>
	);
}

export function LeaderboardClient({
	rankings,
	achievements,
	usersAchievementsMap = {},
}: Props) {
	const [selectedAchievement, setSelectedAchievement] = useState<AchievementRow | null>(null);

	const podium = rankings.slice(0, 3);
	const rest = rankings.slice(3);

	return (
		<main className="min-h-full bg-[#f4f4f4] overflow-x-hidden">
			<BadgesBackground />

			<section className="relative pt-24 pb-24 px-5 md:px-8 max-w-4xl mx-auto">

				{/* ── Header ── */}
				<motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
					<div>
						<h1 className="font-liebling font-bold text-4xl md:text-5xl text-neutral-900 mb-2 leading-tight">
							Badges
						</h1>
						<p className="text-neutral-500 text-sm max-w-xl leading-relaxed">
							Point rankings and achievement history from QuackHacks 3.
						</p>
					</div>
				</motion.div>

				{/* ── How It Works & Rewards Info Card ── */}
				<motion.div
					initial={{ opacity: 0, y: 12 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.1 }}
					className="mb-8 bg-white border border-neutral-200 rounded-2xl shadow-xs overflow-hidden relative"
				>
					<div className="flex flex-col md:flex-row items-stretch">
						{/* Left: Info */}
						<div className="flex-1 p-5 md:p-6 flex gap-4 items-start">
							<div className="space-y-1.5 min-w-0">
								<h2 className="text-sm font-bold text-neutral-900 tracking-tight flex items-center gap-1.5">
									How It Works & Rewards
								</h2>
								<p className="text-xs text-neutral-600 leading-relaxed">
									Achievements came from creating teams, linking repos, submitting projects, checking in,
									participating in events, and special milestones. Point totals determined each participant&apos;s
									position on the final leaderboard.
								</p>
							</div>
						</div>

						{/* Right: Prize Showcase Banner */}
						<div className="md:w-64 shrink-0 bg-linear-to-br from-amber-500 via-amber-600 to-yellow-600 p-5 md:p-6 text-white flex flex-col justify-center items-center text-center relative border-t md:border-t-0 md:border-l border-neutral-200/20">
							{/* Shimmer sweep — hidden on mobile to reduce paint cost */}
							<motion.div
								className="hidden sm:block absolute inset-0 pointer-events-none"
								style={{ background: "linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.2) 50%, transparent 60%)", backgroundSize: "200% 100%" }}
								animate={{ backgroundPosition: ["-200% 0", "200% 0"] }}
								transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
							/>
							<div className="relative flex flex-col items-center gap-1.5">
								<div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 backdrop-blur-md border border-white/20 shadow-xs mb-1">
									<Watch className="h-5 w-5 text-amber-100 animate-pulse" />
								</div>
								<span className="text-[10px] font-mono uppercase tracking-wider text-amber-100 font-bold bg-white/10 px-2 py-0.5 rounded-full">
									1st Place Prize
								</span>
								<h3 className="font-bold text-lg leading-tight tracking-tight">
									Apple Watch
								</h3>
								<p className="text-[10px] text-amber-50/90 leading-normal max-w-[180px]">
									Finish at the top of the leaderboard to take home an Apple Watch!
								</p>
							</div>
						</div>
					</div>
				</motion.div>

				{/* ── Podium (Top 3) ── */}
				{podium.length > 0 && (
					<motion.section
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.05 }}
						className="mb-5"
					>
						<div className="flex items-end gap-2 sm:gap-3">
							{podium[1] && (
								<PodiumCard
									entry={podium[1]}
									place={2}
									isCurrentUser={false}
									delay={0.12}
									achievements={achievements}
									userEarnedIds={usersAchievementsMap[podium[1].id] ?? []}
									onAchievementClick={setSelectedAchievement}
								/>
							)}
							{podium[0] && (
								<PodiumCard
									entry={podium[0]}
									place={1}
									isCurrentUser={false}
									delay={0.06}
									achievements={achievements}
									userEarnedIds={usersAchievementsMap[podium[0].id] ?? []}
									onAchievementClick={setSelectedAchievement}
								/>
							)}
							{podium[2] && (
								<PodiumCard
									entry={podium[2]}
									place={3}
									isCurrentUser={false}
									delay={0.18}
									achievements={achievements}
									userEarnedIds={usersAchievementsMap[podium[2].id] ?? []}
									onAchievementClick={setSelectedAchievement}
								/>
							)}
						</div>
					</motion.section>
				)}

				{/* ── Ranks 4+ ── */}
				{rest.length > 0 && (
					<motion.section
						initial={{ opacity: 0, y: 16 }}
						animate={{ opacity: 1, y: 0 }}
						transition={{ delay: 0.22 }}
						className="mb-5"
					>
						<div className="rounded-xl border border-neutral-200 bg-white shadow-sm overflow-hidden divide-y divide-neutral-100">
							{rest.map((rank) => (
								<RankingRow 
									key={rank.id} 
									rank={rank} 
									isCurrentUser={false}
									achievements={achievements}
									userEarnedIds={usersAchievementsMap[rank.id] ?? []}
									onAchievementClick={setSelectedAchievement}
								/>
							))}
						</div>
					</motion.section>
				)}

				<motion.section
					initial={{ opacity: 0, y: 16 }}
					animate={{ opacity: 1, y: 0 }}
					transition={{ delay: 0.3 }}
				>
					<AllAchievementsBoard achievements={achievements} />
				</motion.section>
			</section>

			{/* Achievement Details Modal Popup */}
			<AnimatePresence>
				{selectedAchievement && (
					<motion.div
						initial={{ opacity: 0 }}
						animate={{ opacity: 1 }}
						exit={{ opacity: 0 }}
						className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/45 backdrop-blur-xs"
						onClick={() => setSelectedAchievement(null)}
					>
						<motion.div
							initial={{ scale: 0.9, y: 15 }}
							animate={{ scale: 1, y: 0 }}
							exit={{ scale: 0.9, y: 15 }}
							transition={{ type: "spring", damping: 25, stiffness: 350 }}
							className="relative bg-white rounded-2xl border border-neutral-200/80 p-6 shadow-2xl max-w-sm w-full flex flex-col items-center text-center overflow-hidden"
							onClick={(e) => e.stopPropagation()}
						>
							{/* Background glow effects */}
							<div className="absolute -top-12 -left-12 w-28 h-28 bg-brand-500/10 rounded-full blur-2xl pointer-events-none" />
							<div className="absolute -bottom-12 -right-12 w-28 h-28 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

							{/* Close Button */}
							<button
								onClick={() => setSelectedAchievement(null)}
								className="absolute top-3.5 right-3.5 text-neutral-400 hover:text-neutral-600 p-1.5 rounded-full hover:bg-neutral-100 transition-colors cursor-pointer"
								aria-label="Close details"
							>
								<X className="h-4 w-4" />
							</button>

							{/* Badge Image */}
							<div className="relative w-20 h-20 flex items-center justify-center bg-linear-to-b from-neutral-50 to-neutral-100 rounded-full border border-neutral-200 p-1.5 shadow-xs mt-2">
								{selectedAchievement.key && BADGE_MAP[selectedAchievement.key] ? (
									<Image
										src={BADGE_MAP[selectedAchievement.key]}
										alt={selectedAchievement.name}
										width={72}
										height={72}
										className="object-contain"
									/>
								) : (
									<Award className="h-10 w-10 text-brand-500" />
								)}
							</div>

							{/* Achievement Name */}
							<h3 className="font-bold text-lg text-neutral-900 mt-4 leading-snug">
								{selectedAchievement.name}
							</h3>

							{/* Points */}
							<div className="flex items-center gap-2 mt-2">
								<span className="px-2 py-0.5 bg-brand-50 border border-brand-500/20 text-brand-700 rounded-md text-[10px] font-bold font-mono">
									+{selectedAchievement.points} pts
								</span>
							</div>

							{/* Description */}
							<p className="text-sm text-neutral-600 mt-4 leading-relaxed max-w-xs">
								{selectedAchievement.description}
							</p>

							{/* Difficulty */}
							<div className="mt-4 flex items-center gap-1 text-[10px] text-neutral-400 font-mono">
								<span>Difficulty:</span>
								<span className={`font-semibold capitalize ${
									selectedAchievement.difficulty.toLowerCase() === "easy"
										? "text-emerald-600"
										: selectedAchievement.difficulty.toLowerCase() === "hard"
											? "text-red-600"
											: "text-amber-600"
								}`}>
									{selectedAchievement.difficulty.toLowerCase()}
								</span>
							</div>

							{/* Action Button */}
							<button
								onClick={() => setSelectedAchievement(null)}
								className="mt-6 w-full py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-semibold shadow-md transition-all cursor-pointer active:scale-98"
							>
								Got it!
							</button>
						</motion.div>
					</motion.div>
				)}
			</AnimatePresence>
		</main>
	);
}
