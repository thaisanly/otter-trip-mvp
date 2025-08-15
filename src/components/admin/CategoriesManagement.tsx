'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import {
  PlusIcon,
  TrashIcon,
  EditIcon,
  RefreshCwIcon,
  SearchIcon,
  TagIcon,
  ImageIcon,
} from 'lucide-react';
import CategoryImage from './CategoryImage';

interface Category {
  id: string;
  name: string;
  description: string;
  coverImage: string;
  icon?: string;
  interests?: string[];
  isActive: boolean;
  displayOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface CategoriesManagementProps {
  admin: any;
}

export default function CategoriesManagement({ admin }: CategoriesManagementProps) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [filteredCategories, setFilteredCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    filterCategories();
  }, [searchQuery, categories]);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/categories');
      if (!response.ok) throw new Error('Failed to fetch categories');
      const data = await response.json();
      setCategories(data);
      setFilteredCategories(data);
    } catch (error) {
      console.error('Error fetching categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const filterCategories = () => {
    if (!searchQuery.trim()) {
      setFilteredCategories(categories);
      return;
    }

    const query = searchQuery.toLowerCase();
    const filtered = categories.filter((category) => {
      return (
        category.name.toLowerCase().includes(query) ||
        category.id.toLowerCase().includes(query) ||
        category.description.toLowerCase().includes(query) ||
        category.interests?.some((interest: string) => interest.toLowerCase().includes(query))
      );
    });
    setFilteredCategories(filtered);
  };

  const handleDelete = async (categoryId: string) => {
    if (!window.confirm('Are you sure you want to delete this category?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCategories();
      } else {
        const error = await response.json();
        alert(error.message || 'Failed to delete category');
      }
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Failed to delete category');
    }
  };

  const toggleStatus = async (categoryId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/categories/${categoryId}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive: !isActive }),
      });

      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error('Error updating category status:', error);
    }
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Categories Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage tour categories and their settings
              </p>
            </div>
            <button
              onClick={() => router.push('/admin/categories/new')}
              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon size={16} className="mr-2" />
              Add Category
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search by name, slug, description, or interests..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Categories Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">All Categories ({filteredCategories.length})</h2>
            <button
              onClick={fetchCategories}
              className="inline-flex items-center px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <RefreshCwIcon size={14} className="mr-1" />
              Refresh
            </button>
          </div>
        </div>

        {loading ? (
          <div className="px-6 py-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
            <p className="mt-4 text-gray-500">Loading categories...</p>
          </div>
        ) : filteredCategories.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <TagIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No categories found</p>
            <button
              onClick={() => router.push('/admin/categories/new')}
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
            >
              <PlusIcon size={16} className="mr-2" />
              Create First Category
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Slug
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Order
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Interests
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredCategories.map((category) => (
                  <tr 
                    key={category.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/admin/categories/${category.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 w-12 h-12 mr-4">
                          <div className="w-12 h-12 rounded-lg overflow-hidden">
                            <CategoryImage
                              src={category.coverImage || undefined}
                              alt={category.name}
                              fallbackText={category.name}
                            />
                          </div>
                        </div>
                        <div>
                          <div className="flex items-center">
                            {category.icon && (
                              <span className="mr-2 text-lg">{category.icon}</span>
                            )}
                            <div className="text-sm font-medium text-gray-900">{category.name}</div>
                          </div>
                          <div className="text-xs text-gray-500 max-w-xs truncate">
                            {category.description}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <code className="text-sm text-gray-600 bg-gray-100 px-2 py-1 rounded">
                        /{category.id}
                      </code>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStatus(category.id, category.isActive);
                        }}
                        className={`inline-flex px-2 py-1 text-xs font-medium rounded-full transition-colors ${
                          category.isActive 
                            ? 'bg-green-100 text-green-800 hover:bg-green-200' 
                            : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                        }`}
                      >
                        {category.isActive ? 'Active' : 'Inactive'}
                      </button>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">#{category.displayOrder}</span>
                    </td>
                    <td className="px-6 py-4">
                      {category.interests && Array.isArray(category.interests) && category.interests.length > 0 ? (
                        <div className="flex flex-wrap gap-1 max-w-xs">
                          {(category.interests as string[]).slice(0, 2).map((interest, index) => (
                            <span
                              key={index}
                              className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-lg"
                            >
                              {interest}
                            </span>
                          ))}
                          {(category.interests as string[]).length > 2 && (
                            <span className="px-2 py-1 bg-gray-100 text-gray-600 text-xs rounded-lg">
                              +{(category.interests as string[]).length - 2}
                            </span>
                          )}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">None</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleDelete(category.id);
                        }}
                        className="text-red-600 hover:text-red-900"
                        title="Delete"
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