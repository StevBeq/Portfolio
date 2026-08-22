'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X, Github, ExternalLink, Calendar, Tag, Layers,
  CheckCircle2, ChevronLeft, ChevronRight, Code2,
  Sparkles, Play, Image as ImageIcon, FileText, ArrowUpRight,
} from 'lucide-react';
import { Project, ProjectImage } from '@/lib/supabase/types';
import { parseYouTubeEmbedUrl, formatDate } from '@/lib/utils';

interface ExpandableCardModalProps {
  project: Project | null;
  onClose: () => void;
}

type ModalView = 'overview' | 'gallery' | 'demo';

const viewIcons = {
  overview: FileText,
  gallery: ImageIcon,
  demo: Play,
};

export const ExpandableCardModal: React.FC<ExpandableCardModalProps> = ({
  project,
  onClose,
}) => {
  const [activeView, setActiveView] = useState<ModalView>('overview');
  const [galleryIdx, setGalleryIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);

  // Reset state when project changes
  useEffect(() => {
    if (project) {
      const embedUrl = parseYouTubeEmbedUrl(project.demo_video_url);
      if (embedUrl) setActiveView('demo');
      else if (project.project_images?.length) setActiveView('gallery');
      else setActiveView('overview');
      setGalleryIdx(0);
    }
  }, [project]);

  // Lock scroll & ESC handler
  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (activeView === 'gallery' && project?.project_images?.length) {
        if (e.key === 'ArrowRight') setGalleryIdx(p => (p + 1) % (project.project_images?.length || 1));
        if (e.key === 'ArrowLeft') setGalleryIdx(p => (p - 1 + (project.project_images?.length || 1)) % (project.project_images?.length || 1));
      }
    };
    if (project) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKey);
    }
    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKey);
    };
  }, [project, onClose, activeView]);

  if (!project) return null;

  const embedUrl = parseYouTubeEmbedUrl(project.demo_video_url);
  const galleryImages: ProjectImage[] = project.project_images?.length
    ? project.project_images
    : [{
        id: 'placeholder', project_id: project.id,
        image_url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80',
        caption: 'Project Preview', is_thumbnail: true, order_index: 0,
      }];
  const descParagraphs = project.description.split('\n').filter(l => l.trim().length > 0);

  // Available views
  const views: ModalView[] = ['overview'];
  if (galleryImages.length > 0) views.push('gallery');
  if (embedUrl) views.push('demo');

  return (
    <AnimatePresence>
      {project && (
        <div className="fixed inset-0 z-50 flex items-end justify-center">
          {/* Backdrop */}
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Theater Panel - slides up from bottom */}
          <motion.div
            key={`theater-${project.id}`}
            initial={{ y: '100%', opacity: 0.5 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
            className="relative z-10 w-full max-w-5xl bg-white dark:bg-[#141418] rounded-t-3xl shadow-2xl dark:shadow-[0_-10px_60px_rgba(255,184,0,0.1)] overflow-hidden flex flex-col"
            style={{ maxHeight: '92vh' }}
          >
            {/* Drag Handle */}
            <div className="flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-10 h-1 rounded-full bg-gray-300 dark:bg-[#333]" />
            </div>

            {/* Top Bar: Title + Close */}
            <div className="flex items-center justify-between px-6 py-3 shrink-0">
              <div className="flex items-center gap-3 min-w-0">
                <span className="px-2.5 py-1 text-[10px] font-mono uppercase font-bold rounded-lg bg-[#D97706]/10 dark:bg-[#FFB800]/10 text-[#D97706] dark:text-[#FFB800] border border-[#D97706]/20 dark:border-[#FFB800]/20 shrink-0">
                  {project.category}
                </span>
                <h2 className="text-lg font-bold text-gray-900 dark:text-white font-heading tracking-tight truncate">
                  {project.title}
                </h2>
                {project.is_featured && (
                  <Sparkles className="w-4 h-4 text-[#D97706] dark:text-[#FFB800] shrink-0" />
                )}
              </div>
              <button
                onClick={onClose}
                className="p-2 rounded-xl hover:bg-gray-100 dark:hover:bg-white/5 text-gray-400 hover:text-gray-700 dark:hover:text-white transition-all"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Content Area: Side Nav + Main */}
            <div className="flex flex-1 min-h-0 border-t border-gray-100 dark:border-[#222]">
              {/* Side Navigation Rail */}
              <div className="w-14 shrink-0 border-r border-gray-100 dark:border-[#222] flex flex-col items-center py-4 gap-1 bg-gray-50/50 dark:bg-[#0E0E12]">
                {views.map((view) => {
                  const Icon = viewIcons[view];
                  const isActive = activeView === view;
                  return (
                    <button
                      key={view}
                      onClick={() => setActiveView(view)}
                      className={`relative w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-200 group ${
                        isActive
                          ? 'bg-[#D97706] dark:bg-[#FFB800] text-white dark:text-[#101014] shadow-md'
                          : 'text-gray-400 dark:text-[#555] hover:text-gray-700 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/5'
                      }`}
                      title={view.charAt(0).toUpperCase() + view.slice(1)}
                    >
                      <Icon className="w-4 h-4" />
                      {/* Tooltip */}
                      <span className="absolute left-full ml-2 px-2 py-1 text-[10px] font-mono bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity whitespace-nowrap z-20">
                        {view.toUpperCase()}
                      </span>
                    </button>
                  );
                })}
              </div>

              {/* Main Content */}
              <div ref={scrollRef} className="flex-1 overflow-y-auto min-h-0">
                <AnimatePresence mode="wait">
                  {/* OVERVIEW VIEW */}
                  {activeView === 'overview' && (
                    <motion.div
                      key="overview"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 space-y-6"
                    >
                      {/* Hero Banner */}
                      <div className="relative w-full aspect-[21/9] rounded-2xl overflow-hidden bg-[#0A0A0C]">
                        <img
                          src={galleryImages[0]?.image_url}
                          alt={project.title}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                        <div className="absolute bottom-4 left-5 right-5">
                          <div className="flex items-center gap-2 mb-2">
                            <span className={`px-2 py-0.5 text-[10px] font-mono rounded-md font-bold uppercase ${
                              project.status === 'published'
                                ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            }`}>
                              {project.status}
                            </span>
                          </div>
                          <h3 className="text-xl font-bold text-white font-heading">
                            {project.title}
                          </h3>
                        </div>
                      </div>

                      {/* Metadata Row */}
                      <div className="flex flex-wrap gap-4 text-xs font-mono text-gray-500 dark:text-[#777]">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FFB800]" />
                          {formatDate(project.created_at)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Tag className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FFB800]" />
                          {project.slug}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <Code2 className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FFB800]" />
                          {project.tech_stack?.length || 0} modules
                        </span>
                      </div>

                      {/* Description */}
                      <div className="bg-gray-50 dark:bg-[#0E0E12] p-5 rounded-2xl border border-gray-100 dark:border-[#222] space-y-2.5">
                        <h4 className="text-xs font-mono text-[#D97706] dark:text-[#FFB800] uppercase font-bold tracking-wider flex items-center gap-2">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          PROJECT OVERVIEW
                        </h4>
                        {descParagraphs.map((para, i) => (
                          <p key={i} className="text-sm text-gray-600 dark:text-[#AAA] leading-relaxed flex items-start gap-2">
                            <span className="text-[#D97706] dark:text-[#FFB800] mt-0.5 text-xs shrink-0">▸</span>
                            <span>{para}</span>
                          </p>
                        ))}
                      </div>

                      {/* Tech Stack */}
                      <div>
                        <h4 className="text-xs font-mono text-gray-500 dark:text-[#666] uppercase font-bold mb-3 flex items-center gap-2">
                          <Layers className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FFB800]" />
                          TECHNOLOGY STACK
                        </h4>
                        <div className="flex flex-wrap gap-2">
                          {project.tech_stack?.map((tech, i) => (
                            <span key={i} className="px-3 py-1.5 text-xs font-mono rounded-xl bg-amber-50 dark:bg-[#1A1A1E] text-[#D97706] dark:text-[#FFB800] border border-amber-200/50 dark:border-[#FFB800]/20 font-semibold">
                              {tech}
                            </span>
                          ))}
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {/* GALLERY VIEW */}
                  {activeView === 'gallery' && (
                    <motion.div
                      key="gallery"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="p-6 space-y-4"
                    >
                      {/* Main Image */}
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden bg-black border border-gray-200 dark:border-[#222]">
                        <AnimatePresence mode="wait">
                          <motion.img
                            key={galleryIdx}
                            src={galleryImages[galleryIdx]?.image_url}
                            alt={galleryImages[galleryIdx]?.caption || project.title}
                            className="w-full h-full object-cover"
                            initial={{ opacity: 0, scale: 1.02 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.98 }}
                            transition={{ duration: 0.25 }}
                          />
                        </AnimatePresence>

                        {/* Nav Arrows */}
                        {galleryImages.length > 1 && (
                          <>
                            <button
                              onClick={() => setGalleryIdx(p => (p - 1 + galleryImages.length) % galleryImages.length)}
                              className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-[#D97706] dark:hover:bg-[#FFB800] hover:text-white dark:hover:text-black transition-all shadow-lg"
                            >
                              <ChevronLeft className="w-5 h-5" />
                            </button>
                            <button
                              onClick={() => setGalleryIdx(p => (p + 1) % galleryImages.length)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/60 text-white hover:bg-[#D97706] dark:hover:bg-[#FFB800] hover:text-white dark:hover:text-black transition-all shadow-lg"
                            >
                              <ChevronRight className="w-5 h-5" />
                            </button>
                          </>
                        )}

                        {/* Counter */}
                        <div className="absolute bottom-3 right-3 px-2.5 py-1 bg-black/60 backdrop-blur-sm rounded-lg text-white text-[10px] font-mono">
                          {galleryIdx + 1} / {galleryImages.length}
                        </div>

                        {/* Caption */}
                        {galleryImages[galleryIdx]?.caption && (
                          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/80 to-transparent p-4 pt-8">
                            <p className="text-xs font-mono text-white/80">{galleryImages[galleryIdx].caption}</p>
                          </div>
                        )}
                      </div>

                      {/* Filmstrip */}
                      {galleryImages.length > 1 && (
                        <div className="flex items-center gap-2 overflow-x-auto pb-1">
                          {galleryImages.map((img, idx) => (
                            <button
                              key={img.id || idx}
                              onClick={() => setGalleryIdx(idx)}
                              className={`relative w-20 aspect-video rounded-lg overflow-hidden border-2 shrink-0 transition-all duration-200 ${
                                idx === galleryIdx
                                  ? 'border-[#D97706] dark:border-[#FFB800] scale-105 shadow-md'
                                  : 'border-transparent opacity-50 hover:opacity-90'
                              }`}
                            >
                              <img src={img.image_url} alt={`Thumb ${idx + 1}`} className="w-full h-full object-cover" />
                            </button>
                          ))}
                        </div>
                      )}
                    </motion.div>
                  )}

                  {/* DEMO VIEW */}
                  {activeView === 'demo' && embedUrl && (
                    <motion.div
                      key="demo"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 10 }}
                      transition={{ duration: 0.2 }}
                      className="p-6"
                    >
                      <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#D97706]/30 dark:border-[#FFB800]/30 shadow-xl bg-black">
                        <iframe
                          src={embedUrl}
                          title={`${project.title} Demo`}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full border-0"
                        />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="flex items-center justify-between px-6 py-3.5 border-t border-gray-100 dark:border-[#222] bg-gray-50/80 dark:bg-[#0E0E12]/80 backdrop-blur-md shrink-0">
              <div className="flex items-center gap-2">
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold rounded-xl border border-gray-200 dark:border-[#333] bg-white dark:bg-[#1A1A1E] text-gray-700 dark:text-[#AAA] hover:border-[#D97706] dark:hover:border-[#FFB800] hover:text-[#D97706] dark:hover:text-[#FFB800] transition-all">
                    <Github className="w-4 h-4" />
                    <span className="hidden sm:inline">Source Code</span>
                  </a>
                )}
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noreferrer"
                    className="flex items-center gap-2 px-3.5 py-2 text-xs font-mono font-bold rounded-xl bg-[#D97706] dark:bg-[#FFB800] text-white dark:text-[#101014] hover:opacity-90 transition-all shadow-md">
                    <ExternalLink className="w-4 h-4" />
                    <span className="hidden sm:inline">Live Demo</span>
                    <ArrowUpRight className="w-3 h-3" />
                  </a>
                )}
              </div>
              <button onClick={onClose}
                className="px-3 py-2 text-xs font-mono text-gray-400 dark:text-[#555] hover:text-gray-700 dark:hover:text-white transition-colors">
                Close · ESC
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};
