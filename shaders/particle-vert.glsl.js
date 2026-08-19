/**
 * /shaders/particle-vert.glsl.js
 * Particle Field Vertex Shader.
 * 3,000 instances displaced by pointer gravity and scroll velocity.
 */

export const particleVertexShader = /* glsl */`
#version 300 es
precision highp float;

in vec3 position;
in vec2 uv;
// Instanced attributes
in vec3 aOffset;
in float aScale;
in float aPhase;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform float uTime;
uniform vec2 uPointer;
uniform float uScrollVelocity;
uniform float uXray;

out float vAlpha;
out float vXray;
out vec2 vUv;

void main() {
  vUv = uv;
  vXray = uXray;
  
  vec3 pos = aOffset;
  
  // Ambient float
  pos.y += sin(uTime * 0.5 + aPhase) * 1.5;
  pos.x += cos(uTime * 0.3 + aPhase) * 0.8;
  
  // Scroll velocity warp (stretch & streak in Y axis)
  pos.y += uScrollVelocity * (0.05 + aPhase * 0.02);
  
  // Pointer gravity (attract or repel)
  float ptrDist = length(pos.xy - uPointer * 15.0);
  if (ptrDist < 6.0) {
    float force = exp(-ptrDist * ptrDist * 0.15);
    vec2 dir = normalize(pos.xy - uPointer * 15.0);
    pos.xy += dir * force * 1.8 * (sin(aPhase * 10.0) > 0.0 ? 1.0 : -0.5);
  }
  
  vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
  
  // Particle billboard scaling with depth attenuation
  float depthScale = max(0.2, 10.0 / -mvPosition.z);
  float finalScale = aScale * depthScale * (1.0 + min(abs(uScrollVelocity)*0.01, 1.5));
  
  // Stretch particles on Y when scrolling fast
  vec3 localPos = position;
  localPos.y *= 1.0 + abs(uScrollVelocity) * 0.04;
  
  mvPosition.xyz += localPos * finalScale;
  
  // Fade alpha by depth and pulse
  vAlpha = smoothstep(-60.0, -10.0, pos.z) * (0.4 + 0.6 * sin(uTime * 2.0 + aPhase * 10.0));
  
  gl_Position = projectionMatrix * mvPosition;
}
`;
