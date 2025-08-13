// Firebase Firestore Schema Types for Otter Trip Travel Platform
// Optimized for read efficiency with denormalized data where appropriate

import { Timestamp, GeoPoint } from "firebase/firestore";

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
  budgetPreference?: "budget" | "mid-range" | "luxury";
  accessibilityNeeds?: string[];
  preferredLanguages?: string[];
  emailVerified: boolean;
  phoneVerified: boolean;
  isActive: boolean;
  personalityType?: PersonalityType;
  favoriteLeaders: string[]; // Array of leader IDs
  favoriteTours: string[]; // Array of tour IDs
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
  leaderType: "leader" | "expert" | "manager";
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
  proficiencyLevel: "basic" | "conversational" | "fluent" | "native";
}

interface Certification {
  name: string;
  issuer: string;
  issueDate?: Date;
  expiryDate?: Date;
  iconType?: "award" | "shield" | "check";
  isVerified: boolean;
}

// ============================================================================
// DESTINATION TYPES (Master Data Collection)
// ============================================================================

export interface Destination {
  id: string;
  slug: string;
  name: string;
  country: string;
  countryCode: string;
  region?: string;
  coordinates?: GeoPoint;
  timezone?: string;
  image?: string;
  galleryImages?: string[];
  description?: string;
  highlights?: string[];
  guideCount: number;
  tourCount: number;
  averageTourPrice?: number;
  popularActivities?: string[];
  bestMonths?: number[]; // [1, 2, 3] for Jan, Feb, Mar
  climateType?: string;
  languagesSpoken?: string[];
  currencyCode?: string;
  isFeatured: boolean;
  isActive: boolean;
  searchRank: number;
  tags?: string[];
  createdAt: Timestamp;
  updatedAt: Timestamp;
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
  difficultyLevel: "easy" | "moderate" | "challenging" | "extreme";

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
  category:
    | "adventure"
    | "cultural"
    | "relaxation"
    | "food"
    | "nature"
    | "urban"
    | "luxury";
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
  mealsIncluded?: ("breakfast" | "lunch" | "dinner")[];
  accommodationType?: string;
}

interface TourSchedule {
  id: string;
  startDate: Date;
  endDate: Date;
  status: "scheduled" | "confirmed" | "cancelled" | "completed";
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
  bookingType: "tour" | "consultation";
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
  status: "pending" | "confirmed" | "cancelled" | "completed" | "refunded";
  paymentStatus: "pending" | "paid" | "partial" | "refunded";
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
  reviewableType?: "tour" | "leader";
  tourId?: string;
  leaderId?: string;
  leaderName?: string;
}

// ============================================================================
// LIVE STREAM & VIDEO TYPES
// ============================================================================

export interface LiveStream {
  id: string;
  leaderId: string;
  leaderName: string; // Denormalized
  leaderImage?: string; // Denormalized
  title: string;
  description?: string;
  thumbnailUrl?: string;
  streamUrl?: string;

  scheduledStart: Timestamp;
  scheduledEnd?: Timestamp;
  actualStart?: Timestamp;
  actualEnd?: Timestamp;
  durationMinutes?: number;

  destinationId?: string;
  destinationName?: string; // Denormalized
  location?: string;
  tourId?: string;
  tourTitle?: string; // Denormalized

  streamType:
    | "tour_preview"
    | "live_tour"
    | "q&a"
    | "destination_guide"
    | "cultural_event"
    | "cooking"
    | "other";
  tags?: string[];

  status: "scheduled" | "live" | "ended" | "cancelled" | "error";
  isFeatured: boolean;
  visibility: "public" | "followers_only" | "paid" | "private";

  // Metrics
  maxConcurrentViewers: number;
  totalViews: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;

  // Paid stream
  isPaid: boolean;
  price?: number;
  currency?: string;

  // Recording
  isRecorded: boolean;
  recordingUrl?: string;
  recordingAvailable: boolean;

  createdAt: Timestamp;
  updatedAt: Timestamp;
}

export interface Video {
  id: string;
  leaderId: string;
  leaderName: string; // Denormalized
  leaderImage?: string; // Denormalized
  title: string;
  description?: string;
  thumbnailUrl?: string;
  videoUrl: string;
  durationSeconds: number;

  destinationId?: string;
  destinationName?: string; // Denormalized
  tourId?: string;
  tourTitle?: string; // Denormalized

  videoType:
    | "tour_highlight"
    | "destination_guide"
    | "tutorial"
    | "review"
    | "vlog"
    | "promotional"
    | "testimonial"
    | "other";
  tags?: string[];

  sourceType: "uploaded" | "live_stream_recording" | "external";
  liveStreamId?: string;

