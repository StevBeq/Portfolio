"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import {
  TECH_STACK_CARDS,
  TechStackLogo,
  type TechStackCardMeta,
} from "@/components/ui/TechStackIcons";
import type {
  AstrolabeHoverState,
  AstrolabePulseState,
} from "@/components/canvas/HeroInkExplosionCanvas";

export interface CapabilityPillar {
  id: string;
  index: string;
  eyebrow: string;
  pillLabel: string;
  titleBold: string;
  titleItalic: string;
  summary: string;
  primaryIds: readonly string[];
  satelliteIds: readonly string[];
  principles: readonly string[];
}

export interface TechInspectorMeta {
  pillarIndex: 0 | 1 | 2 | 3;
  role: string;
  detail: string;
  projectContext: string;
  accent: string;
}

export const CAPABILITY_PILLARS: CapabilityPillar[] = [
  {
    id: "web",
    index: "01",
    eyebrow: "WEB PLATFORMS",
    pillLabel: "01 Web",
    titleBold: "Web",
    titleItalic: "Development",
    summary:
      "Fullstack SSR platforms, modular design systems, and 60fps choreographed motion built for the modern web.",
    primaryIds: ["nextjs", "react"],
    satelliteIds: ["typescript", "vue", "vite", "tailwind"],
    principles: [
      "App Router server components & edge-ready routing",
      "Strict TypeScript contracts across UI & API layers",
      "GPU-disciplined ScrollTrigger motion systems",
    ],
  },
  {
    id: "mobile",
    index: "02",
    eyebrow: "MOBILE ENGINEERING",
    pillLabel: "02 Mobile",
    titleBold: "Mobile",
    titleItalic: "Apps",
    summary:
      "Native-feel Flutter applications engineered with custom widgets, clean state flows, and cross-platform parity.",
    primaryIds: ["flutter", "dart"],
    satelliteIds: ["firebase"],
    principles: [
      "60fps custom sliver & gesture-driven mobile interfaces",
      "Predictable reactive state cleanly isolated from UI",
      "Offline caching synced cleanly with realtime cloud APIs",
    ],
  },
  {
    id: "backend",
    index: "03",
    eyebrow: "BACKEND & APIS",
    pillLabel: "03 Backend",
    titleBold: "Backend",
    titleItalic: "& APIs",
    summary:
      "Pragmatic RESTful services, role-based operational workflows, and structured enterprise automation.",
    primaryIds: ["laravel", "php"],
    satelliteIds: ["python", "git"],
    principles: [
      "Clean MVC service boundaries & validated JSON contracts",
      "Role-based access workflows tailored for clinical/enterprise ops",
      "Reproducible Git workflows, scripting & Vercel delivery",
    ],
  },
  {
    id: "database",
    index: "04",
    eyebrow: "DATABASE & CLOUD",
    pillLabel: "04 Data",
    titleBold: "Database",
    titleItalic: "& Cloud",
    summary:
      "Normalized relational schemas, indexed SQL pipelines, and managed auth/storage powering every release.",
    primaryIds: ["postgresql", "supabase"],
    satelliteIds: ["mysql", "firebase"],
    principles: [
      "Third-normal-form relational modeling before writing endpoints",
      "Targeted SQL indexing & low-latency relational joins",
      "Managed Postgres auth, storage buckets & push pipelines",
    ],
  },
];

