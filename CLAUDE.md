# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Important Files to Read First

When starting work on this codebase, ALWAYS read these files first:
1. **src/types/index.ts** - Complete TypeScript type definitions for the entire application
2. **CHANGELOG.md** - Track recent changes and understand project evolution
3. **CLAUDE.md** (this file) - Project-specific instructions and guidelines

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
yarn install         # Install dependencies
yarn dev             # Start development server (Vite)
yarn build           # Create production build
yarn preview         # Preview production build locally
yarn lint            # Run ESLint for code quality checks
```

## Architecture Overview

### Application Type
React SPA (Single Page Application) for a travel platform connecting travelers with expert local guides. Built with React 18, TypeScript, Vite, and Tailwind CSS.

### Core Architecture

#### Route Structure
The application uses React Router v6 with routes defined in `src/App.tsx`:
- Dynamic routes use `:id` parameters for tour leaders, tours, and experts
- Category routes under `/explore/:category` support adventure, cultural, relaxation, and food
- Booking flow at `/booking/:id` with modal-based consultations

#### Component Organization
```
src/components/
├── layout/     # Header, Footer - app-wide layout components
├── sections/   # Landing page sections (Hero, Testimonials, etc.)
├── ui/         # Reusable components (SearchBar, TourCard, etc.)
└── booking/    # Booking-specific modals and flows
```

#### Key Architectural Patterns
1. **Functional Components with TypeScript**: All components use React FC with typed props interfaces
2. **Page-Component Pattern**: Each route has a corresponding page component in `src/pages/`
3. **Responsive Design**: Mobile-first approach using Tailwind breakpoints (sm, md, lg, xl)
4. **State Management**: Local state with React hooks - no global state management library

### Important Implementation Details

#### Search Functionality
- `ConversationalSearch` component handles natural language queries
- `SearchResults` page filters and displays tour leaders based on search parameters
- Filter state managed via URL parameters for shareable searches

#### Tour Leader System
- `TourLeaderCard` displays guide information with ratings and specialties
- Profile pages show detailed information including languages, certifications, and tour offerings
- Booking flow integrates consultation scheduling

#### Type Definitions
Component props are defined as TypeScript interfaces directly above each component. Example pattern:
```typescript
interface ComponentNameProps {
  // prop definitions
}
```

### Development Considerations
- The app uses Vite's HMR for fast development refresh
- Tailwind CSS classes are the primary styling method - avoid inline styles
- Images use Unsplash URLs as placeholders (consider replacing for production)
- The entry point `src/index.tsx` uses deprecated ReactDOM.render (should migrate to createRoot)