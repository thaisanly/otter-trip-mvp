'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { format } from 'date-fns';
import { ArrowLeftIcon, CalendarIcon, ClockIcon, MailIcon, PhoneIcon, BuildingIcon, MessageSquareIcon, KeyIcon } from 'lucide-react';

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

export default function ConsultationDetailPage() {
  const router = useRouter();
  const params = useParams();
  const [consultation, setConsultation] = useState<ConsultationBooking | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.id) {
      fetchConsultation(params.id as string);
    }
  }, [params.id]);

  const fetchConsultation = async (id: string) => {
    try {
      const response = await fetch(`/api/admin/consultations/${id}`);
      if (!response.ok) throw new Error('Failed to fetch consultation');
      const data = await response.json();
      setConsultation(data);
    } catch (error) {
      console.error('Error fetching consultation:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-green-100 text-green-800',
      completed: 'bg-blue-100 text-blue-800',
      cancelled: 'bg-red-100 text-red-800',
    };

    return (
      <span
        className={`px-3 py-1 text-sm font-medium rounded-full ${
          statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600"></div>
        </div>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="p-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Consultation Not Found</h1>
          <button
            onClick={() => router.push('/admin/consultations')}
            className="text-teal-600 hover:text-teal-700"
          >
            ← Back to Consultations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => router.push('/admin/consultations')}
          className="flex items-center text-teal-600 hover:text-teal-700 mb-4"
        >
          <ArrowLeftIcon size={20} className="mr-2" />
          Back to Consultations
        </button>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Consultation Details</h1>
            <p className="text-gray-600 mt-2">
              Consultation with {consultation.expertName} • {format(new Date(consultation.createdAt), 'MMM dd, yyyy')}
            </p>
          </div>
          {getStatusBadge(consultation.status)}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Client Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Client Information</h2>
          
          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center mt-1">
                <span className="text-gray-600 font-medium">{consultation.name.charAt(0).toUpperCase()}</span>
              </div>
              <div>
                <p className="text-sm text-gray-500">Full Name</p>
                <p className="text-lg font-medium text-gray-900">{consultation.name}</p>
              </div>
            </div>

            <div className="flex items-start space-x-3">
              <MailIcon className="w-5 h-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{consultation.email}</p>
              </div>
            </div>

            {consultation.phone && (
              <div className="flex items-start space-x-3">
                <PhoneIcon className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{consultation.phone}</p>
                </div>
              </div>
            )}

            {consultation.company && (
              <div className="flex items-start space-x-3">
                <BuildingIcon className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Company</p>
                  <p className="text-gray-900">{consultation.company}</p>
                </div>
              </div>
            )}

            {consultation.invitationCode && (
              <div className="flex items-start space-x-3">
                <KeyIcon className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Invitation Code</p>
                  <p className="font-mono bg-gray-100 px-2 py-1 rounded text-gray-900 inline-block">
                    {consultation.invitationCode}
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Expert & Schedule Information */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Expert & Schedule</h2>
          
          <div className="space-y-4">
            <div>
              <p className="text-sm text-gray-500">Expert</p>
              <p className="text-lg font-medium text-gray-900">{consultation.expertName}</p>
              <p className="text-sm text-gray-500">ID: {consultation.expertId}</p>
            </div>

            {consultation.preferredDate && (
              <div className="flex items-start space-x-3">
                <CalendarIcon className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Preferred Date</p>
                  <p className="text-gray-900">{consultation.preferredDate}</p>
                </div>
              </div>
            )}

            {consultation.preferredTime && (
              <div className="flex items-start space-x-3">
                <ClockIcon className="w-5 h-5 text-gray-400 mt-1" />
                <div>
                  <p className="text-sm text-gray-500">Preferred Time</p>
                  <p className="text-gray-900">{consultation.preferredTime}</p>
                </div>
              </div>
            )}

            <div className="pt-4 border-t border-gray-200">
              <p className="text-sm text-gray-500">Created</p>
              <p className="text-gray-900">{format(new Date(consultation.createdAt), 'MMM dd, yyyy HH:mm')}</p>
            </div>

            <div>
              <p className="text-sm text-gray-500">Last Updated</p>
              <p className="text-gray-900">{format(new Date(consultation.updatedAt), 'MMM dd, yyyy HH:mm')}</p>
            </div>
          </div>
        </div>

        {/* Message */}
        {consultation.message && (
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center space-x-2 mb-4">
              <MessageSquareIcon className="w-5 h-5 text-gray-400" />
              <h2 className="text-xl font-bold text-gray-900">Message</h2>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-gray-900 whitespace-pre-wrap">{consultation.message}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}