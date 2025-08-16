import { NextResponse } from 'next/server';

// Generate availability data for the next 30 days
function generateAvailability() {
  const availability: Record<string, { available: boolean; start: string; end: string }> = {};
  const today = new Date();
  
  for (let i = 0; i < 30; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];
    
    // Skip weekends
    const dayOfWeek = date.getDay();
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    
    // Randomly make some weekdays unavailable (30% chance)
    const isUnavailable = !isWeekend && Math.random() < 0.3;
    
    availability[dateStr] = {
      available: !isWeekend && !isUnavailable,
      start: '09:00',
      end: '17:00'
    };
  }
  
  return availability;
}

export async function GET() {
  try {
    // In a real app, you would fetch this from a database based on the expert ID
    // For now, we'll return mock availability data
    const availability = generateAvailability();
    
    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}