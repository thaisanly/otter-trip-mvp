import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

export async function GET() {
  try {
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const categories = await prisma.tourCategory.findMany({
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

export async function POST(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.id || !body.name || !body.description || !body.coverImage) {
      return NextResponse.json(
        { error: 'Missing required fields: id (slug), name, description, coverImage' },
        { status: 400 }
      );
    }

    // Check if ID (slug) already exists
    const existingCategory = await prisma.tourCategory.findUnique({
      where: { id: body.id }
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: 'Category with this ID (slug) already exists' },
        { status: 400 }
      );
    }

    const category = await prisma.tourCategory.create({
      data: {
        id: body.id, // Using ID as slug
        name: body.name,
        description: body.description,
        coverImage: body.coverImage,
        icon: body.icon,
        interests: body.interests || [],
        isActive: body.isActive !== undefined ? body.isActive : true,
        displayOrder: body.displayOrder || 0,
      }
    });

    // Revalidate related paths
    revalidatePath('/admin/categories');
    revalidatePath('/explore');

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error creating category:', error);
    return NextResponse.json(
      { error: 'Failed to create category' },
      { status: 500 }
    );
  }
}