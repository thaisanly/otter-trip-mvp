-- ============================================================================
-- OTTER TRIP TRAVEL PLATFORM - COMPLETE DATABASE SETUP
-- PostgreSQL 14+ with PostGIS Extension
-- 
-- This file contains the complete database schema and sample data
-- Run this file to set up the entire database from scratch
-- ============================================================================

-- ============================================================================
-- DATABASE SETUP
-- ============================================================================

-- Create database (run separately if needed)
-- CREATE DATABASE otter_trip;
-- \c otter_trip;

-- ============================================================================
-- EXTENSIONS
-- ============================================================================

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "postgis"; -- For location-based features

-- ============================================================================
-- USERS AND AUTHENTICATION
-- ============================================================================

-- Users table (travelers/customers)
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    username VARCHAR(100) UNIQUE,
    first_name VARCHAR(100),
    last_name VARCHAR(100),
    profile_image VARCHAR(500),
    phone VARCHAR(20),
    date_of_birth DATE,
    nationality VARCHAR(2), -- ISO country code
    bio TEXT,
    travel_style JSONB, -- Array of travel preferences
    interests JSONB, -- Array of interests
    budget_preference VARCHAR(20) CHECK (budget_preference IN ('budget', 'mid-range', 'luxury')),
    accessibility_needs JSONB, -- Array of accessibility requirements
    preferred_languages JSONB, -- Array of language codes
    email_verified BOOLEAN DEFAULT FALSE,
    phone_verified BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    last_login_at TIMESTAMP WITH TIME ZONE
);

-- Tour Leaders/Guides/Experts table
CREATE TABLE tour_leaders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    leader_type VARCHAR(20) CHECK (leader_type IN ('leader', 'expert', 'manager')) NOT NULL,
    display_name VARCHAR(255) NOT NULL,
    profile_image VARCHAR(500),
    location VARCHAR(255),
    country_code VARCHAR(2), -- ISO country code
    coordinates GEOGRAPHY(POINT, 4326), -- PostGIS point for location
    bio TEXT,
    experience_years INTEGER DEFAULT 0,
    price_per_day DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    availability_status VARCHAR(50),
    personality_traits JSONB, -- Array of personality traits
    
    -- Expert-specific fields
    follower_count INTEGER DEFAULT 0,
    video_count INTEGER DEFAULT 0,
    live_stream_count INTEGER DEFAULT 0,
    total_tours_conducted INTEGER DEFAULT 0,
    
    -- Verification and badges
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    is_featured BOOLEAN DEFAULT FALSE,
    is_top_creator BOOLEAN DEFAULT FALSE,
    is_rising_star BOOLEAN DEFAULT FALSE,
    is_top_rated BOOLEAN DEFAULT FALSE,
    is_new_joined BOOLEAN DEFAULT FALSE,
    is_live BOOLEAN DEFAULT FALSE,
    
    -- Settings
    is_active BOOLEAN DEFAULT TRUE,
    accepts_consultations BOOLEAN DEFAULT TRUE,
    consultation_price DECIMAL(10, 2),
    consultation_duration INTEGER DEFAULT 30, -- minutes
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Leader Languages (many-to-many)
CREATE TABLE leader_languages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leader_id UUID REFERENCES tour_leaders(id) ON DELETE CASCADE,
    language_code VARCHAR(10) NOT NULL,
    proficiency_level VARCHAR(20) CHECK (proficiency_level IN ('basic', 'conversational', 'fluent', 'native')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(leader_id, language_code)
);

-- Leader Specialties (many-to-many)
CREATE TABLE leader_specialties (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leader_id UUID REFERENCES tour_leaders(id) ON DELETE CASCADE,
    specialty_name VARCHAR(100) NOT NULL,
    years_experience INTEGER, -- Optional: NULL for experts who just list specialties
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(leader_id, specialty_name)
);

-- ============================================================================
-- DESTINATIONS
-- ============================================================================

CREATE TABLE destinations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    slug VARCHAR(100) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    country VARCHAR(255) NOT NULL,
    country_code VARCHAR(2) NOT NULL,
    region VARCHAR(100),
    coordinates GEOGRAPHY(POINT, 4326),
    timezone VARCHAR(50),
    image VARCHAR(500),
    gallery_images JSONB,
    description TEXT,
    highlights JSONB,
    guide_count INTEGER DEFAULT 0,
    tour_count INTEGER DEFAULT 0,
    average_tour_price DECIMAL(10, 2),
    popular_activities JSONB,
    best_months JSONB,
    climate_type VARCHAR(50),
    languages_spoken JSONB,
    currency_code VARCHAR(3),
    is_featured BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    search_rank INTEGER DEFAULT 0,
    tags JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- TOURS AND PACKAGES
-- ============================================================================

