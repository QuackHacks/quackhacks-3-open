import { NextRequest } from "next/server";

const kAllowedPhotoHost = "photo.quackhacks.org";
const kAllowedOriginalsPath = "/qh3/photos/originals/";

function sanitizeFilename(filename: string | null | undefined, fallback: string) {
	const value = (filename ?? fallback)
		.replace(/[/\\?%*:|"<>]/g, "-")
		.replace(/\s+/g, " ")
		.trim();

	return value || fallback;
}

function getFallbackFilename(photoUrl: URL) {
	const pathFilename = photoUrl.pathname.split("/").pop();
	return sanitizeFilename(pathFilename, "quackhacks-photo.jpg");
}

export async function GET(request: NextRequest) {
	const rawPhotoUrl = request.nextUrl.searchParams.get("url");

	if (!rawPhotoUrl) {
		return Response.json({ error: "Missing photo URL." }, { status: 400 });
	}

	let photoUrl: URL;
	try {
		photoUrl = new URL(rawPhotoUrl);
	} catch {
		return Response.json({ error: "Invalid photo URL." }, { status: 400 });
	}

	if (
		photoUrl.protocol !== "https:" ||
		photoUrl.hostname !== kAllowedPhotoHost ||
		!photoUrl.pathname.startsWith(kAllowedOriginalsPath)
	) {
		return Response.json({ error: "Photo URL is not allowed." }, { status: 400 });
	}

	const upstreamResponse = await fetch(photoUrl, { cache: "no-store" });
	if (!upstreamResponse.ok || !upstreamResponse.body) {
		return Response.json({ error: "Photo unavailable." }, { status: upstreamResponse.status });
	}

	const filename = sanitizeFilename(
		request.nextUrl.searchParams.get("filename"),
		getFallbackFilename(photoUrl),
	);
	const headers = new Headers({
		"Cache-Control": "no-store",
		"Content-Disposition": `attachment; filename="${filename}"`,
		"Content-Type": upstreamResponse.headers.get("content-type") ?? "application/octet-stream",
	});
	const contentLength = upstreamResponse.headers.get("content-length");
	if (contentLength) headers.set("Content-Length", contentLength);

	return new Response(upstreamResponse.body, {
		status: 200,
		headers,
	});
}
