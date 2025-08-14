'use client'

import React from 'react';
import { Link } from 'next/link';
// Destinations moved to mock file
import { destinations } from '../../src/mock/destinations';
const PopularDestinations = () => {
  return (
    <div className="container mx-auto px-4 py-16">
      <div className="flex justify-between items-end mb-10">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 mb-2">Popular Destinations</h2>
          <p className="text-xl text-gray-600">Explore our most sought-after locations</p>
        </div>
        <a href="/search" className="text-blue-600 hover:text-blue-800 font-medium">
          View all destinations
        </a>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {destinations.map((destination) => (
          <Link
            to={`/search?destination=${destination.id}`}
            key={destination.id}
            className="group block relative overflow-hidden rounded-xl shadow-md aspect-[4/3]"
          >
            <img
              src={destination.image}
              alt={`${destination.name}, ${destination.country}`}
              className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent"></div>
            <div className="absolute bottom-0 left-0 p-6 text-white">
              <h3 className="text-2xl font-bold mb-1">{destination.name}</h3>
              <p className="text-white/90 mb-2">{destination.country}</p>
              <span className="text-sm bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full">
                {destination.guideCount} local guides
              </span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
export default PopularDestinations;
