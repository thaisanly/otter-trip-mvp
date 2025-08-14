'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { SearchIcon, MapPinIcon, CalendarIcon, UsersIcon, ArrowRightIcon } from 'lucide-react';
interface SearchBarProps {
  className?: string;
}
const SearchBar = ({ className = '' }: SearchBarProps) => {
  const router = useRouter();
  const [destination, setDestination] = useState('');
  const [dates, setDates] = useState('');
  const [travelers, setTravelers] = useState('');
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Build query parameters
    const params = new URLSearchParams();
    if (destination) params.append('destination', destination);
    if (dates) params.append('dates', dates);
    if (travelers) params.append('travelers', travelers);
    // Navigate to search results
    router.push(`/search?${params.toString()}`);
  };
  return (
    <div className={`${className}`}>
      <form onSubmit={handleSearch} className="bg-white rounded-xl shadow-lg p-2 md:p-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-2 md:gap-4">
          {/* Destination */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <MapPinIcon size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Where to?"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={destination}
              onChange={(e) => setDestination(e.target.value)}
            />
          </div>
          {/* Dates */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <CalendarIcon size={20} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="When?"
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={dates}
              onChange={(e) => setDates(e.target.value)}
            />
          </div>
          {/* Travelers */}
          <div className="relative">
            <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
              <UsersIcon size={20} className="text-gray-400" />
            </div>
            <select
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 appearance-none"
              value={travelers}
              onChange={(e) => setTravelers(e.target.value)}
            >
              <option value="">How many travelers?</option>
              <option value="1">1 traveler</option>
              <option value="2">2 travelers</option>
              <option value="3">3 travelers</option>
              <option value="4">4 travelers</option>
              <option value="5+">5+ travelers</option>
            </select>
          </div>
          {/* Search Button */}
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center transition-colors"
          >
            <SearchIcon size={20} className="mr-2" />
            <span>Search</span>
          </button>
        </div>
      </form>
    </div>
  );
};
export default SearchBar;
