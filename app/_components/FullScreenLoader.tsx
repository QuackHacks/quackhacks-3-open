"use client";
import { forwardRef, useEffect, useState } from "react";
import { motion, AnimatePresence, useAnimate } from "motion/react";

// original total icon
const BrandIconPure = forwardRef<SVGSVGElement, { className?: string; style?: React.CSSProperties }>(
	({ className, style }, ref) => (
		<svg
			ref={ref}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 671 550"
			fill="currentColor"
			fillRule="nonzero"
			clipRule="evenodd"
			className={className}
			style={style}
		>
			<g transform="translate(-4218.64 -2432.25) scale(4.16667)">
				<path
					d="M0 31.24a7 7 0 0 0-1.32-2.56q-.64-.84-1.72-2.13a188 188 0 0 1-4.94-6.28 426 426 0 0 0-6.06-7.75q-3.24-4.06-6.05-7.75a342 342 0 0 0-7.53-9.6q-2.17-2.76-5.07-2.8h-.09q-2.9.04-5.08 2.8l-2.66 3.32q-2.06 2.6-4.87 6.28a390 390 0 0 1-6.05 7.75q-3.24 4.06-6.05 7.75a189 189 0 0 1-4.95 6.28q-1.09 1.29-1.72 2.13a7.3 7.3 0 0 0-1.6 4.43 5.6 5.6 0 0 0 1.62 4.14 5.4 5.4 0 0 0 3.99 1.62q1.88 0 3.66-1.07 1.08-.66 1.87-1.65 1.87-2.3 4.36-5.55 2.96-3.83 6.2-7.97 3.25-4.12 6.2-7.97c1.96-2.54 3.74-4.64 5.11-6.3l.08-.08.07.07a255 255 0 0 1 4.98 6.3 854 854 0 0 0 6.2 7.98q3.25 4.14 6.2 7.97 2.5 3.26 4.36 5.55a7.2 7.2 0 0 0 5.53 2.72q2.36 0 4-1.62a5.6 5.6 0 0 0 1.6-4.15q0-.82-.28-1.87"
					transform="translate(1125.72 591.37)"
				/>
				<path
					d="M0 33.39a8 8 0 0 0-1.4-2.74q-.7-.9-1.85-2.28a203 203 0 0 1-5.28-6.7q-3-3.96-6.47-8.3-3.47-4.32-6.47-8.27a373 373 0 0 0-8.05-10.26q-2.33-2.95-5.42-3h-.1q-3.1.05-5.42 3l-2.84 3.55q-2.21 2.77-5.21 6.7-3 3.96-6.47 8.29-3.47 4.34-6.47 8.28-3 3.95-5.28 6.71-1.15 1.39-1.84 2.28a7.8 7.8 0 0 0-1.71 4.74q0 2.69 1.73 4.42a5.8 5.8 0 0 0 4.26 1.73 7.5 7.5 0 0 0 5.91-2.91q2-2.45 4.66-5.92 3.16-4.1 6.63-8.52t6.63-8.52c2.09-2.72 4-4.96 5.46-6.74l.08-.08.07.08q2.2 2.66 5.33 6.74 3.15 4.1 6.63 8.52t6.63 8.52q2.67 3.46 4.66 5.92a7.7 7.7 0 0 0 5.9 2.91q2.53 0 4.27-1.73A6 6 0 0 0 .3 35.39q0-.88-.3-2"
					transform="translate(1127.97 630.3)"
				/>
				<path
					d="M0 36.16a8 8 0 0 0-1.52-2.97q-.75-.97-2-2.47-2.48-3-5.72-7.26t-7-8.97a448 448 0 0 1-7.01-8.97A400 400 0 0 0-31.97-5.6q-2.52-3.19-5.87-3.24h-.11q-3.35.05-5.87 3.24l-3.07 3.84q-2.4 3-5.64 7.27-3.24 4.28-7 8.97-3.77 4.7-7.01 8.97a218 218 0 0 1-5.73 7.26q-1.25 1.5-2 2.47a8.4 8.4 0 0 0-1.84 5.13q0 2.91 1.88 4.79a6.3 6.3 0 0 0 4.61 1.88q2.17 0 4.24-1.24a8 8 0 0 0 2.16-1.92q2.16-2.65 5.05-6.41 3.42-4.44 7.18-9.23a976 976 0 0 0 7.17-9.23c2.27-2.93 4.33-5.36 5.92-7.3l.09-.08.07.09a301 301 0 0 1 5.77 7.3q3.42 4.45 7.18 9.22 3.75 4.8 7.18 9.23 2.88 3.75 5.04 6.41A8.3 8.3 0 0 0-6.17 45q2.75 0 4.62-1.88a6.5 6.5 0 0 0 1.88-4.79q0-.95-.33-2.16"
					transform="translate(1130.87 670.73)"
				/>
				<path
					d="M0 106.76a8 8 0 0 0-3-.51h-10.9V.51H-3A8 8 0 0 0 0 0a7 7 0 0 0 2.9-1.97 6.2 6.2 0 0 0 1.7-3.84 6 6 0 0 0-1.36-3.92 7 7 0 0 0-1.84-1.68 8.3 8.3 0 0 0-4.5-1.2h-16.54q-3.2.16-4.88 1.6a7 7 0 0 0-1.92 2.88c-.4 1-.56 2.08-.56 3.15v116.72c0 1.07.17 2.15.56 3.15a7 7 0 0 0 1.92 2.88q1.68 1.44 4.88 1.6h16.53a8.3 8.3 0 0 0 4.5-1.2 7 7 0 0 0 1.85-1.68 6 6 0 0 0 1.36-3.92 6.2 6.2 0 0 0-1.68-3.84A7 7 0 0 0 0 106.75"
					transform="translate(1039.48 596.35)"
				/>
				<path
					d="M0-106.75c.95.36 1.98.5 3 .5h10.9V-.5H3A8 8 0 0 0 0 0a7 7 0 0 0-2.9 1.97 6.2 6.2 0 0 0-1.7 3.84 6 6 0 0 0 1.36 3.92q.73.96 1.84 1.68a8.3 8.3 0 0 0 4.5 1.2h16.54q3.2-.16 4.88-1.6a7 7 0 0 0 1.92-2.88c.4-1 .56-2.08.56-3.15v-116.72c0-1.07-.17-2.15-.56-3.15a7 7 0 0 0-1.92-2.88q-1.68-1.44-4.88-1.6H3.12a8.3 8.3 0 0 0-4.5 1.2 7 7 0 0 0-1.85 1.68 6 6 0 0 0-1.36 3.92 6.2 6.2 0 0 0 1.68 3.84q1.11 1.27 2.91 1.98"
					transform="translate(1146.48 703.1)"
				/>
			</g>
		</svg>
	),
);
BrandIconPure.displayName = "BrandIconPure";

