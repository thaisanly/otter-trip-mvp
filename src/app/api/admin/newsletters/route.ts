import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

// Verify admin authentication
async function verifyAdmin(request: NextRequest) {
  const authHeader = request.headers.get('authorization');
  if (!authHeader || !authHeader.startsWith('Basic ')) {
    return false;
  }

  const credentials = Buffer.from(authHeader.slice(6), 'base64').toString();
  const [email, password] = credentials.split(':');

  const admin = await prisma.admin.findUnique({
    where: { email },
  });

  if (!admin || !admin.isActive) {
    return false;
  }

  const isValid = await bcrypt.compare(password, admin.password);
  return isValid;
}

// GET - List newsletter subscribers with search
export async function GET(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAuthenticated = await verifyAdmin(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get('search') || '';
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '20');
    const status = searchParams.get('status'); // 'confirmed', 'pending', or null for all

    // Build where clause
    const where: any = {};
    
    if (search) {
      where.email = {
        contains: search,
        mode: 'insensitive',
      };
    }

    if (status === 'confirmed') {
      where.isConfirmed = true;
    } else if (status === 'pending') {
      where.isConfirmed = false;
    }

    // Get total count
    const total = await prisma.newsletter.count({ where });

    // Get paginated results
    const subscribers = await prisma.newsletter.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
      select: {
        id: true,
        email: true,
        isConfirmed: true,
        confirmedAt: true,
        createdAt: true,
      },
    });

    return NextResponse.json({
      subscribers,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching newsletter subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch subscribers' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

// DELETE - Bulk delete newsletter subscribers
export async function DELETE(request: NextRequest) {
  try {
    // Verify admin authentication
    const isAuthenticated = await verifyAdmin(request);
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { ids } = await request.json();

    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return NextResponse.json(
        { error: 'Please provide subscriber IDs to delete' },
        { status: 400 }
      );
    }

    // Delete subscribers
    const result = await prisma.newsletter.deleteMany({
      where: {
        id: {
          in: ids,
        },
      },
    });

    return NextResponse.json({
      message: `Successfully deleted ${result.count} subscriber(s)`,
      deletedCount: result.count,
    });
  } catch (error) {
    console.error('Error deleting newsletter subscribers:', error);
    return NextResponse.json(
      { error: 'Failed to delete subscribers' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}