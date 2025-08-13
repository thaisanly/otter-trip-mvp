# 🏗️ Otter Trip Platform - Complete Object & Relationship Tree

## 📦 OTTER TRIP APPLICATION

### 🎯 CORE DATA MODELS

#### Tour
- `id`: string
- `title`: string
- `description`: string
- `image`: string
- `duration`: string
- `price`: string
- `rating`: number
- `reviews`: number
- `talents?`: number

#### TourLeader (Base Guide)
- `id`: string
- `name`: string
- `image`: string
- `location`: string
- `rating`: number
- `reviewCount`: number
- `specialties`: string[]
- `personality?`: string[]
- `languages`: string[]
- `price`: number
- `availability`: string

#### TourExpert (Extended Guide)
- Inherits all TourLeader properties
- `countryCode`: string
- `verified`: boolean
- `experience`: number
- `followers`: number
- `isLive?`: boolean
- `isTopCreator?`: boolean
- `isRisingStar?`: boolean
- `videos`: number
- `liveStreams`: number
- `tours`: number

#### TourManager (Organizer)
- Similar to TourExpert properties
- `pricePerDay`: number
- `currency`: string
- `featured?`: boolean
- `topRated?`: boolean
- `newJoined?`: boolean

### 🔄 BOOKING & CONSULTATION

#### ConsultationBooking
- `expertName`: string
- `expertImage`: string
- `price`: number | string
- `selectedDate?`: Date
- `selectedTimeSlot?`: TimeSlot

#### TimeSlot
- `id`: string
- `time`: string
- `available`: boolean

### 🧠 PERSONALITY & MATCHING

#### PersonalityType
- `id`: string
- `type`: string
- `description`: string
- `icon`: string
- `traits`: string[]
- `matches`: ExpertMatch[]

#### ExpertMatch
- Includes expert properties
- `matchPercentage`: number
- `tourCount`: number

#### QuizQuestion
- `id`: string
- `question`: string
- `description?`: string
- `options`: QuizOption[]

#### PersonalityMatchData
- `tourLeaderPersonality`: string[]
- `userPreferences?`: string[]
- `matchPercentage?`: number

### 📱 UI COMPONENTS HIERARCHY

#### Layout Components
- **Header**
  - Uses: LoginModal, navigation links
- **Footer**
  - Uses: social links, site navigation

#### Card Components
- **TourCard**
  - Displays: Tour
- **TourLeaderCard**
  - Displays: TourLeader
  - Uses: Rating, PersonalityMatch
- **TourExpertCard**
  - Displays: TourExpert
- **TourManagerCard**
  - Displays: TourManager

#### Search Components
- **ConversationalSearch**
  - Uses: SearchSuggestion[]
- **SearchBar**
  - Uses: SearchSuggestion[]
- **GlassmorphicSearchBar**
- **DualSearchBar**

#### Booking Components
- **ConsultationBookingModal**
  - Uses: ConsultationBooking, TimeSlot[]
- **InvitationCodeModal**

#### Common UI Elements
- **Modal** (base component)
- **Rating**
- **InterestTag**
- **LoginModal**

### 📄 PAGE COMPONENTS

#### Home
- Uses: ConversationalSearch
- Uses: TourLeaderShowcase
- Uses: TravelPersonalityQuiz
- Uses: VibeMatchingSection
- Uses: HowItWorks

#### SearchResults
- Uses: SearchBar
- Uses: TourLeaderCard[]
- Uses: InterestTag[]
- Manages: SearchFilters state

#### TourLeaderProfile
- Displays: TourLeader details
- Uses: Rating
- Uses: PersonalityMatch
- Uses: TravelStories
- Uses: GuideCertifications
- Uses: InterestTag[]

#### ExpertDetail
- Displays: TourExpert details
- Uses: TourExpertCard
- Uses: InvitationCodeModal
- Uses: ConsultationBookingModal

#### BookingFlow
- Manages: booking process

#### Dashboard
- Uses: Rating, user data

#### Explore
- Uses: TourCard[]
- Uses: InterestTag[]

#### MeetExperts
- Uses: TourExpertCard[]

#### OtterSelects
- Curated tours display

#### TourDetail
- Displays: Tour details

### 🎨 SECTION COMPONENTS

- **TourLeaderShowcase**
- **TravelPersonalityQuiz**
  - Uses: QuizQuestion[], QuizOption[]
