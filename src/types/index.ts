/**
 * Complete TypeScript Type Definitions for Otter Trip Travel Platform
 * This file contains all types, interfaces, and type aliases used throughout the application
 */

// ============================================================================
// TOUR TYPES
// ============================================================================

/**
 * Tour: Represents a travel tour/trip package
 * Usage: TourCard component, tour listings, search results
 * Properties:
 * - id: Unique identifier for the tour
 * - title: Tour name/title
 * - description: Brief description of the tour
 * - image: URL to tour cover image
 * - duration: Tour duration (e.g., "3 days", "1 week")
 * - price: Price per person as string (e.g., "$299")
 * - rating: Average rating (0-5)
 * - reviews: Number of reviews
 * - talents: Optional number of available guides for this tour
 */
export interface Tour {
  id: string;
  title: string;
  description: string;
  image: string;
  duration: string;
  price: string;
  rating: number;
  reviews: number;
  talents?: number;
}

// ============================================================================
// TOUR LEADER/GUIDE TYPES
// ============================================================================

/**
 * TourLeader: Represents a tour guide/leader
 * Usage: TourLeaderCard component, guide profile pages, search results
 * Properties:
 * - id: Unique identifier
 * - name: Full name of the guide
 * - image: Profile photo URL
 * - location: Current location/base
 * - rating: Average rating (0-5)
 * - reviewCount: Total number of reviews
 * - specialties: Array of expertise areas (e.g., ["Adventure", "Cultural"])
 * - personality: Optional personality traits for matching
 * - languages: Languages spoken
 * - price: Daily rate as number
 * - availability: Availability status text
 * - travelStyle: Array of travel style preferences (e.g., ["Adventure", "Cultural"])
 */
export interface TourLeader {
  id: string;
  name: string;
  image: string;
  location: string;
  rating: number;
  reviewCount: number;
  specialties: string[];
  personality?: string[];
  languages: string[];
  price: number;
  availability: string;
  travelStyle: string[];
}

/**
 * TourExpert: Extended tour guide with content creation capabilities
 * Usage: TourExpertCard component, expert profiles, live streaming features
 * Extends TourLeader with additional properties:
 * - countryCode: ISO country code for flag display
 * - verified: Verification status
 * - experience: Years of experience
 * - followers: Number of followers
 * - isLive: Currently streaming status
 * - isTopCreator: Top creator badge
 * - isRisingStar: Rising star badge
 * - videos: Number of video content pieces
 * - liveStreams: Number of live streams
 * - tours: Number of tours conducted
 */
export interface TourExpert {
  id: string;
  name: string;
  image: string;
  location: string;
  countryCode: string;
  verified: boolean;
  rating: number;
  reviews: number;
  experience: number;
  languages: string[];
  specialties: string[];
  followers: number;
  isLive?: boolean;
  isTopCreator?: boolean;
  isRisingStar?: boolean;
  videos: number;
  liveStreams: number;
  tours: number;
}

/**
 * TourManager: Tour organizer/manager with pricing
 * Usage: TourManagerCard component, manager listings
 * Properties include all guide properties plus:
 * - pricePerDay: Daily rate
 * - currency: Currency code (e.g., "USD")
 * - featured: Featured status
 * - topRated: Top-rated badge
 * - newJoined: Recently joined badge
 */
export interface TourManager {
  id: string;
  name: string;
  image: string;
  location: string;
  countryCode: string;
  verified: boolean;
  rating: number;
  reviews: number;
  experience: number;
  languages: string[];
  specialties: string[];
  pricePerDay: number;
  currency: string;
  featured?: boolean;
  topRated?: boolean;
  newJoined?: boolean;
}

// ============================================================================
// BOOKING & CONSULTATION TYPES
// ============================================================================

/**
 * TimeSlot: Available time slot for booking consultations
 * Usage: ConsultationBookingModal for scheduling
 * Properties:
 * - id: Unique slot identifier
 * - time: Time string (e.g., "10:00 AM")
 * - available: Booking availability
 */
export type TimeSlot = {
  id: string;
  time: string;
  available: boolean;
};

