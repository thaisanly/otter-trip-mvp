'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  EditIcon,
  SaveIcon,
  XIcon,
  TrashIcon,
  LoaderIcon,
  CodeIcon,
  FileTextIcon,
  EyeIcon,
  ImageIcon,
  TagIcon,
  HashIcon,
  ToggleLeftIcon,
  ToggleRightIcon,
} from 'lucide-react';
import CategoryImage from './CategoryImage';

interface CategoryDetailAdminProps {
  category: any;
  admin: any;
}

export default function CategoryDetailAdmin({ category, admin }: CategoryDetailAdminProps) {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  const [editMode, setEditMode] = useState<'form' | 'json'>('form');
  const [isSaving, setIsSaving] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [jsonError, setJsonError] = useState<string>('');
  const [showPreview, setShowPreview] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  
  // Initialize form data with category data
  const [formData, setFormData] = useState({
    id: category.id,
    name: category.name,
    description: category.description,
    coverImage: category.coverImage,
    icon: category.icon || '',
    interests: Array.isArray(category.interests) ? category.interests.join(', ') : '',
    isActive: category.isActive,
    displayOrder: category.displayOrder,
  });

  // JSON data for JSON mode
  const [jsonData, setJsonData] = useState<string>('');

  // Convert form data to JSON format for API
  const formDataToJson = () => {
    return {
      id: formData.id,
      name: formData.name,
      description: formData.description,
      coverImage: formData.coverImage,
      icon: formData.icon || undefined,
      interests: formData.interests.split(',').map(interest => interest.trim()).filter(interest => interest),
      isActive: formData.isActive,
      displayOrder: formData.displayOrder,
    };
  };

  // Initialize JSON data when switching to JSON mode
  const initializeJsonData = () => {
    const jsonObj = formDataToJson();
    setJsonData(JSON.stringify(jsonObj, null, 2));
  };

  const handleDelete = async () => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        router.push('/admin/categories');
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const validateJson = (jsonString: string): { valid: boolean; data?: any; error?: string } => {
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
      
      // Validate arrays
      if (data.interests && !Array.isArray(data.interests)) {
        return { valid: false, error: 'Interests must be an array' };
      }
      
      return { valid: true, data };
    } catch (error) {
      return { valid: false, error: 'Invalid JSON format' };
    }
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrors({});
    setJsonError('');

    try {
      let dataToSave;

      if (editMode === 'json') {
        const validation = validateJson(jsonData);
        if (!validation.valid) {
          setJsonError(validation.error || 'Invalid JSON');
          setIsSaving(false);
          return;
        }
        dataToSave = validation.data;
      } else {
        // Form validation
        const newErrors: Record<string, string> = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.description.trim()) newErrors.description = 'Description is required';
        if (!formData.coverImage.trim()) newErrors.coverImage = 'Cover image is required';

        if (Object.keys(newErrors).length > 0) {
          setErrors(newErrors);
          setIsSaving(false);
          return;
        }

        dataToSave = formDataToJson();
      }

      const response = await fetch(`/api/admin/categories/${category.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dataToSave),
      });

      if (response.ok) {
        const updatedCategory = await response.json();
        setIsEditing(false);
        window.location.reload(); // Refresh to show updated data
      } else {
        const error = await response.json();
        if (editMode === 'json') {
          setJsonError(error.error || 'Failed to save category');
        } else {
          alert(error.error || 'Failed to save category');
        }
      }
    } catch (error) {
      console.error('Error saving category:', error);
      if (editMode === 'json') {
        setJsonError('Failed to save category');
      } else {
        alert('Failed to save category');
      }
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditMode('form');
    setErrors({});
    setJsonError('');
    setFormData({
      id: category.id,
      name: category.name,
      description: category.description,
      coverImage: category.coverImage,
      icon: category.icon || '',
      interests: Array.isArray(category.interests) ? category.interests.join(', ') : '',
      isActive: category.isActive,
      displayOrder: category.displayOrder,
    });
    setJsonData('');
  };

  const handleEditModeChange = (mode: 'form' | 'json') => {
    if (mode === 'json' && editMode === 'form') {
      initializeJsonData();
    }
    setEditMode(mode);
    setErrors({});
    setJsonError('');
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const showPreviewModal = () => {
    let dataToPreview;
    if (editMode === 'json') {
      const validation = validateJson(jsonData);
      if (!validation.valid) {
        setJsonError(validation.error || 'Invalid JSON');
        return;
      }
      dataToPreview = validation.data;
    } else {
      dataToPreview = formDataToJson();
    }
    
    setPreviewData(dataToPreview);
    setShowPreview(true);
  };

  // Parse interests and other arrays for display
  const interests = Array.isArray(category.interests) ? category.interests : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => router.push('/admin/categories')}
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Categories
            </button>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-500">Slug: /{category.id}</span>
          </div>
          <div className="flex items-center space-x-3">
            {!isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(true)}
                  className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  <EditIcon className="w-4 h-4 mr-2" />
                  Edit Category
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
                  onClick={showPreviewModal}
                  className="flex items-center px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <EyeIcon className="w-4 h-4 mr-2" />
                  Preview
                </button>
                <button
                  onClick={handleSave}
                  disabled={isSaving}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                >
                  {isSaving ? <LoaderIcon className="w-4 h-4 mr-2 animate-spin" /> : <SaveIcon className="w-4 h-4 mr-2" />}
                  Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  <XIcon className="w-4 h-4 mr-2" />
                  Cancel
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
                Edit Category JSON
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
                placeholder="Enter category data in JSON format"
              />
              <button
                type="button"
                onClick={() => {
                  try {
                    const formatted = JSON.stringify(JSON.parse(jsonData), null, 2);
                    setJsonData(formatted);
                    setJsonError('');
                  } catch (error) {
                    setJsonError('Invalid JSON format');
                  }
                }}
                className="mt-2 text-sm text-blue-600 hover:text-blue-800"
              >
                Format JSON
              </button>
            </div>

            {/* Right Column - Help & Tips */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="text-lg font-semibold mb-4">JSON Structure</h3>
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
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="px-6 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Main Content (2/3 width) */}
            <div className="lg:col-span-2 space-y-6">
              {/* Hero Section - Similar to Tours */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="relative h-64">
                  {isEditing && editMode === 'form' ? (
                    <div className="p-6 h-full flex flex-col">
                      <label className="block text-sm font-medium text-gray-700 mb-2">Cover Image URL *</label>
                      <input
                        type="url"
                        value={formData.coverImage}
                        onChange={(e) => handleInputChange('coverImage', e.target.value)}
                        className={`w-full px-3 py-2 border rounded-md mb-4 ${errors.coverImage ? 'border-red-300' : 'border-gray-300'}`}
                        placeholder="https://example.com/image.jpg"
                      />
                      {errors.coverImage && <p className="mb-2 text-sm text-red-600">{errors.coverImage}</p>}
                      <CategoryImage
                        src={formData.coverImage || undefined}
                        alt={formData.name}
                        fallbackText={formData.name}
                      />
                    </div>
                  ) : (
                    <>
                      <CategoryImage
                        src={category.coverImage || undefined}
                        alt={category.name}
                        fallbackText={category.name}
                      />
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6">
                        <div className="flex items-center space-x-4">
                          {category.icon && (
                            <span className="text-4xl">{category.icon}</span>
                          )}
                          <div>
                            <h1 className="text-3xl font-bold text-white">{category.name}</h1>
                            <div className="flex items-center space-x-4 text-white/90">
                              <span className="flex items-center">
                                <HashIcon className="w-4 h-4 mr-1" />
                                /{category.id}
                              </span>
                              <span className="flex items-center">
                                <TagIcon className="w-4 h-4 mr-1" />
                                Order #{category.displayOrder}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </>
                  )}
                </div>
                {isEditing && editMode === 'form' && (
                  <div className="p-6 border-t">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category Name *</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className={`w-full px-3 py-2 border rounded-md ${errors.name ? 'border-red-300' : 'border-gray-300'}`}
                          placeholder="e.g., Adventure Tours"
                        />
                        {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Icon (Emoji)</label>
                        <input
                          type="text"
                          value={formData.icon}
                          onChange={(e) => handleInputChange('icon', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          placeholder="🏔️"
                          maxLength={10}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Slug (ID) - Cannot be changed</label>
                        <input
                          type="text"
                          value={formData.id}
                          disabled
                          className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Display Order</label>
                        <input
                          type="number"
                          value={formData.displayOrder}
                          onChange={(e) => handleInputChange('displayOrder', parseInt(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md"
                          min="0"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Description Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Description</h2>
                {isEditing && editMode === 'form' ? (
                  <div>
                    <textarea
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      rows={4}
                      className={`w-full px-3 py-2 border rounded-md ${errors.description ? 'border-red-300' : 'border-gray-300'}`}
                      placeholder="Describe this category..."
                    />
                    {errors.description && <p className="mt-1 text-sm text-red-600">{errors.description}</p>}
                  </div>
                ) : (
                  <p className="text-gray-600">{category.description}</p>
                )}
              </div>

              {/* Interests Section */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h2 className="text-xl font-semibold mb-4">Interest Tags</h2>
                {isEditing && editMode === 'form' ? (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Interests (comma-separated)</label>
                    <input
                      type="text"
                      value={formData.interests}
                      onChange={(e) => handleInputChange('interests', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md"
                      placeholder="hiking, climbing, outdoor activities"
                    />
                  </div>
                ) : (
                  <>
                    {interests.length > 0 ? (
                      <div className="flex flex-wrap gap-2">
                        {interests.map((interest: string, index: number) => (
                          <span
                            key={index}
                            className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-lg"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <p className="text-gray-500">No interests defined for this category.</p>
                    )}
                  </>
                )}
              </div>

              {/* Status Section */}
              {isEditing && editMode === 'form' && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                  <h2 className="text-xl font-semibold mb-4">Status</h2>
                  <button
                    type="button"
                    onClick={() => handleInputChange('isActive', !formData.isActive)}
                    className={`flex items-center px-4 py-3 rounded-md border transition-colors ${
                      formData.isActive
                        ? 'bg-green-50 border-green-300 text-green-800'
                        : 'bg-gray-50 border-gray-300 text-gray-800'
                    }`}
                  >
                    {formData.isActive ? (
                      <ToggleRightIcon className="w-5 h-5 mr-3" />
                    ) : (
                      <ToggleLeftIcon className="w-5 h-5 mr-3" />
                    )}
                    <div>
                      <div className="font-medium">
                        {formData.isActive ? 'Active' : 'Inactive'}
                      </div>
                      <div className="text-sm opacity-75">
                        {formData.isActive 
                          ? 'Category is visible to users' 
                          : 'Category is hidden from users'
                        }
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            {/* Sidebar (1/3 width) */}
            <div className="space-y-6">
              {/* Category Information */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Category Information</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-gray-500">Category ID</dt>
                    <dd className="text-sm font-medium">{category.id}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Display Order</dt>
                    <dd className="text-sm font-medium">#{category.displayOrder}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Status</dt>
                    <dd>
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                        category.isActive 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {category.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Interest Count</dt>
                    <dd className="text-sm font-medium">{interests.length} tags</dd>
                  </div>
                </dl>
              </div>

              {/* Metadata */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <h3 className="text-lg font-semibold mb-4">Metadata</h3>
                <dl className="space-y-3">
                  <div>
                    <dt className="text-sm text-gray-500">Created</dt>
                    <dd className="text-sm font-medium">
                      {new Date(category.createdAt).toLocaleDateString('en-US', {
                        month: 'numeric',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Last Updated</dt>
                    <dd className="text-sm font-medium">
                      {new Date(category.updatedAt).toLocaleDateString('en-US', {
                        month: 'numeric',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-gray-500">Category ID</dt>
                    <dd className="text-sm font-medium">{category.id}</dd>
                  </div>
                </dl>
              </div>
            </div>
          </div>
        </div>
      )}

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
                    <CategoryImage
                      src={previewData.coverImage}
                      alt={previewData.name}
                      fallbackText={previewData.name}
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
                    <p className="text-xs text-gray-500 mb-3">/{previewData.id}</p>
                    {previewData.interests && previewData.interests.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {previewData.interests.slice(0, 3).map((interest: string, index: number) => (
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
}