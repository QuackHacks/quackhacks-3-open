import { motion } from "motion/react";

export default function YouTag() {
	return (
		<span className="text-[10px] px-2 py-0.5 bg-brand-500 text-white uppercase tracking-wider font-mono font-bold">
			{"YOU".split("").map((char, index) => (
				<motion.span
					key={index}
					className="inline-block"
					animate={{ translateY: [0, 1, 0] }}
					transition={{
						duration: 1,
						repeat: Infinity,
						repeatType: "loop",
						ease: "easeInOut",
						delay: index * 0.2,
					}}
				>
					{char}
				</motion.span>
			))}
		</span>
	);
}
