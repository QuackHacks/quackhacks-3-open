"use client";

import { motion, useScroll, useTransform, useInView, useSpring } from "motion/react";
import { useRef, useState } from "react";
import { TypingCaption } from "../_components/SectionWrapper";

/* ── animation presets ─────────────────────────────────────── */
const easeOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const fadeUp = {
	hidden: { opacity: 0, y: 40 },
	visible: (delay: number = 0) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.7, ease: easeOut, delay },
	}),
};
const viewportOpts = { once: true, margin: "-50px 0px" as const };

/* ── event types and data ─────────────────────────────────────── */
type EventCategory = "ceremony" | "workshop" | "food" | "activity" | "hacking" | "judging";

type ScheduleEvent = {
	time: string;
	title: string;
	description: string;
	category: EventCategory;
	location?: string;
	duration?: string;
};

type DaySchedule = {
	day: string;
	date: string;
	events: ScheduleEvent[];
};

const schedule: DaySchedule[] = [
	{
		day: "DAY 1",
		date: "May 30th, 2026",
		events: [
			{
				time: "8:00 AM",
				title: "Check-in & Registration",
				description: "Arrive, get your badge, free merch, connect with sponsors and meet other hackers!",
				category: "ceremony",
				location: "EMU Ballroom @UO",
				duration: "2 hours",
			},
			{
				time: "11:00 AM",
				title: "Team Formation Assistance",
				description: "Find teammates! We'll have a system to help solo hackers connect until the open ceremony starts.",
				category: "activity",
				duration: "1 hour",
			},
			{
				time: "11:15 AM",
				title: "Opening Ceremony",
				description: "Opening speech, sponsor introductions, and hackathon rules explained.",
				category: "ceremony",
				duration: "1 hour",
			},
			{
				time: "11:30 AM",
				title: "Workshop: Ethics in Tech",
				description: "Learn the fundamentals of ethics in technology.",
				category: "workshop",
				duration: "30 minutes",
			},
			{
				time: "11:45 AM",
				title: "Lunch has arrived!",
				description: "Fuel up with a hardy meal to power your hacking session.",
				category: "food",
			},
			{
				time: "12:00 PM",
				title: "Hacking Begins!",
				description: "Start building your projects. Mentors available for guidance.",
				category: "hacking",
			},
			{
				time: "12:30 PM",
				title: "Guest Speaker",
				description: "Hear from an industry guest speaker sharing insights and experience to inspire your hack.",
				category: "activity",
				duration: "30 minutes",
			},
			{
				time: "1:00 PM",
				title: "Workshop: Git & Version Control",
				description: "Learn the fundamentals of Git and version control.",
				category: "workshop",
				duration: "30 minutes",
			},
			{
				time: "1:30 PM",
				title: "Workshop: Base44",
				description: "Learn the fundamentals of Base44 and its applications.",
				category: "workshop",
				duration: "30 minutes",
			},
			{
				time: "2:30 PM",
				title: "Workshop: Intro to GitHub Copilot",
				description: "Learn the fundamentals of GitHub Copilot and how to use it effectively.",
				category: "workshop",
				duration: "30 minutes",
			},
			{
				time: "3:30 PM",
				title: "Workshop: Into to Google Ai Studio",
				description: "Learn the fundamentals of Google Ai Studio and its applications.",
				category: "workshop",
				duration: "30 minutes",
			},
			{
				time: "4:30 PM",
				title: "Workshop: MLH Tech Together",
				description: "Descend into the world of MLH and learn how to make the most of your hackathon experience.",
				category: "workshop",
				duration: "30 minutes",
			},
			{
				time: "6:30 PM",
				title: "Dinner is served!",
				description: "Enjoy a delicious dinner to keep your energy up for the long evening ahead.",
				category: "food",
			},
			{
				time: "7:00 PM",
				title: "Guest Speaker",
				description: "Wind down dinner with a talk from an industry guest speaker — stories, lessons, and a fresh dose of motivation for the night ahead.",
				category: "activity",
				duration: "30 minutes",
			},
			{
				time: "12:00 AM",
				title: "Midnight Snacks!",
				description: "PIZZA! PIZZA! PIZZA! Grab a slice and keep hacking through the night.",
				category: "food",
			},
		],
	},
	{
		day: "DAY 2",
		date: "May 31st, 2026",
		events: [
			{
				time: "1:00 AM",
				title: "The Night Shift",
				description: "Take a break with minigames activity, with a PRIZE for the winner!",
				category: "activity",
				duration: "1 hour",
			},
			{
				time: "8:00 AM",
				title: "Rise and Shine",
				description: "Start your day with some breakfast and coffee to get ready for the final stretch of hacking.",
				category: "food",
			},
			{
				time: "11:00 AM",
				title: "Projects Due; Soft deadline",
				description: "Begin submitting your projects. You have one hour to bug fix, final checks, and last minute tweaks before the final deadline at noon.",
				category: "hacking",
				duration: "1 hour",
			},
			{
				time: "11:00 AM",
				title: "QH Science Fair!",
				description: "We encourage you to check out other teams' projects and give feedback. This is a great opportunity to see what others have built and prepare for the expo and judging later today.",
				category: "activity",
				duration: "1.5 hours",
			},

			{
				time: "12:00 PM",
				title: "Final Submission Deadline",
				description: "Hard deadline for project submissions. No exceptions! Make sure to submit your project before this time.",
				category: "hacking",
				duration: "2 hours",
			},
			{
				time: "12:00 PM",
				title: "Lunch",
				description: "Eat lunch and mentally prepare for the final presentations. You deserve it after all your hard work!",
				category: "food",
			},
			{
				time: "1:00 PM",
				title: "Project Expo & Judging",
				description: "Present your project to judges and attendees. Science fair style!",
				category: "judging",
				duration: "2 hours",
			},
			{
				time: "4:00 PM",
				title: "Presentations and Awards Ceremony",
				description: "Winners announced and prizes awarded. The top 3 general winners will also be demoing their projects on stage, so stick around to see the best of the best!",
				category: "ceremony",
				duration: "45 minutes",
			},
			{
				time: "4:45 PM",
				title: "Closing Ceremony",
				description: "Thanks for coming! See you next year!",
				category: "ceremony",
			},
		],
	},
];

