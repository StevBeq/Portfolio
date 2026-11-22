"use client";

import React, { useEffect, useRef, useState } from "react";

const TUBES_CDN_URL =
  "https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js";

interface TubesAppInstance {
  three: {
    size: { width: number; height: number; wWidth: number; wHeight: number };
    onBeforeRender: (e: { elapsed: number; delta: number }) => void;
  };
  tubes: {
    target: { x: number; y: number; z: number; set: (x: number, y: number, z: number) => void };
    update: (e: { elapsed: number; delta: number }) => void;
    setColors: (colors: string[]) => void;
    setLightsColors: (colors: string[]) => void;
  };
  dispose?: () => void;
}

const CURATED_PALETTES: Array<{ tubes: string[]; lights: string[] }> = [
  // 1. StevBeq Signature (Blueprint Blue, Vermilion, Indigo)
  {
    tubes: ["#2563EB", "#E0462E", "#6958D5"],
    lights: ["#38BDF8", "#FF6B4A", "#818CF8", "#FACC15"],
  },
  // 2. Iconic TubesCursor Reference Palette (Neon Magenta, Lime, Violet)
  {
    tubes: ["#F967FB", "#53BC28", "#6958D5"],
    lights: ["#83F36E", "#FE8A2E", "#FF008A", "#60AED5"],
  },
  // 3. Deep Cyber Ocean (Cyan, Royal Blue, Orchid)
  {
    tubes: ["#06B6D4", "#3B82F6", "#A855F7"],
    lights: ["#38BDF8", "#818CF8", "#E879F9", "#2DD4BF"],
  },
  // 4. Warm Ember (Vermilion, Gold, Rose)
  {
    tubes: ["#FF4D00", "#FACC15", "#EC4899"],
    lights: ["#FB923C", "#FDE047", "#F472B6", "#38BDF8"],
  },
];

const randomHexColor = () =>
  "#" +
  Math.floor(Math.random() * 0xffffff)
    .toString(16)
    .padStart(6, "0");

interface TubesBackgroundProps {
  children?: React.ReactNode;
  className?: string;
  enableClickInteraction?: boolean;
}

export function TubesBackground({
  children,
  className = "",
  enableClickInteraction = true,
}: TubesBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const tubesRef = useRef<TubesAppInstance | null>(null);
  const paletteIndexRef = useRef(0);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    let mounted = true;
    let instance: TubesAppInstance | null = null;

    const initTubes = async () => {
      if (!canvasRef.current) return;

      try {
        const dynamicImport = new Function("url", "return import(url)") as (
          url: string
        ) => Promise<{ default: (canvas: HTMLCanvasElement, config: unknown) => TubesAppInstance }>;

        const mod = await dynamicImport(TUBES_CDN_URL);
        if (!mounted || !canvasRef.current) return;

        const TubesCursor = mod.default;
        const initial = CURATED_PALETTES[0];

        instance = TubesCursor(canvasRef.current, {
          tubes: {
            colors: initial.tubes,
            lerp: 0.35,
            noise: 0.045,
            lights: {
              intensity: 200,
              colors: initial.lights,
            },
          },
        });

        // Autonomous slow-motion sculptural 3D infinity / Lissajous ribbon using native Perlin physics.
        // Mouse-hover tracking is intentionally bypassed so the ribbon flows serenely behind the typography.
        instance.three.onBeforeRender = (e: { elapsed: number; delta: number }) => {
          if (!instance) return;
          const t = e.elapsed;
          const rx = (instance.three.size.wWidth || 10) * 0.28;
          const ry = (instance.three.size.wHeight || 6) * 0.25;

          // Dreamy slow-mo figure-8 ribbon (~15s per full harmonic orbit)
          instance.tubes.target.set(
            Math.cos(t * 0.42) * rx,
            Math.sin(t * 0.84) * ry,
            Math.sin(t * 0.63) * 0.35
          );
          instance.tubes.update(e);
        };

        tubesRef.current = instance;
        setIsLoaded(true);
      } catch (err) {
        console.error("Failed to initialize 3D TubesBackground:", err);
      }
    };

    initTubes();

    return () => {
      mounted = false;
      if (instance?.dispose) {
        try {
          instance.dispose();
        } catch {
          // Clean WebGL context teardown
        }
      }
      tubesRef.current = null;
    };
  }, []);

  const handleBackgroundClick = () => {
    if (!enableClickInteraction || !tubesRef.current) return;

    paletteIndexRef.current += 1;
    if (paletteIndexRef.current < CURATED_PALETTES.length) {
      const next = CURATED_PALETTES[paletteIndexRef.current];
      tubesRef.current.tubes.setColors(next.tubes);
      tubesRef.current.tubes.setLightsColors(next.lights);
    } else {
      tubesRef.current.tubes.setColors([randomHexColor(), randomHexColor(), randomHexColor()]);
      tubesRef.current.tubes.setLightsColors([
        randomHexColor(),
        randomHexColor(),
        randomHexColor(),
        randomHexColor(),
      ]);
    }
  };

  return (
    <div
      onClick={handleBackgroundClick}
      className={`relative h-full w-full overflow-hidden bg-[#050608] ${className}`}
    >
      {/* Slow-motion 3D Sculptural Neon Infinity Ribbon (Zero mouse-hover distraction) */}
      <canvas
        ref={canvasRef}
        className={`pointer-events-none absolute inset-0 z-10 block h-full w-full transition-opacity duration-700 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
        style={{ touchAction: "none" }}
      />

      {/* Subtle Radial Vignette behind Center Text for effortless contrast */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[15]"
        style={{
          background:
            "radial-gradient(circle at 50% 50%, rgba(5,6,8,0.42) 0%, rgba(5,6,8,0.08) 52%, rgba(5,6,8,0.5) 100%)",
        }}
      />

      {/* Crisp Foreground Hero Content Overlay */}
      <div className="pointer-events-none relative z-20 h-full w-full">{children}</div>
    </div>
  );
}

export default TubesBackground;
