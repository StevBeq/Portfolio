"use client";

import React, { useEffect, useRef } from "react";
import {
  gsap,
  isLowEndDevice,
  prefersReducedMotion,
} from "@/lib/gsap";
import {
  HERO_SCRIBBLE_BUNDLE,
  HERO_SCRIBBLE_VIEWBOX,
  HERO_SIGNATURE_FORM,
  LOADER_SB_STROKE,
  PORTRAIT_SCHEMATIC,
} from "@/data/thread-paths";

/* ============================================================================
 * C1 — "BENANG MENGGAMBAR DIRINYA" (Loading Single-Stroke SB + Vermilion Terminus)
 * ========================================================================== */

interface LoaderThreadMarkProps {
  terminusRef?: React.RefObject<SVGCircleElement | null>;
  className?: string;
}

export function LoaderThreadMark({
  terminusRef,
  className = "",
}: LoaderThreadMarkProps) {
  const { viewBox, d, terminus, outerRing } = LOADER_SB_STROKE;

  return (
    <svg
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`overflow-visible ${className}`}
      aria-label="StevBeq SB single-stroke monogram"
    >
      {/* Subtle circular blueprint track */}
      <circle
        cx={outerRing.cx}
        cy={outerRing.cy}
        r={outerRing.r}
        stroke="rgba(255,255,255,0.07)"
        strokeWidth="1"
      />
      {/* Active Royal Thread circular calibration ring */}
      <circle
        cx={outerRing.cx}
        cy={outerRing.cy}
        r={outerRing.r}
        pathLength={1}
        stroke="var(--thread)"
        strokeOpacity="0.45"
        strokeWidth="1.25"
        strokeDasharray="1"
        strokeDashoffset="1"
        strokeLinecap="round"
        transform={`rotate(-90 ${outerRing.cx} ${outerRing.cy})`}
        className="loader-ring-stroke"
      />

      {/* Faint architectural blueprint guide beneath the active stroke */}
      <path
        d={d}
        stroke="rgba(199,216,252,0.10)"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* C1 Single Continuous SB Monogram Stroke (pathLength=1 -> ZERO getTotalLength thrash) */}
      <path
        d={d}
        pathLength={1}
        stroke="var(--thread)"
        strokeWidth="3.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1"
        strokeDashoffset="1"
        className="loader-sb-stroke"
      />

      {/* Precision hairline highlight core riding the exact same continuous gesture */}
      <path
        d={d}
        pathLength={1}
        stroke="var(--thread-light)"
        strokeOpacity="0.72"
        strokeWidth="1"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1"
        strokeDashoffset="1"
        className="loader-sb-stroke"
      />

      {/* Single 6px Vermilion Terminus Dot at exact end of stroke (118, 65) — Beat 2 pulse & Beat 3 Iris Origin! */}
      <circle
        ref={terminusRef}
        cx={terminus.x}
        cy={terminus.y}
        r="3.8"
        fill="var(--vermilion)"
        style={{ transformOrigin: `${terminus.x}px ${terminus.y}px` }}
        className="loader-vermilion-dot opacity-0"
      />
    </svg>
  );
}

/* ============================================================================
 * C2 — "TINTA MENUMPUK" (Hero Autoplay Wow 1.6s -> 12% Residue + 1 Steady Signature)
 * ========================================================================== */

interface HeroThreadSignatureProps {
  /** Flip to true to launch the 1.6s autoplay choreography (overlaps loader Beat 3/4) */
  play: boolean;
  className?: string;
}

