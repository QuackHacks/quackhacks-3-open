"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import DuckCanvas from "./DuckCanvas";

const AUDIO_SRC = "/sounds/duck_quack.aac";

const HIDE_DELAY = 2000;
const kQuackChance = 0.2;
const QUACK_PITCH_MIN = 0.88;
const QUACK_PITCH_MAX = 1.14;
const COUNTER_OPACITY = 0.85;
const FLUSH_INTERVAL = 5000;

function synthesizeFallback(ctx: AudioContext) {
	const now = ctx.currentTime;
	const osc = ctx.createOscillator();
	const gain = ctx.createGain();
	osc.type = "sawtooth";
	osc.frequency.setValueAtTime(700, now);
	osc.frequency.exponentialRampToValueAtTime(300, now + 0.15);
	gain.gain.setValueAtTime(0, now);
	gain.gain.linearRampToValueAtTime(0.28, now + 0.015);
	gain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
	osc.connect(gain);
	gain.connect(ctx.destination);
	osc.start(now);
	osc.stop(now + 0.2);
}

export default function DuckInteractive() {
	const [clickCount, setClickCount] = useState(0);
	const [counterVisible, setCounterVisible] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);
	const audioCtxRef = useRef<AudioContext | null>(null);
	const quackBufferRef = useRef<AudioBuffer | null>(null);
	const rawBytesRef = useRef<ArrayBuffer | null>(null);
	const hideTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const mouthTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const pendingDeltaRef = useRef<number>(0);
	const flushTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
	const flushDeltaRef = useRef<(() => void) | null>(null);
	const openMouthRef = useRef<((open: boolean) => void) | null>(null);
	const handleMouthCallback = useCallback((fn: (open: boolean) => void) => {
		openMouthRef.current = fn;
	}, []);

	// Shared running flag — written by IntersectionObserver, read by DuckCanvas draw loop
	// Using a plain object so DuckCanvas reads `.current` without triggering React renders
	const runningRef = useRef<boolean>(true);
	// Callback given to us by DuckCanvas to restart its rAF loop
	const resumeLoopRef = useRef<(() => void) | null>(null);

	const flushDelta = useCallback(() => {
		// Clear the timer so the next click starts a fresh one.
		if (flushTimerRef.current) {
			clearTimeout(flushTimerRef.current);
			flushTimerRef.current = null;
		}

		const delta = pendingDeltaRef.current;
		if (delta === 0) return;
		const requestDelta = 1;
		pendingDeltaRef.current = Math.max(0, delta - requestDelta);

		fetch("/api/duck-counter", {
			method: "POST",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({ delta: requestDelta }),
		})
			.then((response) => {
				if (!response.ok) throw new Error("Failed to flush duck counter");
				return response.json() as Promise<{ count?: unknown; acceptedDelta?: unknown }>;
			})
			.then(({ count, acceptedDelta }) => {
				const accepted = typeof acceptedDelta === "number" ? acceptedDelta : requestDelta;
				const rejected = Math.max(0, requestDelta - accepted);
				if (rejected > 0) {
					pendingDeltaRef.current += rejected;
				}
				if (pendingDeltaRef.current > 0 && !flushTimerRef.current) {
					flushTimerRef.current = setTimeout(() => flushDeltaRef.current?.(), FLUSH_INTERVAL);
				}
				if (typeof count === "number") {
					setClickCount(count + pendingDeltaRef.current);
				}
			})
			.catch(() => {
				pendingDeltaRef.current += requestDelta;
				if (!flushTimerRef.current) {
					flushTimerRef.current = setTimeout(() => flushDeltaRef.current?.(), FLUSH_INTERVAL);
				}
			});
	}, []);

	useEffect(() => {
		flushDeltaRef.current = flushDelta;
		return () => {
			if (flushDeltaRef.current === flushDelta) flushDeltaRef.current = null;
		};
	}, [flushDelta]);

	useEffect(() => {
		fetch("/api/duck-counter")
			.then((r) => r.json())
			.then(({ count }) => {
				if (typeof count !== "number") return;
				// Preserve any clicks that landed before the initial fetch resolved.
				setClickCount(count + pendingDeltaRef.current);
			})
			.catch(() => {});

		fetch(AUDIO_SRC)
			.then((r) => r.arrayBuffer())
			.then((buf) => {
				rawBytesRef.current = buf;
			})
			.catch(() => {});

		// No interval on mount — the timer starts on first click.

		const handleUnload = () => flushDelta();
		window.addEventListener("beforeunload", handleUnload);

		// --- IntersectionObserver: pause canvas loop when duck scrolls off screen ---
		const io = new IntersectionObserver(
			(entries) => {
				const visible = entries[0]?.isIntersecting ?? true;
				runningRef.current = visible;
				if (visible) {
					// Restart the rAF loop — it stopped itself when paused
					resumeLoopRef.current?.();
				}
			},
			{ threshold: 0 }, // fire as soon as even 1px enters/leaves viewport
		);
		if (containerRef.current) io.observe(containerRef.current);

		return () => {
			io.disconnect();
			if (flushTimerRef.current) clearTimeout(flushTimerRef.current);
			if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
			if (mouthTimerRef.current) clearTimeout(mouthTimerRef.current);
			window.removeEventListener("beforeunload", handleUnload);
			flushDelta();
		};
	}, [flushDelta]);

	const handleResumeLoop = useCallback((resume: () => void) => {
		resumeLoopRef.current = resume;
	}, []);

	const playQuack = useCallback(async () => {
		if (Math.random() > kQuackChance) return;
		try {
			if (!audioCtxRef.current) audioCtxRef.current = new AudioContext();
			const ctx = audioCtxRef.current;
			if (ctx.state === "suspended") await ctx.resume();

			if (!quackBufferRef.current && rawBytesRef.current) {
				quackBufferRef.current = await ctx.decodeAudioData(rawBytesRef.current.slice(0));
			}

			if (quackBufferRef.current) {
				const src = ctx.createBufferSource();
				src.buffer = quackBufferRef.current;
				src.playbackRate.value = QUACK_PITCH_MIN + Math.random() * (QUACK_PITCH_MAX - QUACK_PITCH_MIN);
				src.connect(ctx.destination);
				src.start();
			} else {
				synthesizeFallback(ctx);
			}
			openMouthRef.current?.(true);
			if (mouthTimerRef.current) clearTimeout(mouthTimerRef.current);
			mouthTimerRef.current = setTimeout(() => openMouthRef.current?.(false), 300);
		} catch {
			/* audio unavailable */
		}
	}, []);

	const handleClick = useCallback(() => {
		playQuack();

		setCounterVisible(true);
		setClickCount((prev) => prev + 1);
		pendingDeltaRef.current += 1;

		// Start a 60s flush timer on first click; subsequent clicks ride the existing timer.
		if (!flushTimerRef.current) {
			flushTimerRef.current = setTimeout(flushDelta, FLUSH_INTERVAL);
		}

		if (hideTimerRef.current) clearTimeout(hideTimerRef.current);
		hideTimerRef.current = setTimeout(() => setCounterVisible(false), HIDE_DELAY);
	}, [playQuack, flushDelta]);

	return (
		<div className="flex flex-col items-center justify-center w-full h-full">
			<p
				className="text-brand-700 font-mono text-center -mb-20 z-10 text-lg pointer-events-none select-none whitespace-nowrap transition-opacity"
				style={{
					opacity: counterVisible ? COUNTER_OPACITY : 0,
				}}
			>
				clicks: <span className="font-bold text-brand-800">{clickCount.toLocaleString()}</span>
			</p>
			<div
				ref={containerRef}
				className="cursor-pointer w-full h-full flex items-center justify-center"
				onClick={handleClick}
			>
				{/* switch to see diff */}
				<div className="relative w-full top-25 -left-10 h-full active:scale-95 transition-transform duration-75 ease-out">
					<DuckCanvas runningRef={runningRef} onResumeLoop={handleResumeLoop} onMouthControl={handleMouthCallback} />
				</div>
				{/* <WebDuck
					onMouthControl={handleMouthCallback}
					runningRef={runningRef}
					onResumeLoop={handleResumeLoop}
				/> */}
			</div>
		</div>
	);
}
