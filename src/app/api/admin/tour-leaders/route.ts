import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';
import { generateTourLeaderSlug } from '@/utils/slug';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const tourLeaders = await prisma.tourLeader.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(tourLeaders);
  } catch (error) {
    console.error('Error fetching tour leaders:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const data = await request.json();

    // Generate a unique slug ID from the tour leader's name
    const slugId = await generateTourLeaderSlug(
      data.name,
      async (slug) => {
        const existing = await prisma.tourLeader.findUnique({
          where: { id: slug },
        });
        return !!existing;
      }
    );

    const tourLeader = await prisma.tourLeader.create({
      data: {
        id: slugId, // Use the generated slug as the ID
        name: data.name,
        image: data.image, // Absolute URL
        coverImage: data.coverImage || null, // Cover image URL
        location: data.location,
        rating: data.rating || 0,
        reviewCount: data.reviewCount || 0,
        specialty: data.specialty,
        description: data.description,
        price: data.price,
        isSuperhost: data.isSuperhost || false,
        languages: data.languages || [],
        experience: data.experience || null,
        certifications: data.certifications || [],
        bio: data.bio || null,
        expertise: data.expertise || [],
        travelStyle: data.travelStyle || [],
        travelStories: data.travelStories || [],
        curatedTours: data.curatedTours || [],
        upcomingTours: data.upcomingTours || [],
        countrySpecializations: data.countrySpecializations || [],
        tourCompleteCount: data.tourCompleteCount || null,
        averageResponseTime: data.averageResponseTime || null,
        tours: data.tours || [],
        reviews: data.reviews || [],
        availability: data.availability || null,
      },
    });

    return NextResponse.json(tourLeader);
  } catch (error) {
    console.error('Error creating tour leader:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}