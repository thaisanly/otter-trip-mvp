import React, { useState } from 'react';
import InterestTag from '../ui/InterestTag';
type PersonalityMatchProps = {
  tourLeaderPersonality: string[];
  userPreferences?: string[];
  showMatchPercentage?: boolean;
  className?: string;
};
const personalityTraits = [
  {
    id: 'laid-back',
    label: 'Laid-back',
    emoji: '🏝️',
  },
  {
    id: 'high-energy',
    label: 'High-energy',
    emoji: '⚡',
  },
  {
    id: 'educational',
    label: 'Educational',
    emoji: '🎓',
  },
  {
    id: 'social',
    label: 'Social',
    emoji: '👥',
  },
  {
    id: 'solo-friendly',
    label: 'Solo-friendly',
    emoji: '🧍',
  },
  {
    id: 'family-oriented',
    label: 'Family-oriented',
    emoji: '👨‍👩‍👧‍👦',
  },
  {
    id: 'art-lover',
    label: 'Art-lover',
    emoji: '🎨',
  },
  {
    id: 'foodie',
    label: 'Foodie',
    emoji: '🍜',
  },
  {
    id: 'adventurous',
    label: 'Adventurous',
    emoji: '🧗‍♂️',
  },
  {
    id: 'spiritual',
    label: 'Spiritual',
    emoji: '✨',
  },
  {
    id: 'nature-focused',
    label: 'Nature-focused',
    emoji: '🌿',
  },
  {
    id: 'photography',
    label: 'Photography',
    emoji: '📸',
  },
];
const PersonalityMatch = ({
  tourLeaderPersonality,
  userPreferences = [],
  showMatchPercentage = true,
  className = '',
}: PersonalityMatchProps) => {
  const [showAll, setShowAll] = useState(false);
  // Calculate match percentage if user preferences exist
  const calculateMatchPercentage = () => {
    if (userPreferences.length === 0) return 0;
    const matchCount = tourLeaderPersonality.filter((trait) =>
      userPreferences.includes(trait)
    ).length;
    return Math.round((matchCount / userPreferences.length) * 100);
  };
  const matchPercentage = calculateMatchPercentage();
  const displayTraits = showAll ? tourLeaderPersonality : tourLeaderPersonality.slice(0, 5);
  return (
    <div className={`bg-white rounded-xl shadow-sm p-6 ${className}`}>
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg text-gray-900">Personality & Travel Style</h3>
        {showMatchPercentage && userPreferences.length > 0 && (
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-2">
              <span className="text-blue-700 font-bold">{matchPercentage}%</span>
            </div>
            <span className="text-sm text-gray-600">Match with your preferences</span>
          </div>
        )}
      </div>
      <div className="flex flex-wrap gap-2 mb-3">
        {displayTraits.map((trait) => {
          const traitInfo = personalityTraits.find((t) => t.id === trait.toLowerCase()) || {
            id: trait.toLowerCase(),
            label: trait,
            emoji: '✨',
          };
          const isMatch = userPreferences.includes(trait);
          return (
            <InterestTag
              key={trait}
              label={traitInfo.label}
              icon={<span className="text-lg">{traitInfo.emoji}</span>}
              selected={isMatch}
              className={isMatch ? 'border-green-600 bg-green-50 text-green-800' : ''}
            />
          );
        })}
      </div>
      {tourLeaderPersonality.length > 5 && (
        <button
          onClick={() => setShowAll(!showAll)}
          className="text-blue-600 text-sm font-medium hover:text-blue-800"
        >
          {showAll ? 'Show less' : `Show all (${tourLeaderPersonality.length})`}
        </button>
      )}
      {userPreferences.length === 0 && (
        <div className="mt-4 p-3 bg-blue-50 rounded-lg border border-blue-100 text-sm text-gray-700">
          <p>
            Set your personality preferences in your profile to see how well you match with this
            guide.
          </p>
        </div>
      )}
    </div>
  );
};
export default PersonalityMatch;
