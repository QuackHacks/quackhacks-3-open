export const kBackgroundShader = /* glsl */ `
precision highp float;

uniform float u_time;
uniform vec2  u_resolution;
varying vec2  vUv;

float tanh_f(float x) {
  float x2 = x * x;
  return x * (27.0 + x2) / (27.0 + 9.0 * x2);
}
vec4 tanh_v4(vec4 v) {
  return vec4(tanh_f(v.x), tanh_f(v.y), tanh_f(v.z), tanh_f(v.w));
}

void main() {
  vec2 uv = (vUv * 2.0 - 1.0) * vec2(u_resolution.x / u_resolution.y, 1.0);

  vec4 fragColor = vec4(0.0);
  float z = 0.0;
  float d = 0.0;

  z = 1.5;
  for(int ii = 0; ii < 20; ii++) {
    float i = float(ii) + 1.0;

    vec3 p = z * normalize(vec3(uv, 1.0));
    p.z -= u_time;

    d = 1.0;
    float d1 = 1.42857;
    float d2 = d1 * 1.42857;
    float d3 = d2 * 1.42857;
    float d4 = d3 * 1.42857;
    float d5 = d4 * 1.42857;

    p += cos(p.yzx           + z * 0.2);
    p += cos(p.yzx * d1      + z * 0.2) / d1;
    p += cos(p.yzx * d2      + z * 0.2) / d2;
    p += cos(p.yzx * d3      + z * 0.2) / d3;
    p += cos(p.yzx * d4      + z * 0.2) / d4;
    p += cos(p.yzx * d5      + z * 0.2) / d5;
    d = d5;

    z += d = 0.02 + 0.1 * abs(3.0 - length(p.xy));

    fragColor += (cos(z + u_time + vec4(0.0, 2.0, 3.14, 3.0)) + 1.0) / d;
  }

  gl_FragColor = tanh_v4((fragColor * vec4(0.6, 1.2, 0.7, 1.0)) / 1000.0);
}
`;
