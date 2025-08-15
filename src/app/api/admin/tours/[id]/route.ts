import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
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
        tourLeader: true
      }
    });

    if (!tour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Error fetching tour:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tour' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();
    
    // Validate required fields
    if (!body.title || !body.heroImage || !body.location) {
      return NextResponse.json(
        { error: 'Missing required fields: title, heroImage, location' },
        { status: 400 }
      );
    }

    // Check if tour exists
    const existingTour = await prisma.tour.findUnique({
      where: { id }
    });

    if (!existingTour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }

    // Check if code is being changed and if it conflicts with another tour
    if (body.code && body.code !== existingTour.code) {
      const codeConflict = await prisma.tour.findUnique({
        where: { code: body.code }
      });
      
      if (codeConflict) {
        return NextResponse.json(
          { error: 'Tour code already exists' },
          { status: 400 }
        );
      }
    }

    const tour = await prisma.tour.update({
      where: { id },
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

    // Revalidate related paths to ensure fresh data
    revalidatePath(`/admin/tours/${id}`);
    revalidatePath('/admin/tours');
    revalidatePath(`/tours/${id}`);
    revalidatePath('/tours');
    revalidatePath(`/booking/${id}`);

    return NextResponse.json(tour);
  } catch (error) {
    console.error('Error updating tour:', error);
    return NextResponse.json(
      { error: 'Failed to update tour' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    // Check if tour exists
    const existingTour = await prisma.tour.findUnique({
      where: { id }
    });

    if (!existingTour) {
      return NextResponse.json(
        { error: 'Tour not found' },
        { status: 404 }
      );
    }

    // Delete the tour
    await prisma.tour.delete({
      where: { id }
    });

    // Revalidate related paths after deletion
    revalidatePath('/admin/tours');
    revalidatePath('/tours');

    return NextResponse.json(
      { message: 'Tour deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting tour:', error);
    return NextResponse.json(
      { error: 'Failed to delete tour' },
      { status: 500 }
    );
  }
}