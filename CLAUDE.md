# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Files to Read First

When starting work on this codebase, ALWAYS read these files first:

1. **README.md** - Project overview and setup instructions
2. **src/types/index.ts** - Complete TypeScript type definitions for the entire application
3. **CHANGELOG.md** - Track recent changes and understand project evolution
4. **CLAUDE.md** (this file) - Project-specific instructions and guidelines

## IMPORTANT: Directory Restrictions

### DO NOT Read from otter-trip-react/

- **NEVER read files from the `/otter-trip-react/` directory** unless explicitly instructed
- This is an old migrated project kept for reference only
- Reading from this directory will cause confusion as it contains outdated code
- All current work should be done in the main `/workspaces/otter-trip/` directory

## Documentation Guidelines

### IMPORTANT: Documentation Rules

- **NEVER create new markdown files** for documentation purposes
- **ALWAYS update README.md** when adding documentation
- If documentation becomes too large, organize it with clear sections in README.md
- The only exception is API documentation that should live with the code itself as comments
- Do not create files like README_FEATURE.md, SETUP.md, or any other separate documentation files
- Keep all project documentation centralized in README.md for easier maintenance and discovery

## Task Analysis and Delegation

### Always Analyze Tasks First

Before starting any work:

1. **Break down complex tasks** into smaller, manageable subtasks
2. **Use TodoWrite tool** to plan and track all tasks
3. **Identify the best approach** for each subtask

### Delegate to Specialized Sub-Agents

Use the Task tool to delegate work to specialized agents when appropriate:

- **tech-lead-orchestrator**: For planning complex features and coordinating multiple components
- **typescript-specialist**: For TypeScript type definitions and advanced type safety
- **react-component-architect**: For designing and implementing React components
- **nestjs-backend-expert**: For backend API development
- **react-state-manager**: For state management solutions
- **react-tailwindcss**: For styling with Tailwind CSS
- **playwright-e2e-specialist**: For end-to-end testing
- **frontend-playwright-tester**: For UI component testing
- **openapi-react-query**: For API integration with React Query
- **react-form-zod**: For form validation with Zod schema
- **code-reviewer**: For reviewing code after implementation
- **code-polisher**: For refactoring and improving code quality
- **performance-optimizer**: For performance improvements
- **code-archaeologist**: For understanding legacy code

### Task Delegation Strategy

1. **Analyze the user's request** to identify required expertise
2. **Launch multiple agents concurrently** when tasks are independent
3. **Use specialized agents proactively** - don't wait for user to ask
4. **Provide detailed task descriptions** to agents for autonomous work
5. **Summarize agent results** concisely for the user

## MCP Tool Usage Guidelines

### Serena MCP Tools (Semantic Code Navigation)

Use Serena MCP tools for efficient code exploration and editing:

- **get_symbols_overview**: Start with this to understand file structure before reading entire files
- **find_symbol**: Locate specific functions, classes, or methods by name
- **find_referencing_symbols**: Find all references to a symbol
- **replace_symbol_body**: Edit entire functions/methods/classes
- **replace_regex**: For precise line-by-line edits
- **search_for_pattern**: Search for code patterns across the codebase
- **IMPORTANT**: Avoid reading entire files with Read tool when Serena's semantic tools can provide targeted information

### Context7 MCP Tools (Documentation)

Use Context7 MCP tools to fetch up-to-date documentation:

- **resolve-library-id**: First resolve package names to Context7 IDs
- **get-library-docs**: Fetch current documentation for React, TypeScript, Vite, Tailwind CSS, and other libraries
- Always check latest documentation before implementing new features or fixing issues

### Playwright MCP Tools (UI Testing)

Use Playwright MCP tools for browser-based UI testing:

