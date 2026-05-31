"use client";

import { useRef, useState, useEffect, memo } from "react";
import { motion, useScroll, useTransform, useMotionValueEvent, MotionValue } from "motion/react";
import SectionWrapper from "../_components/SectionWrapper";

const kTrackInfo = [
	{
		name: "Base44 Track",
		type: "QH TRACK",
		accent: "#f99740",
		prizes: {
			first: "$1500 Cash + Base44 3-month Builders License",
			runnersUp: "2-month Base44 Builders License",
		},
		lane: 1,
	},
	{
		name: "Pipeworks Track",
		type: "QH TRACK",
		accent: "#da2d21",
		prizes: {
			first: "$100 Steam Giftcard + $150 Best Buy Giftcard + $200 Amazon Giftcard + Pipeworks Swag + Resume Reviews",
			runnersUp: "Resume Reviews and Career Feedback from the Pipeworks Engineering Team",
		},
		lane: 2,
	},
	{
		name: "Google Track",
		type: "QH TRACK",
		accent: "#28a04a",
		prizes: {
			first: "Sony XM6 Headphones + Google Swag Bag",
		},
		lane: 3,
	},
	{
		name: "Best Use of Gemini API",
		type: "MLH TRACK",
		accent: "#f55656",
		description: "Google Swag Kit",
		lane: 4,
	},
	{
		name: "Best Use of Snowflake API",
		type: "MLH TRACK",
		accent: "#3babe3",
		description: "Raspberry Pi 4",
		lane: 5,
	},
	{
		name: "Best Use of ElevenLabs",
		type: "MLH TRACK",
		accent: "#111111",
		description: "Wireless Earbuds",
		lane: 6,
	},
	{
		name: "Best Use of DigitalOcean",
		type: "MLH TRACK",
		accent: "#0d4bdb",
		description: "Retro Wireless Mouse",
		lane: 7,
	},
	{
		name: "Best Use of Solana",
		type: "MLH TRACK",
		accent: "#2dd687",
		description: "Ledger Nano S Plus",
		lane: 8,
	},
	{
		name: "Best .Tech Domain Name",
		type: "MLH TRACK",
		accent: "#555555",
		description: "Desktop Microphone & Free .Tech Domain",
		lane: 9,
	},
	{
		name: "Best Use of Backboard",
		type: "MLH TRACK",
		accent: "#336dff",
		description: "Tile Essentials Pack",
		lane: 10,
	},
] as const;

type TrackInfo = (typeof kTrackInfo)[number];

const LANE_H = 160;
const LANE_H_COMPACT = 48;
const ARROW_GAP = 1200;
const ARROW_COLS = 35;
const SCROLL_MULT = (kTrackInfo.length + 1) / 2;
const STRIP_H = LANE_H_COMPACT * (kTrackInfo.length - 1) + LANE_H;
const ARROW_COL_INDICES = Array.from({ length: ARROW_COLS }, (_, i) => i);

function hexToRgb(hex: string) {
	const v = hex.replace("#", "");
	return {
		r: parseInt(v.substring(0, 2), 16),
		g: parseInt(v.substring(2, 4), 16),
		b: parseInt(v.substring(4, 6), 16),
	};
}

function blendColor(accent: string, background: string, alpha: number) {
	const a = hexToRgb(accent);
	const b = hexToRgb(background);
	const r = Math.round(a.r * alpha + b.r * (1 - alpha));
	const g = Math.round(a.g * alpha + b.g * (1 - alpha));
	const bl = Math.round(a.b * alpha + b.b * (1 - alpha));
	return "#" + [r, g, bl].map((v) => v.toString(16).padStart(2, "0")).join("");
}

const kBlended12 = kTrackInfo.map((t) => blendColor(t.accent, "#ffffff", 0.12));
const kBlended10 = kTrackInfo.map((t) => blendColor(t.accent, "#ffffff", 0.1));

