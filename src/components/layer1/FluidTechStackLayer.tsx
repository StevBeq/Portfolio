"use client";

import React, { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { TECH_STACK_CARDS, TechStackLogo } from "@/components/ui/TechStackIcons";

interface CardAnchor {
  stylePos: React.CSSProperties;
  depthOpacity: string;
  phase: number;
  freqX: number;
  freqY: number;
  ampX: number;
  ampY: number;
}

// Balanced, architectural left & right staggered constellations leaving generous negative space in the center
const DESKTOP_ANCHORS: CardAnchor[] = [
  // Left outer & inner staggered columns (8 cards)
  { stylePos: { left: "4%", top: "14%" }, depthOpacity: "opacity-75", phase: 0.2, freqX: 0.42, freqY: 0.5, ampX: 5, ampY: 6 },
  { stylePos: { left: "14%", top: "22%" }, depthOpacity: "opacity-100", phase: 1.1, freqX: 0.5, freqY: 0.42, ampX: 6, ampY: 6 },
  { stylePos: { left: "5%", top: "36%" }, depthOpacity: "opacity-80", phase: 2.0, freqX: 0.38, freqY: 0.54, ampX: 5, ampY: 7 },
  { stylePos: { left: "15%", top: "44%" }, depthOpacity: "opacity-100", phase: 2.8, freqX: 0.48, freqY: 0.44, ampX: 6, ampY: 6 },
  { stylePos: { left: "4%", top: "58%" }, depthOpacity: "opacity-80", phase: 3.7, freqX: 0.44, freqY: 0.52, ampX: 5, ampY: 6 },
  { stylePos: { left: "14%", top: "66%" }, depthOpacity: "opacity-100", phase: 4.5, freqX: 0.52, freqY: 0.42, ampX: 6, ampY: 6 },
  { stylePos: { left: "5%", top: "79%" }, depthOpacity: "opacity-75", phase: 5.2, freqX: 0.4, freqY: 0.48, ampX: 5, ampY: 5 },
  { stylePos: { left: "16%", top: "82%" }, depthOpacity: "opacity-90", phase: 5.9, freqX: 0.48, freqY: 0.46, ampX: 5, ampY: 6 },

  // Right outer & inner staggered columns (8 cards)
  { stylePos: { right: "4%", top: "14%" }, depthOpacity: "opacity-75", phase: 0.7, freqX: 0.44, freqY: 0.42, ampX: 5, ampY: 6 },
  { stylePos: { right: "14%", top: "22%" }, depthOpacity: "opacity-100", phase: 1.6, freqX: 0.4, freqY: 0.52, ampX: 6, ampY: 6 },
  { stylePos: { right: "5%", top: "36%" }, depthOpacity: "opacity-80", phase: 2.4, freqX: 0.5, freqY: 0.4, ampX: 5, ampY: 7 },
  { stylePos: { right: "15%", top: "44%" }, depthOpacity: "opacity-100", phase: 3.3, freqX: 0.42, freqY: 0.5, ampX: 6, ampY: 6 },
  { stylePos: { right: "4%", top: "58%" }, depthOpacity: "opacity-80", phase: 4.1, freqX: 0.52, freqY: 0.44, ampX: 5, ampY: 6 },
  { stylePos: { right: "14%", top: "66%" }, depthOpacity: "opacity-100", phase: 4.9, freqX: 0.42, freqY: 0.5, ampX: 6, ampY: 6 },
  { stylePos: { right: "5%", top: "79%" }, depthOpacity: "opacity-75", phase: 5.6, freqX: 0.48, freqY: 0.42, ampX: 5, ampY: 5 },
  { stylePos: { right: "16%", top: "82%" }, depthOpacity: "opacity-90", phase: 6.3, freqX: 0.44, freqY: 0.52, ampX: 5, ampY: 5 },
];

export function FluidTechStackLayer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const floatRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const centerCacheRef = useRef<Array<{ cx: number; cy: number }>>([]);
  const offsetStateRef = useRef(
    TECH_STACK_CARDS.map(() => ({ pushX: 0, pushY: 0 }))
  );

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion()) return;

    let isCancelled = false;

    // Cache card center coordinates on layout/resize instead of querying getBoundingClientRect every frame!
    const rebuildCenterCache = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const containerRect = container.getBoundingClientRect();
      centerCacheRef.current = DESKTOP_ANCHORS.map((anchor) => {
        const leftPct = anchor.stylePos.left ? parseFloat(String(anchor.stylePos.left)) / 100 : null;
        const rightPct = anchor.stylePos.right ? parseFloat(String(anchor.stylePos.right)) / 100 : null;
        const topPct = parseFloat(String(anchor.stylePos.top ?? "50%")) / 100;
        const cardHalf = 36;
        const cx =
          leftPct !== null
            ? containerRect.left + w * leftPct + cardHalf
            : containerRect.left + w * (1 - (rightPct ?? 0)) - cardHalf;
        const cy = containerRect.top + h * topPct + cardHalf;
        return { cx, cy };
      });
    };

    const handleMove = (e: PointerEvent) => {
      pointerRef.current.x = e.clientX;
      pointerRef.current.y = e.clientY;
      pointerRef.current.active = true;
    };

    const handleLeave = () => {
      pointerRef.current.active = false;
    };

    rebuildCenterCache();
    const ro = new ResizeObserver(rebuildCenterCache);
    ro.observe(container);
    window.addEventListener("pointermove", handleMove, { passive: true });
    window.addEventListener("pointerleave", handleLeave);

    const animateTick = (timeSec: number) => {
      if (isCancelled) return;
      if (parseFloat(container.style.opacity || getComputedStyle(container).opacity) < 0.02) return;

      const mx = pointerRef.current.x;
      const my = pointerRef.current.y;
      const pointerActive = pointerRef.current.active;
      const centers = centerCacheRef.current;

      for (let i = 0; i < TECH_STACK_CARDS.length; i++) {
        const el = floatRefs.current[i];
        const anchor = DESKTOP_ANCHORS[i];
        const st = offsetStateRef.current[i];
        const center = centers[i];
        if (!el || !anchor) continue;

        // Calm ±2% liquid breathing drift (4s period, zero frantic jitter)
        const floatX = Math.sin(timeSec * anchor.freqX + anchor.phase) * anchor.ampX;
        const floatY = Math.cos(timeSec * anchor.freqY + anchor.phase) * anchor.ampY;
        const rot = Math.sin(timeSec * 0.34 + anchor.phase) * 1.6;

        // Soft fluid pointer parting using cached anchor coordinates
        let targetPushX = 0;
        let targetPushY = 0;
        if (pointerActive && center) {
          const dx = center.cx - mx;
          const dy = center.cy - my;
          const dist = Math.hypot(dx, dy);
          if (dist < 115 && dist > 1) {
            const strength = ((115 - dist) / 115) * 16;
            targetPushX = (dx / dist) * strength;
            targetPushY = (dy / dist) * strength;
          }
        }

        st.pushX += (targetPushX - st.pushX) * 0.09;
        st.pushY += (targetPushY - st.pushY) * 0.09;

        el.style.transform = `translate3d(${(floatX + st.pushX).toFixed(2)}px, ${(
          floatY + st.pushY
        ).toFixed(2)}px, 0) rotate(${rot.toFixed(2)}deg)`;
      }
    };

    gsap.ticker.add(animateTick);

    return () => {
      isCancelled = true;
      gsap.ticker.remove(animateTick);
      ro.disconnect();
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerleave", handleLeave);
    };
  }, []);

  return (
    <div
      ref={containerRef}
      className="tech-cards-stage pointer-events-none absolute inset-0 z-20 opacity-0"
    >
      {/* Desktop: 16 Unified Navy-Hairline Glass 1:1 Cards with Royal Bridge Blue Hover */}
      <div className="hidden h-full w-full md:block">
        {TECH_STACK_CARDS.map((tech, idx) => {
          const anchor = DESKTOP_ANCHORS[idx];
          return (
            <div
              key={tech.id}
              style={anchor.stylePos}
              className={`tech-card-converge pointer-events-auto absolute ${anchor.depthOpacity}`}
            >
              <div
                ref={(el) => {
                  floatRefs.current[idx] = el;
                }}
                className="group flex aspect-square w-16 cursor-pointer flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#11192B]/85 p-1.5 shadow-[0_14px_34px_rgba(0,0,0,0.42)] backdrop-blur-md transition-all duration-300 hover:border-[#2F6BF2]/75 hover:bg-[#15223D] hover:shadow-[0_14px_34px_rgba(47,107,242,0.24)] lg:w-[74px]"
                title={`${tech.name} — ${tech.category}`}
              >
                <TechStackLogo
                  id={tech.id}
                  className="h-7 w-7 transition-transform duration-300 group-hover:scale-110 lg:h-8 lg:w-8"
                />
                <span className="mt-1 truncate font-mono text-[8.5px] font-semibold tracking-tight text-white/75 transition-colors group-hover:text-white">
                  {tech.name}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Mobile: Compact Unified 1:1 Horizontal Strip */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-5 flex gap-2.5 overflow-x-auto px-5 pb-1 md:hidden">
        {TECH_STACK_CARDS.map((tech) => (
          <div
            key={tech.id}
            className="flex aspect-square w-16 shrink-0 flex-col items-center justify-center rounded-2xl border border-white/10 bg-[#11192B]/90 p-1.5 shadow-md"
          >
            <TechStackLogo id={tech.id} className="h-7 w-7" />
            <span className="mt-1 font-mono text-[8px] font-semibold text-white/80">
              {tech.name}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
