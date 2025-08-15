import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    if (!token) {
      return NextResponse.json(
        { error: 'Confirmation token is required' },
        { status: 400 }
      );
    }

    // Find subscriber by confirmation token
    const subscriber = await prisma.newsletter.findUnique({
      where: { confirmationToken: token },
    });

    if (!subscriber) {
      return NextResponse.json(
        { error: 'Invalid confirmation token' },
        { status: 404 }
      );
    }

    if (subscriber.isConfirmed) {
      return NextResponse.json(
        { message: 'Your subscription is already confirmed' },
        { status: 200 }
      );
    }

    // Update subscriber status to confirmed
    await prisma.newsletter.update({
      where: { id: subscriber.id },
      data: {
        isConfirmed: true,
        confirmedAt: new Date(),
      },
    });

    return NextResponse.json(
      { 
        message: 'Your subscription has been confirmed successfully!',
        email: subscriber.email 
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Newsletter confirmation error:', error);
    return NextResponse.json(
      { error: 'Failed to confirm subscription. Please try again later.' },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}