const MiddleChevrons = forwardRef<SVGSVGElement, { className?: string; style?: React.CSSProperties }>(
	({ className, style }, ref) => (
		<svg
			ref={ref}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 671 550"
			fill="currentColor"
			fillRule="nonzero"
			clipRule="evenodd"
			className={className}
			style={style}
		>
			<g transform="translate(-4218.64 -2432.25) scale(4.16667)">
				<path
					d="M0 31.24a7 7 0 0 0-1.32-2.56q-.64-.84-1.72-2.13a188 188 0 0 1-4.94-6.28 426 426 0 0 0-6.06-7.75q-3.24-4.06-6.05-7.75a342 342 0 0 0-7.53-9.6q-2.17-2.76-5.07-2.8h-.09q-2.9.04-5.08 2.8l-2.66 3.32q-2.06 2.6-4.87 6.28a390 390 0 0 1-6.05 7.75q-3.24 4.06-6.05 7.75a189 189 0 0 1-4.95 6.28q-1.09 1.29-1.72 2.13a7.3 7.3 0 0 0-1.6 4.43 5.6 5.6 0 0 0 1.62 4.14 5.4 5.4 0 0 0 3.99 1.62q1.88 0 3.66-1.07 1.08-.66 1.87-1.65 1.87-2.3 4.36-5.55 2.96-3.83 6.2-7.97 3.25-4.12 6.2-7.97c1.96-2.54 3.74-4.64 5.11-6.3l.08-.08.07.07a255 255 0 0 1 4.98 6.3 854 854 0 0 0 6.2 7.98q3.25 4.14 6.2 7.97 2.5 3.26 4.36 5.55a7.2 7.2 0 0 0 5.53 2.72q2.36 0 4-1.62a5.6 5.6 0 0 0 1.6-4.15q0-.82-.28-1.87"
					transform="translate(1125.72 591.37)"
				/>
				<path
					d="M0 33.39a8 8 0 0 0-1.4-2.74q-.7-.9-1.85-2.28a203 203 0 0 1-5.28-6.7q-3-3.96-6.47-8.3-3.47-4.32-6.47-8.27a373 373 0 0 0-8.05-10.26q-2.33-2.95-5.42-3h-.1q-3.1.05-5.42 3l-2.84 3.55q-2.21 2.77-5.21 6.7-3 3.96-6.47 8.29-3.47 4.34-6.47 8.28-3 3.95-5.28 6.71-1.15 1.39-1.84 2.28a7.8 7.8 0 0 0-1.71 4.74q0 2.69 1.73 4.42a5.8 5.8 0 0 0 4.26 1.73 7.5 7.5 0 0 0 5.91-2.91q2-2.45 4.66-5.92 3.16-4.1 6.63-8.52t6.63-8.52c2.09-2.72 4-4.96 5.46-6.74l.08-.08.07.08q2.2 2.66 5.33 6.74 3.15 4.1 6.63 8.52t6.63 8.52q2.67 3.46 4.66 5.92a7.7 7.7 0 0 0 5.9 2.91q2.53 0 4.27-1.73A6 6 0 0 0 .3 35.39q0-.88-.3-2"
					transform="translate(1127.97 630.3)"
				/>
				<path
					d="M0 36.16a8 8 0 0 0-1.52-2.97q-.75-.97-2-2.47-2.48-3-5.72-7.26t-7-8.97a448 448 0 0 1-7.01-8.97A400 400 0 0 0-31.97-5.6q-2.52-3.19-5.87-3.24h-.11q-3.35.05-5.87 3.24l-3.07 3.84q-2.4 3-5.64 7.27-3.24 4.28-7 8.97-3.77 4.7-7.01 8.97a218 218 0 0 1-5.73 7.26q-1.25 1.5-2 2.47a8.4 8.4 0 0 0-1.84 5.13q0 2.91 1.88 4.79a6.3 6.3 0 0 0 4.61 1.88q2.17 0 4.24-1.24a8 8 0 0 0 2.16-1.92q2.16-2.65 5.05-6.41 3.42-4.44 7.18-9.23a976 976 0 0 0 7.17-9.23c2.27-2.93 4.33-5.36 5.92-7.3l.09-.08.07.09a301 301 0 0 1 5.77 7.3q3.42 4.45 7.18 9.22 3.75 4.8 7.18 9.23 2.88 3.75 5.04 6.41A8.3 8.3 0 0 0-6.17 45q2.75 0 4.62-1.88a6.5 6.5 0 0 0 1.88-4.79q0-.95-.33-2.16"
					transform="translate(1130.87 670.73)"
				/>
			</g>
		</svg>
	),
);
MiddleChevrons.displayName = "MiddleChevrons";

