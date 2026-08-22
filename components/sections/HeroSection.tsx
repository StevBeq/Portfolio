'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import {
  Download,
  Github,
  Linkedin,
  Instagram,
  ArrowDownRight,
  Terminal,
  ChevronDown,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { Profile } from '@/lib/supabase/types';
import { ParticleField } from '../ui/ParticleField';

interface HeroSectionProps {
  profile: Profile | null;
}

// Staggered text reveal variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.04,
      delayChildren: 0.1,
    },
  },
};

const wordVariants = {
  hidden: {
    opacity: 0,
    y: 16,
    rotateX: -20,
    filter: 'blur(4px)',
  },
  visible: {
    opacity: 1,
    y: 0,
    rotateX: 0,
    filter: 'blur(0px)',
    transition: {
      duration: 0.45,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  },
};

const slideUpVariants = {
  hidden: { opacity: 0, y: 18 },
  visible: (delay: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.45,
      delay,
      ease: [0.16, 1, 0.3, 1] as const,
    },
  }),
};

// Animated stat counter
const AnimatedCounter: React.FC<{ value: number; suffix?: string; label: string; delay?: number }> = ({
  value,
  suffix = '',
  label,
  delay = 0,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const duration = 900;
      const steps = 20;
      const stepTime = duration / steps;
      let current = 0;
      const increment = value / steps;
      const interval = setInterval(() => {
        current += increment;
        if (current >= value) {
          setCount(value);
          clearInterval(interval);
        } else {
          setCount(Math.floor(current));
        }
      }, stepTime);
    }, (delay + 0.4) * 1000);

    return () => clearTimeout(timeout);
  }, [value, delay]);

  return (
    <div className="text-center sm:text-left select-none">
      <div className="text-xl sm:text-2xl font-bold font-heading text-[#D97706] dark:text-[#FFB800] tabular-nums">
        {count}{suffix}
      </div>
      <div className="text-[10px] font-mono text-slate-500 dark:text-[#8E8E93] uppercase tracking-wider mt-0.5">
        {label}
      </div>
    </div>
  );
};

