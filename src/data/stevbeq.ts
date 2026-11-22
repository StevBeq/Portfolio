export interface ProjectItem {
  id: string;
  index: string;
  title: string;
  subtitle: string;
  category: string;
  year: string;
  description: string;
  highlights: string[];
  stack: string[];
  githubUrl?: string;
  liveUrl?: string;
  accentColor: string;
  /** "web" renders a 16:9 landscape screenshot frame; "mobile" renders dual side-by-side phone mockups */
  previewType: "web" | "mobile";
  /** Paths under /public/assets/projects/ — swap with your real screenshots anytime */
  previewImages: string[];
  stageGradient: string;
}

export interface ExperienceItem {
  id: string;
  role: string;
  company: string;
  period: string;
  duration: string;
  type: "work" | "organization";
  summary: string;
}

export interface EducationItem {
  id: string;
  institution: string;
  degree: string;
  period: string;
  status: string;
}

export const STEVBEQ_PROFILE = {
  handle: "StevBeq",
  handleSplit: ["STEV", "BEQ"] as const,
  fullName: "Steven Arnaldo Setiawan",
  role: "Fullstack Web & Mobile Developer",
  tagline:
    "Fullstack web & mobile developer. One person, both platforms — from the database schema to the last frame of motion.",
  bioScrubText:
    "Steven Arnaldo Setiawan — a fullstack developer in Yogyakarta who treats every product as one continuous system. React, Next.js, and Laravel for the web. Flutter and Dart for mobile. PostgreSQL and Supabase underneath.",
  location: {
    city: "Sleman, Yogyakarta",
    country: "Indonesia",
    timezone: "UTC+7 (WIB)",
  },
  contact: {
    email: "stevenarnald@gmail.com",
    phone: "+62 877-3928-0104",
    github: "https://github.com/StevBeq",
    githubUsername: "StevBeq",
  },
} as const;

export const STEVBEQ_PROJECTS: ProjectItem[] = [
  {
    id: "proof-of-grudge",
    index: "01",
    title: "Proof-Of-Grudge",
    subtitle: "Adversarial MPC Dead-Man's Switch",
    category: "Web App · Next.js · NEAR MPC",
    year: "2026",
    description:
      "Oracle-free adversarial dead-man's switch on NEAR Testnet with keyless deployment (keys: []) and deterministic Sepolia ETH releases via NEAR Chain Signatures (MPC), replacing trusted guardians with symmetrical grief-resistant bonds.",
    highlights: [
      "Keyless contract deployment (keys: []) for trustless execution",
      "Cross-chain deterministic Sepolia ETH release via NEAR MPC Chain Signatures",
      "Symmetrical grief-resistant bond mechanics replacing third-party guardians",
    ],
    stack: ["TypeScript", "Next.js", "NEAR Protocol", "MPC Signatures", "Sepolia ETH", "Tailwind CSS", "Vercel"],
    githubUrl: "https://github.com/StevBeq/Proof-Of-Grudge",
    liveUrl: "https://proof-of-grudge.vercel.app",
    accentColor: "#FF4D00",
    previewType: "web",
    previewImages: ["/assets/projects/proof-of-grudge.svg"],
    stageGradient: "from-[#2D1810] via-[#1B1215] to-[#0D0E14]",
  },
  {
    id: "kwaktodo",
    index: "02",
    title: "KwakTodo",
    subtitle: "Cross-Platform Mobile Task Engine",
    category: "Mobile App · Flutter · Dart",
    year: "2025",
    description:
      "Native-feel cross-platform mobile task and workflow manager engineered with Flutter and Dart, focused on clean state management, fast tactile interactions, and distraction-free daily planning.",
    highlights: [
      "60fps cross-platform rendering with custom Flutter widget architecture",
      "Clean local & cloud-ready reactive state flow",
      "Streamlined task prioritization and daily habit tracking",
    ],
    stack: ["Flutter", "Dart", "Firebase", "REST API"],
    githubUrl: "https://github.com/StevBeq/KwakTodo",
    accentColor: "#10B981",
    previewType: "mobile",
    previewImages: ["/assets/projects/kwaktodo-1.svg", "/assets/projects/kwaktodo-2.svg"],
    stageGradient: "from-[#064E3B] via-[#0A2E2A] to-[#081519]",
  },
  {
    id: "indo-techno-medic",
    index: "03",
    title: "Enterprise Case Study",
    subtitle: "PT. Indo Techno Medic Fullstack System",
    category: "Enterprise Web · Laravel · SQL",
    year: "2025",
    description:
      "End-to-end fullstack web application developed during a 4-month programmer tenure at PT. Indo Techno Medic, delivering structured database architecture, RESTful service layers, and responsive operational dashboards.",
    highlights: [
      "Engineered complete backend & frontend modules as Fullstack Programmer",
      "Relational database modeling and query optimization (MySQL / PostgreSQL)",
      "Role-based workflows tailored for medical/enterprise operations",
    ],
    stack: ["PHP", "Laravel", "JavaScript", "MySQL", "PostgreSQL", "Tailwind CSS", "Git"],
    accentColor: "#3B82F6",
    previewType: "web",
    previewImages: ["/assets/projects/indo-techno-medic.svg"],
    stageGradient: "from-[#172554] via-[#101C3B] to-[#0B1020]",
  },
  {
    id: "near-polygraph-krs",
    index: "04",
    title: "StevBeq Lab & Tooling",
    subtitle: "Schedule Flow KRS & near-polygraph",
    category: "Web Tooling · Vue · TypeScript",
    year: "2025–2026",
    description:
      "Collection of open-source repositories including university course scheduling automation (Schedule Flow KRS) and experimental TypeScript developer tooling (near-polygraph).",
    highlights: [
      "Interactive KRS academic schedule planner and conflict visualizer",
      "Experimental TypeScript tooling and web interface prototypes",
    ],
    stack: ["TypeScript", "React", "Vue", "Vite", "Python", "Supabase"],
    githubUrl: "https://github.com/StevBeq",
    accentColor: "#A855F7",
    previewType: "web",
    previewImages: ["/assets/projects/stevbeq-lab.svg"],
    stageGradient: "from-[#2E1065] via-[#1B1035] to-[#0D0A1A]",
  },
];

