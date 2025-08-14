'use client'

import React from 'react';
const TourLeaderShowcase = () => {
  return (
    <div className="relative bg-blue-900 text-white">
      {/* Background Image with Overlay */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1506197603052-3cc9c3a201bd?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Travel adventure"
          className="w-full h-full object-cover"
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
            Connect with expert local guides who will transform your travel experience
          </p>
        </div>
        {/* Stats cards */}
        <div className="mt-12 flex flex-wrap justify-center gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center">
            <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">🧭</span>
            </div>
            <div>
              <h3 className="font-semibold">2,500+ Verified Guides</h3>
              <p className="text-sm text-blue-100">Across 120+ countries</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center">
            <div className="w-12 h-12 bg-green-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">🛡️</span>
            </div>
            <div>
              <h3 className="font-semibold">100% Secure Booking</h3>
              <p className="text-sm text-blue-100">With payment protection</p>
            </div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 flex items-center">
            <div className="w-12 h-12 bg-orange-600 rounded-full flex items-center justify-center mr-4">
              <span className="text-2xl">⭐</span>
            </div>
            <div>
              <h3 className="font-semibold">25,000+ Reviews</h3>
              <p className="text-sm text-blue-100">From happy travelers</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default TourLeaderShowcase;
