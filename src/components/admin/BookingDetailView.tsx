'use client';

import { useState, useEffect, useCallback } from 'react';
import { 
  ArrowLeft, 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Mail, 
  Phone, 
  FileText,
  Edit,
  CheckCircleIcon,
  ClockIcon,
  XCircleIcon,
  AlertCircleIcon
} from 'lucide-react';
import Link from 'next/link';
import { Booking, BookingStatus } from '@/types';

interface BookingDetailViewProps {
  bookingReference: string;
}

interface StatusBadgeProps {
  status: BookingStatus;
}

function StatusBadge({ status }: StatusBadgeProps) {
  const getStatusConfig = (status: BookingStatus) => {
    switch (status) {
      case 'confirmed':
        return { color: 'bg-green-100 text-green-800', label: 'Confirmed', icon: CheckCircleIcon };
      case 'pending':
        return { color: 'bg-yellow-100 text-yellow-800', label: 'Pending', icon: ClockIcon };
      case 'cancelled':
        return { color: 'bg-red-100 text-red-800', label: 'Cancelled', icon: XCircleIcon };
      case 'completed':
        return { color: 'bg-blue-100 text-blue-800', label: 'Completed', icon: CheckCircleIcon };
      case 'refunded':
        return { color: 'bg-gray-100 text-gray-800', label: 'Refunded', icon: AlertCircleIcon };
      default:
        return { color: 'bg-gray-100 text-gray-800', label: 'Unknown', icon: AlertCircleIcon };
    }
  };

  const config = getStatusConfig(status);
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${config.color}`}>
      <Icon className="w-4 h-4 mr-2" />
      {config.label}
    </span>
  );
}

function TravelerCard({ traveler, isLead }: { 
  traveler: { firstName: string; lastName: string; email?: string; phone?: string }; 
  isLead: boolean;
}) {
  return (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex items-center justify-between mb-2">
        <h4 className="font-medium text-gray-900">
          {traveler.firstName} {traveler.lastName}
        </h4>
        {isLead && (
          <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs font-medium rounded">
            Lead Traveler
          </span>
        )}
      </div>
      
      {isLead && traveler.email && (
        <div className="flex items-center text-sm text-gray-600 mb-1">
          <Mail className="w-4 h-4 mr-2" />
          {traveler.email}
        </div>
      )}
      
      {isLead && traveler.phone && (
        <div className="flex items-center text-sm text-gray-600">
          <Phone className="w-4 h-4 mr-2" />
          {traveler.phone}
        </div>
      )}
    </div>
  );
}

export default function BookingDetailView({ bookingReference }: BookingDetailViewProps) {
  // const router = useRouter();
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBooking = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/bookings?reference=${bookingReference}`);
      const data = await response.json();

      if (data.success) {
        setBooking(data.booking);
        setError(null);
      } else {
        setError(data.error || 'Booking not found');
      }
    } catch (err) {
      setError('Failed to fetch booking details');
      console.error('Error fetching booking:', err);
    } finally {
      setLoading(false);
    }
  }, [bookingReference]);

  useEffect(() => {
    if (bookingReference) {
      fetchBooking();
    }
  }, [bookingReference, fetchBooking]);


  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };


  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Loading booking details...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="p-6">
        <div className="text-center py-12">
          <p className="text-red-600 mb-4">{error || 'Booking not found'}</p>
          <Link
            href="/admin/bookings"
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  const allTravelers = [
    { ...booking.leadTraveler, isLead: true },
    ...(booking.additionalTravelers || []).map(traveler => ({ ...traveler, isLead: false }))
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sticky Header */}
      <div className="sticky top-0 z-10 bg-gray-50 px-6 py-4 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/admin/bookings"
              className="flex items-center text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="w-5 h-5 mr-2" />
              Back to Bookings
            </Link>
            <span className="text-gray-400">|</span>
            <span className="text-sm text-gray-500">Reference: {booking.bookingReference}</span>
          </div>
          <div className="flex items-center space-x-3">
            <StatusBadge status={booking.status} />
            {booking.status === 'pending' && (
              <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Edit className="w-4 h-4 mr-2" />
                Update Status
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="px-6 py-6">

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Tour Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Tour Information</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {booking.tourTitle}
                  </h3>
                  {booking.location && (
                    <div className="flex items-center text-gray-600 mb-2">
                      <MapPin className="w-4 h-4 mr-2" />
                      {booking.location}
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="flex items-center text-gray-600">
                    <Calendar className="w-5 h-5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Tour Date</p>
                      <p className="font-medium">{formatDate(booking.selectedDate)}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Users className="w-5 h-5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Participants</p>
                      <p className="font-medium">{booking.participants} person{booking.participants > 1 ? 's' : ''}</p>
                    </div>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <DollarSign className="w-5 h-5 mr-3" />
                    <div>
                      <p className="text-sm text-gray-500">Total Price</p>
                      <p className="font-medium">{formatCurrency(booking.totalPrice)}</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Travelers */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Travelers ({allTravelers.length})
              </h2>
              
              <div className="grid gap-4">
                {allTravelers.map((traveler, index) => (
                  <TravelerCard
                    key={index}
                    traveler={traveler}
                    isLead={traveler.isLead}
                  />
                ))}
              </div>
            </div>

            {/* Special Requests */}
            {booking.specialRequests && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-lg font-semibold text-gray-900 mb-4">Special Requests</h2>
                <div className="flex items-start">
                  <FileText className="w-5 h-5 mr-3 mt-0.5 text-gray-400" />
                  <p className="text-gray-700">{booking.specialRequests}</p>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Price Breakdown */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Price Breakdown</h3>
              
              <div className="space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Price per person</span>
                  <span>{formatCurrency(booking.pricePerPerson)}</span>
                </div>
                
                <div className="flex justify-between text-gray-600">
                  <span>Number of participants</span>
                  <span>× {booking.participants}</span>
                </div>
                
                <div className="border-t border-gray-200 pt-3">
                  <div className="flex justify-between text-lg font-semibold text-gray-900">
                    <span>Total Amount</span>
                    <span>{formatCurrency(booking.totalPrice)}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              
              <div className="space-y-3">
                <Link
                  href={`/admin/tours/${booking.tourId}`}
                  className="block w-full px-4 py-2 text-center border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                >
                  View Tour Details
                </Link>
                
                {booking.status === 'confirmed' && new Date(booking.selectedDate) > new Date() && (
                  <button className="w-full px-4 py-2 text-center bg-red-600 text-white text-sm font-medium rounded-md hover:bg-red-700 transition-colors">
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>

            {/* Booking Timeline */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Timeline</h3>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-blue-600 rounded-full mt-2 mr-3"></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Booking Created</p>
                    <p className="text-xs text-gray-500">{formatDate(booking.createdAt)}</p>
                  </div>
                </div>
                
                {booking.status === 'confirmed' && (
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-green-600 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Booking Confirmed</p>
                      <p className="text-xs text-gray-500">{formatDate(booking.updatedAt)}</p>
                    </div>
                  </div>
                )}
                
                {new Date(booking.selectedDate) > new Date() && (
                  <div className="flex items-start">
                    <div className="w-2 h-2 bg-gray-300 rounded-full mt-2 mr-3"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-500">Tour Date</p>
                      <p className="text-xs text-gray-500">{formatDate(booking.selectedDate)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}