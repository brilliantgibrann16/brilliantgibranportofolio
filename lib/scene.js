/**
 * /lib/scene.js — 2026 Procedural Quantum Observatory Engine
 * Three.js WebGL Engine that creates:
 *  1. THE OBSERVATORY ORB (High-density displaced sphere with liquid-titanium/iridescent shader)
 *  2. GYROSCOPIC TORUS RINGS (Precessing procedural rings reacting to scroll & active project)
 *  3. KINETIC PROJECT CONSTELLATION (7 distinct procedural polyhedra representing suaraku, kastanews, etc.)
 *  4. DEEP SPACE ATMOSPHERE (3,000 custom instanced particles with gravity & scroll velocity warp)
 */

import * as THREE from 'three';
import { observatoryVertexShader } from '../shaders/observatory-vert.glsl.js';
import { observatoryFragmentShader } from '../shaders/observatory-frag.glsl.js';
import { particleVertexShader } from '../shaders/particle-vert.glsl.js';
import { particleFragmentShader } from '../shaders/particle-frag.glsl.js';
import { artifactVertexShader } from '../shaders/artifact-vert.glsl.js';
import { artifactFragmentShader } from '../shaders/artifact-frag.glsl.js';
import { ringVertexShader } from '../shaders/ring-vert.glsl.js';
import { ringFragmentShader } from '../shaders/ring-frag.glsl.js';
import { PROJECTS_DATA, PROJECT_KEYS } from '../data/projects.js';

export class ObservatoryScene {
  constructor(canvas) {
    this.canvas = canvas;
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.dpr = Math.min(window.devicePixelRatio || 1, 2);
    
    // Core state
    this.time = 0;
    this.lastTime = performance.now() / 1000;
    this.pointer = new THREE.Vector2(0, 0);
    this.targetPointer = new THREE.Vector2(0, 0);
    this.pointer3D = new THREE.Vector3(0, 0, 0);
    this.scrollProgress = 0;
    this.scrollVelocity = 0;
    this.targetScrollVelocity = 0;
    this.activeProjectId = null;
    this.hoveredProjectId = null;
    this.xrayMode = 0;
    this.targetXray = 0;
    this.themeMode = document.documentElement.classList.contains('dark') ? 1.0 : 0.0;
    
    // Interactive mesh registry
    this.projectArtifacts = {};
    this.raycaster = new THREE.Raycaster();
    this.interactiveMeshes = [];
    
    this.init();
  }

