"use client";

import { useGLTF } from "@react-three/drei";
import { Canvas, useFrame } from "@react-three/fiber";
import { Suspense, useEffect, useRef, useState } from "react";
import {
	Mesh,
	Color,
	Object3D,
	Group,
	Scene,
	PerspectiveCamera,
	DirectionalLight,
	WebGLRenderer,
	Camera,
} from "three";
import { AsciiEffect } from "three/examples/jsm/effects/AsciiEffect.js";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// ── Constants ─────────────────────────────────────────────────────────────────
const kModelPath = "/models/duck2.glb";
const kModelScale = 1.3;
const kCameraFov = 25;
const kCameraPosition = [0, 0, 4] as const;

// Glitch timing
const kGlitchInitialDelay = 4000; // ms before first glitch
const kGlitchMinInterval = 8000; // ms minimum between glitches
const kGlitchMaxInterval = 16000; // ms maximum between glitches
const kGlitchFlickers = 8; // how many flickers during transition
const kGlitchFlickerMs = 60; // ms per flicker

// How often the glitch settles into 3D mode (0 = never, 1 = always)
const k3dModeProbability = 0.01;
const kWireframeProbability = 1.03;

// ASCII appearance
const kAsciiChars = " .:-+*=%@#";
const kAsciiFontSize = 9; // px — smaller = denser

// ── Shared mouse ──────────────────────────────────────────────────────────────
const sharedMouse = { x: 0, y: 0 };
if (typeof window !== "undefined") {
	window.addEventListener("mousemove", (e) => {
		sharedMouse.x = (e.clientX / window.innerWidth) * 2 - 1;
		sharedMouse.y = -((e.clientY / window.innerHeight) * 2 - 1);
	});
}

function applyDuckRotation(group: Object3D, smoothMouse: { x: number; y: number }, t: number) {
	group.rotation.y = smoothMouse.x * 1.05 + Math.PI;
	group.rotation.x = smoothMouse.y * -0.45 - 0.05;
	group.rotation.z = Math.sin(t * 0.9) * 0.02 + smoothMouse.x * -0.04;
	group.position.y = Math.sin(t * 1.1) * 0.08 + smoothMouse.y * 0.05;
}

// ── R3F Duck ──────────────────────────────────────────────────────────────────
function DuckModel({
	opacity,
	groupRef,
	mouthRef,
	wireframe,
}: {
	opacity: React.MutableRefObject<number>;
	groupRef: React.MutableRefObject<Group | null>;
	mouthRef: React.MutableRefObject<number>;
	wireframe: React.MutableRefObject<boolean>;
}) {
	const { scene } = useGLTF(kModelPath);
	const smoothMouse = useRef({ x: 0, y: 0 });
	const morphMeshes = useRef<Mesh[]>([]);
	const currentMouth = useRef(0);
	const isWireframe = useRef(false);

	useEffect(() => {
		scene.traverse((obj: any) => {
			if (obj.isMesh) {
				obj.material = obj.material.clone();
				obj.material.transparent = true;
				if (obj.morphTargetDictionary && "Open" in obj.morphTargetDictionary) {
					morphMeshes.current.push(obj);
				}
			}
		});
	}, [scene]);

	useFrame((state, delta) => {
		if (!groupRef.current) return;
		const { x, y } = state.mouse;
		smoothMouse.current.x += (x - smoothMouse.current.x) * 0.04;
		smoothMouse.current.y += (y - smoothMouse.current.y) * 0.04;
		applyDuckRotation(groupRef.current, smoothMouse.current, state.clock.elapsedTime);
		const dt = Math.min(delta, 0.05);
		currentMouth.current += (mouthRef.current - currentMouth.current) * Math.min(1, dt * 12);

		// Toggle wireframe if state changed
		if (wireframe.current !== isWireframe.current) {
			isWireframe.current = wireframe.current;
			scene.traverse((obj: any) => {
				if (obj.isMesh) {
					obj.material.wireframe = isWireframe.current;
					// Bright green wireframe
					if (isWireframe.current) {
						obj.material.color = new Color("#39ff14");
						obj.material.opacity = 0.9;
					} else {
						obj.material.color = new Color("#ffffff");
						obj.material.opacity = opacity.current;
					}
				}
			});
		}

		morphMeshes.current.forEach((mesh) => {
			const idx = mesh.morphTargetDictionary!["Open"];
			if (mesh.morphTargetInfluences) {
				mesh.morphTargetInfluences[idx] = currentMouth.current;
			}
		});
		scene.traverse((obj: any) => {
			if (obj.isMesh && !isWireframe.current) obj.material.opacity = opacity.current;
		});
	});

	return (
		<group ref={groupRef} scale={kModelScale}>
			<primitive object={scene} />
		</group>
	);
}

