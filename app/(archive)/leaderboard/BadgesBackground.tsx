"use client";

import { motion } from "motion/react";

export function BadgesBackground() {
	return (
		<div aria-hidden className="pointer-events-none fixed inset-0 overflow-hidden">
			<motion.div
				className="hidden md:block absolute -top-40 -left-40 h-[500px] w-[500px] rounded-full bg-linear-to-br from-lime-300/20 via-green-400/10 to-transparent blur-3xl"
				animate={{ x: [0, 30, -10, 0], y: [0, -20, 30, 0], scale: [1, 1.08, 0.96, 1] }}
				transition={{ duration: 18, repeat: Infinity, ease: "easeInOut" }}
			/>
			<motion.div
				className="hidden md:block absolute top-1/3 -right-32 h-[400px] w-[400px] rounded-full bg-linear-to-bl from-amber-300/20 via-yellow-400/10 to-transparent blur-3xl"
				animate={{ x: [0, -25, 15, 0], y: [0, 25, -15, 0], scale: [1, 0.93, 1.1, 1] }}
				transition={{ duration: 22, repeat: Infinity, ease: "easeInOut", delay: 3 }}
			/>
			<motion.div
				className="hidden md:block absolute -bottom-20 left-1/3 h-[350px] w-[350px] rounded-full bg-linear-to-tr from-lime-200/15 via-green-300/10 to-transparent blur-3xl"
				animate={{ x: [0, 20, -30, 0], y: [0, -30, 10, 0], scale: [1, 1.05, 0.98, 1] }}
				transition={{ duration: 25, repeat: Infinity, ease: "easeInOut", delay: 7 }}
			/>
			<div className="absolute inset-0 bg-[radial-gradient(circle_at_25%_15%,rgba(163,230,53,0.08),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(251,191,36,0.08),transparent_40%)]" />
			<div className="absolute inset-0 opacity-[0.025] bg-[linear-gradient(rgba(0,0,0,0.5)_1px,transparent_1px),linear-gradient(90deg,rgba(0,0,0,0.5)_1px,transparent_1px)] bg-size-[40px_40px]" />

			<motion.div
				className="hidden md:block absolute top-20 right-8 w-40 h-40 opacity-[0.08]"
				animate={{ rotate: [0, 90, 90, 0] }}
				transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
			>
				<div className="w-full h-full bg-brand-500 rotate-45" />
			</motion.div>

			<motion.div
				className="hidden md:block absolute top-48 right-32 w-16 h-16 opacity-[0.12]"
				animate={{ rotate: [45, -45, 45] }}
				transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
			>
				<div className="w-full h-full border-3 border-brand-500" />
			</motion.div>

			<motion.div
				className="hidden md:block absolute top-32 left-12 w-24 h-24 opacity-[0.06]"
				animate={{ scale: [1, 1.2, 1] }}
				transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
			>
				<div className="w-full h-full rounded-full border-4 border-brand-500" />
			</motion.div>

			<div className="hidden md:block absolute top-1/4 left-0 w-2 h-64 bg-brand-500 opacity-[0.15]" />

			<div className="hidden md:block absolute top-1/3 left-6">
				<div className="flex flex-col gap-3">
					{[...Array(5)].map((_, index) => (
						<motion.div
							key={index}
							className="w-2 h-2 bg-brand-500 opacity-20"
							animate={{ opacity: [0.1, 0.3, 0.1] }}
							transition={{ duration: 2, repeat: Infinity, delay: index * 0.3 }}
						/>
					))}
				</div>
			</div>

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

			<div className="hidden md:block absolute bottom-60 left-0">
				<div className="relative">
					<div className="w-32 h-32 border-2 border-brand-500 rounded-full opacity-[0.06]" />
					<div className="absolute top-4 left-4 w-24 h-24 border-2 border-brand-400 rounded-full opacity-[0.08]" />
					<div className="absolute top-8 left-8 w-16 h-16 bg-brand-500 rounded-full opacity-[0.04]" />
				</div>
			</div>

			<motion.div
				className="hidden md:block absolute bottom-40 right-16 w-24 h-24 opacity-[0.07]"
				animate={{ y: [0, -10, 0] }}
				transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
			>
				<div className="w-full h-full bg-brand-500" style={{ clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)" }} />
			</motion.div>

			<div className="hidden lg:block absolute top-[40%] right-20">
				<div className="flex flex-col gap-6">
					{[12, 8, 6].map((size, index) => (
						<motion.div
							key={index}
							className="bg-brand-500 opacity-[0.1]"
							style={{ width: size * 4, height: size * 4, transform: "rotate(45deg)" }}
							animate={{ x: [0, 10, 0], opacity: [0.1, 0.15, 0.1] }}
							transition={{ duration: 4 + index, repeat: Infinity, delay: index * 0.5 }}
						/>
					))}
				</div>
			</div>

			<div className="hidden md:block absolute top-[50%] left-4 opacity-[0.08]">
				<div className="relative w-12 h-12">
					<div className="absolute inset-y-0 left-1/2 w-2 -translate-x-1/2 bg-brand-500" />
					<div className="absolute inset-x-0 top-1/2 h-2 -translate-y-1/2 bg-brand-500" />
				</div>
			</div>

			{[
				{ top: "15%", right: "25%", size: 8 },
				{ top: "75%", right: "10%", size: 6 },
				{ top: "85%", left: "20%", size: 10 },
				{ top: "25%", left: "30%", size: 6 },
			].map((position, index) => (
				<motion.div
					key={index}
					className="hidden md:block absolute bg-brand-500 opacity-[0.06] rotate-45"
					style={{
						top: position.top,
						right: position.right,
						left: position.left,
						width: position.size * 4,
						height: position.size * 4,
					}}
					animate={{ rotate: [45, 135, 45] }}
					transition={{ duration: 10 + index * 2, repeat: Infinity, ease: "easeInOut" }}
				/>
			))}
		</div>
	);
}
