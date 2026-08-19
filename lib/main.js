/**
 * /lib/main.js — Main Execution Entry Point
 * Orchestrates GSAP ScrollTrigger, UI injection, and ObservatoryScene.
 * Includes failure-tolerant WebGL fallback and prefers-reduced-motion detection.
 */

import * as THREE from 'three';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';
import { ObservatoryScene } from './scene.js';
import { PROJECTS_DATA, PROJECT_KEYS } from '../data/projects.js';

gsap.registerPlugin(ScrollTrigger);

class PortfolioApp {
  constructor() {
    this.reducedMotion = window.matchMatchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)').matches : false;
    this.initHUD();
    this.buildProjectUI();
    this.initSceneSafe();
    this.initGSAPChoreography();
    this.initXRaySystem();
    this.initInteraction();
  }

  initHUD() {
    this.hud = {
      fps: document.getElementById('hud-fps'),
      draws: document.getElementById('hud-draws'),
      tris: document.getElementById('hud-tris'),
      geom: document.getElementById('hud-geom')
    };
    this.frames = 0;
    this.lastTime = performance.now();
    
    setInterval(() => {
      const now = performance.now();
      const fps = Math.round((this.frames * 1000) / (now - this.lastTime));
      this.frames = 0;
      this.lastTime = now;
      if (this.hud.fps && this.scene && this.scene.xrayMode > 0.5) {
        this.hud.fps.innerText = \`FPS:\${fps.toString().padStart(3, ' ')}\`;
        this.hud.draws.innerText = \`CALLS:\${this.scene.renderer.info.render.calls.toString().padStart(4, ' ')}\`;
        this.hud.tris.innerText = \`TRIS:\${this.scene.renderer.info.render.triangles.toString().padStart(6, ' ')}\`;
        this.hud.geom.innerText = \`GEOM:\${this.scene.renderer.info.memory.geometries.toString().padStart(3, ' ')}\`;
      }
    }, 1000);
  }

  initSceneSafe() {
    const canvas = document.getElementById('webgl-canvas');
    try {
      if (!canvas || !window.WebGLRenderingContext) {
        throw new Error('WebGL unavailable');
      }
      this.scene = new ObservatoryScene(canvas);
      if (this.reducedMotion) {
        this.scene.reducedMotion = true;
      }
      const originalAnimate = this.scene.animate.bind(this.scene);
      this.scene.animate = () => {
        if (!this.scene.paused) {
          this.frames++;
          originalAnimate();
        }
      };
    } catch (err) {
      console.warn('WebGL Initialization Failed or Disabled. Activating 2D Procedural Fallback:', err);
      this.handleWebGLFallback(canvas);
    }
  }

  handleWebGLFallback(canvas) {
    if (canvas) canvas.style.display = 'none';
    document.body.classList.add('webgl-fallback');
    const fallbackField = document.createElement('div');
    fallbackField.id = 'procedural-2d-fallback';
    fallbackField.style.cssText = 'position:fixed;top:0;left:0;width:100vw;height:100vh;z-index:-1;background:radial-gradient(circle at 50% 50%, #001f3f 0%, #0a0a0c 80%);pointer-events:none;';
    document.body.appendChild(fallbackField);
  }

  buildProjectUI() {
    const listContainer = document.getElementById('project-list-container');
    if (!listContainer) return;
    
    listContainer.innerHTML = PROJECT_KEYS.map((key, i) => {
      const p = PROJECTS_DATA[key];
      return \`
        <div class="project-row" data-id="\${key}" data-index="\${i}" tabindex="0" role="button" aria-label="Project: \${p.title}">
          <div class="p-index">0\${i+1}</div>
          <div class="p-title">\${p.title}</div>
          <div class="p-category" style="color: \${p.color}">\${p.categoryLabel}</div>
        </div>
      \`;
    }).join('');

    const rows = document.querySelectorAll('.project-row');
    const detailPanel = document.getElementById('project-detail-panel');

    window.onArtifactHover = (id) => {
      rows.forEach(r => {
        if (r.dataset.id === id) r.classList.add('hovered');
        else r.classList.remove('hovered');
      });
    };

    rows.forEach(row => {
      row.addEventListener('mouseenter', () => {
        if (this.scene) this.scene.hoveredProjectId = row.dataset.id;
      });
      row.addEventListener('mouseleave', () => {
        if (this.scene && this.scene.hoveredProjectId === row.dataset.id) {
          this.scene.hoveredProjectId = null;
        }
      });
      const openAction = () => this.openProjectDetail(row.dataset.id, detailPanel);
      row.addEventListener('click', openAction);
      row.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          openAction();
        }
      });
    });

    window.openProjectExplorer = (id) => this.openProjectDetail(id, detailPanel);
  }

  openProjectDetail(id, panel) {
    if (this.scene) this.scene.setActiveProject(id);
    const p = PROJECTS_DATA[id];
    if (!p) return;
    
    panel.innerHTML = \`
      <div class="detail-header">
        <div class="detail-status" style="border-color:\${p.statusColor}; color:\${p.statusColor}">
          <span class="s-dot" style="background:\${p.statusColor}"></span> \${p.status}
        </div>
        <button class="close-btn" id="close-detail-btn" aria-label="Close project details">[ CLOSE ]</button>
      </div>
      <h3 class="detail-title" style="view-transition-name: p-\${id}">\${p.title}</h3>
      <div class="detail-meta">
        <span style="color:\${p.color}">\${p.categoryLabel}</span> — \${p.year}
      </div>
      <p class="detail-role">ROLE: \${p.role}</p>
      <p class="detail-desc">\${p.desc}</p>
      
      <div class="detail-tags">
        \${p.tags.map(t => \`<span class="tag">\${t}</span>\`).join('')}
      </div>

      <div class="detail-evidence">
        <h4>ARTIFACTS [AVAILABLE ON REQUEST]</h4>
        <ul>\${p.artifacts.map(a => \`<li>\${a}</li>\`).join('')}</ul>
      </div>
      
      <div class="detail-actions">
        <a href="/projects/\${id}" class="action-btn">VIEW FULL CASE STUDY →</a>
        <a href="mailto:brilliantgibran16@gmail.com?subject=Artifact Request: \${p.title}" class="action-btn outline">REQUEST ARTIFACTS</a>
      </div>
    \`;
    
    panel.classList.add('open');
    const closeBtn = document.getElementById('close-detail-btn');
    closeBtn.focus();
    
    const closeAction = () => {
      panel.classList.remove('open');
      if (this.scene) this.scene.setActiveProject(null);
    };

    closeBtn.addEventListener('click', closeAction);
    window.addEventListener('keydown', function escHandler(e) {
      if (e.key === 'Escape') {
        closeAction();
        window.removeEventListener('keydown', escHandler);
      }
    });

    if (this.scene && this.scene.projectArtifacts[id]) {
      const mesh = this.scene.projectArtifacts[id];
      this.scene.cameraPositionTarget.set(mesh.position.x * 0.5, mesh.position.y * 0.5, mesh.position.z + 6);
    }
  }

  initGSAPChoreography() {
    ScrollTrigger.create({
      trigger: document.body,
      start: 'top top',
      end: 'bottom bottom',
      onUpdate: self => {
        const vel = self.getVelocity() / 1000; 
        if (this.scene) this.scene.setScrollProgress(self.progress, vel);
      }
    });

    if (!this.reducedMotion) {
      const tl = gsap.timeline();
      tl.fromTo('.hero-title .char', 
        { y: 60, opacity: 0, rotationX: -90 }, 
        { y: 0, opacity: 1, rotationX: 0, duration: 1.2, stagger: 0.04, ease: 'expo.out' }, 
        0.2
      );
      tl.fromTo('.hero-tagline', { opacity: 0, x: -20 }, { opacity: 1, x: 0, duration: 1.0, ease: 'power3.out' }, 0.8);
      tl.fromTo('.hero-metrics .metric', { opacity: 0, y: 10 }, { opacity: 1, y: 0, stagger: 0.1, duration: 0.8 }, 1.0);
    }

    gsap.utils.toArray('section').forEach((sec) => {
      ScrollTrigger.create({
        trigger: sec,
        start: 'top center',
        end: 'bottom center',
        onEnter: () => this.routeCamera(sec.id),
        onEnterBack: () => this.routeCamera(sec.id)
      });
      
      if (!this.reducedMotion) {
        gsap.fromTo(sec.querySelectorAll('.reveal'),
          { y: 40, opacity: 0 },
          { y: 0, opacity: 1, duration: 1.0, stagger: 0.1, ease: 'expo.out',
            scrollTrigger: { trigger: sec, start: 'top 80%' }
          }
        );
      }
    });
  }

  routeCamera(sectionId) {
    if (!this.scene) return;
    switch (sectionId) {
      case 'hero':
        this.scene.cameraPositionTarget.set(0, 0, 14);
        break;
      case 'about':
        this.scene.cameraPositionTarget.set(-2, 0, 10);
        break;
      case 'projects':
        this.scene.cameraPositionTarget.set(2, 0, 8);
        break;
      case 'experience':
      case 'skills':
        this.scene.cameraPositionTarget.set(0, -4, 12);
        break;
      case 'contact':
        this.scene.cameraPositionTarget.set(0, 0, 18);
        break;
    }
  }

  initXRaySystem() {
    let xrayActive = false;
    const toggleBtn = document.getElementById('xray-toggle');
    const hud = document.getElementById('diagnostic-hud');
    const doc = document.documentElement;

    const toggleXray = () => {
      xrayActive = !xrayActive;
      if (this.scene) this.scene.setXray(xrayActive);
      if (xrayActive) {
        doc.classList.add('xray-mode');
        if (hud) hud.classList.add('visible');
        if (toggleBtn) toggleBtn.innerText = '[X-RAY: ON]';
      } else {
        doc.classList.remove('xray-mode');
        if (hud) hud.classList.remove('visible');
        if (toggleBtn) toggleBtn.innerText = '[X-RAY: OFF]';
      }
    };

    if (toggleBtn) toggleBtn.addEventListener('click', toggleXray);
    window.addEventListener('keydown', e => {
      if (e.key.toLowerCase() === 'x' && e.target.tagName !== 'INPUT' && e.target.tagName !== 'TEXTAREA') {
        toggleXray();
      }
    });

    if (new URLSearchParams(window.location.search).get('xray') === '1') {
      toggleXray();
    }
  }

  initInteraction() {
    const cursor = document.getElementById('custom-cursor');
    if (cursor && !this.reducedMotion) {
      window.addEventListener('mousemove', e => {
        gsap.to(cursor, { x: e.clientX, y: e.clientY, duration: 0.1, ease: 'power2.out' });
      });
      document.body.addEventListener('mousedown', () => cursor.classList.add('active'));
      document.body.addEventListener('mouseup', () => cursor.classList.remove('active'));
    }
  }
}

window.addEventListener('DOMContentLoaded', () => {
  new PortfolioApp();
});
