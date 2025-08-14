'use client'

import React from 'react';
import { SearchIcon, UsersIcon, CalendarIcon, HeartIcon } from 'lucide-react';
const HowItWorks = () => {
  const steps = [
    {
      icon: <SearchIcon size={24} className="text-blue-600" />,
      title: 'Discover',
      description:
        'Find unique experiences and local guides based on your interests and travel style.',
      color: 'bg-blue-100',
    },
    {
      icon: <HeartIcon size={24} className="text-green-600" />,
      title: 'Connect',
      description:
        'Match with guides who share your personality and interests for a more authentic experience.',
      color: 'bg-green-100',
    },
    {
      icon: <CalendarIcon size={24} className="text-purple-600" />,
      title: 'Book',
      description:
        'Secure your experience with our simple booking system and flexible payment options.',
      color: 'bg-purple-100',
    },
    {
      icon: <UsersIcon size={24} className="text-orange-600" />,
      title: 'Experience',
      description:
        'Enjoy your personalized adventure with a guide who truly understands what you are looking for.',
    },
  ];
  return (
    <div className="bg-white py-16">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">How OtterTrip Works</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Your journey to authentic travel experiences in four simple steps
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {steps.map((step, index) => (
            <div key={index} className="relative">
              {/* Connector line between steps */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-10 left-full w-full h-0.5 bg-gray-200 -z-10 transform -translate-x-1/2" />
              )}
              <div className="flex flex-col items-center text-center">
                <div
                  className={`w-20 h-20 ${step.color} rounded-full flex items-center justify-center mb-4`}
                >
                  {step.icon}
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-2">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default HowItWorks;
