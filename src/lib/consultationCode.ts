import { prisma } from '@/lib/prisma';
import { ConsultationCode } from '@prisma/client';

export interface CodeValidationResult {
  valid: boolean;
  code?: ConsultationCode;
  error?: string;
}

/**
 * Validates a consultation code against the database with case-insensitive search
 * Returns validation result with the code object if valid, or error message if invalid
 */
export async function validateConsultationCode(code: string): Promise<CodeValidationResult> {
  if (!code) {
    return {
      valid: false,
      error: 'Code is required'
    };
  }

  // Check if code exists in database (case-insensitive search)
  const consultationCode = await prisma.consultationCode.findFirst({
    where: { 
      code: {
        equals: code,
        mode: 'insensitive'
      }
    }
  });

  if (!consultationCode) {
    return {
      valid: false,
      error: 'Code not found'
    };
  }

  // Check if code is active
  if (consultationCode.status !== 'active') {
    return {
      valid: false,
      error: `Code is ${consultationCode.status}`
    };
  }

  // Check if code has expired
  if (consultationCode.expiresAt && consultationCode.expiresAt < new Date()) {
    // Update status to expired
    await prisma.consultationCode.update({
      where: { id: consultationCode.id },
      data: { status: 'expired' }
    });

    return {
      valid: false,
      error: 'Code has expired'
    };
  }

  // Check if code has reached max uses
  if (consultationCode.maxUses && consultationCode.usedCount >= consultationCode.maxUses) {
    // Update status to expired
    await prisma.consultationCode.update({
      where: { id: consultationCode.id },
      data: { status: 'expired' }
    });

    return {
      valid: false,
      error: 'Code has reached maximum usage limit'
    };
  }

  // Code is valid
  return {
    valid: true,
    code: consultationCode
  };
}

/**
 * Increments the usage count for a valid consultation code
 */
export async function incrementCodeUsage(codeId: string): Promise<void> {
  const code = await prisma.consultationCode.findUnique({
    where: { id: codeId }
  });

  if (code) {
    await prisma.consultationCode.update({
      where: { id: codeId },
      data: { usedCount: code.usedCount + 1 }
    });
  }
}