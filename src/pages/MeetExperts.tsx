import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FilterIcon, SearchIcon, ChevronDownIcon, XIcon, SlidersIcon, CheckIcon, GlobeIcon, MapPinIcon, StarIcon, VideoIcon, PlayCircleIcon, RadioIcon, UsersIcon, TrendingUpIcon, BarChartIcon, LayersIcon } from 'lucide-react';
import TourExpertCard from '../components/ui/TourExpertCard';
// Sample expert data
const experts = [{
  id: 'sarah-chen',
  name: 'Sarah Chen',
  image: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
  location: 'Singapore',
  countryCode: '🇸🇬',
  verified: true,
  rating: 4.9,
  reviews: 127,
  experience: 8,
  languages: ['English', 'Mandarin', 'Malay'],
  specialties: ['Cultural Tours', 'Food Tours', 'City Exploration'],
  followers: 2300,
  isLive: true,
  videos: 45,
  liveStreams: 12,
  tours: 8
}, {
  id: 'marco-rodriguez',
  name: 'Marco Rodriguez',
  image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
  location: 'Barcelona',
  countryCode: '🇪🇸',
  verified: true,
  rating: 4.8,
  reviews: 203,
  experience: 12,
  languages: ['English', 'Spanish', 'Catalan', 'Italian'],
  specialties: ['Adventure Tours', 'Historical Sites', 'Local Experiences'],
  followers: 2500,
  isTopCreator: true,
  videos: 62,
  liveStreams: 18,
  tours: 15
}, {
  id: 'yuki-tanaka',
  name: 'Yuki Tanaka',
  image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
  location: 'Tokyo',
  countryCode: '🇯🇵',
  verified: true,
  rating: 4.7,
  reviews: 89,
  experience: 6,
  languages: ['English', 'Japanese'],
  specialties: ['Cultural Tours', 'Shopping', 'Food Tours'],
  followers: 1800,
  videos: 38,
  liveStreams: 5,
  tours: 12
}, {
  id: 'david-thompson',
  name: 'David Thompson',
  image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
  location: 'London',
  countryCode: '🇬🇧',
  verified: true,
  rating: 4.9,
  reviews: 156,
  experience: 15,
  languages: ['English', 'French', 'German'],
  specialties: ['Historical Tours', 'Museum Tours', 'Architecture'],
  followers: 3100,
  isTopCreator: true,
  videos: 78,
  liveStreams: 22,
  tours: 31
}, {
  id: 'priya-sharma',
  name: 'Priya Sharma',
  image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
  location: 'Mumbai',
  countryCode: '🇮🇳',
  verified: true,
  rating: 4.8,
  reviews: 112,
  experience: 10,
  languages: ['English', 'Hindi', 'Marathi'],
  specialties: ['Heritage Sites', 'Spiritual Tours', 'Local Culture'],
  followers: 1650,
  isRisingStar: true,
  videos: 42,
  liveStreams: 9,
  tours: 14
}, {
  id: 'ahmed-hassan',
  name: 'Ahmed Hassan',
  image: 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
  location: 'Cairo',
  countryCode: '🇪🇬',
  verified: true,
  rating: 4.9,
  reviews: 189,
  experience: 20,
  languages: ['English', 'Arabic', 'French'],
  specialties: ['Archaeological Tours', 'Historical Sites', 'Desert Expeditions'],
  followers: 2800,
  videos: 56,
  liveStreams: 14,
  tours: 28
}, {
  id: 'emma-wilson',
  name: 'Emma Wilson',
  image: 'https://images.unsplash.com/photo-1567532939604-b6b5b0db2604?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
  location: 'Sydney',
  countryCode: '🇦🇺',
  verified: true,
  rating: 4.7,
  reviews: 76,
  experience: 5,
  languages: ['English'],
  specialties: ['Nature Tours', 'Wildlife', 'Beach Activities'],
  followers: 1200,
  isLive: true,
  videos: 32,
  liveStreams: 7,
  tours: 9
}, {
  id: 'carlos-santos',
  name: 'Carlos Santos',
  image: 'https://images.unsplash.com/photo-1552374196-c4e7ffc6e126?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
  location: 'Rio de Janeiro',
  countryCode: '🇧🇷',
  verified: true,
  rating: 4.8,
  reviews: 103,
  experience: 9,
  languages: ['English', 'Portuguese', 'Spanish'],
  specialties: ['Adventure Tours', 'Beach Tours', 'Nightlife'],
  followers: 3500,
  videos: 87,
  liveStreams: 29,
  tours: 16
}, {
  id: 'sofia-martinez',
  name: 'Sofia Martinez',
  image: 'https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80',
  location: 'Buenos Aires',
  countryCode: '🇦🇷',
  verified: true,
  rating: 4.9,
  reviews: 92,
  experience: 7,
  languages: ['English', 'Spanish'],
  specialties: ['Tango Tours', 'Food & Wine', 'City Exploration'],
  followers: 1450,
  isRisingStar: true,
  videos: 28,
  liveStreams: 11,
  tours: 6
}];
// Filter modal component
const FilterModal = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-3xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">
              Filter Travel Experts
            </h2>
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
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Location & Languages
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location
                </label>
                <div className="relative">
                  <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search destinations" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Languages
                </label>
                <div className="grid grid-cols-3 gap-3">
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                    <span className="text-gray-700">English</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                    <span className="text-gray-700">Mandarin</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                    <span className="text-gray-700">Spanish</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                    <span className="text-gray-700">French</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                    <span className="text-gray-700">Japanese</span>
                  </label>
                  <label className="flex items-center space-x-2">
                    <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                    <span className="text-gray-700">Arabic</span>
                  </label>
                </div>
                <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-2">
                  Show all languages
                </button>
              </div>
              <div className="mt-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Show nearby experts</span>
                </label>
              </div>
            </div>
            {/* Content Type Filter */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Content Type
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Video Content</span>
                  <span className="text-xs text-gray-500">
                    (travel vlogs, tutorials)
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Live Streaming</span>
                  <span className="text-xs text-gray-500">
                    (current and scheduled)
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Guided Tours</span>
                  <span className="text-xs text-gray-500">
                    (in-person experiences)
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Educational Content</span>
                  <span className="text-xs text-gray-500">(tips, guides)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Product Reviews</span>
                  <span className="text-xs text-gray-500">
                    (travel gear, destinations)
                  </span>
                </label>
              </div>
            </div>
            {/* Activity Level */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Activity Level
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="activity" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Live Now</span>
                  <span className="text-xs text-gray-500">
                    (currently streaming)
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="activity" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Active Today</span>
                  <span className="text-xs text-gray-500">
                    (posted within 24h)
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="activity" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">This Week</span>
                  <span className="text-xs text-gray-500">
                    (active within 7 days)
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="activity" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">This Month</span>
                  <span className="text-xs text-gray-500">
                    (active within 30 days)
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="activity" className="w-4 h-4 text-blue-600 focus:ring-blue-500" defaultChecked />
                  <span className="text-gray-700">All Time</span>
                </label>
              </div>
            </div>
            {/* Expertise & Specialties */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Expertise & Specialties
              </h3>
              <div className="flex flex-wrap gap-2 mb-2">
                <button className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm border border-blue-100">
                  Adventure Travel
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Cultural Immersion
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Food & Wine
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Photography
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Luxury Travel
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Budget Travel
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Solo Travel
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Family Travel
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Group Tours
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Sustainable Tourism
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Off-the-beaten-path
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  City Exploration
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Nature & Wildlife
                </button>
              </div>
            </div>
            {/* Audience & Engagement */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Audience & Engagement
              </h3>
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Follower Range
                </label>
                <input type="range" min="0" max="10000" step="500" defaultValue="1000" className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer" />
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
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Verified creators only</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Family-friendly content</span>
                </label>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-6 border-t border-gray-200 flex items-center justify-between">
            <button className="text-gray-500 hover:text-gray-700 font-medium">
              Clear All
            </button>
            <div className="text-gray-600">
              Showing <span className="font-medium">42</span> experts
            </div>
            <button className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors">
              Apply Filters
            </button>
          </div>
        </div>
      </div>
    </div>;
};
// Sort dropdown component
const SortDropdown = ({
  isOpen,
  onToggle,
  onSelect,
  selectedOption
}) => {
  const options = [{
    id: 'popularity',
    label: 'Popularity'
  }, {
    id: 'rating',
    label: 'Rating'
  }, {
    id: 'newest',
    label: 'Newest'
  }, {
    id: 'most-active',
    label: 'Most Active'
  }];
  return <div className="relative">
      <button className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none" onClick={onToggle}>
        <span className="text-sm font-medium">Sort By:</span>
        <span className="text-sm font-medium text-gray-900">
          {selectedOption}
        </span>
        <ChevronDownIcon size={16} />
      </button>
      {isOpen && <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-20 border border-gray-100">
          {options.map(option => <button key={option.id} className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600" onClick={() => onSelect(option.id, option.label)}>
              {option.label}
            </button>)}
        </div>}
    </div>;
};
const MeetExperts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState('Popularity');
  const [activeFilter, setActiveFilter] = useState('all');
  const handleSortSelect = (id, label) => {
    setSortOption(label);
    setIsSortDropdownOpen(false);
  };
  const handleFilterChange = filter => {
    setActiveFilter(filter);
  };
  // Filter experts based on active filter
  const filteredExperts = experts.filter(expert => {
    if (activeFilter === 'live-now') return expert.isLive;
    if (activeFilter === 'top-creators') return expert.isTopCreator;
    if (activeFilter === 'rising-stars') return expert.isRisingStar;
    return true;
  });
  return <div className="bg-gray-50 min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
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
          <div className="flex items-center space-x-4">
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors" onClick={() => setIsFilterModalOpen(true)}>
              <FilterIcon size={18} />
              <span className="text-sm font-medium">Advanced Filter</span>
            </button>
            <SortDropdown isOpen={isSortDropdownOpen} onToggle={() => setIsSortDropdownOpen(!isSortDropdownOpen)} onSelect={handleSortSelect} selectedOption={sortOption} />
          </div>
        </div>
        {/* Search Bar */}
        <div className="relative mb-6">
          <SearchIcon size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input type="text" placeholder="Search experts by name, location, or specialty..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center mb-6 gap-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex overflow-x-auto">
            <button className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeFilter === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => handleFilterChange('all')}>
              All Experts
            </button>
            <button className={`px-4 py-2 text-sm font-medium whitespace-nowrap flex items-center ${activeFilter === 'live-now' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => handleFilterChange('live-now')}>
              <span className="w-2 h-2 bg-red-600 rounded-full mr-1.5 animate-pulse"></span>
              Live Now
            </button>
            <button className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeFilter === 'top-creators' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => handleFilterChange('top-creators')}>
              Top Creators
            </button>
            <button className={`px-4 py-2 text-sm font-medium whitespace-nowrap ${activeFilter === 'rising-stars' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => handleFilterChange('rising-stars')}>
              Rising Stars
            </button>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <div className="relative">
              <button className="flex items-center space-x-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                <MapPinIcon size={14} className="text-gray-500" />
                <span>All Locations</span>
                <ChevronDownIcon size={14} className="text-gray-500" />
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center space-x-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                <GlobeIcon size={14} className="text-gray-500" />
                <span>Languages</span>
                <ChevronDownIcon size={14} className="text-gray-500" />
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center space-x-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                <SlidersIcon size={14} className="text-gray-500" />
                <span>Specialties</span>
                <ChevronDownIcon size={14} className="text-gray-500" />
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center space-x-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                <LayersIcon size={14} className="text-gray-500" />
                <span>Content Type</span>
                <ChevronDownIcon size={14} className="text-gray-500" />
              </button>
            </div>
            <div className="relative">
              <button className="flex items-center space-x-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                <RadioIcon size={14} className="text-gray-500" />
                <span>Activity Status</span>
                <ChevronDownIcon size={14} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
        {/* Active filters display */}
        {activeFilter !== 'all' && <div className="flex items-center mb-6">
            <div className="text-sm text-gray-600 mr-2">Active filters:</div>
            <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
              {activeFilter === 'live-now' && <>
                  <span className="w-2 h-2 bg-red-600 rounded-full mr-1.5 animate-pulse"></span>
                  Live Now
                </>}
              {activeFilter === 'top-creators' && 'Top Creators'}
              {activeFilter === 'rising-stars' && 'Rising Stars'}
              <button className="ml-2 text-blue-700 hover:text-blue-800" onClick={() => handleFilterChange('all')}>
                <XIcon size={14} />
              </button>
            </div>
          </div>}
        {/* Experts Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredExperts.map(expert => <TourExpertCard key={expert.id} {...expert} />)}
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
    </div>;
};
export default MeetExperts;