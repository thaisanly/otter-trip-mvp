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

    const expert = await prisma.expert.update({
      where: { id },
      data: {
        name: data.name,
        title: data.title,
        image: data.image, // Absolute URL
        banner: data.banner, // Banner image URL
        location: data.location,
        rating: data.rating,
        reviewCount: data.reviewCount,
        hourlyRate: data.hourlyRate,
        languages: data.languages,
        expertise: data.expertise,
        certifications: data.certifications,
        availability: data.availability,
        bio: data.bio,
        experience: data.experience,
        featuredTours: data.featuredTours,
        socialMedia: data.socialMedia,
        latestVideos: data.latestVideos,
      },
    });

    // Revalidate related paths to ensure fresh data
    revalidatePath(`/admin/experts/${id}`);
    revalidatePath('/admin/experts');
    revalidatePath(`/meet-experts/${id}`);
    revalidatePath('/meet-experts');

    return NextResponse.json(expert);
  } catch (error) {
    console.error('Error updating expert:', error);
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

    await prisma.expert.delete({
      where: { id },
    });

    // Revalidate related paths after deletion
    revalidatePath('/admin/experts');
    revalidatePath('/meet-experts');

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting expert:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}