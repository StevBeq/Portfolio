import { Profile, Project, Experience, ContactMessage } from '@/lib/supabase/types';

export const INITIAL_PROFILE: Profile = {
  id: '00000000-0000-0000-0000-000000000001',
  full_name: 'Steven Arnaldo',
  title: 'Full-Stack Software Engineer & UI/UX Architect',
  hero_bio: 'Building scalable high-performance web and mobile applications with Next.js, Flutter, and modern cloud architectures.',
  about_bio: 'Full-Stack Software Engineer & UI/UX Architect with over 3+ years of experience crafting scalable web and mobile applications. My core expertise spans Next.js, TypeScript, Supabase, and Flutter—delivering high-performance backend architectures paired with responsive 60fps user interfaces. Moving forward, my career goal is to architect enterprise-grade cloud systems and pioneer AI-integrated web platforms.',
  hero_avatar_url: '/Foto-Semi-Forma.webp',
  about_avatar_url: '/Foto-Semi-Forma.webp',
  resume_url: null,
  social_links: {
    github: 'https://github.com',
    linkedin: 'https://linkedin.com',
    instagram: 'https://instagram.com',
    twitter: 'https://twitter.com',
  },
  updated_at: new Date().toISOString(),
};

export const INITIAL_PROJECTS: Project[] = [
  {
    id: 'proj-1',
    slug: 'printpoint-mobile',
    title: 'PrintPoint — Campus Batch Document Printing Platform',
    description: 'A mobile application allowing students to batch upload PDF documents, configure print settings, calculate page counts, and process automated payments seamlessly.',
    demo_video_url: 'https://www.youtube.com/embed/dQw4w9WgXcQ',
    github_url: 'https://github.com',
    live_url: 'https://printpoint-demo.vercel.app',
    tech_stack: ['Flutter', 'Dart', 'Supabase', 'Midtrans API', 'PDF Engine'],
    category: 'completed',
    status: 'published',
    is_featured: true,
    order_index: 1,
    created_at: new Date().toISOString(),
    project_images: [
      {
        id: 'img-1-1',
        project_id: 'proj-1',
        image_url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1200&q=80',
        caption: 'PrintPoint Mobile Dashboard Overview',
        is_thumbnail: true,
        order_index: 1,
      },
      {
        id: 'img-1-2',
        project_id: 'proj-1',
        image_url: 'https://images.unsplash.com/photo-1555421689-491a97ff2040?auto=format&fit=crop&w=1200&q=80',
        caption: 'Batch Upload & Document Calculator Flow',
        is_thumbnail: false,
        order_index: 2,
      },
    ],
  },
  {
    id: 'proj-2',
    slug: 'ai-analytics-dashboard',
    title: 'NeuralPulse — AI Real-Time Data Analytics Engine',
    description: 'An enterprise dashboard providing predictive analytics, streaming chart visualizer, and custom model evaluation suites for enterprise engineering teams.',
    demo_video_url: null,
    github_url: 'https://github.com',
    live_url: 'https://neuralpulse.vercel.app',
    tech_stack: ['Next.js 15', 'React 19', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'Recharts'],
    category: 'completed',
    status: 'published',
    is_featured: true,
    order_index: 2,
    created_at: new Date().toISOString(),
    project_images: [
      {
        id: 'img-2-1',
        project_id: 'proj-2',
        image_url: 'https://images.unsplash.com/photo-1551836022-d5d88e9218df?auto=format&fit=crop&w=1200&q=80',
        caption: 'Realtime Cyber Analytics Console',
        is_thumbnail: true,
        order_index: 1,
      },
    ],
  },
  {
    id: 'proj-3',
    slug: 'cyber-storefront-v2',
    title: 'Veloce — Next-Gen E-Commerce & Inventory System',
    description: 'Ultra-fast headless commerce platform with real-time stock sync, Stripe checkout integration, and dynamic bento-grid product showcases.',
    demo_video_url: null,
    github_url: 'https://github.com',
    live_url: 'https://veloce-store.vercel.app',
    tech_stack: ['Next.js App Router', 'Zustand', 'PostgreSQL', 'Prisma', 'Tailwind CSS'],
    category: 'completed',
    status: 'published',
    is_featured: false,
    order_index: 3,
    created_at: new Date().toISOString(),
    project_images: [
      {
        id: 'img-3-1',
        project_id: 'proj-3',
        image_url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
        caption: 'Storefront Homepage Bento Layout',
        is_thumbnail: true,
        order_index: 1,
      },
    ],
  },
  {
    id: 'proj-4',
    slug: 'omnisync-devops-telemetry',
    title: 'OmniSync — Cloud DevOps & Server Telemetry Platform',
    description: 'Centralized infrastructure monitoring console tracking container health, Kubernetes cluster nodes, error budgets, and distributed latency traces in real-time.',
    demo_video_url: null,
    github_url: 'https://github.com',
    live_url: 'https://omnisync-cloud.vercel.app',
    tech_stack: ['Next.js 15', 'Go', 'Docker', 'Kubernetes', 'WebSockets', 'Tailwind CSS'],
    category: 'ongoing',
    status: 'published',
    is_featured: true,
    order_index: 4,
    created_at: new Date().toISOString(),
    project_images: [
      {
        id: 'img-4-1',
        project_id: 'proj-4',
        image_url: 'https://images.unsplash.com/photo-1504868584819-f8e8b4b6d7e3?auto=format&fit=crop&w=1200&q=80',
        caption: 'OmniSync Infrastructure Telemetry Map',
        is_thumbnail: true,
        order_index: 1,
      },
    ],
  },
];

