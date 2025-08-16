import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    const {
      tourId,
      tourTitle,
      location,
      selectedDate,
      participants,
      pricePerPerson,
      totalPrice,
      leadTraveler,
      additionalTravelers,
      specialRequests,
      bookingReference
    } = body;

    // Create booking in database
    const booking = await prisma.booking.create({
      data: {
        bookingReference,
        tourId,
        tourTitle,
        location: location || '',
        selectedDate,
        participants,
        pricePerPerson,
        totalPrice,
        leadTraveler,
        additionalTravelers: additionalTravelers || [],
        specialRequests: specialRequests || '',
        status: 'confirmed'
      }
    });

    return NextResponse.json({ 
      success: true, 
      booking,
      message: 'Booking saved successfully' 
    });
  } catch (error) {
    console.error('Error saving booking:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to save booking',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const bookingReference = searchParams.get('reference');
    
    if (bookingReference) {
      // Get specific booking by reference
      const booking = await prisma.booking.findUnique({
        where: { bookingReference }
      });
      
      if (!booking) {
        return NextResponse.json(
          { success: false, error: 'Booking not found' },
          { status: 404 }
        );
      }
      
      return NextResponse.json({ success: true, booking });
    } else {
      // Get all bookings with filtering and sorting
      const status = searchParams.get('status');
      const location = searchParams.get('location');
      const tourTitle = searchParams.get('tourTitle');
      const sortBy = searchParams.get('sortBy') || 'createdAt';
      const sortOrder = searchParams.get('sortOrder') || 'desc';
      const page = parseInt(searchParams.get('page') || '1');
      const limit = parseInt(searchParams.get('limit') || '10');
      
      // Build where clause
      const whereClause: Record<string, unknown> = {};
      
      if (status) {
        whereClause.status = status;
      }
      
      if (location) {
        whereClause.location = {
          contains: location,
          mode: 'insensitive'
        };
      }
      
      if (tourTitle) {
        whereClause.tourTitle = {
          contains: tourTitle,
          mode: 'insensitive'
        };
      }
      
      // Build order by clause
      const orderBy: Record<string, string> = {};
      orderBy[sortBy] = sortOrder;
      
      // Get total count for pagination
      const total = await prisma.booking.count({ where: whereClause });
      
      // Get bookings with filters
      const bookings = await prisma.booking.findMany({
        where: whereClause,
        orderBy,
        skip: (page - 1) * limit,
        take: limit
      });
      
      return NextResponse.json({ 
        success: true, 
        bookings,
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      });
    }
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to fetch bookings',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}