/**
 * Database Entity Types
 * TypeScript interfaces that map to the PostgreSQL database schema
 * These types should be used in the backend API layer
 */

// ============================================================================
// USER ENTITIES
// ============================================================================

export interface DBUser {
  id: string;
  email: string;
  password_hash: string;
  username?: string;
  first_name?: string;
  last_name?: string;
  profile_image?: string;
  phone?: string;
  date_of_birth?: Date;
  nationality?: string;
  bio?: string;
  travel_style?: string[];
  interests?: string[];
  budget_preference?: 'budget' | 'mid-range' | 'luxury';
  accessibility_needs?: string[];
  preferred_languages?: string[];
  email_verified: boolean;
  phone_verified: boolean;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  last_login_at?: Date;
}

export interface DBTourLeader {
  id: string;
  user_id?: string;
  leader_type: 'leader' | 'expert' | 'manager';
  display_name: string;
  profile_image?: string;
  location?: string;
  country_code?: string;
  coordinates?: { lat: number; lng: number };
  bio?: string;
  experience_years: number;
  price_per_day?: number;
  currency: string;
  availability_status?: string;
  personality_traits?: string[];

  // Expert-specific fields
  follower_count: number;
  video_count: number;
  live_stream_count: number;
  total_tours_conducted: number;

  // Verification and badges
  is_verified: boolean;
  verified_at?: Date;
  is_featured: boolean;
  is_top_creator: boolean;
  is_rising_star: boolean;
  is_top_rated: boolean;
  is_new_joined: boolean;

  // Settings
  is_active: boolean;
  accepts_consultations: boolean;
  consultation_price?: number;
  consultation_duration: number;

  created_at: Date;
  updated_at: Date;

  // Relations
  languages?: DBLeaderLanguage[];
  specialties?: DBLeaderSpecialty[];
  certifications?: DBCertification[];
}

export interface DBLeaderLanguage {
  id: string;
  leader_id: string;
  language_code: string;
  proficiency_level: 'basic' | 'conversational' | 'fluent' | 'native';
  created_at: Date;
}

export interface DBLeaderSpecialty {
  id: string;
  leader_id: string;
  specialty_name: string;
  years_experience: number;
  created_at: Date;
}

// ============================================================================
// TOUR ENTITIES
// ============================================================================

export interface DBTour {
  id: string;
  leader_id?: string;
  title: string;
  slug: string;
  description?: string;
  detailed_description?: string;
  cover_image?: string;
  images?: string[];

  // Tour details
  duration_days?: number;
  duration_text?: string;
  min_participants: number;
  max_participants?: number;
  difficulty_level?: 'easy' | 'moderate' | 'challenging' | 'extreme';

  // Pricing
  price_per_person: number;
  currency: string;
  price_includes?: string[];
  price_excludes?: string[];

  // Location
  destination?: string;
  country_code?: string;
  starting_point?: string;
  ending_point?: string;
  coordinates?: { lat: number; lng: number };

  // Categories and tags
  category?: 'adventure' | 'cultural' | 'relaxation' | 'food' | 'nature' | 'urban' | 'luxury';
  tags?: string[];

  // Availability
  is_active: boolean;
  is_featured: boolean;
  available_from?: Date;
  available_until?: Date;
  blackout_dates?: Array<{ start: Date; end: Date }>;

  // Stats
  total_bookings: number;
  total_reviews: number;
  average_rating: number;

  created_at: Date;
  updated_at: Date;

  // Relations
  leader?: DBTourLeader;
  itinerary?: DBTourItinerary[];
  schedules?: DBTourSchedule[];
}

export interface DBTourItinerary {
  id: string;
  tour_id: string;
  day_number: number;
  title?: string;
  description?: string;
  activities?: string[];
  meals_included?: string[];
  accommodation_type?: string;
  created_at: Date;
}

