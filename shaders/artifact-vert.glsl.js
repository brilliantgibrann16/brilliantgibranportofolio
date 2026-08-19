/**
 * /shaders/artifact-vert.glsl.js
 * Project Constellation Artifact Vertex Shader.
 * Handles breathing geometric deformation, pulse on hover/active, and world transforms.
 */

export const artifactVertexShader = /* glsl */`
#version 300 es
precision highp float;

in vec3 position;
in vec3 normal;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float uTime;
uniform float uHover;
uniform float uActive;
uniform float uXray;

out vec3 vPosition;
out vec3 vWorldPosition;
out vec3 vNormal;
out vec2 vUv;
out float vPulse;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  
  // Dynamic breathing frequency
  float freq = uTime * 2.5 + position.x * 2.0;
  vPulse = sin(freq) * 0.5 + 0.5;
  
  // Expand/pulse geometry when hovered or active
  float expand = (0.04 * sin(uTime * 4.0)) + (uHover * 0.15) + (uActive * 0.25);
  vec3 displacedPosition = position + normal * expand * (1.0 - uXray * 0.5);
  
  vec4 worldPos = modelViewMatrix * vec4(displacedPosition, 1.0);
  vWorldPosition = worldPos.xyz;
  
  gl_Position = projectionMatrix * worldPos;
}
`;
