import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAuth();

    const { featuredTours } = await request.json();

    // Validate that featuredTours is an array of strings (tour IDs)
    if (!Array.isArray(featuredTours) || !featuredTours.every(id => typeof id === 'string')) {
      return NextResponse.json(
        { error: 'Featured tours must be an array of tour IDs' },
        { status: 400 }
      );
    }

    // Validate that all tour IDs exist
    if (featuredTours.length > 0) {
      const existingTours = await prisma.tour.findMany({
        where: { id: { in: featuredTours } },
        select: { id: true }
      });
      
      if (existingTours.length !== featuredTours.length) {
        const existingIds = existingTours.map(tour => tour.id);
        const missingIds = featuredTours.filter(id => !existingIds.includes(id));
        return NextResponse.json(
          { error: `Tour IDs not found: ${missingIds.join(', ')}` },
          { status: 400 }
        );
      }
    }

    // Update expert's featured tours
    const expert = await prisma.expert.update({
      where: { id },
      data: {
        featuredTours: featuredTours,
      },
    });

    return NextResponse.json({ 
      success: true, 
      featuredTours: expert.featuredTours,
      message: `Updated featured tours for ${expert.name}` 
    });
  } catch (error) {
    console.error('Error updating featured tours:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    // No auth required for public viewing

    const expert = await prisma.expert.findUnique({
      where: { id },
      select: { 
        id: true, 
        name: true, 
        featuredTours: true 
      }
    });

    if (!expert) {
      return NextResponse.json(
        { error: 'Expert not found' },
        { status: 404 }
      );
    }

    // Get tour details for featured tours
    const featuredTourIds = expert.featuredTours as string[] || [];
    const tours = await prisma.tour.findMany({
      where: { id: { in: featuredTourIds } },
      select: {
        id: true,
        title: true,
        heroImage: true,
        duration: true,
        price: true,
        location: true,
        rating: true,
        reviewCount: true,
        categories: true
      }
    });

    return NextResponse.json({
      expertId: expert.id,
      expertName: expert.name,
      featuredTours: tours
    });
  } catch (error) {
    console.error('Error fetching featured tours:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}