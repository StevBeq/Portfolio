'use client';

import React, { useRef, useState } from 'react';
import { motion, useMotionValue, useTransform, useSpring, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

export interface DockItem {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'DevOps' | 'Mobile';
  tag: string;
  icon: React.ReactNode;
  color?: string;
  description?: string;
}

interface DockProps {
  items: DockItem[];
  className?: string;
  onSelectItem?: (item: DockItem) => void;
  selectedItemId?: string | null;
}

const DockIcon: React.FC<{
  item: DockItem;
  mouseX: ReturnType<typeof useMotionValue<number>>;
  onClick?: () => void;
  isSelected?: boolean;
}> = ({ item, mouseX, onClick, isSelected }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [hovered, setHovered] = useState(false);

  // Distance from mouse X to icon center
  const distance = useTransform(mouseX, (val: number) => {
    const bounds = ref.current?.getBoundingClientRect() || { x: 0, width: 0 };
    return val - bounds.x - bounds.width / 2;
  });

  // Smooth magnification curve: center icon scales to 72px, adjacent scale gracefully
  const widthTransform = useTransform(distance, [-150, 0, 150], [44, 72, 44]);
  const heightTransform = useTransform(distance, [-150, 0, 150], [44, 72, 44]);

  const width = useSpring(widthTransform, { mass: 0.1, stiffness: 200, damping: 18 });
  const height = useSpring(heightTransform, { mass: 0.1, stiffness: 200, damping: 18 });

  return (
    <motion.div
      ref={ref}
      style={{ width, height }}
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      whileTap={{ scale: 0.9 }}
      className={cn(
        'relative flex items-center justify-center rounded-2xl cursor-pointer transition-all group',
        'bg-white dark:bg-[#18181C]',
        'border border-gray-200 dark:border-[#252529]',
        'hover:border-[#D97706] dark:hover:border-[#FFB800] hover:shadow-amber-glow',
        isSelected && 'border-[#D97706] dark:border-[#FFB800] ring-2 ring-[#D97706]/40 dark:ring-[#FFB800]/40 bg-amber-500/10 dark:bg-[#FFB800]/10'
      )}
    >
      {/* Icon Content */}
      <div className="w-6 h-6 sm:w-7 sm:h-7 flex items-center justify-center text-gray-800 dark:text-[#D9D9D9] group-hover:text-[#D97706] dark:group-hover:text-[#FFB800] transition-colors">
        {item.icon}
      </div>

      {/* macOS Active Indicator Dot */}
      {isSelected && (
        <span className="absolute -bottom-1 w-1.5 h-1.5 rounded-full bg-[#FFB800] shadow-amber-glow" />
      )}

      {/* Floating Tooltip (21st.dev style) */}
      <AnimatePresence>
        {hovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.85 }}
            animate={{ opacity: 1, y: -54, scale: 1 }}
            exit={{ opacity: 0, y: 5, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
            className="absolute left-1/2 -translate-x-1/2 pointer-events-none z-50 flex flex-col items-center"
          >
            <div className="px-3 py-1.5 rounded-xl bg-gray-900/95 dark:bg-[#18181C]/95 text-white border border-[#D97706]/40 dark:border-[#FFB800]/40 shadow-2xl backdrop-blur-md flex items-center gap-2 whitespace-nowrap">
              <span className="font-heading font-bold text-xs text-[#FFB800]">
                {item.name}
              </span>
              <span className="text-[10px] font-mono px-1.5 py-0.2 rounded bg-[#FFB800]/10 text-[#FFB800] border border-[#FFB800]/20">
                {item.tag}
              </span>
            </div>
            {/* Tooltip Triangle Arrow */}
            <div className="w-2 h-2 bg-gray-900 dark:bg-[#18181C] border-r border-b border-[#D97706]/40 dark:border-[#FFB800]/40 rotate-45 -mt-1" />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export const Dock: React.FC<DockProps> = ({
  items,
  className,
  onSelectItem,
  selectedItemId,
}) => {
  const mouseX = useMotionValue(Infinity);

  return (
    <div
      onMouseMove={(e) => mouseX.set(e.pageX)}
      onMouseLeave={() => mouseX.set(Infinity)}
      className={cn('flex items-center justify-center py-4', className)}
    >
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        className={cn(
          'flex items-center gap-2.5 sm:gap-3.5 p-3 sm:p-4 rounded-3xl',
          'glass-panel border border-[#FFB800]/30 shadow-amber-glow',
          'bg-white/80 dark:bg-[#101014]/80 backdrop-blur-xl',
          'overflow-x-auto max-w-full no-scrollbar'
        )}
      >
        {items.map((item) => (
          <DockIcon
            key={item.id}
            item={item}
            mouseX={mouseX}
            isSelected={selectedItemId === item.id}
            onClick={() => onSelectItem?.(item)}
          />
        ))}
      </motion.div>
    </div>
  );
};
