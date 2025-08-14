# API Integration Guide for Otter Trip Database

## Overview
This guide provides recommendations for integrating the PostgreSQL database with a backend API (Node.js/NestJS recommended based on the frontend stack).

## Technology Recommendations

### Backend Framework
- **Primary**: NestJS with TypeORM
- **Alternative**: Express.js with Prisma or Knex.js

### ORM/Query Builder Options
1. **TypeORM** (Recommended for NestJS)
   - Full ORM with TypeScript support
   - Supports complex relations
   - Migration management built-in

2. **Prisma**
   - Type-safe database client
   - Excellent TypeScript integration
   - Auto-generated types from schema

3. **Knex.js**
   - SQL query builder
   - More control over queries
   - Good for complex queries

## API Endpoints Structure

### Authentication & Users
```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/refresh
POST   /api/auth/logout
GET    /api/auth/me
PUT    /api/users/profile
POST   /api/users/quiz-results
GET    /api/users/personality-type
```

### Tour Leaders
```
GET    /api/leaders                    # List with filters
GET    /api/leaders/:id               # Get single leader
GET    /api/leaders/:id/tours         # Leader's tours
GET    /api/leaders/:id/reviews       # Leader's reviews
GET    /api/leaders/:id/availability  # Check availability
POST   /api/leaders/:id/follow        # Follow a leader
GET    /api/leaders/recommendations   # Get personalized recommendations
```

### Tours
```
GET    /api/tours                      # List with filters
GET    /api/tours/search              # Search tours
GET    /api/tours/featured            # Featured tours
GET    /api/tours/:id                 # Get single tour
GET    /api/tours/:id/schedules       # Tour schedules
GET    /api/tours/:id/reviews         # Tour reviews
POST   /api/tours/:id/favorite        # Add to favorites
```

### Bookings
```
POST   /api/bookings                   # Create booking
GET    /api/bookings                   # User's bookings
GET    /api/bookings/:id              # Get booking details
PUT    /api/bookings/:id/cancel       # Cancel booking
POST   /api/bookings/:id/payment      # Process payment
GET    /api/consultations/slots       # Available consultation slots
POST   /api/consultations/book        # Book consultation
```

### Reviews
```
POST   /api/reviews                    # Create review
GET    /api/reviews/:id               # Get review
PUT    /api/reviews/:id               # Update review
DELETE /api/reviews/:id               # Delete review
POST   /api/reviews/:id/helpful       # Mark as helpful
```

### Content
```
GET    /api/stories                    # List stories
GET    /api/stories/:slug             # Get story by slug
POST   /api/stories                    # Create story
PUT    /api/stories/:id               # Update story
POST   /api/stories/:id/like          # Like story
GET    /api/stories/trending          # Trending stories
```

### Search & Discovery
```
GET    /api/search                     # Global search
GET    /api/search/suggestions        # Search suggestions
GET    /api/search/popular            # Popular searches
POST   /api/search/save               # Save search
GET    /api/destinations              # List destinations
GET    /api/categories                # List categories
```

### Personality Matching
```
GET    /api/personality/quiz          # Get quiz questions
POST   /api/personality/submit        # Submit quiz answers
GET    /api/personality/matches       # Get matched leaders
GET    /api/personality/types         # List personality types
```

## Data Access Patterns

### 1. Repository Pattern Example (TypeORM)
```typescript
@Injectable()
export class TourRepository {
  constructor(
    @InjectRepository(Tour)
    private tourRepository: Repository<Tour>,
  ) {}

  async findWithFilters(filters: SearchFilters): Promise<Tour[]> {
    const query = this.tourRepository
      .createQueryBuilder('tour')
      .leftJoinAndSelect('tour.leader', 'leader')
      .where('tour.is_active = :active', { active: true });

    if (filters.destination) {
      query.andWhere('tour.destination = :destination', {
        destination: filters.destination,
      });
    }

    if (filters.priceRange) {
      query.andWhere('tour.price_per_person BETWEEN :min AND :max', {
        min: filters.priceRange.min,
        max: filters.priceRange.max,
      });
    }

    if (filters.categories?.length) {
      query.andWhere('tour.category IN (:...categories)', {
        categories: filters.categories,
      });
    }

    return query.getMany();
  }
}
```

