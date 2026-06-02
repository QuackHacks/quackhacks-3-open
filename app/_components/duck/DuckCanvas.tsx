"use client";

import { useEffect, useRef } from "react";
import DuckClosedMouth from "../../_assets/elements/duckClosed.png";
import DuckOpenMouth from "../../_assets/elements/duckOpen.png";

// ─── Tunable constants ────────────────────────────────────────────────────────
const CELL_STEP_SM = 5,
	CELL_STEP_MD = 6,
	CELL_STEP_LG = 7;
const CELL_FONT_SM = 8,
	CELL_FONT_MD = 9,
	CELL_FONT_LG = 10;

const DUCK_RENDER_MIN_W = 420,
	DUCK_RENDER_MAX_W = 980;
const DUCK_RENDER_PANEL = 0.46,
	DUCK_RENDER_SCALE = 1.35;
const DUCK_RENDER_SCALE_LOW = 1.15,
	DUCK_RENDER_SCALE_ULTRA_LOW = 1.0;

const BG_REMOVE_THRESHOLD = 12,
	BG_REMOVE_SOFTNESS = 140;
const ALPHA_CROP_CUT = 8,
	ALPHA_CROP_PAD = 4,
	MASK_DILATE_RADIUS = 6;

const SCREEN_SHIFT_U_SM = 0.028,
	SCREEN_SHIFT_U_MD = 0.06,
	SCREEN_SHIFT_U_LG = 0.102;
const SCREEN_SHIFT_V_SM = 0.07,
	SCREEN_SHIFT_V_MD = 0.062,
	SCREEN_SHIFT_V_LG = 0.082;
const SOURCE_SHIFT_U = 0.02,
	SOURCE_SHIFT_V = 0.0;

const DUCK_SCALE_V_SM = 0.78,
	DUCK_SCALE_V_MD = 0.82,
	DUCK_SCALE_V_LG = 0.86;
const DUCK_SCALE_U_SM = 0.96,
	DUCK_SCALE_U_MD = 0.95,
	DUCK_SCALE_U_LG = 0.995;

const RENDER_PANEL_W_SM = 0.7,
	RENDER_PANEL_W_MD = 0.74,
	RENDER_PANEL_W_LG = 1.0;

const FADE_START_SM = 0.36,
	FADE_END_SM = 0.98;
const FADE_START_MD = 0.42,
	FADE_END_MD = 0.99;
const FADE_START_LG = 0.48,
	FADE_END_LG = 1.0;

const VIGNETTE_INNER = 0.38,
	VIGNETTE_WIDTH = 0.28;
const PARALLAX_U = 0.012,
	PARALLAX_V = 0.01;

const T_STEP = 0.035,
	WAVE_SPATIAL = 0.015,
	WAVE_UV_FREQ = 6;
const WAVE_TIME_FREQ = 3.2,
	RIPPLE_DIST_SCALE = 30.0,
	RIPPLE_RADIUS = 0.22;
const RIPPLE_WAVE_MIX = 0.8,
	MOUSE_LIFT = 0.12;
const LUM_MIX = 0.85,
	WAVE_MIX = 0.15,
	MOUSE_LERP = 0.18;
const ENERGY_DECAY = 0.92,
	ENERGY_SPEED_SCALE = 12;
const FRAME_MS_LOW_POWER = 33;
const DPR_CAP_DEFAULT = 1.75,
	DPR_CAP_LOW_POWER = 1.25,
	DPR_CAP_ULTRA_LOW = 1.0;

const ALPHA_CUT = 24;
const ALPHA_LEVELS = 16;
const EDGE_ALPHA_SCALE = 0.95;
const FILL_RAMP = "·•:=+▪■*%░▒▓█";
const OUTLINE_RAMP = "▏╎┆│┃▌█";
const DUCK_COLOR = "#347c45";
const QUACK_FONT = "700 21px Arial, Helvetica, sans-serif";
const QUACK_TEXT = "quack!";
const QUACK_X_SM = 0.32,
	QUACK_X_LG = 0.42;
const QUACK_Y_SM = 0.48,
	QUACK_Y_LG = 0.46;
const QUACK_DURATION_MS = 170;
const QUACK_FADE_IN_MS = 80;
const QUACK_HOLD_MS = 220;
const QUACK_FADE_OUT_MS = 480;
const QUACK_TOTAL_MS = QUACK_FADE_IN_MS + QUACK_HOLD_MS + QUACK_FADE_OUT_MS;
const QUACK_DRIFT_PX = 52;

// ─── Module-level precomputation ──────────────────────────────────────────────
const clamp01 = (v: number) => (v < 0 ? 0 : v > 1 ? 1 : v);

const allChars = Array.from(new Set((OUTLINE_RAMP + FILL_RAMP).split(""))).filter((c) => c !== " ");
const charIndex = new Map<string, number>();
allChars.forEach((c, i) => charIndex.set(c, i));
const NC = allChars.length;

const lumaR = new Uint16Array(256);
const lumaG = new Uint16Array(256);
const lumaB = new Uint16Array(256);
for (let i = 0; i < 256; i++) {
	lumaR[i] = 218 * i;
	lumaG[i] = 732 * i;
	lumaB[i] = 74 * i;
}

