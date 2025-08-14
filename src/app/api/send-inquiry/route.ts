import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

// Lazy load email libraries
async function getEmailProvider() {
  const emailProvider = process.env.EMAIL_PROVIDER || 'smtp';
  const adminEmail = process.env.ADMIN_EMAIL || 'contact@ottertrip.com';
  
  let resend = null;
  let smtpTransporter = null;
  
  if (emailProvider === 'resend') {
    const { Resend } = await import('resend');
    resend = new Resend(process.env.RESEND_API_KEY);
  } else if (emailProvider === 'smtp') {
    const nodemailer = await import('nodemailer');
    smtpTransporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'localhost',
      port: parseInt(process.env.SMTP_PORT || '1025'),
      secure: process.env.SMTP_SECURE === 'true',
      auth: process.env.SMTP_USER && process.env.SMTP_PASS ? {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      } : undefined,
    });
  }
  
  return { emailProvider, adminEmail, resend, smtpTransporter };
}

// Email templates
const getAdminEmailHtml = (data: any) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; font-size: 24px;">Expert: ${data.expertName}</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">New Travel Inquiry</p>
    </div>
    <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: 0; border-radius: 0 0 8px 8px;">
      <p style="margin-top: 0;">You have received a new inquiry from a potential traveler interested in <strong>${data.expertName}'s</strong> services.</p>
    
    <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #374151; margin-top: 0;">Traveler Details:</h3>
      <p><strong>Name:</strong> ${data.userName}</p>
      <p><strong>Email:</strong> ${data.userEmail}</p>
      ${data.phone ? `<p><strong>Phone:</strong> ${data.phone}</p>` : ''}
      ${data.preferredDate ? `<p><strong>Preferred Travel Date:</strong> ${data.preferredDate}</p>` : ''}
      ${data.tripDuration ? `<p><strong>Trip Duration:</strong> ${data.tripDuration}</p>` : ''}
    </div>
    
    <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin: 20px 0;">
      <h3 style="color: #1e40af; margin-top: 0;">Message:</h3>
      <p style="white-space: pre-wrap;">${data.message}</p>
    </div>
    
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          <strong>Expert Assignment:</strong> This inquiry is for ${data.expertName}<br>
          Please respond directly to the traveler's email or forward to the appropriate expert.
        </p>
      </div>
    </div>
  </div>
`;

async function sendWithResend(data: any, resend: any, adminEmail: string) {
  if (!resend) {
    throw new Error('Resend is not configured');
  }

  // Send email to admin only
  const adminResult = await resend.emails.send({
    from: 'Otter Trip <noreply@ottertrip.com>',
    to: adminEmail,
    replyTo: data.userEmail,
    subject: `[${data.expertName}] New Inquiry from ${data.userName} - Otter Trip`,
    html: getAdminEmailHtml(data),
  });

  if (adminResult.error) {
    throw new Error(adminResult.error.message);
  }

  return adminResult.data;
}

async function sendWithSMTP(data: any, smtpTransporter: any, adminEmail: string) {
  if (!smtpTransporter) {
    throw new Error('SMTP is not configured');
  }

  const fromEmail = process.env.SMTP_FROM || 'noreply@ottertrip.com';

  // Send email to admin only
  await smtpTransporter.sendMail({
    from: `Otter Trip <${fromEmail}>`,
    to: adminEmail,
    replyTo: data.userEmail,
    subject: `[${data.expertName}] New Inquiry from ${data.userName} - Otter Trip`,
    html: getAdminEmailHtml(data),
  });

  return { id: 'smtp-sent', success: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      expertName, 
      userName, 
      userEmail, 
      phone, 
      message,
      preferredDate,
      tripDuration 
    } = body;

    // Validate required fields
    if (!expertName || !userName || !userEmail || !message) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get email provider configuration
    const { emailProvider, adminEmail, resend, smtpTransporter } = await getEmailProvider();

    // Save inquiry to database
    const inquiry = await prisma.inquiry.create({
      data: {
        name: userName,
        email: userEmail,
        phone: phone || null,
        destination: message, // Using message as destination for now
        preferredDate: preferredDate || null,
        tripDuration: tripDuration || null,
        message: message || null,
        status: 'pending',
      },
    });

    // Send email based on provider
    let result;
    if (emailProvider === 'resend') {
      result = await sendWithResend(body, resend, adminEmail);
    } else if (emailProvider === 'smtp') {
      result = await sendWithSMTP(body, smtpTransporter, adminEmail);
    } else {
      throw new Error(`Unknown email provider: ${emailProvider}`);
    }

    console.log(`Email sent successfully via ${emailProvider}:`, result);

    return NextResponse.json({ 
      success: true, 
      data: result,
      provider: emailProvider 
    });
  } catch (error) {
    console.error('Error sending email:', error);
    const emailProvider = process.env.EMAIL_PROVIDER || 'smtp';
    return NextResponse.json(
      { 
        error: 'Failed to send inquiry',
        details: error instanceof Error ? error.message : 'Unknown error',
        provider: emailProvider
      },
      { status: 500 }
    );
  }
}