"use client";

import React, { useMemo, useState } from "react";
import {
  ArrowLeft,
  ArrowUpRight,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronRight,
  Code2,
  Copy,
  ExternalLink,
  FolderGit2,
  GraduationCap,
  Home,
  Mail,
  MapPin,
  MessageCircle,
  Monitor,
  Search,
  Smartphone,
  Star,
  User,
  X,
} from "lucide-react";
import {
  STEVBEQ_EDUCATION,
  STEVBEQ_EXPERIENCE,
  STEVBEQ_PROFILE,
  STEVBEQ_PROJECTS,
  type ProjectItem,
} from "@/data/stevbeq";
import { usePortfolioLayer } from "@/components/providers/SmoothScrollProvider";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { TechStackLogo } from "@/components/ui/TechStackIcons";

type DashboardTab = "overview" | "projects" | "experience" | "stack";
type StackFilter = "all" | "frontend-mobile" | "backend-db" | "cloud-tools";

const WHATSAPP_URL = "https://wa.me/6287739280104";

interface InspectorItem {
  title: string;
  badge: string;
  subtitle: string;
  description: string;
  bullets?: string[];
  tags: string[];
  githubUrl?: string;
  liveUrl?: string;
  previewType?: "web" | "mobile";
  previewImages?: string[];
  stageGradient?: string;
  logoId?: string;
  glyph?: string;
  accentColor?: string;
}

interface GridHighlightItem extends InspectorItem {
  id: string;
  shortTitle: string;
  shortSub: string;
  badgeBg?: string;
}

interface StackCardItem {
  id: string;
  name: string;
  category: string;
  group: Exclude<StackFilter, "all">;
  role: string;
  accentHex: string;
  tintBg: string;
  description: string;
  usedIn: string[];
}

const RICH_TECH_STACK: StackCardItem[] = [
  {
    id: "nextjs",
    name: "Next.js",
    category: "Web",
    group: "frontend-mobile",
    role: "App Router & SSR",
    accentHex: "#0F172A",
    tintBg: "bg-slate-900/[0.06]",
    description: "Primary React meta-framework for SEO-ready, fast, production web platforms and API routes.",
    usedIn: ["Proof-Of-Grudge", "StevBeq Portfolio"],
  },
  {
    id: "react",
    name: "React",
    category: "Web",
    group: "frontend-mobile",
    role: "Interactive UI Core",
    accentHex: "#06B6D4",
    tintBg: "bg-cyan-500/[0.08]",
    description: "Component-driven interfaces, hooks architecture, and state-synchronized interactive views.",
    usedIn: ["Proof-Of-Grudge", "StevBeq Lab", "StevBeq Portfolio"],
  },
  {
    id: "typescript",
    name: "TypeScript",
    category: "Lang",
    group: "frontend-mobile",
    role: "Strict Type Safety",
    accentHex: "#3178C6",
    tintBg: "bg-blue-600/[0.08]",
    description: "End-to-end static typing across frontend UI, data contracts, and developer tooling.",
    usedIn: ["Proof-Of-Grudge", "StevBeq Lab", "StevBeq Portfolio"],
  },
  {
    id: "flutter",
    name: "Flutter",
    category: "Mobile",
    group: "frontend-mobile",
    role: "Cross-Platform Apps",
    accentHex: "#0EA5E9",
    tintBg: "bg-sky-500/[0.09]",
    description: "Single-codebase Android & iOS mobile apps engineered for smooth 60fps tactile UX.",
    usedIn: ["KwakTodo"],
  },
  {
    id: "dart",
    name: "Dart",
    category: "Mobile",
    group: "frontend-mobile",
    role: "Reactive Mobile Logic",
    accentHex: "#0284C7",
    tintBg: "bg-sky-600/[0.08]",
    description: "Typed asynchronous logic, state flows, and widget architecture powering Flutter builds.",
    usedIn: ["KwakTodo"],
  },
  {
    id: "vue",
    name: "Vue",
    category: "Web",
    group: "frontend-mobile",
    role: "Reactive Web Views",
    accentHex: "#10B981",
    tintBg: "bg-emerald-500/[0.08]",
    description: "Lightweight reactive single-page web interfaces and rapid front-end prototyping.",
    usedIn: ["StevBeq Lab & Tooling"],
  },
  {
    id: "tailwind",
    name: "Tailwind CSS",
    category: "UI",
    group: "frontend-mobile",
    role: "Design System Styling",
    accentHex: "#38BDF8",
    tintBg: "bg-sky-400/[0.09]",
    description: "Precision utility styling, custom design tokens, and responsive multi-breakpoint grids.",
    usedIn: ["Proof-Of-Grudge", "Enterprise Case Study", "StevBeq Portfolio"],
  },
  {
    id: "laravel",
    name: "Laravel",
    category: "Backend",
    group: "backend-db",
    role: "Enterprise MVC & API",
    accentHex: "#EF4444",
    tintBg: "bg-rose-500/[0.08]",
    description: "Structured fullstack web backend, authentication, Eloquent ORM, and operational dashboards.",
    usedIn: ["PT. Indo Techno Medic Case Study"],
  },
  {
    id: "php",
    name: "PHP",
    category: "Backend",
    group: "backend-db",
    role: "Server-Side Core",
    accentHex: "#6366F1",
    tintBg: "bg-indigo-500/[0.08]",
    description: "Reliable server-side business logic, REST endpoints, and enterprise healthcare modules.",
    usedIn: ["PT. Indo Techno Medic Case Study"],
  },
  {
    id: "python",
    name: "Python",
    category: "Backend",
    group: "backend-db",
    role: "Automation & Scripts",
    accentHex: "#EAB308",
    tintBg: "bg-amber-500/[0.09]",
    description: "Backend scripting, data processing utilities, and rapid technical prototypes.",
    usedIn: ["StevBeq Lab & Tooling"],
  },
  {
    id: "postgresql",
    name: "PostgreSQL",
    category: "DB",
    group: "backend-db",
    role: "Relational Modeling",
    accentHex: "#2563EB",
    tintBg: "bg-blue-600/[0.08]",
    description: "Normalized relational schema design, indexing, and transactional SQL queries.",
    usedIn: ["PT. Indo Techno Medic Case Study", "Supabase Projects"],
  },
  {
    id: "mysql",
    name: "MySQL",
    category: "DB",
    group: "backend-db",
    role: "Enterprise SQL Store",
    accentHex: "#F59E0B",
    tintBg: "bg-amber-500/[0.09]",
    description: "Production relational database management and query tuning for web operations.",
    usedIn: ["PT. Indo Techno Medic Case Study"],
  },
  {
    id: "supabase",
    name: "Supabase",
    category: "Cloud",
    group: "cloud-tools",
    role: "Auth & Managed Postgres",
    accentHex: "#10B981",
    tintBg: "bg-emerald-500/[0.09]",
    description: "Instant Postgres backends, Row-Level Security auth, and realtime data subscriptions.",
    usedIn: ["StevBeq Lab & Tooling"],
  },
  {
    id: "firebase",
    name: "Firebase",
    category: "Cloud",
    group: "cloud-tools",
    role: "Mobile Sync & Auth",
    accentHex: "#F59E0B",
    tintBg: "bg-amber-400/[0.10]",
    description: "Cloud storage, authentication, and realtime sync tailored for Flutter mobile apps.",
    usedIn: ["KwakTodo"],
  },
  {
    id: "vite",
    name: "Vite",
    category: "Tool",
    group: "cloud-tools",
    role: "Instant Build Tooling",
    accentHex: "#8B5CF6",
    tintBg: "bg-violet-500/[0.08]",
    description: "Ultra-fast local HMR development and optimized production ES module bundling.",
    usedIn: ["StevBeq Lab & Tooling"],
  },
  {
    id: "git",
    name: "Git & GitHub",
    category: "VCS",
    group: "cloud-tools",
    role: "Team Version Control",
    accentHex: "#EA580C",
    tintBg: "bg-orange-500/[0.08]",
    description: "Branching discipline, collaborative pull requests, and automated Vercel deployments.",
    usedIn: ["All Public & Enterprise Repositories"],
  },
];

