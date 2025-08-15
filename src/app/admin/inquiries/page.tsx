'use client';

import { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { useRouter } from 'next/navigation';
import { SearchIcon, MapPinIcon, CalendarIcon, ClockIcon } from 'lucide-react';

interface Inquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  destination: string;
  preferredDate?: string;
  tripDuration?: string;
  message?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminInquiriesPage() {
  const router = useRouter();
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchInquiries();
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const fetchInquiries = async () => {
    try {
      const response = await fetch('/api/admin/inquiries');
      if (!response.ok) throw new Error('Failed to fetch inquiries');
      const data = await response.json();
      setInquiries(data);
    } catch (error) {
      console.error('Error fetching inquiries:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      contacted: 'bg-blue-100 text-blue-800',
      converted: 'bg-green-100 text-green-800',
      closed: 'bg-gray-100 text-gray-800',
    };

    return (
      <span
        className={`px-2 py-1 text-xs font-medium rounded-full ${
          statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status}
      </span>
    );
  };

  const filteredInquiries = inquiries.filter((inquiry) => {
    if (!searchTerm) return true;

    const search = searchTerm.toLowerCase();
    return (
      inquiry.name.toLowerCase().includes(search) ||
      inquiry.email.toLowerCase().includes(search) ||
      inquiry.destination.toLowerCase().includes(search) ||
      inquiry.phone?.toLowerCase().includes(search) ||
      inquiry.message?.toLowerCase().includes(search)
    );
  });

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <div className="mb-8">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Expert Inquiries</h1>
            <p className="text-gray-600 mt-2">View and manage all expert inquiry requests</p>
          </div>
        </div>
      </div>

      <div className="mb-6">
        <div className="relative max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <SearchIcon className="h-5 w-5 text-gray-400" />
          </div>
          <input
            ref={searchInputRef}
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, destination..."
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-teal-500 focus:border-teal-500"
          />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Destination
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Trip Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Message
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredInquiries.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No inquiries found
                  </td>
                </tr>
              ) : (
                filteredInquiries.map((inquiry) => (
                  <tr 
                    key={inquiry.id} 
                    className="hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => router.push(`/admin/inquiries/${inquiry.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(inquiry.createdAt), 'MMM dd, yyyy')}
                      <div className="text-xs text-gray-500">
                        {format(new Date(inquiry.createdAt), 'HH:mm')}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{inquiry.name}</div>
                      <div className="text-sm text-gray-500">{inquiry.email}</div>
                      {inquiry.phone && (
                        <div className="text-sm text-gray-500">{inquiry.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center text-sm text-gray-900">
                        <MapPinIcon size={14} className="mr-1 text-gray-400" />
                        {inquiry.destination}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {inquiry.preferredDate && (
                        <div className="flex items-center text-sm text-gray-900">
                          <CalendarIcon size={14} className="mr-1 text-gray-400" />
                          {inquiry.preferredDate}
                        </div>
                      )}
                      {inquiry.tripDuration && (
                        <div className="flex items-center text-sm text-gray-500 mt-1">
                          <ClockIcon size={14} className="mr-1 text-gray-400" />
                          {inquiry.tripDuration}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {inquiry.message ? (
                        <div className="text-sm text-gray-600 max-w-xs truncate" title={inquiry.message}>
                          {inquiry.message}
                        </div>
                      ) : (
                        <span className="text-sm text-gray-400">No message</span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {getStatusBadge(inquiry.status)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredInquiries.length > 0 && (
        <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
          <div>
            Showing {filteredInquiries.length} of {inquiries.length} inquiries
          </div>
          <div className="text-right">Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}</div>
        </div>
      )}
    </div>
  );
}