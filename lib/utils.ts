import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Transforms any standard YouTube link, shortened URL, or embed link
 * into a clean, ad-free YouTube Embed URL with parameters (`modestbranding=1&rel=0`).
 */
export function parseYouTubeEmbedUrl(url: string | null | undefined): string | null {
  if (!url) return null;
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    let videoId = '';

    if (trimmed.includes('youtube.com/embed/')) {
      const match = trimmed.match(/youtube\.com\/embed\/([^?&/#]+)/);
      if (match && match[1]) videoId = match[1];
    } else if (trimmed.includes('youtu.be/')) {
      const match = trimmed.match(/youtu\.be\/([^?&/#]+)/);
      if (match && match[1]) videoId = match[1];
    } else if (trimmed.includes('youtube.com/watch')) {
      const urlObj = new URL(trimmed);
      videoId = urlObj.searchParams.get('v') || '';
    } else if (/^[a-zA-Z0-9_-]{11}$/.test(trimmed)) {
      videoId = trimmed;
    }

    if (!videoId) return null;

    return `https://www.youtube-nocookie.com/embed/${videoId}?modestbranding=1&rel=0&controls=1&autoplay=0`;
  } catch {
    return null;
  }
}

export function validateEmail(email: string): boolean {
  const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return re.test(email.trim());
}

export function validatePhone(phone: string): boolean {
  const re = /^(\+?\d{1,4}[-.\s]?)?(\(?\d{2,5}\)?[-.\s]?)?\d{3,5}[-.\s]?\d{3,5}$/;
  return re.test(phone.trim());
}

export function formatDate(dateString: string | null | undefined): string {
  if (!dateString) return 'Present';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
}

export function formatDateRange(
  startDate: string,
  endDate: string | null,
  isCurrent: boolean
): string {
  const start = formatDate(startDate);
  if (isCurrent || !endDate) return `${start} — Present`;
  const end = formatDate(endDate);
  return `${start} — ${end}`;
}
