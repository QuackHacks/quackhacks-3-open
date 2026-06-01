"use client";

import { useEffect, useRef } from "react";
import DuckClosedMouth from "../../_assets/elements/duckClosed.webp";

const CANVAS_SIZE = 640;
const TARGET_FPS = 30;
const FRAME_MS = 1000 / TARGET_FPS;

const CELL_SIZE = 8;
const FONT_SIZE = 11;
const DUCK_RENDER_WIDTH = 560;
const DUCK_SCALE = 0.9;
const DUCK_SHIFT_U = 0.02;
const DUCK_SHIFT_V = 0;
const DUCK_COLOR = "#347c45";

const BG_REMOVE_THRESHOLD = 12;
const BG_REMOVE_SOFTNESS = 140;
const ALPHA_CUT = 24;
const CROP_ALPHA_CUT = 8;
const CROP_PAD = 4;

const FILL_RAMP = "·•:=+▪■*%░▒▓█";
const OUTLINE_RAMP = "▏╎┆│┃▌█";
const QUACK_TEXT = "quack!";
const QUACK_FONT = "700 21px Arial, Helvetica, sans-serif";
const QUACK_TOTAL_MS = 780;
const QUACK_FADE_IN_MS = 80;
const QUACK_HOLD_MS = 220;
const QUACK_DRIFT_PX = 52;

const clamp01 = (value: number) => Math.max(0, Math.min(1, value));

interface DuckCanvasPassiveProps {
	onQuackControl?: (triggerFn: () => void) => void;
	screenShiftU?: number;
	screenShiftV?: number;
}

interface PreparedDuck {
	data: ImageData;
	width: number;
	height: number;
}

interface QuackParticle {
	spawnTime: number;
	baseX: number;
	baseY: number;
}

function sampleCornerBackground(image: ImageData) {
	const sampleSize = 6;
	const points: Array<[number, number]> = [
		[0, 0],
		[image.width - sampleSize, 0],
		[0, image.height - sampleSize],
		[image.width - sampleSize, image.height - sampleSize],
	];
	let r = 0;
	let g = 0;
	let b = 0;
	let count = 0;

	for (const [startX, startY] of points) {
		for (let y = 0; y < sampleSize; y++) {
			for (let x = 0; x < sampleSize; x++) {
				const px = Math.min(image.width - 1, startX + x);
				const py = Math.min(image.height - 1, startY + y);
				const i = (py * image.width + px) * 4;
				if (image.data[i + 3] < 200) continue;
				r += image.data[i];
				g += image.data[i + 1];
				b += image.data[i + 2];
				count++;
			}
		}
	}

	return count < 10 ? null : { r: r / count, g: g / count, b: b / count };
}

function removeBackground(image: ImageData) {
	const bg = sampleCornerBackground(image);
	if (!bg) return;

	for (let i = 0; i < image.data.length; i += 4) {
		if (image.data[i + 3] === 0) continue;
		const dr = image.data[i] - bg.r;
		const dg = image.data[i + 1] - bg.g;
		const db = image.data[i + 2] - bg.b;
		const distance = Math.sqrt(dr * dr + dg * dg + db * db);
		image.data[i + 3] = Math.round(
			image.data[i + 3] * clamp01((distance - BG_REMOVE_THRESHOLD) / BG_REMOVE_SOFTNESS),
		);
	}
}

function cropToAlpha(ctx: CanvasRenderingContext2D, image: ImageData) {
	let minX = image.width;
	let minY = image.height;
	let maxX = -1;
	let maxY = -1;

	for (let y = 0; y < image.height; y++) {
		for (let x = 0; x < image.width; x++) {
			if (image.data[(y * image.width + x) * 4 + 3] <= CROP_ALPHA_CUT) continue;
			minX = Math.min(minX, x);
			minY = Math.min(minY, y);
			maxX = Math.max(maxX, x);
			maxY = Math.max(maxY, y);
		}
	}

	if (maxX < 0 || maxY < 0) return image;

	const x = Math.max(0, minX - CROP_PAD);
	const y = Math.max(0, minY - CROP_PAD);
	const width = Math.min(image.width - x, maxX - x + CROP_PAD + 1);
	const height = Math.min(image.height - y, maxY - y + CROP_PAD + 1);

	return ctx.getImageData(x, y, width, height);
}

