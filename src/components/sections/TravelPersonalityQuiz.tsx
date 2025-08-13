import React, { useEffect, useState, useRef, memo } from 'react';
import {
  ChevronRightIcon,
  CheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  RefreshCwIcon,
  ShareIcon,
  MessageCircleIcon,
  StarIcon,
  ClockIcon,
  MapPinIcon,
  GlobeIcon,
  UserIcon,
  UsersIcon,
  ShoppingBagIcon,
  CameraIcon,
  UtensilsIcon,
  HeartIcon,
} from 'lucide-react';
// Define types for the quiz
type QuizQuestion = {
  id: string;
  question: string;
  description?: string;
  options: QuizOption[];
};
type QuizOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
};
type PersonalityType = {
  id: string;
  type: string;
  description: string;
  icon: string;
  traits: string[];
  matches: ExpertMatch[];
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
  experience: number;
  tourCount: number;
};
// Quiz questions data
const quizQuestions: QuizQuestion[] = [
  {
    id: 'pace',
    question: "What's your ideal travel pace?",
    description: 'This helps us understand how you like to structure your time while traveling.',
    options: [
      {
        id: 'relaxed',
        label: 'Relaxed & Unhurried',
        icon: <span className="text-3xl">🧘</span>,
        description: 'I prefer taking my time, with plenty of downtime between activities',
      },
      {
        id: 'balanced',
        label: 'Balanced Mix',
        icon: <span className="text-3xl">⚖️</span>,
        description: 'I like a good mix of planned activities and free time',
      },
      {
        id: 'active',
        label: 'Active & Packed',
        icon: <span className="text-3xl">🏃</span>,
        description: 'I want to maximize my time and experience as much as possible',
      },
    ],
  },
  {
    id: 'accommodation',
    question: "What's your preferred accommodation style?",
    options: [
      {
        id: 'luxury',
        label: 'Luxury & Comfort',
        icon: <span className="text-3xl">🏨</span>,
        description: 'High-end hotels with all amenities',
      },
      {
        id: 'boutique',
        label: 'Boutique & Unique',
        icon: <span className="text-3xl">🏡</span>,
        description: 'Charming, smaller hotels with character',
      },
      {
        id: 'local',
        label: 'Authentic & Local',
        icon: <span className="text-3xl">🏠</span>,
        description: 'Homestays, guesthouses, or local accommodations',
      },
      {
        id: 'budget',
        label: 'Practical & Budget',
        icon: <span className="text-3xl">🎒</span>,
        description: 'Hostels or budget-friendly options',
      },
    ],
  },
  {
    id: 'activities',
    question: 'Which activities do you enjoy most while traveling?',
    description: 'Select all that apply to you.',
    options: [
      {
        id: 'adventure',
        label: 'Adventure & Outdoors',
        icon: <span className="text-3xl">🧗</span>,
        description: 'Hiking, water sports, physical activities',
      },
      {
        id: 'culture',
        label: 'Culture & History',
        icon: <span className="text-3xl">🏛️</span>,
        description: 'Museums, historical sites, local traditions',
      },
      {
        id: 'food',
        label: 'Food & Cuisine',
        icon: <span className="text-3xl">🍜</span>,
        description: 'Culinary experiences, cooking classes, food tours',
      },
      {
        id: 'relaxation',
        label: 'Relaxation & Wellness',
        icon: <span className="text-3xl">🌴</span>,
        description: 'Beaches, spas, yoga, peaceful settings',
      },
    ],
  },
  {
    id: 'group-size',
    question: "What's your preferred group size when traveling?",
    options: [
      {
        id: 'solo',
        label: 'Solo Travel',
        icon: <span className="text-3xl">🧍</span>,
        description: 'I prefer traveling on my own',
      },
      {
        id: 'couple',
        label: 'Couple/With Partner',
        icon: <span className="text-3xl">👫</span>,
        description: 'Just me and my partner',
      },
      {
        id: 'small',
        label: 'Small Group',
        icon: <span className="text-3xl">👥</span>,
        description: '3-8 people, intimate setting',
      },
      {
        id: 'large',
        label: 'Larger Group',
        icon: <span className="text-3xl">👨‍👩‍👧‍👦</span>,
        description: 'I enjoy the energy of larger groups',
      },
    ],
  },
  {
    id: 'planning',
    question: 'How do you prefer to plan your trips?',
    options: [
      {
        id: 'detailed',
        label: 'Detailed Itinerary',
        icon: <span className="text-3xl">📝</span>,
        description: 'I like having everything planned in advance',
      },
      {
        id: 'flexible',
        label: 'Flexible Framework',
        icon: <span className="text-3xl">🗓️</span>,
        description: 'I plan major activities but leave room for spontaneity',
      },
      {
        id: 'spontaneous',
        label: 'Spontaneous',
        icon: <span className="text-3xl">🎲</span>,
        description: 'I prefer minimal planning and going with the flow',
      },
    ],
  },
  {
    id: 'food-adventure',
    question: "What's your food adventure level?",
    options: [
      {
        id: 'adventurous',
        label: 'Very Adventurous',
        icon: <span className="text-3xl">🦞</span>,
        description: "I'll try anything, the more unusual the better",
      },
      {
        id: 'open',
        label: 'Open to New Things',
        icon: <span className="text-3xl">🍲</span>,
        description: 'I enjoy trying local cuisine but have some limits',
      },
      {
        id: 'cautious',
        label: 'Somewhat Cautious',
        icon: <span className="text-3xl">🍕</span>,
        description: 'I stick to familiar foods with occasional ventures',
      },
      {
        id: 'comfort',
        label: 'Comfort Foods',
        icon: <span className="text-3xl">🍔</span>,
        description: "I prefer familiar foods that I know I'll enjoy",
      },
    ],
  },
  {
    id: 'budget',
    question: "What's your typical travel budget approach?",
    options: [
      {
        id: 'luxury',
        label: 'Luxury Experience',
        icon: <span className="text-3xl">💎</span>,
        description: "I'm willing to spend for premium experiences",
      },
      {
        id: 'mid-range',
        label: 'Mid-range',
        icon: <span className="text-3xl">💰</span>,
        description: 'I balance cost with quality, occasional splurges',
      },
      {
        id: 'budget',
        label: 'Budget-conscious',
        icon: <span className="text-3xl">💵</span>,
        description: 'I look for good value and affordable options',
      },
      {
        id: 'backpacker',
        label: 'Backpacker Style',
        icon: <span className="text-3xl">🎒</span>,
        description: 'I stretch my budget to travel longer',
      },
    ],
  },
];
// Personality types based on quiz answers
const personalityTypes: PersonalityType[] = [
  {
    id: 'cultural-explorer',
    type: 'Cultural Explorer',
    description:
      'You travel to immerse yourself in different cultures, learn about history, and experience authentic local traditions. You value meaningful connections with locals and seek to understand the places you visit on a deeper level.',
    icon: '🏛️',
    traits: [
      'Cultural immersion',
      'History buff',
      'Local experiences',
      'Authentic cuisine',
      'Museum lover',
    ],
    matches: [
      {
        id: '1',
        name: 'Sarah Johnson',
        image:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Kyoto, Japan',
        rating: 4.9,
        matchPercentage: 95,
        specialties: ['Cultural Tours', 'Historical Sites', 'Local Traditions'],
        languages: ['English', 'Japanese'],
        experience: 8,
        tourCount: 120,
      },
      {
        id: '2',
        name: 'Miguel Santos',
        image:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Barcelona, Spain',
        rating: 4.8,
        matchPercentage: 92,
        specialties: ['Art History', 'Architecture', 'Museums'],
        languages: ['English', 'Spanish', 'Catalan'],
        experience: 6,
        tourCount: 85,
      },
      {
        id: '3',
        name: 'Aisha Patel',
        image:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Delhi, India',
        rating: 4.7,
        matchPercentage: 88,
        specialties: ['Heritage Sites', 'Religious History', 'Cultural Festivals'],
        languages: ['English', 'Hindi', 'Urdu'],
        experience: 10,
        tourCount: 150,
      },
    ],
  },
  {
    id: 'adventure-seeker',
    type: 'Adventure Seeker',
    description:
      "You're drawn to thrilling experiences, outdoor activities, and pushing your comfort zone while traveling. You crave adrenaline and physical challenges, and your best travel memories often involve conquering fears or testing your limits.",
    icon: '🧗‍♂️',
    traits: [
      'Thrill-seeker',
      'Outdoor enthusiast',
      'Active lifestyle',
      'Nature lover',
      'Spontaneous',
    ],
    matches: [
      {
        id: '4',
        name: 'James Wilson',
        image:
          'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Queenstown, New Zealand',
        rating: 4.9,
        matchPercentage: 97,
        specialties: ['Extreme Sports', 'Hiking', 'Mountain Biking'],
        languages: ['English'],
        experience: 12,
        tourCount: 210,
      },
      {
        id: '5',
        name: 'Alex Rivera',
        image:
          'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Costa Rica',
        rating: 4.8,
        matchPercentage: 94,
        specialties: ['Rainforest Adventures', 'Surfing', 'Zip-lining'],
        languages: ['English', 'Spanish'],
        experience: 9,
        tourCount: 175,
      },
      {
        id: '6',
        name: 'Emma Chen',
        image:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Chiang Mai, Thailand',
        rating: 4.7,
        matchPercentage: 89,
        specialties: ['Jungle Trekking', 'Rock Climbing', 'Whitewater Rafting'],
        languages: ['English', 'Thai', 'Mandarin'],
        experience: 7,
        tourCount: 130,
      },
    ],
  },
  {
    id: 'culinary-enthusiast',
    type: 'Culinary Enthusiast',
    description:
      'Your travels revolve around food experiences, from street food to fine dining, cooking classes, and food markets. You believe that understanding a culture starts with its cuisine, and your itineraries are planned around culinary discoveries.',
    icon: '🍜',
    traits: [
      'Food lover',
      'Cooking enthusiast',
      'Market explorer',
      'Flavor adventurer',
      'Culinary curious',
    ],
    matches: [
      {
        id: '7',
        name: 'Thomas Laurent',
        image:
          'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Lyon, France',
        rating: 4.9,
        matchPercentage: 96,
        specialties: ['Gourmet Tours', 'Wine Tasting', 'Cooking Classes'],
        languages: ['English', 'French'],
        experience: 15,
        tourCount: 230,
      },
      {
        id: '8',
        name: 'Mei Lin',
        image:
          'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Hong Kong',
        rating: 4.8,
        matchPercentage: 93,
        specialties: ['Street Food', 'Dim Sum', 'Market Tours'],
        languages: ['English', 'Cantonese', 'Mandarin'],
        experience: 8,
        tourCount: 145,
      },
      {
        id: '9',
        name: 'Sofia Romano',
        image:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Rome, Italy',
        rating: 4.9,
        matchPercentage: 91,
        specialties: ['Pasta Making', 'Food History', 'Regional Cuisine'],
        languages: ['English', 'Italian'],
        experience: 11,
        tourCount: 190,
      },
    ],
  },
  {
    id: 'relaxation-seeker',
    type: 'Relaxation Seeker',
    description:
      'You view travel as an opportunity to unwind and recharge. Your ideal vacation involves beautiful settings, comfortable accommodations, and a slower pace that allows you to truly relax. You appreciate wellness experiences and peaceful environments.',
    icon: '🌴',
    traits: [
      'Peace lover',
      'Wellness focused',
      'Beach enthusiast',
      'Slow travel',
      'Comfort seeker',
    ],
    matches: [
      {
        id: '10',
        name: 'Elena Petrova',
        image:
          'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Bali, Indonesia',
        rating: 4.8,
        matchPercentage: 98,
        specialties: ['Wellness Retreats', 'Yoga', 'Beach Getaways'],
        languages: ['English', 'Russian', 'Indonesian'],
        experience: 9,
        tourCount: 160,
      },
      {
        id: '11',
        name: 'David Kim',
        image:
          'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Maldives',
        rating: 4.9,
        matchPercentage: 95,
        specialties: ['Island Retreats', 'Spa Experiences', 'Sunset Cruises'],
        languages: ['English', 'Korean'],
        experience: 7,
        tourCount: 110,
      },
      {
        id: '12',
        name: 'Maria Costa',
        image:
          'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80',
        location: 'Santorini, Greece',
        rating: 4.7,
        matchPercentage: 90,
        specialties: ['Scenic Tours', 'Relaxing Getaways', 'Luxury Experiences'],
        languages: ['English', 'Greek', 'Portuguese'],
        experience: 6,
        tourCount: 95,
      },
    ],
  },
];
const TravelPersonalityQuiz = () => {
  // State for quiz flow
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [personalityResult, setPersonalityResult] = useState<PersonalityType | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  // Refs for scroll management
  const quizRef = useRef<HTMLDivElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);
  // Calculate current progress
  const progress = Math.round(((currentStep + 1) / quizQuestions.length) * 100);
  // Handle starting the quiz
  const startQuiz = () => {
    setQuizStarted(true);
    // Scroll to quiz section
    setTimeout(() => {
      if (quizRef.current) {
        quizRef.current.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }, 100);
  };
  // Handle answer selection
  const handleAnswer = (questionId: string, value: string | string[]) => {
    // For multi-select questions
    if (Array.isArray(value)) {
      setAnswers({
        ...answers,
        [questionId]: value,
      });
    } else {
      setAnswers({
        ...answers,
        [questionId]: value,
      });
      // Auto-advance to next question with animation
      if (currentStep < quizQuestions.length - 1) {
        setIsAnimating(true);
        setTimeout(() => {
          setCurrentStep(currentStep + 1);
          setIsAnimating(false);
        }, 400);
      }
    }
  };
  // Toggle selection for multi-select questions
  const toggleMultiSelection = (questionId: string, optionId: string) => {
    const currentSelections = (answers[questionId] as string[]) || [];
    if (currentSelections.includes(optionId)) {
      handleAnswer(
        questionId,
        currentSelections.filter((id) => id !== optionId)
      );
    } else {
      handleAnswer(questionId, [...currentSelections, optionId]);
    }
  };
  // Check if an option is selected
  const isOptionSelected = (questionId: string, optionId: string) => {
    const answer = answers[questionId];
    if (Array.isArray(answer)) {
      return answer.includes(optionId);
    }
    return answer === optionId;
  };
  // Handle moving to next question
  const handleNext = () => {
    if (currentStep < quizQuestions.length - 1) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep + 1);
        setIsAnimating(false);
      }, 400);
    } else {
      // Show results
      calculateResults();
    }
  };
  // Calculate personality type based on answers
  const calculateResults = () => {
    // This is a simplified algorithm - in a real app, this would be more sophisticated
    // For demo purposes, we'll just pick a personality type based on some of the answers
    // Get the activities answer as it's most deterministic for our demo
    const activitiesAnswer = answers['activities'];
    let result: PersonalityType;
    if (Array.isArray(activitiesAnswer)) {
      // If multiple activities selected, use the first one
      if (activitiesAnswer.includes('adventure')) {
        result = personalityTypes.find((p) => p.id === 'adventure-seeker')!;
      } else if (activitiesAnswer.includes('food')) {
        result = personalityTypes.find((p) => p.id === 'culinary-enthusiast')!;
      } else if (activitiesAnswer.includes('culture')) {
        result = personalityTypes.find((p) => p.id === 'cultural-explorer')!;
      } else if (activitiesAnswer.includes('relaxation')) {
        result = personalityTypes.find((p) => p.id === 'relaxation-seeker')!;
      } else {
        // Default to cultural explorer if somehow no activities were selected
        result = personalityTypes.find((p) => p.id === 'cultural-explorer')!;
      }
    } else {
      // If we don't have activities (shouldn't happen), use planning style
      const planningStyle = answers['planning'] as string;
      if (planningStyle === 'spontaneous') {
        result = personalityTypes.find((p) => p.id === 'adventure-seeker')!;
      } else if (planningStyle === 'detailed') {
        result = personalityTypes.find((p) => p.id === 'cultural-explorer')!;
      } else {
        // Default to culinary for flexible planners
        result = personalityTypes.find((p) => p.id === 'culinary-enthusiast')!;
      }
    }
    setPersonalityResult(result);
    setShowResults(true);
    // Scroll to results after a brief delay
    setTimeout(() => {
      if (resultsRef.current) {
        resultsRef.current.scrollIntoView({
          behavior: 'smooth',
        });
      }
    }, 100);
  };
  // Reset the quiz
  const resetQuiz = () => {
    setAnswers({});
    setCurrentStep(0);
    setShowResults(false);
    setPersonalityResult(null);
    setQuizStarted(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };
  // Check if current question is a multi-select type
  const isMultiSelect = () => {
    const currentQuestion = quizQuestions[currentStep];
    // For this demo, only the activities question is multi-select
    return currentQuestion.id === 'activities';
  };
  // Check if current question has a valid answer
  const hasValidAnswer = () => {
    const questionId = quizQuestions[currentStep].id;
    const answer = answers[questionId];
    if (Array.isArray(answer)) {
      return answer.length > 0;
    }
    return !!answer;
  };
  // Add handleBack function
  const handleBack = () => {
    if (currentStep > 0) {
      setIsAnimating(true);
      setTimeout(() => {
        setCurrentStep(currentStep - 1);
        setIsAnimating(false);
      }, 400);
    }
  };
  return (
    <div className="bg-blue-50 py-16">
      <div className="container mx-auto px-4">
        {/* Landing Section */}
        {!quizStarted && !showResults && (
          <div className="max-w-5xl mx-auto">
            <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
              <div className="grid grid-cols-1 md:grid-cols-2">
                <div className="p-8 md:p-12 flex flex-col justify-center">
                  <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
                    Discover Your Travel Personality
                  </h2>
                  <p className="text-lg text-gray-600 mb-8">
                    Take our 2-minute quiz to find Travel Pros who match your unique travel style
                    and preferences.
                  </p>
                  <div className="space-y-4 mb-8">
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <CheckIcon size={20} className="text-blue-600" />
                      </div>
                      <p className="text-gray-700">
                        12 simple questions about your travel preferences
                      </p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <CheckIcon size={20} className="text-blue-600" />
                      </div>
                      <p className="text-gray-700">Get matched with experts who fit your style</p>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <CheckIcon size={20} className="text-blue-600" />
                      </div>
                      <p className="text-gray-700">Discover your unique travel personality type</p>
                    </div>
                  </div>
                  <button
                    onClick={startQuiz}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg transition-colors inline-flex items-center justify-center"
                  >
                    Start Quiz
                    <ChevronRightIcon size={20} className="ml-2" />
                  </button>
                </div>
                <div className="hidden md:block relative">
                  <img
                    src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Travel personalities"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-white/50 to-transparent"></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quiz Interface */}
        {quizStarted && !showResults && (
          <div ref={quizRef} className="max-w-4xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden">
              {/* Progress Bar */}
              <div className="w-full h-2 bg-gray-100">
                <div
                  className="h-2 bg-blue-600 transition-all duration-500 ease-out"
                  style={{
                    width: `${progress}%`,
                  }}
                ></div>
              </div>
              <div className="p-6 md:p-8">
                {/* Question Counter */}
                <div className="flex justify-between items-center mb-6">
                  <button
                    onClick={handleBack}
                    className={`flex items-center text-gray-600 hover:text-gray-900 transition-colors ${currentStep === 0 ? 'invisible' : ''}`}
                  >
                    <ArrowLeftIcon size={16} className="mr-1" />
                    Back
                  </button>
                  <div className="text-sm text-gray-500 font-medium">
                    Question {currentStep + 1} of {quizQuestions.length}
                  </div>
                </div>
                {/* Question */}
                <div
                  className={`transition-opacity duration-400 ${isAnimating ? 'opacity-0' : 'opacity-100'}`}
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {quizQuestions[currentStep].question}
                  </h3>
                  {quizQuestions[currentStep].description && (
                    <p className="text-gray-600 mb-6">{quizQuestions[currentStep].description}</p>
                  )}
                  {/* Options */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    {quizQuestions[currentStep].options.map((option) => (
                      <div
                        key={option.id}
                        className={`
                          border rounded-xl p-4 cursor-pointer transition-all duration-200
                          ${isOptionSelected(quizQuestions[currentStep].id, option.id) ? 'border-blue-600 bg-blue-50 ring-2 ring-blue-200' : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                        `}
                        onClick={() => {
                          if (isMultiSelect()) {
                            toggleMultiSelection(quizQuestions[currentStep].id, option.id);
                          } else {
                            handleAnswer(quizQuestions[currentStep].id, option.id);
                          }
                        }}
                      >
                        <div className="flex items-start">
                          <div className="mr-4 mt-1">
                            {isMultiSelect() ? (
                              <div
                                className={`w-5 h-5 rounded border flex items-center justify-center ${isOptionSelected(quizQuestions[currentStep].id, option.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}
                              >
                                {isOptionSelected(quizQuestions[currentStep].id, option.id) && (
                                  <CheckIcon size={12} className="text-white" />
                                )}
                              </div>
                            ) : (
                              <div
                                className={`w-5 h-5 rounded-full border flex items-center justify-center ${isOptionSelected(quizQuestions[currentStep].id, option.id) ? 'bg-blue-600 border-blue-600' : 'border-gray-300'}`}
                              >
                                {isOptionSelected(quizQuestions[currentStep].id, option.id) && (
                                  <div className="w-2 h-2 rounded-full bg-white"></div>
                                )}
                              </div>
                            )}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center mb-2">
                              <div className="mr-3">{option.icon}</div>
                              <h4 className="font-medium text-gray-900">{option.label}</h4>
                            </div>
                            {option.description && (
                              <p className="text-sm text-gray-600">{option.description}</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  {/* Navigation for multi-select questions */}
                  {isMultiSelect() && (
                    <div className="flex justify-end">
                      <button
                        onClick={handleNext}
                        disabled={!hasValidAnswer()}
                        className={`
                          flex items-center justify-center py-2.5 px-6 rounded-lg font-medium transition-colors
                          ${hasValidAnswer() ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                        `}
                      >
                        {currentStep === quizQuestions.length - 1 ? 'See Results' : 'Next'}
                        <ArrowRightIcon size={16} className="ml-2" />
                      </button>
                    </div>
                  )}
                  {/* For the last question, show a "See Results" button */}
                  {!isMultiSelect() &&
                    currentStep === quizQuestions.length - 1 &&
                    hasValidAnswer() && (
                      <div className="flex justify-end mt-6">
                        <button
                          onClick={calculateResults}
                          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 px-6 rounded-lg flex items-center transition-colors"
                        >
                          See Results
                          <ArrowRightIcon size={16} className="ml-2" />
                        </button>
                      </div>
                    )}
                  {/* Skip option */}
                  {!isMultiSelect() && !hasValidAnswer() && (
                    <div className="text-center">
                      <button
                        onClick={handleNext}
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium"
                      >
                        Skip this question
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Results Page */}
        {showResults && personalityResult && (
          <div ref={resultsRef} className="max-w-5xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
              <div className="bg-blue-600 text-white p-8 text-center">
                <div className="w-24 h-24 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center text-5xl mx-auto mb-4">
                  {personalityResult.icon}
                </div>
                <h2 className="text-3xl md:text-4xl font-bold mb-2">
                  You're a {personalityResult.type}!
                </h2>
                <p className="text-blue-100 max-w-2xl mx-auto">
                  Based on your responses to our travel personality quiz
                </p>
              </div>
              <div className="p-6 md:p-8">
                <div className="mb-8">
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    About Your Travel Personality
                  </h3>
                  <p className="text-gray-700 mb-6">{personalityResult.description}</p>
                  <div className="bg-blue-50 border border-blue-100 rounded-lg p-4">
                    <h4 className="font-medium text-gray-900 mb-3">Your Key Travel Traits</h4>
                    <div className="flex flex-wrap gap-2">
                      {personalityResult.traits.map((trait, index) => (
                        <span
                          key={index}
                          className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                        >
                          {trait}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-bold text-gray-900">Your Matched Travel Pros</h3>
                    <button className="text-blue-600 hover:text-blue-800 text-sm font-medium">
                      View All Matches
                    </button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {personalityResult.matches.map((expert) => (
                      <div
                        key={expert.id}
                        className="border border-gray-200 rounded-xl overflow-hidden hover:shadow-md transition-all"
                      >
                        <div className="relative">
                          <img
                            src={expert.image}
                            alt={expert.name}
                            className="w-full h-32 object-cover"
                          />
                          <div className="absolute top-2 right-2 bg-blue-600 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {expert.matchPercentage}% Match
                          </div>
                        </div>
                        <div className="p-4">
                          <h4 className="font-bold text-gray-900">{expert.name}</h4>
                          <div className="flex items-center text-sm text-gray-500 mb-3">
                            <MapPinIcon size={14} className="mr-1" />
                            {expert.location}
                          </div>
                          <div className="flex items-center mb-3">
                            <StarIcon size={16} className="text-yellow-400 fill-current" />
                            <span className="ml-1 font-medium text-gray-900">{expert.rating}</span>
                          </div>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {expert.specialties.slice(0, 2).map((specialty, index) => (
                              <span
                                key={index}
                                className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded"
                              >
                                {specialty}
                              </span>
                            ))}
                            {expert.specialties.length > 2 && (
                              <span className="bg-gray-100 text-gray-700 text-xs px-2 py-0.5 rounded">
                                +{expert.specialties.length - 2} more
                              </span>
                            )}
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-xs text-gray-500 mb-4">
                            <div className="flex items-center">
                              <ClockIcon size={12} className="mr-1" />
                              {expert.experience} years exp.
                            </div>
                            <div className="flex items-center">
                              <ShoppingBagIcon size={12} className="mr-1" />
                              {expert.tourCount} tours
                            </div>
                            <div className="flex items-center">
                              <GlobeIcon size={12} className="mr-1" />
                              {expert.languages.length} languages
                            </div>
                          </div>
                          <div className="flex gap-2">
                            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium py-2 rounded transition-colors">
                              View Profile
                            </button>
                            <button className="flex items-center justify-center w-10 h-9 border border-gray-300 rounded hover:bg-gray-50 transition-colors">
                              <MessageCircleIcon size={16} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 p-6 flex flex-wrap gap-4 justify-between items-center">
                <div className="flex space-x-3">
                  <button className="flex items-center text-gray-700 hover:text-gray-900">
                    <ShareIcon size={18} className="mr-1" />
                    Share Result
                  </button>
                  <button
                    onClick={resetQuiz}
                    className="flex items-center text-gray-700 hover:text-gray-900"
                  >
                    <RefreshCwIcon size={18} className="mr-1" />
                    Retake Quiz
                  </button>
                </div>
                <button className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">
                  Browse All Matching Guides
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default TravelPersonalityQuiz;
