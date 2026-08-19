/**
 * /shaders/particle-frag.glsl.js
 * Particle Field Fragment Shader.
 */

export const particleFragmentShader = /* glsl */`
#version 300 es
precision highp float;

in float vAlpha;
in float vXray;
in vec2 vUv;
out vec4 fragColor;

void main() {
  // Soft glowing point rendering from raw quad geometry
  float dist = length(vUv - 0.5) * 2.0;
  if (dist > 1.0) discard;
  
  float glow = exp(-dist * dist * 3.0);
  
  vec3 col = vec3(0.12, 0.63, 1.0);
  
  // Xray mode: hollow squares
  if (vXray > 0.5) {
    float edge = step(0.8, dist);
    glow = edge;
    col = vec3(0.0, 1.0, 1.0);
  }
  
  fragColor = vec4(col * glow * vAlpha, glow * vAlpha);
}
`;
