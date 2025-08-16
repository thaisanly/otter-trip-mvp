'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  CalendarIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  BuildingIcon,
  MessageSquareIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  EditIcon,
  KeyIcon,
  RefreshCwIcon,
} from 'lucide-react';

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

interface ConsultationDetailProps {
  consultationId: string;
}

const ConsultationDetail: React.FC<ConsultationDetailProps> = ({ consultationId }) => {
  const router = useRouter();
  const [consultation, setConsultation] = useState<ConsultationBooking | null>(null);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [newStatus, setNewStatus] = useState('');

  const fetchConsultation = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/consultations/${consultationId}`);
      if (!response.ok) {
        throw new Error('Failed to fetch consultation');
      }
      const data = await response.json();
      setConsultation(data);
      setNewStatus(data.status);
    } catch (error) {
      console.error('Error fetching consultation:', error);
    } finally {
      setLoading(false);
    }
  }, [consultationId]);

  useEffect(() => {
    fetchConsultation();
  }, [fetchConsultation]);


  const updateStatus = async () => {
    if (!consultation || newStatus === consultation.status) return;
    
    try {
      setUpdating(true);
      const response = await fetch(`/api/admin/consultations/${consultationId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchConsultation();
      }
    } catch (error) {
      console.error('Error updating consultation:', error);
    } finally {
      setUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'pending':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-yellow-100 text-yellow-800">
            <ClockIcon size={16} className="mr-2" />
            Pending
          </span>
        );
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircleIcon size={16} className="mr-2" />
            Confirmed
          </span>
        );
      case 'completed':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-100 text-blue-800">
            <CheckCircleIcon size={16} className="mr-2" />
            Completed
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <XCircleIcon size={16} className="mr-2" />
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <AlertCircleIcon size={16} className="mr-2" />
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-center mt-4 text-gray-500">Loading consultation details...</p>
      </div>
    );
  }

  if (!consultation) {
    return (
      <div className="p-6">
        <div className="text-center">
          <AlertCircleIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Consultation Not Found</h2>
          <p className="text-gray-500">The consultation you&apos;re looking for doesn&apos;t exist.</p>
          <button
            onClick={() => router.push('/admin/consultations')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Consultations
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-center mb-4">
          <button
            onClick={() => router.push('/admin/consultations')}
            className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 mr-4"
          >
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Consultations
          </button>
          <h1 className="text-2xl font-bold text-gray-900">Consultation Details</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          {getStatusBadge(consultation.status)}
          <span className="text-sm text-gray-500">
            Created {new Date(consultation.createdAt).toLocaleDateString()}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Details */}
        <div className="lg:col-span-2 space-y-6">
          {/* Client Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <UserIcon size={20} className="mr-2" />
              Client Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Name</label>
                <p className="mt-1 text-sm text-gray-900">{consultation.name}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Email</label>
                <p className="mt-1 text-sm text-gray-900 flex items-center">
                  <MailIcon size={16} className="mr-2 text-gray-400" />
                  {consultation.email}
                </p>
              </div>
              {consultation.phone && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Phone</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <PhoneIcon size={16} className="mr-2 text-gray-400" />
                    {consultation.phone}
                  </p>
                </div>
              )}
              {consultation.company && (
                <div>
                  <label className="block text-sm font-medium text-gray-700">Company</label>
                  <p className="mt-1 text-sm text-gray-900 flex items-center">
                    <BuildingIcon size={16} className="mr-2 text-gray-400" />
                    {consultation.company}
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Expert Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <UserIcon size={20} className="mr-2" />
              Expert Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Expert Name</label>
                <p className="mt-1 text-sm text-gray-900">{consultation.expertName}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Expert ID</label>
                <p className="mt-1 text-sm text-gray-900 font-mono">{consultation.expertId}</p>
              </div>
            </div>
          </div>

          {/* Scheduling Information */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <CalendarIcon size={20} className="mr-2" />
              Scheduling Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
                <p className="mt-1 text-sm text-gray-900">
                  {consultation.preferredDate || 'Not specified'}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">Preferred Time</label>
                <p className="mt-1 text-sm text-gray-900">
                  {consultation.preferredTime || 'Not specified'}
                </p>
              </div>
            </div>
          </div>

          {/* Message */}
          {consultation.message && (
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
                <MessageSquareIcon size={20} className="mr-2" />
                Message
              </h2>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">{consultation.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <EditIcon size={20} className="mr-2" />
              Status Management
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Current Status
                </label>
                {getStatusBadge(consultation.status)}
              </div>
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-2">
                  Update Status
                </label>
                <select
                  id="status"
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="confirmed">Confirmed</option>
                  <option value="completed">Completed</option>
                  <option value="cancelled">Cancelled</option>
                </select>
              </div>
              <button
                onClick={updateStatus}
                disabled={updating || newStatus === consultation.status}
                className="w-full inline-flex items-center justify-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {updating ? (
                  <RefreshCwIcon size={16} className="mr-2 animate-spin" />
                ) : (
                  <CheckCircleIcon size={16} className="mr-2" />
                )}
                {updating ? 'Updating...' : 'Update Status'}
              </button>
            </div>
          </div>

          {/* Invitation Code */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <KeyIcon size={20} className="mr-2" />
              Invitation Code
            </h2>
            {consultation.invitationCode ? (
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-xs text-gray-500 mb-1">Code Used</p>
                <p className="text-lg font-mono font-medium text-gray-900">
                  {consultation.invitationCode}
                </p>
              </div>
            ) : (
              <p className="text-sm text-gray-500">No invitation code used</p>
            )}
          </div>

          {/* Timestamps */}
          <div className="bg-white shadow rounded-lg p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4 flex items-center">
              <ClockIcon size={20} className="mr-2" />
              Timeline
            </h2>
            <div className="space-y-3">
              <div>
                <p className="text-xs text-gray-500">Created</p>
                <p className="text-sm text-gray-900">
                  {new Date(consultation.createdAt).toLocaleString()}
                </p>
              </div>
              <div>
                <p className="text-xs text-gray-500">Last Updated</p>
                <p className="text-sm text-gray-900">
                  {new Date(consultation.updatedAt).toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ConsultationDetail;