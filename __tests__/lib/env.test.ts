describe('env validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  afterAll(() => {
    process.env = originalEnv;
  });

  it('should validate required DATABASE_URL', async () => {
    process.env = {
      ...process.env,
      DATABASE_URL: '',
      JWT_SECRET: 'test-secret-key-at-least-32-characters-long',
      ADMIN_EMAIL: 'admin@test.com',
      EMAIL_PROVIDER: 'smtp',
      SMTP_HOST: 'smtp.test.com',
      SMTP_PORT: '587',
      SMTP_FROM: 'noreply@test.com'
    };

    await expect(async () => {
      await import('@/lib/env');
    }).rejects.toThrow('DATABASE_URL');
  });

  it('should validate JWT_SECRET minimum length', async () => {
    process.env = {
      ...process.env,
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      JWT_SECRET: 'short',
      ADMIN_EMAIL: 'admin@test.com',
      EMAIL_PROVIDER: 'smtp',
      SMTP_HOST: 'smtp.test.com',
      SMTP_PORT: '587',
      SMTP_FROM: 'noreply@test.com'
    };

    await expect(async () => {
      await import('@/lib/env');
    }).rejects.toThrow('JWT_SECRET must be at least 32 characters');
  });

  it('should validate ADMIN_EMAIL format', async () => {
    process.env = {
      ...process.env,
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      JWT_SECRET: 'test-secret-key-at-least-32-characters-long',
      ADMIN_EMAIL: 'invalid-email',
      EMAIL_PROVIDER: 'smtp',
      SMTP_HOST: 'smtp.test.com',
      SMTP_PORT: '587',
      SMTP_FROM: 'noreply@test.com'
    };

    await expect(async () => {
      await import('@/lib/env');
    }).rejects.toThrow('email');
  });

  it('should require RESEND_API_KEY when EMAIL_PROVIDER is resend', async () => {
    process.env = {
      ...process.env,
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      JWT_SECRET: 'test-secret-key-at-least-32-characters-long',
      ADMIN_EMAIL: 'admin@test.com',
      EMAIL_PROVIDER: 'resend'
      // Missing RESEND_API_KEY
    };

    await expect(async () => {
      await import('@/lib/env');
    }).rejects.toThrow('RESEND_API_KEY is required');
  });

  it('should require SMTP fields when EMAIL_PROVIDER is smtp', async () => {
    // Clear all SMTP-related env vars
    process.env = {
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      JWT_SECRET: 'test-secret-key-at-least-32-characters-long',
      ADMIN_EMAIL: 'admin@test.com',
      EMAIL_PROVIDER: 'smtp',
      NODE_ENV: 'test'
      // Missing SMTP_HOST, SMTP_PORT, SMTP_FROM
    };

    await expect(async () => {
      await import('@/lib/env');
    }).rejects.toThrow('Missing required SMTP fields');
  });

  it('should validate successfully with all required fields for SMTP', async () => {
    process.env = {
      ...process.env,
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      JWT_SECRET: 'test-secret-key-at-least-32-characters-long',
      ADMIN_EMAIL: 'admin@test.com',
      EMAIL_PROVIDER: 'smtp',
      SMTP_HOST: 'smtp.test.com',
      SMTP_PORT: '587',
      SMTP_FROM: 'noreply@test.com'
    };

    const { env } = await import('@/lib/env');

    expect(env.DATABASE_URL).toBe('postgresql://test:test@localhost:5432/test');
    expect(env.JWT_SECRET).toBe('test-secret-key-at-least-32-characters-long');
    expect(env.EMAIL_PROVIDER).toBe('smtp');
    expect(env.ADMIN_EMAIL).toBe('admin@test.com');
  });

  it('should validate successfully with all required fields for resend', async () => {
    process.env = {
      ...process.env,
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      JWT_SECRET: 'test-secret-key-at-least-32-characters-long',
      ADMIN_EMAIL: 'admin@test.com',
      EMAIL_PROVIDER: 'resend',
      RESEND_API_KEY: 're_test_key_123'
    };

    const { env } = await import('@/lib/env');

    expect(env.EMAIL_PROVIDER).toBe('resend');
    expect(env.RESEND_API_KEY).toBe('re_test_key_123');
  });

  it('should use default values when not provided', async () => {
    process.env = {
      ...process.env,
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      JWT_SECRET: 'test-secret-key-at-least-32-characters-long',
      ADMIN_EMAIL: 'admin@test.com',
      EMAIL_PROVIDER: 'smtp',
      SMTP_HOST: 'smtp.test.com',
      SMTP_PORT: '587',
      SMTP_FROM: 'noreply@test.com'
    };

    const { env } = await import('@/lib/env');

    expect(env.NEXT_PUBLIC_APP_NAME).toBe('Otter Trip');
    expect(env.APP_BASE_URL).toBe('http://localhost:3000');
    expect(env.NODE_ENV).toBe('test'); // Set by Jest
  });

  it('should reject invalid EMAIL_PROVIDER values', async () => {
    process.env = {
      ...process.env,
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      JWT_SECRET: 'test-secret-key-at-least-32-characters-long',
      ADMIN_EMAIL: 'admin@test.com',
      EMAIL_PROVIDER: 'invalid-provider',
      SMTP_HOST: 'smtp.test.com',
      SMTP_PORT: '587',
      SMTP_FROM: 'noreply@test.com'
    };

    await expect(async () => {
      await import('@/lib/env');
    }).rejects.toThrow();
  });

  it('should validate SMTP_FROM email format when provided', async () => {
    process.env = {
      ...process.env,
      DATABASE_URL: 'postgresql://test:test@localhost:5432/test',
      JWT_SECRET: 'test-secret-key-at-least-32-characters-long',
      ADMIN_EMAIL: 'admin@test.com',
      EMAIL_PROVIDER: 'smtp',
      SMTP_HOST: 'smtp.test.com',
      SMTP_PORT: '587',
      SMTP_FROM: 'invalid-email'
    };

    await expect(async () => {
      await import('@/lib/env');
    }).rejects.toThrow();
  });
});
