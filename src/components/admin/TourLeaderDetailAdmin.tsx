'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  EditIcon,
  TrashIcon,
  MapPinIcon,
  StarIcon,
  GlobeIcon,
  AwardIcon,
  BriefcaseIcon,
  CalendarIcon,
  UserIcon,
  ShieldCheckIcon,
  MapIcon,
  MessageSquareIcon,
  SaveIcon,
  XIcon,
  LoaderIcon,
  CodeIcon,
  FileTextIcon,
  EyeIcon,
  CheckIcon,
} from 'lucide-react';

interface TourLeader {
  id: string;
  name: string;
  image: string;
  coverImage?: string;
  location: string;
  rating: number;
  reviewCount: number;
  specialty: string;
  tourCompleteCount?: number;
  averageResponseTime?: string;
  description: string;
  price: string;
  isSuperhost: boolean;
  languages: string[];
  experience?: string;
  certifications?: {
    id?: string;
    title: string;
    description: string;
    isVerified: boolean;
    icon?: string;
  }[];
  bio?: string;
  expertise?: string[];
  travelStyle?: string[];
  travelStories?: {
    id: string;
    title: string;
    description: string;
    image: string;
    date?: string;
    location?: string;
  }[];
  curatedTours?: string[];
  upcomingTours?: string[];
  countrySpecializations?: {
    icon: string;
    name: string;
    level: string;
    yearCount: number;
  }[];
  tours?: Array<{
    id: string;
    title: string;
    duration?: string;
    price?: string;
    description?: string;
  }>;
  reviews?: Array<{ id: string; rating: number; comment: string; author?: string; date?: string; }>;
  availability?: Record<string, { available: boolean; start: string; end: string }>;
  createdAt: string;
  updatedAt: string;
}

interface TourLeaderDetailAdminProps {
  tourLeader: TourLeader;
}