// triangle icon
const Triangle = memo(function Triangle({ color }: { color: string }) {
	return (
		<div
			className="w-0 h-0"
			style={{
				borderTop: "6px solid transparent",
				borderBottom: "6px solid transparent",
				borderLeft: `10px solid ${color}`,
			}}
		/>
	);
});

const Lane = memo(
	({
		track,
		index,
		activeLane,
		scrollX,
		contentX,
	}: {
		track: TrackInfo;
		index: number;
		activeLane: number;
		scrollX: MotionValue<string>;
		contentX: number;
	}) => {
		const isActive = activeLane === index;
		const isPending = "pending" in track && track.pending === true;
		const isFirst = index === 0;
		const isLast = index === kTrackInfo.length - 1;
		const accent10 = kBlended10[index];
		const accent12 = kBlended12[index];
		const hasPrizePlacements = "prizes" in track && "runnersUp" in track.prizes;

		const counterX = useTransform(scrollX, (v: string) => {
			const n = parseFloat(v) || 0;
			return `${-n + contentX}px`;
		});

		const triangleColor = isActive ? "#f9cf16" : "#e5e5e5";

		return (
			<motion.div
				animate={{ height: isActive ? LANE_H : LANE_H_COMPACT }}
				transition={{ duration: 0.35, ease: [0.33, 1, 0.68, 1] }}
				className="relative shrink-0 overflow-hidden"
				style={
					{
						"--accent": track.accent,
						"--accent12": accent12,
						"--accent10": accent10,
					} as React.CSSProperties
				}
			>
				{/* outer thick lines top/bottom and thin dividers between */}
				<div
					className="absolute top-0 left-0 right-0 z-10"
					style={{
						height: 1,
						background: isFirst ? "#404040" : "#d4d4d4",
					}}
				/>
				{isLast && <div className="absolute bottom-0 left-0 right-0 z-10 h-px bg-[#404040]" />}
				<div
					className="absolute left-0 right-0 h-full overflow-hidden transition-colors duration-300"
					style={{
						top: 0,
						background: isActive ? "var(--accent12)" : "#ffffff00",
					}}
				>

					{/* triangles */}
					{ARROW_COL_INDICES.map((col) => (
						<div
							key={col}
							className="absolute hidden md:flex gap-1.5 items-center top-1/2 -translate-y-1/2"
							style={{ left: col * ARROW_GAP + 80 }}
						>
							<Triangle color={triangleColor} />
						</div>
					))}

					{/* actual content */}
					<motion.div
						className={`absolute will-change-transform top-0 left-0 h-full flex items-center gap-4 transition-colors duration-300 bg-linear-to-r to-transparent from-85% ${isActive ? "from-(--accent12)" : "from-white"}`}
						style={{ x: counterX }}
					>
						{/* required to cover rest of the left */}
						<div
							className={`absolute top-0 right-full h-full w-2499.75 ${isActive ? "bg-(--accent12)" : "bg-white"} transition-colors duration-300`}
						/>

						{/* track number at the beginning */}
						<div
							className="select-none pointer-events-none shrink-0 tabular-nums transition-colors duration-400"
							style={{
								fontSize: "clamp(1rem, 1.6vw, 1.4rem)",
								color: isActive ? track.accent : "#d4d4d4",
								minWidth: "2ch",
							}}
						>
							<p className={`font-black font-sans ${isActive ? "text-4xl" : "text-xl"} -translate-x-2 rotate-90 transition-[font-size] duration-350`}>{index + 1}</p>
						</div>

						<div
							className={`w-1 shrink-0 self-stretch ${isActive ? "my-4" : "my-2"} rounded-2xl transition-opacity duration-400`}
							style={{
								background: track.accent,
								opacity: isActive ? 1 : 0.3,
							}}
						/>

						{/* actual text content per lane */}
						<div className={`flex flex-col justify-center ${isActive ? "gap-1.5 py-3" : "gap-0.5 py-1.5"} h-full`}>
							<h3
								className="whitespace-nowrap font-sans font-black transition-colors duration-400"
								style={{
									fontSize: isActive ? "clamp(1.2rem, 2.2vw, 1.9rem)" : "clamp(0.65rem, 1.1vw, 0.85rem)",
									lineHeight: 1,
									letterSpacing: "-0.02em",
									color: isActive ? track.accent : "#d4d4d4",
								}}
							>
								{isPending ? (
									<span className="flex items-center gap-1.5">
										{[80, 120, 60, 100, 90].map((w, i) => (
											<span
												key={i}
												className="inline-block rounded-sm"
												style={{
													width: isActive ? w * 0.55 : w * 0.28,
													height: isActive ? "clamp(0.9rem, 1.6vw, 1.4rem)" : "clamp(0.5rem, 0.8vw, 0.65rem)",
													background: isActive ? "#d4d4d4" : "#e5e5e5",
												}}
											/>
										))}
									</span>
								) : track.name}
							</h3>

							<div style={{ height: isActive ? "auto" : 0, overflow: "hidden" }}>
								<motion.div
									className="font-mono text-[13px] leading-relaxed max-w-[min(400px,40vw)]"
									animate={{ opacity: isActive ? 1 : 0 }}
									transition={{ duration: 0.25 }}
									style={{ color: "#525252" }}
								>
									{isPending ? (
										<span className="tracking-[0.15em] text-neutral-400">DETAILS COMING SOON</span>
									) : "prizes" in track ? (
										<span className="flex flex-col gap-1 text-[13px] leading-snug">
											<span>
												<span className="font-bold" style={{ color: track.accent }}>
													{hasPrizePlacements ? "1ST: " : "PRIZE: "}
												</span>
												{track.prizes.first}
											</span>
											{hasPrizePlacements && (
												<span>
													<span className="font-bold" style={{ color: track.accent }}>2ND &amp; 3RD: </span>
													{track.prizes.runnersUp}
												</span>
											)}
										</span>
									) : (
										<><span className="font-bold" style={{ color: track.accent }}>PRIZE: </span>{"description" in track ? track.description : null}</>
									)}
								</motion.div>
							</div>
						</div>

						<motion.span
							animate={{ opacity: isActive ? 1 : 0, x: isActive ? 0 : 8 }}
							transition={{ duration: 0.3 }}
							className="md:ml-4 shrink-0 font-mono text-[9px] tracking-[0.35em] uppercase px-2.5 py-1 border"
							style={{
								color: isPending ? "#a3a3a3" : "var(--accent)",
								background: isPending ? "#a3a3a310" : "var(--accent10)",
								borderColor: isPending ? "#a3a3a3" : "var(--accent)",
							}}
						>
							{isPending ? "COMING SOON" : track.type}
						</motion.span>
					</motion.div>
				</div>
			</motion.div>
		);
	},
);
Lane.displayName = "Lane";

