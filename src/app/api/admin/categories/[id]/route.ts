import { NextRequest, NextResponse } from 'next/server';
import { revalidatePath } from 'next/cache';
import { prisma } from '@/lib/prisma';
import { getCurrentAdmin } from '@/lib/auth';

interface RouteParams {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const category = await prisma.tourCategory.findUnique({
      where: { id }
    });

    if (!category) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error fetching category:', error);
    return NextResponse.json(
      { error: 'Failed to fetch category' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Validate required fields
    if (!body.name || !body.description || !body.coverImage) {
      return NextResponse.json(
        { error: 'Missing required fields: name, description, coverImage' },
        { status: 400 }
      );
    }

    // Check if category exists
    const existingCategory = await prisma.tourCategory.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Note: ID cannot be changed since it's the primary key (slug)

    const category = await prisma.tourCategory.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        coverImage: body.coverImage,
        icon: body.icon,
        interests: body.interests || [],
        isActive: body.isActive !== undefined ? body.isActive : existingCategory.isActive,
        displayOrder: body.displayOrder !== undefined ? body.displayOrder : existingCategory.displayOrder,
      }
    });

    // Revalidate related paths
    revalidatePath(`/admin/categories/${id}`);
    revalidatePath('/admin/categories');
    revalidatePath(`/explore/${category.id}`);
    revalidatePath('/explore');

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error updating category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    
    // Check if category exists
    const existingCategory = await prisma.tourCategory.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    const category = await prisma.tourCategory.update({
      where: { id },
      data: body
    });

    // Revalidate related paths
    revalidatePath(`/admin/categories/${id}`);
    revalidatePath('/admin/categories');
    revalidatePath('/explore');

    return NextResponse.json(category);
  } catch (error) {
    console.error('Error patching category:', error);
    return NextResponse.json(
      { error: 'Failed to update category' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check if category exists
    const existingCategory = await prisma.tourCategory.findUnique({
      where: { id }
    });

    if (!existingCategory) {
      return NextResponse.json(
        { error: 'Category not found' },
        { status: 404 }
      );
    }

    // Delete the category
    await prisma.tourCategory.delete({
      where: { id }
    });

    // Revalidate related paths
    revalidatePath('/admin/categories');
    revalidatePath('/explore');

    return NextResponse.json(
      { message: 'Category deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting category:', error);
    return NextResponse.json(
      { error: 'Failed to delete category' },
      { status: 500 }
    );
  }
}