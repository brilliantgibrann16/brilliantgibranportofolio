/**
 * /shaders/ring-frag.glsl.js
 * Gyroscopic Torus Ring Fragment Shader.
 */

export const ringFragmentShader = /* glsl */`
#version 300 es
precision highp float;

in vec3 vPosition;
in vec3 vWorldPosition;
in vec3 vNormal;
in vec2 vUv;

uniform float uTime;
uniform float uXray;
uniform vec3 uRingColor;

out vec4 fragColor;

void main() {
  vec3 viewDir = normalize(-vWorldPosition);
  float fresnel = pow(1.0 - max(0.0, dot(vNormal, viewDir)), 2.0);
  
  // High-frequency energy pulses traveling around the torus
  float angle = atan(vPosition.y, vPosition.x);
  float pulse = smoothstep(0.7, 1.0, sin(angle * 4.0 - uTime * 4.0));
  
  vec3 col = uRingColor + vec3(0.3, 0.7, 1.0) * pulse * 0.8;
  col += fresnel * 0.5;
  
  if (uXray > 0.5) {
    col = vec3(0.12, 0.63, 1.0) * (0.3 + pulse * 0.7);
  }
  
  float alpha = mix(0.45, 0.9, fresnel + pulse * 0.5);
  if (uXray > 0.5) alpha *= 0.6;
  
  fragColor = vec4(col * alpha, alpha);
}
`;
