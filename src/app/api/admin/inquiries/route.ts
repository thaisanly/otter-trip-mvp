import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET() {
  try {
    const inquiries = await prisma.inquiry.findMany({
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json(inquiries)
  } catch (error) {
    console.error('Error fetching inquiries:', error)
    return NextResponse.json(
      { error: 'Failed to fetch inquiries' },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}