export function HeroThreadSignature({
  play,
  className = "",
}: HeroThreadSignatureProps) {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const hasPlayedRef = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !play || hasPlayedRef.current) return;
    hasPlayedRef.current = true;

    const scribbleGroup = root.querySelector<SVGGElement>(".hero-scribble-group");
    const scribblePaths = root.querySelectorAll<SVGPathElement>(".hero-scribble-path");
    const signaturePath = root.querySelector<SVGPathElement>(".hero-signature-underline");
    const startTick = root.querySelector<SVGCircleElement>(".hero-signature-node-start");
    const endTick = root.querySelector<SVGCircleElement>(".hero-signature-node-end");

    const settleStatic = () => {
      if (scribblePaths.length) {
        gsap.set(scribblePaths, { strokeDashoffset: 0 });
      }
      if (scribbleGroup) {
        gsap.set(scribbleGroup, { opacity: 0.12, scaleY: 0.84, rotate: 0 });
      }
      if (signaturePath) {
        gsap.set(signaturePath, { strokeDashoffset: 0, opacity: 1 });
      }
      if (startTick && endTick) {
        gsap.set([startTick, endTick], { opacity: 0.9, scale: 1 });
      }
    };

    // Section 5 fallback: reduced-motion or low-end -> immediate crisp settled state
    if (prefersReducedMotion() || isLowEndDevice()) {
      settleStatic();
      return;
    }

    // Initialize clean hidden draw state
    gsap.set(scribblePaths, { strokeDashoffset: 1 });
    if (scribbleGroup) {
      gsap.set(scribbleGroup, {
        opacity: 1,
        scaleY: 1,
        rotate: -0.9,
        transformOrigin: "50% 54%",
      });
    }
    if (signaturePath) {
      gsap.set(signaturePath, { strokeDashoffset: 1, opacity: 1 });
    }
    if (startTick && endTick) {
      gsap.set([startTick, endTick], { opacity: 0, scale: 0.5, transformOrigin: "50% 50%" });
    }

    // Section 5 Frame-Budget Guard: if 2 dropped frames (>34ms) happen in 60 ticks -> settle cleanly!
    let tickCount = 0;
    let droppedFrames = 0;
    let guardActive = true;

    const tl = gsap.timeline({
      onComplete: () => {
        guardActive = false;
      },
    });

    const frameGuard = (_time: number, deltaMs: number) => {
      if (!guardActive) return;
      tickCount += 1;
      if (deltaMs > 34) {
        droppedFrames += 1;
      }
      if (droppedFrames >= 2) {
        guardActive = false;
        gsap.ticker.remove(frameGuard);
        tl.kill();
        settleStatic();
      } else if (tickCount >= 60) {
        guardActive = false;
        gsap.ticker.remove(frameGuard);
      }
    };

    gsap.ticker.add(frameGuard);

    // Phase 1 (0.00 -> 1.06s, liquidRise): 15 coordinated blue strokes accumulate dynamically
    HERO_SCRIBBLE_BUNDLE.forEach((spec, idx) => {
      const pathEl = scribblePaths[idx];
      if (!pathEl) return;
      tl.to(
        pathEl,
        {
          strokeDashoffset: 0,
          duration: spec.duration,
          ease: "liquidRise",
        },
        spec.delay
      );
    });

    // Phase 2 (0.96 -> 1.60s, liquidSettle): Chaos compresses into 12% residue while 1 steady underline draws out of terminus!
    if (scribbleGroup) {
      tl.to(
        scribbleGroup,
        {
          opacity: 0.12,
          scaleY: 0.84,
          rotate: 0,
          duration: 0.64,
          ease: "liquidSettle",
        },
        0.96
      );
    }

    if (startTick) {
      tl.to(
        startTick,
        { opacity: 0.9, scale: 1, duration: 0.25, ease: "liquidFlow" },
        0.96
      );
    }

    if (signaturePath) {
      tl.to(
        signaturePath,
        {
          strokeDashoffset: 0,
          duration: 0.62,
          ease: "liquidSettle",
        },
        0.98
      );
    }

    if (endTick) {
      tl.to(
        endTick,
        { opacity: 0.9, scale: 1, duration: 0.25, ease: "liquidFlow" },
        1.42
      );
    }

    return () => {
      guardActive = false;
      gsap.ticker.remove(frameGuard);
      tl.kill();
    };
  }, [play]);

  return (
    <div
      ref={rootRef}
      aria-hidden
      className={`hero-signature-seed pointer-events-none relative mx-auto w-full max-w-[680px] select-none ${className}`}
    >
      <svg
        viewBox={HERO_SCRIBBLE_VIEWBOX}
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="block h-auto w-full overflow-visible"
        preserveAspectRatio="xMidYMid meet"
      >
        {/* 15-path Chaos -> Discipline technical bundle (compresses to 12% faint residue ONLY in Hero) */}
        <g className="hero-scribble-group">
          {HERO_SCRIBBLE_BUNDLE.map((spec) => (
            <path
              key={spec.id}
              d={spec.d}
              pathLength={1}
              stroke={spec.stroke}
              strokeOpacity={spec.opacity}
              strokeWidth={spec.strokeWidth}
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="1"
              strokeDashoffset="1"
              className="hero-scribble-path"
            />
          ))}
        </g>

        {/* Settled Single Steady Signature Underline (Seed for Junction A!) */}
        <path
          d={HERO_SIGNATURE_FORM.d}
          pathLength={1}
          stroke="var(--thread)"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeDasharray="1"
          strokeDashoffset="1"
          className="hero-signature-underline"
        />

        {/* Crisp endpoint registration ticks */}
        <circle
          cx={HERO_SIGNATURE_FORM.startPoint.x}
          cy={HERO_SIGNATURE_FORM.startPoint.y}
          r="2.8"
          fill="var(--thread-light)"
          className="hero-signature-node-start opacity-0"
        />
        <circle
          cx={HERO_SIGNATURE_FORM.endPoint.x}
          cy={HERO_SIGNATURE_FORM.endPoint.y}
          r="2.8"
          fill="var(--thread)"
          className="hero-signature-node-end opacity-0"
        />
      </svg>
    </div>
  );
}

