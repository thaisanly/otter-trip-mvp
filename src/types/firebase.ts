// Firebase Firestore Schema Types for Otter Trip Travel Platform
// Optimized for read efficiency with denormalized data where appropriate

import { Timestamp, GeoPoint } from 'firebase/firestore';

// ============================================================================
// USER TYPES
// ============================================================================

export interface FirebaseUser {
  id: string;
  email: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  profileImage?: string;
  phone?: string;
  dateOfBirth?: Date;
  nationality?: string; // ISO country code
  bio?: string;
  travelStyle: string[]; // ['adventure', 'cultural', 'relaxation', 'food']
  interests: string[]; // ['hiking', 'photography', 'history']
  budgetPreference?: 'budget' | 'mid-range' | 'luxury';
  emailVerified: boolean;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
  lastLoginAt?: Timestamp;
}

// ============================================================================
// TOUR LEADER TYPES
// ============================================================================

export interface TourLeader {
  id: string;
  userId?: string; // Reference to user if they have an account
  leaderType: 'leader' | 'expert' | 'manager';
  displayName: string;
  profileImage?: string;
  location: string;
  countryCode: string; // ISO country code
  coordinates?: GeoPoint;
  bio?: string;
  experienceYears: number;
  pricePerDay: number;
  currency: string;
  availabilityStatus?: string;
  personalityTraits: string[];

  // Embedded data for efficiency
  languages: Language[]; // Embedded array
  specialties: string[]; // Simple array of specialty names
  certifications: Certification[]; // Embedded array

  // Expert-specific fields
  followerCount: number;
  videoCount: number;
  liveStreamCount: number;
  totalToursConducted: number;

  // Ratings (denormalized)
  averageRating: number;
  totalReviews: number;

  // Rating breakdown (denormalized for display)
  ratingBreakdown?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };

  // Average ratings by category (denormalized)
  categoryRatings?: {
    communication: number;
    knowledge: number;
    friendliness: number;
    professionalism: number;
    flexibility: number;
  };

  // Badges
  badges: {
    isVerified: boolean;
    isFeatured: boolean;
    isTopCreator: boolean;
    isRisingStar: boolean;
    isTopRated: boolean;
    isNewJoined: boolean;
    isLive: boolean;
  };

  // Consultation settings
  acceptsConsultations: boolean;
  consultationPrice?: number;
  consultationDuration?: number; // minutes

  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Reviews are stored as subcollection: tourLeaders/{leaderId}/reviews/{reviewId}
}

interface Language {
  code: string; // 'en', 'es', 'fr'
  name: string; // 'English', 'Spanish', 'French'
  proficiencyLevel: 'basic' | 'conversational' | 'fluent' | 'native';
}

interface Certification {
  name: string;
  issuer: string;
  issueDate?: Date;
  expiryDate?: Date;
  iconType?: 'award' | 'shield' | 'check';
  isVerified: boolean;
}

// ============================================================================
// TOUR TYPES (Master Data Collection)
// ============================================================================

export interface Tour {
  id: string;
  tourCode: string; // Unique tour code like 'BAL-ADV-001'
  leaderId: string;
  leaderName: string; // Denormalized for display
  leaderImage?: string; // Denormalized for display
  title: string;
  slug: string;

  // Tour Overview Section
  overview: {
    description: string; // Main tour description
    highlights: string[]; // List of tour highlights
    gallery: string[]; // List of image URLs for gallery
  };

  description: string; // Brief description for cards/lists
  detailedDescription?: string; // Full detailed description
  coverImage?: string;
  images?: string[]; // Additional images

  // Tour details
  durationDays: number;
  durationText: string; // '3 days', '1 week'
  groupSize: {
    min: number;
    max: number;
    ideal?: number; // Ideal group size
  };
  minParticipants: number; // Keeping for backward compatibility
  maxParticipants: number; // Keeping for backward compatibility
  difficultyLevel: 'easy' | 'moderate' | 'challenging' | 'extreme';

  // Pricing
  pricePerPerson: number;
  currency: string;
  priceIncludes?: string[]; // Deprecated - use inclusions.included
  priceExcludes?: string[]; // Deprecated - use inclusions.notIncluded

  // What's Included Section
  inclusions: {
    included: string[]; // List of what's included
    notIncluded: string[]; // List of what's not included
    additionalInfo?: {
      title: string;
      description: string;
    }[];
  };

  // Location
  locations: string[]; // Multiple locations the tour covers
  destination: string; // Main destination
  destinationId: string;
  destinationSlug?: string; // Denormalized for URL building
  countryCode: string;
  startingPoint?: string;
  endingPoint?: string;
  coordinates?: GeoPoint;

  // Categories and tags
  category: 'adventure' | 'cultural' | 'relaxation' | 'food' | 'nature' | 'urban' | 'luxury';
  tags?: string[];

  // Itinerary (embedded)
  itinerary?: TourItineraryDay[];

  // Availability
  isActive: boolean;
  isFeatured: boolean;
  availableFrom?: Date;
  availableUntil?: Date;
  blackoutDates?: DateRange[];
  schedules?: TourSchedule[]; // Upcoming scheduled dates

