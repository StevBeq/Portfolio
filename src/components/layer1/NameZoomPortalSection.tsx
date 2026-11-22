"use client";

import React, { useRef } from "react";
import { gsap, isLowEndDevice, prefersReducedMotion, useGSAP } from "@/lib/gsap";

export function NameZoomPortalSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const monogramZoomRef = useRef<HTMLDivElement | null>(null);
  const lightStageRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const reducedMotion = prefersReducedMotion();
      const lowEnd = isLowEndDevice();

      if (reducedMotion) {
        if (lightStageRef.current) {
          gsap.set(lightStageRef.current, { clipPath: "circle(125% at 50% 50%)" });
        }
        gsap.set(".portal-reveal-line, .portal-editorial-meta", { opacity: 1, y: 0 });
        return;
      }

      const scrubSmooth = lowEnd ? 0.5 : 0.85;
      const monogramTargetScale = lowEnd ? 1.4 : 1.95;

      // Toggle will-change only while active (<= 3 elements)
      const perfTargets = [
        monogramZoomRef.current,
        lightStageRef.current,
        document.querySelector(".portal-drift-fg"),
      ].filter(Boolean) as HTMLElement[];

      /* 1. SMOOTH SCRUBBED ARRIVAL FROM MOMENT 4 PORTRAIT (#0D1524 CONTINUITY) */
      const arrivalTl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top bottom",
          end: "top top",
          scrub: scrubSmooth,
          invalidateOnRefresh: true,
        },
      });

      arrivalTl
        .fromTo(
          ".portal-junction-c-catch",
          { scale: 1.65, opacity: 0.55 },
          { scale: 0.42, opacity: 0, ease: "liquidFlow" },
          0
        )
        .fromTo(
          ".outlined-name-bg",
          { scale: 0.86, opacity: 0, letterSpacing: "0.14em" },
          { scale: 1, opacity: 1, letterSpacing: "-0.04em", ease: "liquidFlow" },
          0
        )
        .fromTo(
          ".monogram-arrival-wrap",
          { scale: 0.62, opacity: 0 },
          { scale: 1, opacity: 1, ease: "liquidRise" },
          0.08
        )
        .fromTo(
          ".portal-entry-hud",
          { opacity: 0, y: 12 },
          { opacity: 1, y: 0, ease: "liquidFlow" },
          0.16
        );

      /* 2. PINNED LIQUID IRIS: #0D1524 NAVY BRIDGE -> #F4F5F8 COOL CLOUD + 3-LAYER DRIFT PARALLAX */
      const portalTl = gsap.timeline({
        scrollTrigger: {
          id: "name-portal-pin",
          trigger: sectionRef.current,
          start: "top top",
          end: "+=175%",
          pin: true,
          scrub: scrubSmooth,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            perfTargets.forEach((el) => el.classList.toggle("is-animating", self.isActive));
          },
        },
      });

      // Keep monogram SVG natively large (560px) and scale cleanly so edges stay 100% razor-sharp
      portalTl
        .to(
          ".portal-entry-hud, .portal-scroll-hint",
          { opacity: 0, y: -14, duration: 0.16, ease: "liquidFlow" },
          0
        )
        .to(
          ".outlined-name-bg",
          { scale: 1.5, opacity: 0, duration: 0.36, ease: "liquidFlow" },
          0
        )
        .fromTo(
          monogramZoomRef.current,
          { scale: 0.34 },
          { scale: monogramTargetScale, duration: 0.48, ease: "liquidFlow" },
          0
        )
        .to(
          monogramZoomRef.current,
          { opacity: 0, duration: 0.14, ease: "liquidFlow" },
          0.36
        )
        // Expanding Royal Bridge Blue aperture ring leading the crisp CSS clip-path iris
        .fromTo(
          ".portal-iris-ring",
          { scale: 0.04, opacity: 0 },
          { scale: 1.65, opacity: 0.85, duration: 0.44, ease: "liquidFlow" },
          0.16
        )
        .to(
          ".portal-iris-ring",
          { opacity: 0, duration: 0.12, ease: "liquidFlow" },
          0.48
        )
        // Analytical per-pixel CSS clip-path circle opening directly onto #F4F5F8 Cool Cloud!
        .fromTo(
          lightStageRef.current,
          { clipPath: "circle(0% at 50% 50%)" },
          { clipPath: "circle(125% at 50% 50%)", duration: 0.48, ease: "liquidFlow" },
          0.18
        )
        // Per-line Liquid Mask Reveal for SELECTED crafted WORKS
        .fromTo(
          ".portal-reveal-line",
          { y: 32, opacity: 0, clipPath: "inset(100% 0% 0% 0%)" },
          {
            y: 0,
            opacity: 1,
            clipPath: "inset(0% 0% 0% 0%)",
            stagger: 0.06,
            duration: 0.24,
            ease: "liquidRise",
          },
          0.44
        )
        .fromTo(
          ".portal-editorial-meta",
          { y: 18, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.04, duration: 0.2, ease: "liquidRise" },
          0.56
        )
        // 3-Layer Drift-Parallax (bg -6% / mid -12% / fg -20%, ease: "none") for serene spatial depth
        .fromTo(
          ".portal-drift-bg",
          { yPercent: 6 },
          { yPercent: -6, duration: 0.62, ease: "none" },
          0.38
        )
        .fromTo(
          ".portal-drift-mid",
          { yPercent: 8 },
          { yPercent: -12, duration: 0.62, ease: "none" },
          0.38
        )
        .fromTo(
          ".portal-drift-fg",
          { yPercent: 6 },
          { yPercent: -16, duration: 0.62, ease: "none" },
          0.38
        );
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="name-portal"
      ref={sectionRef}
      className="relative flex h-screen min-h-[640px] w-full flex-col items-center justify-center overflow-hidden bg-[#0D1524] text-[#F4F5F8] select-none"
    >
      {/* Top Balanced Chrome (h-14 matching Navy Bridge Moment 4) */}
      <div className="portal-entry-hud pointer-events-none absolute inset-x-0 top-4 z-10 mx-auto flex h-14 max-w-7xl items-center justify-between border-b border-white/10 px-6 font-mono text-[11px] tracking-widest text-white/45 uppercase sm:px-10">
        <span>04 // MONOGRAM PORTAL</span>
        <span className="text-[#9DB8FB]">OPENING DAYLIGHT</span>
      </div>

      {/* Subtle Royal Bridge Blue Radial Aura behind Monogram */}
      <div
        className="pointer-events-none absolute inset-0 z-0"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(47,107,242,0.18) 0%, rgba(157,184,251,0.06) 36%, transparent 68%)",
        }}
      />

      {/* Outlined Giant Brand Wordmark (Unbounded — Brand Mark Only) */}
      <div className="outlined-name-bg pointer-events-none absolute inset-0 z-10 flex flex-col items-center justify-center">
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

      {/* Center Zero-Blur Native High-Res Vector SB Monogram (Dead-center 50% 50% for exact iris alignment) */}
      <div className="monogram-arrival-wrap pointer-events-none relative z-20 flex items-center justify-center">
        <div
          ref={monogramZoomRef}
          className="relative flex h-[480px] w-[480px] items-center justify-center sm:h-[560px] sm:w-[560px]"
          style={{ transform: "scale(0.34)" }}
        >
          <svg
            viewBox="0 0 560 560"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="h-full w-full drop-shadow-[0_0_48px_rgba(47,107,242,0.28)]"
            shapeRendering="geometricPrecision"
          >
            {/* Outer architectural hairline ring */}
            <circle
              cx="280"
              cy="280"
              r="242"
              stroke="rgba(157,184,251,0.22)"
              strokeWidth="2.2"
              strokeDasharray="10 14"
            />

            {/* Left S diagonal bars */}
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

            {/* Right B geometric stroke frame */}
            <path
              d="M276 142H374C417.63 142 453 177.37 453 221C453 245.88 441.51 268.08 423.54 282.55C441.51 297.02 453 319.22 453 344.1C453 387.73 417.63 423.1 374 423.1H276"
              stroke="#F4F5F8"
              strokeWidth="52"
              strokeLinecap="round"
              strokeLinejoin="round"
            />

            {/* Dead-center Signature StevBeq Vermilion Portal Dot (Single allowed micro Vermilion!) */}
            <circle cx="280" cy="280" r="34" fill="#E0462E" />
            <circle cx="280" cy="280" r="13" fill="#F4F5F8" />
          </svg>
        </div>
      </div>

      {/* Bottom Chrome (h-14 balanced) */}
      <div className="portal-scroll-hint pointer-events-none absolute inset-x-0 bottom-4 z-20 mx-auto flex h-14 max-w-7xl items-center justify-center border-t border-white/10 px-6 font-mono text-[11px] tracking-[0.26em] text-[#C7D8FC]/70 uppercase sm:px-10">
        SCROLL THROUGH MONOGRAM ↓
      </div>

      {/* Incoming Junction C Catch Ring — receives C3's enclosing iris circle seamlessly into SB monogram! */}
      <div
        aria-hidden
        className="portal-junction-c-catch pointer-events-none absolute top-1/2 left-1/2 z-[18] h-[72vmin] w-[72vmin] -translate-x-1/2 -translate-y-1/2 rounded-full border-2 opacity-0"
        style={{ borderColor: "var(--thread)" }}
      />

      {/* Razor-Sharp Expanding Royal Bridge Blue Liquid Iris Ring */}
      <div
        className="portal-iris-ring pointer-events-none absolute top-1/2 left-1/2 z-[28] h-[85vmax] w-[85vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border-[2.5px] opacity-0"
        style={{ borderColor: "var(--thread)" }}
      />

      {/* ================= CLEAN-STRIP COOL CLOUD (#F4F5F8) DAYLIGHT STAGE (MONOTONIC DAWN) ================= */}
      <div
        ref={lightStageRef}
        className="pointer-events-none absolute inset-0 z-30 flex flex-col justify-between overflow-hidden bg-[#F4F5F8] px-6 py-4 text-[#10131A] sm:px-10"
        style={{ clipPath: "circle(0% at 50% 50%)" }}
      >
        {/* Atmospheric Blue Wash (#9DB8FB -> #F4F5F8) — Soft Sky Awakening */}
        <div
          aria-hidden
          className="portal-drift-bg pointer-events-none absolute inset-0"
          style={{
            background:
              "radial-gradient(ellipse 80% 55% at 50% 18%, rgba(157,184,251,0.34) 0%, rgba(199,216,252,0.18) 42%, rgba(244,245,248,0) 76%)",
          }}
        />

        {/* Delicate Blue-Tinted Drafted Grid matching BooleanField Warming on Cool Cloud */}
        <div
          aria-hidden
          className="portal-drift-bg pointer-events-none absolute inset-0 opacity-75"
          style={{
            backgroundImage: "radial-gradient(rgba(47,107,242,0.13) 1px, transparent 1px)",
            backgroundSize: "30px 30px",
          }}
        />

        {/* Subtle Vertical Blue Thread Continuity Hairline */}
        <div
          aria-hidden
          className="pointer-events-none absolute top-0 left-1/2 h-full w-px -translate-x-1/2 bg-gradient-to-b from-[#2F6BF2]/30 via-[#2F6BF2]/12 to-[#2F6BF2]/30"
        />

        {/* Oversized Editorial Ghost Index Watermark (Mid Drift Layer) */}
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

        {/* Mathematically Centered Editorial Centerpiece (Foreground Drift Layer) */}
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
              {/* Strictly ONE Instrument Serif Italic phrase in Royal Bridge Blue */}
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

        {/* Balanced Light Bottom Chrome (h-14) flowing seamlessly into #F4F5F8 Selected Projects */}
        <div className="relative z-20 mx-auto flex h-14 w-full max-w-7xl shrink-0 items-center justify-between border-t border-[#10131A]/[0.08] font-mono text-[11px] tracking-widest text-[#10131A]/45 uppercase">
          <span>FULLSTACK WEB &amp; FLUTTER</span>
          <span className="text-[#2F6BF2]">SCROLL TO INSPECT ↓</span>
        </div>
      </div>
    </section>
  );
}
