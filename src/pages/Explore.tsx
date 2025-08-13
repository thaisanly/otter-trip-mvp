import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { SearchIcon, ArrowLeftIcon } from 'lucide-react';
import TourCard from '../components/ui/TourCard';
import InterestTag from '../components/ui/InterestTag';
// Sample category data
const categories = {
  adventure: {
    title: 'Adventure Tours',
    description: 'Thrilling experiences for adrenaline seekers and outdoor enthusiasts',
    image:
      'https://images.unsplash.com/photo-1551632811-561732d1e306?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    interests: ['Hiking', 'Trekking', 'Rafting', 'Climbing', 'Wildlife', 'Camping'],
  },
  cultural: {
    title: 'Cultural Experiences',
    description: 'Immerse yourself in local traditions, history, and authentic cultural encounters',
    image:
      'https://images.unsplash.com/photo-1565967511849-76a60a516170?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    interests: ['History', 'Architecture', 'Museums', 'Local Traditions', 'Art', 'Festivals'],
  },
  relaxation: {
    title: 'Relaxation Getaways',
    description: 'Unwind and rejuvenate with peaceful retreats and leisurely experiences',
    image:
      'https://images.unsplash.com/photo-1540555700478-4be289fbecef?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    interests: ['Beaches', 'Spa', 'Wellness', 'Yoga', 'Nature', 'Island Life'],
  },
  food: {
    title: 'Food & Cuisine',
    description: 'Savor local flavors and culinary traditions around the world',
    image:
      'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
    interests: [
      'Street Food',
      'Cooking Classes',
      'Wine Tasting',
      'Food Markets',
      'Gourmet Tours',
      'Farm to Table',
    ],
  },
};
// Sample tour data
const toursByCategory = {
  adventure: [
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
      id: 'swiss-alps',
      title: 'Swiss Alps',
      description: 'Ski and unwind in the breathtaking Swiss Alps for 5 days.',
      image:
        'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      duration: '5 days',
      price: 'RM12,000',
      rating: 4.8,
      reviews: 86,
      talents: 75,
    },
    {
      id: 'machu-picchu',
      title: 'Machu Picchu',
      description: 'Hike to the ancient ruins of Machu Picchu over 4 days.',
      image:
        'https://images.unsplash.com/photo-1587595431973-160d0d94add1?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      duration: '4 days',
      price: 'RM9,500',
      rating: 4.9,
      reviews: 124,
      talents: 90,
    },
    {
      id: 'african-safari',
      title: 'African Safari',
      description: 'Experience the thrill of a 6-day African safari.',
      image:
        'https://images.unsplash.com/photo-1516426122078-c23e76319801?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      duration: '6 days',
      price: 'RM15,000',
      rating: 4.9,
      reviews: 92,
      talents: 60,
    },
  ],
  cultural: [
    {
      id: 'kyoto-cultural',
      title: 'Kyoto Cultural Tour',
      description:
        'Discover ancient temples, tea ceremonies, and traditional arts in historic Kyoto.',
      image:
        'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      duration: '5 days',
      price: 'RM10,500',
      rating: 4.8,
      reviews: 112,
      talents: 85,
    },
    {
      id: 'rome-historical',
      title: 'Rome Historical Journey',
      description: 'Walk through centuries of history in the Eternal City.',
      image:
        'https://images.unsplash.com/photo-1552832230-c0197dd311b5?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      duration: '4 days',
      price: 'RM9,000',
      rating: 4.7,
      reviews: 98,
      talents: 70,
    },
    {
      id: 'morocco-medinas',
      title: 'Morocco Medinas & Kasbahs',
      description: 'Explore ancient medinas and desert kasbahs with local guides.',
      image:
        'https://images.unsplash.com/photo-1597212618440-806262de4f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      duration: '7 days',
      price: 'RM11,000',
      rating: 4.9,
      reviews: 76,
      talents: 55,
    },
    {
      id: 'china-discovery',
      title: 'China Discovery',
      description: "Explore China's rich history with a 7-day discovery tour.",
      image:
        'https://images.unsplash.com/photo-1508804052814-cd3ba865a116?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      duration: '7 days',
      price: 'RM13,500',
      rating: 4.8,
      reviews: 104,
      talents: 80,
    },
  ],
  relaxation: [
    {
      id: 'bali-retreat',
      title: 'Bali Retreat',
      description: 'Relax and rejuvenate with a 7-day retreat in Bali.',
      image:
        'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      duration: '7 days',
      price: 'RM9,500',
      rating: 4.9,
      reviews: 136,
      talents: 95,
    },
    {
      id: 'maldives-getaway',
      title: 'Maldives Getaway',
      description: 'Experience paradise on earth with crystal clear waters and white sand beaches.',
      image:
        'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      duration: '5 days',
      price: 'RM14,000',
      rating: 4.9,
      reviews: 89,
      talents: 65,
    },
    {
      id: 'santorini-escape',
      title: 'Santorini Escape',
      description: 'Unwind on the beautiful Greek island with stunning views and sunsets.',
      image:
        'https://images.unsplash.com/photo-1469796466635-455ede028ac4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      duration: '6 days',
      price: 'RM11,500',
      rating: 4.8,
      reviews: 102,
      talents: 75,
    },
  ],
  food: [
    {
      id: 'italy-culinary',
      title: 'Italian Culinary Journey',
      description: 'Taste your way through Italy with cooking classes and food tours.',
      image:
        'https://images.unsplash.com/photo-1498579150354-977475b7ea0b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      duration: '8 days',
      price: 'RM13,000',
      rating: 4.9,
      reviews: 118,
      talents: 85,
    },
    {
      id: 'tokyo-food',
      title: 'Tokyo Food Adventure',
      description:
        'Explore the diverse culinary scene of Tokyo from street food to Michelin stars.',
      image:
        'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      duration: '5 days',
      price: 'RM9,800',
      rating: 4.8,
      reviews: 94,
      talents: 70,
    },
    {
      id: 'spain-tapas',
      title: 'Spanish Tapas & Wine Tour',
      description: "Savor tapas, paella, and fine wines across Spain's culinary hotspots.",
      image:
        'https://images.unsplash.com/photo-1515443961218-a51367888e4b?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      duration: '7 days',
      price: 'RM12,500',
      rating: 4.7,
      reviews: 82,
      talents: 65,
    },
    {
      id: 'thailand-street-food',
      title: 'Thailand Street Food Tour',
      description: 'Experience the vibrant street food culture of Bangkok and Chiang Mai.',
      image:
        'https://images.unsplash.com/photo-1504674900247-0877df9cc836?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
      duration: '6 days',
      price: 'RM8,500',
      rating: 4.9,
      reviews: 126,
      talents: 90,
    },
  ],
};
// Avatar images for the talents
const avatars = [
  'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
  'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
];
const Explore = () => {
  const { category } = useParams();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  // Get the category data or default to adventure if invalid
  const categoryData = categories[category as keyof typeof categories] || categories.adventure;
  const tours =
    toursByCategory[category as keyof typeof toursByCategory] || toursByCategory.adventure;
  // Filter tours based on search and interests
  const filteredTours = tours.filter((tour) => {
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
          <h2 className="text-lg font-medium text-gray-900 mb-3">Popular Interests</h2>
          <div className="flex flex-wrap gap-2">
            {categoryData.interests.map((interest, index) => (
              <InterestTag
                key={index}
                label={interest}
                selected={selectedInterests.includes(interest)}
                onClick={() => handleInterestToggle(interest)}
              />
            ))}
          </div>
        </div>
        {/* Results Count */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-bold text-gray-900">{filteredTours.length} tours found</h2>
          <button
            className="flex items-center text-blue-600 hover:text-blue-800"
            onClick={() => navigate(-1)}
          >
            <ArrowLeftIcon size={16} className="mr-1" />
            Back
          </button>
        </div>
        {/* Tours Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTours.map((tour) => (
            <TourCard key={tour.id} tour={tour} onFavorite={handleFavorite} avatars={avatars} />
          ))}
        </div>
        {filteredTours.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <SearchIcon size={24} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-medium text-gray-900 mb-2">No tours found</h3>
            <p className="text-gray-600 mb-6">
              Try adjusting your search or filters to find what you're looking for.
            </p>
            <button
              className="text-blue-600 font-medium hover:text-blue-800"
              onClick={() => {
                setSearchQuery('');
                setSelectedInterests([]);
              }}
            >
              Clear all filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
export default Explore;
