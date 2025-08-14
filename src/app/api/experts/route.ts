import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const id = searchParams.get('id');

    if (id) {
      // Get single expert by ID
      const expert = await prisma.expert.findUnique({
        where: { id },
      });

      if (!expert) {
        return NextResponse.json({ error: 'Expert not found' }, { status: 404 });
      }

      return NextResponse.json(expert);
    }

    // Get all experts
    const experts = await prisma.expert.findMany({
      orderBy: { rating: 'desc' },
    });

    return NextResponse.json(experts);
  } catch (error) {
    console.error('Error fetching experts:', error);
    return NextResponse.json(
      { error: 'Failed to fetch experts' },
      { status: 500 }
    );
  }
}