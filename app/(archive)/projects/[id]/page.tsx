import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getProjectById, projects } from "@/lib/archive";

export const metadata: Metadata = {
	title: "Project | QuackHacks",
};

export function generateStaticParams() {
	return projects.map((project) => ({ id: project.id }));
}

function parseTags(techStack: string): string[] {
	return techStack
		.split(",")
		.map((t) => t.trim())
		.filter(Boolean);
}

function youtubeEmbedUrl(url: string): string | null {
	try {
		const u = new URL(url);
		if (u.hostname === "youtu.be") return `https://www.youtube.com/embed/${u.pathname.replace("/", "")}`;
		if (u.hostname.includes("youtube.com")) {
			const id = u.searchParams.get("v");
			if (id) return `https://www.youtube.com/embed/${id}`;
			if (u.pathname.startsWith("/embed/")) return url;
		}
		if (u.hostname.includes("vimeo.com")) {
			const id = u.pathname.split("/").filter(Boolean).pop();
			if (id) return `https://player.vimeo.com/video/${id}`;
		}
	} catch {
		return null;
	}
	return null;
}

export default async function ProjectDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const submission = getProjectById(id);

	if (!submission) notFound();

	const tags = parseTags(submission.tech_stack);
	const embed = submission.video_url ? youtubeEmbedUrl(submission.video_url) : null;

	return (
		<main className="min-h-full bg-[#f4f4f4] relative overflow-x-hidden">
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(227,241,230,0.55),transparent_45%),conic-gradient(from_140deg_at_85%_0%,rgba(52,124,69,0.10),transparent_30%),radial-gradient(60%_45%_at_10%_100%,rgba(198,216,154,0.30),transparent_70%)]"
			/>
			<div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 opacity-[0.14] bg-[radial-gradient(circle_at_1px_1px,#347c45_1px,transparent_0)] [background-size:24px_24px]"
			/>

			<section className="pt-24 pb-20 px-5 md:px-8 max-w-300 mx-auto w-full relative">
				<div className="mb-6 flex justify-end">
					<Link
						href="/projects"
						className="hidden md:inline-flex items-center justify-center border border-neutral-300 bg-white text-neutral-700 text-[10px] font-mono uppercase tracking-[0.22em] px-3 py-1.5 hover:border-neutral-900 hover:text-neutral-900 transition-colors"
					>
						Back to gallery
					</Link>
				</div>

				<header className="mb-8">
					{submission.team_name ? (
						<p className="font-mono text-[10px] uppercase tracking-superwide text-neutral-500 mb-2">
							Team {submission.team_name}
						</p>
					) : null}
					<h1 className="font-liebling font-bold text-4xl md:text-6xl text-neutral-900 leading-[0.95]">
						{submission.name}
					</h1>
					{submission.tagline ? (
						<p className="font-sans text-neutral-600 text-base md:text-lg italic max-w-3xl mt-3">
							{submission.tagline}
						</p>
					) : null}
				</header>

				<div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
					<div className="lg:col-span-2 flex flex-col gap-6">
						<div className="bg-white border border-neutral-200 shadow-[0_18px_40px_rgba(0,0,0,0.06)] overflow-hidden">
							<div className="h-[260px] md:h-[420px] bg-neutral-100 border-b border-neutral-200 relative">
								{submission.image_urls[0] ? (
									// eslint-disable-next-line @next/next/no-img-element
									<img src={submission.image_urls[0]} alt={submission.name} className="h-full w-full object-cover" />
								) : (
									<div className="h-full w-full flex items-center justify-center">
										<p className="font-mono text-[9px] uppercase tracking-superwide text-neutral-400">
											No preview image
										</p>
									</div>
								)}
							</div>
						</div>

						{embed ? (
							<div className="bg-white border border-neutral-200 shadow-[0_18px_40px_rgba(0,0,0,0.06)] p-5 md:p-6">
								<h3 className="font-mono text-[10px] uppercase tracking-superwide text-neutral-500 mb-3">
									Video Demo
								</h3>
								<div className="aspect-video w-full border border-neutral-200">
									<iframe
										src={embed}
										title={`${submission.name} demo`}
										className="w-full h-full"
										allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
										allowFullScreen
									/>
								</div>
							</div>
						) : null}

						<div className="bg-white border border-neutral-200 shadow-[0_18px_40px_rgba(0,0,0,0.06)] p-6 md:p-8">
							<h3 className="font-mono text-[10px] uppercase tracking-superwide text-neutral-500 mb-3">
								About this project
							</h3>
							<p className="font-sans text-[0.95rem] leading-7 text-neutral-800 whitespace-pre-line">
								{submission.description || "No description provided."}
							</p>
						</div>

						{submission.image_urls.length > 1 ? (
							<div className="bg-white border border-neutral-200 shadow-[0_18px_40px_rgba(0,0,0,0.06)] p-6 md:p-8">
								<h3 className="font-mono text-[10px] uppercase tracking-superwide text-neutral-500 mb-3">
									Gallery
								</h3>
								<div className="grid grid-cols-2 md:grid-cols-3 gap-3">
									{submission.image_urls.slice(1).map((url) => (
										<div key={url} className="aspect-video bg-neutral-100 border border-neutral-200 overflow-hidden">
											{/* eslint-disable-next-line @next/next/no-img-element */}
											<img src={url} alt="" className="w-full h-full object-cover hover:scale-[1.04] transition-transform duration-300" />
										</div>
									))}
								</div>
							</div>
						) : null}
					</div>

					<aside className="flex flex-col gap-6 lg:sticky lg:top-24">
						<div className="bg-white border border-neutral-200 shadow-[0_18px_40px_rgba(0,0,0,0.06)] p-6">
							<h3 className="font-mono text-[10px] uppercase tracking-superwide text-neutral-500 mb-3">
								Built With
							</h3>
							<div className="flex flex-wrap gap-1.5">
								{tags.map((tag) => (
									<span
										key={tag}
										className="inline-flex items-center h-[24px] px-2 text-[0.7rem] font-mono uppercase tracking-[0.12em] bg-brand-100 border border-brand-300 text-brand-800"
									>
										{tag}
									</span>
								))}
							</div>
						</div>

						{(submission.video_url || submission.submission_url || submission.github_url) ? (
							<div className="bg-white border border-neutral-200 shadow-[0_18px_40px_rgba(0,0,0,0.06)] p-6 flex flex-col gap-3">
								<h3 className="font-mono text-[10px] uppercase tracking-superwide text-neutral-500">
									Links
								</h3>
								{submission.submission_url ? (
									<a
										href={submission.submission_url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center justify-center w-full border border-neutral-800 bg-neutral-900 text-white text-xs font-bold uppercase tracking-[0.18em] py-3 hover:bg-brand-500 hover:border-brand-500 transition-colors"
									>
										Try it out
									</a>
								) : null}
								{submission.github_url ? (
									<a
										href={submission.github_url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center justify-center w-full border border-neutral-800 bg-white text-neutral-900 text-xs font-bold uppercase tracking-[0.18em] py-3 hover:bg-neutral-900 hover:text-white transition-colors"
									>
										GitHub
									</a>
								) : null}
								{submission.video_url ? (
									<a
										href={submission.video_url}
										target="_blank"
										rel="noopener noreferrer"
										className="inline-flex items-center justify-center w-full border border-neutral-800 bg-brand-500 text-white text-xs font-bold uppercase tracking-[0.18em] py-3 hover:bg-neutral-900 hover:border-neutral-900 transition-colors"
									>
										Watch demo
									</a>
								) : null}
							</div>
						) : null}

						{(submission.qh_track || submission.mlh_tracks.length > 0) ? (
							<div className="bg-white border border-neutral-200 shadow-[0_18px_40px_rgba(0,0,0,0.06)] p-6">
								<h3 className="font-mono text-[10px] uppercase tracking-superwide text-neutral-500 mb-3">
									Tracks
								</h3>
								<div className="flex flex-wrap gap-1.5">
									{submission.qh_track ? (
										<span className="inline-flex items-center h-[24px] px-2 text-[0.7rem] font-mono uppercase tracking-[0.12em] bg-green-100 border border-green-300 text-green-800">
											QH · {submission.qh_track}
										</span>
									) : null}
									{submission.mlh_tracks.map((track) => (
										<span
											key={track}
											className="inline-flex items-center h-[24px] px-2 text-[0.7rem] font-mono uppercase tracking-[0.12em] bg-amber-100 border border-amber-300 text-amber-800"
										>
											MLH · {track}
										</span>
									))}
								</div>
							</div>
						) : null}

						{submission.members.length > 0 ? (
							<div className="bg-white border border-neutral-200 shadow-[0_18px_40px_rgba(0,0,0,0.06)] p-6">
								<h3 className="font-mono text-[10px] uppercase tracking-superwide text-neutral-500 mb-3">
									Team Members
								</h3>
								<ul className="flex flex-col gap-3">
									{submission.members.map((member) => (
										<li key={member.id} className="border border-neutral-200 p-3">
											<p className="font-mono text-[0.85rem] font-semibold text-neutral-900">{member.name}</p>
											{member.university ? (
												<p className="mt-1 text-[0.7rem] text-neutral-600">{member.university}</p>
											) : null}
										</li>
									))}
								</ul>
							</div>
						) : null}

						<Link
							href="/projects"
							className="md:hidden inline-flex items-center justify-center border border-neutral-300 bg-white text-neutral-700 text-[10px] font-mono uppercase tracking-[0.22em] px-3 py-3 hover:border-neutral-900 hover:text-neutral-900 transition-colors"
						>
							Back to gallery
						</Link>
					</aside>
				</div>
			</section>

		</main>
	);
}
