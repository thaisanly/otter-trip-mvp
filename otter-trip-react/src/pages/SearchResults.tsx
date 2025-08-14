import React, { useState } from 'react';
import {
  MapIcon,
  SlidersIcon,
  XIcon,
  CompassIcon,
  UtensilsIcon,
  CameraIcon,
  HeartIcon,
  HistoryIcon,
  PaletteIcon,
  BuildingIcon,
  ShoppingBagIcon,
  GlobeIcon,
  UserIcon,
  ZapIcon,
  GraduationCapIcon,
  UsersIcon,
  UserPlusIcon,
  MountainIcon,
  SparklesIcon,
  DollarSignIcon,
  StarIcon,
  CalendarIcon,
} from 'lucide-react';
import SearchBar from '../components/ui/SearchBar';
import TourLeaderCard from '../components/ui/TourLeaderCard';
import InterestTag from '../components/ui/InterestTag';
// Mock data for search results
// Data moved to mock files
import { tourLeaders, interests, personalityTraits, languages } from '../mock/tourLeaders';
const SearchResults = () => {
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedPersonality, setSelectedPersonality] = useState<string[]>([
    'Adventurous',
    'Photography',
  ]);
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<number>(250);
  const [selectedRatings, setSelectedRatings] = useState<number[]>([]);
  const toggleInterest = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };
  const togglePersonality = (trait: string) => {
    if (selectedPersonality.includes(trait)) {
      setSelectedPersonality(selectedPersonality.filter((t) => t !== trait));
    } else {
      setSelectedPersonality([...selectedPersonality, trait]);
    }
  };
  const toggleLanguage = (language: string) => {
    if (selectedLanguages.includes(language)) {
      setSelectedLanguages(selectedLanguages.filter((l) => l !== language));
    } else {
      setSelectedLanguages([...selectedLanguages, language]);
    }
  };
  const toggleRating = (rating: number) => {
    if (selectedRatings.includes(rating)) {
      setSelectedRatings(selectedRatings.filter((r) => r !== rating));
    } else {
      setSelectedRatings([...selectedRatings, rating]);
    }
  };
  const clearAllFilters = () => {
    setSelectedInterests([]);
    setSelectedPersonality([]);
    setSelectedLanguages([]);
    setSelectedRatings([]);
    setPriceRange(250);
  };
  return (
    <div className="bg-gray-50 min-h-screen">
      <div className="bg-white shadow-sm py-6">
        <div className="container mx-auto px-4">
          <SearchBar />
        </div>
      </div>
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Tour Leaders in Bali, Indonesia</h1>
          <div className="flex space-x-3">
            <button
              className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50"
              onClick={() => setIsFilterOpen(!isFilterOpen)}
            >
              <SlidersIcon size={18} />
              <span>Filters</span>
            </button>
            <button className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg bg-white text-gray-700 hover:bg-gray-50">
              <MapIcon size={18} />
              <span>Map View</span>
            </button>
          </div>
        </div>
        {/* Personality Match Banner */}
        {selectedPersonality.length > 0 && (
          <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex justify-between items-center">
            <div className="flex items-center">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                <span className="text-blue-600 text-lg">🔍</span>
              </div>
              <div>
                <h3 className="font-medium text-gray-900">Personality Matching Active</h3>
                <p className="text-sm text-gray-600">
                  Showing guides that match your {selectedPersonality.join(', ')} preferences
                </p>
              </div>
            </div>
            <button
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
              onClick={() => setSelectedPersonality([])}
            >
              Clear Preferences
            </button>
          </div>
        )}
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar - Mobile */}
          {isFilterOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden flex">
              <div className="bg-white w-full max-w-xs p-4 ml-auto h-full overflow-y-auto">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Filters</h2>
                  <button onClick={() => setIsFilterOpen(false)}>
                    <XIcon size={24} />
                  </button>
                </div>
                {/* Filter Content */}
                <div className="space-y-6">
                  <div>
                    <h3 className="font-medium mb-3 flex items-center">
                      <CompassIcon size={18} className="mr-2 text-blue-600" />
                      Interests
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {interests.map((interest) => (
                        <InterestTag
                          key={interest}
                          label={interest}
                          icon={interestIcons[interest as keyof typeof interestIcons]}
                          selected={selectedInterests.includes(interest)}
                          onClick={() => toggleInterest(interest)}
                          className="mb-2 text-xs"
                          iconPosition="top"
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3 flex items-center">
                      <UserIcon size={18} className="mr-2 text-blue-600" />
                      Travel Style & Personality
                    </h3>
                    <div className="grid grid-cols-3 gap-2">
                      {personalityTraits.map((trait) => (
                        <InterestTag
                          key={trait}
                          label={trait}
                          icon={personalityIcons[trait as keyof typeof personalityIcons]}
                          selected={selectedPersonality.includes(trait)}
                          onClick={() => togglePersonality(trait)}
                          className="mb-2 text-xs"
                          iconPosition="top"
                        />
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3 flex items-center">
                      <GlobeIcon size={18} className="mr-2 text-blue-600" />
                      Languages
                    </h3>
                    <div className="grid grid-cols-2 gap-2">
                      {languages.map((language) => (
                        <label
                          key={language}
                          className="flex items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={selectedLanguages.includes(language)}
                            onChange={() => toggleLanguage(language)}
                          />
                          {language}
                        </label>
                      ))}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3 flex items-center">
                      <DollarSignIcon size={18} className="mr-2 text-blue-600" />
                      Price Range
                    </h3>
                    <div className="px-2">
                      <input
                        type="range"
                        min="0"
                        max="500"
                        value={priceRange}
                        onChange={(e) => setPriceRange(parseInt(e.target.value))}
                        className="w-full accent-blue-600"
                      />
                      <div className="flex justify-between mt-2 text-sm text-gray-600">
                        <span>$0</span>
                        <span>${priceRange}</span>
                        <span>$500+</span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <h3 className="font-medium mb-3 flex items-center">
                      <StarIcon size={18} className="mr-2 text-blue-600" />
                      Rating
                    </h3>
                    <div className="space-y-2">
                      {[4, 3, 2, 1].map((rating) => (
                        <label
                          key={rating}
                          className="flex items-center p-2 border rounded-md hover:bg-gray-50 cursor-pointer"
                        >
                          <input
                            type="checkbox"
                            className="mr-2"
                            checked={selectedRatings.includes(rating)}
                            onChange={() => toggleRating(rating)}
                          />
                          {rating}+ stars
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-8 flex space-x-3">
                  <button
                    className="flex-1 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    onClick={clearAllFilters}
                  >
                    Clear All
                  </button>
                  <button
                    className="flex-1 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    onClick={() => setIsFilterOpen(false)}
                  >
                    Apply
                  </button>
                </div>
              </div>
            </div>
          )}
          {/* Filters Sidebar - Desktop */}
          <div className="hidden lg:block w-64 bg-white p-6 rounded-lg shadow-sm h-fit sticky top-20">
            <h2 className="text-xl font-bold mb-6">Filters</h2>
            <div className="space-y-6">
              <div>
                <h3 className="font-medium mb-3 flex items-center text-gray-700">
                  <CompassIcon size={16} className="mr-2 text-blue-600" />
                  Interests
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {interests.slice(0, 9).map((interest) => (
                    <InterestTag
                      key={interest}
                      label={interest}
                      icon={interestIcons[interest as keyof typeof interestIcons]}
                      selected={selectedInterests.includes(interest)}
                      onClick={() => toggleInterest(interest)}
                      className="mb-0 text-xs"
                      iconPosition="top"
                    />
                  ))}
                </div>
                {interests.length > 9 && (
                  <button className="text-sm text-blue-600 mt-2 hover:underline">Show more</button>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-3 flex items-center text-gray-700">
                  <UserIcon size={16} className="mr-2 text-blue-600" />
                  Travel Style & Personality
                </h3>
                <div className="grid grid-cols-3 gap-2">
                  {personalityTraits.slice(0, 9).map((trait) => (
                    <InterestTag
                      key={trait}
                      label={trait}
                      icon={personalityIcons[trait as keyof typeof personalityIcons]}
                      selected={selectedPersonality.includes(trait)}
                      onClick={() => togglePersonality(trait)}
                      className="mb-0 text-xs"
                      iconPosition="top"
                    />
                  ))}
                </div>
                {personalityTraits.length > 9 && (
                  <button className="text-sm text-blue-600 mt-2 hover:underline">Show more</button>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-3 flex items-center text-gray-700">
                  <GlobeIcon size={16} className="mr-2 text-blue-600" />
                  Languages
                </h3>
                <div className="space-y-1">
                  {languages.slice(0, 5).map((language) => (
                    <label
                      key={language}
                      className="flex items-center text-sm p-1.5 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mr-2 accent-blue-600"
                        checked={selectedLanguages.includes(language)}
                        onChange={() => toggleLanguage(language)}
                      />
                      {language}
                    </label>
                  ))}
                </div>
                {languages.length > 5 && (
                  <button className="text-sm text-blue-600 mt-2 hover:underline">Show more</button>
                )}
              </div>
              <div>
                <h3 className="font-medium mb-3 flex items-center text-gray-700">
                  <DollarSignIcon size={16} className="mr-2 text-blue-600" />
                  Price Range
                </h3>
                <div className="px-1">
                  <input
                    type="range"
                    min="0"
                    max="500"
                    value={priceRange}
                    onChange={(e) => setPriceRange(parseInt(e.target.value))}
                    className="w-full accent-blue-600"
                  />
                  <div className="flex justify-between mt-2 text-xs text-gray-600">
                    <span>$0</span>
                    <span className="font-medium">${priceRange}</span>
                    <span>$500+</span>
                  </div>
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3 flex items-center text-gray-700">
                  <StarIcon size={16} className="mr-2 text-blue-600" />
                  Rating
                </h3>
                <div className="space-y-1">
                  {[4, 3, 2, 1].map((rating) => (
                    <label
                      key={rating}
                      className="flex items-center text-sm p-1.5 rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        className="mr-2 accent-blue-600"
                        checked={selectedRatings.includes(rating)}
                        onChange={() => toggleRating(rating)}
                      />
                      {rating}+ stars
                    </label>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="font-medium mb-3 flex items-center text-gray-700">
                  <CalendarIcon size={16} className="mr-2 text-blue-600" />
                  Availability
                </h3>
                <div className="space-y-1">
                  <label className="flex items-center text-sm p-1.5 rounded hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" className="mr-2 accent-blue-600" />
                    Available next week
                  </label>
                  <label className="flex items-center text-sm p-1.5 rounded hover:bg-gray-50 cursor-pointer">
                    <input type="checkbox" className="mr-2 accent-blue-600" />
                    Available next month
                  </label>
                </div>
              </div>
            </div>
            <div className="mt-8 space-y-3">
              <button
                className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50 text-sm"
                onClick={clearAllFilters}
              >
                Clear All
              </button>
              <button className="w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm">
                Apply Filters
              </button>
            </div>
          </div>
          {/* Results */}
          <div className="flex-1">
            <div className="flex justify-between items-center mb-4">
              <p className="text-gray-600">Showing {tourLeaders.length} tour leaders</p>
              <select className="border border-gray-300 rounded-lg p-2 bg-white text-sm">
                <option>Sort: Recommended</option>
                <option>Sort: Personality Match</option>
                <option>Price: Low to High</option>
                <option>Price: High to Low</option>
                <option>Rating: High to Low</option>
              </select>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {tourLeaders.map((leader) => (
                <TourLeaderCard
                  key={leader.id}
                  id={leader.id}
                  name={leader.name}
                  image={leader.image}
                  location={leader.location}
                  rating={leader.rating}
                  reviewCount={leader.reviewCount}
                  specialties={leader.specialties}
                  personality={leader.personality}
                  languages={leader.languages}
                  price={leader.price}
                  availability={leader.availability}
                  userPreferences={selectedPersonality}
                  showMatchScore={selectedPersonality.length > 0}
                />
              ))}
            </div>
            <div className="mt-8 flex justify-center">
              <button className="px-6 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50">
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default SearchResults;
