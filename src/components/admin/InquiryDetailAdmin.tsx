'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { format } from 'date-fns';
import {
  ArrowLeftIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  MapPinIcon,
  CalendarIcon,
  ClockIcon,
  MessageSquareIcon,
  SaveIcon,
  LoaderIcon,
} from 'lucide-react';

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

interface InquiryDetailAdminProps {
  inquiry: Inquiry;
}

export default function InquiryDetailAdmin({ inquiry }: InquiryDetailAdminProps) {
  const router = useRouter();
  const [status, setStatus] = useState(inquiry.status);
  const [isUpdating, setIsUpdating] = useState(false);

  const handleStatusChange = async (newStatus: string) => {
    setIsUpdating(true);
    try {
      const response = await fetch(`/api/admin/inquiries/${inquiry.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        setStatus(newStatus);
      }
    } catch (error) {
      console.error('Error updating status:', error);
    } finally {
      setIsUpdating(false);
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
        className={`px-3 py-1 text-sm font-medium rounded-full ${
          statusClasses[status as keyof typeof statusClasses] || 'bg-gray-100 text-gray-800'
        }`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <button
            onClick={() => router.push('/admin/inquiries')}
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeftIcon size={20} />
            <span>Back to Inquiries</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column - Main Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Info Card */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-start justify-between mb-6">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{inquiry.name}</h1>
                <p className="text-gray-600 mt-1">Expert Inquiry Details</p>
              </div>
              {getStatusBadge(status)}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Contact Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <UserIcon size={18} className="text-gray-400" />
                    <span className="text-gray-900">{inquiry.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <MailIcon size={18} className="text-gray-400" />
                    <a
                      href={`mailto:${inquiry.email}`}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      {inquiry.email}
                    </a>
                  </div>
                  {inquiry.phone && (
                    <div className="flex items-center space-x-3">
                      <PhoneIcon size={18} className="text-gray-400" />
                      <a
                        href={`tel:${inquiry.phone}`}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        {inquiry.phone}
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* Trip Information */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Trip Information</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <MapPinIcon size={18} className="text-gray-400" />
                    <span className="text-gray-900">{inquiry.destination}</span>
                  </div>
                  {inquiry.preferredDate && (
                    <div className="flex items-center space-x-3">
                      <CalendarIcon size={18} className="text-gray-400" />
                      <span className="text-gray-900">{inquiry.preferredDate}</span>
                    </div>
                  )}
                  {inquiry.tripDuration && (
                    <div className="flex items-center space-x-3">
                      <ClockIcon size={18} className="text-gray-400" />
                      <span className="text-gray-900">{inquiry.tripDuration}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Message Card */}
          {inquiry.message && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-center space-x-3 mb-4">
                <MessageSquareIcon size={20} className="text-gray-400" />
                <h3 className="text-lg font-semibold text-gray-900">Message</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-gray-700 whitespace-pre-wrap">{inquiry.message}</p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column - Status & Actions */}
        <div className="space-y-6">
          {/* Status Management */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Status Management</h3>
            <div className="space-y-3">
              {['pending', 'contacted', 'converted', 'closed'].map((statusOption) => (
                <button
                  key={statusOption}
                  onClick={() => handleStatusChange(statusOption)}
                  disabled={isUpdating || status === statusOption}
                  className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                    status === statusOption
                      ? 'border-blue-500 bg-blue-50 text-blue-700'
                      : 'border-gray-200 bg-white text-gray-700 hover:bg-gray-50'
                  } ${isUpdating ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span className="capitalize">{statusOption}</span>
                  {isUpdating ? (
                    <LoaderIcon size={16} className="animate-spin" />
                  ) : status === statusOption ? (
                    <SaveIcon size={16} />
                  ) : null}
                </button>
              ))}
            </div>
          </div>

          {/* Inquiry Details */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Inquiry Details</h3>
            <div className="space-y-3 text-sm">
              <div>
                <span className="text-gray-600">Inquiry ID:</span>
                <p className="font-mono text-gray-900">{inquiry.id}</p>
              </div>
              <div>
                <span className="text-gray-600">Created:</span>
                <p className="text-gray-900">
                  {format(new Date(inquiry.createdAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
              <div>
                <span className="text-gray-600">Last Updated:</span>
                <p className="text-gray-900">
                  {format(new Date(inquiry.updatedAt), 'MMM dd, yyyy HH:mm')}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}