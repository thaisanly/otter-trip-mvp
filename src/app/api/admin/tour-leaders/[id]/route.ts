import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAuth();

    const data = await request.json();

    const tourLeader = await prisma.tourLeader.update({
      where: { id },
      data: {
        name: data.name,
        image: data.image, // Absolute URL
        coverImage: data.coverImage || undefined, // Cover image URL
        location: data.location,
        rating: data.rating,
        reviewCount: data.reviewCount,
        specialty: data.specialty,
        description: data.description,
        price: data.price,
        isSuperhost: data.isSuperhost,
        languages: data.languages,
        experience: data.experience,
        certifications: data.certifications,
        bio: data.bio,
        expertise: data.expertise,
        travelStyle: data.travelStyle,
        travelStories: data.travelStories,
        curatedTours: data.curatedTours,
        upcomingTours: data.upcomingTours,
        countrySpecializations: data.countrySpecializations,
        tourCompleteCount: data.tourCompleteCount,
        averageResponseTime: data.averageResponseTime,
        tours: data.tours,
        reviews: data.reviews,
        availability: data.availability,
      },
    });

    // Revalidate related paths to ensure fresh data
    revalidatePath(`/admin/tour-leaders/${id}`);
    revalidatePath('/admin/tour-leaders');
    revalidatePath(`/tour-leaders/${id}`);
    revalidatePath('/tour-leaders');

    return NextResponse.json(tourLeader);
  } catch (error) {
    console.error('Error updating tour leader:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAuth();

    await prisma.tourLeader.delete({
      where: { id },
    });

    // Revalidate related paths after deletion
    revalidatePath('/admin/tour-leaders');
    revalidatePath('/tour-leaders');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tour leader:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}