// ── ASCII Canvas ──────────────────────────────────────────────────────────────
function AsciiCanvas({
	containerRef,
	asciiOpacity,
	syncRef,
	mouthRef,
	runningRef,
	onResumeLoop,
}: {
	containerRef: React.RefObject<HTMLDivElement | null>;
	asciiOpacity: React.MutableRefObject<number>;
	syncRef: React.MutableRefObject<Group | null>;
	mouthRef: React.MutableRefObject<number>;
	runningRef?: React.MutableRefObject<boolean>;
	onResumeLoop?: (resume: () => void) => void;
}) {
	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		const w = container.clientWidth;
		const h = container.clientHeight;

		const scene = new Scene();
		const dirLight = new DirectionalLight(0xffffff, 1.5);
		dirLight.position.set(1, 2, 3);
		scene.add(dirLight);

		const camera = new PerspectiveCamera(kCameraFov, w / h, 0.1, 100);
		camera.position.set(...kCameraPosition);

		const renderer = new WebGLRenderer({ antialias: false, alpha: true });
		renderer.setClearColor(0x000000, 0);
		renderer.setSize(w, h);

		const effect = new AsciiEffect(renderer, kAsciiChars, { invert: false });
		effect.setSize(w, h);
		effect.domElement.style.color = "#336e29";
		effect.domElement.style.backgroundColor = "transparent";
		effect.domElement.style.position = "absolute";
		effect.domElement.style.inset = "0";
		effect.domElement.style.pointerEvents = "none";
		effect.domElement.style.fontFamily = "monospace";
		effect.domElement.style.fontSize = `${kAsciiFontSize}px`;
		effect.domElement.style.lineHeight = `${kAsciiFontSize}px`;
		container.appendChild(effect.domElement);

		// Patch render to strip td backgrounds AsciiEffect writes every frame
		const originalRender = effect.render.bind(effect);
		(effect as any).render = (s: Scene, c: Camera) => {
			originalRender(s, c);
			effect.domElement.style.backgroundColor = "transparent";
			(effect.domElement as HTMLElement).style.background = "transparent";
			effect.domElement.querySelectorAll("td").forEach((td) => {
				(td as HTMLElement).style.backgroundColor = "transparent";
				(td as HTMLElement).style.background = "transparent";
			});
		};

		let duck: Group | null = null;
		const morphMeshes: Mesh[] = [];
		let currentMouth = 0;
		const loader = new GLTFLoader();
		loader.load(kModelPath, (gltf) => {
			duck = new Group();
			duck.add(gltf.scene);
			duck.scale.setScalar(kModelScale);
			scene.add(duck);
			gltf.scene.traverse((obj: any) => {
				if (obj.isMesh && obj.morphTargetDictionary && "Open" in obj.morphTargetDictionary) {
					morphMeshes.push(obj);
				}
			});
		});

		let animId: number;
		const animate = () => {
			if (runningRef && !runningRef.current) return;
			animId = requestAnimationFrame(animate);
			// Mirror transform exactly from the R3F duck
			if (duck && syncRef.current) {
				duck.rotation.copy(syncRef.current.rotation);
				duck.position.copy(syncRef.current.position);
				duck.scale.copy(syncRef.current.scale);
			}

			currentMouth += (mouthRef.current - currentMouth) * 0.15;
			morphMeshes.forEach((mesh) => {
				const idx = mesh.morphTargetDictionary!["Open"];
				if (mesh.morphTargetInfluences) mesh.morphTargetInfluences[idx] = currentMouth;
			});

			// render
			effect.domElement.style.opacity = String(asciiOpacity.current);
			effect.render(scene, camera);
		};

		const resume = () => {
			if (animId) cancelAnimationFrame(animId);
			animate();
		};
		onResumeLoop?.(resume);
		animate();

		const onResize = () => {
			const nw = container.clientWidth;
			const nh = container.clientHeight;
			camera.aspect = nw / nh;
			camera.updateProjectionMatrix();
			renderer.setSize(nw, nh);
			effect.setSize(nw, nh);
		};
		window.addEventListener("resize", onResize);

		return () => {
			cancelAnimationFrame(animId);
			window.removeEventListener("resize", onResize);
			effect.domElement.remove();
			renderer.dispose();
		};
	}, []);

	return null;
}

