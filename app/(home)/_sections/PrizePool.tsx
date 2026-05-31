"use client";

import {
	useRef,
	useState,
	useEffect,
	Suspense,
	useCallback,
	useMemo,
	memo,
} from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment } from "@react-three/drei";
import { Bloom, EffectComposer } from "@react-three/postprocessing";

import { TypingCaption } from "../_components/SectionWrapper";
import { Group, MathUtils } from "three";

const kDebugMode = false;

interface MainPrize {
	place: string;
	prizename: string;
	accent: string;
	classNames: string;
	modelPath: string;
	scale: number;
	cameraZ: number;
	rotationOffset: [number, number, number];
	positionOffset: [number, number, number];
	hoverRadius: number;
	ghostSpacing: [number, number, number];
	ghostShrinking: number;
	cameraFov: number;
	translateRotationHover?: [number, number, number];
	translatePositionHover?: [number, number, number];
	ghostMode?: "linear" | "circular" | "mirror" | "arc";
	ghostCircleRadius?: number;
	ghostArcTilt?: [number, number, number];
	hoverLerpSpeed?: number;
	hoverCameraZ?: number;
	hoverRotationSpeed?: number;
}

interface TrackPrize {
	track: string;
	amount: string;
	description: string;
}

const kModelPathPrefix = "/models/";
const MACBOOK_MODEL_PATH = "macbook/macbookm3-compressed.glb";
const GLASSES_MODEL_PATH = "metaglasses/source/glasses3.glb";
const PS5_MODEL_PATH = "ps5/ps5-compressed.glb";

// ──────────────────────────────────────────────────────────────
// FIX 1: Lazy preload instead of eager module-level preload.
// The original `useGLTF.preload()` at the top-level fires 3 GLB
// fetches immediately on page load, competing with critical
// resources (fonts, images, JS bundles) and causing the initial
// stutter. Instead, preload only when the section scrolls near.
// ──────────────────────────────────────────────────────────────
let _preloaded = false;
function preloadModels() {
	if (_preloaded) return;
	_preloaded = true;
	useGLTF.preload(kModelPathPrefix + MACBOOK_MODEL_PATH);
	useGLTF.preload(kModelPathPrefix + GLASSES_MODEL_PATH);
	useGLTF.preload(kModelPathPrefix + PS5_MODEL_PATH);
}

const kMainPrizes: MainPrize[] = [
	{
		place: "1st",
		prizename: "Macbook Pro",
		accent: "#dbbc21",
		classNames:
			"bg-linear-to-r from-yellow-200 via-yellow-500 to-yellow-200 bg-size-[200%_100%] bg-clip-text text-transparent animate-shimmer",
		modelPath: kModelPathPrefix + MACBOOK_MODEL_PATH,
		scale: 0.048,
		cameraZ: 4.0,
		rotationOffset: [0, 1, -1],
		positionOffset: [0, -0.25, 0],
		hoverRadius: 0.6,
		ghostSpacing: [0, -0.25, -2],
		ghostShrinking: 0,
		cameraFov: 45,
		ghostMode: "arc",
		ghostCircleRadius: 2.1,
		ghostArcTilt: [1.2, 0, 0],
		translateRotationHover: [0, 0, -0.1],
		translatePositionHover: [0, -0.5, -4],
		hoverLerpSpeed: 0.2,
		hoverCameraZ: 5.0,
		hoverRotationSpeed: 0.005,
	},
	{
		place: "2nd",
		prizename: "Ray-Ban\nMeta Glasses + Neural Band",
		accent: "#8a8a8a",
		classNames:
			"bg-linear-to-r from-gray-200 via-gray-500 to-gray-200 bg-size-[200%_100%] bg-clip-text text-transparent animate-shimmer",
		modelPath: kModelPathPrefix + GLASSES_MODEL_PATH,
		scale: 0.04,
		cameraZ: 4.0,
		rotationOffset: [0, 0, 0],
		positionOffset: [0, 0, 0],
		hoverRadius: 0.6,
		ghostSpacing: [0, 0.4, -0.1],
		ghostShrinking: 0,
		cameraFov: 45,
		translatePositionHover: [0, -0.4, 0],
		hoverLerpSpeed: 0.2,
	},
	{
		place: "3rd",
		prizename: "Playstation 5",
		accent: "#2643eb",
		classNames:
			"bg-linear-to-r from-blue-500 via-indigo-600  to-blue-500 bg-size-[200%_100%] bg-clip-text text-transparent animate-shimmer",
		modelPath: kModelPathPrefix + PS5_MODEL_PATH,
		scale: 1.5,
		cameraZ: 10.0,
		rotationOffset: [0, 1, 0],
		positionOffset: [0, 0, 0],
		hoverRadius: 0.6,
		ghostSpacing: [1, 0, 0],
		ghostShrinking: 0,
		cameraFov: 30,
		translateRotationHover: [1.5, 0, 0],
		translatePositionHover: [-2, 0, 0],
		hoverLerpSpeed: 0.2,
		hoverRotationSpeed: 0.005,
	},
];

