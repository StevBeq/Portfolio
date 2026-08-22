'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  FolderGit2,
  ExternalLink,
  Github,
  Sparkles,
  ArrowRight,
  ChevronLeft,
  ChevronRight,
  Layers,
} from 'lucide-react';
import { Project, ProjectCategory } from '@/lib/supabase/types';
import { INITIAL_PROJECTS } from '@/lib/mockData';

interface ProjectsSectionProps {
  projects?: Project[];
  isLoading?: boolean;
}

export const ProjectsSection: React.FC<ProjectsSectionProps> = ({
  projects,
  isLoading = false,
}) => {
  const [activeFilter, setActiveFilter] = useState<'all' | ProjectCategory>('all');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);

  // 3D Parallax Tilt state
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const deviceStageRef = useRef<HTMLDivElement>(null);
  const thumbRailRef = useRef<HTMLDivElement>(null);

  const displayProjects = projects && projects.length > 0 ? projects : INITIAL_PROJECTS;

  const filteredProjects = displayProjects.filter((p) => {
    if (activeFilter === 'all') return p.status === 'published';
    return p.status === 'published' && p.category === activeFilter;
  });

  const totalFiltered = filteredProjects.length;
  const safeIndex = Math.min(selectedIndex, Math.max(0, totalFiltered - 1));
  const activeProject = filteredProjects[safeIndex] || filteredProjects[0] || displayProjects[0];

  const handleFilterChange = (filter: 'all' | ProjectCategory) => {
    setActiveFilter(filter);
    setSelectedIndex(0);
    setDirection(1);
  };

  const handleSelectProject = (index: number) => {
    setDirection(index > safeIndex ? 1 : -1);
    setSelectedIndex(index);

    // Auto scroll thumbnail into view
    if (thumbRailRef.current) {
      const thumbs = thumbRailRef.current.querySelectorAll('[data-thumb-btn]');
      if (thumbs[index]) {
        (thumbs[index] as HTMLElement).scrollIntoView({
          behavior: 'smooth',
          block: 'nearest',
          inline: 'center',
        });
      }
    }
  };

  const handleNext = () => {
    if (safeIndex < totalFiltered - 1) {
      handleSelectProject(safeIndex + 1);
    }
  };

  const handlePrev = () => {
    if (safeIndex > 0) {
      handleSelectProject(safeIndex - 1);
    }
  };

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const section = document.getElementById('projects');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;
      if (!inView) return;

      if (e.key === 'ArrowRight') {
        if (safeIndex < totalFiltered - 1) {
          e.preventDefault();
          handleNext();
        }
      } else if (e.key === 'ArrowLeft') {
        if (safeIndex > 0) {
          e.preventDefault();
          handlePrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [safeIndex, totalFiltered]);

  // Smooth mouse tilt handler
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!deviceStageRef.current) return;
    const rect = deviceStageRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  const rotateX = isHovered ? (mousePos.y - 0.5) * -8 : 0;
  const rotateY = isHovered ? (mousePos.x - 0.5) * 8 : 0;

  const primaryImage =
    activeProject.project_images?.find((img) => img.is_thumbnail)?.image_url ||
    activeProject.project_images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';

  const hasLiveUrl = Boolean(activeProject.live_url && activeProject.live_url.trim() !== '');
  const hasGithubUrl = Boolean(activeProject.github_url && activeProject.github_url.trim() !== '');

  return (
    <section
      id="projects"
      className="section-viewport section-divider pt-32 pb-20 relative bg-[#F8F9FC] dark:bg-[#101014] border-t border-gray-200 dark:border-[#252529] transition-colors duration-300 overflow-hidden scroll-mt-20"
    >
      {/* Ambient Cyber Gold Glow Accent */}
      <div className="absolute top-1/2 left-3/4 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-[#D97706]/10 via-[#FFB800]/5 to-transparent dark:from-[#FFB800]/10 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl w-full mx-auto px-4 md:px-10">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-2.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 dark:bg-[#18181C] border border-amber-500/30 dark:border-[#FFB800]/30 font-mono text-xs text-[#D97706] dark:text-[#FFB800] tracking-wider">
              <FolderGit2 className="w-3.5 h-3.5" />
              <span>3D INTERACTIVE THEATER SHOWCASE</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold font-heading text-slate-900 dark:text-[#D9D9D9] tracking-tight">
              Featured <span className="text-[#D97706] dark:text-[#FFB800]">Projects</span>
            </h2>

            <p className="text-slate-600 dark:text-[#8E8E93] text-sm md:text-base max-w-xl">
              Architectural engineering highlights, production platforms, and scalable full-stack applications.
            </p>
          </div>

          {/* Filter Pills & Stepper */}
          <div className="flex flex-wrap items-center gap-3">
            <div className="inline-flex items-center p-1.5 bg-slate-100 dark:bg-[#18181C] rounded-2xl border border-gray-200 dark:border-[#252529] shadow-sm">
              {(['all', 'completed', 'ongoing'] as const).map((filter) => {
                const count =
                  filter === 'all'
                    ? displayProjects.length
                    : displayProjects.filter((p) => p.category === filter).length;

                const label =
                  filter === 'all'
                    ? `ALL (${count})`
                    : filter === 'completed'
                    ? `COMPLETED (${count})`
                    : `IN DEV (${count})`;

                const isCurrent = activeFilter === filter;

                return (
                  <button
                    key={filter}
                    onClick={() => handleFilterChange(filter)}
                    className="relative px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition-colors z-10 flex items-center gap-1.5"
                  >
                    {isCurrent && (
                      <motion.div
                        layoutId="activeProjectFilter"
                        className="absolute inset-0 bg-[#D97706] dark:bg-[#FFB800] rounded-xl shadow-md z-[-1]"
                        transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                      />
                    )}
                    <span
                      className={
                        isCurrent ? 'text-white dark:text-[#101014]' : 'text-slate-600 dark:text-[#8E8E93]'
                      }
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Stepper Navigation */}
            {totalFiltered > 1 && (
              <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-[#18181C] rounded-xl border border-gray-200 dark:border-[#252529]">
                <button
                  onClick={handlePrev}
                  disabled={safeIndex === 0}
                  aria-label="Previous Project"
                  className="p-1.5 rounded-lg text-slate-600 dark:text-[#8E8E93] hover:text-[#D97706] dark:hover:text-[#FFB800] hover:bg-slate-200 dark:hover:bg-[#252529] disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>

                <span className="font-mono text-xs text-slate-700 dark:text-[#D9D9D9] px-2 font-bold">
                  0{safeIndex + 1} / 0{totalFiltered}
                </span>

                <button
                  onClick={handleNext}
                  disabled={safeIndex === totalFiltered - 1}
                  aria-label="Next Project"
                  className="p-1.5 rounded-lg text-slate-600 dark:text-[#8E8E93] hover:text-[#D97706] dark:hover:text-[#FFB800] hover:bg-slate-200 dark:hover:bg-[#252529] disabled:opacity-30 disabled:pointer-events-none transition-all"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Main 3D Device Theater Showcase */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-center">
          
          {/* LEFT COLUMN: Project Identity & Specs Matrix (5 Cols) */}
          <div className="lg:col-span-5 space-y-5 flex flex-col justify-between">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={activeProject.id || safeIndex}
                custom={direction}
                initial={{ opacity: 0, x: direction * 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: direction * -15 }}
                transition={{ duration: 0.25, ease: 'easeOut' }}
                className="space-y-4"
              >
                {/* Status & Index Pill */}
                <div className="flex items-center gap-2.5">
                  <span className="font-mono text-xs font-bold text-[#D97706] dark:text-[#FFB800] bg-[#D97706]/10 dark:bg-[#FFB800]/10 px-3 py-1 rounded-lg border border-[#D97706]/20">
                    PROJECT 0{safeIndex + 1}
                  </span>

                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    {activeProject.category === 'completed' ? 'PRODUCTION DEPLOYED' : 'ACTIVE DEVELOPMENT'}
                  </span>
                </div>

                {/* Title */}
                <h3 className="text-2xl md:text-3xl lg:text-4xl font-black font-heading text-slate-900 dark:text-white tracking-tight leading-tight">
                  {activeProject.title}
                </h3>

                {/* Description */}
                <p className="text-slate-600 dark:text-[#8E8E93] text-sm md:text-base leading-relaxed line-clamp-3">
                  {activeProject.description}
                </p>

                {/* Tech Stack Badges */}
                <div className="space-y-2 pt-1">
                  <span className="font-mono text-[11px] font-bold uppercase text-slate-400 dark:text-[#6E6E73] tracking-wider block">
                    TECH STACK & ARCHITECTURE
                  </span>
                  <div className="flex flex-wrap items-center gap-1.5">
                    {activeProject.tech_stack.map((tech, idx) => (
                      <span
                        key={idx}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl text-xs font-mono bg-slate-100 dark:bg-[#18181C] text-slate-700 dark:text-[#D9D9D9] border border-gray-200 dark:border-[#252529] hover:border-[#D97706]/40 transition-colors"
                      >
                        <Sparkles className="w-3 h-3 text-[#D97706] dark:text-[#FFB800]" />
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 pt-3">
                  {/* Primary CTA: Dedicated Case Study Page */}
                  <Link
                    href={`/projects/${activeProject.slug}`}
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D97706] hover:bg-[#b45309] text-white dark:bg-[#FFB800] dark:hover:bg-[#e0a200] dark:text-[#101014] font-mono text-xs font-bold tracking-wider shadow-lg shadow-amber-500/20 transition-all hover:scale-102 group"
                  >
                    <span>DEEP CASE STUDY</span>
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>

                  {/* Secondary CTA: Live Demo (Only shown if available) */}
                  {hasLiveUrl && (
                    <a
                      href={activeProject.live_url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-2xl bg-slate-100 dark:bg-[#18181C] hover:bg-slate-200 dark:hover:bg-[#202026] text-slate-800 dark:text-slate-200 border border-gray-200 dark:border-[#252529] font-mono text-xs font-bold transition-all"
                    >
                      <span>LIVE DEMO</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </a>
                  )}

                  {/* GitHub Repo (Only shown if available) */}
                  {hasGithubUrl && (
                    <a
                      href={activeProject.github_url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-2xl bg-slate-100 dark:bg-[#18181C] hover:bg-slate-200 dark:hover:bg-[#202026] text-slate-800 dark:text-slate-200 border border-gray-200 dark:border-[#252529] transition-all"
                      title="GitHub Repository"
                    >
                      <Github className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>

            {/* Thumbnail Switcher Scrollable Rail (Handles 4, 8, 20+ projects effortlessly) */}
            <div className="pt-5 border-t border-gray-200/80 dark:border-[#252529]/80">
              <div
                ref={thumbRailRef}
                className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide py-1 px-0.5"
                style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
              >
                {filteredProjects.map((p, idx) => {
                  const isCur = idx === safeIndex;
                  const thumb =
                    p.project_images?.find((img) => img.is_thumbnail)?.image_url ||
                    p.project_images?.[0]?.image_url ||
                    '';

                  return (
                    <button
                      key={p.id || idx}
                      data-thumb-btn
                      onClick={() => handleSelectProject(idx)}
                      className={`relative w-24 md:w-28 shrink-0 aspect-video rounded-xl overflow-hidden border-2 transition-all duration-300 ${
                        isCur
                          ? 'border-[#D97706] dark:border-[#FFB800] shadow-md shadow-amber-500/30 scale-105 z-10'
                          : 'border-transparent opacity-50 hover:opacity-100 hover:border-gray-300 dark:hover:border-[#383840]'
                      }`}
                      title={p.title}
                    >
                      <img
                        src={thumb}
                        alt={p.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: 3D Parallax Device Theater Stage (7 Cols) */}
          <div className="lg:col-span-7 flex justify-center items-center">
            <div
              ref={deviceStageRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                setMousePos({ x: 0.5, y: 0.5 });
              }}
              style={{
                perspective: 1000,
              }}
              className="relative w-full max-w-[580px]"
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={activeProject.id || safeIndex}
                  custom={direction}
                  initial={{ opacity: 0, scale: 0.96, y: direction * 12 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.96, y: direction * -12 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{
                    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                  }}
                  className="relative rounded-3xl p-3 bg-slate-900 dark:bg-[#141418] border border-gray-700/50 dark:border-[#282830] shadow-2xl shadow-slate-900/30 dark:shadow-black/80 transition-shadow duration-300 group cursor-pointer"
                >
                  <Link href={`/projects/${activeProject.slug}`} className="block">
                    {/* Top Browser Traffic Lights & URL Bar */}
                    <div className="flex items-center gap-2 px-3 pb-2.5 border-b border-gray-800 dark:border-[#222228] text-xs font-mono text-slate-400">
                      <div className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444]/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B]/80" />
                        <span className="w-2.5 h-2.5 rounded-full bg-[#10B981]/80" />
                      </div>

                      <div className="flex-1 mx-3 bg-black/40 py-1 px-3 rounded-lg text-center text-slate-400 text-[11px] truncate border border-white/5">
                        https://portfolio.steven/{activeProject.slug}
                      </div>

                      <span className="text-[10px] font-mono text-emerald-400 flex items-center gap-1">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                        SSL
                      </span>
                    </div>

                    {/* Screenshot Container with Hover Zoom */}
                    <div className="relative aspect-[16/9.5] w-full rounded-2xl overflow-hidden bg-black/40 mt-2.5">
                      <img
                        src={primaryImage}
                        alt={activeProject.title}
                        className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-103"
                        loading="lazy"
                      />

                      {/* Interactive Hover Inspect Pill Overlay */}
                      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <span className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D97706] dark:bg-[#FFB800] text-white dark:text-[#101014] font-mono text-xs font-bold shadow-xl shadow-amber-500/30 transform translate-y-2 group-hover:translate-y-0 transition-transform">
                          <span>INSPECT CASE STUDY</span>
                          <ArrowRight className="w-4 h-4" />
                        </span>
                      </div>
                    </div>
                  </Link>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
