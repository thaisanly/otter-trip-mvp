'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeftIcon, SaveIcon, FileTextIcon, CodeIcon, LoaderIcon, EyeIcon, XIcon } from 'lucide-react';
import Image from 'next/image';

interface CategoryFormData {
  id: string; // ID is now the slug
  name: string;
  description: string;
  coverImage: string;
  icon: string;
  interests: string;
  isActive: boolean;
  displayOrder: number;
}

interface CategoryFormProps {
  initialData?: CategoryFormData;
  isNew?: boolean;
  categoryId?: string;
}

const CategoryForm: React.FC<CategoryFormProps> = ({ 
  initialData = {
    id: '',
    name: '',
    description: '',
    coverImage: '',
    icon: '',
    interests: '',
    isActive: true,
    displayOrder: 0,
  },
  isNew = true,
  categoryId
}) => {
  const router = useRouter();
  const [formData, setFormData] = useState<CategoryFormData>(initialData);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // JSON mode states
  const [createMode, setCreateMode] = useState<'form' | 'json'>('form');
  const [jsonData, setJsonData] = useState<string>('');
  const [jsonError, setJsonError] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<CategoryFormData | null>(null);

  // Helper function to convert name to slug
  const generateSlug = (name: string): string => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .replace(/-+/g, '-') // Replace multiple hyphens with single
      .replace(/^-|-$/g, ''); // Remove leading/trailing hyphens
  };

  // JSON helper functions
  const getDefaultJsonTemplate = (): string => {
    return JSON.stringify({
      name: "Category Name",
      description: "Category description goes here...",
      coverImage: "https://example.com/image.jpg",
      icon: "🏔️",
      interests: ["Interest 1", "Interest 2", "Interest 3"],
      isActive: true,
      displayOrder: 0
    }, null, 2);
  };

  const initializeJsonData = () => {
    const categoryData = {
      id: formData.id,
      name: formData.name,
      description: formData.description,
      coverImage: formData.coverImage,
      icon: formData.icon || undefined,
      interests: formData.interests.split(',').map(i => i.trim()).filter(i => i),
      isActive: formData.isActive,
      displayOrder: formData.displayOrder,
    };
    setJsonData(JSON.stringify(categoryData, null, 2));
  };

  const validateJson = (jsonString: string): { valid: boolean; data?: CategoryFormData; error?: string } => {
    try {
      const data = JSON.parse(jsonString);
      
      // Validate required fields
      if (!data.name || typeof data.name !== 'string') {
        return { valid: false, error: 'Name is required and must be a string' };
      }
      if (!data.description || typeof data.description !== 'string') {
        return { valid: false, error: 'Description is required and must be a string' };
      }
      if (!data.coverImage || typeof data.coverImage !== 'string') {
        return { valid: false, error: 'Cover image is required and must be a string' };
      }
      
      // Auto-generate slug for new categories
      if (isNew && !data.id) {
        data.id = generateSlug(data.name);
      }
      
      // Validate optional fields
      if (data.interests && !Array.isArray(data.interests)) {
        return { valid: false, error: 'Interests must be an array' };
      }
      
      return { valid: true, data };
    } catch {
      return { valid: false, error: 'Invalid JSON format' };
    }
  };

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
    setError(null);
  };

  const showPreviewModal = () => {
    let dataToPreview;
    if (createMode === 'json') {
      const validation = validateJson(jsonData);
      if (!validation.valid) {
        setJsonError(validation.error || 'Invalid JSON');
        return;
      }
      dataToPreview = validation.data;
    } else {
      dataToPreview = {
        id: formData.id,
        name: formData.name,
        description: formData.description,
        coverImage: formData.coverImage,
        icon: formData.icon,
        interests: formData.interests.split(',').map(i => i.trim()).filter(i => i),
        isActive: formData.isActive,
        displayOrder: formData.displayOrder,
      };
    }
    
    if (dataToPreview) {
      setPreviewData(dataToPreview as CategoryFormData);
      setShowPreview(true);
    }
  };

  const handleInputChange = (field: keyof CategoryFormData, value: string | number | boolean) => {
    const newData = {
      ...formData,
      [field]: value
    };
    
    // Auto-generate slug when name changes (only for new categories)
    if (field === 'name' && isNew && typeof value === 'string') {
      newData.id = generateSlug(value);
    }
    
    setFormData(newData);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);
    setJsonError('');

    try {
      let payload;

      if (createMode === 'json') {
        const validation = validateJson(jsonData);
        if (!validation.valid) {
          setJsonError(validation.error || 'Invalid JSON');
          setIsSubmitting(false);
          return;
        }
        payload = validation.data;
      } else {
        // Transform form data
        payload = {
          ...formData,
          interests: formData.interests
            .split(',')
            .map(i => i.trim())
            .filter(i => i.length > 0),
          displayOrder: parseInt(formData.displayOrder.toString())
        };
      }

      const response = await fetch(
        isNew 
          ? '/api/admin/categories' 
          : `/api/admin/categories/${categoryId}`,
        {
          method: isNew ? 'POST' : 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload),
        }
      );

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to save category');
      }

      const savedCategory = await response.json();
      router.push(`/admin/categories/${savedCategory.id}`);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'An error occurred';
      if (createMode === 'json') {
        setJsonError(errorMessage);
      } else {
        setError(errorMessage);
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              type="button"
              onClick={() => router.back()}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back
            </button>
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {isNew ? 'Create New Category' : 'Edit Category'}
              </h1>
              <p className="text-sm text-gray-600">
                {isNew ? 'Add a new tour category to your catalog' : 'Update category information'}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            {/* Mode Toggle */}
            <div className="flex items-center space-x-2 mr-4">
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
            {createMode === 'json' && (
              <button
                type="button"
                onClick={showPreviewModal}
                className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                <EyeIcon className="w-4 h-4 mr-2" />
                Preview
              </button>
            )}
            <button
              type="button"
              onClick={() => router.back()}
              className="px-6 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="category-form"
              disabled={isSubmitting}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isSubmitting ? <LoaderIcon className="w-4 h-4 mr-2 animate-spin" /> : <SaveIcon className="w-4 h-4 mr-2" />}
              {isSubmitting ? 'Saving...' : (isNew ? 'Create Category' : 'Update Category')}
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="px-6 py-8">
        {createMode === 'json' ? (
          // JSON Mode - Two Column Layout
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column - JSON Editor (2/3 width) */}
            <div className="lg:col-span-2 bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <CodeIcon className="mr-2" size={20} />
                {isNew ? 'Create Category with JSON' : 'Edit Category JSON'}
              </h2>
              {jsonError && (
                <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md">
                  <p className="text-sm text-red-600">{jsonError}</p>
                </div>
              )}
              <textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                className="w-full h-[calc(100vh-350px)] min-h-[500px] px-3 py-2 border border-gray-300 rounded-md font-mono text-sm resize-none"
                placeholder="Enter category data in JSON format"
              />
              <button
                type="button"
                onClick={() => {
                  try {
                    const formatted = JSON.stringify(JSON.parse(jsonData), null, 2);
                    setJsonData(formatted);
                    setJsonError('');
                  } catch {
                    setJsonError('Invalid JSON format');
                  }
                }}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Format JSON
              </button>
            </div>

            {/* Right Column - Help & Tips */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">JSON Structure</h3>
              <div className="space-y-4 text-sm">
                <div>
                  <h4 className="font-medium text-gray-900">Required Fields</h4>
                  <ul className="mt-1 text-gray-600 space-y-1">
                    <li>• <code>name</code> - Category display name</li>
                    <li>• <code>description</code> - Category description</li>
                    <li>• <code>coverImage</code> - Cover image URL</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Optional Fields</h4>
                  <ul className="mt-1 text-gray-600 space-y-1">
                    <li>• <code>icon</code> - Emoji or icon</li>
                    <li>• <code>interests</code> - Array of interest tags</li>
                    <li>• <code>isActive</code> - Boolean (true/false)</li>
                    <li>• <code>displayOrder</code> - Number for ordering</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Example</h4>
                  <pre className="mt-2 text-xs text-gray-600 bg-gray-50 p-2 rounded overflow-x-auto">
{`{
  "name": "Adventure Tours",
  "description": "Thrilling adventures...",
  "coverImage": "https://...",
  "icon": "🏔️",
  "interests": ["Hiking", "Climbing"],
  "isActive": true,
  "displayOrder": 0
}`}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Form Mode
          <form id="category-form" onSubmit={handleSubmit}>
            {error && (
              <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
                {error}
              </div>
            )}

            {/* Form Fields */}
            <div className="bg-white shadow rounded-lg p-6 space-y-6">
        {/* Basic Information */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Basic Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Category Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Adventure Tours"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Slug (Auto-generated) *
              </label>
              <input
                type="text"
                value={formData.id}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-100 text-gray-600"
                placeholder="adventure-tours"
                readOnly
                disabled
              />
              <p className="mt-1 text-xs text-gray-500">
                {isNew ? 'Auto-generated from category name' : 'ID cannot be changed after creation'}
              </p>
            </div>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Description *
          </label>
          <textarea
            value={formData.description}
            onChange={(e) => handleInputChange('description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Push your limits with thrilling expeditions..."
            required
          />
        </div>

        {/* Cover Image */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Cover Image URL *
          </label>
          <input
            type="url"
            value={formData.coverImage}
            onChange={(e) => handleInputChange('coverImage', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="https://example.com/image.jpg"
            required
          />
          {formData.coverImage && (
            <div className="mt-3">
              <Image
                src={formData.coverImage}
                alt="Cover preview"
                className="w-full h-48 object-cover rounded-lg border border-gray-200"
                width={600}
                height={192}
                onError={(e) => {
                  e.currentTarget.src = `https://via.placeholder.com/600x300/CBD5E1/64748B?text=Invalid+Image`;
                }}
              />
            </div>
          )}
        </div>

        {/* Additional Settings */}
        <div>
          <h2 className="text-lg font-medium text-gray-900 mb-4">Additional Settings</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Icon (Emoji or URL)
              </label>
              <input
                type="text"
                value={formData.icon}
                onChange={(e) => handleInputChange('icon', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="🏔️ or https://example.com/icon.svg"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Display Order
              </label>
              <input
                type="number"
                value={formData.displayOrder}
                onChange={(e) => handleInputChange('displayOrder', parseInt(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                min="0"
              />
              <p className="mt-1 text-xs text-gray-500">Lower numbers appear first</p>
            </div>
          </div>
        </div>

        {/* Interests */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Interest Tags
          </label>
          <textarea
            value={formData.interests}
            onChange={(e) => handleInputChange('interests', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Hiking, Rock Climbing, Water Sports, Extreme Sports"
          />
          <p className="mt-1 text-xs text-gray-500">Comma-separated list of interests</p>
        </div>

        {/* Status */}
        <div>
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) => handleInputChange('isActive', e.target.checked)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <span className="text-sm font-medium text-gray-700">Active</span>
          </label>
          <p className="mt-1 text-xs text-gray-500 ml-6">
            Inactive categories won&apos;t be shown on the website
          </p>
        </div>
      </div>
          </form>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && previewData && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold">Category Preview</h3>
              <button
                onClick={() => setShowPreview(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            
            <div className="p-6">
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="bg-white rounded-xl shadow-sm overflow-hidden max-w-sm mx-auto">
                  <div className="relative h-48">
                    <Image
                      src={previewData.coverImage}
                      alt={previewData.name}
                      className="w-full h-full object-cover"
                      fill
                      onError={(e) => {
                        e.currentTarget.src = `https://via.placeholder.com/400x300/CBD5E1/64748B?text=${encodeURIComponent(previewData.name)}`;
                      }}
                    />
                    {previewData.icon && (
                      <div className="absolute top-2 left-2">
                        <span className="px-2 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-lg">
                          {previewData.icon}
                        </span>
                      </div>
                    )}
                    <div className="absolute top-2 right-2">
                      <span className={`px-2 py-1 rounded-lg text-xs font-medium ${
                        previewData.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {previewData.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2">{previewData.name}</h4>
                    <p className="text-sm text-gray-600 mb-3">{previewData.description}</p>
                    <p className="text-xs text-gray-500 mb-3">/{previewData.id || generateSlug(previewData.name)}</p>
                    {previewData.interests && previewData.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {previewData.interests.split(',').map(interest => interest.trim()).filter(Boolean).slice(0, 3).map((interest: string, index: number) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg"
                          >
                            {interest}
                          </span>
                        ))}
                        {previewData.interests.length > 3 && (
                          <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                            +{previewData.interests.length - 3}
                          </span>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryForm;