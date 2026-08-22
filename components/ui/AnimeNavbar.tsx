'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Terminal, Sun, Moon, Lock, Menu, X } from 'lucide-react';
import Link from 'next/link';

interface NavItem {
  id: string;
  label: string;
  href: string;
}

const navItems: NavItem[] = [
  { id: 'hero', label: 'Home', href: '#hero' },
  { id: 'about', label: 'About', href: '#about' },
  { id: 'tech', label: 'Stack', href: '#tech' },
  { id: 'projects', label: 'Projects', href: '#projects' },
  { id: 'experience', label: 'Experience', href: '#experience' },
  { id: 'contact', label: 'Contact', href: '#contact' },
];

export const AnimeNavbar: React.FC = () => {
  const [activeTab, setActiveTab] = useState('hero');
  const [isDark, setIsDark] = useState(true);
  const [mobileOpen, setMobileOpen] = useState(false);

  // Scroll visibility & compaction logic
  const [isScrolledDown, setIsScrolledDown] = useState(false);
  const [navVisible, setNavVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedTheme = localStorage.getItem('portfolio_theme');
      if (savedTheme === 'light') {
        document.documentElement.classList.remove('dark');
        setIsDark(false);
      } else {
        document.documentElement.classList.add('dark');
        setIsDark(true);
      }
    }

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      // Determine active section based on scroll position
      const scrollPos = currentScrollY + 200;
      for (const item of navItems) {
        const el = document.getElementById(item.id);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPos >= top && scrollPos < top + height) {
            setActiveTab(item.id);
            break;
          }
        }
      }

      if (currentScrollY > 100) {
        setIsScrolledDown(true);
        if (currentScrollY > lastScrollY.current + 10) {
          setNavVisible(false);
        } else if (currentScrollY < lastScrollY.current - 5) {
          setNavVisible(true);
        }
      } else {
        setIsScrolledDown(false);
        setNavVisible(true);
      }

      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('portfolio_theme', 'light');
      setIsDark(false);
    } else {
      document.documentElement.classList.add('dark');
      localStorage.setItem('portfolio_theme', 'dark');
      setIsDark(true);
    }
  };

  return (
    <header className="fixed top-4 inset-x-0 z-50 flex justify-center px-4 pointer-events-none">
      <motion.div
        animate={{
          y: navVisible ? 0 : -80,
          opacity: navVisible ? (isScrolledDown ? 0.95 : 1) : 0,
          scale: isScrolledDown ? 0.96 : 1,
        }}
        transition={{ type: 'spring', stiffness: 300, damping: 25 }}
        onMouseEnter={() => setNavVisible(true)}
        className="pointer-events-auto flex items-center justify-between gap-3 px-4 py-2 rounded-full bg-white/90 dark:bg-[#18181C]/90 text-slate-900 dark:text-[#D9D9D9] border border-amber-500/30 dark:border-[#FFB800]/30 shadow-lg backdrop-blur-xl transition-colors duration-300 max-w-4xl w-full"
      >
        {/* Brand Logo */}
        <Link
          href="#hero"
          className="flex items-center gap-2 text-[#D97706] dark:text-[#FFB800] font-mono text-sm font-bold tracking-wider hover:opacity-80 transition-opacity"
        >
          <Terminal className="w-4 h-4" />
          <span>STEVEN.SYS</span>
        </Link>

        {/* Desktop Nav Items */}
        <nav className="hidden md:flex items-center gap-1 bg-slate-100 dark:bg-[#101014]/60 p-1 rounded-full border border-slate-200 dark:border-white/5">
          {navItems.map((item) => {
            const isActive = activeTab === item.id;
            return (
              <a
                key={item.id}
                href={item.href}
                onClick={() => setActiveTab(item.id)}
                className={`relative px-4 py-1.5 text-xs font-mono rounded-full transition-colors ${
                  isActive
                    ? 'text-white dark:text-[#101014] font-bold'
                    : 'text-slate-600 dark:text-[#8E8E93] hover:text-slate-900 dark:hover:text-[#D9D9D9]'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="active-pill"
                    className="absolute inset-0 bg-[#D97706] dark:bg-[#FFB800] rounded-full shadow-amber-glow"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{item.label}</span>
              </a>
            );
          })}
        </nav>

        {/* Quick Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-white/10 text-slate-700 dark:text-[#8E8E93] hover:text-[#D97706] dark:hover:text-[#FFB800] transition-colors"
            title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <Link
            href="/admin"
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-mono rounded-full border border-[#D97706]/40 dark:border-[#FFB800]/40 text-[#D97706] dark:text-[#FFB800] hover:bg-[#D97706]/10 dark:hover:bg-[#FFB800]/10 transition-colors"
            title="Admin CMS Portal"
          >
            <Lock className="w-3 h-3" />
            <span className="hidden sm:inline">ADMIN</span>
          </Link>

          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-full text-slate-700 dark:text-[#8E8E93] hover:text-[#D97706] dark:hover:text-[#FFB800]"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </motion.div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="pointer-events-auto md:hidden absolute top-16 inset-x-4 p-4 rounded-2xl bg-white/95 dark:bg-[#18181C]/95 border border-slate-200 dark:border-[#FFB800]/30 flex flex-col gap-2 shadow-2xl backdrop-blur-xl"
          >
            {navItems.map((item) => (
              <a
                key={item.id}
                href={item.href}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileOpen(false);
                }}
                className={`px-4 py-2 text-sm font-mono rounded-xl transition-colors ${
                  activeTab === item.id
                    ? 'bg-[#D97706] dark:bg-[#FFB800] text-white dark:text-[#101014] font-bold'
                    : 'text-slate-700 dark:text-[#8E8E93] hover:bg-slate-100 dark:hover:bg-white/5'
                }`}
              >
                {item.label}
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
};

