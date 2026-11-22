"use client";

import React, { useCallback, useEffect, useRef } from "react";
import { ArrowRight, GripVertical } from "lucide-react";
import { gsap, isLowEndDevice, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { DotMatrixNameCanvas } from "@/components/canvas/DotMatrixNameCanvas";
import { usePortfolioLayer } from "@/components/providers/SmoothScrollProvider";
import { STEVBEQ_PROFILE } from "@/data/stevbeq";

// 4 elastic cord anchor points inside cartoon-glove.webp (900x260 viewBox)
// Cord #1 & #2 consume global --thread tokens — the continuous Blue Thread transformed into rubber cords!
const GLOVE_ANCHORS = [
  { x: 282, y: 95, sag: 32, color: "var(--thread)" },
  { x: 290, y: 115, sag: 40, color: "var(--thread-mid)" },
  { x: 286, y: 136, sag: 42, color: "#FFD23F" },
  { x: 274, y: 155, sag: 34, color: "#10131A" },
];

// Minimalist craft tags springing out behind the capsule during pull tension (ZERO Vermilion in PreLayer2!)
const BURST_TAGS = [
  { label: "NEXT.JS", bg: "#2F6BF2", color: "#FFFFFF", tx: -68, ty: -64, rot: -10 },
  { label: "FLUTTER", bg: "#10131A", color: "#FFFFFF", tx: 22, ty: -70, rot: 7 },
  { label: "LARAVEL", bg: "#FFD23F", color: "#10131A", tx: -46, ty: 62, rot: -8 },
  { label: "WORK ✦", bg: "#C7D8FC", color: "#10131A", tx: 52, ty: 60, rot: 9 },
];

export function PreLayer2PortalSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const portalStageRef = useRef<HTMLDivElement | null>(null);
  const sheetRef = useRef<HTMLDivElement | null>(null);

  // Direct DOM/SVG refs for 60fps zero-rerender cartoon physics & integrated capsule charge bar
  const cordOutlineRefs = useRef<Array<SVGPathElement | null>>([]);
  const cordFillRefs = useRef<Array<SVGPathElement | null>>([]);
  const gloveGroupRef = useRef<SVGGElement | null>(null);
  const strainFxRef = useRef<SVGGElement | null>(null);
  const popBurstRef = useRef<SVGGElement | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const handleHaloRef = useRef<HTMLDivElement | null>(null);
  const capsuleFillRef = useRef<HTMLDivElement | null>(null);
  const capsulePctRef = useRef<HTMLSpanElement | null>(null);
  const capsuleArrowRef = useRef<HTMLSpanElement | null>(null);
  const statusHintRef = useRef<HTMLSpanElement | null>(null);
  const stickerRefs = useRef<Array<HTMLSpanElement | null>>([]);

  // Physics state strictly in refs (0 React re-renders during drag/scroll/retract!)
  const tugPowerRef = useRef(0);
  const lastPumpTimeRef = useRef(0);
  const isSheetOpenRef = useRef(false);
  const isDraggingRef = useRef(false);
  const dragStartXRef = useRef(0);
  const dragBasePullRef = useRef(0);
  const isLaunchingRef = useRef(false);
  const physicsRafRef = useRef<number | null>(null);
  const freezeRafRef = useRef<number | null>(null);
  const freezeTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const { activeLayer, enterLayer2 } = usePortfolioLayer();

  // Pure 60fps render of cartoon glove, 4 elastic cords, holding vibration & integrated pill progress bar
  const renderRig = useCallback(
    (rawPull: number, snapped = false, nowMs = 0, isFreezeBeat = false) => {
      const p = Math.max(0, Math.min(1.08, rawPull));
      const clamped = Math.min(1, p);
      tugPowerRef.current = p;

      const isSmallScreen = typeof window !== "undefined" && window.innerWidth < 640;
      const maxTravelPx = isSmallScreen ? 64 : 155;
      const handleOffsetX = p * maxTravelPx;
      const svgAttachX = 562 + p * (isSmallScreen ? 145 : 172);
      const svgAttachY = 128;

      // Progressive holding vibration (peaks crisply during the 0.25s silent tension-freeze beat!)
      const vibIntensity = isFreezeBeat
        ? 1.15
        : !snapped && clamped > 0.25
        ? Math.pow((clamped - 0.25) / 0.75, 1.3)
        : 0;
      const vibX = Math.sin(nowMs * 0.068) * vibIntensity * 5.2;
      const vibY = Math.cos(nowMs * 0.094) * vibIntensity * 4.2;

      // Smooth Cartoon Glove Asset pulls back, stretches slightly & vibrates under holding tension!
      if (gloveGroupRef.current) {
        const shiftX = snapped ? -26 : clamped * 16 + vibX * 0.75;
        const shiftY = snapped ? 4 : vibY * 0.65;
        const rot = snapped ? -9 : clamped * 4.2 + vibY * 0.4;
        const squashX = snapped ? 0.94 : 1 + clamped * 0.04;
        const squashY = snapped ? 1.06 : 1 - clamped * 0.025;
        gloveGroupRef.current.setAttribute(
          "transform",
          `translate(${shiftX.toFixed(1)}, ${shiftY.toFixed(1)}) rotate(${rot.toFixed(2)} 160 120) scale(${squashX.toFixed(3)}, ${squashY.toFixed(3)})`
        );
      }

      // Comic sweat drop & Star Yellow action sparks around straining cartoon glove
      if (strainFxRef.current) {
        const alpha = snapped
          ? 0
          : isFreezeBeat
          ? 1
          : Math.max(0, Math.min(1, (clamped - 0.2) * 1.6));
        const pulse = isFreezeBeat
          ? 1.15 + Math.sin(nowMs * 0.055) * 0.14
          : 0.85 + Math.sin(nowMs * 0.025) * 0.15;
        strainFxRef.current.style.opacity = alpha.toFixed(2);
        strainFxRef.current.setAttribute(
          "transform",
          `translate(${(vibX * 0.5).toFixed(1)}, ${(-alpha * 5 + vibY * 0.5).toFixed(1)}) scale(${(0.75 + alpha * 0.28 * pulse).toFixed(2)})`
        );
      }

      // Starburst Pop FX when cords snap!
      if (popBurstRef.current) {
        popBurstRef.current.style.opacity = snapped ? "1" : "0";
        popBurstRef.current.setAttribute(
          "transform",
          `translate(${svgAttachX.toFixed(1)}, ${svgAttachY}) scale(${snapped ? "1.18" : "0.3"})`
        );
      }

      // 4 Chunky Cartoon Rubber-Band Cords anchored cleanly inside the gripped fist
      GLOVE_ANCHORS.forEach((anchor, i) => {
        const outlineEl = cordOutlineRefs.current[i];
        const fillEl = cordFillRefs.current[i];
        if (!outlineEl || !fillEl) return;

        const ax = anchor.x + (snapped ? -24 : clamped * 15 + vibX * 0.7);
        const ay = anchor.y + (snapped ? 4 : vibY * 0.65);

        let d = "";
        if (snapped) {
          const endX = ax + 56 + i * 10;
          const endY = ay + 46 + i * 8;
          d = `M ${ax.toFixed(1)} ${ay.toFixed(1)} Q ${((ax + endX) / 2).toFixed(1)} ${(ay + 52).toFixed(1)} ${endX.toFixed(1)} ${endY.toFixed(1)}`;
          outlineEl.setAttribute("opacity", "0.28");
          fillEl.setAttribute("opacity", "0.5");
        } else {
          const slackFactor = Math.pow(1 - clamped, 1.55);
          const sagY = anchor.sag * slackFactor;
          const buzz = Math.sin(nowMs * 0.075 + i * 1.9) * vibIntensity * 7.5;
          const midX1 = ax + (svgAttachX - ax) * 0.36;
          const midX2 = ax + (svgAttachX - ax) * 0.68;
          const attachOffset = (i - 1.5) * 9;
          const yEnd = svgAttachY + attachOffset;
          const c1y = ay + sagY + buzz;
          const c2y = yEnd + sagY * 0.72 - buzz;
          d = `M ${ax.toFixed(1)} ${ay.toFixed(1)} C ${midX1.toFixed(1)} ${c1y.toFixed(1)}, ${midX2.toFixed(1)} ${c2y.toFixed(1)}, ${svgAttachX.toFixed(1)} ${yEnd.toFixed(1)}`;
          outlineEl.setAttribute("opacity", "1");
          fillEl.setAttribute("opacity", "1");
        }

        outlineEl.setAttribute("d", d);
        fillEl.setAttribute("d", d);
      });

      // Capsule slides + vibrates + fills its own internal Royal Blue liquid charge bar!
      if (handleRef.current) {
        const tilt = snapped ? 4 : clamped * 2.2 + vibY * 0.35;
        const pressScale = 1 + vibIntensity * 0.04;
        handleRef.current.style.transform = `translate3d(${(handleOffsetX + vibX * 0.6).toFixed(1)}px, ${(vibY * 0.55).toFixed(1)}px, 0) rotate(${tilt.toFixed(2)}deg) scale(${pressScale.toFixed(3)})`;
      }

      if (handleHaloRef.current) {
        handleHaloRef.current.style.opacity = (clamped * 0.85).toFixed(2);
        handleHaloRef.current.style.transform = `translate3d(${handleOffsetX.toFixed(1)}px, 0, 0) scale(${(0.85 + clamped * 0.65).toFixed(3)})`;
      }

      // Single-element GPU liquid charge fill inside EXPLORE MORE capsule
      if (capsuleFillRef.current) {
        capsuleFillRef.current.style.transform = `scaleX(${clamped.toFixed(3)})`;
      }

      const pct = Math.round(clamped * 100);
      if (capsulePctRef.current && capsuleArrowRef.current) {
        if (pct > 0 || snapped || isFreezeBeat) {
          capsulePctRef.current.style.display = "inline";
          capsuleArrowRef.current.style.display = "none";
          capsulePctRef.current.textContent = snapped
            ? "GO!"
            : isFreezeBeat
            ? "100%"
            : `${pct}%`;
        } else {
          capsulePctRef.current.style.display = "none";
          capsuleArrowRef.current.style.display = "inline-flex";
        }
      }

      // Burst capability stickers
      BURST_TAGS.forEach((chip, i) => {
        const el = stickerRefs.current[i];
        if (!el) return;
        const localP = Math.max(0, Math.min(1, (clamped - 0.14 - i * 0.06) / 0.52));
        const pop =
          localP === 0
            ? 0
            : 1 + 2.2 * Math.pow(localP - 1, 3) + 1.2 * Math.pow(localP - 1, 2);
        const x = handleOffsetX * 0.44 + chip.tx * pop;
        const y = chip.ty * pop;
        const sc = 0.5 + pop * 0.52;
        const rot = chip.rot * pop;
        el.style.opacity = Math.min(1, localP * 1.7).toFixed(2);
        el.style.transform = `translate3d(${x.toFixed(1)}px, ${y.toFixed(1)}px, 0) scale(${sc.toFixed(3)}) rotate(${rot.toFixed(1)}deg)`;
      });

      // Clean centered reactive hint right below the cartoon rig
      if (statusHintRef.current) {
        const isRetracting =
          !snapped &&
          !isFreezeBeat &&
          !isDraggingRef.current &&
          clamped > 0.03 &&
          nowMs - lastPumpTimeRef.current > 220;

        if (snapped) {
          statusHintRef.current.textContent = "HERE WE GO! ✦";
        } else if (isFreezeBeat) {
          statusHintRef.current.textContent = "MAX TENSION — SNAPPING...";
        } else if (isRetracting) {
          statusHintRef.current.textContent = "WHOA — SLIPPING BACK! KEEP PULLING";
        } else if (pct >= 72) {
          statusHintRef.current.textContent = "ALMOST THERE — KEEP GOING!";
        } else if (pct >= 20) {
          statusHintRef.current.textContent = "HOLDING TENSION — KEEP SCROLLING OR DRAGGING";
        } else {
          statusHintRef.current.textContent = "DRAG THE PILL · KEEP SCROLLING · OR CLICK";
        }
      }
    },
    []
  );

  // Launch with the signature 0.25s silent tension-freeze beat ("slow... slow... SNAP") before portalSnap!
  const triggerCartoonPortal = useCallback(() => {
    if (isLaunchingRef.current) return;
    isLaunchingRef.current = true;

    if (physicsRafRef.current !== null) {
      cancelAnimationFrame(physicsRafRef.current);
      physicsRafRef.current = null;
    }

    const computeHandleOrigin = () => {
      const el = handleRef.current;
      if (el && typeof window !== "undefined") {
        const r = el.getBoundingClientRect();
        return {
          xPercent: Math.round(((r.left + r.width / 2) / window.innerWidth) * 100),
          yPercent: Math.round(((r.top + r.height / 2) / window.innerHeight) * 100),
        };
      }
      return { xPercent: 60, yPercent: 54 };
    };

    const runSilentFreezeThenSnap = () => {
      if (prefersReducedMotion()) {
        renderRig(1.04, true, performance.now(), false);
        enterLayer2(computeHandleOrigin());
        return;
      }

      // Dramatic 0.25s beat hening at 100% (sweat drop trembling!) -> SNAP!
      const tremble = (now: number) => {
        renderRig(1, false, now, true);
        freezeRafRef.current = requestAnimationFrame(tremble);
      };
      freezeRafRef.current = requestAnimationFrame(tremble);

      freezeTimeoutRef.current = setTimeout(() => {
        if (freezeRafRef.current !== null) {
          cancelAnimationFrame(freezeRafRef.current);
          freezeRafRef.current = null;
        }
        renderRig(1.04, true, performance.now(), false);
        enterLayer2(computeHandleOrigin());
      }, 250);
    };

    const startVal = tugPowerRef.current;
    if (startVal < 0.86) {
      const proxy = { p: startVal };
      gsap.to(proxy, {
        p: 1,
        duration: 0.28,
        ease: "liquidFlow",
        onUpdate: () => renderRig(proxy.p, false, performance.now(), false),
        onComplete: runSilentFreezeThenSnap,
      });
    } else {
      runSilentFreezeThenSnap();
    }
  }, [enterLayer2, renderRig]);

  // Ultra-lightweight Elastic Pull-Back Loop (0% idle CPU — automatically stops at 0%)
  const ensurePhysicsLoop = useCallback(() => {
    if (physicsRafRef.current !== null) return;
    let lastFrame = performance.now();

    const step = (now: number) => {
      const dt = Math.min(0.05, (now - lastFrame) / 1000);
      lastFrame = now;

      if (isLaunchingRef.current) {
        physicsRafRef.current = null;
        return;
      }

      if (!isDraggingRef.current && now - lastPumpTimeRef.current > 210) {
        const current = tugPowerRef.current;
        const retractSpeed = 0.2 + current * 0.25;
        const nextVal = Math.max(0, current - retractSpeed * dt);
        renderRig(nextVal, false, now, false);

        if (nextVal <= 0.001) {
          renderRig(0, false, now, false);
          physicsRafRef.current = null;
          return;
        }
      } else if (tugPowerRef.current > 0.001) {
        renderRig(tugPowerRef.current, false, now, false);
      }

      physicsRafRef.current = requestAnimationFrame(step);
    };

    physicsRafRef.current = requestAnimationFrame(step);
  }, [renderRig]);

  // Pump capsule charge bar on downward wheel ticks once sheet is open; stopping lets it drain & retract!
  useEffect(() => {
    const onWheel = (e: WheelEvent) => {
      if (activeLayer !== "layer1" || !isSheetOpenRef.current || isLaunchingRef.current) return;
      if (e.deltaY > 1) {
        lastPumpTimeRef.current = performance.now();
        const impulse = Math.min(0.13, Math.max(0.015, (e.deltaY / 100) * 0.088));
        const nextVal = Math.min(1, tugPowerRef.current + impulse);
        renderRig(nextVal, false, lastPumpTimeRef.current, false);
        ensurePhysicsLoop();

        if (nextVal >= 0.96) {
          triggerCartoonPortal();
        }
      }
    };

    window.addEventListener("wheel", onWheel, { passive: true });
    return () => {
      window.removeEventListener("wheel", onWheel);
      if (physicsRafRef.current !== null) {
        cancelAnimationFrame(physicsRafRef.current);
        physicsRafRef.current = null;
      }
      if (freezeRafRef.current !== null) {
        cancelAnimationFrame(freezeRafRef.current);
        freezeRafRef.current = null;
      }
      if (freezeTimeoutRef.current !== null) {
        clearTimeout(freezeTimeoutRef.current);
        freezeTimeoutRef.current = null;
      }
    };
  }, [activeLayer, ensurePhysicsLoop, renderRig, triggerCartoonPortal]);

  // Clean reset when mounted/returning to Layer 1
  useEffect(() => {
    if (activeLayer === "layer1") {
      isLaunchingRef.current = false;
      isDraggingRef.current = false;
      tugPowerRef.current = 0;
      renderRig(0, false, 0, false);
    }
  }, [activeLayer, renderRig]);

  const handlePointerDown = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (isLaunchingRef.current) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    isDraggingRef.current = true;
    dragStartXRef.current = e.clientX;
    dragBasePullRef.current = tugPowerRef.current;
    lastPumpTimeRef.current = performance.now();
    ensurePhysicsLoop();
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current || isLaunchingRef.current) return;
    const dx = e.clientX - dragStartXRef.current;
    const nextPull = Math.max(0, Math.min(1, dragBasePullRef.current + dx / 160));
    lastPumpTimeRef.current = performance.now();
    renderRig(nextPull, false, lastPumpTimeRef.current, false);
    if (nextPull >= 0.88) {
      isDraggingRef.current = false;
      triggerCartoonPortal();
    }
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLButtonElement>) => {
    if (!isDraggingRef.current) return;
    isDraggingRef.current = false;
    const dx = Math.abs(e.clientX - dragStartXRef.current);

    if (dx < 8) {
      triggerCartoonPortal();
      return;
    }

    lastPumpTimeRef.current = performance.now() - 180;
    ensurePhysicsLoop();
  };

  useGSAP(
    () => {
      const reducedMotion = prefersReducedMotion();
      const lowEnd = isLowEndDevice();

      if (reducedMotion) {
        if (sheetRef.current) {
          gsap.set(sheetRef.current, { y: 0, yPercent: 0, borderRadius: 0 });
        }
        isSheetOpenRef.current = true;
        return;
      }

      gsap.from(".vortex-stage-reveal", {
        y: 32,
        opacity: 0,
        duration: 0.95,
        ease: "liquidRise",
        scrollTrigger: {
          trigger: ".vortex-stage",
          start: "top 78%",
          toggleActions: "play none none reverse",
        },
      });

      if (!portalStageRef.current || !sheetRef.current) return;

      gsap.set(sheetRef.current, {
        y: 0,
        yPercent: 91,
        borderTopLeftRadius: "32px",
        borderTopRightRadius: "32px",
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "footer-pull-portal",
          trigger: portalStageRef.current,
          start: "top top",
          end: "+=235%",
          pin: true,
          scrub: lowEnd ? 0.5 : 0.75,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            sheetRef.current?.classList.toggle("is-animating", self.isActive);
          },
          onUpdate: (self) => {
            isSheetOpenRef.current = self.progress >= 0.4;
            if (!isSheetOpenRef.current && tugPowerRef.current > 0 && !isDraggingRef.current) {
              ensurePhysicsLoop();
            }
          },
        },
      });

      tl.to(".footer-arc-svg", { rotate: -5, scale: 1.04, duration: 0.34, ease: "none" }, 0)
        .to(
          ".footer-intro-copy",
          { y: -44, opacity: 0, scale: 0.96, duration: 0.34, ease: "liquidFlow" },
          0.08
        )
        .to(
          sheetRef.current,
          {
            y: 0,
            yPercent: 0,
            borderTopLeftRadius: "0px",
            borderTopRightRadius: "0px",
            duration: 0.38,
            ease: "awwwardsExpo",
          },
          0.02
        )
        .to(
          ".sheet-teaser-bar",
          { opacity: 0, yPercent: -100, duration: 0.16, ease: "liquidFlow" },
          0.2
        )
        .fromTo(
          ".pull-stage-header",
          { y: 24, opacity: 0 },
          { y: 0, opacity: 1, stagger: 0.05, duration: 0.2, ease: "liquidRise" },
          0.22
        )
        .fromTo(
          ".rig-enter-left",
          { x: -115, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.22, ease: "liquidSettle" },
          0.24
        )
        .fromTo(
          ".rig-enter-right",
          { x: 105, scale: 0.82, opacity: 0 },
          { x: 0, scale: 1, opacity: 1, duration: 0.22, ease: "liquidSettle" },
          0.26
        )
        .to({}, { duration: 0.56 }, 0.44);
    },
    { scope: sectionRef }
  );

  return (
    /* MONOTONIC DAWN SEAMLESS WASH: #F4F5F8 Cool Cloud (from Projects) -> #C7D8FC -> #2F6BF2 Royal Bridge Blue (ZERO dark regression!) */
    <section
      id="pre-layer2"
      ref={sectionRef}
      className="relative w-full overflow-hidden text-white select-none"
      style={{
        background:
          "linear-gradient(180deg, #F4F5F8 0%, #D9E5FD 9%, #7EA6F8 20%, #2F6BF2 34%, #245CE0 58%, #1B4AC4 82%, #1740AF 100%)",
      }}
    >
      {/* Subtle Single-Blue Atmospheric Depth Clouds (Royal Bridge Blue Tints Only) */}
      <div
        aria-hidden
        className="pointer-events-none absolute top-[26%] left-1/2 h-[520px] w-[820px] -translate-x-1/2 rounded-full bg-[#C7D8FC]/20 blur-[125px]"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute top-[40%] left-[18%] h-[340px] w-[420px] rounded-full bg-[#9DB8FB]/18 blur-[110px]"
      />

      {/* Junction E Atmospheric Blue Wash Bridge from Cool Cloud Selected Projects */}
      <div className="relative z-10 flex h-[28vh] min-h-[160px] w-full flex-col items-center justify-end pb-4">
        <div className="h-24 w-[1.5px] bg-gradient-to-b from-[#2F6BF2]/30 via-[#2F6BF2] to-white/60" />
      </div>

      {/* ================= PART A: CALM MINIMALIST DOT-MATRIX DRIFT "STEVBEQ" (NO SUBLINE) ================= */}
      <div className="vortex-stage relative flex min-h-screen w-full flex-col justify-between px-6 py-4 sm:px-10">
        {/* Balanced Top Chrome (h-14) */}
        <div className="relative z-10 mx-auto flex h-14 w-full max-w-7xl shrink-0 items-center justify-between border-b border-white/15 font-mono text-[11px] tracking-widest text-white/70 uppercase">
          <span>06 // THE BLUE THREAD</span>
          <span className="text-[#C7D8FC]">STEVBEQ · YOGYAKARTA</span>
        </div>

        <div className="vortex-stage-reveal relative z-10 mx-auto my-auto flex w-full max-w-6xl flex-col items-center">
          <DotMatrixNameCanvas
            text="STEVBEQ"
            className="h-[290px] sm:h-[370px] lg:h-[430px]"
          />
        </div>

        {/* Balanced Bottom Chrome (h-14) */}
        <div className="relative z-10 mx-auto flex h-14 w-full max-w-7xl shrink-0 items-center justify-between border-t border-white/15 font-mono text-[11px] tracking-widest text-white/65 uppercase">
          <span>FULLSTACK WEB &amp; MOBILE</span>
          <span>KEEP SCROLLING ↓</span>
        </div>
      </div>

      {/* ================= PART B: "ONE LAST THING." -> LOCKED CARTOON GLOVE PULL ARENA ================= */}
      <div
        ref={portalStageRef}
        className="relative h-screen min-h-[640px] w-full overflow-hidden bg-transparent text-[#F4F5F8]"
      >
        {/* BEAT 1: Minimalist Royal Blue "ONE LAST THING." (ZERO Vermilion!) */}
        <div className="footer-intro-copy relative z-10 mx-auto flex h-full w-full max-w-6xl flex-col items-center justify-center px-6 pb-24 text-center">
          <p className="font-mono text-[11px] font-semibold tracking-[0.28em] text-[#C7D8FC] uppercase">
            STEVEN ARNALDO · PORTFOLIO
          </p>

          <h2 className="font-display mt-4 text-5xl font-extrabold tracking-tight text-white uppercase drop-shadow-[0_12px_32px_rgba(16,19,26,0.22)] sm:text-6xl lg:text-7xl">
            ONE LAST THING<span className="text-[#C7D8FC]">.</span>
          </h2>

          <p className="mt-4 max-w-md text-sm font-medium leading-relaxed text-[#E8F0FE] sm:text-base">
            Want the complete picture? Keep pulling.
          </p>

          <svg
            viewBox="0 0 820 140"
            className="footer-arc-svg mt-5 h-24 w-full max-w-3xl overflow-visible sm:h-28"
            aria-label="Steven Arnaldo Setiawan — StevBeq"
          >
            <defs>
              <path id="stevbeq-footer-arc" d="M 55 126 Q 410 10 765 126" fill="none" />
            </defs>
            <text
              fill="#FFFFFF"
              fillOpacity="0.92"
              className="font-unbounded text-[18px] font-extrabold tracking-[0.22em] uppercase sm:text-[20px]"
            >
              <textPath href="#stevbeq-footer-arc" startOffset="50%" textAnchor="middle">
                ✦ STEVEN ARNALDO · STEVBEQ ✦
              </textPath>
            </text>
          </svg>
        </div>

        {/* BEAT 2: LOCKED CARTOON PULL ARENA (Cool Cloud #F4F5F8 + Royal #2F6BF2 + Star Yellow #FFD23F) */}
        <div
          ref={sheetRef}
          className="absolute inset-0 z-20 flex h-full w-full flex-col justify-between overflow-hidden bg-[#F4F5F8] text-[#10131A] shadow-[0_-28px_80px_rgba(16,19,26,0.28)]"
        >
          {/* Minimalist Sheet Edge Handle Peek */}
          <div className="sheet-teaser-bar pointer-events-none absolute inset-x-0 top-0 z-30 flex flex-col items-center justify-center gap-2 bg-[#F4F5F8] pt-4 pb-3">
            <span className="h-1.5 w-14 rounded-full bg-[#2F6BF2]/30" />
            <span className="font-mono text-[10px] font-bold tracking-[0.26em] text-[#10131A]/45 uppercase">
              07 // SCROLL TO CONTINUE ↓
            </span>
          </div>

          {/* Main Full-Screen Balanced Pull Arena */}
          <div className="relative flex h-full flex-1 flex-col justify-between px-6 py-4 sm:px-10">
            {/* Subtle Comic Halftone Dot Field (Strictly Royal Bridge Blue #2F6BF2 — ONLY in Finale!) */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-45"
              style={{
                backgroundImage: "radial-gradient(rgba(47,107,242,0.16) 1.2px, transparent 1.2px)",
                backgroundSize: "22px 22px",
              }}
            />

            {/* Balanced Top Chrome (h-14) */}
            <div className="pull-stage-header relative z-20 mx-auto flex h-14 w-full max-w-6xl shrink-0 items-center justify-between border-b border-[#10131A]/[0.08] font-mono text-[11px] tracking-widest text-[#10131A]/50 uppercase">
              <span>07 // LAYER 2 GATEWAY</span>
              <span className="text-[#2F6BF2]">@{STEVBEQ_PROFILE.handle} · FULLSTACK</span>
            </div>

            {/* Playful Cartoon Corner Accents (Star Yellow #FFD23F + Royal #2F6BF2 — ZERO Vermilion!) */}
            <svg
              aria-hidden
              viewBox="0 0 80 80"
              className="pull-stage-header pointer-events-none absolute top-24 left-8 hidden h-10 w-10 opacity-85 md:block lg:left-14"
              fill="none"
            >
              <path
                d="M40 8 L46 28 L66 34 L46 40 L40 60 L34 40 L14 34 L34 28 Z"
                fill="#FFD23F"
                stroke="#10131A"
                strokeWidth="3.5"
                strokeLinejoin="round"
              />
            </svg>
            <svg
              aria-hidden
              viewBox="0 0 80 80"
              className="pull-stage-header pointer-events-none absolute top-24 right-10 hidden h-9 w-9 opacity-85 md:block lg:right-16"
              fill="none"
            >
              <circle cx="40" cy="40" r="14" fill="#2F6BF2" stroke="#10131A" strokeWidth="3.5" />
              <circle cx="62" cy="20" r="6" fill="#FFD23F" stroke="#10131A" strokeWidth="3" />
            </svg>

            {/* Centered Balanced Editorial Headline (Bricolage Grotesque + 1 Instrument Serif Italic Phrase) */}
            <div className="pull-stage-header relative z-20 mx-auto mt-3 flex w-full max-w-4xl flex-col items-center text-center">
              <h3 className="leading-[0.94] tracking-tight">
                <span className="font-display block text-4xl font-extrabold text-[#10131A] uppercase sm:text-5xl lg:text-[3.75rem]">
                  PULL TO EXPLORE
                </span>
                <span className="font-serif-italic mt-1 block text-4xl font-normal text-[#2F6BF2] sm:text-5xl lg:text-[3.9rem]">
                  the full workspace.
                </span>
              </h3>
            </div>

            {/* Centerpiece: LOCKED CARTOON GLOVE + 4 ELASTIC CORDS + LIVE-CHARGING "EXPLORE MORE" CAPSULE */}
            <div className="relative z-10 mx-auto my-auto flex w-full max-w-5xl flex-col items-center justify-center">
              <div className="relative h-[220px] w-full sm:h-[255px]">
                <svg
                  viewBox="0 0 900 260"
                  className="pointer-events-none absolute inset-0 h-full w-full overflow-visible"
                  preserveAspectRatio="xMidYMid meet"
                >
                  {/* Pull Guide Track & Star Yellow Comic Goal */}
                  <line
                    x1="555"
                    y1="128"
                    x2="778"
                    y2="128"
                    stroke="#10131A"
                    strokeOpacity="0.16"
                    strokeWidth="3"
                    strokeDasharray="8 8"
                    strokeLinecap="round"
                  />
                  <path
                    d="M 784 114 L 788 124 L 798 128 L 788 132 L 784 142 L 780 132 L 770 128 L 780 124 Z"
                    fill="#FFD23F"
                    stroke="#10131A"
                    strokeWidth="2.8"
                    strokeLinejoin="round"
                  />

                  {/* 4 Chunky Cartoon Elastic Rubber-Band Cords (Including the Royal Blue Thread!) */}
                  <g className="rig-enter-left">
                    {GLOVE_ANCHORS.map((a, i) => (
                      <g key={`cord-${i}`}>
                        <path
                          ref={(el) => {
                            cordOutlineRefs.current[i] = el;
                          }}
                          d={`M ${a.x} ${a.y} C 375 ${a.y + a.sag}, 465 ${128 + a.sag * 0.7}, 562 128`}
                          fill="none"
                          stroke="#10131A"
                          strokeWidth="8.5"
                          strokeLinecap="round"
                        />
                        <path
                          ref={(el) => {
                            cordFillRefs.current[i] = el;
                          }}
                          d={`M ${a.x} ${a.y} C 375 ${a.y + a.sag}, 465 ${128 + a.sag * 0.7}, 562 128`}
                          fill="none"
                          stroke={a.color}
                          strokeWidth="4.2"
                          strokeLinecap="round"
                        />
                      </g>
                    ))}
                  </g>

                  {/* Studio-Quality Smooth Rubber-Hose White Cartoon Glove (21KB transparent WebP) */}
                  <g className="rig-enter-left">
                    <g ref={gloveGroupRef}>
                      <image
                        href="/assets/ui/cartoon-glove.webp"
                        x="-26"
                        y="46"
                        width="358"
                        height="147"
                        preserveAspectRatio="xMidYMid meet"
                        style={{ filter: "drop-shadow(0px 10px 10px rgba(16, 19, 26, 0.18))" }}
                      />

                      {/* Kinetic Sweat Drop (#9DB8FB) & Star Yellow Strain Sparks (#FFD23F) */}
                      <g ref={strainFxRef} style={{ opacity: 0 }}>
                        <path
                          d="M 164 34 C 164 34, 152 49, 164 53 C 176 49, 164 34, 164 34 Z"
                          fill="#9DB8FB"
                          stroke="#10131A"
                          strokeWidth="2.8"
                          strokeLinejoin="round"
                        />
                        <path
                          d="M 278 44 L 296 28 M 298 56 L 320 48 M 248 202 L 262 218"
                          stroke="#FFD23F"
                          strokeWidth="4.5"
                          strokeLinecap="round"
                        />
                      </g>
                    </g>
                  </g>

                  {/* Star Yellow Comic Starburst Pop FX when Cords Snap! */}
                  <g ref={popBurstRef} style={{ opacity: 0 }}>
                    <path
                      d="M 0 -58 L 10 -20 L 46 -38 L 22 -6 L 58 8 L 20 18 L 36 52 L 4 26 L -18 56 L -14 18 L -54 20 L -22 -4 L -46 -36 L -10 -18 Z"
                      fill="#FFD23F"
                      stroke="#10131A"
                      strokeWidth="3.5"
                      strokeLinejoin="round"
                    />
                  </g>
                </svg>

                {/* Bursting Capability Stickers */}
                <div className="pointer-events-none absolute top-1/2 left-[60%] z-10 -translate-y-1/2 sm:left-[62%]">
                  {BURST_TAGS.map((chip, i) => (
                    <span
                      key={chip.label}
                      ref={(el) => {
                        stickerRefs.current[i] = el;
                      }}
                      className="absolute top-0 left-0 inline-flex items-center rounded-full border-2 border-[#10131A] px-3 py-1 font-mono text-[10px] font-black tracking-wider whitespace-nowrap uppercase shadow-[0_3px_0_#10131A]"
                      style={{
                        backgroundColor: chip.bg,
                        color: chip.color,
                        opacity: 0,
                        transform: "translate3d(0,0,0) scale(0.5)",
                      }}
                    >
                      {chip.label}
                    </span>
                  ))}
                </div>

                {/* INTEGRATED LIVE-CHARGING CARTOON CAPSULE ("EXPLORE MORE" + Liquid Fill + Live %) */}
                <div className="rig-enter-right absolute top-1/2 left-[51%] z-30 -translate-y-1/2 sm:left-[56%]">
                  <div
                    ref={handleHaloRef}
                    aria-hidden
                    className="pointer-events-none absolute -inset-4 rounded-full bg-gradient-to-r from-[#2F6BF2]/45 via-[#9DB8FB]/40 to-[#FFD23F]/40 opacity-0 blur-xl"
                  />

                  <button
                    ref={handleRef}
                    type="button"
                    onPointerDown={handlePointerDown}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerCancel={handlePointerUp}
                    style={{ touchAction: "none" }}
                    className="group relative flex items-center gap-3 overflow-hidden rounded-full border-[3px] border-[#10131A] bg-[#10131A] px-6 py-3.5 text-white shadow-[0_7px_0_#10131A] transition-colors duration-150 active:cursor-grabbing cursor-grab sm:px-7 sm:py-4"
                  >
                    {/* Live Single-Element Liquid Royal Blue Charge Fill Bar inside the pill! */}
                    <div
                      ref={capsuleFillRef}
                      aria-hidden
                      className="pointer-events-none absolute inset-0 origin-left"
                      style={{
                        transform: "scaleX(0)",
                        backgroundImage:
                          "linear-gradient(90deg, #2F6BF2 0%, #5887F6 60%, #9DB8FB 100%)",
                      }}
                    />

                    {/* Glossy Cartoon Top Reflection */}
                    <span
                      aria-hidden
                      className="pointer-events-none absolute top-1.5 right-8 left-8 z-10 h-1.5 rounded-full bg-white/25"
                    />

                    <GripVertical className="relative z-10 h-4 w-4 text-white/75" />
                    <span className="font-display relative z-10 text-xs font-extrabold tracking-wide whitespace-nowrap uppercase drop-shadow-[0_1.5px_0_#10131A] sm:text-sm">
                      EXPLORE MORE
                    </span>

                    {/* Morphing Star Yellow End-Badge: Arrow at 0%, Live % while pulling, 100% during freeze, GO! on snap */}
                    <span className="relative z-10 flex h-7 min-w-[38px] items-center justify-center rounded-full border-2 border-[#10131A] bg-[#FFD23F] px-2 font-mono text-[10.5px] font-black text-[#10131A] transition-transform duration-150 group-hover:translate-x-0.5">
                      <span ref={capsuleArrowRef} className="inline-flex items-center justify-center">
                        <ArrowRight className="h-3.5 w-3.5 stroke-[2.8]" />
                      </span>
                      <span ref={capsulePctRef} style={{ display: "none" }}>
                        0%
                      </span>
                    </span>
                  </button>
                </div>
              </div>

              {/* Clean Centered Dynamic Comic Hint Pill right below the pull rig */}
              <div className="pull-stage-header mt-2 inline-flex items-center gap-2 rounded-full border-2 border-[#10131A]/12 bg-white/95 px-4 py-1.5 shadow-xs backdrop-blur-sm">
                <span className="h-2 w-2 rounded-full bg-[#2F6BF2]" />
                <span
                  ref={statusHintRef}
                  className="font-mono text-[10px] font-extrabold tracking-[0.16em] text-[#10131A]/65 uppercase"
                >
                  DRAG THE PILL · KEEP SCROLLING · OR CLICK
                </span>
              </div>
            </div>

            {/* Balanced Bottom Direct-Action Footer Strip (Exact h-14) */}
            <footer className="pull-stage-header relative z-10 mx-auto flex h-14 w-full max-w-6xl shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[#10131A]/[0.08] font-mono text-[10.5px] font-semibold text-[#10131A]/55">
              <span>
                {STEVBEQ_PROFILE.location.city.toUpperCase()} · {STEVBEQ_PROFILE.location.timezone}
              </span>

              <div className="flex flex-wrap items-center gap-4">
                <a
                  href={`mailto:${STEVBEQ_PROFILE.contact.email}`}
                  className="font-bold text-[#10131A] transition hover:text-[#2F6BF2]"
                >
                  Email ↗
                </a>
                <a
                  href="https://wa.me/6287739280104"
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#10131A] transition hover:text-[#2F6BF2]"
                >
                  WhatsApp ↗
                </a>
                <a
                  href={STEVBEQ_PROFILE.contact.github}
                  target="_blank"
                  rel="noreferrer"
                  className="font-bold text-[#10131A] transition hover:text-[#2F6BF2]"
                >
                  GitHub ↗
                </a>
              </div>

              <span>© 2026 {STEVBEQ_PROFILE.fullName.toUpperCase()}</span>
            </footer>
          </div>
        </div>
      </div>
    </section>
  );
}
