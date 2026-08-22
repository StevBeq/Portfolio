export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type ExpType = 'work' | 'organization';
export type ProjectCategory = 'completed' | 'ongoing';
export type ProjectStatus = 'draft' | 'published';

export interface Profile {
  id: string;
  full_name: string;
  title: string;
  hero_bio: string;
  about_bio: string;
  hero_avatar_url: string | null;
  about_avatar_url: string | null;
  resume_url: string | null;
  social_links: {
    github?: string;
    linkedin?: string;
    instagram?: string;
    twitter?: string;
  };
  updated_at: string;
}

export interface Experience {
  id: string;
  role: string;
  organization_name: string;
  type: ExpType;
  start_date: string;
  end_date: string | null;
  is_current: boolean;
  description: string;
  order_index: number;
  created_at: string;
}

export interface Project {
  id: string;
  slug: string;
  title: string;
  description: string;
  demo_video_url: string | null;
  github_url: string | null;
  live_url: string | null;
  tech_stack: string[];
  category: ProjectCategory;
  status: ProjectStatus;
  is_featured: boolean;
  order_index: number;
  created_at: string;
  project_images?: ProjectImage[];
}

export interface ProjectImage {
  id: string;
  project_id: string;
  image_url: string;
  caption: string | null;
  is_thumbnail: boolean;
  order_index: number;
}

export interface ContactMessage {
  id: string;
  sender_name: string;
  sender_contact: string;
  message: string;
  is_read: boolean;
  is_starred: boolean;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      profile: {
        Row: Profile;
        Insert: Omit<Profile, 'id' | 'updated_at'> & { id?: string };
        Update: Partial<Omit<Profile, 'id'>>;
      };
      experiences: {
        Row: Experience;
        Insert: Omit<Experience, 'id' | 'created_at'> & { id?: string };
        Update: Partial<Omit<Experience, 'id'>>;
      };
      projects: {
        Row: Project;
        Insert: Omit<Project, 'id' | 'created_at'> & { id?: string };
        Update: Partial<Omit<Project, 'id'>>;
      };
      project_images: {
        Row: ProjectImage;
        Insert: Omit<ProjectImage, 'id'> & { id?: string };
        Update: Partial<Omit<ProjectImage, 'id'>>;
      };
      contact_messages: {
        Row: ContactMessage;
        Insert: Omit<ContactMessage, 'id' | 'is_read' | 'is_starred' | 'created_at'> & {
          id?: string;
          is_read?: boolean;
          is_starred?: boolean;
        };
        Update: Partial<Omit<ContactMessage, 'id'>>;
      };
    };
  };
}
