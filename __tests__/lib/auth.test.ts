import { prisma } from '@/lib/prisma';

// Mock jose module
const mockJwtVerify = jest.fn();
jest.mock('jose', () => ({
  SignJWT: jest.fn().mockImplementation(() => ({
    setProtectedHeader: jest.fn().mockReturnThis(),
    setIssuedAt: jest.fn().mockReturnThis(),
    setExpirationTime: jest.fn().mockReturnThis(),
    sign: jest.fn().mockResolvedValue('mock.jwt.token')
  })),
  jwtVerify: (...args: Parameters<typeof mockJwtVerify>) => mockJwtVerify(...args)
}));

// Mock cookies module
const mockCookies = {
  get: jest.fn(),
  set: jest.fn(),
  delete: jest.fn()
};

jest.mock('next/headers', () => ({
  cookies: jest.fn(() => Promise.resolve(mockCookies))
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
    ADMIN_EMAIL: 'admin@test.com',
    NODE_ENV: 'test'
  }
}));

const mockPrisma = prisma as jest.Mocked<typeof prisma>;

describe('auth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockJwtVerify.mockImplementation(async (token: string) => {
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
    });
  });

  describe('hashPassword', () => {
    it('should hash a password using the auth function', async () => {
      const { hashPassword } = await import('@/lib/auth');
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      expect(hash).toBeDefined();
      expect(hash).not.toBe(password);
      expect(hash.length).toBeGreaterThan(0);
    });

    it('should generate different hashes for the same password', async () => {
      const { hashPassword } = await import('@/lib/auth');
      const password = 'testPassword123';
      const hash1 = await hashPassword(password);
      const hash2 = await hashPassword(password);

      expect(hash1).not.toBe(hash2);
    });
  });

  describe('verifyPassword', () => {
    it('should return true for correct password', async () => {
      const { hashPassword, verifyPassword } = await import('@/lib/auth');
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      const result = await verifyPassword(password, hash);
      expect(result).toBe(true);
    });

    it('should return false for incorrect password', async () => {
      const { hashPassword, verifyPassword } = await import('@/lib/auth');
      const password = 'testPassword123';
      const hash = await hashPassword(password);

      const result = await verifyPassword('wrongPassword', hash);
      expect(result).toBe(false);
    });
  });

  describe('createToken and verifyToken', () => {
    it('should create a valid JWT token structure', async () => {
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
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      const { verifyToken } = await import('@/lib/auth');

      const result = await verifyToken('invalid-token');
      expect(result).toBeNull();

      consoleErrorSpy.mockRestore();
    });

    it('should return null when token payload is missing required fields', async () => {
      mockJwtVerify.mockResolvedValueOnce({
        payload: {
          adminId: 'test-admin-id',
          // Missing email and role
        }
      });

      const { verifyToken } = await import('@/lib/auth');
      const result = await verifyToken('mock.jwt.token');
      expect(result).toBeNull();
    });
  });

  describe('cookie functions', () => {
    it('should set auth cookie with correct parameters', async () => {
      const { setAuthCookie } = await import('@/lib/auth');

      await setAuthCookie('test-token');

      expect(mockCookies.set).toHaveBeenCalledWith(
        'admin_token',
        'test-token',
        expect.objectContaining({
          httpOnly: true,
          sameSite: 'lax',
          maxAge: 60 * 60 * 24,
          path: '/'
        })
      );
    });

    it('should get auth cookie value', async () => {
      mockCookies.get.mockReturnValue({ value: 'stored-token' });

      const { getAuthCookie } = await import('@/lib/auth');
      const result = await getAuthCookie();

      expect(result).toBe('stored-token');
      expect(mockCookies.get).toHaveBeenCalledWith('admin_token');
    });

    it('should return undefined when no auth cookie exists', async () => {
      mockCookies.get.mockReturnValue(undefined);

      const { getAuthCookie } = await import('@/lib/auth');
      const result = await getAuthCookie();

      expect(result).toBeUndefined();
    });

    it('should remove auth cookie', async () => {
      const { removeAuthCookie } = await import('@/lib/auth');

      await removeAuthCookie();

      expect(mockCookies.delete).toHaveBeenCalledWith('admin_token');
    });
  });

  describe('getCurrentAdmin', () => {
    it('should return null when no token exists', async () => {
      mockCookies.get.mockReturnValue(undefined);

      const { getCurrentAdmin } = await import('@/lib/auth');
      const result = await getCurrentAdmin();

      expect(result).toBeNull();
    });

    it('should return null when token is invalid', async () => {
      const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
      mockCookies.get.mockReturnValue({ value: 'invalid-token' });

      const { getCurrentAdmin } = await import('@/lib/auth');
      const result = await getCurrentAdmin();

      expect(result).toBeNull();
      consoleErrorSpy.mockRestore();
    });

    it('should return admin when token is valid and admin exists', async () => {
      mockCookies.get.mockReturnValue({ value: 'mock.jwt.token' });
      const mockAdmin = {
        id: 'test-admin-id',
        email: 'test@example.com',
        name: 'Test Admin',
        role: 'admin'
      };
      (mockPrisma.admin.findUnique as jest.Mock).mockResolvedValue(mockAdmin);

      const { getCurrentAdmin } = await import('@/lib/auth');
      const result = await getCurrentAdmin();

      expect(result).toEqual(mockAdmin);
    });

    it('should return null when admin is not found in database', async () => {
      mockCookies.get.mockReturnValue({ value: 'mock.jwt.token' });
      (mockPrisma.admin.findUnique as jest.Mock).mockResolvedValue(null);

      const { getCurrentAdmin } = await import('@/lib/auth');
      const result = await getCurrentAdmin();

      expect(result).toBeNull();
    });
  });

  describe('requireAuth', () => {
    it('should return admin when authenticated', async () => {
      mockCookies.get.mockReturnValue({ value: 'mock.jwt.token' });
      const mockAdmin = {
        id: 'test-admin-id',
        email: 'test@example.com',
        name: 'Test Admin',
        role: 'admin'
      };
      (mockPrisma.admin.findUnique as jest.Mock).mockResolvedValue(mockAdmin);

      const { requireAuth } = await import('@/lib/auth');
      const result = await requireAuth();

      expect(result).toEqual(mockAdmin);
    });

    it('should throw error when not authenticated', async () => {
      mockCookies.get.mockReturnValue(undefined);

      const { requireAuth } = await import('@/lib/auth');

      await expect(requireAuth()).rejects.toThrow('Unauthorized');
    });
  });
});
