'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  TrashIcon,
  RefreshCwIcon,
  SearchIcon,
  StarIcon,
  MapPinIcon,
  ClockIcon,
  DollarSignIcon,
  UsersIcon,
  TagIcon,
} from 'lucide-react';

interface Tour {
  id: string;
  code: string;
  title: string;
  heroImage: string;
  duration: string;
  price: string;
  totalJoined: number;
  rating: number;
  reviewCount: number;
  location: string;
  categories: string[];
  groupSize?: number;
  spotsLeft?: number;
  tourLeaderId?: string;
  tourLeader?: {
    id: string;
    name: string;
    specialty: string;
  };
  createdAt: string;
  updatedAt: string;
}


const categoryColors: Record<string, string> = {
  adventure: 'bg-orange-100 text-orange-800',
  cultural: 'bg-purple-100 text-purple-800',
  relaxation: 'bg-green-100 text-green-800',
  food: 'bg-red-100 text-red-800',
  default: 'bg-gray-100 text-gray-800',
};

export default function ToursManagement() {
  const router = useRouter();
  const [tours, setTours] = useState<Tour[]>([]);
  const [filteredTours, setFilteredTours] = useState<Tour[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchTours();
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const filterTours = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredTours(tours);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tours.filter((tour) => {
      return (
        tour.code.toLowerCase().includes(query) ||
        tour.title.toLowerCase().includes(query) ||
        tour.location.toLowerCase().includes(query) ||
        tour.categories?.some(cat => cat.toLowerCase().includes(query)) ||
        tour.tourLeader?.name.toLowerCase().includes(query)
      );
    });
    setFilteredTours(filtered);
  }, [searchQuery, tours]);

  useEffect(() => {
    filterTours();
  }, [filterTours]);

  const fetchTours = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/tours');
      if (!response.ok) throw new Error('Failed to fetch tours');
      const data = await response.json();
      setTours(data);
      setFilteredTours(data);
    } catch (error) {
      console.error('Error fetching tours:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (tourId: string) => {
    if (!window.confirm('Are you sure you want to delete this tour?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tours/${tourId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTours();
      }
    } catch (error) {
      console.error('Error deleting tour:', error);
    }
  };

  const getCategoryColor = (category: string) => {
    return categoryColors[category.toLowerCase()] || categoryColors.default;
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tours Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage tour packages and itineraries
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/tours/create')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon size={16} className="mr-2" />
              Add Tour
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by title, code, location, or category..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Tours Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">All Tours ({filteredTours.length})</h2>
            <button
              onClick={fetchTours}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCwIcon size={14} className="mr-1" />
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading tours...</p>
          </div>
        ) : filteredTours.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <TagIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No tours found</p>
            <button
              onClick={() => router.push('/admin/tours/create')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon size={16} className="mr-2" />
              Create First Tour
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour Leader
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Duration & Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Availability
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Categories
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTours.map((tour) => (
                  <tr 
                    key={tour.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/admin/tours/${tour.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-16 w-24 flex-shrink-0 relative">
                          <Image
                            className="rounded-lg object-cover"
                            src={tour.heroImage || `https://via.placeholder.com/96x64/CBD5E1/64748B?text=Tour`}
                            alt={tour.title}
                            fill
                            sizes="96px"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{tour.title}</div>
                          <div className="text-xs text-gray-500">Code: {tour.code}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPinIcon className="w-4 h-4 mr-1 text-gray-400" />
                        {tour.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {tour.tourLeader ? (
                        <div className="text-sm">
                          <div className="font-medium text-gray-900">{tour.tourLeader.name}</div>
                          <div className="text-xs text-gray-500">{tour.tourLeader.specialty}</div>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">Not assigned</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <ClockIcon className="w-4 h-4 mr-1 text-gray-400" />
                          {tour.duration}
                        </div>
                        <div className="flex items-center mt-1">
                          <DollarSignIcon className="w-4 h-4 mr-1 text-green-500" />
                          <span className="text-green-600 font-medium">{tour.price}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < Math.floor(tour.rating || 0)
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="ml-2 text-sm text-gray-600">
                          ({tour.reviewCount || 0})
                        </span>
                      </div>
                      <div className="text-xs text-gray-500 mt-1">
                        {tour.totalJoined || 0} joined
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <UsersIcon className="w-4 h-4 mr-1 text-gray-400" />
                          Group: {tour.groupSize || 10}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {tour.spotsLeft || 0} spots left
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {tour.categories?.slice(0, 2).map((category: string, index: number) => (
                          <span
                            key={index}
                            className={`inline-flex px-2 py-1 text-xs rounded-full ${getCategoryColor(
                              category
                            )}`}
                          >
                            {category}
                          </span>
                        ))}
                        {tour.categories?.length > 2 && (
                          <span className="inline-flex px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-600">
                            +{tour.categories.length - 2}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(tour.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
                      >
                        <TrashIcon size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}