import { Metadata } from "next";
import { notFound } from "next/navigation";
import { getProjectById } from "@/lib/archive";
import { getAllWinnerProjectIds, getAwardMeta, getWinnerByProjectId } from "@/lib/winners";
import { WinnerDetailClient } from "./WinnerDetailClient";

export function generateStaticParams() {
	return getAllWinnerProjectIds().map((id) => ({ id }));
}

export async function generateMetadata({
	params,
}: {
	params: Promise<{ id: string }>;
}): Promise<Metadata> {
	const { id } = await params;
	const project = getProjectById(id);
	const lookup = getWinnerByProjectId(id);
	if (!project || !lookup) return { title: "Winner | QuackHacks" };
	const award = getAwardMeta(lookup);
	return {
		title: `${project.name} — ${award.placeLabel} | QuackHacks Winners`,
		description: `${project.name} won ${award.placeLabel} in the ${award.trackName} track at QuackHacks 3.`,
	};
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

export default async function WinnerDetailPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = await params;
	const project = getProjectById(id);
	const lookup = getWinnerByProjectId(id);

	// Only actual winners get the champion page; everything else 404s.
	if (!project || !lookup) notFound();

	const award = getAwardMeta(lookup);
	const tags = parseTags(project.tech_stack);
	const embedUrl = project.video_url ? youtubeEmbedUrl(project.video_url) : null;

	return <WinnerDetailClient project={project} award={award} embedUrl={embedUrl} tags={tags} />;
}
