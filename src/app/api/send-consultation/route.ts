import { NextRequest, NextResponse } from 'next/server';

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

// No longer generating invitation codes - using user's provided code from real-world events

// Email template for admin
const getAdminEmailHtml = (data: any, adminEmail: string) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; font-size: 24px;">Consultation Booking</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">Expert: ${data.expertName}</p>
    </div>
    <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: 0; border-radius: 0 0 8px 8px;">
      <div style="background-color: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; font-weight: bold; color: #92400e;">
          Invitation Code: ${data.invitationCode}
        </p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #78350f;">
          Client provided this code during booking
        </p>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #374151; margin-top: 0;">Booking Details:</h3>
        <p><strong>Reference:</strong> ${data.bookingReference}</p>
        <p><strong>Date:</strong> ${data.selectedDate}</p>
        <p><strong>Time:</strong> ${data.selectedTime}</p>
        <p><strong>Duration:</strong> 60-minute consultation</p>
        <p><strong>Type:</strong> Video call</p>
      </div>
      
      <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1e40af; margin-top: 0;">Client Information:</h3>
        <p><strong>Name:</strong> ${data.userName}</p>
        <p><strong>Email:</strong> ${data.userEmail}</p>
        <p><strong>Phone:</strong> ${data.phone}</p>
        ${data.message ? `
          <div style="margin-top: 15px; padding-top: 15px; border-top: 1px solid #bfdbfe;">
            <p><strong>Client's Message:</strong></p>
            <p style="white-space: pre-wrap; background-color: white; padding: 10px; border-radius: 5px;">${data.message}</p>
          </div>
        ` : ''}
      </div>
      
      <div style="background-color: #f0fdf4; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #166534; margin-top: 0;">Payment Information:</h3>
        <p><strong>Consultation Fee:</strong> $${data.price}</p>
        <p><strong>Service Fee:</strong> $25</p>
        <p style="font-size: 18px; font-weight: bold; color: #166534; margin-top: 10px;">
          Total: $${data.price + 25}
        </p>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          <strong>Next Steps:</strong><br>
          1. Send calendar invitation to client at ${data.userEmail}<br>
          2. Prepare video call link and share invitation code<br>
          3. Review client's message/topics if provided<br>
          4. Contact ${data.expertName} to confirm availability
        </p>
      </div>
    </div>
  </div>
`;

// Email template for client
const getClientEmailHtml = (data: any, adminEmail: string) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; font-size: 24px;">Consultation Confirmed!</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">Your session with ${data.expertName}</p>
    </div>
    <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: 0; border-radius: 0 0 8px 8px;">
      <div style="background-color: #dcfce7; border: 1px solid #86efac; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; font-weight: bold; color: #166534;">
          ✅ Booking Confirmed
        </p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #15803d;">
          Reference: ${data.bookingReference}
        </p>
      </div>
      
      <div style="background-color: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; font-weight: bold; color: #92400e;">
          Your Invitation Code: ${data.invitationCode}
        </p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #78350f;">
          Keep this code safe - you'll need it to join the consultation
        </p>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #374151; margin-top: 0;">Consultation Details:</h3>
        <p><strong>Expert:</strong> ${data.expertName}</p>
        <p><strong>Date:</strong> ${data.selectedDate}</p>
        <p><strong>Time:</strong> ${data.selectedTime}</p>
        <p><strong>Duration:</strong> 60 minutes</p>
        <p><strong>Format:</strong> Video call (link will be sent separately)</p>
      </div>
      
      <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1e40af; margin-top: 0;">What's Next?</h3>
        <ol style="margin: 0; padding-left: 20px;">
          <li style="margin-bottom: 10px;">You'll receive a calendar invitation shortly</li>
          <li style="margin-bottom: 10px;">A video call link will be sent 24 hours before the session</li>
          <li style="margin-bottom: 10px;">Prepare any questions or topics you'd like to discuss</li>
          <li>Have your invitation code ready when joining the call</li>
        </ol>
      </div>
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          <strong>Need to reschedule or cancel?</strong><br>
          Please contact us at least 24 hours before your scheduled consultation.<br>
          Email: ${adminEmail}
        </p>
        <p style="color: #6b7280; font-size: 14px; margin-top: 15px;">
          Thank you for choosing Otter Trip. We look forward to helping you plan your perfect journey!
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
    subject: `[${data.expertName}] New Consultation Booking - ${data.bookingReference}`,
    html: getAdminEmailHtml(data, adminEmail),
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
    subject: `[${data.expertName}] New Consultation Booking - ${data.bookingReference}`,
    html: getAdminEmailHtml(data, adminEmail),
  });

  return { id: 'smtp-sent', success: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      expertName,
      expertId,
      userName, 
      userEmail, 
      phone, 
      message,
      selectedDate,
      selectedTime,
      price,
      bookingReference,
      invitationCode
    } = body;

    // Validate required fields
    if (!expertName || !userName || !userEmail || !phone || !selectedDate || !selectedTime) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get email provider configuration
    const { emailProvider, adminEmail, resend, smtpTransporter } = await getEmailProvider();

    // Prepare email data - use the invitation code provided by user
    const emailData = {
      ...body,
      invitationCode: invitationCode || 'Not provided',
      price: typeof price === 'number' ? price : 500 // Default price if not provided
    };

    // Send email based on provider
    let result;
    if (emailProvider === 'resend') {
      result = await sendWithResend(emailData, resend, adminEmail);
    } else if (emailProvider === 'smtp') {
      result = await sendWithSMTP(emailData, smtpTransporter, adminEmail);
    } else {
      throw new Error(`Unknown email provider: ${emailProvider}`);
    }

    console.log(`Consultation booking email sent via ${emailProvider}:`, result);

    return NextResponse.json({ 
      success: true, 
      data: {
        ...result,
        bookingReference
      },
      provider: emailProvider 
    });
  } catch (error) {
    console.error('Error sending consultation booking email:', error);
    const emailProvider = process.env.EMAIL_PROVIDER || 'smtp';
    return NextResponse.json(
      { 
        error: 'Failed to send booking confirmation',
        details: error instanceof Error ? error.message : 'Unknown error',
        provider: emailProvider
      },
      { status: 500 }
    );
  }
}