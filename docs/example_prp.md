name: "Example Feature PRP - Refund Management"
description: |

## Purpose

Template for implementing features with validation loops and sufficient context.

## Core Principles

1. **Context is King**: Include all necessary documentation
2. **Validation Loops**: Provide executable tests the AI can run and fix
3. **Progressive Success**: Start simple, validate, then enhance
4. **Follow CLAUDE.md**: Adhere to project guidelines

---

## Goal

Build refund management system with chat messaging and approval workflow.

## Why

- Builds customer trust with transparent refund process
- Reduces support overhead with dealer-customer chat
- Provides audit trail for financial reconciliation

## What

Refund system with:

- Customer request with reason
- Dealer/Admin approval workflow
- Chat with text + images (max 5)
- Pull-based messaging (5s polling)

### Success Criteria

- [ ] One refund per order constraint
- [ ] Chat with image uploads works
- [ ] 95% test coverage achieved

## Context Needed

```yaml
MUST READ:
  - file: sellup-api/prisma/schema.prisma
    why: Database schema already defined

  - file: CLAUDE.md
    why: Project patterns and standards

  - url: https://docs.nestjs.com/techniques/file-upload
    why: Multer configuration for images
```

## Implementation Tasks

```yaml
Task 1: Backend Refund Module
- Create src/modules/refund/
- Repository pattern (no direct Prisma)
- One-refund-per-order validation

Task 2: Chat Module
- REST endpoints (not WebSocket)
- Multer: max 5 images, 5MB each
- Cursor-based pagination

Task 3: Frontend Components
- common/components/Chat/ (reusable)
- React Hook Form + Zod validation
- React Query 5s polling

Task 4: Testing
- Jest unit tests (95% coverage)
- Playwright E2E tests
```

## Pseudocode Example

```typescript
// Refund Service - enforce constraint
async createRefund(dto: CreateRefundDto): Promise<Refund> {
  // Check one-per-order constraint
  const existing = await this.repository.findByOrderId(dto.orderId);
  if (existing) throw new ConflictException('Refund exists');

  // Use transaction for atomicity
  return this.prisma.$transaction(async (tx) => {
    const order = await tx.order.findUnique({where: {id: dto.orderId}});
    if (!order) throw new NotFoundException();

    return this.repository.create({
      ...dto,
      dealerId: order.dealerId,
      status: RefundStatus.PENDING
    }, tx);
  });
}

// Frontend polling pattern
const { data } = useQuery({
  queryKey: ['messages', refundId],
  queryFn: () => api.getMessages(refundId),
  refetchInterval: 5000, // Poll every 5s
});
```

## Validation Loop

### Level 1: Syntax

```bash
yarn lint        # Fix linting errors
yarn build       # TypeScript compilation
```

### Level 2: Unit Tests

```bash
yarn test --coverage    # Target: 95%
```

### Level 3: E2E Test

```bash
yarn test:e2e    # Playwright tests
```

## Checklist

- [ ] No TypeScript errors
- [ ] Tests pass with 95% coverage
- [ ] CHANGELOG.md updated
- [ ] No any/unknown types
- [ ] ARIA attributes on all inputs

## Anti-Patterns to Avoid

- ❌ Direct Prisma in services (use repositories)
- ❌ WebSockets (use polling as specified)
- ❌ Multiple refunds per order
- ❌ Skipping React Hook Form + Zod
- ❌ Components in app folders if reusable
