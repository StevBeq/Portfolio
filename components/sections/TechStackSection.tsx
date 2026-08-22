'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Layers,
  X,
  Sparkles,
  ExternalLink,
  CheckCircle2,
  Cpu,
  Database,
  Globe,
  Server,
  Smartphone,
  Box,
  GitBranch,
  Code2,
  Zap,
  ShieldCheck,
  HardDrive,
  Info,
} from 'lucide-react';

export interface TechItem {
  id: string;
  name: string;
  category: 'Frontend' | 'Backend' | 'Database' | 'Mobile' | 'DevOps';
  status: 'PRODUCTION' | 'PRIMARY' | 'BAAS' | 'UI MOTION' | 'DATABASE' | 'ORM' | 'MOBILE' | 'CONTAINERS' | 'CI/CD';
  level: 'Expert' | 'Advanced' | 'Proficient';
  icon: React.ReactNode;
  shortTag: string;
  fullDescription: string;
  highlights: string[];
  accentColor: string;
  glowColor: string;
  badgeBg: string;
  borderHover: string;
}

// Custom SVG Brand Icons for standard crisp look
const NextJsIcon = () => (
  <svg className="w-7 h-7 fill-current" viewBox="0 0 180 180">
    <mask id="mask-next" maskUnits="userSpaceOnUse" x="0" y="0" width="180" height="180">
      <rect width="180" height="180" fill="#fff" />
    </mask>
    <path d="M149.508 157.52L69.141 54H54v71.97h12.115V71.916l68.212 88.082a89.96 89.96 0 0015.181-2.478z" />
    <path d="M115.19 54h12.115v72H115.19z" />
    <circle cx="90" cy="90" r="85" stroke="currentColor" strokeWidth="10" fill="none" />
  </svg>
);

const ReactIcon = () => (
  <svg className="w-7 h-7 fill-current" viewBox="0 0 100 100">
    <circle cx="50" cy="50" r="10" />
    <ellipse cx="50" cy="50" rx="42" ry="16" fill="none" stroke="currentColor" strokeWidth="4" />
    <ellipse cx="50" cy="50" rx="42" ry="16" fill="none" stroke="currentColor" strokeWidth="4" transform="rotate(60 50 50)" />
    <ellipse cx="50" cy="50" rx="42" ry="16" fill="none" stroke="currentColor" strokeWidth="4" transform="rotate(120 50 50)" />
  </svg>
);

const TypeScriptIcon = () => (
  <svg className="w-7 h-7 fill-current" viewBox="0 0 100 100">
    <rect width="90" height="90" x="5" y="5" rx="16" fill="none" stroke="currentColor" strokeWidth="8" />
    <text x="25" y="68" fontSize="42" fontFamily="sans-serif" fontWeight="bold" fill="currentColor">TS</text>
  </svg>
);

const TailwindIcon = () => (
  <svg className="w-7 h-7 fill-current" viewBox="0 0 100 60">
    <path d="M26 12c6 0 10 3 13 8 4 6 9 10 17 10 7 0 12-4 15-10-6 0-10-3-13-8-4-6-9-10-17-10-7 0-12 4-15 10zm-18 24c6 0 10 3 13 8 4 6 9 10 17 10 7 0 12-4 15-10-6 0-10-3-13-8-4-6-9-10-17-10-7 0-12 4-15 10z" />
  </svg>
);

const SupabaseIcon = () => (
  <svg className="w-7 h-7 fill-current" viewBox="0 0 100 100">
    <path d="M57.6 92.4c-2 2.7-6.2.9-5.7-2.4l5.3-33.1H14.1c-3.1 0-4.8-3.6-2.8-6l35.1-43.3c2-2.7 6.2-.9 5.7 2.4l-5.3 33.1h43.1c3.1 0 4.8 3.6 2.8 6L57.6 92.4z" />
  </svg>
);

const PostgreSQLIcon = () => (
  <svg className="w-7 h-7 fill-current" viewBox="0 0 100 100">
    <path d="M50 10C27.9 10 10 27.9 10 50s17.9 40 40 40 40-17.9 40-40S72.1 10 50 10zm0 15c13.8 0 25 11.2 25 25S63.8 75 50 75 25 63.8 25 50s11.2-25 25-25z" />
    <path d="M42 38h16v8H42zm0 14h16v8H42z" />
  </svg>
);

