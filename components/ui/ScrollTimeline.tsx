'use client';

import React, { useRef } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';

interface ScrollTimelineProps {
  children: React.ReactNode;
}

export const ScrollTimeline: React.FC<ScrollTimelineProps> = ({ children }) => {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start 85%', 'end 50%'],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div ref={ref} className="relative space-y-8 md:space-y-10">
      {/* Background Track Line */}
      <div className="absolute left-4 md:left-6 top-4 bottom-4 -translate-x-1/2 w-0.5 bg-slate-200 dark:bg-[#252529] rounded-full" />

      {/* Dynamic Glowing Amber Progress Line */}
      <motion.div
        style={{ scaleY }}
        className="absolute left-4 md:left-6 top-4 bottom-4 -translate-x-1/2 w-0.5 bg-[#D97706] dark:bg-[#FFB800] origin-top shadow-[0_0_12px_rgba(217,119,6,0.6)] dark:shadow-[0_0_12px_rgba(255,184,0,0.8)] rounded-full z-0"
      />

      {children}
    </div>
  );
};

