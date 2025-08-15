'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  UsersIcon,
  UserIcon,
  MapPinIcon,
  CalendarCheckIcon,
  PhoneCallIcon,
  MessageSquareIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from 'lucide-react';

interface AdminDashboardProps {
  admin: {
    id: string;
    email: string;
    name: string;
    role: string;
  };
}

interface DashboardStats {
  tourLeaders: { total: number; change: string; changeType: 'positive' | 'negative' | 'neutral' };
  experts: { total: number; change: string; changeType: 'positive' | 'negative' | 'neutral' };
  tours: { total: number; change: string; changeType: 'positive' | 'negative' | 'neutral' };
  bookings: { 
    total: number; 
    pending: number; 
    confirmed: number; 
    cancelled: number; 
    recent: number; 
    change: string; 
    changeType: 'positive' | 'negative' | 'neutral' 
  };
  consultations: { 
    total: number; 
    pending: number; 
    confirmed: number; 
    cancelled: number; 
    change: string; 
    changeType: 'positive' | 'negative' | 'neutral' 
  };
  inquiries: { 
    total: number; 
    recent: number; 
    change: string; 
    changeType: 'positive' | 'negative' | 'neutral' 
  };
}

export default function AdminDashboard({ admin }: AdminDashboardProps) {
  const router = useRouter();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/dashboard/stats');
      const data = await response.json();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const getChangeIcon = (changeType: string) => {
    if (changeType === 'positive') return TrendingUpIcon;
    if (changeType === 'negative') return TrendingDownIcon;
    return null;
  };

  const statsCards = [
    {
      title: 'Tour Leaders',
      value: stats?.tourLeaders?.total || 0,
      icon: UsersIcon,
      change: stats?.tourLeaders?.change || '+0%',
      changeType: stats?.tourLeaders?.changeType || 'neutral',
      color: 'text-blue-600',
      bgColor: 'bg-blue-100',
      href: '/admin/tour-leaders',
    },
    {
      title: 'Experts',
      value: stats?.experts?.total || 0,
      icon: UserIcon,
      change: stats?.experts?.change || '+0%',
      changeType: stats?.experts?.changeType || 'neutral',
      color: 'text-purple-600',
      bgColor: 'bg-purple-100',
      href: '/admin/experts',
    },
    {
      title: 'Tours',
      value: stats?.tours?.total || 0,
      icon: MapPinIcon,
      change: stats?.tours?.change || '+0%',
      changeType: stats?.tours?.changeType || 'neutral',
      color: 'text-green-600',
      bgColor: 'bg-green-100',
      href: '/admin/tours',
    },
    {
      title: 'Total Bookings',
      value: stats?.bookings?.total || 0,
      icon: CalendarCheckIcon,
      change: stats?.bookings?.change || '+0%',
      changeType: stats?.bookings?.changeType || 'neutral',
      color: 'text-orange-600',
      bgColor: 'bg-orange-100',
      href: '/admin/bookings',
      subtitle: `${stats?.bookings?.pending || 0} pending, ${stats?.bookings?.confirmed || 0} confirmed`,
    },
    {
      title: 'Consultations',
      value: stats?.consultations?.total || 0,
      icon: PhoneCallIcon,
      change: stats?.consultations?.change || '+0%',
      changeType: stats?.consultations?.changeType || 'neutral',
      color: 'text-cyan-600',
      bgColor: 'bg-cyan-100',
      href: '/admin/consultations',
      subtitle: `${stats?.consultations?.pending || 0} pending, ${stats?.consultations?.confirmed || 0} confirmed`,
    },
    {
      title: 'Inquiries',
      value: stats?.inquiries?.total || 0,
      icon: MessageSquareIcon,
      change: stats?.inquiries?.change || '+0%',
      changeType: stats?.inquiries?.changeType || 'neutral',
      color: 'text-pink-600',
      bgColor: 'bg-pink-100',
      href: '/admin/inquiries',
      subtitle: `${stats?.inquiries?.recent || 0} in last 7 days`,
    },
  ];

  return (
    <div className="p-6">
      {/* Welcome Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          Welcome back, {admin.name}!
        </h1>
        <p className="text-gray-600 mt-2">
          Here's an overview of your platform's key metrics and activities.
        </p>
      </div>

      {/* Stats Grid */}
      {loading ? (
        <div className="flex justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {statsCards.map((stat, index) => {
            const Icon = stat.icon;
            const ChangeIcon = getChangeIcon(stat.changeType);
            return (
              <div
                key={index}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow cursor-pointer"
                onClick={() => stat.href && router.push(stat.href)}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                    <Icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="flex items-center gap-1">
                    {ChangeIcon && (
                      <ChangeIcon
                        className={`w-4 h-4 ${
                          stat.changeType === 'positive'
                            ? 'text-green-600'
                            : stat.changeType === 'negative'
                            ? 'text-red-600'
                            : 'text-gray-400'
                        }`}
                      />
                    )}
                    <span
                      className={`text-sm font-medium ${
                        stat.changeType === 'positive'
                          ? 'text-green-600'
                          : stat.changeType === 'negative'
                          ? 'text-red-600'
                          : 'text-gray-500'
                      }`}
                    >
                      {stat.change}
                    </span>
                  </div>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                <p className="text-sm font-medium text-gray-700 mt-1">{stat.title}</p>
                {stat.subtitle && (
                  <p className="text-xs text-gray-500 mt-2">{stat.subtitle}</p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}