  status: "processing" | "published" | "unlisted" | "private" | "deleted";
  isFeatured: boolean;
  visibility: "public" | "followers_only" | "paid" | "private";

  // Metrics
  viewCount: number;
  likesCount: number;
  commentsCount: number;
  sharesCount: number;
  watchTimeMinutes: number;
  averageWatchPercentage?: number;

  // Paid video
  isPaid: boolean;
  price?: number;
  currency?: string;

  publishedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// MASTER DATA COLLECTIONS
// ============================================================================

// Personality Types
export interface PersonalityType {
  id: string;
  typeName: string;
  description: string;
  icon?: string;
  traits: string[];
  createdAt: Timestamp;
}

// Travel Styles Master Data
export interface TravelStyleOption {
  id: string;
  name: string; // 'adventure', 'cultural', 'relaxation', 'food', 'nature', 'luxury'
  displayName: string; // 'Adventure Travel', 'Cultural Exploration', etc.
  description?: string;
  icon?: string;
  relatedInterests?: string[]; // Related interest IDs
  isActive: boolean;
  sortOrder: number;
  createdAt: Timestamp;
}

// Interests Master Data
export interface InterestOption {
  id: string;
  name: string; // 'hiking', 'photography', 'history', 'yoga', 'cooking'
  displayName: string; // 'Hiking & Trekking', 'Photography', etc.
  category?: string; // 'outdoor', 'arts', 'wellness', 'culinary'
  description?: string;
  icon?: string;
  relatedTravelStyles?: string[]; // Related travel style IDs
  isActive: boolean;
  sortOrder: number;
  createdAt: Timestamp;
}

// Specialties Master Data (for Tour Leaders)
export interface SpecialtyOption {
  id: string;
  name: string; // 'photography-tours', 'food-history', 'wilderness-survival'
  displayName: string; // 'Photography Tours', 'Food History', etc.
  category?: string; // 'tours', 'cultural', 'adventure', 'expertise'
  description?: string;
  icon?: string;
  requiredCertifications?: string[]; // List of certification types that might be required
  relatedCategories?: string[]; // Tour categories this specialty relates to
  isActive: boolean;
  sortOrder: number;
  createdAt: Timestamp;
}

// Languages Master Data
export interface LanguageOption {
  id: string;
  code: string; // ISO 639-1 code: 'en', 'es', 'fr', 'ja', 'zh'
  name: string; // 'English', 'Spanish', 'French'
  nativeName?: string; // 'English', 'Español', 'Français'
  region?: string; // Optional regional variant
  isActive: boolean;
  sortOrder: number;
  createdAt: Timestamp;
}

// Activities Master Data (for tours and itineraries)
export interface ActivityOption {
  id: string;
  name: string; // 'temple-visit', 'snorkeling', 'cooking-class'
  displayName: string; // 'Temple Visit', 'Snorkeling', 'Cooking Class'
  category?: string; // 'cultural', 'water-sports', 'culinary'
  description?: string;
  icon?: string;
  difficultyLevel?: 'easy' | 'moderate' | 'challenging';
  typicalDuration?: number; // in minutes
  requiredEquipment?: string[];
  isActive: boolean;
  sortOrder: number;
  createdAt: Timestamp;
}

// Tour Categories Master Data
export interface TourCategory {
  id: string;
  name: string; // 'adventure', 'cultural', 'relaxation', 'food', 'nature', 'urban', 'luxury'
  displayName: string; // 'Adventure Tours', 'Cultural Experiences', etc.
  description?: string;
  icon?: string;
  image?: string;
  relatedActivities?: string[]; // Activity IDs commonly associated
  relatedSpecialties?: string[]; // Specialty IDs commonly associated
  isActive: boolean;
  isFeatured: boolean;
  sortOrder: number;
  createdAt: Timestamp;
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
// TRAVEL STORY TYPES
// ============================================================================

export interface TravelStory {
  id: string;
  authorId: string;
  authorName: string; // Denormalized
  authorImage?: string; // Denormalized
  tourId?: string;
  tourTitle?: string; // Denormalized
  title: string;
  slug: string;
  location?: string;
  storyDate?: Date;
  coverImage?: string;
  content: string; // HTML or Markdown
  excerpt?: string;
  tags?: string[];
  personalityTraits?: string[];

  // Metrics
  viewCount: number;
  likeCount: number;
  shareCount: number;

  status: "draft" | "published" | "archived";
  isFeatured: boolean;

