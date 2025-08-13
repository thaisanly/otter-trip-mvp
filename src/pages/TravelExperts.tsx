import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FilterIcon, SearchIcon, ChevronDownIcon, XIcon, SlidersIcon, CheckIcon, GlobeIcon, MapPinIcon, StarIcon } from 'lucide-react';
import TourManagerCard from '../components/ui/TourManagerCard';
// Sample tour manager data
const tourManagers = [{
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
  pricePerDay: 150,
  currency: 'RM',
  featured: true,
  topRated: true
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
  pricePerDay: 180,
  currency: 'RM',
  topRated: true
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
  pricePerDay: 200,
  currency: 'RM'
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
  pricePerDay: 220,
  currency: 'RM',
  featured: true
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
  pricePerDay: 120,
  currency: 'RM'
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
  pricePerDay: 160,
  currency: 'RM',
  topRated: true
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
  pricePerDay: 170,
  currency: 'RM',
  newJoined: true
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
  pricePerDay: 140,
  currency: 'RM'
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
  pricePerDay: 130,
  currency: 'RM',
  newJoined: true
}];
// Filter modal component
const FilterModal = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-xl shadow-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
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
            {/* Location Filter */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Location
              </h3>
              <div className="mb-4">
                <div className="relative">
                  <SearchIcon size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                  <input type="text" placeholder="Search destinations" className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Asia</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Europe</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Americas</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Africa</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Oceania</span>
                </label>
              </div>
              <div className="mt-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Show nearby experts</span>
                </label>
              </div>
            </div>
            {/* Languages Filter */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Languages
              </h3>
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
                  <span className="text-gray-700">German</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Japanese</span>
                </label>
              </div>
              <button className="text-blue-600 hover:text-blue-800 text-sm font-medium mt-3">
                Show all languages
              </button>
            </div>
            {/* Specialties Filter */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Specialties
              </h3>
              <div className="flex flex-wrap gap-2">
                <button className="bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full text-sm border border-blue-100">
                  Adventure Tours
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Cultural Experiences
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Food & Wine
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Historical Sites
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Nature & Wildlife
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Photography
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Shopping Tours
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Family-Friendly
                </button>
              </div>
            </div>
            {/* Experience Level */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Experience Level
              </h3>
              <div className="space-y-2">
                <label className="flex items-center space-x-2">
                  <input type="radio" name="experience" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">New Guide (0-2 years)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="experience" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Experienced (3-7 years)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="experience" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Expert (8-15 years)</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="radio" name="experience" className="w-4 h-4 text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">
                    Master Guide (15+ years)
                  </span>
                </label>
              </div>
            </div>
            {/* Price Range */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Price Range (per day)
              </h3>
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Minimum Price
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      RM
                    </span>
                    <input type="number" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="0" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Maximum Price
                  </label>
                  <div className="relative">
                    <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                      RM
                    </span>
                    <input type="number" className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="500" />
                  </div>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Budget (RM50-150)
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Standard (RM150-300)
                </button>
                <button className="bg-gray-50 text-gray-700 px-3 py-1.5 rounded-full text-sm border border-gray-200 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-100">
                  Premium (RM300+)
                </button>
              </div>
            </div>
            {/* Ratings & Reviews */}
            <div className="border-b border-gray-200 pb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Ratings & Reviews
              </h3>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Rating
                </label>
                <div className="flex items-center space-x-2">
                  <div className="flex">
                    {[1, 2, 3, 4, 5].map(star => <button key={star} className="text-yellow-400">
                        <StarIcon size={24} className={star <= 4 ? 'fill-current' : ''} />
                      </button>)}
                  </div>
                  <span className="text-gray-700 font-medium">4.0+</span>
                </div>
              </div>
              <label className="flex items-center space-x-2 mb-3">
                <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                <span className="text-gray-700">Verified reviews only</span>
              </label>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Minimum Review Count
                </label>
                <input type="number" className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" placeholder="10" />
              </div>
            </div>
            {/* Additional Filters */}
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Additional Filters
              </h3>
              <div className="space-y-3">
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Certified guides only</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">
                    Instant booking available
                  </span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Speaks local language</span>
                </label>
                <label className="flex items-center space-x-2">
                  <input type="checkbox" className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500" />
                  <span className="text-gray-700">Female guide preferred</span>
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
    id: 'rating',
    label: 'Rating'
  }, {
    id: 'experience',
    label: 'Experience'
  }, {
    id: 'price',
    label: 'Price'
  }, {
    id: 'availability',
    label: 'Availability'
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
const TravelExperts = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState('Rating');
  const [activeFilter, setActiveFilter] = useState('all');
  const handleSortSelect = (id, label) => {
    setSortOption(label);
    setIsSortDropdownOpen(false);
  };
  const handleFilterChange = filter => {
    setActiveFilter(filter);
  };
  // Filter tour managers based on active filter
  const filteredManagers = tourManagers.filter(manager => {
    if (activeFilter === 'top-rated') return manager.topRated;
    if (activeFilter === 'new-joined') return manager.newJoined;
    if (activeFilter === 'premium') return manager.pricePerDay >= 180;
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
            <span className="text-gray-700">Travel Experts</span>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              Travel Experts
              <span className="ml-3 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                {tourManagers.length}
              </span>
            </h1>
            <p className="text-gray-600 mt-2">
              Connect with certified tour managers and local guides
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
          <input type="text" placeholder="Search travel experts by name, location, or specialty..." className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} />
        </div>
        {/* Filter Bar */}
        <div className="flex flex-wrap items-center mb-6 gap-3">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 flex">
            <button className={`px-4 py-2 text-sm font-medium ${activeFilter === 'all' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => handleFilterChange('all')}>
              All Experts
            </button>
            <button className={`px-4 py-2 text-sm font-medium ${activeFilter === 'top-rated' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => handleFilterChange('top-rated')}>
              Top Rated
            </button>
            <button className={`px-4 py-2 text-sm font-medium ${activeFilter === 'new-joined' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => handleFilterChange('new-joined')}>
              Newly Joined
            </button>
            <button className={`px-4 py-2 text-sm font-medium ${activeFilter === 'premium' ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-50'}`} onClick={() => handleFilterChange('premium')}>
              Premium Guides
            </button>
          </div>
          <div className="flex items-center flex-wrap gap-2">
            <div className="relative">
              <button className="flex items-center space-x-1 bg-white border border-gray-300 rounded-lg px-3 py-2 text-sm hover:bg-gray-50">
                <GlobeIcon size={14} className="text-gray-500" />
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
                <StarIcon size={14} className="text-gray-500" />
                <span>Experience</span>
                <ChevronDownIcon size={14} className="text-gray-500" />
              </button>
            </div>
          </div>
        </div>
        {/* Active filters display */}
        {activeFilter !== 'all' && <div className="flex items-center mb-6">
            <div className="text-sm text-gray-600 mr-2">Active filters:</div>
            <div className="flex items-center bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-sm">
              {activeFilter === 'top-rated' && 'Top Rated'}
              {activeFilter === 'new-joined' && 'Newly Joined'}
              {activeFilter === 'premium' && 'Premium Guides'}
              <button className="ml-2 text-blue-700 hover:text-blue-800" onClick={() => handleFilterChange('all')}>
                <XIcon size={14} />
              </button>
            </div>
          </div>}
        {/* Tour Managers Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredManagers.map(manager => <TourManagerCard key={manager.id} {...manager} />)}
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
export default TravelExperts;