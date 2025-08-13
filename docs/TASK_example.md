# Task Management

### TODO

- [ ] Refund Management

  - [ ] Refund request backend
  - [ ] Chat messaging system (pull-based)
  - [ ] Customer refund UI
  - [ ] Dealer/Admin refund management

- [ ] Settlement & Reporting

  - [ ] Settlement process backend
  - [ ] Financial dashboard

- [ ] Testing & Quality
  - [ ] Backend unit & integration tests
  - [ ] E2E testing suite with Playwright

### COMPLETED

- [x] Documentation setup - 2025-01-04
  - Created initial_prp.md with comprehensive requirements
  - Set up CHANGELOG.md for all projects
  - Updated CLAUDE.md with project awareness guidelines

## Discovered During Work

### Technical Decisions

- Using pull-based messaging for chat (polling) instead of WebSockets for simplicity
- Guest checkout creates account automatically after payment success
- PayPal and HitPay integration instead of Stripe
- One refund request per order constraint at database level

### Environment Setup

- Database/email access via host.docker.internal in devcontainer
- Variable API ports (3000, 3010, 3020) for different worktrees
- Development servers run in tmux sessions (api, admin, dealer, marketplace)

## Notes

### Key Commands

```bash
# Database reset and seed
yarn migrate:reset
yarn seed:data     # SPU catalog
yarn seed:dev      # Test data

# Type generation
yarn openapi:build # Generate TypeScript types from API

# Testing
yarn test          # Unit tests
yarn test:e2e      # Playwright E2E tests
```

### Important Files

- `docs/initial_prp.md` - Product Requirements Document
- `sellup-api/prisma/schema.prisma` - Database schema
- `CHANGELOG.md` - Track all changes for context
- `common/types/schema.d.ts` - Auto-generated API types

### Development Principles

1. ALL reusable components go in common/
2. NO any, unknown, or never TypeScript types
3. React Hook Form + Zod for ALL forms
4. Repository pattern for data access
5. Minimum 95% test coverage for backend
6. Full accessibility with ARIA attributes
7. Update CHANGELOG.md after every change
