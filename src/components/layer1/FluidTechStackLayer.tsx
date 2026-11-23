"use client";

import React, { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";
import { TECH_STACK_CARDS, TechStackLogo } from "@/components/ui/TechStackIcons";

interface OrbitalNodeSpec {
  x: number;
  y: number;
  depthOpacity: string;
  phase: number;
  freqX: number;
  freqY: number;
  ampX: number;
  ampY: number;
}

const OUTER_ANGLES_DEG = [-70, -40, -12, 16, 46, 110, 140, 168, 196, 226] as const;
const INNER_ANGLES_DEG = [-28, 4, 34, 152, 184, 214] as const;

const OUTER_RX = 0.425;
const OUTER_RY = 0.345;
const INNER_RX = 0.31;
const INNER_RY = 0.255;

const ORBITAL_NODES: OrbitalNodeSpec[] = [
  ...OUTER_ANGLES_DEG.map((deg, idx) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: 0.5 + Math.cos(rad) * OUTER_RX,
      y: 0.5 + Math.sin(rad) * OUTER_RY,
      depthOpacity: idx % 2 === 0 ? "opacity-85" : "opacity-95",
      phase: idx * 0.65,
      freqX: 0.42 + (idx % 3) * 0.04,
      freqY: 0.48 + (idx % 4) * 0.03,
      ampX: 5,
      ampY: 6,
    };
  }),
  ...INNER_ANGLES_DEG.map((deg, idx) => {
    const rad = (deg * Math.PI) / 180;
    return {
      x: 0.5 + Math.cos(rad) * INNER_RX,
      y: 0.5 + Math.sin(rad) * INNER_RY,
      depthOpacity: "opacity-100",
      phase: 3.1 + idx * 0.72,
      freqX: 0.46 + (idx % 3) * 0.04,
      freqY: 0.44 + (idx % 2) * 0.05,
      ampX: 6,
      ampY: 5,
    };
  }),
];

/**
 * Shared normalized 0..1 coordinates for all 16 Stack satellite nodes.
 * Reused by AsciiParticlePortrait so particles burst directly from these orbital rings!
 */
export const ORBITAL_STACK_ORIGINS: ReadonlyArray<readonly [number, number]> = ORBITAL_NODES.map(
  (n) => [n.x, n.y] as const
);

export function FluidTechStackLayer() {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const floatRefs = useRef<Array<HTMLDivElement | null>>([]);
  const pointerRef = useRef({ x: -9999, y: -9999, active: false });
  const centerCacheRef = useRef<Array<{ cx: number; cy: number }>>([]);
  const offsetStateRef = useRef(TECH_STACK_CARDS.map(() => ({ pushX: 0, pushY: 0 })));

  useEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion()) return;

    let isCancelled = false;

    const rebuildCenterCache = () => {
      const w = container.clientWidth || window.innerWidth;
      const h = container.clientHeight || window.innerHeight;
      const containerRect = container.getBoundingClientRect();
      centerCacheRef.current = ORBITAL_STACK_ORIGINS.map(([nx, ny]) => ({
        cx: containerRect.left + w * nx,
        cy: containerRect.top + h * ny,
      }));
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
      if (parseFloat(container.style.opacity || getComputedStyle(container).opacity) < 0.02) {
        return;
      }

      const mx = pointerRef.current.x;
      const my = pointerRef.current.y;
      const pointerActive = pointerRef.current.active;
      const centers = centerCacheRef.current;

      for (let i = 0; i < TECH_STACK_CARDS.length; i++) {
        const el = floatRefs.current[i];
        const node = ORBITAL_NODES[i];
        const st = offsetStateRef.current[i];
        const center = centers[i];
        if (!el || !node) continue;

        const floatX = Math.sin(timeSec * node.freqX + node.phase) * node.ampX;
        const floatY = Math.cos(timeSec * node.freqY + node.phase) * node.ampY;
        const rot = Math.sin(timeSec * 0.34 + node.phase) * 1.5;

        let targetPushX = 0;
        let targetPushY = 0;
        if (pointerActive && center) {
          const dx = center.cx - mx;
          const dy = center.cy - my;
          const dist = Math.hypot(dx, dy);
          if (dist < 120 && dist > 1) {
            const strength = ((120 - dist) / 120) * 16;
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
      {/* Subtle Concentric Orbital Constellation Tracks matching satellite rings */}
      <svg
        aria-hidden
        className="pointer-events-none absolute inset-0 hidden h-full w-full md:block"
      >
        <ellipse
          cx="50%"
          cy="50%"
          rx="42.5%"
          ry="34.5%"
          fill="none"
          stroke="rgba(157,184,251,0.11)"
          strokeWidth="1"
          strokeDasharray="4 10"
        />
        <ellipse
          cx="50%"
          cy="50%"
          rx="31%"
          ry="25.5%"
          fill="none"
          stroke="rgba(157,184,251,0.11)"
          strokeWidth="1"
          strokeDasharray="4 10"
        />
      </svg>

      {/* Desktop: 16 Cosmic Orbital Satellite Nodes around unobstructed center */}
      <div className="hidden h-full w-full md:block">
        {TECH_STACK_CARDS.map((tech, idx) => {
          const node = ORBITAL_NODES[idx];
          return (
            <div
              key={tech.id}
              style={{ left: `${node.x * 100}%`, top: `${node.y * 100}%` }}
              className={`pointer-events-auto absolute -translate-x-1/2 -translate-y-1/2 ${node.depthOpacity}`}
            >
              <div className="tech-card-converge">
                <div
                  ref={(el) => {
                    floatRefs.current[idx] = el;
                  }}
                  className="group flex aspect-square w-16 cursor-pointer flex-col items-center justify-center rounded-[20px] border border-white/[0.11] bg-[#0B1326]/62 p-1.5 backdrop-blur-md shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-all duration-300 hover:border-[#2F6BF2]/80 hover:bg-[#132244]/85 hover:shadow-[0_0_26px_rgba(47,107,242,0.36)] lg:w-[74px]"
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
            </div>
          );
        })}
      </div>

      {/* Mobile: Compact Unified 1:1 Horizontal Strip */}
      <div className="pointer-events-auto absolute inset-x-0 bottom-5 flex gap-2.5 overflow-x-auto px-5 pb-1 md:hidden">
        {TECH_STACK_CARDS.map((tech) => (
          <div
            key={tech.id}
            className="flex aspect-square w-16 shrink-0 flex-col items-center justify-center rounded-[20px] border border-white/[0.11] bg-[#0B1326]/75 p-1.5 backdrop-blur-md shadow-md"
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
