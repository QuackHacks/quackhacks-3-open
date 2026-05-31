"use client";
import { motion, useAnimation, useInView } from "motion/react";
import { useEffect, useRef } from "react";

// used also on timeline page
export const TypingCaption = ({
	text,
	animateOnce = false,
}: {
	text: string;
    animateOnce?: boolean
}) => {
	return (
		<h4 className="ml-1 md:ml-3 text-base md:text-lg text-neutral-400 italic font-instrument-serif tracking-wider">
			{text.split("").map((char, i) => (
				<motion.span
					key={i}
					initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1}}
                    viewport={{ once: animateOnce }}
					transition={{
						duration: 0.05,
						delay: 0.3 + i * 0.03,
					}}
				>
					{char === " " ? "\u00A0" : char}
				</motion.span>
			))}
		</h4>
	);
};

interface SectionWrapperProps {
	children: React.ReactNode;
	title: string;
	caption: string;
	val: string;
	className?: string;
}

const SectionWrapper = ({ children, title, caption, val, className = "" }: SectionWrapperProps) => {
	const triggerRef = useRef(null);
	return (
		<section className={`w-full px-5 md:px-20 my-12 md:my-25 ${className}`}>
			{/* used to trigger opacity fade in */}
			<div ref={triggerRef} />
			<motion.div
				initial={{ opacity: 0 }}
				whileInView={{ opacity: 1 }}
				// make sure this matches the margin above
				viewport={{ once: true, margin: "0px 0px -30% 0px" }}
				transition={{ duration: 0.6, ease: "easeOut" }}
			>
				<div className="flex flex-col">
					<div className="relative w-fit overflow-hidden mb-1 ml-1">
						<motion.p className="text-white/90 font-sans font-bold tracking-wide bg-brand-500 w-fit px-1 text-md">
							[ {val} ]
						</motion.p>
					</div>
					<h1 className="font-bold text-5xl md:text-7xl text-neutral-900 uppercase tracking-tight">
						{title}
					</h1>
					<TypingCaption animateOnce={true} text={caption} />
				</div>
				<div className="px-2">{children}</div>
			</motion.div>
		</section>
	);
};

export default SectionWrapper;
