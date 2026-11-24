"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  gsap,
  ScrollTrigger,
  isLowEndDevice,
  prefersReducedMotion,
  useGSAP,
} from "@/lib/gsap";
import { STEVBEQ_PROFILE } from "@/data/stevbeq";
import { usePortfolioLayer } from "@/components/providers/SmoothScrollProvider";
import {
  HeroInkExplosionCanvas,
  type AstrolabeHoverState,
  type AstrolabePulseState,
  type IntroCinemaState,
} from "@/components/canvas/HeroInkExplosionCanvas";
import {
  AsciiParticlePortrait,
  type PortraitRenderMode,
} from "@/components/canvas/AsciiParticlePortrait";
import {
  CAPABILITY_PILLARS,
  FluidTechStackLayer,
} from "@/components/layer1/FluidTechStackLayer";

const clamp01 = (v: number) => Math.max(0, Math.min(1, v));

function computePillarProgress(t: number): number {
  const seg = (start: number, end: number) => {
    const p = clamp01((t - start) / (end - start));
    return p * p * (3 - 2 * p);
  };
  if (t <= 0.42) return 0;
  if (t < 0.54) return seg(0.42, 0.54);
  if (t <= 0.7) return 1;
  if (t < 0.82) return 1 + seg(0.7, 0.82);
  if (t <= 0.98) return 2;
  if (t < 1.1) return 2 + seg(0.98, 1.1);
  return 3;
}

// Skip opening cinema shutter when returning from Layer 2 so wake-up is instant
let hasCompletedOpeningLoader = false;

interface NarrativeSegment {
  text: string;
  accent?: boolean;
}

const PROFILE_SEGMENTS: NarrativeSegment[] = [
  { text: "Steven Arnaldo Setiawan — a " },
  { text: "Fullstack Web & Mobile Developer", accent: true },
  { text: " based in Yogyakarta. Crafting fast, scalable web platforms with " },
  { text: "React, Next.js, and Laravel", accent: true },
  { text: " alongside native-feel " },
  { text: "Flutter", accent: true },
  { text: " apps — engineered cleanly from relational schema to final motion." },
];

type NarrativeToken =
  | { kind: "space"; id: string }
  | { kind: "word"; id: string; chars: string[]; accent: boolean };

function buildNarrativeTokens(): NarrativeToken[] {
  const tokens: NarrativeToken[] = [];
  let seq = 0;
  for (const seg of PROFILE_SEGMENTS) {
    const parts = seg.text.split(/(\s+)/);
    for (const part of parts) {
      if (!part) continue;
      if (/^\s+$/.test(part)) {
        tokens.push({ kind: "space", id: `sp-${seq++}` });
      } else {
        tokens.push({
          kind: "word",
          id: `wd-${seq++}`,
          chars: Array.from(part),
          accent: Boolean(seg.accent),
        });
      }
    }
  }
  return tokens;
}

const TOTAL_TL = 3.48;
const PILLAR_JUMP_TIMES = [0.33, 0.62, 0.9, 1.19] as const;

