'use client'

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  MapPinIcon,
  GlobeIcon,
  CheckCircleIcon,
  StarIcon,
  PlayCircleIcon,
  ShoppingBagIcon,
} from 'lucide-react';
export interface TourExpertProps {
  id: string;
  name: string;
  image: string;
  location: string;
  countryCode: string;
  verified: boolean;
  rating: number;
  reviews: number;
  experience: number;
  languages: string[];
  specialties: string[];
  followers: number;
  isLive?: boolean;
  isTopCreator?: boolean;
  isRisingStar?: boolean;
  videos: number;
  liveStreams: number;
  tours: number;
}
const TourExpertCard: React.FC<TourExpertProps> = ({
  id,
  name,
  image,
  location,
  countryCode,
  verified,
  rating,
  reviews,
  experience,
  languages,
  specialties,
  followers,
  isLive = false,
  isTopCreator = false,
  isRisingStar = false,
  videos,
  liveStreams,
  tours,
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const handleCardClick = () => {
    setIsLoading(true);
    router.push(`/meet-experts/${id}`);
  };
  const handleViewProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsLoading(true);
    router.push(`/meet-experts/${id}`);
  };
  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden transform hover:-translate-y-1 cursor-pointer active:translate-y-0 active:shadow-sm"
      onClick={handleCardClick}
      style={{
        position: 'relative',
      }}
    >
      {/* Loading overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center z-50 rounded-xl">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
        </div>
      )}
      {/* Status indicators */}
      <div className="relative">
        {isLive && (
          <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-medium px-2 py-1 rounded-full flex items-center z-10">
            <span className="w-2 h-2 bg-white rounded-full mr-1 animate-pulse"></span>
            LIVE NOW
          </div>
        )}
        {isTopCreator && (
          <div className="absolute top-4 left-4 bg-yellow-500 text-white text-xs font-medium px-2 py-1 rounded-full z-10">
            TOP CREATOR
          </div>
        )}
        {isRisingStar && (
          <div className="absolute top-4 left-4 bg-purple-600 text-white text-xs font-medium px-2 py-1 rounded-full z-10">
            RISING STAR
          </div>
        )}
      </div>
      <div className="p-6 flex flex-col items-center">
        {/* Profile image with verification */}
        <div className="relative mb-4 cursor-pointer" onClick={handleViewProfileClick}>
          <div className="w-28 h-28 rounded-full overflow-hidden border-4 border-gray-50 shadow-sm hover:border-blue-100 transition-colors">
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>
          {verified && (
            <div className="absolute bottom-1 right-1 bg-blue-500 text-white p-1 rounded-full">
              <CheckCircleIcon size={16} />
            </div>
          )}
          {isLive && (
            <div className="absolute top-0 right-0 w-4 h-4 bg-red-600 rounded-full border-2 border-white animate-pulse"></div>
          )}
        </div>
        {/* Name and location */}
        <h3
          className="font-bold text-gray-900 text-xl mb-1 text-center hover:text-blue-600 hover:underline transition-colors cursor-pointer"
          onClick={handleViewProfileClick}
        >
          {name}
        </h3>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPinIcon size={14} className="mr-1" />
          <span>{location}</span>
          <span className="ml-1">{countryCode}</span>
        </div>
        {/* Rating */}
        <div className="flex items-center mb-3">
          <div className="flex">
            {[...Array(5)].map((_, i) => (
              <StarIcon
                key={i}
                size={14}
                className={
                  i < Math.floor(rating) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                }
              />
            ))}
          </div>
          <span className="text-sm font-medium text-gray-800 ml-2">{rating}/5</span>
        </div>
        {/* Experience badge */}
        <div className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full mb-3">
          {experience} years experience
        </div>
        {/* Languages */}
        <div className="flex flex-wrap gap-1 justify-center mb-3">
          {languages.slice(0, 3).map((language, index) => (
            <div
              key={index}
              className="flex items-center bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full"
            >
              <GlobeIcon size={10} className="mr-1" />
              {language}
            </div>
          ))}
          {languages.length > 3 && (
            <div className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded-full">
              +{languages.length - 3} more
            </div>
          )}
        </div>
        {/* Specialties */}
        <div className="flex flex-wrap gap-1 justify-center mb-4">
          {specialties.slice(0, 3).map((specialty, index) => (
            <span
              key={index}
              className="bg-gray-50 text-gray-700 text-xs px-2 py-0.5 rounded-full border border-gray-200"
            >
              {specialty}
            </span>
          ))}
          {specialties.length > 3 && (
            <span className="bg-gray-50 text-gray-700 text-xs px-2 py-0.5 rounded-full border border-gray-200">
              +{specialties.length - 3}
            </span>
          )}
        </div>
        {/* Content stats */}
        <div className="w-full flex justify-center items-center text-xs text-gray-500 mb-4 px-2 gap-6">
          <div className="flex items-center">
            <ShoppingBagIcon size={12} className="mr-1" />
            <span>{tours} Tours</span>
          </div>
          <div className="flex items-center">
            <PlayCircleIcon size={12} className="mr-1" />
            <span>{liveStreams} Story</span>
          </div>
        </div>
        {/* Action button */}
        <div className="w-full" onClick={(e) => e.stopPropagation()}>
          <button
            onClick={handleViewProfileClick}
            className="w-full text-center border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
          >
            View Profile
          </button>
        </div>
      </div>
    </div>
  );
};
export default TourExpertCard;
