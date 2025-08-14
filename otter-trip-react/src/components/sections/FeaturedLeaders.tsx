import React from 'react';
import TourLeaderCard from '../ui/TourLeaderCard';
const featuredLeaders = [
  {
    id: '1',
    name: 'Sarah Johnson',
    image:
      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    location: 'Bali, Indonesia',
    rating: 4.9,
    reviewCount: 127,
    specialties: ['Adventure', 'Photography', 'Culture'],
    languages: ['English', 'Indonesian'],
    price: 85,
    availability: '3 spots left',
  },
  {
    id: '2',
    name: 'Miguel Santos',
    image:
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    location: 'Mexico City, Mexico',
    rating: 4.8,
    reviewCount: 94,
    specialties: ['Food', 'History', 'Art'],
    languages: ['English', 'Spanish'],
    price: 75,
    availability: 'Small group - 6 max',
  },
  {
    id: '3',
    name: 'Aisha Patel',
    image:
      'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    location: 'Marrakech, Morocco',
    rating: 4.7,
    reviewCount: 108,
    specialties: ['Culture', 'Shopping', 'Food'],
    languages: ['English', 'Arabic', 'French'],
    price: 65,
    availability: '10 seats available',
  },
  {
    id: '4',
    name: 'Liam Chen',
    image:
      'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
    location: 'Kyoto, Japan',
    rating: 4.9,
    reviewCount: 156,
    specialties: ['History', 'Culture', 'Photography'],
    languages: ['English', 'Japanese', 'Mandarin'],
    price: 90,
    availability: 'Last 2 spots!',
  },
];
const FeaturedLeaders = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-end mb-10">
          <div>
            <h2 className="text-3xl font-bold text-gray-900 mb-2">Featured Tour Leaders</h2>
            <p className="text-xl text-gray-600">Meet our top-rated local experts</p>
          </div>
          <a href="/search" className="text-blue-600 hover:text-blue-800 font-medium">
            View all guides
          </a>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredLeaders.map((leader) => (
            <TourLeaderCard
              key={leader.id}
              id={leader.id}
              name={leader.name}
              image={leader.image}
              location={leader.location}
              rating={leader.rating}
              reviewCount={leader.reviewCount}
              specialties={leader.specialties}
              languages={leader.languages}
              price={leader.price}
              availability={leader.availability}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
export default FeaturedLeaders;
