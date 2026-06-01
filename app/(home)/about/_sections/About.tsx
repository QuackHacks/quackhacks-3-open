"use client";

import Image, { StaticImageData } from "next/image";
import { motion } from "motion/react";

import Image_Moment1 from "../../../../public/photos/moments-16.webp";
import Image_Moment2 from "../../../../public/photos/moments-02.webp";
import Image_Moment3 from "../../../../public/photos/moments-10.webp";

import { fadeUp, viewportOpts } from "../_utils/animations";
import SectionHeader from "../_components/SectionHeader";

/* ── grain overlay ─────────────────────────────────────────── */
const SimpleGrain = ({
	frequency = 0.75,
	opacity = 0.5,
	className,
}: {
	frequency?: number;
	opacity?: number;
	className?: string;
}) => {
	return (
		<div className={className}>
			<svg xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
				<filter id="n" x="0" y="0">
					<feTurbulence
						type="fractalNoise"
						baseFrequency={frequency}
						numOctaves="4"
						stitchTiles="stitch"
					/>
				</filter>
				<rect width="100%" height="100%" filter="url(#n)" opacity={opacity} />
			</svg>
		</div>
	);
};

/* ── image helpers ─────────────────────────────────────────── */
type CustomImageProps = {
	src: string | StaticImageData;
	alt: string;
	className?: string;
};

const ColorfulImage = ({ src, alt, className }: CustomImageProps) => {
	return (
		<motion.div
			className="relative grayscale overflow-hidden"
			whileInView={{ filter: "grayscale(0)" }}
			viewport={{ margin: "-30% 0px -30% 0px", once: false }}
		>
			<SimpleGrain frequency={2} opacity={0.3} className="absolute inset-0 pointer-events-none" />
			<Image src={src} alt={alt} className={className} />
		</motion.div>
	);
};

const GrainImage = ({ src, alt, className }: CustomImageProps) => {
	return (
		<>
			<SimpleGrain frequency={2} opacity={0.3} className="absolute inset-0 pointer-events-none" />
			<Image src={src} alt={alt} className={className} />
		</>
	);
};