const fillLen = FILL_RAMP.length,
	outlineLen = OUTLINE_RAMP.length;
const fillCharIdx = new Int16Array(256);
const outlineCharIdx = new Int16Array(256);
for (let i = 0; i < 256; i++) {
	const tone = i / 255;
	const fi = Math.max(0, Math.min(fillLen - 1, Math.floor(tone * (fillLen - 1))));
	const oi = Math.max(0, Math.min(outlineLen - 1, Math.floor(tone * (outlineLen - 1))));
	const fc = FILL_RAMP[fi];
	fillCharIdx[i] = fc === " " ? -1 : (charIndex.get(fc) ?? -1);
	outlineCharIdx[i] = charIndex.get(OUTLINE_RAMP[oi]) ?? -1;
}

// Precomputed sin table — avoid Math.sin in hot loop
const SIN_TABLE_SIZE = 4096;
const SIN_TABLE_MASK = SIN_TABLE_SIZE - 1;
const SIN_TABLE = new Float32Array(SIN_TABLE_SIZE);
const TWO_PI = Math.PI * 2;
for (let i = 0; i < SIN_TABLE_SIZE; i++) SIN_TABLE[i] = Math.sin((i / SIN_TABLE_SIZE) * TWO_PI);
const fastSin = (x: number) => {
	const idx = ((x / TWO_PI) * SIN_TABLE_SIZE) & SIN_TABLE_MASK;
	return SIN_TABLE[idx < 0 ? idx + SIN_TABLE_SIZE : idx];
};

// Precomputed sqrt table for mouse distance (256 entries covers 0..1 range)
const SQRT_TABLE_SIZE = 1024;
const SQRT_TABLE = new Float32Array(SQRT_TABLE_SIZE);
for (let i = 0; i < SQRT_TABLE_SIZE; i++) SQRT_TABLE[i] = Math.sqrt(i / SQRT_TABLE_SIZE);
const fastSqrt01 = (x: number) => {
	if (x <= 0) return 0;
	if (x >= 1) return 1;
	return SQRT_TABLE[(x * SQRT_TABLE_SIZE) | 0];
};

// ─── Glyph Atlas ──────────────────────────────────────────────────────────────
// Pre-renders every (char × alpha) combination into an offscreen canvas.
// draw() then uses drawImage() instead of fillText() — 5-20× faster.
interface GlyphAtlas {
	canvas: OffscreenCanvas | HTMLCanvasElement;
	sourceGlyphW: number;
	sourceGlyphH: number;
	drawGlyphW: number;
	drawGlyphH: number;
	// atlas layout: columns = NC chars
	// glyph at charIdx starts at source x = charIdx * sourceGlyphW
}

function buildGlyphAtlas(cellFont: number, dpr: number): GlyphAtlas {
	const drawGlyphW = cellFont + 2;
	const drawGlyphH = cellFont + 2;
	const sourceGlyphW = Math.ceil(drawGlyphW * dpr);
	const sourceGlyphH = Math.ceil(drawGlyphH * dpr);
	const atlasW = NC * sourceGlyphW;
	const atlasH = sourceGlyphH; // Only 1 row needed now (Opaque)

	const useOffscreen = typeof OffscreenCanvas !== "undefined";
	const atlasCanvas = useOffscreen ? new OffscreenCanvas(atlasW, atlasH) : document.createElement("canvas");
	if (!useOffscreen) {
		(atlasCanvas as HTMLCanvasElement).width = atlasW;
		(atlasCanvas as HTMLCanvasElement).height = atlasH;
	}
	const actx = atlasCanvas.getContext("2d", { alpha: true }) as any;

	// Disable smoothing for sharp edges
	actx.imageSmoothingEnabled = false;
	actx.setTransform(dpr, 0, 0, dpr, 0, 0);
	actx.font = `bold ${cellFont}px ui-monospace, Menlo, monospace`;
	actx.textAlign = "center";
	actx.textBaseline = "middle";
	actx.fillStyle = DUCK_COLOR;

	// Draw each character once at 100% opacity
	for (let ci = 0; ci < NC; ci++) {
		actx.fillText(allChars[ci], ci * drawGlyphW + drawGlyphW / 2, drawGlyphH / 2);
	}

	return { canvas: atlasCanvas, sourceGlyphW, sourceGlyphH, drawGlyphW, drawGlyphH };
}

// ─── Component ────────────────────────────────────────────────────────────────

interface DuckCanvasProps {
	runningRef?: React.RefObject<boolean>;
	onResumeLoop?: (resume: () => void) => void;
	onMouthControl?: (fn: (open: boolean) => void) => void;
	screenShiftU?: number;
	screenShiftV?: number;
}

