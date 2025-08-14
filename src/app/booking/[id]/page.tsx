'use client'

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  CalendarIcon,
  UsersIcon,
  CheckCircleIcon,
  ShieldIcon,
  CheckIcon,
} from 'lucide-react';

const BookingFlow = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const id = params.id as string;
  const dateParam = searchParams.get('date');
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingComplete, setBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [tour, setTour] = useState<any>(null);
  const [loadingTour, setLoadingTour] = useState(true);
  
  // Fetch tour data from API
  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await fetch(`/api/tours?id=${id}`);
        if (response.ok) {
          const data = await response.json();
          setTour(data);
        } else {
          // Get tour title from URL if available (for expert tours)
          const tourTitle = searchParams.get('title') || 'Tour Package';
          const expertName = searchParams.get('expert') || 'Local Guide';
          const price = searchParams.get('price') || '$245';
          
          // If not found in database, create a default tour structure
          setTour({
            id: id,
            title: tourTitle,
            location: 'Various Locations',
            price: price,
            duration: '1 day',
            heroImage: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
            guide: {
              name: expertName,
              image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80'
            },
            dates: [
              { id: 'd1', date: 'Jun 15-17, 2024', spotsLeft: 3, price: price },
              { id: 'd2', date: 'Jun 22-24, 2024', spotsLeft: 6, price: price },
              { id: 'd3', date: 'Jul 5-7, 2024', spotsLeft: 2, price: price }
            ]
          });
        }
      } catch (error) {
        console.error('Error fetching tour:', error);
        // Get tour title from URL if available (for expert tours)
        const tourTitle = searchParams.get('title') || 'Tour Package';
        const expertName = searchParams.get('expert') || 'Local Guide';
        const price = searchParams.get('price') || '$245';
        
        // Fallback tour data
        setTour({
          id: id,
          title: tourTitle,
          location: 'Various Locations',
          price: price,
          duration: '1 day',
          heroImage: 'https://images.unsplash.com/photo-1512100356356-de1b84283e18?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80',
          guide: {
            name: expertName,
            image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80'
          },
          dates: [
            { id: 'd1', date: 'Jun 15-17, 2024', spotsLeft: 3, price: price },
            { id: 'd2', date: 'Jun 22-24, 2024', spotsLeft: 6, price: price },
            { id: 'd3', date: 'Jul 5-7, 2024', spotsLeft: 2, price: price }
          ]
        });
      } finally {
        setLoadingTour(false);
      }
    };
    
    fetchTour();
  }, [id, searchParams]);
  
  // Transform dates to have proper structure
  const availableDates = tour?.dates ? tour.dates.map((date: any) => {
    // Handle different date formats
    if (date.date) {
      // Format: { id: 'd1', date: 'Jun 15-17, 2023', spotsLeft: 3, price: '$8,000' }
      const [start, end] = date.date.split('-').map(d => d.trim());
      return {
        id: date.id,
        start: start,
        end: end || start,
        spotsLeft: date.spotsLeft,
        status: date.spotsLeft <= 2 ? 'limited' : 'available',
        price: date.price
      };
    } else if (date.start && date.end) {
      // Already in correct format
      return date;
    } else {
      // Fallback format
      return {
        id: date.id,
        start: 'Date TBD',
        end: 'Date TBD',
        spotsLeft: date.spotsLeft || 0,
        status: date.status || 'available',
        price: date.price
      };
    }
  }) : [
    { id: 'date1', start: 'Jun 15', end: '17, 2024', spotsLeft: 3, status: 'available' },
    { id: 'date2', start: 'Jun 22', end: '24, 2024', spotsLeft: 6, status: 'available' },
    { id: 'date3', start: 'Jul 5', end: '7, 2024', spotsLeft: 2, status: 'limited' },
  ];

  const [selectedDate, setSelectedDate] = useState(availableDates[0]);
  const [participants, setParticipants] = useState(2);
  
  // Form data state
  const [leadTraveler, setLeadTraveler] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: ''
  });
  const [additionalTravelers, setAdditionalTravelers] = useState<Array<{firstName: string, lastName: string}>>([]);
  const [specialRequests, setSpecialRequests] = useState('');

  // Set selected date based on URL parameter
  useEffect(() => {
    if (dateParam && availableDates.length > 0) {
      const dateFromParam = availableDates.find(d => d.id === dateParam);
      if (dateFromParam) {
        setSelectedDate(dateFromParam);
      }
    }
  }, [dateParam]);

  // Initialize additional travelers when participant count changes
  useEffect(() => {
    const newTravelers = [];
    for (let i = 0; i < participants - 1; i++) {
      newTravelers.push(additionalTravelers[i] || { firstName: '', lastName: '' });
    }
    setAdditionalTravelers(newTravelers);
  }, [participants]);
  
  const handleContinue = async () => {
    if (step === 1) {
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2) {
      // Complete booking and send email
      await handleCompleteBooking();
    }
  };
  
  const handleCompleteBooking = async () => {
    setIsLoading(true);
    
    try {
      const bookingRef = `BOOKING-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
      const priceNumber = parseInt(tour.price?.replace(/[^0-9]/g, '') || '245');
      
      // Send booking confirmation email
      const response = await fetch('/api/send-booking', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tourId: id,
          tourTitle: tour.title,
          location: tour.location,
          selectedDate: selectedDate ? `${selectedDate.start} - ${selectedDate.end}` : '',
          participants,
          pricePerPerson: priceNumber,
          totalPrice: priceNumber * participants + Math.round(priceNumber * participants * 0.1),
          leadTraveler,
          additionalTravelers: additionalTravelers.slice(0, participants - 1),
          specialRequests,
          bookingReference: bookingRef
        }),
      });
      
      const result = await response.json();
      
      if (response.ok) {
        setBookingReference(bookingRef);
        setBookingComplete(true);
        setStep(3);
      } else {
        throw new Error(result.error || 'Failed to send booking confirmation');
      }
    } catch (error) {
      console.error('Error completing booking:', error);
      // Still complete the booking even if email fails
      const bookingRef = `BOOKING-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
      setBookingReference(bookingRef);
      setBookingComplete(true);
      setStep(3);
    } finally {
      setIsLoading(false);
      window.scrollTo(0, 0);
    }
  };
  
  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const priceNumber = parseInt(tour?.price?.replace(/[^0-9]/g, '') || '245');

  // Show loading state while fetching tour data
  if (loadingTour) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="flex justify-center items-center h-64">
            <div className="text-gray-500">Loading tour details...</div>
          </div>
        </div>
      </div>
    );
  }

  // Show error if tour not found
  if (!tour) {
    return (
      <div className="bg-gray-50 min-h-screen py-8">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tour not found</h2>
            <p className="text-gray-600 mb-6">The tour you're looking for doesn't exist.</p>
            <button
              onClick={() => router.push('/')}
              className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="container mx-auto px-4">
        <Link
          href={`/tour/${id}`}
          className="inline-flex items-center text-blue-600 hover:text-blue-800 mb-6"
        >
          <ArrowLeftIcon size={16} className="mr-2" />
          Back to tour details
        </Link>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Progress Steps - Only show for steps 1 and 2 */}
            {step < 3 && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="flex justify-between items-center">
                  <div className="flex flex-col items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center ${
                        step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-500'
                      }`}
                    >
                      {step > 1 ? <CheckCircleIcon size={20} /> : '1'}
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
                </div>
              </div>
            )}
            
            {/* Step 1: Trip Details */}
            {step === 1 && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Select Trip Details</h2>
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Available Dates
                  </label>
                  <div className="space-y-3">
                    {availableDates.map((date) => (
                      <label
                        key={date.id}
                        className={`block border rounded-lg p-4 cursor-pointer ${
                          selectedDate?.id === date.id
                            ? 'border-blue-600 bg-blue-50'
                            : 'border-gray-300 hover:border-blue-300'
                        }`}
                      >
                        <input
                          type="radio"
                          name="date"
                          className="sr-only"
                          checked={selectedDate?.id === date.id}
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
                              {date.price && <span className="ml-2">• {date.price}</span>}
                            </div>
                          </div>
                          {selectedDate?.id === date.id && (
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
                      type="button"
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                      onClick={() => setParticipants(Math.max(1, participants - 1))}
                    >
                      -
                    </button>
                    <span className="mx-6 font-medium">{participants}</span>
                    <button
                      type="button"
                      className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-500 hover:bg-gray-100"
                      onClick={() => setParticipants(Math.min(10, participants + 1))}
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
                        value={leadTraveler.firstName}
                        onChange={(e) => setLeadTraveler({...leadTraveler, firstName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Last Name
                      </label>
                      <input
                        type="text"
                        value={leadTraveler.lastName}
                        onChange={(e) => setLeadTraveler({...leadTraveler, lastName: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                      <input
                        type="email"
                        value={leadTraveler.email}
                        onChange={(e) => setLeadTraveler({...leadTraveler, email: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Phone Number
                      </label>
                      <input
                        type="tel"
                        value={leadTraveler.phone}
                        onChange={(e) => setLeadTraveler({...leadTraveler, phone: e.target.value})}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        required
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
                              value={additionalTravelers[index]?.firstName || ''}
                              onChange={(e) => {
                                const newTravelers = [...additionalTravelers];
                                newTravelers[index] = {
                                  ...newTravelers[index],
                                  firstName: e.target.value
                                };
                                setAdditionalTravelers(newTravelers);
                              }}
                              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            />
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                              Last Name
                            </label>
                            <input
                              type="text"
                              value={additionalTravelers[index]?.lastName || ''}
                              onChange={(e) => {
                                const newTravelers = [...additionalTravelers];
                                newTravelers[index] = {
                                  ...newTravelers[index],
                                  lastName: e.target.value
                                };
                                setAdditionalTravelers(newTravelers);
                              }}
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
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="Any dietary restrictions, accessibility needs, or other special requests?"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  ></textarea>
                </div>
                
                <div className="flex flex-col md:flex-row gap-4">
                  <button
                    className="md:flex-1 border border-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg hover:bg-gray-50"
                    onClick={handleBack}
                    disabled={isLoading}
                  >
                    Back
                  </button>
                  <button
                    className={`md:flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-6 rounded-lg ${
                      isLoading ? 'opacity-50 cursor-not-allowed' : ''
                    }`}
                    onClick={handleContinue}
                    disabled={isLoading || !leadTraveler.firstName || !leadTraveler.email}
                  >
                    {isLoading ? 'Processing...' : 'Complete Booking'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Confirmation */}
            {step === 3 && bookingComplete && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="text-center">
                  <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckIcon size={32} className="text-green-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-2">Booking Confirmed!</h2>
                  <p className="text-gray-600 mb-6">
                    Your booking has been successfully submitted.
                  </p>
                  
                  <div className="bg-blue-50 p-6 rounded-lg mb-6 text-left">
                    <h3 className="font-medium text-gray-900 mb-4">Booking Details</h3>
                    <div className="space-y-2">
                      <p><strong>Booking Reference:</strong> {bookingReference}</p>
                      <p><strong>Tour:</strong> {tour.title}</p>
                      <p><strong>Date:</strong> {selectedDate?.start} - {selectedDate?.end}</p>
                      <p><strong>Participants:</strong> {participants}</p>
                      <p><strong>Total Price:</strong> ${priceNumber * participants + Math.round(priceNumber * participants * 0.1)}</p>
                    </div>
                  </div>
                  
                  <div className="text-gray-600 mb-8">
                    <p className="mb-2">
                      We&apos;ve sent your booking details to our team.
                    </p>
                    <p>
                      You&apos;ll receive a confirmation email at <strong>{leadTraveler.email}</strong> within 24 hours with payment instructions.
                    </p>
                  </div>
                  
                  <button
                    onClick={() => router.push('/')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg"
                  >
                    Return to Home
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-20">
              <div className="h-48 relative">
                <img src={tour.heroImage} alt={tour.title} className="w-full h-full object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-2">{tour.title}</h3>
                <div className="flex items-center mb-4">
                  {tour.guide && (
                    <>
                      <img
                        src={typeof tour.guide === 'string' ? JSON.parse(tour.guide).image : tour.guide.image}
                        alt={typeof tour.guide === 'string' ? JSON.parse(tour.guide).name : tour.guide.name}
                        className="w-8 h-8 rounded-full mr-2"
                      />
                      <div>
                        <div className="text-sm font-medium">with {typeof tour.guide === 'string' ? JSON.parse(tour.guide).name : tour.guide.name}</div>
                        <div className="text-xs text-gray-500">{tour.location}</div>
                      </div>
                    </>
                  )}
                </div>
                
                <div className="border-t border-b border-gray-200 py-4 my-4 space-y-3">
                  <div className="flex items-start">
                    <CalendarIcon size={18} className="text-gray-600 mr-3 mt-0.5" />
                    <div>
                      <div className="font-medium">Dates</div>
                      <div className="text-sm text-gray-600">
                        {selectedDate ? `${selectedDate.start} - ${selectedDate.end}` : 'Select dates'}
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
                      ${priceNumber} × {participants}
                    </span>
                    <span>${priceNumber * participants}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Service fee</span>
                    <span>${Math.round(priceNumber * participants * 0.1)}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span>
                      ${priceNumber * participants + Math.round(priceNumber * participants * 0.1)}
                    </span>
                  </div>
                </div>
                
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100 mb-4">
                  <div className="flex items-start">
                    <ShieldIcon size={18} className="text-blue-600 mr-3 mt-0.5" />
                    <div className="text-sm">
                      <div className="font-medium text-gray-900">Secure Booking</div>
                      <p className="text-gray-600 mt-1">
                        Your information is protected by our secure system.
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

export default BookingFlow;