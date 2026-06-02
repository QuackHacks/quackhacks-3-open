"use client";

import Image, { StaticImageData } from "next/image";
import { motion } from "motion/react";
import { useId, useMemo, useState } from "react";

// every team member photo imported as StaticImageData
import Image_DeafaultAvatar from "../../../../public/default-avatar.jpg";

// Tech
import anthony from "@team/anthony.webp";
import anthonyCasual from "@team/anthonyCasual.webp";
import danielCorzo from "@team/danielC.webp";
import danielCCasual from "@team/danielCCasual2.webp";
import aaronR from "@team/aaronR.webp";
import aaronRCasual from "@team/aaronCausal.webp";
import aziz from "@team/aziz.webp";
import azizCasual from "@team/azizCasual.webp";
import danielA from "@team/danielA.webp";
import danielACasual from "@team/danielACasual.webp";
import eleanor from "@team/eleanor.webp";
import eleanorCasual from "@team/eleanorCasual.webp";
import hai from "@team/hai.webp";
import hayden from "@team/hayden.webp";
import haydenCasual from "@team/haydenCasual.webp";
import nigel from "@team/nigel.webp";
import nigelCasual from "@team/nigelCasual.webp";
import oliver from "@team/oliver.webp";
import oliverCasual from "@team/oliverCasual.webp";

// Marketing
import jaya from "@team/jaya.webp";
import jayaCasual from "@team/jayaCasual.webp";
import aaronB from "@team/aaronB.webp";
import aaronBCasual from "@team/aaronBCasual.webp";
import ashnaCasual from "@team/ashnaCasual.webp";
import charlotte from "@team/charlotte.webp";
import charlotteCasual from "@team/charlotteCasual.webp";
import neyda from "@team/neyda.webp";
import neydaCasual from "@team/neydaCasual.webp";
import ava from "@team/ava.webp";
import avaCasual from "@team/avaCasual.webp";
import karen from "@team/karen.webp";
import karenCasual from "@team/karenCasual.webp";
import morgan from "@team/morgan.webp";
import morganCasual from "@team/morganCasual.webp";

// Design
import jack from "@team/jack.webp";
import jackCasual from "@team/jackCasual.webp";
import cora from "@team/cora.webp";
import coraCasual from "@team/coraCasual.webp";
import kylie from "@team/kylie.webp";
import kylieCasual from "@team/kylieCasual.webp";
import charlie from "@team/charlie.webp";
import charlieCasual from "@team/charlieCasual.webp";

// Operations
import gregM from "@team/gregM.webp";
import gregMCasual from "@team/greg_casual.webp";
import katarina from "@team/katrina.webp";
import katarinaCasual from "@team/katrinaCasual.webp";
import noahM from "@team/noahM.webp";
import noahMCasual from "@team/noahMCasual.webp";
import john from "@team/john.webp";
import johnCasual from "@team/johnCasual.webp";
import lucas from "@team/lucas.webp";
import lucasCasual from "@team/lucasCasual.webp";
import trevor from "@team/trevor.webp";
import trevorCasual from "@team/trevorCasual.webp";

// Finance
import joaquin from "@team/joaquin.webp";
import joaquinCasual from "@team/joaquinCasual.webp";
import lisa from "@team/lisa.webp";
import lisaCasual from "@team/lisaCasual.webp";
import xander from "@team/xander.webp";
import xanderCasual from "@team/xanderCasual.webp";
import matthew from "@team/matthew.webp";
import matthewCasual from "@team/matthewCasual.webp";
import jesus from "@team/jesus.webp";
import jesusCasual from "@team/jesusCasual.webp";
import yazlin from "@team/yazlin.webp";
import yazlinCasual from "@team/yazlinCasual.webp";

import SectionHeader from "../_components/SectionHeader";

const kDepartments = ["marketing", "design", "tech", "operations", "finance"] as const;
type Department = (typeof kDepartments)[number];
type ActiveFilter = Department | "all" | "executive";

type TeamMember = {
	name: string;
	role: string;
	image: StaticImageData | string;
	hoverImage?: StaticImageData | string;
	department?: Department;
	executive?: boolean;
	quote?: string;
};

// base size in px
const kIconSize = 20;

interface IconProps {
	department: string;
	className?: string;
	isExec?: boolean;
}