  publishedAt?: Timestamp;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

// ============================================================================
// MESSAGE & NOTIFICATION TYPES
// ============================================================================

export interface Message {
  id: string;
  senderId: string;
  senderName: string; // Denormalized
  senderImage?: string; // Denormalized
  recipientId: string;
  recipientType: "user" | "leader";
  bookingId?: string;
  subject?: string;
  content: string;
  isRead: boolean;
  readAt?: Timestamp;
  parentMessageId?: string; // For threading
  createdAt: Timestamp;
}

export interface Notification {
  id: string;
  userId: string;
  type: string; // 'booking_confirmed', 'new_review', 'stream_starting', etc.
  title: string;
  message?: string;
  data?: Record<string, unknown>; // Additional data
  isRead: boolean;
  readAt?: Timestamp;
  createdAt: Timestamp;
}

// ============================================================================
// SEARCH & ANALYTICS TYPES
// ============================================================================

export interface SearchHistory {
  id: string;
  userId: string;
  searchQuery: string;
  searchType?: string;
  filters?: Record<string, unknown>;
  resultsCount: number;
  createdAt: Timestamp;
}

export interface PopularSearch {
  id: string;
  searchTerm: string;
  searchType?: string;
  searchCount: number;
  lastSearched: Timestamp;
}

// ============================================================================
// PROMO CODE TYPES (Master Data Collection)
// ============================================================================

export interface PromoCode {
  id: string;
  code: string;
  description?: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minimumAmount?: number;
  maxUses?: number;
  usesCount: number;
  validFrom: Timestamp;
  validUntil?: Timestamp;
  applicableTo: "all" | "tours" | "consultations";
  isActive: boolean;
  createdAt: Timestamp;
}

// ============================================================================
// COLLECTION NAMES
// ============================================================================

export const COLLECTIONS = {
  // Main collections
  USERS: "users",
  TOUR_LEADERS: "tourLeaders",
  TOURS: "tours",
  DESTINATIONS: "destinations",
  BOOKINGS: "bookings",
  REVIEWS: "reviews", // Deprecated - reviews are now subcollections
  EXPERTS: "experts",

  // Content collections
  LIVE_STREAMS: "liveStreams",
  VIDEOS: "videos",
  TRAVEL_STORIES: "travelStories",

  // Communication
  MESSAGES: "messages",
  NOTIFICATIONS: "notifications",

  // Master data collections
  PERSONALITY_TYPES: "personalityTypes",
  PROMO_CODES: "promoCodes",
  TRAVEL_STYLES: "travelStyles",
  INTERESTS: "interests",
  SPECIALTIES: "specialties",
  LANGUAGES: "languages",
  ACTIVITIES: "activities",
  TOUR_CATEGORIES: "tourCategories",

  // Analytics
  SEARCH_HISTORY: "searchHistory",
  POPULAR_SEARCHES: "popularSearches",
} as const;

// ============================================================================
// SUBCOLLECTIONS
// ============================================================================

export const SUBCOLLECTIONS = {
  // Tour subcollections
  TOUR_REVIEWS: "reviews", // tours/{tourId}/reviews
  TOUR_QUESTIONS: "questions", // tours/{tourId}/questions
  
  // Leader subcollections  
  LEADER_REVIEWS: "reviews", // tourLeaders/{leaderId}/reviews
  LEADER_CERTIFICATIONS: "certifications", // tourLeaders/{leaderId}/certifications
  
  // Expert subcollections
  EXPERT_REVIEWS: "reviews", // experts/{expertId}/reviews
} as const;

// ============================================================================
// HELPER TYPES
// ============================================================================

export type CollectionName = (typeof COLLECTIONS)[keyof typeof COLLECTIONS];
export type SubcollectionName = (typeof SUBCOLLECTIONS)[keyof typeof SUBCOLLECTIONS];

export interface QueryOptions {
  limit?: number;
  orderBy?: string;
  orderDirection?: "asc" | "desc";
  startAfter?: unknown;
  where?: Array<{
    field: string;
    operator:
      | "<"
      | "<="
      | "=="
      | ">"
      | ">="
      | "!="
      | "array-contains"
      | "array-contains-any"
      | "in"
      | "not-in";
    value: unknown;
  }>;
}

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
 *    - (destinationId, isActive, pricePerPerson ASC)
 *    - (leaderId, isActive, createdAt DESC)
 *
 * 3. bookings:
 *    - (userId, status, createdAt DESC)
 *    - (leaderId, status, startDate ASC)
 *    - (tourId, status, startDate ASC)
 *
 * 4. reviews:
 *    - (leaderId, rating DESC, createdAt DESC)
 *    - (tourId, rating DESC, createdAt DESC)
 *
 * 5. liveStreams:
 *    - (status, scheduledStart ASC)
 *    - (leaderId, status, scheduledStart DESC)
 *
 * 6. videos:
 *    - (leaderId, status, viewCount DESC)
 *    - (videoType, status, publishedAt DESC)
 */
