'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  User,
  Sparkles,
  Code2,
  Smartphone,
  Cpu,
  Layers,
  CheckCircle2,
  Terminal,
  Zap,
} from 'lucide-react';
import { Profile } from '@/lib/supabase/types';
import { AboutBackgroundCanvas } from '@/components/ui/AboutBackgroundCanvas';
import { ExecutivePortraitCard } from '@/components/ui/ExecutivePortraitCard';

interface AboutSectionProps {
  profile: Profile | null;
}

export const AboutSection: React.FC<AboutSectionProps> = ({ profile }) => {
  const aboutBio =
    profile?.about_bio ||
    'Full-Stack Software Engineer & UI/UX Architect with over 3+ years of experience crafting scalable web and mobile applications. My core expertise spans Next.js, TypeScript, Supabase, and Flutter—delivering high-performance backend architectures paired with responsive 60fps user interfaces. Moving forward, my career goal is to architect enterprise-grade cloud systems and pioneer AI-integrated web platforms.';

  const avatarUrl = profile?.about_avatar_url || '/Foto-Semi-Forma.webp';
  const fullName = profile?.full_name || 'Steven Arnaldo';
  const title = profile?.title || 'Full-Stack Software Engineer & Mobile Developer';

  return (
    <section
      id="about"
      className="scroll-mt-24 py-20 relative bg-[#F8F9FC] dark:bg-[#101014] border-t border-slate-200/80 dark:border-[#252529] transition-colors duration-300 overflow-hidden select-none"
    >
      {/* Interactive Ambient Background Canvas (Constellation & Particle Field behind Cards) */}
      <AboutBackgroundCanvas />

      {/* Ambient Lighting Accents */}
      <div className="absolute inset-0 pointer-events-none opacity-30 dark:opacity-20 z-0">
        <div className="absolute top-1/4 -left-32 w-96 h-96 rounded-full bg-[#D97706]/10 dark:bg-[#FFB800]/10 blur-[140px]" />
        <div className="absolute bottom-1/4 -right-32 w-96 h-96 rounded-full bg-amber-500/10 dark:bg-[#FFB800]/10 blur-[140px]" />
      </div>

      <div className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-80px' }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-wrap items-center justify-between gap-4 mb-10 pb-4 border-b border-slate-200/80 dark:border-[#252529]"
        >
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 dark:bg-[#FFB800]/10 text-[#D97706] dark:text-[#FFB800] border border-amber-500/20 dark:border-[#FFB800]/20">
              <User className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold font-heading text-slate-900 dark:text-[#D9D9D9] tracking-tight">
                ABOUT ME
              </h2>
              <p className="text-xs font-mono text-slate-500 dark:text-[#8E8E93] mt-0.5">
                FULL-STACK SOFTWARE ENGINEER & MOBILE DEVELOPER
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/80 dark:bg-[#18181C]/80 backdrop-blur-md border border-slate-200 dark:border-[#252529] shadow-xs">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-xs font-semibold text-slate-700 dark:text-[#8E8E93]">
              [01 / OVERVIEW]
            </span>
          </div>
        </motion.div>

        {/* 2-Column Bento Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Column (5 Cols): Clean HD Executive Portrait Card with 3D Tilt */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.05, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-5 flex flex-col justify-between"
          >
            <ExecutivePortraitCard imageSrc={avatarUrl} fullName={fullName} title={title} />
          </motion.div>

          {/* Right Column (7 Cols): Bio Content & Domain Bento Cards */}
          <motion.div
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ duration: 0.5, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="lg:col-span-7 flex flex-col justify-between space-y-6"
          >
            {/* Professional Bio Card */}
            <div className="p-6 sm:p-8 rounded-3xl bg-white/90 dark:bg-[#18181C]/90 backdrop-blur-md border border-slate-200/80 dark:border-[#252529] shadow-sm hover:border-[#D97706]/30 dark:hover:border-[#FFB800]/25 transition-all duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Sparkles className="w-5 h-5 text-[#D97706] dark:text-[#FFB800]" />
                <h3 className="text-xl font-bold font-heading text-slate-900 dark:text-[#D9D9D9]">
                  Engineered for Scale & Performance
                </h3>
              </div>

              <p className="text-base sm:text-lg text-slate-700 dark:text-[#D9D9D9]/90 leading-relaxed font-sans mb-8">
                {aboutBio}
              </p>

              {/* 3 Domain Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-6 border-t border-slate-100 dark:border-[#252529]">
                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#101014]/80 border border-slate-200/70 dark:border-[#252529] hover:border-[#D97706]/40 dark:hover:border-[#FFB800]/40 transition-colors duration-200">
                  <div className="p-2 w-fit rounded-xl bg-amber-500/10 text-[#D97706] dark:text-[#FFB800] mb-2.5">
                    <Code2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold font-heading text-slate-900 dark:text-[#D9D9D9]">
                    Full-Stack Web
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-[#8E8E93] mt-1 leading-snug">
                    Next.js 15, TypeScript, & Supabase backends.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#101014]/80 border border-slate-200/70 dark:border-[#252529] hover:border-[#D97706]/40 dark:hover:border-[#FFB800]/40 transition-colors duration-200">
                  <div className="p-2 w-fit rounded-xl bg-amber-500/10 text-[#D97706] dark:text-[#FFB800] mb-2.5">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold font-heading text-slate-900 dark:text-[#D9D9D9]">
                    Mobile Dev
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-[#8E8E93] mt-1 leading-snug">
                    Cross-platform mobile apps using Flutter.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50/80 dark:bg-[#101014]/80 border border-slate-200/70 dark:border-[#252529] hover:border-[#D97706]/40 dark:hover:border-[#FFB800]/40 transition-colors duration-200">
                  <div className="p-2 w-fit rounded-xl bg-amber-500/10 text-[#D97706] dark:text-[#FFB800] mb-2.5">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-bold font-heading text-slate-900 dark:text-[#D9D9D9]">
                    Cloud & AI Goals
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-[#8E8E93] mt-1 leading-snug">
                    Architecting enterprise cloud & AI platforms.
                  </p>
                </div>
              </div>
            </div>

            {/* 3 Key Metric Counters */}
            <div className="grid grid-cols-3 gap-4">
              <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#18181C]/90 backdrop-blur-md border border-slate-200/80 dark:border-[#252529] shadow-sm text-center">
                <span className="text-2xl sm:text-3xl font-extrabold font-heading text-[#D97706] dark:text-[#FFB800]">
                  3+
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-[#8E8E93] block mt-1 uppercase tracking-tight">
                  Years Experience
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#18181C]/90 backdrop-blur-md border border-slate-200/80 dark:border-[#252529] shadow-sm text-center">
                <span className="text-2xl sm:text-3xl font-extrabold font-heading text-[#D97706] dark:text-[#FFB800]">
                  12+
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-[#8E8E93] block mt-1 uppercase tracking-tight">
                  Projects Built
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#18181C]/90 backdrop-blur-md border border-slate-200/80 dark:border-[#252529] shadow-sm text-center">
                <span className="text-2xl sm:text-3xl font-extrabold font-heading text-[#D97706] dark:text-[#FFB800]">
                  60fps
                </span>
                <span className="text-[10px] font-mono text-slate-500 dark:text-[#8E8E93] block mt-1 uppercase tracking-tight">
                  UI Motion Benchmark
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
