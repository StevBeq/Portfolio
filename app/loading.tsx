import React from 'react';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#101014] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-500/10 border-2 border-amber-500/40 border-t-[#D97706] dark:border-t-[#FFB800] animate-spin" />
        <span className="font-mono text-xs font-bold text-slate-500 dark:text-[#8E8E93] tracking-widest uppercase animate-pulse">
          INITIALIZING PORTFOLIO...
        </span>
      </div>
    </div>
  );
}
