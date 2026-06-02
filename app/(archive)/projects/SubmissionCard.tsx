import Link from "next/link";
import { QH_TRACK_BADGE_STYLES, type QhTrackName } from "./trackBadgeStyles";

export type SubmissionCardData = {
	id: string;
	name: string;
	tagline: string;
	tech_stack: string;
	description: string;
	video_url: string;
	team_name?: string | null;
	image_urls: string[];
	qh_track: string | null;
	mlh_tracks: string[];
};

function parseTags(techStack: string): string[] {
	return techStack
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean);
}

export function SubmissionCard({
	submission,
	href,
}: {
	submission: SubmissionCardData;
	href: string;
}) {
	const firstImage = submission.image_urls[0];
	const tags = parseTags(submission.tech_stack);
	const visibleTags = tags.slice(0, 6);
	const extraTagCount = tags.length - visibleTags.length;

	return (
		<Link
			href={href}
			className="group flex flex-col bg-white border border-neutral-200 shadow-[0_18px_40px_rgba(0,0,0,0.04)] transition-all duration-200 hover:border-neutral-900 hover:shadow-[0_22px_60px_rgba(0,0,0,0.10)] hover:-translate-y-1"
		>
			<div className="relative h-[210px] bg-neutral-100 border-b border-neutral-200 overflow-hidden">
				{firstImage ? (
					// eslint-disable-next-line @next/next/no-img-element
					<img
						src={firstImage}
						alt={`${submission.name} preview`}
						className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
					/>
				) : (
					<div className="h-full w-full flex items-center justify-center">
						<p className="font-mono text-[9px] uppercase tracking-superwide text-neutral-400">
							No preview image
						</p>
					</div>
				)}
				<div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-black/15 to-transparent" />
			</div>

			<div className="p-5 flex flex-col gap-3 grow">
				<div>
					<div className="flex items-center justify-between gap-2 mb-1.5">
						{submission.team_name ? (
							<p className="font-mono text-[9px] uppercase tracking-superwide text-neutral-500">
								Team {submission.team_name}
							</p>
						) : <span />}
						{submission.qh_track ? (
							<span
								className="inline-flex items-center h-[20px] px-2 text-[0.65rem] font-mono uppercase tracking-[0.14em] border bg-neutral-100 border-neutral-300 text-neutral-700"
								style={QH_TRACK_BADGE_STYLES[submission.qh_track as QhTrackName]}
							>
								{submission.qh_track}
							</span>
						) : null}
					</div>
					<h2 className="font-instrument-serif font-bold text-[1.65rem] leading-[1.05] text-neutral-900 group-hover:text-brand-500 transition-colors">
						{submission.name || "Untitled Project"}
					</h2>
				</div>

				<p className="font-sans text-[0.9rem] leading-snug text-neutral-600 italic line-clamp-2">
					{submission.tagline || "No tagline"}
				</p>

				{visibleTags.length > 0 ? (
					<div className="flex flex-wrap gap-1.5">
						{visibleTags.map((tag) => (
							<span
								key={tag}
								className="inline-flex items-center h-[22px] px-2 text-[0.7rem] font-mono uppercase tracking-[0.12em] bg-brand-100 border border-brand-300 text-brand-800"
							>
								{tag}
							</span>
						))}
						{extraTagCount > 0 ? (
							<span className="inline-flex items-center h-[22px] px-2 text-[0.7rem] font-mono uppercase tracking-[0.12em] border border-neutral-300 text-neutral-500">
								+{extraTagCount}
							</span>
						) : null}
					</div>
				) : null}

				<div className="relative max-h-12 overflow-hidden mt-auto">
					<p className="font-sans text-[0.85rem] leading-6 text-neutral-700 whitespace-pre-line">
						{submission.description || "No description"}
					</p>
					<div className="pointer-events-none absolute bottom-0 left-0 h-5 w-full bg-linear-to-t from-white to-transparent" />
				</div>

				<div className="flex items-center justify-between pt-2 border-t border-neutral-100">
					<span className="font-mono text-[10px] uppercase tracking-[0.22em] text-neutral-500 group-hover:text-neutral-900 transition-colors">
						View project
					</span>
					<span
						aria-hidden
						className="font-mono text-sm text-neutral-400 group-hover:text-neutral-900 group-hover:translate-x-0.5 transition-all"
					>
						→
					</span>
				</div>
			</div>
		</Link>
	);
}
