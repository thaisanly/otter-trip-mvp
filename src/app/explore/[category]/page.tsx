'use client'

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { SearchIcon, ArrowLeftIcon } from 'lucide-react';
import TourCard from '@/components/ui/TourCard';
import InterestTag from '@/components/ui/InterestTag';
import { categories, toursByCategory } from '../../../mock/categories';

const Explore = () => {
  const params = useParams();
  const router = useRouter();
  const category = params.category as string;
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  // Get the category data or default to adventure if invalid
  const categoryData = categories[category as keyof typeof categories] || categories.adventure;
  const tours =
    toursByCategory[category as keyof typeof toursByCategory] || toursByCategory.adventure;

  // Filter tours based on search and interests
  const filteredTours = tours.filter((tour: any) => {
    const matchesSearch =
      searchQuery === '' ||
      tour.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      tour.description.toLowerCase().includes(searchQuery.toLowerCase());

    // If no interests are selected, show all tours
    if (selectedInterests.length === 0) return matchesSearch;

    // For demo purposes, just use a random match for interests
    // In a real app, each tour would have tags/interests to filter by
    return matchesSearch;
  });

  // Handle favorite toggle
  const handleFavorite = (id: string) => {
    console.log('Toggled favorite for tour:', id);
  };

  // Handle interest selection
  const handleInterestToggle = (interest: string) => {
    if (selectedInterests.includes(interest)) {
      setSelectedInterests(selectedInterests.filter((i) => i !== interest));
    } else {
      setSelectedInterests([...selectedInterests, interest]);
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen pb-12">
      {/* Hero Section */}
      <div className="relative h-[400px]">
        <img
          src={categoryData.image}
          alt={categoryData.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent"></div>
        <div className="absolute inset-0 flex items-center justify-center text-center">
          <div className="max-w-4xl px-4">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">{categoryData.title}</h1>
            <p className="text-xl text-white/90 max-w-3xl mx-auto">{categoryData.description}</p>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 -mt-10 relative z-10">
        {/* Search Bar */}
        <div className="bg-white rounded-xl shadow-md p-4 mb-8">
          <div className="relative">
            <SearchIcon
              size={20}
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder={`Search ${categoryData.title.toLowerCase()}...`}
              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>

        {/* Interests Tags */}
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Filter by interests</h3>
          <div className="flex flex-wrap gap-3">
            {categoryData.interests.map((interest: string) => (
              <InterestTag
                key={interest}
                label={interest}
                isSelected={selectedInterests.includes(interest)}
                onClick={() => handleInterestToggle(interest)}
              />
            ))}
          </div>
        </div>

        {/* Results count and back button */}
        <div className="flex justify-between items-center mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon size={20} className="mr-2" />
            Back
          </button>
          <p className="text-gray-600">
            Found <span className="font-semibold">{filteredTours.length}</span> tours
          </p>
        </div>

        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour: any) => (
            <TourCard key={tour.id} tour={tour} onFavorite={handleFavorite} />
          ))}
        </div>

        {/* Load More Button */}
        {filteredTours.length > 6 && (
          <div className="text-center mt-10">
            <button className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
              Load More Tours
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Explore;