  init() {
    // 1. Renderer
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      alpha: true,
      antialias: this.dpr <= 1.5,
      powerPreference: 'high-performance'
    });
    this.renderer.setSize(this.width, this.height);
    this.renderer.setPixelRatio(this.dpr);
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    // 2. Scene & Camera
    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(45, this.width / this.height, 0.1, 200);
    this.cameraPositionTarget = new THREE.Vector3(0, 0, 14);
    this.cameraLookAtTarget = new THREE.Vector3(0, 0, 0);
    this.camera.position.copy(this.cameraPositionTarget);

    // Group hierarchies
    this.rootGroup = new THREE.Group();
    this.coreGroup = new THREE.Group();
    this.ringsGroup = new THREE.Group();
    this.constellationGroup = new THREE.Group();
    this.particlesGroup = new THREE.Group();
    
    this.rootGroup.add(this.coreGroup);
    this.rootGroup.add(this.ringsGroup);
    this.rootGroup.add(this.constellationGroup);
    this.rootGroup.add(this.particlesGroup);
    this.scene.add(this.rootGroup);

    // 3. Build Procedural Systems
    this.buildObservatoryCore();
    this.buildGyroscopicRings();
    this.buildProjectConstellation();
    this.buildDeepSpaceParticles();

    // 4. Event Listeners
    this.bindEvents();

    // 5. Start RAF Loop
    this.animate();
  }

  buildObservatoryCore() {
    // High-density sphere geometry for smooth procedural displacement
    const geometry = new THREE.IcosahedronGeometry(2.4, 6);
    
    this.observatoryUniforms = {
      uTime: { value: 0 },
      uScrollVelocity: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uDistortion: { value: 0.6 },
      uXray: { value: 0 },
      uTheme: { value: this.themeMode },
      uHover: { value: 0 },
      uResolution: { value: new THREE.Vector2(this.width * this.dpr, this.height * this.dpr) }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: observatoryVertexShader,
      fragmentShader: observatoryFragmentShader,
      uniforms: this.observatoryUniforms,
      transparent: true,
      side: THREE.DoubleSide
    });

    this.coreMesh = new THREE.Mesh(geometry, material);
    this.coreGroup.add(this.coreMesh);
  }

  buildGyroscopicRings() {
    this.ringUniforms = {
      uTime: { value: 0 },
      uScrollVelocity: { value: 0 },
      uXray: { value: 0 },
      uRingColor: { value: new THREE.Color(0x1e9fff) }
    };

    const ringConfigs = [
      { radius: 3.6, tube: 0.04, tiltX: 0.4, tiltY: 0.2, speed: 0.4 },
      { radius: 4.8, tube: 0.03, tiltX: -0.6, tiltY: 0.8, speed: -0.3 },
      { radius: 6.2, tube: 0.025, tiltX: 1.1, tiltY: -0.4, speed: 0.2 }
    ];

    this.rings = [];
    ringConfigs.forEach(cfg => {
      const geo = new THREE.TorusGeometry(cfg.radius, cfg.tube, 16, 128);
      const mat = new THREE.ShaderMaterial({
        vertexShader: ringVertexShader,
        fragmentShader: ringFragmentShader,
        uniforms: this.ringUniforms,
        transparent: true,
        side: THREE.DoubleSide
      });
      const mesh = new THREE.Mesh(geo, mat);
      mesh.rotation.x = cfg.tiltX;
      mesh.rotation.y = cfg.tiltY;
      mesh.userData = { speed: cfg.speed, baseTiltX: cfg.tiltX, baseTiltY: cfg.tiltY };
      this.ringsGroup.add(mesh);
      this.rings.push(mesh);
    });
  }

  buildProjectConstellation() {
    PROJECT_KEYS.forEach(key => {
      const p = PROJECTS_DATA[key];
      let geometry;
      
      switch (p.geometry.type) {
        case 'octahedron':
          geometry = new THREE.OctahedronGeometry(p.geometry.scale, p.geometry.detail);
          break;
        case 'torusKnot':
          geometry = new THREE.TorusKnotGeometry(p.geometry.scale * 0.7, p.geometry.scale * 0.2, p.geometry.detail[0], p.geometry.detail[1], p.geometry.detail[2], p.geometry.detail[3]);
          break;
        case 'spikyIcosahedron':
          geometry = new THREE.IcosahedronGeometry(p.geometry.scale, p.geometry.detail);
          break;
        case 'latticeBox':
          geometry = new THREE.BoxGeometry(p.geometry.scale * 1.4, p.geometry.scale * 1.4, p.geometry.scale * 1.4, p.geometry.detail[0], p.geometry.detail[1], p.geometry.detail[2]);
          break;
        case 'crystalCylinder':
          geometry = new THREE.CylinderGeometry(p.geometry.scale * 0.6, p.geometry.scale * 0.6, p.geometry.scale * 1.5, p.geometry.detail[0], p.geometry.detail[1]);
          break;
        case 'nestedRings':
          geometry = new THREE.TorusGeometry(p.geometry.scale, p.geometry.scale * 0.25, p.geometry.detail[0], p.geometry.detail[1]);
          break;
        default:
          geometry = new THREE.IcosahedronGeometry(p.geometry.scale, 1);
      }

      const uniforms = {
        uColor: { value: new THREE.Color(p.accentHex) },
        uTime: { value: 0 },
        uHover: { value: 0 },
        uActive: { value: 0 },
        uXray: { value: 0 }
      };

      const material = new THREE.ShaderMaterial({
        vertexShader: artifactVertexShader,
        fragmentShader: artifactFragmentShader,
        uniforms: uniforms,
        transparent: true,
        side: THREE.DoubleSide
      });

      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...p.geometry.position);
      mesh.userData = { id: key, rotationSpeed: p.geometry.rotationSpeed, uniforms };
      
      this.constellationGroup.add(mesh);
      this.projectArtifacts[key] = mesh;
      this.interactiveMeshes.push(mesh);
    });
  }

  buildDeepSpaceParticles() {
    const count = 3000;
    const geometry = new THREE.PlaneGeometry(0.08, 0.08);
    
    // Instanced attributes
    const offsets = new Float32Array(count * 3);
    const scales = new Float32Array(count);
    const phases = new Float32Array(count);

    for (let i = 0; i < count; i++) {
      // Stratified depth distribution (-50 to +18)
      offsets[i * 3 + 0] = (Math.random() - 0.5) * 35;
      offsets[i * 3 + 1] = (Math.random() - 0.5) * 35;
      offsets[i * 3 + 2] = (Math.random() - 0.5) * 65 + 10;
      
      scales[i] = 0.5 + Math.random() * 1.5;
      phases[i] = Math.random() * Math.PI * 2;
    }

    geometry.setAttribute('aOffset', new THREE.InstancedBufferAttribute(offsets, 3));
    geometry.setAttribute('aScale', new THREE.InstancedBufferAttribute(scales, 1));
    geometry.setAttribute('aPhase', new THREE.InstancedBufferAttribute(phases, 1));

    this.particleUniforms = {
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uScrollVelocity: { value: 0 },
      uXray: { value: 0 }
    };

    const material = new THREE.ShaderMaterial({
      vertexShader: particleVertexShader,
      fragmentShader: particleFragmentShader,
      uniforms: this.particleUniforms,
      transparent: true,
      depthWrite: false,
      blending: THREE.AdditiveBlending
    });

    this.instancedParticles = new THREE.InstancedMesh(geometry, material, count);
    this.particlesGroup.add(this.instancedParticles);
  }

  bindEvents() {
    window.addEventListener('resize', () => this.onResize(), { passive: true });
    
    window.addEventListener('pointermove', e => {
      this.targetPointer.x = (e.clientX / window.innerWidth) * 2 - 1;
      this.targetPointer.y = -(e.clientY / window.innerHeight) * 2 + 1;
    }, { passive: true });

    // Click handler for 3D project artifact picking
    window.addEventListener('click', e => {
      if (this.hoveredProjectId && window.openProjectExplorer) {
        window.openProjectExplorer(this.hoveredProjectId);
      }
    });

    // Theme toggle observer
    const observer = new MutationObserver(() => {
      this.themeMode = document.documentElement.classList.contains('dark') ? 1.0 : 0.0;
      this.observatoryUniforms.uTheme.value = this.themeMode;
    });
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['class'] });
  }

  onResize() {
    this.width = window.innerWidth;
    this.height = window.innerHeight;
    this.camera.aspect = this.width / this.height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(this.width, this.height);
    this.observatoryUniforms.uResolution.value.set(this.width * this.dpr, this.height * this.dpr);
  }

  setScrollProgress(progress, velocity) {
    this.scrollProgress = progress;
    this.targetScrollVelocity = velocity;
  }

  setXray(active) {
    this.targetXray = active ? 1.0 : 0.0;
  }

  setActiveProject(id) {
    this.activeProjectId = id;
  }

  checkRaycast() {
    this.raycaster.setFromCamera(this.pointer, this.camera);
    const intersects = this.raycaster.intersectObjects(this.interactiveMeshes, false);
    
    let newHoverId = null;
    if (intersects.length > 0) {
      newHoverId = intersects[0].object.userData.id;
      document.body.style.cursor = 'pointer';
    } else {
      document.body.style.cursor = '';
    }

    if (newHoverId !== this.hoveredProjectId) {
      this.hoveredProjectId = newHoverId;
      // Trigger UI custom cursor update or label display if needed
      if (window.onArtifactHover) window.onArtifactHover(newHoverId);
    }
  }

  animate() {
    requestAnimationFrame(() => this.animate());

    const now = performance.now() / 1000;
    const delta = Math.min(now - this.lastTime, 0.1);
    this.lastTime = now;
    this.time += delta;

    // Lerp pointer and scroll velocity for smooth physical momentum
    this.pointer.lerp(this.targetPointer, 0.08);
    this.scrollVelocity = THREE.MathUtils.lerp(this.scrollVelocity, this.targetScrollVelocity, 0.1);
    this.targetScrollVelocity *= 0.9; // decay
    this.xrayMode = THREE.MathUtils.lerp(this.xrayMode, this.targetXray, 0.12);

    // Check raycast intersection for constellation objects
    this.checkRaycast();

    // 1. Update Core Uniforms
    this.observatoryUniforms.uTime.value = this.time;
    this.observatoryUniforms.uScrollVelocity.value = this.scrollVelocity;
    this.observatoryUniforms.uPointer.value.copy(this.pointer);
    this.observatoryUniforms.uXray.value = this.xrayMode;
    this.observatoryUniforms.uHover.value = THREE.MathUtils.lerp(
      this.observatoryUniforms.uHover.value,
      this.hoveredProjectId ? 1.0 : 0.0,
      0.1
    );

    // Core slow rotation
    this.coreGroup.rotation.y = this.time * 0.15 + this.pointer.x * 0.4;
    this.coreGroup.rotation.x = sin(this.time * 0.1) * 0.2 + this.pointer.y * 0.4;

    // 2. Update Gyroscopic Rings
    this.ringUniforms.uTime.value = this.time;
    this.ringUniforms.uScrollVelocity.value = this.scrollVelocity;
    this.ringUniforms.uXray.value = this.xrayMode;
    
    this.rings.forEach((ring, idx) => {
      const speed = ring.userData.speed;
      ring.rotation.z = this.time * speed + this.scrollProgress * Math.PI * (idx + 1);
      ring.rotation.x = THREE.MathUtils.lerp(ring.rotation.x, ring.userData.baseTiltX + this.pointer.y * 0.3, 0.05);
      ring.rotation.y = THREE.MathUtils.lerp(ring.rotation.y, ring.userData.baseTiltY + this.pointer.x * 0.3, 0.05);
    });

    // 3. Update Constellation Artifacts
    PROJECT_KEYS.forEach(key => {
      const mesh = this.projectArtifacts[key];
      const isHovered = this.hoveredProjectId === key;
      const isActive = this.activeProjectId === key;
      
      mesh.userData.uniforms.uTime.value = this.time;
      mesh.userData.uniforms.uHover.value = THREE.MathUtils.lerp(mesh.userData.uniforms.uHover.value, isHovered ? 1.0 : 0.0, 0.1);
      mesh.userData.uniforms.uActive.value = THREE.MathUtils.lerp(mesh.userData.uniforms.uActive.value, isActive ? 1.0 : 0.0, 0.1);
      mesh.userData.uniforms.uXray.value = this.xrayMode;

      // Spin polyhedra
      mesh.rotation.x += delta * mesh.userData.rotationSpeed[0] * (isHovered ? 2.5 : 1.0);
      mesh.rotation.y += delta * mesh.userData.rotationSpeed[1] * (isHovered ? 2.5 : 1.0);
      mesh.rotation.z += delta * mesh.userData.rotationSpeed[2] * (isHovered ? 2.5 : 1.0);

      // Float gently
      mesh.position.y += Math.sin(this.time * 1.5 + mesh.position.x) * 0.004;
    });

    // 4. Update Particles
    this.particleUniforms.uTime.value = this.time;
    this.particleUniforms.uPointer.value.copy(this.pointer);
    this.particleUniforms.uScrollVelocity.value = this.scrollVelocity;
    this.particleUniforms.uXray.value = this.xrayMode;

    this.particlesGroup.rotation.y = this.time * 0.03;

    // 5. Lerp Camera for smooth spatial transitions
    this.camera.position.lerp(this.cameraPositionTarget, 0.06);
    this.cameraLookAtTarget.lerp(new THREE.Vector3(this.pointer.x * 1.2, this.pointer.y * 1.2, 0), 0.05);
    this.camera.lookAt(this.cameraLookAtTarget);

    // 6. Render Scene
    this.renderer.render(this.scene, this.camera);
  }
}

function sin(x) { return Math.sin(x); }
