import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getEmailProvider, sendWithResend, sendWithSMTP } from '@/lib/email';

// Email templates
const getAdminEmailHtml = (data: { expertName: string; userName: string; userEmail: string; phone?: string; preferredDate?: string; tripDuration?: string; message?: string }) => `
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

async function sendInquiryEmail(data: { expertName: string; userName: string; userEmail: string; phone?: string; preferredDate?: string; tripDuration?: string; message?: string }) {
  const { emailProvider, adminEmail, adminEmailCC, resend, smtpTransporter } = await getEmailProvider();
  const subject = `[${data.expertName}] New Inquiry from ${data.userName} - Otter Trip`;
  const html = getAdminEmailHtml(data);
  
  const emailParams = {
    from: emailProvider === 'resend' 
      ? 'Otter Trip <noreply@ottertrip.com>'
      : `Otter Trip <${process.env.SMTP_FROM || 'noreply@ottertrip.com'}>`,
    to: adminEmail,
    cc: adminEmailCC.length > 0 ? adminEmailCC : undefined,
    replyTo: data.userEmail,
    subject,
    html
  };

  if (emailProvider === 'resend' && resend) {
    return await sendWithResend(resend, emailParams);
  } else if (emailProvider === 'smtp' && smtpTransporter) {
    return await sendWithSMTP(smtpTransporter, emailParams);
  } else {
    throw new Error(`Unknown email provider: ${emailProvider}`);
  }
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

    // Save inquiry to database
    await prisma.inquiry.create({
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

    // Send email
    const result = await sendInquiryEmail(body);
    const { emailProvider } = await getEmailProvider();

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