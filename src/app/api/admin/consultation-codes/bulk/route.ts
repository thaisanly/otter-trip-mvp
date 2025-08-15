import { NextRequest, NextResponse } from 'next/server';
import { getCurrentAdmin } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { generateConsultationCode } from '@/utils/codeGenerator';

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
    const {
      quantity = 10,
      prefix = 'OT',
      description,
      maxUses,
      expiresAt,
      createdBy = admin.email,
    } = body;

    // Validate quantity
    const codeQuantity = Math.min(Math.max(parseInt(quantity), 1), 100);
    
    // Generate multiple codes
    const codes = [];
    const generatedCodes = new Set<string>();
    
    // Generate unique codes
    while (generatedCodes.size < codeQuantity) {
      const code = generateConsultationCode(prefix);
      if (!generatedCodes.has(code)) {
        generatedCodes.add(code);
      }
    }
    
    // Create codes in database
    for (const code of generatedCodes) {
      const newCode = await prisma.consultationCode.create({
        data: {
          code,
          description: description || `Bulk generated - ${new Date().toLocaleDateString()}`,
          maxUses: maxUses ? parseInt(maxUses) : null,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          createdBy,
          status: 'active',
        },
      });
      codes.push(newCode);
    }

    return NextResponse.json({
      success: true,
      count: codes.length,
      codes,
    });
  } catch (error) {
    console.error('Error creating bulk codes:', error);
    return NextResponse.json(
      { error: 'Failed to create bulk codes' },
      { status: 500 }
    );
  }
}