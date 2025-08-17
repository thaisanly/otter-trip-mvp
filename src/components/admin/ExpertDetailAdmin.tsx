'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  ArrowLeftIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  TrashIcon,
  MapPinIcon,
  StarIcon,
  DollarSignIcon,
  GlobeIcon,
  BriefcaseIcon,
  CalendarIcon,
  UserIcon,
  LoaderIcon,
  CodeIcon,
  FileTextIcon,
  EyeIcon,
  PlusIcon,
  MinusIcon,
  SearchIcon,
  ImageIcon,
  ExternalLinkIcon,
  Instagram as InstagramIcon,
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  Linkedin as LinkedinIcon,
  Youtube as YoutubeIcon,
} from 'lucide-react';

interface Video {
  id: string;
  title: string;
  url: string;
  thumbnail: string;
  viewCount: number;
}

interface Expert {
  id: string;
  name: string;
  title: string;
  image: string;
  banner?: string;
  location: string;
  rating: number;
  reviewCount: number;
  hourlyRate: string;
  languages: string[];
  expertise: string[];
  certifications?: string[];
  availability?: Record<string, { available: boolean; slots: string[] }>;
  bio?: string;
  experience?: string;
  featuredTours?: string[];
  socialMedia?: {
    instagram?: string;
    facebook?: string;
    twitter?: string;
    linkedin?: string;
    youtube?: string;
    website?: string;
  };
  latestVideos?: Video[];
  createdAt: string;
  updatedAt: string;
}

interface Tour {
  id: string;
  code: string;
  title: string;
  heroImage: string;
  duration: string;
  price: string;
  location: string;
  rating: number;
  reviewCount: number;
  categories: string[];
}

interface ExpertDetailAdminProps {
  expert: Expert;
}

