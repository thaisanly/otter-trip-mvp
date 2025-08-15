import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    const tourLeader = await prisma.tourLeader.findUnique({
      where: { id },
      include: {
        tours: true, // Include related tours
      },
    });

    if (!tourLeader) {
      return NextResponse.json(
        { error: 'Tour leader not found' },
        { status: 404 }
      );
    }

    // Format tours from the relation
    const formattedTours = tourLeader.tours.map(tour => ({
      id: tour.id,
      title: tour.title,
      image: tour.heroImage,
      duration: tour.duration,
      price: tour.price,
      rating: tour.rating,
      groupSize: tour.groupSize || 'Small group',
      description: tour.description || '',
      includes: tour.inclusions || [],
      dates: tour.dates || [],
    }));

    // Transform the data to match the expected format
    const formattedTourLeader = {
      id: tourLeader.id,
      name: tourLeader.name,
      image: tourLeader.image,
      location: tourLeader.location,
      rating: tourLeader.rating,
      reviewCount: tourLeader.reviewCount || 0,
      specialty: tourLeader.specialty,
      description: tourLeader.description,
      price: tourLeader.price,
      languages: tourLeader.languages || [],
      experience: tourLeader.experience,
      bio: tourLeader.bio,
      
      // Use expertise as specialties for the frontend
      specialties: tourLeader.expertise || [],
      
      // Add additional fields from the database
      tagline: tourLeader.description || '',
      coverImage: tourLeader.coverImage || 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80',
      yearsExperience: tourLeader.experience ? parseInt(tourLeader.experience) : 5,
      tripsCompleted: tourLeader.tourCompleteCount || 342,
      responseTime: tourLeader.averageResponseTime || '< 1 hour',
      about: tourLeader.bio || tourLeader.description || '',
      
      // Travel philosophy (can be stored in bio or as separate field)
      travelPhilosophy: "I believe travel should be about meaningful connections with both people and places. My approach is to go slow, immerse deeply, and leave a positive impact. I'm passionate about responsible tourism that benefits local communities and preserves natural environments.",
      
      // Parse JSON fields if they exist
      personality: tourLeader.travelStyle || ['High-energy', 'Educational', 'Social', 'Photography', 'Nature-focused'],
      travelStories: tourLeader.travelStories as any || [],
      countrySpecializations: tourLeader.countrySpecializations as any || [],
      tours: formattedTours, // Use the formatted tours from the relation
      reviews: tourLeader.reviews as any || [],
      certifications: tourLeader.certifications as any || [],
      
      // Additional data
      curatedTours: tourLeader.curatedTours as string[] || [],
      upcomingTours: tourLeader.upcomingTours as string[] || [],
      availability: tourLeader.availability,
    };

    return NextResponse.json(formattedTourLeader);
  } catch (error) {
    console.error('Error fetching tour leader:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}