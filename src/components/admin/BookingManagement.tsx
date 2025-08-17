'use client';

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  SearchIcon,
  RefreshCwIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  DollarSignIcon,
  FilterIcon,
  ChevronDownIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
} from 'lucide-react';
import { Booking, BookingStatus } from '@/types';


const statusConfig = {
  pending: {
    label: 'Pending',
    color: 'bg-yellow-100 text-yellow-800',
    icon: ClockIcon,
  },
  confirmed: {
    label: 'Confirmed',
    color: 'bg-green-100 text-green-800',
    icon: CheckCircleIcon,
  },
  completed: {
    label: 'Completed',
    color: 'bg-blue-100 text-blue-800',
    icon: CheckCircleIcon,
  },
  cancelled: {
    label: 'Cancelled',
    color: 'bg-red-100 text-red-800',
    icon: XCircleIcon,
  },
  refunded: {
    label: 'Refunded',
    color: 'bg-gray-100 text-gray-800',
    icon: AlertCircleIcon,
  },
};

export default function BookingManagement(): React.ReactElement {
  const router = useRouter();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [filteredBookings, setFilteredBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<BookingStatus | ''>('');
  const [showFilters, setShowFilters] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const filterBookings = useCallback(() => {
    let filtered = [...bookings];

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter((booking) => {
        return (
          booking.bookingReference.toLowerCase().includes(query) ||
          booking.tourTitle.toLowerCase().includes(query) ||
          booking.location?.toLowerCase().includes(query) ||
          booking.tourLocation?.toLowerCase().includes(query) ||
          booking.leadTraveler.firstName.toLowerCase().includes(query) ||
          booking.leadTraveler.lastName.toLowerCase().includes(query) ||
          booking.leadTraveler.email.toLowerCase().includes(query)
        );
      });
    }

    // Apply status filter
    if (statusFilter) {
      filtered = filtered.filter((booking) => booking.status === statusFilter);
    }

    setFilteredBookings(filtered);
  }, [searchQuery, statusFilter, bookings]);

  useEffect(() => {
    filterBookings();
  }, [filterBookings]);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/bookings?limit=1000');
      if (!response.ok) throw new Error('Failed to fetch bookings');
      const data = await response.json();
      setBookings(data.bookings || []);
      setFilteredBookings(data.bookings || []);
    } catch (error) {
      console.error('Error fetching bookings:', error);
      setBookings([]);
      setFilteredBookings([]);
    } finally {
      setLoading(false);
    }
  };


  const formatDate = (dateString: string) => {
    if (!dateString) return 'Not set';
    
    try {
      // First, try parsing as is
      let date = new Date(dateString);
      
      // If invalid, try different formats
      if (isNaN(date.getTime())) {
        // Try replacing dashes with slashes for better compatibility
        const normalizedDate = dateString.replace(/-/g, '/');
        date = new Date(normalizedDate);
        
        // If still invalid, try parsing as ISO string
        if (isNaN(date.getTime())) {
          // Handle formats like "2024-12-25" or "25/12/2024"
          const parts = dateString.split(/[-/]/);
          if (parts.length === 3) {
            // Assume YYYY-MM-DD or DD/MM/YYYY format
            if (parts[0].length === 4) {
              // YYYY-MM-DD format
              date = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
            } else if (parts[2].length === 4) {
              // DD/MM/YYYY format
              date = new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
            }
          }
        }
      }
      
      // Final check if date is valid
      if (isNaN(date.getTime())) {
        // If it's already a formatted string, return it as is
        if (dateString.match(/\w+ \d+, \d{4}/)) {
          return dateString;
        }
        return dateString; // Return original string if we can't parse it
      }
      
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch (error) {
      console.error('Error formatting date:', error, 'for dateString:', dateString);
      return dateString; // Return original string on error
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  const getStatusDisplay = (status: BookingStatus) => {
    const config = statusConfig[status];
    const Icon = config.icon;
    
    return (
      <span className={`inline-flex items-center px-2 py-1 text-xs rounded-full ${config.color}`}>
        <Icon className="w-3 h-3 mr-1" />
        {config.label}
      </span>
    );
  };

  return (
    <div className="p-6">
      {/* Header */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Booking Management</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage tour bookings and customer information
              </p>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="px-6 py-4">
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1 relative">
              <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                ref={searchInputRef}
                type="text"
                placeholder="Search by booking reference, tour title, location, or customer name..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Filter Button */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
            >
              <FilterIcon size={16} className="mr-2" />
              Filters
              <ChevronDownIcon 
                size={16} 
                className={`ml-2 transition-transform ${showFilters ? 'rotate-180' : ''}`} 
              />
            </button>
          </div>

          {/* Expanded Filters */}
          {showFilters && (
            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Status
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => setStatusFilter(e.target.value as BookingStatus | '')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  >
                    <option value="">All Statuses</option>
                    <option value="pending">Pending</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                    <option value="refunded">Refunded</option>
                  </select>
                </div>
                
                <div className="flex items-end">
                  <button
                    onClick={() => {
                      setSearchQuery('');
                      setStatusFilter('');
                    }}
                    className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
                  >
                    Clear Filters
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Bookings Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium text-gray-900">
              All Bookings ({filteredBookings.length})
            </h2>
            <button
              onClick={fetchBookings}
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
            <p className="mt-4 text-gray-500">Loading bookings...</p>
          </div>
        ) : filteredBookings.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <CalendarIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">
              {bookings.length === 0 ? 'No bookings found' : 'No bookings match your search criteria'}
            </p>
            {searchQuery || statusFilter ? (
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('');
                }}
                className="mt-4 text-blue-600 hover:text-blue-800"
              >
                Clear filters to see all bookings
              </button>
            ) : null}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Reference
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour & Location
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Leader
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tour Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Participants & Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Date
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredBookings.map((booking) => (
                  <tr 
                    key={booking.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/admin/bookings/${booking.bookingReference}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.bookingReference}
                      </div>
                      <div className="text-xs text-gray-500">
                        ID: {booking.id.slice(-8)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="text-sm font-medium text-gray-900">
                        {booking.tourTitle}
                      </div>
                      {(booking.tourLocation || booking.location) && (
                        <div className="flex items-center text-xs text-gray-500 mt-1">
                          <MapPinIcon className="w-3 h-3 mr-1" />
                          {booking.tourLocation || booking.location}
                        </div>
                      )}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <UserIcon className="w-4 h-4 mr-2 text-gray-400" />
                        <div>
                          <div className="text-sm font-medium text-gray-900">
                            {booking.leadTraveler.firstName} {booking.leadTraveler.lastName}
                          </div>
                          <div className="text-xs text-gray-500">
                            {booking.leadTraveler.email}
                          </div>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <CalendarIcon className="w-4 h-4 mr-2 text-gray-400" />
                        {formatDate(booking.selectedDate)}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        <div className="flex items-center">
                          <UsersIcon className="w-4 h-4 mr-1 text-gray-400" />
                          {booking.participants} participant{booking.participants > 1 ? 's' : ''}
                        </div>
                        <div className="flex items-center mt-1">
                          <DollarSignIcon className="w-4 h-4 mr-1 text-green-500" />
                          <span className="text-green-600 font-medium">
                            {formatCurrency(booking.totalPrice)}
                          </span>
                        </div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusDisplay(booking.status)}
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(booking.createdAt)}
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