"use client";
import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Landing from "./_sections/Landing";
import { ConfiguredGrid } from "./_components/ConfiguredGrid";
import PrizePoolSequence from "./_sections/PrizePool";
import Sponsors from "./_sections/Sponsors";
import FAQ from "./_sections/FAQ";
import useMediaQuery from "../_utils/useMediaQuery";
import { Banner } from "./_components/Banner";
import { kBackgroundShader } from "./_shaders/background";
import Tracks from "./_sections/Tracks";
const ShaderDiv = dynamic(() => import("@/app/_components/Shaders").then((mod) => mod.ShaderDiv), {
	ssr: false,
});

const SPLASHES = [
	"It worked on my laptop, we swear!",
	"Please don't break during demos!",
	"Powered by caffeine and prayers!",
	"It compiled on the first try... once!",
	"Works on my machine, ship it!",
	"Tested in production, sorry!",
	"99% uptime, fingers crossed!",
	"git commit -m \"final FINAL fix\"",
	"Made with love and three Red Bulls!",
	"Stack Overflow's #1 customer!",
	"Pushed to main at 3am!",
	"Held together with duct tape and dreams!",
	"Quack-driven development!",
	"We're all just console.log-ing here!",
	"Ducks debug rubber ducks!",
	"Sponsored by npm install!",
];

export default function HomePage() {
	const sidebarTriggerRef = useRef<HTMLDivElement>(null);
	const bannerRef = useRef<HTMLElement>(null);
	const prizePoolRef = useRef<HTMLDivElement>(null);
	const shaderRef = useRef<HTMLDivElement>(null);
	const shaderHideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const shaderActiveRef = useRef(false);
	const bannerHiddenRef = useRef(false);
	const isMdOrGreater = useMediaQuery("md");

	const [isShaderActive, setIsShaderActive] = useState(false);
	const [shouldMountPrizePool, setShouldMountPrizePool] = useState(false);
	const [splash, setSplash] = useState<string | null>(null);

	useEffect(() => {
		setSplash(SPLASHES[Math.floor(Math.random() * SPLASHES.length)]);
	}, []);

	// Lazy-mount PrizePool with 400px lead time
	useEffect(() => {
		const prizeEl = prizePoolRef.current;
		if (!prizeEl) return;

		const observer = new IntersectionObserver(
			(entries) => {
				for (const entry of entries) {
					if (!entry.isIntersecting) continue;
					if (entry.target === prizeEl) {
						setShouldMountPrizePool(true);
						observer.unobserve(prizeEl);
					}
				}
			},
			{ rootMargin: "400px 0px" },
		);

		observer.observe(prizeEl);

		return () => observer.disconnect();
	}, []);

	// Scroll handler: banner visibility + shader visibility
	useEffect(() => {
		const setBannerVisibility = (hide: boolean) => {
			if (hide === bannerHiddenRef.current) return;
			bannerHiddenRef.current = hide;
			if (bannerRef.current) {
				bannerRef.current.style.opacity = hide ? "0" : "1";
				bannerRef.current.style.pointerEvents = hide ? "none" : "auto";
			}
		};

		const setShaderVisible = (visible: boolean) => {
			const el = shaderRef.current;
			if (!el) return;
			if (shaderHideTimerRef.current) {
				clearTimeout(shaderHideTimerRef.current);
				shaderHideTimerRef.current = null;
			}
			if (visible) {
				el.style.visibility = "visible";
				el.style.opacity = "1";
			} else {
				el.style.opacity = "0";
				shaderHideTimerRef.current = setTimeout(() => {
					if (el) el.style.visibility = "hidden";
				}, 2000);
			}
		};

		const updateShader = () => {
			if (!shouldMountPrizePool) {
				setShaderVisible(false);
				if (shaderActiveRef.current) {
					shaderActiveRef.current = false;
					setIsShaderActive(false);
				}
				return;
			}
			if (!prizePoolRef.current || !shaderRef.current) return;
			const rect = prizePoolRef.current.getBoundingClientRect();
			const visible = rect.top < window.innerHeight && rect.bottom > 0;
			setShaderVisible(visible);
			if (shaderActiveRef.current !== visible) {
				shaderActiveRef.current = visible;
				setIsShaderActive(visible);
			}
		};

		const updateBanner = () => {
			if (!sidebarTriggerRef.current) return;
			setBannerVisibility(sidebarTriggerRef.current.getBoundingClientRect().top < 0);
		};

		let ticking = false;
		const onScroll = () => {
			if (!ticking) {
				window.requestAnimationFrame(() => {
					updateBanner();
					updateShader();
					ticking = false;
				});
				ticking = true;
			}
		};

		updateBanner();
		updateShader();
		window.addEventListener("scroll", onScroll, { passive: true });
		return () => {
			window.removeEventListener("scroll", onScroll);
			if (shaderHideTimerRef.current) clearTimeout(shaderHideTimerRef.current);
		};
	}, [shouldMountPrizePool]);

	return (
		<>
			<Banner containerRef={bannerRef} vertical={isMdOrGreater} />
			<div
				ref={shaderRef}
				className="-z-20 pointer-events-none bg-white ease-in-out transition-opacity w-screen h-screen duration-2000 fixed top-0"
				style={{ willChange: "opacity", opacity: 0, visibility: "hidden" }}
			>
				<ShaderDiv
					active={isShaderActive}
					deactivateDelay={2000}
					dpr={0.25}
					imageRendering="auto"
					fragmentShader={kBackgroundShader}
					className="opacity-20 h-screen"
				/>
			</div>
			{/* page content */}
			<div className="flex flex-col mb-20">
				<Landing />
				<div ref={sidebarTriggerRef} className="h-10 w-full" />
				<div ref={prizePoolRef}>
					{shouldMountPrizePool ? <PrizePoolSequence /> : <div className="h-[420vh]" aria-hidden />}
				</div>
				<Sponsors />
				<Tracks />
				<div className="relative">
					<div
						className="absolute inset-0 -z-10 overflow-hidden"
						style={{
							maskImage: "linear-gradient(to bottom, transparent 40%, black 90%, transparent 99%)",
							WebkitMaskImage: "linear-gradient(to bottom, transparent 40%, black 90%, transparent 99%)",
						}}
					>
						<ConfiguredGrid
							cols={22}
							rows={19}
							cellSize={81}
							strokeColor="#a3a3a3"
							strokeWidth={1}
							filledCells={{}}
						/>
					</div>
					<FAQ />
				</div>
			</div>
		</>
	);
}
