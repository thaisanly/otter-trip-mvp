import { notFound } from 'next/navigation';
import TourLeaderClient from './TourLeaderClient';

async function getTourLeader(id: string) {
  try {
    const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3001'}/api/tour-leaders/${id}`, {
      cache: 'no-store',
    });
    
    if (!res.ok) {
      if (res.status === 404) {
        return null;
      }
      throw new Error('Failed to fetch tour leader');
    }
    
    return res.json();
  } catch (error) {
    console.error('Error fetching tour leader:', error);
    return null;
  }
}

export default async function TourLeaderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tourLeader = await getTourLeader(id);
  
  if (!tourLeader) {
    notFound();
  }
  
  return <TourLeaderClient tourLeader={tourLeader} />;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const tourLeader = await getTourLeader(id);
  
  if (!tourLeader) {
    return {
      title: 'Tour Leader Not Found',
    };
  }
  
  return {
    title: `${tourLeader.name} - ${tourLeader.specialty} | Otter Trip`,
    description: tourLeader.bio || tourLeader.description,
  };
}