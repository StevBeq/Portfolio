'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Briefcase,
  Users,
  Calendar,
  Building2,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  Clock,
  Award,
} from 'lucide-react';
import { Experience, ExpType } from '@/lib/supabase/types';
import { INITIAL_EXPERIENCES } from '@/lib/mockData';
import { formatDateRange } from '@/lib/utils';

interface ExperienceSectionProps {
  experiences: Experience[];
}

const getExperienceTags = (exp: Experience): string[] => {
  const text = (exp.role + ' ' + exp.organization_name + ' ' + exp.description).toLowerCase();
  const tags: string[] = [];

  if (text.includes('next.js') || text.includes('nextjs')) tags.push('Next.js 15');
  if (text.includes('react')) tags.push('React 19');
  if (text.includes('typescript')) tags.push('TypeScript');
  if (text.includes('flutter')) tags.push('Flutter');
  if (text.includes('dart')) tags.push('Dart');
  if (text.includes('supabase')) tags.push('Supabase RLS');
  if (text.includes('microservices') || text.includes('architecture') || text.includes('architecting'))
    tags.push('System Architecture');
  if (text.includes('rest') || text.includes('api')) tags.push('RESTful APIs');
  if (text.includes('docker') || text.includes('kubernetes')) tags.push('DevOps & Docker');
  if (text.includes('graphql')) tags.push('GraphQL');
  if (text.includes('hackathon') || text.includes('workshop') || text.includes('organized'))
    tags.push('Event Management');
  if (text.includes('mentor') || text.includes('leadership') || text.includes('head'))
    tags.push('Tech Leadership');

  if (tags.length === 0) {
    if (exp.type === 'work') {
      tags.push('Software Engineering', 'Full-Stack Architecture', 'Performance Optimization');
    } else {
      tags.push('Leadership', 'Community Building', 'Technical Mentorship');
    }
  }

  return Array.from(new Set(tags));
};

const parseDescriptionBullets = (desc: string): string[] => {
  if (!desc) return [];
  const lines = desc.split('\n').map((l) => l.trim()).filter((l) => l.length > 0);
  if (lines.length > 1) return lines;
  const sentences = desc
    .split('. ')
    .map((s) => s.trim())
    .filter((s) => s.length > 3)
    .map((s) => (s.endsWith('.') ? s : s + '.'));
  return sentences.length > 1 ? sentences : [desc];
};

