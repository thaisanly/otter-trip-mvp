import { validateConsultationCode, incrementCodeUsage } from '@/lib/consultationCode';
import { prisma } from '@/lib/prisma';

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    consultationCode: {
      findFirst: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn()
    }
  }
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('consultationCode', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('validateConsultationCode', () => {
    it('should return error when code is empty', async () => {
      const result = await validateConsultationCode('');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Code is required');
    });

    it('should return error when code is not found', async () => {
      (mockPrisma.consultationCode.findFirst as jest.Mock).mockResolvedValue(null);

      const result = await validateConsultationCode('INVALID-CODE');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Code not found');
    });

    it('should return error when code is inactive', async () => {
      (mockPrisma.consultationCode.findFirst as jest.Mock).mockResolvedValue({
        id: '1',
        code: 'TEST-CODE',
        status: 'inactive',
        usedCount: 0,
        maxUses: 10,
        expiresAt: null
      });

      const result = await validateConsultationCode('TEST-CODE');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Code is inactive');
    });

    it('should return error and update status when code is expired', async () => {
      const expiredDate = new Date('2020-01-01');
      (mockPrisma.consultationCode.findFirst as jest.Mock).mockResolvedValue({
        id: '1',
        code: 'TEST-CODE',
        status: 'active',
        usedCount: 0,
        maxUses: 10,
        expiresAt: expiredDate
      });
      (mockPrisma.consultationCode.update as jest.Mock).mockResolvedValue({});

      const result = await validateConsultationCode('TEST-CODE');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Code has expired');
      expect(mockPrisma.consultationCode.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { status: 'expired' }
      });
    });

    it('should return error when code has reached max uses', async () => {
      (mockPrisma.consultationCode.findFirst as jest.Mock).mockResolvedValue({
        id: '1',
        code: 'TEST-CODE',
        status: 'active',
        usedCount: 10,
        maxUses: 10,
        expiresAt: null
      });
      (mockPrisma.consultationCode.update as jest.Mock).mockResolvedValue({});

      const result = await validateConsultationCode('TEST-CODE');
      expect(result.valid).toBe(false);
      expect(result.error).toBe('Code has reached maximum usage limit');
    });

    it('should return valid for active code with remaining uses', async () => {
      const validCode = {
        id: '1',
        code: 'TEST-CODE',
        status: 'active',
        usedCount: 5,
        maxUses: 10,
        expiresAt: new Date('2030-12-31')
      };
      (mockPrisma.consultationCode.findFirst as jest.Mock).mockResolvedValue(validCode);

      const result = await validateConsultationCode('TEST-CODE');
      expect(result.valid).toBe(true);
      expect(result.code).toEqual(validCode);
    });

    it('should return valid for code with no usage limit', async () => {
      const validCode = {
        id: '1',
        code: 'TEST-CODE',
        status: 'active',
        usedCount: 100,
        maxUses: null,
        expiresAt: null
      };
      (mockPrisma.consultationCode.findFirst as jest.Mock).mockResolvedValue(validCode);

      const result = await validateConsultationCode('TEST-CODE');
      expect(result.valid).toBe(true);
    });
  });

  describe('incrementCodeUsage', () => {
    it('should increment usage count for existing code', async () => {
      const existingCode = {
        id: '1',
        code: 'TEST-CODE',
        usedCount: 5
      };
      (mockPrisma.consultationCode.findUnique as jest.Mock).mockResolvedValue(existingCode);
      (mockPrisma.consultationCode.update as jest.Mock).mockResolvedValue({});

      await incrementCodeUsage('1');

      expect(mockPrisma.consultationCode.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: { usedCount: 6 }
      });
    });

    it('should not update if code is not found', async () => {
      (mockPrisma.consultationCode.findUnique as jest.Mock).mockResolvedValue(null);

      await incrementCodeUsage('non-existent-id');

      expect(mockPrisma.consultationCode.update).not.toHaveBeenCalled();
    });
  });
});
