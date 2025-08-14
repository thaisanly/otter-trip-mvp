# Otter Trip Database Design Documentation

## Overview
This document describes the database structure for the Otter Trip travel platform, a marketplace connecting travelers with expert local guides. The database is designed for PostgreSQL and includes support for spatial data, JSONB fields for flexible data storage, and comprehensive relationships between entities.

## Technology Stack
- **Database**: PostgreSQL 14+
- **Extensions Required**:
  - `uuid-ossp`: For UUID generation
  - `postgis`: For geographical/spatial data

## Core Entities and Relationships

### Entity Relationship Diagram

```mermaid
erDiagram
    USERS ||--o{ BOOKINGS : makes
    USERS ||--o{ REVIEWS : writes
    USERS ||--o{ TRAVEL_STORIES : authors
    USERS ||--o{ USER_FAVORITES : has
    USERS ||--o{ MESSAGES : sends
    USERS ||--o{ NOTIFICATIONS : receives
    USERS ||--o{ SEARCH_HISTORY : performs
    USERS ||--o{ USER_QUIZ_RESULTS : completes
    USERS ||--o| TOUR_LEADERS : "can be"
    
    TOUR_LEADERS ||--o{ TOURS : creates
    TOUR_LEADERS ||--o{ BOOKINGS : receives
    TOUR_LEADERS ||--o{ REVIEWS : "reviewed in"
    TOUR_LEADERS ||--o{ CERTIFICATIONS : has
    TOUR_LEADERS ||--o{ LEADER_LANGUAGES : speaks
    TOUR_LEADERS ||--o{ LEADER_SPECIALTIES : "specializes in"
    TOUR_LEADERS ||--o{ PERSONALITY_MATCH_SCORES : "matched with"
    
    TOURS ||--o{ BOOKINGS : "booked in"
    TOURS ||--o{ REVIEWS : "reviewed in"
    TOURS ||--o{ TOUR_SCHEDULES : has
    TOURS ||--o{ TOUR_ITINERARY : contains
    TOURS ||--o{ TRAVEL_STORIES : "featured in"
    
    TOUR_SCHEDULES ||--o{ BOOKINGS : "scheduled in"
    
    BOOKINGS ||--o{ PAYMENTS : "paid through"
    BOOKINGS ||--o{ MESSAGES : "discussed in"
    
    PERSONALITY_TYPES ||--o{ USER_QUIZ_RESULTS : "results in"
    
    TRAVEL_STORIES ||--o{ STORY_LIKES : receives
    
    PROMO_CODES ||--o{ BOOKINGS : "applied to"
    INVITATION_CODES ||--o{ USERS : "used by"
```

## Database Tables

### 1. User Management

#### users
Primary table for all platform users (travelers/customers).
- **Key Features**:
  - UUID primary keys for security
  - Comprehensive profile information
  - Travel preferences stored as JSONB
  - Email/phone verification tracking
  - Soft delete capability with `is_active`

#### tour_leaders
Extends users for guides, experts, and tour managers.
- **Types**: `leader`, `expert`, `manager`
- **Features**:
  - Location with PostGIS coordinates
  - Pricing and availability
  - Personality traits for matching
  - Verification badges and ratings
  - Social metrics (followers, videos, etc.)

#### leader_languages & leader_specialties
Many-to-many relationships for leader capabilities.

### 2. Tours and Packages

#### tours
Core tour/trip packages offered by leaders.
- **Features**:
  - Flexible duration options
  - Geographic location with coordinates
  - Category-based organization
  - Denormalized stats for performance
  - Availability windows and blackout dates
  - JSONB arrays for images and inclusions

#### tour_itinerary
Day-by-day breakdown of tour activities.

#### tour_schedules
Specific tour dates with participant tracking.

### 3. Bookings and Payments

#### bookings
Unified table for both tour and consultation bookings.
- **Booking Types**: `tour`, `consultation`
- **Features**:
  - Comprehensive status tracking
  - Guest information support
  - Promo code integration
  - Cancellation handling

#### payments
Financial transaction records.
- **Payment Methods**: card, paypal, bank_transfer, crypto
- **Integration**: Provider-agnostic with external ID storage

### 4. Reviews and Ratings

#### reviews
Polymorphic reviews for tours and leaders.
- **Features**:
  - Detailed rating categories
  - Verified booking flag
  - Owner response capability
  - Media attachment support

### 5. Content and Discovery

#### travel_stories
User-generated content and blog posts.
- **Features**:
  - SEO-friendly slugs
  - Engagement metrics
  - Draft/publish workflow
  - Personality trait associations

#### search_history & popular_searches
Search behavior tracking and optimization.

### 6. Personality Matching

#### personality_types
Predefined traveler personality profiles.

#### user_quiz_results
Quiz completion tracking with trait calculation.

#### personality_match_scores
Cached compatibility scores for performance.

### 7. Communication

#### messages
Direct messaging between users and leaders.
- **Features**:
  - Thread support with parent_message_id
  - Read status tracking
  - Booking context association

