import React from 'react';
import { Link } from 'react-router-dom';
import { MapPinIcon, StarIcon } from 'lucide-react';
import Rating from './Rating';
type TourLeaderCardProps = {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  personality?: string[];
  languages: string[];
  price: number;
  availability: string;
  userPreferences?: string[];
  showMatchScore?: boolean;
};
const TourLeaderCard = ({
  id,
  name,
  image,
  location,
  rating,
  reviewCount,
  specialties,
  personality = [],
  languages,
  price,
  availability,
  userPreferences = [],
  showMatchScore = false
}: TourLeaderCardProps) => {
  // Calculate personality match score if user preferences exist
  const calculateMatchPercentage = () => {
    if (userPreferences.length === 0 || !personality) return 0;
    const matchCount = personality.filter(trait => userPreferences.includes(trait)).length;
    return Math.round(matchCount / userPreferences.length * 100);
  };
  const matchPercentage = calculateMatchPercentage();
  return <Link to={`/tour-leader/${id}`} className="block group">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md hover:translate-y-[-4px]">
        <div className="relative">
          <div className="aspect-[3/2]">
            <img src={image} alt={name} className="w-full h-full object-cover" />
          </div>
          {showMatchScore && matchPercentage > 0 && <div className="absolute top-3 right-3 bg-white rounded-full shadow-md p-1.5">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                <span className="text-blue-700 font-bold text-sm">
                  {matchPercentage}%
                </span>
              </div>
            </div>}
          {availability.includes('spot') && parseInt(availability) <= 3 && <div className="absolute bottom-3 left-3 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full">
              {availability}
            </div>}
        </div>
        <div className="p-4">
          <div className="flex justify-between items-start mb-2">
            <div>
              <h3 className="font-bold text-lg text-gray-900">{name}</h3>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPinIcon size={14} className="mr-1" />
                {location}
              </div>
            </div>
            <Rating value={rating} reviewCount={reviewCount} size="sm" />
          </div>
          <div className="mb-3">
            <div className="flex flex-wrap gap-1 mb-2">
              {specialties.map((specialty, index) => <span key={`${id}-specialty-${index}`} className="bg-gray-100 text-gray-800 text-xs px-2 py-0.5 rounded-full">
                  {specialty}
                </span>)}
            </div>
            {personality && personality.length > 0 && <div className="flex flex-wrap gap-1">
                {personality.slice(0, 3).map((trait, index) => <span key={`${id}-trait-${index}`} className={`text-xs px-2 py-0.5 rounded-full ${userPreferences.includes(trait) ? 'bg-blue-100 text-blue-800' : 'bg-gray-50 text-gray-600'}`}>
                    {trait}
                  </span>)}
                {personality.length > 3 && <span className="text-xs text-gray-500">
                    +{personality.length - 3} more
                  </span>}
              </div>}
          </div>
          <div className="pt-3 border-t border-gray-100 flex justify-between items-center">
            <div>
              <span className="font-bold text-lg">${price}</span>
              <span className="text-gray-500 text-sm"> / person</span>
            </div>
            <div className="text-sm text-gray-600">{availability}</div>
          </div>
        </div>
      </div>
    </Link>;
};
export default TourLeaderCard;