-- Tours table
CREATE TABLE tours (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leader_id UUID REFERENCES tour_leaders(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    detailed_description TEXT,
    cover_image VARCHAR(500),
    images JSONB, -- Array of image URLs
    
    -- Tour details
    duration_days INTEGER,
    duration_text VARCHAR(50), -- e.g., "3 days", "1 week"
    min_participants INTEGER DEFAULT 1,
    max_participants INTEGER,
    difficulty_level VARCHAR(20) CHECK (difficulty_level IN ('easy', 'moderate', 'challenging', 'extreme')),
    
    -- Pricing
    price_per_person DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    price_includes JSONB, -- Array of included items
    price_excludes JSONB, -- Array of excluded items
    
    -- Location
    destination VARCHAR(255),
    destination_id UUID REFERENCES destinations(id),
    country_code VARCHAR(2),
    starting_point VARCHAR(255),
    ending_point VARCHAR(255),
    coordinates GEOGRAPHY(POINT, 4326),
    
    -- Categories and tags
    category VARCHAR(50) CHECK (category IN ('adventure', 'cultural', 'relaxation', 'food', 'nature', 'urban', 'luxury')),
    tags JSONB, -- Array of tags
    
    -- Availability
    is_active BOOLEAN DEFAULT TRUE,
    is_featured BOOLEAN DEFAULT FALSE,
    available_from DATE,
    available_until DATE,
    blackout_dates JSONB, -- Array of date ranges
    
    -- Stats (denormalized for performance)
    total_bookings INTEGER DEFAULT 0,
    total_reviews INTEGER DEFAULT 0,
    average_rating DECIMAL(2, 1) DEFAULT 0.0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Tour Itinerary
CREATE TABLE tour_itinerary (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
    day_number INTEGER NOT NULL,
    title VARCHAR(255),
    description TEXT,
    activities JSONB, -- Array of activities
    meals_included JSONB, -- Array of meals (breakfast, lunch, dinner)
    accommodation_type VARCHAR(100),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tour_id, day_number)
);

-- Tour Schedule (specific dates)
CREATE TABLE tour_schedules (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    status VARCHAR(20) CHECK (status IN ('scheduled', 'confirmed', 'cancelled', 'completed')) DEFAULT 'scheduled',
    current_participants INTEGER DEFAULT 0,
    max_participants INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(tour_id, start_date)
);

-- ============================================================================
-- BOOKINGS AND CONSULTATIONS
-- ============================================================================

-- Bookings table
CREATE TABLE bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_type VARCHAR(20) CHECK (booking_type IN ('tour', 'consultation')) NOT NULL,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    tour_id UUID REFERENCES tours(id) ON DELETE SET NULL,
    tour_schedule_id UUID REFERENCES tour_schedules(id) ON DELETE SET NULL,
    leader_id UUID REFERENCES tour_leaders(id) ON DELETE SET NULL,
    
    -- Booking details
    booking_date TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    start_date DATE,
    end_date DATE,
    participant_count INTEGER DEFAULT 1,
    
    -- Consultation specific
    consultation_date DATE,
    consultation_time TIME,
    consultation_duration INTEGER, -- minutes
    consultation_notes TEXT,
    meeting_link VARCHAR(500),
    
    -- Pricing
    total_amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    discount_amount DECIMAL(10, 2) DEFAULT 0,
    promo_code VARCHAR(50),
    
    -- Status
    status VARCHAR(20) CHECK (status IN ('pending', 'confirmed', 'cancelled', 'completed', 'refunded')) DEFAULT 'pending',
    payment_status VARCHAR(20) CHECK (payment_status IN ('pending', 'paid', 'partial', 'refunded')) DEFAULT 'pending',
    cancellation_reason TEXT,
    cancelled_at TIMESTAMP WITH TIME ZONE,
    
    -- Guest information
    guest_details JSONB, -- Array of guest information if booking for others
    special_requests TEXT,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Payments table
CREATE TABLE payments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    booking_id UUID REFERENCES bookings(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE SET NULL,
    amount DECIMAL(10, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    payment_method VARCHAR(20) CHECK (payment_method IN ('card', 'paypal', 'bank_transfer', 'crypto')),
    payment_provider VARCHAR(50), -- stripe, paypal, etc.
    provider_payment_id VARCHAR(255), -- External payment ID
    status VARCHAR(20) CHECK (status IN ('pending', 'processing', 'succeeded', 'failed', 'refunded')),
    metadata JSONB, -- Additional payment information
    paid_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- REVIEWS AND RATINGS
-- ============================================================================

-- Reviews table
CREATE TABLE reviews (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    reviewer_id UUID REFERENCES users(id) ON DELETE SET NULL,
    reviewable_type VARCHAR(20) CHECK (reviewable_type IN ('tour', 'leader')) NOT NULL,
    tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
    leader_id UUID REFERENCES tour_leaders(id) ON DELETE CASCADE,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    
    rating INTEGER CHECK (rating >= 1 AND rating <= 5) NOT NULL,
    title VARCHAR(255),
    comment TEXT,
    
    -- Detailed ratings
    communication_rating INTEGER CHECK (communication_rating >= 1 AND communication_rating <= 5),
    knowledge_rating INTEGER CHECK (knowledge_rating >= 1 AND knowledge_rating <= 5),
    value_rating INTEGER CHECK (value_rating >= 1 AND value_rating <= 5),
    organization_rating INTEGER CHECK (organization_rating >= 1 AND organization_rating <= 5),
    
    -- Media
    images JSONB, -- Array of image URLs
    
    -- Interaction
    helpful_count INTEGER DEFAULT 0,
    response_from_owner TEXT,
    response_date TIMESTAMP WITH TIME ZONE,
    
    is_verified_booking BOOLEAN DEFAULT FALSE,
    is_featured BOOLEAN DEFAULT FALSE,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    
    CHECK (
        (reviewable_type = 'tour' AND tour_id IS NOT NULL AND leader_id IS NULL) OR
        (reviewable_type = 'leader' AND leader_id IS NOT NULL AND tour_id IS NULL)
    )
);

-- ============================================================================
-- LIVE STREAMS AND VIDEO CONTENT
-- ============================================================================

-- Live Streams table
CREATE TABLE live_streams (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leader_id UUID REFERENCES tour_leaders(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    stream_key VARCHAR(255) UNIQUE,
    stream_url VARCHAR(500),
    scheduled_start TIMESTAMP WITH TIME ZONE NOT NULL,
    scheduled_end TIMESTAMP WITH TIME ZONE,
    actual_start TIMESTAMP WITH TIME ZONE,
    actual_end TIMESTAMP WITH TIME ZONE,
    duration_minutes INTEGER,
    destination_id UUID REFERENCES destinations(id),
    location VARCHAR(255),
    tour_id UUID REFERENCES tours(id),
    stream_type VARCHAR(50) CHECK (stream_type IN ('tour_preview', 'live_tour', 'q&a', 'destination_guide', 'cultural_event', 'cooking', 'other')),
    tags JSONB,
    status VARCHAR(20) CHECK (status IN ('scheduled', 'live', 'ended', 'cancelled', 'error')) DEFAULT 'scheduled',
    is_featured BOOLEAN DEFAULT FALSE,
    visibility VARCHAR(20) CHECK (visibility IN ('public', 'followers_only', 'paid', 'private')) DEFAULT 'public',
    max_concurrent_viewers INTEGER DEFAULT 0,
    total_views INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    is_paid BOOLEAN DEFAULT FALSE,
    price DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    is_recorded BOOLEAN DEFAULT TRUE,
    recording_url VARCHAR(500),
    recording_available BOOLEAN DEFAULT FALSE,
    platform VARCHAR(50) DEFAULT 'internal',
    external_stream_id VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Videos table (for recorded content)
CREATE TABLE videos (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leader_id UUID REFERENCES tour_leaders(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    thumbnail_url VARCHAR(500),
    video_url VARCHAR(500) NOT NULL,
    duration_seconds INTEGER,
    destination_id UUID REFERENCES destinations(id),
    tour_id UUID REFERENCES tours(id),
    video_type VARCHAR(50) CHECK (video_type IN ('tour_highlight', 'destination_guide', 'tutorial', 'review', 'vlog', 'promotional', 'testimonial', 'other')),
    tags JSONB,
    source_type VARCHAR(20) CHECK (source_type IN ('uploaded', 'live_stream_recording', 'external')),
    live_stream_id UUID REFERENCES live_streams(id),
    status VARCHAR(20) CHECK (status IN ('processing', 'published', 'unlisted', 'private', 'deleted')) DEFAULT 'processing',
    is_featured BOOLEAN DEFAULT FALSE,
    visibility VARCHAR(20) CHECK (visibility IN ('public', 'followers_only', 'paid', 'private')) DEFAULT 'public',
    view_count INTEGER DEFAULT 0,
    likes_count INTEGER DEFAULT 0,
    comments_count INTEGER DEFAULT 0,
    shares_count INTEGER DEFAULT 0,
    watch_time_minutes INTEGER DEFAULT 0,
    average_watch_percentage DECIMAL(5, 2),
    is_paid BOOLEAN DEFAULT FALSE,
    price DECIMAL(10, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Stream viewers tracking
CREATE TABLE stream_viewers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    joined_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    left_at TIMESTAMP WITH TIME ZONE,
    watch_duration_seconds INTEGER,
    liked BOOLEAN DEFAULT FALSE,
    shared BOOLEAN DEFAULT FALSE,
    commented BOOLEAN DEFAULT FALSE,
    access_type VARCHAR(20) CHECK (access_type IN ('free', 'paid', 'follower', 'invited')),
    UNIQUE(stream_id, user_id)
);

-- Stream comments (real-time chat)
CREATE TABLE stream_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    stream_id UUID REFERENCES live_streams(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    timestamp_seconds INTEGER,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_hidden BOOLEAN DEFAULT FALSE,
    is_moderator BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Video comments
CREATE TABLE video_comments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    video_id UUID REFERENCES videos(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    parent_comment_id UUID REFERENCES video_comments(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    timestamp_seconds INTEGER,
    is_pinned BOOLEAN DEFAULT FALSE,
    is_hidden BOOLEAN DEFAULT FALSE,
    is_hearted BOOLEAN DEFAULT FALSE,
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- PERSONALITY AND MATCHING
-- ============================================================================

-- Personality Types
CREATE TABLE personality_types (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type_name VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    icon VARCHAR(50),
    traits JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- User Quiz Results
CREATE TABLE user_quiz_results (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    personality_type_id UUID REFERENCES personality_types(id) ON DELETE SET NULL,
    quiz_answers JSONB,
    result_traits JSONB,
    completed_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    is_current BOOLEAN DEFAULT TRUE
);

-- Personality Matching Scores (cached for performance)
CREATE TABLE personality_match_scores (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    leader_id UUID REFERENCES tour_leaders(id) ON DELETE CASCADE,
    match_percentage INTEGER CHECK (match_percentage >= 0 AND match_percentage <= 100),
    matching_traits JSONB,
    calculated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, leader_id)
);

-- ============================================================================
-- CERTIFICATIONS AND CREDENTIALS
-- ============================================================================

CREATE TABLE certifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    leader_id UUID REFERENCES tour_leaders(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    issuer VARCHAR(255) NOT NULL,
    issue_date DATE,
    expiry_date DATE,
    certificate_number VARCHAR(100),
    icon_type VARCHAR(20) CHECK (icon_type IN ('award', 'shield', 'check')),
    is_verified BOOLEAN DEFAULT FALSE,
    verified_at TIMESTAMP WITH TIME ZONE,
    verification_notes TEXT,
    document_url VARCHAR(500),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- CONTENT AND STORIES
-- ============================================================================

CREATE TABLE travel_stories (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    author_id UUID REFERENCES users(id) ON DELETE SET NULL,
    tour_id UUID REFERENCES tours(id) ON DELETE SET NULL,
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    location VARCHAR(255),
    story_date DATE,
    cover_image VARCHAR(500),
    content TEXT NOT NULL,
    excerpt TEXT,
    tags JSONB,
    personality_traits JSONB,
    view_count INTEGER DEFAULT 0,
    like_count INTEGER DEFAULT 0,
    share_count INTEGER DEFAULT 0,
    status VARCHAR(20) CHECK (status IN ('draft', 'published', 'archived')) DEFAULT 'draft',
    is_featured BOOLEAN DEFAULT FALSE,
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE story_likes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    story_id UUID REFERENCES travel_stories(id) ON DELETE CASCADE,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(story_id, user_id)
);

-- ============================================================================
-- MESSAGES AND NOTIFICATIONS
-- ============================================================================

CREATE TABLE messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    sender_id UUID REFERENCES users(id) ON DELETE SET NULL,
    recipient_id UUID REFERENCES users(id) ON DELETE SET NULL,
    leader_recipient_id UUID REFERENCES tour_leaders(id) ON DELETE SET NULL,
    booking_id UUID REFERENCES bookings(id) ON DELETE SET NULL,
    subject VARCHAR(255),
    content TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    parent_message_id UUID REFERENCES messages(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE notifications (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT,
    data JSONB,
    is_read BOOLEAN DEFAULT FALSE,
    read_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- FAVORITES AND WISHLISTS
-- ============================================================================

CREATE TABLE user_favorites (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    favoritable_type VARCHAR(20) CHECK (favoritable_type IN ('tour', 'leader', 'story')) NOT NULL,
    tour_id UUID REFERENCES tours(id) ON DELETE CASCADE,
    leader_id UUID REFERENCES tour_leaders(id) ON DELETE CASCADE,
    story_id UUID REFERENCES travel_stories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(user_id, tour_id),
    UNIQUE(user_id, leader_id),
    UNIQUE(user_id, story_id)
);

-- ============================================================================
-- SEARCH AND DISCOVERY
-- ============================================================================

CREATE TABLE search_history (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    search_query TEXT,
    search_type VARCHAR(20),
    filters JSONB,
    results_count INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE popular_searches (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    search_term VARCHAR(255) UNIQUE NOT NULL,
    search_type VARCHAR(20),
    search_count INTEGER DEFAULT 1,
    last_searched TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- ADMIN AND SYSTEM
-- ============================================================================

CREATE TABLE invitation_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(20) UNIQUE NOT NULL,
    created_by UUID REFERENCES users(id) ON DELETE SET NULL,
    max_uses INTEGER DEFAULT 1,
    uses_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE promo_codes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    code VARCHAR(50) UNIQUE NOT NULL,
    description TEXT,
    discount_type VARCHAR(20) CHECK (discount_type IN ('percentage', 'fixed')) NOT NULL,
    discount_value DECIMAL(10, 2) NOT NULL,
    minimum_amount DECIMAL(10, 2),
    max_uses INTEGER,
    uses_count INTEGER DEFAULT 0,
    valid_from TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    valid_until TIMESTAMP WITH TIME ZONE,
    applicable_to VARCHAR(20) CHECK (applicable_to IN ('all', 'tours', 'consultations')),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ============================================================================
-- INDEXES FOR PERFORMANCE
-- ============================================================================

-- Users indexes
CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_username ON users(username);
CREATE INDEX idx_users_active ON users(is_active) WHERE is_active = TRUE;

-- Tour Leaders indexes
CREATE INDEX idx_tour_leaders_user_id ON tour_leaders(user_id);
CREATE INDEX idx_tour_leaders_location ON tour_leaders(location);
CREATE INDEX idx_tour_leaders_verified ON tour_leaders(is_verified) WHERE is_verified = TRUE;
CREATE INDEX idx_tour_leaders_coordinates ON tour_leaders USING GIST(coordinates);
CREATE INDEX idx_tour_leaders_leader_type ON tour_leaders(leader_type);

-- Tours indexes
CREATE INDEX idx_tours_leader_id ON tours(leader_id);
CREATE INDEX idx_tours_destination ON tours(destination);
CREATE INDEX idx_tours_category ON tours(category);
CREATE INDEX idx_tours_active ON tours(is_active) WHERE is_active = TRUE;
CREATE INDEX idx_tours_coordinates ON tours USING GIST(coordinates);
CREATE INDEX idx_tours_slug ON tours(slug);
CREATE INDEX idx_tours_destination_id ON tours(destination_id);

-- Bookings indexes
CREATE INDEX idx_bookings_user_id ON bookings(user_id);
CREATE INDEX idx_bookings_tour_id ON bookings(tour_id);
CREATE INDEX idx_bookings_leader_id ON bookings(leader_id);
CREATE INDEX idx_bookings_status ON bookings(status);
CREATE INDEX idx_bookings_start_date ON bookings(start_date);
CREATE INDEX idx_bookings_type ON bookings(booking_type);

-- Reviews indexes
CREATE INDEX idx_reviews_tour_id ON reviews(tour_id);
CREATE INDEX idx_reviews_leader_id ON reviews(leader_id);
CREATE INDEX idx_reviews_reviewer_id ON reviews(reviewer_id);
CREATE INDEX idx_reviews_rating ON reviews(rating);

-- Messages indexes
CREATE INDEX idx_messages_sender_id ON messages(sender_id);
CREATE INDEX idx_messages_recipient_id ON messages(recipient_id);
CREATE INDEX idx_messages_unread ON messages(is_read) WHERE is_read = FALSE;

-- Travel Stories indexes
CREATE INDEX idx_stories_author_id ON travel_stories(author_id);
CREATE INDEX idx_stories_status ON travel_stories(status);
CREATE INDEX idx_stories_slug ON travel_stories(slug);

-- Destinations indexes
CREATE INDEX idx_destinations_slug ON destinations(slug);
CREATE INDEX idx_destinations_country_code ON destinations(country_code);
CREATE INDEX idx_destinations_coordinates ON destinations USING GIST(coordinates);
CREATE INDEX idx_destinations_featured ON destinations(is_featured) WHERE is_featured = TRUE;

-- Live streams indexes
CREATE INDEX idx_live_streams_leader_id ON live_streams(leader_id);
CREATE INDEX idx_live_streams_scheduled_start ON live_streams(scheduled_start);
CREATE INDEX idx_live_streams_status ON live_streams(status);
CREATE INDEX idx_live_streams_featured ON live_streams(is_featured) WHERE is_featured = TRUE;

-- Videos indexes
CREATE INDEX idx_videos_leader_id ON videos(leader_id);
CREATE INDEX idx_videos_status ON videos(status);
CREATE INDEX idx_videos_featured ON videos(is_featured) WHERE is_featured = TRUE;
CREATE INDEX idx_videos_view_count ON videos(view_count);

-- Comments and viewers indexes
CREATE INDEX idx_stream_viewers_stream_id ON stream_viewers(stream_id);
CREATE INDEX idx_stream_viewers_user_id ON stream_viewers(user_id);
CREATE INDEX idx_stream_comments_stream_id ON stream_comments(stream_id);
CREATE INDEX idx_video_comments_video_id ON video_comments(video_id);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT
-- ============================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_users_updated_at BEFORE UPDATE ON users
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tour_leaders_updated_at BEFORE UPDATE ON tour_leaders
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_tours_updated_at BEFORE UPDATE ON tours
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_bookings_updated_at BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_reviews_updated_at BEFORE UPDATE ON reviews
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_travel_stories_updated_at BEFORE UPDATE ON travel_stories
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_certifications_updated_at BEFORE UPDATE ON certifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_destinations_updated_at BEFORE UPDATE ON destinations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_live_streams_updated_at BEFORE UPDATE ON live_streams
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_videos_updated_at BEFORE UPDATE ON videos
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- FUNCTION TO UPDATE DENORMALIZED STATS
-- ============================================================================

-- Update tour stats after review
CREATE OR REPLACE FUNCTION update_tour_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        -- Only update if this is a tour review
        IF NEW.reviewable_type = 'tour' AND NEW.tour_id IS NOT NULL THEN
            UPDATE tours
            SET total_reviews = (SELECT COUNT(*) FROM reviews WHERE tour_id = NEW.tour_id),
                average_rating = (SELECT AVG(rating) FROM reviews WHERE tour_id = NEW.tour_id)
            WHERE id = NEW.tour_id;
        END IF;
    ELSIF TG_OP = 'DELETE' THEN
        -- Only update if this was a tour review
        IF OLD.reviewable_type = 'tour' AND OLD.tour_id IS NOT NULL THEN
            UPDATE tours
            SET total_reviews = (SELECT COUNT(*) FROM reviews WHERE tour_id = OLD.tour_id),
                average_rating = COALESCE((SELECT AVG(rating) FROM reviews WHERE tour_id = OLD.tour_id), 0)
            WHERE id = OLD.tour_id;
        END IF;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_tour_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_tour_stats();

-- Update tour leader video/stream counts
CREATE OR REPLACE FUNCTION update_leader_content_counts()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_TABLE_NAME = 'videos' THEN
        UPDATE tour_leaders
        SET video_count = (SELECT COUNT(*) FROM videos WHERE leader_id = COALESCE(NEW.leader_id, OLD.leader_id) AND status = 'published')
        WHERE id = COALESCE(NEW.leader_id, OLD.leader_id);
    ELSIF TG_TABLE_NAME = 'live_streams' THEN
        UPDATE tour_leaders
        SET live_stream_count = (SELECT COUNT(*) FROM live_streams WHERE leader_id = COALESCE(NEW.leader_id, OLD.leader_id) AND status = 'ended')
        WHERE id = COALESCE(NEW.leader_id, OLD.leader_id);
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_leader_video_count
AFTER INSERT OR UPDATE OR DELETE ON videos
FOR EACH ROW
EXECUTE FUNCTION update_leader_content_counts();

CREATE TRIGGER update_leader_stream_count
AFTER INSERT OR UPDATE OR DELETE ON live_streams
FOR EACH ROW
EXECUTE FUNCTION update_leader_content_counts();

-- Update destination stats when tours are added/removed
CREATE OR REPLACE FUNCTION update_destination_stats()
RETURNS TRIGGER AS $$
BEGIN
    IF TG_OP = 'INSERT' OR TG_OP = 'UPDATE' THEN
        UPDATE destinations 
        SET tour_count = (SELECT COUNT(*) FROM tours WHERE destination_id = NEW.destination_id)
        WHERE id = NEW.destination_id;
    ELSIF TG_OP = 'DELETE' THEN
        UPDATE destinations 
        SET tour_count = (SELECT COUNT(*) FROM tours WHERE destination_id = OLD.destination_id)
        WHERE id = OLD.destination_id;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_destination_stats_trigger
AFTER INSERT OR UPDATE OR DELETE ON tours
FOR EACH ROW
EXECUTE FUNCTION update_destination_stats();

-- ============================================================================
-- SAMPLE DATA
-- ============================================================================

-- Insert default personality types
INSERT INTO personality_types (type_name, description, icon, traits) VALUES
('Explorer', 'Adventurous spirits who seek off-the-beaten-path experiences', '🧭', '["adventurous", "curious", "spontaneous", "independent"]'),
('Cultural Enthusiast', 'Passionate about history, art, and local traditions', '🎭', '["cultured", "intellectual", "observant", "respectful"]'),
('Relaxation Seeker', 'Focused on wellness, comfort, and rejuvenation', '🧘', '["calm", "mindful", "comfort-seeking", "peaceful"]'),
('Foodie', 'Culinary adventurers who explore through taste', '🍜', '["gastronomic", "experimental", "social", "sensory"]'),
('Social Butterfly', 'Thrives in group settings and loves meeting new people', '🦋', '["social", "outgoing", "friendly", "collaborative"]'),
('Nature Lover', 'Drawn to natural beauty and outdoor experiences', '🌿', '["outdoorsy", "eco-conscious", "active", "appreciative"]');

-- Insert sample users
INSERT INTO users (id, email, password_hash, username, first_name, last_name, profile_image, travel_style, interests, budget_preference, email_verified, is_active, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'michael.thompson@email.com', '$2b$10$YourHashHere', 'michaelt', 'Michael', 'Thompson', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80', '["adventure", "cultural"]', '["hiking", "photography", "history"]', 'mid-range', true, true, NOW() - INTERVAL '6 months'),
('550e8400-e29b-41d4-a716-446655440002', 'jessica.lee@email.com', '$2b$10$YourHashHere', 'jessical', 'Jessica', 'Lee', 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80', '["relaxation", "foodie"]', '["yoga", "cooking", "beaches"]', 'luxury', true, true, NOW() - INTERVAL '4 months'),
('550e8400-e29b-41d4-a716-446655440003', 'david.kim@email.com', '$2b$10$YourHashHere', 'davidk', 'David', 'Kim', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80', '["adventure", "nature"]', '["camping", "wildlife", "photography"]', 'budget', true, true, NOW() - INTERVAL '8 months'),
('550e8400-e29b-41d4-a716-446655440004', 'admin@ottertrip.com', '$2b$10$YourHashHere', 'admin', 'Admin', 'User', NULL, '["all"]', '["all"]', 'mid-range', true, true, NOW() - INTERVAL '1 year');

-- Insert sample tour leaders
INSERT INTO tour_leaders (id, user_id, leader_type, display_name, profile_image, location, country_code, bio, experience_years, price_per_day, currency, availability_status, personality_traits, follower_count, video_count, live_stream_count, total_tours_conducted, is_verified, is_featured, is_active, accepts_consultations, consultation_price, created_at) VALUES
-- Featured Leaders
('550e8400-e29b-41d4-a716-446655440101', NULL, 'leader', 'Sarah Johnson', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', 'Bali, Indonesia', 'ID', 'Experienced adventure guide specializing in photography tours and cultural experiences in Bali.', 7, 85, 'USD', '3 spots left', '["adventurous", "creative", "friendly"]', 450, 0, 0, 127, true, true, true, true, 50, NOW() - INTERVAL '2 years'),
('550e8400-e29b-41d4-a716-446655440102', NULL, 'leader', 'Miguel Santos', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', 'Mexico City, Mexico', 'MX', 'Food historian and cultural expert offering immersive culinary and historical tours of Mexico City.', 10, 75, 'USD', 'Small group - 6 max', '["intellectual", "passionate", "social"]', 380, 0, 0, 94, true, true, true, true, 45, NOW() - INTERVAL '3 years'),
('550e8400-e29b-41d4-a716-446655440103', NULL, 'leader', 'Aisha Patel', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', 'Marrakech, Morocco', 'MA', 'Cultural ambassador specializing in authentic Moroccan experiences, from souks to sahara.', 8, 65, 'USD', '10 seats available', '["cultural", "warm", "knowledgeable"]', 520, 0, 0, 108, true, true, true, true, 40, NOW() - INTERVAL '2.5 years'),
('550e8400-e29b-41d4-a716-446655440104', NULL, 'leader', 'Liam Chen', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', 'Kyoto, Japan', 'JP', 'Multilingual guide offering deep cultural insights into traditional and modern Japan.', 12, 90, 'USD', 'Last 2 spots!', '["meticulous", "cultured", "patient"]', 680, 0, 0, 156, true, true, true, true, 60, NOW() - INTERVAL '4 years'),

-- Experts
('550e8400-e29b-41d4-a716-446655440201', NULL, 'expert', 'Sarah Chen', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80', 'Singapore', 'SG', 'Digital nomad and content creator specializing in Southeast Asian cultural and food experiences.', 8, 100, 'USD', 'Available', '["creative", "social", "enthusiastic"]', 2300, 45, 12, 8, true, false, true, true, 75, NOW() - INTERVAL '3 years'),
('550e8400-e29b-41d4-a716-446655440202', NULL, 'expert', 'Marco Rodriguez', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80', 'Barcelona', 'ES', 'Adventure sports enthusiast and historical guide with deep knowledge of Catalonian culture.', 12, 120, 'USD', 'Available', '["adventurous", "energetic", "knowledgeable"]', 2500, 62, 18, 15, true, false, true, true, 80, NOW() - INTERVAL '5 years'),
('550e8400-e29b-41d4-a716-446655440203', NULL, 'expert', 'Yuki Tanaka', 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80', 'Tokyo', 'JP', 'Tokyo insider sharing hidden gems and contemporary culture through unique local experiences.', 6, 95, 'USD', 'Available', '["trendy", "friendly", "detail-oriented"]', 1800, 38, 5, 12, true, false, true, true, 65, NOW() - INTERVAL '2 years'),
('550e8400-e29b-41d4-a716-446655440204', NULL, 'expert', 'David Thompson', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80', 'London', 'GB', 'Historian and architecture expert with 15 years guiding experience across Europe.', 15, 150, 'USD', 'Available', '["intellectual", "articulate", "passionate"]', 3100, 78, 22, 31, true, false, true, true, 100, NOW() - INTERVAL '7 years'),
('550e8400-e29b-41d4-a716-446655440205', NULL, 'expert', 'Priya Sharma', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80', 'Mumbai', 'IN', 'Spiritual guide and heritage expert offering transformative journeys through India.', 10, 80, 'USD', 'Available', '["spiritual", "wise", "compassionate"]', 1650, 42, 9, 14, true, false, true, true, 55, NOW() - INTERVAL '4 years'),
('550e8400-e29b-41d4-a716-446655440206', NULL, 'expert', 'Ahmed Hassan', 'https://images.unsplash.com/photo-1566492031773-4f4e44671857?ixlib=rb-4.0.3&auto=format&fit=crop&w=256&q=80', 'Cairo', 'EG', 'Egyptologist and desert expedition leader with 20 years of archaeological experience.', 20, 130, 'USD', 'Available', '["scholarly", "adventurous", "storyteller"]', 2800, 56, 14, 28, true, false, true, true, 90, NOW() - INTERVAL '10 years'),

-- Regular guides
('550e8400-e29b-41d4-a716-446655440301', NULL, 'leader', 'James Wilson', 'https://images.unsplash.com/photo-1568602471122-7832951cc4c5?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80', 'Arizona, USA', 'US', 'Certified wilderness guide with over 8 years of experience leading tours in the Grand Canyon.', 8, 200, 'USD', 'Available', '["adventurous", "knowledgeable", "safety-conscious"]', 890, 0, 0, 186, true, false, true, true, 100, NOW() - INTERVAL '8 years'),
('550e8400-e29b-41d4-a716-446655440302', NULL, 'leader', 'Lukas Meyer', 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-4.0.3&auto=format&fit=crop&w=128&q=80', 'Interlaken, Switzerland', 'CH', 'Born and raised in the Bernese Oberland, certified mountain guide with passion for the Swiss Alps.', 10, 250, 'USD', 'Available', '["professional", "local", "experienced"]', 1200, 0, 0, 234, true, false, true, true, 120, NOW() - INTERVAL '10 years');

-- Update special badges
UPDATE tour_leaders SET is_top_creator = true WHERE id IN ('550e8400-e29b-41d4-a716-446655440202', '550e8400-e29b-41d4-a716-446655440204');
UPDATE tour_leaders SET is_rising_star = true WHERE id = '550e8400-e29b-41d4-a716-446655440205';

-- Insert destinations
INSERT INTO destinations (slug, name, country, country_code, image, description, guide_count, is_featured, is_active, search_rank) VALUES
('bali', 'Bali', 'Indonesia', 'ID', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', 'Tropical paradise known for its beaches, temples, and vibrant culture.', 48, true, true, 100),
('kyoto', 'Kyoto', 'Japan', 'JP', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', 'Ancient capital of Japan, home to thousands of temples and gardens.', 32, true, true, 95),
('barcelona', 'Barcelona', 'Spain', 'ES', 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', 'Vibrant Mediterranean city famous for Gaudí architecture.', 56, true, true, 90),
('cape-town', 'Cape Town', 'South Africa', 'ZA', 'https://images.unsplash.com/photo-1580060839134-75a5edca2e99?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', 'Stunning coastal city with Table Mountain and beautiful beaches.', 29, true, true, 85),
('new-york', 'New York', 'United States', 'US', 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', 'The city that never sleeps - iconic skyline and endless entertainment.', 67, true, true, 100),
('marrakech', 'Marrakech', 'Morocco', 'MA', 'https://images.unsplash.com/photo-1597212618440-806262de4f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', 'Enchanting city of souks, palaces, and gardens.', 41, true, true, 80),
('arizona', 'Arizona', 'United States', 'US', 'https://images.unsplash.com/photo-1615551043360-33de8b5f410c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', 'Home to the Grand Canyon and stunning desert landscapes.', 25, false, true, 70),
('interlaken', 'Interlaken', 'Switzerland', 'CH', 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', 'Alpine paradise nestled between two lakes.', 18, false, true, 75),
('mexico-city', 'Mexico City', 'Mexico', 'MX', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', 'Vibrant capital with rich history and incredible food.', 35, false, true, 70),
('singapore', 'Singapore', 'Singapore', 'SG', NULL, 'Modern city-state with incredible food and architecture.', 22, false, true, 65),
('cairo', 'Cairo', 'Egypt', 'EG', NULL, 'Ancient city home to the Pyramids of Giza.', 28, false, true, 60),
('london', 'London', 'United Kingdom', 'GB', NULL, 'Historic capital with royal palaces and world-class museums.', 45, false, true, 85),
('mumbai', 'Mumbai', 'India', 'IN', NULL, 'India''s bustling financial capital.', 31, false, true, 55),
('sydney', 'Sydney', 'Australia', 'AU', NULL, 'Harbor city with iconic Opera House.', 38, false, true, 75),
('rio-de-janeiro', 'Rio de Janeiro', 'Brazil', 'BR', NULL, 'Vibrant beach city famous for Carnival.', 42, false, true, 70),
('buenos-aires', 'Buenos Aires', 'Argentina', 'AR', NULL, 'Paris of South America with tango and steak.', 26, false, true, 55),
('tokyo', 'Tokyo', 'Japan', 'JP', NULL, 'Modern metropolis blending tradition with innovation.', 45, false, true, 90);

-- Insert tours
INSERT INTO tours (id, leader_id, title, slug, description, detailed_description, cover_image, duration_days, duration_text, min_participants, max_participants, difficulty_level, price_per_person, currency, destination, destination_id, country_code, starting_point, category, is_active, is_featured, average_rating, total_reviews, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440301', 'Grand Canyon Adventure', 'grand-canyon', 'Experience the majestic Grand Canyon with our 3-day guided adventure tour', 'Experience the majestic Grand Canyon like never before with our 3-day guided adventure tour.', 'https://images.unsplash.com/photo-1615551043360-33de8b5f410c?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', 3, '3 days', 1, 8, 'moderate', 1600, 'USD', 'Arizona, USA', (SELECT id FROM destinations WHERE slug = 'arizona'), 'US', 'Grand Canyon Visitor Center', 'adventure', true, true, 4.9, 108, NOW() - INTERVAL '1 year'),
('550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440302', 'Swiss Alps Adventure', 'swiss-alps', 'Immerse yourself in the breathtaking beauty of the Swiss Alps', 'Immerse yourself in the breathtaking beauty of the Swiss Alps with our 5-day adventure tour.', 'https://images.unsplash.com/photo-1528127269322-539801943592?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80', 5, '5 days', 2, 12, 'moderate', 2400, 'USD', 'Interlaken, Switzerland', (SELECT id FROM destinations WHERE slug = 'interlaken'), 'CH', 'Interlaken', 'adventure', true, true, 4.8, 86, NOW() - INTERVAL '8 months'),
('550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440101', 'Bali Cultural Immersion', 'bali-cultural', 'Discover the rich culture and traditions of Bali', 'Immerse yourself in the spiritual and cultural heart of Bali.', 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', 7, '7 days', 2, 10, 'easy', 1200, 'USD', 'Bali, Indonesia', (SELECT id FROM destinations WHERE slug = 'bali'), 'ID', 'Denpasar', 'cultural', true, false, 4.9, 127, NOW() - INTERVAL '6 months'),
('550e8400-e29b-41d4-a716-446655440404', '550e8400-e29b-41d4-a716-446655440102', 'Mexico City Culinary Journey', 'mexico-food', 'Taste your way through Mexico City''s vibrant food scene', 'Embark on a gastronomic adventure through Mexico City.', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', 4, '4 days', 2, 6, 'easy', 800, 'USD', 'Mexico City, Mexico', (SELECT id FROM destinations WHERE slug = 'mexico-city'), 'MX', 'Historic Center', 'food', true, false, 4.8, 94, NOW() - INTERVAL '5 months'),
('550e8400-e29b-41d4-a716-446655440405', '550e8400-e29b-41d4-a716-446655440104', 'Kyoto Heritage Discovery', 'kyoto-heritage', 'Explore ancient temples and traditional culture in Kyoto', 'Journey through time in Japan''s cultural capital.', 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', 5, '5 days', 2, 8, 'easy', 1500, 'USD', 'Kyoto, Japan', (SELECT id FROM destinations WHERE slug = 'kyoto'), 'JP', 'Kyoto Station', 'cultural', true, true, 4.9, 156, NOW() - INTERVAL '4 months'),
('550e8400-e29b-41d4-a716-446655440406', '550e8400-e29b-41d4-a716-446655440103', 'Sahara Desert Adventure', 'sahara-desert', 'Experience the magic of the Sahara Desert', 'Journey from Marrakech to the Sahara Desert.', 'https://images.unsplash.com/photo-1597212618440-806262de4f6a?ixlib=rb-4.0.3&auto=format&fit=crop&w=1024&q=80', 3, '3 days', 4, 12, 'moderate', 650, 'USD', 'Marrakech, Morocco', (SELECT id FROM destinations WHERE slug = 'marrakech'), 'MA', 'Marrakech', 'adventure', true, false, 4.7, 108, NOW() - INTERVAL '7 months');

-- Insert leader languages
INSERT INTO leader_languages (leader_id, language_code, proficiency_level) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'en', 'native'),
('550e8400-e29b-41d4-a716-446655440101', 'id', 'fluent'),
('550e8400-e29b-41d4-a716-446655440102', 'es', 'native'),
('550e8400-e29b-41d4-a716-446655440102', 'en', 'fluent'),
('550e8400-e29b-41d4-a716-446655440103', 'ar', 'native'),
('550e8400-e29b-41d4-a716-446655440103', 'fr', 'fluent'),
('550e8400-e29b-41d4-a716-446655440103', 'en', 'fluent'),
('550e8400-e29b-41d4-a716-446655440104', 'en', 'native'),
('550e8400-e29b-41d4-a716-446655440104', 'ja', 'native'),
('550e8400-e29b-41d4-a716-446655440104', 'zh', 'conversational'),
('550e8400-e29b-41d4-a716-446655440201', 'en', 'native'),
('550e8400-e29b-41d4-a716-446655440201', 'zh', 'native'),
('550e8400-e29b-41d4-a716-446655440202', 'es', 'native'),
('550e8400-e29b-41d4-a716-446655440202', 'en', 'fluent'),
('550e8400-e29b-41d4-a716-446655440203', 'ja', 'native'),
('550e8400-e29b-41d4-a716-446655440203', 'en', 'fluent'),
('550e8400-e29b-41d4-a716-446655440204', 'en', 'native'),
('550e8400-e29b-41d4-a716-446655440301', 'en', 'native'),
('550e8400-e29b-41d4-a716-446655440302', 'de', 'native'),
('550e8400-e29b-41d4-a716-446655440302', 'en', 'fluent'),
('550e8400-e29b-41d4-a716-446655440302', 'fr', 'conversational'),
('550e8400-e29b-41d4-a716-446655440302', 'it', 'basic');

-- Insert leader specialties
INSERT INTO leader_specialties (leader_id, specialty_name, years_experience) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'Photography Tours', 5),
('550e8400-e29b-41d4-a716-446655440101', 'Cultural Experiences', 7),
('550e8400-e29b-41d4-a716-446655440101', 'Adventure Travel', 6),
('550e8400-e29b-41d4-a716-446655440102', 'Food History', 10),
('550e8400-e29b-41d4-a716-446655440102', 'Culinary Tours', 8),
('550e8400-e29b-41d4-a716-446655440102', 'Historical Sites', 9),
('550e8400-e29b-41d4-a716-446655440103', 'Desert Expeditions', 8),
('550e8400-e29b-41d4-a716-446655440103', 'Berber Culture', 6),
('550e8400-e29b-41d4-a716-446655440103', 'Souk Navigation', 8),
('550e8400-e29b-41d4-a716-446655440104', 'Temple Tours', 10),
('550e8400-e29b-41d4-a716-446655440104', 'Tea Ceremonies', 8),
('550e8400-e29b-41d4-a716-446655440104', 'Japanese Culture', 12),
('550e8400-e29b-41d4-a716-446655440201', 'Street Food', NULL),
('550e8400-e29b-41d4-a716-446655440201', 'Content Creation', NULL),
('550e8400-e29b-41d4-a716-446655440201', 'Southeast Asian Culture', NULL),
('550e8400-e29b-41d4-a716-446655440202', 'Adventure Sports', NULL),
('550e8400-e29b-41d4-a716-446655440202', 'Historical Tours', NULL),
('550e8400-e29b-41d4-a716-446655440202', 'Catalonian Culture', NULL),
('550e8400-e29b-41d4-a716-446655440203', 'Hidden Gems', NULL),
('550e8400-e29b-41d4-a716-446655440203', 'Contemporary Culture', NULL),
('550e8400-e29b-41d4-a716-446655440203', 'Local Experiences', NULL),
('550e8400-e29b-41d4-a716-446655440204', 'Architecture', NULL),
('550e8400-e29b-41d4-a716-446655440204', 'European History', NULL),
('550e8400-e29b-41d4-a716-446655440204', 'Museum Tours', NULL),
('550e8400-e29b-41d4-a716-446655440205', 'Spiritual Journeys', NULL),
('550e8400-e29b-41d4-a716-446655440205', 'Heritage Sites', NULL),
('550e8400-e29b-41d4-a716-446655440205', 'Indian Culture', NULL),
('550e8400-e29b-41d4-a716-446655440206', 'Egyptology', NULL),
('550e8400-e29b-41d4-a716-446655440206', 'Desert Expeditions', NULL),
('550e8400-e29b-41d4-a716-446655440206', 'Archaeological Tours', NULL),
('550e8400-e29b-41d4-a716-446655440301', 'Wilderness Survival', 8),
('550e8400-e29b-41d4-a716-446655440301', 'Geology', 6),
('550e8400-e29b-41d4-a716-446655440301', 'Canyon Hiking', 8),
('550e8400-e29b-41d4-a716-446655440302', 'Mountain Climbing', 10),
('550e8400-e29b-41d4-a716-446655440302', 'Alpine Sports', 9);

-- Insert certifications
INSERT INTO certifications (leader_id, name, issuer, issue_date, icon_type, is_verified) VALUES
('550e8400-e29b-41d4-a716-446655440101', 'Certified Tour Guide', 'Indonesian Tourism Board', '2019-03-15', 'shield', true),
('550e8400-e29b-41d4-a716-446655440101', 'First Aid & CPR', 'Red Cross Indonesia', '2023-01-10', 'check', true),
('550e8400-e29b-41d4-a716-446655440301', 'Wilderness First Responder', 'NOLS', '2022-06-20', 'shield', true),
('550e8400-e29b-41d4-a716-446655440301', 'Leave No Trace Trainer', 'Leave No Trace Center', '2021-09-15', 'award', true),
('550e8400-e29b-41d4-a716-446655440302', 'Mountain Guide Certification', 'Swiss Alpine Club', '2018-07-01', 'shield', true),
('550e8400-e29b-41d4-a716-446655440302', 'Avalanche Safety Level 3', 'Swiss Avalanche Institute', '2023-02-15', 'check', true);

-- Insert bookings
INSERT INTO bookings (user_id, booking_type, tour_id, leader_id, start_date, end_date, participant_count, total_amount, currency, status, payment_status, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440001', 'tour', '550e8400-e29b-41d4-a716-446655440401', '550e8400-e29b-41d4-a716-446655440301', NOW() + INTERVAL '1 month', NOW() + INTERVAL '1 month 3 days', 2, 3200, 'USD', 'confirmed', 'paid', NOW() - INTERVAL '2 weeks'),
('550e8400-e29b-41d4-a716-446655440002', 'tour', '550e8400-e29b-41d4-a716-446655440403', '550e8400-e29b-41d4-a716-446655440101', NOW() + INTERVAL '2 months', NOW() + INTERVAL '2 months 7 days', 1, 1200, 'USD', 'confirmed', 'paid', NOW() - INTERVAL '1 week'),
('550e8400-e29b-41d4-a716-446655440001', 'consultation', NULL, '550e8400-e29b-41d4-a716-446655440104', NOW() + INTERVAL '5 days', NOW() + INTERVAL '5 days', 1, 60, 'USD', 'confirmed', 'paid', NOW() - INTERVAL '3 days'),
('550e8400-e29b-41d4-a716-446655440003', 'tour', '550e8400-e29b-41d4-a716-446655440405', '550e8400-e29b-41d4-a716-446655440104', NOW() - INTERVAL '1 month', NOW() - INTERVAL '1 month' + INTERVAL '5 days', 2, 3000, 'USD', 'completed', 'paid', NOW() - INTERVAL '2 months'),
('550e8400-e29b-41d4-a716-446655440001', 'tour', '550e8400-e29b-41d4-a716-446655440402', '550e8400-e29b-41d4-a716-446655440302', NOW() - INTERVAL '3 months', NOW() - INTERVAL '3 months' + INTERVAL '5 days', 1, 2400, 'USD', 'completed', 'paid', NOW() - INTERVAL '4 months'),
('550e8400-e29b-41d4-a716-446655440002', 'consultation', NULL, '550e8400-e29b-41d4-a716-446655440201', NOW() + INTERVAL '10 days', NOW() + INTERVAL '10 days', 1, 75, 'USD', 'pending', 'pending', NOW() - INTERVAL '1 day'),
('550e8400-e29b-41d4-a716-446655440003', 'tour', '550e8400-e29b-41d4-a716-446655440404', '550e8400-e29b-41d4-a716-446655440102', NOW() + INTERVAL '3 weeks', NOW() + INTERVAL '3 weeks 4 days', 3, 2400, 'USD', 'confirmed', 'partial', NOW() - INTERVAL '5 days');

-- Insert reviews
INSERT INTO reviews (reviewer_id, reviewable_type, tour_id, leader_id, rating, title, comment, created_at) VALUES
('550e8400-e29b-41d4-a716-446655440003', 'tour', '550e8400-e29b-41d4-a716-446655440405', NULL, 5, 'Unforgettable journey through ancient Japan', 'Liam was an incredible guide who brought Kyoto''s history to life. The temple visits were perfectly timed, and the tea ceremony was a highlight. His knowledge of Japanese culture is unmatched!', NOW() - INTERVAL '3 weeks'),
('550e8400-e29b-41d4-a716-446655440001', 'tour', '550e8400-e29b-41d4-a716-446655440402', NULL, 5, 'Swiss Alps exceeded all expectations!', 'Lukas made our Swiss Alps adventure absolutely perfect. His local knowledge helped us discover hidden trails and viewpoints that we would never have found on our own. The sunrise hike was breathtaking!', NOW() - INTERVAL '2 months'),
('550e8400-e29b-41d4-a716-446655440001', 'leader', NULL, '550e8400-e29b-41d4-a716-446655440104', 5, 'Best guide in Kyoto!', 'Liam''s passion for Japanese culture is contagious. He went above and beyond to ensure we had an authentic experience. Highly recommend his tours!', NOW() - INTERVAL '1 month'),
('550e8400-e29b-41d4-a716-446655440002', 'leader', NULL, '550e8400-e29b-41d4-a716-446655440101', 4, 'Great photography tour in Bali', 'Sarah knows all the best spots for photography in Bali. She was patient with beginners and gave excellent tips for capturing the perfect shot. Would definitely book again!', NOW() - INTERVAL '2 weeks'),
('550e8400-e29b-41d4-a716-446655440003', 'leader', NULL, '550e8400-e29b-41d4-a716-446655440102', 5, 'Incredible food experience!', 'Miguel''s knowledge of Mexican cuisine and history is outstanding. Every meal was an adventure, and his stories made each dish come alive. A must-do experience in Mexico City!', NOW() - INTERVAL '1 week'),
('550e8400-e29b-41d4-a716-446655440001', 'leader', NULL, '550e8400-e29b-41d4-a716-446655440302', 5, 'Professional and knowledgeable mountain guide', 'Lukas ensured our safety while showing us the most spectacular parts of the Alps. His experience really showed, and he made everyone feel comfortable regardless of fitness level.', NOW() - INTERVAL '10 days');

-- Insert live streams
INSERT INTO live_streams (leader_id, title, description, thumbnail_url, scheduled_start, scheduled_end, destination_id, stream_type, status, is_featured) VALUES
-- Currently live stream
('550e8400-e29b-41d4-a716-446655440201', 'Live: Singapore Street Food Tour', 'Currently exploring the best hawker centers in Singapore!', 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?ixlib=rb-4.0.3', NOW() - INTERVAL '30 minutes', NOW() + INTERVAL '90 minutes', (SELECT id FROM destinations WHERE slug = 'singapore'), 'cooking', 'live', true),
-- Upcoming streams
('550e8400-e29b-41d4-a716-446655440202', 'Park Güell Morning Tour', 'Join me for an exclusive early morning tour of Park Güell', 'https://images.unsplash.com/photo-1539037116277-4db20889f2d4?ixlib=rb-4.0.3', NOW() + INTERVAL '1 day', NOW() + INTERVAL '1 day 2 hours', (SELECT id FROM destinations WHERE slug = 'barcelona'), 'live_tour', 'scheduled', true),
-- Past streams (ended)
('550e8400-e29b-41d4-a716-446655440203', 'Tokyo Night Markets Experience', 'A journey through Tokyo vibrant night markets', 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?ixlib=rb-4.0.3', NOW() - INTERVAL '1 week', NOW() - INTERVAL '1 week' + INTERVAL '2 hours', (SELECT id FROM destinations WHERE slug = 'tokyo'), 'destination_guide', 'ended', false),
('550e8400-e29b-41d4-a716-446655440204', 'British Museum Treasures', 'Exploring the most fascinating artifacts', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3', NOW() - INTERVAL '2 weeks', NOW() - INTERVAL '2 weeks' + INTERVAL '90 minutes', (SELECT id FROM destinations WHERE slug = 'london'), 'cultural_event', 'ended', false);

-- Update live stream metrics
UPDATE live_streams SET 
    total_views = 892, max_concurrent_viewers = 156, likes_count = 78, comments_count = 45,
    actual_start = scheduled_start
WHERE status = 'live';

UPDATE live_streams SET 
    total_views = 3420, max_concurrent_viewers = 285, likes_count = 234, comments_count = 89,
    is_recorded = true, recording_available = true,
    actual_start = scheduled_start + INTERVAL '5 minutes',
    actual_end = scheduled_end - INTERVAL '10 minutes'
WHERE status = 'ended' AND title LIKE '%Tokyo%';

UPDATE live_streams SET 
    total_views = 5680, max_concurrent_viewers = 412, likes_count = 456, comments_count = 167,
    is_recorded = true, recording_available = true,
    actual_start = scheduled_start, actual_end = scheduled_end + INTERVAL '15 minutes'
WHERE status = 'ended' AND title LIKE '%British Museum%';

-- Insert videos
INSERT INTO videos (leader_id, title, description, thumbnail_url, video_url, duration_seconds, destination_id, video_type, status, view_count, likes_count, published_at, is_featured) VALUES
('550e8400-e29b-41d4-a716-446655440201', 'Complete Singapore Food Guide', 'Your ultimate guide to Singapore best food spots', 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?ixlib=rb-4.0.3', 'https://example.com/videos/singapore-food-guide.mp4', 1800, (SELECT id FROM destinations WHERE slug = 'singapore'), 'destination_guide', 'published', 12450, 892, NOW() - INTERVAL '1 month', true),
('550e8400-e29b-41d4-a716-446655440202', 'Barcelona Gothic Quarter Walking Tour', 'Discover the hidden gems of Barcelona', 'https://images.unsplash.com/photo-1523531294919-4bcd4c', 'https://example.com/videos/barcelona-gothic.mp4', 2400, (SELECT id FROM destinations WHERE slug = 'barcelona'), 'tour_highlight', 'published', 8920, 623, NOW() - INTERVAL '3 weeks', true),
('550e8400-e29b-41d4-a716-446655440203', 'Japanese Tea Ceremony Experience', 'Learn the art of Japanese tea ceremony', 'https://images.unsplash.com/photo-1564890369478-c89ca6d9cde9?ixlib=rb-4.0.3', 'https://example.com/videos/tea-ceremony.mp4', 1200, (SELECT id FROM destinations WHERE slug = 'kyoto'), 'tutorial', 'published', 6780, 512, NOW() - INTERVAL '2 weeks', false),
('550e8400-e29b-41d4-a716-446655440204', 'Tower of London History Tour', 'Explore 1000 years of British history', 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?ixlib=rb-4.0.3', 'https://example.com/videos/tower-london.mp4', 3600, (SELECT id FROM destinations WHERE slug = 'london'), 'tour_highlight', 'published', 15680, 1205, NOW() - INTERVAL '2 months', false),
('550e8400-e29b-41d4-a716-446655440205', 'Varanasi Spiritual Journey', 'Experience the spiritual heart of India', 'https://images.unsplash.com/photo-1609947014521-e57c9a5b6c3a?ixlib=rb-4.0.3', 'https://example.com/videos/varanasi-spiritual.mp4', 2700, (SELECT id FROM destinations WHERE slug = 'mumbai'), 'destination_guide', 'published', 9340, 789, NOW() - INTERVAL '6 weeks', false);

-- Update video metrics
UPDATE videos SET 
    comments_count = FLOOR(view_count * 0.02),
    shares_count = FLOOR(view_count * 0.01),
    watch_time_minutes = FLOOR(view_count * duration_seconds / 60 * 0.7),
    average_watch_percentage = 65 + FLOOR(RANDOM() * 20)
WHERE status = 'published';

-- Update tour leader video and live stream counts
UPDATE tour_leaders tl SET
    video_count = (SELECT COUNT(*) FROM videos WHERE leader_id = tl.id AND status = 'published'),
    live_stream_count = (SELECT COUNT(*) FROM live_streams WHERE leader_id = tl.id)
WHERE tl.id IN (
    SELECT DISTINCT leader_id FROM videos
    UNION
    SELECT DISTINCT leader_id FROM live_streams
);

-- Set is_live flag for leaders currently streaming
UPDATE tour_leaders SET is_live = true 
WHERE id IN (SELECT leader_id FROM live_streams WHERE status = 'live');

-- ============================================================================
-- END OF COMPLETE DATABASE SETUP
-- ============================================================================