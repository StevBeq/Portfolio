'use client';

import React, { useRef, useEffect, useState } from 'react';

interface PixelatedCanvasProps {
  src?: string | null;
  alt?: string;
  className?: string;
}

export const PixelatedCanvas: React.FC<PixelatedCanvasProps> = ({
  src,
  alt = 'Avatar',
  className = '',
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isHovered, setIsHovered] = useState(false);
  const [imgLoaded, setImgLoaded] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let particles: { x: number; y: number; size: number; alpha: number; speed: number }[] = [];

    const width = (canvas.width = canvas.parentElement?.clientWidth || 280);
    const height = (canvas.height = canvas.parentElement?.clientHeight || 280);

    for (let i = 0; i < 45; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size: Math.random() * 3 + 1,
        alpha: Math.random() * 0.5 + 0.2,
        speed: Math.random() * 0.5 + 0.2,
      });
    }

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw Grid lines
      ctx.strokeStyle = isHovered ? 'rgba(255, 184, 0, 0.25)' : 'rgba(255, 184, 0, 0.08)';
      ctx.lineWidth = 1;
      const gridSize = 16;
      for (let x = 0; x <= width; x += gridSize) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();
      }
      for (let y = 0; y <= height; y += gridSize) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();
      }

      // Draw Voltage Amber interactive particles
      particles.forEach((p) => {
        ctx.fillStyle = isHovered ? '#FFC933' : '#FFB800';
        ctx.globalAlpha = isHovered ? Math.min(1, p.alpha + 0.3) : p.alpha;
        ctx.fillRect(p.x, p.y, p.size, p.size);

        p.y -= p.speed * (isHovered ? 1.8 : 1);
        if (p.y < 0) {
          p.y = height;
          p.x = Math.random() * width;
        }
      });
      ctx.globalAlpha = 1.0;

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
    };
  }, [isHovered]);

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border border-[#FFB800]/30 transition-all duration-500 group ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <canvas ref={canvasRef} className="absolute inset-0 z-0 pointer-events-none w-full h-full" />
      <div className="relative z-10 w-full h-full flex items-center justify-center p-2">
        {src ? (
          <img
            src={src}
            alt={alt}
            onLoad={() => setImgLoaded(true)}
            className={`w-full h-full object-cover rounded-xl transition-transform duration-500 ${
              isHovered ? 'scale-105 contrast-110 brightness-110' : 'scale-100'
            } ${imgLoaded ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : (
          <div className="w-full h-full min-h-[200px] flex flex-col items-center justify-center bg-[#18181C] text-[#8E8E93] rounded-xl border border-dashed border-[#FFB800]/20 p-4 text-center">
            <span className="font-mono text-xs text-[#FFB800]">[NO AVATAR UPLOADED]</span>
            <span className="text-[10px] mt-1">Configure in Admin CMS</span>
          </div>
        )}
      </div>
    </div>
  );
};