export interface DBTourSchedule {
  id: string;
  tour_id: string;
  start_date: Date;
  end_date: Date;
  status: 'scheduled' | 'confirmed' | 'cancelled' | 'completed';
  current_participants: number;
  max_participants?: number;
  created_at: Date;
}

// ============================================================================
// BOOKING ENTITIES
// ============================================================================

export interface DBBooking {
  id: string;
  booking_type: 'tour' | 'consultation';
  user_id?: string;
  tour_id?: string;
  tour_schedule_id?: string;
  leader_id?: string;

  // Booking details
  booking_date: Date;
  start_date?: Date;
  end_date?: Date;
  participant_count: number;

  // Consultation specific
  consultation_date?: Date;
  consultation_time?: string;
  consultation_duration?: number;
  consultation_notes?: string;
  meeting_link?: string;

  // Pricing
  total_amount: number;
  currency: string;
  discount_amount: number;
  promo_code?: string;

  // Status
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  payment_status: 'pending' | 'paid' | 'partial' | 'refunded';
  cancellation_reason?: string;
  cancelled_at?: Date;

  // Guest information
  guest_details?: Array<{
    first_name: string;
    last_name: string;
    email?: string;
    phone?: string;
    age?: number;
  }>;
  special_requests?: string;

  created_at: Date;
  updated_at: Date;

  // Relations
  user?: DBUser;
  tour?: DBTour;
  leader?: DBTourLeader;
  payments?: DBPayment[];
}

export interface DBPayment {
  id: string;
  booking_id: string;
  user_id?: string;
  amount: number;
  currency: string;
  payment_method: 'card' | 'paypal' | 'bank_transfer' | 'crypto';
  payment_provider?: string;
  provider_payment_id?: string;
  status: 'pending' | 'processing' | 'succeeded' | 'failed' | 'refunded';
  metadata?: Record<string, unknown>;
  paid_at?: Date;
  created_at: Date;
}

// ============================================================================
// REVIEW ENTITIES
// ============================================================================

export interface DBReview {
  id: string;
  reviewer_id?: string;
  reviewable_type: 'tour' | 'leader';
  tour_id?: string;
  leader_id?: string;
  booking_id?: string;

  rating: number;
  title?: string;
  comment?: string;

  // Detailed ratings
  communication_rating?: number;
  knowledge_rating?: number;
  value_rating?: number;
  organization_rating?: number;

  // Media
  images?: string[];

  // Interaction
  helpful_count: number;
  response_from_owner?: string;
  response_date?: Date;

  is_verified_booking: boolean;
  is_featured: boolean;

  created_at: Date;
  updated_at: Date;

  // Relations
  reviewer?: DBUser;
  tour?: DBTour;
  leader?: DBTourLeader;
}

// ============================================================================
// PERSONALITY ENTITIES
// ============================================================================

export interface DBPersonalityType {
  id: string;
  type_name: string;
  description?: string;
  icon?: string;
  traits?: string[];
  created_at: Date;
}

export interface DBUserQuizResult {
  id: string;
  user_id: string;
  personality_type_id?: string;
  quiz_answers?: Record<string, unknown>;
  result_traits?: string[];
  completed_at: Date;
  is_current: boolean;

  // Relations
  user?: DBUser;
  personality_type?: DBPersonalityType;
}

export interface DBPersonalityMatchScore {
  id: string;
  user_id: string;
  leader_id: string;
  match_percentage: number;
  matching_traits?: string[];
  calculated_at: Date;

  // Relations
  user?: DBUser;
  leader?: DBTourLeader;
}

// ============================================================================
// CERTIFICATION ENTITIES
// ============================================================================

export interface DBCertification {
  id: string;
  leader_id: string;
  name: string;
  issuer: string;
  issue_date?: Date;
  expiry_date?: Date;
  certificate_number?: string;
  icon_type?: 'award' | 'shield' | 'check';
  is_verified: boolean;
  verified_at?: Date;
  verification_notes?: string;
  document_url?: string;
  created_at: Date;
  updated_at: Date;
}

// ============================================================================
// CONTENT ENTITIES
// ============================================================================

