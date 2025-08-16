import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import crypto from 'crypto';
import nodemailer from 'nodemailer';
import { env } from '@/lib/env';

const prisma = new PrismaClient();

// Create email transporter
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: parseInt(process.env.SMTP_PORT || '587'),
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASSWORD,
  },
});

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Please provide a valid email address' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingSubscriber = await prisma.newsletter.findUnique({
      where: { email },
    });

    if (existingSubscriber) {
      // If already confirmed, do nothing
      if (existingSubscriber.isConfirmed) {
        return NextResponse.json(
          { message: 'You are already subscribed to our newsletter' },
          { status: 200 }
        );
      }
      
      // If not confirmed, resend confirmation email
      const confirmationToken = existingSubscriber.confirmationToken;
      const confirmationUrl = `${env.APP_BASE_URL}/newsletter/confirm/${confirmationToken}`;
      
      // Send confirmation email
      await transporter.sendMail({
        from: process.env.SMTP_FROM || 'noreply@ottertrip.com',
        to: email,
        subject: 'Confirm Your Newsletter Subscription - Otter Trip',
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #333;">Welcome to Otter Trip Newsletter!</h2>
            <p>Thank you for subscribing to our newsletter. Please confirm your subscription by clicking the link below:</p>
            <a href="${confirmationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Confirm Subscription</a>
            <p>Or copy and paste this link into your browser:</p>
            <p style="color: #666; word-break: break-all;">${confirmationUrl}</p>
            <p style="color: #999; font-size: 14px;">If you didn't subscribe to our newsletter, you can safely ignore this email.</p>
          </div>
        `,
      });
      
      return NextResponse.json(
        { message: 'Confirmation email resent. Please check your inbox.' },
        { status: 200 }
      );
    }

    // Generate confirmation token
    const confirmationToken = crypto.randomBytes(32).toString('hex');
    
    // Create new subscriber with pending status
    await prisma.newsletter.create({
      data: {
        email,
        confirmationToken,
        isConfirmed: false,
      },
    });

    // Generate confirmation URL
    const confirmationUrl = `${env.APP_BASE_URL}/newsletter/confirm/${confirmationToken}`;
    
    // Send confirmation email
    await transporter.sendMail({
      from: process.env.SMTP_FROM || 'noreply@ottertrip.com',
      to: email,
      subject: 'Confirm Your Newsletter Subscription - Otter Trip',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #333;">Welcome to Otter Trip Newsletter!</h2>
          <p>Thank you for subscribing to our newsletter. Please confirm your subscription by clicking the link below:</p>
          <a href="${confirmationUrl}" style="display: inline-block; padding: 12px 24px; background-color: #10b981; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0;">Confirm Subscription</a>
          <p>Or copy and paste this link into your browser:</p>
          <p style="color: #666; word-break: break-all;">${confirmationUrl}</p>
          <p style="color: #999; font-size: 14px;">If you didn't subscribe to our newsletter, you can safely ignore this email.</p>
        </div>
      `,
    });

    return NextResponse.json(
      { message: 'Subscription successful! Please check your email to confirm.' },
      { status: 201 }
    );
  } catch (error) {
    console.error('Newsletter subscription error:', error);
    return NextResponse.json(
      { error: 'Failed to subscribe. Please try again later.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}