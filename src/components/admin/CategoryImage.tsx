'use client';

import { ImageIcon } from 'lucide-react';

interface CategoryImageProps {
  src?: string;
  alt: string;
  fallbackText: string;
}

export default function CategoryImage({ src, alt, fallbackText }: CategoryImageProps) {
  if (!src) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <ImageIcon className="w-12 h-12 text-gray-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className="w-full h-full object-cover"
      onError={(e) => {
        e.currentTarget.src = `https://via.placeholder.com/400x300/CBD5E1/64748B?text=${encodeURIComponent(fallbackText)}`;
      }}
    />
  );
}