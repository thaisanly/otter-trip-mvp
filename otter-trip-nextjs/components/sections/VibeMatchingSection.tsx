'use client'

import { Link } from 'next/link';
import InterestTag from '../ui/InterestTag';
const personalityTraits = [
  {
    id: 'adventurous',
    label: 'Adventurous',
    emoji: '🧗‍♂️',
  },
  {
    id: 'laid-back',
    label: 'Laid-back',
    emoji: '🏝️',
  },
  {
    id: 'foodie',
    label: 'Foodie',
    emoji: '🍜',
  },
  {
    id: 'cultural',
    label: 'Cultural',
    emoji: '🏛️',
  },
  {
    id: 'photography',
    label: 'Photography',
    emoji: '📸',
  },
  {
    id: 'nature-focused',
    label: 'Nature-focused',
    emoji: '🌿',
  },
  {
    id: 'spiritual',
    label: 'Spiritual',
    emoji: '✨',
  },
  {
    id: 'social',
    label: 'Social',
    emoji: '👥',
  },
];

const VibeMatchingSection = () => {
  return (
    <div className="bg-gray-50 py-16">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col lg:flex-row items-center gap-12">
            <div className="lg:w-1/2">
              <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
                Find Guides Who Match Your Travel Vibe
              </h2>
              <p className="text-lg text-gray-600 mb-6">
                Our personality matching algorithm connects you with guides who share your travel
                style and interests, creating more meaningful and enjoyable experiences.
              </p>
              <div className="mb-8">
                <div className="text-lg font-medium text-gray-900 mb-3">
                  Select your travel personality traits:
                </div>
                <div className="flex flex-wrap gap-2 mb-4">
                  {personalityTraits.map((trait) => (
                    <InterestTag
                      key={trait.id}
                      label={trait.label}
                      icon={<span className="text-lg">{trait.emoji}</span>}
                      onClick={() => console.log('Personality trait selected:', trait.label)}
                    />
                  ))}
                </div>
              </div>
              <div className="bg-blue-50 border border-blue-100 rounded-lg p-5 mb-8">
                <div className="flex items-start">
                  <div className="bg-blue-100 rounded-full p-2 mr-4 mt-1">
                    <span className="text-blue-700 text-xl">💡</span>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">How Our Matching Works</h4>
                    <p className="text-gray-600">
                      We analyze both travelers' and guides' preferences, communication styles, and
                      activity interests to suggest compatible matches. This leads to more authentic
                      connections and personalized experiences.
                    </p>
                  </div>
                </div>
              </div>
              <Link
                href="/search"
                className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg"
              >
                Find Your Guide Match
              </Link>
            </div>
            <div className="lg:w-1/2">
              <div className="relative">
                <div className="absolute -left-4 -top-4 w-24 h-24 md:w-32 md:h-32 bg-blue-100 rounded-lg z-0"></div>
                <div className="absolute -right-4 -bottom-4 w-24 h-24 md:w-32 md:h-32 bg-green-100 rounded-lg z-0"></div>
                <div className="relative z-10 bg-white rounded-xl shadow-lg overflow-hidden">
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="font-bold text-lg">Personality Match</h3>
                      <div className="bg-green-100 text-green-800 text-sm font-medium px-3 py-1 rounded-full">
                        92% Match
                      </div>
                    </div>
                    <div className="flex items-center mb-6">
                      <div className="relative mr-4">
                        <img
                          src="https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80"
                          alt="Tour guide"
                          className="w-16 h-16 rounded-full object-cover"
                        />
                        <div className="absolute -bottom-1 -right-1 bg-green-500 w-5 h-5 rounded-full border-2 border-white"></div>
                      </div>
                      <div>
                        <h4 className="font-medium text-gray-900">Sarah Johnson</h4>
                        <p className="text-gray-600 text-sm">Bali, Indonesia</p>
                      </div>
                    </div>
                    <div className="mb-4">
                      <div className="text-sm font-medium text-gray-700 mb-2">
                        Shared interests:
                      </div>
                      <div className="flex flex-wrap gap-2">
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                          Photography
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                          Nature-focused
                        </span>
                        <span className="bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full text-xs">
                          Adventurous
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-600 text-sm">
                      "Based on your preferences, Sarah's travel style and personality would be a
                      great match for your adventure in Bali!"
                    </p>
                  </div>
                  <div className="p-6 bg-gray-50">
                    <div className="flex justify-between items-center">
                      <div>
                        <div className="font-medium text-gray-900">Waterfall Trek & Photo Tour</div>
                        <div className="text-gray-600 text-sm">Jun 15-17, 2023</div>
                      </div>
                      <div className="font-bold text-lg">$85</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
export default VibeMatchingSection;
