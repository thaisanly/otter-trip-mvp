import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth, getCurrentAdmin } from '@/lib/auth';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const code = await prisma.consultationCode.findUnique({
      where: { id },
      include: {
        consultationBookings: {
          orderBy: {
            createdAt: 'desc',
          },
        },
      },
    });

    if (!code) {
      return NextResponse.json(
        { error: 'Code not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(code);
  } catch (error) {
    console.error('Error fetching consultation code:', error);
    return NextResponse.json(
      { error: 'Failed to fetch consultation code' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAuth();

    const body = await request.json();
    const { status, description, maxUses, expiresAt } = body;

    const updatedCode = await prisma.consultationCode.update({
      where: { id },
      data: {
        status: status || undefined,
        description: description !== undefined ? description : undefined,
        maxUses: maxUses !== undefined ? maxUses : undefined,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(updatedCode);
  } catch (error) {
    console.error('Error updating consultation code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    await requireAuth();

    await prisma.consultationCode.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting consultation code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}