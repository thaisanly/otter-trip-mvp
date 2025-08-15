/**
 * Utility functions for mock data
 * This file contains all helper functions for accessing and manipulating mock data
 */

import type { CategoryTour } from './categories';
import type { Expert } from './experts';
import type { TourDetail } from './tours';
import type { TourLeader } from './tourLeaders';

// Import data from mock files
import { experts } from './experts';
import { tours } from './tours';
import { tourLeaders } from './tourLeaders';

// ===== CATEGORIES UTILITIES =====

/**
 * Helper function to convert TourDetail to CategoryTour format
 */
export function convertTourDetailToCategoryTour(tour: TourDetail): CategoryTour {
  return {
    id: tour.id,
    title: tour.title,
    description: tour.overview[0] || 'No description available',
    image: tour.heroImage,
    duration: tour.duration,
    price: tour.price,
    rating: tour.rating,
    reviews: tour.reviewCount,
    talents: tour.totalJoined,
    hasAvailableDates: tour.dates.length > 0,
    guide: {
      name: tour.guide.name,
      image: tour.guide.image,
    },
  };
}

/**
 * Dynamic function to get tours by category from the centralized tours data
 */
export function getToursByCategoryForListing(category: string): CategoryTour[] {
  const categoryTours = getToursByCategory(category);
  return categoryTours.map(convertTourDetailToCategoryTour);
}

// ===== TOURS UTILITIES =====

/**
 * Helper function to get tours by category
 */
export function getToursByCategory(category: string): TourDetail[] {
  return Object.values(tours).filter((tour) => tour.categories.includes(category));
}

/**
 * Helper function to get all tours
 */
export function getAllTours(): TourDetail[] {
  return Object.values(tours);
}

/**
 * Helper function to get tour by ID
 */
export function getTourById(id: string): TourDetail | undefined {
  return tours[id];
}

// ===== EXPERTS UTILITIES =====

/**
 * Get expert by ID - returns full expert data for detail page
 * Used by: ExpertProfile.tsx
 */
export function getExpertById(id: string): Expert | undefined {
  return experts.find((expert) => expert.id === id);
}

/**
 * Get experts for listing page
 * Used by: MeetExperts.tsx
 */
export function getExpertsForListing(): Expert[] {
  return experts;
}

/**
 * Get related experts (excluding current expert)
 * Used by: ExpertProfile.tsx
 */
export function getRelatedExperts(currentExpertId: string, limit = 3): Expert[] {
  return experts.filter((expert) => expert.id !== currentExpertId).slice(0, limit);
}

// ===== TOUR LEADERS UTILITIES =====

/**
 * Get tour leader by ID - returns full tour leader data for detail page
 * Used by: TourLeaderProfile.tsx
 */
export function getTourLeaderById(id: string): TourLeader | undefined {
  return tourLeaders.find((leader) => leader.id === id);
}

/**
 * Get tour leaders for listing page
 * Used by: SearchResults.tsx
 */
export function getTourLeadersForListing(): TourLeader[] {
  return tourLeaders;
}
