"use client";

import type { PublicRosterUser } from "@/lib/types";
import { getFullName } from "@/lib/types";
import { useState, useEffect, MouseEventHandler } from "react";
import Image from "next/image";
import { PencilIcon, SearchIcon, XIcon } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { GithubIcon, LinkedinIcon } from "@/app/_components/misc/OtherBrandIcons";
import Link from "next/link";
import YouTag from "@/app/_components/YouTag";

// this is actually really important
const kCardHeight = "h-44 sm:h-52";

const EmptyLink = ({ icon, label, light }: { icon: React.ReactNode; label: string; light?: boolean }) => (
	<span
		className={`inline-flex items-center gap-1.5 text-xs ${
			light ? "text-neutral-500" : "text-neutral-300"
		} italic`}
	>
		{icon}
		{label}
	</span>
);

const UserCard = ({
	user,
	imageUrl,
	isYou,
	onClick,
	onEdit,
}: {
	user: PublicRosterUser;
	imageUrl?: string | null;
	isYou?: boolean;
	onClick: () => void;
	onEdit?: () => void;
}) => {
	const initials =
		`${(user.first_name?.[0] ?? "").toUpperCase()}${(user.last_name?.[0] ?? "").toUpperCase()}` || "?";

	return (
		<div
			onClick={onClick}
			className={`cursor-pointer flex flex-col gap-2.5 p-3 sm:p-5 w-44 sm:w-72 ${kCardHeight} transition-all duration-200 group relative ${
				isYou
					? "bg-brand-100 text-brand-950 border border-brand-400 shadow-lg shadow-brand-500/10"
					: "bg-white border border-neutral-200 hover:shadow-lg"
			}`}
		>
			{isYou && (
				<>
					<span className="absolute -top-2.5 right-3 flex">
                        <YouTag/>
					</span>
					<button
						onClick={(e) => {
							e.stopPropagation();
							onEdit?.();
						}}
						className="absolute z-50 -bottom-3 right-3 cursor-pointer px-2.5 py-1 text-[10px] font-mono font-bold bg-amber-400 hover:bg-amber-300 text-neutral-900 tracking-wider uppercase flex items-center gap-1 transition-colors shadow-sm"
					>
						<PencilIcon className="w-2.5 h-2.5" />
						Edit Profile
					</button>
				</>
			)}
			<div className="flex items-center gap-3">
				{imageUrl ? (
					<Image
						src={imageUrl}
						alt="avatar"
						width={64}
						height={64}
						className="w-12 h-12 sm:w-16 sm:h-16 object-cover shrink-0"
					/>
				) : (
					<div
						className={`w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center font-bold text-base sm:text-lg font-mono shrink-0 ${
							isYou ? "bg-brand-500 text-white" : "bg-brand-100 text-brand-700"
						}`}
					>
						{initials}
					</div>
				)}
				<div className="flex flex-col min-w-0">
					<p className={`font-semibold leading-tight ${isYou ? "text-brand-950" : "text-neutral-900"}`}>
						{getFullName(user)}
					</p>
					<p className={`text-xs font-mono truncate ${isYou ? "text-brand-900/70" : "text-brand-600"}`}>
						{user.university || "No school listed"}
					</p>
				</div>
			</div>

			<p
				className={`text-[10px] leading-snug font-serif line-clamp-2 flex-1 italic ${
					user?.about_me ? "text-neutral-600" : "text-neutral-400"
				}`}
			>
				{user.about_me
					? user.about_me.length > 55
						? user.about_me.slice(0, 55) + "..."
						: user.about_me
					: "No bio yet"}
			</p>

			{(user.role_interest || user.track_interest) && (
				<div className="flex flex-wrap gap-1">
					{user.role_interest && (
						<span className="px-2 py-0.5 text-[10px] font-mono border bg-brand-500 text-brand-100 border-brand-600">
							{user.role_interest}
						</span>
					)}
					{user.track_interest && (
						<span
							className={`px-2 py-0.5 text-[10px] font-mono border ${
								isYou
									? "bg-white/70 text-brand-950 border-brand-300"
									: "bg-neutral-50 text-neutral-500 border-neutral-200"
							}`}
						>
							{user.track_interest}
						</span>
					)}
				</div>
			)}

			{/* Badge showcase / points */}
			<div className="flex items-center justify-between gap-1.5 min-h-8">
				{user.display_badges.length > 0 ? (
					<div className="flex items-center gap-1">
						{user.display_badges.map((badge) => (
							<div key={badge.badge_path} title={badge.name} className="w-8 h-8 flex items-center justify-center shrink-0">
								<Image
									src={badge.badge_path}
									alt={badge.name}
									width={40}
									height={40}
									className="object-contain"
								/>
							</div>
						))}
					</div>
				) : (
					<span className="text-[9px] sm:text-[10px] font-mono text-neutral-400 italic">No badges showcased</span>
				)}
				<span
					className={`text-[9px] sm:text-[10px] font-mono font-bold shrink-0 px-1.5 py-0.5 border ${
						isYou
							? "bg-brand-500 text-white border-brand-600 shadow-sm"
							: "bg-brand-50 text-brand-700 border-brand-200"
					}`}
				>
					{user.total_points} pts
				</span>
			</div>

			<div
				className={`h-px transition-colors ${isYou ? "bg-brand-300" : "bg-neutral-100 group-hover:bg-brand-200"}`}
			/>

			<div className="flex items-center gap-3 mt-auto">
				{user.linkedin_url ? (
					<LinkedinLink onClick={(e) => e.stopPropagation()} href={user.linkedin_url.startsWith("http") ? user.linkedin_url : `https://${user.linkedin_url}`} light={false} />
				) : (
					<EmptyLink
						icon={<LinkedinIcon className="w-3 h-3 fill-current" />}
						label="—"
						light={isYou ? true : false}
					/>
				)}
				{user.github_url ? (
					<GithubLink onClick={(e) => e.stopPropagation()} href={user.github_url.startsWith("http") ? user.github_url : `https://${user.github_url}`} light={false} />
				) : (
					<EmptyLink
						icon={<GithubIcon className="w-3 h-3 fill-current" />}
						label="—"
						light={isYou ? true : false}
					/>
				)}
			</div>
		</div>
	);
};

