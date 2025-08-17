import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET() {
  try {
    await requireAuth();

    const experts = await prisma.expert.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(experts);
  } catch (error) {
    console.error('Error fetching experts:', error);
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

    // Validate and convert hourlyRate to string integer
    const hourlyRateValue = parseInt(data.hourlyRate);
    if (isNaN(hourlyRateValue) || hourlyRateValue < 0) {
      return NextResponse.json(
        { error: 'Invalid hourly rate. Must be a positive integer.' },
        { status: 400 }
      );
    }

    const expert = await prisma.expert.create({
      data: {
        name: data.name,
        title: data.title,
        image: data.image, // Absolute URL
        banner: data.banner || null, // Banner image URL
        location: data.location,
        rating: data.rating || 0,
        reviewCount: data.reviewCount || 0,
        hourlyRate: String(hourlyRateValue), // Convert to string integer
        languages: data.languages || [],
        expertise: data.expertise || [],
        certifications: data.certifications || [],
        availability: data.availability || null,
        bio: data.bio || null,
        experience: data.experience || null,
        featuredTours: data.featuredTours || null,
        socialMedia: data.socialMedia || null,
        latestVideos: data.latestVideos || null,
      },
    });

    return NextResponse.json(expert);
  } catch (error) {
    console.error('Error creating expert:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}