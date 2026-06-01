import { describe, expect, it } from "vitest";
import { normalizeMlhTrack } from "./export-supabase-archive.mjs";

describe("normalizeMlhTrack", () => {
	it("normalizes Supabase MLH track ids used by the gallery filters", () => {
		expect(normalizeMlhTrack("digitalOcean")).toBe("digitalocean");
		expect(normalizeMlhTrack("elevenLabs")).toBe("elevenlabs");
		expect(normalizeMlhTrack("snowflake_api")).toBe("snowflake_api");
		expect(normalizeMlhTrack("unknown_track")).toBe("unknown_track");
	});
});
