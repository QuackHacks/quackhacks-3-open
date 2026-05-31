import type { NextConfig } from "next";

const nextConfig: NextConfig = {
	// Dev-only: allow loading dev resources (HMR / turbopack runtime) when the app
	// is opened via 127.0.0.1 instead of localhost. Without this, Next 16 blocks
	// those resources as cross-origin and the page never hydrates. Ignored in prod.
	allowedDevOrigins: ["127.0.0.1"],
	experimental: {
		optimizePackageImports: ["lucide-react", "recharts", "motion"],
	},
	images: {
		remotePatterns: [
			{
				protocol: "https",
				hostname: "avatars.githubusercontent.com",
			},
			{
				protocol: "https",
				hostname: "img.freepik.com",
			},
			{
				protocol: "https",
				hostname: "www.shutterstock.com",
			},
		],
	},
};

export default nextConfig;