export const STEVBEQ_TECH_STACK = {
  frontendAndMobile: [
    "TypeScript",
    "JavaScript",
    "React",
    "Next.js",
    "Vue + Vite",
    "Flutter (Dart)",
    "Tailwind CSS",
    "GSAP (60fps Motion)",
  ],
  backendAndData: [
    "PHP",
    "Laravel",
    "Python",
    "REST APIs",
    "PostgreSQL",
    "MySQL",
    "Supabase",
    "Firebase",
  ],
  infraAndWeb3: [
    "Git & GitHub",
    "Vercel",
    "NEAR Testnet / MPC",
  ],
} as const;

export const STEVBEQ_EXPERIENCE: ExperienceItem[] = [
  {
    id: "itm-programmer",
    role: "Fullstack Developer (Programmer)",
    company: "PT. Indo Techno Medic",
    period: "Tenure: 4 Months",
    duration: "4 Months",
    type: "work",
    summary:
      "Completed an end-to-end enterprise case study project as a Fullstack Developer, handling database schema design, backend API engineering, and frontend interface implementation.",
  },
  {
    id: "ukm-olahraga-uty",
    role: "Head of Human Resources (Ketua Divisi SDM)",
    company: "Unit Kegiatan Mahasiswa (UKM) Olahraga — UTY",
    period: "2024 – 2025",
    duration: "1 Year",
    type: "organization",
    summary:
      "Led member recruitment, talent development, and organizational coordination across university sports divisions.",
  },
  {
    id: "hmsi-uty",
    role: "Member of Economic Resource Division (Divisi Sumber Daya Ekonomi)",
    company: "Himpunan Mahasiswa Sistem Informasi (HMSI) — UTY",
    period: "2024 – 2025",
    duration: "1 Year",
    type: "organization",
    summary:
      "Managed organizational funding initiatives, creative sponsorship programs, and student entrepreneurship activities.",
  },
];

export const STEVBEQ_EDUCATION: EducationItem[] = [
  {
    id: "ukdw-s1",
    institution: "Universitas Kristen Duta Wacana (UKDW)",
    degree: "S1 — Information Systems (Sistem Informasi)",
    period: "Entry Sept 2026",
    status: "Bachelor Track",
  },
  {
    id: "uty-d3",
    institution: "Universitas Teknologi Yogyakarta (UTY)",
    degree: "D3 — Information Systems (Sistem Informasi)",
    period: "Graduating Aug 2026",
    status: "Associate Degree",
  },
  {
    id: "sman-11",
    institution: "SMA Negeri 11 Yogyakarta",
    degree: "Natural Sciences (IPA)",
    period: "Graduated 2023",
    status: "High School Diploma",
  },
];
