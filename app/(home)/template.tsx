"use client";
import { motion } from "motion/react";

export default function HomeTemplate({ children }: { children: React.ReactNode }) {
	return (
		<div className="relative">
                <div>
				<motion.div
					initial={{ opacity: 1 }}
					animate={{ opacity: 0, display: 'none' }}
					exit={{ opacity: 1, display: 'block' }}
					transition={{
						duration: 1.75,
						ease: [0.36, 0, 0.33, 0.98],
					}}
					className="fixed pointer-events-none z-1000 bg-white h-screen w-screen"
				/>               
					{children}
				</div>
		</div>
	);
}
