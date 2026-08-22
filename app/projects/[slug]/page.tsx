import React from 'react';
import { INITIAL_PROJECTS } from '@/lib/mockData';
import { ProjectDetailClient } from './ProjectDetailClient';

interface PageProps {
  params: Promise<{
    slug: string;
  }>;
}

export async function generateStaticParams() {
  return INITIAL_PROJECTS.map((project) => ({
    slug: project.slug,
  }));
}

export default async function Page({ params }: PageProps) {
  const resolvedParams = await params;
  return <ProjectDetailClient slug={resolvedParams.slug} />;
}