const OVERVIEW_GRID_9: GridHighlightItem[] = [
  {
    id: "proof-of-grudge",
    shortTitle: "Proof-Of-Grudge",
    shortSub: "Next.js · MPC",
    badgeBg: "bg-[#E0462E] text-white",
    glyph: "PG",
    title: "Proof-Of-Grudge",
    badge: "FEATURED BUILD · 2026",
    subtitle: "Adversarial MPC Dead-Man's Switch",
    description: STEVBEQ_PROJECTS[0].description,
    bullets: STEVBEQ_PROJECTS[0].highlights,
    tags: STEVBEQ_PROJECTS[0].stack,
    githubUrl: STEVBEQ_PROJECTS[0].githubUrl,
    liveUrl: STEVBEQ_PROJECTS[0].liveUrl,
    previewType: STEVBEQ_PROJECTS[0].previewType,
    previewImages: STEVBEQ_PROJECTS[0].previewImages,
    stageGradient: STEVBEQ_PROJECTS[0].stageGradient,
    accentColor: STEVBEQ_PROJECTS[0].accentColor,
  },
  {
    id: "kwaktodo",
    shortTitle: "KwakTodo",
    shortSub: "Flutter · Dart",
    badgeBg: "bg-emerald-600 text-white",
    glyph: "KT",
    title: "KwakTodo",
    badge: "MOBILE APP · 2025",
    subtitle: "Cross-Platform Mobile Task Engine",
    description: STEVBEQ_PROJECTS[1].description,
    bullets: STEVBEQ_PROJECTS[1].highlights,
    tags: STEVBEQ_PROJECTS[1].stack,
    githubUrl: STEVBEQ_PROJECTS[1].githubUrl,
    previewType: STEVBEQ_PROJECTS[1].previewType,
    previewImages: STEVBEQ_PROJECTS[1].previewImages,
    stageGradient: STEVBEQ_PROJECTS[1].stageGradient,
    accentColor: STEVBEQ_PROJECTS[1].accentColor,
  },
  {
    id: "indo-techno-medic",
    shortTitle: "Indo Techno",
    shortSub: "Laravel · SQL",
    badgeBg: "bg-[#1673F5] text-white",
    glyph: "IT",
    title: "PT. Indo Techno Medic",
    badge: "ENTERPRISE CASE STUDY",
    subtitle: "Fullstack Programmer — 4 Months",
    description: STEVBEQ_PROJECTS[2].description,
    bullets: STEVBEQ_PROJECTS[2].highlights,
    tags: STEVBEQ_PROJECTS[2].stack,
    previewType: STEVBEQ_PROJECTS[2].previewType,
    previewImages: STEVBEQ_PROJECTS[2].previewImages,
    stageGradient: STEVBEQ_PROJECTS[2].stageGradient,
    accentColor: STEVBEQ_PROJECTS[2].accentColor,
  },
  {
    id: "stevbeq-lab",
    shortTitle: "StevBeq Lab",
    shortSub: "Vue · Tooling",
    badgeBg: "bg-violet-600 text-white",
    glyph: "SB",
    title: "StevBeq Lab & Tooling",
    badge: "OPEN SOURCE · 2025–2026",
    subtitle: "Schedule Flow KRS & Developer Tools",
    description: STEVBEQ_PROJECTS[3].description,
    bullets: STEVBEQ_PROJECTS[3].highlights,
    tags: STEVBEQ_PROJECTS[3].stack,
    githubUrl: STEVBEQ_PROJECTS[3].githubUrl,
    previewType: STEVBEQ_PROJECTS[3].previewType,
    previewImages: STEVBEQ_PROJECTS[3].previewImages,
    stageGradient: STEVBEQ_PROJECTS[3].stageGradient,
    accentColor: STEVBEQ_PROJECTS[3].accentColor,
  },
  {
    id: "next-react",
    shortTitle: "Next.js & React",
    shortSub: "Frontend Core",
    logoId: "nextjs",
    title: "Next.js, React & TypeScript",
    badge: "CORE FRONTEND",
    subtitle: "Type-Safe Modern Web Engineering",
    description:
      "Production web applications built with Next.js App Router, React, TypeScript, Tailwind CSS, and smooth 60fps interactive motion.",
    tags: ["Next.js", "React", "TypeScript", "Tailwind CSS", "Vercel"],
  },
  {
    id: "flutter-dart",
    shortTitle: "Flutter & Dart",
    shortSub: "Mobile Apps",
    logoId: "flutter",
    title: "Flutter & Dart Mobile Development",
    badge: "MOBILE ENGINEERING",
    subtitle: "Cross-Platform Native-Feel Apps",
    description:
      "Building responsive Android & iOS applications with Flutter, clean reactive state management, Firebase integration, and REST APIs.",
    tags: ["Flutter", "Dart", "Firebase", "REST APIs"],
    githubUrl: "https://github.com/StevBeq/KwakTodo",
  },
  {
    id: "laravel-php",
    shortTitle: "Laravel & PHP",
    shortSub: "Backend API",
    logoId: "laravel",
    title: "Laravel, PHP & Python",
    badge: "BACKEND ARCHITECTURE",
    subtitle: "Structured Server & API Systems",
    description:
      "Developing maintainable MVC applications, role-based operational dashboards, and clean RESTful backend APIs.",
    tags: ["Laravel", "PHP", "Python", "REST APIs"],
  },
  {
    id: "postgresql",
    shortTitle: "PostgreSQL",
    shortSub: "Relational DB",
    logoId: "postgresql",
    title: "PostgreSQL & MySQL",
    badge: "DATA ARCHITECTURE",
    subtitle: "Schema Modeling & Optimization",
    description:
      "Designing normalized relational database schemas, indexing strategies, and reliable transactional workflows.",
    tags: ["PostgreSQL", "MySQL", "Supabase"],
  },
  {
    id: "supabase",
    shortTitle: "Supabase",
    shortSub: "Cloud & Auth",
    logoId: "supabase",
    title: "Supabase, Firebase & Vercel",
    badge: "CLOUD & DEPLOYMENT",
    subtitle: "Realtime Data, Auth & Hosting",
    description:
      "Cloud infrastructure with Supabase Postgres, Firebase authentication/realtime services, Git workflows, and automated Vercel deployments.",
    tags: ["Supabase", "Firebase", "Vercel", "Git"],
  },
];

const CAPABILITY_PAGES = [
  [
    { title: "Fullstack Web", detail: "Next.js · React · TS", logoId: "nextjs" },
    { title: "Mobile Apps", detail: "Flutter · Dart", logoId: "flutter" },
    { title: "Backend & APIs", detail: "Laravel · PHP · Python", logoId: "laravel" },
    { title: "SQL & Cloud", detail: "PostgreSQL · Supabase", logoId: "postgresql" },
  ],
  [
    { title: "UI Engineering", detail: "Tailwind · Vue · Vite", logoId: "tailwind" },
    { title: "Relational DB", detail: "MySQL · Schema Design", logoId: "mysql" },
    { title: "Cloud Auth", detail: "Firebase · Realtime", logoId: "firebase" },
    { title: "Workflow & VCS", detail: "Git · GitHub · Vercel", logoId: "git" },
  ],
];

