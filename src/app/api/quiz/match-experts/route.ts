import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

type QuizAnswers = {
  pace?: string;
  accommodation?: string;
  activities?: string[];
  'group-size'?: string;
  planning?: string;
  'food-adventure'?: string;
  budget?: string;
};

type PersonalityType = {
  id: string;
  type: string;
  description: string;
  icon: string;
  traits: string[];
};

type ExpertMatch = {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  matchPercentage: number;
  specialties: string[];
  languages: string[];
  experience: string;
  tourCount: number;
};

// Quiz result type mapping
const personalityTypes: PersonalityType[] = [
  {
    id: 'cultural-explorer',
    type: 'Cultural Explorer',
    description: 'You travel to immerse yourself in different cultures, learn about history, and experience authentic local traditions. You value meaningful connections with locals and seek to understand the places you visit on a deeper level.',
    icon: '🏛️',
    traits: ['Cultural immersion', 'History buff', 'Local experiences', 'Authentic cuisine', 'Museum lover'],
  },
  {
    id: 'adventure-seeker',
    type: 'Adventure Seeker',
    description: "You're drawn to thrilling experiences, outdoor activities, and pushing your comfort zone while traveling. You crave adrenaline and physical challenges, and your best travel memories often involve conquering fears or testing your limits.",
    icon: '🧗‍♂️',
    traits: ['Thrill-seeker', 'Outdoor enthusiast', 'Active lifestyle', 'Nature lover', 'Spontaneous'],
  },
  {
    id: 'culinary-enthusiast',
    type: 'Culinary Enthusiast',
    description: 'Your travels revolve around food experiences, from street food to fine dining, cooking classes, and food markets. You believe that understanding a culture starts with its cuisine, and your itineraries are planned around culinary discoveries.',
    icon: '🍜',
    traits: ['Food lover', 'Cooking enthusiast', 'Market explorer', 'Flavor adventurer', 'Culinary curious'],
  },
  {
    id: 'relaxation-seeker',
    type: 'Relaxation Seeker',
    description: 'You view travel as an opportunity to unwind and recharge. Your ideal vacation involves beautiful settings, comfortable accommodations, and a slower pace that allows you to truly relax. You appreciate wellness experiences and peaceful environments.',
    icon: '🌴',
    traits: ['Peace lover', 'Wellness focused', 'Beach enthusiast', 'Slow travel', 'Comfort seeker'],
  },
];

// Function to calculate personality type based on quiz answers
function calculatePersonalityType(answers: QuizAnswers): PersonalityType {
  const activitiesAnswer = answers.activities;
  
  if (Array.isArray(activitiesAnswer) && activitiesAnswer.length > 0) {
    if (activitiesAnswer.includes('adventure')) {
      return personalityTypes.find((p) => p.id === 'adventure-seeker')!;
    } else if (activitiesAnswer.includes('food')) {
      return personalityTypes.find((p) => p.id === 'culinary-enthusiast')!;
    } else if (activitiesAnswer.includes('culture')) {
      return personalityTypes.find((p) => p.id === 'cultural-explorer')!;
    } else if (activitiesAnswer.includes('relaxation')) {
      return personalityTypes.find((p) => p.id === 'relaxation-seeker')!;
    }
  }
  
  // Fallback based on planning style
  const planningStyle = answers.planning;
  if (planningStyle === 'spontaneous') {
    return personalityTypes.find((p) => p.id === 'adventure-seeker')!;
  } else if (planningStyle === 'detailed') {
    return personalityTypes.find((p) => p.id === 'cultural-explorer')!;
  }
  
  // Default fallback
  return personalityTypes.find((p) => p.id === 'cultural-explorer')!;
}

