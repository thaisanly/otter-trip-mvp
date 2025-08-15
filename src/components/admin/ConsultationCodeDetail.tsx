'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  KeyIcon,
  CalendarIcon,
  UserIcon,
  ClockIcon,
  CheckCircleIcon,
  XCircleIcon,
  AlertCircleIcon,
  EditIcon,
  TrashIcon,
  PowerIcon,
  MailIcon,
  PhoneIcon,
  DollarSignIcon,
  RefreshCwIcon,
  FileDownIcon,
  UsersIcon,
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ConsultationBooking {
  id: string;
  bookingReference: string;
  expertName: string;
  expertId: string;
  userName: string;
  userEmail: string;
  phone?: string;
  selectedDate: string;
  selectedTime: string;
  price: number;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

interface ConsultationCode {
  id: string;
  code: string;
  status: string;
  description?: string | null;
  maxUses?: number | null;
  usedCount: number;
  expiresAt?: Date | null;
  createdBy?: string | null;
  createdAt: Date;
  updatedAt: Date;
  consultationBookings?: ConsultationBooking[];
}

interface ConsultationCodeDetailProps {
  codeId: string;
}

const ConsultationCodeDetail: React.FC<ConsultationCodeDetailProps> = ({ codeId }) => {
  const router = useRouter();
  const [code, setCode] = useState<ConsultationCode | null>(null);
  const [loading, setLoading] = useState(true);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({
    description: '',
    maxUses: '',
    expiresAt: '',
    status: 'active',
  });

  useEffect(() => {
    fetchCodeDetail();
  }, [codeId]);

  const fetchCodeDetail = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/admin/consultation-codes/${codeId}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch code details');
      }
      
      const data = await response.json();
      setCode(data);
      
      // Set edit data
      setEditData({
        description: data.description || '',
        maxUses: data.maxUses?.toString() || '',
        expiresAt: data.expiresAt ? new Date(data.expiresAt).toISOString().split('T')[0] : '',
        status: data.status,
      });
    } catch (error) {
      console.error('Error fetching code details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleStatus = async () => {
    if (!code) return;
    
    try {
      const newStatus = code.status === 'active' ? 'inactive' : 'active';
      const response = await fetch(`/api/admin/consultation-codes/${code.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        fetchCodeDetail();
      }
    } catch (error) {
      console.error('Error toggling code status:', error);
    }
  };

  const handleUpdateCode = async () => {
    if (!code) return;
    
    try {
      const response = await fetch(`/api/admin/consultation-codes/${code.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          description: editData.description || undefined,
          maxUses: editData.maxUses ? parseInt(editData.maxUses) : undefined,
          expiresAt: editData.expiresAt || undefined,
          status: editData.status,
        }),
      });

      if (response.ok) {
        setShowEditModal(false);
        fetchCodeDetail();
      }
    } catch (error) {
      console.error('Error updating code:', error);
    }
  };

  const handleDeleteCode = async () => {
    if (!code) return;
    
    if (window.confirm('Are you sure you want to delete this code? This action cannot be undone.')) {
      try {
        const response = await fetch(`/api/admin/consultation-codes/${code.id}`, {
          method: 'DELETE',
        });

        if (response.ok) {
          router.push('/admin/consultation-codes');
        }
      } catch (error) {
        console.error('Error deleting code:', error);
      }
    }
  };

  const handleExportBookingsPDF = () => {
    if (!code || !code.consultationBookings || code.consultationBookings.length === 0) return;
    
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.width;
    
    // Add header
    doc.setFontSize(20);
    doc.text(`Bookings for Code: ${code.code}`, pageWidth / 2, 20, { align: 'center' });
    
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, pageWidth / 2, 30, { align: 'center' });
    doc.text(`Total Bookings: ${code.consultationBookings.length}`, 14, 40);
    
    // Prepare table data
    const tableData = code.consultationBookings.map(booking => [
      booking.bookingReference,
      booking.userName,
      booking.userEmail,
      booking.expertName,
      booking.selectedDate,
      booking.selectedTime,
      `$${booking.price}`,
      booking.status,
    ]);
    
    // Add table
    autoTable(doc, {
      head: [['Ref', 'User', 'Email', 'Expert', 'Date', 'Time', 'Price', 'Status']],
      body: tableData,
      startY: 50,
      theme: 'grid',
      styles: {
        fontSize: 9,
        cellPadding: 2,
      },
      headStyles: {
        fillColor: [147, 51, 234], // Purple color
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 255],
      },
    });
    
    // Save the PDF
    doc.save(`bookings-${code.code}-${new Date().toISOString().split('T')[0]}.pdf`);
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
            <CheckCircleIcon size={16} className="mr-1.5" />
            Active
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-gray-100 text-gray-800">
            <XCircleIcon size={16} className="mr-1.5" />
            Inactive
          </span>
        );
      case 'expired':
        return (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-red-100 text-red-800">
            <AlertCircleIcon size={16} className="mr-1.5" />
            Expired
          </span>
        );
      default:
        return null;
    }
  };

  const getBookingStatusBadge = (status: string) => {
    switch (status) {
      case 'confirmed':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            Confirmed
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
            Pending
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            Cancelled
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
            {status}
          </span>
        );
    }
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="bg-white shadow rounded-lg p-12">
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
          <p className="text-center mt-4 text-gray-500">Loading code details...</p>
        </div>
      </div>
    );
  }

  if (!code) {
    return (
      <div className="p-6">
        <div className="bg-white shadow rounded-lg p-12 text-center">
          <AlertCircleIcon size={48} className="mx-auto text-gray-400 mb-4" />
          <p className="text-gray-500">Code not found</p>
          <button
            onClick={() => router.push('/admin/consultation-codes')}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
          >
            <ArrowLeftIcon size={16} className="mr-2" />
            Back to Codes
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-gray-50 px-6 py-4 border-b border-gray-200">
        <button
          onClick={() => router.push('/admin/consultation-codes')}
          className="inline-flex items-center text-sm text-gray-600 hover:text-gray-900"
        >
          <ArrowLeftIcon size={16} className="mr-1" />
          Back to Consultation Codes
        </button>
      </div>

      <div className="px-6 py-6">
      {/* Code Details Card */}
      <div className="bg-white shadow rounded-lg mb-6">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <KeyIcon size={24} className="text-purple-600 mr-3" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{code.code}</h1>
                <p className="text-sm text-gray-500">Consultation Code Details</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {getStatusBadge(code.status)}
              <button
                onClick={() => setShowEditModal(true)}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <EditIcon size={16} className="mr-1" />
                Edit
              </button>
              {code.status !== 'expired' && (
                <button
                  onClick={handleToggleStatus}
                  className={`inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                    code.status === 'active' 
                      ? 'bg-gray-600 hover:bg-gray-700' 
                      : 'bg-green-600 hover:bg-green-700'
                  }`}
                >
                  <PowerIcon size={16} className="mr-1" />
                  {code.status === 'active' ? 'Deactivate' : 'Activate'}
                </button>
              )}
              <button
                onClick={handleDeleteCode}
                className="inline-flex items-center px-3 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700"
              >
                <TrashIcon size={16} className="mr-1" />
                Delete
              </button>
            </div>
          </div>
        </div>

        <div className="px-6 py-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div>
              <p className="text-sm font-medium text-gray-500">Description</p>
              <p className="mt-1 text-gray-900">{code.description || 'No description'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Usage</p>
              <div className="mt-1">
                <p className="text-gray-900">
                  {code.usedCount} / {code.maxUses || 'Unlimited'}
                </p>
                {code.maxUses && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                    <div
                      className="bg-purple-600 h-2 rounded-full"
                      style={{
                        width: `${Math.min((code.usedCount / code.maxUses) * 100, 100)}%`,
                      }}
                    ></div>
                  </div>
                )}
              </div>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Expires</p>
              <p className="mt-1 text-gray-900">
                {code.expiresAt ? new Date(code.expiresAt).toLocaleDateString() : 'Never'}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created By</p>
              <p className="mt-1 text-gray-900">{code.createdBy || 'System'}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Created At</p>
              <p className="mt-1 text-gray-900">
                {new Date(code.createdAt).toLocaleDateString()} at{' '}
                {new Date(code.createdAt).toLocaleTimeString()}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Last Updated</p>
              <p className="mt-1 text-gray-900">
                {new Date(code.updatedAt).toLocaleDateString()} at{' '}
                {new Date(code.updatedAt).toLocaleTimeString()}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Consultation Bookings */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <UsersIcon size={20} className="text-blue-600 mr-2" />
              <h2 className="text-lg font-medium text-gray-900">Consultation Bookings</h2>
              <span className="ml-2 px-2 py-1 text-xs font-medium bg-blue-100 text-blue-800 rounded-full">
                {code.consultationBookings?.length || 0}
              </span>
            </div>
            {code.consultationBookings && code.consultationBookings.length > 0 && (
              <button
                onClick={handleExportBookingsPDF}
                className="inline-flex items-center px-3 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                <FileDownIcon size={16} className="mr-1" />
                Export PDF
              </button>
            )}
          </div>
        </div>

        {!code.consultationBookings || code.consultationBookings.length === 0 ? (
          <div className="px-6 py-12 text-center">
            <CalendarIcon size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-500">No bookings have used this code yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booking Ref
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Expert
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date & Time
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Price
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Booked At
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {code.consultationBookings.map((booking) => (
                  <tr key={booking.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-mono text-gray-900">
                        {booking.bookingReference}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{booking.userName}</div>
                        <div className="text-sm text-gray-500">{booking.userEmail}</div>
                        {booking.phone && (
                          <div className="text-sm text-gray-500">{booking.phone}</div>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.expertName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{booking.selectedDate}</div>
                      <div className="text-sm text-gray-500">{booking.selectedTime}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="text-sm font-medium text-gray-900">${booking.price}</span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getBookingStatusBadge(booking.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(booking.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Edit Consultation Code</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Code
                </label>
                <input
                  type="text"
                  value={code.code}
                  disabled
                  className="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 text-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  value={editData.description}
                  onChange={(e) => setEditData({ ...editData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g., Partner organization code"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Uses
                </label>
                <input
                  type="number"
                  value={editData.maxUses}
                  onChange={(e) => setEditData({ ...editData, maxUses: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Leave empty for unlimited"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Expiration Date
                </label>
                <input
                  type="date"
                  value={editData.expiresAt}
                  onChange={(e) => setEditData({ ...editData, expiresAt: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  value={editData.status}
                  onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="expired">Expired</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => setShowEditModal(false)}
                className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCode}
                className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default ConsultationCodeDetail;