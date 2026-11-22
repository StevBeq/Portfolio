"use client";

import React, { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

interface BooleanFieldCanvasProps {
  /** Increment to emit a deliberate cellular wave burst from center (e.g. scene switch) */
  waveTrigger?: number;
  /** Mutable 0..1 ref interpolating Obsidian (#0B0D12) -> Navy Bridge (#0D1524) blue intensity with 0 React re-renders */
  blueShiftRef?: React.RefObject<number>;
  /** Light surface mode (Cool Cloud #F4F5F8) for subtle drafted blue grid */
  tone?: "dark" | "light";
  className?: string;
}

interface RippleWave {
  cx: number;
  cy: number;
  radius: number;
  maxRadius: number;
  speed: number;
  color: string;
  maxAlpha: number;
}

// Commandment 2 (One Blue): Strictly Royal Bridge Blue (#2F6BF2) + Soft Wash Tint (#9DB8FB)
const ROYAL_WAVE_COLORS = ["#2F6BF2", "#9DB8FB"] as const;

export function BooleanFieldCanvas({
  waveTrigger = 0,
  blueShiftRef,
  tone = "dark",
  className = "",
}: BooleanFieldCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const wavesRef = useRef<RippleWave[]>([]);
  const visibleRef = useRef(true);
  const lastClickRef = useRef(0);
  const dimsRef = useRef({ width: 0, height: 0 });
  const rectRef = useRef({ left: 0, top: 0, bottom: 0 });
  const colorCursorRef = useRef(0);

  // Trigger a center transition wave when waveTrigger increments
  useEffect(() => {
    if (waveTrigger === 0 || prefersReducedMotion()) return;
    const { width, height } = dimsRef.current;
    if (width === 0 || height === 0) return;
    const color = ROYAL_WAVE_COLORS[colorCursorRef.current % ROYAL_WAVE_COLORS.length];
    colorCursorRef.current += 1;

    wavesRef.current.push({
      cx: width * 0.5,
      cy: height * 0.5,
      radius: 18,
      maxRadius: Math.hypot(width, height) * 0.62,
      speed: 8.5,
      color,
      maxAlpha: 0.36,
    });
  }, [waveTrigger]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.02 }
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

    const reducedMotion = prefersReducedMotion();
    let isCancelled = false;
    let heartbeatTimer: ReturnType<typeof setInterval> | null = null;
    let dubTimeout: ReturnType<typeof setTimeout> | null = null;
    let cols = 0;
    let rows = 0;
    const cellSize = 38;

    const updateRectCache = () => {
      const r = container.getBoundingClientRect();
      rectRef.current = { left: r.left, top: r.top, bottom: r.bottom };
    };

    const drawStaticGrid = () => {
      const { width, height } = dimsRef.current;
      if (width === 0 || height === 0) return;
      ctx.clearRect(0, 0, width, height);
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `600 11px ui-monospace, SFMono-Regular, monospace`;
      ctx.fillStyle =
        tone === "light" ? "rgba(47,107,242,0.11)" : "rgba(199,216,252,0.065)";

      for (let r = 0; r < rows; r++) {
        const y = r * cellSize + cellSize * 0.5;
        for (let c = 0; c < cols; c++) {
          const x = c * cellSize + cellSize * 0.5;
          ctx.fillText((c + r) % 2 === 0 ? "+" : "·", x, y);
        }
      }
    };

    const resize = () => {
      if (isCancelled) return;
      const width = Math.max(320, container.clientWidth || window.innerWidth);
      const height = Math.max(320, container.clientHeight || window.innerHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      dimsRef.current = { width, height };
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      cols = Math.ceil(width / cellSize);
      rows = Math.ceil(height / cellSize);
      updateRectCache();

      if (reducedMotion) {
        drawStaticGrid();
      }
    };

    const spawnWave = (
      x: number,
      y: number,
      opts?: { speed?: number; maxRadius?: number; color?: string; maxAlpha?: number }
    ) => {
      const color =
        opts?.color ?? ROYAL_WAVE_COLORS[colorCursorRef.current % ROYAL_WAVE_COLORS.length];
      colorCursorRef.current += 1;

      wavesRef.current.push({
        cx: x,
        cy: y,
        radius: 10,
        maxRadius: opts?.maxRadius ?? 420,
        speed: opts?.speed ?? 7.4,
        color,
        maxAlpha: opts?.maxAlpha ?? 0.34,
      });

      if (wavesRef.current.length > 5) {
        wavesRef.current.shift();
      }
    };

    // Calm rhythmic 6s double heartbeat ("lub-dub") strictly in Royal Bridge Blue family
    const emitHeartbeat = () => {
      if (isCancelled || !visibleRef.current || reducedMotion) return;
      const { width, height } = dimsRef.current;
      if (width === 0 || height === 0) return;

      const shift = Math.max(0, Math.min(1, blueShiftRef?.current ?? 0.35));
      const cx = width * 0.5;
      const cy = height * 0.5;
      const fullSpan = Math.hypot(width, height) * (0.48 + shift * 0.14);

      // Lub (primary Royal Bridge Blue pulse — gentler in Hero, warmer in Stack & Portrait)
      spawnWave(cx, cy, {
        speed: 5.4 + shift * 1.1,
        maxRadius: fullSpan,
        color: "#2F6BF2",
        maxAlpha: 0.22 + shift * 0.14,
      });

      // Dub (softer Blue Wash #9DB8FB echo 440ms later)
      dubTimeout = setTimeout(() => {
        if (isCancelled || !visibleRef.current) return;
        spawnWave(cx, cy, {
          speed: 4.8 + shift * 0.8,
          maxRadius: fullSpan * 0.72,
          color: "#9DB8FB",
          maxAlpha: 0.14 + shift * 0.1,
        });
      }, 440);
    };

    const handleClick = (e: MouseEvent) => {
      if (reducedMotion || !visibleRef.current) return;
      const now = performance.now();
      if (now - lastClickRef.current < 220) return;
      lastClickRef.current = now;
      updateRectCache();
      const { left, top, bottom } = rectRef.current;
      if (e.clientY < top || e.clientY > bottom) return;
      spawnWave(e.clientX - left, e.clientY - top, {
        speed: 8.8,
        maxRadius: 340,
        color: "#2F6BF2",
        maxAlpha: 0.34,
      });
    };

    window.addEventListener("click", handleClick, { passive: true });

    const renderTick = (timeSec: number, deltaMs: number) => {
      if (isCancelled || !visibleRef.current) return;

      const { width, height } = dimsRef.current;
      if (width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      const dtFactor = Math.min(2, Math.max(0.5, deltaMs / 16.666));
      const shift = Math.max(0, Math.min(1, blueShiftRef?.current ?? 0.35));

      const waves = wavesRef.current;
      for (let w = waves.length - 1; w >= 0; w--) {
        waves[w].radius += waves[w].speed * dtFactor;
        if (waves[w].radius > waves[w].maxRadius) {
          waves.splice(w, 1);
        }
      }

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.font = `600 11px ui-monospace, SFMono-Regular, monospace`;

      const timePhase = timeSec * 0.75;
      const quietBaseAlpha = tone === "light" ? 0.08 : 0.045 + shift * 0.04;
      const shimmerAlpha = tone === "light" ? 0.2 : 0.1 + shift * 0.08;

      for (let r = 0; r < rows; r++) {
        const y = r * cellSize + cellSize * 0.5;
        for (let c = 0; c < cols; c++) {
          const x = c * cellSize + cellSize * 0.5;
          let activeWave: RippleWave | null = null;
          let ringIntensity = 0;

          for (let w = 0; w < waves.length; w++) {
            const wave = waves[w];
            const dist = Math.hypot(x - wave.cx, y - wave.cy);
            const band = Math.abs(dist - wave.radius);
            if (band < 48) {
              const strength = 1 - band / 48;
              const fade = 1 - wave.radius / wave.maxRadius;
              const combined = strength * fade;
              if (combined > ringIntensity) {
                ringIntensity = combined;
                activeWave = wave;
              }
            }
          }

          if (activeWave && ringIntensity > 0.14) {
            ctx.save();
            ctx.globalAlpha = Math.min(
              activeWave.maxAlpha,
              ringIntensity * activeWave.maxAlpha * 1.4
            );
            ctx.fillStyle = activeWave.color;
            ctx.fillRect(x - 9, y - 9, 18, 18);
            ctx.globalAlpha = Math.min(0.86, ringIntensity + 0.24);
            ctx.fillStyle = tone === "light" ? "#10131A" : "#F4F5F8";
            ctx.fillText((r + c) % 2 === 0 ? "+" : "-", x, y);
            ctx.restore();
          } else {
            const shimmer = Math.sin(timePhase + c * 0.28 + r * 0.22) > 0.87;
            if (tone === "light") {
              ctx.fillStyle = shimmer
                ? `rgba(47,107,242,${shimmerAlpha.toFixed(3)})`
                : `rgba(16,19,26,${quietBaseAlpha.toFixed(3)})`;
            } else {
              // Subtle warming from Obsidian crisp white-tint into Royal Blue Tint (#C7D8FC)
              ctx.fillStyle = shimmer
                ? `rgba(157,184,251,${shimmerAlpha.toFixed(3)})`
                : `rgba(199,216,252,${quietBaseAlpha.toFixed(3)})`;
            }
            ctx.fillText((c + r) % 2 === 0 ? "+" : "·", x, y);
          }
        }
      }
    };

    resize();

    let initialTimeout: ReturnType<typeof setTimeout> | null = null;
    if (!reducedMotion) {
      // Initial gentle pulse overlapping loader finish, then steady 6-second heartbeat
      initialTimeout = setTimeout(emitHeartbeat, 1800);
      heartbeatTimer = setInterval(emitHeartbeat, 6000);
      gsap.ticker.add(renderTick);
    }

    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(container);

    return () => {
      isCancelled = true;
      if (!reducedMotion) {
        gsap.ticker.remove(renderTick);
      }
      if (initialTimeout) clearTimeout(initialTimeout);
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      if (dubTimeout) clearTimeout(dubTimeout);
      window.removeEventListener("click", handleClick);
      resizeObserver.disconnect();
    };
  }, [blueShiftRef, tone]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
