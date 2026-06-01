import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it } from "vitest";
import { ProjectGalleryClient } from "./ProjectGalleryClient";
import type { SubmissionCardData } from "./SubmissionCard";

function card(name: string, mlh_tracks: string[]): SubmissionCardData {
	return {
		id: name.toLowerCase().replace(/\s+/g, "-"),
		name,
		tagline: "Tagline",
		tech_stack: "Next.js",
		description: "Description",
		video_url: "",
		team_name: null,
		image_urls: [],
		qh_track: null,
		mlh_tracks,
	};
}

describe("ProjectGalleryClient", () => {
	it("counts and filters camelCase MLH track ids from exported data", async () => {
		const user = userEvent.setup();
		render(
			<ProjectGalleryClient
				cards={[
					card("Voice Booth", ["elevenLabs"]),
					card("Cloud Host", ["digitalOcean"]),
					card("Both Tracks", ["elevenLabs", "digitalOcean"]),
					card("Neither Track", ["gemini_api"]),
				]}
			/>,
		);

		expect(screen.getByRole("button", { name: /ElevenLabs2/ })).toBeInTheDocument();
		expect(screen.getByRole("button", { name: /Digital Ocean2/ })).toBeInTheDocument();
		expect(screen.queryByRole("button", { name: /General/ })).not.toBeInTheDocument();

		await user.click(screen.getByRole("button", { name: /Digital Ocean2/ }));

		expect(screen.getByRole("heading", { name: "Cloud Host" })).toBeInTheDocument();
		expect(screen.getByRole("heading", { name: "Both Tracks" })).toBeInTheDocument();
		expect(screen.queryByText("Voice Booth")).not.toBeInTheDocument();
		expect(screen.queryByText("Neither Track")).not.toBeInTheDocument();
	});
});
