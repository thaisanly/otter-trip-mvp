'use client';

import { useEffect, useState, useRef } from 'react';
import { format } from 'date-fns';
import { SearchIcon, KeyIcon } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface ConsultationBooking {
  id: string;
  expertId: string;
  expertName: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  preferredDate?: string;
  preferredTime?: string;
  message?: string;
  invitationCode?: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export default function AdminConsultationsPage() {
  const router = useRouter();
  const [consultations, setConsultations] = useState<ConsultationBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    fetchConsultations();
  }, []);

  useEffect(() => {
    if (searchInputRef.current) {
      searchInputRef.current.focus();
    }
  }, []);

  const fetchConsultations = async () => {
    try {
      const response = await fetch('/api/admin/consultations');
      if (!response.ok) throw new Error('Failed to fetch consultations');
      const data = await response.json();
      setConsultations(data);
    } catch (error) {
      console.error('Error fetching consultations:', error);
    } finally {
      setLoading(false);
    }
  };


  const filteredConsultations = consultations.filter((consultation) => {
    if (!searchTerm) return true;

    const search = searchTerm.toLowerCase();
    return (
      consultation.invitationCode?.toLowerCase().includes(search) ||
      consultation.name.toLowerCase().includes(search) ||
      consultation.company?.toLowerCase().includes(search) ||
      consultation.email.toLowerCase().includes(search) ||
      consultation.phone?.toLowerCase().includes(search)
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
            <h1 className="text-3xl font-bold text-gray-900">Expert Consultation</h1>
            <p className="text-gray-600 mt-2">View and manage all consultation requests</p>
          </div>
          <Link
            href="/admin/consultation-codes"
            className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
          >
            <KeyIcon size={20} />
            <span>Manage Codes</span>
          </Link>
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
            placeholder="Search by code, client name ..."
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
                  Expert
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Client
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Preferred Schedule
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredConsultations.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No consultations found
                  </td>
                </tr>
              ) : (
                filteredConsultations.map((consultation) => (
                  <tr 
                    key={consultation.id} 
                    className="hover:bg-gray-50 cursor-pointer"
                    onClick={() => router.push(`/admin/consultations/${consultation.id}`)}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {format(new Date(consultation.createdAt), 'MMM dd, yyyy')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {consultation.expertName}
                      </div>
                      <div className="text-sm text-gray-500">ID: {consultation.expertId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{consultation.name}</div>
                      {consultation.company && (
                        <div className="text-sm text-gray-500">{consultation.company}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{consultation.email}</div>
                      {consultation.phone && (
                        <div className="text-sm text-gray-500">{consultation.phone}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {consultation.preferredDate || 'Not specified'}
                      </div>
                      {consultation.preferredTime && (
                        <div className="text-sm text-gray-500">{consultation.preferredTime}</div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      {consultation.invitationCode ? (
                        <span className="font-mono bg-gray-100 px-2 py-1 rounded">
                          {consultation.invitationCode}
                        </span>
                      ) : (
                        <span className="text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {filteredConsultations.length > 0 && (
        <div className="mt-6 flex justify-between items-center text-sm text-gray-600">
          <div>
            Showing {filteredConsultations.length} of {consultations.length} consultations
          </div>
          <div className="text-right">Last updated: {format(new Date(), 'MMM dd, yyyy HH:mm')}</div>
        </div>
      )}
    </div>
  );
}