// Function to match experts based on personality type and preferences
async function matchExperts(personalityType: PersonalityType): Promise<ExpertMatch[]> {
  try {
    // Get all active experts from database
    const experts = await prisma.expert.findMany({
      where: {
        isActive: true,
      },
      orderBy: {
        rating: 'desc',
      },
    });

    // Convert database experts to ExpertMatch format with scoring
    const expertMatches: (ExpertMatch & { score: number })[] = experts.map((expert) => {
      let score = 50; // Base score
      const expertise = Array.isArray(expert.expertise) ? expert.expertise as string[] : [];
      const languages = Array.isArray(expert.languages) ? expert.languages as string[] : [];
      
      // Score based on personality type and expertise alignment
      if (personalityType.id === 'adventure-seeker') {
        if (expertise.some(e => e.toLowerCase().includes('adventure') || 
                               e.toLowerCase().includes('outdoor') || 
                               e.toLowerCase().includes('hiking') ||
                               e.toLowerCase().includes('sports'))) {
          score += 40;
        }
      } else if (personalityType.id === 'cultural-explorer') {
        if (expertise.some(e => e.toLowerCase().includes('culture') || 
                               e.toLowerCase().includes('history') || 
                               e.toLowerCase().includes('museum') ||
                               e.toLowerCase().includes('heritage'))) {
          score += 40;
        }
      } else if (personalityType.id === 'culinary-enthusiast') {
        if (expertise.some(e => e.toLowerCase().includes('food') || 
                               e.toLowerCase().includes('culinary') || 
                               e.toLowerCase().includes('cooking') ||
                               e.toLowerCase().includes('restaurant'))) {
          score += 40;
        }
      } else if (personalityType.id === 'relaxation-seeker') {
        if (expertise.some(e => e.toLowerCase().includes('wellness') || 
                               e.toLowerCase().includes('spa') || 
                               e.toLowerCase().includes('beach') ||
                               e.toLowerCase().includes('relaxation'))) {
          score += 40;
        }
      }

      // Additional scoring based on rating and experience
      score += Math.min(expert.rating * 5, 25); // Up to 25 points for rating
      if (expert.experience) {
        const expMatch = expert.experience.match(/(\d+)/);
        if (expMatch) {
          score += Math.min(parseInt(expMatch[1]), 15); // Up to 15 points for years of experience
        }
      }

      // Ensure score doesn't exceed 100
      score = Math.min(score, 100);

      return {
        id: expert.id,
        name: expert.name,
        image: expert.image,
        location: expert.location,
        rating: expert.rating,
        matchPercentage: Math.round(score),
        specialties: expertise.slice(0, 3), // Take first 3 specialties
        languages: languages,
        experience: expert.experience || '5+ years',
        tourCount: Math.floor(Math.random() * 100) + 50, // Mock tour count for now
        score,
      };
    });

    // Sort by score and return top matches
    const sortedMatches = expertMatches.sort((a, b) => b.score - a.score);
    
    // Return matches without the score property
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    return sortedMatches.map(({ score, ...match }) => match);
  } catch (error) {
    console.error('Error matching experts:', error);
    return [];
  }
}

// Function to ensure we always return exactly 3 results
async function ensureThreeResults(matches: ExpertMatch[]): Promise<ExpertMatch[]> {
  if (matches.length >= 3) {
    return matches.slice(0, 3);
  }

  // If we have fewer than 3 matches, get more experts from database
  try {
    const additionalExperts = await prisma.expert.findMany({
      where: {
        isActive: true,
        id: {
          notIn: matches.map(m => m.id),
        },
      },
      orderBy: {
        rating: 'desc',
      },
      take: 3 - matches.length,
    });

    const additionalMatches: ExpertMatch[] = additionalExperts.map((expert) => {
      const expertise = Array.isArray(expert.expertise) ? expert.expertise as string[] : [];
      const languages = Array.isArray(expert.languages) ? expert.languages as string[] : [];
      
      return {
        id: expert.id,
        name: expert.name,
        image: expert.image,
        location: expert.location,
        rating: expert.rating,
        matchPercentage: Math.floor(Math.random() * 20) + 70, // 70-89% for fallback matches
        specialties: expertise.slice(0, 3),
        languages: languages,
        experience: expert.experience || '5+ years',
        tourCount: Math.floor(Math.random() * 100) + 50,
      };
    });

    return [...matches, ...additionalMatches];
  } catch (error) {
    console.error('Error fetching additional experts:', error);
    return matches;
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { answers } = body as { answers: QuizAnswers };

    if (!answers) {
      return NextResponse.json({ error: 'Quiz answers are required' }, { status: 400 });
    }

    // Calculate personality type based on answers
    const personalityType = calculatePersonalityType(answers);

    // Match experts based on personality type and preferences
    let expertMatches = await matchExperts(personalityType);

    // Ensure we always return exactly 3 results
    expertMatches = await ensureThreeResults(expertMatches);

    const result = {
      personalityType: {
        ...personalityType,
        matches: expertMatches,
      },
    };

    return NextResponse.json(result);
  } catch (error) {
    console.error('Error processing quiz results:', error);
    return NextResponse.json(
      { error: 'Failed to process quiz results', details: error instanceof Error ? error.message : String(error) },
      { status: 500 }
    );
  }
}