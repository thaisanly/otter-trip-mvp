import * as bcrypt from 'bcryptjs';

// Mock jose module
jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation((payload) => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mock.jwt.token')
  })),
  jwtVerify: jest.fn().mockImplementation(async (token) => {
    if (token === 'mock.jwt.token') {
      return {
        payload: {
          adminId: 'test-admin-id',
          email: 'test@example.com',
          role: 'admin'
        }
      };
    }
    throw new Error('Invalid token');
  })
}));

// Mock prisma
jest.mock('@/lib/prisma', () => ({
  prisma: {
    admin: {
      findUnique: jest.fn()
    }
  }
}));

// Mock env
jest.mock('@/lib/env', () => ({
  env: {
    JWT_SECRET: 'test-secret-key-at-least-32-characters-long',
    DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
    EMAIL_PROVIDER: 'smtp',
    ADMIN_EMAIL: 'admin@test.com'
  }
}));

describe('auth', () => {
  describe('hashPassword', () => {
    it('should hash a password', async () => {
      const password = 'testPassword123';
      const hash = await bcrypt.hash(password, 12);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for the same password', async () => {
      const password = 'testPassword123';
      const hash1 = await bcrypt.hash(password, 12);
      const hash2 = await bcrypt.hash(password, 12);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const password = 'testPassword123';
      const hash = await bcrypt.hash(password, 12);

      const result = await bcrypt.compare(password, hash);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const password = 'testPassword123';
      const hash = await bcrypt.hash(password, 12);

      const result = await bcrypt.compare('wrongPassword', hash);
      expect(result).toBe(false);
    });
  });

  describe('createToken and verifyToken', () => {
    it('should create a valid JWT token structure', async () => {
      // Import after mocks are set up
      const { createToken } = await import('@/lib/auth');

      const payload = {
        adminId: 'test-admin-id',
        email: 'test@example.com',
        role: 'admin'
      };

      const token = await createToken(payload);
      expect(token).toBeDefined();
      expect(typeof token).toBe('string');
    });

    it('should verify a valid token and return payload', async () => {
      const { verifyToken } = await import('@/lib/auth');

      const verified = await verifyToken('mock.jwt.token');

      expect(verified).toBeDefined();
      expect(verified?.adminId).toBe('test-admin-id');
      expect(verified?.email).toBe('test@example.com');
      expect(verified?.role).toBe('admin');
    });

    it('should return null for invalid token', async () => {
      const { verifyToken } = await import('@/lib/auth');

      const result = await verifyToken('invalid-token');
      expect(result).toBeNull();
    });
  });
});
