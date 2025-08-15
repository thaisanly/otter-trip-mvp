import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateConsultationCodeFormat } from '@/utils/codeGenerator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    if (!code) {
      return NextResponse.json(
        { 
          valid: false,
          error: 'Code is required' 
        },
        { status: 400 }
      );
    }

    // Check format
    if (!validateConsultationCodeFormat(code)) {
      return NextResponse.json({
        valid: false,
        error: 'Invalid code format. Expected format: XX-####-XXXX (2 letters, 4 digits, 4 letters)'
      });
    }

    // Check if code exists in database
    const consultationCode = await prisma.consultationCode.findUnique({
      where: { code }
    });

    if (!consultationCode) {
      return NextResponse.json({
        valid: false,
        error: 'Code not found'
      });
    }

    // Check if code is active
    if (consultationCode.status !== 'active') {
      return NextResponse.json({
        valid: false,
        error: `Code is ${consultationCode.status}`
      });
    }

    // Check if code has expired
    if (consultationCode.expiresAt && consultationCode.expiresAt < new Date()) {
      // Update status to expired
      await prisma.consultationCode.update({
        where: { id: consultationCode.id },
        data: { status: 'expired' }
      });

      return NextResponse.json({
        valid: false,
        error: 'Code has expired'
      });
    }

    // Check if code has reached max uses
    if (consultationCode.maxUses && consultationCode.usedCount >= consultationCode.maxUses) {
      // Update status to expired
      await prisma.consultationCode.update({
        where: { id: consultationCode.id },
        data: { status: 'expired' }
      });

      return NextResponse.json({
        valid: false,
        error: 'Code has reached maximum usage limit'
      });
    }

    // Code is valid - increment usage count
    await prisma.consultationCode.update({
      where: { id: consultationCode.id },
      data: { usedCount: consultationCode.usedCount + 1 }
    });

    return NextResponse.json({
      valid: true,
      code: consultationCode.code,
      description: consultationCode.description,
      remainingUses: consultationCode.maxUses 
        ? consultationCode.maxUses - consultationCode.usedCount - 1 
        : 'unlimited'
    });
  } catch (error) {
    console.error('Error validating consultation code:', error);
    return NextResponse.json(
      { 
        valid: false,
        error: 'Failed to validate consultation code',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}