'use client';

import React, { useState } from 'react';

interface PixelImageProps {
  src: string;
  alt: string;
  className?: string;
  aspectRatio?: string;
}

export const PixelImage: React.FC<PixelImageProps> = ({
  src,
  alt,
  className = '',
  aspectRatio = 'aspect-video',
}) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  return (
    <div className={`relative overflow-hidden bg-[#18181C] rounded-xl ${aspectRatio} ${className}`}>
      {/* Pixel Skeleton Loading Placeholder */}
      {!loaded && !error && (
        <div className="absolute inset-0 z-10 grid grid-cols-6 grid-rows-4 gap-1 p-2 bg-[#18181C] animate-pulse">
          {Array.from({ length: 24 }).map((_, i) => (
            <div
              key={i}
              className="bg-[#252529] rounded-sm transition-opacity duration-300"
              style={{
                opacity: (i % 3 + 1) * 0.25,
                animationDelay: `${i * 40}ms`,
              }}
            />
          ))}
        </div>
      )}

      {/* Actual Image */}
      <img
        src={src}
        alt={alt}
        onLoad={() => setLoaded(true)}
        onError={() => setError(true)}
        className={`w-full h-full object-cover transition-opacity duration-500 ${
          loaded ? 'opacity-100' : 'opacity-0'
        }`}
      />

      {/* Error Fallback */}
      {error && (
        <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#18181C] text-[#8E8E93] p-4 text-center">
          <span className="font-mono text-xs text-[#FFB800]">[IMAGE LOAD ERROR]</span>
        </div>
      )}
    </div>
  );
};