### 2. Service Layer Example
```typescript
@Injectable()
export class BookingService {
  constructor(
    private bookingRepository: BookingRepository,
    private paymentService: PaymentService,
    private notificationService: NotificationService,
  ) {}

  async createBooking(
    userId: string,
    bookingDto: CreateBookingDto,
  ): Promise<Booking> {
    const booking = await this.bookingRepository.manager.transaction(
      async (manager) => {
        // Create booking
        const booking = await manager.save(Booking, {
          user_id: userId,
          ...bookingDto,
          status: 'pending',
        });

        // Update tour schedule participants
        if (bookingDto.tour_schedule_id) {
          await manager.increment(
            TourSchedule,
            { id: bookingDto.tour_schedule_id },
            'current_participants',
            bookingDto.participant_count,
          );
        }

        // Process payment if provided
        if (bookingDto.payment_method) {
          await this.paymentService.processPayment(
            booking.id,
            bookingDto.payment_method,
          );
        }

        return booking;
      },
    );

    // Send confirmation notification
    await this.notificationService.sendBookingConfirmation(booking);

    return booking;
  }
}
```

### 3. Caching Strategy
```typescript
@Injectable()
export class LeaderService {
  constructor(
    private cacheManager: Cache,
    private leaderRepository: LeaderRepository,
  ) {}

  async getLeaderWithCache(id: string): Promise<TourLeader> {
    const cacheKey = `leader:${id}`;
    
    // Check cache
    const cached = await this.cacheManager.get<TourLeader>(cacheKey);
    if (cached) return cached;

    // Fetch from database
    const leader = await this.leaderRepository.findOne({
      where: { id },
      relations: ['languages', 'specialties', 'certifications'],
    });

    // Cache for 1 hour
    await this.cacheManager.set(cacheKey, leader, 3600);
    
    return leader;
  }
}
```

## Performance Optimizations

### 1. Database Connection Pool
```typescript
// TypeORM configuration
{
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT),
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [__dirname + '/**/*.entity{.ts,.js}'],
  synchronize: false, // Never in production!
  logging: process.env.NODE_ENV === 'development',
  extra: {
    max: 20, // Connection pool size
    connectionTimeoutMillis: 2000,
    idleTimeoutMillis: 30000,
  },
}
```

### 2. Query Optimization
```typescript
// Use select to fetch only needed columns
const tours = await this.tourRepository.find({
  select: ['id', 'title', 'price_per_person', 'cover_image'],
  where: { is_active: true },
  take: 10,
});

// Use indexes for frequently queried fields
@Index(['destination', 'category'])
@Entity('tours')
export class Tour {
  // ...
}
```

### 3. Pagination
```typescript
interface PaginationOptions {
  page: number;
  limit: number;
}

async function paginate<T>(
  query: SelectQueryBuilder<T>,
  options: PaginationOptions,
): Promise<PaginatedResult<T>> {
  const total = await query.getCount();
  const data = await query
    .skip((options.page - 1) * options.limit)
    .take(options.limit)
    .getMany();

  return {
    data,
    pagination: {
      page: options.page,
      limit: options.limit,
      total,
      totalPages: Math.ceil(total / options.limit),
      hasMore: options.page * options.limit < total,
    },
  };
}
```

## Real-time Features

### WebSocket Events
```typescript
// Socket.IO events for real-time features
export enum SocketEvents {
  // Consultation
  CONSULTATION_STARTED = 'consultation:started',
  CONSULTATION_ENDED = 'consultation:ended',
  
  // Booking
  BOOKING_CONFIRMED = 'booking:confirmed',
  BOOKING_CANCELLED = 'booking:cancelled',
  
  // Messages
  MESSAGE_RECEIVED = 'message:received',
  MESSAGE_READ = 'message:read',
  
  // Live streaming (for experts)
  STREAM_STARTED = 'stream:started',
  STREAM_ENDED = 'stream:ended',
  STREAM_VIEWER_JOINED = 'stream:viewer:joined',
}
```

## Security Considerations

### 1. Input Validation (using class-validator)
```typescript
export class CreateBookingDto {
  @IsUUID()
  tour_id: string;

  @IsDateString()
  start_date: string;

  @IsInt()
  @Min(1)
  @Max(20)
  participant_count: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  special_requests?: string;
}
```

