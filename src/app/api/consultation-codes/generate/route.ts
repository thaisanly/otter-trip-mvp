import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { generateConsultationCode, validateConsultationCodeFormat } from '@/utils/codeGenerator';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      description, 
      maxUses, 
      expiresIn, // days until expiration
      createdBy = 'System',
      count = 1 // number of codes to generate
    } = body;

    const codes = [];

    for (let i = 0; i < count; i++) {
      let code: string;
      let isUnique = false;
      
      // Keep generating until we get a unique code
      while (!isUnique) {
        code = generateConsultationCode();
        
        // Check if code already exists in database
        const existing = await prisma.consultationCode.findUnique({
          where: { code }
        });
        
        if (!existing) {
          isUnique = true;
        }
      }

      // Calculate expiration date if provided
      const expiresAt = expiresIn 
        ? new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000)
        : undefined;

      // Create the consultation code
      const consultationCode = await prisma.consultationCode.create({
        data: {
          code: code!,
          status: 'active',
          description,
          maxUses,
          expiresAt,
          createdBy,
          usedCount: 0
        }
      });

      codes.push(consultationCode);
    }

    return NextResponse.json({
      success: true,
      codes: codes,
      message: `Successfully generated ${codes.length} consultation code(s)`
    });
  } catch (error) {
    console.error('Error generating consultation code:', error);
    return NextResponse.json(
      { 
        error: 'Failed to generate consultation code',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}

// Get all consultation codes
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const status = searchParams.get('status');
    const includeExpired = searchParams.get('includeExpired') === 'true';

    const where: any = {};
    
    if (status) {
      where.status = status;
    }
    
    if (!includeExpired) {
      where.OR = [
        { expiresAt: null },
        { expiresAt: { gte: new Date() } }
      ];
    }

    const codes = await prisma.consultationCode.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    // Update status for expired codes
    const now = new Date();
    const processedCodes = codes.map(code => {
      if (code.expiresAt && code.expiresAt < now && code.status === 'active') {
        return { ...code, status: 'expired' };
      }
      if (code.maxUses && code.usedCount >= code.maxUses && code.status === 'active') {
        return { ...code, status: 'expired' };
      }
      return code;
    });

    return NextResponse.json({
      success: true,
      codes: processedCodes
    });
  } catch (error) {
    console.error('Error fetching consultation codes:', error);
    return NextResponse.json(
      { 
        error: 'Failed to fetch consultation codes',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    );
  }
}