export const ExperienceSection: React.FC<ExperienceSectionProps> = ({ experiences }) => {
  const [activeTab, setActiveTab] = useState<ExpType>('work');
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [direction, setDirection] = useState<number>(1);

  // 3D Parallax Tilt state for stage card
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [isHovered, setIsHovered] = useState(false);
  const stageCardRef = useRef<HTMLDivElement>(null);
  const railContainerRef = useRef<HTMLDivElement>(null);

  const displayList = experiences && experiences.length > 0 ? experiences : INITIAL_EXPERIENCES;
  const workCount = displayList.filter((e) => e.type === 'work').length;
  const orgCount = displayList.filter((e) => e.type === 'organization').length;

  const filteredList = displayList
    .filter((exp) => exp.type === activeTab)
    .sort((a, b) => a.order_index - b.order_index);

  // Safe active item fallback
  const activeExp = filteredList[selectedIndex] || filteredList[0] || INITIAL_EXPERIENCES[0];

  const handleTabChange = (type: ExpType) => {
    setActiveTab(type);
    setSelectedIndex(0);
    setDirection(1);
  };

  const handleSelectMilestone = (index: number) => {
    setDirection(index > selectedIndex ? 1 : -1);
    setSelectedIndex(index);
  };

  const handleNext = () => {
    if (selectedIndex < filteredList.length - 1) {
      setDirection(1);
      setSelectedIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (selectedIndex > 0) {
      setDirection(-1);
      setSelectedIndex((prev) => prev - 1);
    }
  };

  // Keyboard navigation support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const section = document.getElementById('experience');
      if (!section) return;
      const rect = section.getBoundingClientRect();
      const inView = rect.top < window.innerHeight * 0.75 && rect.bottom > window.innerHeight * 0.25;
      if (!inView) return;

      if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
        if (selectedIndex < filteredList.length - 1) {
          e.preventDefault();
          handleNext();
        }
      } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
        if (selectedIndex > 0) {
          e.preventDefault();
          handlePrev();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredList.length]);

  // Handle Mouse 3D Tilt on Stage Card
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!stageCardRef.current) return;
    const rect = stageCardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;
    setMousePos({ x, y });
  };

  // Calculate tilt rotations
  const rotateX = isHovered ? (mousePos.y - 0.5) * -8 : 0;
  const rotateY = isHovered ? (mousePos.x - 0.5) * 8 : 0;

  const bullets = parseDescriptionBullets(activeExp.description);
  const tags = getExperienceTags(activeExp);

  return (
    <section
      id="experience"
      className="section-viewport section-divider w-full min-h-screen relative flex flex-col justify-center pt-24 pb-20 px-4 md:px-12 bg-[#F8F9FC] dark:bg-[#101014] overflow-hidden transition-colors duration-300 z-10"
    >
      {/* Background Cyber Amber Atmospheric Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] h-[550px] bg-gradient-to-tr from-[#D97706]/10 via-[#FFB800]/5 to-transparent dark:from-[#FFB800]/10 dark:via-[#D97706]/5 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      {/* Main Container */}
      <div className="w-full max-w-7xl mx-auto flex flex-col justify-center">
        
        {/* Section Header & Interactive Controls */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 dark:bg-[#18181C] border border-amber-500/30 dark:border-[#FFB800]/30 font-mono text-xs text-[#D97706] dark:text-[#FFB800] tracking-wider">
              <Briefcase className="w-3.5 h-3.5" />
              <span>CAREER & LEADERSHIP COMMAND HUB</span>
            </div>

            <h2 className="text-3xl md:text-5xl font-bold font-heading text-slate-900 dark:text-[#D9D9D9] tracking-tight">
              Professional <span className="text-[#D97706] dark:text-[#FFB800]">Experience</span>
            </h2>

            <p className="text-slate-600 dark:text-[#8E8E93] text-sm md:text-base max-w-xl">
              Select milestones along the interactive timeline rail to inspect architectural contributions, leadership impact, and technical accomplishments.
            </p>
          </div>

          {/* Interactive Mode Tabs & Stepper Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Dual Tabs (Work / Organization) */}
            <div className="inline-flex items-center p-1.5 bg-slate-100 dark:bg-[#18181C] rounded-2xl border border-gray-200 dark:border-[#252529] shadow-sm">
              <button
                onClick={() => handleTabChange('work')}
                className="relative px-4 py-2 rounded-xl font-mono text-xs font-bold transition-colors z-10 flex items-center gap-2"
              >
                {activeTab === 'work' && (
                  <motion.div
                    layoutId="activeExperienceTab"
                    className="absolute inset-0 bg-[#D97706] dark:bg-[#FFB800] rounded-xl shadow-md z-[-1]"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <Briefcase
                  className={`w-3.5 h-3.5 ${
                    activeTab === 'work' ? 'text-white dark:text-[#101014]' : 'text-slate-600 dark:text-[#8E8E93]'
                  }`}
                />
                <span
                  className={
                    activeTab === 'work' ? 'text-white dark:text-[#101014]' : 'text-slate-600 dark:text-[#8E8E93]'
                  }
                >
                  WORK ({workCount})
                </span>
              </button>

              <button
                onClick={() => handleTabChange('organization')}
                className="relative px-4 py-2 rounded-xl font-mono text-xs font-bold transition-colors z-10 flex items-center gap-2"
              >
                {activeTab === 'organization' && (
                  <motion.div
                    layoutId="activeExperienceTab"
                    className="absolute inset-0 bg-[#D97706] dark:bg-[#FFB800] rounded-xl shadow-md z-[-1]"
                    transition={{ type: 'spring', stiffness: 450, damping: 32 }}
                  />
                )}
                <Users
                  className={`w-3.5 h-3.5 ${
                    activeTab === 'organization'
                      ? 'text-white dark:text-[#101014]'
                      : 'text-slate-600 dark:text-[#8E8E93]'
                  }`}
                />
                <span
                  className={
                    activeTab === 'organization'
                      ? 'text-white dark:text-[#101014]'
                      : 'text-slate-600 dark:text-[#8E8E93]'
                  }
                >
                  ORGANIZATION ({orgCount})
                </span>
              </button>
            </div>

            {/* Stepper Navigation Buttons */}
            <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-[#18181C] rounded-xl border border-gray-200 dark:border-[#252529]">
              <button
                onClick={handlePrev}
                disabled={selectedIndex === 0}
                aria-label="Previous Milestone"
                className="p-1.5 rounded-lg text-slate-600 dark:text-[#8E8E93] hover:text-[#D97706] dark:hover:text-[#FFB800] hover:bg-slate-200 dark:hover:bg-[#252529] disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>

              <span className="font-mono text-xs text-slate-700 dark:text-[#D9D9D9] px-2 font-bold">
                0{selectedIndex + 1} / 0{filteredList.length}
              </span>

              <button
                onClick={handleNext}
                disabled={selectedIndex === filteredList.length - 1}
                aria-label="Next Milestone"
                className="p-1.5 rounded-lg text-slate-600 dark:text-[#8E8E93] hover:text-[#D97706] dark:hover:text-[#FFB800] hover:bg-slate-200 dark:hover:bg-[#252529] disabled:opacity-30 disabled:pointer-events-none transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Horizontal Milestone Pills (Visible on small screens) */}
        <div className="flex lg:hidden overflow-x-auto scrollbar-hide gap-2.5 pb-4 mb-6 -mx-2 px-2">
          {filteredList.map((item, idx) => {
            const isSelected = idx === selectedIndex;
            return (
              <button
                key={item.id || idx}
                onClick={() => handleSelectMilestone(idx)}
                className={`shrink-0 px-4 py-2.5 rounded-2xl font-mono text-xs font-bold transition-all flex items-center gap-2 border ${
                  isSelected
                    ? 'bg-[#D97706] dark:bg-[#FFB800] text-white dark:text-[#101014] border-[#D97706] dark:border-[#FFB800] shadow-md shadow-amber-500/20'
                    : 'bg-white/80 dark:bg-[#18181C]/80 text-slate-700 dark:text-[#8E8E93] border-gray-200 dark:border-[#252529] hover:border-[#D97706]/40'
                }`}
              >
                <span
                  className={`w-2 h-2 rounded-full ${
                    isSelected
                      ? 'bg-white dark:bg-[#101014]'
                      : item.is_current
                      ? 'bg-emerald-500 animate-pulse'
                      : 'bg-slate-300 dark:bg-[#383840]'
                  }`}
                />
                <span className="truncate max-w-[150px]">{item.organization_name}</span>
              </button>
            );
          })}
        </div>

        {/* Split-Screen Interactive Command Stage Grid (Desktop / Tablet) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          
          {/* LEFT COLUMN: Interactive Milestone Rail Navigator (4 Cols on LG) */}
          <div className="hidden lg:flex lg:col-span-5 flex-col justify-between">
            <div
              ref={railContainerRef}
              className="relative rounded-3xl p-4 bg-slate-100/70 dark:bg-[#141418]/80 border border-gray-200 dark:border-[#252529] backdrop-blur-xl flex flex-col gap-3 shadow-lg"
            >
              {/* Dynamic Laser Beam Connecting Rail */}
              <div className="absolute left-9 top-8 bottom-8 w-[2px] bg-slate-200 dark:bg-[#252529] rounded-full" />
              <div
                className="absolute left-9 top-8 w-[2px] bg-gradient-to-b from-[#D97706] to-[#FFB800] shadow-[0_0_12px_rgba(217,119,6,0.8)] transition-all duration-300 rounded-full"
                style={{
                  height:
                    filteredList.length <= 1
                      ? '100%'
                      : `calc((${selectedIndex} / ${filteredList.length - 1}) * (100% - 4rem))`,
                }}
              />

              {/* Milestone Step Buttons */}
              {filteredList.map((item, idx) => {
                const isSelected = idx === selectedIndex;

                return (
                  <button
                    key={item.id || idx}
                    onClick={() => handleSelectMilestone(idx)}
                    className={`group relative text-left p-4 pl-12 rounded-2xl transition-all duration-300 flex items-center justify-between border ${
                      isSelected
                        ? 'bg-white dark:bg-[#1C1C22] border-[#D97706]/60 dark:border-[#FFB800]/60 shadow-[0_8px_25px_rgba(217,119,6,0.15)] dark:shadow-[0_8px_25px_rgba(255,184,0,0.12)] translate-x-1.5'
                        : 'bg-transparent border-transparent hover:bg-white/50 dark:hover:bg-[#18181C]/50 hover:border-gray-200 dark:hover:border-[#28282E]'
                    }`}
                  >
                    {/* Milestone Left Indicator Node */}
                    <div
                      className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 rounded-full border-2 transition-all duration-300 flex items-center justify-center ${
                        isSelected
                          ? 'bg-[#D97706] dark:bg-[#FFB800] border-[#D97706] dark:border-[#FFB800] scale-125 shadow-md shadow-amber-500/30'
                          : 'bg-slate-100 dark:bg-[#141418] border-gray-300 dark:border-[#383840] group-hover:border-[#D97706]'
                      }`}
                    >
                      {item.is_current ? (
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      ) : (
                        <span
                          className={`w-1 h-1 rounded-full ${
                            isSelected ? 'bg-white dark:bg-[#101014]' : 'bg-gray-300 dark:bg-[#383840]'
                          }`}
                        />
                      )}
                    </div>

                    {/* Milestone Info */}
                    <div className="space-y-1 pr-2">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs font-bold uppercase tracking-wider transition-colors ${
                            isSelected
                              ? 'text-[#D97706] dark:text-[#FFB800]'
                              : 'text-slate-500 dark:text-[#8E8E93] group-hover:text-slate-800 dark:group-hover:text-[#D9D9D9]'
                          }`}
                        >
                          {item.organization_name}
                        </span>

                        {item.is_current && (
                          <span className="px-1.5 py-0.5 rounded text-[9px] font-mono font-bold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30">
                            NOW
                          </span>
                        )}
                      </div>

                      <h4
                        className={`text-sm font-bold font-heading line-clamp-1 transition-colors ${
                          isSelected
                            ? 'text-slate-900 dark:text-white'
                            : 'text-slate-600 dark:text-[#8E8E93] group-hover:text-slate-900 dark:group-hover:text-[#D9D9D9]'
                        }`}
                      >
                        {item.role}
                      </h4>

                      <div className="flex items-center gap-1 font-mono text-[11px] text-slate-400 dark:text-[#6E6E73]">
                        <Clock className="w-3 h-3" />
                        <span>{formatDateRange(item.start_date, item.end_date, item.is_current)}</span>
                      </div>
                    </div>

                    {/* Active Stage Pointer Indicator */}
                    <div
                      className={`p-2 rounded-xl transition-all duration-300 ${
                        isSelected
                          ? 'bg-[#D97706]/10 dark:bg-[#FFB800]/10 text-[#D97706] dark:text-[#FFB800] translate-x-1'
                          : 'opacity-0 text-slate-400 group-hover:opacity-100'
                      }`}
                    >
                      <ChevronRight className="w-4 h-4" />
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Quick Keyboard Instruction Hint */}
            <div className="mt-4 px-4 py-2 rounded-2xl bg-slate-100/50 dark:bg-[#141418]/50 border border-gray-200/50 dark:border-[#252529]/50 flex items-center justify-between text-xs font-mono text-slate-500 dark:text-[#8E8E93]">
              <div className="flex items-center gap-2">
                <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#202026] border border-gray-200 dark:border-[#333] shadow-xs text-[10px]">
                  ↑
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#202026] border border-gray-200 dark:border-[#333] shadow-xs text-[10px]">
                  ↓
                </span>
                <span>or</span>
                <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#202026] border border-gray-200 dark:border-[#333] shadow-xs text-[10px]">
                  ←
                </span>
                <span className="px-1.5 py-0.5 rounded bg-white dark:bg-[#202026] border border-gray-200 dark:border-[#333] shadow-xs text-[10px]">
                  →
                </span>
              </div>
              <span className="text-[11px]">Navigate Milestones</span>
            </div>
          </div>

          {/* RIGHT COLUMN: Interactive 3D Stage Card (7 Cols on LG) */}
          <div className="col-span-1 lg:col-span-7 flex flex-col justify-center">
            <div
              ref={stageCardRef}
              onMouseMove={handleMouseMove}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => {
                setIsHovered(false);
                setMousePos({ x: 0.5, y: 0.5 });
              }}
              style={{
                perspective: 1000,
              }}
              className="relative w-full"
            >
              <AnimatePresence mode="wait" custom={direction}>
                <motion.div
                  key={`${activeTab}-${activeExp.id || selectedIndex}`}
                  custom={direction}
                  initial={{ opacity: 0, y: direction * 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: direction * -15, scale: 0.98 }}
                  transition={{ duration: 0.3, ease: 'easeOut' }}
                  style={{
                    transform: `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
                    transformStyle: 'preserve-3d',
                    willChange: 'transform',
                  }}
                  className="relative rounded-3xl p-6 md:p-9 bg-white dark:bg-[#18181C] border border-gray-200 dark:border-[#252529] shadow-2xl shadow-slate-200/50 dark:shadow-black/60 transition-shadow duration-300 flex flex-col justify-between min-h-[480px] overflow-hidden"
                >
                  {/* Subtle Interactive Radial Spotlight Glow */}
                  <div
                    className="absolute inset-0 pointer-events-none opacity-40 dark:opacity-30 transition-opacity duration-300"
                    style={{
                      background: `radial-gradient(600px circle at ${mousePos.x * 100}% ${
                        mousePos.y * 100
                      }%, rgba(217, 119, 6, 0.15), transparent 70%)`,
                    }}
                  />

                  {/* Top Stage Header */}
                  <div className="relative z-10 space-y-6">
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 dark:border-[#252529] pb-6">
                      <div className="space-y-2.5">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="inline-flex items-center gap-1.5 font-mono text-xs font-bold text-[#D97706] dark:text-[#FFB800] uppercase tracking-wider bg-[#D97706]/10 dark:bg-[#FFB800]/10 px-3 py-1.5 rounded-xl">
                            <Building2 className="w-3.5 h-3.5" />
                            {activeExp.organization_name}
                          </span>

                          {activeExp.is_current && (
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-xs font-mono font-bold">
                              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                              CURRENT ROLE
                            </span>
                          )}
                        </div>

                        <h3 className="text-2xl md:text-3xl lg:text-4xl font-extrabold font-heading text-slate-900 dark:text-[#D9D9D9] tracking-tight">
                          {activeExp.role}
                        </h3>
                      </div>

                      {/* Date Badge */}
                      <div className="inline-flex items-center gap-2 font-mono text-xs md:text-sm text-slate-700 dark:text-[#D9D9D9] bg-slate-100 dark:bg-[#202026] px-4 py-2 rounded-2xl border border-gray-200 dark:border-[#2A2A30] shrink-0 shadow-xs">
                        <Calendar className="w-4 h-4 text-[#D97706] dark:text-[#FFB800]" />
                        <span>{formatDateRange(activeExp.start_date, activeExp.end_date, activeExp.is_current)}</span>
                      </div>
                    </div>

                    {/* Key Contributions & Achievements Bullet Points */}
                    <div className="space-y-3.5 pt-2">
                      <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-slate-400 dark:text-[#8E8E93] flex items-center gap-2">
                        <Award className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FFB800]" />
                        Key Impact & Deliverables
                      </h4>

                      <ul className="space-y-3">
                        {bullets.map((bullet, bIdx) => (
                          <motion.li
                            key={bIdx}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.25, delay: bIdx * 0.06 }}
                            className="flex items-start gap-3.5 text-sm md:text-base text-slate-600 dark:text-[#8E8E93] leading-relaxed"
                          >
                            <span className="mt-2 w-2 h-2 rounded-full bg-[#D97706] dark:bg-[#FFB800] shadow-[0_0_8px_rgba(217,119,6,0.6)] shrink-0" />
                            <span>{bullet}</span>
                          </motion.li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Stage Bottom Footer: Skills & Next Action */}
                  <div className="relative z-10 mt-8 pt-6 border-t border-gray-100 dark:border-[#252529] flex flex-col md:flex-row md:items-center justify-between gap-5">
                    {/* Tags */}
                    <div className="flex flex-wrap items-center gap-2">
                      {tags.map((tag, tIdx) => (
                        <span
                          key={tIdx}
                          className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono font-medium bg-slate-100 dark:bg-[#202026] text-slate-700 dark:text-[#D9D9D9] border border-gray-200 dark:border-[#2A2A30] hover:border-[#D97706]/40 transition-colors"
                        >
                          <Sparkles className="w-3 h-3 text-[#D97706] dark:text-[#FFB800]" />
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* Next Chapter Advance Button */}
                    {selectedIndex < filteredList.length - 1 ? (
                      <button
                        onClick={handleNext}
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-slate-900 hover:bg-slate-800 text-white dark:bg-white dark:hover:bg-slate-100 dark:text-[#101014] font-mono text-xs font-bold tracking-wider shadow-md hover:shadow-lg transition-all shrink-0 group cursor-pointer"
                      >
                        <span>NEXT CHAPTER</span>
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                      </button>
                    ) : (
                      <a
                        href="#projects"
                        className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-2xl bg-[#D97706] hover:bg-[#b45309] text-white dark:bg-[#FFB800] dark:hover:bg-[#e0a200] dark:text-[#101014] font-mono text-xs font-bold tracking-wider shadow-md hover:shadow-lg transition-all shrink-0 group cursor-pointer"
                      >
                        <span>EXPLORE PROJECTS</span>
                        <ArrowUpRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                      </a>
                    )}
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