const Field = ({ label, value }: { label: string; value?: string | number | boolean | null }) => {
	if (value === null || value === undefined || value === "") return null;
	const display = typeof value === "boolean" ? (value ? "Yes" : "No") : String(value);
	return (
		<div className="flex flex-col gap-0.5">
			<span className="text-[11px] font-semibold uppercase tracking-wide text-neutral-400">{label}</span>
			<span className="text-sm text-neutral-700 wrap-break-word font-mono">{display}</span>
		</div>
	);
};

const kLinkSizeMap = {
	sm: { text: "text-xs", icon: "w-3 h-3" },
	md: { text: "text-xs", icon: "w-3 h-3" },
	lg: { text: "text-base", icon: "w-5 h-5" },
};
type LinkSize = keyof typeof kLinkSizeMap;

const LinkedinLink = ({
	href,
	onClick,
	size = "md",
	light,
}: {
	href: string;
	onClick?: MouseEventHandler<HTMLAnchorElement>;
	size?: LinkSize;
	light?: boolean;
}) => (
	<Link
		href={href}
		target="_blank"
		rel="noopener noreferrer"
		onClick={onClick}
		className={`inline-flex items-center gap-1.5 ${kLinkSizeMap[size].text} ${
			light ? "text-blue-300 hover:text-blue-200" : "text-blue-500 hover:text-blue-700"
		} transition-colors ease-out hover:underline`}
	>
		<LinkedinIcon className={`${kLinkSizeMap[size].icon} fill-current`} />
		LinkedIn
	</Link>
);

const GithubLink = ({
	href,
	onClick,
	size = "md",
	light,
}: {
	href: string;
	onClick?: MouseEventHandler<HTMLAnchorElement>;
	size?: LinkSize;
	light?: boolean;
}) => (
	<Link
		href={href}
		target="_blank"
		rel="noopener noreferrer"
		onClick={onClick}
		className={`inline-flex items-center gap-1.5 ${kLinkSizeMap[size].text} ${
			light ? "text-purple-300 hover:text-purple-200" : "text-purple-500 hover:text-purple-700"
		} transition-colors ease-out hover:underline`}
	>
		<GithubIcon className={`${kLinkSizeMap[size].icon} fill-current`} />
		GitHub
	</Link>
);