const DockerIcon = () => (
  <svg className="w-7 h-7 fill-current" viewBox="0 0 100 100">
    <rect x="20" y="42" width="14" height="12" rx="2" />
    <rect x="38" y="42" width="14" height="12" rx="2" />
    <rect x="56" y="42" width="14" height="12" rx="2" />
    <rect x="38" y="26" width="14" height="12" rx="2" />
    <rect x="56" y="26" width="14" height="12" rx="2" />
    <rect x="56" y="10" width="14" height="12" rx="2" />
    <path d="M10 60c5 15 25 25 45 25s40-10 42-25H10z" />
  </svg>
);

const techStackData: TechItem[] = [
  {
    id: 'nextjs',
    name: 'Next.js 15',
    category: 'Frontend',
    status: 'PRODUCTION',
    level: 'Expert',
    icon: <NextJsIcon />,
    shortTag: 'App Router & SSR',
    fullDescription: 'Primary framework for building full-stack web applications. Extensive experience with Next.js 15 App Router, Server Actions, Hybrid SSR/SSG, Middleware, and API Route optimizations.',
    highlights: ['App Router', 'Server Actions', 'SSR & SSG', 'Middleware', 'Route Handlers'],
    accentColor: 'text-slate-900 dark:text-white',
    glowColor: 'rgba(255, 255, 255, 0.15)',
    badgeBg: 'bg-slate-100 dark:bg-white/10 text-slate-800 dark:text-white border-slate-300 dark:border-white/20',
    borderHover: 'hover:border-slate-400 dark:hover:border-white/40',
  },
  {
    id: 'react',
    name: 'React 19',
    category: 'Frontend',
    status: 'PRIMARY',
    level: 'Expert',
    icon: <ReactIcon />,
    shortTag: 'UI Component Logic',
    fullDescription: 'Core UI library used across web platforms. Specializing in modular component architecture, custom hooks, React Server Components, context state management, and performance tuning.',
    highlights: ['React 19 Hooks', 'Custom Hooks', 'Server Components', 'Context API', 'State Optimization'],
    accentColor: 'text-cyan-600 dark:text-cyan-400',
    glowColor: 'rgba(34, 211, 238, 0.25)',
    badgeBg: 'bg-cyan-500/10 dark:bg-cyan-400/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    borderHover: 'hover:border-cyan-500/50',
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    category: 'Frontend',
    status: 'PRIMARY',
    level: 'Expert',
    icon: <TypeScriptIcon />,
    shortTag: 'Type-Safe Architecture',
    fullDescription: 'Enforces end-to-end type safety across client and server environments. Skilled in complex generic interfaces, utility types, Zod schema validation, and strict compile-time safety.',
    highlights: ['Strict Typing', 'Generic Interfaces', 'Zod Validation', 'Utility Types', 'AST & DX'],
    accentColor: 'text-blue-600 dark:text-blue-400',
    glowColor: 'rgba(96, 165, 250, 0.25)',
    badgeBg: 'bg-blue-500/10 dark:bg-blue-400/10 text-blue-700 dark:text-blue-300 border-blue-500/30',
    borderHover: 'hover:border-blue-500/50',
  },
  {
    id: 'tailwind',
    name: 'Tailwind CSS',
    category: 'Frontend',
    status: 'PRIMARY',
    level: 'Expert',
    icon: <TailwindIcon />,
    shortTag: 'Modern Design System',
    fullDescription: 'Utility-first CSS framework for crafting responsive, pixel-perfect user interfaces. Proficient in custom design tokens, dark mode systems, glassmorphism, and responsive layouts.',
    highlights: ['Utility-First', 'Custom Tokens', 'Responsive Grid', 'Glassmorphism', 'Dark Mode System'],
    accentColor: 'text-teal-600 dark:text-teal-400',
    glowColor: 'rgba(45, 212, 191, 0.25)',
    badgeBg: 'bg-teal-500/10 dark:bg-teal-400/10 text-teal-700 dark:text-teal-300 border-teal-500/30',
    borderHover: 'hover:border-teal-500/50',
  },
  {
    id: 'framer',
    name: 'Framer Motion',
    category: 'Frontend',
    status: 'UI MOTION',
    level: 'Advanced',
    icon: <Zap className="w-6 h-6" />,
    shortTag: 'Physics Animation',
    fullDescription: 'Used to deliver fluid user interactions and high-impact motion design. Skilled in layout animations, gesture controls, page transitions, spring physics, and AnimatePresence.',
    highlights: ['Layout Animations', 'Spring Physics', 'AnimatePresence', 'Scroll Triggers', 'Micro-Interactions'],
    accentColor: 'text-purple-600 dark:text-purple-400',
    glowColor: 'rgba(192, 132, 252, 0.25)',
    badgeBg: 'bg-purple-500/10 dark:bg-purple-400/10 text-purple-700 dark:text-purple-300 border-purple-500/30',
    borderHover: 'hover:border-purple-500/50',
  },
  {
    id: 'nodejs',
    name: 'Node.js & Express',
    category: 'Backend',
    status: 'PRIMARY',
    level: 'Advanced',
    icon: <Server className="w-6 h-6" />,
    shortTag: 'RESTful API Services',
    fullDescription: 'Server-side runtime for building scalable microservices and RESTful API endpoints. Proficient in middleware architecture, JWT authentication, asynchronous processing, and rate limiting.',
    highlights: ['RESTful APIs', 'Express Middleware', 'Async Workflows', 'JWT Security', 'API Design'],
    accentColor: 'text-green-600 dark:text-green-400',
    glowColor: 'rgba(74, 222, 128, 0.25)',
    badgeBg: 'bg-green-500/10 dark:bg-green-400/10 text-green-700 dark:text-green-300 border-green-500/30',
    borderHover: 'hover:border-green-500/50',
  },
  {
    id: 'supabase',
    name: 'Supabase',
    category: 'Backend',
    status: 'BAAS',
    level: 'Advanced',
    icon: <SupabaseIcon />,
    shortTag: 'Realtime Backend & Auth',
    fullDescription: 'Open-source Firebase alternative powered by PostgreSQL. Experienced in setting up Row Level Security (RLS) policies, real-time database subscriptions, auth flows, and storage buckets.',
    highlights: ['RLS Policies', 'Real-time Subscriptions', 'OAuth & Auth', 'Storage Buckets', 'Postgres Functions'],
    accentColor: 'text-emerald-600 dark:text-emerald-400',
    glowColor: 'rgba(52, 211, 153, 0.25)',
    badgeBg: 'bg-emerald-500/10 dark:bg-emerald-400/10 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    borderHover: 'hover:border-emerald-500/50',
  },
  {
    id: 'postgres',
    name: 'PostgreSQL',
    category: 'Database',
    status: 'DATABASE',
    level: 'Advanced',
    icon: <PostgreSQLIcon />,
    shortTag: 'Relational Database',
    fullDescription: 'Enterprise-grade relational database management. Experienced in normalized schema design, foreign key relationships, complex indexing, performance queries, and data integrity constraints.',
    highlights: ['Schema Modeling', 'Indexing & Triggers', 'Complex Queries', 'Data Integrity', 'JSONB Storage'],
    accentColor: 'text-indigo-600 dark:text-indigo-400',
    glowColor: 'rgba(129, 140, 248, 0.25)',
    badgeBg: 'bg-indigo-500/10 dark:bg-indigo-400/10 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
    borderHover: 'hover:border-indigo-500/50',
  },
  {
    id: 'prisma',
    name: 'Prisma ORM',
    category: 'Database',
    status: 'ORM',
    level: 'Advanced',
    icon: <HardDrive className="w-6 h-6" />,
    shortTag: 'Type-Safe DB Queries',
    fullDescription: 'Next-generation Object-Relational Mapping (ORM) tool. Enables auto-generated TypeScript types, declarative schema migrations, efficient database relations, and seamles seed scripts.',
    highlights: ['Declarative Schemas', 'Auto-Generated Types', 'Migration Workflows', 'Relational Joins', 'DB Seeding'],
    accentColor: 'text-violet-600 dark:text-violet-400',
    glowColor: 'rgba(167, 139, 250, 0.25)',
    badgeBg: 'bg-violet-500/10 dark:bg-violet-400/10 text-violet-700 dark:text-violet-300 border-violet-500/30',
    borderHover: 'hover:border-violet-500/50',
  },
  {
    id: 'flutter',
    name: 'Flutter & Dart',
    category: 'Mobile',
    status: 'MOBILE',
    level: 'Proficient',
    icon: <Smartphone className="w-6 h-6" />,
    shortTag: 'Cross-Platform Mobile',
    fullDescription: 'Framework for building natively compiled iOS and Android applications. Proficient in reactive state management (Provider/Riverpod), custom widgets, responsive mobile layouts, and API syncing.',
    highlights: ['iOS & Android', 'State Management', 'Native Integration', 'Custom Widgets', 'REST API Sync'],
    accentColor: 'text-sky-600 dark:text-sky-400',
    glowColor: 'rgba(56, 189, 248, 0.25)',
    badgeBg: 'bg-sky-500/10 dark:bg-sky-400/10 text-sky-700 dark:text-sky-300 border-sky-500/30',
    borderHover: 'hover:border-sky-500/50',
  },
  {
    id: 'docker',
    name: 'Docker',
    category: 'DevOps',
    status: 'CONTAINERS',
    level: 'Proficient',
    icon: <DockerIcon />,
    shortTag: 'Container Isolation',
    fullDescription: 'Used for containerizing applications to ensure consistent environments across development and deployment. Experience with Dockerfiles, multi-stage builds, and Docker Compose orchestration.',
    highlights: ['Containerization', 'Multi-Stage Builds', 'Docker Compose', 'Dev Consistency', 'Microservice Specs'],
    accentColor: 'text-cyan-600 dark:text-cyan-400',
    glowColor: 'rgba(34, 211, 238, 0.25)',
    badgeBg: 'bg-cyan-500/10 dark:bg-cyan-400/10 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    borderHover: 'hover:border-cyan-500/50',
  },
  {
    id: 'git',
    name: 'Git & GitHub Actions',
    category: 'DevOps',
    status: 'CI/CD',
    level: 'Expert',
    icon: <GitBranch className="w-6 h-6" />,
    shortTag: 'CI/CD & Version Control',
    fullDescription: 'Essential toolset for modern software delivery. Proficient in git flow branch strategies, merge conflict resolution, pull request code reviews, and automated CI/CD deployment pipelines.',
    highlights: ['Git Flow', 'CI/CD Automation', 'PR Code Reviews', 'Release Tagging', 'Vercel Auto-Deploys'],
    accentColor: 'text-orange-600 dark:text-orange-400',
    glowColor: 'rgba(251, 146, 60, 0.25)',
    badgeBg: 'bg-orange-500/10 dark:bg-orange-400/10 text-orange-700 dark:text-orange-300 border-orange-500/30',
    borderHover: 'hover:border-orange-500/50',
  },
];

