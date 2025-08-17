import { env } from '@/lib/env';
import type { Transporter } from 'nodemailer';

type ResendClient = {
  emails: {
    send: (params: {
      from: string;
      to: string | string[];
      cc?: string | string[];
      replyTo?: string;
      subject: string;
      html: string;
    }) => Promise<{
      data: { id: string } | null;
      error: { message: string } | null;
    }>;
  };
};

export interface EmailProvider {
  emailProvider: string;
  adminEmail: string;
  adminEmailCC: string[];
  resend: ResendClient | null;
  smtpTransporter: Transporter | null;
}

/**
 * Centralized email provider configuration
 * Supports both Resend and SMTP providers
 */
/**
 * Parse email string into array, handling comma-separated values
 */
function parseEmails(emailString: string | undefined): string[] {
  if (!emailString) return [];
  return emailString
    .split(',')
    .map(email => email.trim())
    .filter(email => email && email.includes('@'));
}

export async function getEmailProvider(): Promise<EmailProvider> {
  const emailProvider = env.EMAIL_PROVIDER;
  
  // Parse admin emails - first is TO, rest can be CC
  const adminEmails = parseEmails(env.ADMIN_EMAIL);
  const adminEmail = adminEmails[0] || 'contact@ottertrip.com';
  
  // Parse additional CC emails from both sources
  const ccFromAdminEmail = adminEmails.slice(1); // All except first from ADMIN_EMAIL
  const ccFromEnv = parseEmails(process.env.ADMIN_EMAIL_CC); // Additional CC from ADMIN_EMAIL_CC
  const adminEmailCC = [...new Set([...ccFromAdminEmail, ...ccFromEnv])]; // Combine and deduplicate
  
  let resend = null;
  let smtpTransporter: Transporter | null = null;
  
  if (emailProvider === 'resend') {
    const { Resend } = await import('resend');
    resend = new Resend(env.RESEND_API_KEY);
  } else if (emailProvider === 'smtp') {
    const nodemailer = await import('nodemailer');
    const port = parseInt(env.SMTP_PORT!);
    const isSecure = port === 465; // Use secure connection for port 465
    
    smtpTransporter = nodemailer.createTransport({
      host: env.SMTP_HOST!,
      port: port,
      secure: isSecure, // true for 465, false for other ports
      auth: env.SMTP_USER && env.SMTP_PASS ? {
        user: env.SMTP_USER,
        pass: env.SMTP_PASS,
      } : undefined,
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false,
        // Enable STARTTLS for port 587
        ...(port === 587 ? { starttls: { enable: true } } : {})
      },
      // Debug output in development
      debug: process.env.NODE_ENV === 'development',
      logger: process.env.NODE_ENV === 'development'
    });
  }
  
  return { emailProvider, adminEmail, adminEmailCC, resend, smtpTransporter };
}

/**
 * Send email using Resend
 */
export async function sendWithResend(
  resend: ResendClient,
  params: {
    from: string;
    to: string | string[];
    cc?: string | string[];
    replyTo?: string;
    subject: string;
    html: string;
  }
) {
  if (!resend) {
    throw new Error('Resend is not configured');
  }

  const result = await resend.emails.send(params);

  if (result.error) {
    throw new Error(result.error.message);
  }

  return result.data || { id: 'resend-sent' };
}

/**
 * Send email using SMTP
 */
export async function sendWithSMTP(
  smtpTransporter: Transporter,
  params: {
    from: string;
    to: string | string[];
    cc?: string | string[];
    replyTo?: string;
    subject: string;
    html: string;
  }
) {
  if (!smtpTransporter) {
    throw new Error('SMTP is not configured');
  }

  const result = await smtpTransporter.sendMail(params);
  return { id: result.messageId || 'smtp-sent', success: true };
}

/**
 * Send email to admin with automatic CC support
 */
export async function sendEmailToAdmin(params: {
  replyTo?: string;
  subject: string;
  html: string;
}) {
  const { adminEmail, adminEmailCC } = await getEmailProvider();
  
  return sendEmail({
    to: adminEmail,
    cc: adminEmailCC.length > 0 ? adminEmailCC : undefined,
    ...params
  });
}

/**
 * Generic email sending function that uses the configured provider
 */
export async function sendEmail(params: {
  to: string | string[];
  cc?: string | string[];
  replyTo?: string;
  subject: string;
  html: string;
}) {
  const { emailProvider, resend, smtpTransporter } = await getEmailProvider();
  
  const fromEmail = emailProvider === 'resend' 
    ? 'Otter Trip <noreply@ottertrip.com>'
    : `Otter Trip <${env.SMTP_FROM}>`;

  const emailParams = {
    from: fromEmail,
    ...params
  };

  if (emailProvider === 'resend' && resend) {
    return await sendWithResend(resend, emailParams);
  } else if (emailProvider === 'smtp' && smtpTransporter) {
    return await sendWithSMTP(smtpTransporter, emailParams);
  } else {
    throw new Error(`Unknown email provider: ${emailProvider}`);
  }
}