export const INITIAL_EXPERIENCES: Experience[] = [
  // 4 Work Experiences
  {
    id: 'exp-1',
    role: 'Lead Full-Stack Engineer',
    organization_name: 'Tech Innovations Lab',
    type: 'work',
    start_date: '2024-01-01',
    end_date: null,
    is_current: true,
    description: 'Architecting high-concurrency microservices and real-time data portals.\nDesigning RESTful APIs and Supabase Row-Level Security for enterprise clients.\nOptimizing frontend rendering pipelines achieving sub-100ms LCP times.',
    order_index: 1,
    created_at: new Date().toISOString(),
  },
  {
    id: 'exp-2',
    role: 'Mobile Software Developer',
    organization_name: 'PrintPoint Solutions',
    type: 'work',
    start_date: '2023-06-01',
    end_date: '2023-12-31',
    is_current: false,
    description: 'Engineered student document batch uploading and automated print queue mobile systems using Flutter.\nIntegrated Midtrans payment gateways and real-time notification engine with Supabase.',
    order_index: 2,
    created_at: new Date().toISOString(),
  },
  {
    id: 'exp-3',
    role: 'Frontend Engineer Intern',
    organization_name: 'Nexus Digital Agency',
    type: 'work',
    start_date: '2023-01-01',
    end_date: '2023-05-31',
    is_current: false,
    description: 'Developed responsive client web portals using Next.js, TypeScript, and Tailwind CSS.\nImplemented reusable component design systems and integrated headless CMS endpoints.',
    order_index: 3,
    created_at: new Date().toISOString(),
  },
  {
    id: 'exp-4',
    role: 'Junior Web Developer',
    organization_name: 'CyberForge Studio',
    type: 'work',
    start_date: '2022-06-01',
    end_date: '2022-12-31',
    is_current: false,
    description: 'Built dynamic landing pages and RESTful API integrations with Node.js and PostgreSQL.\nCollaborated on Agile sprints and authored automated testing suites with Jest.',
    order_index: 4,
    created_at: new Date().toISOString(),
  },

  // 4 Organization & Leadership Experiences
  {
    id: 'exp-5',
    role: 'Head of Technology Division',
    organization_name: 'Computer Science Student Association',
    type: 'organization',
    start_date: '2023-01-01',
    end_date: '2023-12-31',
    is_current: false,
    description: 'Led technical division of 25+ developers organizing university-wide engineering hackathons.\nConducted full-stack workshops covering React, TypeScript, and Cloud Architecture.',
    order_index: 5,
    created_at: new Date().toISOString(),
  },
  {
    id: 'exp-6',
    role: 'Lead Hackathon Mentor',
    organization_name: 'National Tech Summit',
    type: 'organization',
    start_date: '2023-08-01',
    end_date: '2023-10-31',
    is_current: false,
    description: 'Mentored 100+ junior student developers in building production-ready AI and IoT prototypes.\nEvaluated code submissions and architectural integrity for final project judging.',
    order_index: 6,
    created_at: new Date().toISOString(),
  },
  {
    id: 'exp-7',
    role: 'Core Technical Member',
    organization_name: 'Google Developer Student Club',
    type: 'organization',
    start_date: '2022-09-01',
    end_date: '2023-07-31',
    is_current: false,
    description: 'Facilitated weekly peer study groups on mobile development with Flutter and cloud deployments.\nCo-authored open-source community learning materials and code repositories.',
    order_index: 7,
    created_at: new Date().toISOString(),
  },
  {
    id: 'exp-8',
    role: 'Public Relations & Media Lead',
    organization_name: 'Informatics Engineering Union',
    type: 'organization',
    start_date: '2021-08-01',
    end_date: '2022-08-31',
    is_current: false,
    description: 'Managed media publications, technical newsletters, and industrial sponsorship partnerships.\nIncreased student engagement across annual tech webinars by over 140%.',
    order_index: 8,
    created_at: new Date().toISOString(),
  },
];

export const INITIAL_MESSAGES: ContactMessage[] = [
  {
    id: 'msg-1',
    sender_name: 'Alex Johnson',
    sender_contact: 'alex@techcompany.com',
    message: 'Hi Steven! Loved your portfolio project. We are looking for a Senior Full-Stack developer for a project. Let us connect!',
    is_read: false,
    is_starred: true,
    created_at: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
];

// LocalStorage Helper Utilities for Pure Frontend Mode
export function getLocalData<T>(key: string, defaultVal: T): T {
  if (typeof window === 'undefined') return defaultVal;
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultVal;
  } catch {
    return defaultVal;
  }
}

export function setLocalData<T>(key: string, value: T): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.warn('Failed to save to localStorage:', err);
  }
}
