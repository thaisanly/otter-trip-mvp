import { NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Fetch all statistics in parallel
    const [
      tourLeadersCount,
      expertsCount,
      toursCount,
      bookingsCount,
      consultationsCount,
      inquiriesCount,
      recentBookings,
      recentInquiries,
      consultationCodesStats,
      bookingsByStatus,
      consultationsByStatus,
    ] = await Promise.all([
      // Count tour leaders
      prisma.tourLeader.count(),
      
      // Count experts
      prisma.expert.count(),
      
      // Count tours
      prisma.tour.count(),
      
      // Count bookings
      prisma.booking.count(),
      
      // Count consultation bookings
      prisma.consultationBooking.count(),
      
      // Count inquiries
      prisma.inquiry.count(),
      
      // Get recent bookings (last 7 days)
      prisma.booking.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      
      // Get recent inquiries (last 7 days)
      prisma.inquiry.count({
        where: {
          createdAt: {
            gte: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        },
      }),
      
      // Get consultation codes stats
      prisma.consultationCode.groupBy({
        by: ['status'],
        _count: true,
      }),
      
      // Get bookings by status
      prisma.booking.groupBy({
        by: ['status'],
        _count: true,
      }),
      
      // Get consultations by status
      prisma.consultationBooking.groupBy({
        by: ['status'],
        _count: true,
      }),
    ]);

    // Calculate percentage changes (mock data for now - in production, compare with previous period)
    const calculateChange = (current: number, isPositive = true) => {
      const changePercent = Math.floor(Math.random() * 30) + 1;
      return isPositive ? `+${changePercent}%` : `-${changePercent}%`;
    };

    // Process consultation codes stats
    const codeStats = {
      total: consultationCodesStats.reduce((acc, curr) => acc + curr._count, 0),
      active: consultationCodesStats.find(s => s.status === 'active')?._count || 0,
      expired: consultationCodesStats.find(s => s.status === 'expired')?._count || 0,
    };

    // Process booking stats
    const bookingStats = {
      total: bookingsCount,
      pending: bookingsByStatus.find(s => s.status === 'pending')?._count || 0,
      confirmed: bookingsByStatus.find(s => s.status === 'confirmed')?._count || 0,
      cancelled: bookingsByStatus.find(s => s.status === 'cancelled')?._count || 0,
    };

    // Process consultation stats
    const consultationStats = {
      total: consultationsCount,
      pending: consultationsByStatus.find(s => s.status === 'pending')?._count || 0,
      confirmed: consultationsByStatus.find(s => s.status === 'confirmed')?._count || 0,
      cancelled: consultationsByStatus.find(s => s.status === 'cancelled')?._count || 0,
    };

    const stats = {
      tourLeaders: {
        total: tourLeadersCount,
        change: calculateChange(tourLeadersCount),
        changeType: 'positive' as const,
      },
      experts: {
        total: expertsCount,
        change: calculateChange(expertsCount),
        changeType: 'positive' as const,
      },
      tours: {
        total: toursCount,
        change: calculateChange(toursCount),
        changeType: 'positive' as const,
      },
      bookings: {
        ...bookingStats,
        recent: recentBookings,
        change: calculateChange(bookingsCount),
        changeType: recentBookings > 0 ? 'positive' as const : 'neutral' as const,
      },
      consultations: {
        ...consultationStats,
        change: calculateChange(consultationsCount),
        changeType: 'positive' as const,
      },
      inquiries: {
        total: inquiriesCount,
        recent: recentInquiries,
        change: calculateChange(inquiriesCount),
        changeType: recentInquiries > 0 ? 'positive' as const : 'neutral' as const,
      },
      consultationCodes: codeStats,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch dashboard statistics' },
      { status: 500 }
    );
  }
}