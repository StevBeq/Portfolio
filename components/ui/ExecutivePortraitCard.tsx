'use client';

import React, { useRef, useState } from 'react';
import { MapPin, Sparkles, Code2 } from 'lucide-react';

interface ExecutivePortraitCardProps {
  imageSrc: string;
  fullName: string;
  title: string;
  className?: string;
}

export const ExecutivePortraitCard: React.FC<ExecutivePortraitCardProps> = ({
  imageSrc,
  fullName,
  title,
  className = '',
}) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [tilt, setTilt] = useState<{ rx: number; ry: number }>({ rx: 0, ry: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const [spotlightPos, setSpotlightPos] = useState({ x: 50, y: 50 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;
    setSpotlightPos({ x: percentX, y: percentY });

    // Subtle 3D Tilt (Max 7deg max)
    const rx = (0.5 - y / rect.height) * 12;
    const ry = (x / rect.width - 0.5) * 12;
    setTilt({ rx, ry });
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    setTilt({ rx: 0, ry: 0 });
    setSpotlightPos({ x: 50, y: 50 });
  };

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`relative w-full rounded-3xl p-5 sm:p-6 bg-white dark:bg-[#18181C] border border-slate-200/80 dark:border-[#252529] shadow-sm hover:shadow-xl transition-all duration-300 group cursor-pointer ${className}`}
      style={{ perspective: '1000px' }}
    >
      {/* 3D Tilt Outer Wrapper */}
      <div
        className="w-full h-full flex flex-col justify-between transition-transform duration-200 ease-out"
        style={{
          transform: `rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale3d(${isHovered ? 1.015 : 1}, ${isHovered ? 1.015 : 1}, 1)`,
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Photo Container */}
        <div className="relative w-full aspect-[4/5] rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#101014] border border-slate-200/80 dark:border-[#252529] shadow-inner">
          {/* Spotlight Gradient on Hover */}
          <div
            className="absolute inset-0 z-20 pointer-events-none transition-opacity duration-300"
            style={{
              opacity: isHovered ? 1 : 0.2,
              background: `radial-gradient(400px circle at ${spotlightPos.x}% ${spotlightPos.y}%, rgba(255, 184, 0, 0.15), transparent 75%)`,
            }}
          />

          {/* Clean Sharp HD Photo */}
          <img
            src={imageSrc}
            alt={fullName}
            className="absolute inset-0 w-full h-full object-cover object-top filter brightness-[1.02] contrast-[1.02] transition-transform duration-500 group-hover:scale-105"
          />

          {/* Top Floating Badge: Status Pill */}
          <div className="absolute top-3 left-3 z-30 px-3 py-1 rounded-full bg-slate-900/80 dark:bg-[#18181C]/90 backdrop-blur-md border border-slate-700/60 dark:border-[#2A2A30] text-emerald-400 font-mono text-[10px] font-semibold flex items-center gap-1.5 shadow-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>AVAILABLE FOR PROJECTS</span>
          </div>

          {/* Bottom Floating Badge: Tech Stack Pill */}
          <div className="absolute bottom-3 right-3 z-30 px-3 py-1 rounded-full bg-slate-900/80 dark:bg-[#18181C]/90 backdrop-blur-md border border-slate-700/60 dark:border-[#2A2A30] text-amber-400 font-mono text-[10px] font-semibold flex items-center gap-1.5 shadow-md">
            <Code2 className="w-3 h-3 text-[#FFB800]" />
            <span>FULL-STACK & MOBILE</span>
          </div>
        </div>

        {/* Profile Details Footer */}
        <div className="mt-5 pt-4 border-t border-slate-100 dark:border-[#252529] flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold font-heading text-slate-900 dark:text-[#D9D9D9] group-hover:text-[#D97706] dark:group-hover:text-[#FFB800] transition-colors duration-200">
              {fullName}
            </h3>
            <p className="text-xs font-mono text-[#D97706] dark:text-[#FFB800] mt-0.5">
              {title}
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 dark:bg-[#252529]/60 text-slate-600 dark:text-[#8E8E93] text-xs font-mono">
            <MapPin className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FFB800]" />
            <span>Indonesia</span>
          </div>
        </div>
      </div>
    </div>
  );
};