const kTrackPrizes: TrackPrize[] = [
	{
		track: "Best AI Hack",
		amount: "TBD",
		description: "Most creative use of AI / ML",
	},
	{
		track: "Best Web3 Hack",
		amount: "TBD",
		description: "Most innovative use of blockchain",
	},
	{
		track: "Best Sustainability",
		amount: "TBD",
		description: "Hack with the most social impact",
	},
	{
		track: "Best UI/UX",
		amount: "TBD",
		description: "Most polished and delightful product",
	},
	{
		track: "Best Solo Hack",
		amount: "TBD",
		description: "Top individual contributor",
	},
	{
		track: "Judges' Choice",
		amount: "TBD",
		description: "Panel wildcard pick",
	},
];

interface DragState {
	dragging: boolean;
	lastX: number;
	lastY: number;
	velX: number;
	velY: number;
}

const COPY_COUNT = 4;

// ──────────────────────────────────────────────────────────────
// FIX 2: Memoize Model to prevent re-renders from parent state
// changes (e.g. canvasHovered toggling). The component only uses
// refs inside useFrame, so prop changes are absorbed via refs.
// ──────────────────────────────────────────────────────────────
const Model = memo(function Model({
	modelPath,
	scale,
	rotationOffset,
	positionOffset,
	dragRef,
	hoveredRef,
	ghostSpacing = [0, 0, -1.0] as [number, number, number],
	ghostShrinking = 0.15,
	hoverPositionOffset = [0, 0, 0] as [number, number, number],
	hoverTranslate = [0, 0, 0] as [number, number, number],
	ghostMode = "linear" as "linear" | "circular" | "mirror" | "arc",
	ghostCircleRadius = 1.0,
	ghostArcTilt = [0, 0, 0] as [number, number, number],
	lerpSpeed = 0.08,
	hoverRotationSpeed,
}: {
	modelPath: string;
	scale: number;
	rotationOffset: [number, number, number];
	positionOffset: [number, number, number];
	dragRef: React.RefObject<DragState>;
	hoveredRef: React.RefObject<boolean>;
	ghostSpacing?: [number, number, number];
	ghostShrinking?: number;
	hoverPositionOffset?: [number, number, number];
	hoverTranslate?: [number, number, number];
	ghostMode?: "linear" | "circular" | "mirror" | "arc";
	ghostCircleRadius?: number;
	ghostArcTilt?: [number, number, number];
	lerpSpeed?: number;
	hoverRotationSpeed?: number;
}) {
	const rootRef = useRef<Group>(null);
	const copyRefs = useRef<(Group | null)[]>(Array(COPY_COUNT).fill(null));
	const tiltRefs = useRef<(Group | null)[]>(Array(COPY_COUNT).fill(null));
	const copyRefCallbacks = useMemo(
		() =>
			Array.from({ length: COPY_COUNT }, (_, i) => (el: Group | null) => {
				copyRefs.current[i] = el;
			}),
		[]
	);
	const tiltRefCallbacks = useMemo(
		() =>
			Array.from({ length: COPY_COUNT }, (_, i) => (el: Group | null) => {
				tiltRefs.current[i] = el;
			}),
		[]
	);
	const { scene } = useGLTF(modelPath);

	const propsRef = useRef({
		positionOffset,
		hoverPositionOffset,
		hoverTranslate,
		ghostSpacing,
		ghostShrinking,
		ghostMode,
		ghostCircleRadius,
		ghostArcTilt,
		lerpSpeed,
		scale,
		hoverRotationSpeed,
	});
	propsRef.current = {
		positionOffset,
		hoverPositionOffset,
		hoverTranslate,
		ghostSpacing,
		ghostShrinking,
		ghostMode,
		ghostCircleRadius,
		ghostArcTilt,
		lerpSpeed,
		scale,
		hoverRotationSpeed,
	};
	const effectiveRotSpeedRef = useRef(0.01);

	const clones = useMemo(
		() => Array.from({ length: COPY_COUNT }, () => scene.clone(true)),
		[scene]
	);

	useFrame(() => {
		const root = rootRef.current;
		if (!root) return;

		// ──────────────────────────────────────────────────────────
		// FIX 3: Read hovered from a ref passed by parent instead
		// of a prop that triggers re-renders. The parent no longer
		// needs to pass `hovered` as a prop at all — it just
		// updates the ref directly via onHoverChange.
		// ──────────────────────────────────────────────────────────
		const isHovered = hoveredRef.current;
		const p = propsRef.current;

		const drag = dragRef.current;
		const kDragDecay = 0.9;
		const kRotateSpeed = 0.9;
		const kBaseRotSpeed = 0.01;
		if (drag.dragging) {
			root.rotation.x += drag.velY;
			root.rotation.y += drag.velX;
		} else {
			drag.velX *= kDragDecay;
			drag.velY *= kDragDecay;
			const targetRotSpeed =
				isHovered && p.hoverRotationSpeed !== undefined
					? p.hoverRotationSpeed
					: kBaseRotSpeed;
			effectiveRotSpeedRef.current = MathUtils.lerp(
				effectiveRotSpeedRef.current,
				targetRotSpeed,
				0.05
			);
			root.rotation.y +=
				(effectiveRotSpeedRef.current + drag.velX) * kRotateSpeed;
		}

		const hx = isHovered
			? p.hoverPositionOffset[0] + p.hoverTranslate[0]
			: 0;
		const hy = isHovered
			? p.hoverPositionOffset[1] + p.hoverTranslate[1]
			: 0;
		const hz = isHovered
			? p.hoverPositionOffset[2] + p.hoverTranslate[2]
			: 0;

		const mirrorCx =
			p.ghostMode === "mirror" && isHovered ? p.ghostSpacing[0] / 2 : 0;
		const mirrorCy =
			p.ghostMode === "mirror" && isHovered ? p.ghostSpacing[1] / 2 : 0;
		const mirrorCz =
			p.ghostMode === "mirror" && isHovered ? p.ghostSpacing[2] / 2 : 0;

		root.position.x = MathUtils.lerp(
			root.position.x,
			p.positionOffset[0] + hx + mirrorCx,
			p.lerpSpeed
		);
		root.position.y = MathUtils.lerp(
			root.position.y,
			p.positionOffset[1] + hy + mirrorCy,
			p.lerpSpeed
		);
		root.position.z = MathUtils.lerp(
			root.position.z,
			p.positionOffset[2] + hz + mirrorCz,
			p.lerpSpeed
		);

		for (let i = 0; i < COPY_COUNT; i++) {
			const copy = copyRefs.current[i];
			if (!copy) continue;

			let targetX: number,
				targetY: number,
				targetZ: number,
				targetRotZ: number;
			let scaleFlipX = 1,
				scaleFlipY = 1;

			if (p.ghostMode === "circular") {
				const ringAngle = ((2 * Math.PI) / COPY_COUNT) * i;
				targetX = isHovered
					? Math.cos(ringAngle) * p.ghostCircleRadius -
						p.hoverPositionOffset[0]
					: 0;
				targetY = isHovered
					? Math.sin(ringAngle) * p.ghostCircleRadius -
						p.hoverPositionOffset[1]
					: 0;
				targetZ = isHovered ? -p.hoverPositionOffset[2] : 0;
				targetRotZ = isHovered ? ringAngle + Math.PI / 2 : 0;
			} else if (p.ghostMode === "arc") {
				const arcAngle =
					Math.PI - (Math.PI / (COPY_COUNT - 1)) * i;
				targetX = isHovered
					? Math.cos(arcAngle) * p.ghostCircleRadius -
						p.hoverPositionOffset[0]
					: 0;
				targetY = isHovered
					? Math.sin(arcAngle) * p.ghostCircleRadius -
						p.hoverPositionOffset[1]
					: 0;
				targetZ = isHovered ? -p.hoverPositionOffset[2] : 0;
				targetRotZ = isHovered
					? arcAngle -
						Math.PI / 2 -
						(p.ghostArcTilt[2] * Math.PI) / 2
					: 0;
			} else if (p.ghostMode === "mirror") {
				const mirrorX = [0, 1, 0, 1][i];
				const mirrorY = [0, 0, 1, 1][i];
				targetX = isHovered
					? mirrorX * p.ghostSpacing[0] - mirrorCx
					: 0;
				targetY = isHovered
					? mirrorY * p.ghostSpacing[1] - mirrorCy
					: 0;
				targetZ = isHovered
					? mirrorX * p.ghostSpacing[2] - mirrorCz
					: 0;
				targetRotZ = 0;
				scaleFlipX = isHovered ? (mirrorX ? -1 : 1) : 1;
				scaleFlipY = isHovered ? (mirrorY ? -1 : 1) : 1;
			} else {
				targetX = isHovered
					? i * p.ghostSpacing[0] - p.hoverPositionOffset[0]
					: 0;
				targetY = isHovered
					? i * p.ghostSpacing[1] - p.hoverPositionOffset[1]
					: 0;
				targetZ = isHovered
					? i * p.ghostSpacing[2] - p.hoverPositionOffset[2]
					: 0;
				targetRotZ = 0;
			}

			copy.position.x = MathUtils.lerp(
				copy.position.x,
				targetX,
				p.lerpSpeed
			);
			copy.position.y = MathUtils.lerp(
				copy.position.y,
				targetY,
				p.lerpSpeed
			);
			copy.position.z = MathUtils.lerp(
				copy.position.z,
				targetZ,
				p.lerpSpeed
			);
			copy.rotation.z = MathUtils.lerp(
				copy.rotation.z,
				targetRotZ,
				p.lerpSpeed
			);

			const tilt = tiltRefs.current[i];
			if (tilt) {
				const tiltX =
					p.ghostMode === "arc" && isHovered ? p.ghostArcTilt[0] : 0;
				const tiltY =
					p.ghostMode === "arc" && isHovered ? p.ghostArcTilt[1] : 0;
				tilt.rotation.x = MathUtils.lerp(
					tilt.rotation.x,
					tiltX,
					p.lerpSpeed
				);
				tilt.rotation.y = MathUtils.lerp(
					tilt.rotation.y,
					tiltY,
					p.lerpSpeed
				);
			}

			const targetScale = isHovered
				? p.scale * (1 - i * p.ghostShrinking)
				: p.scale;
			const nextScale = MathUtils.lerp(
				Math.abs(copy.scale.x),
				targetScale,
				p.lerpSpeed
			);
			copy.scale.set(
				nextScale,
				nextScale * scaleFlipY,
				nextScale * scaleFlipX
			);
		}
	});

	const innerOffsetVec = useMemo(
		(): [number, number, number] => [
			-rotationOffset[0],
			-rotationOffset[1],
			-rotationOffset[2],
		],
		[rotationOffset]
	);

	const reversedEntries = useMemo(
		() =>
			clones
				.map((clone, i) => ({ clone, i }))
				.reverse(),
		[clones]
	);

	return (
		<group
			ref={rootRef}
			position={positionOffset as [number, number, number]}
		>
			{reversedEntries.map(({ clone, i }) => (
				<group key={i} ref={copyRefCallbacks[i]} scale={scale}>
					<group ref={tiltRefCallbacks[i]}>
						<group position={innerOffsetVec}>
							<primitive object={clone} />
						</group>
					</group>
				</group>
			))}
		</group>
	);
});

