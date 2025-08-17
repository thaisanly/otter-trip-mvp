import { NextRequest, NextResponse } from 'next/server';
import { validateConsultationCode } from '@/lib/consultationCode';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { code } = body;

    // Validate the code using shared function
    const validationResult = await validateConsultationCode(code);

    if (!validationResult.valid) {
      return NextResponse.json(
        { 
          valid: false,
          error: validationResult.error 
        },
        { status: validationResult.error === 'Code is required' ? 400 : 200 }
      );
    }

    // Code is valid - DO NOT increment usage count here (only after booking is created)
    return NextResponse.json({
      valid: true,
      code: validationResult.code!.code,
      description: validationResult.code!.description,
      remainingUses: validationResult.code!.maxUses 
        ? validationResult.code!.maxUses - validationResult.code!.usedCount
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