export const TECH_INSPECTOR_DATA: Record<string, TechInspectorMeta> = {
  nextjs: {
    pillarIndex: 0,
    role: "Fullstack SSR Framework",
    detail:
      "Primary web architecture engine powering App Router layouts, static optimization, and Vercel deployments.",
    projectContext: "Proof-Of-Grudge · StevBeq Portfolio",
    accent: "#F4F5F8",
  },
  react: {
    pillarIndex: 0,
    role: "Component & Canvas UI Runtime",
    detail:
      "Declarative interface composition paired seamlessly with imperative 60fps GSAP and Canvas 2D refs.",
    projectContext: "Proof-Of-Grudge · Schedule Flow KRS",
    accent: "#61DAFB",
  },
  typescript: {
    pillarIndex: 0,
    role: "End-to-End Type Safety",
    detail:
      "Strict static interfaces unifying component contracts, chain signatures, and API payloads.",
    projectContext: "Proof-Of-Grudge · near-polygraph",
    accent: "#3178C6",
  },
  vue: {
    pillarIndex: 0,
    role: "Reactive Web Tooling UI",
    detail:
      "Single-file component interfaces built for crisp developer dashboards and interactive course planners.",
    projectContext: "Schedule Flow KRS",
    accent: "#41B883",
  },
  vite: {
    pillarIndex: 0,
    role: "Fast Module Bundler",
    detail:
      "Instant ESM dev server and lean production builds powering Vue & experimental frontend tools.",
    projectContext: "Schedule Flow KRS",
    accent: "#FFD028",
  },
  tailwind: {
    pillarIndex: 0,
    role: "Design-Token Utility System",
    detail:
      "Precision editorial spacing, responsive grids, and monochrome-plus-cobalt tokens without CSS bloat.",
    projectContext: "All Web Platforms",
    accent: "#38BDF8",
  },
  flutter: {
    pillarIndex: 1,
    role: "Cross-Platform Mobile UI",
    detail:
      "Single-codebase iOS & Android applications delivering tactile custom scroll physics and native smoothness.",
    projectContext: "KwakTodo Mobile App",
    accent: "#54C5F8",
  },
  dart: {
    pillarIndex: 1,
    role: "Typed Mobile Core Language",
    detail:
      "Sound null-safe domain models and fast AOT-compiled reactive logic behind every Flutter widget tree.",
    projectContext: "KwakTodo Mobile App",
    accent: "#29B6F6",
  },
  firebase: {
    pillarIndex: 1,
    role: "Mobile Auth & Realtime Sync",
    detail:
      "Instant mobile synchronization, authentication flows, and cloud-backed task persistence.",
    projectContext: "KwakTodo Mobile App",
    accent: "#FFCA28",
  },
  laravel: {
    pillarIndex: 2,
    role: "Enterprise Backend Framework",
    detail:
      "Structured Eloquent models, migrations, and REST APIs driving healthcare and institutional operations.",
    projectContext: "PT. Indo Techno Medic Case Study",
    accent: "#FF2D20",
  },
  php: {
    pillarIndex: 2,
    role: "Server-Side Core Runtime",
    detail:
      "Dependable request handling, business rule validation, and tight integration with relational databases.",
    projectContext: "PT. Indo Techno Medic Case Study",
    accent: "#9DB8FB",
  },
  python: {
    pillarIndex: 2,
    role: "Automation & Data Scripting",
    detail:
      "Pragmatic data-processing scripts, algorithmic utilities, and rapid backend prototyping.",
    projectContext: "StevBeq Lab & Tooling",
    accent: "#FFD43B",
  },
  git: {
    pillarIndex: 2,
    role: "Version Control & Release Flow",
    detail:
      "Disciplined branching, clean commit scopes, and automated production pushes wired into Vercel.",
    projectContext: "All Repositories",
    accent: "#F05032",
  },
  postgresql: {
    pillarIndex: 3,
    role: "Primary Relational Engine",
    detail:
      "Strict foreign-key schemas, transactional integrity, and tuned SQL queries for multi-module apps.",
    projectContext: "PT. Indo Techno Medic · Web Systems",
    accent: "#60A5FA",
  },
  supabase: {
    pillarIndex: 3,
    role: "Managed Postgres & Auth Stack",
    detail:
      "Postgres row-level security, instant REST/realtime subscriptions, and storage without server ops overhead.",
    projectContext: "StevBeq Lab & Tooling",
    accent: "#3ECF8E",
  },
  mysql: {
    pillarIndex: 3,
    role: "Transactional SQL Database",
    detail:
      "High-reliability enterprise tables and indexed operational reporting paired cleanly with Laravel.",
    projectContext: "PT. Indo Techno Medic Case Study",
    accent: "#F29111",
  },
};