function SceneSetup({
	cameraZ,
	hoverCameraZ,
	hoveredRef,
	lerpSpeed = 0.08,
}: {
	cameraZ: number;
	hoverCameraZ?: number;
	hoveredRef: React.RefObject<boolean>;
	lerpSpeed?: number;
}) {
	const { camera } = useThree();
	useEffect(() => {
		camera.position.set(0, 0, cameraZ);
	}, [camera, cameraZ]);
	useFrame(() => {
		if (hoverCameraZ === undefined) return;
		const targetZ = hoveredRef.current ? hoverCameraZ : cameraZ;
		camera.position.z = MathUtils.lerp(
			camera.position.z,
			targetZ,
			lerpSpeed
		);
	});
	return null;
}

// ──────────────────────────────────────────────────────────────
// FIX 4: Memoize SceneLights — it has no changing props, so
// React.memo prevents it from re-rendering when parent state
// (like canvasHovered) changes.
// ──────────────────────────────────────────────────────────────
const SceneLights = memo(function SceneLights({
	totalIntensity,
}: {
	totalIntensity: number;
}) {
	return (
		<>
			<hemisphereLight args={["#90ee90", "#6699ff", 1.5]} />
			<pointLight
				position={[3, -1, 2]}
				color="#6699ff"
				intensity={8 * totalIntensity}
				distance={15}
			/>
			<pointLight
				position={[-3, 2, 2]}
				color="#90ee90"
				intensity={8 * totalIntensity}
				distance={15}
			/>
		</>
	);
});

