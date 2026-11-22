"use client";

import React, { useRef, useState } from "react";
import { ArrowUpRight, ExternalLink, Monitor, Smartphone } from "lucide-react";
import { GithubIcon } from "@/components/ui/GithubIcon";
import { usePortfolioLayer } from "@/components/providers/SmoothScrollProvider";
import { gsap, ScrollTrigger, isLowEndDevice, prefersReducedMotion, useGSAP } from "@/lib/gsap";
import { STEVBEQ_PROJECTS, type ProjectItem } from "@/data/stevbeq";

// 3x5 dot-matrix pixel bitmaps for the single micro Vermilion LED counter ("01", "02", "03", "04")
const DIGIT_MAP: Record<string, number[]> = {
  "0": [1, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1],
  "1": [0, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 1, 1, 1],
  "2": [1, 1, 1, 0, 0, 1, 1, 1, 1, 1, 0, 0, 1, 1, 1],
  "3": [1, 1, 1, 0, 0, 1, 1, 1, 1, 0, 0, 1, 1, 1, 1],
  "4": [1, 0, 1, 1, 0, 1, 1, 1, 1, 0, 0, 1, 0, 0, 1],
};

function DotMatrixDigit({ char }: { char: string }) {
  const cells = DIGIT_MAP[char] ?? DIGIT_MAP["0"];
  return (
    <div className="grid grid-cols-3 gap-[3px] xl:gap-1">
      {cells.map((active, i) => (
        <span
          key={i}
          className={`h-1.5 w-1.5 rounded-full transition-colors duration-300 xl:h-2 xl:w-2 ${
            active
              ? "bg-[#E0462E] shadow-[0_0_8px_rgba(224,70,46,0.55)]"
              : "bg-[#10131A]/10"
          }`}
        />
      ))}
    </div>
  );
}

