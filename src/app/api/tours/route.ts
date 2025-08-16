import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';

// Input validation schemas
const tourQuerySchema = z.object({
  id: z.string().uuid().optional(),
  category: z.string().min(1).max(50).optional(),
  limit: z.string().transform(val => Math.min(parseInt(val) || 100, 1000)).optional(),
});

interface Tour {
  id: string;
  title: string;
  description: string;
  location: string;
  duration: string;
  price: number;
  rating: number;
  totalJoined: number;
  imageUrl: string;
  overview: string[];
  highlights: string[];
  galleryImages: string[];
  inclusions: string[];
  exclusions: string[];
  itinerary: { day: number; title: string; description: string; activities: string[] }[];
  additionalInfo: string[];
  dates: string[];
  reviews: { id: string; rating: number; comment: string; author: string; date: string }[];
  categories: string[];
  tourLeaderId?: string;
  tourLeader?: { id: string; name: string; image: string; rating: number };
}

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Validate input parameters
    const validationResult = tourQuerySchema.safeParse({
      id: searchParams.get('id'),
      category: searchParams.get('category'),
      limit: searchParams.get('limit'),
    });
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validationResult.error.issues },
        { status: 400 }
      );
    }
    
    const { id, category, limit } = validationResult.data;

    if (id) {
      // Get single tour by ID
      const tour = await prisma.tour.findUnique({
        where: { id },
        include: {
          tourLeader: true // Include tour leader information
        }
      });

      if (!tour) {
        return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
      }

      return NextResponse.json(tour);
    }

    // Get all tours or filter by category
    let tours;
    if (category) {
      tours = await prisma.tour.findMany({
        where: {
          categories: {
            array_contains: [category]
          }
        },
        include: {
          tourLeader: true // Include tour leader information
        },
        orderBy: [
          { rating: 'desc' },
          { totalJoined: 'desc' }
        ],
        take: limit || 100
      });
    } else {
      tours = await prisma.tour.findMany({
        include: {
          tourLeader: true // Include tour leader information
        },
        orderBy: [
          { rating: 'desc' },
          { totalJoined: 'desc' }
        ],
        take: limit
      });
    }

    // Transform tours to ensure consistent format with type safety
    const transformedTours = tours.map((tour): Tour => ({
      id: tour.id,
      title: tour.title,
      description: tour.description || '',
      location: tour.location,
      duration: tour.duration,
      price: parseFloat(tour.price.replace(/[^0-9.]/g, '')) || 0,
      rating: tour.rating,
      totalJoined: tour.totalJoined,
      imageUrl: tour.heroImage,
      overview: Array.isArray(tour.overview) ? tour.overview as string[] : [],
      highlights: Array.isArray(tour.highlights) ? tour.highlights as string[] : [],
      galleryImages: Array.isArray(tour.galleryImages) ? tour.galleryImages as string[] : [],
      inclusions: Array.isArray(tour.inclusions) ? tour.inclusions as string[] : [],
      exclusions: Array.isArray(tour.exclusions) ? tour.exclusions as string[] : [],
      itinerary: Array.isArray(tour.itinerary) ? tour.itinerary as Array<{
        day: number;
        title: string;
        description: string;
        activities: string[];
      }> : [],
      additionalInfo: Array.isArray(tour.additionalInfo) ? tour.additionalInfo as string[] : [],
      dates: Array.isArray(tour.dates) ? tour.dates as string[] : [],
      reviews: Array.isArray(tour.reviews) ? tour.reviews as Array<{
        id: string;
        rating: number;
        comment: string;
        author: string;
        date: string;
      }> : [],
      categories: Array.isArray(tour.categories) ? tour.categories as string[] : [],
      tourLeaderId: tour.tourLeaderId ?? undefined,
      tourLeader: tour.tourLeader ? {
        id: tour.tourLeader.id,
        name: tour.tourLeader.name,
        image: tour.tourLeader.image,
        rating: tour.tourLeader.rating
      } : undefined
    }));

    return NextResponse.json(transformedTours);
  } catch (error) {
    console.error('[API] Error fetching tours:', error);
    
    // Don't expose internal error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch tours',
        ...(isDevelopment && { details: error instanceof Error ? error.message : 'Unknown error' })
      },
      { status: 500 }
    );
  }
}