function prepareDuckImage(img: HTMLImageElement): PreparedDuck | null {
	const aspect = img.naturalWidth / Math.max(1, img.naturalHeight);
	const width = DUCK_RENDER_WIDTH;
	const height = Math.round(width / aspect);
	const canvas = document.createElement("canvas");
	canvas.width = width;
	canvas.height = height;

	const ctx = canvas.getContext("2d", { willReadFrequently: true });
	if (!ctx) return null;

	ctx.drawImage(img, 0, 0, width, height);
	const image = ctx.getImageData(0, 0, width, height);
	removeBackground(image);
	ctx.putImageData(image, 0, 0);

	const cropped = cropToAlpha(ctx, image);
	return {
		data: cropped,
		width: cropped.width,
		height: cropped.height,
	};
}

function alphaAt(duck: PreparedDuck, x: number, y: number) {
	return duck.data.data[(y * duck.width + x) * 4 + 3];
}

function isEdgePixel(duck: PreparedDuck, x: number, y: number) {
	const left = alphaAt(duck, Math.max(0, x - 1), y);
	const right = alphaAt(duck, Math.min(duck.width - 1, x + 1), y);
	const top = alphaAt(duck, x, Math.max(0, y - 1));
	const bottom = alphaAt(duck, x, Math.min(duck.height - 1, y + 1));
	return left < 10 || right < 10 || top < 10 || bottom < 10;
}

function rampChar(ramp: string, value: number) {
	return ramp[Math.max(0, Math.min(ramp.length - 1, Math.floor(value * (ramp.length - 1))))];
}