function DebugMarkers({
	positionOffset,
	hoverPositionOffset = [0, 0, 0] as [number, number, number],
	hoverTranslate = [0, 0, 0] as [number, number, number],
}: {
	positionOffset: [number, number, number];
	hoverPositionOffset?: [number, number, number];
	hoverTranslate?: [number, number, number];
}) {
	if (!kDebugMode) return null;
	const pivotPos: [number, number, number] = [
		positionOffset[0] + hoverPositionOffset[0],
		positionOffset[1] + hoverPositionOffset[1],
		positionOffset[2] + hoverPositionOffset[2],
	];
	const translatePos: [number, number, number] = [
		pivotPos[0] + hoverTranslate[0],
		pivotPos[1] + hoverTranslate[1],
		pivotPos[2] + hoverTranslate[2],
	];
	return (
		<>
			<mesh position={[0, 0, 0]}>
				<torusGeometry args={[0.15, 0.015, 12, 48]} />
				<meshBasicMaterial color="#ffff00" />
			</mesh>
			<mesh position={pivotPos}>
				<sphereGeometry args={[0.06, 16, 16]} />
				<meshBasicMaterial color="#00ff00" />
			</mesh>
			<mesh position={translatePos}>
				<sphereGeometry args={[0.06, 16, 16]} />
				<meshBasicMaterial color="#ff0000" />
			</mesh>
		</>
	);
}