// Outer 10 + Inner 6 elliptical points centered on right Astrolabe (0.69, 0.50) for Section 2 -> 3 shatter origin
export const ORBITAL_STACK_ORIGINS: ReadonlyArray<readonly [number, number]> = [
  ...Array.from({ length: 10 }, (_, idx) => {
    const a = (idx / 10) * Math.PI * 2 - Math.PI * 0.4;
    return [
      Number((0.69 + Math.cos(a) * 0.19).toFixed(3)),
      Number((0.5 + Math.sin(a) * 0.31).toFixed(3)),
    ] as const;
  }),
  ...Array.from({ length: 6 }, (_, idx) => {
    const a = (idx / 6) * Math.PI * 2 + 0.35;
    return [
      Number((0.69 + Math.cos(a) * 0.118).toFixed(3)),
      Number((0.5 + Math.sin(a) * 0.192).toFixed(3)),
    ] as const;
  }),
];

const TECH_BY_ID: Record<string, TechStackCardMeta> = Object.fromEntries(
  TECH_STACK_CARDS.map((card) => [card.id, card])
);

const SHELL_PRESETS: ReadonlyArray<{
  outerPitch: number;
  outerRoll: number;
  innerPitch: number;
  innerRoll: number;
}> = [
  { outerPitch: 0.38, outerRoll: -0.18, innerPitch: -0.24, innerRoll: 0.26 },
  { outerPitch: 0.16, outerRoll: 1.42, innerPitch: 0.2, innerRoll: -1.26 },
  { outerPitch: 0.72, outerRoll: 0.0, innerPitch: 0.72, innerRoll: 1.05 },
  { outerPitch: 1.16, outerRoll: 0.0, innerPitch: 1.16, innerRoll: 0.0 },
];

interface FluidTechStackLayerProps {
  activePillar: number;
  pillarProgressRef: React.RefObject<number>;
  astrolabeSpinRef: React.RefObject<number>;
  astrolabeHoverRef: React.RefObject<AstrolabeHoverState>;
  astrolabePulseRef: React.RefObject<AstrolabePulseState>;
  onSelectPillar?: (index: number) => void;
}

