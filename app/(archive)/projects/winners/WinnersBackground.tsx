"use client";

import { motion } from "motion/react";

/**
 * Ambient, theme-matched backdrop for the winners page: drifting green + gold
 * light blobs, a faint grid, and slowly rotating geometric confetti. Decorative
 * only — hidden on small screens to keep paint cost low.
 */
export function WinnersBackground() {
	return (
		<div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
			{/* Drifting colour blobs */}
			<motion.div
				className="hidden md:block absolute -top-40 -left-32 h-[520px] w-[520px] rounded-full bg-linear-to-br from-amber-300/25 via-yellow-400/10 to-transparent blur-3xl"
				animate={{ x: [0, 40, -10, 0], y: [0, -25, 30, 0], scale: [1, 1.1, 0.95, 1] }}
				transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="hidden md:block absolute top-1/4 -right-36 h-[440px] w-[440px] rounded-full bg-linear-to-bl from-brand-400/25 via-lime-400/10 to-transparent blur-3xl"
				animate={{ x: [0, -30, 15, 0], y: [0, 25, -20, 0], scale: [1, 0.92, 1.1, 1] }}
				transition={{ duration: 24, repeat: Infinity, ease: "easeInOut", delay: 3 }}
			/>
			<motion.div
				className="hidden md:block absolute -bottom-24 left-1/3 h-[380px] w-[380px] rounded-full bg-linear-to-tr from-amber-200/20 via-brand-300/10 to-transparent blur-3xl"
				animate={{ x: [0, 25, -30, 0], y: [0, -30, 12, 0], scale: [1, 1.06, 0.97, 1] }}
				transition={{ duration: 27, repeat: Infinity, ease: "easeInOut", delay: 6 }}
			/>

			{/* Static radial wash + faint grid */}
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_12%,rgba(251,191,36,0.10),transparent_45%),radial-gradient(circle_at_72%_78%,rgba(52,124,69,0.09),transparent_42%)]" />
			<div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(rgba(0,0,0,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.5)_1px,transparent_1px)] bg-size-[44px_44px]" />

			{/* Rotating diamond */}
			<motion.div
				className="hidden md:block absolute top-24 right-10 w-40 h-40 opacity-[0.07]"
				animate={{ rotate: [0, 90, 90, 0] }}
				transition={{ duration: 22, repeat: Infinity, ease: "linear" }}
			>
				<div className="w-full h-full bg-amber-500 rotate-45" />
			</motion.div>

			{/* Pulsing ring */}
			<motion.div
				className="hidden md:block absolute top-36 left-12 w-24 h-24 opacity-[0.07]"
				animate={{ scale: [1, 1.22, 1] }}
				transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
			>
				<div className="w-full h-full rounded-full border-4 border-brand-500" />
			</motion.div>

			{/* Spinning hexagon */}
			<motion.div
				className="hidden lg:block absolute top-[58%] right-8 w-20 h-20 opacity-[0.08]"
				animate={{ rotate: [0, 360] }}
				transition={{ duration: 32, repeat: Infinity, ease: "linear" }}
			>
				<div
					className="w-full h-full bg-amber-500"
					style={{ clipPath: "polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)" }}
				/>
			</motion.div>

			{/* Floating triangle */}
			<motion.div
				className="hidden md:block absolute bottom-40 right-20 w-24 h-24 opacity-[0.06]"
				animate={{ y: [0, -12, 0] }}
				transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
			>
				<div className="w-full h-full bg-brand-500" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
			</motion.div>

			{/* Twinkling confetti diamonds */}
			{[
				{ top: "16%", left: "26%", size: 7, hue: "bg-amber-500" },
				{ top: "72%", left: "16%", size: 9, hue: "bg-brand-500" },
				{ top: "82%", right: "24%", size: 6, hue: "bg-amber-500" },
				{ top: "30%", right: "30%", size: 6, hue: "bg-brand-500" },
				{ top: "48%", left: "8%", size: 5, hue: "bg-amber-400" },
			].map((p, i) => (
				<motion.div
					key={i}
					className={`hidden md:block absolute ${p.hue} opacity-[0.10] rotate-45`}
					style={{ top: p.top, left: p.left, right: p.right, width: p.size * 4, height: p.size * 4 }}
					animate={{ rotate: [45, 135, 45], opacity: [0.06, 0.14, 0.06] }}
					transition={{ duration: 9 + i * 2, repeat: Infinity, ease: "easeInOut", delay: i * 0.4 }}
				/>
			))}
		</div>
	);
}
