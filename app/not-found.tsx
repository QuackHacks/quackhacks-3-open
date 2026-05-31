"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const kGlitchChars = "!<>-_\\/[]{}—=+*^?#@$%&";

function useGlitchText(target: string, delay = 0) {
	const [displayed, setDisplayed] = useState("");
	const [done, setDone] = useState(false);

	useEffect(() => {
		let frame = 0;
		const timeout: ReturnType<typeof setTimeout> = setTimeout(() => {
			const interval = setInterval(() => {
				frame++;
				if (frame > target.length * 3) {
					setDisplayed(target);
					setDone(true);
					clearInterval(interval);
					return;
				}
				setDisplayed(
					target
						.split("")
						.map((char, i) => {
							if (i < Math.floor(frame / 3)) return char;
							if (char === " ") return " ";
							return kGlitchChars[Math.floor(Math.random() * kGlitchChars.length)];
						})
						.join(""),
				);
			}, 40);
			return () => clearInterval(interval);
		}, delay);

		return () => clearTimeout(timeout);
	}, [target, delay]);

	return { displayed, done };
}

const kBottomMessages = [
	"Bribing the servers...",
	"Untangling the ethernet cables...",
	"Feeding the hamsters that power our servers...",
	"Asking ChatGPT for help...",
	"Blaming the intern...",
	"Googling the error...",
	"Trying to find the any key...",
	"Have you tried turning it off and on again?",
	"Downloading more RAM...",
	"I blame it on the other guy.",
	"What are we doing dude.",
	"[Player] was lost to the void.",
	"I don' think we're supposed to be here.",
];

const kFakeTrace = [
	"  at findPage (webpack://quackhacks/.next/chunks/pages.js:404:1)",
	"  at Router.navigate (webpack://quackhacks/.next/router.js:69:42)",
	"  at Object.push (webpack://quackhacks/.next/router.js:12:8)",
	"  at <anonymous>:1:1",
];

export default function Page404() {
	const title = useGlitchText("PAGE NOT FOUND", 100);
	const sub = useGlitchText("the page you requested doesn't exist", 10);

	const [visibleLines, setVisibleLines] = useState(0);
	const [showCursor, setShowCursor] = useState(true);
	const [showButton, setShowButton] = useState(false);

	const [randomMessage, setRandomMessage] = useState("booting systems");

	useEffect(() => {
		setRandomMessage(kBottomMessages[Math.floor(Math.random() * kBottomMessages.length)]);
	}, []);

	useEffect(() => {
		if (!sub.done) return;
		let i = 0;
		const interval = setInterval(() => {
			i++;
			setVisibleLines(i);
			if (i >= kFakeTrace.length) {
				clearInterval(interval);
				setTimeout(() => setShowButton(true), 400);
			}
		}, 180);
		return () => clearInterval(interval);
	}, [sub.done]);

	useEffect(() => {
		const interval = setInterval(() => setShowCursor((c) => !c), 530);
		return () => clearInterval(interval);
	}, []);

	const pathname = usePathname();

	return (
		<div className="w-screen h-screen bg-neutral-100 flex items-center justify-center p-6 overflow-hidden relative">
			<div
				className="pointer-events-none absolute inset-0 opacity-[0.07]"
				style={{
					backgroundImage:
						"linear-gradient(var(--color-brand-500) 1px, transparent 1px), linear-gradient(90deg, var(--color-brand-500) 1px, transparent 1px)",
					backgroundSize: "32px 32px",
					maskImage: "linear-gradient(to bottom left, black 20%, transparent 70%)",
					WebkitMaskImage: "linear-gradient(to bottom left, black 20%, transparent 70%)",
				}}
			/>

			<div className="pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-150 h-100 rounded-full bg-brand-500/8 blur-[120px]" />

			<div className="relative z-20 w-full max-w-2xl font-mono">
				{/* terminal chrome */}
				<div className="flex items-center gap-2 mb-3 px-1">
					<div className="w-3 h-3 rounded-full bg-red-400" />
					<div className="w-3 h-3 rounded-full bg-yellow-400" />
					<div className="w-3 h-3 rounded-full bg-green-400" />
					<span className="ml-3 text-neutral-400 text-xs tracking-widest">qhterm - 80x24</span>
				</div>

				{/* terminal body */}
				<div className="border border-neutral-300 bg-white/80 backdrop-blur-sm rounded-lg p-6 md:p-8 shadow-xl shadow-neutral-200/80">
					{/* prompt line */}
					<p className="text-neutral-400 text-sm mb-4">
						<span className="text-brand-600 font-liebling font-bold">quackhacks</span>
						<span className="text-neutral-400">:</span>
						<span className="text-brand-400">~</span>
						<span className="text-neutral-400">$ </span>
						<span className="text-neutral-600">{pathname}</span>
					</p>

					{/* error header */}
					<div className="mb-5">
						<p className="text-red-400 text-xs tracking-widest uppercase mb-2">✗ Unhandled-Route-Error</p>
						<h1
							className="text-brand-700 font-bold leading-none mb-1"
							style={{ fontSize: "clamp(2rem, 8vw, 4rem)", letterSpacing: "-0.02em" }}
						>
							{title.displayed}
							{!title.done && (
								<span className={`${showCursor ? "opacity-100" : "opacity-0"} transition-opacity`}>▌</span>
							)}
						</h1>
						<p className="text-neutral-500 text-sm mt-3">
							{sub.displayed}
							{title.done && !sub.done && (
								<span className={`${showCursor ? "opacity-100" : "opacity-0"} transition-opacity`}>▌</span>
							)}
						</p>
					</div>

					{/* fake stack trace */}
					{visibleLines > 0 && (
						<div className="border-t border-neutral-200 pt-4 mb-5">
							<p className="text-neutral-400 text-xs mb-2 uppercase tracking-widest">Stack Trace</p>
							<div className="space-y-1">
								{kFakeTrace.slice(0, visibleLines).map((line, i) => (
									<p key={i} className="text-neutral-400 text-xs leading-relaxed">
										{i === 0 ? (
											<>
												<span className="text-red-400">→ </span>
												{line}
											</>
										) : (
											line
										)}
									</p>
								))}
							</div>
						</div>
					)}

					<div className="flex flex-col sm:flex-row items-start sm:items-center gap-4 mt-2">
						<Link
							href="/"
							className="group inline-flex items-center gap-2 bg-brand-500 hover:bg-brand-500/20 border border-brand-500/30 hover:border-brand-500/60 text-brand-50 hover:text-brand-600 text-sm px-4 py-2 rounded transition-all duration-200"
						>
							$ Go to HomePage
						</Link>
						<p className="text-neutral-400 text-xs">
							exit code 404{" "}
							<span
								className={`${showCursor ? "opacity-100" : "opacity-0"} transition-opacity text-brand-500`}
							>
								▌
							</span>
						</p>
					</div>
				</div>

				{/* bottom hint */}
				<p className="text-center text-neutral-400 text-xs mt-4 tracking-widest uppercase">{randomMessage}</p>
			</div>
		</div>
	);
}
