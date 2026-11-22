"use client";

import React, { useEffect, useRef } from "react";
import { gsap, isLowEndDevice, prefersReducedMotion } from "@/lib/gsap";

interface DriftParticle {
  x: number;
  y: number;
  originX: number;
  originY: number;
  vx: number;
  vy: number;
  size: number;
  phase: number;
  normX: number;
}

interface DotMatrixNameCanvasProps {
  text?: string;
  className?: string;
}

/**
 * Calm Minimalist Dot-Matrix Drift Canvas for "STEVBEQ" (PreLayer2 Part A).
 * Uses strictly One Blue family (#FFFFFF / #C7D8FC / #9DB8FB) — zero Sky Cyan, zero frantic vortex swirl.
 */
export function DotMatrixNameCanvas({
  text = "STEVBEQ",
  className = "",
}: DotMatrixNameCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const particlesRef = useRef<DriftParticle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const visibleRef = useRef(true);
  const dimsRef = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.04 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lowEnd = isLowEndDevice();
    const reducedMotion = prefersReducedMotion();
    let isCancelled = false;

    const drawStatic = () => {
      const { width, height } = dimsRef.current;
      if (width === 0 || height === 0) return;
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = "rgba(244, 245, 248, 0.92)";
      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        ctx.beginPath();
        ctx.arc(p.originX, p.originY, p.size, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    const buildParticles = () => {
      if (isCancelled) return;
      const width = Math.max(300, container.clientWidth || 640);
      const height = Math.max(180, container.clientHeight || 280);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      dimsRef.current = { width, height };
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const offscreen = document.createElement("canvas");
      offscreen.width = width;
      offscreen.height = height;
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      let fontSize = Math.floor(height * 0.44);
      offCtx.font = `900 ${fontSize}px "Unbounded", ui-sans-serif, system-ui, sans-serif`;
      const measured = offCtx.measureText(text).width;
      if (measured > width * 0.84) {
        fontSize = Math.floor(fontSize * ((width * 0.84) / measured));
        offCtx.font = `900 ${fontSize}px "Unbounded", ui-sans-serif, system-ui, sans-serif`;
      }

      offCtx.fillStyle = "#ffffff";
      offCtx.textAlign = "center";
      offCtx.textBaseline = "middle";
      offCtx.fillText(text, width / 2, height / 2 + fontSize * 0.03);

      const pixels = offCtx.getImageData(0, 0, width, height).data;
      const baseStep = width < 640 ? 7 : 9;
      const step = lowEnd ? baseStep + 3 : baseStep;
      const list: DriftParticle[] = [];

      for (let y = Math.floor(step / 2); y < height; y += step) {
        for (let x = Math.floor(step / 2); x < width; x += step) {
          if (pixels[(y * width + x) * 4 + 3] > 115) {
            list.push({
              x,
              y,
              originX: x,
              originY: y,
              vx: 0,
              vy: 0,
              size: width < 640 ? 1.85 : 2.25,
              phase: x * 0.011 + y * 0.009,
              normX: x / Math.max(1, width),
            });
          }
        }
      }

      particlesRef.current = list;
      if (reducedMotion) {
        drawStatic();
      }
    };

    const renderTick = (timeSec: number) => {
      if (isCancelled || !visibleRef.current) return;

      const { width, height } = dimsRef.current;
      if (width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      const particles = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const active = mouseRef.current.active;

      // Calm liquid drift pace (slow tide + gentle pointer parting, never chaotic vortex)
      const radius = 64;
      const radSq = radius * radius;
      const waveCenter = ((timeSec * 0.24) % 1.8) - 0.4;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        if (active) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const distSq = dx * dx + dy * dy;
          if (distSq < radSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = (radius - dist) / radius;
            // Soft radial liquid parting (calm, fluid, no high-velocity spin)
            p.vx += (dx / dist) * force * 2.1;
            p.vy += (dy / dist) * force * 2.1;
          }
        }

        // Gentle breathing wave drift
        const driftX = Math.sin(timeSec * 0.9 + p.phase) * 1.15;
        const driftY = Math.cos(timeSec * 1.05 + p.phase) * 1.35;

        p.vx += (p.originX + driftX - p.x) * 0.085;
        p.vy += (p.originY + driftY - p.y) * 0.085;
        p.vx *= 0.84;
        p.vy *= 0.84;
        p.x += p.vx;
        p.y += p.vy;

        const speed = Math.abs(p.vx) + Math.abs(p.vy);
        const distWave = Math.abs(p.normX - waveCenter);
        const waveBoost = Math.max(0, 1 - distWave * 4.2);

        // Strictly Royal Bridge Blue tints + Pure White (#FFFFFF / #C7D8FC / #9DB8FB)
        let fillColor = "rgba(244, 245, 248, 0.88)";
        let nodeSize = p.size + waveBoost * 0.7;

        if (speed > 2.2) {
          fillColor = "#FFFFFF";
          nodeSize = p.size + 0.95;
        } else if (waveBoost > 0.35) {
          fillColor = "#C7D8FC";
        } else if (speed > 0.8) {
          fillColor = "#9DB8FB";
          nodeSize = p.size + 0.45;
        }

        ctx.fillStyle = fillColor;
        ctx.beginPath();
        ctx.arc(p.x, p.y, nodeSize, 0, Math.PI * 2);
        ctx.fill();
      }
    };

    buildParticles();
    if (!reducedMotion) {
      gsap.ticker.add(renderTick);
    }

    const resizeObserver = new ResizeObserver(() => {
      buildParticles();
    });
    resizeObserver.observe(container);

    return () => {
      isCancelled = true;
      if (!reducedMotion) {
        gsap.ticker.remove(renderTick);
      }
      resizeObserver.disconnect();
    };
  }, [text]);

  const handlePointerMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    mouseRef.current.x = e.clientX - rect.left;
    mouseRef.current.y = e.clientY - rect.top;
    mouseRef.current.active = true;
  };

  const handlePointerLeave = () => {
    mouseRef.current.active = false;
  };

  return (
    <div
      ref={containerRef}
      onPointerMove={handlePointerMove}
      onPointerLeave={handlePointerLeave}
      className={`relative w-full select-none ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
