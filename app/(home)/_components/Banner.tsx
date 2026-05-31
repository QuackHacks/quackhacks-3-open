"use client";
import type { RefObject } from "react";

const TEXT = "@ The University of Oregon";

export function Banner({
	containerRef,
	vertical,
}: {
	containerRef: RefObject<HTMLElement | null>;
	vertical?: boolean;
}) {
	if (vertical) {
		return (
			<aside
				ref={containerRef}
				className="transition-opacity duration-300 z-20 fixed font-instrument-serif shadow-xl/30 inset-y-0 w-24 right-0 bg-brand-900 text-white overflow-hidden"
			>
				<div className="animate-scroll-banner-vertical">
					{[...Array(3)].map((_, i) => (
						<div
							key={i}
							className="flex flex-col items-center justify-center py-6"
							aria-hidden={i > 0}
						>
							<h2 className="[writing-mode:vertical-rl] rotate-0 whitespace-nowrap text-4xl md:text-7xl tracking-wide">
								{TEXT}
							</h2>
							<div className="bg-white w-[75%] h-0.5 mt-10" />
						</div>
					))}
				</div>
			</aside>
		);
	}

	return (
		<aside
			ref={containerRef}
			className="transition-opacity duration-300 z-20 fixed bottom-0 font-instrument-serif inset-x-0 w-full h-fit py-2 bg-brand-900 text-white overflow-hidden"
		>
			<div className="flex flex-nowrap w-max animate-scroll-banner-horizontal">
				{[...Array(2)].map((_, i) => (
					<div
						key={i}
						className="flex flex-row items-center justify-center px-6"
						aria-hidden={i > 0}
					>
						<h2 className="rotate-0 whitespace-nowrap text-4xl md:text-7xl tracking-wide">
							{TEXT}
						</h2>
						<div className="bg-white w-0.5 h-[75%] ml-10" />
					</div>
				))}
			</div>
		</aside>
	);
}
