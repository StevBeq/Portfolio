'use client';

import React, { useRef, useEffect, useCallback } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  opacity: number;
}

interface ParticleFieldProps {
  className?: string;
  particleCount?: number;
  connectionDistance?: number;
  mouseInfluenceRadius?: number;
  color?: string;
}

export const ParticleField: React.FC<ParticleFieldProps> = ({
  className = '',
  particleCount = 45,
  connectionDistance = 110,
  mouseInfluenceRadius = 140,
  color = 'FFB800',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>(0);
  const isVisibleRef = useRef<boolean>(true);
  const particlesRef = useRef<Particle[]>([]);
  const mouseRef = useRef<{ x: number; y: number; active: boolean }>({
    x: -1000,
    y: -1000,
    active: false,
  });
  const dimensionsRef = useRef<{ w: number; h: number }>({ w: 0, h: 0 });

  const parseColor = useCallback((hex: string) => {
    const r = parseInt(hex.substring(0, 2), 16) || 255;
    const g = parseInt(hex.substring(2, 4), 16) || 184;
    const b = parseInt(hex.substring(4, 6), 16) || 0;
    return { r, g, b };
  }, []);

  const initParticles = useCallback(
    (width: number, height: number) => {
      const count = Math.min(particleCount, 50);
      const particles: Particle[] = [];
      for (let i = 0; i < count; i++) {
        const x = Math.random() * width;
        const y = Math.random() * height;
        particles.push({
          x,
          y,
          vx: (Math.random() - 0.5) * 0.35,
          vy: (Math.random() - 0.5) * 0.35,
          size: Math.random() * 1.5 + 1.0,
          opacity: Math.random() * 0.4 + 0.2,
        });
      }
      particlesRef.current = particles;
    },
    [particleCount]
  );

  const animate = useCallback(() => {
    if (!isVisibleRef.current) {
      animationRef.current = requestAnimationFrame(animate);
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const { w, h } = dimensionsRef.current;
    if (w === 0 || h === 0) return;

    const mouse = mouseRef.current;
    const particles = particlesRef.current;
    const { r, g, b } = parseColor(color);

    ctx.clearRect(0, 0, w, h);

    const mouseInfluenceRadiusSq = mouseInfluenceRadius * mouseInfluenceRadius;
    const connectionDistSq = connectionDistance * connectionDistance;

    // 1. Update and draw particles (single pass, fast fill)
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];

      p.x += p.vx;
      p.y += p.vy;

      if (p.x < -10) p.x = w + 10;
      if (p.x > w + 10) p.x = -10;
      if (p.y < -10) p.y = h + 10;
      if (p.y > h + 10) p.y = -10;

      // Mouse influence
      if (mouse.active) {
        const dx = p.x - mouse.x;
        const dy = p.y - mouse.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < mouseInfluenceRadiusSq) {
          const dist = Math.sqrt(distSq);
          const force = (mouseInfluenceRadius - dist) / mouseInfluenceRadius;
          const angle = Math.atan2(dy, dx);
          p.x += Math.cos(angle) * force * 2;
          p.y += Math.sin(angle) * force * 2;
        }
      }

      // Fast, lightweight particle rendering (no per-frame gradient allocation!)
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${r}, ${g}, ${b}, ${p.opacity})`;
      ctx.fill();
    }

    // 2. Fast particle connections with squared-distance pre-check
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
      const pi = particles[i];
      for (let j = i + 1; j < particles.length; j++) {
        const pj = particles[j];
        const dx = pi.x - pj.x;
        const dy = pi.y - pj.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < connectionDistSq) {
          const dist = Math.sqrt(distSq);
          const opacity = (1 - dist / connectionDistance) * 0.2;
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(pi.x, pi.y);
          ctx.lineTo(pj.x, pj.y);
          ctx.stroke();
        }
      }
    }

    // 3. Mouse connecting lines
    if (mouse.active) {
      for (let i = 0; i < particles.length; i++) {
        const pi = particles[i];
        const dx = pi.x - mouse.x;
        const dy = pi.y - mouse.y;
        const distSq = dx * dx + dy * dy;

        if (distSq < mouseInfluenceRadiusSq) {
          const dist = Math.sqrt(distSq);
          const opacity = (1 - dist / mouseInfluenceRadius) * 0.35;
          ctx.strokeStyle = `rgba(${r}, ${g}, ${b}, ${opacity})`;
          ctx.beginPath();
          ctx.moveTo(pi.x, pi.y);
          ctx.lineTo(mouse.x, mouse.y);
          ctx.stroke();
        }
      }
    }

    animationRef.current = requestAnimationFrame(animate);
  }, [color, connectionDistance, mouseInfluenceRadius, parseColor]);

  const handleResize = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const parent = canvas.parentElement;
    const w = parent ? parent.offsetWidth : window.innerWidth;
    const h = parent ? parent.offsetHeight : window.innerHeight;

    dimensionsRef.current = { w, h };
    canvas.width = w;
    canvas.height = h;

    if (particlesRef.current.length === 0) {
      initParticles(w, h);
    }
  }, [initParticles]);

  const handleMouseMove = useCallback((e: MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    mouseRef.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      active: true,
    };
  }, []);

  const handleMouseLeave = useCallback(() => {
    mouseRef.current = {
      x: -1000,
      y: -1000,
      active: false,
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    handleResize();
    window.addEventListener('resize', handleResize);

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    // IntersectionObserver to pause rendering when hero is out of view
    const observer = new IntersectionObserver(
      ([entry]) => {
        isVisibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.05 }
    );

    observer.observe(canvas);

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
      observer.disconnect();
      cancelAnimationFrame(animationRef.current);
    };
  }, [animate, handleMouseMove, handleMouseLeave, handleResize]);

  return (
    <canvas
      ref={canvasRef}
      className={`absolute inset-0 w-full h-full pointer-events-none ${className}`}
      style={{ willChange: 'transform' }}
    />
  );
};