export function Layer2Dashboard() {
  const { returnToLayer1 } = usePortfolioLayer();
  const [activeTab, setActiveTab] = useState<DashboardTab>("overview");
  const [stackFilter, setStackFilter] = useState<StackFilter>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [capabilityPage, setCapabilityPage] = useState(0);
  const [selectedItem, setSelectedItem] = useState<InspectorItem | null>(null);
  const [copiedEmail, setCopiedEmail] = useState(false);

  const normalizedQuery = searchQuery.trim().toLowerCase();

  const filteredGrid = useMemo(() => {
    if (!normalizedQuery) return OVERVIEW_GRID_9;
    return OVERVIEW_GRID_9.filter(
      (item) =>
        item.shortTitle.toLowerCase().includes(normalizedQuery) ||
        item.shortSub.toLowerCase().includes(normalizedQuery) ||
        item.title.toLowerCase().includes(normalizedQuery) ||
        item.description.toLowerCase().includes(normalizedQuery) ||
        item.tags.some((t) => t.toLowerCase().includes(normalizedQuery))
    );
  }, [normalizedQuery]);

  const filteredProjects = useMemo(() => {
    if (!normalizedQuery) return STEVBEQ_PROJECTS;
    return STEVBEQ_PROJECTS.filter(
      (p) =>
        p.title.toLowerCase().includes(normalizedQuery) ||
        p.subtitle.toLowerCase().includes(normalizedQuery) ||
        p.description.toLowerCase().includes(normalizedQuery) ||
        p.stack.some((s) => s.toLowerCase().includes(normalizedQuery))
    );
  }, [normalizedQuery]);

  const filteredStack = useMemo(() => {
    return RICH_TECH_STACK.filter((item) => {
      const matchesGroup = stackFilter === "all" || item.group === stackFilter;
      const matchesQuery =
        !normalizedQuery ||
        item.name.toLowerCase().includes(normalizedQuery) ||
        item.category.toLowerCase().includes(normalizedQuery) ||
        item.role.toLowerCase().includes(normalizedQuery);
      return matchesGroup && matchesQuery;
    });
  }, [stackFilter, normalizedQuery]);

  const openProjectInspector = (project: ProjectItem) => {
    setSelectedItem({
      title: project.title,
      badge: `${project.index} // ${project.year}`,
      subtitle: project.subtitle,
      description: project.description,
      bullets: project.highlights,
      tags: project.stack,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
      previewType: project.previewType,
      previewImages: project.previewImages,
      stageGradient: project.stageGradient,
      accentColor: project.accentColor,
    });
  };

  const openTechInspector = (tech: StackCardItem) => {
    setSelectedItem({
      title: tech.name,
      badge: `${tech.category.toUpperCase()} · PRODUCTION STACK`,
      subtitle: tech.role,
      description: tech.description,
      bullets: tech.usedIn.map((u) => `Applied in ${u}`),
      tags: [tech.category, tech.role, ...tech.usedIn],
      logoId: tech.id,
      accentColor: tech.accentHex,
    });
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(STEVBEQ_PROFILE.contact.email);
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 1600);
    } catch {
      // Clipboard fallback ignored safely
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-[#0F6BFF] via-[#0A5CEB] to-[#084AC4] p-2 text-[#12151B] sm:p-2.5 lg:h-screen lg:overflow-hidden lg:p-3">
      {/* Strictly 1-Viewport Locked App Shell on Desktop (ZERO vertical page scroll, ZERO clipped text!) */}
      <div className="mx-auto flex min-h-[calc(100vh-1rem)] w-full max-w-[1480px] flex-col overflow-hidden rounded-[22px] bg-[#F2F4F8] shadow-[0_24px_75px_rgba(6,28,86,0.45)] lg:h-full lg:min-h-0 lg:flex-row">
        {/* ================= ZONE A: 3-SEGMENT LEFT RAIL (4 UNIFIED BLUE TABS / DIRECT CONTACT WHITE STRIP / GOLD LAYER 1) ================= */}
        <aside className="relative z-40 flex shrink-0 flex-row items-center justify-between bg-[#1673F5] text-white lg:w-[86px] lg:flex-col lg:items-stretch">
          {/* Top Brand + ALL 4 Primary Tabs Unified Together! */}
          <div className="flex flex-row items-center gap-1.5 px-3 py-2 lg:flex-1 lg:flex-col lg:gap-0 lg:px-0 lg:py-3.5">
            <button
              type="button"
              onClick={() => setActiveTab("overview")}
              className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5 shadow-sm transition-transform duration-150 hover:scale-105 active:scale-95 cursor-pointer lg:mb-3 lg:h-10 lg:w-10"
              title="StevBeq Overview"
            >
              <img
                src="/assets/logo/LogoLight.webp"
                alt="StevBeq SB Monogram"
                className="h-full w-full object-contain"
              />
            </button>

            <nav className="flex flex-row items-center gap-1 lg:w-full lg:flex-col lg:gap-0">
              {[
                { id: "overview" as const, label: "Overview", icon: Home },
                { id: "projects" as const, label: "Projects", icon: FolderGit2 },
                { id: "experience" as const, label: "History", icon: Briefcase },
                { id: "stack" as const, label: "Stack", icon: Code2 },
              ].map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setActiveTab(item.id)}
                    className={`group flex flex-col items-center justify-center gap-1 rounded-xl px-2 py-1.5 text-[10px] font-semibold transition-all duration-150 active:scale-95 cursor-pointer lg:w-full lg:rounded-none lg:border-b lg:border-white/10 lg:px-1.5 lg:py-2.5 ${
                      isActive
                        ? "bg-white/15 text-white lg:bg-white/12"
                        : "text-blue-100/85 hover:bg-white/10 hover:text-white"
                    }`}
                  >
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full border transition-all duration-150 ${
                        isActive
                          ? "border-white bg-white text-[#1673F5] shadow-sm"
                          : "border-white/45 text-white group-hover:border-white"
                      }`}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>
                    <span className="hidden sm:inline">{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Middle Crisp White Segment: 3 Direct Expandable Contact Buttons (Email, WhatsApp, GitHub — NO Popup!) */}
          <div className="hidden flex-col items-center justify-center gap-2.5 bg-white py-3 text-[#1673F5] lg:flex">
            {/* Direct Email Expand Pill */}
            <a
              href={`mailto:${STEVBEQ_PROFILE.contact.email}`}
              className="group relative flex h-8 w-8 items-center justify-center rounded-full border border-[#1673F5]/35 bg-white text-[#1673F5] transition-all duration-150 hover:border-[#1673F5] hover:bg-[#1673F5] hover:text-white active:scale-90"
              aria-label="Send Email to Steven Arnaldo"
            >
              <Mail className="h-3.5 w-3.5" />
              <span className="pointer-events-none absolute left-11 z-50 flex items-center gap-1.5 rounded-full bg-[#0F172A] px-3 py-1.5 font-mono text-[10px] font-bold whitespace-nowrap text-white opacity-0 shadow-lg transition-all duration-150 group-hover:translate-x-1 group-hover:opacity-100">
                Email · {STEVBEQ_PROFILE.contact.email}
              </span>
            </a>

            {/* Direct WhatsApp Expand Pill */}
            <a
              href={WHATSAPP_URL}
              target="_blank"
              rel="noreferrer"
              className="group relative flex h-8 w-8 items-center justify-center rounded-full border border-emerald-500/40 bg-white text-emerald-600 transition-all duration-150 hover:border-emerald-600 hover:bg-emerald-600 hover:text-white active:scale-90"
              aria-label="Chat via WhatsApp"
            >
              <MessageCircle className="h-3.5 w-3.5" />
              <span className="pointer-events-none absolute left-11 z-50 flex items-center gap-1.5 rounded-full bg-emerald-600 px-3 py-1.5 font-mono text-[10px] font-bold whitespace-nowrap text-white opacity-0 shadow-lg transition-all duration-150 group-hover:translate-x-1 group-hover:opacity-100">
                WhatsApp · {STEVBEQ_PROFILE.contact.phone}
              </span>
            </a>

            {/* Direct GitHub Expand Pill */}
            <a
              href={STEVBEQ_PROFILE.contact.github}
              target="_blank"
              rel="noreferrer"
              className="group relative flex h-8 w-8 items-center justify-center rounded-full border border-slate-300 bg-white text-slate-800 transition-all duration-150 hover:border-[#0F172A] hover:bg-[#0F172A] hover:text-white active:scale-90"
              aria-label="Open GitHub Profile"
            >
              <GithubIcon className="h-3.5 w-3.5" />
              <span className="pointer-events-none absolute left-11 z-50 flex items-center gap-1.5 rounded-full bg-[#0F172A] px-3 py-1.5 font-mono text-[10px] font-bold whitespace-nowrap text-white opacity-0 shadow-lg transition-all duration-150 group-hover:translate-x-1 group-hover:opacity-100">
                GitHub · @{STEVBEQ_PROFILE.handle}
              </span>
            </a>
          </div>

          {/* Bottom Gold Corner Block (Returns cleanly to Layer 1) */}
          <button
            type="button"
            onClick={() => returnToLayer1(false)}
            className="flex shrink-0 items-center justify-center gap-1.5 bg-[#F2C616] px-3 py-2 text-[10px] font-black tracking-wide text-white uppercase transition-all duration-150 hover:bg-[#E0B50E] active:scale-95 cursor-pointer lg:flex-col lg:gap-1 lg:px-1.5 lg:py-2.5"
            title="Return to Layer 1 Scroll Showcase"
          >
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white text-[#E0B50E] shadow-xs lg:h-7 lg:w-7">
              <ArrowLeft className="h-3.5 w-3.5 stroke-[2.6]" />
            </span>
            <span className="leading-tight text-[#12151B] lg:text-white lg:drop-shadow-[0_1px_1px_rgba(0,0,0,0.2)]">
              LAYER 1
            </span>
          </button>
        </aside>

        {/* ================= MAIN WORKSPACE (TIGHT PROPORTIONS FOR 100VH ZERO-SCROLL) ================= */}
        <div className="relative flex min-h-0 min-w-0 flex-1 flex-col">
          {/* Top Vivid Blue Hero Banner */}
          <div className="relative flex h-[138px] w-full shrink-0 flex-col justify-between overflow-hidden bg-gradient-to-r from-[#1A74F6] via-[#1361E8] to-[#36AEF8] px-4 py-3 text-white lg:h-[144px] lg:px-6 xl:h-[160px]">
            <div
              aria-hidden
              className="pointer-events-none absolute -top-20 left-1/3 h-56 w-56 rounded-full bg-[#60A5FA]/30 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute -top-12 right-10 h-44 w-44 rounded-full bg-[#FDE047]/25 blur-3xl"
            />
            <div
              aria-hidden
              className="pointer-events-none absolute inset-0 opacity-[0.14]"
              style={{
                backgroundImage:
                  "radial-gradient(circle at 2px 2px, rgba(255,255,255,0.6) 1px, transparent 0)",
                backgroundSize: "24px 24px",
              }}
            />

            {/* Top-Left Glass Pill Search Bar */}
            <div className="relative z-20 flex items-center justify-between gap-3">
              <div className="flex w-full max-w-[260px] items-center justify-between rounded-full border border-white/30 bg-white/20 py-0.5 pr-0.5 pl-3.5 backdrop-blur-md transition-colors duration-150 focus-within:bg-white/30 sm:max-w-[290px]">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search projects, stack..."
                  className="w-full bg-transparent text-xs font-medium text-white placeholder:text-white/80 focus:outline-none"
                />
                {searchQuery ? (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[#1673F5] shadow-sm active:scale-90 cursor-pointer"
                    aria-label="Clear search"
                  >
                    <X className="h-3 w-3" />
                  </button>
                ) : (
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-white text-[#1673F5] shadow-sm">
                    <Search className="h-3 w-3" />
                  </span>
                )}
              </div>

              <span className="hidden items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-3 py-1 text-[10.5px] font-semibold text-white backdrop-blur-md sm:inline-flex">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-300" />
                Open to Opportunities
              </span>
            </div>

            {/* Bottom Banner Metadata Strip + Direct Expandable Social/Contact Pills */}
            <div className="relative z-20 hidden items-center justify-between gap-3 lg:flex lg:pl-[34.5%] xl:pl-[26%]">
              <div className="flex flex-wrap items-center gap-4 text-[11px] xl:gap-5 xl:text-xs">
                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-white/10 xl:h-7 xl:w-7">
                    <MapPin className="h-3 w-3 xl:h-3.5 xl:w-3.5" />
                  </span>
                  <div className="leading-tight">
                    <p className="font-bold text-white">{STEVBEQ_PROFILE.location.city}</p>
                    <p className="text-[9.5px] text-blue-100">{STEVBEQ_PROFILE.location.timezone}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="flex h-6 w-6 items-center justify-center rounded-full border border-white/40 bg-white/10 xl:h-7 xl:w-7">
                    <GraduationCap className="h-3 w-3 xl:h-3.5 xl:w-3.5" />
                  </span>
                  <div className="leading-tight">
                    <p className="font-bold text-white">UKDW (S1) &amp; UTY (D3)</p>
                    <p className="text-[9.5px] text-blue-100">Information Systems</p>
                  </div>
                </div>

                <div className="hidden items-center gap-2 xl:flex">
                  <span className="flex h-7 w-7 items-center justify-center rounded-full border border-white/40 bg-white/10">
                    <Briefcase className="h-3.5 w-3.5" />
                  </span>
                  <div className="leading-tight">
                    <p className="font-bold text-white">PT. Indo Techno Medic</p>
                    <p className="text-[9.5px] text-blue-100">Fullstack Programmer</p>
                  </div>
                </div>
              </div>

              {/* Smooth Expanding Direct Contact Pills (GitHub / Email / WhatsApp — Zero Popup!) */}
              <div className="flex items-center gap-1.5">
                <a
                  href={STEVBEQ_PROFILE.contact.github}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-7 max-w-[28px] items-center overflow-hidden rounded-full border border-white/40 bg-white/10 transition-all duration-200 hover:max-w-[100px] hover:bg-white hover:text-[#0F172A] xl:h-8 xl:max-w-[32px]"
                  title="GitHub @StevBeq"
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center xl:h-8 xl:w-8">
                    <GithubIcon className="h-3.5 w-3.5" />
                  </span>
                  <span className="pr-2.5 text-[10.5px] font-bold whitespace-nowrap">GitHub</span>
                </a>

                <a
                  href={`mailto:${STEVBEQ_PROFILE.contact.email}`}
                  className="group flex h-7 max-w-[28px] items-center overflow-hidden rounded-full border border-white/40 bg-white/10 transition-all duration-200 hover:max-w-[92px] hover:bg-white hover:text-[#1673F5] xl:h-8 xl:max-w-[32px]"
                  title={STEVBEQ_PROFILE.contact.email}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center xl:h-8 xl:w-8">
                    <Mail className="h-3.5 w-3.5" />
                  </span>
                  <span className="pr-2.5 text-[10.5px] font-bold whitespace-nowrap">Email</span>
                </a>

                <a
                  href={WHATSAPP_URL}
                  target="_blank"
                  rel="noreferrer"
                  className="group flex h-7 max-w-[28px] items-center overflow-hidden rounded-full border border-white/40 bg-white/10 transition-all duration-200 hover:max-w-[114px] hover:bg-emerald-500 hover:border-emerald-400 hover:text-white xl:h-8 xl:max-w-[32px]"
                  title={`WhatsApp ${STEVBEQ_PROFILE.contact.phone}`}
                >
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center xl:h-8 xl:w-8">
                    <MessageCircle className="h-3.5 w-3.5" />
                  </span>
                  <span className="pr-2.5 text-[10.5px] font-bold whitespace-nowrap">WhatsApp</span>
                </a>
              </div>
            </div>
          </div>

          {/* ================= LOCKED BODY SPLIT ================= */}
          <div className="grid min-h-0 flex-1 grid-cols-1 gap-4 px-4 pb-3.5 lg:grid-cols-12 lg:px-6 lg:pb-4">
            {/* ZONE B: Floating Overlapping Profile Pillar */}
            <div className="relative z-30 -mt-10 flex min-h-0 flex-col lg:col-span-4 lg:-mt-[50px] lg:h-[calc(100%+50px)] xl:col-span-3 xl:-mt-[58px] xl:h-[calc(100%+58px)]">
              <div className="flex h-full min-h-0 flex-col rounded-[20px] bg-white shadow-[0_16px_40px_rgba(15,35,85,0.14)]">
                {/* Upper Crisp White Profile Block */}
                <div className="flex shrink-0 flex-col items-center px-4 pt-0 pb-3 text-center">
                  <div className="relative -mt-9 xl:-mt-10">
                    <div className="h-[72px] w-[72px] overflow-hidden rounded-full border-[3.5px] border-white bg-gradient-to-b from-blue-100 to-slate-100 shadow-md xl:h-[82px] xl:w-[82px]">
                      <img
                        src="/assets/me/Foto-Semi-Formal.webp"
                        alt={STEVBEQ_PROFILE.fullName}
                        className="h-full w-full object-cover object-top"
                      />
                    </div>
                    <span
                      className="absolute right-0.5 bottom-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500"
                      title="Available for Opportunities"
                    />
                  </div>

                  <h1 className="mt-1.5 text-[17px] font-black tracking-tight text-[#2B3340] xl:text-[18px]">
                    Steven Arnaldo
                  </h1>
                  <p className="text-[11px] font-medium leading-tight text-slate-500">
                    {STEVBEQ_PROFILE.role}
                  </p>
                  <p className="font-mono text-[10px] font-bold text-[#1673F5]">
                    @{STEVBEQ_PROFILE.handle}
                  </p>

                  {/* 2-Column Blue Stats */}
                  <div className="mt-2 grid w-full grid-cols-2 divide-x divide-slate-200 border-y border-slate-100 py-1.5">
                    <div>
                      <p className="text-base font-black leading-none text-[#1673F5] xl:text-lg">
                        {STEVBEQ_PROJECTS.length}
                      </p>
                      <p className="mt-0.5 text-[10px] font-medium text-slate-400">
                        Featured Builds
                      </p>
                    </div>
                    <div>
                      <p className="text-base font-black leading-none text-[#1673F5] xl:text-lg">
                        {RICH_TECH_STACK.length}
                      </p>
                      <p className="mt-0.5 text-[10px] font-medium text-slate-400">Core Stack</p>
                    </div>
                  </div>

                  {/* Direct 3-Button Connect Bar (GitHub / WhatsApp / Email — Instant Direct Links, Zero Popup!) */}
                  <div className="mt-2.5 grid w-full grid-cols-3 gap-1.5">
                    <a
                      href={STEVBEQ_PROFILE.contact.github}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1 rounded-full bg-[#1673F5] px-2 py-1.5 text-[10.5px] font-bold text-white shadow-xs transition-all duration-150 hover:bg-[#0F5AD0] active:scale-95"
                    >
                      <GithubIcon className="h-3 w-3 shrink-0" />
                      <span>GitHub</span>
                    </a>
                    <a
                      href={WHATSAPP_URL}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center justify-center gap-1 rounded-full bg-emerald-600 px-2 py-1.5 text-[10.5px] font-bold text-white shadow-xs transition-all duration-150 hover:bg-emerald-700 active:scale-95"
                    >
                      <MessageCircle className="h-3 w-3 shrink-0" />
                      <span>WA</span>
                    </a>
                    <a
                      href={`mailto:${STEVBEQ_PROFILE.contact.email}`}
                      className="inline-flex items-center justify-center gap-1 rounded-full border border-slate-300 bg-white px-2 py-1.5 text-[10.5px] font-bold text-slate-700 transition-all duration-150 hover:border-[#1673F5] hover:text-[#1673F5] active:scale-95"
                    >
                      <Mail className="h-3 w-3 shrink-0" />
                      <span>Email</span>
                    </a>
                  </div>
                </div>

                {/* Lower Sky-Blue Gradient Track */}
                <div className="flex min-h-0 flex-1 flex-col justify-between overflow-hidden rounded-b-[20px] bg-gradient-to-b from-[#A3C7F8] via-[#89B7F5] to-[#659FF0]">
                  <div className="flex min-h-0 flex-1 flex-col justify-evenly px-3 py-1.5">
                    <div>
                      <p className="mb-1 text-center text-[10px] font-extrabold tracking-wide text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">
                        Experience &amp; Current Track
                      </p>
                      <div className="space-y-1.5">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedItem({
                              title: STEVBEQ_EXPERIENCE[0].company,
                              badge: "WORK EXPERIENCE · 4 MONTHS",
                              subtitle: STEVBEQ_EXPERIENCE[0].role,
                              description: STEVBEQ_EXPERIENCE[0].summary,
                              bullets: [
                                "Built end-to-end backend & frontend modules in Laravel & PHP",
                                "Designed normalized relational SQL schemas (MySQL & PostgreSQL)",
                                "Delivered production-ready operational dashboards",
                              ],
                              tags: ["PHP", "Laravel", "JavaScript", "PostgreSQL", "MySQL", "Git"],
                              glyph: "IT",
                              accentColor: "#1673F5",
                            })
                          }
                          className="flex w-full items-center justify-between overflow-hidden rounded-xl bg-white px-2.5 py-1.5 text-left shadow-xs transition-all duration-150 hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98] cursor-pointer"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#1673F5] font-mono text-[9.5px] font-black text-white">
                              IT
                            </span>
                            <div className="min-w-0 leading-tight">
                              <p className="truncate text-[11px] font-bold text-[#1E293B]">
                                PT. Indo Techno Medic
                              </p>
                              <p className="truncate text-[9.5px] text-slate-400">
                                Fullstack Programmer · 4 Mos
                              </p>
                            </div>
                          </div>
                          <Star className="h-3.5 w-3.5 shrink-0 fill-[#F2C616] text-[#F2C616]" />
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedItem({
                              title: STEVBEQ_EDUCATION[0].institution,
                              badge: "S1 · ENTRY SEPT 2026",
                              subtitle: STEVBEQ_EDUCATION[0].degree,
                              description:
                                "Continuing Bachelor (S1) degree in Information Systems at Universitas Kristen Duta Wacana, Yogyakarta.",
                              bullets: [
                                "Focus on Software Engineering & Enterprise Systems",
                                "Based in Yogyakarta, Indonesia",
                              ],
                              tags: ["S1 Information Systems", "UKDW Yogyakarta"],
                              glyph: "S1",
                              accentColor: "#F59E0B",
                            })
                          }
                          className="flex w-full items-center justify-between overflow-hidden rounded-xl bg-white px-2.5 py-1.5 text-left shadow-xs transition-all duration-150 hover:-translate-y-[1px] hover:shadow-sm active:scale-[0.98] cursor-pointer"
                        >
                          <div className="flex min-w-0 items-center gap-2">
                            <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500 font-mono text-[9.5px] font-black text-white">
                              S1
                            </span>
                            <div className="min-w-0 leading-tight">
                              <p className="truncate text-[11px] font-bold text-[#1E293B]">
                                UKDW Yogyakarta
                              </p>
                              <p className="truncate text-[9.5px] text-slate-400">
                                S1 Information Systems · Sept 2026
                              </p>
                            </div>
                          </div>
                          <Star className="h-3.5 w-3.5 shrink-0 fill-[#F2C616] text-[#F2C616]" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <p className="mb-1 text-center text-[10px] font-extrabold tracking-wide text-white drop-shadow-[0_1px_1px_rgba(0,0,0,0.1)]">
                        Previous &amp; Leadership
                      </p>
                      <div className="space-y-1">
                        <button
                          type="button"
                          onClick={() =>
                            setSelectedItem({
                              title: STEVBEQ_EDUCATION[1].institution,
                              badge: "D3 · GRADUATING AUG 2026",
                              subtitle: STEVBEQ_EDUCATION[1].degree,
                              description:
                                "Completing Associate Degree (D3) in Information Systems with active student leadership at UTY Yogyakarta.",
                              tags: ["D3 Information Systems", "UTY Yogyakarta"],
                              glyph: "D3",
                              accentColor: "#4F46E5",
                            })
                          }
                          className="flex w-full items-center gap-2 overflow-hidden rounded-xl bg-white/95 px-2.5 py-1 text-left shadow-xs transition-all duration-150 hover:bg-white active:scale-[0.98] cursor-pointer"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-indigo-600 font-mono text-[9px] font-black text-white">
                            D3
                          </span>
                          <div className="min-w-0 leading-tight">
                            <p className="truncate text-[10.5px] font-bold text-[#1E293B]">
                              UTY Yogyakarta
                            </p>
                            <p className="truncate text-[9px] text-slate-400">
                              D3 Information Systems · Aug 2026
                            </p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedItem({
                              title: STEVBEQ_EXPERIENCE[1].company,
                              badge: "LEADERSHIP · 2024–2025",
                              subtitle: STEVBEQ_EXPERIENCE[1].role,
                              description: STEVBEQ_EXPERIENCE[1].summary,
                              tags: ["Leadership", "Human Resources", "UTY"],
                              glyph: "OR",
                              accentColor: "#E0462E",
                            })
                          }
                          className="flex w-full items-center gap-2 overflow-hidden rounded-xl bg-white/95 px-2.5 py-1 text-left shadow-xs transition-all duration-150 hover:bg-white active:scale-[0.98] cursor-pointer"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-[#E0462E] font-mono text-[9px] font-black text-white">
                            OR
                          </span>
                          <div className="min-w-0 leading-tight">
                            <p className="truncate text-[10.5px] font-bold text-[#1E293B]">
                              UKM Olahraga UTY
                            </p>
                            <p className="truncate text-[9px] text-slate-400">
                              Head of HR Division · 2024–2025
                            </p>
                          </div>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            setSelectedItem({
                              title: STEVBEQ_EXPERIENCE[2].company,
                              badge: "ORGANIZATION · 2024–2025",
                              subtitle: STEVBEQ_EXPERIENCE[2].role,
                              description: STEVBEQ_EXPERIENCE[2].summary,
                              tags: ["Economic Resources", "HMSI", "UTY"],
                              glyph: "HM",
                              accentColor: "#059669",
                            })
                          }
                          className="flex w-full items-center gap-2 overflow-hidden rounded-xl bg-white/95 px-2.5 py-1 text-left shadow-xs transition-all duration-150 hover:bg-white active:scale-[0.98] cursor-pointer"
                        >
                          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-600 font-mono text-[9px] font-black text-white">
                            HM
                          </span>
                          <div className="min-w-0 leading-tight">
                            <p className="truncate text-[10.5px] font-bold text-[#1E293B]">
                              HMSI UTY
                            </p>
                            <p className="truncate text-[9px] text-slate-400">
                              Economic Resource Div · 2024–2025
                            </p>
                          </div>
                        </button>
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => setActiveTab("experience")}
                    className="w-full shrink-0 bg-gradient-to-r from-[#1E88B8] to-[#1D7F9C] py-2 text-center text-[11px] font-bold text-white transition-all duration-150 hover:brightness-110 active:brightness-95 cursor-pointer"
                  >
                    View Full History
                  </button>
                </div>
              </div>
            </div>

            {/* ================= ZONE C: ZERO-DELAY FLUID RIGHT WORKSPACE ================= */}
            <div className="flex min-h-0 min-w-0 flex-col pt-3 lg:col-span-8 xl:col-span-9">
              {/* TAB 1: OVERVIEW (Faithful Reference Bento — Clean Gold About Me WITHOUT Duplicate Face!) */}
              {activeTab === "overview" && (
                <div
                  key="tab-overview"
                  className="l2-tab-enter flex min-h-0 flex-1 flex-col gap-3.5"
                >
                  <div className="grid min-h-0 flex-1 grid-cols-1 gap-3.5 xl:grid-cols-12">
                    {/* Clean Signature Gold About Me Card (NO duplicate face — subtle SB monogram watermark + full-width editorial clarity!) */}
                    <div className="relative flex flex-col justify-between overflow-hidden rounded-[18px] bg-gradient-to-br from-[#EDD01E] via-[#E7C616] to-[#DFB90E] p-4 text-[#222014] shadow-sm xl:col-span-5 xl:p-5">
                      {/* Subtle Branded Geometric SB Monogram Watermark */}
                      <svg
                        viewBox="0 0 180 180"
                        fill="none"
                        aria-hidden
                        className="pointer-events-none absolute -right-5 -bottom-5 h-36 w-36 opacity-[0.11]"
                      >
                        <rect
                          x="22"
                          y="72"
                          width="58"
                          height="18"
                          rx="9"
                          transform="rotate(-34 22 72)"
                          fill="#0B0D12"
                        />
                        <rect
                          x="22"
                          y="112"
                          width="58"
                          height="18"
                          rx="9"
                          transform="rotate(-34 22 112)"
                          fill="#0B0D12"
                        />
                        <path
                          d="M90 42H124C138.36 42 150 53.64 150 68C150 76.2 146.2 83.5 140.27 88.27C146.2 93.04 150 100.35 150 108.55C150 122.9 138.36 134.55 124 134.55H90"
                          stroke="#0B0D12"
                          strokeWidth="18"
                          strokeLinecap="round"
                        />
                        <circle cx="96" cy="88" r="14" fill="#0B0D12" />
                      </svg>

                      <div className="relative z-10">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1673F5] text-white shadow-xs">
                              <User className="h-3.5 w-3.5" />
                            </span>
                            <h2 className="text-sm font-extrabold text-[#1E222B]">About Me</h2>
                          </div>
                          <span className="rounded-full bg-[#1E222B]/10 px-2.5 py-0.5 font-mono text-[9.5px] font-bold text-[#1E222B]">
                            YOGYAKARTA · ID
                          </span>
                        </div>

                        <p className="mt-3 text-[12.5px] font-medium leading-relaxed text-[#242113] xl:text-[13px]">
                          I&apos;m <strong>Steven Arnaldo Setiawan</strong>, a{" "}
                          <strong>Fullstack Web &amp; Mobile Developer</strong> focused on building
                          clean, reliable software from relational database architecture to fluid
                          user interfaces.
                        </p>

                        <p className="mt-2 text-[12px] leading-relaxed text-[#2D2A19]/90">
                          Experienced as a Fullstack Programmer at{" "}
                          <strong>PT. Indo Techno Medic</strong>, shipping production platforms with{" "}
                          <strong>Next.js, React, Laravel, Flutter</strong> &amp;{" "}
                          <strong>PostgreSQL</strong>.
                        </p>

                        <div className="mt-3 flex flex-wrap gap-1.5">
                          {["Fullstack Web", "Flutter Mobile", "SQL & REST APIs"].map((chip) => (
                            <span
                              key={chip}
                              className="rounded-md bg-[#1E222B]/10 px-2 py-0.5 font-mono text-[10px] font-bold text-[#1E222B]"
                            >
                              {chip}
                            </span>
                          ))}
                        </div>
                      </div>

                      <div className="relative z-10 mt-3 flex flex-wrap items-center gap-2">
                        <button
                          type="button"
                          onClick={handleCopyEmail}
                          className="inline-flex items-center gap-1.5 rounded-full bg-[#1E222B] px-3 py-1.5 font-mono text-[10px] font-bold text-[#F4D03F] transition-all duration-150 hover:bg-[#1673F5] hover:text-white active:scale-95 cursor-pointer"
                        >
                          {copiedEmail ? (
                            <>
                              <Check className="h-3 w-3" />
                              Email Copied!
                            </>
                          ) : (
                            <>
                              <Copy className="h-3 w-3" />
                              {STEVBEQ_PROFILE.contact.email}
                            </>
                          )}
                        </button>
                      </div>
                    </div>

                    {/* White 3x3 Projects & Core Stack Grid */}
                    <div className="flex min-h-0 flex-col rounded-[18px] border border-slate-200/80 bg-white p-4 shadow-xs xl:col-span-7 xl:p-5">
                      <div className="mb-2.5 flex shrink-0 items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1673F5] text-white shadow-xs">
                            <FolderGit2 className="h-3.5 w-3.5" />
                          </span>
                          <h2 className="text-sm font-extrabold text-[#1E293B]">
                            Projects &amp; Core Stack
                          </h2>
                        </div>
                        <button
                          type="button"
                          onClick={() => setActiveTab("projects")}
                          className="font-mono text-[10.5px] font-bold text-[#1673F5] transition hover:underline active:scale-95 cursor-pointer"
                        >
                          View All →
                        </button>
                      </div>

                      {filteredGrid.length === 0 ? (
                        <div className="flex flex-1 items-center justify-center rounded-xl border border-dashed border-slate-200 text-xs text-slate-400">
                          No matching items for &ldquo;{searchQuery}&rdquo;
                        </div>
                      ) : (
                        <div className="grid flex-1 grid-cols-1 content-evenly gap-x-2.5 gap-y-1.5 sm:grid-cols-3">
                          {filteredGrid.map((item) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setSelectedItem(item)}
                              className="group flex items-center gap-2.5 rounded-xl p-1.5 text-left transition-all duration-150 hover:-translate-y-[1px] hover:bg-blue-50/80 active:scale-[0.97] cursor-pointer"
                            >
                              {item.logoId ? (
                                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-slate-200/80 bg-[#F8FAFC] p-1.5 shadow-xs transition-transform duration-150 group-hover:scale-105 xl:h-9 xl:w-9">
                                  <TechStackLogo id={item.logoId} className="h-full w-full" />
                                </span>
                              ) : (
                                <span
                                  className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono text-[10.5px] font-black shadow-xs transition-transform duration-150 group-hover:scale-105 xl:h-9 xl:w-9 ${item.badgeBg}`}
                                >
                                  {item.glyph}
                                </span>
                              )}

                              <div className="min-w-0">
                                <p className="truncate text-[11.5px] font-extrabold text-[#1E293B] group-hover:text-[#1673F5]">
                                  {item.shortTitle}
                                </p>
                                <p className="truncate text-[10px] font-medium text-slate-400">
                                  {item.shortSub}
                                </p>
                              </div>
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Bottom Full-Width Core Capabilities Strip */}
                  <div className="shrink-0 rounded-[18px] border border-slate-200/80 bg-white px-4 py-3 shadow-xs xl:px-5 xl:py-3.5">
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#1673F5] text-white shadow-xs xl:h-6 xl:w-6">
                          <Star className="h-3 w-3 fill-white xl:h-3.5 xl:w-3.5" />
                        </span>
                        <h2 className="text-xs font-extrabold text-[#1E293B] xl:text-sm">
                          Core Capabilities
                        </h2>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[10px] font-semibold text-slate-400">
                          {capabilityPage + 1} / {CAPABILITY_PAGES.length}
                        </span>
                        <button
                          type="button"
                          onClick={() =>
                            setCapabilityPage((p) => (p + 1) % CAPABILITY_PAGES.length)
                          }
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-slate-200 text-[#1673F5] transition-all duration-150 hover:border-[#1673F5] hover:bg-[#1673F5] hover:text-white active:scale-90 cursor-pointer xl:h-7 xl:w-7"
                          aria-label="Next capability page"
                        >
                          <ChevronRight className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>

                    <div
                      key={`cap-${capabilityPage}`}
                      className="l2-tab-enter grid grid-cols-2 gap-2.5 lg:grid-cols-4"
                    >
                      {CAPABILITY_PAGES[capabilityPage].map((cap) => (
                        <button
                          key={cap.title}
                          type="button"
                          onClick={() => setActiveTab("stack")}
                          className="flex items-center gap-2.5 rounded-xl border border-slate-100 bg-[#F8FAFC] px-3 py-2 text-left transition-all duration-150 hover:border-blue-200/90 hover:bg-blue-50/40 active:scale-[0.98] cursor-pointer"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-white p-1 shadow-xs ring-1 ring-slate-200/70 xl:h-8 xl:w-8">
                            <TechStackLogo id={cap.logoId} className="h-full w-full" />
                          </span>
                          <div className="min-w-0">
                            <p className="truncate text-[11.5px] font-extrabold text-[#1E293B]">
                              {cap.title}
                            </p>
                            <p className="truncate font-mono text-[9.5px] text-slate-500">
                              {cap.detail}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PROJECTS — CLEAN 2x2 ZERO-OVERLAP LOCKED GRID */}
              {activeTab === "projects" && (
                <div
                  key="tab-projects"
                  className="l2-tab-enter grid min-h-0 flex-1 grid-cols-1 gap-3 md:grid-cols-2 md:grid-rows-2"
                >
                  {filteredProjects.map((proj) => (
                    <article
                      key={proj.id}
                      onClick={() => openProjectInspector(proj)}
                      className="group flex min-h-0 cursor-pointer flex-col overflow-hidden rounded-[18px] border border-slate-200/90 bg-white shadow-xs transition-all duration-150 hover:-translate-y-[2px] hover:border-[#1673F5]/60 hover:shadow-md active:scale-[0.985]"
                    >
                      {/* Clean Proportional Visual Preview Header (40% max 112px so text NEVER collides!) */}
                      <div
                        className={`relative flex h-[40%] max-h-[112px] min-h-[76px] w-full shrink-0 items-center justify-center overflow-hidden bg-gradient-to-br px-4 py-2 ${proj.stageGradient}`}
                      >
                        {proj.previewType === "mobile" ? (
                          <div className="flex h-full items-center justify-center gap-2.5">
                            <img
                              src={proj.previewImages[0]}
                              alt={`${proj.title} screen 1`}
                              className="h-full rounded-lg border border-white/20 object-contain shadow-md"
                            />
                            {proj.previewImages[1] && (
                              <img
                                src={proj.previewImages[1]}
                                alt={`${proj.title} screen 2`}
                                className="h-full rounded-lg border border-white/20 object-contain shadow-md"
                              />
                            )}
                          </div>
                        ) : (
                          <img
                            src={proj.previewImages[0]}
                            alt={proj.title}
                            className="h-full w-auto max-w-full rounded-lg border border-white/15 object-cover object-top shadow-md transition-transform duration-200 group-hover:scale-[1.03]"
                          />
                        )}
                      </div>

                      {/* Strict Overflow-Guarded Metadata Body (Zero Overlapping Text!) */}
                      <div className="flex min-h-0 flex-1 flex-col justify-between overflow-hidden px-3.5 py-2.5 xl:px-4">
                        <div className="min-h-0 overflow-hidden">
                          <div className="flex items-center justify-between gap-2 font-mono text-[9.5px] text-slate-400">
                            <span className="shrink-0 rounded bg-blue-50 px-1.5 py-0.5 font-bold text-[#1673F5]">
                              {proj.index} · {proj.year}
                            </span>
                            <span className="truncate">{proj.category}</span>
                          </div>
                          <h3 className="mt-1 truncate text-[13.5px] font-extrabold leading-tight text-[#1E293B] xl:text-[15px]">
                            {proj.title}
                          </h3>
                          <p className="truncate text-[10.5px] font-semibold leading-tight text-[#1673F5]">
                            {proj.subtitle}
                          </p>
                          <p className="mt-1 truncate text-[11px] text-slate-500">
                            {proj.description}
                          </p>
                        </div>

                        <div className="mt-1.5 flex shrink-0 items-center justify-between gap-2 border-t border-slate-100 pt-1.5">
                          <div className="flex min-w-0 flex-nowrap items-center gap-1 overflow-hidden">
                            {proj.stack.slice(0, 3).map((s) => (
                              <span
                                key={s}
                                className="shrink-0 rounded bg-slate-100 px-1.5 py-0.5 font-mono text-[9.5px] font-semibold text-slate-700"
                              >
                                {s}
                              </span>
                            ))}
                          </div>
                          <span className="inline-flex shrink-0 items-center gap-0.5 font-mono text-[10px] font-bold text-[#1673F5]">
                            Details <ArrowUpRight className="h-3 w-3" />
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}

              {/* TAB 3: EXPERIENCE & EDUCATION */}
              {activeTab === "experience" && (
                <div
                  key="tab-experience"
                  className="l2-tab-enter grid min-h-0 flex-1 grid-cols-1 gap-3.5 xl:grid-cols-12"
                >
                  <div className="flex min-h-0 flex-col rounded-[18px] border border-slate-200/90 bg-white p-4 shadow-xs xl:col-span-7">
                    <h3 className="flex shrink-0 items-center gap-2 text-sm font-extrabold text-[#1E293B]">
                      <Briefcase className="h-4 w-4 text-[#1673F5]" />
                      Work &amp; Organizational Leadership
                    </h3>
                    <div className="mt-2.5 flex min-h-0 flex-1 flex-col justify-between gap-2">
                      {STEVBEQ_EXPERIENCE.map((exp) => (
                        <div
                          key={exp.id}
                          className="flex flex-1 flex-col justify-center overflow-hidden rounded-xl border border-slate-100 bg-[#F8FAFC] px-3.5 py-2 transition-colors duration-150 hover:border-blue-200/70"
                        >
                          <div className="flex flex-wrap items-center justify-between gap-1 font-mono text-[9.5px] font-bold">
                            <span
                              className={
                                exp.type === "work" ? "text-[#1673F5]" : "text-emerald-700"
                              }
                            >
                              {exp.type === "work" ? "INDUSTRY EXPERIENCE" : "LEADERSHIP"}
                            </span>
                            <span className="text-slate-400">{exp.period}</span>
                          </div>
                          <h4 className="mt-0.5 truncate text-[13px] font-extrabold text-[#1E293B]">
                            {exp.company}
                          </h4>
                          <p className="truncate text-[11px] font-semibold text-slate-700">
                            {exp.role}
                          </p>
                          <p className="mt-0.5 line-clamp-2 text-[10.5px] leading-snug text-slate-500">
                            {exp.summary}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex min-h-0 flex-col rounded-[18px] border border-slate-200/90 bg-white p-4 shadow-xs xl:col-span-5">
                    <h3 className="flex shrink-0 items-center gap-2 text-sm font-extrabold text-[#1E293B]">
                      <GraduationCap className="h-4 w-4 text-[#1673F5]" />
                      Academic Background
                    </h3>
                    <div className="mt-2.5 flex min-h-0 flex-1 flex-col justify-between gap-2">
                      {STEVBEQ_EDUCATION.map((edu) => (
                        <div
                          key={edu.id}
                          className="flex flex-1 flex-col justify-center overflow-hidden rounded-xl border border-slate-100 bg-[#F8FAFC] px-3.5 py-2 transition-colors duration-150 hover:border-blue-200/70"
                        >
                          <div className="flex items-center justify-between font-mono text-[9.5px] font-bold">
                            <span className="text-[#E0462E]">{edu.status.toUpperCase()}</span>
                            <span className="text-slate-400">{edu.period}</span>
                          </div>
                          <h4 className="mt-0.5 truncate text-[13px] font-extrabold text-[#1E293B]">
                            {edu.institution}
                          </h4>
                          <p className="mt-0.5 truncate text-[11px] font-medium text-slate-600">
                            {edu.degree}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: BRAND-ACCENTED 4x4 VISUAL TECH STACK BENTO (Interactive Filter + Zero Empty Gaps!) */}
              {activeTab === "stack" && (
                <div
                  key="tab-stack"
                  className="l2-tab-enter flex min-h-0 flex-1 flex-col gap-3"
                >
                  {/* Crisp Interactive Filter Header */}
                  <div className="flex shrink-0 flex-wrap items-center justify-between gap-2 rounded-[16px] border border-slate-200/90 bg-white px-4 py-2.5 shadow-xs">
                    <div className="flex items-center gap-2">
                      <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#1673F5] text-white">
                        <Code2 className="h-3.5 w-3.5" />
                      </span>
                      <h2 className="text-xs font-extrabold text-[#1E293B] sm:text-sm">
                        Engineering Arsenal
                      </h2>
                      <span className="rounded-full bg-slate-100 px-2 py-0.5 font-mono text-[10px] font-bold text-slate-500">
                        {filteredStack.length}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-1">
                      {[
                        { id: "all" as const, label: "All (16)" },
                        { id: "frontend-mobile" as const, label: "Web & Mobile" },
                        { id: "backend-db" as const, label: "Backend & SQL" },
                        { id: "cloud-tools" as const, label: "Cloud & Tools" },
                      ].map((tab) => {
                        const active = stackFilter === tab.id;
                        return (
                          <button
                            key={tab.id}
                            type="button"
                            onClick={() => setStackFilter(tab.id)}
                            className={`rounded-full px-2.5 py-1 font-mono text-[10px] font-bold transition-all duration-150 active:scale-95 cursor-pointer ${
                              active
                                ? "bg-[#1673F5] text-white shadow-xs"
                                : "bg-slate-100 text-slate-600 hover:bg-blue-50 hover:text-[#1673F5]"
                            }`}
                          >
                            {tab.label}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  {/* Symmetric 4x4 Interactive Bento Cards */}
                  <div
                    key={`stack-grid-${stackFilter}`}
                    className="l2-tab-enter grid min-h-0 flex-1 grid-cols-2 gap-2.5 sm:grid-cols-4"
                  >
                    {filteredStack.map((tech) => (
                      <button
                        key={tech.id}
                        type="button"
                        onClick={() => openTechInspector(tech)}
                        className="group relative flex min-h-0 flex-col justify-between overflow-hidden rounded-[16px] border border-slate-200/90 bg-white p-3 text-left shadow-xs transition-all duration-150 hover:-translate-y-[2px] hover:border-[#1673F5]/50 hover:shadow-md active:scale-[0.97] cursor-pointer"
                      >
                        {/* Brand Color Top Hairline Accent */}
                        <span
                          className="absolute inset-x-0 top-0 h-[3px] opacity-80 transition-opacity group-hover:opacity-100"
                          style={{ backgroundColor: tech.accentHex }}
                        />

                        <div className="flex items-start justify-between gap-2">
                          <span
                            className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl p-1.5 transition-transform duration-150 group-hover:scale-105 xl:h-10 xl:w-10 ${tech.tintBg}`}
                          >
                            <TechStackLogo id={tech.id} className="h-full w-full" />
                          </span>
                          <span className="rounded-md bg-slate-100 px-1.5 py-0.5 font-mono text-[9px] font-bold text-slate-500 uppercase">
                            {tech.category}
                          </span>
                        </div>

                        <div className="mt-2 min-w-0">
                          <p className="truncate text-xs font-extrabold text-[#1E293B] group-hover:text-[#1673F5] xl:text-[13px]">
                            {tech.name}
                          </p>
                          <p className="truncate text-[10px] font-medium text-slate-400">
                            {tech.role}
                          </p>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* ================= UPGRADED HORIZONTAL STUDIO SHOWCASE MODAL (ZERO SCROLLBAR, BESPOKE DESIGN!) ================= */}
      {selectedItem && (
        <div
          className="l2-backdrop-fade fixed inset-0 z-50 flex items-center justify-center bg-slate-950/65 p-4 backdrop-blur-sm"
          onClick={() => setSelectedItem(null)}
        >
          <div
            className="l2-modal-pop flex w-full max-w-4xl flex-col overflow-hidden rounded-[24px] bg-white text-[#1E293B] shadow-[0_32px_90px_rgba(4,16,45,0.5)] md:flex-row"
            onClick={(e) => e.stopPropagation()}
          >
            {/* LEFT STUDIO VISUAL STAGE (Project Preview OR Branded Identity Panel) */}
            {selectedItem.previewImages && selectedItem.previewImages.length > 0 ? (
              <div
                className={`relative flex flex-col justify-between bg-gradient-to-br p-5 text-white md:w-[54%] ${
                  selectedItem.stageGradient ?? "from-[#0F172A] to-[#1E293B]"
                }`}
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3 py-1 font-mono text-[10px] font-bold tracking-wider uppercase backdrop-blur-md">
                    {selectedItem.previewType === "mobile" ? (
                      <Smartphone className="h-3 w-3" />
                    ) : (
                      <Monitor className="h-3 w-3" />
                    )}
                    {selectedItem.badge}
                  </span>
                  <span className="font-mono text-[10px] text-white/60 uppercase">
                    {selectedItem.previewType === "mobile" ? "DUAL MOBILE VIEW" : "16:9 DESKTOP"}
                  </span>
                </div>

                {/* Full Uncropped Visual Mockup */}
                <div className="my-5 flex items-center justify-center">
                  {selectedItem.previewType === "mobile" ? (
                    <div className="flex h-56 items-center justify-center gap-4">
                      <img
                        src={selectedItem.previewImages[0]}
                        alt={`${selectedItem.title} screen 1`}
                        className="h-full rounded-2xl border-[3px] border-white/20 object-contain shadow-2xl"
                      />
                      {selectedItem.previewImages[1] && (
                        <img
                          src={selectedItem.previewImages[1]}
                          alt={`${selectedItem.title} screen 2`}
                          className="h-full rounded-2xl border-[3px] border-white/20 object-contain shadow-2xl"
                        />
                      )}
                    </div>
                  ) : (
                    <div className="w-full overflow-hidden rounded-xl border border-white/15 bg-[#090B10] shadow-2xl">
                      <div className="flex h-6 items-center gap-1.5 border-b border-white/10 bg-[#121622] px-3">
                        <span className="h-2 w-2 rounded-full bg-[#FF5F56]" />
                        <span className="h-2 w-2 rounded-full bg-[#FFBD2E]" />
                        <span className="h-2 w-2 rounded-full bg-[#27C93F]" />
                      </div>
                      <img
                        src={selectedItem.previewImages[0]}
                        alt={selectedItem.title}
                        className="aspect-video w-full object-cover object-top"
                      />
                    </div>
                  )}
                </div>

                {/* Direct Live & Repo Buttons Right Inside Studio Stage */}
                <div className="flex flex-wrap items-center gap-2.5">
                  {selectedItem.liveUrl && (
                    <a
                      href={selectedItem.liveUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full bg-[#F2C616] px-4 py-2 text-xs font-black text-[#0F172A] shadow-sm transition hover:bg-white active:scale-95"
                    >
                      Live Demo <ExternalLink className="h-3.5 w-3.5" />
                    </a>
                  )}
                  {selectedItem.githubUrl && (
                    <a
                      href={selectedItem.githubUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-full border border-white/30 bg-white/10 px-4 py-2 text-xs font-bold text-white backdrop-blur-md transition hover:bg-white hover:text-[#0F172A] active:scale-95"
                    >
                      <GithubIcon className="h-3.5 w-3.5" />
                      GitHub Repo
                    </a>
                  )}
                </div>
              </div>
            ) : (
              /* Non-Project Branded Left Identity Panel (Tech Stack / Experience / Education) */
              <div className="relative flex flex-col justify-between bg-gradient-to-br from-[#1673F5] via-[#135ED8] to-[#0D3D9E] p-6 text-white md:w-[38%]">
                <span className="self-start rounded-full bg-white/15 px-3 py-1 font-mono text-[10px] font-bold tracking-wider uppercase backdrop-blur-md">
                  {selectedItem.badge}
                </span>

                <div className="my-6 flex flex-col items-start">
                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white p-3 shadow-lg">
                    {selectedItem.logoId ? (
                      <TechStackLogo id={selectedItem.logoId} className="h-full w-full" />
                    ) : (
                      <span
                        className="font-unbounded text-xl font-black"
                        style={{ color: selectedItem.accentColor ?? "#1673F5" }}
                      >
                        {selectedItem.glyph ?? "SB"}
                      </span>
                    )}
                  </div>
                  <h3 className="mt-4 text-xl font-black leading-tight text-white">
                    {selectedItem.title}
                  </h3>
                  <p className="mt-1 text-xs font-semibold text-blue-100">
                    {selectedItem.subtitle}
                  </p>
                </div>

                {selectedItem.githubUrl ? (
                  <a
                    href={selectedItem.githubUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex self-start items-center gap-1.5 rounded-full bg-white px-4 py-2 text-xs font-bold text-[#1673F5] shadow-sm transition hover:bg-[#F2C616] hover:text-[#0F172A] active:scale-95"
                  >
                    <GithubIcon className="h-3.5 w-3.5" />
                    View on GitHub
                  </a>
                ) : (
                  <p className="font-mono text-[10px] text-blue-200 uppercase">
                    STEVBEQ · VERIFIED RECORD
                  </p>
                )}
              </div>
            )}

            {/* RIGHT EDITORIAL DETAIL PANEL (Clean, Crisp, Zero Scrollbar!) */}
            <div className="flex flex-1 flex-col justify-between bg-white p-5 sm:p-6">
              <div>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-xl font-black tracking-tight text-[#0F172A]">
                      {selectedItem.title}
                    </h3>
                    <p className="mt-0.5 text-xs font-bold text-[#1673F5]">
                      {selectedItem.subtitle}
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setSelectedItem(null)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-500 transition hover:bg-[#0F172A] hover:text-white active:scale-90 cursor-pointer"
                    aria-label="Close detail modal"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <p className="mt-3.5 text-[13px] leading-relaxed text-slate-600">
                  {selectedItem.description}
                </p>

                {selectedItem.bullets && selectedItem.bullets.length > 0 && (
                  <div className="mt-4 rounded-2xl border border-slate-100 bg-[#F8FAFC] p-3.5">
                    <p className="mb-2 font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                      Key Highlights
                    </p>
                    <ul className="space-y-1.5 text-xs font-medium text-slate-700">
                      {selectedItem.bullets.map((b) => (
                        <li key={b} className="flex items-start gap-2">
                          <CheckCircle2 className="mt-0.5 h-3.5 w-3.5 shrink-0 text-[#1673F5]" />
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>

              <div className="mt-4 border-t border-slate-100 pt-3.5">
                <p className="mb-2 font-mono text-[10px] font-bold tracking-wider text-slate-400 uppercase">
                  Stack &amp; Scope
                </p>
                <div className="flex flex-wrap gap-1.5">
                  {selectedItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-lg border border-slate-200/80 bg-[#F8FAFC] px-2.5 py-1 font-mono text-[10px] font-bold text-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