export function DepartmentIcon({ department, className, isExec = false }: IconProps) {
	const baseId = useId();
	const clipId = `dept-clip-${baseId}`;
	const gradId = `exec-grad-${baseId}`;

	const shape = useMemo(() => {
		const shapes: Record<string, React.ReactNode> = {
			marketing: <path d="M12 2L22 20H2L12 2Z" />,
			design: <rect width="16" height="16" x="4" y="4" />,
			tech: <rect width="18" height="18" x="3" y="3" />,
			operations: <circle cx="12" cy="12" r="10" />,
			finance: <path d="M8 2V8H2V16H8V22H16V16H22V8H16V2H8Z" />,
		};
		return shapes[department] || null;
	}, [department]);

	if (!shape) return null;

	return (
		<svg
			width={kIconSize + 8}
			height={kIconSize + 8}
			viewBox="0 0 24 24"
			className={`${className || ""} ${department === "design" ? "rotate-45" : ""}`}
		>
			<defs>
				<clipPath id={clipId}>{shape}</clipPath>

				{isExec && (
					<linearGradient id={gradId} x1="0%" y1="0%" x2="100%" y2="100%">
						<stop offset="0%" stopColor="white" stopOpacity="0" />
						<stop offset="44%" stopColor="white" stopOpacity="0" />
						<stop offset="45%" stopColor="#FFD700" stopOpacity="0.7" />
						<stop offset="55%" stopColor="#FFD700" stopOpacity="0.7" />
						<stop offset="56%" stopColor="white" stopOpacity="0" />
						<stop offset="100%" stopColor="white" stopOpacity="0" />
					</linearGradient>
				)}
			</defs>

			{/* base icon */}
			<g fill="currentColor">{shape}</g>

			{isExec && (
				<g clipPath={`url(#${clipId})`}>
					<rect width="60" height="60" x="-20" y="-20" fill={`url(#${gradId})`}>
						<animateTransform
							attributeName="transform"
							type="translate"
							values="-60 -60; 60 60"
							dur="3s"
							repeatCount="indefinite"
						/>
					</rect>
				</g>
			)}
		</svg>
	);
}

