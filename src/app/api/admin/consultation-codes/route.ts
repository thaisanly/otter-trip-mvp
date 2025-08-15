import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { requireAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await requireAuth();

    const codes = await prisma.consultationCode.findMany({
      orderBy: { createdAt: 'desc' },
    });
    
    // Check and update expired codes
    const now = new Date();
    const updatedCodes = await Promise.all(
      codes.map(async (code) => {
        if (code.expiresAt && code.expiresAt < now && code.status === 'active') {
          // Update status to expired
          return await prisma.consultationCode.update({
            where: { id: code.id },
            data: { status: 'expired' },
          });
        }
        return code;
      })
    );
    
    return NextResponse.json(updatedCodes);
  } catch (error) {
    console.error('Error fetching consultation codes:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    await requireAuth();

    const data = await request.json();
    
    // Generate code if not provided
    const code = data.code || generateCode();
    
    const consultationCode = await prisma.consultationCode.create({
      data: {
        code,
        description: data.description,
        maxUses: data.maxUses,
        expiresAt: data.expiresAt ? new Date(data.expiresAt) : undefined,
        createdBy: data.createdBy,
        status: 'active',
      },
    });
    
    return NextResponse.json(consultationCode);
  } catch (error) {
    console.error('Error creating consultation code:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Helper function to generate code
function generateCode(): string {
  const prefix = 'OT';
  const randomNum = Math.floor(1000 + Math.random() * 9000);
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${randomNum}-${randomStr}`;
}