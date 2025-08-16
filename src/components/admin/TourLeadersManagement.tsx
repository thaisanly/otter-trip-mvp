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
  DollarSignIcon,
  GlobeIcon,
  UserIcon,
  BriefcaseIcon,
  ImageIcon,
  ClockIcon,
  AwardIcon,
  FileTextIcon,
  TagIcon,
} from 'lucide-react';

interface TourLeader {
  id: string;
  name: string;
  image: string;
  location: string;
  specialty: string;
  description: string;
  price: string;
  isSuperhost: boolean;
  languages: string[];
  experience: string;
  certifications: string[];
  bio: string;
  expertiseAreas: string[];
  rating: number;
  reviewCount?: number;
  createdAt: string;
  updatedAt: string;
}

interface TourLeaderFormData {
  name: string;
  image: string;
  location: string;
  specialty: string;
  description: string;
  price: string;
  isSuperhost: boolean;
  languages: string;
  experience: string;
  certifications: string;
  bio: string;
  expertiseAreas: string;
  rating: number;
}

export default function TourLeadersManagement() {
  const router = useRouter();
  const [tourLeaders, setTourLeaders] = useState<TourLeader[]>([]);
  const [filteredTourLeaders, setFilteredTourLeaders] = useState<TourLeader[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingTourLeader, setEditingTourLeader] = useState<TourLeader | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState<TourLeaderFormData>({
    name: '',
    image: '',
    location: '',
    specialty: '',
    description: '',
    price: '',
    isSuperhost: false,
    languages: '',
    experience: '',
    certifications: '',
    bio: '',
    expertiseAreas: '',
    rating: 5.0,
  });

  useEffect(() => {
    fetchTourLeaders();
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const filterTourLeaders = useCallback(() => {
    if (!searchQuery.trim()) {
      setFilteredTourLeaders(tourLeaders);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = tourLeaders.filter((tourLeader) => {
      return (
        tourLeader.name.toLowerCase().includes(query) ||
        tourLeader.location.toLowerCase().includes(query) ||
        tourLeader.specialty.toLowerCase().includes(query) ||
        tourLeader.languages?.some(lang => lang.toLowerCase().includes(query)) ||
        tourLeader.expertiseAreas?.some(area => area.toLowerCase().includes(query))
      );
    });
    setFilteredTourLeaders(filtered);
  }, [searchQuery, tourLeaders]);

  useEffect(() => {
    filterTourLeaders();
  }, [filterTourLeaders]);

  const fetchTourLeaders = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/tour-leaders');
      if (!response.ok) {
        throw new Error('Failed to fetch tour leaders');
      }
      const data = await response.json();
      setTourLeaders(data);
    } catch (error) {
      console.error('Error fetching tour leaders:', error);
    } finally {
      setLoading(false);
    }
  };


  const resetForm = () => {
    setFormData({
      name: '',
      image: '',
      location: '',
      specialty: '',
      description: '',
      price: '',
      isSuperhost: false,
      languages: '',
      experience: '',
      certifications: '',
      bio: '',
      expertiseAreas: '',
      rating: 5.0,
    });
  };

  const handleCreateTourLeader = async () => {
    if (!formData.name.trim() || !formData.image.trim() || !formData.specialty.trim()) {
      alert('Please fill in all required fields (Name, Image URL, Specialty)');
      return;
    }

    try {
      setSubmitting(true);
      const tourLeaderData = {
        ...formData,
        languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang),
        certifications: formData.certifications.split(',').map(cert => cert.trim()).filter(cert => cert),
        expertiseAreas: formData.expertiseAreas.split(',').map(area => area.trim()).filter(area => area),
        reviewCount: 0,
      };

      const response = await fetch('/api/admin/tour-leaders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourLeaderData),
      });

      if (!response.ok) {
        throw new Error('Failed to create tour leader');
      }

      setShowCreateModal(false);
      resetForm();
      fetchTourLeaders();
    } catch (error) {
      console.error('Error creating tour leader:', error);
      alert('Failed to create tour leader. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateTourLeader = async () => {
    if (!editingTourLeader) return;

    if (!formData.name.trim() || !formData.image.trim() || !formData.specialty.trim()) {
      alert('Please fill in all required fields (Name, Image URL, Specialty)');
      return;
    }

    try {
      setSubmitting(true);
      const tourLeaderData = {
        ...formData,
        languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang),
        certifications: formData.certifications.split(',').map(cert => cert.trim()).filter(cert => cert),
        expertiseAreas: formData.expertiseAreas.split(',').map(area => area.trim()).filter(area => area),
        reviewCount: editingTourLeader.reviewCount || 0, // Keep existing review count
      };

      const response = await fetch(`/api/admin/tour-leaders/${editingTourLeader.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourLeaderData),
      });

      if (!response.ok) {
        throw new Error('Failed to update tour leader');
      }

      setShowEditModal(false);
      setEditingTourLeader(null);
      resetForm();
      fetchTourLeaders();
    } catch (error) {
      console.error('Error updating tour leader:', error);
      alert('Failed to update tour leader. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteTourLeader = async (tourLeaderId: string, tourLeaderName: string) => {
    if (!window.confirm(`Are you sure you want to delete tour leader "${tourLeaderName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tour-leaders/${tourLeaderId}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete tour leader');
      }

      fetchTourLeaders();
    } catch (error) {
      console.error('Error deleting tour leader:', error);
      alert('Failed to delete tour leader. Please try again.');
    }
  };


  const closeModals = () => {
    setShowCreateModal(false);
    setShowEditModal(false);
    setEditingTourLeader(null);
    resetForm();
  };

  return (
    <div className="p-6 max-w-full">
      {/* Page Header */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Tour Leaders Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage travel tour leaders and their profiles
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/tour-leaders/create')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              <UserPlusIcon size={16} className="mr-2" />
              Add Tour Leader
            </button>
          </div>
        </div>
      </div>

      {/* Search and Controls */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search tour leaders by name, specialty, location, expertise..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            <div className="flex items-center space-x-3">
              <span className="text-sm text-gray-500">
                {filteredTourLeaders.length} of {tourLeaders.length} tour leaders
              </span>
              <button
                onClick={fetchTourLeaders}
                className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                <RefreshCwIcon size={14} className="mr-1" />
                Refresh
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Tour Leaders Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-medium text-gray-900">All Tour Leaders</h2>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading tour leaders...</p>
          </div>
        ) : filteredTourLeaders.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <UserIcon className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No tour leaders found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery ? 'Try adjusting your search criteria.' : 'Get started by creating a new tour leader.'}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour Leader
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Location & Specialty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rating
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Languages
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredTourLeaders.map((leader) => (
                  <tr 
                    key={leader.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/admin/tour-leaders/${leader.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 flex-shrink-0 relative">
                          <Image
                            className="rounded-full object-cover"
                            src={leader.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(leader.name)}&background=3B82F6&color=ffffff`}
                            alt={leader.name}
                            fill
                            sizes="40px"
                          />
                        </div>
                        <div className="ml-4">
                          <div className="flex items-center">
                            <div className="text-sm font-medium text-gray-900">{leader.name}</div>
                          </div>
                          <div className="text-xs text-gray-500">ID: {leader.id.substring(0, 8)}...</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">{leader.specialty}</div>
                      <div className="text-xs text-gray-500 flex items-center mt-1">
                        <MapPinIcon size={12} className="mr-1" />
                        {leader.location}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <StarIcon size={16} className="text-yellow-400 fill-current" />
                        <span className="text-sm font-medium text-gray-900 ml-1">
                          {leader.rating.toFixed(1)}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-wrap gap-1">
                        {leader.languages.slice(0, 2).map((language, index) => (
                          <span
                            key={index}
                            className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800"
                          >
                            <GlobeIcon size={10} className="mr-1" />
                            {language}
                          </span>
                        ))}
                        {leader.languages.length > 2 && (
                          <span className="text-xs text-gray-500">
                            +{leader.languages.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDeleteTourLeader(leader.id, leader.name);
                        }}
                        className="text-red-600 hover:text-red-900 transition-colors"
                        title="Delete Tour Leader"
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

      {/* Create/Edit Modal */}
      {(showCreateModal || showEditModal) && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="px-6 py-4 border-b border-gray-200">
              <h3 className="text-lg font-medium text-gray-900">
                {showCreateModal ? 'Create New Tour Leader' : 'Edit Tour Leader'}
              </h3>
            </div>
            
            <div className="px-6 py-4">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Basic Information</h4>
                  
                  {/* Name */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <UserIcon className="inline w-4 h-4 mr-1" />
                      Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Tour Leader Name"
                      required
                    />
                  </div>

                  {/* Image URL */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <ImageIcon className="inline w-4 h-4 mr-1" />
                      Image URL *
                    </label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Provide an absolute URL to the tour leader&apos;s profile image
                    </p>
                  </div>

                  {/* Location */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <MapPinIcon className="inline w-4 h-4 mr-1" />
                      Location
                    </label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="City, Country"
                    />
                  </div>

                  {/* Specialty */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <BriefcaseIcon className="inline w-4 h-4 mr-1" />
                      Specialty *
                    </label>
                    <input
                      type="text"
                      value={formData.specialty}
                      onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Adventure Tours, Cultural Experiences, etc."
                      required
                    />
                  </div>

                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <DollarSignIcon className="inline w-4 h-4 mr-1" />
                      Price
                    </label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="$150/day"
                    />
                  </div>

                  {/* Superhost Checkbox */}
                  <div>
                    <label className="flex items-center">
                      <input
                        type="checkbox"
                        checked={formData.isSuperhost}
                        onChange={(e) => setFormData({ ...formData, isSuperhost: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-sm font-medium text-gray-700">
                        <StarIcon className="inline w-4 h-4 mr-1 text-yellow-500" />
                        Superhost Status
                      </span>
                    </label>
                  </div>

                  {/* Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <StarIcon className="inline w-4 h-4 mr-1" />
                      Rating (0-5)
                    </label>
                    <input
                      type="number"
                      min="0"
                      max="5"
                      step="0.1"
                      value={formData.rating}
                      onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) || 0 })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>

                {/* Additional Information */}
                <div className="space-y-4">
                  <h4 className="text-md font-medium text-gray-900 mb-3">Additional Information</h4>
                  
                  {/* Languages */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <GlobeIcon className="inline w-4 h-4 mr-1" />
                      Languages
                    </label>
                    <input
                      type="text"
                      value={formData.languages}
                      onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="English, Spanish, French"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Separate languages with commas
                    </p>
                  </div>

                  {/* Experience */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <ClockIcon className="inline w-4 h-4 mr-1" />
                      Experience
                    </label>
                    <input
                      type="text"
                      value={formData.experience}
                      onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="5 years"
                    />
                  </div>

                  {/* Certifications */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <AwardIcon className="inline w-4 h-4 mr-1" />
                      Certifications
                    </label>
                    <input
                      type="text"
                      value={formData.certifications}
                      onChange={(e) => setFormData({ ...formData, certifications: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Certified Guide, First Aid, Mountain Rescue"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Separate certifications with commas
                    </p>
                  </div>

                  {/* Expertise Areas */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <TagIcon className="inline w-4 h-4 mr-1" />
                      Expertise Areas
                    </label>
                    <input
                      type="text"
                      value={formData.expertiseAreas}
                      onChange={(e) => setFormData({ ...formData, expertiseAreas: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Hiking, Photography, Local Culture, Wildlife"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Separate expertise areas with commas
                    </p>
                  </div>
                </div>

                {/* Text Areas - Full Width */}
                <div className="lg:col-span-2 space-y-4">
                  {/* Description */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      <FileTextIcon className="inline w-4 h-4 mr-1" />
                      Description
                    </label>
                    <textarea
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Brief description of the tour leader and their specialty..."
                    />
                  </div>

                  {/* Bio */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Bio
                    </label>
                    <textarea
                      rows={4}
                      value={formData.bio}
                      onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Detailed biography and professional background..."
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={closeModals}
                disabled={submitting}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={showCreateModal ? handleCreateTourLeader : handleUpdateTourLeader}
                disabled={submitting}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2 inline-block"></div>
                    {showCreateModal ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  showCreateModal ? 'Create Tour Leader' : 'Update Tour Leader'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}