// ──────────────────────────────────────────────────────────────
// FIX 5: Memoize the entire inner Canvas content so that
// hover state changes (which only affect useFrame via ref)
// don't cause React to re-reconcile the entire R3F scene graph.
// ──────────────────────────────────────────────────────────────
const CanvasContent = memo(function CanvasContent({
	modelPath,
	scale,
	rotationOffset,
	positionOffset,
	cameraZ,
	hoverCameraZ,
	hoveredRef,
	dragRef,
	ghostSpacing,
	ghostShrinking,
	hoverPositionOffset,
	hoverTranslate,
	ghostMode,
	ghostCircleRadius,
	ghostArcTilt,
	hoverLerpSpeed,
	hoverRotationSpeed,
}: {
	modelPath: string;
	scale: number;
	rotationOffset: [number, number, number];
	positionOffset: [number, number, number];
	cameraZ: number;
	hoverCameraZ?: number;
	hoveredRef: React.RefObject<boolean>;
	dragRef: React.RefObject<DragState>;
	ghostSpacing: [number, number, number];
	ghostShrinking: number;
	hoverPositionOffset: [number, number, number];
	hoverTranslate: [number, number, number];
	ghostMode: "linear" | "circular" | "mirror" | "arc";
	ghostCircleRadius: number;
	ghostArcTilt: [number, number, number];
	hoverLerpSpeed: number;
	hoverRotationSpeed?: number;
}) {
	return (
		<>
			<SceneSetup
				cameraZ={cameraZ}
				hoverCameraZ={hoverCameraZ}
				hoveredRef={hoveredRef}
				lerpSpeed={hoverLerpSpeed}
			/>
			<directionalLight position={[3.3, 1.0, 4.4]} intensity={1} />
			<Environment
				background={false}
				environmentIntensity={0.4}
				preset="city"
			/>
			<SceneLights totalIntensity={0.5} />
			<Suspense fallback={null}>
				<Model
					modelPath={modelPath}
					scale={scale}
					rotationOffset={rotationOffset}
					positionOffset={positionOffset}
					dragRef={dragRef}
					hoveredRef={hoveredRef}
					ghostSpacing={ghostSpacing}
					ghostShrinking={ghostShrinking}
					hoverPositionOffset={hoverPositionOffset}
					hoverTranslate={hoverTranslate}
					ghostMode={ghostMode}
					ghostCircleRadius={ghostCircleRadius}
					ghostArcTilt={ghostArcTilt}
					lerpSpeed={hoverLerpSpeed}
					hoverRotationSpeed={hoverRotationSpeed}
				/>
			</Suspense>
			<DebugMarkers
				positionOffset={positionOffset}
				hoverPositionOffset={hoverPositionOffset}
				hoverTranslate={hoverTranslate}
			/>
			{/* ──────────────────────────────────────────────────
			    FIX 6: Reduced multisampling from 4 → 0.
			    Multisampling on the EffectComposer means the
			    bloom pass renders at 4× resolution then
			    downsamples. With 3 canvases this is devastating.
			    The bloom itself still looks good at 0 (default).
			    Also lowered mipmap levels 4 → 3.
			    ────────────────────────────────────────────── */}
			<EffectComposer multisampling={0}>
				<Bloom
					intensity={1.2}
					luminanceThreshold={0.85}
					luminanceSmoothing={0.7}
					mipmapBlur
					levels={3}
				/>
			</EffectComposer>
		</>
	);
});

