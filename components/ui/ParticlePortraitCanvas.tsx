'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Sparkles, Move, Zap } from 'lucide-react';

interface ParticlePortraitCanvasProps {
  imageSrc: string;
  className?: string;
}

interface OverlayParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  alpha: number;
  baseAlpha: number;
  color: string;
  angle: number;
  speed: number;
}

interface TrailParticle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  life: number;
  maxLife: number;
  color: string;
}

export const ParticlePortraitCanvas: React.FC<ParticlePortraitCanvasProps> = ({
  imageSrc,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 50, y: 50 });
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let overlayParticles: OverlayParticle[] = [];
    let trailParticles: TrailParticle[] = [];

    const mouse = {
      x: -9999,
      y: -9999,
      prevX: -9999,
      prevY: -9999,
      radius: 130,
      active: false,
    };

    const isDarkMode = () => document.documentElement.classList.contains('dark');

    const initOverlayParticles = (width: number, height: number) => {
      const count = width < 450 ? 50 : 75;
      overlayParticles = [];

      const darkMode = isDarkMode();

      for (let i = 0; i < count; i++) {
        const isAccent = Math.random() < 0.35;
        let color: string;

        if (darkMode) {
          color = isAccent ? '255, 184, 0' : '245, 158, 11'; // Warm Gold / Amber Glow
        } else {
          color = isAccent ? '217, 119, 6' : '71, 85, 105'; // Slate / Dark Amber
        }

        overlayParticles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.6,
          vy: (Math.random() - 0.5) * 0.6,
          size: Math.random() * 2.2 + 1.2,
          alpha: Math.random() * 0.6 + 0.25,
          baseAlpha: Math.random() * 0.5 + 0.3,
          color: color,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.4 + 0.2,
        });
      }
    };

    const handleResize = () => {
      const rect = container.getBoundingClientRect();
      const width = rect.width;
      const height = rect.height;

      if (width === 0 || height === 0) return;

      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      initOverlayParticles(width, height);
    };

    handleResize();
    setIsLoaded(true);

    const spawnTrailParticle = (x: number, y: number) => {
      const darkMode = isDarkMode();
      const count = 2;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.5;
        const maxLife = Math.random() * 30 + 20;

        trailParticles.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          size: Math.random() * 2.5 + 1.0,
          life: maxLife,
          maxLife,
          color: darkMode ? '255, 184, 0' : '217, 119, 6',
        });
      }

      // Limit trail buffer size
      if (trailParticles.length > 60) {
        trailParticles.splice(0, trailParticles.length - 60);
      }
    };

    const render = () => {
      const width = canvas.width / (window.devicePixelRatio || 1);
      const height = canvas.height / (window.devicePixelRatio || 1);

      ctx.clearRect(0, 0, width, height);

      const darkMode = isDarkMode();

      // 1. Draw connecting constellation lines near mouse
      if (mouse.active) {
        for (let i = 0; i < overlayParticles.length; i++) {
          const p1 = overlayParticles[i];
          const dxMouse = p1.x - mouse.x;
          const dyMouse = p1.y - mouse.y;
          const distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);

          if (distMouse < mouse.radius * 0.95) {
            // Draw line to cursor
            const alphaLine = (1 - distMouse / (mouse.radius * 0.95)) * 0.4;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.strokeStyle = darkMode
              ? `rgba(255, 184, 0, ${alphaLine})`
              : `rgba(217, 119, 6, ${alphaLine})`;
            ctx.lineWidth = 0.8;
            ctx.stroke();

            // Connect nearby particles to each other
            for (let j = i + 1; j < overlayParticles.length; j++) {
              const p2 = overlayParticles[j];
              const dx = p1.x - p2.x;
              const dy = p1.y - p2.y;
              const dist = Math.sqrt(dx * dx + dy * dy);

              if (dist < 65) {
                const connAlpha = (1 - dist / 65) * 0.25;
                ctx.beginPath();
                ctx.moveTo(p1.x, p1.y);
                ctx.lineTo(p2.x, p2.y);
                ctx.strokeStyle = darkMode
                  ? `rgba(255, 215, 0, ${connAlpha})`
                  : `rgba(180, 83, 9, ${connAlpha})`;
                ctx.lineWidth = 0.6;
                ctx.stroke();
              }
            }
          }
        }
      }

      // 2. Render & Update Floating Ambient Overlay Particles
      for (let i = 0; i < overlayParticles.length; i++) {
        const p = overlayParticles[i];

        // Organic wave motion
        p.angle += 0.02;
        p.x += p.vx + Math.cos(p.angle) * 0.3;
        p.y += p.vy + Math.sin(p.angle) * 0.3;

        // Screen boundary wrap-around
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;
        if (p.y < -10) p.y = height + 10;
        if (p.y > height + 10) p.y = -10;

        // Mouse Repel Physics
        if (mouse.active) {
          const dx = p.x - mouse.x;
          const dy = p.y - mouse.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (mouse.radius - dist) / mouse.radius;
            const push = force * 4.5;
            const angle = Math.atan2(dy, dx);

            p.x += Math.cos(angle) * push;
            p.y += Math.sin(angle) * push;

            // Brighten particle near mouse
            p.alpha = Math.min(1, p.baseAlpha + force * 0.5);
          } else {
            p.alpha += (p.baseAlpha - p.alpha) * 0.05;
          }
        } else {
          p.alpha += (p.baseAlpha - p.alpha) * 0.05;
        }

        // Draw glowing particle
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${p.color}, ${p.alpha})`;

        // Glow blur effect for larger particles
        if (p.size > 2.0 && darkMode) {
          ctx.shadowBlur = 8;
          ctx.shadowColor = `rgba(255, 184, 0, 0.6)`;
        } else {
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0; // Reset
      }

      // 3. Render Cursor Trail Particles (Sparkles)
      for (let i = trailParticles.length - 1; i >= 0; i--) {
        const tp = trailParticles[i];
        tp.x += tp.vx;
        tp.y += tp.vy;
        tp.vx *= 0.92;
        tp.vy *= 0.92;
        tp.life -= 1;

        if (tp.life <= 0) {
          trailParticles.splice(i, 1);
          continue;
        }

        const alpha = tp.life / tp.maxLife;
        ctx.beginPath();
        ctx.arc(tp.x, tp.y, tp.size * alpha, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${tp.color}, ${alpha * 0.8})`;
        ctx.fill();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    const handleMouseMove = (e: MouseEvent) => {
      const rect = container.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      mouse.prevX = mouse.x;
      mouse.prevY = mouse.y;
      mouse.x = x;
      mouse.y = y;
      mouse.active = true;

      // Mouse percent for Spotlight & Tilt
      const percentX = (x / rect.width) * 100;
      const percentY = (y / rect.height) * 100;
      setMousePos({ x: percentX, y: percentY });

      // 3D Tilt calculation (subtle & natural: max 8 deg)
      const rx = (0.5 - y / rect.height) * 14;
      const ry = (x / rect.width - 0.5) * 14;
      setTilt({ rx, ry });

      // Spawn trail if mouse moved fast enough
      const movedDist = Math.hypot(x - mouse.prevX, y - mouse.prevY);
      if (movedDist > 4) {
        spawnTrailParticle(x, y);
      }
    };

    const handleMouseEnter = () => {
      mouse.active = true;
      setIsHovered(true);
    };

    const handleMouseLeave = () => {
      mouse.active = false;
      mouse.x = -9999;
      mouse.y = -9999;
      setIsHovered(false);
      setTilt({ rx: 0, ry: 0 });
      setMousePos({ x: 50, y: 50 });
    };

    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseenter', handleMouseEnter);
    container.addEventListener('mouseleave', handleMouseLeave);
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animationFrameId);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseenter', handleMouseEnter);
      container.removeEventListener('mouseleave', handleMouseLeave);
      window.removeEventListener('resize', handleResize);
    };
  }, [imageSrc]);

  return (
    <div
      ref={containerRef}
      className={`relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#121216] border border-slate-200/90 dark:border-[#26262C] shadow-md group transition-all duration-300 select-none cursor-pointer ${className}`}
      style={{
        perspective: '1000px',
      }}
    >
      {/* 3D Inner Wrapper */}
      <div
        className="w-full h-full relative transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(${isHovered ? 1.02 : 1}, ${isHovered ? 1.02 : 1}, 1)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Dynamic Cursor Spotlight Radial Lighting */}
        <div
          className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
          style={{
            opacity: isHovered ? 1 : 0.4,
            background: `radial-gradient(450px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255, 184, 0, 0.18), transparent 80%)`,
          }}
        />

        {/* Ambient Corner Lighting Accents */}
        <div className="absolute inset-0 bg-gradient-to-tr from-[#D97706]/15 via-transparent to-amber-500/10 opacity-40 group-hover:opacity-80 transition-opacity duration-500 pointer-events-none z-10" />

        {/* Clear HD Executive Portrait Image */}
        <img
          src={imageSrc}
          alt="Executive Portrait"
          className="absolute inset-0 w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.03] transition-all duration-500 group-hover:contrast-[1.06]"
          onLoad={() => setIsLoaded(true)}
        />

        {/* Interactive Canvas Overlay (Particle Field & Constellation Lines) */}
        <canvas
          ref={canvasRef}
          className="absolute inset-0 w-full h-full block z-30 pointer-events-none"
        />

        {/* Interactive Badge Indicator */}
        <div className="absolute bottom-3 left-3 z-40 px-3 py-1.5 rounded-full bg-slate-900/80 dark:bg-[#18181C]/90 backdrop-blur-md border border-slate-700/60 dark:border-[#2A2A30] text-amber-400 font-mono text-[10px] font-semibold flex items-center gap-1.5 shadow-lg opacity-85 group-hover:opacity-100 transition-all duration-200">
          <Sparkles className="w-3 h-3 text-[#FFB800] animate-pulse" />
          <span>INTERACTIVE AURA</span>
        </div>

        {/* Motion Sensor Hint Icon */}
        <div className="absolute top-3 right-3 z-40 p-2 rounded-full bg-slate-900/80 dark:bg-[#18181C]/90 backdrop-blur-md border border-slate-700/60 dark:border-[#2A2A30] text-slate-300 dark:text-[#8E8E93] group-hover:text-amber-400 transition-colors duration-200 shadow-md">
          <Move className="w-3.5 h-3.5" />
        </div>
      </div>
    </div>
  );
};
