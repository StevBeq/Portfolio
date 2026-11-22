"use client";

import React, { useEffect, useRef, useState } from "react";
import { Sun } from "lucide-react";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/gsap";
import { usePortfolioLayer } from "@/components/providers/SmoothScrollProvider";
import { HeroOpeningSection } from "@/components/layer1/HeroOpeningSection";
import { PinnedProjectShowcase } from "@/components/layer1/PinnedProjectShowcase";
import { PreLayer2PortalSection } from "@/components/layer1/PreLayer2PortalSection";
import { Layer2Dashboard } from "@/components/layer2/Layer2Dashboard";

export default function PortfolioEntryPage() {
  const {
    activeLayer,
    isEnteringLayer2,
    portalOrigin,
    enterLayer2,
    commitLayer2BehindCurtain,
    finishEnterLayer2,
  } = usePortfolioLayer();

  // Persistent "Blue Thread" Progress Hairline + Floating Orb Phase Refs
  const layer1MainRef = useRef<HTMLElement | null>(null);
  const topThreadRef = useRef<HTMLDivElement | null>(null);
  const sideThreadRef = useRef<HTMLDivElement | null>(null);
  const [orbStage, setOrbStage] = useState<"obsidian" | "daylight" | "finale">("obsidian");

  // Cartoon Curtain Cover + Classic Mario Iris-Open Refs
  const cartoonCurtainRef = useRef<HTMLDivElement | null>(null);
  const cartoonBadgeRef = useRef<HTMLDivElement | null>(null);
  const cartoonStarsRef = useRef<HTMLDivElement | null>(null);
  const irisRingRef = useRef<HTMLDivElement | null>(null);
  const layer2PortalRef = useRef<HTMLElement | null>(null);
  const layer2InnerRef = useRef<HTMLDivElement | null>(null);

  /**
   * BRIDGE A & C ("Blue Thread" Hairline + Progressive "Tetes Biru" Orb):
   * Tracks full Layer 1 scroll progress with zero layout thrashing.
   * Star Yellow & halftone on the orb stay hidden until PreLayer2 (progress >= 0.78)!
   */
  useEffect(() => {
    if (activeLayer !== "layer1" || !layer1MainRef.current) return;

    const mainEl = layer1MainRef.current;
    const st = ScrollTrigger.create({
      trigger: mainEl,
      start: "top top",
      end: "bottom bottom",
      onUpdate: (self) => {
        const p = Math.max(0, Math.min(1, self.progress));
        const glowOpacity = p < 0.48 ? 0.42 + p * 0.6 : 1;

        if (topThreadRef.current) {
          topThreadRef.current.style.transform = `scaleX(${p.toFixed(4)})`;
          topThreadRef.current.style.opacity = glowOpacity.toFixed(2);
        }
        if (sideThreadRef.current) {
          sideThreadRef.current.style.transform = `scaleY(${p.toFixed(4)})`;
          sideThreadRef.current.style.opacity = glowOpacity.toFixed(2);
        }

        const nextStage: "obsidian" | "daylight" | "finale" =
          p >= 0.78 ? "finale" : p >= 0.44 ? "daylight" : "obsidian";
        setOrbStage((prev) => (prev === nextStage ? prev : nextStage));
      },
    });

    return () => {
      st.kill();
    };
  }, [activeLayer]);

  /**
   * STAGE 1 (Runs while activeLayer === "layer1"):
   * Sweeps ONLY the lightweight Royal-Blue (#2F6BF2) Halftone Curtain using `portalSnap`
   * (Layer 2 isn't mounted yet -> ZERO frame drop!), bounces the cartoon SB stamp,
   * then silently unmounts Layer 1 & mounts Layer 2 behind the solid opaque curtain!
   */
  useEffect(() => {
    if (!isEnteringLayer2 || activeLayer !== "layer1" || !cartoonCurtainRef.current) return;

    const { xPercent, yPercent } = portalOrigin;
    const curtainEl = cartoonCurtainRef.current;
    const badgeEl = cartoonBadgeRef.current;
    const starsEl = cartoonStarsRef.current;

    if (prefersReducedMotion()) {
      commitLayer2BehindCurtain();
      return;
    }

    gsap.set(curtainEl, {
      display: "flex",
      opacity: 1,
      clipPath: `circle(0% at ${xPercent}% ${yPercent}%)`,
    });
    if (badgeEl) {
      gsap.set(badgeEl, { scaleX: 0.2, scaleY: 0.2, rotate: -14, opacity: 0 });
    }
    if (starsEl) {
      gsap.set(starsEl, { scale: 0.3, rotate: -25, opacity: 0 });
    }

    const tl = gsap.timeline();

    // Cartoon Snap #1: Royal-Blue (#2F6BF2) Curtain Sweep (0.00 -> 0.42s, portalSnap)
    tl.to(
      curtainEl,
      {
        clipPath: `circle(155% at ${xPercent}% ${yPercent}%)`,
        duration: 0.42,
        ease: "portalSnap",
      },
      0
    );

    // Cartoon Snap #2: Rubber-Hose Squash-and-Stretch SB Stamp + Star Yellow Stars
    if (badgeEl) {
      tl.to(
        badgeEl,
        {
          opacity: 1,
          scaleX: 1.24,
          scaleY: 0.8,
          rotate: 6,
          duration: 0.14,
          ease: "power2.out",
        },
        0.18
      )
        .to(
          badgeEl,
          {
            scaleX: 0.91,
            scaleY: 1.12,
            rotate: -4,
            duration: 0.12,
            ease: "power2.inOut",
          },
          0.32
        )
        .to(
          badgeEl,
          {
            scaleX: 1,
            scaleY: 1,
            rotate: 0,
            duration: 0.13,
            ease: "back.out(2)",
          },
          0.44
        );
    }

    if (starsEl) {
      tl.to(
        starsEl,
        {
          scale: 1.08,
          rotate: 12,
          opacity: 1,
          duration: 0.34,
          ease: "back.out(1.8)",
        },
        0.22
      );
    }

    // At 0.45s, the opaque Royal-Blue curtain covers 100% of screen -> unmount Layer 1 & mount Layer 2 INVISIBLY!
    tl.call(
      () => {
        commitLayer2BehindCurtain();
      },
      [],
      0.45
    );

    return () => {
      tl.kill();
    };
  }, [isEnteringLayer2, activeLayer, portalOrigin, commitLayer2BehindCurtain]);

  /**
   * STAGE 2 (Runs once activeLayer === "layer2" while isEnteringLayer2 is still true):
   * Layer 1 is ALREADY unmounted (0% CPU, scrollbar already gone -> ZERO 15px jump!)
   * Wait 2 frames for GPU layer promotion, then open Classic Mario Gold-and-Ink Iris (`portalSnap`)!
   */
  useEffect(() => {
    if (
      !isEnteringLayer2 ||
      activeLayer !== "layer2" ||
      !layer2PortalRef.current ||
      !layer2InnerRef.current ||
      !cartoonCurtainRef.current
    ) {
      return;
    }

    const curtainEl = cartoonCurtainRef.current;
    const badgeEl = cartoonBadgeRef.current;
    const starsEl = cartoonStarsRef.current;
    const irisRingEl = irisRingRef.current;
    const portalEl = layer2PortalRef.current;
    const innerEl = layer2InnerRef.current;

    if (prefersReducedMotion()) {
      gsap.set(curtainEl, { display: "none", opacity: 0, clearProps: "clipPath" });
      gsap.set(portalEl, { clearProps: "clipPath,opacity" });
      gsap.set(innerEl, { clearProps: "transform,transformOrigin" });
      finishEnterLayer2();
      return;
    }

    gsap.set(portalEl, { clipPath: "circle(0% at 50% 50%)", opacity: 1 });
    gsap.set(innerEl, { scale: 0.96, transformOrigin: "50% 50%" });
    if (irisRingEl) {
      gsap.set(irisRingEl, { display: "block", scale: 0.02, opacity: 0 });
    }

    let raf1 = 0;
    let raf2 = 0;
    let tl: gsap.core.Timeline | null = null;

    raf1 = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => {
        tl = gsap.timeline({
          delay: 0.14,
          onComplete: () => {
            gsap.set(curtainEl, { display: "none", opacity: 0, clearProps: "clipPath" });
            gsap.set(portalEl, { clearProps: "clipPath,opacity" });
            gsap.set(innerEl, { clearProps: "transform,transformOrigin" });
            if (irisRingEl) gsap.set(irisRingEl, { display: "none", opacity: 0 });
            finishEnterLayer2();
          },
        });

        if (badgeEl) {
          tl.to(
            badgeEl,
            {
              scaleX: 1.24,
              scaleY: 1.24,
              opacity: 0,
              duration: 0.15,
              ease: "power2.in",
            },
            0
          );
        }
        if (starsEl) {
          tl.to(
            starsEl,
            {
              scale: 1.42,
              rotate: 35,
              opacity: 0,
              duration: 0.18,
              ease: "power2.in",
            },
            0
          );
        }

        // Cartoon Snap #3: Classic Mario Star-Yellow & Ink Iris-Open directly onto final-width Layer 2
        if (irisRingEl) {
          tl.to(
            irisRingEl,
            {
              opacity: 1,
              scale: 1.95,
              duration: 0.45,
              ease: "portalSnap",
            },
            0.05
          ).to(
            irisRingEl,
            {
              opacity: 0,
              duration: 0.14,
              ease: "power1.out",
            },
            0.38
          );
        }

        tl.to(
          portalEl,
          {
            clipPath: "circle(155% at 50% 50%)",
            duration: 0.45,
            ease: "portalSnap",
          },
          0.05
        ).to(
          innerEl,
          {
            scale: 1,
            duration: 0.45,
            ease: "portalSnap",
          },
          0.05
        );
      });
    });

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      tl?.kill();
    };
  }, [isEnteringLayer2, activeLayer, finishEnterLayer2]);

  return (
    <div className="min-h-screen w-full overflow-x-clip">
      {/* LAYER 1: Truly UNMOUNTED when activeLayer === "layer2" so all canvas RAFs drop to 0% CPU! */}
      {activeLayer === "layer1" && (
        <main ref={layer1MainRef} className="relative block w-full overflow-x-clip">
          {/* BRIDGE A: Persistent "Blue Thread" Hairline (Consumes global --thread & --thread-w tokens!) */}
          <div
            aria-hidden
            className="pointer-events-none fixed top-0 right-0 left-0 z-[60] bg-transparent"
            style={{ height: "var(--thread-w)" }}
          >
            <div
              ref={topThreadRef}
              className="h-full w-full origin-left"
              style={{
                backgroundColor: "var(--thread)",
                transform: "scaleX(0)",
                opacity: 0.42,
              }}
            />
          </div>
          <div
            aria-hidden
            className="pointer-events-none fixed top-16 bottom-16 left-2 z-[60] hidden overflow-hidden rounded-full bg-white/[0.06] sm:block"
            style={{ width: "var(--thread-w)" }}
          >
            <div
              ref={sideThreadRef}
              className="h-full w-full origin-top rounded-full"
              style={{
                backgroundColor: "var(--thread)",
                transform: "scaleY(0)",
                opacity: 0.42,
              }}
            />
          </div>

          <HeroOpeningSection />
          <PinnedProjectShowcase />
          <PreLayer2PortalSection />

          {/* BRIDGE C: Single Floating "Tetes Biru" Orb (Monochrome -> Royal -> Halftone/Star Yellow ONLY at Finale!) */}
          <button
            type="button"
            onClick={() => enterLayer2({ xPercent: 94, yPercent: 92 })}
            aria-label="Open Layer 2 Interactive Light Mode"
            className={`group fixed right-6 bottom-6 z-50 flex h-12 max-w-[48px] items-center overflow-hidden rounded-full transition-all duration-500 ease-[cubic-bezier(0.19,1,0.22,1)] hover:max-w-[285px] cursor-pointer ${
              orbStage === "finale"
                ? "border-2 border-[#10131A] bg-[#F4F5F8] text-[#10131A] shadow-[0_12px_32px_rgba(47,107,242,0.45)] hover:bg-white"
                : orbStage === "daylight"
                ? "border border-[#2F6BF2]/60 bg-white/95 text-[#10131A] shadow-[0_12px_32px_rgba(47,107,242,0.28)] hover:border-[#2F6BF2] hover:bg-white"
                : "border border-white/15 bg-[#11192B]/90 text-[#F4F5F8] shadow-[0_12px_30px_rgba(0,0,0,0.45)] backdrop-blur-md hover:border-[#2F6BF2] hover:bg-[#15223D]"
            }`}
          >
            {/* Subtle comic halftone ring ONLY activates once past Selected Projects (Legal Finale Presage!) */}
            {orbStage === "finale" && (
              <span
                aria-hidden
                className="pointer-events-none absolute -inset-1 rounded-full border border-dashed border-[#2F6BF2]/60"
              />
            )}

            <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-full">
              <Sun
                className={`h-5 w-5 transition-all duration-500 group-hover:rotate-90 ${
                  orbStage === "obsidian" ? "text-[#C7D8FC]" : "text-[#2F6BF2]"
                }`}
              />
              <span
                className={`absolute right-1.5 bottom-1.5 rounded px-1 font-mono text-[8px] font-black leading-tight transition-colors duration-300 ${
                  orbStage === "finale"
                    ? "bg-[#10131A] text-[#FFD23F]"
                    : orbStage === "daylight"
                    ? "bg-[#2F6BF2] text-white"
                    : "bg-white/15 text-[#C7D8FC]"
                }`}
              >
                L2
              </span>
            </span>

            <span
              className={`whitespace-nowrap pr-4 pl-1 font-mono text-xs font-extrabold tracking-tight opacity-0 transition-opacity duration-300 group-hover:opacity-100 ${
                orbStage === "obsidian" ? "text-[#F4F5F8]" : "text-[#10131A]"
              }`}
            >
              Layer 2 · Interactive Light Mode →
            </span>
          </button>
        </main>
      )}

      {/* CARTOON CURTAIN COVER (Locked Royal Bridge Blue #2F6BF2 Halftone Curtain + Rubber-Hose SB Stamp!) */}
      <div
        ref={cartoonCurtainRef}
        aria-hidden
        className="pointer-events-none fixed inset-0 z-[95] hidden flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-[#2F6BF2] via-[#245CE0] to-[#1A47B8] will-change-[clip-path]"
      >
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.14]"
          style={{
            backgroundImage: "radial-gradient(circle, #FFFFFF 2px, transparent 2px)",
            backgroundSize: "28px 28px",
          }}
        />

        {/* Orbiting Star Yellow (#FFD23F) & White Cartoon Sparkle Stars */}
        <div
          ref={cartoonStarsRef}
          className="pointer-events-none absolute flex h-56 w-56 items-center justify-center will-change-transform"
        >
          <svg viewBox="0 0 220 220" className="h-full w-full overflow-visible" fill="none">
            <path
              d="M38 42 L44 26 L50 42 L66 48 L50 54 L44 70 L38 54 L22 48 Z"
              fill="#FFD23F"
              stroke="#10131A"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <path
              d="M174 34 L179 22 L184 34 L196 39 L184 44 L179 56 L174 44 L162 39 Z"
              fill="#FFFFFF"
              stroke="#10131A"
              strokeWidth="3.5"
              strokeLinejoin="round"
            />
            <path
              d="M170 166 L176 150 L182 166 L198 172 L182 178 L176 194 L170 178 L154 172 Z"
              fill="#C7D8FC"
              stroke="#10131A"
              strokeWidth="4"
              strokeLinejoin="round"
            />
            <circle cx="42" cy="170" r="10" fill="#FFD23F" stroke="#10131A" strokeWidth="4" />
          </svg>
        </div>

        {/* Center Bouncy Cel-Shaded Cartoon SB Stamp */}
        <div
          ref={cartoonBadgeRef}
          className="relative z-10 flex h-28 w-28 items-center justify-center rounded-[28px] border-[4px] border-[#10131A] bg-white p-4 shadow-[0_10px_0_#10131A] will-change-transform"
        >
          <img
            src="/assets/logo/LogoLight.webp"
            alt="StevBeq"
            className="h-full w-full object-contain"
          />
          <span className="absolute -right-3 -bottom-3 flex h-9 w-9 items-center justify-center rounded-full border-[3px] border-[#10131A] bg-[#FFD23F] font-mono text-xs font-black text-[#10131A] shadow-[0_3px_0_#10131A]">
            ✦
          </span>
        </div>
      </div>

      {/* LAYER 2: Mounted cleanly behind solid Royal Blue curtain at final full width -> ZERO 15px jump! */}
      {activeLayer === "layer2" && (
        <section
          ref={layer2PortalRef}
          aria-label="Layer 2 Interactive Detail Hub"
          style={isEnteringLayer2 ? { clipPath: "circle(0% at 50% 50%)" } : undefined}
          className={
            isEnteringLayer2
              ? "fixed inset-0 z-[100] h-screen w-full overflow-hidden will-change-[clip-path]"
              : "relative w-full"
          }
        >
          <div ref={layer2InnerRef} className="h-full w-full will-change-transform">
            <Layer2Dashboard />
          </div>
        </section>
      )}

      {/* Bold Comic Star-Yellow & Ink Outline Ring Riding the Classic Mario Iris Edge! */}
      <div
        ref={irisRingRef}
        aria-hidden
        className="pointer-events-none fixed top-1/2 left-1/2 z-[110] hidden h-[96vmax] w-[96vmax] -translate-x-1/2 -translate-y-1/2 rounded-full border-[10px] border-[#FFD23F] opacity-0 shadow-[0_0_0_5px_#10131A,inset_0_0_0_5px_#10131A] will-change-transform"
      />
    </div>
  );
}