const DirectorIcon = () => {
	const filterId = `exec-hue-${useId()}`;
	return (
		<svg
			xmlns="http://www.w3.org/2000/svg"
			width={kIconSize + 8}
			height={kIconSize + 8}
			className="fill-yellow-300"
			viewBox="0 0 640 640"
			style={{ filter: `url(#${filterId})` }}
		>
			<defs>
				<filter id={filterId} colorInterpolationFilters="sRGB">
					<feColorMatrix type="hueRotate" values="0">
						<animate attributeName="values" from="0" to="360" dur="8s" repeatCount="indefinite" />
					</feColorMatrix>
				</filter>
			</defs>
			<path d="M271.2 56C265.1 49.8 256.2 47.3 247.8 49.6C239.4 51.9 232.9 58.4 230.8 66.8L215.5 127C214.4 131.4 209.9 134 205.6 132.7L145.8 115.9C137.4 113.5 128.4 115.9 122.3 122C116.2 128.1 113.8 137.1 116.2 145.5L133.1 205.3C134.3 209.6 131.7 214.1 127.4 215.2L67.1 230.5C58.7 232.6 52.1 239.2 49.8 247.6C47.5 256 50 264.9 56.2 271L100.7 314.3C103.9 317.4 103.9 322.6 100.7 325.8L56.3 369.1C50.1 375.2 47.6 384.1 49.9 392.5C52.2 400.9 58.8 407.4 67.2 409.6L127.4 424.9C131.8 426 134.4 430.5 133.1 434.8L116.2 494.5C113.8 502.9 116.2 511.9 122.3 518C128.4 524.1 137.4 526.5 145.8 524.1L205.6 507.2C209.9 506 214.4 508.6 215.5 512.9L230.8 573.1C232.9 581.5 239.5 588.1 247.9 590.4C256.3 592.7 265.2 590.2 271.3 584L314.6 539.5C317.7 536.3 322.9 536.3 326.1 539.5L369.3 584C375.4 590.2 384.3 592.7 392.7 590.4C401.1 588.1 407.6 581.5 409.8 573.1L425.1 513C426.2 508.6 430.7 506 435 507.3L494.8 524.2C503.2 526.6 512.2 524.2 518.3 518.1C524.4 512 526.8 503 524.4 494.6L507.5 434.8C506.3 430.5 508.9 426 513.2 424.9L573.4 409.6C581.8 407.5 588.4 400.9 590.7 392.5C593 384.1 590.5 375.1 584.3 369.1L539.8 325.8C536.6 322.7 536.6 317.5 539.8 314.3L584.3 271C590.5 264.9 593 256 590.7 247.6C588.4 239.2 581.8 232.7 573.4 230.5L513.2 215.2C508.8 214.1 506.2 209.6 507.5 205.3L524.4 145.5C526.8 137.1 524.4 128.1 518.3 122C512.2 115.9 503.2 113.5 494.8 115.9L435 132.8C430.7 134 426.2 131.4 425.1 127.1L409.8 66.8C407.7 58.4 401.1 51.8 392.7 49.5C384.3 47.2 375.4 49.7 369.3 55.9L326 100.5C322.9 103.7 317.7 103.7 314.5 100.5L271.2 56z" />
		</svg>
	);
};
const ExecutiveIcon = () => (
	<svg
		xmlns="http://www.w3.org/2000/svg"
		width={kIconSize + 8}
		height={kIconSize + 8}
		className="fill-yellow-300"
		viewBox="0 0 640 640"
	>
		<path d="M271.2 56C265.1 49.8 256.2 47.3 247.8 49.6C239.4 51.9 232.9 58.4 230.8 66.8L215.5 127C214.4 131.4 209.9 134 205.6 132.7L145.8 115.9C137.4 113.5 128.4 115.9 122.3 122C116.2 128.1 113.8 137.1 116.2 145.5L133.1 205.3C134.3 209.6 131.7 214.1 127.4 215.2L67.1 230.5C58.7 232.6 52.1 239.2 49.8 247.6C47.5 256 50 264.9 56.2 271L100.7 314.3C103.9 317.4 103.9 322.6 100.7 325.8L56.3 369.1C50.1 375.2 47.6 384.1 49.9 392.5C52.2 400.9 58.8 407.4 67.2 409.6L127.4 424.9C131.8 426 134.4 430.5 133.1 434.8L116.2 494.5C113.8 502.9 116.2 511.9 122.3 518C128.4 524.1 137.4 526.5 145.8 524.1L205.6 507.2C209.9 506 214.4 508.6 215.5 512.9L230.8 573.1C232.9 581.5 239.5 588.1 247.9 590.4C256.3 592.7 265.2 590.2 271.3 584L314.6 539.5C317.7 536.3 322.9 536.3 326.1 539.5L369.3 584C375.4 590.2 384.3 592.7 392.7 590.4C401.1 588.1 407.6 581.5 409.8 573.1L425.1 513C426.2 508.6 430.7 506 435 507.3L494.8 524.2C503.2 526.6 512.2 524.2 518.3 518.1C524.4 512 526.8 503 524.4 494.6L507.5 434.8C506.3 430.5 508.9 426 513.2 424.9L573.4 409.6C581.8 407.5 588.4 400.9 590.7 392.5C593 384.1 590.5 375.1 584.3 369.1L539.8 325.8C536.6 322.7 536.6 317.5 539.8 314.3L584.3 271C590.5 264.9 593 256 590.7 247.6C588.4 239.2 581.8 232.7 573.4 230.5L513.2 215.2C508.8 214.1 506.2 209.6 507.5 205.3L524.4 145.5C526.8 137.1 524.4 128.1 518.3 122C512.2 115.9 503.2 113.5 494.8 115.9L435 132.8C430.7 134 426.2 131.4 425.1 127.1L409.8 66.8C407.7 58.4 401.1 51.8 392.7 49.5C384.3 47.2 375.4 49.7 369.3 55.9L326 100.5C322.9 103.7 317.7 103.7 314.5 100.5L271.2 56z" />
	</svg>
);

const kTextColors: Record<Department, string> = {
	marketing: "text-orange-500",
	design: "text-red-500",
	tech: "text-lime-500",
	operations: "text-blue-500",
	finance: "text-purple-500",
};
const kBaseColors: Record<Department, string> = {
	marketing: "var(--color-orange-500)",
	design: "var(--color-red-500)",
	tech: "var(--color-lime-500)",
	operations: "var(--color-blue-500)",
	finance: "var(--color-purple-500)",
};

function getIcon(isExec: boolean, department?: Department) {
	// mr director
	if (!department) {
		if (!isExec) return null;
		return <DirectorIcon />;
	}

	return <DepartmentIcon department={department} className={kTextColors[department]} isExec={isExec} />;
}

