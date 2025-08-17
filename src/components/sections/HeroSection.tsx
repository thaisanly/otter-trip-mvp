'use client'

import React from 'react';
import Image from 'next/image';
import SearchBar from '../ui/SearchBar';

const HeroSection = () => {
  return (
    <div className="relative bg-blue-900 text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Travel adventure"
          className="w-full h-full object-cover"
          fill
          priority
        />
        <div className="absolute inset-0 bg-blue-900/50"></div>
      </div>
      {/* Content */}
      <div className="container mx-auto px-4 py-20 md:py-32 relative z-10">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Pick the Pro for Your Next Adventure
          </h1>
          <p className="text-xl md:text-2xl mb-8 text-blue-100">
            Connect with experts who will transform your travel experience
          </p>
        </div>
        <SearchBar className="max-w-5xl mx-auto" />
      </div>
    </div>
  );
};

export default HeroSection;