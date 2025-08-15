import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const limit = parseInt(searchParams.get('limit') || '100');
    const compact = searchParams.get('compact') === 'true';

    const tours = await prisma.tour.findMany({
      where: search ? {
        OR: [
          { title: { contains: search, mode: 'insensitive' } },
          { location: { contains: search, mode: 'insensitive' } },
          { code: { contains: search, mode: 'insensitive' } }
        ]
      } : undefined,
      select: compact ? {
        id: true,
        code: true,
        title: true,
        heroImage: true,
        duration: true,
        price: true,
        location: true,
        rating: true,
        reviewCount: true,
        categories: true,
        tourLeaderId: true
      } : undefined,
      include: !compact ? {
        tourLeader: true
      } : undefined,
      orderBy: {
        createdAt: 'desc'
      },
      take: limit
    });

    return NextResponse.json(compact ? { tours } : tours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tours' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.heroImage || !body.location) {
      return NextResponse.json(
        { error: 'Missing required fields: title, heroImage, location' },
        { status: 400 }
      );
    }

    // Check if code already exists if provided
    if (body.code) {
      const existingTour = await prisma.tour.findUnique({
        where: { code: body.code }
      });
      
      if (existingTour) {
        return NextResponse.json(
          { error: 'Tour code already exists' },
          { status: 400 }
        );
      }
    }

    const tour = await prisma.tour.create({
      data: {
        code: body.code,
        title: body.title,
        heroImage: body.heroImage,
        duration: body.duration || '',
        price: body.price || '',
        totalJoined: body.totalJoined || 0,
        rating: body.rating || 0,
        reviewCount: body.reviewCount || 0,
        location: body.location,
        categories: body.categories || [],
        overview: body.overview || [],
        highlights: body.highlights || [],
        contentImage: body.contentImage,
        videoUrl: body.videoUrl,
        galleryImages: body.galleryImages || [],
        inclusions: body.inclusions || [],
        exclusions: body.exclusions || [],
        itinerary: body.itinerary || [],
        description: body.description,
        groupSize: body.groupSize,
        spotsLeft: body.spotsLeft,
        tourLeaderId: body.tourLeaderId || null,
      }
    });

    return NextResponse.json(tour, { status: 201 });
  } catch (error) {
    console.error('Error creating tour:', error);
    return NextResponse.json(
      { error: 'Failed to create tour' },
      { status: 500 }
    );
  }
}