### 2. SQL Injection Prevention
```typescript
// Always use parameterized queries
const users = await this.userRepository
  .createQueryBuilder('user')
  .where('user.email = :email', { email: userInput })
  .getOne();

// Never use string concatenation
// BAD: .where(`user.email = '${userInput}'`)
```

### 3. Rate Limiting
```typescript
@Controller('api/bookings')
@UseGuards(RateLimitGuard)
export class BookingController {
  @Post()
  @RateLimit({ points: 5, duration: 60 }) // 5 bookings per minute
  async createBooking(@Body() dto: CreateBookingDto) {
    // ...
  }
}
```

## Testing Strategy

### 1. Repository Testing
```typescript
describe('TourRepository', () => {
  let repository: TourRepository;
  let connection: Connection;

  beforeEach(async () => {
    connection = await createConnection({
      type: 'postgres',
      database: 'otter_trip_test',
      // ... test config
    });
    repository = new TourRepository(connection);
  });

  it('should find tours by destination', async () => {
    const tours = await repository.findWithFilters({
      destination: 'Kyoto',
    });
    expect(tours).toHaveLength(3);
  });
});
```

### 2. Service Testing
```typescript
describe('BookingService', () => {
  let service: BookingService;
  let mockRepository: jest.Mocked<BookingRepository>;

  beforeEach(() => {
    mockRepository = createMock<BookingRepository>();
    service = new BookingService(mockRepository);
  });

  it('should create booking with pending status', async () => {
    const booking = await service.createBooking('user-id', {
      tour_id: 'tour-id',
      participant_count: 2,
    });
    
    expect(booking.status).toBe('pending');
    expect(mockRepository.save).toHaveBeenCalled();
  });
});
```

## Migration Management

### Using TypeORM Migrations
```bash
# Generate migration from entities
npm run typeorm migration:generate -- -n AddTourLeaderBadges

# Run migrations
npm run typeorm migration:run

# Revert last migration
npm run typeorm migration:revert
```

### Migration Example
```typescript
export class AddTourLeaderBadges1234567890 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.addColumn('tour_leaders', 
      new TableColumn({
        name: 'is_top_creator',
        type: 'boolean',
        default: false,
      })
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropColumn('tour_leaders', 'is_top_creator');
  }
}
```

## Environment Variables
```env
# Database
DB_HOST=localhost
DB_PORT=5432
DB_USER=otter_user
DB_PASSWORD=secure_password
DB_NAME=otter_trip

# Redis (for caching)
REDIS_HOST=localhost
REDIS_PORT=6379

# JWT
JWT_SECRET=your-secret-key
JWT_EXPIRES_IN=7d

# Payment Providers
STRIPE_SECRET_KEY=sk_test_...
PAYPAL_CLIENT_ID=...

# Email
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=...

# AWS S3 (for file uploads)
AWS_ACCESS_KEY_ID=...
AWS_SECRET_ACCESS_KEY=...
AWS_S3_BUCKET=otter-trip-assets
```

## Monitoring & Logging

### Application Monitoring
```typescript
// Use Winston for logging
import { WinstonModule } from 'nest-winston';
import * as winston from 'winston';

export const logger = WinstonModule.createLogger({
  transports: [
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.errors({ stack: true }),
        winston.format.json(),
      ),
    }),
    new winston.transports.File({
      filename: 'error.log',
      level: 'error',
    }),
  ],
});
```

### Database Query Monitoring
```typescript
// Log slow queries
{
  logging: ['query', 'error', 'warn'],
  maxQueryExecutionTime: 1000, // Log queries taking > 1s
}
```

## Deployment Considerations

### Database Migrations in Production
1. Always backup database before migrations
2. Test migrations in staging environment
3. Use database transactions for migrations
4. Have rollback plan ready

### Connection Pooling for Production
```typescript
{
  extra: {
    max: 50, // Increase for production
    min: 5,
    connectionTimeoutMillis: 5000,
    idleTimeoutMillis: 60000,
    ssl: {
      rejectUnauthorized: false, // For AWS RDS
    },
  },
}
```

### Health Checks
```typescript
@Controller('health')
export class HealthController {
  @Get()
  async check(): Promise<HealthCheckResult> {
    return {
      status: 'ok',
      database: await this.checkDatabase(),
      redis: await this.checkRedis(),
      timestamp: new Date().toISOString(),
    };
  }
}
```