  // Stats (denormalized)
  totalBookings: number;
  totalReviews: number;
  averageRating: number;

  // Rating breakdown (denormalized for display)
  ratingBreakdown?: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };

  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Reviews are stored as subcollection: tours/{tourId}/reviews/{reviewId}
}

interface TourItineraryDay {
  dayNumber: number;
  title?: string;
  description?: string;
  activities?: string[];
  mealsIncluded?: ('breakfast' | 'lunch' | 'dinner')[];
  accommodationType?: string;
}

interface TourSchedule {
  id: string;
  startDate: Date;
  endDate: Date;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  currentParticipants: number;
  maxParticipants: number;
}

interface DateRange {
  start: Date;
  end: Date;
}

// ============================================================================
// BOOKING TYPES
// ============================================================================

export interface Booking {
  id: string;
  bookingType: 'tour' | 'consultation';
  userId: string;
  userName: string; // Denormalized
  userEmail: string; // Denormalized

  // Tour booking fields
  tourId?: string;
  tourTitle?: string; // Denormalized
  tourScheduleId?: string;

  // Leader fields
  leaderId: string;
  leaderName: string; // Denormalized

  // Booking details
  bookingDate: Timestamp;
  startDate?: Date;
  endDate?: Date;
  participantCount: number;

  // Consultation specific
  consultationDate?: Date;
  consultationTime?: string; // HH:MM format
  consultationDuration?: number; // minutes
  consultationNotes?: string;
  meetingLink?: string;

  // Pricing
  totalAmount: number;
  currency: string;
  discountAmount?: number;
  promoCode?: string;

  // Status
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  paymentStatus: 'pending' | 'paid' | 'partial' | 'refunded';
  cancellationReason?: string;
  cancelledAt?: Timestamp;

  // Guest information
  guestDetails?: GuestDetail[];
  specialRequests?: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

interface GuestDetail {
  firstName: string;
  lastName: string;
  email?: string;
  phone?: string;
  dateOfBirth?: Date;
  nationality?: string;
}

// ============================================================================
// REVIEW TYPES
// ============================================================================

// Tour Review - Stored as subcollection: tours/{tourId}/reviews/{reviewId}
export interface TourReview {
  id: string;
  reviewerId: string;
  reviewerName: string; // Denormalized
  reviewerImage?: string; // Denormalized
  reviewerCountry?: string; // Reviewer's country

  bookingId?: string; // Reference to booking if verified purchase
  tourDate?: Date; // When they took the tour

  rating: number; // 1-5
  title?: string;
  comment: string;

  // Detailed ratings for tours
  ratings?: {
    guide?: number; // Guide/leader rating
    value?: number; // Value for money
    organization?: number; // Tour organization
    safety?: number; // Safety measures
    fun?: number; // Entertainment/enjoyment
  };

  // Media
  images?: string[];

  // Interaction
  helpfulCount: number;
  notHelpfulCount?: number;
  responseFromOwner?: string;
  responseDate?: Timestamp;

  isVerifiedBooking: boolean;
  isFeatured: boolean;
  isReported?: boolean;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Leader Review - Can be stored as subcollection: tourLeaders/{leaderId}/reviews/{reviewId}
export interface LeaderReview {
  id: string;
  reviewerId: string;
  reviewerName: string; // Denormalized
  reviewerImage?: string; // Denormalized

  tourId?: string; // Which tour they took with this leader
  tourTitle?: string; // Denormalized
  bookingId?: string;

  rating: number; // 1-5
  title?: string;
  comment: string;

  // Detailed ratings for leaders
  ratings?: {
    communication?: number;
    knowledge?: number;
    friendliness?: number;
    professionalism?: number;
    flexibility?: number;
  };

  // Media
  images?: string[];

  // Interaction
  helpfulCount: number;
  responseFromLeader?: string;
  responseDate?: Timestamp;

  isVerifiedBooking: boolean;
  isFeatured: boolean;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Keep old Review interface for backward compatibility (deprecated)
export interface Review extends TourReview {
  reviewableType?: 'tour' | 'leader';
  tourId?: string;
  leaderId?: string;
  leaderName?: string;
}

// ============================================================================
// EXPERT TYPES (Enhanced Tour Leaders for Content Creators)
// ============================================================================

export interface Expert {
  id: string;
  userId?: string; // Reference to user account if they have one

  // Basic Info
  name: string;
  slug: string; // URL-friendly identifier like 'sarah-chen'
  displayName: string;
  image: string; // Profile image
  coverImage?: string; // Cover/banner image

  // Location
  location: string; // City/Region
  countryCode: string; // ISO country code
  countryFlag?: string; // Emoji flag like '🇸🇬'
  coordinates?: GeoPoint;
  timezone?: string;

  // Professional Info
  bio: string; // Detailed bio/description
  experienceYears: number;
  languages: string[]; // Languages spoken
  specialties: string[]; // Areas of expertise
  personalityTraits?: string[];

  // Verification & Badges
  verified: boolean;
  verifiedAt?: Timestamp;
  badges: {
    isTopCreator?: boolean;
    isRisingStar?: boolean;
    isNewJoined?: boolean;
    isFeatured?: boolean;
  };

