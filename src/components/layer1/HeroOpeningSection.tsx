"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  gsap,
  ScrollTrigger,
  isLowEndDevice,
  prefersReducedMotion,
  useGSAP,
} from "@/lib/gsap";
import { STEVBEQ_PROFILE } from "@/data/stevbeq";
import { usePortfolioLayer } from "@/components/providers/SmoothScrollProvider";
import { HeroInkExplosionCanvas } from "@/components/canvas/HeroInkExplosionCanvas";
import {
  AsciiParticlePortrait,
  type PortraitRenderMode,
} from "@/components/canvas/AsciiParticlePortrait";
import { FluidTechStackLayer } from "@/components/layer1/FluidTechStackLayer";

// Skip opening cinema shutter when returning from Layer 2 so wake-up is instant
let hasCompletedOpeningLoader = false;

const LEFT_BIO_WORDS =
  "Steven Arnaldo Setiawan — a fullstack developer in Yogyakarta who treats every product as one continuous system.".split(
    " "
  );

const RIGHT_BIO_WORDS =
  "React, Next.js, and Laravel for the web. Flutter and Dart for mobile. PostgreSQL and Supabase underneath.".split(
    " "
  );

export function HeroOpeningSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const preloaderRef = useRef<HTMLDivElement | null>(null);
  const loaderCounterRef = useRef<HTMLSpanElement | null>(null);
  const heroStageRef = useRef<HTMLDivElement | null>(null);
  const monogramZoomRef = useRef<HTMLDivElement | null>(null);
  const lightStageRef = useRef<HTMLDivElement | null>(null);

  // Zero-rerender mutable refs driving 60fps canvases
  const cosmosZoomRef = useRef<number>(0);
  const cosmosExitRef = useRef<number>(0);
  const portraitAssemblyRef = useRef<number>(0);
  const monogramMorphRef = useRef<number>(0);

  const [preloaderDone, setPreloaderDone] = useState(hasCompletedOpeningLoader);
  const [heroCosmosActive, setHeroCosmosActive] = useState(hasCompletedOpeningLoader);
  const [heroCosmosPaused, setHeroCosmosPaused] = useState(false);
  const [swarmActive, setSwarmActive] = useState(false);
  const [portraitMode, setPortraitMode] = useState<PortraitRenderMode>("ascii");
  const [wibTime, setWibTime] = useState("12:00:00");

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
       * 1. AWWWARDS SPLIT-SHUTTER OPENING (~2.5s) -> 3D ORBITAL METEOR COSMOS
       * =================================================================== */
      if (!hasCompletedOpeningLoader && preloaderRef.current) {
        if (reducedMotion) {
          setHeroCosmosActive(true);
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
          gsap.set(".hero-mask-rise", { yPercent: 115 });
          gsap.set(".hero-chrome-enter", { opacity: 0, y: 10 });

          const counterProxy = { val: 0 };

          const loaderTl = gsap.timeline({
            onComplete: () => {
              hasCompletedOpeningLoader = true;
              setPreloaderDone(true);
            },
          });

          // Beat 1 (0.00 -> 1.72s): Unhurried dramatic Royal Blue laser slice (000 -> 100) across monumental STEVBEQ
          loaderTl
            .to(
              counterProxy,
              {
                val: 100,
                duration: 1.72,
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
            .fromTo(
              ".loader-laser-line",
              { scaleX: 0 },
              { scaleX: 1, duration: 1.72, ease: "power2.inOut" },
              0
            )
            .fromTo(
              ".loader-laser-tip",
              { left: "0%", opacity: 1 },
              { left: "100%", opacity: 1, duration: 1.72, ease: "power2.inOut" },
              0
            )
            .fromTo(
              ".loader-ghost-word",
              { scale: 0.92, opacity: 0.1 },
              { scale: 1.04, opacity: 0.52, duration: 1.72, ease: "power2.inOut" },
              0
            )
            // Beat 2 (1.72 -> 1.90s): 0.18s dramatic flare hold at 100 before blast doors tear open!
            .to(
              ".loader-laser-line",
              { scaleY: 2.2, opacity: 1, duration: 0.14, ease: "power2.out" },
              1.72
            )
            .call(
              () => {
                setHeroCosmosActive(true);
              },
              [],
              1.82
            )
            .to(
              ".loader-laser-line, .loader-laser-tip, .loader-meta-strip",
              { opacity: 0, duration: 0.16, ease: "power2.out" },
              1.88
            )
            // Beat 3 (1.90 -> 2.66s): Dual Cinema Blast Doors rip open vertically -> ~2.5s total opening!
            .to(
              ".loader-shutter-top",
              { yPercent: -100, duration: 0.78, ease: "awwwardsExpo" },
              1.9
            )
            .to(
              ".loader-shutter-bottom",
              { yPercent: 100, duration: 0.78, ease: "awwwardsExpo" },
              1.9
            )
            // Beat 4 (2.06 -> 2.90s): Monumental Hero Typography rises cleanly out of masked floors!
            .to(
              ".hero-mask-rise",
              {
                yPercent: 0,
                stagger: 0.1,
                duration: 0.84,
                ease: "awwwardsExpo",
              },
              2.06
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
              2.22
            );
        }
      } else {
        setHeroCosmosActive(true);
      }

      if (reducedMotion) return;

      /* =====================================================================
       * ONE-TAKE CONTINUOUS CAMERA JOURNEY:
       * Hero 3D Meteor Cosmos -> POV INSIDE THE UNIVERSE (Section 2 Stack!) ->
       * Clean Fullscreen ASCII Swarm Portrait (ZERO overlapping boxes!) ->
       * Face-to-SB Particle Morph -> Vector SB Z-Dive -> Cool Cloud Daylight!
       * =================================================================== */
      const TOTAL_TL = 2.15;
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
          end: "+=620%",
          pin: true,
          scrub: lowEnd ? 0.5 : 0.82,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            perfTargets.forEach((el) => el.classList.toggle("is-animating", self.isActive));
            if (!self.isActive) {
              setSwarmActive(false);
            }
          },
          onUpdate: (self) => {
            const t = self.progress * TOTAL_TL;

            // POV Zoom INSIDE the 3D Meteor Cosmos across Hero -> Section 2 Stack (0.00 -> 0.24)
            cosmosZoomRef.current = Math.max(0, Math.min(1, t / 0.24));

            // Smoothly sweep meteors off-screen only when leaving Stack -> entering Profile (0.42 -> 0.56)
            cosmosExitRef.current = Math.max(0, Math.min(1, (t - 0.42) / 0.14));
            const shouldPauseCosmos = t > 0.58;
            setHeroCosmosPaused((prev) => (prev === shouldPauseCosmos ? prev : shouldPauseCosmos));

            // Fullscreen ASCII Swarm Portrait active ONLY between Stack shatter & SB Vector takeover (Max 1 canvas!)
            const inSwarm = t >= 0.42 && t <= 1.56;
            setSwarmActive((prev) => (prev === inSwarm ? prev : inSwarm));

            // Stack-to-Face Fullscreen Magnetic Vortex Gather (t = 0.46 -> 0.82)
            const gatherNorm = Math.max(0, Math.min(1, (t - 0.46) / 0.36));
            portraitAssemblyRef.current = lowEnd ? 1 : gatherNorm;

            // Face -> Particle Burst -> Giant SB Monogram Morph (t = 1.28 -> 1.49)
            monogramMorphRef.current = Math.max(0, Math.min(1, (t - 1.28) / 0.21));

            // Portrait mixed-media progression: ascii -> hybrid -> crisp borderless photo -> back to ascii for SB morph!
            if (!lowEnd) {
              const nextMode: PortraitRenderMode =
                t >= 1.25
                  ? "ascii"
                  : t >= 1.08
                  ? "photo"
                  : t >= 0.94
                  ? "hybrid"
                  : "ascii";
              setPortraitMode((prev) => (prev === nextMode ? prev : nextMode));
            }
          },
        },
      });

      /* -------- PHASE 1 (0.00 -> 0.26): FLY INSIDE THE 3D METEOR COSMOS -> SECTION 2 STACK! -------- */
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
        // Scene 2 Stack emerges right INSIDE the orbiting 3D meteor cosmos!
        .fromTo(
          ".scene2-emblem",
          { opacity: 0, scale: 0.72, y: -24 },
          { opacity: 1, scale: 1, y: 0, duration: 0.16, ease: "liquidSettle" },
          0.14
        )
        .fromTo(
          ".scene2-editorial",
          { opacity: 0, y: 30, clipPath: "inset(16% 0% 0% 0%)", pointerEvents: "none" },
          {
            opacity: 1,
            y: 0,
            clipPath: "inset(0% 0% 0% 0%)",
            pointerEvents: "auto",
            duration: 0.18,
            ease: "liquidRise",
          },
          0.14
        )
        .fromTo(
          ".scene2-chrome",
          { opacity: 0, y: -10 },
          { opacity: 1, y: 0, duration: 0.14, ease: "liquidFlow" },
          0.16
        )
        .fromTo(
          ".tech-cards-stage",
          { opacity: 0, scale: 0.9 },
          { opacity: 1, scale: 1, duration: 0.18, ease: "liquidRise" },
          0.15
        )
        .fromTo(
          ".tech-card-converge",
          { opacity: 0, y: 18, scale: 0.85 },
          { opacity: 1, y: 0, scale: 1, stagger: 0.007, duration: 0.13, ease: "liquidRise" },
          0.16
        )

        /* -------- PHASE 2 (0.42 -> 0.56): 16 STACK CARDS SHATTER INTO FULLSCREEN ASCII SWARM! -------- */
        .fromTo(
          ".scene3-fullscreen-swarm",
          { opacity: 0 },
          { opacity: 1, duration: 0.1, ease: "liquidFlow" },
          0.42
        )
        .to(
          ".tech-card-converge",
          {
            scale: 1.15,
            opacity: 0,
            stagger: 0.004,
            duration: 0.1,
            ease: "liquidFlow",
          },
          0.44
        )
        .to(
          ".tech-cards-stage",
          { opacity: 0, pointerEvents: "none", duration: 0.1, ease: "liquidFlow" },
          0.46
        )
        .to(
          ".scene2-editorial, .scene2-chrome, .scene2-emblem",
          {
            opacity: 0,
            y: -20,
            pointerEvents: "none",
            duration: 0.1,
            ease: "liquidFlow",
          },
          0.44
        )

        /* -------- PHASE 3 (0.56 -> 1.24): ULTRA-CLEAN FULLSCREEN ASCII -> HYBRID -> BORDERLESS PHOTO! -------- */
        // ZERO overlapping boxes, ZERO square heartbeat grid, ZERO crop-marks or circle cutting arms!
        .fromTo(
          ".scene3-chrome",
          { opacity: 0 },
          { opacity: 1, duration: 0.12, ease: "liquidFlow" },
          0.56
        )
        .fromTo(
          ".scene3-bio-left",
          { x: -28, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.16, ease: "liquidRise" },
          0.66
        )
        .fromTo(
          ".scene3-bio-right",
          { x: 28, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.16, ease: "liquidRise" },
          0.66
        )
        .fromTo(
          ".scene3-bio-mobile",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.14, ease: "liquidRise" },
          0.66
        )
        .fromTo(
          ".bio-scrub-word",
          { opacity: 0.28, color: "#94A3B8" },
          {
            opacity: 1,
            color: "#F4F5F8",
            stagger: 0.004,
            duration: 0.2,
            ease: "none",
          },
          0.7
        )

        /* -------- PHASE 4 (1.22 -> 1.56): FACE -> PARTICLE SWIRL -> GIANT SB MONOGRAM (ZERO BREAK!) -------- */
        .to(
          ".scene3-bio-left",
          { x: -34, opacity: 0, duration: 0.12, ease: "liquidFlow" },
          1.22
        )
        .to(
          ".scene3-bio-right",
          { x: 34, opacity: 0, duration: 0.12, ease: "liquidFlow" },
          1.22
        )
        .to(
          ".scene3-bio-mobile, .scene3-chrome",
          { opacity: 0, duration: 0.12, ease: "liquidFlow" },
          1.22
        )
        .fromTo(
          ".portal-entry-hud",
          { opacity: 0, y: 10 },
          { opacity: 1, y: 0, duration: 0.14, ease: "liquidFlow" },
          1.34
        )
        .fromTo(
          ".outlined-name-bg",
          { scale: 0.86, opacity: 0, letterSpacing: "0.14em" },
          { scale: 1, opacity: 1, letterSpacing: "-0.04em", duration: 0.18, ease: "liquidFlow" },
          1.34
        )
        .fromTo(
          monogramZoomRef.current,
          { scale: 0.36, opacity: 0 },
          { scale: 0.36, opacity: 1, duration: 0.09, ease: "liquidFlow" },
          1.46
        )
        .to(
          ".scene3-fullscreen-swarm",
          { opacity: 0, duration: 0.09, ease: "liquidFlow" },
          1.48
        )

        /* -------- PHASE 5 (1.56 -> 2.15): VECTOR SB Z-DIVE -> LIQUID IRIS -> COOL CLOUD #F4F5F8 DAYLIGHT! -------- */
        .to(
          ".portal-entry-hud",
          { opacity: 0, y: -12, duration: 0.12, ease: "liquidFlow" },
          1.57
        )
        .to(
          ".outlined-name-bg",
          { scale: 1.55, opacity: 0, duration: 0.26, ease: "liquidFlow" },
          1.57
        )
        .to(
          monogramZoomRef.current,
          { scale: monogramTargetScale, duration: 0.34, ease: "liquidFlow" },
          1.56
        )
        .to(
          monogramZoomRef.current,
          { opacity: 0, duration: 0.1, ease: "liquidFlow" },
          1.82
        )
        .fromTo(
          ".portal-iris-ring",
          { scale: 0.05, opacity: 0 },
          { scale: 1.7, opacity: 0.88, duration: 0.3, ease: "liquidFlow" },
          1.67
        )
        .to(".portal-iris-ring", { opacity: 0, duration: 0.1, ease: "liquidFlow" }, 1.9)
        .fromTo(
          lightStageRef.current,
          { clipPath: "circle(0% at 50% 50%)" },
          { clipPath: "circle(130% at 50% 50%)", duration: 0.32, ease: "liquidFlow" },
          1.69
        )
        .fromTo(
          ".portal-reveal-line",
          { y: 30, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            stagger: 0.04,
            duration: 0.18,
            ease: "liquidRise",
          },
          1.85
        )
        .fromTo(
          ".portal-editorial-meta",
          { y: 16, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.03, duration: 0.14, ease: "liquidRise" },
          1.93
        )
        .fromTo(
          ".portal-drift-bg",
          { yPercent: 5 },
          { yPercent: -5, duration: 0.32, ease: "none" },
          1.83
        )
        .fromTo(
          ".portal-drift-mid",
          { yPercent: 8 },
          { yPercent: -10, duration: 0.32, ease: "none" },
          1.83
        )
        .fromTo(
          ".portal-drift-fg",
          { yPercent: 6 },
          { yPercent: -10, duration: 0.32, ease: "none" },
          1.83
        );
    },
    { scope: sectionRef }
  );

  const scrollToJourneyStage = (fraction: number) => {
    const st = ScrollTrigger.getById("hero-journey");
    if (!st) return;
    scrollToPosition(st.start + (st.end - st.start) * fraction);
  };

  return (
    <section
      id="hero-opening"
      ref={sectionRef}
      className="relative h-screen min-h-[640px] w-full overflow-hidden bg-[#0B0D12] text-[#F4F5F8] select-none"
    >
      {/* ================= 1. AWWWARDS SPLIT-SHUTTER LASER OPENING (~2.5s) ================= */}
      {!preloaderDone && (
        <div
          ref={preloaderRef}
          className="fixed inset-0 z-[90] overflow-hidden pointer-events-none"
        >
          {/* Top Cinema Blast Door */}
          <div className="loader-shutter-top absolute inset-x-0 top-0 flex h-1/2 items-end justify-center overflow-hidden bg-[#0B0D12]">
            <div className="translate-y-1/2">
              <span
                className="loader-ghost-word font-unbounded block text-[15.5vw] font-black leading-none tracking-tighter uppercase"
                style={{
                  WebkitTextStroke: "1.5px rgba(199,216,252,0.32)",
                  color: "transparent",
                }}
              >
                STEVBEQ
              </span>
            </div>
          </div>

          {/* Bottom Cinema Blast Door */}
          <div className="loader-shutter-bottom absolute inset-x-0 bottom-0 flex h-1/2 items-start justify-center overflow-hidden bg-[#0B0D12]">
            <div className="-translate-y-1/2">
              <span
                className="loader-ghost-word font-unbounded block text-[15.5vw] font-black leading-none tracking-tighter uppercase"
                style={{
                  WebkitTextStroke: "1.5px rgba(199,216,252,0.32)",
                  color: "transparent",
                }}
              >
                STEVBEQ
              </span>
            </div>
          </div>

          {/* Razor-Sharp Horizontal Royal Blue Laser Seam slicing 0vw -> 100vw */}
          <div className="absolute top-1/2 right-0 left-0 z-20 -translate-y-1/2">
            <div className="h-px w-full bg-white/[0.08]" />
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

      {/* ================= CLEAN QUIET ATMOSPHERIC DEPTH (ZERO HEARTBEAT SQUARES!) ================= */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 68% 54% at 50% 48%, rgba(47,107,242,0.14) 0%, rgba(13,21,36,0.4) 52%, transparent 100%)",
        }}
      />

      {/* ================= SHARED 3D ORBITAL METEOR COSMOS (HERO -> POV INSIDE THE UNIVERSE IN SECTION 2!) ================= */}
      <HeroInkExplosionCanvas
        active={heroCosmosActive}
        paused={heroCosmosPaused}
        cosmosZoomRef={cosmosZoomRef}
        cosmosExitRef={cosmosExitRef}
        className="z-10"
      />

      {/* ================= SCENE 1: INTERACTIVE 3D METEOR HERO (ZERO BUTTONS, FLUID HOVER DEFLECTION!) ================= */}
      <div
        ref={heroStageRef}
        className="hero-stage-shell absolute inset-0 z-20 flex h-full w-full flex-col justify-between px-6 py-4 sm:px-10"
      >
        {/* Minimal Hairline Top Navigation */}
        <header className="hero-top-header hero-chrome-enter pointer-events-auto relative z-20 mx-auto flex h-14 w-full max-w-7xl shrink-0 items-center justify-between border-b border-white/10 font-mono text-xs text-white/65">
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
              onClick={() => scrollToJourneyStage(0.16)}
              className="transition hover:text-white cursor-pointer"
            >
              STACK
            </button>
            <button
              type="button"
              onClick={() => scrollToJourneyStage(0.47)}
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

        {/* Monumental Edge-to-Edge Editorial Display (ZERO Buttons, ZERO SaaS Clutter!) */}
        <div className="pointer-events-none relative z-20 mx-auto my-auto flex w-full max-w-7xl flex-col items-center justify-center px-2 text-center">
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

        {/* Minimal Editorial Bottom Telemetry */}
        <footer className="hero-bottom-footer hero-chrome-enter relative z-20 mx-auto grid h-14 w-full max-w-7xl shrink-0 grid-cols-2 items-center gap-3 border-t border-white/10 font-mono text-[10px] text-white/50 sm:grid-cols-3 sm:text-[11px]">
          <div className="truncate">
            <span className="text-white/75">YOGYAKARTA · WIB {wibTime}</span>
          </div>
          <div className="hidden items-center justify-center gap-2 text-white/45 sm:flex">
            <span
              className="h-1.5 w-1.5 rounded-full"
              style={{ backgroundColor: "var(--thread)" }}
            />
            <span className="tracking-[0.22em] uppercase">SWEEP CURSOR · CLICK TO RIPPLE</span>
          </div>
          <div className="text-right">
            <span className="tracking-[0.2em] text-[#C7D8FC] uppercase">SCROLL TO ENTER ↓</span>
          </div>
        </footer>
      </div>

      {/* ================= SCENE 2: INSIDE THE UNIVERSE — TECH STACK FLOATING AT THE COSMOS CORE ================= */}
      <div className="scene2-chrome pointer-events-none absolute top-4 inset-x-0 z-20 mx-auto flex h-14 max-w-7xl items-center justify-between border-b border-white/10 px-6 font-mono text-[11px] text-white/50 opacity-0 sm:px-10">
        <span>02 // CORE STACK &amp; CAPABILITIES</span>
        <span className="text-[#9DB8FB]">SCROLL TO EXPLORE PROFILE ↓</span>
      </div>

      <div className="pointer-events-none absolute inset-x-0 top-[14vh] z-20 flex justify-center">
        <div className="scene2-emblem flex h-[86px] w-[86px] flex-col items-center justify-center rounded-2xl border border-[#2F6BF2]/30 bg-[#11192B]/90 p-2 text-center opacity-0 shadow-[0_18px_50px_rgba(0,0,0,0.55)] backdrop-blur-md">
          <img
            src="/assets/logo/LogoDark.webp"
            alt="StevBeq Monogram"
            className="h-10 w-10 rounded-xl object-contain"
          />
          <span className="mt-1 font-mono text-[8.5px] font-bold tracking-widest text-[#C7D8FC] uppercase">
            STEVBEQ
          </span>
        </div>
      </div>

      <FluidTechStackLayer />

      <div className="pointer-events-none absolute inset-0 z-20 flex items-center justify-center px-6 pt-16">
        <div className="scene2-editorial flex max-w-xl flex-col items-center text-center opacity-0">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-[#11192B]/80 px-4 py-1.5 font-mono text-[11px] tracking-wider text-white/75 backdrop-blur-md">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E0462E]" />
            <span>END-TO-END ARCHITECTURE</span>
          </div>

          <h2 className="font-display mt-6 text-4xl font-extrabold tracking-tight text-[#F4F5F8] sm:text-5xl lg:text-[3.5rem] leading-[1.08]">
            Built with a{" "}
            <span className="font-serif-italic font-normal text-[#2F6BF2] transition-colors duration-300 hover:text-[#9DB8FB]">
              steady hand
            </span>
            .
          </h2>

          <p className="mt-5 max-w-md text-sm leading-relaxed text-[#94A3B8] sm:text-base">
            Web platforms and Flutter apps share one discipline: clean architecture first, motion
            last.
          </p>
        </div>
      </div>

      {/* ================= SCENE 3: ULTRA-CLEAN FULLSCREEN ASCII SWARM -> CRISP BORDERLESS PHOTO ================= */}
      {/* ZERO overlapping boxes, ZERO heartbeat squares, ZERO bracket/circle collisions! */}
      <div className="scene3-fullscreen-swarm pointer-events-none absolute inset-0 z-[24] opacity-0">
        <AsciiParticlePortrait
          src="/assets/me/Foto-Semi-Formal.webp"
          defaultMode="ascii"
          controlledMode={portraitMode}
          assemblyRef={portraitAssemblyRef}
          monogramMorphRef={monogramMorphRef}
          cellSize={4}
          tintBlue={true}
          showModeToggle={false}
          paused={!swarmActive}
          className="h-full w-full"
        />
      </div>

      {/* Scene 3 Clean Minimal Top Chrome */}
      <div className="scene3-chrome pointer-events-none absolute inset-x-0 top-4 z-30 mx-auto flex h-14 max-w-7xl items-center justify-between border-b border-white/10 px-6 font-mono text-[11px] tracking-widest text-white/55 uppercase opacity-0 sm:px-10">
        <span>03 // PROFILE</span>
        <span className="hidden text-[#9DB8FB] sm:inline">
          {portraitMode === "photo"
            ? "RESOLVED · STEVEN ARNALDO"
            : portraitMode === "hybrid"
            ? "HYBRID · RESOLVING"
            : "SWARM → FORM · HOVER SHARDS"}
        </span>
        <span>SLEMAN · YOGYAKARTA</span>
      </div>

      {/* Ultra-Clean FRAMELESS Editorial Bio Columns on Outer Margins (ZERO double/triple boxes!) */}
      <div className="pointer-events-none absolute inset-0 z-30 hidden items-center justify-between px-8 lg:flex xl:px-14">
        <div className="scene3-bio-left w-[240px] border-l border-[#2F6BF2]/45 pl-5 opacity-0 xl:w-[290px]">
          <p className="inline-flex items-center gap-2 font-mono text-[10px] tracking-[0.22em] text-white/50 uppercase">
            <span className="h-1.5 w-1.5 rounded-full bg-[#E0462E]" />
            01 // IDENTITY
          </p>

          <h3 className="font-serif-italic mt-2 text-2xl font-normal text-[#9DB8FB] xl:text-[1.75rem]">
            The person behind the build.
          </h3>

          <p className="mt-3 text-sm font-medium leading-relaxed xl:text-[14.5px]">
            {LEFT_BIO_WORDS.map((word, idx) => (
              <span key={`l-${word}-${idx}`} className="bio-scrub-word mr-1.5 inline-block">
                {word}
              </span>
            ))}
          </p>

          <div className="mt-5 space-y-1 font-mono text-[10px] text-white/50">
            <p className="text-white/80">PT. Indo Techno Medic · Programmer</p>
            <p>UKDW (S1) &amp; UTY (D3) Information Systems</p>
          </div>
        </div>

        <div className="scene3-bio-right w-[240px] border-r border-white/15 pr-5 text-right opacity-0 xl:w-[290px]">
          <p className="font-mono text-[10px] tracking-[0.22em] text-[#9DB8FB] uppercase">
            02 // ENGINEERING
          </p>

          <h3 className="font-display mt-2 text-xl font-bold tracking-tight text-[#F4F5F8] xl:text-2xl">
            From schema to screen.
          </h3>

          <p className="mt-3 text-sm font-medium leading-relaxed xl:text-[14.5px]">
            {RIGHT_BIO_WORDS.map((word, idx) => (
              <span key={`r-${word}-${idx}`} className="bio-scrub-word mr-1.5 inline-block">
                {word}
              </span>
            ))}
          </p>

          <p className="mt-5 font-mono text-[10px] tracking-wider text-[#C7D8FC]/75 uppercase">
            Next.js · Flutter · Laravel · PostgreSQL
          </p>
        </div>
      </div>

      {/* Mobile Bottom Bio Fallback (< lg screens) */}
      <div className="scene3-bio-mobile pointer-events-none absolute inset-x-5 bottom-20 z-30 border-l-2 border-[#2F6BF2] bg-[#0D1524]/80 py-2.5 pr-3 pl-4 opacity-0 backdrop-blur-md lg:hidden">
        <p className="font-mono text-[10px] font-bold text-[#9DB8FB] uppercase">
          @{STEVBEQ_PROFILE.handle} · FULLSTACK WEB &amp; MOBILE
        </p>
        <p className="mt-1 text-xs leading-relaxed text-white/85">
          {STEVBEQ_PROFILE.bioScrubText}
        </p>
      </div>

      {/* Scene 3 Clean Bottom Chrome (Exact h-14) */}
      <div className="scene3-chrome pointer-events-none absolute inset-x-0 bottom-4 z-30 mx-auto flex h-14 max-w-7xl items-center justify-between border-t border-white/10 px-6 opacity-0 sm:px-10">
        <span className="font-unbounded text-2xl font-black leading-none tracking-tighter text-[#F4F5F8] sm:text-4xl">
          {STEVBEQ_PROFILE.handleSplit[0]}
        </span>
        <span className="font-mono text-[11px] tracking-widest text-white/45">
          SCROLL TO CONTINUE ↓
        </span>
        <span
          className="font-unbounded text-2xl font-black leading-none tracking-tighter sm:text-4xl"
          style={{ color: "var(--thread)" }}
        >
          {STEVBEQ_PROFILE.handleSplit[1]}
        </span>
      </div>

      {/* ================= SCENE 4 (ONE-TAKE SEAMLESS PORTAL): SB MONOGRAM Z-DIVE -> COOL CLOUD #F4F5F8! ================= */}
      <div className="portal-entry-hud pointer-events-none absolute inset-x-0 top-4 z-30 mx-auto flex h-14 max-w-7xl items-center justify-between border-b border-white/10 px-6 font-mono text-[11px] tracking-widest text-white/45 uppercase opacity-0 sm:px-10">
        <span>04 // MONOGRAM PORTAL</span>
        <span className="text-[#9DB8FB]">OPENING DAYLIGHT</span>
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
