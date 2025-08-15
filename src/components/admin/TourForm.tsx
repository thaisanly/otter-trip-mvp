'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  SaveIcon,
  LoaderIcon,
  MapPinIcon,
  ClockIcon,
  DollarSignIcon,
  UsersIcon,
  ImageIcon,
  PlayIcon,
  TagIcon,
  FileTextIcon,
  StarIcon,
  ListIcon,
  InfoIcon,
  PlusIcon,
  MinusIcon,
  CodeIcon,
  UserIcon,
} from 'lucide-react';

// Tour interface matching Prisma schema
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
  overview: string[];
  highlights: string[];
  contentImage?: string;
  videoUrl?: string;
  galleryImages?: string[];
  inclusions?: string[];
  exclusions?: string[];
  itinerary?: any[];
  description?: string;
  groupSize?: number;
  spotsLeft?: number;
  tourLeaderId?: string;
  createdAt: string;
  updatedAt: string;
}

// Form data interface
interface TourFormData {
  code: string;
  title: string;
  heroImage: string;
  location: string;
  duration: string;
  price: string;
  groupSize: number;
  spotsLeft: number;
  categories: string;
  overview: string;
  highlights: string;
  galleryImages: string;
  videoUrl: string;
  inclusions: string;
  exclusions: string;
  description: string;
  rating: number;
  itinerary: string;
  tourLeaderId: string;
}

interface TourLeader {
  id: string;
  name: string;
  specialty: string;
  location: string;
}

interface TourFormProps {
  admin: any;
  mode: 'create' | 'edit';
  tour?: Tour;
}

