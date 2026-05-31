"use client";
import { useEffect, useRef } from "react";
import BrandIcon from "./BrandIcon";
import Link from "next/link";

const GreenQuad = ({ className }: { className: string }) => (
	<div className={className}>
		<svg viewBox="0 0 191 184" xmlns="http://www.w3.org/2000/svg">
			<path d="M0 0L22.5 162L190.5 183.5L181.5 37L0 0Z" />
		</svg>
	</div>
);

const GreenQuad2 = ({ className }: { className: string }) => (
	<svg className={className} viewBox="0 0 248 199" fill="none" xmlns="http://www.w3.org/2000/svg">
		<path d="M0 0L31.5 190L247.5 198.5L210.5 11L0 0Z" />
	</svg>
);

export default function HomeButton({ id, size = 40 }: { id?: string; size?: number }) {
	const tweakPercent = 0.15;
	const padding = size * tweakPercent;
	const extraXpad = (size * tweakPercent) / 5;

	return (
		<Link
			id={id}
			href="/"
			style={{
				paddingTop: padding,
				paddingBottom: padding,
				paddingLeft: padding + extraXpad,
				paddingRight: padding + extraXpad,
			}}
			className="flex items-center justify-center transition-colors duration-500 group bg-brand-600 hover:bg-brand-300 rounded-md"
		>
			<BrandIcon
				style={{ width: size, height: size }}
				className="bg-neutral-100 transition-colors group-hover:bg-neutral-900 block pointer-events-none"
			/>
		</Link>
	);
}
