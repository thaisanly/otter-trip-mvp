'use client';

import React, { useState, useEffect } from 'react';
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
  ShieldCheckIcon,
  UserIcon,
  MapIcon,
  PlusIcon,
  MinusIcon,
  CodeIcon,
} from 'lucide-react';

// Certification interface
interface Certification {
  id: string;
  title: string;
  description: string;
  isVerified: boolean;
  icon?: string;
}

// TourLeader interface matching Prisma schema
interface TourLeader {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  specialty: string;
  description: string;
  languages: string[];
  experience?: string;
  certifications?: Certification[];
  bio?: string;
  expertise?: string[];
  tours?: any[];
  reviews?: any[];
  availability?: any;
  createdAt: string;
  updatedAt: string;
}

// Form data interface
interface TourLeaderFormData {
  name: string;
  image: string;
  location: string;
  specialty: string;
  description: string;
  languages: string;
  experience: string;
  certifications: string; // JSON string representation for form mode
  bio: string;
  expertise: string;
  rating: number;
}

interface TourLeaderFormProps {
  admin: any;
  mode: 'create' | 'edit';
  tourLeader?: TourLeader;
}

export default function TourLeaderForm({ admin, mode, tourLeader }: TourLeaderFormProps) {
  const router = useRouter();
  const [submitting, setSubmitting] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [createMode, setCreateMode] = useState<'form' | 'json'>('form');
  const [jsonData, setJsonData] = useState<string>('');
  const [jsonError, setJsonError] = useState<string>('');
  const [certifications, setCertifications] = useState<Certification[]>([]);
  
  const [formData, setFormData] = useState<TourLeaderFormData>({
    name: '',
    image: '',
    location: '',
    specialty: '',
    description: '',
    languages: '',
    experience: '',
    certifications: '',
    bio: '',
    expertise: '',
    rating: 5.0,
  });

  // Initialize form data for edit mode
  useEffect(() => {
    if (mode === 'edit' && tourLeader) {
      setFormData({
        name: tourLeader.name,
        image: tourLeader.image,
        location: tourLeader.location,
        specialty: tourLeader.specialty,
        description: tourLeader.description,
        languages: tourLeader.languages?.join(', ') || '',
        experience: tourLeader.experience || '',
        certifications: tourLeader.certifications ? JSON.stringify(tourLeader.certifications, null, 2) : '',
        bio: tourLeader.bio || '',
        expertise: tourLeader.expertise?.join(', ') || '',
        rating: tourLeader.rating,
      });
      setCertifications(tourLeader.certifications || []);
    }
  }, [mode, tourLeader]);

  // Validate form data
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.image.trim()) {
      newErrors.image = 'Image URL is required';
    } else if (!isValidUrl(formData.image)) {
      newErrors.image = 'Please enter a valid URL';
    }

    if (!formData.location.trim()) {
      newErrors.location = 'Location is required';
    }

    if (!formData.specialty.trim()) {
      newErrors.specialty = 'Specialty is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }


    if (!formData.languages.trim()) {
      newErrors.languages = 'At least one language is required';
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
    } catch (_) {
      return false;
    }
  };

  // Initialize JSON data when switching to JSON mode
  const initializeJsonData = () => {
    const jsonObj = {
      name: formData.name,
      image: formData.image,
      location: formData.location,
      specialty: formData.specialty,
      description: formData.description,
      languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang),
      experience: formData.experience || undefined,
      certifications: certifications.length > 0 ? certifications : 
        (formData.certifications ? 
          (formData.certifications.trim().startsWith('[') ? 
            JSON.parse(formData.certifications) : 
            formData.certifications.split(',').map(cert => cert.trim()).filter(cert => cert).map(cert => ({
              id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: cert,
              description: '',
              isVerified: false,
              icon: ''
            }))
          ) : []
        ),
      bio: formData.bio || undefined,
      expertise: formData.expertise ? 
        formData.expertise.split(',').map(exp => exp.trim()).filter(exp => exp) : [],
      rating: formData.rating,
      reviewCount: mode === 'edit' ? tourLeader?.reviewCount || 0 : 0,
    };
    setJsonData(JSON.stringify(jsonObj, null, 2));
  };

  // Default JSON template for create mode
  const getDefaultJsonTemplate = () => {
    return JSON.stringify({
      name: "Sarah Johnson",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332c1bd?w=400",
      location: "Bali, Indonesia",
      specialty: "Adventure Travel Expert",
      description: "Experienced local guide with passion for authentic cultural experiences",
      languages: ["English", "Indonesian", "Spanish"],
      experience: "8+ years guiding travelers through Southeast Asia",
      certifications: [
        {
          "id": "cert-1",
          "title": "Licensed Tour Guide",
          "description": "Official government certification for professional tour guiding",
          "isVerified": true,
          "icon": "🎫"
        },
        {
          "id": "cert-2", 
          "title": "First Aid Certified",
          "description": "CPR and emergency response certification",
          "isVerified": true,
          "icon": "🏥"
        },
        {
          "id": "cert-3",
          "title": "Wilderness Safety",
          "description": "Outdoor safety and survival training certification",
          "isVerified": false,
          "icon": "🏔️"
        }
      ],
      bio: "Born and raised in Bali, I have an intimate knowledge of the island's hidden gems and cultural traditions. My passion is sharing authentic experiences that go beyond typical tourist attractions.",
      expertise: ["Cultural Tours", "Adventure Hiking", "Photography Tours", "Local Cuisine"],
      rating: 4.9,
      reviewCount: 127
    }, null, 2);
  };

  // Validate JSON structure
  const validateJson = (jsonString: string): { valid: boolean; data?: any; error?: string } => {
    try {
      const data = JSON.parse(jsonString);
      
      // Validate required fields
      if (!data.name || typeof data.name !== 'string') {
        return { valid: false, error: 'Name is required and must be a string' };
      }
      if (!data.image || typeof data.image !== 'string') {
        return { valid: false, error: 'Image URL is required and must be a string' };
      }
      if (!data.location || typeof data.location !== 'string') {
        return { valid: false, error: 'Location is required and must be a string' };
      }
      if (!data.specialty || typeof data.specialty !== 'string') {
        return { valid: false, error: 'Specialty is required and must be a string' };
      }
      if (!data.description || typeof data.description !== 'string') {
        return { valid: false, error: 'Description is required and must be a string' };
      }
      
      // Validate arrays
      if (data.languages && !Array.isArray(data.languages)) {
        return { valid: false, error: 'Languages must be an array' };
      }
      if (data.certifications && !Array.isArray(data.certifications)) {
        return { valid: false, error: 'Certifications must be an array' };
      }
      
      // Validate certification objects
      if (data.certifications && Array.isArray(data.certifications)) {
        for (let i = 0; i < data.certifications.length; i++) {
          const cert = data.certifications[i];
          if (typeof cert !== 'object' || cert === null) {
            return { valid: false, error: `Certification ${i + 1} must be an object` };
          }
          if (!cert.id || typeof cert.id !== 'string') {
            return { valid: false, error: `Certification ${i + 1} must have a valid id` };
          }
          if (!cert.title || typeof cert.title !== 'string') {
            return { valid: false, error: `Certification ${i + 1} must have a valid title` };
          }
          if (cert.description !== undefined && typeof cert.description !== 'string') {
            return { valid: false, error: `Certification ${i + 1} description must be a string` };
          }
          if (cert.isVerified !== undefined && typeof cert.isVerified !== 'boolean') {
            return { valid: false, error: `Certification ${i + 1} isVerified must be a boolean` };
          }
          if (cert.icon !== undefined && typeof cert.icon !== 'string') {
            return { valid: false, error: `Certification ${i + 1} icon must be a string` };
          }
        }
      }
      if (data.expertise && !Array.isArray(data.expertise)) {
        return { valid: false, error: 'Expertise must be an array' };
      }
      if (data.tours && !Array.isArray(data.tours)) {
        return { valid: false, error: 'Tours must be an array' };
      }
      
      
      // Validate numbers
      if (data.rating !== undefined && (typeof data.rating !== 'number' || data.rating < 0 || data.rating > 5)) {
        return { valid: false, error: 'Rating must be a number between 0 and 5' };
      }
      if (data.reviewCount !== undefined && (typeof data.reviewCount !== 'number' || data.reviewCount < 0)) {
        return { valid: false, error: 'Review count must be a non-negative number' };
      }
      
      // Validate required languages
      if (!data.languages || !Array.isArray(data.languages) || data.languages.length === 0) {
        return { valid: false, error: 'At least one language is required' };
      }
      
      return { valid: true, data };
    } catch (e) {
      return { valid: false, error: 'Invalid JSON format' };
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    let tourLeaderData;
    
    if (createMode === 'json') {
      const validation = validateJson(jsonData);
      if (!validation.valid) {
        setJsonError(validation.error || 'Invalid JSON');
        return;
      }
      tourLeaderData = {
        ...validation.data,
        reviewCount: mode === 'edit' ? tourLeader?.reviewCount || 0 : validation.data.reviewCount || 0,
      };
    } else {
      if (!validateForm()) {
        return;
      }
      
      // Prepare tour leader data
      tourLeaderData = {
        name: formData.name.trim(),
        image: formData.image.trim(),
        location: formData.location.trim(),
        specialty: formData.specialty.trim(),
        description: formData.description.trim(),
        languages: formData.languages.split(',').map(lang => lang.trim()).filter(lang => lang),
        experience: formData.experience.trim(),
        certifications: formData.certifications ? 
          (formData.certifications.trim().startsWith('[') ? 
            JSON.parse(formData.certifications) : 
            formData.certifications.split(',').map(cert => cert.trim()).filter(cert => cert).map(cert => ({
              id: `cert-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              title: cert,
              description: '',
              isVerified: false,
              icon: ''
            }))
          ) : [],
        bio: formData.bio.trim(),
        expertise: formData.expertise ? 
          formData.expertise.split(',').map(exp => exp.trim()).filter(exp => exp) : [],
        rating: formData.rating,
        reviewCount: mode === 'edit' ? tourLeader?.reviewCount || 0 : 0,
      };
    }

    setSubmitting(true);

    try {
      // API call
      const url = mode === 'create' ? '/api/admin/tour-leaders' : `/api/admin/tour-leaders/${tourLeader?.id}`;
      const method = mode === 'create' ? 'POST' : 'PUT';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourLeaderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to ${mode} tour leader`);
      }

      const result = await response.json();
      
      // Force router refresh to ensure fresh data
      router.refresh();
      
      // Navigate to tour leader detail page with refresh parameter
      const tourLeaderId = mode === 'create' ? result.id : tourLeader?.id;
      router.push(`/admin/tour-leaders/${tourLeaderId}?refresh=true`);
      
    } catch (error) {
      console.error(`Error ${mode === 'create' ? 'creating' : 'updating'} tour leader:`, error);
      alert(`Failed to ${mode} tour leader. Please try again.`);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle cancel
  const handleCancel = () => {
    if (mode === 'edit' && tourLeader) {
      router.push(`/admin/tour-leaders/${tourLeader.id}`);
    } else {
      router.push('/admin/tour-leaders');
    }
  };

  // Handle form input changes
  const handleInputChange = (field: keyof TourLeaderFormData, value: string | number | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };


  // Handle mode change
  const handleModeChange = (newMode: 'form' | 'json') => {
    if (newMode === 'json') {
      if (createMode === 'form' && formData.name) {
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
                  {mode === 'create' ? 'Create New Tour Leader' : 'Edit Tour Leader'}
                </h1>
                <p className="mt-2 text-gray-600">
                  {mode === 'create'
                    ? 'Add a new tour leader to your team'
                    : `Editing: ${tourLeader?.name}`}
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
                    {mode === 'create' ? 'Create Tour Leader' : 'Update Tour Leader'}
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
                {mode === 'create' ? 'Create Tour Leader with JSON' : 'Edit Tour Leader JSON'}
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
                placeholder="Paste or type your tour leader JSON data here..."
              />
            </div>
            
            {/* Right Column - JSON Structure Reference (1/3 width) */}
            <div className="lg:col-span-1 bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">JSON Structure Reference</h3>
              <div className="bg-gray-50 rounded-md p-4 h-[calc(100vh-300px)] min-h-[600px] overflow-auto">
                <pre className="text-xs text-gray-600">
{`{
  // Required Fields
  "name": "Sarah Johnson",
  "image": "https://example.com/profile.jpg",
  "location": "Bali, Indonesia",
  "specialty": "Adventure Travel Expert",
  "description": "Expert guide with local knowledge",
  
  // Optional Fields
  "rating": 4.9,               // Default: 5.0 (0-5)
  "reviewCount": 127,          // Default: 0
  
  // Languages (at least one required)
  "languages": [
    "English",
    "Indonesian",
    "Spanish"
  ],
  
  // Professional Details (optional)
  "experience": "8+ years guiding travelers",
  "bio": "Born and raised in Bali, passionate about...",
  
  // Certifications (array of objects)
  "certifications": [
    {
      "id": "cert-1",
      "title": "Licensed Tour Guide",
      "description": "Official government certification for professional tour guiding",
      "isVerified": true,
      "icon": "🎫"
    },
    {
      "id": "cert-2",
      "title": "First Aid Certified", 
      "description": "CPR and emergency response certification",
      "isVerified": true,
      "icon": "🏥"
    },
    {
      "id": "cert-3",
      "title": "Wilderness Safety",
      "description": "Outdoor safety and survival training certification", 
      "isVerified": false,
      "icon": "🏔️"
    }
  ],
  
  "expertise": [
    "Cultural Tours",
    "Adventure Hiking",
    "Photography Tours",
    "Local Cuisine"
  ],
  
}

// Validation Rules:
// ✓ Name, image, location, specialty, description are required
// ✓ At least one language is required
// ✓ Image URL must be valid and accessible
// ✓ Rating should be between 0 and 5
// ✓ Review count should be non-negative
// ✓ Arrays can be empty but must be arrays if provided
// ✓ Certifications must be objects with id, title, description, isVerified, icon`}
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

                {/* Specialty */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    <BriefcaseIcon className="inline w-4 h-4 mr-1" />
                    Specialty *
                  </label>
                  <input
                    type="text"
                    value={formData.specialty}
                    onChange={(e) => handleInputChange('specialty', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                      errors.specialty ? 'border-red-300' : 'border-gray-300'
                    }`}
                    placeholder="Adventure Travel Expert"
                  />
                  {errors.specialty && (
                    <p className="mt-1 text-sm text-red-600">{errors.specialty}</p>
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
                    placeholder="Bali, Indonesia"
                  />
                  {errors.location && (
                    <p className="mt-1 text-sm text-red-600">{errors.location}</p>
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
                <div className="md:col-span-2">
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
                  <p className="mt-1 text-xs text-gray-500">
                    Provide an absolute URL to the tour leader's profile image
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Description Section */}
          <div className="bg-white shadow rounded-lg">
            <div className="px-6 py-4 border-b border-gray-200">
              <h2 className="text-lg font-medium text-gray-900 flex items-center">
                <FileTextIcon className="mr-2" size={20} />
                Description & Bio
              </h2>
            </div>
            <div className="px-6 py-6 space-y-6">
              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Short Description *
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                    errors.description ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Brief description of the tour leader..."
                />
                {errors.description && (
                  <p className="mt-1 text-sm text-red-600">{errors.description}</p>
                )}
              </div>

              {/* Bio */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Biography
                </label>
                <textarea
                  rows={5}
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Detailed biography about the tour leader..."
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
                  placeholder="English, Spanish, Indonesian"
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
                  Areas of Expertise
                </label>
                <input
                  type="text"
                  value={formData.expertise}
                  onChange={(e) => handleInputChange('expertise', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Trekking, Cultural Tours, Wildlife Photography"
                />
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
                <textarea
                  rows={4}
                  value={formData.certifications}
                  onChange={(e) => handleInputChange('certifications', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="JSON array or comma-separated list. Example:
[{&quot;id&quot;: &quot;cert-1&quot;, &quot;title&quot;: &quot;Licensed Tour Guide&quot;, &quot;description&quot;: &quot;Official certification&quot;, &quot;isVerified&quot;: true, &quot;icon&quot;: &quot;🎫&quot;}]"
                />
                <p className="mt-1 text-xs text-gray-500">
                  Enter JSON array of certification objects or comma-separated titles (will be converted to objects)
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