export interface DBTravelStory {
  id: string;
  author_id?: string;
  tour_id?: string;
  title: string;
  slug: string;
  location?: string;
  story_date?: Date;
  cover_image?: string;
  content: string;
  excerpt?: string;

  // Categorization
  tags?: string[];
  personality_traits?: string[];

  // Engagement
  view_count: number;
  like_count: number;
  share_count: number;

  // Status
  status: 'draft' | 'published' | 'archived';
  is_featured: boolean;
  published_at?: Date;

  created_at: Date;
  updated_at: Date;

  // Relations
  author?: DBUser;
  tour?: DBTour;
  likes?: DBStoryLike[];
}

export interface DBStoryLike {
  id: string;
  story_id: string;
  user_id: string;
  created_at: Date;
}

// ============================================================================
// COMMUNICATION ENTITIES
// ============================================================================

export interface DBMessage {
  id: string;
  sender_id?: string;
  recipient_id?: string;
  leader_recipient_id?: string;
  booking_id?: string;
  subject?: string;
  content: string;
  is_read: boolean;
  read_at?: Date;
  parent_message_id?: string;
  created_at: Date;

  // Relations
  sender?: DBUser;
  recipient?: DBUser;
  leader_recipient?: DBTourLeader;
  booking?: DBBooking;
}

export interface DBNotification {
  id: string;
  user_id: string;
  type: string;
  title: string;
  message?: string;
  data?: Record<string, unknown>;
  is_read: boolean;
  read_at?: Date;
  created_at: Date;

  // Relations
  user?: DBUser;
}

// ============================================================================
// FAVORITES ENTITIES
// ============================================================================

export interface DBUserFavorite {
  id: string;
  user_id: string;
  favoritable_type: 'tour' | 'leader' | 'story';
  tour_id?: string;
  leader_id?: string;
  story_id?: string;
  created_at: Date;

  // Relations
  user?: DBUser;
  tour?: DBTour;
  leader?: DBTourLeader;
  story?: DBTravelStory;
}

// ============================================================================
// SEARCH ENTITIES
// ============================================================================

export interface DBSearchHistory {
  id: string;
  user_id: string;
  search_query?: string;
  search_type?: string;
  filters?: Record<string, unknown>;
  results_count?: number;
  created_at: Date;
}

export interface DBPopularSearch {
  id: string;
  search_term: string;
  search_type?: string;
  search_count: number;
  last_searched: Date;
}

// ============================================================================
// ADMIN ENTITIES
// ============================================================================

export interface DBInvitationCode {
  id: string;
  code: string;
  created_by?: string;
  max_uses: number;
  uses_count: number;
  valid_from: Date;
  valid_until?: Date;
  is_active: boolean;
  created_at: Date;
}

export interface DBPromoCode {
  id: string;
  code: string;
  description?: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  minimum_amount?: number;
  max_uses?: number;
  uses_count: number;
  valid_from: Date;
  valid_until?: Date;
  applicable_to?: 'all' | 'tours' | 'consultations';
  is_active: boolean;
  created_at: Date;
}

// ============================================================================
// QUERY RESULT TYPES
// ============================================================================

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasMore: boolean;
  };
}

export interface SearchResult<T> {
  results: T[];
  facets?: Record<string, Array<{ value: string; count: number }>>;
  total: number;
  query: string;
  filters: Record<string, unknown>;
}

export interface AggregationResult {
  [key: string]: number | string;
}

// ============================================================================
// DATABASE OPERATION TYPES
// ============================================================================

export type CreateInput<T> = Omit<T, 'id' | 'created_at' | 'updated_at'>;
export type UpdateInput<T> = Partial<Omit<T, 'id' | 'created_at' | 'updated_at'>>;

export interface DatabaseError {
  code: string;
  message: string;
  details?: unknown;
}

export interface TransactionContext {
  client: unknown; // Database client type
  rollback: () => Promise<void>;
  commit: () => Promise<void>;
}
