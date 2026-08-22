'use client';

import React, { useState, useRef, useCallback } from 'react';
import { motion } from 'framer-motion';
import {
  Github,
  ExternalLink,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';
import { Project, ProjectImage } from '@/lib/supabase/types';

interface ProjectSlideCardProps {
  project: Project;
  images: ProjectImage[];
  onExpand: (project: Project) => void;
  index?: number;
}

export const ProjectSlideCard: React.FC<ProjectSlideCardProps> = ({
  project,
  images,
  onExpand,
  index = 0,
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glowPos, setGlowPos] = useState({ x: 50, y: 50 });

  // Get the thumbnail image (first one or fallback)
  const thumbnailUrl =
    images && images.length > 0
      ? (images.find((img) => img.is_thumbnail)?.image_url || images[0].image_url)
      : 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=800&q=80';

  const imageCount = images?.length || 0;

  // 3D tilt effect on mouse move
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    setTilt({
      x: (y - 0.5) * -8,
      y: (x - 0.5) * 8,
    });
    setGlowPos({ x: x * 100, y: y * 100 });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setTilt({ x: 0, y: 0 });
  }, []);

  return (
    <motion.div
      ref={cardRef}
      onClick={() => onExpand(project)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onMouseMove={handleMouseMove}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.12, ease: [0.22, 1, 0.36, 1] }}
      style={{
        transform: `perspective(800px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)`,
        transition: isHovered ? 'transform 0.1s ease-out' : 'transform 0.4s ease-out',
      }}
      className="group relative cursor-pointer select-none will-change-transform"
    >
      {/* Card Shell */}
      <div className="relative bg-white dark:bg-[#18181C] rounded-2xl border border-gray-200/80 dark:border-[#252529] overflow-hidden shadow-lg group-hover:shadow-2xl dark:group-hover:shadow-[0_20px_60px_-10px_rgba(255,184,0,0.15)] transition-shadow duration-500">

        {/* Magnetic Glow Overlay */}
        <div
          className="absolute inset-0 z-10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500 rounded-2xl"
          style={{
            background: `radial-gradient(circle at ${glowPos.x}% ${glowPos.y}%, rgba(255,184,0,0.08) 0%, transparent 60%)`,
          }}
        />

        {/* Image Container */}
        <div className="relative w-full aspect-[16/10] overflow-hidden bg-[#0A0A0C]">
          {/* Main Image */}
          <img
            src={thumbnailUrl}
            alt={project.title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
            loading="lazy"
          />

          {/* Gradient Overlays */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-br from-transparent via-transparent to-[#D97706]/10 dark:to-[#FFB800]/10 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Top Badges */}
          <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
            <span className="px-2.5 py-1 text-[10px] font-mono uppercase font-bold rounded-lg bg-black/50 backdrop-blur-md text-white border border-white/10 tracking-wider">
              {project.category}
            </span>
            {project.is_featured && (
              <span className="px-2 py-1 text-[10px] font-mono uppercase font-bold rounded-lg bg-[#D97706]/80 dark:bg-[#FFB800]/80 text-white dark:text-[#101014] backdrop-blur-md flex items-center gap-1 shadow-[0_0_12px_rgba(255,184,0,0.4)]">
                <Sparkles className="w-3 h-3" />
                FEATURED
              </span>
            )}
          </div>

          {/* Image count badge */}
          {imageCount > 1 && (
            <div className="absolute top-3 right-3 z-20 px-2 py-1 text-[10px] font-mono rounded-lg bg-black/50 backdrop-blur-md text-white/80 border border-white/10">
              {imageCount} slides
            </div>
          )}

          {/* Bottom Overlay Content - Title & Quick Links */}
          <div className="absolute bottom-0 inset-x-0 z-20 p-4 pb-5">
            <h3 className="text-lg font-bold text-white font-heading tracking-tight line-clamp-1 mb-1 group-hover:text-[#FFB800] transition-colors duration-300">
              {project.title}
            </h3>
            <p className="text-xs text-white/60 line-clamp-1 font-mono">
              {project.tech_stack?.slice(0, 3).join(' · ')}
              {project.tech_stack && project.tech_stack.length > 3 && ` +${project.tech_stack.length - 3}`}
            </p>
          </div>
        </div>

        {/* Card Body */}
        <div className="p-4 space-y-3">
          {/* Description */}
          <p className="text-sm text-gray-600 dark:text-[#8E8E93] line-clamp-2 leading-relaxed">
            {project.description}
          </p>

          {/* Tech Stack Pills */}
          <div className="flex flex-wrap gap-1.5">
            {project.tech_stack?.slice(0, 4).map((tech, i) => (
              <span
                key={i}
                className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-gray-100 dark:bg-[#252529] text-gray-600 dark:text-[#8E8E93] border border-gray-200 dark:border-white/5 group-hover:border-[#D97706]/30 dark:group-hover:border-[#FFB800]/20 transition-colors duration-300"
              >
                {tech}
              </span>
            ))}
            {project.tech_stack && project.tech_stack.length > 4 && (
              <span className="px-2 py-0.5 text-[10px] font-mono rounded-md bg-amber-50 dark:bg-[#252529] text-[#D97706] dark:text-[#FFB800] border border-amber-200 dark:border-[#FFB800]/20 font-bold">
                +{project.tech_stack.length - 4}
              </span>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100 dark:border-[#252529]">
            {/* Quick Links */}
            <div className="flex items-center gap-1" onClick={(e) => e.stopPropagation()}>
              {project.github_url && (
                <a
                  href={project.github_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-gray-400 dark:text-[#55555A] hover:text-[#D97706] dark:hover:text-[#FFB800] hover:bg-amber-50 dark:hover:bg-white/5 transition-all"
                  title="GitHub"
                >
                  <Github className="w-3.5 h-3.5" />
                </a>
              )}
              {project.live_url && (
                <a
                  href={project.live_url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg text-gray-400 dark:text-[#55555A] hover:text-[#D97706] dark:hover:text-[#FFB800] hover:bg-amber-50 dark:hover:bg-white/5 transition-all"
                  title="Live Demo"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* View Details CTA */}
            <span className="flex items-center gap-1 text-[11px] font-mono font-bold text-gray-400 dark:text-[#55555A] group-hover:text-[#D97706] dark:group-hover:text-[#FFB800] transition-colors duration-300">
              <span>View Project</span>
              <ArrowUpRight className="w-3.5 h-3.5 transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-300" />
            </span>
          </div>
        </div>

        {/* Hover Border Glow */}
        <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#D97706]/40 dark:group-hover:border-[#FFB800]/40 transition-colors duration-500 pointer-events-none" />
      </div>
    </motion.div>
  );
};
