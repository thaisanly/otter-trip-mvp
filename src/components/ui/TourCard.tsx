'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { StarIcon } from 'lucide-react';
interface TourCardProps {
  tour: {
    id: string;
    title: string;
    description: string;
    image: string;
    duration: string;
    price: string;
    rating: number;
    reviews: number;
    talents?: number;
    hasAvailableDates: boolean;
    dates?: { id: string; date: string; spotsLeft: number; price: string }[]; // Array of available dates
    guide?: {
      name: string;
      image: string;
    };
    tourLeader?: {
      id: string;
      name: string;
      image: string;
    };
  };
  onFavorite?: (id: string) => void;
}
const TourCard: React.FC<TourCardProps> = ({ tour }) => {
  const router = useRouter();
  
  // Check if dates are empty or no available dates
  const hasNoDates = !tour.dates || tour.dates.length === 0;
  const isDisabled = !tour.hasAvailableDates || hasNoDates;

  // Prioritize tour leader over guide
  const displayGuide = tour.tourLeader || tour.guide;

  const handleBookClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDisabled) {
      router.push(`/booking/${tour.id}`);
    }
  };

  return (
    <Link href={`/tour/${tour.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative">
          <Image src={tour.image} alt={tour.title} width={400} height={192} className="w-full h-48 object-cover" />
          <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded-full">
            {tour.duration}
          </div>
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-bold text-gray-900 line-clamp-1">{tour.title}</h3>
            <div className="flex items-center">
              <StarIcon size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
              <span className="text-sm font-medium text-gray-900">{tour.rating}</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tour.description}</p>
          <div className="flex justify-between items-end mb-3">
            <div>
              <div className="text-gray-900 font-bold">{tour.price}</div>
              <div className="text-gray-500 text-xs">per person</div>
            </div>
            {displayGuide && (
              <div className="flex items-center">
                <Image
                  src={displayGuide.image}
                  alt={displayGuide.name}
                  width={24}
                  height={24}
                  className="w-6 h-6 rounded-full mr-2 object-cover"
                />
                <span className="text-xs text-gray-600">{displayGuide.name}</span>
              </div>
            )}
          </div>
          <button
            onClick={handleBookClick}
            disabled={isDisabled}
            className={`w-full font-medium py-2 px-4 rounded-lg transition-colors ${
              isDisabled 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed border border-gray-200' 
                : 'bg-blue-600 hover:bg-blue-700 text-white'
            }`}
          >
            {hasNoDates ? 'No dates available' : isDisabled ? 'No dates available' : 'Book Now'}
          </button>
        </div>
      </div>
    </Link>
  );
};
export default TourCard;