/* ── category styling ─────────────────────────────────────────── */
const categoryConfig: Record<EventCategory, { 
	color: string; 
	bgColor: string; 
	borderColor: string;
	icon: React.ReactNode;
}> = {
	ceremony: {
		color: "text-purple-600",
		bgColor: "bg-purple-50",
		borderColor: "border-purple-400",
		icon: (
			<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
				<path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
			</svg>
		),
	},
	workshop: {
		color: "text-blue-600",
		bgColor: "bg-blue-50",
		borderColor: "border-blue-400",
		icon: (
			<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
				<path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0z" />
			</svg>
		),
	},
	food: {
		color: "text-orange-600",
		bgColor: "bg-orange-50",
		borderColor: "border-orange-400",
		icon: (
			<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
				<path fillRule="evenodd" d="M3 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 5a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
			</svg>
		),
	},
	activity: {
		color: "text-pink-600",
		bgColor: "bg-pink-50",
		borderColor: "border-pink-400",
		icon: (
			<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
				<path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
			</svg>
		),
	},
	hacking: {
		color: "text-brand-600",
		bgColor: "bg-brand-50",
		borderColor: "border-brand-400",
		icon: (
			<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
				<path fillRule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
			</svg>
		),
	},
	judging: {
		color: "text-amber-600",
		bgColor: "bg-amber-50",
		borderColor: "border-amber-400",
		icon: (
			<svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
				<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
				<path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
			</svg>
		),
	},
};

