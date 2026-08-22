'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Github,
  Linkedin,
  Instagram,
  Mail,
  MessageCircle,
  Check,
  ChevronUp,
  ChevronDown,
  Sparkles,
  Share2,
  X,
} from 'lucide-react';

interface SocialItem {
  id: string;
  name: string;
  handle: string;
  url: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  hoverBg: string;
  action?: 'copy' | 'link';
}

const SOCIAL_ITEMS: SocialItem[] = [
  {
    id: 'github',
    name: 'GitHub',
    handle: '@steven-dev',
    url: 'https://github.com',
    icon: Github,
    color: 'text-slate-700 dark:text-slate-200',
    hoverBg: 'hover:bg-[#24292e] hover:text-white',
    action: 'link',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    handle: 'Steven Arnaldo',
    url: 'https://linkedin.com',
    icon: Linkedin,
    color: 'text-[#0A66C2]',
    hoverBg: 'hover:bg-[#0A66C2] hover:text-white',
    action: 'link',
  },
  {
    id: 'instagram',
    name: 'Instagram',
    handle: '@steven.arnaldo',
    url: 'https://instagram.com',
    icon: Instagram,
    color: 'text-pink-500',
    hoverBg: 'hover:bg-gradient-to-tr hover:from-amber-500 hover:via-pink-500 hover:to-purple-500 hover:text-white',
    action: 'link',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp',
    handle: '+62 812-3456-7890',
    url: 'https://wa.me/6281234567890',
    icon: MessageCircle,
    color: 'text-emerald-500',
    hoverBg: 'hover:bg-[#25D366] hover:text-white',
    action: 'link',
  },
  {
    id: 'email',
    name: 'Email',
    handle: 'steven.arnaldo@gmail.com',
    url: 'steven.arnaldo@gmail.com',
    icon: Mail,
    color: 'text-[#D97706] dark:text-[#FFB800]',
    hoverBg: 'hover:bg-[#D97706] dark:hover:bg-[#FFB800] hover:text-white dark:hover:text-[#101014]',
    action: 'copy',
  },
];

export const FloatingSocialDock: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const closeTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const handleMouseEnter = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
      closeTimeoutRef.current = null;
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (closeTimeoutRef.current) {
      clearTimeout(closeTimeoutRef.current);
    }
    closeTimeoutRef.current = setTimeout(() => {
      setIsOpen(false);
      setHoveredId(null);
    }, 400);
  };

  const handleClick = (item: SocialItem, e: React.MouseEvent) => {
    if (item.action === 'copy') {
      e.preventDefault();
      navigator.clipboard.writeText(item.url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="fixed left-5 bottom-7 z-40 select-none"
    >
      {/* Main Single Continuous Container (Zero Blinking, Zero Teleporting) */}
      <div className="relative flex flex-col items-start">
        
        {/* Expanded Items List (Animates Upwards Smoothly) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.95 }}
              transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
              className="mb-2 p-2 rounded-2xl bg-white/95 dark:bg-[#16161C]/95 border border-gray-200 dark:border-[#282832] backdrop-blur-xl shadow-2xl flex flex-col gap-1.5 min-w-[190px]"
            >
              <div className="px-2.5 py-1 text-[10px] font-mono font-bold text-slate-400 dark:text-[#777] uppercase tracking-wider border-b border-gray-100 dark:border-[#22222A] flex items-center justify-between">
                <span>CONNECT DIRECTLY</span>
                <Sparkles className="w-3 h-3 text-[#D97706] dark:text-[#FFB800]" />
              </div>

              {SOCIAL_ITEMS.map((item) => {
                const Icon = item.icon;
                const isCopiedEmail = item.id === 'email' && copied;

                return item.action === 'copy' ? (
                  <button
                    key={item.id}
                    onClick={(e) => handleClick(item, e)}
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-mono font-medium transition-all duration-150 cursor-pointer text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#202028] ${item.hoverBg}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`p-1.5 rounded-lg bg-slate-100 dark:bg-[#1E1E26] ${item.color}`}>
                        {isCopiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Icon className="w-4 h-4" />}
                      </span>
                      <span className="font-bold">{item.name}</span>
                    </div>

                    <span className="text-[10px] opacity-75">
                      {isCopiedEmail ? 'COPIED!' : 'COPY'}
                    </span>
                  </button>
                ) : (
                  <a
                    key={item.id}
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onMouseEnter={() => setHoveredId(item.id)}
                    onMouseLeave={() => setHoveredId(null)}
                    className={`w-full px-3 py-2 rounded-xl flex items-center justify-between text-xs font-mono font-medium transition-all duration-150 cursor-pointer text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-[#202028] ${item.hoverBg}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className={`p-1.5 rounded-lg bg-slate-100 dark:bg-[#1E1E26] ${item.color}`}>
                        <Icon className="w-4 h-4" />
                      </span>
                      <span className="font-bold">{item.name}</span>
                    </div>

                    <span className="text-[10px] opacity-50 font-normal">
                      ↗
                    </span>
                  </a>
                );
              })}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Stable Anchor Trigger Pill (Always Present at the exact same coordinate) */}
        <button
          onClick={() => setIsOpen((prev) => !prev)}
          className={`group px-3.5 py-2.5 rounded-2xl flex items-center gap-2.5 transition-all duration-200 cursor-pointer shadow-lg backdrop-blur-xl border ${
            isOpen
              ? 'bg-slate-900 text-white dark:bg-white dark:text-[#101014] border-transparent shadow-amber-500/10'
              : 'bg-white/90 dark:bg-[#16161C]/90 text-slate-800 dark:text-slate-200 border-gray-200 dark:border-[#282832] hover:border-[#D97706]/50 dark:hover:border-[#FFB800]/50'
          }`}
          aria-label="Toggle social channels dock"
        >
          {/* Pulsing Signal Dot */}
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D97706] dark:bg-[#FFB800] opacity-75" />
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#D97706] dark:bg-[#FFB800]" />
          </span>

          <span className="font-mono text-xs font-bold tracking-wider flex items-center gap-1.5">
            <span>SOCIALS</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-amber-500/15 text-[#D97706] dark:text-[#FFB800]">
              5
            </span>
          </span>

          {isOpen ? (
            <ChevronDown className="w-3.5 h-3.5 opacity-70 transition-transform" />
          ) : (
            <ChevronUp className="w-3.5 h-3.5 opacity-70 transition-transform group-hover:-translate-y-0.5" />
          )}
        </button>

      </div>
    </div>
  );
};
