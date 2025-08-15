import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const codes = await prisma.consultationCode.findMany();
    
    const stats = {
      total: codes.length,
      active: codes.filter(c => c.status === 'active').length,
      inactive: codes.filter(c => c.status === 'inactive').length,
      expired: codes.filter(c => c.status === 'expired').length,
      totalUsage: codes.reduce((sum, c) => sum + c.usedCount, 0),
      mostUsed: codes.sort((a, b) => b.usedCount - a.usedCount)[0],
    };
    
    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error getting code statistics:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}