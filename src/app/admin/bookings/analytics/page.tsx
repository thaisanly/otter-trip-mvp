'use client';

import { useState, useEffect } from 'react';
import { BarChart3, TrendingUp, Users, DollarSign, Calendar, PieChart } from 'lucide-react';
import BookingLayout from '@/components/admin/booking/BookingLayout';

interface AnalyticsData {
  totalBookings: number;
  totalRevenue: number;
  averageBookingValue: number;
  statusBreakdown: {
    pending: number;
    confirmed: number;
    completed: number;
    cancelled: number;
    refunded: number;
  };
  monthlyTrends: {
    month: string;
    bookings: number;
    revenue: number;
  }[];
}

export default function BookingAnalyticsPage() {
  const [data, setData] = useState<AnalyticsData>({
    totalBookings: 0,
    totalRevenue: 0,
    averageBookingValue: 0,
    statusBreakdown: {
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
      refunded: 0
    },
    monthlyTrends: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAnalyticsData();
  }, []);

  const fetchAnalyticsData = async () => {
    try {
      setLoading(true);
      // Fetch all bookings for analytics
      const response = await fetch('/api/bookings?limit=1000');
      const result = await response.json();

      if (result.success) {
        const bookings = result.bookings;
        
        // Calculate analytics
        const totalBookings = bookings.length;
        const totalRevenue = bookings.reduce((sum: number, booking: any) => sum + booking.totalPrice, 0);
        const averageBookingValue = totalBookings > 0 ? totalRevenue / totalBookings : 0;
        
        // Status breakdown
        const statusBreakdown = bookings.reduce((acc: any, booking: any) => {
          acc[booking.status] = (acc[booking.status] || 0) + 1;
          return acc;
        }, {});

        // Monthly trends (simplified - last 6 months)
        const monthlyTrends = [];
        const now = new Date();
        for (let i = 5; i >= 0; i--) {
          const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
          const monthName = date.toLocaleDateString('en-US', { month: 'short', year: 'numeric' });
          
          const monthBookings = bookings.filter((booking: any) => {
            const bookingDate = new Date(booking.createdAt);
            return bookingDate.getMonth() === date.getMonth() && 
                   bookingDate.getFullYear() === date.getFullYear();
          });
          
          monthlyTrends.push({
            month: monthName,
            bookings: monthBookings.length,
            revenue: monthBookings.reduce((sum: number, booking: any) => sum + booking.totalPrice, 0)
          });
        }

        setData({
          totalBookings,
          totalRevenue,
          averageBookingValue,
          statusBreakdown: {
            pending: statusBreakdown.pending || 0,
            confirmed: statusBreakdown.confirmed || 0,
            completed: statusBreakdown.completed || 0,
            cancelled: statusBreakdown.cancelled || 0,
            refunded: statusBreakdown.refunded || 0
          },
          monthlyTrends
        });
      }
    } catch (error) {
      console.error('Error fetching analytics:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  if (loading) {
    return (
      <BookingLayout>
        <div className="container mx-auto px-4 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        </div>
      </BookingLayout>
    );
  }

  return (
    <BookingLayout>
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Booking Analytics</h1>
          <p className="text-gray-600">
            Insights and statistics about your bookings
          </p>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Users className="w-6 h-6 text-blue-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Bookings</h3>
                <p className="text-2xl font-bold text-gray-900">{data.totalBookings}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.totalRevenue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">Avg. Booking Value</h3>
                <p className="text-2xl font-bold text-gray-900">{formatCurrency(data.averageBookingValue)}</p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center">
              <div className="p-2 bg-orange-100 rounded-lg">
                <Calendar className="w-6 h-6 text-orange-600" />
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-gray-500">This Month</h3>
                <p className="text-2xl font-bold text-gray-900">
                  {data.monthlyTrends.length > 0 ? data.monthlyTrends[data.monthlyTrends.length - 1].bookings : 0}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Status Breakdown */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <PieChart className="w-5 h-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">Status Breakdown</h2>
            </div>
            
            <div className="space-y-4">
              {Object.entries(data.statusBreakdown).map(([status, count]) => {
                const percentage = data.totalBookings > 0 ? ((count / data.totalBookings) * 100).toFixed(1) : '0';
                const colors = {
                  pending: 'bg-yellow-500',
                  confirmed: 'bg-green-500',
                  completed: 'bg-blue-500',
                  cancelled: 'bg-red-500',
                  refunded: 'bg-gray-500'
                };
                
                return (
                  <div key={status} className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div className={`w-3 h-3 rounded-full ${colors[status as keyof typeof colors]} mr-3`}></div>
                      <span className="text-sm font-medium text-gray-700 capitalize">{status}</span>
                    </div>
                    <div className="flex items-center">
                      <span className="text-sm text-gray-600 mr-2">{count}</span>
                      <span className="text-xs text-gray-500">({percentage}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Monthly Trends */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex items-center mb-6">
              <BarChart3 className="w-5 h-5 text-gray-400 mr-2" />
              <h2 className="text-lg font-semibold text-gray-900">6-Month Trend</h2>
            </div>
            
            <div className="space-y-4">
              {data.monthlyTrends.map((month, index) => {
                const maxBookings = Math.max(...data.monthlyTrends.map(m => m.bookings));
                const barWidth = maxBookings > 0 ? (month.bookings / maxBookings) * 100 : 0;
                
                return (
                  <div key={index}>
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium text-gray-700">{month.month}</span>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">{month.bookings} bookings</div>
                        <div className="text-xs text-gray-500">{formatCurrency(month.revenue)}</div>
                      </div>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                        style={{ width: `${barWidth}%` }}
                      ></div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Additional Insights */}
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Key Insights</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Conversion Rate</h3>
              <p className="text-sm text-gray-600">
                {data.totalBookings > 0 
                  ? `${(((data.statusBreakdown.confirmed + data.statusBreakdown.completed) / data.totalBookings) * 100).toFixed(1)}% of bookings are confirmed or completed`
                  : 'No data available'
                }
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Cancellation Rate</h3>
              <p className="text-sm text-gray-600">
                {data.totalBookings > 0 
                  ? `${((data.statusBreakdown.cancelled / data.totalBookings) * 100).toFixed(1)}% of bookings are cancelled`
                  : 'No data available'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </BookingLayout>
  );
}