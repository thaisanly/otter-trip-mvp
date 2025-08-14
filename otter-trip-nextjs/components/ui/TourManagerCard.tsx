'use client'

import React, { useState } from 'react';
import { Link } from 'next/link';
import { HeartIcon, MapPinIcon, GlobeIcon, CheckCircleIcon, StarIcon } from 'lucide-react';
export interface TourManagerProps {
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
  pricePerDay: number;
  currency: string;
  featured?: boolean;
  topRated?: boolean;
  newJoined?: boolean;
}
const TourManagerCard: React.FC<TourManagerProps> = ({
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
  pricePerDay,
  currency,
  featured = false,
  topRated = false,
  newJoined = false,
}) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };
  return (
    <div className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100">
      {(featured || topRated || newJoined) && (
        <div
          className={`text-xs font-medium text-white px-3 py-1 ${featured ? 'bg-purple-600' : topRated ? 'bg-yellow-500' : 'bg-green-500'}`}
        >
          {featured ? 'Featured Expert' : topRated ? 'Top Rated' : 'Newly Joined'}
        </div>
      )}
      <div className="p-5 flex flex-col items-center">
        <div className="relative">
          <div className="w-24 h-24 rounded-full overflow-hidden border-4 border-gray-50 shadow-sm mb-3">
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>
          {verified && (
            <div className="absolute bottom-3 right-0 bg-blue-500 text-white p-1 rounded-full">
              <CheckCircleIcon size={16} />
            </div>
          )}
        </div>
        <h3 className="font-bold text-gray-900 text-lg mb-1">{name}</h3>
        <div className="flex items-center text-gray-600 text-sm mb-2">
          <MapPinIcon size={14} className="mr-1" />
          <span>{location}</span>
          <span className="ml-1">{countryCode}</span>
        </div>
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
          <span className="text-sm font-medium text-gray-800 ml-2">
            {rating}
            <span className="text-gray-500 font-normal">({reviews})</span>
          </span>
        </div>
        <div className="bg-blue-50 text-blue-700 text-xs font-medium px-2 py-1 rounded-full mb-3">
          {experience} years experience
        </div>
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
        <div className="text-center mb-4">
          <div className="text-gray-500 text-xs">From</div>
          <div className="font-bold text-gray-900">
            {currency}
            {pricePerDay}
            <span className="text-gray-500 text-sm font-normal">/day</span>
          </div>
        </div>
        <div className="flex w-full gap-2">
          <Link
            href={`/tour-leader/${id}`}
            className="flex-1 text-center border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
          >
            View Profile
          </Link>
          <button
            onClick={handleFavoriteClick}
            className={`p-2 rounded-lg border ${isFavorite ? 'border-red-200 bg-red-50 text-red-500' : 'border-gray-200 hover:bg-gray-50 text-gray-500'} transition-colors`}
          >
            <HeartIcon size={18} className={isFavorite ? 'fill-current' : ''} />
          </button>
        </div>
      </div>
    </div>
  );
};
export default TourManagerCard;