const LeftBracket = forwardRef<SVGSVGElement, { className?: string; style?: React.CSSProperties }>(
	({ className, style }, ref) => (
		<svg
			ref={ref}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 671 550"
			fill="currentColor"
			fillRule="nonzero"
			clipRule="evenodd"
			className={className}
			style={style}
		>
			<g transform="translate(-4218.64 -2432.25) scale(4.16667)">
				<path
					d="M0 106.76a8 8 0 0 0-3-.51h-10.9V.51H-3A8 8 0 0 0 0 0a7 7 0 0 0 2.9-1.97 6.2 6.2 0 0 0 1.7-3.84 6 6 0 0 0-1.36-3.92 7 7 0 0 0-1.84-1.68 8.3 8.3 0 0 0-4.5-1.2h-16.54q-3.2.16-4.88 1.6a7 7 0 0 0-1.92 2.88c-.4 1-.56 2.08-.56 3.15v116.72c0 1.07.17 2.15.56 3.15a7 7 0 0 0 1.92 2.88q1.68 1.44 4.88 1.6h16.53a8.3 8.3 0 0 0 4.5-1.2 7 7 0 0 0 1.85-1.68 6 6 0 0 0 1.36-3.92 6.2 6.2 0 0 0-1.68-3.84A7 7 0 0 0 0 106.75"
					transform="translate(1039.48 596.35)"
				/>
			</g>
		</svg>
	),
);
LeftBracket.displayName = "LeftBracket";

