import React from "react";

export interface TechStackCardMeta {
  id: string;
  name: string;
  category: string;
  ringColor: string;
}

export const TECH_STACK_CARDS: TechStackCardMeta[] = [
  { id: "nextjs", name: "Next.js", category: "Web", ringColor: "border-white/25" },
  { id: "react", name: "React", category: "Web", ringColor: "border-cyan-400/35" },
  { id: "typescript", name: "TypeScript", category: "Lang", ringColor: "border-blue-400/35" },
  { id: "flutter", name: "Flutter", category: "Mobile", ringColor: "border-sky-400/35" },
  { id: "dart", name: "Dart", category: "Mobile", ringColor: "border-teal-400/35" },
  { id: "laravel", name: "Laravel", category: "Backend", ringColor: "border-rose-500/35" },
  { id: "php", name: "PHP", category: "Backend", ringColor: "border-indigo-400/35" },
  { id: "vue", name: "Vue", category: "Web", ringColor: "border-emerald-400/35" },
  { id: "vite", name: "Vite", category: "Tool", ringColor: "border-purple-400/35" },
  { id: "tailwind", name: "Tailwind", category: "UI", ringColor: "border-sky-300/35" },
  { id: "postgresql", name: "PostgreSQL", category: "DB", ringColor: "border-blue-500/35" },
  { id: "mysql", name: "MySQL", category: "DB", ringColor: "border-amber-400/35" },
  { id: "supabase", name: "Supabase", category: "Cloud", ringColor: "border-emerald-500/35" },
  { id: "firebase", name: "Firebase", category: "Cloud", ringColor: "border-yellow-400/35" },
  { id: "python", name: "Python", category: "Backend", ringColor: "border-yellow-300/35" },
  { id: "git", name: "Git", category: "VCS", ringColor: "border-orange-500/35" },
];

