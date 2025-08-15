import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    
    const tour = await prisma.tour.findUnique({
      where: { id },
      include: {
        tourLeader: true // Include tour leader information
      }
    });

    if (!tour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }

    // Add breadcrumb data
    const tourWithBreadcrumb = {
      ...tour,
      breadcrumb: ['Home', 'Tours', tour.title]
    };

    return NextResponse.json(tourWithBreadcrumb);
  } catch (error) {
    console.error('Error fetching tour:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tour' },
      { status: 500 }
    );
  }
}