// ── Glitch overlay ────────────────────────────────────────────────────────────
function GlitchOverlay({ active }: { active: boolean }) {
	return (
		<div
			style={{
				position: "absolute",
				inset: 0,
				pointerEvents: "none",
				zIndex: 10,
				opacity: active ? 1 : 0,
				transition: "opacity 0.05s",
				background: active
					? `repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(57,255,20,0.03) 2px, rgba(57,255,20,0.03) 4px)`
					: "none",
				mixBlendMode: "screen",
			}}
		/>
	);
}

// ── Main ──────────────────────────────────────────────────────────────────────
export default function WebDuck({
	onMouthControl,
	runningRef,
	onResumeLoop,
}: {
	onMouthControl?: (fn: (open: boolean) => void) => void;
	runningRef?: React.MutableRefObject<boolean>;
	onResumeLoop?: (resume: () => void) => void;
}) {
	const mouthOpenRef = useRef(0);
	const containerRef = useRef<HTMLDivElement>(null);
	const asciiOpacity = useRef(1); // ASCII on by default
	const r3fOpacity = useRef(0); // 3D hidden by default
	const wireframeRef = useRef(false); // ← add this

	const duckRef = useRef<Group | null>(null);
	const [glitchActive, setGlitchActive] = useState(false);
	const [filterStyle, setFilterStyle] = useState("");
	useEffect(() => {
		onMouthControl?.((open: boolean) => {
			mouthOpenRef.current = open ? 1 : 0;
		});
	}, [onMouthControl]);

	useEffect(() => {
		let timeout: ReturnType<typeof setTimeout>;

		const glitchCycle = () => {
			setGlitchActive(true);

			const offsetX = (Math.random() * 6 - 3).toFixed(1);
			const offsetY = (Math.random() * 2 - 1).toFixed(1);
			setFilterStyle(
				`drop-shadow(${offsetX}px ${offsetY}px 0 rgba(255,0,80,0.7)) drop-shadow(-${offsetX}px -${offsetY}px 0 rgba(0,255,255,0.7))`,
			);

			let flickers = 0;
			const flickerInterval = setInterval(() => {
				const rand = Math.random();
				asciiOpacity.current = rand > 0.5 ? 1 : 0;
				r3fOpacity.current = 1 - asciiOpacity.current;
				wireframeRef.current = r3fOpacity.current === 1 && Math.random() > 0.5;
				flickers++;

				if (flickers > kGlitchFlickers) {
					clearInterval(flickerInterval);

					const roll = Math.random();
					if (roll < kWireframeProbability) {
						// Wireframe mode — show 3D layer with wireframe on
						wireframeRef.current = true;
						r3fOpacity.current = 1;
						asciiOpacity.current = 0;
					} else if (roll < kWireframeProbability + k3dModeProbability) {
						// Plain 3D mode
						wireframeRef.current = false;
						r3fOpacity.current = 1;
						asciiOpacity.current = 0;
					} else {
						// Back to ASCII (default)
						wireframeRef.current = false;
						r3fOpacity.current = 0;
						asciiOpacity.current = 1;
					}

					setGlitchActive(false);
					setFilterStyle("");
				}
			}, kGlitchFlickerMs);

			const nextIn = kGlitchMinInterval + Math.random() * (kGlitchMaxInterval - kGlitchMinInterval);
			timeout = setTimeout(glitchCycle, nextIn);
		};

		timeout = setTimeout(glitchCycle, kGlitchInitialDelay);
		return () => clearTimeout(timeout);
	}, []);

	return (
		<div
			ref={containerRef}
			style={{
				position: "relative",
				width: "100%",
				height: "100%",
				minHeight: "400px",
				background: "transparent",
				overflow: "hidden",
				filter: filterStyle,
				transition: "filter 0.05s",
			}}
		>
			{/* 3D layer — under ASCII */}
			<div style={{ position: "absolute", inset: 0 }}>
				<Canvas
					frameloop="always"
					gl={{ alpha: true, antialias: false }}
					camera={{ position: [...kCameraPosition], fov: kCameraFov }}
				>
					<directionalLight intensity={1.5} position={[1, 2, 3]} />
					<ambientLight intensity={0.4} />
					<Suspense fallback={null}>
						<DuckModel
							opacity={r3fOpacity}
							groupRef={duckRef}
							mouthRef={mouthOpenRef}
							wireframe={wireframeRef}
						/>
					</Suspense>
				</Canvas>
			</div>

			{/* ASCII layer — default visible */}
			<AsciiCanvas
				containerRef={containerRef}
				asciiOpacity={asciiOpacity}
				syncRef={duckRef}
				mouthRef={mouthOpenRef}
				runningRef={runningRef}
				onResumeLoop={onResumeLoop}
			/>

			<GlitchOverlay active={glitchActive} />
		</div>
	);
}

if (typeof window !== "undefined") {
	useGLTF.preload(kModelPath);
}
