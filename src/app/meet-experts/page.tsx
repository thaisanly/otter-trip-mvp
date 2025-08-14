'use client'

import { useState } from 'react';
import Link from 'next/link';
import { SearchIcon, XIcon } from 'lucide-react';
import TourExpertCard from '@/components/ui/TourExpertCard';
import { experts } from '../../mock/experts';

// Filter modal component
const FilterModal = ({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Filter Travel Experts</h2>
            <div className="flex items-center space-x-4">
              <button className="text-blue-600 text-sm font-medium hover:text-blue-800">
                Reset All
              </button>
              <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
                <XIcon size={20} />
              </button>
            </div>
          </div>

          <div className="space-y-6">
            {/* Location & Languages */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Location & Languages</h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Location</label>
                <div className="relative">
                  <SearchIcon
                    size={18}
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                  <input
                    type="text"
                    placeholder="Search destinations"
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                <div className="grid grid-cols-3 gap-3">
                  {['English', 'Mandarin', 'Spanish', 'French', 'Japanese', 'Arabic'].map((lang) => (
                    <label key={lang} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                      />
                      <span className="text-gray-700">{lang}</span>
                    </label>
                  ))}
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2">
                  Show all languages
                </button>
              </div>
              <div className="mt-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Show nearby experts</span>
                </label>
              </div>
            </div>

            {/* Content Type Filter */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Content Type</h3>
              <div className="space-y-3">
                {[
                  { label: 'Video Content', desc: 'travel vlogs, tutorials' },
                  { label: 'Live Streaming', desc: 'current and scheduled' },
                  { label: 'Guided Tours', desc: 'in-person experiences' },
                  { label: 'Educational Content', desc: 'tips, guides' },
                  { label: 'Product Reviews', desc: 'travel gear, destinations' },
                ].map((type) => (
                  <label key={type.label} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                    />
                    <span className="text-gray-700">{type.label}</span>
                    <span className="text-xs text-gray-500">({type.desc})</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Activity Level */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Activity Level</h3>
              <div className="space-y-3">
                {[
                  { label: 'Live Now', desc: 'currently streaming' },
                  { label: 'Active Today', desc: 'posted within 24h' },
                  { label: 'This Week', desc: 'active within 7 days' },
                  { label: 'This Month', desc: 'active within 30 days' },
                  { label: 'All Time', desc: '' },
                ].map((activity) => (
                  <label key={activity.label} className="flex items-center space-x-2">
                    <input
                      type="radio"
                      name="activity"
                      className="w-4 h-4 text-blue-600 focus:ring-blue-500"
                      defaultChecked={activity.label === 'All Time'}
                    />
                    <span className="text-gray-700">{activity.label}</span>
                    {activity.desc && (
                      <span className="text-xs text-gray-500">({activity.desc})</span>
                    )}
                  </label>
                ))}
              </div>
            </div>

            {/* Expertise & Specialties */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Expertise & Specialties</h3>
              <div className="flex flex-wrap gap-2 mb-2">
                {[
                  'Adventure Travel',
                  'Cultural Immersion',
                  'Food & Wine',
                  'Photography',
                  'Luxury Travel',
                  'Budget Travel',
                  'Solo Travel',
                  'Family Travel',
                  'Group Tours',
                  'Sustainable Tourism',
                  'Off-the-beaten-path',
                  'City Exploration',
                  'Nature & Wildlife',
                ].map((specialty, index) => (
                  <button
                    key={specialty}
                    className={`px-3 py-1.5 rounded-full text-sm border ${
                      index === 0
                        ? 'bg-blue-50 text-blue-700 border-blue-100'
                        : 'bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100'
                    }`}
                  >
                    {specialty}
                  </button>
                ))}
              </div>
            </div>

            {/* Audience & Engagement */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Audience & Engagement</h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follower Range
                </label>
                <input
                  type="range"
                  min="0"
                  max="10000"
                  step="500"
                  defaultValue="1000"
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>0</span>
                  <span>2.5K</span>
                  <span>5K</span>
                  <span>7.5K</span>
                  <span>10K+</span>
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Engagement Rate
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500">
                  <option>Any</option>
                  <option>Above 2%</option>
                  <option>Above 5%</option>
                  <option>Above 10%</option>
                  <option>Above 15%</option>
                </select>
              </div>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Verified creators only</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                  />
                  <span className="text-gray-700">Family-friendly content</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
            <button className="text-gray-500 hover:text-gray-700 font-medium">Clear All</button>
            <div className="text-gray-600">
              Showing <span className="font-medium">42</span> experts
            </div>
            <button className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MeetExperts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  // Filter experts based on active filter
  const filteredExperts = experts.filter((expert: any) => {
    if (activeFilter === 'live-now') return expert.isLive;
    if (activeFilter === 'top-creators') return expert.isTopCreator;
    if (activeFilter === 'rising-stars') return expert.isRisingStar;
    return true;
  });

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link href="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
            <span className="mx-2 text-gray-400">&gt;</span>
            <span className="text-gray-700">Meet Experts</span>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              Meet Experts
              <span className="ml-3 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                156
              </span>
            </h1>
            <p className="text-gray-600 mt-2">
              Discover passionate travel creators and join their adventures
            </p>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative mb-6">
          <SearchIcon
            size={20}
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
          />
          <input
            type="text"
            placeholder="Search experts by name, location, or specialty..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Experts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.map((expert: any) => (
            <TourExpertCard key={expert.id} {...expert} />
          ))}
        </div>

        {/* Pagination */}
        <div className="mt-10 flex justify-center">
          <nav className="flex items-center space-x-1">
            <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
              Previous
            </button>
            <button className="px-3 py-2 rounded-md bg-blue-600 text-white border border-blue-600">
              1
            </button>
            <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
              2
            </button>
            <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
              3
            </button>
            <span className="px-3 py-2 text-gray-500">...</span>
            <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
              10
            </button>
            <button className="px-3 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50">
              Next
            </button>
          </nav>
        </div>
      </div>

      {/* Filter Modal */}
      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
    </div>
  );
};

export default MeetExperts;