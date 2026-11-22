"use client";

import React, { useEffect, useRef, useState } from "react";
import { gsap, isLowEndDevice, prefersReducedMotion } from "@/lib/gsap";

interface SubjectCropBox {
  sx: number;
  sy: number;
  sw: number;
  sh: number;
}

interface DepthSlice {
  canvas: HTMLCanvasElement;
  z: number; // 3D depth offset (-260 .. +260)
  tiltJitter: number;
}

interface BrushStroke3D {
  // 3D Bezier control points relative to center (0, 0) in portrait space
  x0: number;
  y0: number;
  z0: number;
  cx: number;
  cy: number;
  cz: number;
  x1: number;
  y1: number;
  z1: number;
  // Secondary chaotic outer offset when far off-axis (amplifies abstract painting vibe!)
  chaosX: number;
  chaosY: number;
  chaosZ: number;
  // Paired target on SB Monogram for seamless exit morph
  mx0: number;
  my0: number;
  mx1: number;
  my1: number;
  width: number;
  color: string;
  alpha: number;
  isContourAura: boolean;
  isMonoDot: boolean;
}

interface AnamorphicPortraitCanvasProps {
  src?: string;
  /**
   * Mutable camera angle progress ref (-1 .. +1):
   * -1.0 = far left off-axis (pure floating 3D abstract brushstrokes)
   *  0.0 = OPTICAL SWEET SPOT (all 12 depth-strata + strokes align into crisp real Steven!)
   * +1.0 = far right off-axis (breaks back apart into 3D floating abstract strokes!)
   */
  cameraOrbitRef: React.RefObject<number>;
  /** Mutable 0..1 morph ref sweeping the floating strokes cleanly into the giant SB Monogram */
  monogramMorphRef: React.RefObject<number>;
  paused?: boolean;
  className?: string;
}

const SLICE_COUNT = 12;

