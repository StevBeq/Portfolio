import type { Metadata } from "next";
import {
  Bricolage_Grotesque,
  Unbounded,
  Instrument_Serif,
  Plus_Jakarta_Sans,
  JetBrains_Mono,
} from "next/font/google";
import { SmoothScrollProvider } from "@/components/providers/SmoothScrollProvider";
import "./globals.css";

const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
  display: "swap",
});

const unbounded = Unbounded({
  subsets: ["latin"],
  weight: ["800", "900"],
  variable: "--font-unbounded",
  display: "swap",
});

const instrumentSerif = Instrument_Serif({
  subsets: ["latin"],
  weight: "400",
  style: "italic",
  variable: "--font-serif-italic",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ["latin"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "StevBeq — Steven Arnaldo Setiawan | Fullstack Web & Mobile Developer",
  description:
    "Portfolio of Steven Arnaldo Setiawan (StevBeq) — Fullstack Web & Mobile Developer building scalable Next.js, React, Laravel, and Flutter applications.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${bricolage.variable} ${unbounded.variable} ${instrumentSerif.variable} ${jakarta.variable} ${jetbrainsMono.variable}`}
    >
      <body>
        <SmoothScrollProvider>{children}</SmoothScrollProvider>
      </body>
    </html>
  );
}
