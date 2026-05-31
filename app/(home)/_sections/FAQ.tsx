"use client";

import { useState, memo, useCallback } from "react";
import { motion, AnimatePresence } from "motion/react";
import SectionWrapper from "../_components/SectionWrapper";

const FAQItem = memo(
	({
		item,
		isOpen,
		onToggle,
		index,
	}: {
		item: { question: string; answer: string };
		isOpen: boolean;
		onToggle: (index: number) => void;
		index: number;
	}) => (
		<div className="border-b border-neutral-400 last:border-b-0">
			<button
				onClick={() => onToggle(index)}
				className={`w-full cursor-pointer px-4 md:px-6 py-6 flex items-center justify-between gap-4 text-left transition-colors duration-300 group
                    ${isOpen ? "bg-brand-500 hover:bg-brand-500" : "hover:bg-brand-500/10"}`}
				aria-expanded={isOpen}
			>
				<h3
					className={`text-lg md:text-2xl font-semibold transition-colors duration-200 overflow-hidden h-[1.4em]
                    ${isOpen ? "text-white" : "text-neutral-600 group-hover:text-brand-900"}`}
				>
					<span className="flex flex-col group-hover:-translate-y-1/2 transition-transform duration-300 ease-in-out">
						<span className="block leading-[1.4]">{item.question}</span>
						<span className="block leading-[1.4]">{item.question}</span>
					</span>
				</h3>

				{/* chevron icon and its animation */}
				<motion.div
					animate={{ rotate: isOpen ? 180 : 0 }}
					transition={{ duration: 0.3, ease: "easeInOut" }}
					className="shrink-0"
				>
					<svg
						className={`w-3 h-3 md:w-6 md:h-6 transition-colors duration-200 ${isOpen ? "text-white" : "text-neutral-900 group-hover:text-brand-900"}`}
						fill="none"
						viewBox="0 0 24 24"
						stroke="currentColor"
					>
						<path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
					</svg>
				</motion.div>
			</button>

			<AnimatePresence initial={false}>
				{isOpen && (
					<motion.div
						initial={{ height: 0, opacity: 0 }}
						animate={{ height: "auto", opacity: 1 }}
						exit={{ height: 0, opacity: 0 }}
						transition={{ duration: 0.3, ease: "easeInOut" }}
						className="overflow-hidden"
					>
						<div className="px-6 pb-6 pt-4">
							<p className="text-base md:text-lg text-neutral-700 leading-relaxed">{item.answer}</p>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	),
);
FAQItem.displayName = "FAQItem";
const kQuestions = [
	{
		question: "What is a hackathon?",
		answer:
			"A hackathon is an event where students, developers, and creators come together to build innovative projects over a short period of time. It's a great opportunity to learn new skills, meet amazing people, and bring your ideas to life!",
	},
	{
		question: "Who can participate?",
		answer:
			"All university students are welcome! Whether you're a beginner or an experienced developer, we encourage everyone to join. No coding experience? No problem, we'll have workshops and mentors to help you get started.",
	},
	{
		question: "How much does it cost?",
		answer:
			"Participation is completely free! We'll provide meals, snacks, swag, and all the resources you need to build your project. Just bring your laptop and enthusiasm!",
	},
	{
		question: "What should I bring?",
		answer:
			"Bring your laptop, chargers, and any hardware you want to use for your project. We recommend bringing a water bottle, toiletries, and a sleeping bag if you plan to stay overnight. Everything else will be provided!",
	},
	{
		question: "Do I need a team?",
		answer:
			"You could participate solo or in a team of up to 4 people. Team formation happened before the event in the live dashboard.",
	},
	{
		question: "What can I build?",
		answer:
			"Anything! Whether it's a web app, mobile app, hardware project, game, or something completely unique, if you can imagine it, you can build it. We'll have various tracks that also might guide your projects direction for specific prizes.",
	},
    	{
		question: "How are prizes distrubted?",
		answer:
			"You can only win up to one QH track and one MLH track. You can also only recieve one prize per win, i.e. a solo hacker can only claim one prize, not all four for themselves, similarly a team of three will only recieve three prizes.",
	},
	{
		question: "Will there be mentors?",
		answer:
			"Yes! We'll have experienced mentors from tech companies and the industry available throughout the event to help you with technical challenges, brainstorming, and guidance.",
	},
	{
		question: "Will there be travel reimbursments?",
		answer:
			"Unfortunatley we will not be providing travel reimbursments of any kind at this time.",
	},
];
const FAQSection = () => {
	const [openIndex, setOpenIndex] = useState<number | null>(null);
	const handleToggle = useCallback((index: number) => {
		setOpenIndex((prev) => (prev === index ? null : index));
	}, []);
	return (
		<SectionWrapper title="FAQ" caption="What about....?" val="0x4">
			<div className="flex mt-5 flex-col bg-neutral-100 border border-neutral-400 max-w-4xl mx-2 md:mx-auto">
				{kQuestions.map((item, i) => (
					<FAQItem key={i} index={i} item={item} isOpen={openIndex === i} onToggle={handleToggle} />
				))}
			</div>
		</SectionWrapper>
	);
};

export default FAQSection;