export default function DuckCanvasPassive({
	onQuackControl,
	screenShiftU = 0,
	screenShiftV = 0,
}: DuckCanvasPassiveProps = {}) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const quackControlRef = useRef(onQuackControl);

	useEffect(() => {
		quackControlRef.current = onQuackControl;
	}, [onQuackControl]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const ctx = canvas.getContext("2d", { alpha: true });
		if (!ctx) return;

		let duck: PreparedDuck | null = null;
		let rafId: number | null = null;
		let lastFrame = 0;
		const quacks: QuackParticle[] = [];

		const resize = () => {
			const dpr = Math.min(window.devicePixelRatio || 1, 2);
			canvas.width = CANVAS_SIZE * dpr;
			canvas.height = CANVAS_SIZE * dpr;
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			ctx.imageSmoothingEnabled = false;
		};

		const triggerQuack = () => {
			quacks.push({
				spawnTime: performance.now(),
				baseX: CANVAS_SIZE * 0.42,
				baseY: CANVAS_SIZE * 0.46,
			});
		};

		const drawQuacks = (now: number) => {
			if (quacks.length === 0) return;

			ctx.fillStyle = DUCK_COLOR;
			ctx.font = QUACK_FONT;
			ctx.textAlign = "left";
			ctx.textBaseline = "middle";

			for (let i = quacks.length - 1; i >= 0; i--) {
				const quack = quacks[i];
				const age = now - quack.spawnTime;
				if (age >= QUACK_TOTAL_MS) {
					quacks.splice(i, 1);
					continue;
				}

				const holdEnd = QUACK_FADE_IN_MS + QUACK_HOLD_MS;
				const alpha =
					age < QUACK_FADE_IN_MS
						? age / QUACK_FADE_IN_MS
						: age < holdEnd
							? 1
							: 1 - (age - holdEnd) / (QUACK_TOTAL_MS - holdEnd);

				ctx.globalAlpha = clamp01(alpha);
				ctx.fillText(QUACK_TEXT, quack.baseX, quack.baseY - (age / QUACK_TOTAL_MS) * QUACK_DRIFT_PX);
			}

			ctx.globalAlpha = 1;
		};

		const drawDuck = (now: number) => {
			if (!duck) return;

			const data = duck.data.data;
			const duckAspect = duck.width / Math.max(1, duck.height);
			const drawWidth = CANVAS_SIZE * DUCK_SCALE;
			const drawHeight = drawWidth / duckAspect;
			const originX = (CANVAS_SIZE - drawWidth) * 0.5;
			const originY = (CANVAS_SIZE - drawHeight) * 0.5;
			const time = now * 0.0032;

			ctx.fillStyle = DUCK_COLOR;
			ctx.font = `bold ${FONT_SIZE}px ui-monospace, Menlo, monospace`;
			ctx.textAlign = "center";
			ctx.textBaseline = "middle";

			for (let y = 0; y < CANVAS_SIZE; y += CELL_SIZE) {
				const v = y / CANVAS_SIZE;
				const bottomFade = v < 0.55 ? 1 : Math.pow(clamp01(1 - (v - 0.55) / 0.45), 2.5);

				for (let x = 0; x < CANVAS_SIZE; x += CELL_SIZE) {
					const u = x / CANVAS_SIZE;
					const localU = (x - originX) / drawWidth + screenShiftU + DUCK_SHIFT_U;
					const localV = (y - originY) / drawHeight + screenShiftV + DUCK_SHIFT_V;
					if (localU < 0 || localU > 1 || localV < 0 || localV > 1) continue;

					const sx = Math.min(duck.width - 1, Math.max(0, Math.floor(localU * duck.width)));
					const sy = Math.min(duck.height - 1, Math.max(0, Math.floor(localV * duck.height)));
					const pixel = (sy * duck.width + sx) * 4;
					const alpha = data[pixel + 3];
					if (alpha < ALPHA_CUT) continue;

					const lum = (0.2126 * data[pixel] + 0.7152 * data[pixel + 1] + 0.0722 * data[pixel + 2]) / 255;
					const wave = Math.sin((u + v) * 18 + time) * 0.08;
					const tone = clamp01(lum * 0.9 + wave + 0.04);
					const edge = isEdgePixel(duck, sx, sy);
					const vignette = clamp01(1.15 - Math.hypot(u - 0.5, v - 0.5) * 1.35);

					ctx.globalAlpha = (alpha / 255) * bottomFade * vignette * (edge ? 0.95 : 1);
					ctx.fillText(rampChar(edge ? OUTLINE_RAMP : FILL_RAMP, tone), x, y);
				}
			}

			ctx.globalAlpha = 1;
		};

		const draw = (now: number) => {
			rafId = null;
			if (document.visibilityState === "hidden") return;

			if (now - lastFrame < FRAME_MS) {
				rafId = requestAnimationFrame(draw);
				return;
			}
			lastFrame = now;

			ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE);
			drawDuck(now);
			drawQuacks(now);

			rafId = requestAnimationFrame(draw);
		};

		const resume = () => {
			if (document.visibilityState === "visible" && rafId === null) {
				rafId = requestAnimationFrame(draw);
			}
		};

		resize();
		quackControlRef.current?.(triggerQuack);
		document.addEventListener("visibilitychange", resume);

		const image = new Image();
		image.onload = () => {
			duck = prepareDuckImage(image);
			resume();
		};
		image.onerror = () => {
			console.warn("DuckCanvasPassive: failed to load duck image");
		};
		image.src = DuckClosedMouth.src;

		resume();

		return () => {
			if (rafId !== null) cancelAnimationFrame(rafId);
			document.removeEventListener("visibilitychange", resume);
			image.onload = null;
			image.onerror = null;
		};
	}, [screenShiftU, screenShiftV]);

	return (
		<canvas
			ref={canvasRef}
			className="pointer-events-none absolute left-1/2 top-1/2 aspect-square h-full max-h-full max-w-full -translate-x-1/2 -translate-y-1/2"
			style={{ width: "auto" }}
		/>
	);
}
