import { Award, Crown, Medal, Trophy } from "lucide-react";
import type { CSSProperties } from "react";
import { BADGE_MAP } from "@/app/constants";
import type { Sponsor, WinnerPlacement } from "@/lib/winners";
import { QH_TRACK_BADGE_STYLES } from "../trackBadgeStyles";

type IconComponent = React.ComponentType<{ className?: string }>;

/** Per-placement medal styling. `0` is the fallback for single-winner tracks. */
export const PLACEMENT_META: Record<
	WinnerPlacement | 0,
	{
		label: string;
		roman: string;
		icon: IconComponent;
		/** avatar / medallion gradient */
		medalBg: string;
		medalText: string;
		ring: string;
		/** soft card tint */
		cardTint: string;
		accentText: string;
		glow: string;
	}
> = {
	1: {
		label: "1st",
		roman: "I",
		icon: Crown,
		medalBg: "bg-linear-to-br from-amber-200 via-amber-300 to-yellow-500",
		medalText: "text-amber-900",
		ring: "ring-amber-300/70",
		cardTint: "from-white to-amber-50",
		accentText: "text-amber-700",
		glow: "bg-amber-400/30",
	},
	2: {
		label: "2nd",
		roman: "II",
		icon: Medal,
		medalBg: "bg-linear-to-br from-slate-100 via-slate-200 to-slate-400",
		medalText: "text-slate-600",
		ring: "ring-slate-300/70",
		cardTint: "from-white to-slate-50",
		accentText: "text-slate-600",
		glow: "bg-slate-400/25",
	},
	3: {
		label: "3rd",
		roman: "III",
		icon: Award,
		medalBg: "bg-linear-to-br from-orange-200 via-orange-300 to-amber-500",
		medalText: "text-orange-800",
		ring: "ring-orange-300/70",
		cardTint: "from-white to-orange-50",
		accentText: "text-orange-700",
		glow: "bg-orange-400/25",
	},
	0: {
		label: "Winner",
		roman: "★",
		icon: Trophy,
		medalBg: "bg-linear-to-br from-brand-300 via-brand-400 to-brand-600",
		medalText: "text-white",
		ring: "ring-brand-400/60",
		cardTint: "from-white to-brand-50",
		accentText: "text-brand-700",
		glow: "bg-brand-400/25",
	},
};

export function placementMeta(placement?: WinnerPlacement) {
	return PLACEMENT_META[placement ?? 0];
}

/** Official QuackHacks result badges — used only for the overall top three. */
export const PLACEMENT_BADGE: Record<WinnerPlacement, { src: string; alt: string }> = {
	1: { src: BADGE_MAP.top_1, alt: "Golden Duck — 1st place" },
	2: { src: BADGE_MAP.top_2, alt: "Silver Quacker — 2nd place" },
	3: { src: BADGE_MAP.top_3, alt: "Bronze Beak — 3rd place" },
};

/** Per-sponsor chip styling. `text` is a tailwind class; MLH uses a gradient. */
export const SPONSOR_META: Record<
	Sponsor,
	{ chip: string; isGradientText?: boolean; chipStyle?: CSSProperties }
> = {
	QuackHacks: { chip: "bg-brand-100 border-brand-300 text-brand-800" },
	MLH: { chip: "bg-white border-neutral-300", isGradientText: true },
	Base44: {
		chip: "text-neutral-800",
		chipStyle: QH_TRACK_BADGE_STYLES.Base44,
	},
	Pipeworks: {
		chip: "",
		chipStyle: QH_TRACK_BADGE_STYLES.Pipeworks,
	},
	Google: {
		chip: "",
		chipStyle: QH_TRACK_BADGE_STYLES.Google,
	},
	MongoDB: {
		chip: "",
		chipStyle: QH_TRACK_BADGE_STYLES.MongoDB,
	},
};

/** A small sponsor pill. MLH renders with the animated tri-color text. */
export function SponsorChip({
	sponsor,
	label,
	className = "",
}: {
	sponsor: Sponsor;
	label?: string;
	className?: string;
}) {
	const meta = SPONSOR_META[sponsor];
	const displayLabel = label ?? sponsor;
	return (
		<span
			className={`inline-flex items-center h-[20px] px-2 text-[0.62rem] font-mono uppercase tracking-[0.16em] border ${meta.chip} ${className}`}
			style={meta.chipStyle}
		>
			{meta.isGradientText && !label ? (
				<span className="mlh-color-text font-bold">{displayLabel}</span>
			) : (
				displayLabel
			)}
		</span>
	);
}
