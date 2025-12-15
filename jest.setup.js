// Jest setup file for additional configuration

// Mock Next.js modules
jest.mock('next/headers', () => ({
  cookies: jest.fn(() => ({
    get: jest.fn(),
    set: jest.fn(),
    delete: jest.fn()
  }))
}));

// Mock environment variables for testing
process.env.JWT_SECRET = 'test-secret-key-at-least-32-characters-long';
process.env.DATABASE_URL = 'postgresql://test:test@localhost:5432/test';
process.env.EMAIL_PROVIDER = 'smtp';
process.env.SMTP_HOST = 'localhost';
process.env.SMTP_PORT = '1025';
process.env.SMTP_FROM = 'test@test.com';
process.env.ADMIN_EMAIL = 'admin@test.com';
process.env.NODE_ENV = 'test';

// Global test timeout
jest.setTimeout(30000);

// Console error suppression for cleaner test output (optional)
const originalError = console.error;
beforeAll(() => {
  console.error = (...args) => {
    // Suppress specific React/Next.js warnings during tests
    if (
      typeof args[0] === 'string' &&
      (args[0].includes('Warning:') || args[0].includes('ReactDOM.render'))
    ) {
      return;
    }
    originalError.call(console, ...args);
  };
});

afterAll(() => {
  console.error = originalError;
});
