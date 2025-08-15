'use client';

import { useState } from 'react';
import { Users, CheckSquare, Mail, Download } from 'lucide-react';
import BookingLayout from '@/components/admin/booking/BookingLayout';

export default function BulkActionsPage() {
  const [selectedAction, setSelectedAction] = useState('');

  return (
    <BookingLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Bulk Actions</h1>
          <p className="text-gray-600">
            Perform actions on multiple bookings at once
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="text-center py-16">
            <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Bulk Actions</h3>
            <p className="text-gray-600 mb-6">
              Select multiple bookings from the main booking list to perform bulk actions
            </p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
              <div className="p-4 border border-gray-200 rounded-lg">
                <CheckSquare className="w-8 h-8 text-blue-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Update Status</h4>
                <p className="text-sm text-gray-600">Change status for multiple bookings</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <Mail className="w-8 h-8 text-green-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Send Emails</h4>
                <p className="text-sm text-gray-600">Send notifications to travelers</p>
              </div>
              <div className="p-4 border border-gray-200 rounded-lg">
                <Download className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                <h4 className="font-medium text-gray-900">Export Data</h4>
                <p className="text-sm text-gray-600">Download booking details</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </BookingLayout>
  );
}