  // Stats (denormalized for display)
  stats: {
    rating: number;
    totalReviews: number;
    followers: number;
    following?: number;
    videos: number;
    liveStreams: number;
    tours: number;
    totalToursConducted?: number;
  };

  // Live Status
  isLive: boolean;
  currentStreamId?: string;

  // Social Media Links
  socialLinks: {
    instagram?: string;
    youtube?: string;
    twitter?: string;
    facebook?: string;
    linkedin?: string;
    tiktok?: string;
    website?: string;
  };

  // Consultation Settings
  offersConsultations: boolean;
  consultationPrice?: number;
  consultationCurrency?: string;
  consultationDuration?: number; // in minutes
  consultationAvailability?: string; // e.g., "Available", "Busy", "Away"

  // Featured Content (denormalized for quick access)
  featuredTours?: FeaturedTour[]; // Top 2-3 tours
  upcomingStreams?: UpcomingStream[]; // Next scheduled streams
  latestVideos?: LatestVideo[]; // Recent video content

  // Settings
  isActive: boolean;
  acceptsBookings: boolean;
  responseTime?: string; // e.g., "Within 24 hours"
  cancellationPolicy?: string;

  createdAt: Timestamp;
  updatedAt: Timestamp;

  // Reviews are stored as subcollection: experts/{expertId}/reviews/{reviewId}
  // Tours are referenced from main tours collection with expertId field
  // Videos/Streams can be subcollections or separate collections
}

interface FeaturedTour {
  id: string;
  title: string;
  image: string;
  duration: string;
  price: string;
  currency?: string;
  description: string;
  rating?: number;
  reviews?: number;
  nextAvailable?: Date;
  spotsLeft?: number;
}

interface UpcomingStream {
  id: string;
  title: string;
  date: string;
  time: string;
  timezone?: string;
  thumbnail: string;
  streamType?: 'live_tour' | 'q&a' | 'workshop' | 'destination_guide';
  registeredCount?: number;
}

interface LatestVideo {
  id: string;
  title: string;
  thumbnail: string;
  duration?: string;
  views?: string;
  publishedAt?: Date;
  videoUrl?: string;
}

// Expert Review type (stored as subcollection)
export interface ExpertReview {
  id: string;
  reviewerId: string;
  reviewerName: string;
  reviewerImage?: string;
  reviewerCountry?: string;

  tourId?: string; // Which tour they took (if applicable)
  tourTitle?: string;
  consultationId?: string; // If reviewing a consultation

  rating: number; // 1-5
  title?: string;
  comment: string;

  // Detailed ratings
  ratings?: {
    communication?: number;
    knowledge?: number;
    friendliness?: number;
    professionalism?: number;
    value?: number;
  };

  verifiedBooking: boolean;
  helpfulCount: number;
  images?: string[];

  responseFromExpert?: string;
  responseDate?: Timestamp;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// Related Experts (for recommendations)
export interface RelatedExpert {
  id: string;
  name: string;
  image: string;
  location: string;
  countryCode: string;
  verified: boolean;
  rating: number;
  reviews: number;
  followers: number;
  specialties: string[];
  isLive?: boolean;
  isTopCreator?: boolean;
  isRisingStar?: boolean;
}

// ============================================================================
// COLLECTION NAMES
// ============================================================================

export const COLLECTIONS = {
  // Main collections
  USERS: 'users',
  TOUR_LEADERS: 'tourLeaders',
  TOURS: 'tours',
  BOOKINGS: 'bookings',
  EXPERTS: 'experts',
} as const;

// ============================================================================
// SUBCOLLECTIONS
// ============================================================================

export const SUBCOLLECTIONS = {
  // Tour subcollections
  TOUR_REVIEWS: 'reviews', // tours/{tourId}/reviews

  // Leader subcollections
  LEADER_REVIEWS: 'reviews', // tourLeaders/{leaderId}/reviews

  // Expert subcollections
  EXPERT_REVIEWS: 'reviews', // experts/{expertId}/reviews
} as const;

// ============================================================================
// HELPER TYPES
// ============================================================================

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
export type SubcollectionName = (typeof SUBCOLLECTIONS)[keyof typeof SUBCOLLECTIONS];

// ============================================================================
// INDEXING RECOMMENDATIONS
// ============================================================================

/**
 * Recommended Firestore Composite Indexes:
 *
 * 1. tourLeaders:
 *    - (leaderType, badges.isFeatured, averageRating DESC)
 *    - (countryCode, isActive, averageRating DESC)
 *    - (category, isActive, createdAt DESC)
 *
 * 2. tours:
 *    - (category, isActive, averageRating DESC)
 *    - (leaderId, isActive, createdAt DESC)
 *
 * 3. bookings:
 *    - (userId, status, createdAt DESC)
 *    - (leaderId, status, startDate ASC)
 *    - (tourId, status, startDate ASC)
 *
 * 4. experts:
 *    - (verified, isActive, stats.rating DESC)
 *    - (countryCode, isActive, stats.followers DESC)
 */
