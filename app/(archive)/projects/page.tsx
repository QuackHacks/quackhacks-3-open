'use client'
// import { Metadata } from "next";
import { projects } from "@/lib/archive";
import { type SubmissionCardData } from "./SubmissionCard";
import { ProjectGalleryClient } from "./ProjectGalleryClient";
import { useRouter } from "next/navigation";
import { Trophy, ArrowRight } from "lucide-react";

// export const metadata: Metadata = {
// 	title: "Project Gallery | QuackHacks",
// 	description: "Browse archived QuackHacks project submissions.",
// };

export default function ProjectGalleryPage() {
	const cards: SubmissionCardData[] = projects.map((project) => ({
		id: project.id,
		name: project.name,
		tagline: project.tagline,
		tech_stack: project.tech_stack,
		description: project.description,
		video_url: project.video_url,
		team_name: project.team_name ?? null,
		image_urls: project.image_urls,
		qh_track: project.qh_track,
		mlh_tracks: project.mlh_tracks,
	}));

	const router = useRouter()

	return (
		<main className="min-h-full relative overflow-hidden bg-[#f4f4f4]">
			<div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
				<div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(227,241,230,0.55),transparent_45%),conic-gradient(from_140deg_at_85%_0%,rgba(52,124,69,0.10),transparent_30%),radial-gradient(60%_45%_at_10%_100%,rgba(198,216,154,0.30),transparent_70%)]" />
				<div className="absolute inset-0 opacity-[0.18] bg-[radial-gradient(circle_at_1px_1px,#347c45_1px,transparent_0)] [background-size:22px_22px]" />
				<div className="absolute -top-16 -right-20 h-72 w-72 rotate-12 border-2 border-brand-700/30 bg-brand-300/30" />
				<div className="absolute top-[42%] right-8 h-24 w-24 rotate-45 border-2 border-dashed border-brand-700/40" />
			</div>

			<section className="pt-24 pb-20 px-5 md:px-8 max-w-350 mx-auto w-full relative">
				<div className="mb-10 flex flex-col gap-3">
					<div className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 bor">
						<div className="justify-stat">
							<h1 className="font-liebling font-bold text-4xl md:text-6xl text-neutral-900 leading-[0.95]">
								Project Gallery
							</h1>
							<p className="font-sans text-neutral-600 text-sm md:text-base max-w-xl mt-3">
								Archived projects from QuackHacks 3.
							</p>
						</div>
						<div className="justify-end items-center flex">
							<button
								onClick={() => router.push("/projects/winners")}
								className="group relative inline-flex items-center gap-2.5 overflow-hidden rounded-xl px-7 py-3.5 text-base md:text-lg font-bold text-amber-50
								bg-linear-to-br from-amber-400 via-amber-500 to-yellow-600 shadow-lg shadow-amber-600/30 ring-1 ring-amber-300/40
								cursor-pointer transition-all duration-300 hover:-translate-y-0.5 hover:scale-[1.03] hover:shadow-xl hover:shadow-amber-600/40 active:scale-100"
							>
								{/* sheen sweep */}
								<span
									aria-hidden
									className="pointer-events-none absolute inset-0 -translate-x-full bg-linear-to-r from-transparent via-white/40 to-transparent transition-transform duration-700 group-hover:translate-x-full"
								/>
								<span className="relative tracking-wide">View Winners</span>
								<ArrowRight className="relative h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
							</button>
						</div>
					</div>
				</div>

				<ProjectGalleryClient cards={cards} />
			</section>
		</main>
	);
}
