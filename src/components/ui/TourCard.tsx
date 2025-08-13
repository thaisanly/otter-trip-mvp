import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { HeartIcon, StarIcon } from 'lucide-react';
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
  };
  onFavorite?: (id: string) => void;
  avatars?: string[];
}
const TourCard: React.FC<TourCardProps> = ({ tour, onFavorite, avatars = [] }) => {
  const [isFavorite, setIsFavorite] = useState(false);
  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsFavorite(!isFavorite);
    if (onFavorite) {
      onFavorite(tour.id);
    }
  };
  return (
    <Link to={`/tour/${tour.id}`} className="block">
      <div className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow">
        <div className="relative">
          <img src={tour.image} alt={tour.title} className="w-full h-48 object-cover" />
          <button
            onClick={handleFavoriteClick}
            className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/80 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors"
          >
            <HeartIcon
              size={18}
              className={`${isFavorite ? 'text-red-500 fill-red-500' : 'text-gray-600'}`}
            />
          </button>
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
              <span className="text-xs text-gray-500 ml-1">({tour.reviews})</span>
            </div>
          </div>
          <p className="text-gray-600 text-sm mb-3 line-clamp-2">{tour.description}</p>
          <div className="flex justify-between items-end">
            <div>
              <div className="text-gray-900 font-bold">{tour.price}</div>
              <div className="text-gray-500 text-xs">per person</div>
            </div>
            {tour.talents && avatars.length > 0 && (
              <div className="flex items-center">
                <div className="flex -space-x-2 mr-2">
                  {avatars.slice(0, 3).map((avatar, index) => (
                    <img
                      key={index}
                      src={avatar}
                      alt="Tour guide"
                      className="w-6 h-6 rounded-full border border-white"
                    />
                  ))}
                </div>
                <span className="text-xs text-gray-600">{tour.talents}+ guides</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};
export default TourCard;
