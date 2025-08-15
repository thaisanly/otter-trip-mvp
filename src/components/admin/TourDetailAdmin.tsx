'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  TrashIcon,
  MapPinIcon,
  ClockIcon,
  UsersIcon,
  DollarSignIcon,
  StarIcon,
  CalendarIcon,
  CheckIcon,
  ImageIcon,
  PlayCircleIcon,
  TagIcon,
  PlusIcon,
  MinusIcon,
  LoaderIcon,
  CodeIcon,
  FileTextIcon,
  EyeIcon,
} from 'lucide-react';

interface TourDetailAdminProps {
  tour: any;
  admin: any;
}

export default function TourDetailAdmin({ tour, admin }: TourDetailAdminProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<'form' | 'json'>('form');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [jsonError, setJsonError] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  
  // Initialize form data with tour data
  const [formData, setFormData] = useState({
    code: tour.code,
    title: tour.title,
    heroImage: tour.heroImage,
    location: tour.location,
    duration: tour.duration,
    price: tour.price,
    groupSize: tour.groupSize || 8,
    spotsLeft: tour.spotsLeft || 8,
    categories: Array.isArray(tour.categories) ? tour.categories.join(', ') : '',
    overview: Array.isArray(tour.overview) ? tour.overview.join('\n') : '',
    highlights: Array.isArray(tour.highlights) ? tour.highlights.join(', ') : '',
    galleryImages: Array.isArray(tour.galleryImages) ? tour.galleryImages.join('\n') : '',
    videoUrl: tour.videoUrl || '',
    inclusions: Array.isArray(tour.inclusions) ? tour.inclusions.join(', ') : '',
    exclusions: Array.isArray(tour.exclusions) ? tour.exclusions.join(', ') : '',
    description: tour.description || '',
    rating: tour.rating || 5.0,
    itinerary: Array.isArray(tour.itinerary) ? tour.itinerary.map((item: any, index: number) => ({
      day: typeof item.day === 'string' ? index + 1 : item.day || index + 1,
      title: item.title || '',
      description: item.description || '',
      meals: Array.isArray(item.meals) ? item.meals : [],
      accommodation: item.accommodation || ''
    })) : [],
    dates: Array.isArray(tour.dates) ? tour.dates.map((date: any, index: number) => ({
      id: date.id || `date-${index + 1}`,
      date: date.date || '',
      price: date.price || 0,
      spotsLeft: date.spotsLeft || 0
    })) : [],
  });

  // JSON data for JSON mode
  const [jsonData, setJsonData] = useState<string>('');

  // Convert form data to JSON format for API
  const formDataToJson = () => {
    return {
      code: formData.code,
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
      description: formData.description || undefined,
      rating: formData.rating,
      totalJoined: tour.totalJoined || 0,
      reviewCount: tour.reviewCount || 0,
      itinerary: formData.itinerary,
      dates: formData.dates,
    };
  };

  // Initialize JSON data when switching to JSON mode
  const initializeJsonData = () => {
    const jsonObj = formDataToJson();
    setJsonData(JSON.stringify(jsonObj, null, 2));
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this tour?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/tours/${tour.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/tours');
      }
    } catch (error) {
      console.error('Error deleting tour:', error);
      alert('Failed to delete tour');
    }
  };

  const validateJson = (jsonString: string): { valid: boolean; data?: any; error?: string } => {
    try {
      const data = JSON.parse(jsonString);
      
      // Validate required fields
      if (!data.title || typeof data.title !== 'string') {
        return { valid: false, error: 'Title is required and must be a string' };
      }
      if (!data.code || typeof data.code !== 'string') {
        return { valid: false, error: 'Code is required and must be a string' };
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
      
      // Validate itinerary structure
      if (data.itinerary && Array.isArray(data.itinerary)) {
        for (let i = 0; i < data.itinerary.length; i++) {
          const day = data.itinerary[i];
          if (!day.day || typeof day.day !== 'number') {
            return { valid: false, error: `Itinerary day ${i + 1}: day must be a number` };
          }
          if (!day.title || typeof day.title !== 'string') {
            return { valid: false, error: `Itinerary day ${i + 1}: title is required and must be a string` };
          }
          if (!day.description || typeof day.description !== 'string') {
            return { valid: false, error: `Itinerary day ${i + 1}: description is required and must be a string` };
          }
          if (day.meals && !Array.isArray(day.meals)) {
            return { valid: false, error: `Itinerary day ${i + 1}: meals must be an array` };
          }
          if (day.accommodation && typeof day.accommodation !== 'string') {
            return { valid: false, error: `Itinerary day ${i + 1}: accommodation must be a string` };
          }
        }
      }
      
      // Validate dates structure
      if (data.dates && !Array.isArray(data.dates)) {
        return { valid: false, error: 'Dates must be an array' };
      }
      if (data.dates && Array.isArray(data.dates)) {
        for (let i = 0; i < data.dates.length; i++) {
          const date = data.dates[i];
          if (!date.id || typeof date.id !== 'string') {
            return { valid: false, error: `Date ${i + 1}: id is required and must be a string` };
          }
          if (!date.date || typeof date.date !== 'string') {
            return { valid: false, error: `Date ${i + 1}: date is required and must be a string` };
          }
          if (date.price === undefined || typeof date.price !== 'number') {
            return { valid: false, error: `Date ${i + 1}: price is required and must be a number` };
          }
          if (date.spotsLeft === undefined || typeof date.spotsLeft !== 'number') {
            return { valid: false, error: `Date ${i + 1}: spotsLeft is required and must be a number` };
          }
        }
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
      
      return { valid: true, data };
    } catch (e) {
      return { valid: false, error: 'Invalid JSON format' };
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrors({});
    setJsonError('');

    try {
      let tourData;
      
      if (editMode === 'json') {
        const validation = validateJson(jsonData);
        if (!validation.valid) {
          setJsonError(validation.error || 'Invalid JSON');
          setIsSaving(false);
          return;
        }
        tourData = {
          ...validation.data,
          totalJoined: tour.totalJoined || 0,
          reviewCount: tour.reviewCount || 0,
        };
      } else {
        tourData = formDataToJson();
      }

      const response = await fetch(`/api/admin/tours/${tour.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(tourData),
      });

      if (!response.ok) {
        throw new Error('Failed to update tour');
      }

      // Refresh the page to show updated data
      router.refresh();
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating tour:', error);
      alert('Failed to update tour');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    // Reset form data to original tour data
    setFormData({
      code: tour.code,
      title: tour.title,
      heroImage: tour.heroImage,
      location: tour.location,
      duration: tour.duration,
      price: tour.price,
      groupSize: tour.groupSize || 8,
      spotsLeft: tour.spotsLeft || 8,
      categories: Array.isArray(tour.categories) ? tour.categories.join(', ') : '',
      overview: Array.isArray(tour.overview) ? tour.overview.join('\n') : '',
      highlights: Array.isArray(tour.highlights) ? tour.highlights.join(', ') : '',
      galleryImages: Array.isArray(tour.galleryImages) ? tour.galleryImages.join('\n') : '',
      videoUrl: tour.videoUrl || '',
      inclusions: Array.isArray(tour.inclusions) ? tour.inclusions.join(', ') : '',
      exclusions: Array.isArray(tour.exclusions) ? tour.exclusions.join(', ') : '',
      description: tour.description || '',
      rating: tour.rating || 5.0,
      itinerary: Array.isArray(tour.itinerary) ? tour.itinerary.map((item: any, index: number) => ({
        day: typeof item.day === 'string' ? index + 1 : item.day || index + 1,
        title: item.title || '',
        description: item.description || '',
        meals: Array.isArray(item.meals) ? item.meals : [],
        accommodation: item.accommodation || ''
      })) : [],
    });
    setIsEditing(false);
    setEditMode('form');
    setErrors({});
    setJsonError('');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleEditModeChange = (mode: 'form' | 'json') => {
    if (mode === 'json') {
      initializeJsonData();
    }
    setEditMode(mode);
    setJsonError('');
  };

  // Itinerary management functions
  const addItineraryDay = () => {
    const newDay = {
      day: formData.itinerary.length + 1,
      title: '',
      description: '',
      meals: [],
      accommodation: '',
    };
    setFormData(prev => ({
      ...prev,
      itinerary: [...prev.itinerary, newDay]
    }));
  };

  const removeItineraryDay = (index: number) => {
    const updatedItinerary = formData.itinerary.filter((_, i) => i !== index);
    // Re-number remaining days
    const renumberedItinerary = updatedItinerary.map((day, i) => ({
      ...day,
      day: i + 1
    }));
    setFormData(prev => ({
      ...prev,
      itinerary: renumberedItinerary
    }));
  };

  const updateItineraryDay = (index: number, field: string, value: any) => {
    const updatedItinerary = [...formData.itinerary];
    if (field === 'meals') {
      updatedItinerary[index] = {
        ...updatedItinerary[index],
        [field]: typeof value === 'string' ? value.split(',').map(meal => meal.trim()).filter(meal => meal) : value
      };
    } else {
      updatedItinerary[index] = {
        ...updatedItinerary[index],
        [field]: value
      };
    }
    setFormData(prev => ({
      ...prev,
      itinerary: updatedItinerary
    }));
  };

  const moveItineraryDay = (index: number, direction: 'up' | 'down') => {
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === formData.itinerary.length - 1)) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    const updatedItinerary = [...formData.itinerary];
    
    // Swap items
    [updatedItinerary[index], updatedItinerary[newIndex]] = [updatedItinerary[newIndex], updatedItinerary[index]];
    
    // Re-number days
    const renumberedItinerary = updatedItinerary.map((day, i) => ({
      ...day,
      day: i + 1
    }));
    
    setFormData(prev => ({
      ...prev,
      itinerary: renumberedItinerary
    }));
  };

  // Gallery management functions
  const addGalleryImage = () => {
    setFormData(prev => ({
      ...prev,
      galleryImages: prev.galleryImages + (prev.galleryImages ? '\n' : '') + 'https://'
    }));
  };

  const removeGalleryImage = (index: number) => {
    const images = formData.galleryImages.split('\n');
    images.splice(index, 1);
    setFormData(prev => ({
      ...prev,
      galleryImages: images.join('\n')
    }));
  };

  const updateGalleryImage = (index: number, value: string) => {
    const images = formData.galleryImages.split('\n');
    while (images.length <= index) {
      images.push('');
    }
    images[index] = value;
    setFormData(prev => ({
      ...prev,
      galleryImages: images.join('\n')
    }));
  };

  const isValidImageUrl = (url: string): boolean => {
    if (!url.trim()) return false;
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const moveGalleryImage = (index: number, direction: 'up' | 'down') => {
    const images = formData.galleryImages.split('\n');
    if ((direction === 'up' && index === 0) || (direction === 'down' && index === images.length - 1)) {
      return;
    }

    const newIndex = direction === 'up' ? index - 1 : index + 1;
    [images[index], images[newIndex]] = [images[newIndex], images[index]];
    
    setFormData(prev => ({
      ...prev,
      galleryImages: images.join('\n')
    }));
  };

  // Date management functions
  const addDate = () => {
    const newDate = {
      id: `date-${Date.now()}`,
      date: '',
      price: 0,
      spotsLeft: 0
    };
    setFormData(prev => ({
      ...prev,
      dates: [...prev.dates, newDate]
    }));
  };

  const removeDate = (index: number) => {
    setFormData(prev => ({
      ...prev,
      dates: prev.dates.filter((_, i) => i !== index)
    }));
  };

  const updateDate = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      dates: prev.dates.map((date, i) => 
        i === index ? { ...date, [field]: value } : date
      )
    }));
  };

  const moveDate = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= formData.dates.length) return;

    const updatedDates = [...formData.dates];
    [updatedDates[index], updatedDates[newIndex]] = [updatedDates[newIndex], updatedDates[index]];
    
    setFormData(prev => ({
      ...prev,
      dates: updatedDates
    }));
  };

  // Parse arrays for display
  const categories = Array.isArray(tour.categories) ? tour.categories : [];
  const highlights = Array.isArray(tour.highlights) ? tour.highlights : [];
  const overview = Array.isArray(tour.overview) ? tour.overview : [];
  const inclusions = Array.isArray(tour.inclusions) ? tour.inclusions : [];
  const exclusions = Array.isArray(tour.exclusions) ? tour.exclusions : [];
  const galleryImages = Array.isArray(tour.galleryImages) ? tour.galleryImages : [];
  const itinerary = Array.isArray(tour.itinerary) ? tour.itinerary.map((item: any, index: number) => ({
    day: typeof item.day === 'string' ? index + 1 : item.day || index + 1,
    title: item.title || '',
    description: item.description || '',
    meals: Array.isArray(item.meals) ? item.meals : [],
    accommodation: item.accommodation || ''
  })) : [];
  const dates = Array.isArray(tour.dates) ? tour.dates.map((date: any, index: number) => ({
    id: date.id || `date-${index + 1}`,
    date: date.date || '',
    price: date.price || 0,
    spotsLeft: date.spotsLeft || 0
  })) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin/tours')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Tours
            </button>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-500">Tour Code: {tour.code}</span>
          </div>
          <div className="flex items-center space-x-3">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <EditIcon className="w-4 h-4 mr-2" />
                  Edit Tour
                </button>
                <button
                  onClick={handleDelete}
                  className="flex items-center px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                >
                  <TrashIcon className="w-4 h-4 mr-2" />
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
                  className="flex items-center px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 disabled:opacity-50"
                >
                  <XIcon className="w-4 h-4 mr-2" />
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
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
                Edit Tour JSON
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
                placeholder="Enter tour data in JSON format"
              />
              <button
                type="button"
                onClick={() => {
                  const validation = validateJson(jsonData);
                  if (validation.valid) {
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
                Preview Tour
              </button>
            </div>
            
            {/* Right Column - JSON Structure Example (1/3 width) */}
            <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">JSON Structure Example</h3>
              <div className="bg-gray-50 rounded-md p-4 h-[calc(100vh-300px)] min-h-[500px] overflow-auto">
                <pre className="text-xs text-gray-600">
{`{
  "code": "TOUR-001",
  "title": "Amazing Bali Adventure",
  "heroImage": "https://example.com/image.jpg",
  "location": "Bali, Indonesia",
  "duration": "7 days",
  "price": "$1,299",
  "groupSize": 8,
  "spotsLeft": 3,
  "rating": 4.8,
  "totalJoined": 0,
  "reviewCount": 0,
  
  "categories": [
    "adventure",
    "cultural"
  ],
  
  "overview": [
    "First paragraph of overview",
    "Second paragraph of overview"
  ],
  
  "highlights": [
    "Visit ancient temples",
    "Experience local culture",
    "Enjoy pristine beaches"
  ],
  
  "galleryImages": [
    "https://example.com/image1.jpg",
    "https://example.com/image2.jpg",
    "https://example.com/image3.jpg"
  ],
  
  "videoUrl": "https://youtube.com/embed/xxx",
  
  "inclusions": [
    "Professional tour guide",
    "All entrance fees",
    "Daily breakfast",
    "Airport transfers"
  ],
  
  "exclusions": [
    "International flights",
    "Personal expenses",
    "Travel insurance",
    "Tips and gratuities"
  ],
  
  "itinerary": [
    {
      "day": 1,
      "title": "Arrival & Welcome",
      "description": "Arrive in Bali, airport transfer to hotel, welcome dinner",
      "meals": ["Dinner"],
      "accommodation": "5-star resort in Ubud"
    },
    {
      "day": 2,
      "title": "Temple Exploration",
      "description": "Visit ancient temples and rice terraces",
      "meals": ["Breakfast", "Lunch"],
      "accommodation": "5-star resort in Ubud"
    }
  ],
  
  "dates": [
    {
      "id": "date-1",
      "date": "2024-06-15",
      "price": 299,
      "spotsLeft": 8
    },
    {
      "id": "date-2", 
      "date": "2024-07-20",
      "price": 349,
      "spotsLeft": 5
    }
  ],
  
  "description": "Detailed description of the tour..."
}

// Notes:
// - All fields are required except videoUrl and description
// - Arrays should contain at least one item
// - URLs must be valid and accessible
// - Price should include currency symbol
// - Rating should be between 0 and 5
// - Group size and spots left should be positive numbers
// - Itinerary requirements:
//   * Each day object requires: day (number), title (string), description (string)
//   * Optional fields: meals (array), accommodation (string)
//   * Days must have sequential numbering starting from 1
// - Dates requirements:
//   * Each date object requires: id (string), date (YYYY-MM-DD), price (number), spotsLeft (number)
//   * Dates should be in chronological order`}
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
              <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-6xl sm:w-full">
                <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-gray-900">Tour Preview</h3>
                    <button
                      onClick={() => setShowPreview(false)}
                      className="text-gray-400 hover:text-gray-500"
                    >
                      <XIcon className="w-6 h-6" />
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {/* Tour Card Preview */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Tour Card View (Homepage)</h4>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
                          <div className="relative">
                            <img 
                              src={previewData.heroImage} 
                              alt={previewData.title} 
                              className="w-full h-48 object-cover"
                              onError={(e) => {
                                e.currentTarget.src = `https://via.placeholder.com/400x200/4B5563/FFFFFF?text=Invalid+Image`;
                              }}
                            />
                            <div className="absolute bottom-3 left-3 bg-white/80 backdrop-blur-sm text-gray-800 text-xs px-2 py-1 rounded-full">
                              {previewData.duration}
                            </div>
                          </div>
                          <div className="p-4">
                            <div className="flex justify-between items-start mb-2">
                              <h3 className="font-bold text-gray-900 line-clamp-1">{previewData.title}</h3>
                              <div className="flex items-center">
                                <StarIcon size={14} className="text-yellow-500 fill-yellow-500 mr-1" />
                                <span className="text-sm font-medium text-gray-900">{previewData.rating?.toFixed(1) || '5.0'}</span>
                              </div>
                            </div>
                            <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                              {previewData.description || (previewData.overview && previewData.overview[0]) || 'No description available'}
                            </p>
                            <div className="flex justify-between items-end mb-3">
                              <div>
                                <div className="text-gray-900 font-bold">{previewData.price}</div>
                                <div className="text-gray-500 text-xs">per person</div>
                              </div>
                              <div className="flex items-center text-xs text-gray-500">
                                <MapPinIcon className="w-4 h-4 mr-1" />
                                {previewData.location}
                              </div>
                            </div>
                            <button className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors">
                              Book Now
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Tour Details Preview */}
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-3">Tour Details</h4>
                      <div className="bg-gray-50 p-4 rounded-lg max-h-[500px] overflow-y-auto">
                        <div className="space-y-4">
                          <div>
                            <h5 className="text-xs font-semibold text-gray-600 uppercase mb-1">Categories</h5>
                            <div className="flex flex-wrap gap-2">
                              {previewData.categories?.map((cat: string, index: number) => (
                                <span key={index} className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                                  {cat}
                                </span>
                              ))}
                            </div>
                          </div>
                          
                          {previewData.highlights && previewData.highlights.length > 0 && (
                            <div>
                              <h5 className="text-xs font-semibold text-gray-600 uppercase mb-1">Highlights</h5>
                              <ul className="space-y-1">
                                {previewData.highlights.slice(0, 5).map((highlight: string, index: number) => (
                                  <li key={index} className="flex items-start text-sm text-gray-700">
                                    <CheckIcon className="w-4 h-4 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                                    {highlight}
                                  </li>
                                ))}
                              </ul>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <h5 className="text-xs font-semibold text-gray-600 uppercase mb-1">Group Size</h5>
                              <div className="flex items-center text-sm text-gray-700">
                                <UsersIcon className="w-4 h-4 mr-1" />
                                {previewData.groupSize || 10} people
                              </div>
                            </div>
                          </div>
                          
                          {previewData.galleryImages && previewData.galleryImages.length > 0 && (
                            <div>
                              <h5 className="text-xs font-semibold text-gray-600 uppercase mb-1">Gallery Preview</h5>
                              <div className="grid grid-cols-3 gap-2">
                                {previewData.galleryImages.slice(0, 3).map((img: string, index: number) => (
                                  <img 
                                    key={index}
                                    src={img} 
                                    alt={`Gallery ${index + 1}`}
                                    className="w-full h-20 object-cover rounded"
                                    onError={(e) => {
                                      e.currentTarget.src = `https://via.placeholder.com/100x80/CBD5E1/64748B?text=Image`;
                                    }}
                                  />
                                ))}
                              </div>
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
        <div className="px-6 py-6">
          {/* Form Edit Mode or View Mode */}
          {/* Hero Section */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-6">
            <div className="relative h-96">
              {isEditing && editMode === 'form' ? (
                <div className="p-6 h-full flex flex-col">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Hero Image URL</label>
                  <input
                    type="url"
                    value={formData.heroImage}
                    onChange={(e) => handleInputChange('heroImage', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md mb-4"
                    placeholder="https://example.com/image.jpg"
                  />
                  <img
                    src={formData.heroImage}
                    alt={formData.title}
                    className="flex-1 w-full object-cover rounded-md"
                    onError={(e) => {
                      e.currentTarget.src = `https://via.placeholder.com/1200x600/4B5563/FFFFFF?text=Invalid+Image`;
                    }}
                  />
                </div>
              ) : (
                <img
                  src={tour.heroImage}
                  alt={tour.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    e.currentTarget.src = `https://via.placeholder.com/1200x600/4B5563/FFFFFF?text=${encodeURIComponent(tour.title)}`;
                  }}
                />
              )}
              {!isEditing && (
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-8">
                  <h1 className="text-4xl font-bold text-white mb-2">{tour.title}</h1>
                  <div className="flex items-center space-x-6 text-white">
                    <div className="flex items-center">
                      <MapPinIcon className="w-5 h-5 mr-2" />
                      {tour.location}
                    </div>
                    <div className="flex items-center">
                      <ClockIcon className="w-5 h-5 mr-2" />
                      {tour.duration}
                    </div>
                    <div className="flex items-center">
                      <DollarSignIcon className="w-5 h-5 mr-2" />
                      {tour.price}
                    </div>
                  </div>
                </div>
              )}
            </div>
            {isEditing && editMode === 'form' && (
              <div className="p-6 border-t">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    <input
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                    <input
                      type="text"
                      value={formData.location}
                      onChange={(e) => handleInputChange('location', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Duration</label>
                    <input
                      type="text"
                      value={formData.duration}
                      onChange={(e) => handleInputChange('duration', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Price</label>
                    <input
                      type="text"
                      value={formData.price}
                      onChange={(e) => handleInputChange('price', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              {/* Overview */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Overview</h2>
                {isEditing && editMode === 'form' ? (
                  <textarea
                    value={formData.overview}
                    onChange={(e) => handleInputChange('overview', e.target.value)}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter overview paragraphs (one per line)"
                  />
                ) : (
                  <div className="space-y-3 text-gray-600">
                    {overview.map((paragraph: string, index: number) => (
                      <p key={index}>{paragraph}</p>
                    ))}
                  </div>
                )}
              </div>

              {/* Highlights */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Tour Highlights</h2>
                {isEditing && editMode === 'form' ? (
                  <textarea
                    value={formData.highlights}
                    onChange={(e) => handleInputChange('highlights', e.target.value)}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter highlights separated by commas"
                  />
                ) : (
                  <ul className="space-y-2">
                    {highlights.map((highlight: string, index: number) => (
                      <li key={index} className="flex items-start">
                        <CheckIcon className="w-5 h-5 text-green-500 mr-3 mt-0.5 flex-shrink-0" />
                        <span className="text-gray-600">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Gallery */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Gallery</h2>
                  {isEditing && editMode === 'form' && (
                    <button
                      onClick={addGalleryImage}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      type="button"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Image
                    </button>
                  )}
                </div>
                
                {isEditing && editMode === 'form' ? (
                  <div className="space-y-4">
                    {formData.galleryImages.trim() === '' ? (
                      <div className="text-center py-8 text-gray-500">
                        <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No gallery images added yet.</p>
                        <p className="text-sm">Click "Add Image" to start building your gallery.</p>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {formData.galleryImages.split('\n').map((image: string, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4">
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-sm font-medium text-gray-900">Image {index + 1}</h3>
                              <div className="flex items-center space-x-2">
                                <button
                                  onClick={() => moveGalleryImage(index, 'up')}
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
                                  onClick={() => moveGalleryImage(index, 'down')}
                                  disabled={index === formData.galleryImages.split('\n').length - 1}
                                  className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                  title="Move down"
                                  type="button"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                  </svg>
                                </button>
                                <button
                                  onClick={() => removeGalleryImage(index)}
                                  className="p-1 text-red-400 hover:text-red-600"
                                  title="Remove image"
                                  type="button"
                                >
                                  <MinusIcon className="w-4 h-4" />
                                </button>
                              </div>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                              <div className="lg:col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Image URL *</label>
                                <input
                                  type="url"
                                  value={image.trim()}
                                  onChange={(e) => updateGalleryImage(index, e.target.value)}
                                  className={`w-full px-3 py-2 border rounded-md focus:ring-blue-500 focus:border-blue-500 ${
                                    image.trim() && !isValidImageUrl(image.trim()) 
                                      ? 'border-red-300 bg-red-50' 
                                      : 'border-gray-300'
                                  }`}
                                  placeholder="https://example.com/image.jpg"
                                  required
                                />
                                {image.trim() && !isValidImageUrl(image.trim()) && (
                                  <p className="mt-1 text-sm text-red-600">Please enter a valid URL</p>
                                )}
                              </div>
                              <div className="lg:col-span-1">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Preview</label>
                                <div className="aspect-video w-full">
                                  {image.trim() ? (
                                    <img
                                      src={image.trim()}
                                      alt={`Gallery ${index + 1}`}
                                      className="w-full h-full object-cover rounded-md border border-gray-200"
                                      onError={(e) => {
                                        e.currentTarget.src = `https://via.placeholder.com/300x200/CBD5E1/64748B?text=Invalid+Image`;
                                      }}
                                    />
                                  ) : (
                                    <div className="w-full h-full bg-gray-100 rounded-md border border-gray-200 flex items-center justify-center">
                                      <ImageIcon className="w-8 h-8 text-gray-400" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ) : (
                  <div>
                    {galleryImages.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <ImageIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No gallery images available.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {galleryImages.map((image: string, index: number) => (
                          <div key={index} className="group relative">
                            <img
                              src={image}
                              alt={`Gallery ${index + 1}`}
                              className="w-full aspect-video object-cover rounded-lg border border-gray-200"
                              onError={(e) => {
                                e.currentTarget.src = `https://via.placeholder.com/400x300/CBD5E1/64748B?text=Image+${index + 1}`;
                              }}
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 rounded-lg flex items-center justify-center">
                              <span className="text-white font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                Image {index + 1}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Itinerary Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Itinerary</h2>
                  {isEditing && editMode === 'form' && (
                    <button
                      onClick={addItineraryDay}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Day
                    </button>
                  )}
                </div>
                
                {isEditing && editMode === 'form' ? (
                  <div className="space-y-6">
                    {formData.itinerary.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No itinerary days added yet.</p>
                        <p className="text-sm">Click "Add Day" to start building your itinerary.</p>
                      </div>
                    ) : (
                      formData.itinerary.map((day: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">{day.day}</h3>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => moveItineraryDay(index, 'up')}
                                disabled={index === 0}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Move up"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => moveItineraryDay(index, 'down')}
                                disabled={index === formData.itinerary.length - 1}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Move down"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => removeItineraryDay(index)}
                                className="p-1 text-red-400 hover:text-red-600"
                                title="Remove day"
                              >
                                <MinusIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                              <input
                                type="text"
                                value={day.title}
                                onChange={(e) => updateItineraryDay(index, 'title', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="e.g., Arrival & Welcome"
                                required
                              />
                            </div>
                            <div className="md:col-span-2">
                              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                              <textarea
                                value={day.description}
                                onChange={(e) => updateItineraryDay(index, 'description', e.target.value)}
                                rows={3}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="Describe the activities for this day..."
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Meals</label>
                              <input
                                type="text"
                                value={Array.isArray(day.meals) ? day.meals.join(', ') : ''}
                                onChange={(e) => updateItineraryDay(index, 'meals', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="e.g., Breakfast, Lunch, Dinner"
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Accommodation</label>
                              <input
                                type="text"
                                value={day.accommodation}
                                onChange={(e) => updateItineraryDay(index, 'accommodation', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="e.g., 5-star resort in Ubud"
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="space-y-8">
                    {itinerary.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No itinerary available.</p>
                      </div>
                    ) : (
                      itinerary.map((day: any, index: number) => (
                        <div
                          key={index}
                          className={`border-l-4 ${index === 0 ? 'border-blue-600' : 'border-gray-200'} pl-4`}
                        >
                          <h3 className="font-bold text-lg text-gray-900 mb-2">
                            Day {day.day}
                          </h3>
                          <p className="text-gray-700 mb-3">{day.description}</p>
                          <div className="flex flex-wrap gap-4 mt-3">
                            {day.meals && day.meals.length > 0 && (
                              <div className="bg-yellow-50 border border-yellow-100 rounded-lg px-3 py-1.5 text-sm text-yellow-800">
                                <span className="font-medium">Meals:</span> {day.meals.join(', ')}
                              </div>
                            )}
                            {day.accommodation && (
                              <div className="bg-blue-50 border border-blue-100 rounded-lg px-3 py-1.5 text-sm text-blue-800">
                                <span className="font-medium">Accommodation:</span>{' '}
                                {day.accommodation}
                              </div>
                            )}
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                )}
              </div>

              {/* Available Dates */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-xl font-semibold">Available Dates</h2>
                  {isEditing && editMode === 'form' && (
                    <button
                      onClick={addDate}
                      className="flex items-center px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      type="button"
                    >
                      <PlusIcon className="w-4 h-4 mr-2" />
                      Add Date
                    </button>
                  )}
                </div>
                
                {isEditing && editMode === 'form' ? (
                  <div className="space-y-4">
                    {formData.dates.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No dates added yet.</p>
                        <p className="text-sm">Click "Add Date" to start adding available tour dates.</p>
                      </div>
                    ) : (
                      formData.dates.map((date: any, index: number) => (
                        <div key={index} className="border border-gray-200 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-medium text-gray-900">Date {index + 1}</h3>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => moveDate(index, 'up')}
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
                                onClick={() => moveDate(index, 'down')}
                                disabled={index === formData.dates.length - 1}
                                className="p-1 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Move down"
                                type="button"
                              >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                              </button>
                              <button
                                onClick={() => removeDate(index)}
                                className="p-1 text-red-400 hover:text-red-600"
                                title="Remove date"
                                type="button"
                              >
                                <MinusIcon className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                              <input
                                type="date"
                                value={date.date}
                                onChange={(e) => updateDate(index, 'date', e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Price (USD) *</label>
                              <input
                                type="number"
                                value={date.price}
                                onChange={(e) => updateDate(index, 'price', parseFloat(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="299"
                                min="0"
                                step="0.01"
                                required
                              />
                            </div>
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-1">Spots Left *</label>
                              <input
                                type="number"
                                value={date.spotsLeft}
                                onChange={(e) => updateDate(index, 'spotsLeft', parseInt(e.target.value) || 0)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md"
                                placeholder="8"
                                min="0"
                                required
                              />
                            </div>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                ) : (
                  <div className="space-y-4">
                    {dates.length === 0 ? (
                      <div className="text-center py-8 text-gray-500">
                        <CalendarIcon className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                        <p>No available dates.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {dates.map((date: any, index: number) => (
                          <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                            <div className="text-center">
                              <div className="text-lg font-semibold text-gray-900 mb-2">
                                {new Date(date.date).toLocaleDateString('en-US', { 
                                  weekday: 'short',
                                  year: 'numeric',
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </div>
                              <div className="text-2xl font-bold text-blue-600 mb-2">${date.price}</div>
                              <div className="text-sm text-gray-600">
                                {date.spotsLeft > 0 ? (
                                  <span className="text-green-600">{date.spotsLeft} spots left</span>
                                ) : (
                                  <span className="text-red-600">Fully booked</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Inclusions & Exclusions */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">What's Included & Excluded</h2>
                {isEditing && editMode === 'form' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Inclusions</label>
                      <textarea
                        value={formData.inclusions}
                        onChange={(e) => handleInputChange('inclusions', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter inclusions separated by commas"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Exclusions</label>
                      <textarea
                        value={formData.exclusions}
                        onChange={(e) => handleInputChange('exclusions', e.target.value)}
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md"
                        placeholder="Enter exclusions separated by commas"
                      />
                    </div>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="font-medium text-green-600 mb-3">Included</h3>
                      <ul className="space-y-2">
                        {inclusions.map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <CheckIcon className="w-5 h-5 text-green-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h3 className="font-medium text-red-600 mb-3">Not Included</h3>
                      <ul className="space-y-2">
                        {exclusions.map((item: string, index: number) => (
                          <li key={index} className="flex items-start">
                            <XIcon className="w-5 h-5 text-red-500 mr-2 mt-0.5 flex-shrink-0" />
                            <span className="text-sm text-gray-600">{item}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Tour Info Card */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Tour Information</h3>
                {isEditing && editMode === 'form' ? (
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm text-gray-500">Tour Code</label>
                      <input
                        type="text"
                        value={formData.code}
                        onChange={(e) => handleInputChange('code', e.target.value)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Group Size</label>
                      <input
                        type="number"
                        value={formData.groupSize}
                        onChange={(e) => handleInputChange('groupSize', parseInt(e.target.value) || 0)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Spots Left</label>
                      <input
                        type="number"
                        value={formData.spotsLeft}
                        onChange={(e) => handleInputChange('spotsLeft', parseInt(e.target.value) || 0)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-gray-500">Rating</label>
                      <input
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
                        value={formData.rating}
                        onChange={(e) => handleInputChange('rating', parseFloat(e.target.value) || 0)}
                        className="w-full mt-1 px-3 py-2 border border-gray-300 rounded-md text-sm"
                      />
                    </div>
                  </div>
                ) : (
                  <dl className="space-y-3">
                    <div>
                      <dt className="text-sm text-gray-500">Tour Code</dt>
                      <dd className="text-sm font-medium">{tour.code}</dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Group Size</dt>
                      <dd className="text-sm font-medium flex items-center">
                        <UsersIcon className="w-4 h-4 mr-1" />
                        {tour.groupSize || 10} people
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Rating</dt>
                      <dd className="flex items-center">
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
                        <span className="ml-2 text-sm text-gray-600">
                          {tour.rating?.toFixed(1) || '0.0'}
                        </span>
                      </dd>
                    </div>
                    <div>
                      <dt className="text-sm text-gray-500">Total Joined</dt>
                      <dd className="text-sm font-medium">{tour.totalJoined || 0} travelers</dd>
                    </div>
                  </dl>
                )}
              </div>

              {/* Categories */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Categories</h3>
                {isEditing && editMode === 'form' ? (
                  <input
                    type="text"
                    value={formData.categories}
                    onChange={(e) => handleInputChange('categories', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md"
                    placeholder="Enter categories separated by commas"
                  />
                ) : (
                  <div className="flex flex-wrap gap-2">
                    {categories.map((category: string, index: number) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                      >
                        {category}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Metadata</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-gray-500">Created</dt>
                    <dd className="text-sm font-medium">
                      {new Date(tour.createdAt).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Last Updated</dt>
                    <dd className="text-sm font-medium">
                      {new Date(tour.updatedAt).toLocaleDateString()}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Tour ID</dt>
                    <dd className="text-xs font-mono text-gray-600">{tour.id}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}