export default function TourForm({ admin, mode, tour }: TourFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createMode, setCreateMode] = useState<'form' | 'json'>('form');
  const [jsonData, setJsonData] = useState<string>('');
  const [jsonError, setJsonError] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [tourLeaders, setTourLeaders] = useState<TourLeader[]>([]);
  const [loadingTourLeaders, setLoadingTourLeaders] = useState(false);
  
  const [formData, setFormData] = useState<TourFormData>({
    code: '',
    title: '',
    heroImage: '',
    location: '',
    duration: '',
    price: '',
    groupSize: 8,
    spotsLeft: 8,
    categories: '',
    overview: '',
    highlights: '',
    galleryImages: '',
    videoUrl: '',
    inclusions: '',
    exclusions: '',
    description: '',
    rating: 5.0,
    itinerary: '',
    tourLeaderId: '',
  });

  // Fetch tour leaders on mount
  useEffect(() => {
    fetchTourLeaders();
  }, []);

  // Initialize form data for edit mode
  useEffect(() => {
    if (mode === 'edit' && tour) {
      setFormData({
        code: tour.code,
        title: tour.title,
        heroImage: tour.heroImage,
        location: tour.location,
        duration: tour.duration,
        price: tour.price,
        groupSize: tour.groupSize || 8,
        spotsLeft: tour.spotsLeft || 8,
        categories: tour.categories?.join(', ') || '',
        overview: tour.overview?.join('\n') || '',
        highlights: tour.highlights?.join(', ') || '',
        galleryImages: tour.galleryImages?.join('\n') || '',
        videoUrl: tour.videoUrl || '',
        inclusions: tour.inclusions?.join(', ') || '',
        exclusions: tour.exclusions?.join(', ') || '',
        description: tour.description || '',
        rating: tour.rating,
        itinerary: Array.isArray(tour.itinerary) ? 
          tour.itinerary.map((item: any) => `${item.day || item.title || 'Day'}: ${item.description || item.activities || ''}`).join('\n') : 
          (tour.itinerary ? String(tour.itinerary) : ''),
        tourLeaderId: tour.tourLeaderId || '',
      });
    }
  }, [mode, tour]);

  // Fetch tour leaders from API
  const fetchTourLeaders = async () => {
    try {
      setLoadingTourLeaders(true);
      const response = await fetch('/api/admin/tour-leaders');
      if (response.ok) {
        const data = await response.json();
        setTourLeaders(data);
      }
    } catch (error) {
      console.error('Error fetching tour leaders:', error);
    } finally {
      setLoadingTourLeaders(false);
    }
  };

  // Generate tour code based on title
  const generateTourCode = (title: string): string => {
    const prefix = title
      .split(' ')
      .map(word => word.charAt(0).toUpperCase())
      .join('')
      .slice(0, 3);
    const timestamp = Date.now().toString().slice(-3);
    return `${prefix}-${timestamp}`;
  };

  // Initialize JSON data when switching to JSON mode
  const initializeJsonData = () => {
    const jsonObj = {
      code: formData.code || generateTourCode(formData.title || 'TOUR'),
      title: formData.title,
      heroImage: formData.heroImage,
      location: formData.location,
      duration: formData.duration,
      price: formData.price,
      groupSize: formData.groupSize,
      spotsLeft: formData.spotsLeft,
      categories: formData.categories.split(',').map(cat => cat.trim()).filter(cat => cat),
      overview: formData.overview.split('\n').map(line => line.trim()).filter(line => line),
      highlights: formData.highlights.split(',').map(highlight => highlight.trim()).filter(highlight => highlight),
      galleryImages: formData.galleryImages.split('\n').map(url => url.trim()).filter(url => url),
      videoUrl: formData.videoUrl || undefined,
      inclusions: formData.inclusions.split(',').map(inc => inc.trim()).filter(inc => inc),
      exclusions: formData.exclusions.split(',').map(exc => exc.trim()).filter(exc => exc),
      itinerary: formData.itinerary
        .split('\n')
        .map(line => line.trim())
        .filter(line => line)
        .map(line => {
          const colonIndex = line.indexOf(':');
          if (colonIndex > 0) {
            return {
              day: line.substring(0, colonIndex).trim(),
              description: line.substring(colonIndex + 1).trim()
            };
          }
          return { day: 'Day', description: line };
        }),
      description: formData.description || undefined,
      rating: formData.rating,
      tourLeaderId: formData.tourLeaderId || undefined,
    };
    setJsonData(JSON.stringify(jsonObj, null, 2));
  };

  // Default JSON template for create mode
  const getDefaultJsonTemplate = () => {
    return JSON.stringify({
      code: "TOUR-001",
      title: "Amazing Tour Title",
      heroImage: "https://example.com/hero.jpg",
      location: "Bali, Indonesia",
      duration: "7 days",
      price: "$1,299",
      groupSize: 8,
      spotsLeft: 8,
      rating: 5.0,
      tourLeaderId: null,
      categories: ["adventure", "cultural"],
      overview: ["First paragraph about the tour", "Second paragraph with more details"],
      highlights: ["Stunning views", "Expert guides", "All meals included"],
      galleryImages: ["https://example.com/image1.jpg", "https://example.com/image2.jpg"],
      videoUrl: "https://youtube.com/embed/...",
      inclusions: ["Accommodation", "Meals", "Transportation"],
      exclusions: ["Flights", "Travel insurance", "Personal expenses"],
      itinerary: [
        {"day": "Day 1", "description": "Arrival and city orientation tour"},
        {"day": "Day 2", "description": "Museums and cultural sites visit"},
        {"day": "Day 3", "description": "Adventure activities and nature exploration"},
        {"day": "Day 4", "description": "Local cuisine and cooking class"},
        {"day": "Day 5", "description": "Free time and departure"}
      ],
      description: "Detailed description of the tour"
    }, null, 2);
  };

  // Validate JSON structure
  const validateJson = (jsonString: string): { valid: boolean; data?: any; error?: string } => {
    try {
      const data = JSON.parse(jsonString);
      
      // Validate required fields
      if (!data.title || typeof data.title !== 'string') {
        return { valid: false, error: 'Title is required and must be a string' };
      }
      if (!data.heroImage || typeof data.heroImage !== 'string') {
        return { valid: false, error: 'Hero image is required and must be a string' };
      }
      if (!data.location || typeof data.location !== 'string') {
        return { valid: false, error: 'Location is required and must be a string' };
      }
      if (!data.duration || typeof data.duration !== 'string') {
        return { valid: false, error: 'Duration is required and must be a string' };
      }
      if (!data.price || typeof data.price !== 'string') {
        return { valid: false, error: 'Price is required and must be a string' };
      }
      
      // Validate arrays
      if (data.categories && !Array.isArray(data.categories)) {
        return { valid: false, error: 'Categories must be an array' };
      }
      if (data.overview && !Array.isArray(data.overview)) {
        return { valid: false, error: 'Overview must be an array' };
      }
      if (data.highlights && !Array.isArray(data.highlights)) {
        return { valid: false, error: 'Highlights must be an array' };
      }
      if (data.galleryImages && !Array.isArray(data.galleryImages)) {
        return { valid: false, error: 'Gallery images must be an array' };
      }
      if (data.inclusions && !Array.isArray(data.inclusions)) {
        return { valid: false, error: 'Inclusions must be an array' };
      }
      if (data.exclusions && !Array.isArray(data.exclusions)) {
        return { valid: false, error: 'Exclusions must be an array' };
      }
      if (data.itinerary && !Array.isArray(data.itinerary)) {
        return { valid: false, error: 'Itinerary must be an array' };
      }
      
      // Validate numbers
      if (data.groupSize !== undefined && typeof data.groupSize !== 'number') {
        return { valid: false, error: 'Group size must be a number' };
      }
      if (data.spotsLeft !== undefined && typeof data.spotsLeft !== 'number') {
        return { valid: false, error: 'Spots left must be a number' };
      }
      if (data.rating !== undefined && typeof data.rating !== 'number') {
        return { valid: false, error: 'Rating must be a number' };
      }
      
      // Auto-generate code if not provided
      if (!data.code) {
        data.code = generateTourCode(data.title);
      }
      
      return { valid: true, data };
    } catch (e) {
      return { valid: false, error: 'Invalid JSON format' };
    }
  };

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.heroImage.trim()) {
      newErrors.heroImage = 'Hero image URL is required';
    } else if (!isValidUrl(formData.heroImage)) {
      newErrors.heroImage = 'Please enter a valid URL';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.duration.trim()) {
      newErrors.duration = 'Duration is required';
    }

    if (!formData.price.trim()) {
      newErrors.price = 'Price is required';
    }

    if (formData.groupSize < 1) {
      newErrors.groupSize = 'Group size must be at least 1';
    }

    if (formData.spotsLeft < 0) {
      newErrors.spotsLeft = 'Spots left cannot be negative';
    }

    if (formData.rating < 0 || formData.rating > 5) {
      newErrors.rating = 'Rating must be between 0 and 5';
    }

    // Validate gallery images URLs
    if (formData.galleryImages.trim()) {
      const urls = formData.galleryImages.split('\n').filter(url => url.trim());
      const invalidUrls = urls.filter(url => !isValidUrl(url.trim()));
      if (invalidUrls.length > 0) {
        newErrors.galleryImages = 'All gallery image URLs must be valid';
      }
    }

    // Validate video URL
    if (formData.videoUrl.trim() && !isValidUrl(formData.videoUrl)) {
      newErrors.videoUrl = 'Please enter a valid video URL';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Helper function to validate URLs
  const isValidUrl = (string: string): boolean => {
    try {
      new URL(string);
      return true;
    } catch (_) {
      return false;
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let tourData;
    
    if (createMode === 'json') {
      const validation = validateJson(jsonData);
      if (!validation.valid) {
        setJsonError(validation.error || 'Invalid JSON');
        return;
      }
      tourData = {
        ...validation.data,
        totalJoined: mode === 'edit' ? tour?.totalJoined || 0 : 0,
        reviewCount: mode === 'edit' ? tour?.reviewCount || 0 : 0,
        tourLeaderId: validation.data.tourLeaderId || null,
      };
    } else {
      if (!validateForm()) {
        return;
      }
      
      tourData = {
        ...formData,
        code: formData.code.trim() || generateTourCode(formData.title),
        categories: formData.categories.split(',').map(cat => cat.trim()).filter(cat => cat),
        overview: formData.overview.split('\n').map(line => line.trim()).filter(line => line),
        highlights: formData.highlights.split(',').map(highlight => highlight.trim()).filter(highlight => highlight),
        galleryImages: formData.galleryImages
          .split('\n')
          .map(url => url.trim())
          .filter(url => url),
        inclusions: formData.inclusions.split(',').map(inc => inc.trim()).filter(inc => inc),
        exclusions: formData.exclusions.split(',').map(exc => exc.trim()).filter(exc => exc),
        itinerary: formData.itinerary
          .split('\n')
          .map(line => line.trim())
          .filter(line => line)
          .map(line => {
            const colonIndex = line.indexOf(':');
            if (colonIndex > 0) {
              return {
                day: line.substring(0, colonIndex).trim(),
                description: line.substring(colonIndex + 1).trim()
              };
            }
            return { day: 'Day', description: line };
          }),
        totalJoined: mode === 'edit' ? tour?.totalJoined || 0 : 0,
        reviewCount: mode === 'edit' ? tour?.reviewCount || 0 : 0,
        tourLeaderId: formData.tourLeaderId || null,
      };
    }

    setSubmitting(true);

    try {
      // API call
      const url = mode === 'create' ? '/api/admin/tours' : `/api/admin/tours/${tour?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${mode} tour`);
      }

      const result = await response.json();
      
      // Force router refresh to ensure fresh data
      router.refresh();
      
      // Navigate to tour detail page with refresh parameter
      const tourId = mode === 'create' ? result.id : tour?.id;
      router.push(`/admin/tours/${tourId}?refresh=true`);
      
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} tour:`, error);
      alert(`Failed to ${mode} tour. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (mode === 'edit' && tour) {
      router.push(`/admin/tours/${tour.id}`);
    } else {
      router.push('/admin/tours');
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof TourFormData, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // Handle mode change
  const handleModeChange = (newMode: 'form' | 'json') => {
    if (newMode === 'json') {
      if (createMode === 'form' && formData.title) {
        initializeJsonData();
      } else if (!jsonData) {
        setJsonData(getDefaultJsonTemplate());
      }
    }
    setCreateMode(newMode);
    setJsonError('');
  };

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
                  {mode === 'create' ? 'Create New Tour' : 'Edit Tour'}
                </h1>
                <p className="mt-2 text-gray-600">
                  {mode === 'create'
                    ? 'Add a new tour package to your catalog'
                    : `Editing: ${tour?.title}`}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              {/* Mode Toggle */}
              <div className="flex items-center space-x-2">
                <button
                  type="button"
                  onClick={() => handleModeChange('form')}
                  className={`px-3 py-1 rounded ${createMode === 'form' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <FileTextIcon className="w-4 h-4 inline mr-1" />
                  Form
                </button>
                <button
                  type="button"
                  onClick={() => handleModeChange('json')}
                  className={`px-3 py-1 rounded ${createMode === 'json' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}
                >
                  <CodeIcon className="w-4 h-4 inline mr-1" />
                  JSON
                </button>
              </div>
              {/* Action Buttons */}
              <button
                type="button"
                onClick={handleCancel}
                disabled={submitting}
                className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="px-6 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {submitting ? (
                  <>
                    <LoaderIcon className="animate-spin -ml-1 mr-2 h-4 w-4" />
                    {mode === 'create' ? 'Creating...' : 'Updating...'}
                  </>
                ) : (
                  <>
                    <SaveIcon className="-ml-1 mr-2 h-4 w-4" />
                    {mode === 'create' ? 'Create Tour' : 'Update Tour'}
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-8">
        {createMode === 'json' ? (
          // JSON Mode - Two Column Layout
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - JSON Editor (2/3 width) */}
            <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CodeIcon className="mr-2" size={20} />
                {mode === 'create' ? 'Create Tour with JSON' : 'Edit Tour JSON'}
              </h2>
              {jsonError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{jsonError}</p>
                </div>
              )}
              <textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                className="w-full h-[calc(100vh-300px)] min-h-[600px] px-3 py-2 border border-gray-300 rounded-md font-mono text-sm resize-none"
                placeholder="Paste or type your tour JSON data here..."
              />
            </div>
            
            {/* Right Column - JSON Structure Reference (1/3 width) */}
            <div className="lg:col-span-1 bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">JSON Structure Reference</h3>
              <div className="bg-gray-50 rounded-md p-4 h-[calc(100vh-300px)] min-h-[600px] overflow-auto">
                <pre className="text-xs text-gray-600">
{`{
  // Required Fields
  "title": "Amazing Bali Adventure",
  "heroImage": "https://example.com/hero.jpg",
  "location": "Bali, Indonesia",
  "duration": "7 days",
  "price": "$1,299",
  
  // Optional Fields (with defaults)
  "code": "TOUR-001",  // Auto-generated if not provided
  "groupSize": 8,       // Default: 8
  "spotsLeft": 3,       // Default: 8
  "rating": 4.8,        // Default: 5.0
  "totalJoined": 0,     // Default: 0
  "reviewCount": 0,     // Default: 0
  "tourLeaderId": "john-doe", // Optional: Tour leader ID
  
  // Categories (at least one required)
  "categories": [
    "adventure",
    "cultural",
    "relaxation",
    "food"
  ],
  
  // Overview (array of paragraphs)
  "overview": [
    "First paragraph describing the tour...",
    "Second paragraph with more details...",
    "Third paragraph with highlights..."
  ],
  
  // Highlights (array of key features)
  "highlights": [
    "Visit ancient temples and historical sites",
    "Experience authentic local cuisine",
    "Enjoy pristine beaches and crystal waters",
    "Professional English-speaking guide",
    "Small group for personalized experience"
  ],
  
  // Gallery Images (array of URLs)
  "galleryImages": [
    "https://example.com/gallery1.jpg",
    "https://example.com/gallery2.jpg",
    "https://example.com/gallery3.jpg",
    "https://example.com/gallery4.jpg"
  ],
  
  // Optional Video URL
  "videoUrl": "https://youtube.com/embed/xxxxx",
  
  // What's Included
  "inclusions": [
    "Professional tour guide",
    "All entrance fees",
    "Daily breakfast",
    "Airport transfers",
    "Accommodation (3-star hotels)",
    "Transportation in air-conditioned vehicle"
  ],
  
  // What's Not Included
  "exclusions": [
    "International flights",
    "Personal expenses",
    "Travel insurance",
    "Tips and gratuities",
    "Lunch and dinner",
    "Optional activities"
  ],
  
  // Optional Detailed Description
  "description": "Embark on an unforgettable journey...",
  
  // Itinerary (array of day objects)
  "itinerary": [
    {
      "day": "Day 1",
      "description": "Arrival and orientation"
    },
    {
      "day": "Day 2", 
      "description": "Main activities"
    }
  ]
}

// Validation Rules:
// ✓ Title, heroImage, location, duration, price are required
// ✓ Arrays should contain at least one item
// ✓ All image URLs must be valid and accessible
// ✓ Price should include currency symbol (e.g., $, €, £)
// ✓ Rating should be between 0 and 5
// ✓ Numbers should be positive integers
// ✓ Code will be auto-generated if not provided
// ✓ Itinerary: day (string), description (string) are required per day`}
                </pre>
              </div>
            </div>
          </div>
        ) : (
          // Form Mode
          <form onSubmit={handleSubmit} className="space-y-8">
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
                  {/* Tour Code */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <TagIcon className="inline w-4 h-4 mr-1" />
                      Tour Code
                    </label>
                    <input
                      type="text"
                      value={formData.code}
                      onChange={(e) => handleInputChange('code', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Auto-generated if empty"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Leave empty to auto-generate based on title
                    </p>
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
                      placeholder="Enter tour title"
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
                      placeholder="City, Country"
                    />
                    {errors.location && (
                      <p className="mt-1 text-sm text-red-600">{errors.location}</p>
                    )}
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <ClockIcon className="inline w-4 h-4 mr-1" />
                      Duration *
                    </label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        errors.duration ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="e.g., 7 days, 2 weeks"
                    />
                    {errors.duration && (
                      <p className="mt-1 text-sm text-red-600">{errors.duration}</p>
                    )}
                  </div>

                  {/* Tour Leader */}
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <UserIcon className="inline w-4 h-4 mr-1" />
                      Tour Leader
                    </label>
                    <select
                      value={formData.tourLeaderId}
                      onChange={(e) => handleInputChange('tourLeaderId', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      disabled={loadingTourLeaders}
                    >
                      <option value="">Select a tour leader (optional)</option>
                      {tourLeaders.map((leader) => (
                        <option key={leader.id} value={leader.id}>
                          {leader.name} - {leader.specialty} ({leader.location})
                        </option>
                      ))}
                    </select>
                    <p className="mt-1 text-xs text-gray-500">
                      Assign a tour leader to this tour package
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing & Availability Section */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <DollarSignIcon className="mr-2" size={20} />
                  Pricing & Availability
                </h2>
              </div>
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Price */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price *
                    </label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        errors.price ? 'border-red-300' : 'border-gray-300'
                      }`}
                      placeholder="$1,299"
                    />
                    {errors.price && (
                      <p className="mt-1 text-sm text-red-600">{errors.price}</p>
                    )}
                  </div>

                  {/* Group Size */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <UsersIcon className="inline w-4 h-4 mr-1" />
                      Group Size *
                    </label>
                    <input
                      type="number"
                      min="1"
                      value={formData.groupSize}
                      onChange={(e) => handleInputChange('groupSize', parseInt(e.target.value) || 1)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        errors.groupSize ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.groupSize && (
                      <p className="mt-1 text-sm text-red-600">{errors.groupSize}</p>
                    )}
                  </div>

                  {/* Spots Left */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Spots Left *
                    </label>
                    <input
                      type="number"
                      min="0"
                      value={formData.spotsLeft}
                      onChange={(e) => handleInputChange('spotsLeft', parseInt(e.target.value) || 0)}
                      className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                        errors.spotsLeft ? 'border-red-300' : 'border-gray-300'
                      }`}
                    />
                    {errors.spotsLeft && (
                      <p className="mt-1 text-sm text-red-600">{errors.spotsLeft}</p>
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
                </div>
              </div>
            </div>

            {/* Images Section */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <ImageIcon className="mr-2" size={20} />
                  Images
                </h2>
              </div>
              <div className="px-6 py-6 space-y-6">
                {/* Hero Image */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Hero Image URL *
                  </label>
                  <input
                    type="url"
                    value={formData.heroImage}
                    onChange={(e) => handleInputChange('heroImage', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.heroImage ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com/hero-image.jpg"
                  />
                  {errors.heroImage && (
                    <p className="mt-1 text-sm text-red-600">{errors.heroImage}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    Main image displayed on tour cards and detail pages
                  </p>
                </div>

                {/* Gallery Images */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Gallery Images
                  </label>
                  <textarea
                    rows={4}
                    value={formData.galleryImages}
                    onChange={(e) => handleInputChange('galleryImages', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.galleryImages ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="https://example.com/image1.jpg&#10;https://example.com/image2.jpg&#10;https://example.com/image3.jpg"
                  />
                  {errors.galleryImages && (
                    <p className="mt-1 text-sm text-red-600">{errors.galleryImages}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    One image URL per line
                  </p>
                </div>
              </div>
            </div>

            {/* Other sections remain the same... */}
            {/* Categories & Tags Section */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <TagIcon className="mr-2" size={20} />
                  Categories & Tags
                </h2>
              </div>
              <div className="px-6 py-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Categories
                  </label>
                  <input
                    type="text"
                    value={formData.categories}
                    onChange={(e) => handleInputChange('categories', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="adventure, cultural, relaxation, food"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Separate categories with commas
                  </p>
                </div>
              </div>
            </div>

            {/* Description Section */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <FileTextIcon className="mr-2" size={20} />
                  Description
                </h2>
              </div>
              <div className="px-6 py-6 space-y-6">
                {/* Overview */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Overview
                  </label>
                  <textarea
                    rows={4}
                    value={formData.overview}
                    onChange={(e) => handleInputChange('overview', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Brief description of the tour... (one paragraph per line)"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Each line will be treated as a separate paragraph
                  </p>
                </div>

                {/* Description */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Detailed Description
                  </label>
                  <textarea
                    rows={6}
                    value={formData.description}
                    onChange={(e) => handleInputChange('description', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Detailed description of the tour experience..."
                  />
                </div>

                {/* Highlights */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <ListIcon className="inline w-4 h-4 mr-1" />
                    Highlights
                  </label>
                  <input
                    type="text"
                    value={formData.highlights}
                    onChange={(e) => handleInputChange('highlights', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Stunning views, Adventure activities, Cultural experiences"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Separate highlights with commas
                  </p>
                </div>
              </div>
            </div>

            {/* Inclusions & Exclusions Section */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <ListIcon className="mr-2" size={20} />
                  Inclusions & Exclusions
                </h2>
              </div>
              <div className="px-6 py-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Inclusions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <PlusIcon className="inline w-4 h-4 mr-1 text-green-600" />
                      Inclusions
                    </label>
                    <input
                      type="text"
                      value={formData.inclusions}
                      onChange={(e) => handleInputChange('inclusions', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Guide, Meals, Transportation"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Separate with commas
                    </p>
                  </div>

                  {/* Exclusions */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <MinusIcon className="inline w-4 h-4 mr-1 text-red-600" />
                      Exclusions
                    </label>
                    <input
                      type="text"
                      value={formData.exclusions}
                      onChange={(e) => handleInputChange('exclusions', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="Flights, Personal expenses, Insurance"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Separate with commas
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Itinerary Section */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <ListIcon className="mr-2" size={20} />
                  Itinerary
                </h2>
              </div>
              <div className="px-6 py-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Daily Itinerary
                  </label>
                  <textarea
                    rows={8}
                    value={formData.itinerary}
                    onChange={(e) => handleInputChange('itinerary', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Day 1: Arrival and city tour
Day 2: Museum visits and local cuisine
Day 3: Adventure activities and nature"
                  />
                  <p className="mt-1 text-xs text-gray-500">
                    Format: "Day X: Description" - one day per line
                  </p>
                </div>
              </div>
            </div>

            {/* Optional Section */}
            <div className="bg-white shadow rounded-lg">
              <div className="px-6 py-4 border-b border-gray-200">
                <h2 className="text-lg font-medium text-gray-900 flex items-center">
                  <PlayIcon className="mr-2" size={20} />
                  Optional
                </h2>
              </div>
              <div className="px-6 py-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Video URL
                  </label>
                  <input
                    type="url"
                    value={formData.videoUrl}
                    onChange={(e) => handleInputChange('videoUrl', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.videoUrl ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="https://youtube.com/embed/..."
                  />
                  {errors.videoUrl && (
                    <p className="mt-1 text-sm text-red-600">{errors.videoUrl}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    YouTube embed URL or other video platform URL
                  </p>
                </div>
              </div>
            </div>
          </form>
        )}
        </div>
    </div>
  );
}