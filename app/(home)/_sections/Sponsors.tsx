import Image, { StaticImageData } from "next/image";
import SectionWrapper from "../_components/SectionWrapper";
import base44_Image from "@assets/sponsors/base44.webp";
import google_Image from "@assets/sponsors/google.webp";
import emberex_Image from "@assets/sponsors/emberex.webp";
import pipeworks_Image from "@assets/sponsors/pipeworks.webp";
import codex_Image from "@assets/sponsors/codex.webp";
import mongodb_Image from "@assets/sponsors/mongodb.webp";

type SponsorSize = "sm" | "md" | "lg";

interface Sponsor {
	name: string;
	size: SponsorSize;
	logo: StaticImageData;
}

/**
 * Mapping sizes to scale transforms.
 * md is 1:1 with the original 'Evergreen' dimensions.
 */
const SIZE_CONFIG: Record<SponsorSize, string> = {
	sm: "scale-75",
	md: "scale-100",
	lg: "scale-110", // Slightly larger than original top tier
};

const sponsors: Sponsor[] = [
	{ name: "Google", size: "md", logo: google_Image },
	{ name: "Pipeworks", size: "md", logo: pipeworks_Image },
	{ name: "Base44", size: "md", logo: base44_Image },
	{ name: "Emberex", size: "sm", logo: emberex_Image },
	{ name: "Codex", size: "lg", logo: codex_Image },
	{ name: "MongoDB", size: "lg", logo: mongodb_Image },
];

const Sponsors = () => (
	<SectionWrapper title="Sponsors" caption="Who's going to be there?" val="0x2">
		<div className="space-y-2 mt-4 md:space-y-4">
			<div className="flex flex-wrap justify-center gap-6 md:gap-12 py-8">
				{sponsors.map((sponsor) => (
					<div
						key={sponsor.name}
						className={`group flex flex-col items-center transition-transform duration-300 ease-in-out ${
							SIZE_CONFIG[sponsor.size]
						}`}
					>
						{/* Restored the responsive height from the original 'Evergreen' tier 
							(h-20 for mobile, h-40 for desktop) 
						*/}
						<div className="relative h-20 md:h-50 aspect-5/3">
							{sponsor.logo ? (
								<Image
									src={sponsor.logo}
									alt={sponsor.name}
									className="object-contain h-full w-full"
									priority
								/>
							) : (
								<div className="aspect-square h-full bg-neutral-200/60" />
							)}
						</div>
					</div>
				))}
			</div>

			{/* <div className="mt-6 flex items-center gap-3 md:mt-8">
				<div className="h-px flex-1 bg-neutral-300/40" />
				<p className="font-mono text-[10px] uppercase tracking-superwide text-neutral-500 md:text-xs">
					More to come
				</p>
				<div className="h-px flex-1 bg-neutral-300/40" />
			</div> */}
		</div>
	</SectionWrapper>
);

export default Sponsors;