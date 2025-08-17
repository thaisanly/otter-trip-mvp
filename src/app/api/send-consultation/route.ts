import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { validateConsultationCodeFormat } from '@/utils/codeGenerator';
import { z } from 'zod';
import { env } from '@/lib/env';
import { getEmailProvider, sendWithResend, sendWithSMTP } from '@/lib/email';

// Type definitions
interface ConsultationEmailData {
  expertName: string;
  expertId: string;
  userName: string;
  userEmail: string;
  phone: string;
  message?: string;
  selectedDate: string;
  selectedTime: string;
  selectedDateFormatted?: string;
  invitationCode: string;
  price: number;
  bookingReference: string;
}


// Input validation schema
const consultationBookingSchema = z.object({
  expertName: z.string().min(1, 'Expert name is required'),
  expertId: z.string().min(1, 'Expert ID is required'),
  userName: z.string().min(1, 'User name is required'),
  userEmail: z.string().email('Valid email is required'),
  phone: z.string().min(1, 'Phone number is required'),
  message: z.string().optional(),
  selectedDate: z.string().min(1, 'Selected date is required'),
  selectedTime: z.string().min(1, 'Selected time is required'),
  selectedDateFormatted: z.string().optional(),
  price: z.number().positive().optional(),
  invitationCode: z.string().optional(),
});


// No longer generating invitation codes - using user's provided code from real-world events

// Email template for admin
const getAdminEmailHtml = (data: ConsultationEmailData): string => `
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
        <p><strong>Date:</strong> ${data.selectedDateFormatted || data.selectedDate}</p>
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

// Email template for client (currently unused but available for future use)
/*
const getClientEmailHtml = (data: ConsultationEmailData, adminEmail: string): string => `
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
        <p><strong>Date:</strong> ${data.selectedDateFormatted || data.selectedDate}</p>
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
*/

async function sendConsultationEmail(data: ConsultationEmailData) {
  const { emailProvider, adminEmail, adminEmailCC, resend, smtpTransporter } = await getEmailProvider();
  const subject = `[${data.expertName}] New Consultation Booking - ${data.bookingReference}`;
  const html = getAdminEmailHtml(data);
  
  const emailParams = {
    from: emailProvider === 'resend' 
      ? 'Otter Trip <noreply@ottertrip.com>'
      : `Otter Trip <${env.SMTP_FROM}>`,
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
    
    // Validate input data
    const validationResult = consultationBookingSchema.safeParse(body);
    
    if (!validationResult.success) {
      return NextResponse.json(
        { error: 'Invalid input data', details: validationResult.error.issues },
        { status: 400 }
      );
    }
    
    const data = validationResult.data;
    
    // Validate consultation code if provided
    if (data.invitationCode) {
      // Check format
      if (!validateConsultationCodeFormat(data.invitationCode)) {
        return NextResponse.json(
          { error: 'Invalid consultation code format' },
          { status: 400 }
        );
      }
      
      // Check if code exists and is valid in database
      const consultationCode = await prisma.consultationCode.findUnique({
        where: { code: data.invitationCode }
      });
      
      if (!consultationCode) {
        return NextResponse.json(
          { error: 'Consultation code not found' },
          { status: 400 }
        );
      }
      
      if (consultationCode.status !== 'active') {
        return NextResponse.json(
          { error: `Consultation code is ${consultationCode.status}` },
          { status: 400 }
        );
      }
      
      // Check if code has expired
      if (consultationCode.expiresAt && consultationCode.expiresAt < new Date()) {
        // Update status to expired
        await prisma.consultationCode.update({
          where: { id: consultationCode.id },
          data: { status: 'expired' }
        });
        
        return NextResponse.json(
          { error: 'Consultation code has expired' },
          { status: 400 }
        );
      }
      
      // Check if code has reached max uses
      if (consultationCode.maxUses && consultationCode.usedCount >= consultationCode.maxUses) {
        // Update status to expired
        await prisma.consultationCode.update({
          where: { id: consultationCode.id },
          data: { status: 'expired' }
        });
        
        return NextResponse.json(
          { error: 'Consultation code has reached maximum usage limit' },
          { status: 400 }
        );
      }
      
      // Code is valid - increment usage count
      await prisma.consultationCode.update({
        where: { id: consultationCode.id },
        data: { usedCount: consultationCode.usedCount + 1 }
      });
    }

    // Save consultation booking to database
    const consultationBooking = await prisma.consultationBooking.create({
      data: {
        expertId: data.expertId,
        expertName: data.expertName,
        name: data.userName,
        email: data.userEmail,
        phone: data.phone,
        company: null,
        preferredDate: data.selectedDate,
        preferredTime: data.selectedTime,
        message: data.message || null,
        invitationCode: data.invitationCode || null,
        status: 'pending',
      },
    });

    // Generate booking reference using database ID
    const bookingReference = `OT-${consultationBooking.id.slice(-9).toUpperCase()}`;

    // Prepare email data - use the invitation code provided by user
    const emailData: ConsultationEmailData = {
      expertName: data.expertName,
      expertId: data.expertId,
      userName: data.userName,
      userEmail: data.userEmail,
      phone: data.phone,
      message: data.message,
      selectedDate: data.selectedDate,
      selectedTime: data.selectedTime,
      selectedDateFormatted: data.selectedDateFormatted,
      invitationCode: data.invitationCode || 'Not provided',
      price: data.price || 500, // Default price if not provided
      bookingReference: bookingReference // Use the database-based reference
    };

    // Send email
    const result = await sendConsultationEmail(emailData);
    const { emailProvider } = await getEmailProvider();

    console.log(`[API] Consultation booking email sent via ${emailProvider}:`, result);

    return NextResponse.json({ 
      success: true, 
      data: {
        result,
        bookingReference
      },
      provider: emailProvider 
    });
  } catch (error) {
    console.error('[API] Error sending consultation booking email:', error);
    
    // Don't expose internal error details in production
    const isDevelopment = process.env.NODE_ENV === 'development';
    
    return NextResponse.json(
      { 
        error: 'Failed to send booking confirmation',
        ...(isDevelopment && { details: error instanceof Error ? error.message : 'Unknown error' }),
        provider: env.EMAIL_PROVIDER
      },
      { status: 500 }
    );
  }
}