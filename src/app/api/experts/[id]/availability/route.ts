import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Generate default weekly availability (standard working hours)
function generateDefaultWeeklyAvailability() {
  return {
    sunday: { available: false, slots: [] },
    monday: { available: true, slots: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'] },
    tuesday: { available: true, slots: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'] },
    wednesday: { available: true, slots: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'] },
    thursday: { available: true, slots: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'] },
    friday: { available: true, slots: ['09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00'] },
    saturday: { available: false, slots: [] }
  };
}

// Convert weekly availability to daily availability for the next 30 days
function convertWeeklyToDaily(weeklyAvailability: Record<string, { available: boolean; slots: string[] }>) {
  const dailyAvailability: Record<string, { available: boolean; slots: string[] }> = {};
  const today = new Date();
  const dayNames = ['sunday', 'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
  
  // Generate availability for the next 30 days
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    const dayOfWeek = date.getDay();
    const dayName = dayNames[dayOfWeek];
    
    const dayAvailability = weeklyAvailability[dayName];
    if (dayAvailability && dayAvailability.available) {
      // Clone the slots array to avoid reference issues
      dailyAvailability[dateStr] = {
        available: true,
        slots: [...dayAvailability.slots]
      };
    }
  }
  
  return dailyAvailability;
}

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    
    // Fetch expert from database
    const expert = await prisma.expert.findUnique({
      where: { id },
      select: { availability: true }
    });
    
    if (!expert) {
      return NextResponse.json(
        { error: 'Expert not found' },
        { status: 404 }
      );
    }
    
    // Get weekly availability (from DB or default)
    const weeklyAvailability = (expert.availability as Record<string, { available: boolean; slots: string[] }>) || generateDefaultWeeklyAvailability();
    
    // Convert weekly schedule to daily availability for the next 30 days
    const dailyAvailability = convertWeeklyToDaily(weeklyAvailability);
    
    return NextResponse.json(dailyAvailability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}