const RightBracket = forwardRef<SVGSVGElement, { className?: string; style?: React.CSSProperties }>(
	({ className, style }, ref) => (
		<svg
			ref={ref}
			xmlns="http://www.w3.org/2000/svg"
			viewBox="0 0 671 550"
			fill="currentColor"
			fillRule="nonzero"
			clipRule="evenodd"
			className={className}
			style={style}
		>
			<g transform="translate(-4218.64 -2432.25) scale(4.16667)">
				<path
					d="M0-106.75c.95.36 1.98.5 3 .5h10.9V-.5H3A8 8 0 0 0 0 0a7 7 0 0 0-2.9 1.97 6.2 6.2 0 0 0-1.7 3.84 6 6 0 0 0 1.36 3.92q.73.96 1.84 1.68a8.3 8.3 0 0 0 4.5 1.2h16.54q3.2-.16 4.88-1.6a7 7 0 0 0 1.92-2.88c.4-1 .56-2.08.56-3.15v-116.72c0-1.07-.17-2.15-.56-3.15a7 7 0 0 0-1.92-2.88q-1.68-1.44-4.88-1.6H3.12a8.3 8.3 0 0 0-4.5 1.2 7 7 0 0 0-1.85 1.68 6 6 0 0 0-1.36 3.92 6.2 6.2 0 0 0 1.68 3.84q1.11 1.27 2.91 1.98"
					transform="translate(1146.48 703.1)"
				/>
			</g>
		</svg>
	),
);
RightBracket.displayName = "RightBracket";

const DEPTH_LAYERS = 8;
const DEPTH_STEP = 3;

