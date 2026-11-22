"use client";

import React, { useEffect, useRef } from "react";
import { gsap, isLowEndDevice, prefersReducedMotion } from "@/lib/gsap";

interface Meteor3D {
  ringIndex: 0 | 1 | 2;
  angle: number;
  angularSpeed: number;
  radius: number;
  radialOffset: number;
  yOffset: number;
  tiltX: number;
  tiltZ: number;
  baseWidth: number;
  tailLen: number;
  color: string;
  isComet: boolean;
  // Smooth per-meteor 2D fluid deflection around cursor & click shockwaves (ZERO teleport!)
  dispX: number;
  dispY: number;
  vx: number;
  vy: number;
}

interface ClickPulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
}

interface ClickSpark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  size: number;
  color: string;
}

interface HeroInkExplosionCanvasProps {
  /** Flip to true right as the cinema split-shutter opens */
  active: boolean;
  /** Pause completely once Profile section takes over -> 0% CPU */
  paused?: boolean;
  /** Mutable 0..1 ref: 0 = Hero outside cosmos view, 1 = POV INSIDE the center of the universe (Section 2 Stack!) */
  cosmosZoomRef?: React.RefObject<number>;
  /** Mutable 0..1 ref: fades cosmos out cleanly when entering Section 3 Profile */
  cosmosExitRef?: React.RefObject<number>;
  className?: string;
}

const METEOR_COLORS = [
  "#2F6BF2",
  "#2F6BF2",
  "#2F6BF2",
  "#5887F6",
  "#9DB8FB",
  "#C7D8FC",
  "#F4F5F8",
] as const;

/**
 * True-3D Perspective Orbital Meteor Cosmos with:
 * - Steady cosmic rotation (NO full-world dizzying mouse tilt)
 * - Smooth per-meteor fluid cursor deflection ("belok / mencar halus" around pointer!)
 * - Real expanding physical click shockwaves + micro sparks (ZERO angle teleport!)
 * - POV Zoom-Inside-The-Universe continuity from Hero (Scene 1) into Tech Stack (Scene 2)!
 */