/**
 * ConsultationBooking: Consultation session details
 * Usage: Booking flow, consultation scheduling
 */
export interface ConsultationBooking {
  expertName: string;
  expertImage: string;
  price: number | string;
  selectedDate?: Date;
  selectedTimeSlot?: TimeSlot;
}

// ============================================================================
// PERSONALITY & MATCHING TYPES
// ============================================================================

/**
 * QuizQuestion: Travel personality quiz question
 * Usage: TravelPersonalityQuiz component
 * Properties:
 * - id: Question identifier
 * - question: Question text
 * - description: Optional additional context
 * - options: Array of answer options
 */
export type QuizQuestion = {
  id: string;
  question: string;
  description?: string;
  options: QuizOption[];
};

/**
 * QuizOption: Answer option for quiz questions
 * Usage: TravelPersonalityQuiz answer choices
 * Properties:
 * - id: Option identifier
 * - label: Display text
 * - icon: React component for visual representation
 * - description: Optional explanation
 */
export type QuizOption = {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
};

/**
 * PersonalityType: Travel personality profile result
 * Usage: Quiz results, personality matching
 * Properties:
 * - id: Personality type identifier
 * - type: Personality type name (e.g., "Explorer", "Relaxer")
 * - description: Detailed description
 * - icon: Icon identifier or emoji
 * - traits: Character traits array
 * - matches: Recommended expert matches
 */
export type PersonalityType = {
  id: string;
  type: string;
  description: string;
  icon: string;
  traits: string[];
  matches: ExpertMatch[];
};

/**
 * ExpertMatch: Expert recommendation based on personality
 * Usage: Personality quiz results, matching algorithm
 * Properties include expert details plus:
 * - matchPercentage: Compatibility percentage
 * - tourCount: Number of tours offered
 */
export type ExpertMatch = {
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

/**
 * PersonalityMatch: Compatibility analysis
 * Usage: PersonalityMatch component for showing compatibility
 */
export interface PersonalityMatchData {
  tourLeaderPersonality: string[];
  userPreferences?: string[];
  matchPercentage?: number;
}

// ============================================================================
// CONTENT & STORIES TYPES
// ============================================================================

/**
 * TravelStory: User-generated travel story/blog post
 * Usage: TravelStories component, content feed
 * Properties:
 * - id: Story identifier
 * - title: Story headline
 * - location: Story location
 * - date: Publication date
 * - image: Cover image URL
 * - content: Story text content
 * - likes: Number of likes
 * - traits: Associated personality traits
 */
export type TravelStory = {
  id: string;
  title: string;
  location: string;
  date: string;
  image: string;
  content: string;
  likes: number;
  traits: string[];
};

// ============================================================================
// CERTIFICATION & VERIFICATION TYPES
// ============================================================================

/**
 * Certification: Professional certification/qualification
 * Usage: GuideCertifications component, profile credentials
 * Properties:
 * - id: Certification identifier
 * - name: Certification name
 * - issuer: Issuing organization
 * - year: Year obtained
 * - icon: Icon type ('award' | 'shield' | 'check')
 * - verified: Verification status
 */
export type Certification = {
  id: string;
  name: string;
  issuer: string;
  year: string;
  icon: 'award' | 'shield' | 'check';
  verified: boolean;
};

// ============================================================================
// SEARCH & DISCOVERY TYPES
// ============================================================================

/**
 * SearchSuggestion: Autocomplete/typeahead suggestion
 * Usage: ConversationalSearch component
 * Properties:
 * - id: Suggestion identifier
 * - text: Display text
 * - type: Suggestion category
 */
export type SearchSuggestion = {
  id: string;
  text: string;
  type: 'experience' | 'guide' | 'style';
};

/**
 * SearchFilters: Search filter parameters
 * Usage: Search results page, filter sidebar
 */
export interface SearchFilters {
  destination?: string;
  dateRange?: {
    start: Date;
    end: Date;
  };
  priceRange?: {
    min: number;
    max: number;
  };
  duration?: string[];
  categories?: string[];
  languages?: string[];
  rating?: number;
  verified?: boolean;
}

// ============================================================================
// UI COMPONENT PROP TYPES
// ============================================================================

/**
 * Modal component props
 * Usage: All modal components (login, booking, etc.)
 */
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
}