const Section = ({ title, children }: { title: string; children: React.ReactNode }) => (
	<div className="flex flex-col gap-3">
		<h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400 border-b border-neutral-200 pb-1">
			{title}
		</h3>
		<div className="grid grid-cols-2 gap-x-6 gap-y-3">{children}</div>
	</div>
);

const UserModal = ({
	user,
	onClose,
	isYou,
	onEdit,
}: {
	user: PublicRosterUser & { imageUrl?: string | null };
	onClose: () => void;
	isYou?: boolean;
	onEdit?: () => void;
}) => {
	const initials = `${(user.first_name?.[0] ?? "").toUpperCase()}${(user.last_name?.[0] ?? "").toUpperCase()}`;

	useEffect(() => {
		const handler = (e: KeyboardEvent) => e.key === "Escape" && onClose();
		window.addEventListener("keydown", handler);
		return () => window.removeEventListener("keydown", handler);
	}, [onClose]);

	return (
		<motion.div
			className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4"
			initial={{ opacity: 0 }}
			animate={{ opacity: 1 }}
			exit={{ opacity: 0 }}
			transition={{ duration: 0.2 }}
			onClick={onClose}
		>
			<motion.div
				className="relative bg-neutral-50 shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col"
				initial={{ opacity: 0, scale: 0.92, y: 24 }}
				animate={{ opacity: 1, scale: 1, y: 0 }}
				exit={{ opacity: 0, scale: 0.92, y: 24 }}
				transition={{ duration: 0.25, ease: [0.32, 0.72, 0, 1] }}
				onClick={(e) => e.stopPropagation()}
			>
				{/* header */}
				<div className="shrink-0 bg-brand-50 z-10 border-b border-brand-200">
					<div className="flex items-start gap-4 p-6 pb-4">
						{user.imageUrl ? (
							<Image
								src={user.imageUrl}
								alt="avatar"
								width={128}
								height={128}
								className="w-24 sm:w-32 aspect-square object-cover shrink-0"
							/>
						) : (
							<div className="w-24 sm:w-32 aspect-square bg-brand-100 text-brand-700 flex items-center justify-center font-bold text-2xl sm:text-3xl font-mono shrink-0">
								{initials}
							</div>
						)}
						<div className="flex-1 min-w-0">
							<h2 className="text-lg font-bold text-neutral-900">{getFullName(user)}</h2>
						</div>
						<div className="flex items-center gap-1.5 shrink-0">
							{isYou && onEdit && (
								<button
									onClick={() => {
										onClose();
										onEdit();
									}}
									className="cursor-pointer px-3 py-1.5 text-xs font-mono font-bold bg-amber-400 hover:bg-amber-300 text-neutral-900 transition-colors flex items-center gap-1.5"
								>
									<PencilIcon className="w-3.5 h-3.5" />
									Edit
								</button>
							)}
							<button
								onClick={onClose}
								className="cursor-pointer p-1.5 rounded-lg hover:bg-neutral-200 text-neutral-500 hover:text-neutral-600 transition-colors"
							>
								<XIcon className="w-5 h-5" />
							</button>
						</div>
					</div>
					{user?.about_me && (
						<div className="px-6 pb-4">
							<h6 className="text-neutral-400 text-xs">About</h6>
							<p className="text-sm text-neutral-500">{user.about_me}</p>
						</div>
					)}
				</div>

				{/* content */}
				<div className="flex flex-col gap-6 p-6 overflow-y-auto">
					{(user.linkedin_url || user.github_url) && (
						<div className="col-span-2 flex gap-4 flex-wrap">
							{user.linkedin_url && <LinkedinLink size="lg" href={user.linkedin_url} />}
							{user.github_url && <GithubLink size="lg" href={user.github_url} />}
						</div>
					)}

					<Section title="Education">
						<Field label="School" value={user.university} />
						<Field label="Major" value={user.major} />
						<Field label="Level of Study" value={user.level_of_study} />
						<Field label="Highest Education" value={user.highest_education} />
					</Section>

					{/* <Section title="Technical Background">
						<Field label="Experience Level" value={user.experience_level} />
						<Field label="Track Interest" value={user.track_interest} />
						<Field label="Role Interest" value={user.role_interest} />
						<TagList label="Languages" value={user.languages} />
						<TagList label="Frameworks" value={user.frameworks} />
					</Section> */}

					<Section title="Personal">
						<Field label="Country" value={user.residing_country} />
					</Section>

					<Section title="Team">
						<Field label="Team Status" value={user.has_team ? "On a team" : "Looking for a team"} />
					</Section>

					{/* Achievement Showcase & Points */}
					<div className="flex flex-col gap-3">
						<div className="flex items-center justify-between border-b border-neutral-200 pb-1">
							<h3 className="text-[11px] font-bold uppercase tracking-widest text-neutral-400">
								Achievement Showcase
							</h3>
							<span
								className={`text-[10px] font-mono font-bold px-2 py-0.5 border ${
									isYou
										? "bg-brand-500 text-white border-brand-600 shadow-sm"
										: "bg-brand-50 text-brand-700 border-brand-200"
								}`}
							>
								{user.total_points} Points
							</span>
						</div>
						{user.display_badges.length > 0 ? (
							<div className="flex flex-wrap gap-4">
								{user.display_badges.map((badge) => (
									<div key={badge.badge_path} className="flex flex-col items-center gap-1.5">
										<div className="w-12 h-12 sm:w-16 sm:h-16 flex items-center justify-center shrink-0">
											<Image
												src={badge.badge_path}
												alt={badge.name}
												width={64}
												height={64}
												className="object-contain"
											/>
										</div>
										<span className="text-[10px] font-mono text-neutral-500 text-center max-w-16 sm:max-w-20 leading-tight">{badge.name}</span>
									</div>
								))}
							</div>
						) : (
							<span className="text-[11px] font-mono text-neutral-400 italic">No achievements pinned to showcase</span>
						)}
					</div>
				</div>
			</motion.div>
		</motion.div>
	);
};

