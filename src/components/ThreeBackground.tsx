import React, { useEffect, useRef } from 'react';
import * as THREE from 'three';

interface ThreeBackgroundProps {
  particleColor?: string;
  gridSpeed?: number;
  interactive?: boolean;
}

export const ThreeBackground: React.FC<ThreeBackgroundProps> = ({
  gridSpeed = 0.005,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Scene, Camera, Renderer
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x020617, 0.015); // Matches slate-950

    const camera = new THREE.PerspectiveCamera(
      60,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    camera.position.set(0, 15, 35);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      powerPreference: 'high-performance',
    });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 1. Particle Grid (Wave Matrix)
    const GRID_SIZE_X = 60;
    const GRID_SIZE_Z = 60;
    const NUM_PARTICLES = GRID_SIZE_X * GRID_SIZE_Z;

    const positions = new Float32Array(NUM_PARTICLES * 3);
    const colors = new Float32Array(NUM_PARTICLES * 3);

    const cyanColor = new THREE.Color(0x06b6d4); // Cyan-500
    const blueColor = new THREE.Color(0x3b82f6); // Blue-500
    const purpleColor = new THREE.Color(0xa855f7); // Purple-500

    let index = 0;
    for (let x = 0; x < GRID_SIZE_X; x++) {
      for (let z = 0; z < GRID_SIZE_Z; z++) {
        const posX = (x - GRID_SIZE_X / 2) * 1.5;
        const posZ = (z - GRID_SIZE_Z / 2) * 1.5;

        positions[index * 3] = posX;
        positions[index * 3 + 1] = 0; // Height will be animated
        positions[index * 3 + 2] = posZ;

        // Color gradient across grid
        const ratio = (x + z) / (GRID_SIZE_X + GRID_SIZE_Z);
        let pointColor = cyanColor.clone();
        if (ratio > 0.6) {
          pointColor.lerp(purpleColor, (ratio - 0.6) * 2.5);
        } else {
          pointColor.lerp(blueColor, ratio * 1.5);
        }

        colors[index * 3] = pointColor.r;
        colors[index * 3 + 1] = pointColor.g;
        colors[index * 3 + 2] = pointColor.b;

        index++;
      }
    }

    const particlesGeometry = new THREE.BufferGeometry();
    particlesGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(positions, 3)
    );
    particlesGeometry.setAttribute(
      'color',
      new THREE.BufferAttribute(colors, 3)
    );

    // Texture dot
    const canvas = document.createElement('canvas');
    canvas.width = 32;
    canvas.height = 32;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      const gradient = ctx.createRadialGradient(16, 16, 0, 16, 16, 16);
      gradient.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradient.addColorStop(0.3, 'rgba(6, 182, 212, 0.8)');
      gradient.addColorStop(1, 'rgba(6, 182, 212, 0)');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, 32, 32);
    }
    const particleTexture = new THREE.CanvasTexture(canvas);

    const particlesMaterial = new THREE.PointsMaterial({
      size: 0.8,
      vertexColors: true,
      map: particleTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const particleGrid = new THREE.Points(
      particlesGeometry,
      particlesMaterial
    );
    particleGrid.position.y = -5;
    scene.add(particleGrid);

    // 2. Wireframe Grid Plane
    const gridHelper = new THREE.GridHelper(100, 40, 0x06b6d4, 0x1e293b);
    gridHelper.position.y = -5.2;
    if (Array.isArray(gridHelper.material)) {
      gridHelper.material.forEach((mat) => {
        mat.transparent = true;
        mat.opacity = 0.25;
      });
    } else {
      gridHelper.material.transparent = true;
      gridHelper.material.opacity = 0.25;
    }
    scene.add(gridHelper);

    // 3. Ambient Floating Star Particles in upper space
    const STARS_COUNT = 300;
    const starPositions = new Float32Array(STARS_COUNT * 3);
    for (let i = 0; i < STARS_COUNT * 3; i += 3) {
      starPositions[i] = (Math.random() - 0.5) * 120;
      starPositions[i + 1] = Math.random() * 40;
      starPositions[i + 2] = (Math.random() - 0.5) * 120;
    }
    const starGeometry = new THREE.BufferGeometry();
    starGeometry.setAttribute(
      'position',
      new THREE.BufferAttribute(starPositions, 3)
    );
    const starMaterial = new THREE.PointsMaterial({
      size: 0.4,
      color: 0x38bdf8,
      transparent: true,
      opacity: 0.6,
      blending: THREE.AdditiveBlending,
    });
    const starParticles = new THREE.Points(starGeometry, starMaterial);
    scene.add(starParticles);

    // Mouse Interaction Parallax
    let mouseX = 0;
    let mouseY = 0;
    const handleMouseMove = (e: MouseEvent) => {
      mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
      mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
    };
    window.addEventListener('mousemove', handleMouseMove);

    // Resize Handler
    const handleResize = () => {
      camera.aspect = window.innerWidth / window.innerHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(window.innerWidth, window.innerHeight);
    };
    window.addEventListener('resize', handleResize);

    // Animation Loop
    let animationFrameId: number;
    let step = 0;

    const animate = () => {
      animationFrameId = requestAnimationFrame(animate);
      step += gridSpeed;

      // Animate particle grid heights (wave effect)
      const posAttr = particlesGeometry.attributes.position as THREE.BufferAttribute;
      const array = posAttr.array as Float32Array;

      let pIdx = 0;
      for (let x = 0; x < GRID_SIZE_X; x++) {
        for (let z = 0; z < GRID_SIZE_Z; z++) {
          const wave1 = Math.sin(x * 0.2 + step * 2) * 1.2;
          const wave2 = Math.cos(z * 0.2 + step * 1.5) * 1.2;
          array[pIdx * 3 + 1] = wave1 + wave2;
          pIdx++;
        }
      }
      posAttr.needsUpdate = true;

      // Rotate star particles slowly
      starParticles.rotation.y += 0.0003;

      // Gentle camera mouse parallax
      camera.position.x += (mouseX * 4 - camera.position.x) * 0.02;
      camera.position.y += (15 - mouseY * 3 - camera.position.y) * 0.02;
      camera.lookAt(0, -2, 0);

      renderer.render(scene, camera);
    };

    animate();

    // Cleanup
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);

      particlesGeometry.dispose();
      particlesMaterial.dispose();
      starGeometry.dispose();
      starMaterial.dispose();
      particleTexture.dispose();
      renderer.dispose();

      if (container && renderer.domElement && container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [gridSpeed]);

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none z-0 overflow-hidden bg-slate-950"
      aria-hidden="true"
    />
  );
};
