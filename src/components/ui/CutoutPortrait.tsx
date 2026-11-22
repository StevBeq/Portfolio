"use client";

import React, { useEffect, useRef, useState } from "react";

interface CutoutPortraitProps {
  src: string;
  alt: string;
  className?: string;
}

/**
 * One-shot studio-white background remover (0 RAF loops, zero runtime lag).
 * Flood-fills strictly from the 4 outer edges so exterior white background becomes
 * transparent while interior whites (shirt collar, highlights) remain 100% opaque.
 */
export function CutoutPortrait({ src, alt, className = "" }: CutoutPortraitProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    let active = true;
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = src;

    img.onload = () => {
      if (!active || !canvasRef.current) return;

      const maxDim = 480;
      const scale = Math.min(1, maxDim / Math.max(img.naturalWidth, img.naturalHeight));
      const w = Math.max(1, Math.round(img.naturalWidth * scale));
      const h = Math.max(1, Math.round(img.naturalHeight * scale));

      const off = document.createElement("canvas");
      off.width = w;
      off.height = h;
      const offCtx = off.getContext("2d", { willReadFrequently: true });
      if (!offCtx) return;

      offCtx.drawImage(img, 0, 0, w, h);
      const imageData = offCtx.getImageData(0, 0, w, h);
      const data = imageData.data;

      // Flood-fill background starting from all border pixels matching bright neutral studio backdrop
      const visited = new Uint8Array(w * h);
      const bgMask = new Uint8Array(w * h);
      const queue = new Int32Array(w * h);
      let head = 0;
      let tail = 0;

      const isStudioWhite = (idx4: number) => {
        const r = data[idx4];
        const g = data[idx4 + 1];
        const b = data[idx4 + 2];
        const maxC = Math.max(r, g, b);
        const minC = Math.min(r, g, b);
        return minC > 218 && maxC - minC < 24;
      };

      const trySeed = (x: number, y: number) => {
        const p = y * w + x;
        if (visited[p]) return;
        if (isStudioWhite(p * 4)) {
          visited[p] = 1;
          bgMask[p] = 1;
          queue[tail++] = p;
        }
      };

      for (let x = 0; x < w; x++) {
        trySeed(x, 0);
        trySeed(x, h - 1);
      }
      for (let y = 0; y < h; y++) {
        trySeed(0, y);
        trySeed(w - 1, y);
      }

      while (head < tail) {
        const p = queue[head++];
        const x = p % w;
        const y = (p - x) / w;

        if (x > 0) {
          const np = p - 1;
          if (!visited[np] && isStudioWhite(np * 4)) {
            visited[np] = 1;
            bgMask[np] = 1;
            queue[tail++] = np;
          }
        }
        if (x < w - 1) {
          const np = p + 1;
          if (!visited[np] && isStudioWhite(np * 4)) {
            visited[np] = 1;
            bgMask[np] = 1;
            queue[tail++] = np;
          }
        }
        if (y > 0) {
          const np = p - w;
          if (!visited[np] && isStudioWhite(np * 4)) {
            visited[np] = 1;
            bgMask[np] = 1;
            queue[tail++] = np;
          }
        }
        if (y < h - 1) {
          const np = p + w;
          if (!visited[np] && isStudioWhite(np * 4)) {
            visited[np] = 1;
            bgMask[np] = 1;
            queue[tail++] = np;
          }
        }
      }

      // Compute tight subject bounding box and soften 1px border halo
      let minX = w;
      let maxX = 0;
      let minY = h;
      let maxY = 0;

      for (let y = 0; y < h; y++) {
        for (let x = 0; x < w; x++) {
          const p = y * w + x;
          const idx4 = p * 4;
          if (bgMask[p]) {
            data[idx4 + 3] = 0;
          } else {
            // Soften fringe pixels touching background mask
            const touchesBg =
              (x > 0 && bgMask[p - 1]) ||
              (x < w - 1 && bgMask[p + 1]) ||
              (y > 0 && bgMask[p - w]) ||
              (y < h - 1 && bgMask[p + w]);
            if (touchesBg) {
              const lum = (data[idx4] + data[idx4 + 1] + data[idx4 + 2]) / 3;
              if (lum > 195) {
                data[idx4 + 3] = Math.round(data[idx4 + 3] * 0.45);
              }
            }
            if (x < minX) minX = x;
            if (x > maxX) maxX = x;
            if (y < minY) minY = y;
            if (y > maxY) maxY = y;
          }
        }
      }

      offCtx.putImageData(imageData, 0, 0);

      const cropW = Math.max(1, maxX - minX + 1);
      const cropH = Math.max(1, maxY - minY + 1);

      const out = canvasRef.current;
      out.width = cropW;
      out.height = cropH;
      const outCtx = out.getContext("2d");
      if (!outCtx) return;
      outCtx.clearRect(0, 0, cropW, cropH);
      outCtx.drawImage(off, minX, minY, cropW, cropH, 0, 0, cropW, cropH);
      setReady(true);
    };

    return () => {
      active = false;
    };
  }, [src]);

  return (
    <canvas
      ref={canvasRef}
      role="img"
      aria-label={alt}
      className={`${className} transition-opacity duration-300 ${ready ? "opacity-100" : "opacity-0"}`}
    />
  );
}
