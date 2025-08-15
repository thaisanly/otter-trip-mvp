/**
 * Utility functions for generating URL-friendly slugs
 */

/**
 * Convert a string to a URL-friendly slug
 * @param text - The text to convert to a slug
 * @returns A lowercase, hyphenated slug
 */
export function generateSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces, underscores with hyphens
    .replace(/^-+|-+$/g, ''); // Remove leading/trailing hyphens
}

/**
 * Generate a unique slug by checking existing slugs and appending a number if needed
 * @param baseSlug - The base slug to make unique
 * @param existingSlugs - Array of existing slugs to check against
 * @returns A unique slug (may have -1, -2, etc. appended)
 */
export function generateUniqueSlug(baseSlug: string, existingSlugs: string[]): string {
  let slug = baseSlug;
  let counter = 1;
  
  // Check if the slug already exists
  while (existingSlugs.includes(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}

/**
 * Generate a unique slug for a tour leader from their name
 * @param name - The tour leader's name
 * @param existingIds - Array of existing tour leader IDs to check against
 * @returns A unique slug ID for the tour leader
 */
export async function generateTourLeaderSlug(
  name: string,
  checkExisting: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = generateSlug(name);
  let slug = baseSlug;
  let counter = 1;
  
  // Keep checking until we find a unique slug
  while (await checkExisting(slug)) {
    slug = `${baseSlug}-${counter}`;
    counter++;
  }
  
  return slug;
}