const kTeamMembers: TeamMember[] = [
	// Tech
	// prettier-ignore
	{ name: "Anthony Cano-Luna", role: "Director of QuackHacks", image: anthony, hoverImage: anthonyCasual, executive: true, quote: "Running in O(1) time" },
	// prettier-ignore
	{ name: "Daniel Corzo", role: "Director of Engineering", image: danielCorzo, hoverImage: danielCCasual, department: "tech", executive: true, quote: "was this worth it" },
	// prettier-ignore
	{ name: "Aaron Reyes Rodriguez", role: "Fullstack Engineer", image: aaronR, hoverImage: aaronRCasual, department: "tech", executive: false, quote: "'Amonos" },
	// prettier-ignore
	{ name: "Aziz Akturin", role: "Fullstack Engineer", image: aziz, hoverImage: azizCasual, department: "tech", executive: false, quote: "wingstop forever" },
	// prettier-ignore
	{ name: "Daniel Asiamah", role: "Frontend Engineer", image: danielA, hoverImage: danielACasual, department: "tech", executive: false, quote: "Not a director but everybody around keeps giving me props" },
	// prettier-ignore
	{ name: "Eleanor Stenberg", role: "Backend Engineer", image: eleanor, hoverImage: eleanorCasual, department: "tech", executive: false, quote: "dunk dunk dunk" },
	// prettier-ignore
	{ name: "Hai Le", role: "Frontend Engineer", image: hai, hoverImage: undefined, department: "tech", executive: false, quote: "A man cannot step into the same river twice, because it is not the same river, and he is not same man." },
	// prettier-ignore
	{ name: "Hayden Rivas", role: "Frontend Engineer", image: hayden, hoverImage: haydenCasual, department: "tech", executive: false, quote: "I was a 0.1x engineer, now i'm useless." },
	// prettier-ignore
	{ name: "Nigel Epperson", role: "Security Engineer", image: nigel, hoverImage: nigelCasual, department: "tech", executive: false, quote: "I hadn't turned 6 until I was 7" },
	// prettier-ignore
	{ name: "Oliver Boorstein", role: "Fullstack Engineer", image: oliver, hoverImage: oliverCasual, department: "tech", executive: false, quote: "Tuned in" },

	// Marketing
	// prettier-ignore
	{ name: "Jaya Muñoz", role: "Director of Marketing", image: jaya, hoverImage: jayaCasual, department: "marketing", executive: true, quote: "Sensational" },
	// prettier-ignore
	{ name: "Aaron Busi", role: "Marketing Team", image: aaronB, hoverImage: aaronBCasual, department: "marketing", executive: false, quote: "I'm only here for the free food lol" },
	// prettier-ignore
	{ name: "Ashna Rajbhandar", role: "Marketing Team", image: Image_DeafaultAvatar, hoverImage: ashnaCasual, department: "marketing", executive: false, quote: "2013 Jackson Elementary Read-a-thon Winner" },
	// prettier-ignore
	{ name: "Ava Trembath", role: "Marketing Team", image: ava, hoverImage: avaCasual, department: "marketing", executive: false, quote: "Being challenged in life gives you purpose - Emma Chamberlain" },
	// prettier-ignore
	{ name: "Charlotte Lowery-North", role: "Marketing Team", image: charlotte, hoverImage: charlotteCasual, department: "marketing", executive: false, quote: "Don't let your dreams be dreams - Jack Johnson" },
	// prettier-ignore
	{ name: "Karen Pelayo Fuentes", role: "Marketing Team", image: karen, hoverImage: karenCasual, department: "marketing", executive: false, quote: "scubaaaa🤿" },
	// prettier-ignore
	{ name: "Morgan Binder", role: "Marketing Team", image: morgan, hoverImage: morganCasual, department: "marketing", executive: false, quote: "you only fail when you stop trying - Chief Keef" },
	// prettier-ignore
	{ name: "Neyda Ramos", role: "Marketing Team", image: neyda, hoverImage: neydaCasual, department: "marketing", executive: false, quote: "If you are happy doing what you're doing, no one can tell you you're not successful" },

	// Design
	// prettier-ignore
	{ name: "Jack Baca", role: "Director of Design", image: jack, hoverImage: jackCasual, department: "design", executive: false, quote: "shredder of gnar in the pow" },
	// prettier-ignore
	{ name: "Charlie Donnell", role: "Design Team", image: charlie, hoverImage: charlieCasual, department: "design", executive: false, quote: "Don't forget to call your parents" },
	// prettier-ignore
	{ name: "Cora McClean", role: "Design Team", image: cora, hoverImage: coraCasual, department: "design", executive: false, quote: "I will succeed because I am insane" },
	// prettier-ignore
	{ name: "Kylie Kramer", role: "Design Team", image: kylie, hoverImage: kylieCasual, department: "design", executive: false, quote: "Hey I'm Kylie! I'm a Digital artist, designer, and video game nerd :)" },

	// Operations
	// prettier-ignore
	{ name: "Greg Morrison", role: "Director of Operations", image: gregM, hoverImage: gregMCasual, department: "operations", executive: true, quote: "Win the Day" },
	// prettier-ignore
	{ name: "John Heibel", role: "Operations Team", image: john, hoverImage: johnCasual, department: "operations", executive: false, quote: "Every day I wake up and try to be a Claude wrapper" },
	// prettier-ignore
	{ name: "Katrina Nguyen", role: "Operations Team", image: katarina, hoverImage: katarinaCasual, department: "operations", executive: false, quote: "67" },
	// prettier-ignore
	{ name: "Lucas Bixby", role: "Operations Team", image: lucas, hoverImage: lucasCasual, department: "operations", executive: false, quote: "We can see plenty there that needs to be done -Alan Turing" },
	// prettier-ignore
	{ name: "Matthew Ramirez", role: "Operations Team", image: matthew, hoverImage: matthewCasual, department: "operations", executive: false, quote: "MONEY>>>>" },
	// prettier-ignore
	{ name: "Noah Menachemson", role: "Operations Team", image: noahM, hoverImage: noahMCasual, department: "operations", executive: false, quote: "Fueled by BeGOAT" },
	// prettier-ignore
	{ name: "Trevor Robbins", role: "Operations Team", image: trevor, hoverImage: trevorCasual, department: "operations", executive: false, quote: "Hungry dogs run faster" },

	// Finance
	// prettier-ignore
	{ name: "Joaquin Esparza", role: "Director of Finance", image: joaquin, hoverImage: joaquinCasual, department: "finance", executive: true, quote: "You miss 100% of the shots you don't take" },
	// prettier-ignore
	{ name: "Jesus Salcedo", role: "Finance Team", image: jesus, hoverImage: jesusCasual, department: "finance", executive: false, quote: "Expect Nothing, Appreciate Everything" },
	// prettier-ignore
	{ name: "Lisa Hoang", role: "Finance Team", image: lisa, hoverImage: lisaCasual, department: "finance", executive: false, quote: "Don't let perfection get in the way of greatness" },
	// prettier-ignore
	{ name: "Xander Perez", role: "Finance Team", image: xander, hoverImage: xanderCasual, department: "finance", executive: false, quote: "Always great working with the team and so excited to see QuackHacks continue to grow!" },
	// prettier-ignore
	{ name: "Yazlin Camacho", role: "Finance Team", image: yazlin, hoverImage: yazlinCasual, department: "finance", executive: false, quote: "Aim to leave every person and place better than you found them!" },
];

