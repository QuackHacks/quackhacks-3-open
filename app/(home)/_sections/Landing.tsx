"use client";
import Image from "next/image";
import Link from "next/link";

// public images, this is so bad holy shit
import Image_PixelArrow from "@assets/elements/pixelarrow.webp";
import Image_PixelSquare3x3 from "@assets/elements/gappixelsquare3x3.webp";
import SVG_WarningSquare from "@assets/elements/warningsquare.svg";
import DuckCanvasPassive from "@/app/_components/duck/DuckCanvasPassive";
import useMediaQuery from "@/app/_utils/useMediaQuery";
import { MapPin } from "lucide-react";

const BrandTitle = () => {
	return (
		<div className="flex md:-translate-x-4">
			<h1 className="font-liebling font-bold text-neutral-950 text-6xl md:text-9xl overflow-x-hidden text-nowrap">
				quac
				<span className="relative inline-block">
					<span className="relative">khacks</span>
					<span className="holo-fade absolute inset-0">khacks</span>
				</span>
			</h1>
		</div>
	);
};

interface RegisterButtonProps {
	text: string;
	href: string;
	variant?: "standard" | "long";
}
export const RegisterButton = ({ text, href, variant = "standard" }: RegisterButtonProps) => {
	const isLong = variant === "long";
	return (
		<Link
			href={href}
			className="block w-fit relative overflow-hidden group bg-brand-500 hover:bg-brand-300 shadow-lg shadow-black/10 hover:shadow-2xl hover:shadow-brand-300 border-neutral-950 border-0 transition-colors ease-out duration-150 cursor-pointer"
			// className="block w-fit relative overflow-hidden hover:mix-blend-color-burn group bg-brand-500 hover:shadow-2xl shadow-brand-500 border-neutral-950 border-0 transition-all ease-out duration-150 cursor-pointer"
		>
			<div
				className={`flex flex-row items-center justify-center ${isLong ? "px-10 py-1 gap-1 md:gap-3" : "px-4 py-2 gap-6"}`}
			>
				<h2
					className={`font-black text-white uppercase group-hover:text-black ${isLong ? "md:text-4xl text-2xl" : "md:text-6xl text-3xl"}`}
				>
					{text}
				</h2>
				<Image
					src={Image_PixelArrow}
					className={`
                        nearest pointer-events-none invert
                        group-hover:invert-0 h-auto shrink-0
                        transition-all duration-150 ease-out
                        ${isLong ? "w-6 md:w-10" : "w-10 md:w-18"}
                        `}
					unoptimized
					alt="pixel arrow"
				/>
			</div>
		</Link>
	);
};

const StatItem = ({ label }: { label: string }) => (
	<div className="flex items-center justify-center text-neutral-500 text-sm sm:text-base">{label}</div>
);

// the array of numbers should be 0, 1, or 2
const PixelSquare = ({ values }: { values: number[] }) => (
	<div className="grid grid-cols-3 gap-1">
		{values.map((p, i) => (
			<div
				key={i}
				className={`h-3 w-3 ${
					p === 2
						? "bg-neutral-800" // dark pixels
						: p === 1
							? "bg-neutral-400" // mid pixels
							: "bg-neutral-200" // light pixels
				}`}
			/>
		))}
	</div>
);

const PixelSquare3x3Gap = () => (
	<Image src={Image_PixelSquare3x3} unoptimized className="w-6 h-6 nearest" alt="pixel square 3x3 gap" />
);

const WarningSquare = () => {
	return <Image src={SVG_WarningSquare} unoptimized className="w-6 h-6" alt="warning square" />;
};

const pixels = [0, 0, 1, 2, 2, 1, 2, 1, 1];

const StatsContainer = ({ children }: { children: React.ReactNode }) => (
	<div className="flex-1 md:flex-none self-stretch border border-neutral-400 px-4 py-4 md:px-6 md:py-2 min-h-12 gap-3 md:gap-6 flex flex-col md:flex-row items-center justify-center">
		{children}
	</div>
);

const stats = ["250+ PARTICIPANTS", "24 HOURS", "$10k+ IN PRIZES"];
export const StatsBox1 = () => (
	<StatsContainer>
		<PixelSquare3x3Gap />
		<div className="flex flex-col justify-center md:flex-row gap-2 md:gap-0 md:space-x-8 items-center ">
			{stats.map((stat, i) => (
				<div key={stat} className="flex flex-row items-center gap-6">
					<p className="text-center text-neutral-500 text-xs md:text-sm uppercase tracking-tight">{stat}</p>
					{i !== stats.length - 1 && <div className="hidden md:block h-6 w-px bg-neutral-400 shrink-0" />}
				</div>
			))}
		</div>
	</StatsContainer>
);

export const StatsBox2 = () => {
	return (
		<StatsContainer>
			<WarningSquare />
			<div className="text-center text-neutral-500 text-xs md:text-sm uppercase tracking-tight">
				only at quackhacks 2026
			</div>
		</StatsContainer>
	);
};

export const StatsBox3 = () => {
	return (
		<StatsContainer>
			<MapPin className=" w-7 h-7" />
			<div className="text-center text-neutral-500 text-xs md:text-sm uppercase tracking-tight">
				EMU Ballroom @ UO
			</div>
		</StatsContainer>
	);
};

const Landing = () => {
	const isXlOrGreater = useMediaQuery("xl");
	return (
		// gap determines distance from hero to stats boxes, mb determines distance to next section
		<section className="relative flex flex-col w-full max-w-full overflow-x-clip md:gap-40 gap-28 mb-32 mt-30 md:mt-27">
			{/* desktop duck */}
			{isXlOrGreater && (
				<div aria-hidden className="pointer-events-none absolute right-34 -top-16 hidden xl:block">
					<div className="w-150 -z-10 aspect-square">
						<DuckCanvasPassive />
					</div>
				</div>
			)} 
			{/* for hero title and register button */}
			<div className="justify-self-start md:ml-20 max-w-7xl md:px-6">
				{/* for register button and extra text */}
				<div className="flex flex-col md:items-start">
					<div className="flex items-center md:items-start flex-col w-full mb-10 cursor-default">
						<BrandTitle />
						<div className="flex flex-row gap-15 md:ml-18 mr-10 -translate-y-2 md:-translate-y-4 text-xs md:text-sm">
							<p className="text-neutral-500">hacking starts here</p>
							<p className="text-neutral-600">may 30th & 31st</p>
						</div>
					</div>
					<div className="md:ml-5 flex flex-col items-center md:items-start px-6 md:px-0 gap-4">
						<p className="text-neutral-400 font-sans text-center md:text-3xl text-xl cursor-default">
							The State of Oregon&apos;s biggest and brightest hackathon.
						</p>
						<RegisterButton text="view projects" href="/projects" />
					</div>
				</div>
			</div>
			<div className="justify-self-start md:ml-20 max-w-7xl w-full px-4 md:px-6 cursor-default">
				<div className="flex flex-col md:flex-row md:flex-wrap items-stretch gap-4 md:gap-6 lg:gap-8 [&>*]:flex-none [&>*]:w-full md:[&>*]:w-auto">
					<StatsBox1 />
					<StatsBox2 />
					<StatsBox3 />
				</div>
			</div>
		</section>
	);
};

export default Landing;
