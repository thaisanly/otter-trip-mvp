'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  SaveIcon,
  LoaderIcon,
  MapPinIcon,
  DollarSignIcon,
  ImageIcon,
  FileTextIcon,
  StarIcon,
  InfoIcon,
  GlobeIcon,
  BriefcaseIcon,
  AwardIcon,
  CalendarIcon,
  UserIcon,
  CodeIcon,
  EyeIcon,
} from 'lucide-react';

// Expert interface matching Prisma schema
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
  availability?: Record<string, { available: boolean; start: string; end: string }>;
  bio?: string;
  experience?: string;
  createdAt: string;
  updatedAt: string;
}

// Form data interface
interface ExpertFormData {
  name: string;
  title: string;
  image: string;
  banner: string;
  location: string;
  hourlyRate: string;
  languages: string;
  expertise: string;
  certifications: string;
  bio: string;
  experience: string;
  rating: number;
  availability: {
    monday: { available: boolean; start: string; end: string };
    tuesday: { available: boolean; start: string; end: string };
    wednesday: { available: boolean; start: string; end: string };
    thursday: { available: boolean; start: string; end: string };
    friday: { available: boolean; start: string; end: string };
    saturday: { available: boolean; start: string; end: string };
    sunday: { available: boolean; start: string; end: string };
  };
}

interface ExpertFormProps {
  mode: 'create' | 'edit';
  expert?: Expert;
}

const defaultAvailability = {
  monday: { available: true, start: '09:00', end: '17:00' },
  tuesday: { available: true, start: '09:00', end: '17:00' },
  wednesday: { available: true, start: '09:00', end: '17:00' },
  thursday: { available: true, start: '09:00', end: '17:00' },
  friday: { available: true, start: '09:00', end: '17:00' },
  saturday: { available: false, start: '09:00', end: '17:00' },
  sunday: { available: false, start: '09:00', end: '17:00' },
};