/**
 * Rating component props
 * Usage: Rating display component
 */
export interface RatingProps {
  value: number;
  showCount?: boolean;
  count?: number;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * InterestTag component props
 * Usage: Interest/category tag buttons
 */
export interface InterestTagProps {
  label: string;
  icon?: React.ReactNode;
  iconPosition?: 'left' | 'top';
  selected?: boolean;
  onClick?: () => void;
  className?: string;
}

/**
 * TourCard component props
 * Usage: Tour listing cards
 */
export interface TourCardProps {
  tour: Tour;
  onFavorite?: (id: string) => void;
}

/**
 * SearchBar component props
 * Usage: Search input components
 */
export interface SearchBarProps {
  className?: string;
  placeholder?: string;
  onSearch?: (query: string) => void;
  suggestions?: SearchSuggestion[];
}

// ============================================================================
// PAGE COMPONENT PROP TYPES
// ============================================================================

/**
 * TourLeaderCard component props
 * Usage: Tour leader listing cards
 */
export type TourLeaderCardProps = {
  leader: TourLeader;
  userPreferences?: string[];
  showMatchScore?: boolean;
};

/**
 * ConsultationBookingModal component props
 * Usage: Consultation booking flow
 */
export interface ConsultationBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  booking: ConsultationBooking;
}

/**
 * InvitationCodeModal component props
 * Usage: Invitation code entry modal
 */
export interface InvitationCodeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onValidCode: () => void;
}

/**
 * LoginModal component props
 * Usage: User authentication modal
 */
export type LoginModalProps = {
  isOpen: boolean;
  onClose: () => void;
};

/**
 * PersonalityMatch component props
 * Usage: Personality compatibility display
 */
export type PersonalityMatchProps = {
  data: PersonalityMatchData;
  showMatchPercentage?: boolean;
  className?: string;
};

/**
 * TravelStories component props
 * Usage: Travel stories section
 */
export type TravelStoriesProps = {
  stories: TravelStory[];
};

/**
 * GuideCertifications component props
 * Usage: Certification display section
 */
export type GuideCertificationsProps = {
  certifications: Certification[];
  className?: string;
};

// ============================================================================
// UTILITY TYPES
// ============================================================================

/**
 * API Response wrapper
 * Usage: Standardized API response format
 */
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Pagination parameters
 * Usage: Paginated list requests
 */
export interface PaginationParams {
  page: number;
  limit: number;
  total?: number;
  hasMore?: boolean;
}

/**
 * User preferences
 * Usage: User profile, personalization
 */
export interface UserPreferences {
  travelStyle: string[];
  interests: string[];
  budget: 'budget' | 'mid-range' | 'luxury';
  languages: string[];
  accessibility?: string[];
}

/**
 * Booking status
 * Usage: Booking state management
 */
export type BookingStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
export interface Booking {
  id: string;
  bookingReference: string;
  tourId: string;
  tourTitle: string;
  location?: string;
  tourLocation?: string; // Actual tour location from tours table
  selectedDate: string;
  participants: number;
  pricePerPerson: number;
  totalPrice: number;
  leadTraveler: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  additionalTravelers?: Array<{
    firstName: string;
    lastName: string;
  }>;
  specialRequests?: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt: string;
}

export interface BookingSearchFilters {
  status?: BookingStatus;
  dateRange?: {
    start: string;
    end: string;
  };
  location?: string;
  tourTitle?: string;
  bookingReference?: string;
  sortBy?: 'createdAt' | 'selectedDate' | 'totalPrice';
  sortOrder?: 'asc' | 'desc';
}

export interface BookingListResponse {
  success: boolean;
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
}

/**
 * Payment method
 * Usage: Payment processing
 */
export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'bank_transfer';
  last4?: string;
  brand?: string;
  isDefault: boolean;
}
