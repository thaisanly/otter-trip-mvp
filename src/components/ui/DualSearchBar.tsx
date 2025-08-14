'use client'

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  SearchIcon,
  MapPinIcon,
  CalendarIcon,
  UsersIcon,
  GlobeIcon,
  ChevronDownIcon,
  CheckIcon,
  XIcon,
  PlusIcon,
  MinusIcon,
  ClockIcon,
  LanguagesIcon,
  FlagIcon,
  LoaderIcon,
} from 'lucide-react';
// Mock data for dropdowns
const destinations = [
  {
    id: 'europe',
    name: 'Europe',
    expertCount: 450,
    tourCount: 320,
  },
  {
    id: 'asia',
    name: 'Asia',
    expertCount: 380,
    tourCount: 280,
  },
  {
    id: 'japan',
    name: 'Japan',
    expertCount: 120,
    tourCount: 85,
  },
  {
    id: 'china',
    name: 'China',
    expertCount: 95,
    tourCount: 65,
  },
  {
    id: 'thailand',
    name: 'Thailand',
    expertCount: 110,
    tourCount: 90,
  },
  {
    id: 'usa',
    name: 'United States',
    expertCount: 320,
    tourCount: 210,
  },
  {
    id: 'canada',
    name: 'Canada',
    expertCount: 85,
    tourCount: 60,
  },
  {
    id: 'mexico',
    name: 'Mexico',
    expertCount: 75,
    tourCount: 50,
  },
  {
    id: 'australia',
    name: 'Australia',
    expertCount: 65,
    tourCount: 45,
  },
  {
    id: 'nz',
    name: 'New Zealand',
    expertCount: 40,
    tourCount: 30,
  },
  {
    id: 'india',
    name: 'India',
    expertCount: 130,
    tourCount: 95,
  },
];
const languages = [
  {
    id: 'en',
    name: 'English',
    flag: '🇬🇧',
  },
  {
    id: 'es',
    name: 'Spanish',
    flag: '🇪🇸',
  },
  {
    id: 'fr',
    name: 'French',
    flag: '🇫🇷',
  },
  {
    id: 'de',
    name: 'German',
    flag: '🇩🇪',
  },
  {
    id: 'it',
    name: 'Italian',
    flag: '🇮🇹',
  },
  {
    id: 'zh',
    name: 'Chinese',
    flag: '🇨🇳',
  },
  {
    id: 'ja',
    name: 'Japanese',
    flag: '🇯🇵',
  },
  {
    id: 'ko',
    name: 'Korean',
    flag: '🇰🇷',
  },
  {
    id: 'ru',
    name: 'Russian',
    flag: '🇷🇺',
  },
  {
    id: 'ar',
    name: 'Arabic',
    flag: '🇸🇦',
  },
  {
    id: 'pt',
    name: 'Portuguese',
    flag: '🇵🇹',
  },
  {
    id: 'hi',
    name: 'Hindi',
    flag: '🇮🇳',
  },
];
const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];
type DualSearchBarProps = {
  className?: string;
};
const DualSearchBar = ({ className = '' }: DualSearchBarProps) => {
  const router = useRouter();
  const [searchMode, setSearchMode] = useState<'expert' | 'tour'>('expert');
  const [isLoading, setIsLoading] = useState(false);
  // Dropdowns state
  const [destinationDropdownOpen, setDestinationDropdownOpen] = useState(false);
  const [monthDropdownOpen, setMonthDropdownOpen] = useState(false);
  const [languageDropdownOpen, setLanguageDropdownOpen] = useState(false);
  // Expert search form state
  const [expertDestination, setExpertDestination] = useState('');
  const [yearsExperience, setYearsExperience] = useState(3);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [expertSearchQuery, setExpertSearchQuery] = useState('');
  // Tour search form state
  const [tourDestination, setTourDestination] = useState('');
  const [tourMonth, setTourMonth] = useState('');
  const [travelers, setTravelers] = useState(2);
  // Refs for dropdowns
  const destinationDropdownRef = useRef<HTMLDivElement>(null);
  const monthDropdownRef = useRef<HTMLDivElement>(null);
  const languageDropdownRef = useRef<HTMLDivElement>(null);
  // Count matches
  const [expertMatches, setExpertMatches] = useState(0);
  const [tourMatches, setTourMatches] = useState(0);
  // Calculate matches based on filters
  useEffect(() => {
    // Simulate API call with loading state
    setIsLoading(true);
    const timer = setTimeout(() => {
      if (searchMode === 'expert') {
        // Calculate expert matches based on selected filters
        let matches = 0;
        const selectedDest = destinations.find((d) => d.id === expertDestination);
        if (selectedDest) {
          matches = selectedDest.expertCount;
          // Reduce matches based on years of experience (just for simulation)
          matches = Math.round(matches * (1 - yearsExperience / 30));
          // Reduce matches based on languages (just for simulation)
          if (selectedLanguages.length > 0) {
            matches = Math.round(matches * (0.7 + selectedLanguages.length * 0.1));
          }
        } else {
          // If no destination selected, show total
          matches = destinations.reduce((sum, dest) => sum + dest.expertCount, 0);
        }
        setExpertMatches(matches);
      } else {
        // Calculate tour matches
        let matches = 0;
        const selectedDest = destinations.find((d) => d.id === tourDestination);
        if (selectedDest) {
          matches = selectedDest.tourCount;
          // Adjust based on month (just for simulation)
          if (tourMonth) {
            const monthIndex = months.indexOf(tourMonth);
            // Summer months have more tours
            if (monthIndex >= 4 && monthIndex <= 7) {
              matches = Math.round(matches * 1.2);
            } else if (monthIndex >= 10 || monthIndex <= 1) {
              // Winter months have fewer tours
              matches = Math.round(matches * 0.8);
            }
          }
          // Adjust based on travelers (just for simulation)
          if (travelers > 5) {
            matches = Math.round(matches * 0.7);
          }
        } else {
          // If no destination selected, show total
          matches = destinations.reduce((sum, dest) => sum + dest.tourCount, 0);
        }
        setTourMatches(matches);
      }
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [
    searchMode,
    expertDestination,
    yearsExperience,
    selectedLanguages,
    tourDestination,
    tourMonth,
    travelers,
  ]);
  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        destinationDropdownRef.current &&
        !destinationDropdownRef.current.contains(event.target as Node)
      ) {
        setDestinationDropdownOpen(false);
      }
      if (monthDropdownRef.current && !monthDropdownRef.current.contains(event.target as Node)) {
        setMonthDropdownOpen(false);
      }
      if (
        languageDropdownRef.current &&
        !languageDropdownRef.current.contains(event.target as Node)
      ) {
        setLanguageDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  // Handle form submission
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchMode === 'expert') {
      // Build query parameters for expert search
      const params = new URLSearchParams();
      if (expertDestination) params.append('destination', expertDestination);
      if (yearsExperience > 0) params.append('experience', yearsExperience.toString());
      if (selectedLanguages.length > 0) params.append('languages', selectedLanguages.join(','));
      if (expertSearchQuery) params.append('q', expertSearchQuery);
      // Navigate to search results
      router.push(`/meet-experts?${params.toString()}`);
    } else {
      // Build query parameters for tour search
      const params = new URLSearchParams();
      if (tourDestination) params.append('destination', tourDestination);
      if (tourMonth) params.append('month', tourMonth);
      if (travelers > 0) params.append('travelers', travelers.toString());
      // Navigate to search results
      router.push(`/search?${params.toString()}`);
    }
  };
  // Toggle language selection
  const toggleLanguage = (langId: string) => {
    if (selectedLanguages.includes(langId)) {
      setSelectedLanguages(selectedLanguages.filter((id) => id !== langId));
    } else {
      setSelectedLanguages([...selectedLanguages, langId]);
    }
  };
  return (
    <div className={`${className} w-full`}>
      <div className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300">
        {/* Search Mode Tabs */}
        <div className="flex border-b border-gray-200">
          <button
            className={`flex-1 py-4 text-center font-medium transition-colors relative ${searchMode === 'expert' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setSearchMode('expert')}
          >
            Find an Expert
            {searchMode === 'expert' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
            )}
          </button>
          <button
            className={`flex-1 py-4 text-center font-medium transition-colors relative ${searchMode === 'tour' ? 'text-blue-600' : 'text-gray-600 hover:text-gray-900'}`}
            onClick={() => setSearchMode('tour')}
          >
            Find a Tour
            {searchMode === 'tour' && (
              <span className="absolute bottom-0 left-0 w-full h-0.5 bg-blue-600"></span>
            )}
          </button>
        </div>
        {/* Search Forms */}
        <div className="p-4 md:p-6">
          {/* Expert Search Form */}
          {searchMode === 'expert' && (
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Destination Dropdown */}
                <div className="relative" ref={destinationDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination
                  </label>
                  <button
                    type="button"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onClick={() => setDestinationDropdownOpen(!destinationDropdownOpen)}
                  >
                    <div className="flex items-center">
                      <MapPinIcon size={18} className="text-gray-500 mr-2" />
                      <span className={expertDestination ? 'text-gray-900' : 'text-gray-500'}>
                        {expertDestination
                          ? destinations.find((d) => d.id === expertDestination)?.name
                          : 'Where are you going?'}
                      </span>
                    </div>
                    <ChevronDownIcon size={18} className="text-gray-500" />
                  </button>
                  {/* Dropdown Menu */}
                  {destinationDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-200">
                      <div className="p-2">
                        <div className="relative mb-2">
                          <SearchIcon
                            size={16}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="text"
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search destinations..."
                            onChange={(e) => setExpertSearchQuery(e.target.value)}
                          />
                        </div>
                        <div className="space-y-1">
                          {destinations.map((destination) => (
                            <button
                              key={destination.id}
                              type="button"
                              className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between hover:bg-gray-100 ${expertDestination === destination.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                              onClick={() => {
                                setExpertDestination(destination.id);
                                setDestinationDropdownOpen(false);
                              }}
                            >
                              <span>{destination.name}</span>
                              <span className="text-sm text-gray-500">
                                {destination.expertCount} experts
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Years of Experience Slider */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Years of Experience
                  </label>
                  <div className="mt-1 relative">
                    <div className="flex items-center">
                      <ClockIcon size={18} className="text-gray-500 mr-2" />
                      <input
                        type="range"
                        min="1"
                        max="20"
                        value={yearsExperience}
                        onChange={(e) => setYearsExperience(parseInt(e.target.value))}
                        className="flex-1 h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                      />
                    </div>
                    <div className="mt-1 text-sm text-gray-700 font-medium">
                      {yearsExperience === 20
                        ? '20+ years'
                        : `${yearsExperience} year${yearsExperience !== 1 ? 's' : ''}`}
                    </div>
                  </div>
                </div>
                {/* Languages Multi-select */}
                <div className="relative" ref={languageDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Languages</label>
                  <button
                    type="button"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onClick={() => setLanguageDropdownOpen(!languageDropdownOpen)}
                  >
                    <div className="flex items-center">
                      <GlobeIcon size={18} className="text-gray-500 mr-2" />
                      <span
                        className={selectedLanguages.length > 0 ? 'text-gray-900' : 'text-gray-500'}
                      >
                        {selectedLanguages.length > 0
                          ? `${selectedLanguages.length} language${selectedLanguages.length !== 1 ? 's' : ''} selected`
                          : 'Select languages'}
                      </span>
                    </div>
                    <ChevronDownIcon size={18} className="text-gray-500" />
                  </button>
                  {/* Languages Dropdown */}
                  {languageDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-200">
                      <div className="p-2">
                        <div className="space-y-1">
                          {languages.map((language) => (
                            <div
                              key={language.id}
                              className={`px-3 py-2 rounded-md flex items-center justify-between hover:bg-gray-100 cursor-pointer ${selectedLanguages.includes(language.id) ? 'bg-blue-50' : ''}`}
                              onClick={() => toggleLanguage(language.id)}
                            >
                              <div className="flex items-center">
                                <span className="mr-2 text-xl">{language.flag}</span>
                                <span
                                  className={
                                    selectedLanguages.includes(language.id)
                                      ? 'text-blue-700 font-medium'
                                      : 'text-gray-700'
                                  }
                                >
                                  {language.name}
                                </span>
                              </div>
                              {selectedLanguages.includes(language.id) && (
                                <CheckIcon size={16} className="text-blue-600" />
                              )}
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              {/* Results Count & Submit */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  {isLoading ? (
                    <div className="flex items-center">
                      <LoaderIcon size={16} className="animate-spin mr-2" />
                      Finding experts...
                    </div>
                  ) : (
                    <span>
                      <span className="font-medium text-gray-900">{expertMatches}</span> experts
                      match your criteria
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg flex items-center transition-colors"
                >
                  <SearchIcon size={18} className="mr-2" />
                  Search Experts
                </button>
              </div>
            </form>
          )}
          {/* Tour Search Form */}
          {searchMode === 'tour' && (
            <form onSubmit={handleSearch} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Destination Dropdown */}
                <div className="relative" ref={destinationDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Destination
                  </label>
                  <button
                    type="button"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onClick={() => setDestinationDropdownOpen(!destinationDropdownOpen)}
                  >
                    <div className="flex items-center">
                      <MapPinIcon size={18} className="text-gray-500 mr-2" />
                      <span className={tourDestination ? 'text-gray-900' : 'text-gray-500'}>
                        {tourDestination
                          ? destinations.find((d) => d.id === tourDestination)?.name
                          : 'Where are you going?'}
                      </span>
                    </div>
                    <ChevronDownIcon size={18} className="text-gray-500" />
                  </button>
                  {/* Dropdown Menu */}
                  {destinationDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-200">
                      <div className="p-2">
                        <div className="relative mb-2">
                          <SearchIcon
                            size={16}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          />
                          <input
                            type="text"
                            className="w-full pl-9 pr-4 py-2 border border-gray-300 rounded-lg text-sm focus:ring-blue-500 focus:border-blue-500"
                            placeholder="Search destinations..."
                          />
                        </div>
                        <div className="space-y-1">
                          {destinations.map((destination) => (
                            <button
                              key={destination.id}
                              type="button"
                              className={`w-full text-left px-3 py-2 rounded-md flex items-center justify-between hover:bg-gray-100 ${tourDestination === destination.id ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                              onClick={() => {
                                setTourDestination(destination.id);
                                setDestinationDropdownOpen(false);
                              }}
                            >
                              <span>{destination.name}</span>
                              <span className="text-sm text-gray-500">
                                {destination.tourCount} tours
                              </span>
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {/* Month Picker */}
                <div className="relative" ref={monthDropdownRef}>
                  <label className="block text-sm font-medium text-gray-700 mb-1">When</label>
                  <button
                    type="button"
                    className="w-full bg-white border border-gray-300 rounded-lg px-4 py-2.5 text-left flex items-center justify-between hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    onClick={() => setMonthDropdownOpen(!monthDropdownOpen)}
                  >
                    <div className="flex items-center">
                      <CalendarIcon size={18} className="text-gray-500 mr-2" />
                      <span className={tourMonth ? 'text-gray-900' : 'text-gray-500'}>
                        {tourMonth || 'Select month'}
                      </span>
                    </div>
                    <ChevronDownIcon size={18} className="text-gray-500" />
                  </button>
                  {/* Month Dropdown */}
                  {monthDropdownOpen && (
                    <div className="absolute z-10 mt-1 w-full bg-white rounded-lg shadow-lg max-h-60 overflow-y-auto border border-gray-200">
                      <div className="p-2 grid grid-cols-2 gap-1">
                        {months.map((month) => (
                          <button
                            key={month}
                            type="button"
                            className={`text-left px-3 py-2 rounded-md hover:bg-gray-100 ${tourMonth === month ? 'bg-blue-50 text-blue-700' : 'text-gray-700'}`}
                            onClick={() => {
                              setTourMonth(month);
                              setMonthDropdownOpen(false);
                            }}
                          >
                            {month}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* Travelers Counter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">People</label>
                  <div className="flex items-center">
                    <UsersIcon size={18} className="text-gray-500 mr-2" />
                    <div className="flex-1 flex items-center justify-between bg-white border border-gray-300 rounded-lg px-4 py-2">
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
                        onClick={() => setTravelers(Math.max(1, travelers - 1))}
                        disabled={travelers <= 1}
                      >
                        <MinusIcon size={16} />
                      </button>
                      <span className="mx-4 font-medium">
                        {travelers} {travelers === 1 ? 'person' : 'people'}
                      </span>
                      <button
                        type="button"
                        className="text-gray-500 hover:text-gray-700 focus:outline-none disabled:opacity-50"
                        onClick={() => setTravelers(Math.min(20, travelers + 1))}
                        disabled={travelers >= 20}
                      >
                        <PlusIcon size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              {/* Results Count & Submit */}
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-600">
                  {isLoading ? (
                    <div className="flex items-center">
                      <LoaderIcon size={16} className="animate-spin mr-2" />
                      Finding tours...
                    </div>
                  ) : (
                    <span>
                      <span className="font-medium text-gray-900">{tourMatches}</span> tours match
                      your criteria
                    </span>
                  )}
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg flex items-center transition-colors"
                >
                  <SearchIcon size={18} className="mr-2" />
                  Search Tours
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
export default DualSearchBar;
