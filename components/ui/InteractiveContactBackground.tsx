'use client';

import React, { useEffect, useRef } from 'react';

export const InteractiveContactBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);

    // Mouse tracker
    const mouse = {
      x: -1000,
      y: -1000,
      radius: 140,
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      mouse.x = e.clientX - rect.left;
      mouse.y = e.clientY - rect.top;
    };

    const handleMouseLeave = () => {
      mouse.x = -1000;
      mouse.y = -1000;
    };

    const parent = canvas.parentElement;
    if (parent) {
      parent.addEventListener('mousemove', handleMouseMove);
      parent.addEventListener('mouseleave', handleMouseLeave);
    }

    // Grid nodes
    const spacing = 45;
    const cols = Math.floor(width / spacing) + 2;
    const rows = Math.floor(height / spacing) + 2;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      const isDark = document.documentElement.classList.contains('dark');
      const dotBaseColor = isDark ? 'rgba(255, 184, 0, 0.08)' : 'rgba(217, 119, 6, 0.12)';
      const lineActiveColor = isDark ? 'rgba(255, 184, 0, 0.25)' : 'rgba(217, 119, 6, 0.22)';
      const dotActiveColor = isDark ? 'rgba(255, 184, 0, 0.8)' : 'rgba(217, 119, 6, 0.8)';

      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          const x = c * spacing;
          const y = r * spacing;

          const dx = mouse.x - x;
          const dy = mouse.y - y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          let dotSize = 1.2;
          let dotColor = dotBaseColor;

          if (dist < mouse.radius) {
            const factor = 1 - dist / mouse.radius;
            dotSize = 1.2 + factor * 2.5;
            dotColor = dotActiveColor;

            // Draw connecting light line to mouse
            if (factor > 0.3) {
              ctx.beginPath();
              ctx.moveTo(x, y);
              ctx.lineTo(mouse.x, mouse.y);
              ctx.strokeStyle = lineActiveColor;
              ctx.lineWidth = factor * 0.8;
              ctx.stroke();
            }
          }

          ctx.beginPath();
          ctx.arc(x, y, dotSize, 0, Math.PI * 2);
          ctx.fillStyle = dotColor;
          ctx.fill();
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (parent) {
        parent.removeEventListener('mousemove', handleMouseMove);
        parent.removeEventListener('mouseleave', handleMouseLeave);
      }
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none opacity-80 transition-opacity duration-300"
    />
  );
};