export function HeroInkExplosionCanvas({
  active,
  paused = false,
  cosmosZoomRef,
  cosmosExitRef,
  className = "",
}: HeroInkExplosionCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);
  const pausedRef = useRef(paused);
  const startTimeRef = useRef<number | null>(null);
  const pointerRef = useRef({ x: -9999, y: -9999, vx: 0, vy: 0, active: false });
  const pulsesRef = useRef<ClickPulse[]>([]);
  const sparksRef = useRef<ClickSpark[]>([]);

  useEffect(() => {
    activeRef.current = active;
    if (active && startTimeRef.current === null) {
      startTimeRef.current = performance.now();
    }
  }, [active]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const reducedMotion = prefersReducedMotion();
    const lowEnd = isLowEndDevice();
    const meteorCount = reducedMotion ? 64 : lowEnd ? 120 : 225;

    let width = Math.max(320, container.clientWidth || window.innerWidth);
    let height = Math.max(320, container.clientHeight || window.innerHeight);
    let meteors: Meteor3D[] = [];
    let stars: Array<{ x: number; y: number; r: number; a: number; depth: number }> = [];
    let isCancelled = false;

    const RING_CONFIGS = [
      { tiltX: 0.48, tiltZ: -0.22, rScale: 0.42, speedSign: 1 },
      { tiltX: -0.34, tiltZ: 0.3, rScale: 0.33, speedSign: -1 },
      { tiltX: 0.62, tiltZ: 0.14, rScale: 0.53, speedSign: 1 },
    ] as const;

    const buildCosmos = () => {
      const baseSpan = Math.min(width, height * 1.48);
      const nextMeteors: Meteor3D[] = [];

      for (let i = 0; i < meteorCount; i++) {
        const ringIndex = (i % 3) as 0 | 1 | 2;
        const cfg = RING_CONFIGS[ringIndex];

        const s1 = Math.sin(i * 12.9898 + 0.7) * 43758.5453;
        const r1 = s1 - Math.floor(s1);
        const s2 = Math.sin(i * 78.233 + 2.1) * 43758.5453;
        const r2 = s2 - Math.floor(s2);

        const isComet = i === 11 || i === 63 || i === 127 || i === 189;
        const radius = baseSpan * cfg.rScale * (0.76 + r1 * 0.48);

        nextMeteors.push({
          ringIndex,
          angle: (i / meteorCount) * Math.PI * 2 + r1 * 0.9,
          angularSpeed: (0.2 + r2 * 0.44) * cfg.speedSign * (isComet ? 1.4 : 1),
          radius,
          radialOffset: (r2 - 0.5) * 48,
          yOffset: (r1 - 0.5) * 76,
          tiltX: cfg.tiltX + (r2 - 0.5) * 0.12,
          tiltZ: cfg.tiltZ + (r1 - 0.5) * 0.12,
          baseWidth: isComet ? 2.8 : 1.05 + r2 * 1.55,
          tailLen: isComet ? 0.36 : 0.11 + r1 * 0.19,
          color: isComet ? "#E0462E" : METEOR_COLORS[i % METEOR_COLORS.length],
          isComet,
          dispX: 0,
          dispY: 0,
          vx: 0,
          vy: 0,
        });
      }
      meteors = nextMeteors;

      // Subtle background micro-starfield
      const starCount = lowEnd ? 50 : 95;
      const nextStars: Array<{ x: number; y: number; r: number; a: number; depth: number }> = [];
      for (let i = 0; i < starCount; i++) {
        const s1 = Math.sin(i * 39.346 + 5.2) * 43758.5453;
        const s2 = Math.sin(i * 91.113 + 1.9) * 43758.5453;
        nextStars.push({
          x: (s1 - Math.floor(s1)) * width,
          y: (s2 - Math.floor(s2)) * height,
          r: 0.65 + (i % 3) * 0.42,
          a: 0.08 + (i % 5) * 0.045,
          depth: 0.5 + (i % 4) * 0.35,
        });
      }
      stars = nextStars;
    };

    const project3D = (
      x: number,
      y: number,
      z: number,
      yaw: number,
      pitch: number,
      cx: number,
      cy: number,
      fov: number,
      camZOffset: number
    ) => {
      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const x1 = x * cosY - z * sinY;
      const z1 = x * sinY + z * cosY;

      const cosX = Math.cos(pitch);
      const sinX = Math.sin(pitch);
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;

      const depth = Math.max(95, fov + z2 - camZOffset);
      const scale = fov / depth;
      return {
        sx: cx + x1 * scale,
        sy: cy + y2 * scale,
        scale,
        z: z2 - camZOffset,
      };
    };

    const ringPoint3D = (m: Meteor3D, angle: number, expandMult: number) => {
      const r = (m.radius + m.radialOffset) * expandMult;
      const lx = Math.cos(angle) * r;
      const lz = Math.sin(angle) * r;
      const ly = m.yOffset * expandMult;

      const cosTX = Math.cos(m.tiltX);
      const sinTX = Math.sin(m.tiltX);
      const y1 = ly * cosTX - lz * sinTX;
      const z1 = ly * sinTX + lz * cosTX;

      const cosTZ = Math.cos(m.tiltZ);
      const sinTZ = Math.sin(m.tiltZ);
      const x2 = lx * cosTZ - y1 * sinTZ;
      const y2 = lx * sinTZ + y1 * cosTZ;

      return { x: x2, y: y2, z: z1 };
    };

    const renderFrame = (timeSec: number, deltaMs: number) => {
      if (isCancelled || pausedRef.current || !activeRef.current) return;

      const startMs = startTimeRef.current ?? performance.now();
      const elapsed = Math.max(0, (performance.now() - startMs) / 1000);
      const dtSec = Math.min(0.05, Math.max(0.008, deltaMs / 1000));
      const dtNorm = dtSec * 60;

      const insideZoom = Math.max(0, Math.min(1, cosmosZoomRef?.current ?? 0));
      const exitP = Math.max(0, Math.min(1, cosmosExitRef?.current ?? 0));

      // Fade smoothly only when transitioning from Section 2 Stack -> Section 3 Profile
      // While INSIDE the universe in Section 2 (insideZoom = 1), stay richly visible (0.58) around edges!
      const globalAlpha = (1 - insideZoom * 0.36) * Math.max(0, 1 - exitP * 1.25);
      if (globalAlpha <= 0.01) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5;
      const fov = Math.max(680, width * 0.74);

      // Intro hyperspeed deceleration (0 -> 1.6s) -> calm regal orbital flow
      const introSurge = Math.max(0, 1 - elapsed / 1.55);
      const speedMult = (1 + introSurge * introSurge * 4.4) * (1 - insideZoom * 0.25);

      // POV Zoom-Inside-The-Universe:
      // insideZoom = 0 (Hero) -> viewing orbital rings around STEVEN ARNALDO
      // insideZoom = 1 (Stack) -> camera flies INSIDE the center of the galaxy so rings surround the viewport!
      const smoothInside = insideZoom * insideZoom * (3 - 2 * insideZoom);
      const expandMult =
        (1.52 - (1 - introSurge * introSurge) * 0.52) *
        (1 + smoothInside * 0.88 + exitP * 0.9);
      const camZOffset = smoothInside * 210 + exitP * 180;

      // Steady, majestic cosmic axis (NO dizzying full-world mouse swing!)
      const camYaw = Math.sin(timeSec * 0.16) * 0.045;
      const camPitch = Math.cos(timeSec * 0.13) * 0.032 + smoothInside * 0.14;

      const mx = pointerRef.current.x;
      const my = pointerRef.current.y;
      const pointerActive = pointerRef.current.active;
      const hoverRadius = 165;
      const hoverRadSq = hoverRadius * hoverRadius;

      // 1. Background Micro-Starfield (expands subtly outward as camera flies into the universe!)
      ctx.fillStyle = "#C7D8FC";
      for (let i = 0; i < stars.length; i++) {
        const st = stars[i];
        const sx = cx + (st.x - cx) * (1 + smoothInside * 0.24 * st.depth);
        const sy = cy + (st.y - cy) * (1 + smoothInside * 0.24 * st.depth);
        ctx.globalAlpha = st.a * globalAlpha;
        ctx.beginPath();
        ctx.arc(sx, sy, st.r * (1 + smoothInside * 0.25), 0, Math.PI * 2);
        ctx.fill();
      }

      // 2. Real Physical Click Shockwave Rings & Micro Sparks (ZERO angle teleport!)
      const pulses = pulsesRef.current;
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.radius += (pulse.maxRadius - pulse.radius) * 0.065 * dtNorm + 4.8 * dtNorm;
        pulse.alpha *= Math.pow(0.945, dtNorm);
        if (pulse.alpha < 0.012 || pulse.radius >= pulse.maxRadius) {
          pulses.splice(p, 1);
          continue;
        }
        ctx.save();
        ctx.strokeStyle = "#2F6BF2";
        ctx.globalAlpha = pulse.alpha * 0.72 * globalAlpha;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        ctx.stroke();

        // Soft inner echo ring
        if (pulse.radius > 28) {
          ctx.strokeStyle = "#C7D8FC";
          ctx.globalAlpha = pulse.alpha * 0.35 * globalAlpha;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.arc(pulse.x, pulse.y, pulse.radius * 0.84, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      const sparks = sparksRef.current;
      for (let s = sparks.length - 1; s >= 0; s--) {
        const sp = sparks[s];
        sp.x += sp.vx * dtNorm;
        sp.y += sp.vy * dtNorm;
        sp.vx *= Math.pow(0.93, dtNorm);
        sp.vy *= Math.pow(0.93, dtNorm);
        sp.alpha *= Math.pow(0.92, dtNorm);
        if (sp.alpha < 0.02) {
          sparks.splice(s, 1);
          continue;
        }
        ctx.fillStyle = sp.color;
        ctx.globalAlpha = sp.alpha * globalAlpha;
        ctx.beginPath();
        ctx.arc(sp.x, sp.y, sp.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // 3. Delicate 3D Orbital Guide Rings (expand around edges in Section 2 POV!)
      ctx.save();
      ctx.lineWidth = 1;
      for (let rIdx = 0; rIdx < RING_CONFIGS.length; rIdx++) {
        const cfg = RING_CONFIGS[rIdx];
        const dummy: Meteor3D = {
          ringIndex: rIdx as 0 | 1 | 2,
          angle: 0,
          angularSpeed: 0,
          radius: Math.min(width, height * 1.48) * cfg.rScale,
          radialOffset: 0,
          yOffset: 0,
          tiltX: cfg.tiltX,
          tiltZ: cfg.tiltZ,
          baseWidth: 1,
          tailLen: 0,
          color: "#2F6BF2",
          isComet: false,
          dispX: 0,
          dispY: 0,
          vx: 0,
          vy: 0,
        };
        ctx.strokeStyle = rIdx === 1 ? "rgba(157,184,251,0.10)" : "rgba(47,107,242,0.13)";
        ctx.globalAlpha = globalAlpha;
        ctx.beginPath();
        const segs = 72;
        for (let s = 0; s <= segs; s++) {
          const a = (s / segs) * Math.PI * 2;
          const pt3 = ringPoint3D(dummy, a, expandMult);
          const pr = project3D(pt3.x, pt3.y, pt3.z, camYaw, camPitch, cx, cy, fov, camZOffset);
          if (s === 0) ctx.moveTo(pr.sx, pr.sy);
          else ctx.lineTo(pr.sx, pr.sy);
        }
        ctx.stroke();
      }
      ctx.restore();

      // 4. 225 True-3D Perspective Orbital Meteors with Fluid Hover Deflection & Tapered Glowing Tails!
      ctx.lineCap = "round";

      for (let i = 0; i < meteors.length; i++) {
        const m = meteors[i];
        if (!reducedMotion) {
          m.angle += m.angularSpeed * dtSec * speedMult;
        }

        const dir = m.angularSpeed >= 0 ? 1 : -1;
        const head3 = ringPoint3D(m, m.angle, expandMult);
        const headProj = project3D(
          head3.x,
          head3.y,
          head3.z,
          camYaw,
          camPitch,
          cx,
          cy,
          fov,
          camZOffset
        );

        // Skip meteors behind camera plane when zoomed deep inside
        if (headProj.scale > 4.2) continue;

        const liveX = headProj.sx + m.dispX;
        const liveY = headProj.sy + m.dispY;

        // A) Smooth Per-Meteor Fluid Hover Deflection ("belok / mencar halus" around mouse!)
        if (pointerActive) {
          const dx = liveX - mx;
          const dy = liveY - my;
          const distSq = dx * dx + dy * dy;
          if (distSq < hoverRadSq && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const strength = Math.pow(1 - dist / hoverRadius, 1.5);
            const nx = dx / dist;
            const ny = dy / dist;
            // Combine gentle radial parting + graceful tangential swerve so meteors curve smoothly around cursor!
            const tangentSign = dir;
            m.vx += (nx * 2.6 - ny * 1.15 * tangentSign) * strength * dtNorm;
            m.vy += (ny * 2.6 + nx * 1.15 * tangentSign) * strength * dtNorm;
          }
        }

        // B) Smooth Physical Click Shockwave Ripple (meteors swerve outward ONLY as the wave ring crosses them!)
        for (let p = 0; p < pulses.length; p++) {
          const pulse = pulses[p];
          const dx = liveX - pulse.x;
          const dy = liveY - pulse.y;
          const dist = Math.hypot(dx, dy);
          const band = Math.abs(dist - pulse.radius);
          if (band < 54 && dist > 1) {
            const waveForce = (1 - band / 54) * pulse.alpha * 7.5;
            m.vx += (dx / dist) * waveForce * dtNorm;
            m.vy += (dy / dist) * waveForce * dtNorm;
          }
        }

        // Elastic spring back to true 3D orbital track
        m.vx += -m.dispX * 0.065 * dtNorm;
        m.vy += -m.dispY * 0.065 * dtNorm;
        m.vx *= Math.pow(0.86, dtNorm);
        m.vy *= Math.pow(0.86, dtNorm);
        m.dispX += m.vx * dtNorm;
        m.dispY += m.vy * dtNorm;

        const clampedScale = Math.min(2.2, headProj.scale);
        const depthAlpha = Math.max(0.16, Math.min(1, (clampedScale - 0.52) * 1.4));
        const trailSpan = m.tailLen * (1 + introSurge * 1.35);

        // Compute 6 curved trail vertices with decaying deflection along tail (organic curved bend!)
        const ptsX = new Float32Array(7);
        const ptsY = new Float32Array(7);
        ptsX[0] = headProj.sx + m.dispX;
        ptsY[0] = headProj.sy + m.dispY;

        for (let step = 1; step <= 6; step++) {
          const frac = step / 6;
          const a = m.angle - dir * trailSpan * frac;
          const p3 = ringPoint3D(m, a, expandMult);
          const pr = project3D(p3.x, p3.y, p3.z, camYaw, camPitch, cx, cy, fov, camZOffset);
          const bendWeight = Math.pow(1 - frac, 1.35);
          ptsX[step] = pr.sx + m.dispX * bendWeight;
          ptsY[step] = pr.sy + m.dispY * bendWeight;
        }

        const baseStrokeW = Math.max(0.75, m.baseWidth * clampedScale * (1 + introSurge * 0.4));

        // Draw 3-tier tapered glowing meteor tail (fading outer tail -> rich mid core -> hot bright tip!)
        // Tier 1: Soft fading rear tail (segments 3..6)
        ctx.strokeStyle = m.isComet ? "#E0462E" : "#2F6BF2";
        ctx.lineWidth = baseStrokeW * 0.55;
        ctx.globalAlpha = depthAlpha * 0.34 * globalAlpha;
        ctx.beginPath();
        ctx.moveTo(ptsX[3], ptsY[3]);
        ctx.lineTo(ptsX[4], ptsY[4]);
        ctx.lineTo(ptsX[5], ptsY[5]);
        ctx.lineTo(ptsX[6], ptsY[6]);
        ctx.stroke();

        // Tier 2: Vibrant mid streak (segments 1..3)
        ctx.strokeStyle = m.color;
        ctx.lineWidth = baseStrokeW * 0.9;
        ctx.globalAlpha = depthAlpha * (m.isComet ? 0.85 : 0.72) * globalAlpha;
        ctx.beginPath();
        ctx.moveTo(ptsX[1], ptsY[1]);
        ctx.lineTo(ptsX[2], ptsY[2]);
        ctx.lineTo(ptsX[3], ptsY[3]);
        ctx.stroke();

        // Tier 3: Luminous leading head segment (segments 0..1)
        ctx.strokeStyle = m.isComet ? "#FF7B63" : "#F4F5F8";
        ctx.lineWidth = baseStrokeW * 1.15;
        ctx.globalAlpha = depthAlpha * (m.isComet ? 0.98 : 0.88) * globalAlpha;
        ctx.beginPath();
        ctx.moveTo(ptsX[0], ptsY[0]);
        ctx.lineTo(ptsX[1], ptsY[1]);
        ctx.stroke();

        // Crisp glowing meteor head + soft volumetric halo on near orbits & comets
        if (m.isComet || clampedScale > 0.96) {
          const headR = Math.max(1.2, baseStrokeW * 0.72);
          ctx.fillStyle = m.isComet ? "#E0462E" : "#2F6BF2";
          ctx.globalAlpha = depthAlpha * 0.28 * globalAlpha;
          ctx.beginPath();
          ctx.arc(ptsX[0], ptsY[0], headR * 3.1, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = m.isComet ? "#FFD7CE" : "#F4F5F8";
          ctx.globalAlpha = Math.min(1, depthAlpha * 0.96 * globalAlpha);
          ctx.beginPath();
          ctx.arc(ptsX[0], ptsY[0], headR, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      ctx.globalAlpha = 1;
    };

    const resize = () => {
      if (isCancelled) return;
      width = Math.max(320, container.clientWidth || window.innerWidth);
      height = Math.max(320, container.clientHeight || window.innerHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      buildCosmos();
      if (reducedMotion) {
        renderFrame(0, 16);
      }
    };

    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current.vx = e.clientX - pointerRef.current.x;
      pointerRef.current.vy = e.clientY - pointerRef.current.y;
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      pointerRef.current.active = true;
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    const handleClick = (e: MouseEvent) => {
      if (pausedRef.current || !activeRef.current || reducedMotion) return;
      // Spawn smooth expanding physical shockwave ring + delicate micro sparks (NO angle teleport!)
      pulsesRef.current.push({
        x: e.clientX,
        y: e.clientY,
        radius: 10,
        maxRadius: Math.min(width, height) * 0.58,
        alpha: 0.75,
      });
      if (pulsesRef.current.length > 4) {
        pulsesRef.current.shift();
      }

      for (let k = 0; k < 12; k++) {
        const a = (k / 12) * Math.PI * 2 + (Math.random() - 0.5) * 0.35;
        const sp = 2.6 + Math.random() * 4.2;
        sparksRef.current.push({
          x: e.clientX,
          y: e.clientY,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          alpha: 0.9,
          size: 1.2 + Math.random() * 1.4,
          color: k % 4 === 0 ? "#F4F5F8" : "#9DB8FB",
        });
      }
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);
    window.addEventListener("click", handleClick, { passive: true });

    resize();
    if (!reducedMotion) {
      gsap.ticker.add(renderFrame);
    }

    const ro = new ResizeObserver(resize);
    ro.observe(container);

    return () => {
      isCancelled = true;
      if (!reducedMotion) {
        gsap.ticker.remove(renderFrame);
      }
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      window.removeEventListener("click", handleClick);
      ro.disconnect();
    };
  }, [cosmosZoomRef, cosmosExitRef]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
