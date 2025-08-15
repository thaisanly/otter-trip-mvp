import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const consultations = await prisma.consultationBooking.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(consultations)
  } catch (error) {
    console.error('Error fetching consultations:', error)
    return NextResponse.json(
      { error: 'Failed to fetch consultations' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}