export default function DuckCanvas({
	runningRef,
	onResumeLoop,
	onMouthControl,
	screenShiftU: shiftUOverride,
	screenShiftV: shiftVOverride,
}: DuckCanvasProps = {}) {
	const canvasRef = useRef<HTMLCanvasElement | null>(null);
	const rafRef = useRef<number | null>(null);
	const quackTimeoutRef = useRef<number | null>(null);
	const onResumLoopRef = useRef(onResumeLoop);
	const onMouthControlRef = useRef(onMouthControl);
	useEffect(() => {
		onResumLoopRef.current = onResumeLoop;
	}, [onResumeLoop]);
	useEffect(() => {
		onMouthControlRef.current = onMouthControl;
	}, [onMouthControl]);

	useEffect(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;
		const ctx = canvas.getContext("2d", { alpha: true });
		if (!ctx) return;
		ctx.imageSmoothingEnabled = false; // Add this line

		let width = 0,
			height = 0;
		let mouseX = 0.5,
			mouseY = 0.5;
		let mouseTargetX = 0.5,
			mouseTargetY = 0.5;
		let prevMouseX = 0.5,
			prevMouseY = 0.5;
		let mouseEnergy = 0;
		let t = 0;

		let cellStep = CELL_STEP_LG,
			cellFont = CELL_FONT_LG;
		let screenShiftU = SCREEN_SHIFT_U_LG,
			screenShiftV = SCREEN_SHIFT_V_LG;
		let renderPanelW = RENDER_PANEL_W_LG;
		let duckScaleV = DUCK_SCALE_V_LG,
			duckScaleU = DUCK_SCALE_U_LG;
		let fadeStart = FADE_START_LG,
			fadeEnd = FADE_END_LG;
		let duckRenderScale = DUCK_RENDER_SCALE;
		let frameBudgetMs = 0;
		let renderDpr = 1;

		// Glyph atlas — rebuilt on font size change
		let atlas: GlyphAtlas = buildGlyphAtlas(cellFont, renderDpr);
		let lastAtlasFont = cellFont;
		let lastAtlasDpr = renderDpr;

		const duck = {
			img: null as HTMLImageElement | null,
			closedImg: null as HTMLImageElement | null,
			openImg: null as HTMLImageElement | null,
			data: null as ImageData | null,
			w: 0,
			h: 0,
			renderMask: null as Uint8Array | null,
			closed: {
				alphaMask: null as Uint8ClampedArray | null,
				renderMask: null as Uint8Array | null,
				maskW: 0,
				maskH: 0,
				cropX: -1,
				cropY: -1,
				cropW: 0,
				cropH: 0,
			},
		};
		let isQuacking = false;
		let lastFrameTs = 0;

		interface QuackParticle {
			spawnTime: number;
			baseX: number;
			baseY: number;
		}
		const quackParticles: QuackParticle[] = [];

		const nav = navigator as Navigator & { deviceMemory?: number };
		const deviceMemory = nav.deviceMemory ?? 8;
		const hardwareThreads = navigator.hardwareConcurrency ?? 8;
		const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
		const lowPowerMode = prefersReducedMotion || deviceMemory <= 4 || hardwareThreads <= 4;
		const ultraLowPowerMode = deviceMemory <= 2 || hardwareThreads <= 2;

		// ── Batch buffer: flat typed arrays instead of object arrays ───────────
		// For each cell we emit: x, y, charIdx, bucket — packed into a single Int16Array.
		// This avoids per-cell object allocation and bucket array management entirely.
		const MAX_CELLS = 40000; // generous upper bound
		const batchX = new Float32Array(MAX_CELLS);
		const batchY = new Float32Array(MAX_CELLS);
		const batchCI = new Uint16Array(MAX_CELLS);
		const batchBucket = new Uint8Array(MAX_CELLS);
		let batchCount = 0;

		// Sort key for batching: bucket * NC + charIdx — sort once, iterate linearly
		const batchSortKeys = new Uint16Array(MAX_CELLS);
		const batchIndices = new Uint16Array(MAX_CELLS);

		// Counting sort arrays (bucket * NC + ci range = ALPHA_LEVELS * NC ≈ 256)
		const SORT_RANGE = ALPHA_LEVELS * NC;
		const sortCounts = new Uint16Array(SORT_RANGE);
		const sortOffsets = new Uint16Array(SORT_RANGE);

		const invalidateCellCache = () => {
			cellCache = null;
		};

		const dilateMask = (mask: Uint8Array, mW: number, mH: number, radius: number): Uint8Array => {
			if (radius <= 0) return mask;
			const tmp = new Uint8Array(mW * mH);
			const out = new Uint8Array(mW * mH);
			for (let y = 0; y < mH; y++) {
				const row = y * mW;
				for (let x = 0; x < mW; x++) {
					for (let dx = -radius; dx <= radius; dx++) {
						const nx = x + dx;
						if (nx >= 0 && nx < mW && mask[row + nx] === 1) {
							tmp[row + x] = 1;
							break;
						}
					}
				}
			}
			for (let x = 0; x < mW; x++) {
				for (let y = 0; y < mH; y++) {
					for (let dy = -radius; dy <= radius; dy++) {
						const ny = y + dy;
						if (ny >= 0 && ny < mH && tmp[ny * mW + x] === 1) {
							out[y * mW + x] = 1;
							break;
						}
					}
				}
			}
			return out;
		};

		const rebuildDuckData = () => {
			if (!duck.img) return;
			if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) return;
			const srcW = duck.img.naturalWidth,
				srcH = duck.img.naturalHeight;
			if (!srcW || !srcH) return;

			const targetW = Math.max(
				DUCK_RENDER_MIN_W,
				Math.min(DUCK_RENDER_MAX_W, Math.round(width * DUCK_RENDER_PANEL * duckRenderScale)),
			);
			duck.w = targetW;
			duck.h = Math.round(targetW / (srcW / Math.max(1, srcH)));

			if (duck.img === duck.openImg && duck.closed.maskW > 0) {
				duck.w = duck.closed.maskW;
				duck.h = duck.closed.maskH;
			}
			if (!Number.isFinite(duck.w) || !Number.isFinite(duck.h) || duck.w <= 0 || duck.h <= 0) return;

			const off = document.createElement("canvas");
			off.width = duck.w;
			off.height = duck.h;
			const octx = off.getContext("2d", { willReadFrequently: true });
			if (!octx) return;
			octx.clearRect(0, 0, duck.w, duck.h);
			octx.drawImage(duck.img, 0, 0, duck.w, duck.h);
			const img = octx.getImageData(0, 0, duck.w, duck.h);

			const sampleCorners = () => {
				const s = 6;
				const pts: Array<[number, number]> = [
					[0, 0],
					[duck.w - s, 0],
					[0, duck.h - s],
					[duck.w - s, duck.h - s],
				];
				let rr = 0,
					gg = 0,
					bb = 0,
					n = 0;
				for (const [sx, sy] of pts)
					for (let cy = 0; cy < s; cy++)
						for (let cx = 0; cx < s; cx++) {
							const idx = (Math.min(duck.h - 1, sy + cy) * duck.w + Math.min(duck.w - 1, sx + cx)) * 4;
							if (img.data[idx + 3] < 200) continue;
							rr += img.data[idx];
							gg += img.data[idx + 1];
							bb += img.data[idx + 2];
							n++;
						}
				return n < 10 ? null : { r: rr / n, g: gg / n, b: bb / n };
			};
			const bg = sampleCorners();
			if (bg) {
				const d = img.data;
				for (let p = 0; p < d.length; p += 4) {
					if (d[p + 3] === 0) continue;
					const dr = d[p] - bg.r,
						dg = d[p + 1] - bg.g,
						db = d[p + 2] - bg.b;
					d[p + 3] = Math.round(
						d[p + 3] *
							clamp01((Math.sqrt(dr * dr + dg * dg + db * db) - BG_REMOVE_THRESHOLD) / BG_REMOVE_SOFTNESS),
					);
				}
			}

			if (duck.img === duck.closedImg) {
				duck.closed.alphaMask = new Uint8ClampedArray(duck.w * duck.h);
				duck.closed.maskW = duck.w;
				duck.closed.maskH = duck.h;
				for (let k = 0; k < duck.w * duck.h; k++) duck.closed.alphaMask[k] = img.data[k * 4 + 3];
			}

			let minX = duck.w,
				minY = duck.h,
				maxX = -1,
				maxY = -1;
			for (let y = 0; y < duck.h; y++)
				for (let x = 0; x < duck.w; x++)
					if (img.data[(y * duck.w + x) * 4 + 3] > ALPHA_CROP_CUT) {
						if (x < minX) minX = x;
						if (y < minY) minY = y;
						if (x > maxX) maxX = x;
						if (y > maxY) maxY = y;
					}
			if (maxX < 0 || maxY < 0) {
				duck.data = img;
				return;
			}

			minX = Math.max(0, minX - ALPHA_CROP_PAD);
			minY = Math.max(0, minY - ALPHA_CROP_PAD);
			maxX = Math.min(duck.w - 1, maxX + ALPHA_CROP_PAD);
			maxY = Math.min(duck.h - 1, maxY + ALPHA_CROP_PAD);

			let cropX = minX,
				cropY = minY;
			let cropW = Math.max(1, maxX - minX + 1),
				cropH = Math.max(1, maxY - minY + 1);

			if (duck.img === duck.closedImg) {
				duck.closed.cropX = cropX;
				duck.closed.cropY = cropY;
				duck.closed.cropW = cropW;
				duck.closed.cropH = cropH;
			} else if (duck.img === duck.openImg && duck.closed.cropX >= 0 && duck.closed.cropW > 0) {
				cropX = Math.max(0, Math.min(duck.w - 1, duck.closed.cropX));
				cropY = Math.max(0, Math.min(duck.h - 1, duck.closed.cropY));
				cropW = Math.max(1, Math.min(duck.closed.cropW, duck.w - cropX));
				cropH = Math.max(1, Math.min(duck.closed.cropH, duck.h - cropY));
			}

			const cropped = octx.getImageData(cropX, cropY, cropW, cropH);
			duck.data = cropped;
			duck.w = cropW;
			duck.h = cropH;

			const buildMask = () => {
				const m = new Uint8Array(duck.w * duck.h);
				for (let k = 0; k < duck.w * duck.h; k++) m[k] = cropped.data[k * 4 + 3] > 30 ? 1 : 0;
				return m;
			};
			if (duck.img === duck.closedImg) {
				duck.closed.renderMask = dilateMask(buildMask(), duck.w, duck.h, MASK_DILATE_RADIUS);
				duck.renderMask = duck.closed.renderMask;
			} else if (duck.img === duck.openImg) {
				duck.renderMask = buildMask();
			} else {
				duck.renderMask = null;
			}

			invalidateCellCache();
		};

		const setDuckImage = (isOpen: boolean) => {
			const next = isOpen ? duck.openImg : duck.closedImg;
			if (!next) return;
			duck.img = next;
			rebuildDuckData();
		};

		const applyResponsiveTuning = () => {
			cellStep = width < 640 ? CELL_STEP_SM : width < 900 ? CELL_STEP_MD : CELL_STEP_LG;
			cellFont = width < 640 ? CELL_FONT_SM : width < 900 ? CELL_FONT_MD : CELL_FONT_LG;
			screenShiftU = width < 700 ? SCREEN_SHIFT_U_SM : width < 1024 ? SCREEN_SHIFT_U_MD : SCREEN_SHIFT_U_LG;
			screenShiftV = width < 640 ? SCREEN_SHIFT_V_SM : width < 1024 ? SCREEN_SHIFT_V_MD : SCREEN_SHIFT_V_LG;
			duckScaleV = width < 640 ? DUCK_SCALE_V_SM : width < 1024 ? DUCK_SCALE_V_MD : DUCK_SCALE_V_LG;
			duckScaleU = width < 640 ? DUCK_SCALE_U_SM : width < 1024 ? DUCK_SCALE_U_MD : DUCK_SCALE_U_LG;
			renderPanelW = width < 640 ? RENDER_PANEL_W_SM : width < 1024 ? RENDER_PANEL_W_MD : RENDER_PANEL_W_LG;
			fadeStart = width < 640 ? FADE_START_SM : width < 1024 ? FADE_START_MD : FADE_START_LG;
			fadeEnd = width < 640 ? FADE_END_SM : width < 1024 ? FADE_END_MD : FADE_END_LG;
			duckRenderScale = ultraLowPowerMode
				? DUCK_RENDER_SCALE_ULTRA_LOW
				: lowPowerMode
					? DUCK_RENDER_SCALE_LOW
					: DUCK_RENDER_SCALE;
			frameBudgetMs = lowPowerMode ? FRAME_MS_LOW_POWER : 0;

			if (ultraLowPowerMode) {
				cellStep += 2;
				cellFont = Math.max(7, cellFont - 2);
			} else if (lowPowerMode) {
				cellStep += 1;
				cellFont = Math.max(7, cellFont - 1);
			}

			// Rebuild atlas if font or canvas DPR changed. Otherwise DPR-scaled
			// canvas draws a 1x glyph bitmap and the characters look soft.
			if (cellFont !== lastAtlasFont || renderDpr !== lastAtlasDpr) {
				atlas = buildGlyphAtlas(cellFont, renderDpr);
				lastAtlasFont = cellFont;
				lastAtlasDpr = renderDpr;
			}

			if (shiftUOverride !== undefined) screenShiftU = shiftUOverride;
			if (shiftVOverride !== undefined) screenShiftV = shiftVOverride;
		};

		const resize = () => {
			const dprCap = ultraLowPowerMode
				? DPR_CAP_ULTRA_LOW
				: lowPowerMode
					? DPR_CAP_LOW_POWER
					: DPR_CAP_DEFAULT;
			const dpr = Math.min(window.devicePixelRatio || 1, dprCap);
			width = canvas.clientWidth;
			height = canvas.clientHeight;
			if (width <= 0 || height <= 0) return;
			renderDpr = dpr;
			applyResponsiveTuning();
			canvas.width = Math.floor(width * dpr);
			canvas.height = Math.floor(height * dpr);
			ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
			invalidateCellCache();
			rebuildDuckData();
		};

		const ensureSized = () => {
			if (canvas.clientWidth > 0 && canvas.clientHeight > 0) {
				resize();
				return;
			}
			requestAnimationFrame(ensureSized);
		};

		// ── Cell cache — precomputed per cell, using flat typed arrays ──────────
		// Instead of an array of objects, use parallel typed arrays for cache-friendly access.
		let cellCacheValid = false;
		let cellCacheW = 0,
			cellCacheH = 0;
		let cellCache: {
			baseIU: Float32Array;
			baseIV: Float32Array;
			u: Float32Array;
			v: Float32Array;
			vigFade: Float32Array;
			active: Uint8Array; // 1 if cell is valid, 0 if skipped
		} | null = null;

		const rebuildCellCache = () => {
			if (!duck.data || width <= 0 || height <= 0) return;
			const cols = Math.ceil(width / cellStep),
				rows = Math.ceil(height / cellStep);
			const total = cols * rows;
			cellCacheW = cols;
			cellCacheH = rows;

			// Allocate or reuse
			if (!cellCache || cellCache.baseIU.length < total) {
				cellCache = {
					baseIU: new Float32Array(total),
					baseIV: new Float32Array(total),
					u: new Float32Array(total),
					v: new Float32Array(total),
					vigFade: new Float32Array(total),
					active: new Uint8Array(total),
				};
			}
			cellCache.active.fill(0);

			const panelAspect = width / Math.max(1, height);
			const imgAspect = duck.w / Math.max(1, duck.h);

			// Precompute aspect correction
			const useHorizontalFit = imgAspect > panelAspect;
			const usedH = useHorizontalFit ? panelAspect / imgAspect : 1;
			const usedW = useHorizontalFit ? 1 : imgAspect / panelAspect;
			const hOff = useHorizontalFit ? (1 - usedH) * 0.5 : 0;
			const wOff = useHorizontalFit ? 0 : (1 - usedW) * 0.5;
			const hScale = useHorizontalFit ? usedH : 1;
			const wScale = useHorizontalFit ? 1 : usedW;

			const panelLeft = renderPanelW < 0.999 ? 1 - renderPanelW : 0;
			const invRenderPanelW = 1 / renderPanelW;
			const invDuckScaleV = 1 / duckScaleV;
			const invDuckScaleU = 1 / duckScaleU;
			const invVigWidth = 1 / VIGNETTE_WIDTH;
			const invFadeRange = 1 / (fadeEnd - fadeStart);

			for (let row = 0; row < rows; row++) {
				const y = row * cellStep;
				const vVal = y / height;
				const rowBase = row * cols;

				for (let col = 0; col < cols; col++) {
					const x = col * cellStep;
					const uVal = x / width;
					const idx = rowBase + col;

					if (renderPanelW < 0.999 && uVal < panelLeft) continue;

					let pu = renderPanelW < 0.999 ? (uVal - panelLeft) * invRenderPanelW : uVal;
					let pv = vVal;
					pu += screenShiftU;
					pv += screenShiftV;

					let baseIU = useHorizontalFit ? pu : (pu - wOff) / wScale;
					let baseIV = useHorizontalFit ? (pv - hOff) / hScale : pv;

					baseIV = (baseIV - 0.5) * invDuckScaleV + 0.5;
					baseIU = (baseIU - 0.5) * invDuckScaleU + 0.5;
					baseIU += SOURCE_SHIFT_U;
					baseIV += SOURCE_SHIFT_V;

					const dxC = uVal - 0.5,
						dyC = vVal - 0.5;
					const dist = Math.sqrt(dxC * dxC + dyC * dyC);
					const vignette = clamp01(1 - (dist - VIGNETTE_INNER) * invVigWidth);

					let bottomFade: number;
					if (vVal <= fadeStart) {
						bottomFade = 1;
					} else {
						const lin = clamp01(1 - (vVal - fadeStart) * invFadeRange);
						const smooth = lin * lin * (3 - 2 * lin);
						bottomFade = smooth * smooth * smooth;
					}

					cellCache!.baseIU[idx] = baseIU;
					cellCache!.baseIV[idx] = baseIV;
					cellCache!.u[idx] = uVal;
					cellCache!.v[idx] = vVal;
					cellCache!.vigFade[idx] = vignette * bottomFade;
					cellCache!.active[idx] = 1;
				}
			}
			cellCacheValid = true;
		};

		const updateMouseFromEvent = (e: PointerEvent) => {
			if (!(runningRef?.current ?? true)) return;
			const rect = canvas.getBoundingClientRect();
			if (rect.width <= 0 || rect.height <= 0) return;
			mouseTargetX = clamp01((e.clientX - rect.left) / rect.width);
			mouseTargetY = clamp01((e.clientY - rect.top) / rect.height);
		};

		const controlMouth = (open: boolean) => {
			if (open) {
				isQuacking = true;
				setDuckImage(true);
				if (quackTimeoutRef.current) window.clearTimeout(quackTimeoutRef.current);
				quackTimeoutRef.current = window.setTimeout(() => {
					isQuacking = false;
					setDuckImage(false);
				}, QUACK_DURATION_MS);
				quackParticles.push({
					spawnTime: performance.now(),
					baseX: width * (width < 1024 ? QUACK_X_SM : QUACK_X_LG),
					baseY: height * (height < 600 ? QUACK_Y_SM : QUACK_Y_LG),
				});
			} else {
				if (quackTimeoutRef.current) window.clearTimeout(quackTimeoutRef.current);
				isQuacking = false;
				setDuckImage(false);
			}
		};

		const handleVisibilityChange = () => {
			if (document.visibilityState === "visible" && (runningRef?.current ?? true))
				if (rafRef.current === null) rafRef.current = requestAnimationFrame(draw);
		};
		document.addEventListener("visibilitychange", handleVisibilityChange);

		// ── Draw loop ──────────────────────────────────────────────────────────────
		const draw = (now = performance.now()) => {
			rafRef.current = null;
			if (!(runningRef?.current ?? true) || document.visibilityState === "hidden") return;
			if (frameBudgetMs > 0 && now - lastFrameTs < frameBudgetMs) {
				rafRef.current = requestAnimationFrame(draw);
				return;
			}
			lastFrameTs = now;
			t += T_STEP;

			mouseX += (mouseTargetX - mouseX) * MOUSE_LERP;
			mouseY += (mouseTargetY - mouseY) * MOUSE_LERP;
			const dmx = mouseX - prevMouseX,
				dmy = mouseY - prevMouseY;
			mouseEnergy = Math.min(
				1,
				mouseEnergy * ENERGY_DECAY + Math.min(1, Math.sqrt(dmx * dmx + dmy * dmy) * ENERGY_SPEED_SCALE),
			);
			prevMouseX = mouseX;
			prevMouseY = mouseY;

			ctx.clearRect(0, 0, width, height);

			if (!duck.data) {
				rafRef.current = requestAnimationFrame(draw);
				return;
			}
			if (!cellCacheValid || !cellCache) rebuildCellCache();
			if (!cellCache) {
				rafRef.current = requestAnimationFrame(draw);
				return;
			}

			const cols = cellCacheW,
				rows = cellCacheH;
			const mx = mouseX,
				my = mouseY;
			const radiusSq = RIPPLE_RADIUS * RIPPLE_RADIUS;
			const invRadiusSq = 1 / radiusSq;
			const duckDataArr = duck.data.data;
			const dW = duck.w,
				dH = duck.h;
			const renderMask = duck.renderMask;

			// Hoist cache arrays for tight inner loop
			const ccBaseIU = cellCache.baseIU;
			const ccBaseIV = cellCache.baseIV;
			const ccU = cellCache.u;
			const ccV = cellCache.v;
			const ccVigFade = cellCache.vigFade;
			const ccActive = cellCache.active;

			const parallaxU = (mx - 0.5) * PARALLAX_U;
			const parallaxV = (my - 0.5) * PARALLAX_V;
			const mEnergy = mouseEnergy;

			batchCount = 0;

			const total = rows * cols;
			for (let idx = 0; idx < total; idx++) {
				if (!ccActive[idx]) continue;

				const iu = ccBaseIU[idx] + parallaxU;
				const iv = ccBaseIV[idx] + parallaxV;
				if (iu < 0 || iu > 1 || iv < 0 || iv > 1) continue;

				const ix = (iu * dW) | 0;
				const iy = (iv * dH) | 0;

				if (renderMask && renderMask[iy * dW + ix] === 0) continue;

				const i = (iy * dW + ix) * 4;
				const a = duckDataArr[i + 3];
				if (a < ALPHA_CUT) continue;

				const lum8 = (lumaR[duckDataArr[i]] + lumaG[duckDataArr[i + 1]] + lumaB[duckDataArr[i + 2]]) >> 10;

				// Edge detection — inlined with early-exit
				const rowOff = iy * dW;
				const isEdge =
					duckDataArr[(rowOff + (ix > 0 ? ix - 1 : 0)) * 4 + 3] < 10 ||
					duckDataArr[(rowOff + (ix < dW - 1 ? ix + 1 : dW - 1)) * 4 + 3] < 10 ||
					duckDataArr[((iy > 0 ? iy - 1 : 0) * dW + ix) * 4 + 3] < 10 ||
					duckDataArr[((iy < dH - 1 ? iy + 1 : dH - 1) * dW + ix) * 4 + 3] < 10;

				const u = ccU[idx],
					v = ccV[idx];
				const du = u - mx,
					dv = v - my;
				const dist2 = du * du + dv * dv;

				let ripple = 0,
					lift = 0;
				if (dist2 < radiusSq) {
					const rawInf = 1 - dist2 * invRadiusSq;
					const inf = rawInf * rawInf;
					ripple = fastSin(t * WAVE_TIME_FREQ + fastSqrt01(dist2) * RIPPLE_DIST_SCALE) * inf * mEnergy;
					lift = inf * mEnergy * MOUSE_LIFT;
				}

				// Compute cell pixel position from idx
				const row = (idx / cols) | 0;
				const col = idx - row * cols;
				const x = col * cellStep;
				const y = row * cellStep;

				const baseWave = fastSin((x + y) * WAVE_SPATIAL + t) * 0.5 + fastSin(t + u * WAVE_UV_FREQ) * 0.5;
				const wave = baseWave * 0.5 + ripple * RIPPLE_WAVE_MIX;

				const tone8 = (clamp01((lum8 / 255) * LUM_MIX + wave * WAVE_MIX + lift) * 255) | 0;

				const ci = isEdge ? outlineCharIdx[tone8] : fillCharIdx[tone8];
				if (ci < 0) continue;

				const alphaF = (a / 255) * (isEdge ? EDGE_ALPHA_SCALE : 1.0) * ccVigFade[idx];
				const bucket = Math.min(ALPHA_LEVELS - 1, (alphaF * ALPHA_LEVELS) | 0);

				const bc = batchCount;
				batchX[bc] = x;
				batchY[bc] = y;
				batchCI[bc] = ci;
				batchBucket[bc] = bucket;
				batchSortKeys[bc] = bucket * NC + ci;
				batchCount = bc + 1;
			}

			// Counting sort by (bucket, charIdx) — O(n) and avoids the overhead of Array.sort
			sortCounts.fill(0);
			for (let i = 0; i < batchCount; i++) sortCounts[batchSortKeys[i]]++;
			sortOffsets[0] = 0;
			for (let i = 1; i < SORT_RANGE; i++) sortOffsets[i] = sortOffsets[i - 1] + sortCounts[i - 1];
			for (let i = 0; i < batchCount; i++) {
				const key = batchSortKeys[i];
				batchIndices[sortOffsets[key]++] = i;
			}

			// Render from atlas — drawImage instead of fillText
			const { canvas: atlasCanvas, sourceGlyphW, sourceGlyphH, drawGlyphW, drawGlyphH } = atlas;
			const halfFont = cellFont / 2;
			const drawOffsetX = -drawGlyphW / 2 + halfFont;
			const drawOffsetY = -drawGlyphH / 2 + halfFont;

			// Inside the render loop:
			let prevBucket = -1;

			for (let si = 0; si < batchCount; si++) {
				const i = batchIndices[si];
				const bucket = batchBucket[i];

				// Update alpha only when it changes
				if (bucket !== prevBucket) {
					ctx.globalAlpha = (bucket + 0.5) / ALPHA_LEVELS;
					prevBucket = bucket;
				}

				const ci = batchCI[i];

				// CRITICAL: Use | 0 to snap to integer pixels
				const dx = (batchX[i] + drawOffsetX) | 0;
				const dy = (batchY[i] + drawOffsetY) | 0;

				ctx.drawImage(
					atlasCanvas as CanvasImageSource,
					ci * sourceGlyphW,
					0,
					sourceGlyphW,
					sourceGlyphH, // Source Y is now always 0
					dx,
					dy,
					drawGlyphW,
					drawGlyphH,
				);
			}

			if (quackParticles.length > 0) {
				ctx.fillStyle = DUCK_COLOR;
				ctx.font = QUACK_FONT;
				ctx.textAlign = "left";
				ctx.textBaseline = "middle";
				for (let qi = quackParticles.length - 1; qi >= 0; qi--) {
					const qp = quackParticles[qi];
					const age = now - qp.spawnTime;
					if (age >= QUACK_TOTAL_MS) {
						quackParticles.splice(qi, 1);
						continue;
					}
					let alpha: number;
					if (age < QUACK_FADE_IN_MS) {
						alpha = age / QUACK_FADE_IN_MS;
					} else if (age < QUACK_FADE_IN_MS + QUACK_HOLD_MS) {
						alpha = 1;
					} else {
						alpha = 1 - (age - QUACK_FADE_IN_MS - QUACK_HOLD_MS) / QUACK_FADE_OUT_MS;
					}
					const yOffset = -(age / QUACK_TOTAL_MS) * QUACK_DRIFT_PX;
					ctx.globalAlpha = Math.max(0, alpha);
					ctx.fillText(QUACK_TEXT, qp.baseX, qp.baseY + yOffset);
				}
			}

			ctx.globalAlpha = 1;
			rafRef.current = requestAnimationFrame(draw);
		};

		// ── Boot ───────────────────────────────────────────────────────────────────
		const ro = new ResizeObserver(() => resize());
		ro.observe(canvas);
		canvas.addEventListener("pointermove", updateMouseFromEvent, { passive: true });
		onMouthControlRef.current?.(controlMouth);

		duck.closedImg = new Image();
		duck.openImg = new Image();
		let loadedCount = 0;
		const onImageReady = () => {
			if (++loadedCount < 2) return;
			setDuckImage(false);
			requestAnimationFrame(() => ensureSized());
		};
		const onImageError = () => {
			duck.data = null;
			console.warn("DuckCanvas: failed to load duck images");
		};
		duck.closedImg.onload = onImageReady;
		duck.openImg.onload = onImageReady;
		duck.closedImg.onerror = onImageError;
		duck.openImg.onerror = onImageError;
		duck.closedImg.src = DuckClosedMouth.src;
		duck.openImg.src = DuckOpenMouth.src;

		ensureSized();

		const resumeLoop = () => {
			if (rafRef.current === null) rafRef.current = requestAnimationFrame(draw);
		};
		onResumLoopRef.current?.(resumeLoop);
		draw();

		return () => {
			if (rafRef.current) cancelAnimationFrame(rafRef.current);
			if (quackTimeoutRef.current) window.clearTimeout(quackTimeoutRef.current);
			ro.disconnect();
			document.removeEventListener("visibilitychange", handleVisibilityChange);
			canvas.removeEventListener("pointermove", updateMouseFromEvent);
			if (duck.closedImg) {
				duck.closedImg.onload = duck.closedImg.onerror = null;
			}
			if (duck.openImg) {
				duck.openImg.onload = duck.openImg.onerror = null;
			}
		};
	}, []);

	return (
		<canvas ref={canvasRef} className="absolute inset-0 h-full w-full pointer-events-auto cursor-pointer" />
	);
}
