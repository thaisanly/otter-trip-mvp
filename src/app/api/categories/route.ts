import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Public endpoint to get categories
export async function GET(request: NextRequest) {
  try {
    const categories = await prisma.tourCategory.findMany({
      where: {
        isActive: true
      },
      orderBy: [
        { displayOrder: 'asc' },
        { name: 'asc' }
      ]
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json(
      { error: 'Failed to fetch categories' },
      { status: 500 }
    );
  }
}