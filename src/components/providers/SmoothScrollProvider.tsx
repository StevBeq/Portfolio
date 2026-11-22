"use client";

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, registerGSAP } from "@/lib/gsap";

export interface PortalOrigin {
  xPercent: number;
  yPercent: number;
}

interface PortfolioLayerContextValue {
  /**
   * "layer1" = GSAP Scroll-Driven Showcase ("Benang Biru")
   * "layer2" = Strictly 1-Viewport Locked Bright Interactive Hub
   */
  activeLayer: "layer1" | "layer2";
  /** True during the 2-stage Cartoon Curtain + Mario Iris-Open transition */
  isEnteringLayer2: boolean;
  portalOrigin: PortalOrigin;
  enterLayer2: (origin?: PortalOrigin) => void;
  /** Called behind the 100%-opaque Cartoon Curtain to unmount Layer 1 & mount Layer 2 invisibly (ZERO 15px jump!) */
  commitLayer2BehindCurtain: () => void;
  /** Called when the Mario Iris finishes opening */
  finishEnterLayer2: () => void;
  returnToLayer1: (scrollToTop?: boolean) => void;
  scrollToSection: (selector: string) => void;
  scrollToPosition: (y: number) => void;
}

const PortfolioLayerContext = createContext<PortfolioLayerContextValue>({
  activeLayer: "layer1",
  isEnteringLayer2: false,
  portalOrigin: { xPercent: 50, yPercent: 50 },
  enterLayer2: () => {},
  commitLayer2BehindCurtain: () => {},
  finishEnterLayer2: () => {},
  returnToLayer1: () => {},
  scrollToSection: () => {},
  scrollToPosition: () => {},
});

export const usePortfolioLayer = () => useContext(PortfolioLayerContext);

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  registerGSAP();
  const [activeLayer, setActiveLayer] = useState<"layer1" | "layer2">("layer1");
  const [isEnteringLayer2, setIsEnteringLayer2] = useState(false);
  const [portalOrigin, setPortalOrigin] = useState<PortalOrigin>({ xPercent: 50, yPercent: 50 });

  const lenisRef = useRef<Lenis | null>(null);
  const savedScrollYRef = useRef(0);
  const pendingRestoreYRef = useRef<number | null>(null);

  useEffect(() => {
    registerGSAP();

    // When Layer 2 is active, destroy Lenis completely so Layer 2 runs with 0% scroll-engine overhead
    if (activeLayer === "layer2") {
      document.documentElement.classList.remove("lenis", "lenis-smooth", "lenis-stopped");
      window.scrollTo({ top: 0, behavior: "instant" as ScrollBehavior });
      return;
    }

    const lenis = new Lenis({
      duration: 1.15,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.5,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    const updateTicker = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(updateTicker);

    let raf1 = 0;
    let raf2 = 0;
    let refreshTimer: ReturnType<typeof setTimeout> | null = null;

    if (pendingRestoreYRef.current !== null) {
      const targetY = pendingRestoreYRef.current;
      pendingRestoreYRef.current = null;
      // Wait 2 frames for freshly-mounted Layer 1 pinned ScrollTriggers to measure full document height
      raf1 = requestAnimationFrame(() => {
        ScrollTrigger.refresh();
        raf2 = requestAnimationFrame(() => {
          window.scrollTo({ top: targetY, behavior: "instant" as ScrollBehavior });
          lenis.resize();
          ScrollTrigger.update();
          refreshTimer = setTimeout(() => {
            ScrollTrigger.refresh();
          }, 80);
        });
      });
    }

    return () => {
      cancelAnimationFrame(raf1);
      cancelAnimationFrame(raf2);
      if (refreshTimer) clearTimeout(refreshTimer);
      gsap.ticker.remove(updateTicker);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, [activeLayer]);

  /**
   * Starts Stage 1 (Royal-Blue Cartoon Curtain sweep) BEFORE mounting Layer 2 -> 0ms hitch!
   */
  const enterLayer2 = (origin?: PortalOrigin) => {
    if (activeLayer === "layer2" || isEnteringLayer2) return;
    savedScrollYRef.current = window.scrollY;
    setPortalOrigin(origin ?? { xPercent: 50, yPercent: 50 });
    if (lenisRef.current) {
      lenisRef.current.stop();
    }
    setIsEnteringLayer2(true);
  };

  /**
   * Executes behind the 100%-opaque Cartoon Curtain:
   * Truly unmounts Layer 1 (terminating all canvas RAFs + removing scrollbar invisibly!)
   * and mounts Layer 2 at its exact final width!
   */
  const commitLayer2BehindCurtain = () => {
    setActiveLayer("layer2");
  };

  /**
   * Ends the iris overlay cleanly once Layer 2 is 100% unveiled
   */
  const finishEnterLayer2 = () => {
    setIsEnteringLayer2(false);
  };

  /**
   * Remount Layer 1 cleanly when returning from Layer 2
   */
  const returnToLayer1 = (scrollToTop = false) => {
    setIsEnteringLayer2(false);
    pendingRestoreYRef.current = scrollToTop
      ? 0
      : Math.max(0, savedScrollYRef.current - window.innerHeight * 0.75);
    setActiveLayer("layer1");
  };

  const scrollToSection = (selector: string) => {
    const el = document.querySelector(selector);
    if (!el) return;
    if (lenisRef.current) {
      lenisRef.current.scrollTo(el as HTMLElement, { offset: 0 });
    } else {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const scrollToPosition = (y: number) => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(y);
    } else {
      window.scrollTo({ top: y, behavior: "smooth" });
    }
  };

  return (
    <PortfolioLayerContext.Provider
      value={{
        activeLayer,
        isEnteringLayer2,
        portalOrigin,
        enterLayer2,
        commitLayer2BehindCurtain,
        finishEnterLayer2,
        returnToLayer1,
        scrollToSection,
        scrollToPosition,
      }}
    >
      {children}
    </PortfolioLayerContext.Provider>
  );
}