/* ============================================================================
 * C3 — "SKETSA MENYALA" (Portrait Outer Technical Hatching + Crop-Marks + Iris Circle)
 * ========================================================================== */

interface PortraitSchematicOverlayProps {
  className?: string;
}

export function PortraitSchematicOverlay({
  className = "",
}: PortraitSchematicOverlayProps) {
  const { viewBox, chaosHatching, cropMarks, irisCircle, annotations } = PORTRAIT_SCHEMATIC;

  return (
    <svg
      viewBox={viewBox}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
      className={`pointer-events-none select-none overflow-visible ${className}`}
    >
      {/* Outer Chaos -> Disciplined Hatching Strokes (strictly OUTSIDE portrait safeEllipse) */}
      <g className="portrait-chaos-group">
        {chaosHatching.map((spec) => (
          <path
            key={spec.id}
            d={spec.d}
            pathLength={1}
            stroke={spec.stroke}
            strokeOpacity={spec.opacity}
            strokeWidth={spec.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1"
            strokeDashoffset="1"
            className="portrait-hatch-stroke"
          />
        ))}
      </g>

      {/* Precision Engineering Crop-Marks & Datum Axes (p=0.55 refine beat) */}
      <g className="portrait-crop-group">
        {cropMarks.map((spec) => (
          <path
            key={spec.id}
            d={spec.d}
            pathLength={1}
            stroke={spec.stroke}
            strokeOpacity={spec.opacity}
            strokeWidth={spec.strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1"
            strokeDashoffset="1"
            className="portrait-crop-stroke"
          />
        ))}
      </g>

      {/* 6 Crisp Technical Mono Annotations */}
      <g className="portrait-annotations-group">
        {annotations.map((ann) => (
          <text
            key={ann.id}
            x={ann.x}
            y={ann.y}
            textAnchor={ann.align}
            fill="var(--thread-light)"
            fillOpacity="0.68"
            className="portrait-ann-label font-mono text-[10px] font-semibold tracking-[0.18em] uppercase opacity-0"
          >
            {ann.text}
          </text>
        ))}
      </g>

      {/* Final Enclosing Iris Circle (p=0.86 -> 0.96): LOCKS face & expands directly into Junction C! */}
      <path
        d={irisCircle.d}
        pathLength={1}
        stroke="var(--thread)"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1"
        strokeDashoffset="1"
        style={{ transformOrigin: `${irisCircle.cx}px ${irisCircle.cy}px` }}
        className="portrait-iris-circle"
      />
    </svg>
  );
}
