"use client";
import type { RefObject } from "react";
import { useMemo, useRef, useEffect, useState } from "react";
import { useFrame, useThree, Canvas } from "@react-three/fiber";
import { Vector2 } from "three";

const kStandardVertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = position.xy * 0.5 + 0.5;
    gl_Position = vec4(position, 1.0);
  }
`;

type ShadedPlaneProps = {
	fragmentShader: string;
	mouse: RefObject<Vector2>;
};

// Renders one demand frame on mount so the shader compiles during idle time,
// not on the first active frame when the user scrolls into view.
const ShaderWarmUp = () => {
	const { invalidate } = useThree();
	useEffect(() => {
		invalidate();
	}, [invalidate]);
	return null;
};

const ShadedPlane = ({ fragmentShader, mouse }: ShadedPlaneProps) => {
	const uniforms = useMemo(
		() => ({
			u_time: { value: 0 },
			u_resolution: { value: new Vector2(1, 1) },
			u_delta: { value: 0 },
			u_mouse: { value: new Vector2(0.5, 0.5) },
		}),
		[],
	);
	const uniformsRef = useRef(uniforms);

	useFrame(({ size, clock }) => {
		const nextUniforms = uniformsRef.current;
		nextUniforms.u_time.value = clock.getElapsedTime();
		nextUniforms.u_delta.value = clock.getDelta();
		nextUniforms.u_mouse.value.copy(mouse.current);
		nextUniforms.u_resolution.value.set(size.width, size.height);
	});

	return (
		<mesh frustumCulled={false}>
			<planeGeometry args={[2, 2]} />
			<shaderMaterial
				vertexShader={kStandardVertexShader}
				fragmentShader={fragmentShader}
				uniforms={uniforms}
				depthTest={false}
				depthWrite={false}
			/>
		</mesh>
	);
};

type ShaderDivProps = {
	children?: React.ReactNode;
	className?: string;
	fragmentShader: string;
	dpr?: number;
	imageRendering?: React.CSSProperties["imageRendering"];
	active?: boolean;
	deactivateDelay?: number;
};

export const ShaderDiv = ({
	children,
	className,
	fragmentShader,
	dpr = 1,
	imageRendering = "auto",
	active = true,
	deactivateDelay = 0,
}: ShaderDivProps) => {
	const mouse = useRef(new Vector2(0.5, 0.5));
	const [frameloopActive, setFrameloopActive] = useState(active);

	useEffect(() => {
		if (active) {
			setFrameloopActive(true);
			return;
		}
		if (deactivateDelay <= 0) {
			setFrameloopActive(false);
			return;
		}
		const id = setTimeout(() => setFrameloopActive(false), deactivateDelay);
		return () => clearTimeout(id);
	}, [active, deactivateDelay]);

	return (
		<div className={className}>
			<Canvas
				className="w-full h-full"
				orthographic
				camera={{ near: 0, far: 1, position: [0, 0, 0.5] }}
				dpr={dpr}
				frameloop={frameloopActive ? "always" : "never"}
				style={{ imageRendering }}
				gl={{ antialias: false, alpha: false }}
				onPointerMove={(e) => {
					const target = e.target as HTMLCanvasElement;
					const rect = target.getBoundingClientRect();
					const x = (e.clientX - rect.left) / rect.width;
					const y = (e.clientY - rect.top) / rect.height;
					if (Number.isFinite(x) && Number.isFinite(y)) {
						mouse.current.set(
							Math.min(Math.max(x, 0), 1),
							Math.min(Math.max(y, 0), 1),
						);
					}
				}}
			>
				<ShaderWarmUp />
				<ShadedPlane fragmentShader={fragmentShader} mouse={mouse} />
			</Canvas>
			{children}
		</div>
	);
};
