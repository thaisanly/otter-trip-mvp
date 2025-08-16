'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  UserPlusIcon,
  TrashIcon,
  RefreshCwIcon,
  SearchIcon,
  StarIcon,
  MapPinIcon,
  GlobeIcon,
  UserIcon,
  BriefcaseIcon,
} from 'lucide-react';

interface Expert {
  id: string;
  name: string;
  title: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  hourlyRate: string;
  languages: string[];
  expertise: string[];
  certifications?: string[];
  availability?: Record<string, { available: boolean; start: string; end: string }>;
  bio?: string;
  experience?: string;
  createdAt: string;
  updatedAt: string;
}

export default function ExpertsManagement() {
  const router = useRouter();
  const [experts, setExperts] = useState<Expert[]>([]);
  const [filteredExperts, setFilteredExperts] = useState<Expert[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchExperts();
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const filterExperts = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredExperts(experts);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = experts.filter((expert) => {
      return (
        expert.name.toLowerCase().includes(query) ||
        expert.title.toLowerCase().includes(query) ||
        expert.location.toLowerCase().includes(query) ||
        expert.languages?.some(lang => lang.toLowerCase().includes(query)) ||
        expert.expertise?.some(exp => exp.toLowerCase().includes(query))
      );
    });
    setFilteredExperts(filtered);
  }, [experts, searchQuery]);

  useEffect(() => {
    filterExperts();
  }, [filterExperts]);

  const fetchExperts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/experts');
      if (!response.ok) {
        throw new Error('Failed to fetch experts');
      }
      const data = await response.json();
      setExperts(data);
    } catch (error) {
      console.error('Error fetching experts:', error);
    } finally {
      setLoading(false);
    }
  };


  const handleDeleteExpert = async (expertId: string, expertName: string) => {
    if (
      !window.confirm(
        `Are you sure you want to delete expert "${expertName}"? This action cannot be undone.`
      )
    ) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/experts/${expertId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete expert');
      }

      fetchExperts();
    } catch (error) {
      console.error('Error deleting expert:', error);
      alert('Failed to delete expert. Please try again.');
    }
  };

  return (
    <div className="p-6 max-w-full">
      {/* Page Header */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Experts Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage travel consultation experts and their profiles
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/experts/create')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <UserPlusIcon size={16} className="mr-2" />
              Add Expert
            </button>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <SearchIcon
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search experts by name, title, location, expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                {filteredExperts.length} of {experts.length} experts
              </span>
              <button
                onClick={fetchExperts}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCwIcon size={14} className="mr-1" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Experts Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">All Experts</h2>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading experts...</p>
          </div>
        ) : filteredExperts.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No experts found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery
                ? 'Try adjusting your search criteria.'
                : 'Get started by creating a new expert.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expert
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Title & Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Languages
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expertise
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredExperts.map((expert) => (
                  <tr 
                    key={expert.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/admin/experts/${expert.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 relative">
                          <Image
                            className="rounded-full object-cover"
                            src={expert.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(expert.name)}&background=3B82F6&color=ffffff`}
                            alt={expert.name}
                            fill
                            sizes="40px"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{expert.name}</div>
                          <div className="text-xs text-gray-500">
                            ID: {expert.id.substring(0, 8)}...
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm text-gray-900">{expert.title}</div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPinIcon size={12} className="mr-1" />
                        {expert.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StarIcon size={16} className="text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900 ml-1">
                          {expert.rating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        {expert.hourlyRate}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {expert.languages.slice(0, 2).map((language, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            <GlobeIcon size={10} className="mr-1" />
                            {language}
                          </span>
                        ))}
                        {expert.languages.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{expert.languages.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {expert.expertise.slice(0, 2).map((exp, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-green-100 text-green-800"
                          >
                            <BriefcaseIcon size={10} className="mr-1" />
                            {exp}
                          </span>
                        ))}
                        {expert.expertise.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{expert.expertise.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteExpert(expert.id, expert.name);
                        }}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete Expert"
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