- **VibeMatchingSection**
- **HowItWorks**
- **PersonalityMatch**
  - Uses: PersonalityMatchData
- **TravelStories**
  - Uses: TravelStory[]
- **GuideCertifications**
  - Uses: Certification[]
- **PopularDestinations**
- **TestimonialsSection**
- **FeaturedLeaders**
- **HeroSection**

### 🔀 ROUTING STRUCTURE

```
/ → Home
/search → SearchResults
/tour-leader/:id → TourLeaderProfile
/booking/:id → BookingFlow
/dashboard → Dashboard
/otter-selects → OtterSelects
/tour/:id → TourDetail
/explore/:category → Explore
/meet-experts → MeetExperts
/meet-experts/:expertId → ExpertDetail
```

## 🔗 Key Relationships & Data Flow

### 1. Component Inheritance
- `TourExpert` extends `TourLeader` with content creation features
- `TourManager` extends guide properties with pricing/badges
- All modals inherit from base `Modal` component

### 2. Data Dependencies
```
User Search → SearchFilters → TourLeader[] → TourLeaderCard
User Quiz → QuizQuestion[] → PersonalityType → ExpertMatch[]
Tour Selection → Tour → ConsultationBooking → TimeSlot[]
```

### 3. State Management
- **Local State Only**: No Redux/Context API
- Each page manages its own state with React hooks
- URL parameters for search/filter persistence
- Form state managed locally in components

### 4. Component Composition
- Pages compose multiple section components
- Sections use UI components
- UI components display data models
- Modals are rendered conditionally based on state

### 5. Cross-Component Communication
- Props drilling for parent-child communication
- Callback functions for child-to-parent events
- React Router for navigation state
- URL parameters for shared state (search filters)

## 📊 Data Model Relationships

### Primary Entities
```
Tour ←→ TourLeader (many-to-many)
TourLeader → TourExpert (specialization)
TourLeader → TourManager (role variant)
User → PersonalityType (quiz result)
PersonalityType → ExpertMatch[] (recommendations)
ConsultationBooking → TimeSlot (scheduling)
TourLeader → Certification[] (credentials)
```

### Component Data Flow
```
App.tsx
├── Router
│   ├── Header (global)
│   ├── Routes
│   │   ├── Home
│   │   │   ├── ConversationalSearch → SearchResults
│   │   │   ├── TravelPersonalityQuiz → PersonalityType
│   │   │   └── TourLeaderShowcase → TourLeader[]
│   │   ├── SearchResults
│   │   │   ├── SearchFilters → TourLeader[]
│   │   │   └── TourLeaderCard[] → TourLeaderProfile
│   │   ├── TourLeaderProfile
│   │   │   ├── TourLeader data
│   │   │   ├── PersonalityMatch
│   │   │   └── ConsultationBooking → BookingFlow
│   │   └── ExpertDetail
│   │       ├── TourExpert data
│   │       └── ConsultationBookingModal
│   └── Footer (global)
```

## 🏛️ Architecture Patterns

### Design Patterns Used
1. **Component-Based Architecture**: React functional components
2. **Container-Presenter Pattern**: Pages (containers) vs UI components (presenters)
3. **Composition Pattern**: Building complex UIs from simple components
4. **Props Interface Pattern**: TypeScript interfaces for type safety
5. **Route-Based Code Splitting**: Separate page components

### Key Architectural Decisions
1. **No Global State Management**: Simplicity over complexity
2. **TypeScript Throughout**: Type safety and developer experience
3. **Tailwind CSS**: Utility-first styling approach
4. **Functional Components**: Modern React with hooks
5. **Mobile-First Design**: Responsive breakpoints strategy

## 📁 File Structure

```
otter-trip/
├── src/
│   ├── App.tsx                 # Main app component with routing
│   ├── index.tsx               # Entry point
│   ├── index.css               # Global styles
│   ├── types/
│   │   └── index.ts            # All TypeScript definitions
│   ├── components/
│   │   ├── layout/             # App-wide layout
│   │   ├── sections/           # Page sections
│   │   ├── ui/                 # Reusable UI components
│   │   └── booking/            # Booking-specific
│   └── pages/                  # Route page components
├── public/                     # Static assets
├── docs/                       # Documentation
└── Configuration files         # Vite, TypeScript, Tailwind, etc.
```

## 🔧 Technical Stack

- **Frontend Framework**: React 18
- **Language**: TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Icons**: Lucide React
- **Package Manager**: Yarn
- **Linting**: ESLint