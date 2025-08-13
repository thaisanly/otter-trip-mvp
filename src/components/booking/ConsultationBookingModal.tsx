import React, { useEffect, useState, Fragment } from 'react';
import {
  CalendarIcon,
  ClockIcon,
  CreditCardIcon,
  CheckIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  MessageCircleIcon,
  LockIcon,
  AlertCircleIcon,
  CheckCircleIcon,
} from 'lucide-react';
import Modal from '../ui/Modal';
interface ConsultationBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  expertName: string;
  expertImage: string;
  price: number | string;
}
type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
};
const ConsultationBookingModal: React.FC<ConsultationBookingModalProps> = ({
  isOpen,
  onClose,
  expertName,
  expertImage,
  price,
}) => {
  const [step, setStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [selectedTimeSlot, setSelectedTimeSlot] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isBookingComplete, setIsBookingComplete] = useState(false);
  const [bookingReference, setBookingReference] = useState('');
  // Form state
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  // Reset state when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
      setSelectedDate(null);
      setSelectedTimeSlot(null);
      setIsBookingComplete(false);
    }
  }, [isOpen]);
  // Generate some sample dates (next 7 days)
  const generateDates = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 14; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip weekends for this example
      if (date.getDay() !== 0 && date.getDay() !== 6) {
        dates.push({
          date: date.toISOString().split('T')[0],
          day: date.getDate(),
          month: date.toLocaleString('default', {
            month: 'short',
          }),
          dayName: date.toLocaleString('default', {
            weekday: 'short',
          }),
          available: Math.random() > 0.3, // Randomly mark some dates as unavailable
        });
      }
    }
    return dates;
  };
  const availableDates = generateDates();
  // Generate time slots for the selected date
  const generateTimeSlots = (): TimeSlot[] => {
    if (!selectedDate) return [];
    const slots = [];
    const startHour = 9; // 9 AM
    const endHour = 17; // 5 PM
    for (let hour = startHour; hour <= endHour; hour++) {
      // Skip lunch hour
      if (hour !== 12) {
        const time = `${hour % 12 || 12}:00 ${hour >= 12 ? 'PM' : 'AM'}`;
        slots.push({
          id: `slot-${hour}`,
          time,
          available: Math.random() > 0.4, // Randomly mark some slots as unavailable
        });
      }
    }
    return slots;
  };
  const timeSlots = generateTimeSlots();
  const handleDateSelect = (date: string) => {
    setSelectedDate(date);
    setSelectedTimeSlot(null); // Reset time slot when date changes
  };
  const handleTimeSlotSelect = (slotId: string) => {
    setSelectedTimeSlot(slotId);
  };
  const handleContinue = () => {
    if (step === 2) {
      // Process booking
      setIsLoading(true);
      // Simulate API call
      setTimeout(() => {
        setIsLoading(false);
        setIsBookingComplete(true);
        setBookingReference(`OT-${Math.floor(100000 + Math.random() * 900000)}`);
        setStep(3);
      }, 2000);
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
    return slot ? slot.time : '';
  };
  const isNextDisabled = () => {
    if (step === 1) return !selectedDate || !selectedTimeSlot;
    if (step === 2) return !name || !email || !phone;
    return false;
  };
  const renderStepIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-6">
        {[1, 2].map((stepNumber) => (
          <Fragment key={stepNumber}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center ${stepNumber === step ? 'bg-blue-600 text-white' : stepNumber < step ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-600'}`}
            >
              {stepNumber < step ? <CheckIcon size={16} /> : stepNumber}
            </div>
            {stepNumber < 2 && (
              <div className={`w-12 h-1 ${stepNumber < step ? 'bg-green-500' : 'bg-gray-200'}`} />
            )}
          </Fragment>
        ))}
      </div>
    );
  };
  const renderDateSelection = () => {
    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Date</h3>
        <div className="flex overflow-x-auto pb-2 mb-6 space-x-2">
          {availableDates.map((date) => (
            <button
              key={date.date}
              onClick={() => date.available && handleDateSelect(date.date)}
              disabled={!date.available}
              className={`flex flex-col items-center px-4 py-3 rounded-lg min-w-[80px] transition-colors ${selectedDate === date.date ? 'bg-blue-600 text-white' : date.available ? 'bg-white border border-gray-200 hover:border-blue-500 text-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
            >
              <span className="text-xs">{date.dayName}</span>
              <span className="text-lg font-bold">{date.day}</span>
              <span className="text-xs">{date.month}</span>
            </button>
          ))}
        </div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Select Time</h3>
        {selectedDate ? (
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-6">
            {timeSlots.map((slot) => (
              <button
                key={slot.id}
                onClick={() => slot.available && handleTimeSlotSelect(slot.id)}
                disabled={!slot.available}
                className={`py-3 px-4 rounded-lg text-center transition-colors ${selectedTimeSlot === slot.id ? 'bg-blue-600 text-white' : slot.available ? 'bg-white border border-gray-200 hover:border-blue-500 text-gray-800' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
              >
                <div className="flex items-center justify-center">
                  <ClockIcon size={14} className="mr-1" />
                  <span>{slot.time}</span>
                </div>
              </button>
            ))}
          </div>
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
  const renderPaymentDetails = () => {
    return (
      <div>
        <h3 className="text-lg font-medium text-gray-900 mb-4">Payment Details</h3>
        <div className="bg-blue-50 p-4 rounded-lg mb-6">
          <div className="flex items-start">
            <div className="mr-3 mt-1">
              <CalendarIcon size={20} className="text-blue-600" />
            </div>
            <div>
              <h4 className="font-medium text-gray-900">Booking Summary</h4>
              <p className="text-sm text-gray-600 mt-1">60-minute consultation with {expertName}</p>
              <p className="text-sm text-gray-600">
                {getSelectedDateFormatted()} at {getSelectedTimeFormatted()}
              </p>
            </div>
          </div>
        </div>
        <div className="border border-gray-200 rounded-lg p-4 mb-6">
          <div className="flex justify-between items-center mb-4">
            <h4 className="font-medium text-gray-900">Payment Method</h4>
            <div className="flex items-center text-sm text-green-600">
              <LockIcon size={14} className="mr-1" />
              Secure Payment
            </div>
          </div>
          <div className="space-y-4">
            <label className="flex items-center p-3 border border-gray-200 rounded-lg cursor-pointer bg-white">
              <input type="radio" name="paymentMethod" className="mr-3" defaultChecked />
              <div>
                <div className="font-medium">Credit or Debit Card</div>
                <div className="text-sm text-gray-500 mt-1">Visa, Mastercard, American Express</div>
              </div>
            </label>
            <div className="space-y-3">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Card Number</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full pl-4 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="1234 5678 9012 3456"
                  />
                  <CreditCardIcon
                    size={18}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Expiration Date
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="MM/YY"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Security Code
                  </label>
                  <input
                    type="text"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="CVC"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-200 pt-4 mb-6">
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Consultation Fee</span>
            <span>{typeof price === 'number' ? `$${price}` : price}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-600">Service Fee</span>
            <span>$25</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2 border-t border-gray-200 mt-2">
            <span>Total</span>
            <span>${typeof price === 'number' ? price + 25 : price}</span>
          </div>
        </div>
        <div className="mb-6">
          <label className="flex items-start">
            <input type="checkbox" className="mt-1 mr-3" defaultChecked />
            <span className="text-sm text-gray-700">
              I agree to the{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Terms of Service
              </a>{' '}
              and{' '}
              <a href="#" className="text-blue-600 hover:underline">
                Cancellation Policy
              </a>
            </span>
          </label>
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
        <div className="text-gray-600 mb-8">
          <p>
            We've sent a confirmation email to <strong>{email}</strong>
          </p>
          <p className="mt-2">
            You'll receive a calendar invitation and Zoom link for your session.
          </p>
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
        return renderDateSelection();
      case 2:
        return renderContactDetails();
      case 3:
        return renderConfirmation();
      default:
        return null;
    }
  };
  const getModalTitle = () => {
    if (step === 3) return 'Booking Confirmation';
    return 'Book Consultation';
  };
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={getModalTitle()}
      size={step === 3 ? 'lg' : 'xl'}
    >
      <div>
        {step < 3 && renderStepIndicator()}
        <div className="mb-6">{renderStepContent()}</div>
        {step < 3 && (
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
              className={`px-5 py-2 rounded-lg text-white font-medium transition-colors flex items-center ${isNextDisabled() || isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'}`}
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                  Processing...
                </>
              ) : (
                <>
                  {step === 2 ? 'Complete Booking' : 'Continue'}
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
