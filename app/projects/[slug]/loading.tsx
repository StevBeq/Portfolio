import React from 'react';

export default function ProjectLoading() {
  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0E0E12] text-slate-900 dark:text-[#E0E0E0] antialiased">
      {/* Header Skeleton */}
      <div className="h-16 border-b border-gray-200 dark:border-[#252529] bg-white/85 dark:bg-[#101014]/85 px-4 md:px-8 flex items-center justify-between">
        <div className="w-36 h-8 rounded-xl bg-slate-200 dark:bg-[#202026] animate-pulse" />
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-slate-200 dark:bg-[#202026] animate-pulse" />
          <div className="w-28 h-9 rounded-xl bg-slate-200 dark:bg-[#202026] animate-pulse" />
        </div>
      </div>

      {/* Main Skeleton Content */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-20 space-y-12">
        {/* Badges & Title Skeleton */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-44 h-7 rounded-lg bg-amber-500/10 dark:bg-amber-500/10 border border-amber-500/20 animate-pulse" />
            <div className="w-36 h-7 rounded-lg bg-slate-200 dark:bg-[#202026] animate-pulse" />
          </div>

          <div className="w-3/4 h-12 md:h-16 rounded-2xl bg-slate-200 dark:bg-[#1E1E24] animate-pulse" />
          <div className="w-full h-6 rounded-lg bg-slate-200 dark:bg-[#1A1A20] animate-pulse" />
          <div className="w-2/3 h-6 rounded-lg bg-slate-200 dark:bg-[#1A1A20] animate-pulse" />

          {/* Tech pills skeleton */}
          <div className="flex items-center gap-2 pt-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div
                key={i}
                className="w-20 h-7 rounded-xl bg-slate-200 dark:bg-[#1C1C22] animate-pulse"
              />
            ))}
          </div>
        </div>

        {/* Hero Mockup Banner Skeleton */}
        <div className="w-full aspect-video rounded-3xl bg-slate-200 dark:bg-[#16161C] border border-gray-200 dark:border-[#252529] p-4 flex flex-col justify-between animate-pulse">
          <div className="w-full h-6 border-b border-gray-300 dark:border-[#222] flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-[#333]" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-[#333]" />
            <span className="w-2.5 h-2.5 rounded-full bg-slate-300 dark:bg-[#333]" />
          </div>
          <div className="flex-1 flex items-center justify-center">
            <div className="w-14 h-14 rounded-full bg-slate-300 dark:bg-[#252529]" />
          </div>
        </div>

        {/* Architecture Grid Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-6 rounded-2xl bg-white dark:bg-[#141418] border border-gray-200 dark:border-[#252529] space-y-3 shadow-xs animate-pulse"
            >
              <div className="w-32 h-5 rounded-md bg-amber-500/20" />
              <div className="w-full h-4 rounded bg-slate-200 dark:bg-[#202026]" />
              <div className="w-4/5 h-4 rounded bg-slate-200 dark:bg-[#202026]" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
