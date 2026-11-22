"use client";

import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Flip } from "gsap/Flip";
import { CustomEase } from "gsap/CustomEase";
import { useGSAP } from "@gsap/react";

let isRegistered = false;
let fontsRefreshScheduled = false;

export function isLowEndDevice(): boolean {
  if (typeof window === "undefined") return false;
  const nav = navigator as Navigator & { deviceMemory?: number };
  const cores = typeof nav.hardwareConcurrency === "number" ? nav.hardwareConcurrency : 8;
  const mem = typeof nav.deviceMemory === "number" ? nav.deviceMemory : 8;
  return cores < 4 || mem < 4;
}

export function prefersReducedMotion(): boolean {
  if (typeof window === "undefined") return false;
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function registerGSAP() {
  if (typeof window === "undefined" || isRegistered) return;

  gsap.registerPlugin(ScrollTrigger, Flip, CustomEase, useGSAP);

  // Prevent jumps after tab switch or heavy frame; keep 1:1 with Lenis RAF ticker
  gsap.ticker.lagSmoothing(0);
  ScrollTrigger.config({ ignoreMobileResize: true });

  // "Slow Boil, Hard Snap" — Strictly separated Liquid (Layer 1) vs Cartoon (Finale) motion curves
  CustomEase.create("liquidRise", "M0,0 C0.16,0.84 0.24,1 1,1");
  CustomEase.create("liquidFlow", "M0,0 C0.42,0 0.18,1 1,1");
  CustomEase.create("liquidSettle", "M0,0 C0.18,0.88 0.32,1.06 0.56,1.06 0.72,1.06 0.84,1 1,1");

  // Existing signature curves (portalSnap reserved strictly for the 3 cartoon snap beats)
  CustomEase.create("awwwardsExpo", "M0,0 C0.19,1 0.22,1 1,1");
  CustomEase.create("portalSnap", "M0,0 C0.7,0 0.2,1 1,1");

  // Refresh ScrollTrigger ONCE after web fonts finish loading
  if (!fontsRefreshScheduled && document.fonts?.ready) {
    fontsRefreshScheduled = true;
    document.fonts.ready.then(() => {
      ScrollTrigger.refresh();
    });
  }

  isRegistered = true;
}

if (typeof window !== "undefined") {
  registerGSAP();
}

export { gsap, ScrollTrigger, Flip, CustomEase, useGSAP };
