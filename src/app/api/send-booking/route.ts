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

// Email template for admin
interface BookingEmailData {
  bookingReference: string;
  tourTitle: string;
  tourId: string;
  location?: string;
  selectedDate: string;
  participants: number;
  pricePerPerson: number;
  totalPrice: number;
  leadTraveler: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  additionalTravelers?: Array<{ firstName: string; lastName: string }>;
  specialRequests?: string;
}

const getAdminEmailHtml = (data: BookingEmailData) => `
  <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
    <div style="background-color: #1e40af; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
      <h1 style="margin: 0; font-size: 24px;">New Tour Booking</h1>
      <p style="margin: 5px 0 0 0; opacity: 0.9;">${data.tourTitle}</p>
    </div>
    <div style="padding: 20px; border: 1px solid #e5e7eb; border-top: 0; border-radius: 0 0 8px 8px;">
      <div style="background-color: #fef3c7; border: 1px solid #fbbf24; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
        <p style="margin: 0; font-weight: bold; color: #92400e;">
          Booking Reference: ${data.bookingReference}
        </p>
        <p style="margin: 5px 0 0 0; font-size: 14px; color: #78350f;">
          ${data.participants} participant(s) • ${data.selectedDate}
        </p>
      </div>
      
      <div style="background-color: #f3f4f6; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #374151; margin-top: 0;">Tour Details:</h3>
        <p><strong>Tour:</strong> ${data.tourTitle}</p>
        <p><strong>Tour ID:</strong> ${data.tourId}</p>
        <p><strong>Location:</strong> ${data.location || 'N/A'}</p>
        <p><strong>Dates:</strong> ${data.selectedDate}</p>
        <p><strong>Number of Participants:</strong> ${data.participants}</p>
        <p><strong>Price per Person:</strong> $${data.pricePerPerson}</p>
        <p><strong>Total Price:</strong> $${data.totalPrice}</p>
      </div>
      
      <div style="background-color: #eff6ff; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
        <h3 style="color: #1e40af; margin-top: 0;">Lead Traveler Information:</h3>
        <p><strong>Name:</strong> ${data.leadTraveler.firstName} ${data.leadTraveler.lastName}</p>
        <p><strong>Email:</strong> ${data.leadTraveler.email}</p>
        <p><strong>Phone:</strong> ${data.leadTraveler.phone}</p>
      </div>
      
      ${data.additionalTravelers && data.additionalTravelers.length > 0 ? `
        <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #374151; margin-top: 0;">Additional Travelers:</h3>
          ${data.additionalTravelers.map((traveler, index) => `
            <div style="margin-bottom: 10px; padding-bottom: 10px; border-bottom: 1px solid #e5e7eb;">
              <p><strong>Traveler ${index + 2}:</strong> ${traveler.firstName} ${traveler.lastName}</p>
            </div>
          `).join('')}
        </div>
      ` : ''}
      
      ${data.specialRequests ? `
        <div style="background-color: #fef2f2; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
          <h3 style="color: #991b1b; margin-top: 0;">Special Requests:</h3>
          <p style="white-space: pre-wrap;">${data.specialRequests}</p>
        </div>
      ` : ''}
      
      <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
        <p style="color: #6b7280; font-size: 14px;">
          <strong>Next Steps:</strong><br>
          1. Contact the lead traveler within 24 hours<br>
          2. Send booking confirmation and payment instructions<br>
          3. Provide pre-trip information and requirements<br>
          4. Update tour availability in the system
        </p>
      </div>
    </div>
  </div>
`;

async function sendWithResend(data: BookingEmailData, resend: any, adminEmail: string) {
  if (!resend) {
    throw new Error('Resend is not configured');
  }

  // Send email to admin only
  const adminResult = await resend.emails.send({
    from: 'Otter Trip <noreply@ottertrip.com>',
    to: adminEmail,
    replyTo: data.leadTraveler.email,
    subject: `[BOOKING] ${data.tourTitle} - ${data.leadTraveler.firstName} ${data.leadTraveler.lastName}`,
    html: getAdminEmailHtml(data),
  });

  if (adminResult.error) {
    throw new Error(adminResult.error.message);
  }

  return adminResult.data;
}

async function sendWithSMTP(data: BookingEmailData, smtpTransporter: any, adminEmail: string) {
  if (!smtpTransporter) {
    throw new Error('SMTP is not configured');
  }

  const fromEmail = process.env.SMTP_FROM || 'noreply@ottertrip.com';

  // Send email to admin only
  await smtpTransporter.sendMail({
    from: `Otter Trip <${fromEmail}>`,
    to: adminEmail,
    replyTo: data.leadTraveler.email,
    subject: `[BOOKING] ${data.tourTitle} - ${data.leadTraveler.firstName} ${data.leadTraveler.lastName}`,
    html: getAdminEmailHtml(data),
  });

  return { id: 'smtp-sent', success: true };
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    if (!body.tourTitle || !body.leadTraveler?.email || !body.leadTraveler?.firstName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Get email provider configuration
    const { emailProvider, adminEmail, resend, smtpTransporter } = await getEmailProvider();

    // Generate booking reference if not provided
    const bookingReference = body.bookingReference || `BOOKING-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;

    // Save booking to database
    const booking = await prisma.booking.create({
      data: {
        bookingReference,
        tourId: body.tourId,
        tourTitle: body.tourTitle,
        location: body.location || '',
        selectedDate: body.selectedDate,
        participants: body.participants,
        pricePerPerson: body.pricePerPerson,
        totalPrice: body.totalPrice,
        leadTraveler: body.leadTraveler,
        additionalTravelers: body.additionalTravelers || [],
        specialRequests: body.specialRequests || null,
        status: 'pending',
      },
    });

    // Prepare email data
    const emailData = {
      ...body,
      bookingReference,
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

    console.log(`Booking confirmation email sent via ${emailProvider}:`, result);

    return NextResponse.json({ 
      success: true, 
      data: {
        ...result,
        bookingReference
      },
      provider: emailProvider 
    });
  } catch (error) {
    console.error('Error sending booking confirmation email:', error);
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