'use client';

import React, { useEffect, useState, Fragment } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  MessageCircleIcon,
  AlertCircleIcon,
  CheckCircleIcon,
  XCircleIcon,
  LoaderIcon,
  HelpCircleIcon,
} from 'lucide-react';
import Modal from '../ui/Modal';
interface ConsultationBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  expertName: string;
  expertImage: string;
  expertId?: string;
  invitationCode?: string;
  price: number | string;
}
type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
};

type AvailableDate = {
  date: string;
  timeSlots: TimeSlot[];
};
const ConsultationBookingModal: React.FC<ConsultationBookingModalProps> = ({
  isOpen,
  onClose,
  expertName,
  expertId,
  invitationCode,
  price,
}) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  const [availabilityData, setAvailabilityData] = useState<Record<
    string,
    { available: boolean; slots: string[] }
  > | null>(null);
  const [isLoadingAvailability, setIsLoadingAvailability] = useState(false);
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [enteredInvitationCode, setEnteredInvitationCode] = useState('');
  const [validationState, setValidationState] = useState<
    'idle' | 'loading' | 'success' | 'error' | 'format-error'
  >('idle');
  const [errorMessage, setErrorMessage] = useState('');

  // Reset state when modal opens or closes
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedDate(null);
      setSelectedTimeSlot(null);
      setAvailabilityData(null);
      // Clear form fields
      setName('');
      setEmail('');
      setPhone('');
      setMessage('');
      setEnteredInvitationCode(invitationCode || '');
      setValidationState('idle');
      setErrorMessage('');
    }
  }, [isOpen, invitationCode]);

  // Fetch availability data when moving to step 2
  useEffect(() => {
    const fetchAvailability = async () => {
      if (step === 2 && expertId) {
        setIsLoadingAvailability(true);
        try {
          const response = await fetch(`/api/experts/${expertId}/availability`);
          if (response.ok) {
            const data = await response.json();
            setAvailabilityData(data);
          } else {
            console.error('Failed to fetch availability data', response.status);
            // Set empty data to prevent infinite loading
            setAvailabilityData({});
          }
        } catch (error) {
          console.error('Error fetching availability:', error);
          // Set empty data to prevent infinite loading
          setAvailabilityData({});
        } finally {
          setIsLoadingAvailability(false);
        }
      }
    };

    fetchAvailability();
  }, [step, expertId]); // Removed availabilityData from dependencies to ensure it fetches when step changes

  // Get available dates from API data
  const availableDates: AvailableDate[] = availabilityData
    ? Object.entries(availabilityData)
        .filter(([, value]) => value.available && value.slots && value.slots.length > 0)
        .map(([date, value]) => ({
          date,
          timeSlots: value.slots.map((slot, index) => ({
            id: `${date}-${index}`,
            time: slot,
            available: true,
          })),
        }))
    : [];

  // Get time slots for the selected date
  const timeSlots: TimeSlot[] = selectedDate
    ? availableDates.find((d: AvailableDate) => d.date === selectedDate)?.timeSlots || []
    : [];
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  };
  const handleTimeSlotSelect = (slotId: string) => {
    setSelectedTimeSlot(slotId);
  };
  const handleContinue = async () => {
    if (step === 1) {
      // Basic format validation
      if (enteredInvitationCode.trim() === '') {
        setValidationState('format-error');
        setErrorMessage('Please enter an invitation code');
        return;
      }

      // Check format (example: OT-XXXX-XXXX)
      const codePattern = /^OT-[A-Z0-9]{4}-[A-Z0-9]{4}$/;
      if (!codePattern.test(enteredInvitationCode)) {
        setValidationState('format-error');
        setErrorMessage('Invalid code format. Expected: OT-XXXX-XXXX');
        return;
      }

      // Simulate API validation
      setValidationState('loading');

      // For demo purposes, check against known valid codes
      setTimeout(() => {
        // Accept specific codes as valid (including those in database)
        const validCodes = ['OT-1234-ABCD', 'OT-TEST-CODE', 'OT-7482-ZZOO', 'OT-5607-JMXO'];
        if (validCodes.includes(enteredInvitationCode)) {
          setValidationState('success');
          // Wait a moment to show success state before proceeding
          setTimeout(() => {
            setStep(2);
            setValidationState('idle'); // Reset for next time
          }, 800);
        } else {
          setValidationState('error');
          setErrorMessage('Invalid invitation code. Please check and try again.');
        }
      }, 1500);
    } else if (step === 3) {
      // Process booking
      setIsLoading(true);

      try {
        // Send booking confirmation email to admin only
        const response = await fetch('/api/send-consultation', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            expertName,
            expertId: expertId || 'unknown',
            userName: name,
            userEmail: email,
            phone,
            message,
            selectedDate: selectedDate, // Use raw date format for database
            selectedTime: getSelectedTimeFormatted(),
            selectedDateFormatted: getSelectedDateFormatted(), // Keep formatted for email
            price: typeof price === 'number' ? price : 500,
            invitationCode: enteredInvitationCode || invitationCode || '',
          }),
        });

        const result = await response.json();

        if (!response.ok) {
          // Check if it's a code validation error
          if (result.error && result.error.toLowerCase().includes('code')) {
            setValidationState('error');
            setErrorMessage(result.error);
            setStep(1); // Go back to code validation step
            setIsLoading(false);
            return;
          }
          throw new Error(result.error || 'Failed to send booking confirmation');
        }

        setIsLoading(false);
        setStep(4);
        setBookingReference(result.data.bookingReference); // Use booking reference from API
        setStep(4);

        // Clear form data after successful booking (but keep date/time for confirmation display)
        setTimeout(() => {
          setName('');
          setEmail('');
          setPhone('');
          setMessage('');
          setEnteredInvitationCode('');
        }, 100);
      } catch (error) {
        console.error('Error sending booking email:', error);
        setIsLoading(false);
        // Check if it's a code validation error
        if (error instanceof Error && error.message.toLowerCase().includes('code')) {
          setValidationState('error');
          setErrorMessage(error.message);
          setStep(1); // Go back to code validation step
          return;
        }
        // Still complete the booking even if email fails (for other errors)
        setStep(4);
        setBookingReference('OT-ERROR');
        setStep(4);

        // Clear form data even on error (but keep date/time for confirmation display)
        setTimeout(() => {
          setName('');
          setEmail('');
          setPhone('');
          setMessage('');
          setEnteredInvitationCode('');
        }, 100);
      }
    } else {
      setStep(step + 1);
    }
  };
  const handleBack = () => {
    setStep(step - 1);
  };
  const getSelectedDateFormatted = () => {
    if (!selectedDate) return '';
    const date = new Date(selectedDate);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };
  const getSelectedTimeFormatted = () => {
    if (!selectedTimeSlot) return '';
    const slot = timeSlots.find((slot) => slot.id === selectedTimeSlot);
    if (!slot) return '';

    // Format the time to show as "X:00 AM/PM - Y:00 AM/PM" (1 hour slot)
    const hour = parseInt(slot.time.split(':')[0]);
    const period = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
    const nextHour = hour + 1;
    const nextPeriod = nextHour >= 12 ? 'PM' : 'AM';
    const nextDisplayHour = nextHour > 12 ? nextHour - 12 : nextHour === 0 ? 12 : nextHour;

    return `${displayHour}:00 ${period} - ${nextDisplayHour}:00 ${nextPeriod}`;
  };
  const isNextDisabled = () => {
    if (step === 1) return validationState === 'loading' || validationState === 'success';
    if (step === 2) return !selectedDate || !selectedTimeSlot;
    if (step === 3) return !name || !email || !phone;
    return false;
  };
  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-6">
        {[1, 2, 3].map((stepNumber) => (
          <Fragment key={stepNumber}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${
                stepNumber === step
                  ? 'bg-blue-600 text-white'
                  : stepNumber < step
                  ? 'bg-green-500 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {stepNumber < step ? <CheckIcon size={16} /> : stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-12 h-1 ${stepNumber < step ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </Fragment>
        ))}
      </div>
    );
  };
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.toUpperCase();
    setEnteredInvitationCode(value);
    // Reset validation state when typing
    if (validationState !== 'idle' && validationState !== 'loading') {
      setValidationState('idle');
      setErrorMessage('');
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && validationState !== 'loading' && step === 1) {
      handleContinue();
    }
  };

  const renderInvitationCodeStep = () => {
    return (
      <div className="space-y-5">
        <p className="text-gray-600">
          Please enter your invitation code to book a consultation with {expertName}.
        </p>

        <div className="relative">
          <input
            type="text"
            value={enteredInvitationCode}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            placeholder="e.g., OT-1234-ABCD"
            className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 transition-colors ${
              validationState === 'success'
                ? 'border-green-500 focus:ring-green-200'
                : validationState === 'error' || validationState === 'format-error'
                ? 'border-red-500 focus:ring-red-200'
                : 'border-gray-300 focus:ring-blue-200 focus:border-blue-500'
            }`}
            disabled={validationState === 'loading' || validationState === 'success'}
          />

          {/* Status icons */}
          {validationState === 'success' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-green-500">
              <CheckCircleIcon size={20} />
            </div>
          )}
          {(validationState === 'error' || validationState === 'format-error') && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-red-500">
              <XCircleIcon size={20} />
            </div>
          )}
          {validationState === 'loading' && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-blue-500">
              <LoaderIcon size={20} className="animate-spin" />
            </div>
          )}
        </div>

        {/* Validation messages */}
        {(validationState === 'error' || validationState === 'format-error') && (
          <div className="text-red-500 text-sm flex items-start">
            <AlertCircleIcon size={16} className="mr-1 mt-0.5 flex-shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}
        {validationState === 'success' && (
          <div className="text-green-500 text-sm flex items-center">
            <CheckCircleIcon size={16} className="mr-1" />
            <span>Valid code! Proceeding to booking...</span>
          </div>
        )}
        {validationState === 'idle' && (
          <div className="text-gray-500 text-sm flex items-start">
            <HelpCircleIcon size={16} className="mr-1 mt-0.5 flex-shrink-0" />
            <span>
              Your invitation code can be found in your email invitation or from your travel agent.
            </span>
          </div>
        )}

        <div className="bg-blue-50 p-4 rounded-lg">
          <div className="text-sm text-blue-800">
            <strong>Need an invitation code?</strong>
            <p className="mt-1">
              Contact your travel agent or email{' '}
              <a href="mailto:support@ottertrip.com" className="text-blue-600 hover:underline">
                support@ottertrip.com
              </a>{' '}
              to request access to our consultation services.
            </p>
          </div>
        </div>
      </div>
    );
  };

  const renderDateSelection = () => {
    if (isLoadingAvailability) {
      return (
        <div className="text-center py-12">
          <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading available dates...</p>
        </div>
      );
    }

    if (!availabilityData) {
      return (
        <div className="text-center py-12">
          <p className="text-red-600">Unable to load availability. Please try again.</p>
        </div>
      );
    }

    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Date</h3>
        <div className="flex overflow-x-auto pb-2 mb-6 space-x-2">
          {availableDates.map((date: AvailableDate) => (
            <button
              key={date.date}
              onClick={() => handleDateSelect(date.date)}
              disabled={false}
              className={`flex flex-col items-center px-4 py-3 rounded-lg min-w-[80px] transition-colors ${
                selectedDate === date.date
                  ? 'bg-blue-600 text-white'
                  : 'bg-white border border-gray-200 hover:border-blue-500 text-gray-800'
              }`}
            >
              <span className="text-xs">
                {new Date(date.date).toLocaleDateString('en-US', { weekday: 'short' })}
              </span>
              <span className="text-lg font-bold">{new Date(date.date).getDate()}</span>
              <span className="text-xs">
                {new Date(date.date).toLocaleDateString('en-US', { month: 'short' })}
              </span>
            </button>
          ))}
        </div>

        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Time</h3>
        {selectedDate ? (
          timeSlots.length > 0 ? (
            <div className="grid grid-cols-3 md:grid-cols-4 gap-3 mb-6">
              {timeSlots.map((slot) => {
                // Format time to show hour with AM/PM
                const hour = parseInt(slot.time.split(':')[0]);
                const period = hour >= 12 ? 'PM' : 'AM';
                const displayHour = hour > 12 ? hour - 12 : hour === 0 ? 12 : hour;
                const formattedTime = `${displayHour}:00 ${period}`;

                return (
                  <button
                    key={slot.id}
                    onClick={() => slot.available && handleTimeSlotSelect(slot.id)}
                    disabled={!slot.available}
                    className={`py-3 px-4 rounded-lg text-center transition-colors ${
                      selectedTimeSlot === slot.id
                        ? 'bg-blue-600 text-white'
                        : slot.available
                        ? 'bg-white border border-gray-200 hover:border-blue-500 text-gray-800'
                        : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="flex items-center justify-center">
                      <ClockIcon size={14} className="mr-1" />
                      <span className="text-sm font-medium">{formattedTime}</span>
                      {!slot.available && <span className="ml-2 text-xs">(Booked)</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No available time slots for this date. Please select another date.
            </div>
          )
        ) : (
          <div className="text-center py-8 text-gray-500">
            Please select a date to view available time slots
          </div>
        )}
      </div>
    );
  };
  const renderContactDetails = () => {
    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Your Details</h3>
        <div className="space-y-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <div className="relative">
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your full name"
                required
              />
              <UserIcon
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your email address"
                required
              />
              <MailIcon
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
            <div className="relative">
              <input
                type="tel"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Your phone number"
                required
              />
              <PhoneIcon
                size={16}
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Message (Optional)
            </label>
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Any specific topics you'd like to discuss?"
              />
              <MessageCircleIcon size={16} className="absolute left-3 top-3 text-gray-400" />
            </div>
          </div>
        </div>
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex">
            <CalendarIcon size={20} className="text-blue-600 mr-3 flex-shrink-0" />
            <div>
              <h4 className="font-medium text-gray-900">Your selected time</h4>
              <p className="text-sm text-gray-600 mt-1">
                {getSelectedDateFormatted()} at {getSelectedTimeFormatted()}
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };
  const renderConfirmation = () => {
    return (
      <div className="text-center py-6">
        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <CheckCircleIcon size={32} className="text-green-600" />
        </div>
        <h3 className="text-xl font-bold text-gray-900 mb-2">Booking Confirmed!</h3>
        <p className="text-gray-600 mb-6">
          Your consultation with {expertName} has been successfully booked.
        </p>
        <div className="bg-blue-50 rounded-lg p-6 mb-6 text-left">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">Booking Details</h4>
            <span className="text-sm font-medium text-blue-600">Ref: {bookingReference}</span>
          </div>
          <div className="space-y-3">
            <div className="flex">
              <CalendarIcon size={18} className="text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Date & Time</div>
                <div className="text-sm text-gray-600">
                  {getSelectedDateFormatted()} at {getSelectedTimeFormatted()}
                </div>
              </div>
            </div>
            <div className="flex">
              <UserIcon size={18} className="text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Expert</div>
                <div className="text-sm text-gray-600">{expertName}</div>
              </div>
            </div>
            <div className="flex">
              <MessageCircleIcon size={18} className="text-blue-600 mr-3 flex-shrink-0 mt-0.5" />
              <div>
                <div className="font-medium">Consultation Type</div>
                <div className="text-sm text-gray-600">60-minute video call</div>
              </div>
            </div>
          </div>
        </div>
        <button
          onClick={onClose}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors"
        >
          Done
        </button>
      </div>
    );
  };
  const renderStepContent = () => {
    switch (step) {
      case 1:
        return renderInvitationCodeStep();
      case 2:
        return renderDateSelection();
      case 3:
        return renderContactDetails();
      case 4:
        return renderConfirmation();
      default:
        return null;
    }
  };
  const getModalTitle = () => {
    if (step === 4) return 'Booking Confirmation';
    return 'Book Consultation';
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      size={step === 4 ? 'lg' : 'xl'}
    >
      <div>
        {step < 4 && renderStepIndicator()}
        <div className="mb-6">{renderStepContent()}</div>
        {step < 4 && (
          <div className="flex justify-between">
            {
              step > 1 ? (
                <button
                  onClick={handleBack}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors flex items-center"
                >
                  <ChevronLeftIcon size={16} className="mr-1" />
                  Back
                </button>
              ) : (
                <div></div>
              ) // Empty div to maintain flex layout
            }
            <button
              onClick={handleContinue}
              disabled={isNextDisabled() || isLoading}
              className={`px-5 py-2 rounded-lg text-white font-medium transition-colors flex items-center ${
                isNextDisabled() || isLoading
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : step === 1 ? (
                validationState === 'loading' ? (
                  <span className="flex items-center">
                    <LoaderIcon size={16} className="animate-spin mr-2" />
                    Verifying...
                  </span>
                ) : validationState === 'success' ? (
                  <span className="flex items-center">
                    <CheckCircleIcon size={16} className="mr-2" />
                    Verified
                  </span>
                ) : (
                  'Continue'
                )
              ) : (
                <>
                  {step === 3 ? 'Complete Booking' : 'Continue'}
                  <ChevronRightIcon size={16} className="ml-1" />
                </>
              )}
            </button>
          </div>
        )}
      </div>
    </Modal>
  );
};
export default ConsultationBookingModal;