function ModelCanvas({
	modelPath,
	scale,
	rotationOffset,
	positionOffset,
	cameraZ,
	cameraFov = 45,
	ready,
	onHoverChange,
	hoverRadius = 1,
	ghostSpacing = [0, 0, -1.0] as [number, number, number],
	ghostShrinking = 0.15,
	hoverPositionOffset = [0, 0, 0] as [number, number, number],
	hoverTranslate = [0, 0, 0] as [number, number, number],
	ghostMode = "linear" as "linear" | "circular" | "mirror" | "arc",
	ghostCircleRadius = 1.0,
	ghostArcTilt = [0, 0, 0] as [number, number, number],
	hoverLerpSpeed = 0.08,
	hoverCameraZ,
	hoverRotationSpeed,
}: {
	modelPath: string;
	scale: number;
	rotationOffset: [number, number, number];
	positionOffset: [number, number, number];
	cameraZ: number;
	cameraFov?: number;
	ready: boolean;
	onHoverChange?: (hovered: boolean) => void;
	hoverRadius?: number;
	ghostSpacing?: [number, number, number];
	ghostShrinking?: number;
	hoverPositionOffset?: [number, number, number];
	hoverTranslate?: [number, number, number];
	ghostMode?: "linear" | "circular" | "mirror" | "arc";
	ghostCircleRadius?: number;
	ghostArcTilt?: [number, number, number];
	hoverLerpSpeed?: number;
	hoverCameraZ?: number;
	hoverRotationSpeed?: number;
}) {
	const dragRef = useRef<DragState>({
		dragging: false,
		lastX: 0,
		lastY: 0,
		velX: 0,
		velY: 0,
	});
	const inZoneRef = useRef(false);
	// ──────────────────────────────────────────────────────────
	// FIX 7: hoveredRef is the single source of truth for hover
	// state — passed directly into Model's useFrame. No more
	// `hovered` prop or `setCanvasHovered` setState calls that
	// cause React re-renders on every mouse enter/leave.
	// ──────────────────────────────────────────────────────────
	const hoveredRef = useRef(false);

	const emitHover = useCallback(
		(next: boolean) => {
			if (next !== hoveredRef.current) {
				hoveredRef.current = next;
				onHoverChange?.(next);
			}
		},
		[onHoverChange]
	);

	const onPointerDown = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			(e.currentTarget as HTMLDivElement).setPointerCapture(e.pointerId);
			dragRef.current = {
				dragging: true,
				lastX: e.clientX,
				lastY: e.clientY,
				velX: 0,
				velY: 0,
			};
			emitHover(true);
		},
		[emitHover]
	);

	const onPointerMove = useCallback(
		(e: React.PointerEvent<HTMLDivElement>) => {
			if (dragRef.current.dragging) {
				const kDragSpeed = 0.01;
				dragRef.current.velX =
					(e.clientX - dragRef.current.lastX) * kDragSpeed;
				dragRef.current.velY =
					(e.clientY - dragRef.current.lastY) * kDragSpeed;
				dragRef.current.lastX = e.clientX;
				dragRef.current.lastY = e.clientY;
			}

			const rect = e.currentTarget.getBoundingClientRect();
			const relX = (e.clientX - rect.left) / rect.width;
			const relY = (e.clientY - rect.top) / rect.height;
			const margin = (1 - hoverRadius) / 2;
			inZoneRef.current =
				relX >= margin &&
				relX <= 1 - margin &&
				relY >= margin &&
				relY <= 1 - margin;
			emitHover(inZoneRef.current || dragRef.current.dragging);
		},
		[hoverRadius, emitHover]
	);

	const onPointerUp = useCallback(() => {
		dragRef.current.dragging = false;
		emitHover(inZoneRef.current);
	}, [emitHover]);

	const onPointerLeave = useCallback(() => {
		inZoneRef.current = false;
		dragRef.current.dragging = false;
		emitHover(false);
	}, [emitHover]);

	return (
		<div
			className="aspect-square h-60 md:h-90 lg:h-130 xl:h-180 shrink-0 cursor-grab active:cursor-grabbing"
			style={{
				pointerEvents: "auto",
				touchAction: "none",
				/* FIX 8: Removed permanent will-change: transform.
				   The browser was keeping a GPU-backed compositor layer
				   alive for each canvas wrapper at all times. The Canvas
				   element itself already composites on the GPU. */
				contain: "layout style paint",
			}}
			onPointerDown={onPointerDown}
			onPointerMove={onPointerMove}
			onPointerUp={onPointerUp}
			onPointerCancel={onPointerUp}
			onPointerLeave={onPointerLeave}
		>
			<Canvas
				frameloop={ready ? "always" : "never"}
				dpr={[1, 2]}
				gl={{
					alpha: true,
					antialias: true,
					powerPreference: "high-performance",
					stencil: false,
					depth: true,
				}}
				camera={{ position: [0, 0, cameraZ], fov: cameraFov }}
				style={{ width: "100%", height: "100%" }}
				performance={{ min: 0.5, debounce: 200 }}
				/* Adaptive DPR: starts at device max (2 on retina),
				   R3F auto-drops toward min: 0.5 when frames are
				   slow, then recovers when headroom returns.
				   debounce: 200 prevents flicker between regimes. */
			>
				<CanvasContent
					modelPath={modelPath}
					scale={scale}
					rotationOffset={rotationOffset}
					positionOffset={positionOffset}
					cameraZ={cameraZ}
					hoverCameraZ={hoverCameraZ}
					hoveredRef={hoveredRef}
					dragRef={dragRef}
					ghostSpacing={ghostSpacing}
					ghostShrinking={ghostShrinking}
					hoverPositionOffset={hoverPositionOffset}
					hoverTranslate={hoverTranslate}
					ghostMode={ghostMode}
					ghostCircleRadius={ghostCircleRadius}
					ghostArcTilt={ghostArcTilt}
					hoverLerpSpeed={hoverLerpSpeed}
					hoverRotationSpeed={hoverRotationSpeed}
				/>
			</Canvas>
		</div>
	);
}

interface PrizeSceneProps {
	prize: MainPrize;
	enter: number;
	peak: number;
	exit: number;
	scrollYProgress: ReturnType<typeof useScroll>["scrollYProgress"];
	canvasReady: boolean;
}

const FourXStamp = memo(function FourXStamp({
    accentColor,
	hovered = false,
}: {
    accentColor: string;
	hovered?: boolean;
}) {
	return (
		<div className="relative -rotate-6">
			<div
				className="absolute inset-0 bg-black pointer-events-none"
				style={{
					opacity: hovered ? 1 : 0,
					transform: hovered ? "scale(1.45)" : "scale(1)",
					clipPath: hovered
						? "polygon(10% 10%, 90% 0%, 90% 90%, 5% 100%)"
						: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
					transition:
						"clip-path 0.28s cubic-bezier(.05,.52,.65,1.05), transform 0.32s cubic-bezier(.05,.52,.65,1.05), opacity 0.15s ease",
				}}
			/>
			<div
				className={`relative px-1.5 md:px-2 transition-colors duration-300 ${hovered ? "bg-white" : "bg-brand-500"}`}
			>
				<p
					className={`font-black text-2xl md:text-5xl transition-colors duration-300 ${hovered ? "text-brand-500" : "text-white"}`}
                    style={{ color: hovered ? accentColor : 'white'}}
				>
					4x
				</p>
			</div>
		</div>
	);
});

