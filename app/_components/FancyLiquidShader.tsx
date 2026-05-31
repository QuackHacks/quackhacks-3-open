import { ShaderDiv } from "@/app/_components/Shaders";

const fragmentShader = /* glsl */ `
precision highp float;

uniform float u_time;
uniform vec2 u_mouse; 
uniform vec2 u_resolution;
varying vec2 vUv;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 34.345);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

vec2 curl(vec2 p) {
  float eps = 0.05;
  float n1 = noise(vec2(p.x, p.y + eps));
  float n2 = noise(vec2(p.x, p.y - eps));
  float n3 = noise(vec2(p.x + eps, p.y));
  float n4 = noise(vec2(p.x - eps, p.y));
  return vec2(n1 - n2, n4 - n3) / (2.0 * eps);
}

// Simple RGB to Hue rotation
vec3 hueShift(vec3 color, float amount) {
    const vec3 k = vec3(0.57735, 0.57735, 0.57735);
    float cosAngle = cos(amount);
    return vec3(color * cosAngle + cross(k, color) * sin(amount) + k * dot(k, color) * (1.0 - cosAngle));
}

float dither4x4(vec2 p) {
  int x = int(mod(p.x, 4.0));
  int y = int(mod(p.y, 4.0));
  int index = x + y * 4;
  if (index == 0) return 0.0625; if (index == 1) return 0.5625; if (index == 2) return 0.1875; if (index == 3) return 0.6875;
  if (index == 4) return 0.8125; if (index == 5) return 0.3125; if (index == 6) return 0.9375; if (index == 7) return 0.4375;
  if (index == 8) return 0.25;   if (index == 9) return 0.75;   if (index == 10) return 0.125;  if (index == 11) return 0.625;
  if (index == 12) return 1.0;    if (index == 13) return 0.5;    if (index == 14) return 0.875;  if (index == 15) return 0.375;
  return 0.0;
}

void main() {
  vec2 uv = vUv * 2.0 - 1.0;
  float aspect = u_resolution.x / max(u_resolution.y, 1.0);
  uv.x *= aspect;
  
  float t = mod(u_time * 0.2, 100.0);

  // --- MOUSE CURSOR SIMULATION ---
  vec2 m = (vec2(u_mouse.x, 1.0 - u_mouse.y) * 2.0 - 1.0);
  m.x *= aspect;

  float mDist = length(uv - m);
  float mArea = smoothstep(0.8, 0.0, mDist);
  
  // Mouse creates a stronger whirlpool
  vec2 mouseVortex = curl(uv * 1.2 + t) * mArea * 0.8;
  
  // Ambient flow to fill "black" spaces
  vec2 ambientFlow = curl(uv * 0.5 - t * 0.2) * 0.15;
  
  vec2 finalUv = uv + ambientFlow + mouseVortex;

  // --- LAYERED LIQUID ---
  // Layer 1: Dense base texture
  float base = noise(finalUv * 4.0 + t * 0.5);
  // Layer 2: Moving "liquid" highlights
  float n = noise(finalUv * 2.5 - t);
  float liquid = pow(noise(finalUv * 1.5 + n + base * 0.5), 1.5);
  
  // Bright glints that follow the churn
  float glint = pow(liquid, 10.0) * (3.0 + mArea * 2.0) * hash(uv + t);

  // --- COLORING ---
  vec3 forest = vec3(52.0/255.0, 124.0/255.0, 69.0/255.0); // #347c45
  vec3 sage = vec3(198.0/255.0, 216.0/255.0, 154.0/255.0);   // #c6d89a
  // Dark green instead of black for "empty" space
  vec3 deepDeepGreen = vec3(0.01, 0.08, 0.04);

  // Base color blend
  vec3 col = mix(deepDeepGreen, forest, liquid);
  col = mix(col, sage, smoothstep(0.4, 0.8, liquid + mArea * 0.2));
  
  // --- HUE ROTATION NEAR MOUSE ---
  // Rotate colors towards cyan/blue based on mouse area
  col = hueShift(col, mArea * 1.2);
  
  col += glint;

  // --- DITHERING ---
  float ditherLimit = dither4x4(gl_FragCoord.xy);
  float levels = 7.0; 
  col = floor(col * levels + ditherLimit) / levels;

  // Vignette
  float vig = smoothstep(1.8, 0.6, length(vUv * 2.0 - 1.0));
  col *= 0.8 + 0.2 * vig;

  gl_FragColor = vec4(col, 1.0);
}
`;

export function FancyLiquidShader() {
	return (
			<ShaderDiv
				dpr={0.5}
				imageRendering="pixelated"
				className="absolute inset-0"
				fragmentShader={fragmentShader}
			/>
	);
}