- **browser_navigate**: Navigate to development server (typically http://localhost:5173)
- **browser_snapshot**: Capture accessibility tree for understanding page structure
- **browser_click**: Interact with UI elements
- **browser_type**: Fill in forms and inputs
- **browser_take_screenshot**: Capture visual state for verification
- **browser_evaluate**: Run JavaScript in browser context for advanced testing
- Run `yarn dev` first to start the development server before UI testing

## Commands

### Development

```bash
npm install          # Install dependencies
npm run dev          # Start Next.js development server
npm run build        # Create production build
npm start            # Start production server
npm run lint         # Run ESLint for code quality checks
npm run seed         # Seed database with initial data
```

### Database Commands

```bash
npx prisma generate  # Generate Prisma client
npx prisma migrate dev  # Run database migrations
npx prisma db push   # Push schema to database without migration
```

### IMPORTANT: Command Restrictions

- **DO NOT run `npx prisma studio`** - This will interfere with the database connections
- **DO NOT run multiple dev servers** - Only run one `npm run dev` instance
- If you need to check the running dev server, use the BashOutput tool to monitor the existing process

### Admin Login Credentials

For admin panel access:

- **Email**: admin@example.com
- **Password**: password123

## Architecture Overview

### Application Type

Next.js 15 full-stack application for a travel platform connecting travelers with expert local guides. Built with React 19, TypeScript, PostgreSQL with Prisma ORM, and Tailwind CSS.

### Core Architecture

#### Next.js App Router Structure

The application uses Next.js 15 App Router with file-based routing in `src/app/`:

- **Pages**: `/src/app/[route]/page.tsx` for main pages
- **API Routes**: `/src/app/api/[endpoint]/route.ts` for backend endpoints
- **Admin Panel**: `/src/app/admin/` for administrative interfaces
- Dynamic routes use `[id]` parameters for tours, experts, and tour leaders
- Category routes under `/explore/[category]` support all tour categories

#### Database Architecture

- **PostgreSQL** database with Prisma ORM
- **Models**: TourLeader, Tour, Expert, Booking, ConsultationBooking, Admin, TourCategory, Newsletter
- **Relations**: Tours are linked to TourLeaders, proper foreign key constraints
- **Migration Strategy**: Single initial migration consolidating all schema changes

#### Component Organization

```
src/components/
├── layout/     # Header, Footer, LayoutProvider - app-wide layout components
├── sections/   # Landing page sections (Hero, Testimonials, TravelPersonalityQuiz)
├── ui/         # Reusable components (TourCard, TourExpertCard, etc.)
├── booking/    # ConsultationBookingModal and booking flows
├── forms/      # ExpertInquiryForm and other form components
└── admin/      # Admin-specific components (ConsultationCodes, etc.)
```

#### Security & Configuration

- **Environment Validation**: Zod schema validates all required environment variables at startup
- **Authentication**: JWT-based auth with secure token handling
- **Database Security**: Type-safe Prisma queries prevent SQL injection
- **Input Validation**: Zod schemas for all API endpoint inputs
- **Error Handling**: Structured logging with environment-aware error responses

#### Key Architectural Patterns

1. **Server Components & Client Components**: Proper Next.js 15 patterns with 'use client' directives
2. **API Routes**: RESTful endpoints using Next.js route handlers
3. **Type Safety**: End-to-end TypeScript with Prisma-generated types
4. **Responsive Design**: Mobile-first approach using Tailwind breakpoints
5. **Form Handling**: Zod validation with proper error handling

### Important Implementation Details

#### API Architecture

- **Tours API**: `/api/tours` with category filtering and pagination support
- **Experts API**: `/api/experts` with active status filtering
- **Booking Systems**: Separate endpoints for tour bookings and expert consultations
- **Admin APIs**: Protected admin endpoints for consultation codes and user management
- **Newsletter**: Email subscription with confirmation tokens

#### Authentication System

- **JWT Tokens**: Secure token generation with configurable expiration
- **Admin Protection**: Role-based access control for admin routes
- **Session Management**: HTTP-only cookies for secure session handling

#### Database Models

Key relationships and features:

- **TourLeader ↔ Tour**: One-to-many relationship with foreign keys
- **Expert**: Independent model for travel consultants
- **Categories**: Slug-based IDs for SEO-friendly URLs
- **Bookings**: Comprehensive booking system with reference codes
- **Admin**: Secure admin user management with bcrypt hashing

#### Type Definitions

- **Global Types**: Defined in `src/types/index.ts`
- **Prisma Types**: Auto-generated from database schema
- **API Types**: Request/response interfaces for each endpoint
- **Component Props**: TypeScript interfaces for all React components

### Development Considerations

- **Next.js 15**: Latest features including React 19 support
- **Database**: PostgreSQL with Docker support for development
- **Styling**: Tailwind CSS with custom component patterns
- **Security**: Production-ready security headers and validation
- **Performance**: Optimized database queries and proper caching strategies
