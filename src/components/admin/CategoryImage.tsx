'use client';

import { ImageIcon } from 'lucide-react';
import Image from 'next/image';

interface CategoryImageProps {
  src?: string;
  alt: string;
  fallbackText: string;
}

export default function CategoryImage({ src, alt, fallbackText }: CategoryImageProps) {
  if (!src) {
    return (
      <div className="w-full h-full bg-gray-100 flex items-center justify-center">
        <ImageIcon className="w-6 h-6 text-gray-400" />
      </div>
    );
  }

  return (
    <div className="relative w-full h-full">
      <Image
        src={src}
        alt={alt}
        className="object-cover"
        fill
        sizes="48px"
        onError={(e) => {
          e.currentTarget.src = `https://via.placeholder.com/400x300/CBD5E1/64748B?text=${encodeURIComponent(fallbackText)}`;
        }}
      />
    </div>
  );
}