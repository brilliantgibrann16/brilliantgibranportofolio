/**
 * /shaders/artifact-frag.glsl.js
 * Project Constellation Artifact Fragment Shader.
 * Category-specific color core with wireframe outer shell and X-ray mode.
 */

export const artifactFragmentShader = /* glsl */`
#version 300 es
precision highp float;

in vec3 vPosition;
in vec3 vWorldPosition;
in vec3 vNormal;
in vec2 vUv;
in float vPulse;

uniform vec3 uColor;
uniform float uTime;
uniform float uHover;
uniform float uActive;
uniform float uXray;

out vec4 fragColor;

void main() {
  vec3 viewDir = normalize(-vWorldPosition);
  float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 2.5);
  
  // Dynamic energy core
  vec3 core = uColor * (0.6 + vPulse * 0.4 + uHover * 0.8 + uActive * 1.2);
  
  // Outer rim highlights
  vec3 rim = mix(uColor, vec3(1.0), fresnel);
  vec3 col = mix(core, rim, fresnel * 0.7);
  
  // Wireframe diagnostic lines across UV surface
  vec2 grid = abs(fract(vUv * 8.0) - 0.5);
  float wire = step(min(grid.x, grid.y), 0.05);
  
  if (uXray > 0.5 || uActive > 0.5) {
    col = mix(col * 0.3, uColor * 1.5, wire);
  }
  
  float alpha = mix(0.75, 1.0, fresnel + uHover * 0.25);
  if (uXray > 0.5 && wire < 0.5) alpha *= 0.25;
  
  fragColor = vec4(col * alpha, alpha);
}
`;
