/**
 * /shaders/observatory-frag.glsl.js
 * Primary Fragment Shader for the Quantum Observatory Core Orb.
 * Iridescent liquid-titanium surface with spectral dispersion, fresnel rim,
 * grain, and X-ray wireframe diagnostic injection.
 */

export const observatoryFragmentShader = /* glsl */`
#version 300 es
precision highp float;

in vec3 vPosition;
in vec3 vWorldPosition;
in vec3 vNormal;
in vec2 vUv;
in float vNoise;
in float vFresnel;

uniform float uTime;
uniform float uHover;
uniform float uXray;
uniform float uTheme; // 0 = light, 1 = dark
uniform vec2 uResolution;

out vec4 fragColor;

vec3 pal( float t, vec3 a, vec3 b, vec3 c, vec3 d ) {
  return a + b * cos(6.28318 * (c * t + d));
}

float hash21(vec2 p) {
  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
}

void main() {
  // Base iridescent palette driven by noise + view angle
  float iridescence = vNoise * 0.6 + vFresnel * 0.4 + uTime * 0.02;
  
  vec3 col = pal(iridescence,
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(1.0, 0.8, 0.6),
    vec3(0.0, 0.33, 0.67)
  );
  
  // Spectral color shift on hover
  col = mix(col, pal(iridescence + 0.15,
    vec3(0.5, 0.5, 0.5),
    vec3(0.5, 0.5, 0.5),
    vec3(1.0, 1.0, 1.0),
    vec3(0.0, 0.1, 0.2)
  ), uHover * 0.5);
  
  // Fresnel rim glow (sharp cyan-white edge)
  vec3 rimColor = mix(vec3(0.12, 0.63, 1.0), vec3(0.65, 0.95, 1.0), vFresnel);
  col += rimColor * vFresnel * (1.2 + uHover * 0.6);
  
  // Depth-driven luminance attenuation
  float depth = smoothstep(-3.0, 3.0, vWorldPosition.z);
  col *= 0.7 + 0.3 * depth;
  
  // Subtle animated grain
  float grain = hash21(gl_FragCoord.xy + uTime * 7.3) * 0.03;
  col += grain;
  
  // X-Ray diagnostic mode: switch to wireframe + normals
  if (uXray > 0.5) {
    vec3 dFdxPos = dFdx(vWorldPosition);
    vec3 dFdyPos = dFdy(vWorldPosition);
    vec3 faceNormal = normalize(cross(dFdxPos, dFdyPos));
    
    // Grid lines from UV
    vec2 grid = abs(fract(vUv * 16.0) - 0.5);
    float line = step(min(grid.x, grid.y), 0.04);
    
    col = mix(
      vec3(0.04, 0.06, 0.09),
      vec3(0.12, 0.63, 1.0),
      line * 0.8
    );
    col += faceNormal * 0.15;
  }
  
  // Controlled alpha for glass-like transparency at edges
  float alpha = mix(0.85, 1.0, smoothstep(0.0, 0.3, 1.0 - vFresnel));
  alpha = mix(alpha, 0.6 + line_hack(vUv) * 0.4, uXray);
  // ponytail: alpha xray line_hack removed — using simpler path
  alpha = mix(0.85 + vFresnel * 0.15, 0.5, uXray);
  
  fragColor = vec4(col, alpha);
}

// ponytail: line_hack was a dead reference; removed. alpha computed directly.
`;