const defaultAvailability = {
  sunday: { available: false, slots: [] },
  monday: { available: true, slots: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'] },
  tuesday: { available: true, slots: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'] },
  wednesday: { available: true, slots: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'] },
  thursday: { available: true, slots: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'] },
  friday: { available: true, slots: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'] },
  saturday: { available: false, slots: [] },
};

export default function ExpertDetailAdmin({ expert }: ExpertDetailAdminProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<'form' | 'json'>('form');
  const [isSaving, setIsSaving] = useState(false);
  const [jsonError, setJsonError] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<Expert | null>(null);
  const [jsonData, setJsonData] = useState<string>('');
  const [availableTours, setAvailableTours] = useState<Tour[]>([]);
  const [featuredToursDetails] = useState<Tour[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [isLoadingTours, setIsLoadingTours] = useState(false);
  const [showTourSelector, setShowTourSelector] = useState(false);
  
  const [formData, setFormData] = useState({
    name: expert.name,
    title: expert.title,
    image: expert.image,
    banner: expert.banner || '',
    location: expert.location,
    hourlyRate: expert.hourlyRate,
    languages: expert.languages?.join(', ') || '',
    expertise: expert.expertise?.join(', ') || '',
    bio: expert.bio || '',
    experience: expert.experience || '',
    rating: expert.rating,
    availability: expert.availability || defaultAvailability,
    featuredTours: expert.featuredTours || [],
    socialMedia: {
      instagram: expert.socialMedia?.instagram || '',
      facebook: expert.socialMedia?.facebook || '',
      twitter: expert.socialMedia?.twitter || '',
      linkedin: expert.socialMedia?.linkedin || '',
      youtube: expert.socialMedia?.youtube || '',
      website: expert.socialMedia?.website || '',
    },
    latestVideos: expert.latestVideos || [],
  });
  


  const loadAvailableTours = async (search?: string) => {
    setIsLoadingTours(true);
    try {
      const params = new URLSearchParams({
        compact: 'true',
        limit: '100'
      });
      if (search) params.set('search', search);
      
      const response = await fetch(`/api/admin/tours?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAvailableTours(data.tours || []);
      }
    } catch (error) {
      console.error('Error loading tours:', error);
    } finally {
      setIsLoadingTours(false);
    }
  };


  const handleAddFeaturedTour = (tour: Tour) => {
    if (!formData.featuredTours.includes(tour.id)) {
      const newFeaturedTours = [...formData.featuredTours, tour.id];
      setFormData(prev => ({ ...prev, featuredTours: newFeaturedTours }));
    }
  };

  const handleRemoveFeaturedTour = (tourId: string) => {
    const newFeaturedTours = formData.featuredTours.filter(id => id !== tourId);
    setFormData(prev => ({ ...prev, featuredTours: newFeaturedTours }));
  };

  const handleSearchTours = (search: string) => {
    setSearchTerm(search);
    loadAvailableTours(search);
  };
  
  // Convert form data to JSON format
  const formDataToJson = () => {
    const socialMediaData = Object.entries(formData.socialMedia)
      .filter(([, value]) => value?.trim())
      .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {});
    
    return {
      name: formData.name,
      title: formData.title,
      image: formData.image,
      banner: formData.banner || undefined,
      location: formData.location,
      hourlyRate: formData.hourlyRate,
      languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang),
      expertise: formData.expertise.split(',').map(exp => exp.trim()).filter(exp => exp),
      bio: formData.bio || undefined,
      experience: formData.experience || undefined,
      rating: formData.rating,
      reviewCount: expert.reviewCount || 0,
      availability: formData.availability,
      featuredTours: formData.featuredTours,
      socialMedia: Object.keys(socialMediaData).length > 0 ? socialMediaData : undefined,
      latestVideos: formData.latestVideos.length > 0 ? formData.latestVideos : undefined,
    };
  };
  
  // Initialize JSON data when switching to JSON mode
  const initializeJsonData = () => {
    const jsonObj = formDataToJson();
    setJsonData(JSON.stringify(jsonObj, null, 2));
  };
  
  // Validate JSON
  const validateJson = (jsonString: string): { valid: boolean; data?: Expert; error?: string } => {
    try {
      const data = JSON.parse(jsonString) as Expert;
      
      // Validate required fields
      if (!data.name || typeof data.name !== 'string') {
        return { valid: false, error: 'Name is required and must be a string' };
      }
      if (!data.title || typeof data.title !== 'string') {
        return { valid: false, error: 'Title is required and must be a string' };
      }
      if (!data.image || typeof data.image !== 'string') {
        return { valid: false, error: 'Image is required and must be a string' };
      }
      if (!data.location || typeof data.location !== 'string') {
        return { valid: false, error: 'Location is required and must be a string' };
      }
      if (!data.hourlyRate || typeof data.hourlyRate !== 'string') {
        return { valid: false, error: 'Hourly rate is required and must be a string' };
      }
      
      // Validate arrays
      if (!data.languages || !Array.isArray(data.languages) || data.languages.length === 0) {
        return { valid: false, error: 'Languages must be an array with at least one language' };
      }
      if (!data.expertise || !Array.isArray(data.expertise) || data.expertise.length === 0) {
        return { valid: false, error: 'Expertise must be an array with at least one area' };
      }
      
      // Validate number
      if (data.rating !== undefined && (typeof data.rating !== 'number' || data.rating < 0 || data.rating > 5)) {
        return { valid: false, error: 'Rating must be a number between 0 and 5' };
      }
      
      // Validate featured tours
      if (data.featuredTours && !Array.isArray(data.featuredTours)) {
        return { valid: false, error: 'Featured tours must be an array' };
      }
      
      return { valid: true, data };
    } catch {
      return { valid: false, error: 'Invalid JSON format' };
    }
  };
  
  const handleEditModeChange = (mode: 'form' | 'json') => {
    if (mode === 'json') {
      initializeJsonData();
    }
    setEditMode(mode);
    setJsonError('');
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this expert?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/experts/${expert.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/experts');
      }
    } catch (error) {
      console.error('Error deleting expert:', error);
      alert('Failed to delete expert. Please try again.');
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setJsonError('');

    try {
      let expertData;
      
      if (editMode === 'json') {
        const validation = validateJson(jsonData);
        if (!validation.valid) {
          setJsonError(validation.error || 'Invalid JSON');
          setIsSaving(false);
          return;
        }
        expertData = validation.data;
      } else {
        expertData = formDataToJson();
      }

      const response = await fetch(`/api/admin/experts/${expert.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expertData),
      });

      if (!response.ok) {
        throw new Error('Failed to update expert');
      }

      router.refresh();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating expert:', error);
      alert('Failed to update expert. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: expert.name,
      title: expert.title,
      image: expert.image,
      banner: expert.banner || '',
      location: expert.location,
      hourlyRate: expert.hourlyRate,
      languages: expert.languages?.join(', ') || '',
      expertise: expert.expertise?.join(', ') || '',
      bio: expert.bio || '',
      experience: expert.experience || '',
      rating: expert.rating,
      availability: expert.availability || defaultAvailability,
      featuredTours: expert.featuredTours || [],
      socialMedia: {
        instagram: expert.socialMedia?.instagram || '',
        facebook: expert.socialMedia?.facebook || '',
        twitter: expert.socialMedia?.twitter || '',
        linkedin: expert.socialMedia?.linkedin || '',
        youtube: expert.socialMedia?.youtube || '',
        website: expert.socialMedia?.website || '',
      },
      latestVideos: expert.latestVideos || [],
    });
    setIsEditing(false);
    setEditMode('form');
    setJsonError('');
  };

  const handleInputChange = (field: string, value: string | number | string[] | Video[]) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSocialMediaChange = (platform: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      socialMedia: {
        ...prev.socialMedia,
        [platform]: value,
      },
    }));
  };

  // Video management functions
  const addVideo = () => {
    const newVideo: Video = {
      id: `video-${Date.now()}`,
      title: '',
      url: '',
      thumbnail: '',
      viewCount: 0,
    };
    setFormData(prev => ({
      ...prev,
      latestVideos: [...prev.latestVideos, newVideo]
    }));
  };

  const removeVideo = (index: number) => {
    setFormData(prev => ({
      ...prev,
      latestVideos: prev.latestVideos.filter((_, i) => i !== index)
    }));
  };

  const updateVideo = (index: number, field: keyof Video, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      latestVideos: prev.latestVideos.map((video, i) => 
        i === index ? { ...video, [field]: value } : video
      )
    }));
  };

  const moveVideo = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.latestVideos.length) return;

    const updatedVideos = [...formData.latestVideos];
    [updatedVideos[index], updatedVideos[newIndex]] = [updatedVideos[newIndex], updatedVideos[index]];
    
    setFormData(prev => ({
      ...prev,
      latestVideos: updatedVideos
    }));
  };

  const handleAvailabilityChange = (day: string, field: string, value: string | boolean | string[]) => {
    if (field === 'slots') {
      // Handle slots array directly
      setFormData(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          [day]: {
            ...prev.availability[day as keyof typeof prev.availability],
            slots: value as string[],
          },
        },
      }));
    } else if (field === 'available') {
      // When toggling availability, reset slots if disabling
      setFormData(prev => ({
        ...prev,
        availability: {
          ...prev.availability,
          [day]: {
            ...prev.availability[day as keyof typeof prev.availability],
            available: value as boolean,
            slots: value ? prev.availability[day as keyof typeof prev.availability].slots : [],
          },
        },
      }));
    } else if (field === 'startTime' || field === 'endTime') {
      // Generate slots based on start and end time
      setFormData(prev => {
        const currentDay = prev.availability[day as keyof typeof prev.availability];
        const startTime = field === 'startTime' ? value as string : currentDay.slots[0] || '09:00';
        const endTime = field === 'endTime' ? value as string : (() => {
          if (currentDay.slots.length > 0) {
            const lastSlot = currentDay.slots[currentDay.slots.length - 1];
            const hour = parseInt(lastSlot.split(':')[0]) + 1;
            return `${hour.toString().padStart(2, '0')}:00`;
          }
          return '17:00';
        })();
        
        // Generate hourly slots between start and end time
        const slots: string[] = [];
        const startHour = parseInt(startTime.split(':')[0]);
        const endHour = parseInt(endTime.split(':')[0]);
        
        for (let hour = startHour; hour < endHour; hour++) {
          slots.push(`${hour.toString().padStart(2, '0')}:00`);
        }
        
        return {
          ...prev,
          availability: {
            ...prev.availability,
            [day]: {
              ...prev.availability[day as keyof typeof prev.availability],
              slots,
            },
          },
        };
      });
    }
  };

  const weekDays = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={() => router.push('/admin/experts')}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {isEditing && editMode === 'form' ? (
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="text-3xl font-bold border-b-2 border-gray-300 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    expert.name
                  )}
                </h1>
                <p className="mt-1 text-lg text-gray-600">
                  {isEditing && editMode === 'form' ? (
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="text-lg border-b border-gray-300 focus:border-blue-500 outline-none"
                    />
                  ) : (
                    expert.title
                  )}
                </p>
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
                  {/* Edit Mode Toggle */}
                  <div className="flex items-center space-x-2">
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
                    className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
                  >
                    <XIcon size={16} className="mr-2" />
                    Cancel
                  </button>
                  <button
                    onClick={handleSave}
                    disabled={isSaving}
                    className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 disabled:opacity-50"
                  >
                    {isSaving ? (
                      <LoaderIcon size={16} className="mr-2 animate-spin" />
                    ) : (
                      <SaveIcon size={16} className="mr-2" />
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
                  Edit Expert JSON
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
                  placeholder="Enter expert data in JSON format"
                />
                <button
                  type="button"
                  onClick={() => {
                    const validation = validateJson(jsonData);
                    if (validation.valid && validation.data) {
                      setPreviewData(validation.data);
                      setShowPreview(true);
                      setJsonError('');
                    } else {
                      setJsonError(validation.error || 'Invalid JSON');
                    }
                  }}
                  className="mt-4 w-full flex items-center justify-center px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                >
                  <EyeIcon className="w-4 h-4 mr-2" />
                  Preview Expert
                </button>
              </div>
              
              {/* Right Column - JSON Structure Example (1/3 width) */}
              <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">JSON Structure Example</h3>
                <div className="bg-gray-50 rounded-md p-4 h-[calc(100vh-300px)] min-h-[500px] overflow-auto">
                  <pre className="text-xs text-gray-600">
{`{
  "name": "Dr. Sarah Johnson",
  "title": "Travel & Cultural Expert",
  "image": "https://example.com/profile.jpg",
  "banner": "https://example.com/cover.jpg",
  "location": "Tokyo, Japan",
  "hourlyRate": "$150/hour",
  "rating": 4.9,
  "reviewCount": 89,
  
  "languages": [
    "English",
    "Japanese",
    "Mandarin"
  ],
  
  "expertise": [
    "Cultural Immersion",
    "Business Travel",
    "Food Tourism",
    "Historical Tours"
  ],
  
  "bio": "Passionate travel expert with 15+ years...",
  
  "experience": "Over 15 years in travel industry...",
  
  "availability": {
    "sunday": { "available": false, "slots": [] },
    "monday": { "available": true, "slots": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"] },
    "tuesday": { "available": true, "slots": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"] },
    "wednesday": { "available": true, "slots": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"] },
    "thursday": { "available": true, "slots": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"] },
    "friday": { "available": true, "slots": ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"] },
    "saturday": { "available": false, "slots": [] }
  },
  
  "featuredTours": [
    "tour-id-1",
    "tour-id-2", 
    "tour-id-3"
  ],
  
  "socialMedia": {
    "instagram": "https://instagram.com/drjohnson",
    "facebook": "https://facebook.com/drjohnson",
    "twitter": "https://twitter.com/drjohnson",
    "linkedin": "https://linkedin.com/in/drjohnson",
    "youtube": "https://youtube.com/@drjohnson",
    "website": "https://drjohnson.com"
  },
  
  "latestVideos": [
    {
      "id": "video-001",
      "title": "Best Travel Tips for Europe",
      "url": "https://youtube.com/watch?v=abc123",
      "thumbnail": "https://img.youtube.com/vi/abc123/maxresdefault.jpg",
      "viewCount": 15000
    },
    {
      "id": "video-002", 
      "title": "Hidden Gems in Italy",
      "url": "https://youtube.com/watch?v=def456",
      "thumbnail": "https://img.youtube.com/vi/def456/maxresdefault.jpg",
      "viewCount": 8500
    }
  ]
}

// Notes:
// - name, title, image, location, hourlyRate are required
// - banner is optional for cover image
// - languages and expertise arrays must have at least one item
// - Rating should be between 0 and 5
// - Availability is optional but follows the structure above
// - featuredTours is optional array of tour IDs
// - socialMedia is optional object with platform URLs
// - latestVideos is optional array of video objects with id, title, url, thumbnail, viewCount`}
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
                        <h3 className="text-lg font-medium text-gray-900">Expert Preview</h3>
                        <button
                          onClick={() => setShowPreview(false)}
                          className="text-gray-400 hover:text-gray-500"
                        >
                          <XIcon className="w-6 h-6" />
                        </button>
                      </div>
                      
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Expert Card Preview */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Expert Card View</h4>
                          <div className="bg-gray-50 p-4 rounded-lg">
                            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                              <div className="relative h-48">
                                <Image 
                                  src={previewData.image || `https://via.placeholder.com/400x200/4B5563/FFFFFF?text=Invalid+Image`} 
                                  alt={previewData.name} 
                                  fill
                                  className="object-cover"
                                  unoptimized
                                />
                              </div>
                              <div className="p-4">
                                <h3 className="font-bold text-gray-900 mb-1">{previewData.name}</h3>
                                <p className="text-sm text-gray-600 mb-2">{previewData.title}</p>
                                <div className="flex items-center mb-2">
                                  <StarIcon size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
                                  <span className="text-sm font-medium text-gray-900">{previewData.rating?.toFixed(1) || '5.0'}</span>
                                  <span className="text-xs text-gray-500 ml-1">({previewData.reviewCount || 0} reviews)</span>
                                </div>
                                <div className="flex items-center mb-2 text-sm text-gray-600">
                                  <MapPinIcon className="w-4 h-4 mr-1" />
                                  {previewData.location}
                                </div>
                                <div className="flex flex-wrap gap-1 mb-3">
                                  {previewData.languages?.slice(0, 3).map((lang: string, index: number) => (
                                    <span key={index} className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                      {lang}
                                    </span>
                                  ))}
                                </div>
                                <div className="flex justify-between items-center mb-3">
                                  <div className="text-gray-900 font-bold">{previewData.hourlyRate}</div>
                                  <span className="text-xs text-gray-500">per consultation</span>
                                </div>
                                <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                                  Book Consultation
                                </button>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        {/* Expert Details Preview */}
                        <div>
                          <h4 className="text-sm font-medium text-gray-700 mb-3">Expert Details</h4>
                          <div className="bg-gray-50 p-4 rounded-lg max-h-[500px] overflow-y-auto">
                            <div className="space-y-4">
                              <div>
                                <h5 className="text-xs font-semibold text-gray-600 uppercase mb-1">Expertise Areas</h5>
                                <div className="flex flex-wrap gap-2">
                                  {previewData.expertise?.map((exp: string, index: number) => (
                                    <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                      {exp}
                                    </span>
                                  ))}
                                </div>
                              </div>
                              
                              
                              {previewData.availability && (
                                <div>
                                  <h5 className="text-xs font-semibold text-gray-600 uppercase mb-1">Availability</h5>
                                  <div className="grid grid-cols-2 gap-2 text-xs">
                                    {weekDays.slice(0, 5).map((day) => {
                                      const times = previewData.availability?.[day as keyof typeof previewData.availability];
                                      if (!times) return null;
                                      return (
                                        <div key={day} className="flex justify-between">
                                          <span className="capitalize">{day}:</span>
                                          <span className="text-gray-600">
                                            {times.available && times.slots && times.slots.length > 0 
                                              ? `${times.slots[0]}-${(() => {
                                                  const lastSlot = times.slots[times.slots.length - 1];
                                                  const hour = parseInt(lastSlot.split(':')[0]) + 1;
                                                  return `${hour.toString().padStart(2, '0')}:00`;
                                                })()}`
                                              : 'Unavailable'}
                                          </span>
                                        </div>
                                      );
                                    })}
                                  </div>
                                </div>
                              )}
                              
                              {previewData.bio && (
                                <div>
                                  <h5 className="text-xs font-semibold text-gray-600 uppercase mb-1">Biography</h5>
                                  <p className="text-sm text-gray-700 line-clamp-4">{previewData.bio}</p>
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

            {/* Expert Details with Cover Image */}
            <div className="bg-white shadow rounded-lg overflow-hidden">
              {/* Cover Image with Profile Overlay */}
              <div className="relative h-48">
                {isEditing && editMode === 'form' ? (
                  <div className="p-4 h-full">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL</label>
                    <input
                      type="url"
                      value={formData.banner}
                      onChange={(e) => handleInputChange('banner', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md mb-2"
                      placeholder="https://example.com/cover-image.jpg"
                    />
                    <div className="relative">
                      {formData.banner ? (
                        <div className="relative h-32 w-full">
                          <Image
                            src={formData.banner}
                            alt="Cover"
                            fill
                            className="object-cover rounded"
                            unoptimized
                          />
                        </div>
                      ) : (
                        <div className="w-full h-32 bg-gray-100 rounded flex items-center justify-center">
                          <div className="text-center text-gray-500">
                            <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                            <p className="text-sm">No cover image</p>
                          </div>
                        </div>
                      )}
                      {/* Profile Image Overlay in Edit Mode */}
                      <div className="absolute bottom-4 left-6 z-0">
                        <div className="relative w-32 h-32">
                          <Image
                            src={formData.image || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop`}
                            alt={formData.name}
                            fill
                            className="rounded-full border-4 border-white shadow-lg object-cover bg-white"
                            sizes="128px"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="relative">
                    {expert.banner ? (
                      <div className="relative h-48 w-full">
                        <Image
                          src={expert.banner}
                          alt="Cover"
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-full h-48 bg-gray-100 flex items-center justify-center">
                        <div className="text-center text-gray-500">
                          <ImageIcon className="w-12 h-12 mx-auto mb-2" />
                          <p>No cover image</p>
                        </div>
                      </div>
                    )}
                    {/* Profile Image Overlay */}
                    <div className="absolute bottom-4 left-6 z-0">
                      <div className="relative w-32 h-32">
                        <Image
                          src={expert.image || `https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=400&h=400&fit=crop`}
                          alt={expert.name}
                          fill
                          className="rounded-full border-4 border-white shadow-lg object-cover bg-white"
                          sizes="128px"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
              <div className="px-6 py-6">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <StarIcon className="w-5 h-5 text-yellow-400 fill-current" />
                      <span className="ml-1 text-lg font-semibold">
                        {isEditing && editMode === 'form' ? (
                          <input
                            type="number"
                            step="0.1"
                            min="0"
                            max="5"
                            value={formData.rating}
                            onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 0)}
                            className="w-16 text-center border-b border-gray-300"
                          />
                        ) : (
                          expert.rating.toFixed(1)
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{expert.reviewCount} reviews</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <DollarSignIcon className="w-5 h-5 text-green-500" />
                      <span className="ml-1 text-lg font-semibold">
                        {isEditing && editMode === 'form' ? (
                          <input
                            type="text"
                            value={formData.hourlyRate}
                            onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                            className="w-24 text-center border-b border-gray-300"
                            placeholder="$150/hour"
                          />
                        ) : (
                          expert.hourlyRate
                        )}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">Per hour</p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <MapPinIcon className="w-5 h-5 text-blue-500" />
                    </div>
                    <p className="text-sm text-gray-600">
                      {isEditing && editMode === 'form' ? (
                        <input
                          type="text"
                          value={formData.location}
                          onChange={(e) => handleInputChange('location', e.target.value)}
                          className="w-full text-center border-b border-gray-300 text-sm"
                          placeholder="Location"
                        />
                      ) : (
                        expert.location
                      )}
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="flex items-center justify-center mb-2">
                      <CalendarIcon className="w-5 h-5 text-purple-500" />
                    </div>
                    <p className="text-sm text-gray-600">
                      Joined {new Date(expert.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Bio */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <UserIcon className="w-5 h-5 mr-2 text-gray-400" />
                    Biography
                  </h3>
                  {isEditing && editMode === 'form' ? (
                    <textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange('bio', e.target.value)}
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Brief biography about the expert..."
                    />
                  ) : (
                    <p className="text-gray-600 leading-relaxed">{expert.bio || 'No biography available'}</p>
                  )}
                </div>

                {/* Experience */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-3 flex items-center">
                    <BriefcaseIcon className="w-5 h-5 mr-2 text-gray-400" />
                    Experience
                  </h3>
                  {isEditing && editMode === 'form' ? (
                    <textarea
                      value={formData.experience}
                      onChange={(e) => handleInputChange('experience', e.target.value)}
                      rows={3}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="Professional experience and background..."
                    />
                  ) : (
                    <p className="text-gray-600">{expert.experience || 'No experience information available'}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Expertise Areas */}
            <div className="bg-white shadow rounded-lg px-6 py-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <BriefcaseIcon className="w-5 h-5 mr-2 text-gray-400" />
                Areas of Expertise
              </h3>
              {isEditing && editMode === 'form' ? (
                <input
                  type="text"
                  value={formData.expertise}
                  onChange={(e) => handleInputChange('expertise', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="Adventure Travel, Cultural Tours, Food & Wine (comma separated)"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {expert.expertise?.map((area: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                    >
                      {area}
                    </span>
                  ))}
                </div>
              )}
            </div>

            {/* Languages */}
            <div className="bg-white shadow rounded-lg px-6 py-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <GlobeIcon className="w-5 h-5 mr-2 text-gray-400" />
                Languages
              </h3>
              {isEditing && editMode === 'form' ? (
                <input
                  type="text"
                  value={formData.languages}
                  onChange={(e) => handleInputChange('languages', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                  placeholder="English, Spanish, French (comma separated)"
                />
              ) : (
                <div className="flex flex-wrap gap-2">
                  {expert.languages?.map((language: string, index: number) => (
                    <span
                      key={index}
                      className="px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm"
                    >
                      {language}
                    </span>
                  ))}
                </div>
              )}
            </div>


            {/* Social Media Links */}
            <div className="bg-white shadow rounded-lg px-6 py-6">
              <h3 className="text-lg font-semibold mb-4 flex items-center">
                <GlobeIcon className="w-5 h-5 mr-2 text-gray-400" />
                Social Media Links
              </h3>
              {isEditing && editMode === 'form' ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <InstagramIcon className="w-4 h-4 mr-2 text-pink-500" />
                        Instagram
                      </label>
                      <input
                        type="url"
                        value={formData.socialMedia.instagram}
                        onChange={(e) => handleSocialMediaChange('instagram', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="https://instagram.com/username"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <FacebookIcon className="w-4 h-4 mr-2 text-blue-600" />
                        Facebook
                      </label>
                      <input
                        type="url"
                        value={formData.socialMedia.facebook}
                        onChange={(e) => handleSocialMediaChange('facebook', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="https://facebook.com/username"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <TwitterIcon className="w-4 h-4 mr-2 text-blue-400" />
                        Twitter
                      </label>
                      <input
                        type="url"
                        value={formData.socialMedia.twitter}
                        onChange={(e) => handleSocialMediaChange('twitter', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="https://twitter.com/username"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <LinkedinIcon className="w-4 h-4 mr-2 text-blue-700" />
                        LinkedIn
                      </label>
                      <input
                        type="url"
                        value={formData.socialMedia.linkedin}
                        onChange={(e) => handleSocialMediaChange('linkedin', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="https://linkedin.com/in/username"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <YoutubeIcon className="w-4 h-4 mr-2 text-red-600" />
                        YouTube
                      </label>
                      <input
                        type="url"
                        value={formData.socialMedia.youtube}
                        onChange={(e) => handleSocialMediaChange('youtube', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="https://youtube.com/@username"
                      />
                    </div>
                    <div>
                      <label className="flex items-center text-sm font-medium text-gray-700 mb-1">
                        <ExternalLinkIcon className="w-4 h-4 mr-2 text-gray-600" />
                        Website
                      </label>
                      <input
                        type="url"
                        value={formData.socialMedia.website}
                        onChange={(e) => handleSocialMediaChange('website', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  {expert.socialMedia && Object.entries(expert.socialMedia).filter(([, url]) => url).length > 0 ? (
                    <div className="flex flex-wrap gap-3">
                      {expert.socialMedia.instagram && (
                        <a
                          href={expert.socialMedia.instagram}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-2 bg-pink-50 text-pink-700 rounded-md hover:bg-pink-100 transition-colors"
                        >
                          <InstagramIcon className="w-4 h-4 mr-2" />
                          Instagram
                        </a>
                      )}
                      {expert.socialMedia.facebook && (
                        <a
                          href={expert.socialMedia.facebook}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-2 bg-blue-50 text-blue-700 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <FacebookIcon className="w-4 h-4 mr-2" />
                          Facebook
                        </a>
                      )}
                      {expert.socialMedia.twitter && (
                        <a
                          href={expert.socialMedia.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-2 bg-blue-50 text-blue-600 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <TwitterIcon className="w-4 h-4 mr-2" />
                          Twitter
                        </a>
                      )}
                      {expert.socialMedia.linkedin && (
                        <a
                          href={expert.socialMedia.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-2 bg-blue-50 text-blue-800 rounded-md hover:bg-blue-100 transition-colors"
                        >
                          <LinkedinIcon className="w-4 h-4 mr-2" />
                          LinkedIn
                        </a>
                      )}
                      {expert.socialMedia.youtube && (
                        <a
                          href={expert.socialMedia.youtube}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-2 bg-red-50 text-red-700 rounded-md hover:bg-red-100 transition-colors"
                        >
                          <YoutubeIcon className="w-4 h-4 mr-2" />
                          YouTube
                        </a>
                      )}
                      {expert.socialMedia.website && (
                        <a
                          href={expert.socialMedia.website}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center px-3 py-2 bg-gray-50 text-gray-700 rounded-md hover:bg-gray-100 transition-colors"
                        >
                          <ExternalLinkIcon className="w-4 h-4 mr-2" />
                          Website
                        </a>
                      )}
                    </div>
                  ) : (
                    <p className="text-gray-500">No social media links available</p>
                  )}
                </div>
              )}
            </div>

            {/* Latest Videos */}
            <div className="bg-white shadow rounded-lg px-6 py-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <YoutubeIcon className="w-5 h-5 mr-2 text-gray-400" />
                  Latest Videos
                </h3>
                {isEditing && editMode === 'form' && (
                  <button
                    onClick={addVideo}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <PlusIcon className="w-4 h-4 mr-1" />
                    Add Video
                  </button>
                )}
              </div>

              {isEditing && editMode === 'form' ? (
                <div className="space-y-4">
                  {formData.latestVideos.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <YoutubeIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No videos added yet.</p>
                      <p className="text-sm">Click &quot;Add Video&quot; to start building your video collection.</p>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {formData.latestVideos.map((video, index) => (
                        <div key={video.id} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h4 className="text-md font-medium text-gray-900">Video {index + 1}</h4>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => moveVideo(index, 'up')}
                                disabled={index === 0}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Move up"
                                type="button"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => moveVideo(index, 'down')}
                                disabled={index === formData.latestVideos.length - 1}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Move down"
                                type="button"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => removeVideo(index)}
                                className="p-1 text-red-400 hover:text-red-600"
                                title="Remove video"
                                type="button"
                              >
                                <MinusIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Video ID *</label>
                              <input
                                type="text"
                                value={video.id}
                                onChange={(e) => updateVideo(index, 'id', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                placeholder="video-001"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                              <input
                                type="text"
                                value={video.title}
                                onChange={(e) => updateVideo(index, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                placeholder="Amazing Travel Guide"
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Video URL *</label>
                              <input
                                type="url"
                                value={video.url}
                                onChange={(e) => updateVideo(index, 'url', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                placeholder="https://youtube.com/watch?v=..."
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Thumbnail URL *</label>
                              <input
                                type="url"
                                value={video.thumbnail}
                                onChange={(e) => updateVideo(index, 'thumbnail', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                placeholder="https://img.youtube.com/vi/..."
                                required
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">View Count</label>
                              <input
                                type="number"
                                value={video.viewCount}
                                onChange={(e) => updateVideo(index, 'viewCount', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm"
                                placeholder="1000"
                                min="0"
                              />
                            </div>
                            <div className="flex items-end">
                              {video.thumbnail && (
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
                                  <div className="relative w-24 h-16">
                                    <Image
                                      src={video.thumbnail || `https://via.placeholder.com/120x90/CBD5E1/64748B?text=Video`}
                                      alt={video.title || 'Video thumbnail'}
                                      fill
                                      className="object-cover rounded border"
                                      unoptimized
                                    />
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {expert.latestVideos && expert.latestVideos.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {expert.latestVideos.map((video) => (
                        <div key={video.id} className="border border-gray-200 rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                          <div className="aspect-video relative">
                            <Image
                              src={video.thumbnail || `https://via.placeholder.com/300x169/CBD5E1/64748B?text=Video`}
                              alt={video.title}
                              fill
                              className="object-cover"
                              unoptimized
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                              <YoutubeIcon className="w-8 h-8 text-white opacity-0 hover:opacity-100 transition-opacity duration-200" />
                            </div>
                          </div>
                          <div className="p-3">
                            <h4 className="font-medium text-sm text-gray-900 mb-1 line-clamp-2">{video.title}</h4>
                            <div className="flex items-center justify-between text-xs text-gray-500">
                              <span>{video.viewCount.toLocaleString()} views</span>
                              <a
                                href={video.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center text-blue-600 hover:text-blue-800"
                              >
                                <ExternalLinkIcon className="w-3 h-3 mr-1" />
                                Watch
                              </a>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500">No videos available</p>
                  )}
                </div>
              )}
            </div>

            {/* Featured Tours */}
            <div className="bg-white shadow rounded-lg px-6 py-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold flex items-center">
                  <ImageIcon className="w-5 h-5 mr-2 text-gray-400" />
                  Featured Tours
                </h3>
                {isEditing && editMode === 'form' && (
                  <button
                    onClick={() => setShowTourSelector(!showTourSelector)}
                    className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                  >
                    <PlusIcon size={14} className="mr-1" />
                    Add Tour
                  </button>
                )}
              </div>

              {/* Featured Tours List */}
              {featuredToursDetails.length > 0 ? (
                <div className="space-y-3">
                  {featuredToursDetails.map((tour) => (
                    <div key={tour.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="relative w-12 h-12">
                          <Image
                            src={tour.heroImage || `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop`}
                            alt={tour.title}
                            fill
                            className="object-cover rounded"
                            unoptimized
                          />
                        </div>
                        <div>
                          <h4 className="font-medium text-gray-900">{tour.title}</h4>
                          <p className="text-sm text-gray-500">{tour.location} • {tour.duration} • {tour.price}</p>
                          <div className="flex items-center mt-1">
                            <StarIcon size={12} className="text-yellow-400 fill-current mr-1" />
                            <span className="text-xs text-gray-600">{tour.rating?.toFixed(1)} ({tour.reviewCount} reviews)</span>
                          </div>
                        </div>
                      </div>
                      {isEditing && editMode === 'form' && (
                        <button
                          onClick={() => handleRemoveFeaturedTour(tour.id)}
                          className="p-1 text-red-500 hover:text-red-700 hover:bg-red-50 rounded"
                        >
                          <MinusIcon size={16} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-gray-500 text-center py-6">
                  {isEditing && editMode === 'form' ? 'No featured tours selected' : 'No featured tours'}
                </p>
              )}

              {/* Tour Selector Modal */}
              {showTourSelector && isEditing && editMode === 'form' && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                  <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:p-0">
                    <div className="fixed inset-0 transition-opacity" aria-hidden="true">
                      <div className="absolute inset-0 bg-gray-500 opacity-75" onClick={() => setShowTourSelector(false)}></div>
                    </div>
                    <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                      <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-medium text-gray-900">Select Featured Tours</h3>
                          <button
                            onClick={() => setShowTourSelector(false)}
                            className="text-gray-400 hover:text-gray-500"
                          >
                            <XIcon className="w-6 h-6" />
                          </button>
                        </div>
                        
                        {/* Search Bar */}
                        <div className="mb-4">
                          <div className="relative">
                            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                            <input
                              type="text"
                              placeholder="Search tours by title, location, or code..."
                              value={searchTerm}
                              onChange={(e) => handleSearchTours(e.target.value)}
                              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>

                        {/* Tours List */}
                        <div className="max-h-96 overflow-y-auto">
                          {isLoadingTours ? (
                            <div className="flex items-center justify-center py-8">
                              <LoaderIcon className="w-6 h-6 animate-spin text-gray-400" />
                              <span className="ml-2 text-gray-500">Loading tours...</span>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              {availableTours
                                .filter(tour => !formData.featuredTours.includes(tour.id))
                                .map((tour) => (
                                <div
                                  key={tour.id}
                                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 cursor-pointer"
                                  onClick={() => handleAddFeaturedTour(tour)}
                                >
                                  <div className="flex items-center space-x-3">
                                    <div className="relative w-12 h-12">
                                      <Image
                                        src={tour.heroImage || `https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=200&h=200&fit=crop`}
                                        alt={tour.title}
                                        fill
                                        className="object-cover rounded"
                                        unoptimized
                                      />
                                    </div>
                                    <div>
                                      <h4 className="font-medium text-gray-900">{tour.title}</h4>
                                      <p className="text-sm text-gray-500">{tour.location} • {tour.duration} • {tour.price}</p>
                                      <div className="flex items-center mt-1">
                                        <StarIcon size={12} className="text-yellow-400 fill-current mr-1" />
                                        <span className="text-xs text-gray-600">{tour.rating?.toFixed(1)} ({tour.reviewCount} reviews)</span>
                                        <span className="mx-2 text-gray-300">•</span>
                                        <span className="text-xs text-gray-500">Code: {tour.code}</span>
                                      </div>
                                    </div>
                                  </div>
                                  <PlusIcon className="w-5 h-5 text-gray-400" />
                                </div>
                              ))}
                              {availableTours.filter(tour => !formData.featuredTours.includes(tour.id)).length === 0 && (
                                <p className="text-center text-gray-500 py-8">
                                  {searchTerm ? 'No tours found matching your search' : 'All available tours are already featured'}
                                </p>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                        <button
                          type="button"
                          onClick={() => setShowTourSelector(false)}
                          className="w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                        >
                          Close
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Expert ID Card */}
            <div className="bg-white shadow rounded-lg px-6 py-6">
              <h3 className="text-lg font-semibold mb-4">Expert Information</h3>
              <dl className="space-y-3">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Expert ID</dt>
                  <dd className="mt-1 text-sm text-gray-900 font-mono">{expert.id}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Created</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(expert.createdAt).toLocaleString()}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Last Updated</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {new Date(expert.updatedAt).toLocaleString()}
                  </dd>
                </div>
              </dl>
            </div>

            {/* Availability */}
            {isEditing && editMode === 'form' && (
              <div className="bg-white shadow rounded-lg px-6 py-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
                  Availability Schedule
                </h3>
                <div className="space-y-3">
                  {weekDays.map((day) => (
                    <div key={day} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={formData.availability[day as keyof typeof formData.availability].available}
                        onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                        className="mr-2"
                      />
                      <span className="text-sm font-medium text-gray-700 capitalize w-20">{day}</span>
                      <input
                        type="time"
                        value={(() => {
                          const slots = formData.availability[day as keyof typeof formData.availability].slots;
                          return slots && slots.length > 0 ? slots[0] : '09:00';
                        })()}
                        onChange={(e) => handleAvailabilityChange(day, 'startTime', e.target.value)}
                        disabled={!formData.availability[day as keyof typeof formData.availability].available}
                        className="px-2 py-1 border border-gray-300 rounded text-xs disabled:bg-gray-100"
                      />
                      <span className="text-gray-500 text-xs">to</span>
                      <input
                        type="time"
                        value={(() => {
                          const slots = formData.availability[day as keyof typeof formData.availability].slots;
                          if (slots && slots.length > 0) {
                            const lastSlot = slots[slots.length - 1];
                            const hour = parseInt(lastSlot.split(':')[0]) + 1;
                            return `${hour.toString().padStart(2, '0')}:00`;
                          }
                          return '17:00';
                        })()}
                        onChange={(e) => handleAvailabilityChange(day, 'endTime', e.target.value)}
                        disabled={!formData.availability[day as keyof typeof formData.availability].available}
                        className="px-2 py-1 border border-gray-300 rounded text-xs disabled:bg-gray-100"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {(!isEditing || editMode === 'json') && expert.availability && (
              <div className="bg-white shadow rounded-lg px-6 py-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center">
                  <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
                  Availability Schedule
                </h3>
                <div className="space-y-3">
                  {weekDays.map((day) => {
                    const times = expert.availability?.[day as keyof typeof expert.availability];
                    if (!times) return null;
                    return (
                      <div key={day} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex items-center">
                          <div className={`w-3 h-3 rounded-full mr-3 ${
                            times.available ? 'bg-green-400' : 'bg-gray-300'
                          }`}></div>
                          <span className="font-medium text-gray-700 capitalize w-24">{day}</span>
                        </div>
                        <div className="flex items-center">
                          {times.available && times.slots && times.slots.length > 0 ? (
                          <div className="flex items-center">
                            <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded border">
                              {times.slots[0]}
                            </span>
                            <span className="mx-2 text-gray-400">—</span>
                            <span className="text-sm text-gray-600 bg-white px-2 py-1 rounded border">
                              {(() => {
                                const lastSlot = times.slots[times.slots.length - 1];
                                const hour = parseInt(lastSlot.split(':')[0]) + 1;
                                return `${hour.toString().padStart(2, '0')}:00`;
                              })()}
                            </span>
                            <span className="ml-3 text-xs text-gray-500">
                              ({times.slots.length} hours)
                            </span>
                          </div>
                        ) : (
                          <span className="text-sm text-gray-500 italic">Unavailable</span>
                        )}
                      </div>
                    </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <div className="flex items-center text-xs text-gray-500">
                    <div className="flex items-center mr-4">
                      <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                      Available
                    </div>
                    <div className="flex items-center">
                      <div className="w-2 h-2 bg-gray-300 rounded-full mr-2"></div>
                      Unavailable
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg px-6 py-6">
              <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => router.push(`/meet-experts/${expert.id}`)}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  View Public Profile →
                </button>
                <button
                  onClick={() => router.push('/admin/consultation-bookings')}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
                >
                  View Bookings →
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