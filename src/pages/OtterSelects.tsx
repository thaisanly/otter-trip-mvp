import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FilterIcon,
  ChevronDownIcon,
  ClockIcon,
  HeartIcon,
  StarIcon,
  XIcon,
  ChevronUpIcon,
  SearchIcon,
} from 'lucide-react';
// Tour data
const tours = [
  {
    id: 'grand-canyon',
    title: 'Grand Canyon Adventure',
    description: 'Explore the majestic Grand Canyon with a 3-day guided tour.',
    image:
      'https://images.unsplash.com/photo-1615551043360-33de8b5f410c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    duration: '3 days',
    price: 'RM8,000',
    rating: 4.9,
    reviews: 108,
    talents: 100,
  },
  {
    id: 'paris-getaway',
    title: 'Paris Getaway',
    description: 'Experience the romance of Paris with our 5-day getaway package.',
    image:
      'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    duration: '3 days',
    price: 'RM8,000',
    rating: 4.9,
    reviews: 108,
    talents: 100,
  },
  {
    id: 'bali-retreat',
    title: 'Bali Retreat',
    description: 'Relax and rejuvenate with a 7-day retreat in Bali.',
    image:
      'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    duration: '3 days',
    price: 'RM8,000',
    rating: 4.9,
    reviews: 108,
    talents: 100,
  },
  {
    id: 'nyc-adventure',
    title: 'NYC Adventure',
    description: 'Discover the excitement of New York City with our 4-day tour.',
    image:
      'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    duration: '3 days',
    price: 'RM8,000',
    rating: 4.9,
    reviews: 108,
    talents: 100,
  },
  {
    id: 'african-safari',
    title: 'African Safari',
    description: 'Experience the thrill of a 6-day African safari.',
    image:
      'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    duration: '3 days',
    price: 'RM8,000',
    rating: 4.9,
    reviews: 108,
    talents: 100,
  },
  {
    id: 'china-discovery',
    title: 'China Discovery',
    description: "Explore China's rich history with a 7-day discovery tour.",
    image:
      'https://images.unsplash.com/photo-1508804052814-cd3ba865a116?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    duration: '5 days',
    price: 'RM8,000',
    rating: 4.9,
    reviews: 108,
    talents: 100,
  },
  {
    id: 'swiss-alps',
    title: 'Swiss Alps',
    description: 'Ski and unwind in the breathtaking Swiss Alps for 5 days.',
    image:
      'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    duration: '3 days',
    price: 'RM8,000',
    rating: 4.9,
    reviews: 108,
    talents: 100,
  },
  {
    id: 'machu-picchu',
    title: 'Machu Picchu',
    description: 'Hike to the ancient ruins of Machu Picchu over 4 days.',
    image:
      'https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    duration: '3 days',
    price: 'RM8,000',
    rating: 4.9,
    reviews: 108,
    talents: 100,
  },
];
// Avatar images for the talents
const avatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
];
// Tour card component
const TourCard = ({ tour, onFavorite }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const handleFavorite = (e) => {
    e.preventDefault();
    setIsFavorite(!isFavorite);
    onFavorite(tour.id);
  };
  const handleImageLoad = () => {
    setIsLoading(false);
  };
  return (
    <Link to={`/tour/${tour.id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-4px]">
        <div className="relative">
          {isLoading && <div className="absolute inset-0 bg-gray-200 animate-pulse"></div>}
          <div className="aspect-[4/3]">
            <img
              src={tour.image}
              alt={tour.title}
              className={`w-full h-full object-cover transition-opacity duration-300 ${isLoading ? 'opacity-0' : 'opacity-100'}`}
              onLoad={handleImageLoad}
            />
          </div>
          <button
            onClick={handleFavorite}
            className="absolute top-3 right-3 bg-white rounded-full p-2 shadow-md transition-transform duration-300 hover:scale-110 z-10"
          >
            <HeartIcon
              size={20}
              className={isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}
            />
          </button>
        </div>
        <div className="p-4">
          <h3 className="font-bold text-xl text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
            {tour.title}
          </h3>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tour.description}</p>
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center text-gray-700 text-sm">
              <ClockIcon size={16} className="mr-1 text-blue-600" />
              {tour.duration}
            </div>
            <div className="font-bold text-gray-900">{tour.price}</div>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <StarIcon size={16} className="text-yellow-400 fill-current mr-1" />
              <span className="text-sm text-gray-700">
                {tour.rating}/5 ({tour.reviews} Joined)
              </span>
            </div>
          </div>
          <div className="mt-3 flex items-center">
            <div className="flex -space-x-2">
              {avatars.map((avatar, index) => (
                <img
                  key={index}
                  src={avatar}
                  alt="Talent"
                  className="w-8 h-8 rounded-full border-2 border-white object-cover"
                />
              ))}
            </div>
            <span className="ml-2 text-xs text-gray-600">{tour.talents}+ Talents Available</span>
          </div>
        </div>
      </div>
    </Link>
  );
};
// Filter modal component
const FilterModal = ({ isOpen, onClose, onApply }) => {
  const [expandedSections, setExpandedSections] = useState({
    duration: true,
    priceRange: false,
    tourType: false,
    destinations: false,
    rating: false,
    groupSize: false,
  });
  const [durationFilters, setDurationFilters] = useState({
    fullDay: false,
    halfDay: false,
    oneToThreeDays: false,
    fourToSevenDays: false,
    overSevenDays: false,
  });
  const [priceRange, setPriceRange] = useState(20000);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const toggleSection = (section) => {
    setExpandedSections({
      ...expandedSections,
      [section]: !expandedSections[section],
    });
  };
  const handleDurationChange = (filter) => {
    setDurationFilters({
      ...durationFilters,
      [filter]: !durationFilters[filter],
    });
  };
  const handleReset = () => {
    setDurationFilters({
      fullDay: false,
      halfDay: false,
      oneToThreeDays: false,
      fourToSevenDays: false,
      overSevenDays: false,
    });
    setPriceRange(20000);
    setMinPrice('');
    setMaxPrice('');
  };
  const handleApply = () => {
    onApply({
      duration: durationFilters,
      priceRange: {
        min: minPrice || 0,
        max: maxPrice || priceRange,
      },
    });
    onClose();
  };
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div
        className="bg-white rounded-xl shadow-lg max-w-lg w-full max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900">Filters</h2>
            <div className="flex items-center space-x-4">
              <button
                className="text-blue-600 text-sm font-medium hover:text-blue-800"
                onClick={handleReset}
              >
                Reset
              </button>
              <button className="text-gray-500 hover:text-gray-700" onClick={onClose}>
                <XIcon size={20} />
              </button>
            </div>
          </div>
          <div className="space-y-6">
            {/* Duration Section */}
            <div className="border-b border-gray-200 pb-6">
              <button
                className="flex justify-between items-center w-full text-left mb-4"
                onClick={() => toggleSection('duration')}
              >
                <h3 className="text-lg font-medium text-gray-900">Duration</h3>
                {expandedSections.duration ? (
                  <ChevronUpIcon size={20} className="text-gray-500" />
                ) : (
                  <ChevronDownIcon size={20} className="text-gray-500" />
                )}
              </button>
              {expandedSections.duration && (
                <>
                  <p className="text-gray-600 mb-4 text-sm">
                    Select a duration for your adventure, ideal for quick getaways and brief
                    explorations.
                  </p>
                  <div className="grid grid-cols-2 gap-3">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        checked={durationFilters.fullDay}
                        onChange={() => handleDurationChange('fullDay')}
                      />
                      <span className="text-gray-700">Full Day</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        checked={durationFilters.halfDay}
                        onChange={() => handleDurationChange('halfDay')}
                      />
                      <span className="text-gray-700">Half Day</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        checked={durationFilters.oneToThreeDays}
                        onChange={() => handleDurationChange('oneToThreeDays')}
                      />
                      <span className="text-gray-700">1-3 Days</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        checked={durationFilters.fourToSevenDays}
                        onChange={() => handleDurationChange('fourToSevenDays')}
                      />
                      <span className="text-gray-700">4-7 Days</span>
                    </label>
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        className="w-4 h-4 rounded text-blue-600 focus:ring-blue-500"
                        checked={durationFilters.overSevenDays}
                        onChange={() => handleDurationChange('overSevenDays')}
                      />
                      <span className="text-gray-700">Over 7 Days</span>
                    </label>
                  </div>
                </>
              )}
            </div>
            {/* Price Range Section */}
            <div className="border-b border-gray-200 pb-6">
              <button
                className="flex justify-between items-center w-full text-left mb-4"
                onClick={() => toggleSection('priceRange')}
              >
                <h3 className="text-lg font-medium text-gray-900">Price Range</h3>
                {expandedSections.priceRange ? (
                  <ChevronUpIcon size={20} className="text-gray-500" />
                ) : (
                  <ChevronDownIcon size={20} className="text-gray-500" />
                )}
              </button>
              {expandedSections.priceRange && (
                <>
                  <p className="text-gray-600 mb-4 text-sm">
                    Choose your tour price range: from budget-friendly options to premium
                    experiences.
                  </p>
                  <div className="grid grid-cols-2 gap-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Minimum Price
                      </label>
                      <div className="relative">
                        <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-500">
                          RM
                        </span>
                        <input
                          type="number"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="0"
                          value={minPrice}
                          onChange={(e) => setMinPrice(e.target.value)}
                        />
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
                        <input
                          type="number"
                          className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
                          placeholder="20,000"
                          value={maxPrice}
                          onChange={(e) => setMaxPrice(e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mb-2">
                    <input
                      type="range"
                      min="0"
                      max="50000"
                      step="1000"
                      value={priceRange}
                      onChange={(e) => setPriceRange(parseInt(e.target.value))}
                      className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                  </div>
                  <div className="text-center font-medium text-gray-900">
                    RM {priceRange.toLocaleString()}
                  </div>
                </>
              )}
            </div>
          </div>
          <div className="mt-6 flex items-center justify-end space-x-3">
            <button
              className="px-5 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              className="px-5 py-2 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors"
              onClick={handleApply}
            >
              Apply Filter
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
// Sort dropdown component
const SortDropdown = ({ isOpen, onToggle, onSelect, selectedOption }) => {
  const options = [
    {
      id: 'popularity',
      label: 'Popularity',
    },
    {
      id: 'rating',
      label: 'Rating',
    },
    {
      id: 'newest',
      label: 'Newest Tour',
    },
  ];
  return (
    <div className="relative">
      <button
        className="flex items-center space-x-2 text-gray-700 hover:text-blue-600 focus:outline-none"
        onClick={onToggle}
      >
        <span className="text-sm font-medium">Sort By:</span>
        <span className="text-sm font-medium text-gray-900">{selectedOption}</span>
        <ChevronDownIcon size={16} />
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-40 bg-white rounded-lg shadow-lg z-20 border border-gray-100">
          {options.map((option) => (
            <button
              key={option.id}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-600"
              onClick={() => onSelect(option.id, option.label)}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};
// Main OtterSelects component
const OtterSelects = () => {
  const [favorites, setFavorites] = useState([]);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [sortOption, setSortOption] = useState('Popularity');
  const [filters, setFilters] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [typeSearchQuery, setTypeSearchQuery] = useState('');
  const handleFavorite = (tourId) => {
    if (favorites.includes(tourId)) {
      setFavorites(favorites.filter((id) => id !== tourId));
    } else {
      setFavorites([...favorites, tourId]);
    }
  };
  const handleFilterApply = (appliedFilters) => {
    setFilters(appliedFilters);
    console.log('Applied filters:', appliedFilters);
  };
  const handleSortSelect = (id, label) => {
    setSortOption(label);
    setIsSortDropdownOpen(false);
    console.log('Sort by:', id);
  };
  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Breadcrumb */}
      <div className="bg-gray-100 py-3">
        <div className="container mx-auto px-4">
          <div className="flex items-center text-sm">
            <Link to="/" className="text-blue-600 hover:text-blue-800">
              Home
            </Link>
            <span className="mx-2 text-gray-400">&gt;</span>
            <span className="text-gray-700">Otter Selects</span>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-6">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div className="mb-4 md:mb-0">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center">
              All Tours
              <span className="ml-3 bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full">
                302
              </span>
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <button
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              onClick={() => setIsFilterModalOpen(true)}
            >
              <FilterIcon size={18} />
              <span className="text-sm font-medium">Advanced Filter</span>
            </button>
            <SortDropdown
              isOpen={isSortDropdownOpen}
              onToggle={() => setIsSortDropdownOpen(!isSortDropdownOpen)}
              onSelect={handleSortSelect}
              selectedOption={sortOption}
            />
          </div>
        </div>
        {/* Search Bars */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="relative">
            <input
              type="text"
              placeholder="Search tour name"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <SearchIcon
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Search type of tour"
              className="w-full pl-10 pr-4 py-3 bg-white border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={typeSearchQuery}
              onChange={(e) => setTypeSearchQuery(e.target.value)}
            />
            <SearchIcon
              size={18}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <ChevronDownIcon
              size={18}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
          </div>
        </div>
        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {tours.map((tour) => (
            <TourCard key={tour.id} tour={tour} onFavorite={handleFavorite} />
          ))}
        </div>
      </div>
      {/* Filter Modal */}
      <FilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        onApply={handleFilterApply}
      />
    </div>
  );
};
export default OtterSelects;