const Team = () => {
	const [activeFilter, setActiveFilter] = useState<ActiveFilter>("all");

	const filteredTeamArray =
		activeFilter === "all"
			? kTeamMembers
			: activeFilter === "executive"
				? kTeamMembers.filter((member) => member.executive)
				: kTeamMembers.filter((member) => member.department === activeFilter);

	const filterButtonClass = (value: ActiveFilter) =>
		`px-3 py-1.5 md:px-5 md:py-2 cursor-pointer border border-gray-500 -ml-px -mt-px flex items-center gap-1.5 transition-colors duration-150 text-sm md:text-base whitespace-nowrap ${
			activeFilter === value ? "bg-black text-white" : "hover:bg-black hover:text-white"
		}`;

	return (
		<section className="w-full px-4 md:px-8 py-6 md:py-12 overflow-clip">
			<div className="max-w-7xl mx-auto">
				<SectionHeader badge="0x03" heading="TEAM" subtitle="Meet the Team behind QuackHacks!" gap="gap-6" />

					<div className="flex flex-wrap gap-2 pb-5">
						<button onClick={() => setActiveFilter("all")} className={filterButtonClass("all")}>
							All
						</button>
						<button onClick={() => setActiveFilter("executive")} className={filterButtonClass("executive")}>
							<ExecutiveIcon />
							<span>Executive</span>
						</button>
						{kDepartments.map((department) => (
							<button
								key={department}
								onClick={() => setActiveFilter(department)}
								className={filterButtonClass(department)}
							>
								{getIcon(false, department)}
								<span>{department.charAt(0).toUpperCase() + department.slice(1)}</span>
							</button>
						))}
					</div>

				<div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 md:gap-8">
					{filteredTeamArray.map((member, i) => (
						<MemberCard member={member} key={i} index={i} />
					))}
				</div>
			</div>
		</section>
	);
};

