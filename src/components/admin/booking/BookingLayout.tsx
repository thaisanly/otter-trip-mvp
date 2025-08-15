'use client';

import React, { useState, useEffect } from 'react';
import BookingSidebar from './BookingSidebar';
import { Menu, X } from 'lucide-react';

interface BookingLayoutProps {
  children: React.ReactNode;
  showSidebar?: boolean;
}

interface BookingCounts {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  refunded: number;
}

export default function BookingLayout({ children, showSidebar = true }: BookingLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [bookingCounts, setBookingCounts] = useState<BookingCounts>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0,
    refunded: 0
  });

  useEffect(() => {
    if (showSidebar) {
      fetchBookingCounts();
    }
  }, [showSidebar]);

  const fetchBookingCounts = async () => {
    try {
      // Fetch counts for each status
      const responses = await Promise.all([
        fetch('/api/bookings?limit=1'), // Total count
        fetch('/api/bookings?status=pending&limit=1'),
        fetch('/api/bookings?status=confirmed&limit=1'),
        fetch('/api/bookings?status=completed&limit=1'),
        fetch('/api/bookings?status=cancelled&limit=1'),
        fetch('/api/bookings?status=refunded&limit=1')
      ]);

      const data = await Promise.all(responses.map(r => r.json()));

      if (data.every(d => d.success)) {
        setBookingCounts({
          total: data[0].total || 0,
          pending: data[1].total || 0,
          confirmed: data[2].total || 0,
          completed: data[3].total || 0,
          cancelled: data[4].total || 0,
          refunded: data[5].total || 0
        });
      }
    } catch (error) {
      console.error('Error fetching booking counts:', error);
    }
  };

  if (!showSidebar) {
    return <div className="min-h-screen bg-gray-50">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex">
        {/* Mobile sidebar overlay */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 z-50 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50" />
            <div className="absolute left-0 top-0 h-full">
              <BookingSidebar bookingCounts={bookingCounts} />
            </div>
          </div>
        )}

        {/* Desktop sidebar */}
        <div className="hidden lg:block">
          <BookingSidebar bookingCounts={bookingCounts} />
        </div>

        {/* Main content */}
        <div className="flex-1 flex flex-col">
          {/* Mobile header with menu button */}
          <div className="lg:hidden bg-white shadow-sm border-b border-gray-200 px-4 py-3">
            <div className="flex items-center justify-between">
              <h1 className="text-lg font-semibold text-gray-900">Bookings</h1>
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 rounded-md text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
              >
                {sidebarOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>

          {/* Main content area */}
          <div className="flex-1">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
}