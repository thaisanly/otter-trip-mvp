'use client'

import { useRouter } from 'next/navigation';
import TourLeaderShowcase from '../../components/sections/TourLeaderShowcase';
import TravelPersonalityQuiz from '../../components/sections/TravelPersonalityQuiz';
import HowItWorks from '../../components/sections/HowItWorks';

const Home = () => {
  const router = useRouter();

  return (
    <div>
      {/* Tour Leader Showcase (replaces HeroSection) */}
      <TourLeaderShowcase />

      {/* Travel Personality Quiz */}
      <TravelPersonalityQuiz />
      
      {/* How It Works Section */}
      <HowItWorks />
      
      {/* Vibe Matching Section */}
      {/* <VibeMatchingSection /> */}
      
      {/* Call to Action */}
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Connect with Your Perfect Guide?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join thousands of travelers who have discovered meaningful experiences with guides who
            match their personality.
          </p>
          <button
            onClick={() => {
              router.push('/meet-experts');
              window.scrollTo(0, 0);
            }}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg"
          >
            Start Your Journey
          </button>
        </div>
      </div>
    </div>
  );
};

export default Home;