export default function Tracks() {
	const pinRef = useRef<HTMLDivElement>(null);
	const stickyRef = useRef<HTMLDivElement>(null);

	const [activeLane, setActiveLane] = useState(0);
	const [viewportW, setViewportW] = useState(1200);
	const [contentX, setContentX] = useState(120);

	useEffect(() => {
		const el = stickyRef.current;
		if (!el) return;
		const ro = new ResizeObserver(([e]) => {
			const w = e.contentRect.width;
			setViewportW(w);
			setContentX(w < 768 ? 16 : 120);
		});
		ro.observe(el);
		return () => ro.disconnect();
	}, []);

	const { scrollYProgress } = useScroll({ target: pinRef, offset: ["start start", "end end"] });

	const totalTravel = (kTrackInfo.length - 0.5) * viewportW * 0.55;
	const x = useTransform(scrollYProgress, [0, 1], ["0px", `-${totalTravel}px`]);

	useMotionValueEvent(scrollYProgress, "change", (v) => {
		setActiveLane(Math.min(kTrackInfo.length - 1, Math.floor(v * (kTrackInfo.length + 0.2))));
	});

	const progressW = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
	const activeTrack = kTrackInfo[activeLane];
	const activeLabel = String(activeLane + 1).padStart(2, "0");
	const totalLabel = String(kTrackInfo.length).padStart(2, "0");

	return (
		<div data-hide-navbar className="relative">
			<SectionWrapper title="Tracks" caption="What can I do?" val="0x3">
				<div ref={pinRef} className="relative -mx-5 md:-mx-20" style={{ height: `${SCROLL_MULT * 100}vh` }}>
					<div ref={stickyRef} className="sticky top-0 h-screen w-full overflow-hidden flex flex-col">
						<div className="relative flex-1 overflow-hidden">
							<motion.div
								className="absolute top-1/2 left-0 will-change-transform flex flex-col"
								style={{
									x,
									width: totalTravel + viewportW,
									height: STRIP_H,
									marginTop: -(STRIP_H / 2),
								}}
							>
								{kTrackInfo.map((track, i) => (
									<Lane
										key={track.lane}
										track={track}
										index={i}
										activeLane={activeLane}
										scrollX={x}
										contentX={contentX}
									/>
								))}
							</motion.div>

							{/* vignettes */}
							<div className="absolute inset-y-0 left-0 w-20 pointer-events-none z-10 bg-linear-to-r from-white to-transparent" />
							<div className="absolute inset-y-0 right-0 w-32 pointer-events-none z-10 bg-linear-to-l from-white to-transparent" />

							{/* counter */}
							<div className="absolute top-4 right-5 z-20 font-mono text-[10px] tracking-ultrawide text-neutral-300 uppercase select-none">
								{activeLabel} / {totalLabel}
							</div>
						</div>

						{/* progress bar */}
						<div className="h-px w-full relative overflow-hidden bg-neutral-200">
							<motion.div
								className="absolute inset-y-0 left-0 transition-[background] duration-400"
								style={{
									width: progressW,
									background: activeTrack?.accent ?? "#000",
								}}
							/>
						</div>

						{/* bottom hud */}
						<div className="h-10 flex items-center px-5 gap-3 overflow-hidden bg-white border-t border-neutral-100">
							<span className="hidden md:block font-mono text-[9px] tracking-ultrawide uppercase text-neutral-300 shrink-0">
								TRACKS
							</span>

							{/* mobile: show only active track name */}
							<motion.span
								key={activeTrack?.lane}
								className="md:hidden font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 shrink-0"
								initial={{ opacity: 0 }}
								animate={{ opacity: 1 }}
								style={{
									color: activeTrack?.accent,
									background: `${activeTrack?.accent}10`,
								}}
							>
								{"pending" in (activeTrack ?? {}) ? "???" : activeTrack?.name}
							</motion.span>

							{/* desktop: show all track name pills */}
							<div className="hidden md:flex gap-1.5 overflow-hidden">
								{kTrackInfo.map((t, i) => (
									<motion.span
										key={t.lane}
										className="font-mono text-[9px] tracking-[0.2em] uppercase px-2 py-0.5 shrink-0"
										animate={{
											color: i === activeLane ? t.accent : "#a3a3a3",
											background: i === activeLane ? `${t.accent}10` : "#ffffff00",
										}}
										transition={{ duration: 0.25 }}
									>
										{"pending" in t && t.pending ? "???" : t.name}
									</motion.span>
								))}
							</div>

							<motion.div
								className="ml-auto flex items-center gap-2 shrink-0"
								animate={{ opacity: activeLane > 0 ? 0 : 0.6 }}
							>
								<span className="font-mono text-[9px] tracking-[0.3em] uppercase text-neutral-400">
									scroll
								</span>
								<motion.div
									className="w-4 h-px origin-left bg-neutral-300"
									animate={{ scaleX: [1, 0.3, 1] }}
									transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
								/>
							</motion.div>
						</div>
					</div>
				</div>
			</SectionWrapper>
		</div>
	);
}
