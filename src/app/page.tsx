'use client';

import dynamic from 'next/dynamic';
import { Suspense } from 'react';
import HeroSection from '../components/sections/HeroSection';
import CallToAction from '../components/sections/CallToAction';

// Lazy load non-critical components
const TravelPersonalityQuiz = dynamic(
  () => import('../components/sections/TravelPersonalityQuiz'),
  { 
    loading: () => <QuizSkeleton />,
    ssr: false 
  }
);

const HowItWorks = dynamic(
  () => import('../components/sections/HowItWorks'),
  { 
    loading: () => <SectionSkeleton />
  }
);

// Loading skeletons
function QuizSkeleton() {
  return (
    <div className="bg-blue-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl h-[520px] animate-pulse">
            <div className="h-full bg-gray-200 rounded-2xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
}

function SectionSkeleton() {
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="h-[332px] bg-gray-200 rounded-xl animate-pulse"></div>
      </div>
    </div>
  );
}

const Home = () => {
  return (
    <div>
      {/* Hero Section - Server rendered for fast initial paint */}
      <HeroSection />

      {/* Travel Personality Quiz - Lazy loaded */}
      <Suspense fallback={<QuizSkeleton />}>
        <TravelPersonalityQuiz />
      </Suspense>
      
      {/* How It Works Section - Lazy loaded */}
      <Suspense fallback={<SectionSkeleton />}>
        <HowItWorks />
      </Suspense>
      
      {/* Vibe Matching Section */}
      {/* <VibeMatchingSection /> */}
      
      {/* Call to Action - Server rendered */}
      <CallToAction />
    </div>
  );
};

export default Home;