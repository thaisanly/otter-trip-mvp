import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function PUT(request: NextRequest) {
  try {
    const admin = await getCurrentAdmin();
    
    if (!admin) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { codeIds, updates } = body;

    if (!codeIds || !Array.isArray(codeIds) || codeIds.length === 0) {
      return NextResponse.json(
        { error: 'Invalid code IDs' },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: Record<string, unknown> = {};
    
    if (updates.status !== undefined) {
      updateData.status = updates.status;
    }
    
    if (updates.description !== undefined) {
      updateData.description = updates.description;
    }
    
    if (updates.expiresAt !== undefined) {
      updateData.expiresAt = updates.expiresAt ? new Date(updates.expiresAt) : null;
    }
    
    updateData.updatedAt = new Date();

    // Update all selected codes
    const result = await prisma.consultationCode.updateMany({
      where: {
        id: {
          in: codeIds,
        },
      },
      data: updateData,
    });

    return NextResponse.json({
      success: true,
      updated: result.count,
    });
  } catch (error) {
    console.error('Error bulk updating consultation codes:', error);
    return NextResponse.json(
      { error: 'Failed to bulk update consultation codes' },
      { status: 500 }
    );
  }
}