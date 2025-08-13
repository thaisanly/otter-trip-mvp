import React from 'react';
import TourLeaderShowcase from '../components/sections/TourLeaderShowcase';
import ConversationalSearch from '../components/ui/ConversationalSearch';
import TravelPersonalityQuiz from '../components/sections/TravelPersonalityQuiz';
import VibeMatchingSection from '../components/sections/VibeMatchingSection';
import HowItWorks from '../components/sections/HowItWorks';
const Home = () => {
  return <div>
      {/* Tour Leader Showcase (replaces HeroSection) */}
      <TourLeaderShowcase />
      {/* Conversational Search Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Find Your Perfect Travel Experience
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Tell us what you're looking for in your own words
            </p>
            <ConversationalSearch />
          </div>
        </div>
      </div>
      {/* Travel Personality Quiz */}
      <TravelPersonalityQuiz />
      {/* How It Works Section */}
      <HowItWorks />
      {/* Vibe Matching Section */}
      <VibeMatchingSection />
      {/* Call to Action */}
      <div className="bg-blue-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-6">
            Ready to Connect with Your Perfect Guide?
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Join thousands of travelers who have discovered meaningful
            experiences with guides who match their personality.
          </p>
          <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg">
            Start Your Journey
          </button>
        </div>
      </div>
    </div>;
};
export default Home;