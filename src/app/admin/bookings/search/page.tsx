'use client';

import { useState } from 'react';
import { Search, Filter } from 'lucide-react';
import BookingLayout from '@/components/admin/booking/BookingLayout';
import { BookingSearchFilters, BookingStatus } from '@/types';

export default function BookingAdvancedSearchPage() {
  const [filters, setFilters] = useState<BookingSearchFilters>({
    sortBy: 'createdAt',
    sortOrder: 'desc'
  });

  const handleSearch = () => {
    // Build query parameters and redirect to main bookings page
    const params = new URLSearchParams();
    
    if (filters.status) params.append('status', filters.status);
    if (filters.location) params.append('location', filters.location);
    if (filters.tourTitle) params.append('tourTitle', filters.tourTitle);
    if (filters.bookingReference) params.append('reference', filters.bookingReference);
    if (filters.sortBy) params.append('sortBy', filters.sortBy);
    if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
    if (filters.dateRange?.start) params.append('dateStart', filters.dateRange.start);
    if (filters.dateRange?.end) params.append('dateEnd', filters.dateRange.end);
    
    window.location.href = `/admin/bookings?${params.toString()}`;
  };

  const clearFilters = () => {
    setFilters({
      sortBy: 'createdAt',
      sortOrder: 'desc'
    });
  };

  return (
    <BookingLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Advanced Search</h1>
          <p className="text-gray-600">
            Use advanced filters to find specific bookings
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Booking Reference */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Reference
              </label>
              <input
                type="text"
                placeholder="e.g., BK-2024-001"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.bookingReference || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  bookingReference: e.target.value || undefined
                })}
              />
            </div>

            {/* Tour Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tour Title
              </label>
              <input
                type="text"
                placeholder="Search tour names"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.tourTitle || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  tourTitle: e.target.value || undefined
                })}
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Location
              </label>
              <input
                type="text"
                placeholder="Search locations"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.location || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  location: e.target.value || undefined
                })}
              />
            </div>

            {/* Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Booking Status
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.status || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  status: e.target.value as BookingStatus || undefined
                })}
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
                <option value="refunded">Refunded</option>
              </select>
            </div>

            {/* Date Range Start */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tour Date From
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.dateRange?.start || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: {
                    ...filters.dateRange,
                    start: e.target.value || '',
                    end: filters.dateRange?.end || ''
                  }
                })}
              />
            </div>

            {/* Date Range End */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tour Date To
              </label>
              <input
                type="date"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.dateRange?.end || ''}
                onChange={(e) => setFilters({
                  ...filters,
                  dateRange: {
                    start: filters.dateRange?.start || '',
                    end: e.target.value || ''
                  }
                })}
              />
            </div>

            {/* Sort By */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort By
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.sortBy || 'createdAt'}
                onChange={(e) => setFilters({
                  ...filters,
                  sortBy: e.target.value as 'createdAt' | 'selectedDate' | 'totalPrice'
                })}
              >
                <option value="createdAt">Date Created</option>
                <option value="selectedDate">Tour Date</option>
                <option value="totalPrice">Price</option>
              </select>
            </div>

            {/* Sort Order */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sort Order
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filters.sortOrder || 'desc'}
                onChange={(e) => setFilters({
                  ...filters,
                  sortOrder: e.target.value as 'asc' | 'desc'
                })}
              >
                <option value="desc">Newest First</option>
                <option value="asc">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 mt-8 pt-6 border-t border-gray-200">
            <button
              onClick={handleSearch}
              className="flex items-center justify-center px-6 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors"
            >
              <Search className="w-4 h-4 mr-2" />
              Search Bookings
            </button>
            
            <button
              onClick={clearFilters}
              className="flex items-center justify-center px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors"
            >
              <Filter className="w-4 h-4 mr-2" />
              Clear Filters
            </button>
          </div>

          {/* Search Tips */}
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Search Tips</h3>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Use booking reference for exact matches (e.g., BK-2024-001)</li>
              <li>• Tour title and location searches are case-insensitive</li>
              <li>• Date range filters apply to the tour date, not booking date</li>
              <li>• Combine multiple filters for more precise results</li>
            </ul>
          </div>
        </div>
      </div>
    </BookingLayout>
  );
}