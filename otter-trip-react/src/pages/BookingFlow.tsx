import React, { useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import {
  ArrowLeftIcon,
  CalendarIcon,
  UsersIcon,
  CheckCircleIcon,
  CreditCardIcon,
  LockIcon,
} from 'lucide-react';
import { tour } from '../mock/bookingFlow';
const BookingFlow = () => {
  const { id } = useParams();
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState(tour.availableDates[0]);
  const [participants, setParticipants] = useState(2);
  const handleContinue = () => {
    setStep(step + 1);
    window.scrollTo(0, 0);
  };
  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };
  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Link
          to={`/tour-leader/${tour.guideId}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeftIcon size={16} className="mr-2" />
          Back to guide profile
        </Link>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps */}
            <div className="bg-white rounded-xl shadow-md p-6 mb-8">
              <div className="flex justify-between items-center">
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    1
                  </div>
                  <span className="text-sm mt-2">Trip Details</span>
                </div>
                <div
                  className={`flex-1 h-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-200'}`}
                ></div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    2
                  </div>
                  <span className="text-sm mt-2">Traveler Info</span>
                </div>
                <div
                  className={`flex-1 h-1 mx-4 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-200'}`}
                ></div>
                <div className="flex flex-col items-center">
                  <div
                    className={`w-10 h-10 rounded-full flex items-center justify-center ${
                      step >= 3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    3
                  </div>
                  <span className="text-sm mt-2">Payment</span>
                </div>
              </div>
            </div>
            {/* Step 1: Trip Details */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Trip Details</h2>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Dates
                  </label>
                  <div className="space-y-3">
                    {tour.availableDates.map((date) => (
                      <label
                        key={date.id}
                        className={`block border rounded-lg p-4 cursor-pointer ${
                          selectedDate.id === date.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="date"
                          className="sr-only"
                          checked={selectedDate.id === date.id}
                          onChange={() => setSelectedDate(date)}
                        />
                        <div className="flex items-start">
                          <CalendarIcon size={20} className="text-blue-600 mr-3 mt-0.5" />
                          <div className="flex-1">
                            <div className="font-medium">
                              {date.start} - {date.end}
                            </div>
                            <div className="text-sm text-gray-500 mt-1">
                              {date.spotsLeft} spots left
                            </div>
                          </div>
                          {selectedDate.id === date.id && (
                            <CheckCircleIcon size={20} className="text-blue-600" />
                          )}
                        </div>
                      </label>
                    ))}
                  </div>
                </div>
                <div className="mb-8">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Number of Participants
                  </label>
                  <div className="flex items-center">
                    <button
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                      onClick={() => setParticipants(Math.max(1, participants - 1))}
                    >
                      -
                    </button>
                    <span className="mx-6 font-medium">{participants}</span>
                    <button
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                      onClick={() => setParticipants(Math.min(tour.spotsLeft, participants + 1))}
                    >
                      +
                    </button>
                  </div>
                </div>
                <button
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg"
                  onClick={handleContinue}
                >
                  Continue to Traveler Information
                </button>
              </div>
            )}
            {/* Step 2: Traveler Information */}
            {step === 2 && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Traveler Information</h2>
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-4">Lead Traveler</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        First Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                {participants > 1 && (
                  <div className="mb-6">
                    <h3 className="font-medium text-gray-900 mb-4">Additional Travelers</h3>
                    {[...Array(participants - 1)].map((_, index) => (
                      <div
                        key={`traveler-${index + 2}`}
                        className="border border-gray-200 rounded-lg p-4 mb-4"
                      >
                        <h4 className="font-medium text-gray-700 mb-3">Traveler {index + 2}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              First Name
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Last Name
                            </label>
                            <input
                              type="text"
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-4">Special Requests</h3>
                  <textarea
                    rows={4}
                    placeholder="Any dietary restrictions, accessibility needs, or other special requests?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    className="md:flex-1 border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button
                    className="md:flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg"
                    onClick={handleContinue}
                  >
                    Continue to Payment
                  </button>
                </div>
              </div>
            )}
            {/* Step 3: Payment */}
            {step === 3 && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Payment Information</h2>
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Payment Method</h3>
                    <div className="flex items-center text-sm text-green-600">
                      <LockIcon size={14} className="mr-1" />
                      Secure Payment
                    </div>
                  </div>
                  <div className="border border-gray-200 rounded-lg p-4 mb-4">
                    <label className="flex items-start cursor-pointer">
                      <input
                        type="radio"
                        name="paymentMethod"
                        className="mt-1 mr-3"
                        defaultChecked
                      />
                      <div>
                        <div className="font-medium">Credit or Debit Card</div>
                        <div className="text-sm text-gray-500 mt-1">
                          Visa, Mastercard, American Express, Discover
                        </div>
                      </div>
                    </label>
                  </div>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Card Number
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="1234 5678 9012 3456"
                        className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                      <CreditCardIcon
                        size={18}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Expiration Date
                      </label>
                      <input
                        type="text"
                        placeholder="MM/YY"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Security Code
                      </label>
                      <input
                        type="text"
                        placeholder="CVC"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Name on Card
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                </div>
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-4">Billing Address</h3>
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Country/Region
                    </label>
                    <select className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
                      <option>United States</option>
                      <option>Canada</option>
                      <option>United Kingdom</option>
                      <option>Australia</option>
                      <option>Germany</option>
                    </select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Street Address
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        State/Province
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        ZIP/Postal Code
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                      />
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <label className="flex items-start">
                    <input type="checkbox" className="mt-1 mr-3" />
                    <span className="text-sm text-gray-700">
                      I agree to the{' '}
                      <a href="#" className="text-blue-600">
                        Terms of Service
                      </a>
                      ,{' '}
                      <a href="#" className="text-blue-600">
                        Cancellation Policy
                      </a>
                      , and{' '}
                      <a href="#" className="text-blue-600">
                        Privacy Policy
                      </a>
                    </span>
                  </label>
                </div>
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    className="md:flex-1 border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50"
                    onClick={handleBack}
                  >
                    Back
                  </button>
                  <button className="md:flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg">
                    Complete Booking
                  </button>
                </div>
              </div>
            )}
          </div>
          {/* Booking Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-20">
              <div className="h-48 relative">
                <img src={tour.image} alt={tour.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-2">{tour.title}</h3>
                <div className="flex items-center mb-4">
                  <img
                    src={tour.guideImage}
                    alt={tour.guideName}
                    className="w-8 h-8 rounded-full mr-2"
                  />
                  <div>
                    <div className="text-sm font-medium">with {tour.guideName}</div>
                    <div className="text-xs text-gray-500">{tour.location}</div>
                  </div>
                </div>
                <div className="border-t border-b border-gray-200 py-4 my-4 space-y-3">
                  <div className="flex items-start">
                    <CalendarIcon size={18} className="text-gray-600 mr-3 mt-0.5" />
                    <div>
                      <div className="font-medium">Dates</div>
                      <div className="text-sm text-gray-600">
                        {selectedDate.start} - {selectedDate.end}
                      </div>
                    </div>
                  </div>
                  <div className="flex items-start">
                    <UsersIcon size={18} className="text-gray-600 mr-3 mt-0.5" />
                    <div>
                      <div className="font-medium">Travelers</div>
                      <div className="text-sm text-gray-600">{participants} people</div>
                    </div>
                  </div>
                </div>
                <div className="mb-6">
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">
                      ${tour.price} × {participants}
                    </span>
                    <span>${tour.price * participants}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Service fee</span>
                    <span>${Math.round(tour.price * participants * 0.1)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span>
                      ${tour.price * participants + Math.round(tour.price * participants * 0.1)}
                    </span>
                  </div>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                  <div className="flex items-start">
                    <ShieldIcon size={18} className="text-blue-600 mr-3 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">Secure Booking</div>
                      <p className="text-gray-600 mt-1">
                        Your payment is protected by our secure payment system.
                      </p>
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
// Missing component definition
const ShieldIcon = ({ size = 24, className = '' }) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
  );
};
export default BookingFlow;
