'use client'

import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  quizQuestions,
  personalityTypes,
  type PersonalityType,
} from '@/mock/travelPersonalityQuiz';
import {
  ChevronRightIcon,
  CheckIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
  RefreshCwIcon,
  StarIcon,
  ClockIcon,
  MapPinIcon,
  GlobeIcon,
  ShoppingBagIcon,
} from 'lucide-react';

const TravelPersonalityQuiz = () => {
  const router = useRouter();
  // State for quiz flow
  const [quizStarted, setQuizStarted] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string | string[]>>({});
  const [showResults, setShowResults] = useState(false);
  const [personalityResult, setPersonalityResult] = useState<PersonalityType | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);
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
  // Calculate personality type based on answers using API
  const calculateResults = async () => {
    setIsCalculating(true);
    try {
      const response = await fetch('/api/quiz/match-experts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ answers }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch quiz results');
      }

      const data = await response.json();
      setPersonalityResult(data.personalityType);
      setShowResults(true);
      
      // Scroll to results after a brief delay
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({
            behavior: 'smooth',
          });
        }
      }, 100);
    } catch (error) {
      console.error('Error calculating results:', error);
      // Fallback to mock data if API fails
      const activitiesAnswer = answers['activities'];
      let result: PersonalityType;
      if (Array.isArray(activitiesAnswer)) {
        if (activitiesAnswer.includes('adventure')) {
          result = personalityTypes.find((p) => p.id === 'adventure-seeker')!;
        } else if (activitiesAnswer.includes('food')) {
          result = personalityTypes.find((p) => p.id === 'culinary-enthusiast')!;
        } else if (activitiesAnswer.includes('culture')) {
          result = personalityTypes.find((p) => p.id === 'cultural-explorer')!;
        } else if (activitiesAnswer.includes('relaxation')) {
          result = personalityTypes.find((p) => p.id === 'relaxation-seeker')!;
        } else {
          result = personalityTypes.find((p) => p.id === 'cultural-explorer')!;
        }
      } else {
        const planningStyle = answers['planning'] as string;
        if (planningStyle === 'spontaneous') {
          result = personalityTypes.find((p) => p.id === 'adventure-seeker')!;
        } else if (planningStyle === 'detailed') {
          result = personalityTypes.find((p) => p.id === 'cultural-explorer')!;
        } else {
          result = personalityTypes.find((p) => p.id === 'culinary-enthusiast')!;
        }
      }
      setPersonalityResult(result);
      setShowResults(true);
      setTimeout(() => {
        if (resultsRef.current) {
          resultsRef.current.scrollIntoView({
            behavior: 'smooth',
          });
        }
      }, 100);
    } finally {
      setIsCalculating(false);
    }
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
                  <Image
                    src="https://images.unsplash.com/photo-1501785888041-af3ef285b470?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80"
                    alt="Travel personalities"
                    className="w-full h-full object-cover"
                    fill
                    sizes="(max-width: 768px) 0vw, 50vw"
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
                              <div className="mr-3 text-3xl">{option.icon}</div>
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
                        disabled={!hasValidAnswer() || isCalculating}
                        className={`
                          flex items-center justify-center py-2.5 px-6 rounded-lg font-medium transition-colors
                          ${hasValidAnswer() && !isCalculating ? 'bg-blue-600 hover:bg-blue-700 text-white' : 'bg-gray-200 text-gray-400 cursor-not-allowed'}
                        `}
                      >
                        {currentStep === quizQuestions.length - 1 && isCalculating 
                          ? 'Finding Your Matches...' 
                          : currentStep === quizQuestions.length - 1 
                            ? 'See Results' 
                            : 'Next'}
                        {!isCalculating && <ArrowRightIcon size={16} className="ml-2" />}
                      </button>
                    </div>
                  )}
                  {/* For the last question, show a "See Results" button */}
                  {!isMultiSelect() &&
                    currentStep === quizQuestions.length - 1 &&
                    hasValidAnswer() && (
                      <div className="flex justify-end mt-6">
                        <button
                          onClick={() => calculateResults()}
                          disabled={isCalculating}
                          className={`font-medium py-2.5 px-6 rounded-lg flex items-center transition-colors ${
                            isCalculating 
                              ? 'bg-gray-400 cursor-not-allowed text-white' 
                              : 'bg-blue-600 hover:bg-blue-700 text-white'
                          }`}
                        >
                          {isCalculating ? 'Finding Your Matches...' : 'See Results'}
                          {!isCalculating && <ArrowRightIcon size={16} className="ml-2" />}
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
                  You&apos;re a {personalityResult.type}!
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
                          <Image
                            src={expert.image}
                            alt={expert.name}
                            className="w-full h-48 object-cover"
                            width={300}
                            height={192}
                            sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
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
                          <div className="w-full">
                            <button 
                              onClick={() => router.push(`/meet-experts/${expert.id}`)}
                              className="w-full text-center border border-blue-600 text-blue-600 hover:bg-blue-50 font-medium py-2 px-4 rounded-lg text-sm transition-colors"
                            >
                              View Profile
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="border-t border-gray-200 p-6 flex flex-wrap gap-4 justify-between items-center">
                <button
                  onClick={resetQuiz}
                  className="flex items-center text-gray-700 hover:text-gray-900"
                >
                  <RefreshCwIcon size={18} className="mr-1" />
                  Retake Quiz
                </button>
                <button
                  onClick={() => router.push('/meet-experts')}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
                >
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
