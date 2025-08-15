'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { SearchIcon, XIcon } from 'lucide-react';
import TourExpertCard from '@/components/ui/TourExpertCard';
import { TourExpertProps } from '@/components/ui/TourExpertCard';

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

// Database Expert type
interface Expert {
  id: string;
  name: string;
  title: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  hourlyRate: string;
  languages: string[];
  expertise: string[];
  certifications?: string[];
  availability?: any;
  bio?: string;
  experience?: string;
  featuredTours?: string[];
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

const MeetExperts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [experts, setExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const itemsPerPage = 9; // 3 columns x 3 rows

  // Fetch experts data from API (only active experts)
  useEffect(() => {
    const fetchExperts = async () => {
      try {
        setLoading(true);
        const response = await fetch('/api/experts?active=true');
        if (!response.ok) {
          throw new Error('Failed to fetch experts');
        }
        const data = await response.json();
        setExperts(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch experts');
        setExperts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchExperts();
  }, []);

  // Transform Expert data to TourExpertProps
  const transformExpertToCardProps = (expert: Expert): TourExpertProps => {
    return {
      id: expert.id,
      name: expert.name,
      image: expert.image,
      location: expert.location,
      countryCode: '', // Not available in database, could be derived from location
      verified: true, // Could be based on certifications or a separate field
      rating: expert.rating,
      reviews: expert.reviewCount,
      experience: expert.experience ? parseInt(expert.experience.replace(/\D/g, '')) || 0 : 0,
      languages: expert.languages,
      specialties: expert.expertise,
      followers: Math.floor(Math.random() * 10000) + 1000, // Mock data for now
      isLive: false, // Mock data for now
      isTopCreator: expert.rating >= 4.8, // Based on high rating
      isRisingStar: expert.reviewCount < 50 && expert.rating >= 4.5, // New experts with good ratings
      videos: Math.floor(Math.random() * 100) + 10, // Mock data for now
      liveStreams: Math.floor(Math.random() * 20) + 5, // Mock data for now
      tours: expert.featuredTours ? expert.featuredTours.length : Math.floor(Math.random() * 10) + 1,
    };
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Filter experts based on active filter and search query
  const filteredExperts = experts.filter((expert: Expert) => {
    const expertCardProps = transformExpertToCardProps(expert);
    const matchesFilter = 
      activeFilter === 'all' ||
      (activeFilter === 'live-now' && expertCardProps.isLive) ||
      (activeFilter === 'top-creators' && expertCardProps.isTopCreator) ||
      (activeFilter === 'rising-stars' && expertCardProps.isRisingStar);
    
    const matchesSearch = searchQuery === '' || 
      expert.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      expert.expertise.some((specialty: string) => 
        specialty.toLowerCase().includes(searchQuery.toLowerCase())
      );
    
    return matchesFilter && matchesSearch;
  });

  // Calculate pagination
  const totalPages = Math.ceil(filteredExperts.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentExperts = filteredExperts.slice(startIndex, endIndex);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Always show first page
      pages.push(1);
      
      if (currentPage > 3) {
        pages.push('...');
      }
      
      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      
      for (let i = start; i <= end; i++) {
        if (i !== 1 && i !== totalPages) {
          pages.push(i);
        }
      }
      
      if (currentPage < totalPages - 2) {
        pages.push('...');
      }
      
      // Always show last page if more than 1 page
      if (totalPages > 1) {
        pages.push(totalPages);
      }
    }
    
    return pages;
  };

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
                {filteredExperts.length}
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
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page when search changes
            }}
          />
        </div>

        {/* Loading state */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="ml-3 text-gray-600">Loading experts...</span>
          </div>
        )}

        {/* Error state */}
        {error && (
          <div className="text-center py-12">
            <p className="text-red-500 text-lg">Error loading experts</p>
            <p className="text-gray-400 mt-2">{error}</p>
            <button 
              onClick={() => window.location.reload()} 
              className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Try Again
            </button>
          </div>
        )}

        {/* Experts Grid */}
        {!loading && !error && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {currentExperts.map((expert: Expert) => (
              <TourExpertCard key={expert.id} {...transformExpertToCardProps(expert)} />
            ))}
          </div>
        )}

        {/* Show message if no experts found */}
        {!loading && !error && filteredExperts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">No experts found matching your criteria.</p>
            <p className="text-gray-400 mt-2">Try adjusting your search or filters.</p>
          </div>
        )}

        {/* Pagination - Only show if there are more than 1 page */}
        {!loading && !error && totalPages > 1 && (
          <div className="mt-10 flex justify-center">
            <nav className="flex items-center space-x-1">
              <button 
                onClick={handlePrevious}
                disabled={currentPage === 1}
                className={`px-3 py-2 rounded-md border ${
                  currentPage === 1 
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Previous
              </button>
              
              {getPageNumbers().map((page, index) => (
                <React.Fragment key={index}>
                  {page === '...' ? (
                    <span className="px-3 py-2 text-gray-500">...</span>
                  ) : (
                    <button
                      onClick={() => handlePageChange(page as number)}
                      className={`px-3 py-2 rounded-md border ${
                        currentPage === page
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  )}
                </React.Fragment>
              ))}
              
              <button 
                onClick={handleNext}
                disabled={currentPage === totalPages}
                className={`px-3 py-2 rounded-md border ${
                  currentPage === totalPages 
                    ? 'border-gray-200 text-gray-400 cursor-not-allowed' 
                    : 'border-gray-300 text-gray-700 hover:bg-gray-50'
                }`}
              >
                Next
              </button>
            </nav>
          </div>
        )}
      </div>

      {/* Filter Modal */}
      <FilterModal isOpen={isFilterModalOpen} onClose={() => setIsFilterModalOpen(false)} />
    </div>
  );
}

export default MeetExperts;