export function HeroOpeningSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const preloaderRef = useRef<HTMLDivElement | null>(null);
  const loaderCounterRef = useRef<HTMLSpanElement | null>(null);
  const heroStageRef = useRef<HTMLDivElement | null>(null);
  const monogramZoomRef = useRef<HTMLDivElement | null>(null);
  const lightStageRef = useRef<HTMLDivElement | null>(null);

  // Zero-rerender mutable refs driving 60fps opening space cinema, 3D Astrolabe & ASCII swarm
  const introCinemaRef = useRef<IntroCinemaState>({
    progress: hasCompletedOpeningLoader ? 1 : 0,
    detonateTick: 0,
  });
  const cosmosStageRef = useRef<number>(0);
  const cosmosExitRef = useRef<number>(0);
  const astrolabeFormRef = useRef<number>(0);
  const astrolabePillarRef = useRef<number>(0);
  const astrolabeBurstRef = useRef<number>(0);
  const astrolabeSpinRef = useRef<number>(0);
  const astrolabeHoverRef = useRef<AstrolabeHoverState>({
    active: false,
    x: 0,
    y: 0,
    color: "#2F6BF2",
  });
  const astrolabePulseRef = useRef<AstrolabePulseState>({
    tick: 0,
    x: 0,
    y: 0,
  });
  const portraitAssemblyRef = useRef<number>(0);
  const portraitShiftRef = useRef<number>(0);
  const monogramMorphRef = useRef<number>(0);

  const [preloaderDone, setPreloaderDone] = useState(hasCompletedOpeningLoader);
  const [heroCosmosPaused, setHeroCosmosPaused] = useState(false);
  const [activePillar, setActivePillar] = useState(0);
  const [swarmActive, setSwarmActive] = useState(false);
  const [portraitMode, setPortraitMode] = useState<PortraitRenderMode>("ascii");
  const [wibTime, setWibTime] = useState("12:00:00");

  const narrativeTokens = useMemo(() => buildNarrativeTokens(), []);
  const { scrollToSection, scrollToPosition } = usePortfolioLayer();

  // Live Yogyakarta (UTC+7) clock
  useEffect(() => {
    const updateClock = () => {
      try {
        const formatted = new Intl.DateTimeFormat("en-GB", {
          timeZone: "Asia/Jakarta",
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
          hour12: false,
        }).format(new Date());
        setWibTime(formatted);
      } catch {
        setWibTime("UTC+7");
      }
    };
    updateClock();
    const timer = setInterval(updateClock, 1000);
    return () => clearInterval(timer);
  }, []);

  useGSAP(
    () => {
      const reducedMotion = prefersReducedMotion();
      const lowEnd = isLowEndDevice();

      if (reducedMotion || lowEnd) {
        portraitAssemblyRef.current = 1;
        setPortraitMode("hybrid");
      }

      /* =====================================================================
       * 1. CINEMATIC 4.5s OPENING FILM (Distant Nebula -> Implosion -> Fly-Through -> Hero)
       * =================================================================== */
      if (!hasCompletedOpeningLoader && preloaderRef.current) {
        if (reducedMotion) {
          introCinemaRef.current.progress = 1;
          gsap.set(".hero-display-wrap, .hero-chrome-enter", { opacity: 1, y: 0, scale: 1 });
          gsap.to(preloaderRef.current, {
            opacity: 0,
            duration: 0.4,
            ease: "power1.out",
            onComplete: () => {
              hasCompletedOpeningLoader = true;
              setPreloaderDone(true);
            },
          });
        } else {
          gsap.set(".hero-mask-rise", { yPercent: 112 });
          gsap.set(".hero-chrome-enter", { opacity: 0, y: 10 });
          gsap.set(".hero-display-wrap", { scale: 0.96, opacity: 0 });

          const counterProxy = { val: 0 };

          const loaderTl = gsap.timeline({
            onComplete: () => {
              hasCompletedOpeningLoader = true;
              setPreloaderDone(true);
            },
          });

          loaderTl
            // Act I (0.00 -> 1.45): Distant Nebula Awakening + Razor Laser Charge 000 -> 100
            .to(
              counterProxy,
              {
                val: 100,
                duration: 1.45,
                ease: "power2.inOut",
                onUpdate: () => {
                  if (loaderCounterRef.current) {
                    loaderCounterRef.current.textContent = String(
                      Math.round(counterProxy.val)
                    ).padStart(3, "0");
                  }
                },
              },
              0
            )
            .to(
              introCinemaRef.current,
              { progress: 0.34, duration: 1.45, ease: "power1.inOut" },
              0
            )
            .fromTo(
              ".loader-laser-line",
              { scaleX: 0, transformOrigin: "0% 50%" },
              { scaleX: 1, duration: 1.45, ease: "power2.inOut" },
              0
            )
            .fromTo(
              ".loader-laser-tip",
              { left: "0%", opacity: 1 },
              { left: "100%", opacity: 1, duration: 1.45, ease: "power2.inOut" },
              0
            )
            .fromTo(
              ".loader-ghost-word",
              { scale: 0.94, opacity: 0.06 },
              { scale: 1.02, opacity: 0.26, duration: 1.45, ease: "power2.inOut" },
              0
            )

            // Act II (1.45 -> 1.92): Gravitational Implosion into Blazing Singularity
            .to(
              ".loader-laser-tip",
              { opacity: 0, scale: 0.2, duration: 0.16, ease: "power2.out" },
              1.45
            )
            .to(
              ".loader-meta-strip",
              { opacity: 0, y: -8, duration: 0.24, ease: "power2.inOut" },
              1.45
            )
            .to(
              ".loader-ghost-word",
              { scale: 0.88, opacity: 0, duration: 0.32, ease: "power3.in" },
              1.45
            )
            .set(".loader-laser-line", { transformOrigin: "50% 50%" }, 1.45)
            .to(
              ".loader-laser-line",
              { scaleX: 0.008, opacity: 0, duration: 0.42, ease: "power3.in" },
              1.45
            )
            .to(
              introCinemaRef.current,
              { progress: 0.45, duration: 0.47, ease: "power2.in" },
              1.45
            )

            // Act III (1.92 -> 3.65): Unobstructed Singularity Detonation & Deep-Space Fly-Through Film
            .call(
              () => {
                introCinemaRef.current.detonateTick += 1;
              },
              [],
              1.92
            )
            .to(
              introCinemaRef.current,
              { progress: 0.89, duration: 1.73, ease: "none" },
              1.92
            )

            // Act IV (3.65 -> 4.55): Hero Title & Chrome Arrival over Settled Orbit
            .to(
              introCinemaRef.current,
              { progress: 1, duration: 0.45, ease: "power1.out" },
              3.65
            )
            .to(
              ".hero-display-wrap",
              {
                scale: 1,
                opacity: 1,
                duration: 0.85,
                ease: "awwwardsExpo",
                clearProps: "transform",
              },
              3.65
            )
            .to(
              ".hero-mask-rise",
              {
                yPercent: 0,
                stagger: 0.09,
                duration: 0.85,
                ease: "awwwardsExpo",
              },
              3.65
            )
            .to(
              ".hero-chrome-enter",
              {
                y: 0,
                opacity: 1,
                duration: 0.55,
                ease: "liquidRise",
                clearProps: "transform",
              },
              3.95
            );
        }
      } else {
        introCinemaRef.current.progress = 1;
      }

      if (reducedMotion) return;

      /* =====================================================================
       * ONE-TAKE 3-POV UNIVERSE + INTERACTIVE ASTROLABE + SIDE-BY-SIDE ILLUMINATED PROFILE
       * Scene 1 (Hero 0.00 -> 0.24) ->
       * Scene 2 (Scroll-Locked 4-Pillar Capabilities + 3D Cosmic Astrolabe 0.24 -> 1.28) ->
       * Scene 3 (Astrolabe Bursts -> Portrait Showcase 1.48 -> 1.86 -> Slides Left + Right Bio 1.88 -> 2.66) ->
       * Scene 4 (SB Morph & Vector Z-Dive 2.70 -> 3.48) -> Cool Cloud #F4F5F8 Projects
       * =================================================================== */
      const monogramTargetScale = lowEnd ? 1.45 : 1.98;

      const perfTargets = [
        heroStageRef.current,
        monogramZoomRef.current,
        lightStageRef.current,
      ].filter(Boolean) as HTMLElement[];

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "hero-journey",
          trigger: sectionRef.current,
          start: "top top",
          end: "+=980%",
          pin: true,
          scrub: lowEnd ? 0.5 : 0.82,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            perfTargets.forEach((el) => el.classList.toggle("is-animating", self.isActive));
            if (!self.isActive) {
              setSwarmActive(false);
              astrolabeHoverRef.current.active = false;
            }
          },
          onUpdate: (self) => {
            const t = self.progress * TOTAL_TL;

            // Continuous 3-POV stage inside ONE universe
            let nextStage = 0;
            if (t <= 0.24) {
              nextStage = clamp01(t / 0.24);
            } else if (t < 1.28) {
              nextStage = 1;
            } else if (t <= 1.58) {
              nextStage = 1 + clamp01((t - 1.28) / 0.3);
            } else {
              nextStage = 2;
            }
            cosmosStageRef.current = nextStage;

            // 3D Cosmic Astrolabe morph (0.08..0.26 form, 0.26..1.28 hold, 1.28..1.50 dissolve into meteors)
            let nextAstroForm = 0;
            if (t >= 0.08 && t < 0.26) {
              nextAstroForm = clamp01((t - 0.08) / 0.18);
            } else if (t >= 0.26 && t <= 1.28) {
              nextAstroForm = 1;
            } else if (t > 1.28 && t <= 1.5) {
              nextAstroForm = 1 - clamp01((t - 1.28) / 0.22);
            }
            astrolabeFormRef.current = nextAstroForm;
            astrolabeBurstRef.current = Math.sin(clamp01((t - 1.26) / 0.24) * Math.PI);

            if (t < 0.14 || t > 1.26) {
              astrolabeHoverRef.current.active = false;
            }

            const nextPillarProg = computePillarProgress(t);
            astrolabePillarRef.current = nextPillarProg;
            const roundedPillar = Math.round(nextPillarProg);
            setActivePillar((prev) => (prev === roundedPillar ? prev : roundedPillar));

            // Fullscreen ASCII Swarm active between Scene 2->3 unravel (1.26) and SB takeover (2.98)
            const inSwarm = t >= 1.26 && t <= 2.98;
            setSwarmActive((prev) => (prev === inSwarm ? prev : inSwarm));

            // Astrolabe Orrery -> Face Fullscreen Magnetic Vortex Gather (1.30 -> 1.60)
            portraitAssemblyRef.current = lowEnd ? 1 : clamp01((t - 1.3) / 0.3);

            // Editorial Side-by-Side Shift: Face glides left before right-side bio enters (1.88 -> 2.06)
            portraitShiftRef.current = clamp01((t - 1.88) / 0.18);

            // Shifted Face -> Swirl -> Centered Giant SB Monogram Morph (2.70 -> 2.92)
            monogramMorphRef.current = clamp01((t - 2.7) / 0.22);

            if (!lowEnd) {
              const nextMode: PortraitRenderMode =
                t >= 2.68
                  ? "ascii"
                  : t >= 1.64
                  ? "photo"
                  : t >= 1.54
                  ? "hybrid"
                  : "ascii";
              setPortraitMode((prev) => (prev === nextMode ? prev : nextMode));
            }

            // Fade cosmos cleanly ONLY when Cool Cloud daylight iris expands
            cosmosExitRef.current = clamp01((t - 3.06) / 0.2);
            const shouldPauseCosmos = t > 3.28;
            setHeroCosmosPaused((prev) => (prev === shouldPauseCosmos ? prev : shouldPauseCosmos));
          },
        },
      });

      /* -------- PHASE 1 (0.00 -> 0.28): FLY INSIDE COSMOS -> SCROLL-LOCKED CAPABILITIES & ASTROLABE -------- */
      tl.to(
        sectionRef.current,
        { backgroundColor: "#0D1524", duration: 0.24, ease: "liquidFlow" },
        0.04
      )
        .fromTo(
          ".hero-top-header",
          { opacity: 1, y: 0 },
          { opacity: 0, y: -22, duration: 0.14, ease: "liquidFlow", immediateRender: false },
          0
        )
        .fromTo(
          ".hero-bottom-footer",
          { opacity: 1, y: 0 },
          { opacity: 0, y: 22, duration: 0.14, ease: "liquidFlow", immediateRender: false },
          0
        )
        .fromTo(
          ".hero-display-line-1",
          { opacity: 1, xPercent: 0, scale: 1 },
          {
            opacity: 0,
            xPercent: -10,
            scale: 1.12,
            duration: 0.18,
            ease: "liquidFlow",
            immediateRender: false,
          },
          0.01
        )
        .fromTo(
          ".hero-display-line-2",
          { opacity: 1, xPercent: 0, scale: 1 },
          {
            opacity: 0,
            xPercent: 10,
            scale: 1.12,
            duration: 0.18,
            ease: "liquidFlow",
            immediateRender: false,
          },
          0.01
        )
        .to(
          ".hero-stage-shell",
          { opacity: 0, pointerEvents: "none", duration: 0.18, ease: "liquidFlow" },
          0.08
        )
        .fromTo(
          ".scene2-chrome",
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.14, ease: "liquidFlow" },
          0.15
        )
        .fromTo(
          ".tech-cards-stage",
          { opacity: 0, scale: 0.94 },
          { opacity: 1, scale: 1, duration: 0.15, ease: "liquidRise" },
          0.15
        )
        .fromTo(
          ".scene2-editorial",
          { opacity: 0, y: 24, pointerEvents: "none" },
          { opacity: 1, y: 0, pointerEvents: "auto", duration: 0.16, ease: "liquidRise" },
          0.16
        )
        .fromTo(
          ".orrery-stage",
          { pointerEvents: "none" },
          { pointerEvents: "auto", duration: 0.01 },
          0.16
        )
        .fromTo(
          ".tech-card-converge",
          { opacity: 0, scale: 0.84 },
          { opacity: 1, scale: 1, stagger: 0.008, duration: 0.13, ease: "liquidRise" },
          0.16
        )

        /* -------- PHASE 2 (1.26 -> 1.44): ASTROLABE BURST + ORBITAL DISSOLVE -> PORTRAIT SWARM -------- */
        .fromTo(
          ".scene3-fullscreen-swarm",
          { opacity: 0 },
          { opacity: 1, duration: 0.1, ease: "liquidFlow" },
          1.26
        )
        .to(
          ".scene2-chrome",
          { opacity: 0, y: -14, duration: 0.11, ease: "liquidFlow" },
          1.26
        )
        .to(
          ".scene2-editorial",
          { opacity: 0, y: -22, pointerEvents: "none", duration: 0.12, ease: "liquidFlow" },
          1.26
        )
        .to(
          ".orrery-stage",
          { pointerEvents: "none", duration: 0.01 },
          1.26
        )
        .to(
          ".tech-card-converge",
          {
            scale: 1.14,
            opacity: 0,
            stagger: 0.006,
            duration: 0.11,
            ease: "liquidFlow",
          },
          1.28
        )
        .to(
          ".tech-cards-stage",
          { opacity: 0, pointerEvents: "none", duration: 0.12, ease: "liquidFlow" },
          1.3
        )

        /* -------- PHASE 3 BEAT A (1.48 -> 1.84): MONUMENTAL CENTERED PORTRAIT SHOWCASE -------- */
        .fromTo(
          ".scene3-chrome",
          { opacity: 0 },
          { opacity: 1, duration: 0.12, ease: "liquidFlow" },
          1.48
        )
        .fromTo(
          ".scene3-intro-meta",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.04, duration: 0.16, ease: "liquidRise" },
          1.54
        )
        .fromTo(
          ".scene3-wordmark",
          { y: 26, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.04, duration: 0.18, ease: "liquidRise" },
          1.58
        )

        /* -------- PHASE 3 BEAT B (1.86 -> 2.04): PORTRAIT GLIDES LEFT -> RIGHT EDITORIAL VEIL -------- */
        .to(
          ".scene3-wordmark, .scene3-intro-meta",
          { y: 14, opacity: 0, duration: 0.12, ease: "liquidFlow" },
          1.86
        )
        .fromTo(
          ".scene3-narrative-veil",
          { opacity: 0 },
          { opacity: 1, duration: 0.15, ease: "liquidFlow" },
          1.88
        )

        /* -------- PHASE 3 BEAT C (2.02 -> 2.64): SIDE-BY-SIDE RIGHT WHITE ILLUMINATION -------- */
        .fromTo(
          ".scene3-narrative-wrap",
          { opacity: 0 },
          { opacity: 1, duration: 0.08, ease: "liquidFlow" },
          2.02
        )
        .fromTo(
          ".profile-char",
          { opacity: 0.14, y: 5 },
          {
            opacity: 1,
            y: 0,
            stagger: 0.0022,
            duration: 0.03,
            ease: "none",
          },
          2.04
        )
        .fromTo(
          ".scene3-narrative-foot",
          { y: 12, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.1, ease: "liquidRise" },
          2.52
        )

        /* -------- PHASE 4 (2.64 -> 2.98): LEFT PORTRAIT -> SWIRL -> GIANT SB MONOGRAM -------- */
        .to(
          ".scene3-narrative-wrap, .scene3-narrative-veil, .scene3-chrome",
          { opacity: 0, duration: 0.1, ease: "liquidFlow" },
          2.64
        )
        .fromTo(
          ".portal-entry-hud",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.14, ease: "liquidFlow" },
          2.74
        )
        .fromTo(
          ".outlined-name-bg",
          { scale: 0.86, opacity: 0, letterSpacing: "0.14em" },
          { scale: 1, opacity: 1, letterSpacing: "-0.04em", duration: 0.16, ease: "liquidFlow" },
          2.74
        )
        .fromTo(
          monogramZoomRef.current,
          { scale: 0.36, opacity: 0 },
          { scale: 0.36, opacity: 1, duration: 0.08, ease: "liquidFlow" },
          2.86
        )
        .to(
          ".scene3-fullscreen-swarm",
          { opacity: 0, duration: 0.08, ease: "liquidFlow" },
          2.88
        )

        /* -------- PHASE 5 (2.96 -> 3.48): VECTOR SB Z-DIVE -> LIQUID IRIS -> COOL CLOUD #F4F5F8 -------- */
        .to(
          ".portal-entry-hud",
          { opacity: 0, y: -12, duration: 0.12, ease: "liquidFlow" },
          2.96
        )
        .to(
          ".outlined-name-bg",
          { scale: 1.55, opacity: 0, duration: 0.24, ease: "liquidFlow" },
          2.96
        )
        .to(
          monogramZoomRef.current,
          { scale: monogramTargetScale, duration: 0.3, ease: "liquidFlow" },
          2.96
        )
        .to(
          monogramZoomRef.current,
          { opacity: 0, duration: 0.1, ease: "liquidFlow" },
          3.18
        )
        .fromTo(
          ".portal-iris-ring",
          { scale: 0.05, opacity: 0 },
          { scale: 1.7, opacity: 0.88, duration: 0.28, ease: "liquidFlow" },
          3.04
        )
        .to(".portal-iris-ring", { opacity: 0, duration: 0.1, ease: "liquidFlow" }, 3.26)
        .fromTo(
          lightStageRef.current,
          { clipPath: "circle(0% at 50% 50%)" },
          { clipPath: "circle(130% at 50% 50%)", duration: 0.3, ease: "liquidFlow" },
          3.06
        )
        .fromTo(
          ".portal-reveal-line",
          { y: 30, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            stagger: 0.04,
            duration: 0.16,
            ease: "liquidRise",
          },
          3.2
        )
        .fromTo(
          ".portal-editorial-meta",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.03, duration: 0.14, ease: "liquidRise" },
          3.28
        )
        .fromTo(
          ".portal-drift-bg",
          { yPercent: 5 },
          { yPercent: -5, duration: 0.32, ease: "none" },
          3.16
        )
        .fromTo(
          ".portal-drift-mid",
          { yPercent: 8 },
          { yPercent: -10, duration: 0.32, ease: "none" },
          3.16
        )
        .fromTo(
          ".portal-drift-fg",
          { yPercent: 6 },
          { yPercent: -10, duration: 0.32, ease: "none" },
          3.16
        )
        .to({}, { duration: 0.001 }, TOTAL_TL - 0.001);
    },
    { scope: sectionRef }
  );

  const scrollToJourneyStage = (fraction: number) => {
    const st = ScrollTrigger.getById("hero-journey");
    if (!st) return;
    scrollToPosition(st.start + (st.end - st.start) * fraction);
  };

  const handleSelectPillar = (index: number) => {
    const targetTime = PILLAR_JUMP_TIMES[index] ?? PILLAR_JUMP_TIMES[0];
    scrollToJourneyStage(targetTime / TOTAL_TL);
  };

  return (
    <section
      id="hero-opening"
      ref={sectionRef}
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-[#0B0D12] text-[#F4F5F8] select-none"
    >
      {/* ================= 1. TRANSPARENT LASER CHARGE OVERLAY -> 4.5s SPACE FILM ================= */}
      {!preloaderDone && (
        <div
          ref={preloaderRef}
          className="fixed inset-0 z-[90] overflow-hidden pointer-events-none"
        >
          {/* Faint Ghost Watermark collapsing cleanly into Singularity */}
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <span
              className="loader-ghost-word font-unbounded block text-[15.5vw] font-black leading-none tracking-tighter uppercase"
              style={{
                WebkitTextStroke: "1.5px rgba(199,216,252,0.28)",
                color: "transparent",
              }}
            >
              STEVBEQ
            </span>
          </div>

          {/* Razor-Sharp Horizontal Royal Blue Laser Seam */}
          <div className="absolute top-1/2 right-0 left-0 z-20 -translate-y-1/2">
            <div className="h-px w-full bg-white/[0.06]" />
            <div
              className="loader-laser-line absolute top-0 left-0 h-[2px] w-full origin-left"
              style={{
                background:
                  "linear-gradient(90deg, rgba(47,107,242,0.25) 0%, var(--thread) 75%, #F4F5F8 100%)",
                transform: "scaleX(0)",
              }}
            />
            <div
              className="loader-laser-tip absolute top-1/2 h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#F4F5F8] shadow-[0_0_24px_6px_rgba(47,107,242,0.95)]"
              style={{ left: "0%" }}
            />
          </div>

          {/* Minimalist Precision Readout along the Horizon */}
          <div className="loader-meta-strip absolute inset-x-0 top-1/2 z-30 mx-auto flex max-w-7xl -translate-y-9 items-center justify-between px-6 font-mono text-[11px] tracking-[0.26em] text-white/60 uppercase sm:px-10">
            <span className="inline-flex items-center gap-2">
              <span className="h-1.5 w-1.5 rounded-full bg-[#E0462E]" />
              STEVEN ARNALDO · PORTFOLIO
            </span>
            <span ref={loaderCounterRef} className="font-bold text-[#9DB8FB]">
              000
            </span>
          </div>
        </div>
      )}

      {/* ================= CLEAN QUIET ATMOSPHERIC DEPTH ================= */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 68% 54% at 50% 48%, rgba(47,107,242,0.14) 0%, rgba(13,21,36,0.4) 52%, transparent 100%)",
        }}
      />

      {/* ================= SHARED 3-POV UNIVERSE + OPENING FILM + 3D ASTROLABE ================= */}
      <HeroInkExplosionCanvas
        active={true}
        paused={heroCosmosPaused}
        introCinemaRef={introCinemaRef}
        cosmosStageRef={cosmosStageRef}
        cosmosExitRef={cosmosExitRef}
        astrolabeFormRef={astrolabeFormRef}
        astrolabePillarRef={astrolabePillarRef}
        astrolabeBurstRef={astrolabeBurstRef}
        astrolabeSpinRef={astrolabeSpinRef}
        astrolabeHoverRef={astrolabeHoverRef}
        astrolabePulseRef={astrolabePulseRef}
        className="z-10"
      />

      {/* ================= SCENE 1: INTERACTIVE 3D METEOR HERO ================= */}
      <div
        ref={heroStageRef}
        className="hero-stage-shell absolute inset-0 z-20 flex h-full w-full flex-col justify-between px-6 py-4 sm:px-10"
      >
        {/* Minimal Hairline Top Navigation */}
        <div className={`hero-chrome-enter shrink-0 ${preloaderDone ? "" : "opacity-0"}`}>
          <header className="hero-top-header pointer-events-auto relative z-20 mx-auto flex h-14 w-full max-w-7xl items-center justify-between border-b border-white/10 font-mono text-xs text-white/65">
            <div className="flex items-center gap-3">
              <img
                src="/assets/logo/LogoDark.webp"
                alt="StevBeq Brand Mark"
                className="h-8 w-8 rounded-lg border border-white/15 object-cover"
              />
              <span className="font-bold tracking-widest text-[#F4F5F8] uppercase">
                STEVBEQ
              </span>
            </div>

            <nav className="flex items-center gap-5 sm:gap-7">
              <button
                type="button"
                onClick={() => scrollToJourneyStage(0.33 / TOTAL_TL)}
                className="transition hover:text-white cursor-pointer"
              >
                STACK
              </button>
              <button
                type="button"
                onClick={() => scrollToJourneyStage(1.74 / TOTAL_TL)}
                className="transition hover:text-white cursor-pointer"
              >
                PROFILE
              </button>
              <button
                type="button"
                onClick={() => scrollToSection("#selected-projects")}
                className="transition hover:text-white cursor-pointer"
              >
                WORK
              </button>
              <a
                href={STEVBEQ_PROFILE.contact.github}
                target="_blank"
                rel="noreferrer"
                className="text-[#9DB8FB] transition hover:text-white"
              >
                GITHUB ↗
              </a>
            </nav>
          </header>
        </div>

        {/* Monumental Edge-to-Edge Editorial Display */}
        <div
          className={`hero-display-wrap pointer-events-none relative z-20 mx-auto my-auto flex w-full max-w-7xl flex-col items-center justify-center px-2 text-center ${
            preloaderDone ? "" : "opacity-0"
          }`}
        >
          <div className="hero-display-line-1 overflow-hidden py-1">
            <h1 className="hero-mask-rise font-display text-[15vw] font-extrabold leading-[0.86] tracking-[-0.04em] text-[#F4F5F8] uppercase drop-shadow-[0_14px_45px_rgba(11,13,18,0.85)] sm:text-[11.5vw] lg:text-[9.5rem]">
              STEVEN
            </h1>
          </div>

          <div className="hero-display-line-2 mt-1 flex flex-wrap items-baseline justify-center gap-x-5 gap-y-1 overflow-hidden py-1">
            <span className="hero-mask-rise font-display text-[15vw] font-extrabold leading-[0.88] tracking-[-0.04em] text-[#F4F5F8] uppercase drop-shadow-[0_14px_45px_rgba(11,13,18,0.85)] sm:text-[11.5vw] lg:text-[9.5rem]">
              ARNALDO
              <span className="text-[#E0462E]">.</span>
            </span>

            <span className="hero-mask-rise font-serif-italic text-2xl font-normal text-[#9DB8FB] drop-shadow-[0_6px_28px_rgba(11,13,18,0.9)] sm:text-4xl lg:text-5xl">
              fullstack web &amp; mobile.
            </span>
          </div>
        </div>

        {/* Clean Professional Bottom Telemetry */}
        <div className={`hero-chrome-enter shrink-0 ${preloaderDone ? "" : "opacity-0"}`}>
          <footer className="hero-bottom-footer relative z-20 mx-auto grid h-14 w-full max-w-7xl grid-cols-2 items-center gap-3 border-t border-white/10 font-mono text-[10px] text-white/50 sm:grid-cols-3 sm:text-[11px]">
            <div className="truncate">
              <span className="text-white/75">YOGYAKARTA · WIB {wibTime}</span>
            </div>
            <div className="hidden items-center justify-center gap-2 text-white/45 sm:flex">
              <span
                className="h-1.5 w-1.5 rounded-full"
                style={{ backgroundColor: "var(--thread)" }}
              />
              <span className="tracking-[0.22em] uppercase">FULLSTACK WEB &amp; MOBILE</span>
            </div>
            <div className="text-right">
              <span className="tracking-[0.2em] text-[#C7D8FC] uppercase">SCROLL ↓</span>
            </div>
          </footer>
        </div>
      </div>

      {/* ================= SCENE 2: SCROLL-LOCKED 4-PILLAR CAPABILITIES + 3D COSMIC ASTROLABE ================= */}
      <div className="scene2-chrome pointer-events-none absolute top-4 inset-x-0 z-20 mx-auto flex h-14 max-w-7xl items-center justify-between border-b border-white/10 px-6 font-mono text-[11px] tracking-widest text-white/50 uppercase opacity-0 sm:px-10">
        <span>02 // CAPABILITIES</span>
        <span className="text-[#9DB8FB]">
          {CAPABILITY_PILLARS[activePillar]?.index ?? "01"} / 04 ·{" "}
          {CAPABILITY_PILLARS[activePillar]?.eyebrow ?? "WEB PLATFORMS"}
        </span>
      </div>

      <FluidTechStackLayer
        activePillar={activePillar}
        pillarProgressRef={astrolabePillarRef}
        astrolabeSpinRef={astrolabeSpinRef}
        astrolabeHoverRef={astrolabeHoverRef}
        astrolabePulseRef={astrolabePulseRef}
        onSelectPillar={handleSelectPillar}
      />

      {/* ================= SCENE 3: CONTINUOUS UNIVERSE + SLIDE-LEFT PORTRAIT + SIDE-BY-SIDE BIO ================= */}
      <div className="scene3-fullscreen-swarm pointer-events-none absolute inset-0 z-[24] opacity-0">
        <AsciiParticlePortrait
          src="/assets/me/Foto-Semi-Formal.webp"
          defaultMode="ascii"
          controlledMode={portraitMode}
          assemblyRef={portraitAssemblyRef}
          portraitShiftRef={portraitShiftRef}
          monogramMorphRef={monogramMorphRef}
          cellSize={4}
          tintBlue={true}
          showModeToggle={false}
          paused={!swarmActive}
          className="h-full w-full"
        />
      </div>

      {/* Clean Timeless Top Chrome */}
      <div className="scene3-chrome pointer-events-none absolute inset-x-0 top-4 z-30 mx-auto flex h-14 max-w-7xl items-center justify-between border-b border-white/10 px-6 font-mono text-[11px] tracking-widest text-white/55 uppercase opacity-0 sm:px-10">
        <span>03 // PROFILE</span>
        <span className="hidden text-white/45 sm:inline">STEVEN ARNALDO SETIAWAN</span>
        <span>YOGYAKARTA, ID</span>
      </div>

      {/* Beat A Corner Whisper & Bottom Split STEV / BEQ Framing Portrait */}
      <div className="scene3-intro-meta pointer-events-none absolute top-24 left-6 z-30 opacity-0 sm:left-10">
        <p className="font-mono text-[10px] font-bold tracking-[0.22em] text-[#9DB8FB] uppercase">
          FULLSTACK WEB &amp; MOBILE
        </p>
        <p className="mt-1.5 max-w-[210px] text-xs leading-relaxed text-white/65">
          Crafting scalable web platforms &amp; cross-platform Flutter apps.
        </p>
      </div>

      <div className="pointer-events-none absolute inset-x-0 bottom-20 z-[25] mx-auto flex max-w-7xl items-end justify-between px-6 sm:px-10">
        <span className="scene3-wordmark font-unbounded text-5xl font-black leading-none tracking-tighter text-[#F4F5F8] opacity-0 sm:text-7xl lg:text-[6.5rem]">
          {STEVBEQ_PROFILE.handleSplit[0]}
        </span>
        <span
          className="scene3-wordmark font-unbounded text-5xl font-black leading-none tracking-tighter opacity-0 sm:text-7xl lg:text-[6.5rem]"
          style={{ color: "var(--thread)" }}
        >
          {STEVBEQ_PROFILE.handleSplit[1]}
        </span>
      </div>

      {/* Beat B: Responsive Directional Navy Veil — Keeps Left Portrait / Upper Portrait 100% Clear! */}
      <div aria-hidden className="scene3-narrative-veil pointer-events-none absolute inset-0 z-[26] opacity-0">
        <div
          className="hidden h-full w-full md:block"
          style={{
            background:
              "linear-gradient(90deg, rgba(13,21,36,0) 0%, rgba(13,21,36,0) 41%, rgba(9,17,38,0.68) 62%, rgba(9,17,38,0.84) 100%)",
          }}
        />
        <div
          className="h-full w-full md:hidden"
          style={{
            background:
              "linear-gradient(180deg, rgba(13,21,36,0) 0%, rgba(13,21,36,0) 40%, rgba(9,17,38,0.78) 60%, rgba(9,17,38,0.92) 100%)",
          }}
        />
      </div>

      {/* Beat C: Side-by-Side Right-Half Per-Character White Illumination Narrative */}
      <div className="scene3-narrative-wrap pointer-events-none absolute inset-0 z-30 mx-auto flex max-w-7xl items-end justify-center px-6 pb-24 opacity-0 md:items-center md:justify-end md:px-10 md:pb-0">
        <div className="w-full max-w-lg border-l-2 border-[#2F6BF2]/45 pl-4 text-left md:w-[50%] md:pl-7 lg:w-[48%]">
          <p className="mb-3 font-mono text-[10px] font-semibold tracking-[0.22em] text-[#9DB8FB] uppercase">
            03 / STEVEN ARNALDO · PROFILE
          </p>

          <p className="font-display text-xl font-bold leading-[1.32] tracking-tight sm:text-2xl lg:text-[1.95rem] xl:text-[2.15rem]">
            {narrativeTokens.map((tok) =>
              tok.kind === "space" ? (
                <React.Fragment key={tok.id}> </React.Fragment>
              ) : (
                <span
                  key={tok.id}
                  className={`inline-block whitespace-nowrap ${
                    tok.accent
                      ? "font-serif-italic font-normal text-[#9DB8FB]"
                      : "text-[#F4F5F8]"
                  }`}
                >
                  {tok.chars.map((ch, idx) => (
                    <span
                      key={`${tok.id}-${idx}`}
                      className="profile-char inline-block"
                    >
                      {ch}
                    </span>
                  ))}
                </span>
              )
            )}
          </p>

          <p className="scene3-narrative-foot mt-5 font-mono text-[10px] tracking-[0.2em] text-white/55 uppercase opacity-0 sm:text-[11px]">
            7°47&rsquo;S 110°22&rsquo;E · YOGYAKARTA · PT. INDO TECHNO MEDIC · UKDW &amp; UTY
          </p>
        </div>
      </div>

      {/* Scene 3 Clean Minimal Bottom Rail */}
      <div className="scene3-chrome pointer-events-none absolute inset-x-0 bottom-4 z-30 mx-auto flex h-14 max-w-7xl items-center justify-between border-t border-white/10 px-6 font-mono text-[10px] tracking-[0.2em] text-white/45 uppercase opacity-0 sm:px-10">
        <span>STEVBEQ · PORTFOLIO</span>
        <span>SCROLL TO CONTINUE ↓</span>
      </div>

      {/* ================= SCENE 4 (ONE-TAKE SEAMLESS PORTAL): SB MONOGRAM Z-DIVE -> COOL CLOUD #F4F5F8 ================= */}
      <div className="portal-entry-hud pointer-events-none absolute inset-x-0 top-4 z-30 mx-auto flex h-14 max-w-7xl items-center justify-between border-b border-white/10 px-6 font-mono text-[11px] tracking-widest text-white/45 uppercase opacity-0 sm:px-10">
        <span>04 // ARCHIVE</span>
        <span className="text-[#9DB8FB]">2024 — 2026</span>
      </div>

      {/* Outlined Giant STEVBEQ behind the particle-assembled SB Monogram */}
      <div className="outlined-name-bg pointer-events-none absolute inset-0 z-[22] flex flex-col items-center justify-center opacity-0">
        <span
          className="font-unbounded text-6xl font-black tracking-tight uppercase sm:text-[8.5rem] lg:text-[12rem]"
          style={{
            WebkitTextStroke: "1.5px rgba(199,216,252,0.22)",
            color: "transparent",
          }}
        >
          STEVBEQ
        </span>
      </div>

      {/* Razor-Sharp 560px Native Vector SB Monogram (1:1 handoff from ASCII particles!) */}
      <div className="pointer-events-none absolute inset-0 z-30 flex items-center justify-center">
        <div
          ref={monogramZoomRef}
          className="relative flex h-[480px] w-[480px] items-center justify-center opacity-0 sm:h-[560px] sm:w-[560px]"
          style={{ transform: "scale(0.36)" }}
        >
          <svg
            viewBox="0 0 560 560"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full"
            shapeRendering="geometricPrecision"
          >
            <circle
              cx="280"
              cy="280"
              r="242"
              stroke="rgba(157,184,251,0.22)"
              strokeWidth="2.2"
              strokeDasharray="10 14"
            />
            <rect
              x="76"
              y="228"
              width="172"
              height="52"
              rx="26"
              transform="rotate(-34 76 228)"
              fill="#F4F5F8"
            />
            <rect
              x="76"
              y="344"
              width="172"
              height="52"
              rx="26"
              transform="rotate(-34 76 344)"
              fill="#F4F5F8"
            />
            <path
              d="M276 142H374C417.63 142 453 177.37 453 221C453 245.88 441.51 268.08 423.54 282.55C441.51 297.02 453 319.22 453 344.1C453 387.73 417.63 423.1 374 423.1H276"
              stroke="#F4F5F8"
              strokeWidth="52"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="280" cy="280" r="34" fill="#E0462E" />
            <circle cx="280" cy="280" r="13" fill="#F4F5F8" />
          </svg>
        </div>
      </div>

      {/* Expanding Royal Bridge Blue Iris Ring */}
      <div
        className="portal-iris-ring pointer-events-none absolute top-1/2 left-1/2 z-[35] h-[85vmax] w-[85vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] opacity-0"
        style={{ borderColor: "var(--thread)" }}
      />

      {/* ================= COOL CLOUD (#F4F5F8) DAYLIGHT STAGE -> SEAMLESS INTO PROJECTS! ================= */}
      <div
        ref={lightStageRef}
        className="pointer-events-none absolute inset-0 z-40 flex flex-col justify-between overflow-hidden bg-[#F4F5F8] px-6 py-4 text-[#10131A] sm:px-10"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      >
        <div
          aria-hidden
          className="portal-drift-bg pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% 18%, rgba(157,184,251,0.34) 0%, rgba(199,216,252,0.18) 42%, rgba(244,245,248,0) 76%)",
          }}
        />

        <div
          aria-hidden
          className="portal-drift-bg pointer-events-none absolute inset-0 opacity-75"
          style={{
            backgroundImage: "radial-gradient(rgba(47,107,242,0.13) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#2F6BF2]/30 via-[#2F6BF2]/12 to-[#2F6BF2]/30"
        />

        <span
          aria-hidden
          className="portal-drift-mid font-display pointer-events-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-[20rem] font-extrabold leading-none tracking-tighter text-[#2F6BF2]/[0.055] sm:text-[30rem]"
        >
          04
        </span>

        {/* Balanced Light Top Chrome (h-14) */}
        <div className="relative z-20 mx-auto flex h-14 w-full max-w-7xl shrink-0 items-center justify-between border-b border-[#10131A]/[0.08] font-mono text-[11px] tracking-widest text-[#10131A]/50 uppercase">
          <span>04 // CURATED ARCHIVE</span>
          <span className="text-[#2F6BF2]">2024 — 2026</span>
        </div>

        {/* Centerpiece: SELECTED crafted WORKS */}
        <div className="portal-drift-fg relative z-30 mx-auto my-auto flex max-w-4xl flex-col items-center px-4 text-center">
          <div className="portal-reveal-line inline-flex items-center gap-2 rounded-full border border-[#10131A]/[0.08] bg-white/85 px-4 py-1.5 font-mono text-[11px] font-semibold tracking-[0.22em] text-[#10131A]/75 uppercase shadow-[0_8px_24px_rgba(47,107,242,0.08)] backdrop-blur-sm">
            <span className="h-1.5 w-1.5 rounded-full bg-[#2F6BF2]" />
            <span>SELECTED ARCHIVE · 04 BUILDS</span>
          </div>

          <h3 className="mt-6 flex flex-col items-center leading-[0.94] tracking-tight text-[#10131A]">
            <span className="portal-reveal-line font-display text-5xl font-extrabold uppercase sm:text-7xl lg:text-[5.5rem]">
              SELECTED
            </span>
            <span className="portal-reveal-line mt-1 flex flex-wrap items-baseline justify-center gap-x-4 gap-y-1">
              <span className="font-serif-italic text-6xl font-normal text-[#2F6BF2] sm:text-8xl lg:text-[6.25rem]">
                crafted
              </span>
              <span className="font-display text-5xl font-extrabold uppercase sm:text-7xl lg:text-[5.5rem]">
                WORKS
              </span>
            </span>
          </h3>

          <p className="portal-reveal-line mt-5 max-w-md text-sm font-medium leading-relaxed text-[#10131A]/65 sm:text-base">
            Four builds. Real systems, shipped and maintained.
          </p>

          <div className="mt-7 flex flex-wrap items-center justify-center gap-2.5">
            <span className="portal-editorial-meta rounded-full border border-[#10131A]/[0.08] bg-white px-4 py-1.5 font-mono text-[11px] font-bold tracking-wider text-[#10131A] uppercase shadow-[0_8px_24px_rgba(47,107,242,0.08)]">
              04 FEATURED BUILDS
            </span>
            <span className="portal-editorial-meta rounded-full border border-[#2F6BF2]/25 bg-[#C7D8FC]/40 px-4 py-1.5 font-mono text-[11px] font-bold tracking-wider text-[#2F6BF2] uppercase">
              WEB 16:9 · MOBILE DUAL-VIEW
            </span>
          </div>
        </div>

        {/* Balanced Light Bottom Chrome (h-14) flowing seamlessly into #F4F5F8 Projects */}
        <div className="relative z-20 mx-auto flex h-14 w-full max-w-7xl shrink-0 items-center justify-between border-t border-[#10131A]/[0.08] font-mono text-[11px] tracking-widest text-[#10131A]/45 uppercase">
          <span>FULLSTACK WEB &amp; FLUTTER</span>
          <span className="text-[#2F6BF2]">SCROLL TO INSPECT ↓</span>
        </div>
      </div>
    </section>
  );
}
