'use client';

import React from 'react';
import { ArrowUp, Terminal, Code2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="border-t border-gray-200 dark:border-[#252529] bg-[#F8F9FC] dark:bg-[#101014] py-12 px-4 relative transition-colors duration-300">
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Brand & System Status */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-white dark:bg-[#18181C] border border-amber-500/30 dark:border-[#FFB800]/30 text-[#D97706] dark:text-[#FFB800] flex items-center justify-center font-mono font-bold text-xs shadow-amber-glow">
            <Terminal className="w-4 h-4" />
          </div>
          <div>
            <div className="font-heading font-bold text-slate-900 dark:text-[#D9D9D9] text-sm flex items-center gap-2">
              <span>Steven</span>
              <span className="text-slate-500 dark:text-[#8E8E93] font-mono text-xs font-normal">| Cyber Industrial Portfolio</span>
            </div>
            <p className="font-mono text-xs text-slate-500 dark:text-[#8E8E93] mt-0.5">
              Built with Next.js 15, Tailwind CSS, & Supabase.
            </p>
          </div>
        </div>

        {/* System copyright & quick back to top */}
        <div className="flex items-center gap-6">
          <span className="font-mono text-xs text-slate-500 dark:text-[#8E8E93]">
            &copy; {new Date().getFullYear()} Steven. All rights reserved.
          </span>

          <button
            onClick={scrollToTop}
            className="p-2.5 rounded-xl bg-white dark:bg-[#18181C] border border-gray-200 dark:border-[#252529] text-slate-500 dark:text-[#8E8E93] hover:text-[#D97706] dark:hover:text-[#FFB800] hover:border-[#D97706]/40 dark:hover:border-[#FFB800]/40 transition-all group shadow-sm"
            title="Back to Top"
          >
            <ArrowUp className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>
    </footer>
  );
};
