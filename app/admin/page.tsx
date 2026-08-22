'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldAlert,
  Lock,
  Inbox,
  UserCog,
  FolderKanban,
  Briefcase,
  ExternalLink,
  LogOut,
  Plus,
  Trash2,
  Check,
  Star,
  Upload,
  Eye,
  X,
  Save,
  CheckCircle2,
  FileText,
  Building2,
  Calendar,
  Sparkles,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { Profile, Project, Experience, ContactMessage, ExpType, ProjectCategory, ProjectStatus } from '@/lib/supabase/types';
import { parseYouTubeEmbedUrl, formatDate } from '@/lib/utils';

export default function AdminDashboardPage() {
  // Passcode Auth Lock State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [passcode, setPasscode] = useState<string>('');
  const [authError, setAuthError] = useState<string | null>(null);

  // Tab State: 'inbox' | 'profile' | 'projects' | 'experience'
  const [activeTab, setActiveTab] = useState<'inbox' | 'profile' | 'projects' | 'experience'>('inbox');

  // Data States
  const [profile, setProfile] = useState<Partial<Profile>>({});
  const [projects, setProjects] = useState<Project[]>([]);
  const [experiences, setExperiences] = useState<Experience[]>([]);
  const [messages, setMessages] = useState<ContactMessage[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form States for Editing/Adding
  const [editingProject, setEditingProject] = useState<Partial<Project> | null>(null);
  const [projectImagesInput, setProjectImagesInput] = useState<string>('');
  const [editingExperience, setEditingExperience] = useState<Partial<Experience> | null>(null);

  // File Upload State (Base64)
  const [heroAvatarPreview, setHeroAvatarPreview] = useState<string | null>(null);
  const [aboutAvatarPreview, setAboutAvatarPreview] = useState<string | null>(null);
  const [resumePreview, setResumePreview] = useState<string | null>(null);

  // Check auth session from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem('admin_session');
    if (savedAuth === 'authenticated') {
      setIsAuthenticated(true);
    }
  }, []);

  // Fetch all admin data when authenticated
  useEffect(() => {
    if (!isAuthenticated) return;
    fetchAdminData();
  }, [isAuthenticated]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Default admin secret passcode (configurable or admin pass)
    if (passcode.trim() === 'admin123' || passcode.trim() === 'steven2026') {
      setIsAuthenticated(true);
      localStorage.setItem('admin_session', 'authenticated');
      setAuthError(null);
      showToast('Welcome back, Admin!');
    } else {
      setAuthError('Invalid administrator passcode. Please try again.');
    }
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    localStorage.removeItem('admin_session');
  };

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      // 1. Profile
      const { data: profData } = await (supabase.from('profile') as any).select('*').single();
      if (profData) {
        const typedProf = profData as Profile;
        setProfile(typedProf);
        if (typedProf.hero_avatar_url) setHeroAvatarPreview(typedProf.hero_avatar_url);
        if (typedProf.about_avatar_url) setAboutAvatarPreview(typedProf.about_avatar_url);
        if (typedProf.resume_url) setResumePreview(typedProf.resume_url);
      }

      // 2. Projects
      const { data: projData } = await (supabase
        .from('projects') as any)
        .select('*, project_images(*)')
        .order('order_index', { ascending: true });
      if (projData) setProjects(projData as Project[]);

      // 3. Experiences
      const { data: expData } = await (supabase
        .from('experiences') as any)
        .select('*')
        .order('order_index', { ascending: true });
      if (expData) setExperiences(expData as Experience[]);

      // 4. Contact Messages
      const { data: msgData } = await (supabase
        .from('contact_messages') as any)
        .select('*')
        .order('created_at', { ascending: false });
      if (msgData) setMessages(msgData as ContactMessage[]);
    } catch (err) {
      console.warn('Admin fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Helper function to convert File to Base64 Data URL
  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (error) => reject(error);
    });
  };

  // Handle Hero Avatar File Change (Max 5MB)
  const handleHeroAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }
    const base64 = await fileToBase64(file);
    setHeroAvatarPreview(base64);
    setProfile((prev) => ({ ...prev, hero_avatar_url: base64 }));
    showToast('Hero avatar uploaded (base64 preview ready)');
  };

  // Handle About Avatar File Change (Max 5MB)
  const handleAboutAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      alert('File size exceeds 5MB limit.');
      return;
    }
    const base64 = await fileToBase64(file);
    setAboutAvatarPreview(base64);
    setProfile((prev) => ({ ...prev, about_avatar_url: base64 }));
    showToast('About avatar uploaded (base64 preview ready)');
  };

  // Handle Resume PDF File Change (Max 10MB)
  const handleResumeUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 10 * 1024 * 1024) {
      alert('PDF File size exceeds 10MB limit.');
      return;
    }
    const base64 = await fileToBase64(file);
    setResumePreview(base64);
    setProfile((prev) => ({ ...prev, resume_url: base64 }));
    showToast('Resume PDF uploaded (base64 ready)');
  };

  // Save Profile Changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const payload = {
        full_name: profile.full_name || 'Steven',
        title: profile.title || 'Fullstack Engineer',
        hero_bio: profile.hero_bio || '',
        about_bio: profile.about_bio || '',
        hero_avatar_url: profile.hero_avatar_url || null,
        about_avatar_url: profile.about_avatar_url || null,
        resume_url: profile.resume_url || null,
        social_links: profile.social_links || {},
        updated_at: new Date().toISOString(),
      };

      if (profile.id) {
        await (supabase.from('profile') as any).update(payload).eq('id', profile.id);
      } else {
        await (supabase.from('profile') as any).insert([payload]);
      }
      showToast('Profile updated successfully!');
      fetchAdminData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error updating profile';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  // Message Actions
  const handleToggleRead = async (id: string, currentRead: boolean) => {
    await (supabase.from('contact_messages') as any).update({ is_read: !currentRead }).eq('id', id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_read: !currentRead } : m))
    );
    showToast('Message status updated.');
  };

  const handleToggleStar = async (id: string, currentStar: boolean) => {
    await (supabase.from('contact_messages') as any).update({ is_starred: !currentStar }).eq('id', id);
    setMessages((prev) =>
      prev.map((m) => (m.id === id ? { ...m, is_starred: !currentStar } : m))
    );
  };

  const handleDeleteMessage = async (id: string) => {
    if (!confirm('Are you sure you want to permanently hard-delete this message?')) return;
    await (supabase.from('contact_messages') as any).delete().eq('id', id);
    setMessages((prev) => prev.filter((m) => m.id !== id));
    showToast('Message permanently deleted.');
  };

  // Project Actions (Save / Delete)
  const handleSaveProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingProject) return;
    setLoading(true);

    try {
      const slug =
        editingProject.slug ||
        editingProject.title?.toLowerCase().replace(/[^a-z0-9]+/g, '-') ||
        `proj-${Date.now()}`;

      const techArray = typeof editingProject.tech_stack === 'string'
        ? (editingProject.tech_stack as string).split(',').map((s) => s.trim()).filter(Boolean)
        : editingProject.tech_stack || [];

      const payload = {
        title: editingProject.title || 'Untitled Project',
        slug,
        description: editingProject.description || '',
        demo_video_url: editingProject.demo_video_url || null,
        github_url: editingProject.github_url || null,
        live_url: editingProject.live_url || null,
        category: (editingProject.category || 'completed') as ProjectCategory,
        status: (editingProject.status || 'published') as ProjectStatus,
        is_featured: editingProject.is_featured || false,
        tech_stack: techArray,
        order_index: editingProject.order_index || 0,
      };

      let projId = editingProject.id;
      if (projId) {
        await (supabase.from('projects') as any).update(payload).eq('id', projId);
      } else {
        const { data } = await (supabase.from('projects') as any).insert([payload]).select().single();
        if (data) projId = data.id;
      }

      // Process image URLs if provided
      if (projId && projectImagesInput.trim()) {
        const urls = projectImagesInput.split('\n').map((u) => u.trim()).filter(Boolean);
        // Clear existing & insert new
        await (supabase.from('project_images') as any).delete().eq('project_id', projId);
        const imgInserts = urls.map((url, idx) => ({
          project_id: projId,
          image_url: url,
          is_thumbnail: idx === 0,
          order_index: idx,
        }));
        await (supabase.from('project_images') as any).insert(imgInserts);
      }

      showToast('Project saved successfully!');
      setEditingProject(null);
      setProjectImagesInput('');
      fetchAdminData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving project';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteProject = async (id: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    await (supabase.from('projects') as any).delete().eq('id', id);
    showToast('Project deleted.');
    fetchAdminData();
  };

  // Experience Actions (Save / Delete)
  const handleSaveExperience = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingExperience) return;
    setLoading(true);

    try {
      const payload = {
        role: editingExperience.role || '',
        organization_name: editingExperience.organization_name || '',
        type: (editingExperience.type || 'work') as ExpType,
        start_date: editingExperience.start_date || new Date().toISOString().split('T')[0],
        end_date: editingExperience.is_current ? null : editingExperience.end_date || null,
        is_current: editingExperience.is_current || false,
        description: editingExperience.description || '',
        order_index: editingExperience.order_index || 0,
      };

      if (editingExperience.id) {
        await (supabase.from('experiences') as any).update(payload).eq('id', editingExperience.id);
      } else {
        await (supabase.from('experiences') as any).insert([payload]);
      }

      showToast('Experience saved successfully!');
      setEditingExperience(null);
      fetchAdminData();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error saving experience';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience entry?')) return;
    await (supabase.from('experiences') as any).delete().eq('id', id);
    showToast('Experience deleted.');
    fetchAdminData();
  };

  const unreadCount = messages.filter((m) => !m.is_read).length;

  // --------------------------------------------------------------------------
  // AUTH OVERLAY PASSCODE GATE
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#101014] text-[#D9D9D9] flex items-center justify-center p-4">
        <div className="w-full max-w-md glass-panel p-8 rounded-2xl border border-[#FFB800]/40 shadow-amber-glow space-y-6">
          <div className="text-center space-y-2">
            <div className="w-12 h-12 rounded-xl bg-[#FFB800]/10 border border-[#FFB800] text-[#FFB800] flex items-center justify-center mx-auto shadow-amber-glow">
              <Lock className="w-6 h-6" />
            </div>
            <h1 className="text-2xl font-bold font-heading text-[#D9D9D9]">
              ADMIN ACCESS GATE
            </h1>
            <p className="font-mono text-xs text-[#8E8E93]">
              Authorized personnel only. Enter security passcode.
            </p>
          </div>

          {authError && (
            <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 font-mono text-xs text-center flex items-center gap-2 justify-center">
              <ShieldAlert className="w-4 h-4" />
              <span>{authError}</span>
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-4 font-mono text-xs">
            <div>
              <label className="block text-[#8E8E93] mb-2 uppercase">Passcode Secret</label>
              <input
                type="password"
                required
                placeholder="Enter passcode (e.g. admin123)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9] focus:border-[#FFB800] focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 rounded-xl bg-[#FFB800] text-[#101014] font-bold hover:bg-[#FFC933] shadow-amber-glow transition-all uppercase"
            >
              Authenticate & Unlock CMS
            </button>
          </form>

          <div className="text-center font-mono text-[10px] text-[#8E8E93]">
            Default passcode: <code className="text-[#FFB800]">admin123</code> or <code className="text-[#FFB800]">steven2026</code>
          </div>
        </div>
      </div>
    );
  }

  // --------------------------------------------------------------------------
  // MAIN DASHBOARD LAYOUT
  // --------------------------------------------------------------------------
  return (
    <div className="min-h-screen bg-[#101014] text-[#D9D9D9] flex flex-col md:flex-row relative">
      {/* Toast Notification */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-4 right-4 z-50 px-4 py-2.5 rounded-xl bg-[#FFB800] text-[#101014] font-mono text-xs font-bold shadow-amber-glow flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>{toastMessage}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-[#18181C] border-r border-[#252529] p-6 flex flex-col justify-between shrink-0">
        <div className="space-y-8">
          <div className="flex items-center justify-between">
            <a href="/" className="font-heading font-bold text-lg tracking-wider flex items-center gap-2 text-[#D9D9D9]">
              <span className="text-[#FFB800]">&gt;_</span>
              <span>ADMIN<span className="text-[#FFB800]">.PANEL</span></span>
            </a>
            <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-[#FFB800]/10 border border-[#FFB800]/30 text-[#FFB800]">
              v1.0
            </span>
          </div>

          <nav className="space-y-1.5 font-mono text-xs">
            <button
              onClick={() => setActiveTab('inbox')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'inbox'
                  ? 'bg-[#FFB800] text-[#101014] font-bold shadow-amber-glow'
                  : 'hover:bg-[#252529] text-[#8E8E93] hover:text-[#D9D9D9]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Inbox className="w-4 h-4" /> INBOX MESSAGES
              </span>
              {unreadCount > 0 && (
                <span className="px-1.5 py-0.5 rounded bg-[#101014] text-[#FFB800] font-bold text-[10px]">
                  {unreadCount}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('profile')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'profile'
                  ? 'bg-[#FFB800] text-[#101014] font-bold shadow-amber-glow'
                  : 'hover:bg-[#252529] text-[#8E8E93] hover:text-[#D9D9D9]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <UserCog className="w-4 h-4" /> PROFILE MANAGER
              </span>
            </button>

            <button
              onClick={() => setActiveTab('projects')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'projects'
                  ? 'bg-[#FFB800] text-[#101014] font-bold shadow-amber-glow'
                  : 'hover:bg-[#252529] text-[#8E8E93] hover:text-[#D9D9D9]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <FolderKanban className="w-4 h-4" /> PROJECTS CRUD
              </span>
            </button>

            <button
              onClick={() => setActiveTab('experience')}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl transition-all ${
                activeTab === 'experience'
                  ? 'bg-[#FFB800] text-[#101014] font-bold shadow-amber-glow'
                  : 'hover:bg-[#252529] text-[#8E8E93] hover:text-[#D9D9D9]'
              }`}
            >
              <span className="flex items-center gap-2.5">
                <Briefcase className="w-4 h-4" /> EXPERIENCES CRUD
              </span>
            </button>
          </nav>
        </div>

        <div className="pt-6 border-t border-[#252529] font-mono text-xs space-y-2">
          <a
            href="/"
            target="_blank"
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl border border-[#252529] hover:border-[#FFB800] text-[#8E8E93] hover:text-[#D9D9D9] transition-all"
          >
            <ExternalLink className="w-4 h-4" /> VIEW PUBLIC PORTFOLIO
          </a>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 px-3 py-2 rounded-xl bg-red-500/10 text-red-400 hover:bg-red-500 hover:text-white transition-all"
          >
            <LogOut className="w-4 h-4" /> LOGOUT
          </button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-6 md:p-10 max-w-5xl overflow-y-auto space-y-8">
        {/* ================================================================== */}
        {/* TAB 1: INBOX MESSAGES */}
        {/* ================================================================== */}
        {activeTab === 'inbox' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#252529] pb-4">
              <div>
                <h1 className="font-heading text-2xl font-bold">Inbox Messages</h1>
                <p className="text-xs text-[#8E8E93] font-mono">
                  Messages dispatched directly from the public contact form
                </p>
              </div>
            </div>

            <div className="rounded-xl border border-[#252529] bg-[#18181C] overflow-hidden font-mono text-xs shadow-lg">
              {messages.length === 0 ? (
                <div className="p-8 text-center text-[#8E8E93]">No messages received yet.</div>
              ) : (
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-[#101014] border-b border-[#252529] text-[#8E8E93]">
                      <th className="p-3">STATUS</th>
                      <th className="p-3">SENDER</th>
                      <th className="p-3">CONTACT</th>
                      <th className="p-3">MESSAGE</th>
                      <th className="p-3 text-right">ACTIONS</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#252529]">
                    {messages.map((m) => (
                      <tr
                        key={m.id}
                        className={m.is_read ? 'text-[#8E8E93]' : 'bg-[#FFB800]/5 font-semibold text-[#D9D9D9]'}
                      >
                        <td className="p-3">
                          <span
                            className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                              m.is_read
                                ? 'bg-[#101014] border border-[#252529] text-[#8E8E93]'
                                : 'bg-[#FFB800] text-[#101014]'
                            }`}
                          >
                            {m.is_read ? 'READ' : 'UNREAD'}
                          </span>
                        </td>
                        <td className="p-3">{m.sender_name}</td>
                        <td className="p-3">{m.sender_contact}</td>
                        <td className="p-3 truncate max-w-xs">{m.message}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleToggleStar(m.id, m.is_starred)}
                            className={`p-1.5 rounded border border-[#252529] ${
                              m.is_starred ? 'text-[#FFB800] border-[#FFB800]/40' : 'text-[#8E8E93] hover:text-[#FFB800]'
                            }`}
                            title="Toggle Star"
                          >
                            <Star className="w-4 h-4 fill-current" />
                          </button>
                          <button
                            onClick={() => handleToggleRead(m.id, m.is_read)}
                            className="p-1.5 rounded border border-[#252529] hover:border-[#FFB800] text-[#FFB800]"
                            title={m.is_read ? 'Mark Unread' : 'Mark Read'}
                          >
                            <Check className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => handleDeleteMessage(m.id)}
                            className="p-1.5 rounded border border-[#252529] hover:border-red-500 text-red-400"
                            title="Hard Delete"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </section>
        )}

        {/* ================================================================== */}
        {/* TAB 2: PROFILE MANAGER */}
        {/* ================================================================== */}
        {activeTab === 'profile' && (
          <section className="space-y-6">
            <div className="border-b border-[#252529] pb-4">
              <h1 className="font-heading text-2xl font-bold">Profile Manager</h1>
              <p className="text-xs text-[#8E8E93] font-mono">
                Manage hero text, bio narratives, avatar photos & resume file
              </p>
            </div>

            <form onSubmit={handleSaveProfile} className="space-y-6 bg-[#18181C] p-6 rounded-2xl border border-[#252529] font-mono text-xs shadow-lg">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block mb-2 text-[#8E8E93] uppercase">FULL NAME</label>
                  <input
                    type="text"
                    value={profile.full_name || ''}
                    onChange={(e) => setProfile((prev) => ({ ...prev, full_name: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9] focus:border-[#FFB800] focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block mb-2 text-[#8E8E93] uppercase">TITLE / ROLE</label>
                  <input
                    type="text"
                    value={profile.title || ''}
                    onChange={(e) => setProfile((prev) => ({ ...prev, title: e.target.value }))}
                    className="w-full px-4 py-2.5 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9] focus:border-[#FFB800] focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block mb-2 text-[#8E8E93] uppercase">HERO BIO</label>
                <textarea
                  rows={3}
                  value={profile.hero_bio || ''}
                  onChange={(e) => setProfile((prev) => ({ ...prev, hero_bio: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9] focus:border-[#FFB800] focus:outline-none resize-none"
                />
              </div>

              <div>
                <label className="block mb-2 text-[#8E8E93] uppercase">ABOUT ME BIO</label>
                <textarea
                  rows={4}
                  value={profile.about_bio || ''}
                  onChange={(e) => setProfile((prev) => ({ ...prev, about_bio: e.target.value }))}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9] focus:border-[#FFB800] focus:outline-none resize-none"
                />
              </div>

              {/* Upload Inputs Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                {/* Hero Avatar */}
                <div className="space-y-2">
                  <label className="block text-[#8E8E93] uppercase">Hero Avatar (Max 5MB)</label>
                  <div className="border-2 border-dashed border-[#252529] hover:border-[#FFB800] p-4 rounded-xl text-center cursor-pointer transition-colors bg-[#101014]/50 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleHeroAvatarUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-6 h-6 text-[#FFB800] mx-auto mb-2" />
                    <p className="text-xs text-[#D9D9D9]">Click or drag Hero Avatar</p>
                    <span className="text-[10px] text-[#8E8E93]">PNG, JPG</span>
                  </div>
                  {heroAvatarPreview && (
                    <div className="flex items-center justify-between p-2 rounded bg-[#101014] border border-[#252529]">
                      <span className="truncate text-[10px] text-[#FFB800]">Avatar Loaded</span>
                      <button
                        type="button"
                        onClick={() => {
                          setHeroAvatarPreview(null);
                          setProfile((p) => ({ ...p, hero_avatar_url: null }));
                        }}
                        className="text-red-400 text-[10px]"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* About Avatar */}
                <div className="space-y-2">
                  <label className="block text-[#8E8E93] uppercase">About Avatar (Max 5MB)</label>
                  <div className="border-2 border-dashed border-[#252529] hover:border-[#FFB800] p-4 rounded-xl text-center cursor-pointer transition-colors bg-[#101014]/50 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleAboutAvatarUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <Upload className="w-6 h-6 text-[#FFB800] mx-auto mb-2" />
                    <p className="text-xs text-[#D9D9D9]">Click or drag About Avatar</p>
                    <span className="text-[10px] text-[#8E8E93]">PNG, JPG</span>
                  </div>
                  {aboutAvatarPreview && (
                    <div className="flex items-center justify-between p-2 rounded bg-[#101014] border border-[#252529]">
                      <span className="truncate text-[10px] text-[#FFB800]">Avatar Loaded</span>
                      <button
                        type="button"
                        onClick={() => {
                          setAboutAvatarPreview(null);
                          setProfile((p) => ({ ...p, about_avatar_url: null }));
                        }}
                        className="text-red-400 text-[10px]"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>

                {/* Resume PDF */}
                <div className="space-y-2">
                  <label className="block text-[#8E8E93] uppercase">Resume CV (PDF Max 10MB)</label>
                  <div className="border-2 border-dashed border-[#252529] hover:border-[#FFB800] p-4 rounded-xl text-center cursor-pointer transition-colors bg-[#101014]/50 relative">
                    <input
                      type="file"
                      accept="application/pdf"
                      onChange={handleResumeUpload}
                      className="absolute inset-0 opacity-0 cursor-pointer"
                    />
                    <FileText className="w-6 h-6 text-[#FFB800] mx-auto mb-2" />
                    <p className="text-xs text-[#D9D9D9]">Click or drag PDF CV</p>
                    <span className="text-[10px] text-[#8E8E93]">PDF Format</span>
                  </div>
                  {resumePreview && (
                    <div className="flex items-center justify-between p-2 rounded bg-[#101014] border border-[#252529]">
                      <span className="truncate text-[10px] text-[#FFB800]">PDF Attached</span>
                      <button
                        type="button"
                        onClick={() => {
                          setResumePreview(null);
                          setProfile((p) => ({ ...p, resume_url: null }));
                        }}
                        className="text-red-400 text-[10px]"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="flex items-center gap-2 px-6 py-3 rounded-xl bg-[#FFB800] text-[#101014] font-bold hover:bg-[#FFC933] shadow-amber-glow transition-all"
              >
                <Save className="w-4 h-4" />
                <span>SAVE PROFILE CHANGES</span>
              </button>
            </form>
          </section>
        )}

        {/* ================================================================== */}
        {/* TAB 3: PROJECTS CRUD */}
        {/* ================================================================== */}
        {activeTab === 'projects' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#252529] pb-4">
              <div>
                <h1 className="font-heading text-2xl font-bold">Projects Manager</h1>
                <p className="text-xs text-[#8E8E93] font-mono">
                  Create, edit, and organize portfolio project showcases
                </p>
              </div>
              <button
                onClick={() => {
                  setEditingProject({
                    category: 'completed',
                    status: 'published',
                    tech_stack: [],
                    is_featured: false,
                    order_index: 0,
                  });
                  setProjectImagesInput('');
                }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFB800] text-[#101014] font-mono font-bold text-xs hover:bg-[#FFC933] shadow-amber-glow"
              >
                <Plus className="w-4 h-4" /> NEW PROJECT
              </button>
            </div>

            {/* Project Edit Form */}
            {editingProject && (
              <form onSubmit={handleSaveProject} className="bg-[#18181C] p-6 rounded-2xl border border-[#FFB800]/40 space-y-4 font-mono text-xs shadow-xl">
                <div className="flex items-center justify-between border-b border-[#252529] pb-3">
                  <h3 className="font-heading text-sm font-bold text-[#FFB800]">
                    {editingProject.id ? 'EDIT PROJECT ENTRY' : 'CREATE NEW PROJECT'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="text-[#8E8E93] hover:text-[#D9D9D9]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#8E8E93] mb-1">PROJECT TITLE</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Cyberpunk FinTech Dashboard"
                      value={editingProject.title || ''}
                      onChange={(e) => setEditingProject((p) => ({ ...p, title: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8E8E93] mb-1">YOUTUBE DEMO LINK</label>
                    <input
                      type="text"
                      placeholder="e.g. https://www.youtube.com/watch?v=..."
                      value={editingProject.demo_video_url || ''}
                      onChange={(e) => setEditingProject((p) => ({ ...p, demo_video_url: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#8E8E93] mb-1">DESCRIPTION</label>
                  <textarea
                    rows={3}
                    required
                    placeholder="Project overview & technical highlights..."
                    value={editingProject.description || ''}
                    onChange={(e) => setEditingProject((p) => ({ ...p, description: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9] resize-none"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#8E8E93] mb-1">CATEGORY</label>
                    <select
                      value={editingProject.category || 'completed'}
                      onChange={(e) => setEditingProject((p) => ({ ...p, category: e.target.value as ProjectCategory }))}
                      className="w-full px-3 py-2 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9]"
                    >
                      <option value="completed">COMPLETED</option>
                      <option value="ongoing">ONGOING</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#8E8E93] mb-1">STATUS</label>
                    <select
                      value={editingProject.status || 'published'}
                      onChange={(e) => setEditingProject((p) => ({ ...p, status: e.target.value as ProjectStatus }))}
                      className="w-full px-3 py-2 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9]"
                    >
                      <option value="published">PUBLISHED</option>
                      <option value="draft">DRAFT</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#8E8E93] mb-1">TECH STACK (Comma separated)</label>
                    <input
                      type="text"
                      placeholder="React, Next.js, Supabase"
                      value={
                        Array.isArray(editingProject.tech_stack)
                          ? editingProject.tech_stack.join(', ')
                          : editingProject.tech_stack || ''
                      }
                      onChange={(e) => setEditingProject((p) => ({ ...p, tech_stack: e.target.value as unknown as string[] }))}
                      className="w-full px-3 py-2 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#8E8E93] mb-1">GITHUB URL</label>
                    <input
                      type="text"
                      placeholder="https://github.com/user/repo"
                      value={editingProject.github_url || ''}
                      onChange={(e) => setEditingProject((p) => ({ ...p, github_url: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8E8E93] mb-1">LIVE DEMO URL</label>
                    <input
                      type="text"
                      placeholder="https://myproject.com"
                      value={editingProject.live_url || ''}
                      onChange={(e) => setEditingProject((p) => ({ ...p, live_url: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[#8E8E93] mb-1">IMAGE GALLERY URLS (One URL per line)</label>
                  <textarea
                    rows={3}
                    placeholder="https://images.unsplash.com/photo-1..."
                    value={projectImagesInput}
                    onChange={(e) => setProjectImagesInput(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9] font-mono text-xs"
                  />
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#FFB800] text-[#101014] font-bold hover:bg-[#FFC933]"
                  >
                    SAVE PROJECT
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingProject(null)}
                    className="px-4 py-2.5 rounded-xl border border-[#252529] text-[#8E8E93]"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            )}

            {/* Existing Projects Table */}
            <div className="rounded-xl border border-[#252529] bg-[#18181C] overflow-hidden font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#101014] border-b border-[#252529] text-[#8E8E93]">
                    <th className="p-3">TITLE</th>
                    <th className="p-3">CATEGORY</th>
                    <th className="p-3">STATUS</th>
                    <th className="p-3">STACK</th>
                    <th className="p-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252529]">
                  {projects.map((p) => (
                    <tr key={p.id}>
                      <td className="p-3 font-semibold text-[#D9D9D9]">{p.title}</td>
                      <td className="p-3 uppercase text-[#FFB800]">{p.category}</td>
                      <td className="p-3 uppercase">{p.status}</td>
                      <td className="p-3 truncate max-w-xs">{p.tech_stack?.join(', ')}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => {
                            setEditingProject(p);
                            const imgUrls = p.project_images?.map((i) => i.image_url).join('\n') || '';
                            setProjectImagesInput(imgUrls);
                          }}
                          className="p-1.5 rounded border border-[#252529] hover:border-[#FFB800] text-[#FFB800]"
                          title="Edit Project"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProject(p.id)}
                          className="p-1.5 rounded border border-[#252529] hover:border-red-500 text-red-400"
                          title="Delete Project"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}

        {/* ================================================================== */}
        {/* TAB 4: EXPERIENCES CRUD */}
        {/* ================================================================== */}
        {activeTab === 'experience' && (
          <section className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#252529] pb-4">
              <div>
                <h1 className="font-heading text-2xl font-bold">Experiences Manager</h1>
                <p className="text-xs text-[#8E8E93] font-mono">
                  Manage work experience and organizational leadership timeline
                </p>
              </div>
              <button
                onClick={() =>
                  setEditingExperience({
                    type: 'work',
                    is_current: false,
                    start_date: new Date().toISOString().split('T')[0],
                    order_index: 0,
                  })
                }
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#FFB800] text-[#101014] font-mono font-bold text-xs hover:bg-[#FFC933] shadow-amber-glow"
              >
                <Plus className="w-4 h-4" /> NEW EXPERIENCE
              </button>
            </div>

            {/* Experience Edit Form */}
            {editingExperience && (
              <form onSubmit={handleSaveExperience} className="bg-[#18181C] p-6 rounded-2xl border border-[#FFB800]/40 space-y-4 font-mono text-xs shadow-xl">
                <div className="flex items-center justify-between border-b border-[#252529] pb-3">
                  <h3 className="font-heading text-sm font-bold text-[#FFB800]">
                    {editingExperience.id ? 'EDIT EXPERIENCE ENTRY' : 'CREATE NEW EXPERIENCE'}
                  </h3>
                  <button
                    type="button"
                    onClick={() => setEditingExperience(null)}
                    className="text-[#8E8E93] hover:text-[#D9D9D9]"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[#8E8E93] mb-1">ROLE / TITLE</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Lead Fullstack Engineer"
                      value={editingExperience.role || ''}
                      onChange={(e) => setEditingExperience((ex) => ({ ...ex, role: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8E8E93] mb-1">ORGANIZATION / COMPANY</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. TechCorp Inc."
                      value={editingExperience.organization_name || ''}
                      onChange={(e) => setEditingExperience((ex) => ({ ...ex, organization_name: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9]"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-[#8E8E93] mb-1">TYPE</label>
                    <select
                      value={editingExperience.type || 'work'}
                      onChange={(e) => setEditingExperience((ex) => ({ ...ex, type: e.target.value as ExpType }))}
                      className="w-full px-3 py-2 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9]"
                    >
                      <option value="work">WORK EXPERIENCE</option>
                      <option value="organization">ORGANIZATION / LEADERSHIP</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-[#8E8E93] mb-1">START DATE</label>
                    <input
                      type="date"
                      required
                      value={editingExperience.start_date || ''}
                      onChange={(e) => setEditingExperience((ex) => ({ ...ex, start_date: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9]"
                    />
                  </div>
                  <div>
                    <label className="block text-[#8E8E93] mb-1">END DATE (Leave empty if current)</label>
                    <input
                      type="date"
                      disabled={editingExperience.is_current}
                      value={editingExperience.end_date || ''}
                      onChange={(e) => setEditingExperience((ex) => ({ ...ex, end_date: e.target.value }))}
                      className="w-full px-3 py-2 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9] disabled:opacity-40"
                    />
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="is_current_cb"
                    checked={editingExperience.is_current || false}
                    onChange={(e) => setEditingExperience((ex) => ({ ...ex, is_current: e.target.checked }))}
                    className="accent-[#FFB800]"
                  />
                  <label htmlFor="is_current_cb" className="text-[#8E8E93]">Currently working in this role</label>
                </div>

                <div>
                  <label className="block text-[#8E8E93] mb-1">DESCRIPTION</label>
                  <textarea
                    rows={4}
                    required
                    placeholder="Responsibilities and achievements..."
                    value={editingExperience.description || ''}
                    onChange={(e) => setEditingExperience((ex) => ({ ...ex, description: e.target.value }))}
                    className="w-full px-3 py-2 rounded-xl bg-[#101014] border border-[#252529] text-[#D9D9D9] resize-none"
                  />
                </div>

                <div className="flex items-center gap-4 pt-2">
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-[#FFB800] text-[#101014] font-bold hover:bg-[#FFC933]"
                  >
                    SAVE EXPERIENCE
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingExperience(null)}
                    className="px-4 py-2.5 rounded-xl border border-[#252529] text-[#8E8E93]"
                  >
                    CANCEL
                  </button>
                </div>
              </form>
            )}

            {/* Existing Experiences Table */}
            <div className="rounded-xl border border-[#252529] bg-[#18181C] overflow-hidden font-mono text-xs">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#101014] border-b border-[#252529] text-[#8E8E93]">
                    <th className="p-3">ROLE</th>
                    <th className="p-3">ORGANIZATION</th>
                    <th className="p-3">TYPE</th>
                    <th className="p-3">DATES</th>
                    <th className="p-3 text-right">ACTIONS</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#252529]">
                  {experiences.map((ex) => (
                    <tr key={ex.id}>
                      <td className="p-3 font-semibold text-[#D9D9D9]">{ex.role}</td>
                      <td className="p-3">{ex.organization_name}</td>
                      <td className="p-3 uppercase text-[#FFB800]">{ex.type}</td>
                      <td className="p-3">
                        {formatDate(ex.start_date)} — {ex.is_current ? 'Present' : formatDate(ex.end_date)}
                      </td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => setEditingExperience(ex)}
                          className="p-1.5 rounded border border-[#252529] hover:border-[#FFB800] text-[#FFB800]"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteExperience(ex.id)}
                          className="p-1.5 rounded border border-[#252529] hover:border-red-500 text-red-400"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        )}
      </main>
    </div>
  );
}
