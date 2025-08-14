import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');
    const category = searchParams.get('category');

    if (id) {
      // Get single tour by ID
      const tour = await prisma.tour.findUnique({
        where: { id },
      });

      if (!tour) {
        return NextResponse.json({ error: 'Tour not found' }, { status: 404 });
      }

      return NextResponse.json(tour);
    }

    // Get all tours or filter by category
    let tours;
    if (category) {
      // Filter tours by category (categories is a JSON array)
      tours = await prisma.tour.findMany({
        where: {
          OR: [
            { categories: { array_contains: category } },
            { categories: { string_contains: category } },
          ],
        },
      });
    } else {
      tours = await prisma.tour.findMany();
    }

    return NextResponse.json(tours);
  } catch (error) {
    console.error('Error fetching tours:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tours' },
      { status: 500 }
    );
  }
}