function ProjectVisualStage({
  project,
  isActive,
}: {
  project: ProjectItem;
  isActive: boolean;
}) {
  const isMobileApp = project.previewType === "mobile";

  return (
    <div
      className={`relative flex h-full w-full flex-col justify-between overflow-hidden rounded-[24px] border border-[#10131A]/[0.08] bg-white p-4 shadow-[0_24px_60px_rgba(47,107,242,0.18)] sm:p-6 xl:p-7 ${
        isActive ? "pointer-events-auto" : "pointer-events-none"
      }`}
    >
      {/* Subtle Monotonic Royal-Blue Studio Wash (Single Blue Family, Background Drift Layer -3%) */}
      <div
        aria-hidden
        className="slide-bg-layer pointer-events-none absolute -inset-4"
        style={{
          background:
            "radial-gradient(circle at 84% 14%, rgba(199,216,252,0.55) 0%, transparent 48%), radial-gradient(circle at 12% 90%, rgba(157,184,251,0.28) 0%, transparent 46%)",
        }}
      />

      {/* Delicate Blue-Tinted Studio Grid */}
      <div
        aria-hidden
        className="slide-bg-layer pointer-events-none absolute -inset-4 opacity-50"
        style={{
          backgroundImage:
            "linear-gradient(to right, rgba(47,107,242,0.06) 1px, transparent 1px), linear-gradient(to bottom, rgba(47,107,242,0.06) 1px, transparent 1px)",
          backgroundSize: "44px 44px",
        }}
      />

      {/* Top Card Header Bar */}
      <div className="relative z-10 flex shrink-0 flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-[#2F6BF2] px-3 py-1 font-mono text-[10px] font-bold tracking-wider text-white uppercase sm:text-[11px]">
            {isMobileApp ? (
              <Smartphone className="h-3 w-3" />
            ) : (
              <Monitor className="h-3 w-3" />
            )}
            {project.index} // {isMobileApp ? "MOBILE APP" : "WEB PLATFORM"}
          </span>
          <span className="hidden font-mono text-xs text-[#10131A]/55 sm:inline">
            {project.subtitle}
          </span>
        </div>

        <span className="rounded-full border border-[#10131A]/[0.08] bg-[#F4F5F8] px-3 py-1 font-mono text-[10px] tracking-widest text-[#10131A]/60 uppercase">
          {isMobileApp ? "DUAL MOBILE VIEW" : "16:9 WEB FRAME"}
        </span>
      </div>

      {/* Centerpiece Artwork Stage: Crisp Full-Color Screenshots in Clean Studio Frames (Drift fg -8%) */}
      <div className="slide-artwork relative z-10 my-3 flex min-h-0 flex-1 items-center justify-center sm:my-4">
        {isMobileApp ? (
          /* DUAL SIDE-BY-SIDE SMARTPHONE MOCKUPS */
          <div className="flex h-full max-h-[340px] w-full items-center justify-center gap-4 sm:max-h-[400px] sm:gap-7 xl:max-h-[450px]">
            {/* Primary Phone Screen */}
            <div className="relative aspect-[39/80] h-[92%] -translate-y-1.5 overflow-hidden rounded-[26px] border-[4px] border-[#10131A] bg-white p-1 shadow-[0_24px_56px_rgba(47,107,242,0.22)] ring-1 ring-[#10131A]/10 sm:rounded-[34px] sm:border-[5px]">
              <img
                src={project.previewImages[0]}
                alt={`${project.title} mobile home preview`}
                className="h-full w-full rounded-[20px] object-cover object-top sm:rounded-[27px]"
              />
            </div>

            {/* Secondary Phone Screen */}
            <div className="relative aspect-[39/80] h-[92%] translate-y-2 overflow-hidden rounded-[26px] border-[4px] border-[#10131A] bg-white p-1 shadow-[0_24px_56px_rgba(47,107,242,0.22)] ring-1 ring-[#10131A]/10 sm:rounded-[34px] sm:border-[5px]">
              <img
                src={project.previewImages[1] ?? project.previewImages[0]}
                alt={`${project.title} mobile secondary preview`}
                className="h-full w-full rounded-[20px] object-cover object-top sm:rounded-[27px]"
              />
            </div>
          </div>
        ) : (
          /* LANDSCAPE 16:9 CRISP WHITE STUDIO BROWSER FRAME */
          <div className="flex max-h-full w-full max-w-[min(780px,calc((100vh-300px)*16/9))] flex-col overflow-hidden rounded-[20px] border border-[#10131A]/10 bg-white shadow-[0_24px_60px_rgba(47,107,242,0.18)]">
            {/* Minimalist Light Studio Window Chrome */}
            <div className="flex h-8 shrink-0 items-center justify-between border-b border-[#10131A]/[0.08] bg-[#F4F5F8] px-3.5">
              <div className="flex items-center gap-1.5">
                <span className="h-2.5 w-2.5 rounded-full bg-[#10131A]/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#10131A]/20" />
                <span className="h-2.5 w-2.5 rounded-full bg-[#2F6BF2]/60" />
              </div>
              <span className="rounded-md bg-white px-3 py-0.5 font-mono text-[10px] tracking-wider text-[#10131A]/55 shadow-2xs">
                stevbeq.dev/builds/{project.id}
              </span>
              <span className="font-mono text-[10px] text-[#10131A]/40">{project.year}</span>
            </div>

            {/* 16:9 Screenshot Slot */}
            <div className="relative aspect-video w-full overflow-hidden bg-[#0B0D12]">
              <img
                src={project.previewImages[0]}
                alt={`${project.title} desktop web preview`}
                className="h-full w-full object-cover object-top"
              />
            </div>
          </div>
        )}
      </div>

      {/* Bottom Highlights & Quick Action Strip */}
      <div className="relative z-10 flex shrink-0 flex-wrap items-center justify-between gap-3 border-t border-[#10131A]/[0.08] pt-3.5">
        <div className="flex flex-wrap items-center gap-1.5">
          {project.highlights.slice(0, 2).map((item) => (
            <span
              key={item}
              className="max-w-[280px] truncate rounded-full border border-[#10131A]/[0.08] bg-[#F4F5F8] px-3 py-1 font-mono text-[10px] text-[#10131A]/75 xl:max-w-[330px]"
              title={item}
            >
              • {item}
            </span>
          ))}
        </div>

        <div className="flex items-center gap-3 font-mono text-[11px]">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-bold text-[#2F6BF2] transition hover:text-[#10131A]"
            >
              Visit App <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
          {project.githubUrl && (
            <a
              href={project.githubUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1 font-semibold text-[#10131A]/65 transition hover:text-[#10131A]"
            >
              Source <ArrowUpRight className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Subtle Cool Cloud Depth Dimmer when next card rises above */}
      <div className="slide-dimmer pointer-events-none absolute inset-0 z-20 bg-[#F4F5F8] opacity-0" />
    </div>
  );
}

export function PinnedProjectShowcase() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const [activeIndex, setActiveIndex] = useState(0);
  const { scrollToPosition } = usePortfolioLayer();

  useGSAP(
    () => {
      const slides = gsap.utils.toArray<HTMLElement>(".project-slide");
      const total = slides.length;
      if (total <= 1) return;

      const reducedMotion = prefersReducedMotion();
      const lowEnd = isLowEndDevice();

      if (reducedMotion) {
        slides.forEach((slide, idx) => {
          gsap.set(slide, { yPercent: 0, opacity: idx === 0 ? 1 : 0, zIndex: idx + 1 });
        });
        return;
      }

      // Stage slides 1..N neatly below the locked right-hand viewport frame
      slides.forEach((slide, idx) => {
        if (idx === 0) {
          gsap.set(slide, { yPercent: 0, scale: 1, zIndex: 1, clipPath: "inset(0% 0% 0% 0%)" });
        } else {
          gsap.set(slide, { yPercent: 104, scale: 0.98, zIndex: idx + 1, clipPath: "inset(0% 0% 0% 0%)" });
        }
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          id: "selected-works-pin",
          trigger: sectionRef.current,
          start: "top top",
          end: `+=${(total - 1) * 115}%`,
          pin: true,
          scrub: lowEnd ? 0.5 : 0.75,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onToggle: (self) => {
            slides.slice(0, 3).forEach((el) => el.classList.toggle("is-animating", self.isActive));
          },
          onUpdate: (self) => {
            const nextIdx = Math.min(
              total - 1,
              Math.max(0, Math.round(self.progress * (total - 1)))
            );
            setActiveIndex((prev) => (prev === nextIdx ? prev : nextIdx));
          },
        },
      });

      // Right-column Royal Bridge Blue vertical progress rail
      tl.fromTo(
        ".project-progress-fill",
        { scaleY: 0 },
        { scaleY: 1, duration: total - 1, ease: "none" },
        0
      );

      // Single scrub timeline: mask-out upward + liquid rise from below + subtle drift-parallax (fg -8% / bg -3%)
      for (let i = 1; i < total; i++) {
        const prevSlide = slides[i - 1];
        const nextSlide = slides[i];
        const prevDimmer = prevSlide.querySelector<HTMLElement>(".slide-dimmer");
        const nextArtwork = nextSlide.querySelector<HTMLElement>(".slide-artwork");
        const nextBg = nextSlide.querySelectorAll<HTMLElement>(".slide-bg-layer");
        const stepPos = i - 1;

        tl.to(
          prevSlide,
          {
            scale: 0.95,
            yPercent: -6,
            clipPath: "inset(0% 0% 18% 0%)",
            duration: 1,
            ease: "liquidFlow",
          },
          stepPos
        );

        if (prevDimmer) {
          tl.to(
            prevDimmer,
            {
              opacity: 0.55,
              duration: 1,
              ease: "liquidFlow",
            },
            stepPos
          );
        }

        tl.to(
          nextSlide,
          {
            yPercent: 0,
            scale: 1,
            duration: 1,
            ease: "liquidFlow",
          },
          stepPos
        );

        // Subtle Drift-Parallax inside rising card (fg -8% / bg -3%)
        if (nextArtwork) {
          tl.fromTo(
            nextArtwork,
            { yPercent: 8 },
            { yPercent: 0, duration: 1, ease: "none" },
            stepPos
          );
        }
        if (nextBg.length) {
          tl.fromTo(
            nextBg,
            { yPercent: 3 },
            { yPercent: 0, duration: 1, ease: "none" },
            stepPos
          );
        }
      }
    },
    { scope: sectionRef }
  );

  const activeProject = STEVBEQ_PROJECTS[activeIndex] ?? STEVBEQ_PROJECTS[0];
  const counterDigits = activeProject.index.split("");

  const jumpToProject = (idx: number) => {
    if (prefersReducedMotion()) {
      setActiveIndex(idx);
      const slides = sectionRef.current?.querySelectorAll<HTMLElement>(".project-slide");
      slides?.forEach((s, i) => gsap.set(s, { opacity: i === idx ? 1 : 0 }));
      return;
    }
    const st = ScrollTrigger.getById("selected-works-pin");
    if (!st) return;
    const total = STEVBEQ_PROJECTS.length;
    const ratio = total > 1 ? idx / (total - 1) : 0;
    scrollToPosition(st.start + (st.end - st.start) * ratio);
  };

  return (
    <section
      id="selected-projects"
      ref={sectionRef}
      className="relative flex h-screen min-h-[640px] w-full flex-col justify-between overflow-hidden bg-[#F4F5F8] px-5 py-4 text-[#10131A] select-none sm:px-8 lg:px-10"
    >
      {/* Top Balanced Chrome (h-14 matching all 7 Layer 1 Moments!) */}
      <header className="relative z-20 mx-auto flex h-14 w-full max-w-[1440px] shrink-0 items-center justify-between border-b border-[#10131A]/[0.08] font-mono text-[11px] tracking-widest text-[#10131A]/50 uppercase">
        <span>05 // SELECTED WORK · 2024 — 2026</span>
        <span className="hidden text-[#2F6BF2] sm:inline">
          0{activeIndex + 1} / 0{STEVBEQ_PROJECTS.length} — {activeProject.title.toUpperCase()}
        </span>
        <span>SCROLL OR SELECT ↓</span>
      </header>

      <div className="mx-auto my-3 flex min-h-0 w-full max-w-[1440px] flex-1 flex-col gap-4 lg:my-4 lg:grid lg:grid-cols-12 lg:gap-8">
        {/* ================= MOBILE COMPACT LOCKED HEADER (< lg) ================= */}
        <div className="flex shrink-0 flex-col gap-3 lg:hidden">
          <div className="flex items-end justify-between">
            <div>
              <h2 className="font-display text-2xl font-extrabold tracking-tight text-[#10131A]">
                Work that{" "}
                <span className="font-serif-italic font-normal text-[#2F6BF2]">holds up</span>.
              </h2>
            </div>

            <div className="flex items-end gap-2">
              <div className="flex items-center gap-1.5">
                {counterDigits.map((d, i) => (
                  <DotMatrixDigit key={`m-${i}`} char={d} />
                ))}
              </div>
              <span className="font-mono text-base font-bold text-[#10131A]/30">
                /0{STEVBEQ_PROJECTS.length}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5">
            {STEVBEQ_PROJECTS.map((project, idx) => {
              const isActive = idx === activeIndex;
              return (
                <button
                  key={project.id}
                  type="button"
                  onClick={() => jumpToProject(idx)}
                  className={`shrink-0 rounded-full border px-3 py-1 font-mono text-[10px] font-bold transition cursor-pointer ${
                    isActive
                      ? "border-[#2F6BF2] bg-[#2F6BF2] text-white"
                      : "border-[#10131A]/10 bg-white text-[#10131A]/65"
                  }`}
                >
                  {project.index} · {project.title}
                </button>
              );
            })}
          </div>
        </div>

        {/* ================= DESKTOP LOCKED LEFT COLUMN (COOL CLOUD MONOTONIC DAWN) ================= */}
        <div className="hidden h-full min-h-0 flex-col justify-between lg:col-span-4 lg:flex">
          <div className="flex min-h-0 flex-col">
            <h2 className="font-display text-3xl font-extrabold tracking-tight text-[#10131A] xl:text-[2.6rem] leading-[1.06]">
              Work that{" "}
              {/* Single Permitted Instrument Serif Italic Phrase on Moment 6 */}
              <span className="font-serif-italic font-normal text-[#2F6BF2]">holds up</span>.
            </h2>

            <p className="mt-2.5 text-xs leading-relaxed text-[#10131A]/60 xl:text-sm">
              Enterprise systems, mobile apps, and protocol tooling — each one designed to be used,
              not just shown.
            </p>

            {/* Numbered Interactive Project Index */}
            <ul className="mt-4 space-y-1 border-l border-[#10131A]/10 pl-3.5 xl:mt-5 xl:space-y-1.5">
              {STEVBEQ_PROJECTS.map((project, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <li key={project.id}>
                    <button
                      type="button"
                      onClick={() => jumpToProject(idx)}
                      className={`group flex w-full items-center justify-between gap-2 rounded-xl px-2.5 py-1.5 text-left transition cursor-pointer ${
                        isActive
                          ? "bg-white text-[#10131A] shadow-[0_8px_24px_rgba(47,107,242,0.12)]"
                          : "text-[#10131A]/45 hover:bg-white/60 hover:text-[#10131A]/85"
                      }`}
                    >
                      <span className="flex min-w-0 items-center gap-2.5">
                        <span
                          className={`h-2 w-2 shrink-0 rounded-full transition-all duration-300 ${
                            isActive
                              ? "scale-110 bg-[#2F6BF2] shadow-[0_0_10px_rgba(47,107,242,0.6)]"
                              : "bg-[#10131A]/15"
                          }`}
                        />
                        <span className="font-mono text-[11px]">{project.index}</span>
                        <span className="truncate text-sm font-bold tracking-tight xl:text-base">
                          {project.title}
                        </span>
                      </span>

                      <span
                        className={`shrink-0 rounded-md border px-1.5 py-0.5 font-mono text-[9px] font-bold tracking-wider uppercase ${
                          isActive
                            ? "border-[#2F6BF2]/30 bg-[#C7D8FC]/50 text-[#2F6BF2]"
                            : "border-[#10131A]/10 text-[#10131A]/35"
                        }`}
                      >
                        {project.previewType === "mobile" ? "APP" : "WEB"}
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>

            {/* Active Project Metadata Crisp White Card */}
            <div className="mt-4 rounded-[20px] border border-[#10131A]/[0.08] bg-white p-4 shadow-[0_18px_42px_rgba(47,107,242,0.11)] xl:mt-5 xl:p-5">
              <div className="flex items-center justify-between gap-2">
                <p className="font-mono text-[10px] font-bold tracking-wider text-[#2F6BF2] uppercase">
                  {activeProject.category}
                </p>
                <span className="font-mono text-[10px] text-[#10131A]/45">
                  {activeProject.year}
                </span>
              </div>

              <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-[#10131A]/70 xl:text-[13px]">
                {activeProject.description}
              </p>

              <div className="mt-3 flex flex-wrap gap-1.5">
                {activeProject.stack.slice(0, 6).map((tech) => (
                  <span
                    key={tech}
                    className="rounded-lg border border-[#10131A]/[0.08] bg-[#F4F5F8] px-2 py-0.5 font-mono text-[10px] font-medium text-[#10131A]/75"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Bottom-Left Single Micro Vermilion LED Counter ("01 /04") & Royal Action Links */}
          <div className="flex shrink-0 items-end justify-between border-t border-[#10131A]/[0.08] pt-3.5 xl:pt-4">
            <div className="flex items-end gap-3">
              <div className="flex items-center gap-2">
                {counterDigits.map((d, i) => (
                  <DotMatrixDigit key={i} char={d} />
                ))}
              </div>
              <span className="font-mono text-xl font-bold text-[#10131A]/25 xl:text-2xl">
                /0{STEVBEQ_PROJECTS.length}
              </span>
            </div>

            <div className="flex items-center gap-2">
              {activeProject.githubUrl && (
                <a
                  href={activeProject.githubUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1.5 rounded-full border border-[#10131A]/15 bg-white px-3 py-1.5 font-mono text-[11px] font-bold text-[#10131A] transition hover:border-[#2F6BF2] hover:text-[#2F6BF2]"
                >
                  <GithubIcon className="h-3.5 w-3.5" />
                  REPO
                </a>
              )}
              {activeProject.liveUrl && (
                <a
                  href={activeProject.liveUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-1 rounded-full bg-[#2F6BF2] px-3.5 py-1.5 font-mono text-[11px] font-bold text-white shadow-[0_8px_20px_rgba(47,107,242,0.3)] transition hover:bg-[#10131A]"
                >
                  LIVE <ArrowUpRight className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        </div>

        {/* ================= RIGHT LOCKED VISUAL SHOWCASE VIEWPORT (ONLY THIS MOVES!) ================= */}
        <div className="relative min-h-0 flex-1 overflow-hidden rounded-[28px] border border-[#10131A]/[0.08] bg-[#EBF0FA]/60 lg:col-span-8 lg:h-full">
          {STEVBEQ_PROJECTS.map((project, idx) => (
            <article
              key={project.id}
              className="project-slide absolute inset-0 p-2 sm:p-2.5"
            >
              <ProjectVisualStage project={project} isActive={idx === activeIndex} />
            </article>
          ))}

          {/* Tactile Royal Bridge Blue Vertical Scroll Progress Rail */}
          <div className="pointer-events-none absolute top-1/2 right-1.5 z-30 h-28 w-1 -translate-y-1/2 overflow-hidden rounded-full bg-[#10131A]/10">
            <div className="project-progress-fill h-full w-full origin-top rounded-full bg-[#2F6BF2]" />
          </div>
        </div>
      </div>
    </section>
  );
}