export default function TourLeaderDetailAdmin({ tourLeader }: TourLeaderDetailAdminProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<'form' | 'json'>('form');
  const [isSaving, setIsSaving] = useState(false);
  const [jsonError, setJsonError] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<TourLeader | null>(null);
  
  // Form data state
  const [formData, setFormData] = useState({
    name: tourLeader.name,
    image: tourLeader.image,
    coverImage: tourLeader.coverImage || '',
    location: tourLeader.location,
    specialty: tourLeader.specialty,
    description: tourLeader.description,
    price: tourLeader.price,
    isSuperhost: tourLeader.isSuperhost,
    languages: tourLeader.languages?.join(', ') || '',
    experience: tourLeader.experience || '',
    certifications: JSON.stringify(tourLeader.certifications || []),
    bio: tourLeader.bio || '',
    expertise: tourLeader.expertise?.join(', ') || '',
    travelStyle: tourLeader.travelStyle?.join(', ') || '',
    travelStories: JSON.stringify(tourLeader.travelStories || []),
    curatedTours: tourLeader.curatedTours?.join(', ') || '',
    upcomingTours: tourLeader.upcomingTours?.join(', ') || '',
    countrySpecializations: JSON.stringify(tourLeader.countrySpecializations || []),
    tourCompleteCount: tourLeader.tourCompleteCount || 0,
    averageResponseTime: tourLeader.averageResponseTime || '',
    rating: tourLeader.rating,
  });
  
  // JSON data state
  const [jsonData, setJsonData] = useState<string>('');
  
  // Convert form data to JSON format
  const formDataToJson = () => {
    let travelStories;
    try {
      travelStories = formData.travelStories ? JSON.parse(formData.travelStories) : undefined;
    } catch {
      travelStories = undefined;
    }
    
    let certifications;
    try {
      certifications = formData.certifications ? JSON.parse(formData.certifications) : undefined;
    } catch {
      certifications = undefined;
    }
    
    let countrySpecializations;
    try {
      countrySpecializations = formData.countrySpecializations ? JSON.parse(formData.countrySpecializations) : undefined;
    } catch {
      countrySpecializations = undefined;
    }
    
    return {
      name: formData.name,
      image: formData.image,
      coverImage: formData.coverImage || undefined,
      location: formData.location,
      specialty: formData.specialty,
      description: formData.description,
      price: formData.price,
      isSuperhost: formData.isSuperhost,
      languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang),
      experience: formData.experience || undefined,
      certifications: certifications,
      bio: formData.bio || undefined,
      expertise: formData.expertise ? formData.expertise.split(',').map(exp => exp.trim()).filter(exp => exp) : undefined,
      travelStyle: formData.travelStyle ? formData.travelStyle.split(',').map(style => style.trim()).filter(style => style) : undefined,
      travelStories: travelStories,
      curatedTours: formData.curatedTours ? formData.curatedTours.split(',').map(id => id.trim()).filter(id => id) : undefined,
      upcomingTours: formData.upcomingTours ? formData.upcomingTours.split(',').map(id => id.trim()).filter(id => id) : undefined,
      countrySpecializations: countrySpecializations,
      tourCompleteCount: formData.tourCompleteCount,
      averageResponseTime: formData.averageResponseTime || undefined,
      rating: formData.rating,
      reviewCount: tourLeader.reviewCount || 0,
    };
  };
  
  // Initialize JSON data when switching to JSON mode
  const initializeJsonData = () => {
    const jsonObj = formDataToJson();
    setJsonData(JSON.stringify(jsonObj, null, 2));
  };
  
  // Validate JSON
  const validateJson = (jsonString: string): { valid: boolean; data?: TourLeader; error?: string } => {
    try {
      const data = JSON.parse(jsonString);
      
      // Validate required fields
      if (!data.name || typeof data.name !== 'string') {
        return { valid: false, error: 'Name is required and must be a string' };
      }
      if (!data.image || typeof data.image !== 'string') {
        return { valid: false, error: 'Image is required and must be a string' };
      }
      if (!data.location || typeof data.location !== 'string') {
        return { valid: false, error: 'Location is required and must be a string' };
      }
      if (!data.specialty || typeof data.specialty !== 'string') {
        return { valid: false, error: 'Specialty is required and must be a string' };
      }
      if (!data.price || typeof data.price !== 'string') {
        return { valid: false, error: 'Price is required and must be a string' };
      }
      
      // Validate arrays
      if (data.languages && !Array.isArray(data.languages)) {
        return { valid: false, error: 'Languages must be an array' };
      }
      if (data.certifications && !Array.isArray(data.certifications)) {
        return { valid: false, error: 'Certifications must be an array' };
      }
      // Validate certifications structure
      if (data.certifications) {
        for (let i = 0; i < data.certifications.length; i++) {
          const cert = data.certifications[i];
          if (!cert.title || !cert.description) {
            return { valid: false, error: `Certification at index ${i} must have title and description` };
          }
          if (cert.isVerified !== undefined && typeof cert.isVerified !== 'boolean') {
            return { valid: false, error: `Certification at index ${i} isVerified must be a boolean` };
          }
        }
      }
      if (data.expertise && !Array.isArray(data.expertise)) {
        return { valid: false, error: 'Expertise must be an array' };
      }
      if (data.travelStyle && !Array.isArray(data.travelStyle)) {
        return { valid: false, error: 'Travel Style must be an array' };
      }
      if (data.travelStories && !Array.isArray(data.travelStories)) {
        return { valid: false, error: 'Travel Stories must be an array' };
      }
      // Validate travel stories structure
      if (data.travelStories) {
        for (let i = 0; i < data.travelStories.length; i++) {
          const story = data.travelStories[i];
          if (!story.title || !story.description || !story.image) {
            return { valid: false, error: `Travel story at index ${i} must have title, description, and image` };
          }
        }
      }
      if (data.curatedTours && !Array.isArray(data.curatedTours)) {
        return { valid: false, error: 'Curated Tours must be an array of tour IDs' };
      }
      if (data.upcomingTours && !Array.isArray(data.upcomingTours)) {
        return { valid: false, error: 'Upcoming Tours must be an array of tour IDs' };
      }
      if (data.countrySpecializations && !Array.isArray(data.countrySpecializations)) {
        return { valid: false, error: 'Country Specializations must be an array' };
      }
      // Validate country specializations structure
      if (data.countrySpecializations) {
        for (let i = 0; i < data.countrySpecializations.length; i++) {
          const country = data.countrySpecializations[i];
          if (!country.name || !country.level || typeof country.yearCount !== 'number') {
            return { valid: false, error: `Country specialization at index ${i} must have name, level, and yearCount (number)` };
          }
        }
      }
      
      // Validate boolean
      if (data.isSuperhost !== undefined && typeof data.isSuperhost !== 'boolean') {
        return { valid: false, error: 'isSuperhost must be a boolean' };
      }
      
      // Validate number
      if (data.rating !== undefined && (typeof data.rating !== 'number' || data.rating < 0 || data.rating > 5)) {
        return { valid: false, error: 'Rating must be a number between 0 and 5' };
      }
      
      return { valid: true, data };
    } catch {
      return { valid: false, error: 'Invalid JSON format' };
    }
  };
  
  const handleSave = async () => {
    setIsSaving(true);
    setJsonError('');
    
    try {
      let tourLeaderData;
      
      if (editMode === 'json') {
        const validation = validateJson(jsonData);
        if (!validation.valid) {
          setJsonError(validation.error || 'Invalid JSON');
          setIsSaving(false);
          return;
        }
        tourLeaderData = validation.data;
      } else {
        tourLeaderData = formDataToJson();
      }
      
      const response = await fetch(`/api/admin/tour-leaders/${tourLeader.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourLeaderData),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update tour leader');
      }
      
      router.refresh();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating tour leader:', error);
      alert('Failed to update tour leader. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };
  
  const handleCancel = () => {
    setFormData({
      name: tourLeader.name,
      image: tourLeader.image,
      coverImage: tourLeader.coverImage || '',
      location: tourLeader.location,
      specialty: tourLeader.specialty,
      description: tourLeader.description,
      price: tourLeader.price,
      isSuperhost: tourLeader.isSuperhost,
      languages: tourLeader.languages?.join(', ') || '',
      experience: tourLeader.experience || '',
      certifications: JSON.stringify(tourLeader.certifications || []),
      bio: tourLeader.bio || '',
      expertise: tourLeader.expertise?.join(', ') || '',
      travelStyle: tourLeader.travelStyle?.join(', ') || '',
      travelStories: JSON.stringify(tourLeader.travelStories || []),
      curatedTours: tourLeader.curatedTours?.join(', ') || '',
      upcomingTours: tourLeader.upcomingTours?.join(', ') || '',
      countrySpecializations: JSON.stringify(tourLeader.countrySpecializations || []),
      tourCompleteCount: tourLeader.tourCompleteCount || 0,
      averageResponseTime: tourLeader.averageResponseTime || '',
      rating: tourLeader.rating,
    });
    setIsEditing(false);
    setEditMode('form');
    setJsonError('');
  };
  
  const handleInputChange = (field: string, value: string | number | boolean | string[] | Record<string, unknown>) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const handleEditModeChange = (mode: 'form' | 'json') => {
    if (mode === 'json') {
      initializeJsonData();
    }
    setEditMode(mode);
    setJsonError('');
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this tour leader?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tour-leaders/${tourLeader.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/tour-leaders');
      }
    } catch (error) {
      console.error('Error deleting tour leader:', error);
      alert('Failed to delete tour leader. Please try again.');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/tour-leaders')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon size={20} />
              </button>
              <div>
                <div className="flex items-center">
                  <h1 className="text-3xl font-bold text-gray-900">{tourLeader.name}</h1>
                </div>
                <p className="mt-1 text-lg text-gray-600">{tourLeader.specialty}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {!isEditing ? (
                <>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <EditIcon size={16} className="mr-2" />
                    Edit
                  </button>
                  <button
                    onClick={handleDelete}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
                  >
                    <TrashIcon size={16} className="mr-2" />
                    Delete
                  </button>
                </>
              ) : (
                <>
                  <div className="flex items-center space-x-2 mr-4">
                    <button
                      onClick={() => handleEditModeChange('form')}
                      className={`px-3 py-1 rounded ${editMode === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      <FileTextIcon className="w-4 h-4 inline mr-1" />
                      Form
                    </button>
                    <button
                      onClick={() => handleEditModeChange('json')}
                      className={`px-3 py-1 rounded ${editMode === 'json' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                    >
                      <CodeIcon className="w-4 h-4 inline mr-1" />
                      JSON
                    </button>
                  </div>
                  <button
                    onClick={handleCancel}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                  >
                    <XIcon className="w-4 h-4 mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <LoaderIcon className="w-4 h-4 mr-2 animate-spin" />
                    ) : (
                      <SaveIcon className="w-4 h-4 mr-2" />
                    )}
                    {isSaving ? 'Saving...' : 'Save Changes'}
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* JSON Edit Mode */}
        {isEditing && editMode === 'json' ? (
          <div className="px-6 py-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - JSON Editor (2/3 width) */}
              <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center">
                  <CodeIcon className="w-5 h-5 mr-2" />
                  Edit Tour Leader JSON
                </h2>
                {jsonError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{jsonError}</p>
                  </div>
                )}
                <textarea
                  value={jsonData}
                  onChange={(e) => setJsonData(e.target.value)}
                  className="w-full h-[calc(100vh-350px)] min-h-[450px] px-3 py-2 border border-gray-300 rounded-md font-mono text-sm resize-none"
                  placeholder="Enter tour leader data in JSON format"
                />
                <button
                  type="button"
                  onClick={() => {
                    const validation = validateJson(jsonData);
                    if (validation.valid) {
                      setPreviewData(validation.data ?? null);
                      setShowPreview(true);
                      setJsonError('');
                    } else {
                      setJsonError(validation.error || 'Invalid JSON');
                    }
                  }}
                  className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <EyeIcon className="w-4 h-4 mr-2" />
                  Preview Tour Leader
                </button>
              </div>
              
              {/* Right Column - JSON Structure Example (1/3 width) */}
              <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">JSON Structure Example</h3>
                <div className="bg-gray-50 rounded-md p-4 h-[calc(100vh-300px)] min-h-[500px] overflow-auto">
                  <pre className="text-xs text-gray-600">
{`{
  "name": "John Smith",
  "image": "https://example.com/profile.jpg",
  "coverImage": "https://example.com/cover.jpg",
  "location": "Bali, Indonesia",
  "specialty": "Cultural & Adventure Tours",
  "description": "Brief description...",
  "price": "$150/person",
  "isSuperhost": true,
  "rating": 4.9,
  "reviewCount": 127,
  "tourCompleteCount": 156,
  "averageResponseTime": "2 hours",
  
  "languages": [
    "English",
    "Indonesian",
    "Japanese"
  ],
  
  "expertise": [
    "Cultural Tours",
    "Adventure Travel",
    "Photography Tours",
    "Food & Culinary"
  ],
  
  "travelStyle": [
    "Adventure",
    "Cultural",
    "Relaxation",
    "Luxury"
  ],
  
  "certifications": [
    {
      "id": "cert1",
      "title": "Certified Tour Guide",
      "description": "Licensed by Singapore Tourism Board with expertise in cultural and heritage tours",
      "isVerified": true,
      "icon": "award"
    },
    {
      "id": "cert2",
      "title": "First Aid Certified",
      "description": "Emergency response and medical assistance certification from Red Cross",
      "isVerified": true,
      "icon": "shield"
    },
    {
      "id": "cert3",
      "title": "Wildlife Conservation Expert",
      "description": "Specialized training in eco-tourism and wildlife preservation",
      "isVerified": false,
      "icon": "check"
    }
  ],
  
  "experience": "10+ years of experience...",
  
  "bio": "Detailed biography...",
  
  "countrySpecializations": [
    {
      "icon": "🇸🇬",
      "name": "Singapore",
      "level": "Expert",
      "yearCount": 8
    },
    {
      "icon": "🇲🇾",
      "name": "Malaysia",
      "level": "Advanced",
      "yearCount": 5
    },
    {
      "icon": "🇹🇭",
      "name": "Thailand",
      "level": "Intermediate",
      "yearCount": 3
    }
  ],
  
  "curatedTours": [
    "tour_id_1",
    "tour_id_2",
    "tour_id_3"
  ],
  
  "upcomingTours": [
    "tour_id_4",
    "tour_id_5"
  ],
  
  "travelStories": [
    {
      "id": "story1",
      "title": "Gardens by the Bay After Dark",
      "description": "Exploring the illuminated Supertree Grove and its magical light show...",
      "image": "https://example.com/story1.jpg",
      "date": "March 2024",
      "location": "Marina Bay, Singapore"
    },
    {
      "id": "story2",
      "title": "Hawker Heritage Trail",
      "description": "A culinary journey through Singapore's famous hawker centers and local delicacies...",
      "image": "https://example.com/story2.jpg",
      "date": "January 2024",
      "location": "Chinatown, Singapore"
    }
  ]
}

// Notes:
// - name, image, location, specialty, price are required
// - Arrays should contain at least one item
// - Image URL must be valid and accessible
// - Price should include currency and unit
// - Rating should be between 0 and 5
// - isSuperhost is boolean (true/false)`}
                  </pre>
                </div>
              </div>
            </div>
            
            {/* Preview Modal */}
            {showPreview && previewData && (
              <div className="fixed inset-0 z-50 overflow-y-auto">
                <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                  <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowPreview(false)}></div>
                  </div>
                  <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                    <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg font-medium text-gray-900">Tour Leader Preview</h3>
                        <button
                          onClick={() => setShowPreview(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <XIcon className="w-6 h-6" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Tour Leader Card Preview */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Card View</h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                              <div className="relative h-48">
                                <Image 
                                  src={previewData.image} 
                                  alt={previewData.name} 
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                              <div className="p-4">
                                <h3 className="font-bold text-gray-900 mb-1">{previewData.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{previewData.specialty}</p>
                                <div className="flex items-center mb-2">
                                  <StarIcon size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
                                  <span className="text-sm font-medium text-gray-900">{previewData.rating?.toFixed(1) || '5.0'}</span>
                                  <span className="text-xs text-gray-500 ml-1">({previewData.reviewCount || 0} reviews)</span>
                                </div>
                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                  {previewData.description || 'No description available'}
                                </p>
                                <div className="flex justify-between items-center mb-3">
                                  <div className="text-gray-900 font-bold">{previewData.price}</div>
                                  <div className="flex items-center text-xs text-gray-500">
                                    <MapPinIcon className="w-4 h-4 mr-1" />
                                    {previewData.location}
                                  </div>
                                </div>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                                  View Profile
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Tour Leader Details Preview */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Details</h4>
                          <div className="bg-gray-50 p-4 rounded-lg max-h-[500px] overflow-y-auto">
                            <div className="space-y-4">
                              <div>
                                <h5 className="text-xs font-semibold text-gray-600 uppercase mb-1">Languages</h5>
                                <div className="flex flex-wrap gap-2">
                                  {previewData.languages?.map((lang: string, index: number) => (
                                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                      {lang}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              {previewData.expertise && previewData.expertise.length > 0 && (
                                <div>
                                  <h5 className="text-xs font-semibold text-gray-600 uppercase mb-1">Expertise</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {previewData.expertise.map((exp: string, index: number) => (
                                      <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                        {exp}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {previewData.travelStyle && previewData.travelStyle.length > 0 && (
                                <div>
                                  <h5 className="text-xs font-semibold text-gray-600 uppercase mb-1">Travel Style</h5>
                                  <div className="flex flex-wrap gap-2">
                                    {previewData.travelStyle.map((style: string, index: number) => (
                                      <span key={index} className="px-2 py-1 bg-purple-100 text-purple-800 rounded-full text-xs">
                                        {style}
                                      </span>
                                    ))}
                                  </div>
                                </div>
                              )}
                              
                              {previewData.certifications && previewData.certifications.length > 0 && (
                                <div>
                                  <h5 className="text-xs font-semibold text-gray-600 uppercase mb-1">Certifications</h5>
                                  <ul className="space-y-1">
                                    {previewData.certifications.map((cert, index) => (
                                      <li key={index} className="flex items-start text-sm text-gray-700">
                                        <CheckIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                        {typeof cert === 'string' ? cert : cert.title}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              
                              {previewData.bio && (
                                <div>
                                  <h5 className="text-xs font-semibold text-gray-600 uppercase mb-1">Biography</h5>
                                  <p className="text-sm text-gray-700">{previewData.bio}</p>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                      <button
                        type="button"
                        onClick={() => setShowPreview(false)}
                        className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                      >
                        Close Preview
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        ) : (
        <div className="px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Profile Overview */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {/* Header with cover image or fallback gradient */}
              <div className="relative h-32">
                {tourLeader.coverImage ? (
                  <>
                    <Image
                      src={tourLeader.coverImage}
                      alt={`${tourLeader.name} cover`}
                      fill
                      className="object-cover"
                      unoptimized
                    />
                    <div 
                      className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-50 to-pink-100"
                      style={{ display: 'none' }}
                    >
                      <div className="absolute inset-0 bg-white bg-opacity-30"></div>
                    </div>
                  </>
                ) : (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-100 via-purple-50 to-pink-100">
                    <div className="absolute inset-0 bg-white bg-opacity-30"></div>
                  </div>
                )}
                <div className="absolute inset-0 bg-black bg-opacity-20"></div>
              </div>
              
              {/* Profile Image */}
              <div className="relative -mt-16 px-6">
                <div className="flex items-end">
                  <div className="relative">
                    <div className="w-24 h-24 bg-white rounded-full p-1 shadow-lg">
                      {isEditing && editMode === 'form' ? (
                        <div className="relative">
                          <div className="relative w-full h-full">
                            <Image
                              src={formData.image}
                              alt={formData.name}
                              fill
                              className="object-cover rounded-full"
                              unoptimized
                            />
                          </div>
                        </div>
                      ) : (
                        <div className="relative w-full h-full">
                          <Image
                            src={tourLeader.image}
                            alt={tourLeader.name}
                            fill
                            className="object-cover rounded-full"
                            unoptimized
                          />
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="ml-4 pb-2">
                    <h2 className="text-2xl font-bold text-gray-900">{tourLeader.name}</h2>
                    <p className="text-gray-600">{tourLeader.specialty}</p>
                  </div>
                </div>
              </div>
              
              {/* Edit Form for Image URLs */}
              {isEditing && editMode === 'form' && (
                <div className="px-6 py-4 border-b border-gray-200 space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Profile Image URL</label>
                    <input
                      type="url"
                      value={formData.image}
                      onChange={(e) => handleInputChange('image', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="https://example.com/profile.jpg"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
                    <input
                      type="url"
                      value={formData.coverImage}
                      onChange={(e) => handleInputChange('coverImage', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="https://example.com/cover.jpg"
                    />
                  </div>
                </div>
              )}
              <div className="px-6 py-6">
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 text-lg font-semibold">{tourLeader.rating.toFixed(1)}</span>
                    </div>
                    <p className="text-sm text-gray-500">{tourLeader.reviewCount} reviews</p>
                  </div>
                  {tourLeader.tourCompleteCount !== undefined && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <CheckIcon className="w-5 h-5 text-green-500" />
                        <span className="ml-1 text-lg font-semibold">{tourLeader.tourCompleteCount}</span>
                      </div>
                      <p className="text-sm text-gray-500">Tours completed</p>
                    </div>
                  )}
                  {tourLeader.averageResponseTime && (
                    <div className="text-center">
                      <div className="flex items-center justify-center mb-2">
                        <MessageSquareIcon className="w-5 h-5 text-purple-500" />
                        <span className="ml-1 text-lg font-semibold">{tourLeader.averageResponseTime}</span>
                      </div>
                      <p className="text-sm text-gray-500">Avg response</p>
                    </div>
                  )}
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <MapPinIcon className="w-5 h-5 text-red-500" />
                    </div>
                    <p className="text-sm text-gray-600">{tourLeader.location}</p>
                  </div>
                </div>

                {/* Description */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <UserIcon className="w-5 h-5 mr-2 text-gray-400" />
                    About
                  </h3>
                  {isEditing && editMode === 'form' ? (
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Brief description about the tour leader..."
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">{tourLeader.description}</p>
                  )}
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <MessageSquareIcon className="w-5 h-5 mr-2 text-gray-400" />
                    Biography
                  </h3>
                  {isEditing && editMode === 'form' ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Detailed biography of the tour leader..."
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">{tourLeader.bio || 'No biography available'}</p>
                  )}
                </div>

                {/* Experience */}
                {tourLeader.experience && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold mb-3 flex items-center">
                      <BriefcaseIcon className="w-5 h-5 mr-2 text-gray-400" />
                      Experience
                    </h3>
                    <p className="text-gray-600">{tourLeader.experience}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Expertise Areas */}
            {tourLeader.expertise && tourLeader.expertise.length > 0 && (
              <div className="bg-white shadow rounded-lg px-6 py-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <BriefcaseIcon className="w-5 h-5 mr-2 text-gray-400" />
                  Areas of Expertise
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tourLeader.expertise.map((area: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Travel Style */}
            <div className="bg-white shadow rounded-lg px-6 py-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <MapIcon className="w-5 h-5 mr-2 text-gray-400" />
                Travel Style
              </h3>
              {isEditing && editMode === 'form' ? (
                <div>
                  <input
                    type="text"
                    value={formData.travelStyle}
                    onChange={(e) => handleInputChange('travelStyle', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Adventure, Cultural, Relaxation, Luxury (comma-separated)"
                  />
                  <p className="text-sm text-gray-500 mt-1">Enter travel styles separated by commas</p>
                </div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tourLeader.travelStyle && tourLeader.travelStyle.length > 0 ? (
                    tourLeader.travelStyle.map((style: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-sm"
                      >
                        {style}
                      </span>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm">No travel styles specified</p>
                  )}
                </div>
              )}
            </div>

            {/* Languages */}
            <div className="bg-white shadow rounded-lg px-6 py-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <GlobeIcon className="w-5 h-5 mr-2 text-gray-400" />
                Languages
              </h3>
              <div className="flex flex-wrap gap-2">
                {tourLeader.languages?.map((language: string, index: number) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                  >
                    {language}
                  </span>
                ))}
              </div>
            </div>

            {/* Certifications */}
            {tourLeader.certifications && tourLeader.certifications.length > 0 && (
              <div className="bg-white shadow rounded-lg px-6 py-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <AwardIcon className="w-5 h-5 mr-2 text-gray-400" />
                  Certifications
                </h3>
                <div className="grid grid-cols-1 gap-4">
                  {tourLeader.certifications.map((cert, index) => (
                    <div 
                      key={cert.id || index} 
                      className={`border rounded-lg p-4 ${cert.isVerified ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-white'}`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-lg ${cert.isVerified ? 'bg-green-100' : 'bg-gray-100'}`}>
                            {cert.icon === 'award' && <AwardIcon className={`w-5 h-5 ${cert.isVerified ? 'text-green-600' : 'text-gray-600'}`} />}
                            {cert.icon === 'shield' && <ShieldCheckIcon className={`w-5 h-5 ${cert.isVerified ? 'text-green-600' : 'text-gray-600'}`} />}
                            {cert.icon === 'check' && <CheckIcon className={`w-5 h-5 ${cert.isVerified ? 'text-green-600' : 'text-gray-600'}`} />}
                            {!cert.icon && <AwardIcon className={`w-5 h-5 ${cert.isVerified ? 'text-green-600' : 'text-gray-600'}`} />}
                          </div>
                          <div className="flex-1">
                            <h4 className="font-semibold text-gray-900">{cert.title}</h4>
                            <p className="text-sm text-gray-600 mt-1">{cert.description}</p>
                          </div>
                        </div>
                        {cert.isVerified && (
                          <div className="flex items-center bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-medium">
                            <CheckIcon className="w-3 h-3 mr-1" />
                            Verified
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Tours */}
            {tourLeader.tours && tourLeader.tours.length > 0 && (
              <div className="bg-white shadow rounded-lg px-6 py-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MapIcon className="w-5 h-5 mr-2 text-gray-400" />
                  Tours Offered ({tourLeader.tours.length})
                </h3>
                <div className="space-y-4">
                  {tourLeader.tours?.slice(0, 3).map((tour, index: number) => (
                    <div key={index} className="border-l-4 border-blue-500 pl-4">
                      <h4 className="font-medium text-gray-900">{tour.title}</h4>
                      <p className="text-sm text-gray-600 mt-1">{tour.duration} • {tour.price}</p>
                      {tour.description && (
                        <p className="text-sm text-gray-500 mt-2">{tour.description}</p>
                      )}
                    </div>
                  ))}
                  {tourLeader.tours.length > 3 && (
                    <p className="text-sm text-gray-500">
                      +{tourLeader.tours.length - 3} more tours
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Curated Tours */}
            {tourLeader.curatedTours && tourLeader.curatedTours.length > 0 && (
              <div className="bg-white shadow rounded-lg px-6 py-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <StarIcon className="w-5 h-5 mr-2 text-gray-400" />
                  Curated Tours
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tourLeader.curatedTours.map((tourId: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-mono"
                    >
                      {tourId}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Country Specializations */}
            {tourLeader.countrySpecializations && tourLeader.countrySpecializations.length > 0 && (
              <div className="bg-white shadow rounded-lg px-6 py-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <GlobeIcon className="w-5 h-5 mr-2 text-gray-400" />
                  Country Specializations
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {tourLeader.countrySpecializations.map((country, index) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <span className="text-2xl">{country.icon}</span>
                        <div>
                          <h4 className="font-medium text-gray-900">{country.name}</h4>
                          <p className="text-sm text-gray-600">{country.level}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-semibold text-blue-600">{country.yearCount}</span>
                        <p className="text-xs text-gray-500">years</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Upcoming Tours */}
            {tourLeader.upcomingTours && tourLeader.upcomingTours.length > 0 && (
              <div className="bg-white shadow rounded-lg px-6 py-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
                  Upcoming Tours
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tourLeader.upcomingTours.map((tourId: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-mono"
                    >
                      {tourId}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Travel Stories */}
            {tourLeader.travelStories && tourLeader.travelStories.length > 0 && (
              <div className="bg-white shadow rounded-lg px-6 py-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <FileTextIcon className="w-5 h-5 mr-2 text-gray-400" />
                  Travel Stories ({tourLeader.travelStories.length})
                </h3>
                <div className="grid grid-cols-1 gap-6">
                  {tourLeader.travelStories.slice(0, 3).map((story, index) => (
                    <div key={story.id || index} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                      <div className="relative h-48">
                        <Image
                          src={story.image}
                          alt={story.title}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                        {story.location && (
                          <div className="absolute bottom-2 left-2 bg-black bg-opacity-60 text-white px-2 py-1 rounded text-xs flex items-center">
                            <MapPinIcon className="w-3 h-3 mr-1" />
                            {story.location}
                          </div>
                        )}
                      </div>
                      <div className="p-4">
                        <h4 className="font-semibold text-gray-900 mb-2">{story.title}</h4>
                        <p className="text-sm text-gray-600 line-clamp-3">{story.description}</p>
                        {story.date && (
                          <p className="text-xs text-gray-500 mt-3 flex items-center">
                            <CalendarIcon className="w-3 h-3 mr-1" />
                            {story.date}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                  {tourLeader.travelStories.length > 3 && (
                    <p className="text-sm text-gray-500 text-center">
                      +{tourLeader.travelStories.length - 3} more stories
                    </p>
                  )}
                </div>
              </div>
            )}

            {/* Recent Reviews */}
            {tourLeader.reviews && tourLeader.reviews.length > 0 && (
              <div className="bg-white shadow rounded-lg px-6 py-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <MessageSquareIcon className="w-5 h-5 mr-2 text-gray-400" />
                  Recent Reviews
                </h3>
                <div className="space-y-4">
                  {tourLeader.reviews?.slice(0, 3).map((review, index: number) => (
                    <div key={index} className="border-b border-gray-200 last:border-0 pb-4 last:pb-0">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-medium text-gray-900">{review.author || 'Anonymous'}</span>
                        <div className="flex items-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              className={`w-4 h-4 ${
                                i < review.rating
                                  ? 'text-yellow-400 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600">{review.comment}</p>
                      {review.date && <p className="text-xs text-gray-500 mt-2">{review.date}</p>}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Tour Leader ID Card */}
            <div className="bg-white shadow rounded-lg px-6 py-6">
              <h3 className="text-lg font-semibold mb-4">Tour Leader Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Tour Leader ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{tourLeader.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(tourLeader.createdAt).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(tourLeader.updatedAt).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>


            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg px-6 py-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/tour-leaders/${tourLeader.id}`)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  View Public Profile →
                </button>
              </div>
            </div>
          </div>
        </div>
        </div>
        )}
    </div>
  );
}