export default function FullScreenLoading() {
	const [logoScope, animateLogo] = useAnimate();
	const [shineScope, animateShine] = useAnimate();
    const [bgScope, animateBg] = useAnimate();

	const [leftBracketScope, animateLeft] = useAnimate();
	const [rightBracketScope, animateRight] = useAnimate();
	// always start loading true
	const [isLoading, setIsLoading] = useState(false);

	useEffect(() => {
        // isMobile is also checked by LoaderGate
		const isMobile = window.matchMedia("(max-width: 767px)").matches;
		if (isMobile) return;
		if (!sessionStorage.getItem("hasSeenLoading")) {
			setIsLoading(true);
			runAnimation();
		}
	}, []);

	const wait = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
	async function runAnimation() {
		await wait(200);
		// no reason other than alias
		const logoCur = logoScope.current;
		const shineCur = shineScope.current;
		const bgCur = bgScope.current;

		const yRotate = 360 * 2 + 5;
		const xRotate = 0;

		// before peak
		animateLogo(logoCur, { rotateY: yRotate }, { duration: 1.4, ease: [0.2, 0, 0.1, 1] });
		animateLogo(logoCur, { color: "#347c45" }, { delay: 0.8, duration: 0.5, ease: "easeInOut" });
		animateBg(bgCur, { backgroundColor: "#f5f5f5" }, { delay: 1.1, duration: 0.5, ease: "backInOut" });
		await animateLogo(
			logoCur,
			{ scale: 0.65, z: 280, rotateX: xRotate + 5 },
			{ duration: 1.4, ease: [0.2, 0, 0.4, 1] },
		);
		animateShine(shineCur, { x: ["0%", "340%"] }, { duration: 2.0, ease: [0.4, 0, 0.2, 1] });
		// at peak
		animateLeft(leftBracketScope.current, { x: 0, opacity: 1 }, { duration: 0.5, ease: [0.2, 0, 0.1, 1] });
		animateRight(rightBracketScope.current, { x: 0, opacity: 1 }, { duration: 0.5, ease: [0.2, 0, 0.1, 1] });
		await animateLogo(logoCur, { rotateX: 5, rotateY: yRotate + 5 }, { duration: 2, ease: "easeIn" });

		await animateLogo(
			logoCur,
			{ rotateX: 0, rotateY: yRotate - 5, z: 0 },
			{ duration: 0.1, ease: "easeInOut" },
		);
		animateBg(bgCur, { perspective: "none" }, { delay: 0.1, duration: 0 });
		const target = document.getElementById("home-button-anchor");
		const container = bgScope.current;

		if (target && container) {
			const targetRect = target.getBoundingClientRect();
			const containerRect = container.getBoundingClientRect();

			const targetCenterX = targetRect.left + targetRect.width / 2;
			const targetCenterY = targetRect.top + targetRect.height / 2;

			const screenCenterX = containerRect.width / 2;
			const screenCenterY = containerRect.height / 2;

			const offsetX = targetCenterX - screenCenterX;
			const offsetY = targetCenterY - screenCenterY;

			const targetScale = targetRect.height / 1035;

			await animateLogo(
				logoCur,
				{
					scale: targetScale,
					x: offsetX,
					y: offsetY,
					rotateX: 0,
					rotateY: yRotate,
					z: 0,
				},
				{ duration: 0.4, ease: [0.73, -0.01, 0.15, 1] },
			);
		}

		setIsLoading(false);
		sessionStorage.setItem("hasSeenLoading", "true");
	}

	return (
		<AnimatePresence>
			{isLoading && (
				<motion.div
					ref={bgScope}
					className="fixed inset-0 flex items-center justify-center z-100 overflow-hidden"
					initial={{ opacity: 1 }}
					exit={{ opacity: 0 }}
					transition={{ duration: 0.8, ease: "easeInOut" }}
					style={{ backgroundColor: "#121212", perspective: 1200 }}
				>
					{/* normal content layer */}
					<motion.div
						ref={logoScope}
						className="relative"
						style={{
							transformStyle: "preserve-3d",
							scale: 0.2,
							z: 0,
							rotateX: 0,
							rotateY: 0,
							color: "rgb(245, 245, 245)",
						}}
					>
						{/* left bracket */}
						<motion.div
							ref={leftBracketScope}
							style={{ position: "absolute", inset: 0, x: -600, opacity: 0 }}
						>
							{[...Array(DEPTH_LAYERS)].map((_, i) => (
								<LeftBracket
									key={i}
									className="w-90 md:w-200"
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										transform: `translateZ(${-i * DEPTH_STEP}px)`,
									}}
								/>
							))}
						</motion.div>

						{/* right bracket */}
						<motion.div
							ref={rightBracketScope}
							style={{ position: "absolute", inset: 0, x: 600, opacity: 0 }}
						>
							{[...Array(DEPTH_LAYERS)].map((_, i) => (
								<RightBracket
									key={i}
									className="w-90 md:w-200"
									style={{
										position: "absolute",
										top: 0,
										left: 0,
										transform: `translateZ(${-i * DEPTH_STEP}px)`,
									}}
								/>
							))}
						</motion.div>

						{/* middle chevrons */}
						{[...Array(DEPTH_LAYERS)].map((_, i) => (
							<MiddleChevrons
								key={i}
								className="w-90 md:w-200"
								style={{
									position: i === 0 ? "relative" : "absolute",
									top: 0,
									left: 0,
									transform: `translateZ(${-i * DEPTH_STEP}px)`,
								}}
							/>
						))}
						{/* shine overlay */}
						<div className="absolute inset-0 overflow-hidden pointer-none z-10">
							<motion.div
								ref={shineScope}
								className="absolute"
								style={{
									top: "-20%",
									left: "-80%",
									width: "60%",
									height: "140%",
									background:
										"linear-gradient(105deg, transparent 20%, rgba(255,255,255,0.15) 40%, rgba(255,255,255,0.35) 50%, rgba(255,255,255,0.15) 60%, transparent 80%)",
									transform: "skewX(-20deg)",
									x: "0%",
								}}
							/>
						</div>
					</motion.div>
				</motion.div>
			)}
		</AnimatePresence>
	);
}