/* ── event card component ─────────────────────────────────────── */
const EventCard = ({ 
	event, 
	index,
	isLast 
}: { 
	event: ScheduleEvent; 
	index: number;
	isLast: boolean;
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-50px 0px" });
	const config = categoryConfig[event.category];

	return (
		<div ref={ref} className="relative flex gap-3 md:gap-6">
			{/* Timeline connector */}
			<div className="flex flex-col items-center">
				{/* Time badge */}
				<motion.div
					className="relative z-10 flex items-center justify-center"
					initial={{ scale: 0, rotate: -180 }}
					animate={isInView ? { scale: 1, rotate: 0 } : { scale: 0, rotate: -180 }}
					transition={{ type: "spring", stiffness: 200, damping: 15, delay: index * 0.05 }}
				>
					<div className={`w-10 h-10 md:w-12 md:h-12 rounded-full ${config.bgColor} border-2 ${config.borderColor} flex items-center justify-center ${config.color}`}>
						{config.icon}
					</div>
				</motion.div>
				{/* Connector line */}
				{!isLast && (
					<motion.div
						className="w-0.5 flex-1 bg-neutral-200 min-h-[20px]"
						initial={{ scaleY: 0 }}
						animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
						transition={{ duration: 0.4, delay: 0.2 + index * 0.05 }}
						style={{ originY: 0 }}
					/>
				)}
			</div>

			{/* Event content card */}
			<motion.div
				className={`flex-1 pb-6 md:pb-8`}
				initial={{ opacity: 0, x: -20 }}
				animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -20 }}
				transition={{ duration: 0.5, delay: 0.1 + index * 0.05 }}
			>
				<div className={`group p-4 md:p-5 bg-white border border-neutral-200 hover:border-neutral-400 hover:shadow-lg transition-all duration-300 relative overflow-hidden cursor-default`}>
					{/* Decorative corner accent */}
					<div className={`absolute top-0 right-0 w-16 h-16 ${config.bgColor} opacity-50`} 
						style={{ clipPath: "polygon(100% 0, 0 0, 100% 100%)" }} 
					/>
					
					{/* Time and category row */}
					<div className="flex flex-wrap items-center gap-2 md:gap-3 mb-2">
						<span className="text-lg md:text-xl font-bold text-neutral-900 font-mono">
							{event.time}
						</span>
						<span className={`px-2 py-0.5 text-xs font-semibold tracking-wide uppercase ${config.bgColor} ${config.color} rounded-full`}>
							{event.category}
						</span>
						{event.duration && (
							<span className="text-xs text-neutral-400 font-mono">
								({event.duration})
							</span>
						)}
					</div>

					{/* Title */}
					<h3 className="text-base md:text-xl font-bold text-neutral-900 mb-1 group-hover:text-brand-700 transition-colors">
						{event.title}
					</h3>

					{/* Description */}
					<p className="text-sm md:text-base text-neutral-600 leading-relaxed mb-2">
						{event.description}
					</p>

					{/* Location */}
					{event.location && (
						<div className="flex items-center gap-1.5 text-xs md:text-sm text-neutral-500">
							<svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
							</svg>
							<span>{event.location}</span>
						</div>
					)}
				</div>
			</motion.div>
		</div>
	);
};

/* ── day section component ─────────────────────────────────────── */
const DaySection = ({ 
	daySchedule, 
	dayIndex 
}: { 
	daySchedule: DaySchedule; 
	dayIndex: number;
}) => {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true, margin: "-100px 0px" });

	return (
		<motion.section
			ref={ref}
			className="relative"
			initial={{ opacity: 0 }}
			animate={isInView ? { opacity: 1 } : { opacity: 0 }}
			transition={{ duration: 0.6 }}
		>
			{/* Day header */}
			<motion.div
				className="mb-6 md:mb-8 relative"
				initial={{ opacity: 0, y: 20 }}
				animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
				transition={{ duration: 0.5 }}
			>
				{/* Decorative background element */}
				<motion.div 
					className="absolute -left-4 md:-left-8 top-1/2 -translate-y-1/2 w-2 md:w-3 h-16 md:h-24 bg-brand-500"
					initial={{ scaleY: 0 }}
					animate={isInView ? { scaleY: 1 } : { scaleY: 0 }}
					transition={{ duration: 0.4, delay: 0.2 }}
				/>
				
				<div className="flex flex-col md:flex-row md:items-end gap-2 md:gap-4">
					<motion.h2 
						className="text-4xl md:text-6xl font-bold text-neutral-900 tracking-tight"
						initial={{ opacity: 0, x: -30 }}
						animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -30 }}
						transition={{ duration: 0.5, delay: 0.1 }}
					>
						{daySchedule.day}
					</motion.h2>
					<motion.div 
						className="flex items-center gap-2"
						initial={{ opacity: 0 }}
						animate={isInView ? { opacity: 1 } : { opacity: 0 }}
						transition={{ duration: 0.5, delay: 0.3 }}
					>
						<div className="w-8 md:w-12 h-px bg-brand-500" />
						<span className="text-lg md:text-2xl text-brand-600 font-medium">
							{daySchedule.date}
						</span>
					</motion.div>
				</div>

				{/* Event count badge */}
				<motion.div
					className="mt-3 inline-flex items-center gap-2 px-3 py-1 bg-neutral-100 border border-neutral-200 text-sm text-neutral-600"
					initial={{ opacity: 0, scale: 0.8 }}
					animate={isInView ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
					transition={{ duration: 0.4, delay: 0.4 }}
				>
					<div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse" />
					{daySchedule.events.length} events scheduled
				</motion.div>
			</motion.div>

			{/* Events list */}
			<div className="pl-0 md:pl-4">
				{daySchedule.events.map((event, index) => (
					<EventCard 
						key={`${dayIndex}-${index}`} 
						event={event} 
						index={index}
						isLast={index === daySchedule.events.length - 1}
					/>
				))}
			</div>
		</motion.section>
	);
};

