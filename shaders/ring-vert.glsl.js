/**
 * /shaders/ring-vert.glsl.js
 * Gyroscopic Torus Ring Vertex Shader.
 */

export const ringVertexShader = /* glsl */`
#version 300 es
precision highp float;

in vec3 position;
in vec3 normal;
in vec2 uv;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
uniform mat3 normalMatrix;
uniform float uTime;
uniform float uScrollVelocity;
uniform float uXray;

out vec3 vPosition;
out vec3 vWorldPosition;
out vec3 vNormal;
out vec2 vUv;

void main() {
  vUv = uv;
  vPosition = position;
  vNormal = normalize(normalMatrix * normal);
  
  // Ribbon wave deformation along ring angle
  float angle = atan(position.y, position.x);
  float wave = sin(angle * 6.0 + uTime * 3.0) * 0.12 * (1.0 + abs(uScrollVelocity) * 0.05);
  
  vec3 displacedPosition = position + normal * wave * (1.0 - uXray * 0.7);
  
  vec4 worldPos = modelViewMatrix * vec4(displacedPosition, 1.0);
  vWorldPosition = worldPos.xyz;
  gl_Position = projectionMatrix * worldPos;
}
`;