export function FluidTechStackLayer({
  activePillar,
  pillarProgressRef,
  astrolabeSpinRef,
  astrolabeHoverRef,
  astrolabePulseRef,
  onSelectPillar,
}: FluidTechStackLayerProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const orreryStageRef = useRef<HTMLDivElement | null>(null);
  const nodeRefs = useRef<Array<HTMLDivElement | null>>([]);
  const progressBarRef = useRef<HTMLDivElement | null>(null);
  const progressDotRef = useRef<HTMLSpanElement | null>(null);

  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [pinnedId, setPinnedId] = useState<string | null>(null);

  const hoveredIdRef = useRef<string | null>(null);
  const pinnedIdRef = useRef<string | null>(null);
  const isDraggingRef = useRef(false);
  const dragMovedRef = useRef(false);
  const dragStartXRef = useRef(0);
  const lastDragXRef = useRef(0);
  const spinVelRef = useRef(0);
  const speedFactorRef = useRef(1);
  const autoAngleRef = useRef(0);
  const lastTickTimeRef = useRef<number | null>(null);
  const satScreenCoordsRef = useRef<Array<{ x: number; y: number }>>(
    TECH_STACK_CARDS.map(() => ({ x: 0, y: 0 }))
  );

  useEffect(() => {
    hoveredIdRef.current = hoveredId;
  }, [hoveredId]);

  useEffect(() => {
    pinnedIdRef.current = pinnedId;
  }, [pinnedId]);

  const clampedIdx = Math.max(0, Math.min(CAPABILITY_PILLARS.length - 1, activePillar));
  const pillar = CAPABILITY_PILLARS[clampedIdx];
  const inspectId = hoveredId ?? pinnedId;
  const inspectTech = inspectId ? TECH_BY_ID[inspectId] : null;
  const inspectMeta = inspectId ? TECH_INSPECTOR_DATA[inspectId] : null;

  const pillarTechIds = [...pillar.primaryIds, ...pillar.satelliteIds];

  // Clear pinned selection gently when user scrolls across to a different pillar
  useEffect(() => {
    if (pinnedId && TECH_INSPECTOR_DATA[pinnedId]?.pillarIndex !== clampedIdx) {
      setPinnedId(null);
    }
  }, [clampedIdx, pinnedId]);

  // Drag-to-spin & 60fps 3D satellite projection synced pixel-for-pixel with HeroInkExplosionCanvas Astrolabe
  useEffect(() => {
    const container = containerRef.current;
    const orreryStage = orreryStageRef.current;
    if (!container) return;

    const reducedMotion = prefersReducedMotion();

    const handleWindowPointerMove = (e: PointerEvent) => {
      if (!isDraggingRef.current) return;
      if (Math.abs(e.clientX - dragStartXRef.current) > 5) {
        dragMovedRef.current = true;
      }
      const dx = e.clientX - lastDragXRef.current;
      lastDragXRef.current = e.clientX;
      const deltaAngle = dx * 0.0055;
      if (astrolabeSpinRef.current !== undefined) {
        astrolabeSpinRef.current += deltaAngle;
      }
      spinVelRef.current = deltaAngle;
    };

    const handleWindowPointerUp = () => {
      isDraggingRef.current = false;
      setTimeout(() => {
        dragMovedRef.current = false;
      }, 0);
    };

    window.addEventListener("pointermove", handleWindowPointerMove, { passive: true });
    window.addEventListener("pointerup", handleWindowPointerUp, { passive: true });

    const tick = (timeSec: number) => {
      const containerOpacity = parseFloat(
        container.style.opacity || getComputedStyle(container).opacity
      );
      if (Number.isFinite(containerOpacity) && containerOpacity < 0.04) {
        if (astrolabeHoverRef.current?.active) {
          astrolabeHoverRef.current.active = false;
        }
        if (hoveredIdRef.current !== null) {
          hoveredIdRef.current = null;
          setHoveredId(null);
        }
        return;
      }

      const prevTime = lastTickTimeRef.current ?? timeSec;
      const dtSec = Math.min(0.05, Math.max(0.001, timeSec - prevTime));
      lastTickTimeRef.current = timeSec;

      // Inertia decay from drag-to-spin
      if (!isDraggingRef.current && Math.abs(spinVelRef.current) > 0.00005) {
        spinVelRef.current *= 0.94;
        if (astrolabeSpinRef.current !== undefined) {
          astrolabeSpinRef.current += spinVelRef.current;
        }
      }

      // Smoothly slow down orbital rotation when user hovers a satellite
      const targetSpeed = hoveredIdRef.current ? 0.16 : 1;
      speedFactorRef.current += (targetSpeed - speedFactorRef.current) * 0.1;
      if (!reducedMotion) {
        autoAngleRef.current += dtSec * 0.24 * speedFactorRef.current;
      }

      const prog = Math.max(
        0,
        Math.min(CAPABILITY_PILLARS.length - 1, pillarProgressRef.current ?? 0)
      );

      const railFrac = Math.max(0.02, prog / (CAPABILITY_PILLARS.length - 1));
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = `scaleX(${railFrac.toFixed(4)})`;
      }
      if (progressDotRef.current) {
        progressDotRef.current.style.left = `${((prog / (CAPABILITY_PILLARS.length - 1)) * 100).toFixed(2)}%`;
      }

      if (!orreryStage || window.innerWidth < 768) return;

      const cRect = container.getBoundingClientRect();
      const oRect = orreryStage.getBoundingClientRect();
      const vpW = cRect.width || window.innerWidth;
      const vpH = cRect.height || window.innerHeight;
      const astroScreenX = cRect.left + vpW * 0.69;
      const astroScreenY = cRect.top + vpH * 0.5;
      const localCx = astroScreenX - oRect.left;
      const localCy = astroScreenY - oRect.top;

      const astroR = Math.min(vpW * 0.19, vpH * 0.34);
      const astroFov = Math.max(540, astroR * 2.8);

      const pLow = Math.min(3, Math.floor(prog));
      const pHigh = Math.min(3, Math.ceil(prog));
      const pFrac = prog - pLow;
      const pSmooth = pFrac * pFrac * (3 - 2 * pFrac);
      const sA = SHELL_PRESETS[pLow];
      const sB = SHELL_PRESETS[pHigh];

      const outerPitch = sA.outerPitch + (sB.outerPitch - sA.outerPitch) * pSmooth;
      const outerRoll = sA.outerRoll + (sB.outerRoll - sA.outerRoll) * pSmooth;
      const innerPitch = sA.innerPitch + (sB.innerPitch - sA.innerPitch) * pSmooth;
      const innerRoll = sA.innerRoll + (sB.innerRoll - sA.innerRoll) * pSmooth;
      const userSpin = astrolabeSpinRef.current ?? 0;

      let activeHoverMatched = false;
      const activeTargetId = hoveredIdRef.current ?? pinnedIdRef.current;

      for (let i = 0; i < TECH_STACK_CARDS.length; i++) {
        const el = nodeRefs.current[i];
        const card = TECH_STACK_CARDS[i];
        const meta = TECH_INSPECTOR_DATA[card.id];
        if (!el || !meta) continue;

        const isOuter = i < 10;
        const shellCount = isOuter ? 10 : 6;
        const shellIdx = isOuter ? i : i - 10;
        const baseA = (shellIdx / shellCount) * Math.PI * 2 + (isOuter ? 0 : 0.5);
        const ang =
          baseA + (isOuter ? autoAngleRef.current : -autoAngleRef.current * 1.32) + userSpin;

        const r = isOuter ? astroR * 1.08 : astroR * 0.72;
        const pitch = isOuter ? outerPitch : innerPitch;
        const roll = isOuter ? outerRoll : innerRoll;
        const yOff =
          prog > 2 ? (i % 3 === 0 ? -0.22 : i % 3 === 1 ? 0.22 : 0) * astroR * (prog - 2) : 0;

        // 3D ring position matching HeroInkExplosionCanvas ringOrbitPoint3DInto
        const lx = Math.cos(ang) * r;
        const lz = Math.sin(ang) * r;
        const cosTX = Math.cos(pitch);
        const sinTX = Math.sin(pitch);
        const y1 = yOff * cosTX - lz * sinTX;
        const z1 = yOff * sinTX + lz * cosTX;

        const cosTZ = Math.cos(roll);
        const sinTZ = Math.sin(roll);
        const x2 = lx * cosTZ - y1 * sinTZ;
        const y2 = lx * sinTZ + y1 * cosTZ;

        const depthScale = astroFov / Math.max(220, astroFov + z1);
        const projX = x2 * depthScale;
        const projY = y2 * depthScale;

        const screenX = astroScreenX + projX;
        const screenY = astroScreenY + projY;
        satScreenCoordsRef.current[i].x = screenX;
        satScreenCoordsRef.current[i].y = screenY;

        const isFocused = card.id === activeTargetId;
        const matchWeight = Math.max(0, 1 - Math.abs(meta.pillarIndex - prog));

        const finalScale =
          (0.66 + matchWeight * 0.36) * depthScale * (isFocused ? 1.18 : 1);
        const baseAlpha = 0.34 + matchWeight * 0.66;
        const depthAlpha = Math.max(0.42, Math.min(1, 0.75 + (depthScale - 1) * 0.85));
        const finalOpacity = isFocused ? 1 : baseAlpha * depthAlpha;
        const zIdx = isFocused ? 60 : Math.round(depthScale * 24 + matchWeight * 16);

        el.style.transform = `translate3d(${(localCx + projX).toFixed(2)}px, ${(
          localCy + projY
        ).toFixed(2)}px, 0) translate(-50%, -50%) scale(${finalScale.toFixed(3)})`;
        el.style.opacity = finalOpacity.toFixed(3);
        el.style.zIndex = String(zIdx);

        if (isFocused && astrolabeHoverRef.current) {
          astrolabeHoverRef.current.active = true;
          astrolabeHoverRef.current.x = screenX;
          astrolabeHoverRef.current.y = screenY;
          astrolabeHoverRef.current.color = meta.accent || "#2F6BF2";
          activeHoverMatched = true;
        }
      }

      if (!activeHoverMatched && astrolabeHoverRef.current) {
        astrolabeHoverRef.current.active = false;
      }
    };

    gsap.ticker.add(tick);
    tick(0);

    return () => {
      gsap.ticker.remove(tick);
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerup", handleWindowPointerUp);
    };
  }, [pillarProgressRef, astrolabeSpinRef, astrolabeHoverRef]);

  const handleOrreryPointerDown = (e: React.PointerEvent<HTMLDivElement>) => {
    isDraggingRef.current = true;
    dragMovedRef.current = false;
    dragStartXRef.current = e.clientX;
    lastDragXRef.current = e.clientX;
    spinVelRef.current = 0;
  };

  const handleSatelliteClick = (idx: number, tech: TechStackCardMeta) => {
    if (dragMovedRef.current) return;
    const coord = satScreenCoordsRef.current[idx];
    if (astrolabePulseRef.current && coord) {
      astrolabePulseRef.current.x = coord.x;
      astrolabePulseRef.current.y = coord.y;
      astrolabePulseRef.current.tick += 1;
    }
    setPinnedId((prev) => (prev === tech.id ? null : tech.id));
    const meta = TECH_INSPECTOR_DATA[tech.id];
    if (meta && meta.pillarIndex !== clampedIdx) {
      onSelectPillar?.(meta.pillarIndex);
    }
  };

  return (
    <div
      ref={containerRef}
      className="tech-cards-stage pointer-events-none absolute inset-0 z-20 opacity-0"
    >
      {/* Left Architectural Panel & Interactive Tech Node Dossier */}
      <div className="mx-auto flex h-full w-full max-w-7xl items-center px-6 pt-16 pb-10 sm:px-10">
        <div className="scene2-editorial pointer-events-none relative z-30 w-full max-w-xl opacity-0 md:w-[43%]">
          {/* Subtle Giant Sculptural Numeral Backdrop */}
          <span
            aria-hidden
            className="font-unbounded pointer-events-none absolute -top-10 -left-4 -z-10 select-none text-[8rem] font-black leading-none tracking-tighter lg:text-[10.5rem]"
            style={{
              WebkitTextStroke: "1px rgba(157,184,251,0.12)",
              color: "transparent",
            }}
          >
            {pillar.index}
          </span>

          <div className="inline-flex items-center gap-2 font-mono text-[11px] font-semibold tracking-[0.22em] text-[#9DB8FB] uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E0462E]" />
            <span>
              {pillar.index} / 04 · {pillar.eyebrow}
            </span>
          </div>

          <div key={pillar.id} className="l2-tab-enter mt-2.5">
            <h2 className="font-display text-4xl font-extrabold leading-[1.03] tracking-tight text-[#F4F5F8] sm:text-5xl lg:text-[3.35rem]">
              {pillar.titleBold}{" "}
              <span className="font-serif-italic font-normal text-[#2F6BF2]">
                {pillar.titleItalic}
              </span>
              .
            </h2>

            <p className="mt-3 max-w-md text-sm leading-relaxed text-[#94A3B8] sm:text-[15px]">
              {pillar.summary}
            </p>
          </div>

          {/* Dual-Mode Architectural Readout: Live Tech Node Dossier OR 3 Numbered Principles */}
          <div className="mt-5 min-h-[205px] border-t border-white/10 pt-4">
            {inspectTech && inspectMeta ? (
              <div
                key={inspectTech.id}
                className="l2-tab-enter rounded-2xl border border-[#2F6BF2]/45 bg-[#0B1326]/80 p-4 backdrop-blur-xl shadow-[0_14px_40px_rgba(47,107,242,0.18)]"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-white/15 bg-[#101B36]">
                      <TechStackLogo id={inspectTech.id} className="h-7 w-7" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h3 className="font-display text-lg font-bold leading-tight text-[#F4F5F8]">
                          {inspectTech.name}
                        </h3>
                        <span className="rounded-full border border-white/15 bg-white/[0.05] px-2 py-0.5 font-mono text-[9px] tracking-wider text-[#9DB8FB] uppercase">
                          {inspectTech.category}
                        </span>
                      </div>
                      <p className="mt-0.5 font-mono text-[10px] tracking-wider text-white/60 uppercase">
                        {inspectMeta.role}
                      </p>
                    </div>
                  </div>

                  {pinnedId === inspectTech.id && (
                    <button
                      type="button"
                      onClick={() => setPinnedId(null)}
                      aria-label="Clear selected tech dossier"
                      className="cursor-pointer rounded-md border border-white/10 px-2 py-0.5 font-mono text-[10px] text-white/60 transition hover:border-white/30 hover:text-white"
                    >
                      ×
                    </button>
                  )}
                </div>

                <p className="mt-3 text-xs leading-relaxed text-[#C7D8FC]/90 sm:text-[13px]">
                  {inspectMeta.detail}
                </p>

                <div className="mt-3 flex items-center gap-2 border-t border-white/10 pt-2.5 font-mono text-[10px] tracking-wider text-[#9DB8FB] uppercase">
                  <span className="h-1.5 w-1.5 rounded-full bg-[#E0462E]" />
                  <span>SHIPPED IN · {inspectMeta.projectContext}</span>
                </div>
              </div>
            ) : (
              <div>
                <div className="space-y-2.5">
                  {pillar.principles.map((line, pIdx) => (
                    <div
                      key={line}
                      className="flex items-baseline gap-3 border-b border-white/[0.06] pb-2 last:border-b-0 last:pb-0"
                    >
                      <span className="font-mono text-[10px] font-bold tracking-widest text-[#2F6BF2]">
                        0{pIdx + 1}
                      </span>
                      <span className="text-xs leading-snug text-white/80 sm:text-[13px]">
                        {line}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="mt-3.5 flex flex-wrap gap-1.5">
                  {pillarTechIds.map((id) => {
                    const card = TECH_BY_ID[id];
                    if (!card) return null;
                    return (
                      <button
                        key={id}
                        type="button"
                        onMouseEnter={() => setHoveredId(id)}
                        onMouseLeave={() => setHoveredId((cur) => (cur === id ? null : cur))}
                        onClick={() => setPinnedId(id)}
                        className="inline-flex cursor-pointer items-center gap-1.5 rounded-full border border-white/[0.12] bg-[#0B1326]/70 px-2.5 py-1 font-mono text-[10px] font-medium text-[#C7D8FC] transition hover:border-[#2F6BF2]/75 hover:bg-[#132244] hover:text-white"
                      >
                        <TechStackLogo id={id} className="h-3.5 w-3.5" />
                        <span>{card.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* Architectural Hairline Scrubber Rail */}
          <div className="mt-5 max-w-md">
            <div className="relative h-px w-full bg-white/15">
              <div
                ref={progressBarRef}
                className="h-[2px] -top-[0.5px] w-full origin-left bg-[#2F6BF2]"
                style={{ transform: "scaleX(0.02)" }}
              />
              <span
                ref={progressDotRef}
                className="absolute top-1/2 h-2 w-2 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#E0462E] shadow-[0_0_10px_#E0462E]"
                style={{ left: "0%" }}
              />
            </div>

            <div className="mt-3 flex items-center justify-between gap-2">
              {CAPABILITY_PILLARS.map((item, idx) => {
                const isActive = idx === clampedIdx;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => {
                      setPinnedId(null);
                      onSelectPillar?.(idx);
                    }}
                    className={`cursor-pointer border-b pb-1 font-mono text-[10px] tracking-[0.16em] uppercase transition-colors duration-75 ${
                      isActive
                        ? "border-[#2F6BF2] font-bold text-[#F4F5F8]"
                        : "border-transparent text-white/45 hover:text-white/80"
                    }`}
                  >
                    {item.pillLabel}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Mobile: Tap-to-Inspect Tech Strip */}
          <div className="mt-5 flex items-center gap-2 overflow-x-auto pb-1 md:hidden">
            {pillarTechIds.map((id) => {
              const tech = TECH_BY_ID[id];
              if (!tech) return null;
              const selected = pinnedId === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setPinnedId((prev) => (prev === id ? null : id))}
                  className={`flex h-14 w-14 shrink-0 cursor-pointer flex-col items-center justify-center rounded-2xl border p-1 backdrop-blur-md transition ${
                    selected
                      ? "border-[#2F6BF2] bg-[#132244]/90"
                      : "border-white/[0.12] bg-[#0B1326]/78"
                  }`}
                >
                  <TechStackLogo id={tech.id} className="h-5 w-5" />
                  <span className="mt-1 truncate font-mono text-[8px] font-semibold text-white/85">
                    {tech.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Desktop Right Stage: Interactive 3D Orbiting 16-Satellite Orrery synced with Astrolabe Canvas */}
      <div
        ref={orreryStageRef}
        onPointerDown={handleOrreryPointerDown}
        className="orrery-stage pointer-events-none absolute inset-y-0 right-0 left-[44%] hidden cursor-grab active:cursor-grabbing md:block"
      >
        {TECH_STACK_CARDS.map((tech, idx) => {
          const meta = TECH_INSPECTOR_DATA[tech.id];
          const isMatched = meta?.pillarIndex === clampedIdx;
          const isFocused = hoveredId === tech.id || pinnedId === tech.id;
          return (
            <div
              key={tech.id}
              ref={(el) => {
                nodeRefs.current[idx] = el;
              }}
              className="absolute top-0 left-0"
            >
              <button
                type="button"
                onMouseEnter={() => setHoveredId(tech.id)}
                onMouseLeave={() => setHoveredId((cur) => (cur === tech.id ? null : cur))}
                onClick={() => handleSatelliteClick(idx, tech)}
                title={`${tech.name} — ${meta?.role ?? tech.category}`}
                className={`tech-card-converge flex h-[62px] w-[62px] cursor-pointer flex-col items-center justify-center rounded-[18px] border p-1.5 backdrop-blur-xl transition-colors duration-200 lg:h-[68px] lg:w-[68px] ${
                  isFocused
                    ? "border-[#2F6BF2] bg-[#132244]/92 shadow-[0_0_28px_rgba(47,107,242,0.52)]"
                    : isMatched
                    ? "border-[#2F6BF2]/55 bg-[#0B1326]/86 shadow-[0_12px_30px_rgba(0,0,0,0.52)]"
                    : "border-white/[0.10] bg-[#0B1326]/65 hover:border-[#2F6BF2]/75"
                }`}
              >
                <TechStackLogo id={tech.id} className="h-6 w-6 lg:h-7 lg:w-7" />
                <span className="mt-1 truncate font-mono text-[8px] font-semibold tracking-tight text-white/85">
                  {tech.name}
                </span>
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
