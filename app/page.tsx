'use client';

import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { Profile, Experience, Project } from '@/lib/supabase/types';
import { INITIAL_PROFILE, INITIAL_PROJECTS, INITIAL_EXPERIENCES, getLocalData } from '@/lib/mockData';
import { AnimeNavbar } from '@/components/ui/AnimeNavbar';
import { HeroSection } from '@/components/sections/HeroSection';
import { AboutSection } from '@/components/sections/AboutSection';
import { TechStackSection } from '@/components/sections/TechStackSection';
import { ProjectsSection } from '@/components/sections/ProjectsSection';
import { ExperienceSection } from '@/components/sections/ExperienceSection';
import { ContactSection } from '@/components/sections/ContactSection';
import { Footer } from '@/components/sections/Footer';
import { FloatingSocialDock } from '@/components/ui/FloatingSocialDock';

export default function GuestHomePage() {
  const [profile, setProfile] = useState<Profile>(INITIAL_PROFILE);
  const [experiences, setExperiences] = useState<Experience[]>(INITIAL_EXPERIENCES);
  const [projects, setProjects] = useState<Project[]>(INITIAL_PROJECTS);

  useEffect(() => {
    async function loadPortfolioData() {
      const localProf = getLocalData<Profile>('steven_profile', INITIAL_PROFILE);
      const localProj = getLocalData<Project[]>('steven_projects', INITIAL_PROJECTS);
      const localExp = getLocalData<Experience[]>('steven_experiences', INITIAL_EXPERIENCES);

      const resolvedExp = (localExp && localExp.length >= INITIAL_EXPERIENCES.length) ? localExp : INITIAL_EXPERIENCES;
      const resolvedProj = (localProj && localProj.length >= INITIAL_PROJECTS.length) ? localProj : INITIAL_PROJECTS;

      setProfile(localProf);
      setProjects(resolvedProj);
      setExperiences(resolvedExp);

      try {
        // 1. Fetch Profile from Supabase
        const { data: profileData, error: profileErr } = await (supabase.from('profile') as any)
          .select('*')
          .single();

        if (!profileErr && profileData) {
          setProfile(profileData as Profile);
        }

        // 2. Fetch Experiences
        const { data: expData, error: expErr } = await (supabase.from('experiences') as any)
          .select('*')
          .order('order_index', { ascending: true });

        if (!expErr && expData && expData.length > 0) {
          setExperiences(expData as Experience[]);
        }

        // 3. Fetch Projects
        const { data: projData, error: projErr } = await (supabase.from('projects') as any)
          .select('*, project_images(*)')
          .eq('status', 'published')
          .order('order_index', { ascending: true });

        if (!projErr && projData && projData.length > 0) {
          setProjects(projData as Project[]);
        }
      } catch (err) {
        console.log('Operating in pure Frontend mode with local mock data.');
      }
    }

    loadPortfolioData();
  }, []);

  return (
    <div className="min-h-screen bg-[#F8F9FA] dark:bg-[#101014] text-[#111827] dark:text-[#D9D9D9] font-sans selection:bg-[#FFB800]/30 selection:text-[#FFB800] relative transition-colors duration-300">
      {/* Floating Animated Anime Navbar */}
      <AnimeNavbar />

      {/* Floating Interactive Magnetic Social Dock */}
      <FloatingSocialDock />

      {/* Main Sections */}
      <main>
        <HeroSection profile={profile} />
        <AboutSection profile={profile} />
        <TechStackSection />
        <ProjectsSection projects={projects} />
        <ExperienceSection experiences={experiences} />
        <ContactSection />
      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}