export default function ExpertForm({ mode, expert }: ExpertFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createMode, setCreateMode] = useState<'form' | 'json'>('form');
  const [jsonData, setJsonData] = useState<string>('');
  const [jsonError, setJsonError] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<Expert | null>(null);
  
  const [formData, setFormData] = useState<ExpertFormData>({
    name: '',
    title: '',
    image: '',
    banner: '',
    location: '',
    hourlyRate: '',
    languages: '',
    expertise: '',
    certifications: '',
    bio: '',
    experience: '',
    rating: 5.0,
    availability: defaultAvailability,
  });

  // Initialize form data for edit mode
  useEffect(() => {
    if (mode === 'edit' && expert) {
      setFormData({
        name: expert.name,
        title: expert.title,
        image: expert.image,
        banner: expert.banner || '',
        location: expert.location,
        hourlyRate: expert.hourlyRate,
        languages: expert.languages?.join(', ') || '',
        expertise: expert.expertise?.join(', ') || '',
        certifications: expert.certifications?.join(', ') || '',
        bio: expert.bio || '',
        experience: expert.experience || '',
        rating: expert.rating,
        availability: (expert.availability as typeof defaultAvailability) || defaultAvailability,
      });
    }
  }, [mode, expert]);

  // Initialize JSON data when switching to JSON mode
  const initializeJsonData = () => {
    const jsonObj = {
      name: formData.name,
      title: formData.title,
      image: formData.image,
      banner: formData.banner || undefined,
      location: formData.location,
      hourlyRate: formData.hourlyRate,
      languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang),
      expertise: formData.expertise.split(',').map(exp => exp.trim()).filter(exp => exp),
      certifications: formData.certifications ? 
        formData.certifications.split(',').map(cert => cert.trim()).filter(cert => cert) : [],
      bio: formData.bio || undefined,
      experience: formData.experience || undefined,
      rating: formData.rating,
      availability: formData.availability,
    };
    setJsonData(JSON.stringify(jsonObj, null, 2));
  };

  // Default JSON template for create mode
  const getDefaultJsonTemplate = () => {
    return JSON.stringify({
      name: "Jane Smith",
      title: "Senior Travel Consultant",
      image: "https://example.com/profile.jpg",
      banner: "https://example.com/banner.jpg",
      location: "Bali, Indonesia",
      hourlyRate: "$150/hour",
      rating: 5.0,
      languages: ["English", "Indonesian", "Spanish"],
      expertise: ["Adventure Travel", "Cultural Tours", "Eco-Tourism"],
      certifications: ["Certified Travel Professional", "IATA Certified"],
      bio: "Experienced travel consultant with 10+ years in the industry",
      experience: "10+ years of creating unforgettable travel experiences across Southeast Asia",
      featuredTours: ["tour-001", "tour-002"],
      socialMedia: {
        instagram: "https://instagram.com/janesmithtravel",
        facebook: "https://facebook.com/janesmithtravel",
        twitter: "https://twitter.com/janesmithtravel"
      },
      latestVideos: [
        {
          id: "video-1",
          title: "Bali Hidden Gems Tour",
          url: "https://youtube.com/watch?v=example1",
          thumbnail: "https://example.com/thumb1.jpg",
          viewCount: 15000
        },
        {
          id: "video-2",
          title: "Cultural Experiences in Indonesia",
          url: "https://youtube.com/watch?v=example2",
          thumbnail: "https://example.com/thumb2.jpg",
          viewCount: 8500
        }
      ],
      availability: {
        monday: { available: true, start: "09:00", end: "17:00" },
        tuesday: { available: true, start: "09:00", end: "17:00" },
        wednesday: { available: true, start: "09:00", end: "17:00" },
        thursday: { available: true, start: "09:00", end: "17:00" },
        friday: { available: true, start: "09:00", end: "17:00" },
        saturday: { available: false, start: "09:00", end: "17:00" },
        sunday: { available: false, start: "09:00", end: "17:00" }
      }
    }, null, 2);
  };

  // Validate JSON structure
  const validateJson = (jsonString: string): { valid: boolean; data?: Expert; error?: string } => {
    try {
      const data = JSON.parse(jsonString);
      
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
      if (data.languages && !Array.isArray(data.languages)) {
        return { valid: false, error: 'Languages must be an array' };
      }
      if (data.expertise && !Array.isArray(data.expertise)) {
        return { valid: false, error: 'Expertise must be an array' };
      }
      if (data.certifications && !Array.isArray(data.certifications)) {
        return { valid: false, error: 'Certifications must be an array' };
      }
      
      // Validate number
      if (data.rating !== undefined && typeof data.rating !== 'number') {
        return { valid: false, error: 'Rating must be a number' };
      }
      
      // Validate availability if provided
      if (data.availability && typeof data.availability !== 'object') {
        return { valid: false, error: 'Availability must be an object' };
      }
      
      // Set defaults for missing required arrays
      if (!data.languages) {
        data.languages = ['English'];
      }
      if (!data.expertise) {
        data.expertise = ['General Travel'];
      }
      
      // Set default availability if not provided
      if (!data.availability) {
        data.availability = defaultAvailability;
      }
      
      return { valid: true, data };
    } catch {
      return { valid: false, error: 'Invalid JSON format' };
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid URL';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.hourlyRate.trim()) {
      newErrors.hourlyRate = 'Hourly rate is required';
    }

    if (!formData.languages.trim()) {
      newErrors.languages = 'At least one language is required';
    }

    if (!formData.expertise.trim()) {
      newErrors.expertise = 'At least one area of expertise is required';
    }

    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to validate URLs
  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let expertData;
    
    if (createMode === 'json') {
      const validation = validateJson(jsonData);
      if (!validation.valid) {
        setJsonError(validation.error || 'Invalid JSON');
        return;
      }
      expertData = {
        ...validation.data,
        reviewCount: mode === 'edit' ? expert?.reviewCount || 0 : 0,
      };
    } else {
      if (!validateForm()) {
        return;
      }
      
      expertData = {
        name: formData.name.trim(),
        title: formData.title.trim(),
        image: formData.image.trim(),
        banner: formData.banner.trim() || null,
        location: formData.location.trim(),
        hourlyRate: formData.hourlyRate.trim(),
        languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang),
        expertise: formData.expertise.split(',').map(exp => exp.trim()).filter(exp => exp),
        certifications: formData.certifications ? 
          formData.certifications.split(',').map(cert => cert.trim()).filter(cert => cert) : [],
        bio: formData.bio.trim(),
        experience: formData.experience.trim(),
        rating: formData.rating,
        reviewCount: mode === 'edit' ? expert?.reviewCount || 0 : 0,
        availability: formData.availability,
      };
    }

    setSubmitting(true);

    try {
      // API call
      const url = mode === 'create' ? '/api/admin/experts' : `/api/admin/experts/${expert?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(expertData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${mode} expert`);
      }

      const result = await response.json();
      
      // Force router refresh to ensure fresh data
      router.refresh();
      
      // Navigate to expert detail page with refresh parameter
      const expertId = mode === 'create' ? result.id : expert?.id;
      router.push(`/admin/experts/${expertId}?refresh=true`);
      
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} expert:`, error);
      alert(`Failed to ${mode} expert. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (mode === 'edit' && expert) {
      router.push(`/admin/experts/${expert.id}`);
    } else {
      router.push('/admin/experts');
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof ExpertFormData, value: string | number | Record<string, { available: boolean; start: string; end: string }>) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle mode change
  const handleModeChange = (newMode: 'form' | 'json') => {
    if (newMode === 'json') {
      if (createMode === 'form' && (formData.name || mode === 'edit')) {
        initializeJsonData();
      } else if (!jsonData) {
        setJsonData(getDefaultJsonTemplate());
      }
    }
    setCreateMode(newMode);
    setJsonError('');
  };

  // Handle JSON preview
  const handlePreview = () => {
    const validation = validateJson(jsonData);
    if (validation.valid) {
      setPreviewData(validation.data ?? null);
      setShowPreview(true);
      setJsonError('');
    } else {
      setJsonError(validation.error || 'Invalid JSON');
    }
  };

  // Handle availability change
  const handleAvailabilityChange = (day: string, field: string, value: string | boolean) => {
    setFormData(prev => ({
      ...prev,
      availability: {
        ...prev.availability,
        [day]: {
          ...prev.availability[day as keyof typeof prev.availability],
          [field]: value,
        },
      },
    }));
  };

  const weekDays = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  return (
    <div className="min-h-screen bg-gray-50">
        {/* Sticky Header */}
        <div className="sticky top-0 z-10 bg-gray-50 px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <button
                onClick={handleCancel}
                className="mr-4 p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <ArrowLeftIcon size={20} />
              </button>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {mode === 'create' ? 'Add New Expert' : 'Edit Expert'}
                </h1>
                <p className="mt-2 text-gray-600">
                  {mode === 'create'
                    ? 'Add a new expert to your team'
                    : `Editing: ${expert?.name}`}
                </p>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => handleModeChange('form')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    createMode === 'form'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  Form
                </button>
                <button
                  onClick={() => handleModeChange('json')}
                  className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                    createMode === 'json'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900'
                  }`}
                >
                  JSON
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="px-6 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* JSON Mode - Two Column Layout */}
          {createMode === 'json' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Left Column - JSON Editor (2/3 width) */}
              <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                  <CodeIcon className="mr-2" size={20} />
                  {mode === 'create' ? 'Create Expert with JSON' : 'Edit Expert JSON'}
                </h2>
                {jsonError && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                    <p className="text-sm text-red-600">{jsonError}</p>
                  </div>
                )}
                <textarea
                  value={jsonData}
                  onChange={(e) => {
                    setJsonData(e.target.value);
                    setJsonError('');
                  }}
                  className="w-full h-[calc(100vh-350px)] min-h-[500px] px-3 py-2 border border-gray-300 rounded-md font-mono text-sm resize-none"
                  placeholder="Enter expert data in JSON format"
                />
                <div className="mt-4 flex justify-between">
                  <button
                    type="button"
                    onClick={handlePreview}
                    className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 flex items-center"
                  >
                    <EyeIcon className="mr-2" size={16} />
                    Preview
                  </button>
                  <button
                    type="button"
                    onClick={() => setJsonData(getDefaultJsonTemplate())}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Load Template
                  </button>
                </div>
              </div>
              
              {/* Right Column - JSON Structure Example (1/3 width) */}
              <div className="lg:col-span-1 bg-white shadow rounded-lg p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-4">JSON Structure Example</h3>
                <div className="bg-gray-50 rounded-md p-4 h-[calc(100vh-300px)] min-h-[500px] overflow-auto">
                  <pre className="text-xs text-gray-600">
{`{
  "name": "Jane Smith",
  "title": "Senior Travel Consultant",
  "image": "https://example.com/profile.jpg",
  "banner": "https://example.com/banner.jpg",
  "location": "Bali, Indonesia",
  "hourlyRate": "$150/hour",
  "rating": 5.0,
  "languages": [
    "English",
    "Indonesian", 
    "Spanish"
  ],
  "expertise": [
    "Adventure Travel",
    "Cultural Tours",
    "Eco-Tourism"
  ],
  "certifications": [
    "Certified Travel Professional",
    "IATA Certified"
  ],
  "bio": "Experienced travel consultant...",
  "experience": "10+ years creating tours",
  "socialMedia": {
    "instagram": "https://instagram.com/jane",
    "facebook": "https://facebook.com/jane",
    "twitter": "https://twitter.com/jane",
    "linkedin": "https://linkedin.com/in/jane",
    "youtube": "https://youtube.com/@jane",
    "website": "https://janetravel.com"
  },
  "latestVideos": [
    {
      "id": "video-001",
      "title": "Bali Travel Tips",
      "url": "https://youtube.com/watch?v=...",
      "thumbnail": "https://img.youtube.com/...",
      "viewCount": 5000
    }
  ],
  "featuredTours": [
    "tour-001",
    "tour-002"
  ],
  "availability": {
    "monday": {
      "available": true,
      "start": "09:00",
      "end": "17:00"
    },
    "tuesday": {
      "available": true,
      "start": "09:00",
      "end": "17:00"
    },
    // ... other days
  }
}