export const HeroSection: React.FC<HeroSectionProps> = ({ profile }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHoveredCard, setIsHoveredCard] = useState(false);

  const fullName = profile?.full_name || 'Steven Arnaldo';
  const title = profile?.title || 'Full-Stack Software Engineer & UI/UX Architect';
  const heroBio =
    profile?.hero_bio ||
    'Building modern, scalable web applications and high-performance cloud infrastructure with cyber-industrial visual precision.';

  const resumeUrl = profile?.resume_url;
  const socialLinks = profile?.social_links || {};

  // Avatar source resolution
  const initialAvatar = profile?.hero_avatar_url || '/Foto-Semi-Forma.webp';
  const [avatarSrc, setAvatarSrc] = useState(initialAvatar);

  useEffect(() => {
    if (profile?.hero_avatar_url) {
      setAvatarSrc(profile.hero_avatar_url);
    }
  }, [profile?.hero_avatar_url]);

  const nameChars = fullName.split('');

  return (
    <section
      ref={containerRef}
      id="hero"
      className="relative min-h-screen w-full flex flex-col justify-center items-center bg-[#F8F9FC] dark:bg-[#101014] transition-colors duration-300 select-none overflow-hidden pt-28 pb-16 lg:py-20"
    >
      {/* Background Interactive Canvas Particle Layer */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <ParticleField particleCount={45} connectionDistance={110} mouseInfluenceRadius={140} />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F8F9FC] dark:to-[#101014] pointer-events-none" />
      </div>

      {/* Cyber Grid Pattern Overlay */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.035] z-0 cyber-grid-bg" />

      {/* Hero Content Container */}
      <div className="relative z-10 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 grid grid-cols-1 lg:grid-cols-12 items-center gap-12 lg:gap-16">
        {/* Left Column: Hero Text & Information */}
        <div className="lg:col-span-7 flex flex-col justify-center items-center lg:items-start text-center lg:text-left z-20">
          {/* Status Badge */}
          <motion.div custom={0} variants={slideUpVariants} initial="hidden" animate="visible" className="mb-4">
            <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/90 dark:bg-[#18181C]/90 backdrop-blur-md border border-amber-500/30 dark:border-[#FFB800]/30 shadow-md">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#D97706] dark:bg-[#FFB800] opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-[#D97706] dark:bg-[#FFB800]" />
              </span>
              <Terminal className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FFB800]" />
              <span className="font-mono text-[11px] text-[#D97706] dark:text-[#FFB800] font-semibold tracking-wider uppercase">
                AVAILABLE FOR FREELANCE & FULL-TIME ROLES
              </span>
            </div>
          </motion.div>

          {/* Location & Prompt */}
          <motion.div
            custom={0.1}
            variants={slideUpVariants}
            initial="hidden"
            animate="visible"
            className="text-xs sm:text-sm font-mono text-slate-500 dark:text-[#8E8E93] tracking-widest uppercase mb-3 flex items-center gap-2"
          >
            <span className="text-[#D97706] dark:text-[#FFB800] font-bold">$</span> whoami
            <span className="text-slate-300 dark:text-[#333338]">|</span>
            <MapPin className="w-3.5 h-3.5 text-slate-400 dark:text-[#8E8E93]" />
            <span>Surabaya, ID (UTC+7)</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="text-4xl sm:text-6xl lg:text-7xl font-extrabold font-heading tracking-tight leading-[1.08] mb-4 flex flex-wrap items-center justify-center lg:justify-start gap-x-3"
          >
            <span className="text-slate-900 dark:text-[#D9D9D9]">I&apos;m</span>
            <span className="relative inline-block text-transparent bg-clip-text bg-gradient-to-r from-[#D97706] via-[#F59E0B] to-[#D97706] dark:from-[#FFB800] dark:via-[#F59E0B] dark:to-[#FFB800]">
              {nameChars.map((char, i) => (
                <motion.span key={i} variants={wordVariants} className="inline-block">
                  {char === ' ' ? '\u00A0' : char}
                </motion.span>
              ))}
              <motion.span
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="absolute -bottom-1 left-0 right-0 h-[3px] bg-gradient-to-r from-transparent via-[#D97706] dark:via-[#FFB800] to-transparent origin-left shadow-[0_0_12px_rgba(255,184,0,0.7)]"
              />
            </span>
          </motion.h1>

          {/* Subtitle Role */}
          <motion.p
            custom={0.3}
            variants={slideUpVariants}
            initial="hidden"
            animate="visible"
            className="text-lg sm:text-xl lg:text-2xl font-mono text-slate-800 dark:text-[#D9D9D9] font-medium mb-4 max-w-2xl"
          >
            {title}
          </motion.p>

          {/* Hero Short Bio */}
          <motion.p
            custom={0.4}
            variants={slideUpVariants}
            initial="hidden"
            animate="visible"
            className="text-sm sm:text-base text-slate-600 dark:text-[#8E8E93]/90 leading-relaxed max-w-xl mb-8"
          >
            {heroBio}
          </motion.p>

          {/* Action CTAs */}
          <motion.div
            custom={0.55}
            variants={slideUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center justify-center lg:justify-start gap-4 mb-10"
          >
            <a
              href="#projects"
              className="group relative flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-[#D97706] dark:bg-[#FFB800] text-white dark:text-[#101014] font-mono text-xs font-bold tracking-wider overflow-hidden shadow-lg hover:shadow-amber-glow-lg transition-all duration-300"
            >
              <span className="relative z-10">EXPLORE PROJECTS</span>
              <ArrowDownRight className="w-4 h-4 relative z-10 group-hover:translate-x-0.5 group-hover:translate-y-0.5 transition-transform" />
              <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 ease-out" />
            </a>

            {resumeUrl && (
              <a
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
                className="group flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-white/80 dark:bg-[#18181C]/80 backdrop-blur-sm border border-amber-500/30 dark:border-[#FFB800]/25 text-[#D97706] dark:text-[#FFB800] font-mono text-xs font-bold tracking-wider hover:bg-amber-50 dark:hover:bg-[#FFB800]/10 transition-all duration-300 shadow-md"
              >
                <Download className="w-4 h-4 group-hover:-translate-y-0.5 transition-transform" />
                <span>DOWNLOAD CV</span>
              </a>
            )}
          </motion.div>

          {/* Social Icons & Counter Stats */}
          <motion.div
            custom={0.7}
            variants={slideUpVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-wrap items-center justify-center lg:justify-start gap-6 pt-5 border-t border-slate-200/80 dark:border-[#252529]/80 w-full"
          >
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10px] text-slate-400 dark:text-[#8E8E93] tracking-widest mr-1 uppercase font-bold">
                CONNECT
              </span>
              {socialLinks.github && (
                <a
                  href={socialLinks.github}
                  target="_blank"
                  rel="noreferrer"
                  className="group p-2.5 rounded-xl bg-white/80 dark:bg-[#18181C]/80 backdrop-blur-sm text-slate-500 dark:text-[#8E8E93] hover:text-[#D97706] dark:hover:text-[#FFB800] border border-slate-200/50 dark:border-[#252529]/50 hover:border-[#D97706]/40 dark:hover:border-[#FFB800]/30 transition-all duration-300 shadow-sm hover:shadow-amber-glow"
                  title="GitHub"
                >
                  <Github className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              )}
              {socialLinks.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noreferrer"
                  className="group p-2.5 rounded-xl bg-white/80 dark:bg-[#18181C]/80 backdrop-blur-sm text-slate-500 dark:text-[#8E8E93] hover:text-[#D97706] dark:hover:text-[#FFB800] border border-slate-200/50 dark:border-[#252529]/50 hover:border-[#D97706]/40 dark:hover:border-[#FFB800]/30 transition-all duration-300 shadow-sm hover:shadow-amber-glow"
                  title="LinkedIn"
                >
                  <Linkedin className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              )}
              {socialLinks.instagram && (
                <a
                  href={socialLinks.instagram}
                  target="_blank"
                  rel="noreferrer"
                  className="group p-2.5 rounded-xl bg-white/80 dark:bg-[#18181C]/80 backdrop-blur-sm text-slate-500 dark:text-[#8E8E93] hover:text-[#D97706] dark:hover:text-[#FFB800] border border-slate-200/50 dark:border-[#252529]/50 hover:border-[#D97706]/40 dark:hover:border-[#FFB800]/30 transition-all duration-300 shadow-sm hover:shadow-amber-glow"
                  title="Instagram"
                >
                  <Instagram className="w-4 h-4 group-hover:scale-110 transition-transform" />
                </a>
              )}
            </div>

            <div className="hidden sm:block w-px h-6 bg-slate-200 dark:bg-[#252529]" />

            <div className="flex items-center gap-5 sm:gap-7">
              <AnimatedCounter value={3} suffix="+" label="Years Exp" delay={0} />
              <div className="w-px h-5 bg-slate-200 dark:bg-[#252529]" />
              <AnimatedCounter value={10} suffix="+" label="Projects" delay={0.1} />
              <div className="w-px h-5 bg-slate-200 dark:bg-[#252529]" />
              <AnimatedCounter value={5} suffix="+" label="Tech Stack" delay={0.2} />
            </div>
          </motion.div>
        </div>

        {/* Right Column: Hero Portrait Photo Card */}
        <div className="lg:col-span-5 flex items-center justify-center z-30">
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="w-full flex items-center justify-center shrink-0 pointer-events-auto select-none"
          >
            <div
              className="relative group w-64 sm:w-80 lg:w-[340px] xl:w-[360px] aspect-[4/5] max-h-[480px] flex items-center justify-center cursor-pointer select-none"
              onMouseEnter={() => setIsHoveredCard(true)}
              onMouseLeave={() => setIsHoveredCard(false)}
            >
              {/* Ambient Glow */}
              <div
                className={`absolute -inset-3 rounded-3xl blur-2xl transition-all duration-500 pointer-events-none ${
                  isHoveredCard
                    ? 'bg-gradient-to-tr from-[#D97706]/40 via-amber-500/30 to-[#FFB800]/45 opacity-100 scale-105'
                    : 'bg-gradient-to-tr from-[#D97706]/20 via-amber-500/15 to-[#FFB800]/25 opacity-70'
                }`}
              />

              {/* Portrait Frame Container - Light/Dark Adaptive Background */}
              <motion.div
                animate={{
                  scale: isHoveredCard ? 1.02 : 1,
                  rotateY: isHoveredCard ? 2 : 0,
                  rotateX: isHoveredCard ? -1.5 : 0,
                }}
                transition={{ type: 'spring', stiffness: 240, damping: 22 }}
                className="relative w-full h-full rounded-3xl overflow-hidden z-10 shadow-2xl border border-slate-200/80 dark:border-[#FFB800]/35 bg-slate-100 dark:bg-[#18181C] select-none"
              >
                {/* Protected Uncropped Photo */}
                <img
                  src={avatarSrc}
                  alt={fullName}
                  draggable={false}
                  onDragStart={(e) => e.preventDefault()}
                  onContextMenu={(e) => e.preventDefault()}
                  onError={() => setAvatarSrc('/Foto-Semi-Forma.webp')}
                  className={`w-full h-full object-cover object-top transition-transform duration-700 ease-out select-none pointer-events-none ${
                    isHoveredCard ? 'scale-105 filter brightness-105' : 'scale-100'
                  }`}
                  style={{
                    WebkitUserSelect: 'none',
                    userSelect: 'none',
                    ...({ WebkitUserDrag: 'none' } as React.CSSProperties),
                  }}
                />

                {/* Light Sweep Effect */}
                <div
                  className={`absolute inset-0 bg-gradient-to-tr from-transparent via-white/15 to-transparent pointer-events-none transition-opacity duration-500 ${
                    isHoveredCard ? 'opacity-100' : 'opacity-0'
                  }`}
                />

                {/* Bottom Overlay Gradient */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/40 dark:from-[#101014]/80 via-transparent to-transparent opacity-70 pointer-events-none" />

                {/* Bottom Label Badge - Appears ONLY on Hover */}
                <div
                  className={`absolute bottom-3 left-3 right-3 p-3 rounded-2xl bg-white/95 dark:bg-[#18181C]/95 backdrop-blur-md border border-amber-500/30 dark:border-[#FFB800]/35 text-slate-900 dark:text-white shadow-xl pointer-events-none transition-all duration-300 transform ${
                    isHoveredCard
                      ? 'opacity-100 translate-y-0 scale-100'
                      : 'opacity-0 translate-y-3 scale-95'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FFB800]" />
                      <span className="font-mono text-xs font-bold text-[#D97706] dark:text-[#FFB800]">
                        {fullName}
                      </span>
                    </div>
                  </div>
                  <p className="text-[11px] text-slate-600 dark:text-[#8E8E93] mt-0.5 font-medium truncate">
                    {title}
                  </p>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Down Prompt Indicator */}
      <a
        href="#about"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1 cursor-pointer group"
      >
        <span className="font-mono text-[10px] text-slate-400 dark:text-[#8E8E93] tracking-widest uppercase group-hover:text-[#D97706] dark:group-hover:text-[#FFB800] transition-colors">
          SCROLL TO DISCOVER
        </span>
        <motion.div animate={{ y: [0, 5, 0] }} transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}>
          <ChevronDown className="w-4 h-4 text-[#D97706] dark:text-[#FFB800]" />
        </motion.div>
      </a>
    </section>
  );
};
