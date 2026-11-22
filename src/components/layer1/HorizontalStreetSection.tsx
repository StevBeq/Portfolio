"use client";

import React, { useRef } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

const STREET_SHOPS = [
  {
    num: "01",
    name: "PROOF-OF-GRUDGE",
    cat: "WEB3 · NEAR MPC",
    year: "2026",
    awning: "bg-[#FF4D00]",
    desc: "Oracle-free dead-man's switch & deterministic Sepolia ETH release.",
    href: "https://proof-of-grudge.vercel.app",
  },
  {
    num: "02",
    name: "KWAKTODO",
    cat: "MOBILE · FLUTTER DART",
    year: "2025",
    awning: "bg-[#10B981]",
    desc: "Cross-platform productivity task manager built with Flutter & Dart.",
    href: "https://github.com/StevBeq/KwakTodo",
  },
  {
    num: "03",
    name: "INDO TECHNO MEDIC",
    cat: "FULLSTACK · ENTERPRISE",
    year: "2025",
    awning: "bg-[#2563EB]",
    desc: "4-month Fullstack Programmer case study build for medical systems.",
  },
  {
    num: "04",
    name: "NEAR-POLYGRAPH",
    cat: "TYPESCRIPT · LAB",
    year: "2026",
    awning: "bg-[#A855F7]",
    desc: "Protocol verification experiments in TypeScript on NEAR Testnet.",
    href: "https://github.com/StevBeq/near-polygraph",
  },
  {
    num: "05",
    name: "SCHEDULE FLOW KRS",
    cat: "ACADEMIC · WORKFLOW",
    year: "2025",
    awning: "bg-[#F59E0B]",
    desc: "Interactive semester KRS planner built for streamlined course selection.",
    href: "https://github.com/StevBeq/Schedule_Flow_KRS",
  },
  {
    num: "06",
    name: "UKM OLAHRAGA UTY",
    cat: "KETUA DIVISI SDM",
    year: "2024–25",
    awning: "bg-[#EC4899]",
    desc: "Led Human Resources division, recruitment, and team coordination.",
  },
  {
    num: "07",
    name: "HMSI UTY",
    cat: "SUMBER DAYA EKONOMI",
    year: "2024–25",
    awning: "bg-[#06B6D4]",
    desc: "Information Systems Student Association funding & sponsorship operations.",
  },
  {
    num: "08",
    name: "THE FACTORY STACK",
    cat: "18+ CORE TECHNOLOGIES",
    year: "ALWAYS",
    awning: "bg-[#E0462E]",
    desc: "Next.js · React · Vue · Flutter · Laravel · PHP · Python · PostgreSQL · Supabase.",
  },
];

export function HorizontalStreetSection() {
  const sectionRef = useRef<HTMLElement | null>(null);
  const trackRef = useRef<HTMLDivElement | null>(null);

  useGSAP(
    () => {
      const track = trackRef.current;
      const section = sectionRef.current;
      if (!track || !section) return;

      const getDistance = () => Math.max(0, track.scrollWidth - window.innerWidth + 80);

      gsap.to(track, {
        x: () => -getDistance(),
        ease: "none",
        scrollTrigger: {
          trigger: section,
          start: "top top",
          end: () => `+=${getDistance()}`,
          pin: true,
          scrub: 1,
          invalidateOnRefresh: true,
        },
      });
    },
    { scope: sectionRef }
  );

  return (
    <section
      id="the-street"
      ref={sectionRef}
      className="relative flex min-h-screen w-full flex-col justify-between overflow-hidden bg-[#F3EFE6] text-[#141416]"
    >
      {/* Top Architectural Header (Ref 8 devinthehood.com) */}
      <div className="mx-auto flex w-full max-w-7xl items-end justify-between border-b-2 border-[#141416] px-6 pt-20 pb-5 sm:px-10">
        <div>
          <p className="font-mono text-xs font-bold tracking-widest text-[#E0462E] uppercase">
            02 THE STREET — THE FRONT IS WHAT PEOPLE SEE.
          </p>
          <h2 className="mt-1 text-3xl font-black tracking-tight sm:text-5xl">
            SHOPFRONTS &amp; SHIPPED BUILDS
          </h2>
        </div>
        <span className="hidden rounded-full border-2 border-[#141416] bg-[#FACC15] px-4 py-1.5 font-mono text-xs font-bold uppercase sm:inline-block">
          SCROLL SIDEWAYS →
        </span>
      </div>

      {/* Horizontal Pinned Track of Shopfront Cards */}
      <div className="flex flex-1 items-center overflow-visible">
        <div
          ref={trackRef}
          className="gpu-layer flex items-stretch gap-6 px-6 py-8 sm:px-12"
        >
          {STREET_SHOPS.map((shop) => (
            <article
              key={shop.num}
              className="group relative flex w-[300px] shrink-0 flex-col justify-between overflow-hidden rounded-2xl border-2 border-[#141416] bg-white shadow-[8px_8px_0px_#141416] transition-transform duration-300 hover:-translate-y-2 sm:w-[340px]"
            >
              {/* Storefront Striped Awning */}
              <div>
                <div
                  className={`flex items-center justify-between border-b-2 border-[#141416] px-4 py-3 text-white ${shop.awning}`}
                >
                  <span className="font-mono text-xs font-black">NO. {shop.num}</span>
                  <span className="font-mono text-[10px] font-bold tracking-wider uppercase">
                    {shop.year}
                  </span>
                </div>
                <div
                  className="h-3 w-full border-b-2 border-[#141416]"
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(90deg, #141416 0 14px, #F3EFE6 14px 28px)",
                  }}
                />
              </div>

              {/* Shop Window Showcase */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div>
                  <span className="inline-block rounded border border-[#141416]/25 bg-[#F3EFE6] px-2.5 py-0.5 font-mono text-[10px] font-bold text-[#141416]">
                    {shop.cat}
                  </span>
                  <h3 className="mt-3 text-2xl font-black tracking-tight text-[#141416]">
                    {shop.name}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[#141416]/75">
                    {shop.desc}
                  </p>
                </div>

                {/* Shop Door & Action Footer */}
                <div className="mt-6 flex items-center justify-between border-t-2 border-dashed border-[#141416]/20 pt-4">
                  <div className="flex items-center gap-2">
                    <span className="h-3 w-3 rounded-full border border-[#141416] bg-emerald-400" />
                    <span className="font-mono text-[11px] font-bold">OPEN ARCHIVE</span>
                  </div>
                  {shop.href ? (
                    <a
                      href={shop.href}
                      target="_blank"
                      rel="noreferrer"
                      className="rounded-full bg-[#141416] px-3 py-1 font-mono text-[11px] font-bold text-white transition hover:bg-[#E0462E]"
                    >
                      VISIT -&gt;
                    </a>
                  ) : (
                    <span className="font-mono text-[11px] font-bold text-[#141416]/50">
                      CASE RECORD
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>

      {/* Bottom Blueprint Transition Line */}
      <div className="mx-auto flex w-full max-w-7xl items-center justify-between border-t border-[#141416]/15 px-6 py-4 font-mono text-[11px] text-[#141416]/60 sm:px-10">
        <span>03 BELOW: INTERACTIVE DOT-MATRIX FOOTER &amp; LAYER 2 PORTAL</span>
        <span>SCROLL DOWN TO CONTINUE ↓</span>
      </div>
    </section>
  );
}
