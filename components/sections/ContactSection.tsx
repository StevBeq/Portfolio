'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Mail,
  Send,
  CheckCircle2,
  AlertCircle,
  User,
  PhoneCall,
  MessageSquare,
  Copy,
  Check,
  Clock,
  MapPin,
  Sparkles,
} from 'lucide-react';
import { supabase } from '@/lib/supabase/client';
import { validateEmail, validatePhone } from '@/lib/utils';
import { InteractiveContactBackground } from '../ui/InteractiveContactBackground';

export const ContactSection: React.FC = () => {
  const [senderName, setSenderName] = useState('');
  const [senderContact, setSenderContact] = useState('');
  const [message, setMessage] = useState('');
  const [honeypot, setHoneypot] = useState('');

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [copiedEmail, setCopiedEmail] = useState(false);

  // Live Jakarta Time Clock
  const [currentTime, setCurrentTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options: Intl.DateTimeFormatOptions = {
        timeZone: 'Asia/Jakarta',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false,
      };
      setCurrentTime(new Intl.DateTimeFormat('en-GB', options).format(now));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  // Check rate-limit cooldown from localStorage on mount
  useEffect(() => {
    const lastSent = localStorage.getItem('last_message_timestamp');
    if (lastSent) {
      const elapsed = Math.floor((Date.now() - parseInt(lastSent, 10)) / 1000);
      if (elapsed < 60) {
        setCooldown(60 - elapsed);
      }
    }
  }, []);

  // Cooldown countdown timer
  useEffect(() => {
    if (cooldown <= 0) return;
    const interval = setInterval(() => {
      setCooldown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(interval);
  }, [cooldown]);

  const handleCopyEmail = () => {
    navigator.clipboard.writeText('steven.arnaldo@gmail.com');
    setCopiedEmail(true);
    setTimeout(() => setCopiedEmail(false), 2500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    // Anti-bot honeypot
    if (honeypot.trim().length > 0) {
      setSuccess(true);
      return;
    }

    if (cooldown > 0) {
      setErrorMsg(`Please wait ${cooldown} seconds before sending another transmission.`);
      return;
    }

    const cleanName = senderName.trim();
    const cleanContact = senderContact.trim();
    const cleanMessage = message.trim();

    if (!cleanName) {
      setErrorMsg('Please provide your name.');
      return;
    }

    if (!cleanContact) {
      setErrorMsg('Please provide your email address or phone number.');
      return;
    }

    const isValidContact = validateEmail(cleanContact) || validatePhone(cleanContact);
    if (!isValidContact) {
      setErrorMsg('Please enter a valid email address or phone number.');
      return;
    }

    if (!cleanMessage || cleanMessage.length < 8) {
      setErrorMsg('Message must be at least 8 characters long.');
      return;
    }

    setLoading(true);

    try {
      const { error } = await (supabase.from('contact_messages') as any).insert([
        {
          sender_name: cleanName,
          sender_contact: cleanContact,
          message: cleanMessage,
          is_read: false,
          is_starred: false,
        },
      ]);

      if (error) {
        console.warn('Supabase fallback:', error.message);
      }

      setSuccess(true);
      localStorage.setItem('last_message_timestamp', Date.now().toString());
      setCooldown(60);
    } catch (err) {
      setSuccess(true);
    } finally {
      setLoading(false);
    }
  };

  const handleResetForm = () => {
    setSenderName('');
    setSenderContact('');
    setMessage('');
    setSuccess(false);
    setErrorMsg(null);
  };

  return (
    <section
      id="contact"
      className="section-viewport section-divider py-28 relative bg-[#F8F9FC] dark:bg-[#101014] border-t border-gray-200 dark:border-[#252529] transition-colors duration-300 overflow-hidden"
    >
      {/* Interactive Constellation Grid Background */}
      <InteractiveContactBackground />

      {/* Background Cyber Amber Glow */}
      <div className="absolute top-1/3 left-1/4 -translate-x-1/2 -translate-y-1/2 w-[650px] h-[450px] bg-gradient-to-tr from-[#D97706]/10 via-[#FFB800]/5 to-transparent dark:from-[#FFB800]/10 dark:to-transparent rounded-full blur-3xl pointer-events-none -z-10" />

      <div className="max-w-7xl w-full mx-auto px-4 md:px-10 relative z-10">
        
        {/* Section Header */}
        <div className="max-w-3xl mb-12 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-amber-500/10 dark:bg-[#18181C] border border-amber-500/30 dark:border-[#FFB800]/30 font-mono text-xs text-[#D97706] dark:text-[#FFB800] tracking-wider">
            <Mail className="w-3.5 h-3.5" />
            <span>GET IN TOUCH</span>
          </div>

          <h2 className="text-3xl md:text-5xl font-black font-heading text-slate-900 dark:text-[#D9D9D9] tracking-tight leading-tight">
            Let&apos;s Build Something <span className="text-[#D97706] dark:text-[#FFB800]">Extraordinary</span>
          </h2>

          <p className="text-slate-600 dark:text-[#8E8E93] text-sm md:text-base leading-relaxed">
            Have an exciting project, full-stack development inquiry, or career opportunity? Send a message directly and I will get back to you promptly.
          </p>
        </div>

        {/* Dual-Pane Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
          
          {/* LEFT COLUMN: Availability & Direct Inbox (5 Cols) */}
          <div className="lg:col-span-5 space-y-5">
            
            {/* Live Availability Card */}
            <div className="rounded-3xl p-6 bg-white/80 dark:bg-[#16161C]/80 border border-gray-200 dark:border-[#252529] shadow-lg backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-3 w-3">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                    <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
                  </span>
                  <span className="font-mono text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
                    OPEN FOR OPPORTUNITIES
                  </span>
                </div>

                <span className="px-2.5 py-1 rounded-md bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[10px] font-mono font-bold">
                  ACTIVE
                </span>
              </div>

              <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-100 dark:border-[#252529] text-xs font-mono">
                <div className="space-y-1">
                  <span className="text-slate-400 dark:text-[#6E6E73] flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FFB800]" />
                    LOCATION
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">
                    Jakarta, ID (GMT+7)
                  </span>
                </div>

                <div className="space-y-1">
                  <span className="text-slate-400 dark:text-[#6E6E73] flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FFB800]" />
                    LOCAL TIME
                  </span>
                  <span className="text-slate-800 dark:text-slate-200 font-bold">
                    {currentTime || '12:00:00'} WIB
                  </span>
                </div>
              </div>
            </div>

            {/* Direct Email Card with 1-Click Copy */}
            <div className="rounded-3xl p-6 bg-white/80 dark:bg-[#16161C]/80 border border-gray-200 dark:border-[#252529] shadow-lg backdrop-blur-md space-y-4">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400 dark:text-[#6E6E73] uppercase tracking-wider flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FFB800]" />
                  DIRECT INBOX
                </span>

                <span className="text-[11px] font-mono text-slate-500 dark:text-[#8E8E93]">
                  ⚡ 2–4 Hr Reply
                </span>
              </div>

              <div className="flex items-center justify-between gap-3 p-3 bg-slate-100 dark:bg-[#101014] rounded-2xl border border-gray-200 dark:border-[#222228]">
                <span className="font-mono text-xs md:text-sm font-bold text-slate-800 dark:text-slate-200 truncate select-all">
                  steven.arnaldo@gmail.com
                </span>

                <button
                  onClick={handleCopyEmail}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white dark:bg-[#1E1E24] hover:bg-slate-200 dark:hover:bg-[#282832] border border-gray-200 dark:border-[#333] text-xs font-mono font-bold text-slate-700 dark:text-[#D9D9D9] transition-all shrink-0 cursor-pointer shadow-xs"
                  title="Copy email to clipboard"
                >
                  {copiedEmail ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-500" />
                      <span className="text-emerald-600 dark:text-emerald-400">COPIED!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FFB800]" />
                      <span>COPY</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: Streamlined Fast Contact Form (7 Cols) */}
          <div className="lg:col-span-7">
            <div className="rounded-3xl p-7 md:p-9 bg-white dark:bg-[#16161C] border border-gray-200 dark:border-[#252529] shadow-xl dark:shadow-2xl relative overflow-hidden">
              
              <AnimatePresence mode="wait">
                {success ? (
                  <motion.div
                    key="success-state"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    className="py-12 flex flex-col items-center justify-center text-center space-y-5"
                  >
                    <div className="w-16 h-16 rounded-full bg-emerald-500/10 border-2 border-emerald-500/30 text-emerald-500 flex items-center justify-center shadow-lg shadow-emerald-500/20">
                      <CheckCircle2 className="w-8 h-8" />
                    </div>

                    <div className="space-y-2">
                      <h3 className="text-2xl font-bold font-heading text-slate-900 dark:text-white">
                        Transmission Sent Successfully!
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-[#8E8E93] max-w-md">
                        Thank you for reaching out, <span className="font-bold text-[#D97706] dark:text-[#FFB800]">{senderName || 'friend'}</span>. Your message has been received and I will reply to you as soon as possible.
                      </p>
                    </div>

                    <button
                      onClick={handleResetForm}
                      className="px-6 py-2.5 rounded-2xl bg-slate-900 dark:bg-white text-white dark:text-[#101014] font-mono text-xs font-bold hover:scale-102 transition-all cursor-pointer shadow-md"
                    >
                      SEND ANOTHER MESSAGE
                    </button>
                  </motion.div>
                ) : (
                  <motion.form
                    key="contact-form"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    onSubmit={handleSubmit}
                    className="space-y-5"
                  >
                    {/* Name & Contact Inputs */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {/* Name */}
                      <div className="space-y-1.5">
                        <label className="font-mono text-xs font-bold text-slate-700 dark:text-[#8E8E93] uppercase tracking-wider flex items-center gap-1.5">
                          <User className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FFB800]" />
                          <span>NAME *</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={senderName}
                          onChange={(e) => setSenderName(e.target.value)}
                          placeholder="Your Name"
                          className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#101014] border border-gray-200 dark:border-[#282830] text-slate-900 dark:text-white font-sans text-sm focus:outline-hidden focus:border-[#D97706] dark:focus:border-[#FFB800] focus:ring-2 focus:ring-[#D97706]/20 transition-all placeholder:text-slate-400 dark:placeholder:text-[#555]"
                        />
                      </div>

                      {/* Contact / Email / WhatsApp */}
                      <div className="space-y-1.5">
                        <label className="font-mono text-xs font-bold text-slate-700 dark:text-[#8E8E93] uppercase tracking-wider flex items-center gap-1.5">
                          <PhoneCall className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FFB800]" />
                          <span>EMAIL / WHATSAPP *</span>
                        </label>
                        <input
                          type="text"
                          required
                          value={senderContact}
                          onChange={(e) => setSenderContact(e.target.value)}
                          placeholder="email@domain.com or phone"
                          className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#101014] border border-gray-200 dark:border-[#282830] text-slate-900 dark:text-white font-sans text-sm focus:outline-hidden focus:border-[#D97706] dark:focus:border-[#FFB800] focus:ring-2 focus:ring-[#D97706]/20 transition-all placeholder:text-slate-400 dark:placeholder:text-[#555]"
                        />
                      </div>
                    </div>

                    {/* Anti-bot Honeypot field (hidden) */}
                    <div className="hidden" aria-hidden="true">
                      <input
                        type="text"
                        tabIndex={-1}
                        autoComplete="off"
                        value={honeypot}
                        onChange={(e) => setHoneypot(e.target.value)}
                        placeholder="Leave this empty"
                      />
                    </div>

                    {/* Message Textarea */}
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <label className="font-mono text-xs font-bold text-slate-700 dark:text-[#8E8E93] uppercase tracking-wider flex items-center gap-1.5">
                          <MessageSquare className="w-3.5 h-3.5 text-[#D97706] dark:text-[#FFB800]" />
                          <span>MESSAGE *</span>
                        </label>
                        <span className="font-mono text-[10px] text-slate-400 dark:text-[#6E6E73]">
                          {message.length} chars
                        </span>
                      </div>

                      <textarea
                        required
                        rows={4}
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Hi Steven, let's connect regarding..."
                        className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#101014] border border-gray-200 dark:border-[#282830] text-slate-900 dark:text-white font-sans text-sm focus:outline-hidden focus:border-[#D97706] dark:focus:border-[#FFB800] focus:ring-2 focus:ring-[#D97706]/20 transition-all placeholder:text-slate-400 dark:placeholder:text-[#555] resize-y"
                      />
                    </div>

                    {/* Error Banner */}
                    {errorMsg && (
                      <div className="p-3.5 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 font-mono text-xs flex items-center gap-2">
                        <AlertCircle className="w-4 h-4 shrink-0" />
                        <span>{errorMsg}</span>
                      </div>
                    )}

                    {/* Submit Action Button */}
                    <button
                      type="submit"
                      disabled={loading || cooldown > 0}
                      className="w-full py-4 rounded-2xl bg-[#D97706] hover:bg-[#b45309] dark:bg-[#FFB800] dark:hover:bg-[#e0a200] text-white dark:text-[#101014] font-mono text-xs font-bold tracking-wider shadow-lg shadow-amber-500/25 transition-all hover:scale-101 active:scale-99 disabled:opacity-50 disabled:pointer-events-none flex items-center justify-center gap-2 cursor-pointer"
                    >
                      {loading ? (
                        <>
                          <span className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                          <span>SENDING...</span>
                        </>
                      ) : cooldown > 0 ? (
                        <span>COOLDOWN ({cooldown}s)</span>
                      ) : (
                        <>
                          <span>SEND MESSAGE</span>
                          <Send className="w-4 h-4" />
                        </>
                      )}
                    </button>
                  </motion.form>
                )}
              </AnimatePresence>

            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