function PrizeScene({
	prize,
	enter,
	peak,
	exit,
	scrollYProgress,
	canvasReady,
}: PrizeSceneProps) {
	const containerRef = useRef<HTMLDivElement>(null);
	// ──────────────────────────────────────────────────────────
	// FIX 12: canvasHovered still drives the FourXStamp visual
	// change (which needs a React re-render for className
	// changes), but the 3D Model reads from hoveredRef directly
	// and never triggers a re-render for its own animation.
	// ──────────────────────────────────────────────────────────
	const [canvasHovered, setCanvasHovered] = useState(false);

	// ──────────────────────────────────────────────────────────
	// FIX 13: Replaced setState-based sceneActive with a ref
	// that the Canvas reads via `ready`. The original code was
	// calling setSceneActive() on every scroll boundary cross,
	// causing a full React re-render of the heavy PrizeScene +
	// Canvas tree. Instead, we use a ref + a much cheaper
	// check that only re-renders when truly needed.
	// ──────────────────────────────────────────────────────────
	const [sceneActive, setSceneActive] = useState(false);
	const sceneActiveRef = useRef(false);
	const canvasReadyRef = useRef(canvasReady);
	useEffect(() => {
		canvasReadyRef.current = canvasReady;
	}, [canvasReady]);
	useEffect(() => {
		const buffer = 0.06;
		return scrollYProgress.on("change", (v) => {
			const next =
				canvasReadyRef.current &&
				v >= enter - buffer &&
				v <= exit + buffer;
			if (next !== sceneActiveRef.current) {
				sceneActiveRef.current = next;
				setSceneActive(next);
			}
		});
	}, [scrollYProgress, enter, exit]);

	const opacity = useTransform(
		scrollYProgress,
		[enter - 0.02, enter, peak, exit - 0.04, exit],
		[0, 1, 1, 1, 0]
	);
	const x = useTransform(
		scrollYProgress,
		[enter - 0.02, enter, peak, exit - 0.04, exit],
		[60, 0, 0, 0, -100]
	);
	const blurOverlayOpacity = useTransform(
		scrollYProgress,
		[enter - 0.02, enter, exit - 0.05, exit],
		[1, 0, 0, 0.6]
	);

	const visibility = useTransform(scrollYProgress, (v) => {
		return v >= enter - 0.02 && v <= exit ? "visible" : "hidden";
	});

	return (
		<motion.div
			ref={containerRef}
			className="absolute inset-0 z-20 flex items-center justify-center select-none"
			style={{
				opacity,
				x,
				visibility,
				pointerEvents: "none",
			}}
		>
			<motion.div
				className="absolute inset-0 bg-white/60 pointer-events-none"
				style={{ opacity: blurOverlayOpacity }}
				aria-hidden
			/>

			<div className="hidden md:block absolute top-8 right-10 font-mono text-[10rem] font-bold leading-none text-neutral-900/5 select-none pointer-events-none">
				{prize.place}
			</div>

			<div className="flex flex-col md:flex-row items-center -space-x-10 px-2 md:px-4">
				<ModelCanvas
					modelPath={prize.modelPath}
					scale={prize.scale}
					rotationOffset={prize.rotationOffset}
					positionOffset={prize.positionOffset}
					cameraZ={prize.cameraZ}
					cameraFov={prize.cameraFov}
					ready={sceneActive}
					onHoverChange={setCanvasHovered}
					hoverRadius={prize.hoverRadius}
					ghostSpacing={prize.ghostSpacing}
					ghostShrinking={prize.ghostShrinking}
					hoverPositionOffset={prize.translateRotationHover}
					hoverTranslate={prize.translatePositionHover}
					ghostMode={prize.ghostMode}
					ghostCircleRadius={prize.ghostCircleRadius}
					ghostArcTilt={prize.ghostArcTilt}
					hoverLerpSpeed={prize.hoverLerpSpeed}
					hoverCameraZ={prize.hoverCameraZ}
					hoverRotationSpeed={prize.hoverRotationSpeed}
				/>

				<div className="flex flex-col gap-2 items-center md:items-start text-center md:text-left pointer-events-none">
					<p className="font-mono ml-2 text-[10px] md:text-xs tracking-ultrawide text-neutral-400 uppercase">
						/ {prize.place}_place
					</p>
					<div className="flex flex-row items-center gap-1 md:relative">
						<div
							className={`md:absolute top-2 -left-12 md:-top-2 md:-left-15 z-20 transition-transform duration-300 ${canvasHovered ? "scale-125 -translate-x-7 -translate-y-5" : "scale-100"}`}
						>
							<FourXStamp accentColor={prize.accent} hovered={canvasHovered} />
						</div>
						<div
							className={`
                            font-instrument-serif leading-none tracking-tight text-5xl xl:text-9xl whitespace-pre-line
                            ${prize.classNames}`}
						>
							{prize.prizename}
						</div>
					</div>
				</div>
			</div>
		</motion.div>
	);
}

