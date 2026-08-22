'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import {
  ArrowLeft,
  ExternalLink,
  Github,
  Calendar,
  Layers,
  CheckCircle2,
  Cpu,
  Globe,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Terminal,
  Code2,
  Sun,
  Moon,
  Play,
} from 'lucide-react';
import { INITIAL_PROJECTS, getLocalData } from '@/lib/mockData';
import { Project } from '@/lib/supabase/types';

interface ProjectDetailClientProps {
  slug: string;
}

export const ProjectDetailClient: React.FC<ProjectDetailClientProps> = ({ slug }) => {
  const [isDark, setIsDark] = useState(true);
  const [isPlayingVideo, setIsPlayingVideo] = useState(false);
  const [projectsList, setProjectsList] = useState<Project[]>(INITIAL_PROJECTS);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('portfolio_theme');
      if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        setIsDark(false);
      } else {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      }

      const localProj = getLocalData<Project[]>('steven_projects', INITIAL_PROJECTS);
      if (localProj && localProj.length > 0) {
        setProjectsList(localProj);
      }
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('portfolio_theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('portfolio_theme', 'dark');
      setIsDark(true);
    }
  };

  const projectIndex = projectsList.findIndex((p) => p.slug === slug);
  if (projectIndex === -1 && slug) {
    const fallbackIdx = INITIAL_PROJECTS.findIndex((p) => p.slug === slug);
    if (fallbackIdx === -1) {
      notFound();
    }
  }

  const project = projectsList[projectIndex] || INITIAL_PROJECTS[0];
  const nextProject = projectsList[(projectIndex + 1) % projectsList.length] || projectsList[0];
  const prevProject =
    projectsList[(projectIndex - 1 + projectsList.length) % projectsList.length] || projectsList[0];

  const primaryImage =
    project.project_images?.find((img) => img.is_thumbnail)?.image_url ||
    project.project_images?.[0]?.image_url ||
    'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80';

  const galleryImages = project.project_images?.filter((img) => !img.is_thumbnail) || [];

  const hasLiveUrl = Boolean(project.live_url && project.live_url.trim() !== '');
  const hasGithubUrl = Boolean(project.github_url && project.github_url.trim() !== '');

  return (
    <div className="min-h-screen bg-[#F8F9FC] dark:bg-[#0E0E12] text-slate-900 dark:text-[#E0E0E0] transition-colors duration-300 antialiased selection:bg-[#D97706]/30 selection:text-amber-500">
      
      {/* Top Sticky Navigation Bar */}
      <header className="sticky top-0 z-50 w-full border-b border-gray-200 dark:border-[#252529] bg-white/85 dark:bg-[#101014]/85 backdrop-blur-md transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 md:px-8 h-16 flex items-center justify-between">
          <Link
            href="/#projects"
            className="inline-flex items-center gap-2 font-mono text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-[#D97706] dark:hover:text-[#FFB800] transition-colors py-2 px-3 rounded-xl hover:bg-slate-100 dark:hover:bg-[#1C1C22] border border-transparent hover:border-gray-200 dark:hover:border-[#252529]"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>BACK TO PORTFOLIO</span>
          </Link>

          <div className="flex items-center gap-3">
            {/* Theme Toggle Button */}
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-xl bg-slate-100 dark:bg-[#18181C] hover:bg-slate-200 dark:hover:bg-[#222228] border border-gray-200 dark:border-[#252529] text-slate-700 dark:text-slate-300 hover:text-amber-500 transition-colors"
            >
              {isDark ? <Sun className="w-4 h-4 text-[#FFB800]" /> : <Moon className="w-4 h-4 text-slate-700" />}
            </button>

            {hasGithubUrl && (
              <a
                href={project.github_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-slate-100 dark:bg-[#18181C] hover:bg-slate-200 dark:hover:bg-[#222228] border border-gray-200 dark:border-[#252529] text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white transition-colors"
                title="View Source Code"
              >
                <Github className="w-4 h-4" />
              </a>
            )}

            {hasLiveUrl && (
              <a
                href={project.live_url!}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#D97706] hover:bg-[#b45309] dark:bg-[#FFB800] dark:hover:bg-[#e0a200] text-white dark:text-[#101014] font-mono text-xs font-bold shadow-md shadow-amber-500/20 transition-all hover:scale-102"
              >
                <span>LIVE DEMO</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            )}
          </div>
        </div>
      </header>

      {/* Main Case Study Content Container */}
      <main className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-20 space-y-16">
        
        {/* Project Hero Header */}
        <section className="space-y-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-xs font-mono font-bold text-[#D97706] dark:text-[#FFB800]">
              <Layers className="w-3.5 h-3.5" />
              {project.category === 'completed' ? 'PRODUCTION DEPLOYMENT' : 'ACTIVE DEVELOPMENT'}
            </span>

            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-100 dark:bg-[#18181C] border border-gray-200 dark:border-[#252529] text-xs font-mono text-slate-600 dark:text-slate-400">
              <Calendar className="w-3.5 h-3.5" />
              <span>PROJECT 0{project.order_index} OF 0{projectsList.length}</span>
            </span>
          </div>

          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black font-heading tracking-tight text-slate-900 dark:text-white leading-tight">
            {project.title}
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed max-w-4xl">
            {project.description}
          </p>

          {/* Quick Stats / Tech Stack Bar */}
          <div className="pt-4 flex flex-wrap items-center gap-2">
            {project.tech_stack.map((tech, idx) => (
              <span
                key={idx}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-100 dark:bg-[#18181C] border border-gray-200 dark:border-[#28282E] text-xs font-mono font-medium text-slate-700 dark:text-slate-200"
              >
                <Sparkles className="w-3 h-3 text-[#D97706] dark:text-[#FFB800]" />
                {tech}
              </span>
            ))}
          </div>
        </section>

        {/* Hero Visual Mockup / Lazy Video Player Frame */}
        <section className="rounded-3xl border border-gray-200 dark:border-[#252529] bg-white dark:bg-[#141418] p-3 md:p-5 shadow-xl dark:shadow-2xl overflow-hidden relative group">
          {/* Top Browser Bar Mockup */}
          <div className="flex items-center gap-2 px-3 pb-3 border-b border-gray-100 dark:border-[#252529] mb-3 text-xs font-mono text-slate-400">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#EF4444]/80" />
              <span className="w-3 h-3 rounded-full bg-[#F59E0B]/80" />
              <span className="w-3 h-3 rounded-full bg-[#10B981]/80" />
            </div>
            <div className="flex-1 mx-4 bg-slate-100 dark:bg-[#1A1A20] py-1 px-3 rounded-md text-center text-slate-600 dark:text-slate-400 truncate text-[11px]">
              https://portfolio.steven/{project.slug}
            </div>
          </div>

          {/* High-Performance Lazy Video Facade (Zero Scroll Lag) */}
          {project.demo_video_url && isPlayingVideo ? (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-black shadow-inner">
              <iframe
                src={`${project.demo_video_url}?autoplay=1`}
                title={project.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full border-0"
              />
            </div>
          ) : (
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden bg-slate-100 dark:bg-[#18181C] group">
              <img
                src={primaryImage}
                alt={project.title}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-102"
                loading="eager"
              />

              {/* If video URL exists, show Interactive Play Overlay */}
              {project.demo_video_url && (
                <div
                  onClick={() => setIsPlayingVideo(true)}
                  className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 cursor-pointer group-hover:bg-black/30 transition-all"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 rounded-full bg-[#D97706] dark:bg-[#FFB800] text-white dark:text-[#101014] flex items-center justify-center shadow-2xl shadow-amber-500/50 transform group-hover:scale-110 transition-transform">
                    <Play className="w-8 h-8 ml-1 fill-current" />
                  </div>
                  <span className="font-mono text-xs font-bold text-white tracking-wider bg-black/60 px-3.5 py-1.5 rounded-xl border border-white/10">
                    WATCH INTERACTIVE DEMO VIDEO
                  </span>
                </div>
              )}
            </div>
          )}
        </section>

        {/* Deep Dive Case Study Architecture & Engineering */}
        <section className="grid grid-cols-1 md:grid-cols-12 gap-10">
          {/* Left Column: Problem & Engineering Solution */}
          <div className="md:col-span-8 space-y-10">
            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2.5">
                <Terminal className="w-6 h-6 text-[#D97706] dark:text-[#FFB800]" />
                <span>Overview & System Problem</span>
              </h2>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-base">
                In modern multi-tenant application development, latency bottlenecks, unoptimized payload transfers, and fragile state synchronization frequently disrupt user experience. {project.title} was architected from the ground up to address these challenges by pairing high-performance front-end pipelines with resilient backend services.
              </p>
            </div>

            <div className="space-y-4">
              <h2 className="text-2xl md:text-3xl font-bold font-heading text-slate-900 dark:text-white flex items-center gap-2.5">
                <Code2 className="w-6 h-6 text-[#D97706] dark:text-[#FFB800]" />
                <span>Key Engineering Highlights</span>
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-5 rounded-2xl bg-white dark:bg-[#141418] border border-gray-200 dark:border-[#252529] shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-[#D97706] dark:text-[#FFB800] font-mono text-xs font-bold uppercase">
                    <ShieldCheck className="w-4 h-4" />
                    <span>Security & Authorization</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Implemented granular Row-Level Security (RLS) policies and cryptographically verified JWT tokens across all endpoint calls.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#141418] border border-gray-200 dark:border-[#252529] shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-[#D97706] dark:text-[#FFB800] font-mono text-xs font-bold uppercase">
                    <Cpu className="w-4 h-4" />
                    <span>Optimized Rendering</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Utilized server-side streaming components, edge caching, and selective client hydration to ensure sub-100ms LCP times.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#141418] border border-gray-200 dark:border-[#252529] shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-[#D97706] dark:text-[#FFB800] font-mono text-xs font-bold uppercase">
                    <Globe className="w-4 h-4" />
                    <span>Real-time Data Sync</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Integrated WebSocket channels and optimistic UI updates for instantaneous collaborative user feedback.
                  </p>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-[#141418] border border-gray-200 dark:border-[#252529] shadow-sm space-y-2">
                  <div className="flex items-center gap-2 text-[#D97706] dark:text-[#FFB800] font-mono text-xs font-bold uppercase">
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Fault-Tolerant Architecture</span>
                  </div>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    Authored resilient fallback handlers and retry strategies to maintain continuous uptime during external API dropouts.
                  </p>
                </div>
              </div>
            </div>

            {/* Additional Gallery Screenshots if available */}
            {galleryImages.length > 0 && (
              <div className="space-y-4 pt-4">
                <h2 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">Application Interface Gallery</h2>
                <div className="grid grid-cols-1 gap-6">
                  {galleryImages.map((img, idx) => (
                    <div key={idx} className="rounded-2xl border border-gray-200 dark:border-[#252529] bg-white dark:bg-[#141418] p-3 space-y-2 shadow-sm">
                      <img
                        src={img.image_url}
                        alt={img.caption || `Screenshot ${idx + 1}`}
                        className="w-full rounded-xl object-cover"
                        loading="lazy"
                      />
                      {img.caption && (
                        <p className="text-xs font-mono text-slate-500 dark:text-slate-400 px-2">{img.caption}</p>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Project Metadata Card */}
          <div className="md:col-span-4 space-y-6">
            <div className="rounded-3xl bg-white dark:bg-[#141418] border border-gray-200 dark:border-[#252529] p-6 space-y-6 sticky top-24 shadow-lg dark:shadow-xl">
              <h3 className="font-mono text-xs font-bold uppercase text-[#D97706] dark:text-[#FFB800] tracking-wider border-b border-gray-100 dark:border-[#252529] pb-3">
                PROJECT SPECIFICATION
              </h3>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <span className="text-slate-400 dark:text-slate-500 block mb-1">CATEGORY</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold capitalize">{project.category} Project</span>
                </div>

                <div>
                  <span className="text-slate-400 dark:text-slate-500 block mb-1">PRIMARY ROLES</span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">System Architect & Full-Stack Developer</span>
                </div>

                <div>
                  <span className="text-slate-400 dark:text-slate-500 block mb-1">CORE TECH STACK</span>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {project.tech_stack.map((t, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-md bg-slate-100 dark:bg-[#1F1F26] text-slate-700 dark:text-slate-300 text-[11px] border border-gray-200 dark:border-[#2D2D38]">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>

                {hasLiveUrl && (
                  <div className="pt-2">
                    <a
                      href={project.live_url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-[#D97706] hover:bg-[#b45309] dark:bg-[#FFB800] dark:hover:bg-[#e0a200] text-white dark:text-[#101014] font-bold flex items-center justify-center gap-2 transition-all shadow-md"
                    >
                      <span>LAUNCH APPLICATION</span>
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                )}

                {hasGithubUrl && (
                  <div>
                    <a
                      href={project.github_url!}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full py-3 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-[#1E1E24] dark:hover:bg-[#282832] text-slate-800 dark:text-slate-200 font-bold flex items-center justify-center gap-2 border border-gray-200 dark:border-[#2F2F3D] transition-all"
                    >
                      <Github className="w-4 h-4" />
                      <span>EXPLORE REPOSITORY</span>
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Bottom Pagination & Next Project Link */}
        <section className="border-t border-gray-200 dark:border-[#252529] pt-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <Link
            href={`/projects/${prevProject.slug}`}
            className="flex items-center gap-3 p-4 rounded-2xl bg-white dark:bg-[#141418] hover:bg-slate-50 dark:hover:bg-[#1A1A22] border border-gray-200 dark:border-[#252529] transition-all w-full sm:w-auto shadow-xs"
          >
            <ArrowLeft className="w-5 h-5 text-[#D97706] dark:text-[#FFB800]" />
            <div className="text-left">
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block uppercase">PREVIOUS PROJECT</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{prevProject.title}</span>
            </div>
          </Link>

          <Link
            href={`/projects/${nextProject.slug}`}
            className="flex items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-[#141418] hover:bg-slate-50 dark:hover:bg-[#1A1A22] border border-gray-200 dark:border-[#252529] transition-all w-full sm:w-auto text-right shadow-xs"
          >
            <div className="text-right">
              <span className="text-[10px] font-mono text-slate-400 dark:text-slate-500 block uppercase">NEXT PROJECT</span>
              <span className="text-sm font-bold text-slate-800 dark:text-slate-200 line-clamp-1">{nextProject.title}</span>
            </div>
            <ArrowRight className="w-5 h-5 text-[#D97706] dark:text-[#FFB800]" />
          </Link>
        </section>

      </main>
    </div>
  );
};
