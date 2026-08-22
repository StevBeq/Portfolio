import type { Metadata } from 'next';
import { Space_Grotesk, Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-jetbrains-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'Steven — Fullstack Software Engineer & Systems Architect',
  description:
    'Professional portfolio showcasing high-impact fullstack engineering projects, work experiences, and tech stack capabilities.',
  keywords: ['Fullstack Engineer', 'Next.js', 'TypeScript', 'Supabase', 'Software Developer', 'Steven Portfolio'],
  authors: [{ name: 'Steven' }],
  openGraph: {
    title: 'Steven — Fullstack Software Engineer',
    description: 'Explore high-impact projects, tech stack, and experience.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`dark ${spaceGrotesk.variable} ${inter.variable} ${jetbrainsMono.variable}`}
    >
      <body className="antialiased selection:bg-[#FFB800]/30 selection:text-[#FFB800]">
        {children}
      </body>
    </html>
  );
}