export function AnamorphicPortraitCanvas({
  src = "/assets/me/Foto-Semi-Formal.webp",
  cameraOrbitRef,
  monogramMorphRef,
  paused = false,
  className = "",
}: AnamorphicPortraitCanvasProps) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  const slicesRef = useRef<DepthSlice[]>([]);
  const strokesRef = useRef<BrushStroke3D[]>([]);
  const masterBufferRef = useRef<HTMLCanvasElement | null>(null);
  const drawRectRef = useRef({ drawW: 0, drawH: 0, offsetX: 0, offsetY: 0 });
  const dimsRef = useRef({ width: 0, height: 0 });
  const pausedRef = useRef(paused);
  const visibleRef = useRef(true);
  const pointerRef = useRef({ nx: 0, ny: 0, sx: 0, sy: 0, active: false });

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        visibleRef.current = entry.isIntersecting;
      },
      { threshold: 0.02 }
    );
    obs.observe(container);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;
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

    // Sample SB Monogram stroke segments for seamless 1:1 exit handoff into Vector SB Portal
    const sampleMonogramSegments = (width: number, height: number) => {
      const monoScreenSize = (width < 640 ? 480 : 560) * 0.36;
      const sampleRes = 140;
      const off = document.createElement("canvas");
      off.width = sampleRes;
      off.height = sampleRes;
      const oCtx = off.getContext("2d", { willReadFrequently: true });
      if (!oCtx) return [];

      const s = sampleRes / 560;
      oCtx.save();
      oCtx.scale(s, s);
      oCtx.fillStyle = "#FFFFFF";
      const drawBar = (x: number, y: number) => {
        oCtx.save();
        oCtx.translate(x, y);
        oCtx.rotate((-34 * Math.PI) / 180);
        oCtx.beginPath();
        oCtx.roundRect(0, 0, 172, 52, 26);
        oCtx.fill();
        oCtx.restore();
      };
      drawBar(76, 228);
      drawBar(76, 344);

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

      oCtx.fillStyle = "#FF0000";
      oCtx.beginPath();
      oCtx.arc(280, 280, 34, 0, Math.PI * 2);
      oCtx.fill();
      oCtx.restore();

      const data = oCtx.getImageData(0, 0, sampleRes, sampleRes).data;
      const pts: Array<{ x: number; y: number; isDot: boolean }> = [];
      for (let py = 0; py < sampleRes; py += 3) {
        for (let px = 0; px < sampleRes; px += 3) {
          const i = (py * sampleRes + px) * 4;
          if (data[i + 3] > 120) {
            pts.push({
              x: (px / sampleRes - 0.5) * monoScreenSize,
              y: (py / sampleRes - 0.5) * monoScreenSize,
              isDot: data[i] > 200 && data[i + 1] < 60,
            });
          }
        }
      }
      return pts;
    };

    const buildAnamorphicSculpture = () => {
      if (!img.complete || img.naturalWidth === 0 || isCancelled) return;

      const width = Math.max(320, container.clientWidth || window.innerWidth);
      const height = Math.max(320, container.clientHeight || window.innerHeight);
      const dpr = Math.min(window.devicePixelRatio || 1, 2);

      dimsRef.current = { width, height };
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      canvas.style.width = "100%";
      canvas.style.height = "100%";
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const crop = detectSubjectCrop(img);
      const boxW = Math.min(440, width * 0.48);
      const boxH = Math.min(540, height * 0.72);
      const scale = Math.min((boxW * 0.96) / crop.sw, (boxH * 0.96) / crop.sh);
      const drawW = Math.max(80, Math.round(crop.sw * scale));
      const drawH = Math.max(80, Math.round(crop.sh * scale));
      const offsetX = Math.round((width - drawW) * 0.5);
      const offsetY = Math.round((height - drawH) * 0.5 + Math.min(18, height * 0.02));
      drawRectRef.current = { drawW, drawH, offsetX, offsetY };

      // 1. Master Borderless Feathered Cutout Buffer
      const masterCanvas = document.createElement("canvas");
      masterCanvas.width = drawW;
      masterCanvas.height = drawH;
      const mCtx = masterCanvas.getContext("2d", { willReadFrequently: true });
      if (!mCtx) return;

      mCtx.clearRect(0, 0, drawW, drawH);
      mCtx.drawImage(img, crop.sx, crop.sy, crop.sw, crop.sh, 0, 0, drawW, drawH);

      // Clean white halo removal & soft bottom waist alpha feather (so photo floats organically with ZERO box edge!)
      const masterImgData = mCtx.getImageData(0, 0, drawW, drawH);
      const mData = masterImgData.data;
      const featherStartY = drawH * 0.82;

      for (let y = 0; y < drawH; y++) {
        const bottomAlphaMult =
          y > featherStartY ? Math.max(0, 1 - (y - featherStartY) / (drawH - featherStartY)) : 1;
        for (let x = 0; x < drawW; x++) {
          const i = (y * drawW + x) * 4;
          const r = mData[i];
          const g = mData[i + 1];
          const b = mData[i + 2];
          if (r > 238 && g > 238 && b > 238) {
            mData[i + 3] = 0;
          } else if (bottomAlphaMult < 1) {
            mData[i + 3] = Math.round(mData[i + 3] * bottomAlphaMult);
          }
        }
      }
      mCtx.putImageData(masterImgData, 0, 0);
      masterBufferRef.current = masterCanvas;

      // 2. Slice Master Photo into 12 Organic Flowing 3D Depth-Strata!
      // Pixels are partitioned into curved painterly wave-bands & luminance depths so off-axis view
      // looks like floating 3D paint layers suspended in mid-air (NOT rigid rectangles)!
      const sliceCanvases: HTMLCanvasElement[] = [];
      const sliceBuffers: ImageData[] = [];
      for (let s = 0; s < SLICE_COUNT; s++) {
        const sc = document.createElement("canvas");
        sc.width = drawW;
        sc.height = drawH;
        const sCtx = sc.getContext("2d");
        if (!sCtx) return;
        sliceCanvases.push(sc);
        sliceBuffers.push(sCtx.createImageData(drawW, drawH));
      }

      const halfW = drawW * 0.5;
      const halfH = drawH * 0.5;

      for (let y = 0; y < drawH; y++) {
        const ny = (y - halfH) / halfH;
        for (let x = 0; x < drawW; x++) {
          const i = (y * drawW + x) * 4;
          const a = mData[i + 3];
          if (a < 18) continue;

          const nx = (x - halfW) / halfW;
          const r = mData[i];
          const g = mData[i + 1];
          const b = mData[i + 2];
          const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;

          // Organic swirling brush-band depth assignment (face/glasses/collar pop forward +Z, hair/back shoulders recede -Z!)
          const radialFace = Math.max(0, 1 - Math.hypot(nx * 1.15, (ny + 0.25) * 1.1));
          const waveRibbon = Math.sin(nx * 3.8 + ny * 4.4) * 0.22 + Math.cos(ny * 6.2 - nx * 2.5) * 0.14;
          const depthScore = Math.max(
            0,
            Math.min(0.999, radialFace * 0.52 + luma * 0.34 + 0.22 + waveRibbon)
          );
          const sliceIdx = Math.floor(depthScore * SLICE_COUNT);

          const targetBuf = sliceBuffers[sliceIdx].data;
          targetBuf[i] = r;
          targetBuf[i + 1] = g;
          targetBuf[i + 2] = b;
          targetBuf[i + 3] = a;
        }
      }

      const builtSlices: DepthSlice[] = [];
      for (let s = 0; s < SLICE_COUNT; s++) {
        const sCtx = sliceCanvases[s].getContext("2d");
        sCtx?.putImageData(sliceBuffers[s], 0, 0);
        // Spread strata across true 3D depth (-250 .. +250px)
        const norm = s / (SLICE_COUNT - 1) - 0.5;
        builtSlices.push({
          canvas: sliceCanvases[s],
          z: norm * 520,
          tiltJitter: Math.sin(s * 2.1) * 0.08,
        });
      }
      slicesRef.current = builtSlices;

      // 3. Build 280 Expressive 3D Calligraphic Ink-Brush Strokes sampled from Steven's contours & tones!
      const strokeCount = lowEnd ? 140 : 280;
      const monoPts = sampleMonogramSegments(width, height);
      const validPixels: Array<{ x: number; y: number; r: number; g: number; b: number; luma: number }> = [];

      const sampleStep = lowEnd ? 9 : 6;
      for (let y = 4; y < drawH - 4; y += sampleStep) {
        for (let x = 4; x < drawW - 4; x += sampleStep) {
          const i = (y * drawW + x) * 4;
          if (mData[i + 3] > 100) {
            const r = mData[i];
            const g = mData[i + 1];
            const b = mData[i + 2];
            const luma = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            validPixels.push({ x: x - halfW, y: y - halfH, r, g, b, luma });
          }
        }
      }

      const builtStrokes: BrushStroke3D[] = [];
      if (validPixels.length > 0) {
        for (let i = 0; i < strokeCount; i++) {
          const s1 = Math.sin(i * 12.9898 + 0.9) * 43758.5453;
          const rand1 = s1 - Math.floor(s1);
          const s2 = Math.sin(i * 78.233 + 2.7) * 43758.5453;
          const rand2 = s2 - Math.floor(s2);
          const s3 = Math.sin(i * 45.164 + 6.1) * 43758.5453;
          const rand3 = s3 - Math.floor(s3);

          const pix = validPixels[Math.floor(rand1 * validPixels.length)];
          const isContourAura = i % 5 === 0;
          const isVermilionAccent = i === 18 || i === 74 || i === 131 || i === 196 || i === 242;

          // Sweep expressive calligraphic curve across portrait contour flow
          const angle = Math.atan2(pix.y, pix.x) + (rand2 - 0.5) * 1.9;
          const len = isContourAura ? 68 + rand3 * 125 : 34 + rand3 * 82;
          const bend = (rand1 - 0.5) * len * 0.9;

          const x0 = pix.x - Math.cos(angle) * len * 0.5;
          const y0 = pix.y - Math.sin(angle) * len * 0.5;
          const x1 = pix.x + Math.cos(angle) * len * 0.5;
          const y1 = pix.y + Math.sin(angle) * len * 0.5;
          const cxPt = pix.x - Math.sin(angle) * bend;
          const cyPt = pix.y + Math.cos(angle) * bend;

          // Deep 3D Z placement (-420 .. +420) so off-axis rotation looks like a sculpted 3D ink installation!
          const zBase = (rand2 - 0.5) * 760;
          const zSpread = (rand3 - 0.5) * 140;

          // Extra dramatic abstract dispersion when off-axis across full 100vw x 100vh!
          const chaosAngle = rand1 * Math.PI * 2;
          const chaosDist = 90 + rand3 * Math.min(width, height) * 0.42;

          // Painterly Royal Blue + Real Photo Tone + Deep Ink palette (cohesive Benang Biru!)
          let color: string;
          if (isVermilionAccent) {
            color = "#E0462E";
          } else if (i % 3 === 0) {
            color = pix.luma > 0.58 ? "#C7D8FC" : pix.luma > 0.28 ? "#2F6BF2" : "#153278";
          } else if (i % 3 === 1) {
            color = pix.luma > 0.65 ? "#F4F5F8" : "#9DB8FB";
          } else {
            // Blended real subject tone tinted softly with cobalt ink for true mixed-media!
            const rr = Math.round(pix.r * 0.68 + 47 * 0.32);
            const gg = Math.round(pix.g * 0.68 + 107 * 0.32);
            const bb = Math.round(pix.b * 0.68 + 242 * 0.32);
            color = `rgb(${rr}, ${gg}, ${bb})`;
          }

          // Paired SB Monogram exit target
          const monoA = monoPts.length ? monoPts[i % monoPts.length] : { x: 0, y: 0, isDot: false };
          const monoB = monoPts.length
            ? monoPts[(i + 7) % monoPts.length]
            : { x: 16, y: -12, isDot: false };

          builtStrokes.push({
            x0,
            y0,
            z0: zBase - zSpread,
            cx: cxPt,
            cy: cyPt,
            cz: zBase,
            x1,
            y1,
            z1: zBase + zSpread,
            chaosX: Math.cos(chaosAngle) * chaosDist,
            chaosY: Math.sin(chaosAngle) * chaosDist * 0.72,
            chaosZ: (rand1 - 0.5) * 440,
            mx0: monoA.x,
            my0: monoA.y,
            mx1: monoA.isDot ? monoA.x + (rand2 - 0.5) * 14 : monoB.x,
            my1: monoA.isDot ? monoA.y + (rand3 - 0.5) * 14 : monoB.y,
            width: isVermilionAccent ? 2.8 : isContourAura ? 1.4 + rand2 * 2.2 : 1.8 + rand3 * 3.4,
            color,
            alpha: isVermilionAccent ? 0.92 : isContourAura ? 0.65 : 0.85,
            isContourAura,
            isMonoDot: monoA.isDot,
          });
        }
      }
      strokesRef.current = builtStrokes;
      setIsLoaded(true);
    };

    const projectPoint = (
      x: number,
      y: number,
      z: number,
      cosY: number,
      sinY: number,
      cosX: number,
      sinX: number,
      cx: number,
      cy: number,
      fov: number
    ) => {
      const x1 = x * cosY + z * sinY;
      const z1 = -x * sinY + z * cosY;
      const y2 = y * cosX - z1 * sinX;
      const z2 = y * sinX + z1 * cosX;
      const depth = Math.max(160, fov + z2);
      const scale = fov / depth;
      return {
        sx: cx + x1 * scale,
        sy: cy + y2 * scale,
        scale,
        z: z2,
      };
    };

    const handlePointerMove = (e: PointerEvent) => {
      pointerRef.current.nx = (e.clientX / Math.max(1, window.innerWidth) - 0.5) * 2;
      pointerRef.current.ny = (e.clientY / Math.max(1, window.innerHeight) - 0.5) * 2;
      pointerRef.current.active = true;
    };

    const handlePointerLeave = () => {
      pointerRef.current.active = false;
    };

    window.addEventListener("pointermove", handlePointerMove, { passive: true });
    window.addEventListener("pointerleave", handlePointerLeave);

    const renderTick = (timeSec: number) => {
      if (isCancelled || pausedRef.current || !visibleRef.current) return;
      const { width, height } = dimsRef.current;
      if (width === 0 || height === 0) return;

      ctx.clearRect(0, 0, width, height);

      const cx = width * 0.5;
      const cy = height * 0.5 + Math.min(18, height * 0.02);
      const fov = Math.max(820, width * 0.85);

      const rawOrbit = Math.max(-1, Math.min(1, cameraOrbitRef.current ?? 0));
      const monoMorph = Math.max(0, Math.min(1, monogramMorphRef.current ?? 0));

      // Smooth cursor interactive 3D orbit (strongest at the sweet spot — tilt Steven in 3D just like the WhatsApp video!)
      const sweetProximity = Math.max(0, 1 - Math.abs(rawOrbit) * 2.1) * (1 - monoMorph);
      const targetPx = pointerRef.current.active ? pointerRef.current.nx : 0;
      const targetPy = pointerRef.current.active ? pointerRef.current.ny : 0;
      pointerRef.current.sx += (targetPx - pointerRef.current.sx) * 0.08;
      pointerRef.current.sy += (targetPy - pointerRef.current.sy) * 0.08;

      // Orbit angle in radians: -1 -> -74deg, 0 -> 0deg (SWEET SPOT!), +1 -> +74deg!
      const baseYaw = rawOrbit * 1.28;
      const basePitch = -Math.abs(rawOrbit) * 0.34;
      const mouseYaw = pointerRef.current.sx * 0.26 * sweetProximity;
      const mousePitch = pointerRef.current.sy * 0.16 * sweetProximity;

      const yaw = (baseYaw + mouseYaw) * (1 - monoMorph * 0.85);
      const pitch = (basePitch + mousePitch) * (1 - monoMorph * 0.85);

      const cosY = Math.cos(yaw);
      const sinY = Math.sin(yaw);
      const cosX = Math.cos(pitch);
      const sinX = Math.sin(pitch);

      // Misalignment magnitude (0 at perfect optical sweet spot, 1 at far abstract angle)
      const offAxis = Math.min(1, Math.abs(yaw) / 0.85);
      const focusClarity = Math.max(0, 1 - Math.abs(yaw) / 0.24) * (1 - monoMorph);

      const { drawW, drawH } = drawRectRef.current;
      const halfW = drawW * 0.5;
      const halfH = drawH * 0.5;

      // 1. RENDER BACK-HALF 3D CALLIGRAPHIC ABSTRACT INK STROKES (Behind photo strata)
      const strokes = strokesRef.current;
      const easedMono = monoMorph * monoMorph * (3 - 2 * monoMorph);
      const strokeGlobalPresence =
        monoMorph > 0.05
          ? 0.96
          : Math.max(0.24, Math.min(0.98, 0.22 + offAxis * 0.95));

      ctx.lineCap = "round";
      ctx.lineJoin = "round";

      const drawStrokePass = (isFrontPass: boolean) => {
        for (let i = 0; i < strokes.length; i++) {
          const st = strokes[i];
          const isFront = st.cz >= 0;
          if (isFront !== isFrontPass) continue;

          // At perfect focus (sweet spot), keep ONLY outer painterly aura strokes visible so face is 100% crisp!
          if (focusClarity > 0.72 && !st.isContourAura && monoMorph < 0.05) {
            const fade = Math.max(0, 1 - (focusClarity - 0.72) / 0.28);
            if (fade <= 0.02) continue;
          }

          // When off-axis, strokes stretch dramatically across 3D space (pure abstract painting chaos!)
          const chaosFactor = Math.pow(offAxis, 1.15) * (1 - easedMono);
          const breathe = Math.sin(timeSec * 1.1 + i * 0.37) * (3 + chaosFactor * 14);

          const x0 =
            (st.x0 + st.chaosX * chaosFactor) * (1 - easedMono) + st.mx0 * easedMono;
          const y0 =
            (st.y0 + st.chaosY * chaosFactor + breathe * 0.4) * (1 - easedMono) +
            st.my0 * easedMono;
          const z0 = (st.z0 + st.chaosZ * chaosFactor) * (1 - easedMono);

          const mxMid = (st.mx0 + st.mx1) * 0.5;
          const myMid = (st.my0 + st.my1) * 0.5;
          const midSwirl = Math.sin(monoMorph * Math.PI) * 75 * (i % 2 === 0 ? 1 : -1);

          const cx3 =
            (st.cx + st.chaosX * chaosFactor * 1.15 + breathe) * (1 - easedMono) +
            (mxMid + midSwirl) * easedMono;
          const cy3 =
            (st.cy + st.chaosY * chaosFactor * 1.15 - breathe) * (1 - easedMono) +
            (myMid - midSwirl * 0.5) * easedMono;
          const cz3 = (st.cz + st.chaosZ * chaosFactor) * (1 - easedMono);

          const x1 =
            (st.x1 + st.chaosX * chaosFactor) * (1 - easedMono) + st.mx1 * easedMono;
          const y1 =
            (st.y1 + st.chaosY * chaosFactor - breathe * 0.4) * (1 - easedMono) +
            st.my1 * easedMono;
          const z1 = (st.z1 + st.chaosZ * chaosFactor) * (1 - easedMono);

          const p0 = projectPoint(x0, y0, z0, cosY, sinY, cosX, sinX, cx, cy, fov);
          const pc = projectPoint(cx3, cy3, cz3, cosY, sinY, cosX, sinX, cx, cy, fov);
          const p1 = projectPoint(x1, y1, z1, cosY, sinY, cosX, sinX, cx, cy, fov);

          let alpha = st.alpha * strokeGlobalPresence;
          if (!st.isContourAura && monoMorph < 0.05 && focusClarity > 0.5) {
            alpha *= Math.max(0, 1 - (focusClarity - 0.5) * 2.1);
          }
          if (st.isContourAura && focusClarity > 0.5 && monoMorph < 0.05) {
            alpha *= 0.36;
          }
          if (alpha <= 0.015) continue;

          ctx.strokeStyle =
            monoMorph > 0.58
              ? st.isMonoDot
                ? "#E0462E"
                : "#F4F5F8"
              : st.color;
          ctx.lineWidth = Math.max(
            0.8,
            st.width * pc.scale * (1 + chaosFactor * 0.85) * (monoMorph > 0.65 ? 1.45 : 1)
          );
          ctx.globalAlpha = Math.min(1, alpha);

          ctx.beginPath();
          ctx.moveTo(p0.sx, p0.sy);
          ctx.quadraticCurveTo(pc.sx, pc.sy, p1.sx, p1.sy);
          ctx.stroke();
        }
      };

      // Back abstract brushstrokes pass
      drawStrokePass(false);

      // 2. RENDER 12 TRUE-3D ANAMORPHIC PHOTO DEPTH-STRATA (Align perfectly into real Steven at yaw=0!)
      const photoPresence = Math.max(0, 1 - monoMorph * 1.9);
      if (photoPresence > 0.01 && drawW > 0 && drawH > 0) {
        if (focusClarity > 0.94 && masterBufferRef.current) {
          // Dead-on optical sweet spot -> razor-sharp seamless real Steven with subtle cursor shift!
          ctx.save();
          ctx.globalAlpha = photoPresence;
          ctx.drawImage(
            masterBufferRef.current,
            cx - halfW + pointerRef.current.sx * 6,
            cy - halfH + pointerRef.current.sy * 4,
            drawW,
            drawH
          );
          ctx.restore();
        } else {
          // Off-axis / orbiting -> draw all 12 depth-strata sorted back-to-front in true 3D perspective!
          const slices = slicesRef.current;
          const ordered = sinY >= 0 ? slices : [...slices].reverse();
          const foreshortenX = Math.max(0.32, Math.cos(yaw * 0.58));

          for (let s = 0; s < ordered.length; s++) {
            const slice = ordered[s];
            const projected = projectPoint(0, 0, slice.z, cosY, sinY, cosX, sinX, cx, cy, fov);
            const sw = drawW * projected.scale * foreshortenX;
            const sh = drawH * projected.scale;

            // Far-off-axis slices blend gently with the chaotic abstract ink strokes
            const sliceAlpha = photoPresence * Math.max(0.28, 1 - offAxis * 0.58);
            ctx.save();
            ctx.globalAlpha = sliceAlpha;
            ctx.translate(projected.sx, projected.sy);
            ctx.rotate(slice.tiltJitter * offAxis * (yaw >= 0 ? 1 : -1));
            ctx.drawImage(slice.canvas, -sw * 0.5, -sh * 0.5, sw, sh);
            ctx.restore();
          }

          // Crossfade crisp master buffer smoothly as camera approaches |yaw| < 0.24 rad
          if (focusClarity > 0.02 && masterBufferRef.current) {
            ctx.save();
            ctx.globalAlpha = focusClarity * photoPresence;
            ctx.drawImage(
              masterBufferRef.current,
              cx - halfW + pointerRef.current.sx * 6,
              cy - halfH + pointerRef.current.sy * 4,
              drawW,
              drawH
            );
            ctx.restore();
          }
        }
      }

      // 3. FRONT-HALF 3D CALLIGRAPHIC ABSTRACT INK STROKES (Floating in front of Steven's depth layers!)
      drawStrokePass(true);

      ctx.globalAlpha = 1;
    };

    img.onload = () => {
      buildAnamorphicSculpture();
      if (reducedMotion) {
        renderTick(0);
      } else {
        gsap.ticker.add(renderTick);
      }
    };

    const ro = new ResizeObserver(() => {
      if (
        container.clientWidth !== dimsRef.current.width ||
        container.clientHeight !== dimsRef.current.height
      ) {
        buildAnamorphicSculpture();
      }
    });
    ro.observe(container);

    return () => {
      isCancelled = true;
      if (!reducedMotion) {
        gsap.ticker.remove(renderTick);
      }
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerleave", handlePointerLeave);
      ro.disconnect();
    };
  }, [src, cameraOrbitRef, monogramMorphRef]);

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
    </div>
  );
}