#### notifications
System notifications and alerts.

## Key Design Decisions

### 1. UUID Primary Keys
- **Rationale**: Security, distributed generation, URL-safe
- **Implementation**: Using PostgreSQL's `uuid-ossp` extension

### 2. JSONB Fields
Used for flexible, schema-less data:
- User preferences and interests
- Tour images and tags
- Personality traits
- Guest details in bookings

### 3. PostGIS Integration
- **Purpose**: Location-based search and distance calculations
- **Fields**: `coordinates` in tours and tour_leaders tables

### 4. Denormalized Statistics
- **Tables Affected**: tours (total_reviews, average_rating)
- **Rationale**: Performance optimization for frequent queries
- **Maintenance**: Database triggers for automatic updates

### 5. Polymorphic Relationships
- **reviews**: Can review either tours or leaders
- **user_favorites**: Can favorite tours, leaders, or stories
- **Implementation**: Type field + nullable foreign keys with CHECK constraints

### 6. Soft Deletes
- **Implementation**: `is_active` flags instead of hard deletes
- **Benefits**: Data recovery, audit trails, referential integrity

## Indexes Strategy

### Primary Indexes
- All foreign key columns
- Unique constraints (email, username, slugs)
- Frequently queried fields (status, dates)

### Specialized Indexes
- **Spatial**: GIST indexes on geography columns
- **Partial**: Active records only where applicable
- **Composite**: Multi-column indexes for complex queries

## Database Triggers

### 1. updated_at Timestamp
Automatically updates modification timestamps on all major tables.

### 2. Statistics Updates
- `update_tour_stats()`: Maintains tour review counts and ratings
- `update_leader_stats()`: Maintains leader ratings (extendable)

## Security Considerations

### 1. Data Protection
- Password hashes only (never plain text)
- UUID keys prevent enumeration attacks
- Sensitive data in separate tables

### 2. Access Control
- Row-level security policies (to be implemented)
- Separate read/write database users recommended
- API-level authorization required

### 3. Data Validation
- CHECK constraints on enums
- Foreign key constraints
- Unique constraints where appropriate

## Performance Optimizations

### 1. Caching Strategy
- Denormalized stats in tours table
- Cached personality match scores
- Popular searches aggregation

### 2. Query Optimization
- Comprehensive indexing strategy
- Partial indexes for active records
- JSONB GIN indexes where needed

### 3. Scalability Considerations
- UUID keys for distributed systems
- Separate read replicas possible
- Partitioning ready for large tables

## Migration Strategy

### Initial Setup
1. Create database and enable extensions
2. Run schema.sql to create all tables
3. Insert initial data (personality types)
4. Create database users with appropriate permissions

### Future Migrations
- Use migration tools (Flyway, Liquibase, or custom)
- Version control all schema changes
- Test migrations in staging environment

## Backup and Recovery

### Recommended Strategy
1. **Daily Backups**: Full database dumps
2. **Point-in-Time Recovery**: WAL archiving enabled
3. **Geographical Redundancy**: Backups stored in multiple regions
4. **Testing**: Regular restore testing procedures

## API Integration Considerations

### 1. Data Access Patterns
- Use database views for complex queries
- Implement pagination for list endpoints
- Consider GraphQL for flexible querying

### 2. Transaction Management
- Use database transactions for bookings
- Implement optimistic locking where needed
- Handle concurrent updates gracefully

### 3. Event Streaming
- Consider using LISTEN/NOTIFY for real-time updates
- Implement change data capture for audit logs

## Future Enhancements

### Potential Additions
1. **Analytics Tables**: User behavior, conversion tracking
2. **Recommendation Engine**: ML-based matching scores
3. **Multi-Currency Support**: Exchange rate tables
4. **Localization**: Multi-language content support
5. **Audit Logs**: Comprehensive change tracking
6. **Wishlist/Itinerary Builder**: Trip planning features

## Maintenance Guidelines

### Regular Tasks
1. **Weekly**: Update statistics, analyze query performance
2. **Monthly**: Review and optimize slow queries
3. **Quarterly**: Review indexes, archive old data
4. **Annually**: Review schema design, plan upgrades

## Development Environment Setup

### Quick Start
```bash
# Create database
createdb otter_trip_dev

# Enable extensions
psql otter_trip_dev -c "CREATE EXTENSION IF NOT EXISTS uuid-ossp;"
psql otter_trip_dev -c "CREATE EXTENSION IF NOT EXISTS postgis;"

# Run schema
psql otter_trip_dev -f database/schema.sql

# Verify installation
psql otter_trip_dev -c "\dt"
```

### Sample Connection String
```
postgresql://username:password@localhost:5432/otter_trip_dev
```

## Testing Considerations

### Test Data Requirements
- Minimum 100 users with varied profiles
- 50+ tour leaders across different locations
- 200+ tours with varied categories
- 500+ bookings in different states
- 1000+ reviews with distributions

### Performance Testing
- Load test with 10,000+ concurrent users
- Query performance under 100ms for searches
- Booking transaction throughput testing