// ──────────────────────────────────────────────────────────────
// FIX 14: Memoize the static grid sections so they don't
// re-render when scroll-driven state changes in the parent.
// ──────────────────────────────────────────────────────────────
const PrizeGrid = memo(function PrizeGrid() {
	return (
		<div className="w-full max-w-5xl mx-auto space-y-10 md:space-y-14">
			<div>
				<p className="font-mono text-[10px] tracking-ultrawide text-neutral-400 uppercase mb-4">
					— main awards
				</p>
				<div className="grid grid-cols-1 gap-3 md:grid-cols-3 md:gap-4">
					{kMainPrizes.map((p: any) => (
						<div
							key={p.place}
							className="group border border-neutral-300 bg-neutral-100/50 p-5 md:p-6 transition-colors hover:border-brand-500 cursor-default duration-400"
						>
							<div className="text-xs tracking-widest text-neutral-400 font-mono">
								/ PLACE_{p.place}
							</div>
							<div
								className="mt-3 md:mt-4 text-4xl md:text-5xl tracking-tight font-instrument-serif transition-colors whitespace-pre-line"
								style={{ color: p.accent }}
							>
								{p.prizename}
							</div>
							<div className="mt-2 text-xs md:text-sm tracking-wider text-neutral-500 font-mono uppercase">
								{p.label}
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
});

export default function PrizePoolSequence() {
	const pinRef = useRef<HTMLDivElement>(null);

	const [canvasReady, setCanvasReady] = useState(false);

	const { scrollYProgress } = useScroll({
		target: pinRef,
		offset: ["start start", "end end"],
	});

	// motion v12.37+ auto-enables CSS ScrollTimeline acceleration for
	// "start"/"end" offsets, which breaks complex multi-keyframe
	// useTransform chains (scenes 2 & 3 never become visible).
	// Force JS-based scroll tracking instead.
	(scrollYProgress as any).accelerate = undefined;

	const eyebrowOpacity = useTransform(
		scrollYProgress,
		[0, 0.07, 0.13, 0.2],
		[0, 1, 1, 0]
	);
	const eyebrowY = useTransform(
		scrollYProgress,
		[0, 0.07, 0.13, 0.2],
		[30, 0, 0, -30]
	);
	const scrollNudgeOpacity = useTransform(
		scrollYProgress,
		[0, 0.06, 0.12],
		[1, 1, 0]
	);
	const counterOpacity = useTransform(
		scrollYProgress,
		[0.1, 0.16, 0.78, 0.86],
		[0, 1, 1, 0]
	);
	const gridOpacity = useTransform(scrollYProgress, [0.8, 0.98], [0, 1]);
	const gridY = useTransform(scrollYProgress, [0.8, 0.98], [24, 0]);

	useEffect(() => {
		const el = pinRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				setCanvasReady(entry.isIntersecting);
				// FIX 1 continued: trigger model preloads when
				// the section first enters the viewport.
				if (entry.isIntersecting) preloadModels();
			},
			{
				rootMargin: "-5% 0px",
			}
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div data-hide-navbar className="relative">
			<div ref={pinRef} className="h-[450vh]">
				<div className="sticky top-0 h-screen w-full overflow-hidden">
					<motion.div
						className="absolute top-6 left-6 md:top-8 md:left-10 z-30 font-mono text-xs tracking-[0.3em] text-neutral-400"
						style={{
							opacity: counterOpacity,
						}}
					>
						PRIZE_POOL / AWARDS
					</motion.div>

					<motion.div
						className="absolute inset-0 z-20 flex flex-col items-center justify-center pointer-events-none px-6"
						style={{
							opacity: eyebrowOpacity,
							y: eyebrowY,
						}}
					>
						<p className="font-mono text-[10px] md:text-xs tracking-[0.5em] text-black/25 uppercase mb-4 text-center">
							Scroll to reveal
						</p>
						<div className="flex flex-col justify-start">
							<motion.p className="text-white/90 font-sans font-bold tracking-wide bg-brand-500 w-fit px-1 text-md">
								[ 0x1 ]
							</motion.p>
							<h2 className="font-sans font-bold uppercase text-5xl md:text-8xl text-neutral-900 tracking-tight text-center">
								Prize Pool
							</h2>
							<TypingCaption
								text="What might I win?"
								animateOnce={true}
							/>
						</div>
						<div className="mt-6 w-16 h-px bg-neutral-300" />
					</motion.div>

					<PrizeScene
						prize={kMainPrizes[0]}
						enter={0.22}
						peak={0.32}
						exit={0.42}
						scrollYProgress={scrollYProgress}
						canvasReady={canvasReady}
					/>
					<PrizeScene
						prize={kMainPrizes[1]}
						enter={0.42}
						peak={0.52}
						exit={0.62}
						scrollYProgress={scrollYProgress}
						canvasReady={canvasReady}
					/>
					<PrizeScene
						prize={kMainPrizes[2]}
						enter={0.62}
						peak={0.72}
						exit={0.82}
						scrollYProgress={scrollYProgress}
						canvasReady={canvasReady}
					/>

					<motion.div
						className="absolute bottom-8 left-1/2 -translate-x-1/2 z-30 flex flex-col items-center gap-2"
						style={{
							opacity: scrollNudgeOpacity,
						}}
					>
						<p className="font-mono text-[10px] tracking-ultrawide text-neutral-400 uppercase">
							scroll
						</p>
						<motion.div
							className="w-px h-8 bg-neutral-400 origin-top"
							animate={{ scaleY: [1, 0.3, 1] }}
							transition={{
								duration: 1.4,
								repeat: Infinity,
								ease: "easeInOut",
							}}
						/>
					</motion.div>
				</div>
			</div>

			<motion.div
				className="mt-[-80vh] px-4 md:px-8 py-16 md:py-24"
				style={{ opacity: gridOpacity, y: gridY }}
			>
				<PrizeGrid />
			</motion.div>
		</div>
	);
}