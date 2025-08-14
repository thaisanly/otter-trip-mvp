# Otter Trip Database Structure

## Overview
Complete database design and implementation for the Otter Trip travel platform, supporting all frontend functionality with a robust PostgreSQL schema.

## Files in this Directory

### 📄 Core Schema
- **`schema.sql`** - Complete PostgreSQL DDL scripts to create all database tables, indexes, triggers, and initial data
  - 23 application tables covering all aspects of the platform
  - Spatial data support with PostGIS
  - Comprehensive indexes for performance
  - Database triggers for automated updates

### 📊 Documentation
- **`DATABASE_DESIGN.md`** - Comprehensive database design documentation
  - Entity relationships explained
  - Key design decisions
  - Performance optimizations
  - Security considerations
  - Maintenance guidelines

### 🔷 TypeScript Integration
- **`db-types.ts`** - TypeScript interfaces mapping to database tables
  - Complete type definitions for all entities
  - Helper types for API operations
  - Pagination and search result types

### 📈 Visual Documentation
- **`erd.mermaid`** - Entity Relationship Diagram in Mermaid format
  - Visual representation of all tables
  - Relationships between entities
  - Can be rendered in any Mermaid viewer

### 🔌 API Integration
- **`API_INTEGRATION_GUIDE.md`** - Backend implementation guide
  - Recommended technology stack
  - API endpoint structure
  - Code examples for common patterns
  - Performance optimization strategies

## Quick Start

### 1. Database Setup
```bash
# Create database
createdb otter_trip_dev

# Enable required extensions
psql otter_trip_dev -c "CREATE EXTENSION IF NOT EXISTS uuid-ossp;"
psql otter_trip_dev -c "CREATE EXTENSION IF NOT EXISTS postgis;"

# Run schema
psql otter_trip_dev -f database/schema.sql
```

### 2. Environment Configuration
Create a `.env` file with:
```env
DB_HOST=localhost
DB_PORT=5432
DB_USER=your_user
DB_PASSWORD=your_password
DB_NAME=otter_trip_dev
```

### 3. Verify Installation
```bash
# Check tables were created
psql otter_trip_dev -c "\dt"

# Should show 23 tables including:
# - users
# - tour_leaders
# - tours
# - bookings
# - reviews
# etc.
```

## Key Features

### 🌍 Spatial Data Support
- Geographic coordinates for tours and leaders
- Location-based search capabilities
- Distance calculations for nearby tours

### 👥 User & Personality System
- Comprehensive user profiles
- Travel personality quiz results
- Personality matching between users and guides
- Cached match scores for performance

### 📅 Booking Management
- Unified bookings for tours and consultations
- Payment tracking and processing
- Guest information support
- Cancellation and refund handling

### ⭐ Reviews & Ratings
- Polymorphic reviews (tours and leaders)
- Detailed rating categories
- Verified booking flags
- Owner response capability

### 📝 Content Management
- User-generated travel stories
- SEO-friendly slugs
- Engagement metrics
- Draft/publish workflow

### 🔒 Security Features
- UUID primary keys
- Password hashing (never plain text)
- Soft deletes for data recovery
- Comprehensive audit trails

## Database Statistics

- **Total Tables**: 23 application tables
- **Core Entities**: 10 (users, tour_leaders, tours, bookings, reviews, etc.)
- **Relationship Tables**: 8 (leader_languages, leader_specialties, etc.)
- **Support Tables**: 5 (invitation_codes, promo_codes, etc.)
- **Indexes**: 25+
- **Triggers**: 7
- **Functions**: 3

## Technology Requirements

- PostgreSQL 14 or higher
- PostGIS extension for spatial data
- UUID extension for key generation

## Performance Considerations

### Denormalized Fields
- Tour statistics (reviews, ratings)
- Leader follower counts
- Story engagement metrics

### Caching Strategy
- Personality match scores
- Popular searches
- Tour statistics

### Index Coverage
- All foreign keys
- Frequently queried fields
- Spatial data indexes
- Partial indexes for active records

## Next Steps

1. **Backend API Development**
   - Implement NestJS/TypeORM entities
   - Create repository layer
   - Build service layer
   - Add API endpoints

2. **Data Seeding**
   - Create seed scripts
   - Generate test data
   - Import sample content

3. **Performance Testing**
   - Load test with realistic data
   - Query optimization
   - Index tuning

4. **Production Deployment**
   - Set up replication
   - Configure backups
   - Monitor performance

## Support

For questions about the database design or implementation, refer to:
- `DATABASE_DESIGN.md` for detailed documentation
- `API_INTEGRATION_GUIDE.md` for backend integration
- `db-types.ts` for TypeScript type definitions