/* ── About section ─────────────────────────────────────────── */
const About = () => {
	return (
		<section className="w-full px-4 md:px-8 py-12 md:py-12 overflow-hidden">
			<div className="max-w-7xl mx-auto">
				<SectionHeader heading="ABOUT" subtitle="Learn what Quackhacks is all about!"/>

				{/* ── Top image row ── */}
				<div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-12 mb-8 md:mb-12">
					<motion.div
						className="md:col-span-4 relative"
						initial={{ x: "-100%", opacity: 0 }}   // starts off-screen to the right
						animate={{ x: 0, opacity: 1 }}         // slides to its natural position
						transition={{ type: "spring", stiffness: 50, damping: 10 }}
					>
						<div className="relative">
							<div className="absolute -top-4 left-0 right-12 h-8 bg-brand-500 z-10" />
							<GrainImage
								src={Image_Moment1}
								alt="hackathon participants"
								className="w-full h-auto object-cover"
							/>
						</div>
					</motion.div>

					<motion.div
						className="md:col-span-4 flex flex-col justify-center"
						variants={fadeUp}
						initial="hidden"
						whileInView="visible"
						viewport={viewportOpts}
						custom={0.15}
					>
						<h1 className="text-center font-bold font-liebling text-black text-[3rem] ">
							Code. Create. Collaborate.
						</h1>
					</motion.div>

					<motion.div
						className="md:col-span-4 relative"
						initial={{ x: "100%", opacity: 0 }}   // starts off-screen to the right
						animate={{ x: 0, opacity: 1 }}         // slides to its natural position
						transition={{ type: "spring", stiffness: 50, damping: 10 }}
					>
						<div className="relative">
							<div className="absolute -top-4 right-0 left-12 h-8 bg-brand-500 z-10" />
							<GrainImage
								src={Image_Moment2}
								alt="hackathon workspace"
								className="w-full h-auto object-cover"
							/>
						</div>
					</motion.div>
				</div>

				{/* ── Center paragraph ── */}
				<motion.div
					className="max-w-3xl mx-auto mb-8 md:mb-12"
					variants={fadeUp}
					initial="hidden"
					whileInView="visible"
					viewport={viewportOpts}
					custom={0}	
				>
					<p className="text-sm md:text-xl text-center tracking-normal leading-normal font-liebling">
						<b>QuackHacks</b> is a student-run hackathon hosted at the University of Oregon, where students come together to learn and collaborate on technical projects. Open to all majors and experience levels, participants spend a weekend turning ideas into real projects while exploring new technologies, attending workshops, and connecting with other innovators. 
						Whether you are coding your first project or your tenth, <b>QuackHacks</b> is a place to experiment, grow your skills, and create something you can add to your portfolio while enjoying free food, merch, and a community passionate about building.
					</p>
				</motion.div>

				{/* ── Bottom content row ── */}
				<div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-0">
					<motion.div
						className="md:col-span-3 flex flex-col justify-start pr-0 md:pr-15"
						variants={fadeUp}
						initial="hidden"
						whileInView="visible"
						viewport={viewportOpts}
						custom={0}
					>
						<div className="flex gap-2 mb-4">
							<div className="w-6 h-6 rounded-full bg-brand-500" />
							<div className="w-6 h-6 rounded-full border-2 border-brand-500" />
						</div>
						
						<h1 className="flex items-center font-bold text-4xl md:text-5xl font-liebling text-black/70 gap-x-5">
						Testimonials
						</h1>
						<div className="flex flex-col gap-y-5 pt-3">
							{/* Test 1 */}
							<div className="flex flex-col gap-y-3 font-liebling">
								<div>
									<p className="text-[0.85rem] text-left leading-relaxed">
										QuackHacks gave me the chance to apply what I learned in class to build something real. By the end of the weekend, my team had a project we were proud to add to our portfolios.
									</p>
									<h1 className="pt-2 font-bold">
										─ Song Zhang 
									</h1>
								</div>
							</div>
							{/* Test 2 */}
							<div className="flex flex-col gap-y-5 font-liebling">
								<div>
									<p className="text-[0.85rem] text-left leading-relaxed">
										I walked in unsure what I could contribute, but the collaborative environment made it easy to learn and try new things. I left with new skills, new friends, and a strong sense of community.
									</p>
									<h1 className="pt-2 font-bold">
										─ Samuel Young
									</h1>
								</div>
							</div>
							{/* Test 3 */}
							<div className="flex flex-col gap-y-5 font-liebling">
								<div>
									<p className="text-[0.85rem] text-left leading-relaxed">
										As someone interested in entrepreneurship, I was nervous about my lack of coding skills. But my team combined business ideas with technical skills to build something meaningful which is something I never would have experienced in a normal class.
									</p>
									<h1 className="pt-2 font-bold">
										 ─ Margaret Obrien
									</h1>
								</div>
							</div>
						</div>

					</motion.div>

					<motion.div
						className="md:col-span-9 relative"
						variants={fadeUp}
						initial="hidden"
						whileInView="visible"
						viewport={viewportOpts}
						custom={0.2}
					>
						<div className="relative overflow-x-clip md:overflow-x-visible">
							<div className="absolute top-1/4 -left-4 md:-left-12 w-8 md:w-16 h-64 md:h-96 bg-brand-500 z-10" />
							<div className="absolute top-1/3 -right-4 md:-right-8 w-6 md:w-12 h-48 md:h-80 bg-brand-500 z-10 rotate-12" />
							<div className="absolute top-1/2 -right-8 md:-right-12 w-6 md:w-12 h-32 md:h-64 bg-brand-500 z-10 -rotate-6" />

							<div className="absolute top-4 left-4 flex gap-1 z-10">
								<div className="w-8 h-8 bg-neutral-400" />
								<div className="w-8 h-8 bg-neutral-300" />
							</div>
							<GrainImage
								src={Image_Moment3}
								alt="Hackathon photo 3"
								className="w-full h-auto object-cover"
							/>
						</div>
					</motion.div>
				</div>

				<motion.div
					className="w-full h-8 bg-brand-500 mt-8 md:mt-12"
					initial={{ scaleX: 0, originX: 0 }}
					whileInView={{ scaleX: 1 }}
					viewport={viewportOpts}
					transition={{ duration: 0.8, ease: [0.25, 0.1, 0.25, 1], delay: 0.1 }}
				/>
			</div>
		</section>
	);
};
export default About;
