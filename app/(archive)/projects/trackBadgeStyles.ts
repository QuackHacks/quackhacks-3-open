import type { CSSProperties } from "react";

export type QhTrackName = "Base44" | "Google" | "Pipeworks" | "MongoDB";

export const QH_TRACK_BADGE_STYLES: Record<QhTrackName, CSSProperties> = {
	Base44: {
		backgroundColor: "oklch(95% 0.034 58.81181880510718)",
		borderColor: "oklch(82% 0.092 58.81181880510718)",
		color: "oklch(42% 0.118 58.81181880510718)",
	},
	Pipeworks: {
		backgroundColor: "oklch(94% 0.032 28.98950037544506)",
		borderColor: "oklch(78% 0.118 28.98950037544506)",
		color: "oklch(43% 0.17 28.98950037544506)",
	},
	Google: {
		backgroundColor: "oklch(94% 0.034 253.70485550337392)",
		borderColor: "oklch(78% 0.112 253.70485550337392)",
		color: "oklch(43% 0.15 253.70485550337392)",
	},
	MongoDB: {
		backgroundColor: "oklch(94% 0.035 150.04627459928668)",
		borderColor: "oklch(78% 0.104 150.04627459928668)",
		color: "oklch(39% 0.13 150.04627459928668)",
	},
};

export const QH_TRACK_ACTIVE_STYLES: Record<QhTrackName, CSSProperties> = {
	Base44: {
		backgroundColor: "oklch(77.82% 0.1564431718534738 58.81181880510718)",
		borderColor: "oklch(69% 0.1564431718534738 58.81181880510718)",
		color: "oklch(22% 0.07 58.81181880510718)",
	},
	Pipeworks: {
		backgroundColor: "oklch(62.31% 0.22091456150381159 28.98950037544506)",
		borderColor: "oklch(54% 0.22091456150381159 28.98950037544506)",
		color: "white",
	},
	Google: {
		backgroundColor: "oklch(60.67% 0.19124997374813318 253.70485550337392)",
		borderColor: "oklch(52% 0.19124997374813318 253.70485550337392)",
		color: "white",
	},
	MongoDB: {
		backgroundColor: "oklch(64.64% 0.17423982179538322 150.04627459928668)",
		borderColor: "oklch(55% 0.17423982179538322 150.04627459928668)",
		color: "white",
	},
};
