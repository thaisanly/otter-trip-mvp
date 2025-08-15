import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { z } from 'zod';
import type { Prisma } from '@prisma/client';

// Input validation schema
const expertQuerySchema = z.object({
  id: z.string().min(1).optional(), // Changed from UUID to any non-empty string
  active: z.string().transform(val => val === 'true').optional(),
});

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    
    // Validate input parameters - only include non-null values
    const queryParams: Record<string, string> = {};
    const idParam = searchParams.get('id');
    const activeParam = searchParams.get('active');
    
    if (idParam) queryParams.id = idParam;
    if (activeParam) queryParams.active = activeParam;
    
    const validationResult = expertQuerySchema.safeParse(queryParams);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid query parameters', details: validationResult.error.issues },
        { status: 400 }
      );
    }
    
    const { id, active: activeOnly } = validationResult.data;

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

    // Build where clause with proper typing
    const whereClause: Prisma.ExpertWhereInput = {};
    if (activeOnly) {
      whereClause.isActive = true;
    }

    // Get experts with optional active filter
    const experts = await prisma.expert.findMany({
      where: whereClause,
      orderBy: { rating: 'desc' },
    });

    return NextResponse.json(experts);
  } catch (error) {
    console.error('[API] Error fetching experts:', error);
    
    // Don't expose internal error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
      { 
        error: 'Failed to fetch experts',
        ...(isDevelopment && { details: error instanceof Error ? error.message : 'Unknown error' })
      },
      { status: 500 }
    );
  }
}