export function TechStackLogo({ id, className = "h-8 w-8" }: { id: string; className?: string }) {
  switch (id) {
    case "nextjs":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="14" fill="#0F172A" stroke="#FFFFFF" strokeWidth="1.5" />
          <path d="M11 21V11L22.5 23.5" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
          <path d="M21 11V17" stroke="#FFFFFF" strokeWidth="2.2" strokeLinecap="round" />
        </svg>
      );
    case "react":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <circle cx="16" cy="16" r="2.6" fill="#61DAFB" />
          <ellipse cx="16" cy="16" rx="12" ry="4.8" stroke="#61DAFB" strokeWidth="1.6" />
          <ellipse cx="16" cy="16" rx="12" ry="4.8" transform="rotate(60 16 16)" stroke="#61DAFB" strokeWidth="1.6" />
          <ellipse cx="16" cy="16" rx="12" ry="4.8" transform="rotate(120 16 16)" stroke="#61DAFB" strokeWidth="1.6" />
        </svg>
      );
    case "typescript":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <rect x="3" y="3" width="26" height="26" rx="5" fill="#3178C6" />
          <text x="16" y="21.5" textAnchor="middle" fill="#FFFFFF" fontSize="11.5" fontWeight="900" fontFamily="monospace">
            TS
          </text>
        </svg>
      );
    case "flutter":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <path d="M17.5 4L6 15.5L9.5 19L24.5 4H17.5Z" fill="#54C5F8" />
          <path d="M17.5 15L11.5 21L17.5 27H24.5L18.5 21L24.5 15H17.5Z" fill="#01579B" />
          <path d="M11.5 21L15 17.5L18.5 21L15 24.5L11.5 21Z" fill="#29B6F6" />
        </svg>
      );
    case "dart":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <path d="M7 9L17 4L27 14V24H15L7 16V9Z" fill="#0175C2" />
          <path d="M7 9L15 17H27L17 4L7 9Z" fill="#29B6F6" />
          <path d="M7 16L15 24V17L7 9V16Z" fill="#00D2B8" />
        </svg>
      );
    case "laravel":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <path d="M6 8L12 5L18 8V19L24 16L27 18V24L18 28L6 22V8Z" stroke="#FF2D20" strokeWidth="2.1" strokeLinejoin="round" />
          <path d="M12 5V16L6 19" stroke="#FF2D20" strokeWidth="1.8" />
          <path d="M18 19L18 28" stroke="#FF2D20" strokeWidth="1.8" />
        </svg>
      );
    case "php":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <ellipse cx="16" cy="16" rx="13.5" ry="8.5" fill="#777BB4" stroke="#E2E8F0" strokeWidth="1.4" />
          <text x="16" y="19.5" textAnchor="middle" fill="#FFFFFF" fontSize="9.5" fontWeight="900" fontFamily="monospace">
            php
          </text>
        </svg>
      );
    case "vue":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <path d="M4 6H10.5L16 15.5L21.5 6H28L16 26.5L4 6Z" fill="#41B883" />
          <path d="M9.5 6H13.5L16 10.5L18.5 6H22.5L16 17.5L9.5 6Z" fill="#35495E" />
        </svg>
      );
    case "vite":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <path d="M4 6L16 27L28 6L16 9.5L4 6Z" fill="#646CFF" />
          <path d="M16.5 4L12 16H16.5L14 25L22 13H17L20 4H16.5Z" fill="#FFD028" />
        </svg>
      );
    case "tailwind":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <path
            d="M9.5 14C10.5 10 13 8.5 16.5 9C19 9.4 20.3 11.2 21.8 12.6C23 13.7 24.4 14.3 26.5 13C25.5 17 23 18.5 19.5 18C17 17.6 15.7 15.8 14.2 14.4C13 13.3 11.6 12.7 9.5 14ZM5.5 20C6.5 16 9 14.5 12.5 15C15 15.4 16.3 17.2 17.8 18.6C19 19.7 20.4 20.3 22.5 19C21.5 23 19 24.5 15.5 24C13 23.6 11.7 21.8 10.2 20.4C9 19.3 7.6 18.7 5.5 20Z"
            fill="#38BDF8"
          />
        </svg>
      );
    case "postgresql":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <ellipse cx="16" cy="9" rx="9" ry="4" fill="#336791" stroke="#93C5FD" strokeWidth="1.4" />
          <path d="M7 9V22C7 24.2 11 26 16 26C21 26 25 24.2 25 22V9" fill="#2563EB" fillOpacity="0.45" stroke="#93C5FD" strokeWidth="1.4" />
          <path d="M7 15.5C7 17.7 11 19.5 16 19.5C21 19.5 25 17.7 25 15.5" stroke="#93C5FD" strokeWidth="1.4" />
        </svg>
      );
    case "mysql":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <path d="M6 22C9 12 16 7 24 10C20 13 21 17 26 20C21 19 17 19 15 23C14 19 10 19 6 22Z" fill="#00758F" />
          <circle cx="19" cy="11.5" r="1.4" fill="#F29111" />
          <text x="16" y="28" textAnchor="middle" fill="#F29111" fontSize="6.5" fontWeight="900" fontFamily="monospace">
            SQL
          </text>
        </svg>
      );
    case "supabase":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <path d="M17.5 4L7.5 17.5H15.5L14.5 28L24.5 14.5H16.5L17.5 4Z" fill="#3ECF8E" />
        </svg>
      );
    case "firebase":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <path d="M7 23L10 6L15 14L7 23Z" fill="#FFA000" />
          <path d="M7 23L19.5 10.5L25 23L16 28L7 23Z" fill="#FFCA28" />
          <path d="M7 23L14.5 11L17.5 15.5L7 23Z" fill="#F57C00" />
        </svg>
      );
    case "python":
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <path d="M16 5C11.5 5 11.5 7 11.5 9V11.5H16V12.5H9.5C7 12.5 5.5 14.2 5.5 16.5C5.5 18.8 7 20.5 9.5 20.5H11.5V17.5C11.5 15.5 13 14 15.5 14H20C21.5 14 22.5 12.8 22.5 11.2V9C22.5 6.8 20.5 5 16 5Z" fill="#3776AB" />
          <path d="M16 27C20.5 27 20.5 25 20.5 23V20.5H16V19.5H22.5C25 19.5 26.5 17.8 26.5 15.5C26.5 13.2 25 11.5 22.5 11.5H20.5V14.5C20.5 16.5 19 18 16.5 18H12C10.5 18 9.5 19.2 9.5 20.8V23C9.5 25.2 11.5 27 16 27Z" fill="#FFD43B" />
          <circle cx="13.5" cy="8.2" r="1" fill="#FFFFFF" />
          <circle cx="18.5" cy="23.8" r="1" fill="#FFFFFF" />
        </svg>
      );
    case "git":
    default:
      return (
        <svg viewBox="0 0 32 32" className={className} fill="none">
          <rect x="16" y="3" width="18" height="18" rx="3" transform="rotate(45 16 3)" fill="#F05032" />
          <circle cx="16" cy="11.5" r="2" fill="#FFFFFF" />
          <circle cx="16" cy="20.5" r="2" fill="#FFFFFF" />
          <circle cx="20.5" cy="16" r="2" fill="#FFFFFF" />
          <path d="M16 11.5V20.5M16 13.5L20.5 16" stroke="#FFFFFF" strokeWidth="1.8" />
        </svg>
      );
  }
}
