"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, isLowEndDevice, prefersReducedMotion } from "@/lib/gsap";
import { ORBITAL_STACK_ORIGINS } from "@/components/layer1/FluidTechStackLayer";

export type PortraitRenderMode = "ascii" | "hybrid" | "photo";

interface AsciiParticle {
  x: number;
  y: number;
  // Formation 1: Steven's Portrait (dead-center virtual box inside 100vw x 100vh)
  originX: number;
  originY: number;
  // Formation 0: 16 Tech Stack Card Origins + Full-Viewport Swarm (2A!)
  stackX: number;
  stackY: number;
  swirlDir: number;
  swirlAmp: number;
  // Formation 2: Giant SB Monogram Morph Target at 50% 50% (3A Varian i!)
  monoX: number;
  monoY: number;
  isMonoDot: boolean;
  isAmbientHalo: boolean;
  vx: number;
  vy: number;
  char: string;
  color: string;
}

interface SubjectCropBox {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

interface AsciiParticlePortraitProps {
  src?: string;
  defaultMode?: PortraitRenderMode;
  /** Scroll-driven mode ("ascii" -> "hybrid" -> "photo") */
  controlledMode?: PortraitRenderMode;
  /** Mutable 0..1 ref: 0 = dispersed across Cosmic Hand & orbital deck, 1 = assembled into Steven's face */
  assemblyRef?: React.RefObject<number>;
  /** Mutable 0..1 ref: 0 = centered 50% showcase, 1 = glided gracefully left (27% desktop / upper mobile) for side-by-side bio */
  portraitShiftRef?: React.RefObject<number>;
  /** Mutable 0..1 ref: 0 = Steven's face, 1 = re-assembled directly into giant SB Monogram at 50% 50%! */
  monogramMorphRef?: React.RefObject<number>;
  cellSize?: number;
  className?: string;
  showModeToggle?: boolean;
  tintBlue?: boolean;
  repulsionRadius?: number;
  paused?: boolean;
}

function computeShiftTransform(width: number, height: number, shift: number) {
  const s = Math.max(0, Math.min(1, shift));
  const e = s * s * (3 - 2 * s);
  if (width >= 768) {
    return {
      shiftX: (width * 0.27 - width * 0.5) * e,
      shiftY: Math.min(10, height * 0.012) * e,
      scaleMult: 1 - 0.06 * e,
    };
  }
  return {
    shiftX: 0,
    shiftY: -height * 0.19 * e,
    scaleMult: 1 - 0.3 * e,
  };
}

// Bright-on-dark polarity: low luma -> subtle glyphs, high luma -> luminous glyphs
const ASCII_RAMP_DARK_BG = [".", ":", "-", "=", "+", "*", "c", "v", "s", "S", "B", "%", "#", "@"];

export function AsciiParticlePortrait({
  src = "/assets/me/Foto-Semi-Formal.webp",
  defaultMode = "ascii",
  controlledMode,
  assemblyRef,
  portraitShiftRef,
  monogramMorphRef,
  cellSize = 4,
  className = "",
  showModeToggle = false,
  tintBlue = true,
  repulsionRadius = 92,
  paused = false,
}: AsciiParticlePortraitProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [mode, setMode] = useState<PortraitRenderMode>(controlledMode ?? defaultMode);
  const [isLoaded, setIsLoaded] = useState(false);

  const particlesRef = useRef<AsciiParticle[]>([]);
  const mouseRef = useRef({ x: -9999, y: -9999, active: false });
  const visibleRef = useRef(true);
  const pausedRef = useRef(paused);
  const modeRef = useRef<PortraitRenderMode>(mode);
  const imageRef = useRef<HTMLImageElement | null>(null);
  const cropRef = useRef<SubjectCropBox | null>(null);
  const layoutSizeRef = useRef({ width: 0, height: 0 });
  const effectiveStepRef = useRef(cellSize);

  useEffect(() => {
    if (controlledMode) {
      setMode(controlledMode);
    }
  }, [controlledMode]);

  useEffect(() => {
    modeRef.current = mode;
  }, [mode]);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    const container = containerRef.current;
    if (!canvas || !container) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const lowEnd = isLowEndDevice();
    const reducedMotion = prefersReducedMotion();
    let isCancelled = false;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    const detectSubjectCrop = (loadedImg: HTMLImageElement): SubjectCropBox => {
      const probeMax = 360;
      const probeScale = Math.min(
        1,
        probeMax / Math.max(loadedImg.naturalWidth, loadedImg.naturalHeight)
      );
      const pw = Math.max(1, Math.round(loadedImg.naturalWidth * probeScale));
      const ph = Math.max(1, Math.round(loadedImg.naturalHeight * probeScale));

      const probeCanvas = document.createElement("canvas");
      probeCanvas.width = pw;
      probeCanvas.height = ph;
      const pCtx = probeCanvas.getContext("2d", { willReadFrequently: true });
      if (!pCtx) {
        return { sx: 0, sy: 0, sw: loadedImg.naturalWidth, sh: loadedImg.naturalHeight };
      }

      pCtx.drawImage(loadedImg, 0, 0, pw, ph);
      const data = pCtx.getImageData(0, 0, pw, ph).data;

      let minX = pw;
      let maxX = 0;
      let minY = ph;
      let maxY = 0;

      for (let y = 0; y < ph; y++) {
        for (let x = 0; x < pw; x++) {
          const i = (y * pw + x) * 4;
          const r = data[i];
          const g = data[i + 1];
          const b = data[i + 2];
          const a = data[i + 3];
          const isWhiteBg = r > 235 && g > 235 && b > 235;
          if (a >= 40 && !isWhiteBg) {
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      if (maxX <= minX || maxY <= minY) {
        return { sx: 0, sy: 0, sw: loadedImg.naturalWidth, sh: loadedImg.naturalHeight };
      }

      const padX = Math.round((maxX - minX) * 0.04);
      const padTop = Math.round((maxY - minY) * 0.03);
      const sx = Math.max(0, Math.floor((minX - padX) / probeScale));
      const sy = Math.max(0, Math.floor((minY - padTop) / probeScale));
      const ex = Math.min(loadedImg.naturalWidth, Math.ceil((maxX + padX) / probeScale));
      const ey = Math.min(loadedImg.naturalHeight, Math.ceil(maxY / probeScale));

      return { sx, sy, sw: Math.max(1, ex - sx), sh: Math.max(1, ey - sy) };
    };

    // Virtual centered portrait placement inside full-viewport 100vw x 100vh canvas (ZERO hard box!)
    const computeDrawPlacement = (width: number, height: number, crop: SubjectCropBox) => {
      const boxW = Math.min(430, width * 0.46);
      const boxH = Math.min(520, height * 0.68);
      const scale = Math.min((boxW * 0.96) / crop.sw, (boxH * 0.96) / crop.sh);
      const drawW = crop.sw * scale;
      const drawH = crop.sh * scale;
      const offsetX = (width - drawW) * 0.5;
      const offsetY = (height - drawH) * 0.5 + Math.min(18, height * 0.02);
      return { drawW, drawH, offsetX, offsetY };
    };

    // Sample the EXACT centered 560px SB Monogram geometry (scaled 0.36x) for 1:1 seamless Face -> SB Morph!
    const sampleMonogramTargets = (
      width: number,
      height: number
    ): Array<{ x: number; y: number; isDot: boolean }> => {
      const monoScreenSize = (width < 640 ? 480 : 560) * 0.36;
      const sampleRes = 180;
      const off = document.createElement("canvas");
      off.width = sampleRes;
      off.height = sampleRes;
      const oCtx = off.getContext("2d", { willReadFrequently: true });
      if (!oCtx) return [];

      const s = sampleRes / 560;
      oCtx.save();
      oCtx.scale(s, s);

      // Left S diagonal bars matching SB vector SVG exact coordinates
      const drawRoundedRect = (
        x: number,
        y: number,
        w: number,
        h: number,
        r: number,
        angleDeg: number
      ) => {
        oCtx.save();
        oCtx.translate(x, y);
        oCtx.rotate((angleDeg * Math.PI) / 180);
        oCtx.beginPath();
        oCtx.roundRect(0, 0, w, h, r);
        oCtx.fill();
        oCtx.restore();
      };

      oCtx.fillStyle = "#FFFFFF";
      drawRoundedRect(76, 228, 172, 52, 26, -34);
      drawRoundedRect(76, 344, 172, 52, 26, -34);

      // Right B geometric frame
      oCtx.strokeStyle = "#FFFFFF";
      oCtx.lineWidth = 52;
      oCtx.lineCap = "round";
      oCtx.lineJoin = "round";
      oCtx.beginPath();
      oCtx.moveTo(276, 142);
      oCtx.lineTo(374, 142);
      oCtx.bezierCurveTo(417.63, 142, 453, 177.37, 453, 221);
      oCtx.bezierCurveTo(453, 245.88, 441.51, 268.08, 423.54, 282.55);
      oCtx.bezierCurveTo(441.51, 297.02, 453, 319.22, 453, 344.1);
      oCtx.bezierCurveTo(453, 387.73, 417.63, 423.1, 374, 423.1);
      oCtx.lineTo(276, 423.1);
      oCtx.stroke();

      // Center Signature Vermilion Dot at (280, 280)
      oCtx.fillStyle = "#FF0000";
      oCtx.beginPath();
      oCtx.arc(280, 280, 34, 0, Math.PI * 2);
      oCtx.fill();

      oCtx.restore();

      const data = oCtx.getImageData(0, 0, sampleRes, sampleRes).data;
      const targets: Array<{ x: number; y: number; isDot: boolean }> = [];
      const cx = width * 0.5;
      const cy = height * 0.5;
      const step = 2;

      for (let py = 0; py < sampleRes; py += step) {
        for (let px = 0; px < sampleRes; px += step) {
          const i = (py * sampleRes + px) * 4;
          const r = data[i];
          const g = data[i + 1];
          const a = data[i + 3];
          if (a > 120) {
            const normX = px / sampleRes - 0.5;
            const normY = py / sampleRes - 0.5;
            targets.push({
              x: cx + normX * monoScreenSize,
              y: cy + normY * monoScreenSize,
              isDot: r > 200 && g < 60,
            });
          }
        }
      }

      // Deterministic shuffle so particles fly gracefully from all parts of face to all parts of SB
      for (let i = targets.length - 1; i > 0; i--) {
        const j = (i * 2654435761) % (i + 1);
        const tmp = targets[i];
        targets[i] = targets[j];
        targets[j] = tmp;
      }

      return targets;
    };

    const drawSoftBorderlessPhoto = (
      width: number,
      height: number,
      alpha: number,
      shift = 0
    ) => {
      if (!imageRef.current || !cropRef.current || alpha <= 0.01) return;
      const { drawW, drawH, offsetX, offsetY } = computeDrawPlacement(
        width,
        height,
        cropRef.current
      );
      const { shiftX, shiftY, scaleMult } = computeShiftTransform(width, height, shift);
      const baseCx = width * 0.5;
      const baseCy = height * 0.5 + Math.min(18, height * 0.02);
      const scaledW = drawW * scaleMult;
      const scaledH = drawH * scaleMult;
      const destX = baseCx + (offsetX - baseCx) * scaleMult + shiftX;
      const destY = baseCy + (offsetY - baseCy) * scaleMult + shiftY;

      ctx.save();
      ctx.globalAlpha = Math.min(1, alpha);
      ctx.drawImage(
        imageRef.current,
        cropRef.current.sx,
        cropRef.current.sy,
        cropRef.current.sw,
        cropRef.current.sh,
        destX,
        destY,
        scaledW,
        scaledH
      );

      // Soft bottom feather gradient melting waist smoothly into #0D1524 Navy Bridge (ZERO harsh horizontal cut!)
      const fadeStart = destY + scaledH * 0.8;
      const fadeEnd = destY + scaledH + 4;
      const grad = ctx.createLinearGradient(0, fadeStart, 0, fadeEnd);
      grad.addColorStop(0, "rgba(13, 21, 36, 0)");
      grad.addColorStop(1, "rgba(13, 21, 36, 1)");
      ctx.fillStyle = grad;
      ctx.fillRect(destX - 12, fadeStart, scaledW + 24, fadeEnd - fadeStart + 8);
      ctx.restore();
    };

    const paintOnce = () => {
      const { width, height } = layoutSizeRef.current;
      if (width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);
      const currentMode = modeRef.current;
      const shift = portraitShiftRef ? Math.max(0, Math.min(1, portraitShiftRef.current ?? 0)) : 0;

      if (currentMode === "photo") {
        drawSoftBorderlessPhoto(width, height, 1, shift);
        return;
      }

      if (currentMode === "hybrid") {
        drawSoftBorderlessPhoto(width, height, 0.42, shift);
      }

      const { shiftX, shiftY, scaleMult } = computeShiftTransform(width, height, shift);
      const baseCx = width * 0.5;
      const baseCy = height * 0.5 + Math.min(18, height * 0.02);

      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const fontSize = Math.max(5.5, effectiveStepRef.current + 1.4);
      ctx.font = `700 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

      const particles = particlesRef.current;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        const px = baseCx + (p.originX - baseCx) * scaleMult + shiftX;
        const py = baseCy + (p.originY - baseCy) * scaleMult + shiftY;
        ctx.fillStyle = p.color;
        ctx.fillText(p.char, px, py);
      }
    };

    const buildParticles = () => {
      if (!img.complete || img.naturalWidth === 0 || isCancelled) return;
      imageRef.current = img;

      if (!cropRef.current) {
        cropRef.current = detectSubjectCrop(img);
      }
      const crop = cropRef.current;

      const width = Math.max(320, container.clientWidth || window.innerWidth);
      const height = Math.max(320, container.clientHeight || window.innerHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      layoutSizeRef.current = { width, height };
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // Render cropped subject cleanly onto a tight offscreen buffer matching virtual draw rect
      const { drawW, drawH, offsetX, offsetY } = computeDrawPlacement(width, height, crop);
      const bufW = Math.max(64, Math.ceil(drawW));
      const bufH = Math.max(64, Math.ceil(drawH));

      const offscreen = document.createElement("canvas");
      offscreen.width = bufW;
      offscreen.height = bufH;
      const offCtx = offscreen.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.clearRect(0, 0, bufW, bufH);
      offCtx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, bufW, bufH);

      const imageData = offCtx.getImageData(0, 0, bufW, bufH).data;
      const step = Math.max(4, lowEnd ? cellSize + 2 : cellSize);
      effectiveStepRef.current = step;

      const monoTargets = sampleMonogramTargets(width, height);
      const nextParticles: AsciiParticle[] = [];
      let pIdx = 0;

      for (let ly = Math.floor(step / 2); ly < bufH; ly += step) {
        for (let lx = Math.floor(step / 2); lx < bufW; lx += step) {
          const idx = (ly * bufW + lx) * 4;
          const r = imageData[idx];
          const g = imageData[idx + 1];
          const b = imageData[idx + 2];
          const a = imageData[idx + 3];

          const isWhiteBg = r > 236 && g > 236 && b > 236;
          if (a < 40 || isWhiteBg) continue;

          const originX = offsetX + lx;
          const originY = offsetY + ly;

          const rawLuma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
          const contrastLuma = Math.max(0, Math.min(1, (rawLuma - 0.12) * 1.18));
          const charIdx = Math.min(
            ASCII_RAMP_DARK_BG.length - 1,
            Math.floor(contrastLuma * (ASCII_RAMP_DARK_BG.length - 1))
          );

          let color: string;
          if (tintBlue) {
            if (contrastLuma < 0.45) {
              const t = contrastLuma / 0.45;
              const rr = Math.round(28 + t * (47 - 28));
              const gg = Math.round(62 + t * (107 - 62));
              const bb = Math.round(143 + t * (242 - 143));
              color = `rgb(${rr}, ${gg}, ${bb})`;
            } else {
              const t = (contrastLuma - 0.45) / 0.55;
              const rr = Math.round(47 + t * (244 - 47));
              const gg = Math.round(107 + t * (245 - 107));
              const bb = Math.round(242 + t * (248 - 242));
              color = `rgb(${rr}, ${gg}, ${bb})`;
            }
          } else {
            color = `rgb(${Math.min(255, Math.round(r * 1.08 + 20))}, ${Math.min(
              255,
              Math.round(g * 1.08 + 20)
            )}, ${Math.min(255, Math.round(b * 1.08 + 24))})`;
          }

          // 2A Formation 0: 75% burst directly FROM the 16 Tech Stack cards, 25% sweep across full 100vw x 100vh!
          const seedA = Math.sin(pIdx * 12.9898 + 1.23) * 43758.5453;
          const randA = seedA - Math.floor(seedA);
          const seedB = Math.sin(pIdx * 78.233 + 4.56) * 43758.5453;
          const randB = seedB - Math.floor(seedB);

          let stackX: number;
          let stackY: number;
          if (pIdx % 4 !== 0) {
            const card = ORBITAL_STACK_ORIGINS[pIdx % ORBITAL_STACK_ORIGINS.length];
            const burstAngle = randA * Math.PI * 2;
            const burstRad = 12 + randB * 135;
            stackX = card[0] * width + Math.cos(burstAngle) * burstRad;
            stackY = card[1] * height + Math.sin(burstAngle) * burstRad;
          } else {
            // Wide full-screen ink galaxy scatter across top, bottom, and corners!
            stackX = randA * width;
            stackY = randB * height;
          }

          // 3A Formation 2: Deterministic SB Monogram pixel target at exact 50% 50%!
          const monoTarget = monoTargets.length
            ? monoTargets[pIdx % monoTargets.length]
            : { x: width * 0.5, y: height * 0.5, isDot: false };

          const isEdge = lx < bufW * 0.14 || lx > bufW * 0.86 || ly < bufH * 0.14;
          const isAmbientHalo = isEdge && pIdx % 7 === 0;

          const startAssembly = assemblyRef ? assemblyRef.current ?? 0 : 1;
          const initX = originX + (stackX - originX) * (1 - startAssembly);
          const initY = originY + (stackY - originY) * (1 - startAssembly);

          nextParticles.push({
            x: initX,
            y: initY,
            originX,
            originY,
            stackX,
            stackY,
            swirlDir: pIdx % 2 === 0 ? 1 : -1,
            swirlAmp: 45 + randA * 115,
            monoX: monoTarget.x,
            monoY: monoTarget.y,
            isMonoDot: monoTarget.isDot,
            isAmbientHalo,
            vx: 0,
            vy: 0,
            char: ASCII_RAMP_DARK_BG[charIdx],
            color,
          });
          pIdx += 1;
        }
      }

      particlesRef.current = nextParticles;
      setIsLoaded(true);
      paintOnce();
    };

    const handleWindowPointerMove = (e: PointerEvent) => {
      if (pausedRef.current || !visibleRef.current) return;
      const rect = container.getBoundingClientRect();
      mouseRef.current.x = e.clientX - rect.left;
      mouseRef.current.y = e.clientY - rect.top;
      mouseRef.current.active = true;
    };

    const handleWindowPointerLeave = () => {
      mouseRef.current.active = false;
    };

    window.addEventListener("pointermove", handleWindowPointerMove, { passive: true });
    window.addEventListener("pointerleave", handleWindowPointerLeave);

    let photoAlpha = modeRef.current === "photo" ? 1 : modeRef.current === "hybrid" ? 0.42 : 0;
    let asciiAlpha = modeRef.current === "photo" ? 0 : 1;

    const renderTick = (timeSec: number) => {
      if (isCancelled || !visibleRef.current || pausedRef.current) return;

      const { width, height } = layoutSizeRef.current;
      if (width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      const assembly = assemblyRef ? Math.max(0, Math.min(1, assemblyRef.current ?? 1)) : 1;
      const shift = portraitShiftRef ? Math.max(0, Math.min(1, portraitShiftRef.current ?? 0)) : 0;
      const monoMorph = monogramMorphRef
        ? Math.max(0, Math.min(1, monogramMorphRef.current ?? 0))
        : 0;

      const { shiftX, shiftY, scaleMult } = computeShiftTransform(width, height, shift);
      const baseCx = width * 0.5;
      const baseCy = height * 0.5 + Math.min(18, height * 0.02);

      // Smoothly crossfade photo layer (only visible once face is assembled & before SB morph!)
      const currentMode = modeRef.current;
      const inMonoMorph = monoMorph > 0.03;
      const targetPhotoAlpha =
        inMonoMorph || assembly < 0.85
          ? 0
          : currentMode === "photo"
          ? 1
          : currentMode === "hybrid"
          ? 0.44
          : 0;
      const targetAsciiAlpha =
        inMonoMorph
          ? 1
          : currentMode === "photo" && assembly >= 0.95
          ? 0.08
          : currentMode === "hybrid"
          ? 0.78
          : 1;

      photoAlpha += (targetPhotoAlpha - photoAlpha) * 0.16;
      asciiAlpha += (targetAsciiAlpha - asciiAlpha) * 0.16;

      if (photoAlpha > 0.01) {
        drawSoftBorderlessPhoto(width, height, photoAlpha, shift);
      }

      if (asciiAlpha <= 0.008) return;

      const particles = particlesRef.current;
      const mx = mouseRef.current.x;
      const my = mouseRef.current.y;
      const isMouseActive = mouseRef.current.active && assembly > 0.82 && monoMorph < 0.08;
      const radSq = repulsionRadius * repulsionRadius;

      const scatterFactor = 1 - assembly;
      // Curved vortex arcs peak mid-flight during Stack->Face (assembly=0.5) & Face->SB (monoMorph=0.5)!
      const gatherSwirl = Math.sin(assembly * Math.PI);
      const monoSwirl = Math.sin(monoMorph * Math.PI);

      ctx.save();
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      const fontSize = Math.max(5.5, effectiveStepRef.current + 1.4);
      ctx.font = `700 ${fontSize}px ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace`;

      const onlyHaloDust = !inMonoMorph && currentMode === "photo" && photoAlpha > 0.88;

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        if (onlyHaloDust && !p.isAmbientHalo) continue;

        const liveOriginX = baseCx + (p.originX - baseCx) * scaleMult + shiftX;
        const liveOriginY = baseCy + (p.originY - baseCy) * scaleMult + shiftY;

        let targetX: number;
        let targetY: number;

        if (monoMorph > 0.001) {
          // 3A Formation: Shifted Left Portrait -> Curved Luminous Swirl -> Exact Giant SB Monogram at Center!
          const dx = p.monoX - liveOriginX;
          const dy = p.monoY - liveOriginY;
          const dist = Math.max(1, Math.hypot(dx, dy));
          const perpX = (-dy / dist) * p.swirlDir * p.swirlAmp * 0.85 * monoSwirl;
          const perpY = (dx / dist) * p.swirlDir * p.swirlAmp * 0.85 * monoSwirl;

          const easedMono = monoMorph * monoMorph * (3 - 2 * monoMorph);
          targetX = liveOriginX + dx * easedMono + perpX;
          targetY = liveOriginY + dy * easedMono + perpY;
        } else {
          // 2A Formation: Cosmic Hand & Orbital Deck Burst -> Curved Magnetic Vortex -> Steven's Face!
          const dx = liveOriginX - p.stackX;
          const dy = liveOriginY - p.stackY;
          const dist = Math.max(1, Math.hypot(dx, dy));
          const perpX = (-dy / dist) * p.swirlDir * p.swirlAmp * gatherSwirl;
          const perpY = (dx / dist) * p.swirlDir * p.swirlAmp * gatherSwirl;

          const easedScatter = scatterFactor * scatterFactor;
          targetX = liveOriginX + (p.stackX - liveOriginX) * easedScatter + perpX;
          targetY = liveOriginY + (p.stackY - liveOriginY) * easedScatter + perpY;

          if (onlyHaloDust) {
            targetX += Math.sin(timeSec * 1.2 + i) * 9;
            targetY += Math.cos(timeSec * 1.1 + i) * 9;
          }
        }

        if (isMouseActive) {
          const dx = p.x - mx;
          const dy = p.y - my;
          const distSq = dx * dx + dy * dy;
          if (distSq < radSq && distSq > 0.01) {
            const dist = Math.sqrt(distSq);
            const force = ((repulsionRadius - dist) / repulsionRadius) * 13;
            p.vx += (dx / dist) * force;
            p.vy += (dy / dist) * force;
          }
        }

        // Fast crisp spring tracking curved scrub trajectory
        p.vx += (targetX - p.x) * 0.18;
        p.vy += (targetY - p.y) * 0.18;
        p.vx *= 0.74;
        p.vy *= 0.74;
        p.x += p.vx;
        p.y += p.vy;

        const displaced = Math.abs(p.x - targetX) + Math.abs(p.y - targetY) > 6;

        if (onlyHaloDust) {
          ctx.globalAlpha = 0.45;
          ctx.fillStyle = "#9DB8FB";
        } else if (monoMorph > 0.55) {
          ctx.globalAlpha = Math.min(1, asciiAlpha);
          ctx.fillStyle = p.isMonoDot
            ? "#E0462E"
            : monoMorph > 0.82
            ? "#F4F5F8"
            : "#9DB8FB";
        } else if (displaced || scatterFactor > 0.25 || monoSwirl > 0.25) {
          ctx.globalAlpha = Math.min(1, asciiAlpha * (0.65 + (1 - scatterFactor) * 0.35));
          ctx.fillStyle = scatterFactor > 0.45 || monoSwirl > 0.35 ? "#9DB8FB" : "#2F6BF2";
        } else {
          ctx.globalAlpha = Math.min(1, asciiAlpha);
          ctx.fillStyle = p.color;
        }

        ctx.fillText(p.char, p.x, p.y);
      }
      ctx.restore();
    };

    img.onload = () => {
      buildParticles();
      if (!reducedMotion) {
        gsap.ticker.add(renderTick);
      }
    };

    const resizeObserver = new ResizeObserver(() => {
      if (
        container.clientWidth !== layoutSizeRef.current.width ||
        container.clientHeight !== layoutSizeRef.current.height
      ) {
        buildParticles();
      }
    });
    resizeObserver.observe(container);

    return () => {
      isCancelled = true;
      gsap.ticker.remove(renderTick);
      window.removeEventListener("pointermove", handleWindowPointerMove);
      window.removeEventListener("pointerleave", handleWindowPointerLeave);
      resizeObserver.disconnect();
    };
  }, [src, cellSize, tintBlue, repulsionRadius, assemblyRef, portraitShiftRef, monogramMorphRef]);

  const cycleMode = () => {
    setMode((prev) => (prev === "ascii" ? "hybrid" : prev === "hybrid" ? "photo" : "ascii"));
  };

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none relative h-full w-full select-none overflow-hidden ${className}`}
    >
      <canvas
        ref={canvasRef}
        className={`block h-full w-full transition-opacity duration-300 ${
          isLoaded ? "opacity-100" : "opacity-0"
        }`}
      />

      {showModeToggle && (
        <button
          type="button"
          onClick={cycleMode}
          className="pointer-events-auto absolute bottom-20 left-1/2 z-40 -translate-x-1/2 rounded-full border border-white/15 bg-[#0D1524]/85 px-3.5 py-1 font-mono text-[10px] font-semibold tracking-wider text-white/90 backdrop-blur-md transition hover:border-[#2F6BF2] hover:bg-[#2F6BF2] hover:text-white cursor-pointer"
          title="Switch Portrait Render Mode"
        >
          {mode === "ascii"
            ? "ASCII SHARDS · HYBRID"
            : mode === "hybrid"
            ? "HYBRID · PHOTO"
            : "PHOTO · ASCII"}
        </button>
      )}
    </div>
  );
}
