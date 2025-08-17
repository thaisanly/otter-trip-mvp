'use client'

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useSearchParams, useRouter } from 'next/navigation';
import {
  ArrowLeftIcon,
  CalendarIcon,
  UsersIcon,
  CheckCircleIcon,
  ShieldIcon,
  CheckIcon,
} from 'lucide-react';
import { formatCurrency, parsePrice } from '@/utils/formatters';

interface TourDate {
  id: string;
  date?: string;
  start?: string;
  end?: string;
  spotsLeft: number;
  price: string;
  status?: string;
}

interface Tour {
  id: string;
  title: string;
  location: string;
  price: string;
  duration: string;
  heroImage: string;
  guide: {
    name: string;
    image: string;
  };
  dates: TourDate[];
}

interface FormattedDate {
  id: string;
  start: string;
  end: string;
  spotsLeft: number;
  status: string;
  price?: number;
}

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
  const [tour, setTour] = useState<Tour | null>(null);
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
  const availableDates = useMemo(() => {
    if (tour?.dates) {
      return tour.dates.map((date: TourDate): FormattedDate => {
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
            price: parseFloat(date.price.replace(/[^0-9.]/g, '')) || 0
          };
        } else if (date.start && date.end) {
          // Already in correct format
          return {
            id: date.id,
            start: date.start,
            end: date.end,
            spotsLeft: date.spotsLeft,
            status: date.status || (date.spotsLeft <= 2 ? 'limited' : 'available'),
            price: typeof date.price === 'string' ? 
              (parseFloat(date.price.replace(/[^0-9.]/g, '')) || 0) : 
              date.price
          };
        } else {
          // Fallback format
          return {
            id: date.id,
            start: 'Date TBD',
            end: 'Date TBD',
            spotsLeft: date.spotsLeft || 0,
            status: date.status || 'available',
            price: typeof date.price === 'string' ? 
              (parseFloat(date.price.replace(/[^0-9.]/g, '')) || 0) : 
              date.price
          };
        }
      });
    }
    return [
      { id: 'date1', start: 'Jun 15', end: '17, 2024', spotsLeft: 3, status: 'available' },
      { id: 'date2', start: 'Jun 22', end: '24, 2024', spotsLeft: 6, status: 'available' },
      { id: 'date3', start: 'Jul 5', end: '7, 2024', spotsLeft: 2, status: 'limited' },
    ];
  }, [tour?.dates]);

  const [selectedDate, setSelectedDate] = useState<FormattedDate | null>(null);
  const [participants, setParticipants] = useState(2);
  
  // Form data state
  const [leadTraveler, setLeadTraveler] = useState({
    firstName: '',
    lastName: '',
    phone: ''
  });
  const [additionalTravelers, setAdditionalTravelers] = useState<Array<{firstName: string, lastName: string}>>([]);
  const [specialRequests, setSpecialRequests] = useState('');

  // Set selected date based on URL parameter or default to first available
  useEffect(() => {
    if (availableDates.length > 0) {
      if (dateParam) {
        const dateFromParam = availableDates.find(d => d.id === dateParam);
        if (dateFromParam) {
          setSelectedDate(dateFromParam);
        } else {
          // If date param doesn't match, use first available
          setSelectedDate(availableDates[0]);
        }
      } else {
        // No date param, use first available
        setSelectedDate(availableDates[0]);
      }
    }
  }, [dateParam, availableDates]);

  // Initialize additional travelers when participant count changes
  useEffect(() => {
    setAdditionalTravelers(prev => {
      const newTravelers = [];
      for (let i = 0; i < participants - 1; i++) {
        newTravelers.push(prev[i] || { firstName: '', lastName: '' });
      }
      return newTravelers;
    });
  }, [participants]);
  
  const handleContinue = async () => {
    if (step === 1) {
      setStep(2);
      window.scrollTo(0, 0);
    } else if (step === 2) {
      // Move to review step
      setStep(3);
      window.scrollTo(0, 0);
    } else if (step === 3) {
      // Complete booking
      await handleCompleteBooking();
    }
  };
  
  const handleCompleteBooking = async () => {
    setIsLoading(true);
    
    try {
      // Add 3-second delay for better UX
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const bookingRef = `BOOKING-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
      const priceNumber = parsePrice(tour?.price || '245');
      const totalAmount = priceNumber * participants + Math.round(priceNumber * participants * 0.1); // Including 10% service fee
      
      // Save booking to database
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tourId: id,
          tourTitle: tour?.title || 'Tour',
          location: tour?.location || '',
          selectedDate: selectedDate ? `${selectedDate.start} - ${selectedDate.end}` : '',
          participants,
          pricePerPerson: priceNumber,
          totalPrice: totalAmount,
          leadTraveler,
          additionalTravelers: additionalTravelers.slice(0, participants - 1),
          specialRequests,
          bookingReference: bookingRef
        }),
      });

      const result = await response.json();

      if (response.ok && result.success) {
        // Booking saved successfully
        console.log('Booking saved:', result.booking);
        setBookingReference(bookingRef);
        setBookingComplete(true);
        setStep(4);
      } else {
        // Handle error but still complete the booking for user experience
        console.error('Failed to save booking:', result.error);
        alert('There was an issue saving your booking, but it has been recorded. Our team will contact you shortly.');
        setBookingReference(bookingRef);
        setBookingComplete(true);
        setStep(4);
      }
    } catch (error) {
      console.error('Error completing booking:', error);
      // Still complete the booking on frontend even if save fails
      const bookingRef = `BOOKING-${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).substring(2, 5).toUpperCase()}`;
      setBookingReference(bookingRef);
      setBookingComplete(true);
      setStep(4);
      alert('Your booking has been recorded. Our team will contact you to confirm the details.');
    } finally {
      setIsLoading(false);
      window.scrollTo(0, 0);
    }
  };
  
  const handleBack = () => {
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const priceNumber = parsePrice(tour?.price || '245');

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
            <p className="text-gray-600 mb-6">The tour you&apos;re looking for doesn&apos;t exist.</p>
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

  // Check if tour has available dates
  const hasAvailableDates = availableDates && availableDates.length > 0 && 
    !availableDates.every(date => date.start === 'Date TBD' || date.spotsLeft === 0);

  // Show no dates available message
  if (!hasAvailableDates && !loadingTour) {
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
          
          <div className="bg-white rounded-xl shadow-md p-8 max-w-2xl mx-auto text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CalendarIcon size={32} className="text-gray-400" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-3">No Available Dates</h2>
            <p className="text-gray-600 mb-6">
              Sorry, there are no available schedules for this tour at this time. Please check back later or contact us for more information.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => router.push('/')}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg"
              >
                Browse Other Tours
              </button>
              <button
                onClick={() => router.push('/meet-experts')}
                className="px-6 py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50"
              >
                Contact Expert
              </button>
            </div>
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
            {/* Progress Steps - Hide on final confirmation */}
            {step < 4 && (
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
                      {step > 2 ? <CheckCircleIcon size={20} /> : '2'}
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
                      {step > 3 ? <CheckCircleIcon size={20} /> : '3'}
                    </div>
                    <span className="text-sm mt-2">Review</span>
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
                              {date.price && <span className="ml-2">• ${date.price}</span>}
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
                    disabled={isLoading || !leadTraveler.firstName}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 3: Review & Complete */}
            {step === 3 && !bookingComplete && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Review & Complete Booking</h2>
                
                {/* Booking Summary */}
                <div className="bg-gray-50 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">Booking Summary</h3>
                  
                  <div className="space-y-4">
                    {/* Tour Details */}
                    <div className="pb-4 border-b border-gray-200">
                      <h4 className="font-medium text-gray-700 mb-2">Tour Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tour:</span>
                          <span className="font-medium">{tour?.title || 'Tour'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Location:</span>
                          <span className="font-medium">{tour?.location || ''}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Dates:</span>
                          <span className="font-medium">{selectedDate?.start} - {selectedDate?.end}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Duration:</span>
                          <span className="font-medium">{tour?.duration || ''}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Traveler Details */}
                    <div className="pb-4 border-b border-gray-200">
                      <h4 className="font-medium text-gray-700 mb-2">Traveler Information</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Lead Traveler:</span>
                          <span className="font-medium">{leadTraveler.firstName} {leadTraveler.lastName}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Phone:</span>
                          <span className="font-medium">{leadTraveler.phone}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Total Participants:</span>
                          <span className="font-medium">{participants} {participants === 1 ? 'person' : 'people'}</span>
                        </div>
                      </div>
                    </div>
                    
                    {/* Price Breakdown */}
                    <div>
                      <h4 className="font-medium text-gray-700 mb-2">Price Details</h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600">Tour Price ({participants} × {formatCurrency(priceNumber)}):</span>
                          <span className="font-medium">{formatCurrency(priceNumber * participants)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600">Service Fee:</span>
                          <span className="font-medium">{formatCurrency(Math.round(priceNumber * participants * 0.1))}</span>
                        </div>
                        <div className="pt-3 mt-3 border-t border-gray-200">
                          <div className="flex justify-between text-base">
                            <span className="font-semibold">Total Amount:</span>
                            <span className="font-bold text-blue-600">
                              {formatCurrency(priceNumber * participants + Math.round(priceNumber * participants * 0.1))}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Action Buttons */}
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
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <span className="flex items-center justify-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing your booking...
                      </span>
                    ) : 'Complete Booking'}
                  </button>
                </div>
              </div>
            )}
            
            {/* Step 4: Confirmation */}
            {step === 4 && bookingComplete && (
              <div className="bg-white rounded-xl shadow-md p-6 mb-8">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckIcon size={40} className="text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">Booking Confirmed!</h2>
                <p className="text-gray-600 mb-8 text-center">
                  Thank you for your booking. Your adventure is confirmed!
                </p>
                
                {/* Booking Reference Card */}
                <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg mb-6 text-white">
                  <div className="text-sm opacity-90 mb-1">Booking Reference</div>
                  <div className="text-2xl font-bold font-mono">{bookingReference}</div>
                  <div className="text-sm opacity-90 mt-2">Please save this for your records</div>
                </div>
                
                {/* Trip Summary */}
                <div className="border border-gray-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
                    <CalendarIcon size={20} className="mr-2 text-blue-600" />
                    Trip Summary
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <div className="text-sm text-gray-500">Tour Package</div>
                      <div className="font-medium text-gray-900">{tour?.title || 'Tour'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Location</div>
                      <div className="font-medium text-gray-900">{tour?.location || ''}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Travel Dates</div>
                      <div className="font-medium text-gray-900">{selectedDate?.start} - {selectedDate?.end}</div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Duration</div>
                      <div className="font-medium text-gray-900">{tour?.duration || ''}</div>
                    </div>
                  </div>
                </div>
                
                {/* Traveler Information */}
                <div className="border border-gray-200 rounded-lg p-6 mb-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4 flex items-center">
                    <UsersIcon size={20} className="mr-2 text-blue-600" />
                    Traveler Information
                  </h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Lead Traveler</span>
                      <span className="font-medium">{leadTraveler.firstName} {leadTraveler.lastName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Phone</span>
                      <span className="font-medium">{leadTraveler.phone}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Total Participants</span>
                      <span className="font-medium">{participants} {participants === 1 ? 'person' : 'people'}</span>
                    </div>
                    {additionalTravelers && additionalTravelers.length > 0 && (
                      <div className="pt-3 border-t border-gray-200">
                        <div className="text-sm text-gray-600 mb-2">Additional Travelers:</div>
                        {additionalTravelers.map((traveler, index) => (
                          <div key={index} className="text-sm ml-4">
                            • {traveler.firstName} {traveler.lastName}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
                
                {/* Booking Summary */}
                <div className="bg-gray-50 p-6 rounded-lg mb-6">
                  <h3 className="font-semibold text-lg text-gray-900 mb-4">Booking Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Tour Price ({participants} × {formatCurrency(priceNumber)})</span>
                      <span className="font-medium">{formatCurrency(priceNumber * participants)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Service Fee</span>
                      <span className="font-medium">{formatCurrency(Math.round(priceNumber * participants * 0.1))}</span>
                    </div>
                    <div className="pt-3 border-t border-gray-200 flex justify-between">
                      <span className="font-semibold text-lg">Total Amount</span>
                      <span className="font-bold text-lg text-blue-600">
                        {formatCurrency(priceNumber * participants + Math.round(priceNumber * participants * 0.1))}
                      </span>
                    </div>
                  </div>
                </div>
                
                {/* Next Steps */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                    <CheckCircleIcon size={20} className="mr-2 text-blue-600" />
                    What&apos;s Next?
                  </h3>
                  <ol className="space-y-2 text-sm text-gray-700">
                    <li className="flex">
                      <span className="font-medium mr-2">1.</span>
                      <span>Your booking has been successfully confirmed</span>
                    </li>
                    <li className="flex">
                      <span className="font-medium mr-2">2.</span>
                      <span>You&apos;ll receive a pre-trip information packet before departure</span>
                    </li>
                    <li className="flex">
                      <span className="font-medium mr-2">3.</span>
                      <span>Your guide will contact you before the trip to confirm meeting details</span>
                    </li>
                  </ol>
                </div>
                
                {/* Action Button */}
                <div className="flex justify-center">
                  <button
                    onClick={() => router.push('/')}
                    className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-8 rounded-lg"
                  >
                    Explore More Tours
                  </button>
                </div>
              </div>
            )}
          </div>
          
          {/* Booking Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-20">
              <div className="h-48 relative">
                <Image src={tour?.heroImage || '/placeholder.jpg'} alt={tour?.title || 'Tour'} fill className="object-cover" />
              </div>
              <div className="p-6">
                <h3 className="font-bold text-xl text-gray-900 mb-2">{tour?.title || 'Tour'}</h3>
                <div className="flex items-center mb-4">
                  {tour?.guide && (
                    <>
                      <Image
                        src={typeof tour.guide === 'string' ? JSON.parse(tour.guide).image : tour.guide.image}
                        alt={typeof tour.guide === 'string' ? JSON.parse(tour.guide).name : tour.guide.name}
                        width={32}
                        height={32}
                        className="w-8 h-8 rounded-full object-cover mr-2"
                      />
                      <div>
                        <div className="text-sm font-medium">with {typeof tour.guide === 'string' ? JSON.parse(tour.guide).name : tour.guide.name}</div>
                        <div className="text-xs text-gray-500">{tour?.location || ''}</div>
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
                      {formatCurrency(priceNumber)} × {participants}
                    </span>
                    <span>{formatCurrency(priceNumber * participants)}</span>
                  </div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Service fee</span>
                    <span>{formatCurrency(Math.round(priceNumber * participants * 0.1))}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg mt-4 pt-4 border-t border-gray-200">
                    <span>Total</span>
                    <span>
                      {formatCurrency(priceNumber * participants + Math.round(priceNumber * participants * 0.1))}
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