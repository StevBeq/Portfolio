"use client";

import React, { useEffect, useRef } from "react";
import { gsap, isLowEndDevice, prefersReducedMotion } from "@/lib/gsap";

export interface IntroCinemaState {
  /**
   * 0.00..0.34 = Distant Nebula Awakening
   * 0.34..0.45 = Gravitational Implosion
   * 0.45..0.88 = Detonation & Space Fly-Through Film
   * 0.88..1.00 = Settled Hero Orbit
   */
  progress: number;
  detonateTick: number;
}

export interface AstrolabeHoverState {
  active: boolean;
  x: number;
  y: number;
  color: string;
}

export interface AstrolabePulseState {
  tick: number;
  x: number;
  y: number;
}

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
  dispX: number;
  dispY: number;
  vx: number;
  vy: number;
  isAstroMember: boolean;
  astroRingIdx: 0 | 1 | 2;
}

interface ClickPulse {
  x: number;
  y: number;
  radius: number;
  maxRadius: number;
  alpha: number;
  color: string;
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

interface AstroRingSpec {
  pitch: number;
  roll: number;
  rMult: number;
  yOff: number;
  speed: number;
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

// 4 articulated 3D Astrolabe gimbal presets paired to Capability Pillars 01..04
const ASTROLABE_PRESETS: ReadonlyArray<readonly [AstroRingSpec, AstroRingSpec, AstroRingSpec]> = [
  // 01 Web: Wide Equatorial Browser Gyroscope
  [
    { pitch: 0.38, roll: -0.18, rMult: 1.04, yOff: 0, speed: 0.42 },
    { pitch: -0.24, roll: 0.26, rMult: 0.78, yOff: 0, speed: -0.58 },
    { pitch: 0.62, roll: 0.08, rMult: 0.54, yOff: 0, speed: 0.82 },
  ],
  // 02 Mobile: Dramatic ~90deg Vertical Portrait Gimbal Flip
  [
    { pitch: 0.16, roll: 1.42, rMult: 1.0, yOff: 0, speed: 0.52 },
    { pitch: 0.2, roll: -1.26, rMult: 0.76, yOff: 0, speed: -0.66 },
    { pitch: 1.18, roll: 0.06, rMult: 0.5, yOff: 0, speed: 0.9 },
  ],
  // 03 Backend: 60deg Tri-Axis Harmonic Reactor
  [
    { pitch: 0.72, roll: 0.0, rMult: 0.98, yOff: 0, speed: 0.62 },
    { pitch: 0.72, roll: 1.05, rMult: 0.9, yOff: 0, speed: -0.72 },
    { pitch: 0.72, roll: -1.05, rMult: 0.8, yOff: 0, speed: 0.82 },
  ],
  // 04 Database & Cloud: 3-Tier Stacked Saturn Relational Rings
  [
    { pitch: 1.16, roll: 0.0, rMult: 0.9, yOff: -0.26, speed: 0.4 },
    { pitch: 1.16, roll: 0.0, rMult: 1.08, yOff: 0.0, speed: -0.52 },
    { pitch: 1.16, roll: 0.0, rMult: 0.84, yOff: 0.26, speed: 0.62 },
  ],
];

const RING_CONFIGS = [
  { tiltX: 0.48, tiltZ: -0.22, rScale: 0.42, speedSign: 1 },
  { tiltX: -0.34, tiltZ: 0.3, rScale: 0.33, speedSign: -1 },
  { tiltX: 0.62, tiltZ: 0.14, rScale: 0.53, speedSign: 1 },
] as const;

function clamp01(v: number): number {
  return v < 0 ? 0 : v > 1 ? 1 : v;
}

interface HeroInkExplosionCanvasProps {
  active?: boolean;
  paused?: boolean;
  introCinemaRef?: React.RefObject<IntroCinemaState>;
  cosmosStageRef?: React.RefObject<number>;
  cosmosExitRef?: React.RefObject<number>;
  astrolabeFormRef?: React.RefObject<number>;
  astrolabePillarRef?: React.RefObject<number>;
  astrolabeBurstRef?: React.RefObject<number>;
  astrolabeSpinRef?: React.RefObject<number>;
  astrolabeHoverRef?: React.RefObject<AstrolabeHoverState>;
  astrolabePulseRef?: React.RefObject<AstrolabePulseState>;
  className?: string;
}

/**
 * High-efficiency 60fps True-3D Perspective Orbital Cosmos:
 * - Zero-GC hot loop with pre-allocated scratch buffers
 * - 4-Act Cinematic Space Opening Film (Distant Nebula -> Singularity Implosion -> Fly-Through Warp -> Hero)
 * - Articulated 3D Cosmic Astrolabe Gyroscope in Scene 2 synced with user drag spin & hover laser reticle
 */
export function HeroInkExplosionCanvas({
  active = true,
  paused = false,
  introCinemaRef,
  cosmosStageRef,
  cosmosExitRef,
  astrolabeFormRef,
  astrolabePillarRef,
  astrolabeBurstRef,
  astrolabeSpinRef,
  astrolabeHoverRef,
  astrolabePulseRef,
  className = "",
}: HeroInkExplosionCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const activeRef = useRef(active);
  const pausedRef = useRef(paused);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const smoothTiltRef = useRef({ yaw: 0, pitch: 0 });
  const pulsesRef = useRef<ClickPulse[]>([]);
  const sparksRef = useRef<ClickSpark[]>([]);

  useEffect(() => {
    activeRef.current = active;
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
    const meteorCount = reducedMotion ? 56 : lowEnd ? 100 : 185;
    const astroMemberCap = Math.min(110, Math.floor(meteorCount * 0.6));

    let width = Math.max(320, container.clientWidth || window.innerWidth);
    let height = Math.max(320, container.clientHeight || window.innerHeight);
    let meteors: Meteor3D[] = [];
    let stars: Array<{ x: number; y: number; r: number; a: number; depth: number }> = [];
    let isCancelled = false;
    let lastDetonateTick = introCinemaRef?.current?.detonateTick ?? 0;
    let lastAstroPulseTick = astrolabePulseRef?.current?.tick ?? 0;

    // Pre-allocated scratch buffers (0 heap allocations in renderFrame)
    const ptsX = new Float32Array(5);
    const ptsY = new Float32Array(5);
    const astroRingsScratch: [AstroRingSpec, AstroRingSpec, AstroRingSpec] = [
      { pitch: 0, roll: 0, rMult: 1, yOff: 0, speed: 0.4 },
      { pitch: 0, roll: 0, rMult: 0.8, yOff: 0, speed: -0.5 },
      { pitch: 0, roll: 0, rMult: 0.55, yOff: 0, speed: 0.7 },
    ];
    const projOut = { sx: 0, sy: 0, scale: 1 };
    const ringOut = { x: 0, y: 0, z: 0 };

    const spawnRadialSparks = (x: number, y: number, count: number, baseSpeed: number) => {
      const sparks = sparksRef.current;
      for (let k = 0; k < count; k++) {
        const a = (k / count) * Math.PI * 2 + (k % 3) * 0.09;
        const sp = baseSpeed + (k % 5) * 0.95;
        sparks.push({
          x,
          y,
          vx: Math.cos(a) * sp,
          vy: Math.sin(a) * sp,
          alpha: 0.94,
          size: k % 5 === 0 ? 2.0 : 1.3,
          color: k % 6 === 0 ? "#E0462E" : k % 3 === 0 ? "#F4F5F8" : "#9DB8FB",
        });
      }
      if (sparks.length > 90) {
        sparks.splice(0, sparks.length - 90);
      }
    };

    const pushShockwave = (x: number, y: number, maxRadius: number, alpha: number, color: string) => {
      const pulses = pulsesRef.current;
      pulses.push({ x, y, radius: 8, maxRadius, alpha, color });
      if (pulses.length > 6) pulses.shift();
    };

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

        const isComet = i === 11 || i === 59 || i === 117 || i === 169;
        const radius = baseSpan * cfg.rScale * (0.76 + r1 * 0.48);

        nextMeteors.push({
          ringIndex,
          angle: (i / meteorCount) * Math.PI * 2 + r1 * 0.9,
          angularSpeed: (0.2 + r2 * 0.44) * cfg.speedSign * (isComet ? 1.38 : 1),
          radius,
          radialOffset: (r2 - 0.5) * 48,
          yOffset: (r1 - 0.5) * 76,
          tiltX: cfg.tiltX + (r2 - 0.5) * 0.12,
          tiltZ: cfg.tiltZ + (r1 - 0.5) * 0.12,
          baseWidth: isComet ? 2.75 : 1.05 + r2 * 1.5,
          tailLen: isComet ? 0.34 : 0.11 + r1 * 0.18,
          color: isComet ? "#E0462E" : METEOR_COLORS[i % METEOR_COLORS.length],
          isComet,
          dispX: 0,
          dispY: 0,
          vx: 0,
          vy: 0,
          isAstroMember: i < astroMemberCap,
          astroRingIdx: (i % 3) as 0 | 1 | 2,
        });
      }
      meteors = nextMeteors;

      const starCount = lowEnd ? 48 : 95;
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

    const project3DInto = (
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
      projOut.sx = cx + x1 * scale;
      projOut.sy = cy + y2 * scale;
      projOut.scale = scale;
    };

    const ringOrbitPoint3DInto = (
      radius: number,
      yOffset: number,
      tiltX: number,
      tiltZ: number,
      angle: number,
      expandMult: number
    ) => {
      const r = radius * expandMult;
      const lx = Math.cos(angle) * r;
      const lz = Math.sin(angle) * r;
      const ly = yOffset * expandMult;

      const cosTX = Math.cos(tiltX);
      const sinTX = Math.sin(tiltX);
      const y1 = ly * cosTX - lz * sinTX;
      const z1 = ly * sinTX + lz * cosTX;

      const cosTZ = Math.cos(tiltZ);
      const sinTZ = Math.sin(tiltZ);
      ringOut.x = lx * cosTZ - y1 * sinTZ;
      ringOut.y = lx * sinTZ + y1 * cosTZ;
      ringOut.z = z1;
    };

    const renderFrame = (timeSec: number, deltaMs: number) => {
      if (isCancelled || pausedRef.current || !activeRef.current) return;

      const dtSec = Math.min(0.05, Math.max(0.008, deltaMs / 1000));
      const dtNorm = dtSec * 60;

      // Sync trigger events from GSAP intro film & Astrolabe clicks
      const curDetonateTick = introCinemaRef?.current?.detonateTick ?? 0;
      if (curDetonateTick !== lastDetonateTick) {
        lastDetonateTick = curDetonateTick;
        if (!reducedMotion) {
          const minDim = Math.min(width, height);
          pushShockwave(width * 0.5, height * 0.5, minDim * 0.72, 0.94, "#2F6BF2");
          pushShockwave(width * 0.5, height * 0.5, minDim * 0.42, 0.85, "#E0462E");
          spawnRadialSparks(width * 0.5, height * 0.5, 30, 3.6);
        }
      }

      const astroPulse = astrolabePulseRef?.current;
      if (astroPulse && astroPulse.tick !== lastAstroPulseTick) {
        lastAstroPulseTick = astroPulse.tick;
        if (!reducedMotion) {
          pushShockwave(astroPulse.x, astroPulse.y, Math.min(width, height) * 0.34, 0.85, "#2F6BF2");
          spawnRadialSparks(astroPulse.x, astroPulse.y, 14, 2.4);
        }
      }

      // Opening Cinema Acts I -> IV parameters
      const introP = reducedMotion ? 1 : clamp01(introCinemaRef?.current?.progress ?? 1);
      let galaxyScale = 1;
      let introCamZ = 0;
      let introPitch = 0;
      let introYaw = 0;
      let singularityGlow = 0;
      let warpFactor = 0;
      let introSpeedMult = 1;
      let ringReveal = 1;

      if (introP <= 0.34) {
        const u = introP / 0.34;
        galaxyScale = 0.22 + u * 0.05;
        introCamZ = -920;
        introPitch = 0.62;
        introYaw = -0.52;
        singularityGlow = u * 0.35;
        introSpeedMult = 1.35;
        ringReveal = 0.45;
      } else if (introP <= 0.45) {
        const q = (introP - 0.34) / 0.11;
        const qe = q * q * q;
        galaxyScale = 0.27 - qe * 0.23;
        introCamZ = -920;
        introPitch = 0.62;
        introYaw = -0.52;
        singularityGlow = 0.35 + q * 0.65;
        introSpeedMult = 1.35 + qe * 4.5;
        ringReveal = Math.max(0.1, 0.45 * (1 - q));
      } else if (introP <= 0.88) {
        const f = (introP - 0.45) / 0.43;
        const fe = 1 - Math.pow(1 - f, 3.2);
        galaxyScale = 0.04 + fe * 0.96 + Math.sin(f * Math.PI) * 0.14 * (1 - f);
        introCamZ = -920 * (1 - fe);
        introPitch = 0.62 * (1 - fe);
        introYaw = -0.52 * (1 - fe);
        singularityGlow = Math.max(0, 1 - f * 4.2);
        warpFactor = Math.sin(Math.min(1, f * 1.4) * Math.PI) * (1 - f);
        introSpeedMult = 1 + Math.pow(1 - f, 2.2) * 4.8;
        ringReveal = Math.min(1, 0.2 + f * 1.1);
      }

      const stage = Math.max(0, Math.min(2, cosmosStageRef?.current ?? 0));
      const exitP = clamp01(cosmosExitRef?.current ?? 0);
      const astroForm = clamp01(astrolabeFormRef?.current ?? 0);
      const af = astroForm * astroForm * (3 - 2 * astroForm);
      const astroPillar = Math.max(0, Math.min(3, astrolabePillarRef?.current ?? 0));
      const astroBurst = clamp01(astrolabeBurstRef?.current ?? 0);
      const userSpin = astrolabeSpinRef?.current ?? 0;

      const s01 = Math.min(1, stage);
      const ease01 = s01 * s01 * (3 - 2 * s01);
      const s12 = Math.max(0, stage - 1);
      const ease12 = s12 * s12 * (3 - 2 * s12);

      const globalAlpha =
        (1 - ease01 * 0.22 - ease12 * 0.36) * Math.max(0, 1 - exitP * 1.25);
      if (globalAlpha <= 0.01) {
        ctx.clearRect(0, 0, width, height);
        return;
      }

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5 + ease12 * width * 0.04;
      const cy = height * 0.5 - ease12 * height * 0.03;
      const fov = Math.max(680, width * 0.74);

      const speedMult =
        introSpeedMult * (1 - ease01 * 0.25 - ease12 * 0.36);
      const expandMult =
        galaxyScale * (1 + ease01 * 0.85 - ease12 * 0.32 + exitP * 0.85);
      const camZOffset = introCamZ + ease01 * 210 - ease12 * 95 + exitP * 180;

      const camYaw = introYaw + Math.sin(timeSec * 0.16) * 0.04 + ease12 * 0.62;
      const camPitch = introPitch + Math.cos(timeSec * 0.13) * 0.03 + ease01 * 0.14 + ease12 * 0.38;

      const mx = pointerRef.current.x;
      const my = pointerRef.current.y;
      const pointerActive = pointerRef.current.active;
      const hoverRadius = 155;
      const hoverRadSq = hoverRadius * hoverRadius;

      // Smoothly lerp pointer 3D Astrolabe tilt (+/-0.24 rad)
      const targetTiltYaw = pointerActive ? ((mx - width * 0.5) / width) * 0.48 : 0;
      const targetTiltPitch = pointerActive ? ((my - height * 0.5) / height) * 0.48 : 0;
      smoothTiltRef.current.yaw += (targetTiltYaw - smoothTiltRef.current.yaw) * 0.09;
      smoothTiltRef.current.pitch += (targetTiltPitch - smoothTiltRef.current.pitch) * 0.09;

      // 1. Background Starfield + Hyperspeed Radial Warp Streaks during Opening Fly-Through
      const flyPush = 1 + (introCamZ + 920) / 920 * 0.22;
      for (let i = 0; i < stars.length; i++) {
        const st = stars[i];
        const sx =
          cx +
          (st.x - width * 0.5) * (flyPush + ease01 * 0.24 * st.depth) -
          ease12 * 45 * st.depth;
        const sy =
          cy +
          (st.y - height * 0.5) * (flyPush + ease01 * 0.24 * st.depth) -
          ease12 * 22 * st.depth;

        if (warpFactor > 0.015) {
          const dx = sx - cx;
          const dy = sy - cy;
          const dist = Math.hypot(dx, dy) || 1;
          const streakLen = warpFactor * 52 * st.depth * Math.min(1.4, dist / (width * 0.24));
          ctx.strokeStyle = i % 3 === 0 ? "#F4F5F8" : "#9DB8FB";
          ctx.lineWidth = Math.max(0.8, st.r * 1.1);
          ctx.globalAlpha = Math.min(0.85, (st.a + warpFactor * 0.48) * globalAlpha);
          ctx.beginPath();
          ctx.moveTo(sx, sy);
          ctx.lineTo(sx + (dx / dist) * streakLen, sy + (dy / dist) * streakLen);
          ctx.stroke();
        } else {
          ctx.fillStyle = "#C7D8FC";
          ctx.globalAlpha = st.a * Math.max(0.35, globalAlpha);
          ctx.beginPath();
          ctx.arc(sx, sy, st.r * (1 + ease01 * 0.22), 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // 2. Canvas Singularity Core & Gravitational Aperture Rings (Opening Acts I -> III)
      if (singularityGlow > 0.015) {
        const sgAlpha = Math.min(1, singularityGlow * 1.15);
        const outerRingR = Math.max(18, 125 * (1 - singularityGlow * 0.72));
        const innerRingR = Math.max(10, 72 * (1 - singularityGlow * 0.68));

        ctx.save();
        ctx.translate(cx, cy);

        // Counter-rotating tightening gravitational aperture rings
        ctx.save();
        ctx.rotate(timeSec * 0.9);
        ctx.strokeStyle = "#2F6BF2";
        ctx.lineWidth = 1.4;
        ctx.setLineDash([16, 10, 4, 10]);
        ctx.globalAlpha = sgAlpha * 0.72;
        ctx.beginPath();
        ctx.arc(0, 0, outerRingR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.rotate(-timeSec * 1.25);
        ctx.strokeStyle = "#9DB8FB";
        ctx.lineWidth = 1.1;
        ctx.setLineDash([7, 11]);
        ctx.globalAlpha = sgAlpha * 0.64;
        ctx.beginPath();
        ctx.arc(0, 0, innerRingR, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();

        ctx.setLineDash([]);

        // Concentric Singularity Core Glow (zero gradient allocations!)
        ctx.fillStyle = "#2F6BF2";
        ctx.globalAlpha = sgAlpha * 0.16;
        ctx.beginPath();
        ctx.arc(0, 0, 26 + sgAlpha * 24, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#E0462E";
        ctx.globalAlpha = sgAlpha * 0.85;
        ctx.beginPath();
        ctx.arc(0, 0, 5 + sgAlpha * 7, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#F4F5F8";
        ctx.globalAlpha = Math.min(1, sgAlpha * 0.96);
        ctx.beginPath();
        ctx.arc(0, 0, 2 + sgAlpha * 2.4, 0, Math.PI * 2);
        ctx.fill();

        ctx.restore();
      }

      // 3. Shockwave Rings & Radial Sparks
      const pulses = pulsesRef.current;
      for (let p = pulses.length - 1; p >= 0; p--) {
        const pulse = pulses[p];
        pulse.radius += (pulse.maxRadius - pulse.radius) * 0.068 * dtNorm + 5.0 * dtNorm;
        pulse.alpha *= Math.pow(0.945, dtNorm);
        if (pulse.alpha < 0.012 || pulse.radius >= pulse.maxRadius) {
          pulses.splice(p, 1);
          continue;
        }
        ctx.strokeStyle = pulse.color;
        ctx.globalAlpha = pulse.alpha * 0.75 * globalAlpha;
        ctx.lineWidth = 1.6;
        ctx.beginPath();
        ctx.arc(pulse.x, pulse.y, pulse.radius, 0, Math.PI * 2);
        ctx.stroke();

        if (pulse.radius > 28) {
          ctx.strokeStyle = "#C7D8FC";
          ctx.globalAlpha = pulse.alpha * 0.34 * globalAlpha;
          ctx.lineWidth = 0.9;
          ctx.beginPath();
          ctx.arc(pulse.x, pulse.y, pulse.radius * 0.84, 0, Math.PI * 2);
          ctx.stroke();
        }
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

      // 4. Interpolate Scene 2 Articulated 3D Cosmic Astrolabe Gimbal Specs
      const isMobile = width < 768;
      const astroCx = isMobile ? width * 0.5 : width * 0.69;
      const astroCy = isMobile ? height * 0.72 : height * 0.5;
      const astroR = isMobile
        ? Math.min(width * 0.32, height * 0.2)
        : Math.min(width * 0.19, height * 0.34);
      const astroFov = Math.max(540, astroR * 2.8);
      const burstScale = 1 + astroBurst * 0.55;

      const pLow = Math.min(3, Math.floor(astroPillar));
      const pHigh = Math.min(3, Math.ceil(astroPillar));
      const pFrac = astroPillar - pLow;
      const pSmooth = pFrac * pFrac * (3 - 2 * pFrac);
      const presetA = ASTROLABE_PRESETS[pLow];
      const presetB = ASTROLABE_PRESETS[pHigh];

      for (let r = 0; r < 3; r++) {
        const a = presetA[r];
        const b = presetB[r];
        const dst = astroRingsScratch[r];
        dst.pitch = a.pitch + (b.pitch - a.pitch) * pSmooth + smoothTiltRef.current.pitch * 0.55;
        dst.roll = a.roll + (b.roll - a.roll) * pSmooth;
        dst.rMult = a.rMult + (b.rMult - a.rMult) * pSmooth;
        dst.yOff = (a.yOff + (b.yOff - a.yOff) * pSmooth) * astroR * burstScale;
        dst.speed = a.speed + (b.speed - a.speed) * pSmooth;
      }

      const astroYawBase = userSpin + smoothTiltRef.current.yaw;

      // Render Astrolabe Gimbal Wireframe, Core & Interactive Hover Tether (Scene 2)
      if (af > 0.015) {
        const vis = af * Math.max(0.22, 1 - astroBurst * 0.6) * (isMobile ? 0.72 : 1);

        // Articulated 3D Gimbal Rings + Degree Ticks + Inner Vernier Arcs
        for (let r = 0; r < 3; r++) {
          const spec = astroRingsScratch[r];
          const ringYaw = astroYawBase + timeSec * spec.speed * 0.18;
          const ringRad = astroR * spec.rMult * burstScale;

          ctx.strokeStyle = r === 1 ? "rgba(157,184,251,0.52)" : "rgba(47,107,242,0.58)";
          ctx.lineWidth = r === 0 ? 1.5 : 1.1;
          ctx.globalAlpha = vis * globalAlpha;
          ctx.beginPath();
          const segs = 64;
          for (let s = 0; s <= segs; s++) {
            const a = (s / segs) * Math.PI * 2;
            ringOrbitPoint3DInto(ringRad, spec.yOff, spec.pitch, spec.roll, a, 1);
            project3DInto(
              ringOut.x,
              ringOut.y,
              ringOut.z,
              ringYaw,
              0.08,
              astroCx,
              astroCy,
              astroFov,
              0
            );
            if (s === 0) ctx.moveTo(projOut.sx, projOut.sy);
            else ctx.lineTo(projOut.sx, projOut.sy);
          }
          ctx.stroke();

          // Subtle inner dashed vernier ring on outer gyroscope shell
          if (r === 0) {
            ctx.save();
            ctx.strokeStyle = "rgba(199,216,252,0.28)";
            ctx.lineWidth = 0.9;
            ctx.setLineDash([4, 9]);
            ctx.globalAlpha = vis * globalAlpha;
            ctx.beginPath();
            for (let s = 0; s <= 48; s++) {
              const a = (s / 48) * Math.PI * 2;
              ringOrbitPoint3DInto(ringRad * 0.92, spec.yOff, spec.pitch, spec.roll, a, 1);
              project3DInto(
                ringOut.x,
                ringOut.y,
                ringOut.z,
                ringYaw,
                0.08,
                astroCx,
                astroCy,
                astroFov,
                0
              );
              if (s === 0) ctx.moveTo(projOut.sx, projOut.sy);
              else ctx.lineTo(projOut.sx, projOut.sy);
            }
            ctx.stroke();
            ctx.restore();
          }

          // 8 Cardinal & Diagonal Degree Tick Nodes along each ring
          ctx.fillStyle = r === 0 ? "#F4F5F8" : "#9DB8FB";
          for (let d = 0; d < 8; d++) {
            const a = (d / 8) * Math.PI * 2;
            ringOrbitPoint3DInto(ringRad, spec.yOff, spec.pitch, spec.roll, a, 1);
            project3DInto(
              ringOut.x,
              ringOut.y,
              ringOut.z,
              ringYaw,
              0.08,
              astroCx,
              astroCy,
              astroFov,
              0
            );
            ctx.globalAlpha = (d % 2 === 0 ? 0.72 : 0.36) * vis * globalAlpha;
            ctx.beginPath();
            ctx.arc(projOut.sx, projOut.sy, d % 2 === 0 ? 2.1 : 1.3, 0, Math.PI * 2);
            ctx.fill();
          }
        }

        // Pillar 03 Backend: Pulsing Radial Data Spokes
        const backendWeight = Math.max(0, 1 - Math.abs(astroPillar - 2));
        if (backendWeight > 0.08) {
          for (let k = 0; k < 6; k++) {
            const ang = (k / 6) * Math.PI * 2 + astroYawBase * 0.5 + timeSec * 0.25;
            const spokeR = astroR * 0.94 * burstScale;
            ringOrbitPoint3DInto(spokeR, 0, 0.72, (k % 3 - 1) * 1.05, ang, 1);
            project3DInto(
              ringOut.x,
              ringOut.y,
              ringOut.z,
              astroYawBase,
              0.08,
              astroCx,
              astroCy,
              astroFov,
              0
            );
            ctx.strokeStyle = "rgba(157,184,251,0.34)";
            ctx.lineWidth = 0.9;
            ctx.globalAlpha = backendWeight * vis * globalAlpha;
            ctx.beginPath();
            ctx.moveTo(astroCx, astroCy);
            ctx.lineTo(projOut.sx, projOut.sy);
            ctx.stroke();

            const pulseFrac = (timeSec * 0.7 + k * 0.17) % 1;
            ctx.fillStyle = "#F4F5F8";
            ctx.globalAlpha = backendWeight * 0.85 * vis * globalAlpha;
            ctx.beginPath();
            ctx.arc(
              astroCx + (projOut.sx - astroCx) * pulseFrac,
              astroCy + (projOut.sy - astroCy) * pulseFrac,
              2.2,
              0,
              Math.PI * 2
            );
            ctx.fill();
          }
        }

        // Pillar 04 Database: Vertical Glowing Meridian Connectors linking the 3 Saturn Tiers
        const dbWeight = clamp01(astroPillar - 2);
        if (dbWeight > 0.08) {
          for (let m = 0; m < 4; m++) {
            const a = (m / 4) * Math.PI * 2 + astroYawBase;
            ringOrbitPoint3DInto(
              astroRingsScratch[0].rMult * astroR * burstScale,
              astroRingsScratch[0].yOff,
              astroRingsScratch[0].pitch,
              0,
              a,
              1
            );
            project3DInto(
              ringOut.x,
              ringOut.y,
              ringOut.z,
              astroYawBase,
              0.08,
              astroCx,
              astroCy,
              astroFov,
              0
            );
            const topX = projOut.sx;
            const topY = projOut.sy;

            ringOrbitPoint3DInto(
              astroRingsScratch[2].rMult * astroR * burstScale,
              astroRingsScratch[2].yOff,
              astroRingsScratch[2].pitch,
              0,
              a,
              1
            );
            project3DInto(
              ringOut.x,
              ringOut.y,
              ringOut.z,
              astroYawBase,
              0.08,
              astroCx,
              astroCy,
              astroFov,
              0
            );

            ctx.save();
            ctx.strokeStyle = "#9DB8FB";
            ctx.lineWidth = 1.05;
            ctx.setLineDash([4, 6]);
            ctx.globalAlpha = dbWeight * 0.58 * vis * globalAlpha;
            ctx.beginPath();
            ctx.moveTo(topX, topY);
            ctx.lineTo(projOut.sx, projOut.sy);
            ctx.stroke();
            ctx.restore();
          }
        }

        // Central Pulsing Gravitational Astrolabe Core
        const corePulse = 1 + Math.sin(timeSec * 2.6) * 0.08 + astroBurst * 0.65;
        ctx.fillStyle = "#2F6BF2";
        ctx.globalAlpha = 0.14 * vis * globalAlpha;
        ctx.beginPath();
        ctx.arc(astroCx, astroCy, 30 * corePulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#2F6BF2";
        ctx.globalAlpha = 0.34 * vis * globalAlpha;
        ctx.beginPath();
        ctx.arc(astroCx, astroCy, 13 * corePulse, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#E0462E";
        ctx.globalAlpha = Math.min(1, (0.75 + astroBurst * 0.25) * vis * globalAlpha);
        ctx.beginPath();
        ctx.arc(astroCx, astroCy, 5.2 + astroBurst * 3, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = "#F4F5F8";
        ctx.globalAlpha = 0.92 * vis * globalAlpha;
        ctx.beginPath();
        ctx.arc(astroCx, astroCy, 2.2, 0, Math.PI * 2);
        ctx.fill();

        // Live Hover Laser Tether & Rotating Reticle from Core -> Hovered Orbiting Satellite
        const hover = astrolabeHoverRef?.current;
        if (hover && hover.active && af > 0.35 && !isMobile) {
          const midX = (astroCx + hover.x) * 0.5;
          const midY = (astroCy + hover.y) * 0.5 - 32;
          const beamColor = hover.color || "#2F6BF2";

          ctx.save();
          ctx.strokeStyle = beamColor;
          ctx.lineWidth = 1.6;
          ctx.setLineDash([5, 6]);
          ctx.lineDashOffset = -timeSec * 36;
          ctx.globalAlpha = 0.78 * af * globalAlpha;
          ctx.beginPath();
          ctx.moveTo(astroCx, astroCy);
          ctx.quadraticCurveTo(midX, midY, hover.x, hover.y);
          ctx.stroke();
          ctx.setLineDash([]);

          // Travelling light pulse along quadratic tether
          const tPulse = (timeSec * 1.45) % 1;
          const invT = 1 - tPulse;
          const bx = invT * invT * astroCx + 2 * invT * tPulse * midX + tPulse * tPulse * hover.x;
          const by = invT * invT * astroCy + 2 * invT * tPulse * midY + tPulse * tPulse * hover.y;
          ctx.fillStyle = "#F4F5F8";
          ctx.globalAlpha = 0.95 * af * globalAlpha;
          ctx.beginPath();
          ctx.arc(bx, by, 2.8, 0, Math.PI * 2);
          ctx.fill();

          // Precision Rotating Target Reticle around hovered orbiting satellite
          ctx.translate(hover.x, hover.y);
          ctx.rotate(timeSec * 1.15);
          ctx.strokeStyle = beamColor;
          ctx.lineWidth = 1.4;
          ctx.setLineDash([12, 8]);
          ctx.globalAlpha = 0.72 * af * globalAlpha;
          ctx.beginPath();
          ctx.arc(0, 0, 38, 0, Math.PI * 2);
          ctx.stroke();
          ctx.restore();
        }
      }

      // 5. Delicate 3D Orbital Guide Rings (fade with intro & dim cleanly under Astrolabe)
      ctx.lineWidth = 1;
      for (let rIdx = 0; rIdx < RING_CONFIGS.length; rIdx++) {
        const cfg = RING_CONFIGS[rIdx];
        const ringRadius = Math.min(width, height * 1.48) * cfg.rScale;
        ctx.strokeStyle = rIdx === 1 ? "rgba(157,184,251,0.10)" : "rgba(47,107,242,0.13)";
        ctx.globalAlpha = globalAlpha * ringReveal * (1 - af * 0.55);
        ctx.beginPath();
        const segs = 64;
        for (let s = 0; s <= segs; s++) {
          const a = (s / segs) * Math.PI * 2;
          ringOrbitPoint3DInto(ringRadius, 0, cfg.tiltX, cfg.tiltZ, a, expandMult);
          project3DInto(ringOut.x, ringOut.y, ringOut.z, camYaw, camPitch, cx, cy, fov, camZOffset);
          if (s === 0) ctx.moveTo(projOut.sx, projOut.sy);
          else ctx.lineTo(projOut.sx, projOut.sy);
        }
        ctx.stroke();
      }

      // 6. 185 True-3D Perspective Orbital Meteors (110 lock onto rotating Astrolabe Gimbals in Scene 2!)
      ctx.lineCap = "round";

      for (let i = 0; i < meteors.length; i++) {
        const m = meteors[i];
        if (!reducedMotion) {
          m.angle += m.angularSpeed * dtSec * speedMult;
        }

        const dir = m.angularSpeed >= 0 ? 1 : -1;
        const mRadius = m.radius + m.radialOffset;
        ringOrbitPoint3DInto(mRadius, m.yOffset, m.tiltX, m.tiltZ, m.angle, expandMult);
        project3DInto(ringOut.x, ringOut.y, ringOut.z, camYaw, camPitch, cx, cy, fov, camZOffset);

        const orbitHeadX = projOut.sx;
        const orbitHeadY = projOut.sy;
        const orbitScale = projOut.scale;

        if (orbitScale > 4.2 && (!m.isAstroMember || af < 0.25)) continue;

        let baseHeadX = orbitHeadX;
        let baseHeadY = orbitHeadY;
        const morphAlpha = m.isAstroMember ? af : 0;
        const ringSpec = astroRingsScratch[m.astroRingIdx];
        const astroRingRad = astroR * ringSpec.rMult * burstScale;
        const astroRingYaw = astroYawBase + timeSec * ringSpec.speed * 0.18;
        const astroHeadAngle = m.angle * 0.78 + timeSec * ringSpec.speed * 0.35;

        if (morphAlpha > 0.005) {
          ringOrbitPoint3DInto(
            astroRingRad,
            ringSpec.yOff,
            ringSpec.pitch,
            ringSpec.roll,
            astroHeadAngle,
            1
          );
          project3DInto(
            ringOut.x,
            ringOut.y,
            ringOut.z,
            astroRingYaw,
            0.08,
            astroCx,
            astroCy,
            astroFov,
            0
          );
          baseHeadX = orbitHeadX + (projOut.sx - orbitHeadX) * morphAlpha;
          baseHeadY = orbitHeadY + (projOut.sy - orbitHeadY) * morphAlpha;
        }

        const liveX = baseHeadX + m.dispX;
        const liveY = baseHeadY + m.dispY;

        // Smooth Per-Meteor Fluid Hover Deflection around cursor
        if (pointerActive) {
          const dx = liveX - mx;
          const dy = liveY - my;
          const distSq = dx * dx + dy * dy;
          if (distSq < hoverRadSq && distSq > 1) {
            const dist = Math.sqrt(distSq);
            const strength = Math.pow(1 - dist / hoverRadius, 1.5);
            const nx = dx / dist;
            const ny = dy / dist;
            m.vx += (nx * 2.5 - ny * 1.1 * dir) * strength * dtNorm;
            m.vy += (ny * 2.5 + nx * 1.1 * dir) * strength * dtNorm;
          }
        }

        // Physical Shockwave Ripple impulse
        for (let p = 0; p < pulses.length; p++) {
          const pulse = pulses[p];
          const dx = liveX - pulse.x;
          const dy = liveY - pulse.y;
          const dist = Math.hypot(dx, dy);
          const band = Math.abs(dist - pulse.radius);
          if (band < 52 && dist > 1) {
            const waveForce = (1 - band / 52) * pulse.alpha * 7.2;
            m.vx += (dx / dist) * waveForce * dtNorm;
            m.vy += (dy / dist) * waveForce * dtNorm;
          }
        }

        // Elastic spring back
        m.vx += -m.dispX * 0.068 * dtNorm;
        m.vy += -m.dispY * 0.068 * dtNorm;
        m.vx *= Math.pow(0.86, dtNorm);
        m.vy *= Math.pow(0.86, dtNorm);
        m.dispX += m.vx * dtNorm;
        m.dispY += m.vy * dtNorm;

        const clampedScale = Math.min(
          2.2,
          Math.max(0.52, orbitScale * (1 - morphAlpha) + morphAlpha * 1.05)
        );
        const depthAlpha = Math.max(0.16, Math.min(1, (clampedScale - 0.48) * 1.38));
        const trailSpan = m.tailLen * (1 + warpFactor * 1.45);

        ptsX[0] = baseHeadX + m.dispX;
        ptsY[0] = baseHeadY + m.dispY;

        for (let step = 1; step <= 4; step++) {
          const frac = step * 0.25;
          const a = m.angle - dir * trailSpan * frac;
          ringOrbitPoint3DInto(mRadius, m.yOffset, m.tiltX, m.tiltZ, a, expandMult);
          project3DInto(
            ringOut.x,
            ringOut.y,
            ringOut.z,
            camYaw,
            camPitch,
            cx,
            cy,
            fov,
            camZOffset
          );
          let segX = projOut.sx;
          let segY = projOut.sy;

          if (morphAlpha > 0.005) {
            const aa = astroHeadAngle - dir * trailSpan * 0.9 * frac;
            ringOrbitPoint3DInto(
              astroRingRad,
              ringSpec.yOff,
              ringSpec.pitch,
              ringSpec.roll,
              aa,
              1
            );
            project3DInto(
              ringOut.x,
              ringOut.y,
              ringOut.z,
              astroRingYaw,
              0.08,
              astroCx,
              astroCy,
              astroFov,
              0
            );
            segX = segX + (projOut.sx - segX) * morphAlpha;
            segY = segY + (projOut.sy - segY) * morphAlpha;
          }

          const bendWeight = Math.pow(1 - frac, 1.3);
          ptsX[step] = segX + m.dispX * bendWeight;
          ptsY[step] = segY + m.dispY * bendWeight;
        }

        const baseStrokeW = Math.max(
          0.75,
          m.baseWidth * clampedScale * (1 + warpFactor * 0.4)
        );

        // Pass 1: Tapered vibrant mid/rear meteor tail (segments 1..4)
        ctx.strokeStyle = m.isComet ? "#E0462E" : m.color;
        ctx.lineWidth = baseStrokeW * 0.72;
        ctx.globalAlpha = depthAlpha * (m.isComet ? 0.8 : 0.62) * globalAlpha;
        ctx.beginPath();
        ctx.moveTo(ptsX[1], ptsY[1]);
        ctx.lineTo(ptsX[2], ptsY[2]);
        ctx.lineTo(ptsX[3], ptsY[3]);
        ctx.lineTo(ptsX[4], ptsY[4]);
        ctx.stroke();

        // Pass 2: Incandescent leading head segment (segments 0..1)
        ctx.strokeStyle = m.isComet ? "#FF7B63" : "#F4F5F8";
        ctx.lineWidth = baseStrokeW * 1.1;
        ctx.globalAlpha = depthAlpha * (m.isComet ? 0.98 : 0.88) * globalAlpha;
        ctx.beginPath();
        ctx.moveTo(ptsX[0], ptsY[0]);
        ctx.lineTo(ptsX[1], ptsY[1]);
        ctx.stroke();

        if (m.isComet || clampedScale > 0.96 || morphAlpha > 0.55) {
          const headR = Math.max(1.2, baseStrokeW * 0.72);
          ctx.fillStyle = m.isComet ? "#E0462E" : "#2F6BF2";
          ctx.globalAlpha = depthAlpha * 0.28 * globalAlpha;
          ctx.beginPath();
          ctx.arc(ptsX[0], ptsY[0], headR * 3.0, 0, Math.PI * 2);
          ctx.fill();

          ctx.fillStyle = m.isComet ? "#FFD7CE" : "#F4F5F8";
          ctx.globalAlpha = Math.min(1, depthAlpha * 0.95 * globalAlpha);
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
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      pointerRef.current.active = true;
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    const handleClick = (e: MouseEvent) => {
      if (pausedRef.current || !activeRef.current || reducedMotion) return;
      pushShockwave(e.clientX, e.clientY, Math.min(width, height) * 0.56, 0.72, "#2F6BF2");
      spawnRadialSparks(e.clientX, e.clientY, 12, 2.5);
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
  }, [
    introCinemaRef,
    cosmosStageRef,
    cosmosExitRef,
    astrolabeFormRef,
    astrolabePillarRef,
    astrolabeBurstRef,
    astrolabeSpinRef,
    astrolabeHoverRef,
    astrolabePulseRef,
  ]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none absolute inset-0 h-full w-full overflow-hidden ${className}`}
    >
      <canvas ref={canvasRef} className="block h-full w-full" />
    </div>
  );
}