/* ── legend component ─────────────────────────────────────────── */
const Legend = () => {
	const ref = useRef<HTMLDivElement>(null);
	const isInView = useInView(ref, { once: true });

	const categories: EventCategory[] = ["ceremony", "workshop", "food", "activity", "hacking", "judging"];

	return (
		<motion.div
			ref={ref}
			className="mb-8 md:mb-12 p-4 md:p-6 bg-neutral-50 border border-neutral-200"
			initial={{ opacity: 0, y: 20 }}
			animate={isInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
			transition={{ duration: 0.5 }}
		>
			<h3 className="text-sm font-semibold text-neutral-700 mb-3 uppercase tracking-wide">Event Types</h3>
			<div className="flex flex-wrap gap-3 md:gap-4">
				{categories.map((category, i) => {
					const config = categoryConfig[category];
					return (
						<motion.div
							key={category}
							className="flex items-center gap-2"
							initial={{ opacity: 0, x: -10 }}
							animate={isInView ? { opacity: 1, x: 0 } : { opacity: 0, x: -10 }}
							transition={{ duration: 0.3, delay: i * 0.05 }}
						>
							<div className={`w-6 h-6 md:w-8 md:h-8 rounded-full ${config.bgColor} border ${config.borderColor} flex items-center justify-center ${config.color}`}>
								{config.icon}
							</div>
							<span className="text-xs md:text-sm text-neutral-600 capitalize">{category}</span>
						</motion.div>
					);
				})}
			</div>
		</motion.div>
	);
};

/* ── day selector tabs ─────────────────────────────────────────── */
const DayTabs = ({ 
	activeDay, 
	setActiveDay 
}: { 
	activeDay: number; 
	setActiveDay: (day: number) => void;
}) => {
	return (
		<div className="flex gap-2 md:gap-4 mb-8 md:mb-12">
			{schedule.map((day, index) => (
				<motion.button
					key={index}
					onClick={() => setActiveDay(index)}
					className={`
						relative px-4 md:px-8 py-3 md:py-4 font-bold text-sm md:text-lg tracking-wide transition-colors cursor-pointer
						${activeDay === index 
							? 'bg-brand-500 text-white' 
							: 'bg-neutral-100 text-neutral-600 hover:bg-neutral-200'
						}
					`}
					whileHover={{ y: -2 }}
					whileTap={{ scale: 0.98 }}
				>
					<span className="relative z-10">{day.day}</span>
					<span className={`block text-xs md:text-sm font-normal mt-0.5 ${activeDay === index ? 'text-white/80' : 'text-neutral-400'}`}>
						{day.date}
					</span>
					{activeDay === index && (
						<motion.div
							className="absolute bottom-0 left-0 right-0 h-1 bg-brand-700"
							layoutId="activeTab"
							transition={{ type: "spring", stiffness: 300, damping: 30 }}
						/>
					)}
				</motion.button>
			))}
		</div>
	);
};

/* ── decorative elements ─────────────────────────────────────── */
const DecorativeShapes = () => (
	<>
		{/* Grid pattern background */}
		<div 
			className="absolute inset-0 -z-10 opacity-[0.03]"
			style={{
				backgroundImage: `
					linear-gradient(to right, #000 1px, transparent 1px),
					linear-gradient(to bottom, #000 1px, transparent 1px)
				`,
				backgroundSize: '60px 60px',
			}}
		/>

		{/* Top right large square */}
		<motion.div 
			className="hidden md:block absolute top-20 right-8 w-40 h-40 opacity-[0.08]"
			animate={{ rotate: [0, 90, 90, 0] }}
			transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
		>
			<div className="w-full h-full bg-brand-500 rotate-45" />
		</motion.div>

		{/* Top right smaller square */}
		<motion.div 
			className="hidden md:block absolute top-48 right-32 w-16 h-16 opacity-[0.12]"
			animate={{ rotate: [45, -45, 45] }}
			transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
		>
			<div className="w-full h-full border-3 border-brand-500" />
		</motion.div>

		{/* Top left circle */}
		<motion.div 
			className="hidden md:block absolute top-32 left-12 w-24 h-24 opacity-[0.06]"
			animate={{ scale: [1, 1.2, 1] }}
			transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
		>
			<div className="w-full h-full rounded-full border-4 border-brand-500" />
		</motion.div>

		{/* Left side vertical bar */}
		<div className="hidden md:block absolute top-1/4 left-0 w-2 h-64 bg-brand-500 opacity-[0.15]" />
		
		{/* Left side dots */}
		<div className="hidden md:block absolute top-1/3 left-6">
			<div className="flex flex-col gap-3">
				{[...Array(5)].map((_, i) => (
					<motion.div 
						key={i}
						className="w-2 h-2 bg-brand-500 opacity-20"
						initial={{ opacity: 0.1 }}
						animate={{ opacity: [0.1, 0.3, 0.1] }}
						transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
					/>
				))}
			</div>
		</div>

		{/* Right side hexagon */}
		<motion.div 
			className="hidden lg:block absolute top-[60%] right-4 w-20 h-20 opacity-[0.08]"
			animate={{ rotate: [0, 360] }}
			transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
		>
			<div 
				className="w-full h-full bg-brand-600"
				style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
			/>
		</motion.div>

		{/* Bottom left decorative cluster */}
		<div className="hidden md:block absolute bottom-60 left-0">
			<div className="relative">
				<div className="w-32 h-32 border-2 border-brand-500 rounded-full opacity-[0.06]" />
				<div className="absolute top-4 left-4 w-24 h-24 border-2 border-brand-400 rounded-full opacity-[0.08]" />
				<div className="absolute top-8 left-8 w-16 h-16 bg-brand-500 rounded-full opacity-[0.04]" />
			</div>
		</div>

		{/* Bottom right triangle */}
		<motion.div 
			className="hidden md:block absolute bottom-40 right-16 w-24 h-24 opacity-[0.07]"
			animate={{ y: [0, -10, 0] }}
			transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
		>
			<div 
				className="w-full h-full bg-brand-500"
				style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }}
			/>
		</motion.div>

		{/* Floating diamonds on right */}
		<div className="hidden lg:block absolute top-[40%] right-20">
			<div className="flex flex-col gap-6">
				{[12, 8, 6].map((size, i) => (
					<motion.div 
						key={i}
						className="bg-brand-500 opacity-[0.1]"
						style={{ width: size * 4, height: size * 4, transform: "rotate(45deg)" }}
						animate={{ x: [0, 10, 0], opacity: [0.1, 0.15, 0.1] }}
						transition={{ duration: 4 + i, repeat: Infinity, delay: i * 0.5 }}
					/>
				))}
			</div>
		</div>

		{/* Cross pattern middle left */}
		<div className="hidden md:block absolute top-[50%] left-4 opacity-[0.08]">
			<div className="relative w-12 h-12">
				<div className="absolute inset-y-0 left-1/2 w-2 -translate-x-1/2 bg-brand-500" />
				<div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 bg-brand-500" />
			</div>
		</div>

		{/* Scattered small squares */}
		{[
			{ top: "15%", right: "25%", size: 8 },
			{ top: "75%", right: "10%", size: 6 },
			{ top: "85%", left: "20%", size: 10 },
			{ top: "25%", left: "30%", size: 6 },
		].map((pos, i) => (
			<motion.div
				key={i}
				className="hidden md:block absolute bg-brand-500 opacity-[0.06] rotate-45"
				style={{ 
					top: pos.top, 
					right: pos.right, 
					left: pos.left,
					width: pos.size * 4, 
					height: pos.size * 4 
				}}
				animate={{ rotate: [45, 135, 45] }}
				transition={{ duration: 10 + i * 2, repeat: Infinity, ease: "easeInOut" }}
			/>
		))}

		{/* Gradient orbs */}
		<div className="absolute top-1/4 right-1/4 w-96 h-96 bg-brand-200 rounded-full blur-3xl opacity-[0.08] -z-10" />
		<div className="absolute bottom-1/4 left-1/4 w-80 h-80 bg-brand-300 rounded-full blur-3xl opacity-[0.06] -z-10" />
	</>
);