// Notes:
// - name, title, image, location, hourlyRate are required
// - languages and expertise must have at least one item
// - rating should be between 0 and 5
// - All URLs must be valid
// - featuredTours is array of tour IDs
// - socialMedia and latestVideos are optional`}
                  </pre>
                </div>
              </div>
            </div>
          ) : (
          <>
          {/* Basic Information Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <InfoIcon className="mr-2" size={20} />
                Basic Information
              </h2>
            </div>
            <div className="px-6 py-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <UserIcon className="inline w-4 h-4 mr-1" />
                    Name *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.name ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="John Doe"
                  />
                  {errors.name && (
                    <p className="mt-1 text-sm text-red-600">{errors.name}</p>
                  )}
                </div>

                {/* Title */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <FileTextIcon className="inline w-4 h-4 mr-1" />
                    Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.title ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Senior Travel Consultant"
                  />
                  {errors.title && (
                    <p className="mt-1 text-sm text-red-600">{errors.title}</p>
                  )}
                </div>

                {/* Location */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <MapPinIcon className="inline w-4 h-4 mr-1" />
                    Location *
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.location ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="New York, USA"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                  )}
                </div>

                {/* Hourly Rate */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <DollarSignIcon className="inline w-4 h-4 mr-1" />
                    Hourly Rate *
                  </label>
                  <input
                    type="text"
                    value={formData.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.hourlyRate ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="$150/hour"
                  />
                  {errors.hourlyRate && (
                    <p className="mt-1 text-sm text-red-600">{errors.hourlyRate}</p>
                  )}
                </div>

                {/* Rating */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <StarIcon className="inline w-4 h-4 mr-1" />
                    Rating
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="5"
                    step="0.1"
                    value={formData.rating}
                    onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 0)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.rating ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.rating && (
                    <p className="mt-1 text-sm text-red-600">{errors.rating}</p>
                  )}
                </div>

                {/* Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon className="inline w-4 h-4 mr-1" />
                    Profile Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.image}
                    onChange={(e) => handleInputChange('image', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.image ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com/profile.jpg"
                  />
                  {errors.image && (
                    <p className="mt-1 text-sm text-red-600">{errors.image}</p>
                  )}
                </div>

                {/* Banner Image URL */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ImageIcon className="inline w-4 h-4 mr-1" />
                    Banner/Cover Image URL
                  </label>
                  <input
                    type="url"
                    value={formData.banner}
                    onChange={(e) => handleInputChange('banner', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="https://example.com/banner.jpg"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Optional banner image displayed behind the profile on expert detail page
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Professional Details Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <BriefcaseIcon className="mr-2" size={20} />
                Professional Details
              </h2>
            </div>
            <div className="px-6 py-6 space-y-6">
              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Biography
                </label>
                <textarea
                  rows={4}
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Brief biography about the expert..."
                />
              </div>

              {/* Experience */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Experience
                </label>
                <textarea
                  rows={3}
                  value={formData.experience}
                  onChange={(e) => handleInputChange('experience', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Professional experience and background..."
                />
              </div>

              {/* Languages */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <GlobeIcon className="inline w-4 h-4 mr-1" />
                  Languages *
                </label>
                <input
                  type="text"
                  value={formData.languages}
                  onChange={(e) => handleInputChange('languages', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.languages ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="English, Spanish, French"
                />
                {errors.languages && (
                  <p className="mt-1 text-sm text-red-600">{errors.languages}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Separate languages with commas
                </p>
              </div>

              {/* Expertise */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Areas of Expertise *
                </label>
                <input
                  type="text"
                  value={formData.expertise}
                  onChange={(e) => handleInputChange('expertise', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.expertise ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Adventure Travel, Cultural Tours, Luxury Travel"
                />
                {errors.expertise && (
                  <p className="mt-1 text-sm text-red-600">{errors.expertise}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Separate areas with commas
                </p>
              </div>

              {/* Certifications */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <AwardIcon className="inline w-4 h-4 mr-1" />
                  Certifications
                </label>
                <input
                  type="text"
                  value={formData.certifications}
                  onChange={(e) => handleInputChange('certifications', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Certified Travel Professional, IATA Certified"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Separate certifications with commas
                </p>
              </div>
            </div>
          </div>

          {/* Availability Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <CalendarIcon className="mr-2" size={20} />
                Availability Schedule
              </h2>
            </div>
            <div className="px-6 py-6">
              <div className="space-y-4">
                {weekDays.map((day) => (
                  <div key={day} className="flex items-center space-x-4">
                    <div className="w-32">
                      <label className="flex items-center">
                        <input
                          type="checkbox"
                          checked={formData.availability[day as keyof typeof formData.availability].available}
                          onChange={(e) => handleAvailabilityChange(day, 'available', e.target.checked)}
                          className="mr-2"
                        />
                        <span className="text-sm font-medium text-gray-700 capitalize">{day}</span>
                      </label>
                    </div>
                    <div className="flex items-center space-x-2 flex-1">
                      <input
                        type="time"
                        value={formData.availability[day as keyof typeof formData.availability].start}
                        onChange={(e) => handleAvailabilityChange(day, 'start', e.target.value)}
                        disabled={!formData.availability[day as keyof typeof formData.availability].available}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                      />
                      <span className="text-gray-500">to</span>
                      <input
                        type="time"
                        value={formData.availability[day as keyof typeof formData.availability].end}
                        onChange={(e) => handleAvailabilityChange(day, 'end', e.target.value)}
                        disabled={!formData.availability[day as keyof typeof formData.availability].available}
                        className="px-3 py-1 border border-gray-300 rounded-md text-sm disabled:bg-gray-100"
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
          </>
          )}

          {/* JSON Preview Modal */}
          {showPreview && previewData && (
            <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-auto">
                <div className="px-6 py-4 border-b border-gray-200">
                  <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium text-gray-900">Expert Preview</h3>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      ✕
                    </button>
                  </div>
                </div>
                <div className="px-6 py-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Basic Information</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Name:</span> {previewData.name}</p>
                        <p><span className="font-medium">Title:</span> {previewData.title}</p>
                        <p><span className="font-medium">Location:</span> {previewData.location}</p>
                        <p><span className="font-medium">Hourly Rate:</span> {previewData.hourlyRate}</p>
                        <p><span className="font-medium">Rating:</span> {previewData.rating}/5</p>
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Professional Details</h4>
                      <div className="space-y-2 text-sm">
                        <p><span className="font-medium">Languages:</span> {previewData.languages?.join(', ')}</p>
                        <p><span className="font-medium">Expertise:</span> {previewData.expertise?.join(', ')}</p>
                        {previewData.certifications && (
                          <p><span className="font-medium">Certifications:</span> {previewData.certifications.join(', ')}</p>
                        )}
                        {previewData.bio && (
                          <p><span className="font-medium">Bio:</span> {previewData.bio}</p>
                        )}
                        {previewData.experience && (
                          <p><span className="font-medium">Experience:</span> {previewData.experience}</p>
                        )}
                      </div>
                    </div>
                  </div>
                  {previewData.image && (
                    <div className="mt-6">
                      <h4 className="font-medium text-gray-900 mb-2">Profile Image</h4>
                      <div className="relative w-32 h-32">
                        <Image
                          src={previewData.image}
                          alt="Profile preview"
                          fill
                          className="object-cover rounded-lg"
                          unoptimized
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Form Actions */}
          <div className="flex justify-end space-x-4 pt-6">
            <button
              type="button"
              onClick={handleCancel}
              disabled={submitting}
              className="px-6 py-3 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={submitting}
              className="px-6 py-3 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {submitting ? (
                <>
                  <LoaderIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                  {mode === 'create' ? 'Creating...' : 'Updating...'}
                </>
              ) : (
                <>
                  <SaveIcon className="-ml-1 mr-2 h-4 w-4" />
                  {mode === 'create' ? 'Create Expert' : 'Update Expert'}
                </>
              )}
            </button>
          </div>
        </form>
        </div>
    </div>
  );
}