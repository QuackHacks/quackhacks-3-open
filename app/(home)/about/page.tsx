"use client";

import { motion } from "motion/react";
import Team from "./_sections/Team";
import About from "./_sections/About";
import PastEvents from "./_sections/PastEvents";

const easeOut: [number, number, number, number] = [0.25, 0.1, 0.25, 1];
const fadeUp = {
	hidden: { opacity: 0, y: 40 },
	visible: (delay: number = 0) => ({
		opacity: 1,
		y: 0,
		transition: { duration: 0.7, ease: easeOut, delay },
	}),
};
const viewportOpts = { once: true, margin: "-80px 0px" as const };

// this should be about us as an organization NOT about the event
export default function AboutPage() {
	return (
		<div className="flex flex-col w-full main-gradient-background">
			<About />
			<PastEvents />
			<Team />
		</div>
	);
}