const frontClipPath = "polygon(10% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%, 0% 10%)";
const frontClipPathHover = "polygon(10% 0%, 100% 0%, 100% 90%, 90% 100%, 0% 100%, 0% 10%)";
const backClipPath = "polygon(0% 0%, 90% 0%, 100% 10%, 100% 100%, 10% 100%, 0% 90%)";

const MemberCard = ({ member, index }: { member: TeamMember; index: number }) => (
	<motion.div
		className="flex flex-col items-center group pointer-events-none overflow-visible"
		style={
			{
				"--department-color": member.department ? kBaseColors[member.department] : "white",
			} as React.CSSProperties
		}
		initial="initial"
		whileInView="visible"
		viewport={{ once: true, margin: "-40px 0px" }}
		variants={{
			initial: { opacity: 0, y: 30 },
			visible: {
				opacity: 1,
				y: 0,
				transition: {
					duration: 0.5,
					delay: (index % 8) * 0.06,
					ease: [0.25, 0.1, 0.25, 1],
				},
			},
		}}
	>
		{/* card image, triggers hover */}
		<motion.div
			className="relative w-full aspect-4/5 mb-2 pointer-events-auto group overflow-visible"
			whileHover="hover"
			variants={{
				initial: { scale: 1 },
				hover: { scale: 1.05 },
			}}
			transition={{ duration: 0.3, ease: "backOut" }}
		>
			{/* this is the div that spills out */}
			<div className="bg-black opacity-0 group-hover:opacity-100 ease-in transition-all pointer-events-none absolute w-full h-full member-hover-outline" />
			<div
				style={{ background: member.department ? kBaseColors[member.department] : "yellow" }}
				className={`ease-in transition-all pointer-events-none absolute w-full h-full member-hover ${!member.department && "rainbow-background"} ${member.executive && member.department && "gold-background"}`}
			/>
			<div
				className="absolute inset-0 w-full h-full p-0.5 bg-neutral-300 group-hover:bg-(--department-color) transition-colors duration-300"
				style={{ clipPath: frontClipPath }}
			>
				<div className="relative w-full h-full bg-neutral-200" style={{ clipPath: frontClipPath }}>
					<Image
						src={member.image ?? member.hoverImage}
						alt={member.name}
						fill
						sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
						className="object-cover opacity-100 transition-opacity group-hover:opacity-0"
						placeholder={typeof member.image === "object" ? "blur" : undefined}
					/>
					<Image
						src={member.hoverImage ?? member.image}
						alt={member.name}
						fill
						sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, (max-width: 1024px) 25vw, 20vw"
						className="object-cover opacity-0 transition-opacity group-hover:opacity-100"
						placeholder={typeof member.image === "object" ? "blur" : undefined}
					/>
				</div>
				<div className="absolute top-3.5 right-4 z-20">
					{getIcon(member.executive ?? false, member.department)}
				</div>
			</div>
		</motion.div>

		<div className="relative font-sans text-center w-full pointer-events-none">
			<div className="transition-opacity duration-300 ease-in-out opacity-100 group-hover:opacity-0">
				<p className="font-bold text-sm">{member.name}</p>
				<p className="text-xs text-neutral-500">{member.role}</p>
			</div>

			<div className="absolute pt-1 z-10 inset-0 transition-opacity duration-300 ease-in-out opacity-0 group-hover:opacity-100">
				<p className="font-light leading-4 py-0.5 px-1 italic text-neutral-500 text-sm bg-white border-4 border-black">
					&quot;
					<span className="font-liebling font-normal text-neutral-700">
						{member.quote ?? "bautista bomb"}
					</span>
					&quot;
				</p>
			</div>
		</div>
	</motion.div>
);

export default Team;