const categoryTabs = ['All', 'Frontend', 'Backend', 'Database', 'Mobile', 'DevOps'] as const;

export const TechStackSection: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [selectedTech, setSelectedTech] = useState<TechItem | null>(null);

  // Keyboard shortcut listener to close modal on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setSelectedTech(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredItems =
    activeTab === 'All'
      ? techStackData
      : techStackData.filter((item) => item.category === activeTab);

  return (
    <section
      id="tech"
      className="section-viewport section-divider py-20 relative bg-[#F8F9FC] dark:bg-[#101014] border-t border-gray-200 dark:border-[#252529] transition-colors duration-300 overflow-hidden"
    >
      <div className="max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-12">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <div className="flex items-center gap-3 mb-2.5">
              <div className="w-9 h-9 rounded-xl bg-amber-500/10 dark:bg-[#FFB800]/10 border border-amber-500/30 dark:border-[#FFB800]/30 flex items-center justify-center text-[#D97706] dark:text-[#FFB800] shadow-sm shrink-0">
                <Layers className="w-4 h-4" />
              </div>
              <span className="text-xs font-mono tracking-widest text-[#D97706] dark:text-[#FFB800] uppercase font-semibold">
                Tech Stack
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-bold font-heading text-slate-900 dark:text-[#D9D9D9] tracking-tight">
              CORE TECHNOLOGIES & TOOLS
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#8E8E93] mt-1 max-w-xl font-sans">
              Click on any technology icon below to expand detailed architectural specifications and key features.
            </p>
          </div>

          <div className="flex items-center gap-2 self-start md:self-auto font-mono text-xs text-slate-600 dark:text-[#8E8E93] bg-white dark:bg-[#18181C] px-3.5 py-1.5 rounded-full border border-slate-200/80 dark:border-[#252529] shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>12 Curated Production Tools</span>
          </div>
        </div>

        {/* Apple-style Animated Segmented Tab Control */}
        <div className="flex justify-start mb-8 overflow-x-auto pb-2 scrollbar-none">
          <div className="p-1.5 rounded-2xl bg-slate-200/60 dark:bg-[#18181C] border border-slate-300/50 dark:border-[#26262B] backdrop-blur-md inline-flex items-center gap-1">
            {categoryTabs.map((tab) => {
              const isActive = activeTab === tab;
              const itemCount =
                tab === 'All'
                  ? techStackData.length
                  : techStackData.filter((i) => i.category === tab).length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative px-4 py-2 rounded-xl text-xs font-mono font-medium transition-colors duration-200 shrink-0 z-10 flex items-center gap-1.5 ${
                    isActive
                      ? 'text-white dark:text-[#101014] font-semibold'
                      : 'text-slate-600 dark:text-[#8E8E93] hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTabBackground"
                      className="absolute inset-0 bg-[#D97706] dark:bg-[#FFB800] rounded-xl shadow-amber-glow -z-10"
                      transition={{ type: 'spring', stiffness: 450, damping: 30 }}
                    />
                  )}
                  <span>{tab}</span>
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isActive
                        ? 'bg-white/20 dark:bg-black/20 text-white dark:text-[#101014]'
                        : 'bg-slate-300/60 dark:bg-[#24242A] text-slate-500 dark:text-[#8E8E93]'
                    }`}
                  >
                    {itemCount}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Logo-Centric Compact Grid with Hover Magnification */}
        <motion.div layout className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
          <AnimatePresence mode="popLayout">
            {filteredItems.map((item) => {
              return (
                <motion.div
                  key={item.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  whileHover={{ scale: 1.06, y: -4 }}
                  onClick={() => setSelectedTech(item)}
                  className={`group cursor-pointer relative p-4 rounded-2xl bg-white dark:bg-[#16161A] border border-slate-200/80 dark:border-[#24242A] ${item.borderHover} shadow-sm hover:shadow-lg dark:hover:shadow-[0_8px_25px_rgba(0,0,0,0.5)] transition-all duration-200 flex flex-col items-center justify-between text-center overflow-hidden min-h-[130px]`}
                >
                  {/* Subtle Brand Glow Effect on Hover */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none rounded-2xl"
                    style={{
                      background: `radial-gradient(circle at center, ${item.glowColor} 0%, transparent 70%)`,
                    }}
                  />

                  {/* Icon Container with Magnification Effect */}
                  <div className="mt-2 relative z-10 flex items-center justify-center">
                    <motion.div
                      whileHover={{ scale: 1.15, rotate: 3 }}
                      transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                      className={`w-12 h-12 rounded-xl border flex items-center justify-center ${item.badgeBg} ${item.accentColor} shadow-sm transition-transform duration-200`}
                    >
                      {item.icon}
                    </motion.div>
                  </div>

                  {/* Name & Short Tag */}
                  <div className="relative z-10 my-2">
                    <h3 className="text-xs sm:text-sm font-bold font-heading text-slate-900 dark:text-[#D9D9D9] group-hover:text-[#D97706] dark:group-hover:text-[#FFB800] transition-colors line-clamp-1">
                      {item.name}
                    </h3>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-[#8E8E93] block mt-0.5 font-medium line-clamp-1">
                      {item.shortTag}
                    </span>
                  </div>

                  {/* Bottom Bar: Status Dot & Click Hint */}
                  <div className="w-full pt-2 border-t border-slate-100 dark:border-white/5 flex items-center justify-between text-[10px] font-mono text-slate-400 dark:text-[#55555A] relative z-10">
                    <span className="flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                      {item.status}
                    </span>
                    <Info className="w-3.5 h-3.5 opacity-40 group-hover:opacity-100 text-[#D97706] dark:text-[#FFB800] transition-opacity" />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      </div>

      {/* Interactive Detail Modal Popup */}
      <AnimatePresence>
        {selectedTech && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop Blur Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedTech(null)}
              className="fixed inset-0 bg-black/60 dark:bg-black/80 backdrop-blur-md"
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', stiffness: 350, damping: 25 }}
              className="relative w-full max-w-lg rounded-3xl bg-white dark:bg-[#16161A] border border-slate-200 dark:border-[#2A2A30] shadow-2xl p-6 sm:p-8 z-10 overflow-hidden"
            >
              {/* Top Glow Accent Bar */}
              <div
                className="absolute top-0 left-0 right-0 h-1.5"
                style={{
                  background: `linear-gradient(90deg, #D97706, ${selectedTech.glowColor || '#FFB800'}, #D97706)`,
                }}
              />

              {/* Close Button */}
              <button
                onClick={() => setSelectedTech(null)}
                className="absolute top-5 right-5 w-9 h-9 rounded-full bg-slate-100 dark:bg-[#222228] border border-slate-200 dark:border-white/10 flex items-center justify-center text-slate-500 dark:text-[#8E8E93] hover:text-slate-900 dark:hover:text-white transition-colors"
                aria-label="Close modal"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Header Info */}
              <div className="flex items-start gap-4 mb-6">
                <div
                  className={`w-16 h-16 rounded-2xl border flex items-center justify-center shrink-0 ${selectedTech.badgeBg} ${selectedTech.accentColor} shadow-md`}
                >
                  {selectedTech.icon}
                </div>

                <div>
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <span className="text-[10px] font-mono font-bold tracking-wider px-2.5 py-0.5 rounded-md bg-amber-500/10 dark:bg-[#FFB800]/10 text-[#D97706] dark:text-[#FFB800] border border-amber-500/20 uppercase">
                      {selectedTech.category}
                    </span>
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-[#222228] text-slate-600 dark:text-[#8E8E93] border border-slate-200 dark:border-white/5 uppercase">
                      {selectedTech.level}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-[#D9D9D9]">
                    {selectedTech.name}
                  </h3>
                  <span className="text-xs font-mono text-slate-500 dark:text-[#8E8E93]">
                    Status: {selectedTech.status}
                  </span>
                </div>
              </div>

              {/* Full Description */}
              <div className="mb-6">
                <h4 className="text-xs font-mono font-semibold uppercase text-slate-400 dark:text-[#66666C] mb-2 tracking-wider">
                  Overview & Usage
                </h4>
                <p className="text-xs sm:text-sm text-slate-700 dark:text-[#A0A0A6] leading-relaxed font-sans bg-slate-50 dark:bg-[#1A1A1E] p-4 rounded-xl border border-slate-200/60 dark:border-white/5">
                  {selectedTech.fullDescription}
                </p>
              </div>

              {/* Key Highlights / Features */}
              <div className="mb-8">
                <h4 className="text-xs font-mono font-semibold uppercase text-slate-400 dark:text-[#66666C] mb-3 tracking-wider flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FFB800]" />
                  Key Architectural Features
                </h4>
                <div className="flex flex-wrap gap-2">
                  {selectedTech.highlights.map((highlight, idx) => (
                    <span
                      key={idx}
                      className="inline-flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-lg bg-slate-100 dark:bg-[#202026] text-slate-800 dark:text-[#D9D9D9] border border-slate-200 dark:border-white/10"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                      {highlight}
                    </span>
                  ))}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="flex items-center justify-between pt-4 border-t border-slate-200 dark:border-white/10 text-xs font-mono text-slate-500 dark:text-[#8E8E93]">
                <span>Press ESC or click backdrop to exit</span>
                <button
                  onClick={() => setSelectedTech(null)}
                  className="px-4 py-2 rounded-xl bg-[#D97706] dark:bg-[#FFB800] text-white dark:text-[#101014] font-semibold hover:bg-amber-600 dark:hover:bg-amber-400 transition-colors shadow-sm"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </section>
  );
};