/* ── main component ─────────────────────────────────────────── */
const TimelinePage = () => {
	const [activeDay, setActiveDay] = useState(0);
	const headerRef = useRef<HTMLDivElement>(null);
	const isHeaderInView = useInView(headerRef, { once: true, margin: "-100px 0px" });

	return (
		<main className="min-h-screen bg-white py-16 md:py-24 relative overflow-hidden">
			<DecorativeShapes />
			
			<div className="max-w-4xl mx-auto px-4 md:px-8">
				{/* Header */}
				<motion.div
					ref={headerRef}
					className="mb-10 md:mb-16"
					variants={fadeUp}
					initial="hidden"
					animate={isHeaderInView ? "visible" : "hidden"}
					custom={0}
				>
					{/* Title */}
					<h1 className="font-bold text-4xl md:text-7xl text-neutral-900 uppercase tracking-tight">
						EVENT SCHEDULE
					</h1>
					<TypingCaption text="24 hours of hacking and fun" />
					
					{/* Subtitle */}
					<motion.p 
						className="mt-4 md:mt-6 text-base md:text-xl text-neutral-600 max-w-2xl leading-relaxed"
						initial={{ opacity: 0 }}
						animate={isHeaderInView ? { opacity: 1 } : { opacity: 0 }}
						transition={{ delay: 0.5, duration: 0.6 }}
					>
						Here&apos;s everything happening at QuackHacks 3.0!
					</motion.p>

					{/* Quick stats */}
					<motion.div 
						className="mt-6 flex flex-wrap gap-4 md:gap-8"
						initial={{ opacity: 0, y: 20 }}
						animate={isHeaderInView ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
						transition={{ delay: 0.7, duration: 0.5 }}
					>
						{[
						{ label: "Duration", value: "24 Hours" },
						{ label: "Workshops", value: "4+" },
						{ label: "Meals Provided", value: "5" },
						].map((stat, i) => (
							<div key={i} className="flex items-center gap-2">
								<div className="w-1.5 h-1.5 bg-brand-500 rotate-45" />
								<span className="text-sm text-neutral-500">{stat.label}:</span>
								<span className="text-sm font-bold text-neutral-900">{stat.value}</span>
							</div>
						))}
					</motion.div>
				</motion.div>

				{/* Day selector tabs */}
				<DayTabs activeDay={activeDay} setActiveDay={setActiveDay} />

				{/* Legend */}
				<Legend />

				{/* Schedule content */}
				<DaySection
					key={activeDay}
					daySchedule={schedule[activeDay]}
					dayIndex={activeDay}
				/>

				{/* Day navigation */}
				<div className="mt-10 md:mt-14 flex items-center justify-between gap-3 md:gap-4 pt-6 md:pt-8 border-t border-neutral-200">
					<motion.button
						onClick={() => setActiveDay(activeDay - 1)}
						disabled={activeDay === 0}
						className={`
							group flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 font-bold text-sm md:text-base tracking-wide transition-colors
							${activeDay === 0
								? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
								: 'bg-neutral-100 text-neutral-700 hover:bg-brand-500 hover:text-white cursor-pointer'
							}
						`}
						whileHover={activeDay === 0 ? {} : { x: -2 }}
						whileTap={activeDay === 0 ? {} : { scale: 0.98 }}
					>
						<motion.span
							animate={activeDay === 0 ? {} : { x: [0, -4, 0] }}
							transition={{ duration: 1.5, repeat: Infinity }}
						>
							←
						</motion.span>
						<span className="flex flex-col items-start leading-tight">
							<span className="text-xs font-normal opacity-70">Previous</span>
							<span>{activeDay > 0 ? schedule[activeDay - 1].day : "—"}</span>
						</span>
					</motion.button>

					<motion.button
						onClick={() => setActiveDay(activeDay + 1)}
						disabled={activeDay === schedule.length - 1}
						className={`
							group flex items-center gap-2 md:gap-3 px-4 md:px-6 py-3 md:py-4 font-bold text-sm md:text-base tracking-wide transition-colors
							${activeDay === schedule.length - 1
								? 'bg-neutral-100 text-neutral-400 cursor-not-allowed'
								: 'bg-neutral-100 text-neutral-700 hover:bg-brand-500 hover:text-white cursor-pointer'
							}
						`}
						whileHover={activeDay === schedule.length - 1 ? {} : { x: 2 }}
						whileTap={activeDay === schedule.length - 1 ? {} : { scale: 0.98 }}
					>
						<span className="flex flex-col items-end leading-tight">
							<span className="text-xs font-normal opacity-70">Next</span>
							<span>{activeDay < schedule.length - 1 ? schedule[activeDay + 1].day : "—"}</span>
						</span>
						<motion.span
							animate={activeDay === schedule.length - 1 ? {} : { x: [0, 4, 0] }}
							transition={{ duration: 1.5, repeat: Infinity }}
						>
							→
						</motion.span>
					</motion.button>
				</div>

			</div>
		</main>
	);
};

export default TimelinePage;
