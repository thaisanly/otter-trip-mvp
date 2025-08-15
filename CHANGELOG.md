# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Initial user interface implementation
  - Basic layout and components
  - Core navigation structure
  - Responsive design framework
- Environment variable validation system with Zod schema
- Structured logging utility with development/production modes
- Input validation for API endpoints with Zod schemas
- Type-safe Prisma query interfaces

### Changed

- Enhanced Next.js configuration with security headers and strict TypeScript/ESLint checks
- Updated .env.example with comprehensive security documentation
- Improved API error handling with environment-aware error details

### Deprecated

### Removed

- Hardcoded JWT secret fallback (security vulnerability)
- Raw SQL queries replaced with type-safe Prisma queries
- Unsafe `any` type usage in critical API endpoints

### Fixed

- SQL injection vulnerability in tours API endpoint
- Type safety violations in authentication system
- Insecure environment variable handling
- Missing input validation in API routes

### Security

- **CRITICAL**: Removed hardcoded JWT secret fallback - now requires proper JWT_SECRET environment variable
- **CRITICAL**: Fixed SQL injection vulnerability in tours API by replacing raw queries with Prisma type-safe queries
- Added comprehensive input validation and sanitization
- Enabled TypeScript and ESLint checks during build process
- Added security headers (X-Content-Type-Options, X-Frame-Options, X-XSS-Protection, Referrer-Policy)
- Environment variable validation prevents application startup with missing/invalid configuration