// when you search and its just empty
const EmptyState = () => (
	<motion.div
		initial={{ opacity: 0, y: 12 }}
		animate={{ opacity: 1, y: 0 }}
		transition={{ duration: 0.4 }}
		className="flex flex-col items-center justify-center py-24 gap-3"
	>
		<SearchIcon className="w-7 h-7 text-brand-400" />
		<p className="text-sm font-mono text-neutral-500">No members match your filters</p>
		<p className="text-xs text-neutral-400 font-mono">Try adjusting your search or filters</p>
	</motion.div>
);

export const RosterGrid = ({
	users,
	onEditProfileAction,
}: {
	users: (PublicRosterUser & { imageUrl?: string | null })[];
	onEditProfileAction?: () => void;
}) => {
	const [selected, setSelected] = useState<(PublicRosterUser & { imageUrl?: string | null }) | null>(null);

	if (!users.length) {
		return <EmptyState />;
	}

	return (
		<>
			<div className="flex flex-row flex-wrap gap-2 justify-center">
				{users.map((user, i) => (
					<motion.div
						key={user.id || i}
						initial={{ opacity: 0, y: 16 }}
						whileInView={{ opacity: 1, y: 0 }}
						viewport={{ once: true, margin: "-30px" }}
						transition={{
							duration: 0.35,
							delay: Math.min(i * 0.04, 0.6),
							ease: [0.25, 0.46, 0.45, 0.94],
						}}
					>
						<UserCard
							user={user}
							imageUrl={user.imageUrl}
							isYou={user.is_current_user}
							onClick={() => setSelected(user)}
							onEdit={
								user.is_current_user ? onEditProfileAction : undefined
							}
						/>
					</motion.div>
				))}
			</div>
			<AnimatePresence mode="wait">
				{selected && (
					<UserModal
						key={selected.id}
						user={selected}
						onClose={() => setSelected(null)}
						isYou={selected.is_current_user}
						onEdit={onEditProfileAction}
					/>
				)}
			</AnimatePresence>
		</>
	);
};
