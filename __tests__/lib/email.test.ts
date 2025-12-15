// Mock env before any imports
jest.mock('@/lib/env', () => ({
  env: {
    EMAIL_PROVIDER: 'smtp',
    ADMIN_EMAIL: 'admin@test.com',
    SMTP_HOST: 'smtp.test.com',
    SMTP_PORT: '587',
    SMTP_FROM: 'noreply@test.com',
    SMTP_USER: 'user',
    SMTP_PASS: 'pass',
    NODE_ENV: 'test'
  }
}));

// Mock nodemailer
const mockSendMail = jest.fn().mockResolvedValue({ messageId: 'test-message-id' });
const mockCreateTransport = jest.fn().mockReturnValue({
  sendMail: mockSendMail
});

jest.mock('nodemailer', () => ({
  createTransport: (...args: Parameters<typeof mockCreateTransport>) => mockCreateTransport(...args)
}));

// Mock resend
const mockResendSend = jest.fn();
jest.mock('resend', () => ({
  Resend: jest.fn().mockImplementation(() => ({
    emails: {
      send: mockResendSend
    }
  }))
}));

describe('email', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockResendSend.mockReset();
    mockSendMail.mockReset().mockResolvedValue({ messageId: 'test-message-id' });
  });

  describe('sendWithSMTP', () => {
    it('should send email using SMTP transporter', async () => {
      const { sendWithSMTP } = await import('@/lib/email');

      const mockTransporter = {
        sendMail: mockSendMail
      };

      const params = {
        from: 'test@test.com',
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<p>Test Body</p>'
      };

      // Use type assertion for the mock transporter
      const result = await sendWithSMTP(
        mockTransporter as Parameters<typeof sendWithSMTP>[0],
        params
      );

      expect(result).toEqual({ id: 'test-message-id', success: true });
      expect(mockSendMail).toHaveBeenCalledWith(params);
    });

    it('should throw error when SMTP transporter is not configured', async () => {
      const { sendWithSMTP } = await import('@/lib/email');

      const params = {
        from: 'test@test.com',
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<p>Test Body</p>'
      };

      // Pass null as transporter
      await expect(
        sendWithSMTP(null as Parameters<typeof sendWithSMTP>[0], params)
      ).rejects.toThrow('SMTP is not configured');
    });

    it('should handle CC recipients', async () => {
      const { sendWithSMTP } = await import('@/lib/email');

      const mockTransporter = {
        sendMail: mockSendMail
      };

      const params = {
        from: 'test@test.com',
        to: 'recipient@test.com',
        cc: ['cc1@test.com', 'cc2@test.com'],
        subject: 'Test Subject',
        html: '<p>Test Body</p>'
      };

      await sendWithSMTP(
        mockTransporter as Parameters<typeof sendWithSMTP>[0],
        params
      );

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          cc: ['cc1@test.com', 'cc2@test.com']
        })
      );
    });

    it('should handle replyTo', async () => {
      const { sendWithSMTP } = await import('@/lib/email');

      const mockTransporter = {
        sendMail: mockSendMail
      };

      const params = {
        from: 'test@test.com',
        to: 'recipient@test.com',
        replyTo: 'reply@test.com',
        subject: 'Test Subject',
        html: '<p>Test Body</p>'
      };

      await sendWithSMTP(
        mockTransporter as Parameters<typeof sendWithSMTP>[0],
        params
      );

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          replyTo: 'reply@test.com'
        })
      );
    });

    it('should return generic id when messageId is not provided', async () => {
      mockSendMail.mockResolvedValue({});

      const { sendWithSMTP } = await import('@/lib/email');

      const mockTransporter = {
        sendMail: mockSendMail
      };

      const params = {
        from: 'test@test.com',
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<p>Test Body</p>'
      };

      const result = await sendWithSMTP(
        mockTransporter as Parameters<typeof sendWithSMTP>[0],
        params
      );

      expect(result).toEqual({ id: 'smtp-sent', success: true });
    });
  });

  describe('sendWithResend', () => {
    it('should send email using Resend', async () => {
      mockResendSend.mockResolvedValue({
        data: { id: 'resend-id-123' },
        error: null
      });

      const { sendWithResend } = await import('@/lib/email');

      const mockResend = {
        emails: {
          send: mockResendSend
        }
      };

      const params = {
        from: 'test@test.com',
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<p>Test Body</p>'
      };

      const result = await sendWithResend(
        mockResend as Parameters<typeof sendWithResend>[0],
        params
      );

      expect(result).toEqual({ id: 'resend-id-123' });
      expect(mockResendSend).toHaveBeenCalledWith(params);
    });

    it('should throw error when Resend returns error', async () => {
      mockResendSend.mockResolvedValue({
        data: null,
        error: { message: 'Invalid API key' }
      });

      const { sendWithResend } = await import('@/lib/email');

      const mockResend = {
        emails: {
          send: mockResendSend
        }
      };

      const params = {
        from: 'test@test.com',
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<p>Test Body</p>'
      };

      await expect(
        sendWithResend(mockResend as Parameters<typeof sendWithResend>[0], params)
      ).rejects.toThrow('Invalid API key');
    });

    it('should throw error when Resend is not configured', async () => {
      const { sendWithResend } = await import('@/lib/email');

      const params = {
        from: 'test@test.com',
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<p>Test Body</p>'
      };

      await expect(
        sendWithResend(null as Parameters<typeof sendWithResend>[0], params)
      ).rejects.toThrow('Resend is not configured');
    });

    it('should return default id when data is null but no error', async () => {
      mockResendSend.mockResolvedValue({
        data: null,
        error: null
      });

      const { sendWithResend } = await import('@/lib/email');

      const mockResend = {
        emails: {
          send: mockResendSend
        }
      };

      const params = {
        from: 'test@test.com',
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<p>Test Body</p>'
      };

      const result = await sendWithResend(
        mockResend as Parameters<typeof sendWithResend>[0],
        params
      );

      expect(result).toEqual({ id: 'resend-sent' });
    });
  });

  describe('getEmailProvider', () => {
    it('should configure SMTP provider when EMAIL_PROVIDER is smtp', async () => {
      const { getEmailProvider } = await import('@/lib/email');

      const provider = await getEmailProvider();

      expect(provider.emailProvider).toBe('smtp');
      expect(provider.adminEmail).toBe('admin@test.com');
      expect(provider.smtpTransporter).toBeDefined();
      expect(provider.resend).toBeNull();
    });

    it('should parse admin email correctly', async () => {
      const { getEmailProvider } = await import('@/lib/email');

      const provider = await getEmailProvider();

      expect(provider.adminEmail).toBe('admin@test.com');
      expect(Array.isArray(provider.adminEmailCC)).toBe(true);
    });
  });

  describe('sendEmail', () => {
    it('should send email using configured SMTP provider', async () => {
      const { sendEmail } = await import('@/lib/email');

      const params = {
        to: 'recipient@test.com',
        subject: 'Test Subject',
        html: '<p>Test Body</p>'
      };

      const result = await sendEmail(params);

      expect(result).toBeDefined();
      expect(mockSendMail).toHaveBeenCalled();
    });

    it('should handle multiple recipients', async () => {
      const { sendEmail } = await import('@/lib/email');

      const params = {
        to: ['recipient1@test.com', 'recipient2@test.com'],
        subject: 'Test Subject',
        html: '<p>Test Body</p>'
      };

      await sendEmail(params);

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: ['recipient1@test.com', 'recipient2@test.com']
        })
      );
    });

    it('should include CC recipients when provided', async () => {
      const { sendEmail } = await import('@/lib/email');

      const params = {
        to: 'recipient@test.com',
        cc: ['cc@test.com'],
        subject: 'Test Subject',
        html: '<p>Test Body</p>'
      };

      await sendEmail(params);

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          cc: ['cc@test.com']
        })
      );
    });

    it('should include replyTo when provided', async () => {
      const { sendEmail } = await import('@/lib/email');

      const params = {
        to: 'recipient@test.com',
        replyTo: 'reply@test.com',
        subject: 'Test Subject',
        html: '<p>Test Body</p>'
      };

      await sendEmail(params);

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          replyTo: 'reply@test.com'
        })
      );
    });
  });

  describe('sendEmailToAdmin', () => {
    it('should send email to admin address', async () => {
      const { sendEmailToAdmin } = await import('@/lib/email');

      const params = {
        subject: 'Admin Notification',
        html: '<p>Admin message</p>'
      };

      const result = await sendEmailToAdmin(params);

      expect(result).toBeDefined();
      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          to: 'admin@test.com',
          subject: 'Admin Notification'
        })
      );
    });

    it('should include replyTo when provided', async () => {
      const { sendEmailToAdmin } = await import('@/lib/email');

      const params = {
        replyTo: 'user@test.com',
        subject: 'User Inquiry',
        html: '<p>User message</p>'
      };

      await sendEmailToAdmin(params);

      expect(mockSendMail).toHaveBeenCalledWith(
        expect.objectContaining({
          replyTo: 'user@test.com'
        })
      );
    });
  });
});
