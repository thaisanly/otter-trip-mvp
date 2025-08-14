import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
      // Get single tour leader by ID
      const tourLeader = await prisma.tourLeader.findUnique({
        where: { id },
      });

      if (!tourLeader) {
        return NextResponse.json({ error: 'Tour leader not found' }, { status: 404 });
      }

      return NextResponse.json(tourLeader);
    }

    // Get all tour leaders
    const tourLeaders = await prisma.tourLeader.findMany({
      orderBy: { rating: 'desc' },
    });

    return NextResponse.json(tourLeaders);
  } catch (error) {
    console.error('Error fetching tour leaders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch tour leaders' },
      { status: 500 }
    );
  }
}