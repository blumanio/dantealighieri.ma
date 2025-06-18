// utils/universityUtils.ts

/**
 * Utility functions for university-related operations
 */

/**
 * Generates a consistent university slug from a university name
 * Handles Italian characters and special cases
 */
export const generateConsistentUniSlug = (uniName: string): string => {
  if (!uniName) return 'unknown-university';

  return uniName
    .toString()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[àáâãäåāăą]/g, 'a')
    .replace(/[èéêëēĕėęě]/g, 'e')
    .replace(/[ìíîïĩīĭįı]/g, 'i')
    .replace(/[òóôõöōŏő]/g, 'o')
    .replace(/[ùúûüũūŭůűų]/g, 'u')
    .replace(/[ýÿŷ]/g, 'y')
    .replace(/[ñń]/g, 'n')
    .replace(/[çćč]/g, 'c')
    .replace(/[šśŝş]/g, 's')
    .replace(/[žźż]/g, 'z')
    .replace(/[^a-z0-9-]/g, '')
    .replace(/-+/g, '-')
    .replace(/^-+|-+$/g, '');
};

/**
 * Normalizes university name for fuzzy matching
 * Removes common words and special characters
 */
export const normalizeUniversityName = (name: string): string => {
  return name
    ? name
        .toLowerCase()
        .replace(/[àáâãäåāăą]/g, 'a')
        .replace(/[èéêëēĕėęě]/g, 'e')
        .replace(/[ìíîïĩīĭįı]/g, 'i')
        .replace(/[òóôõöōŏő]/g, 'o')
        .replace(/[ùúûüũūŭůűų]/g, 'u')
        .replace(/[ýÿŷ]/g, 'y')
        .replace(/[ñń]/g, 'n')
        .replace(/[çćč]/g, 'c')
        .replace(/university|università|uni\.|univ\.|of|del|della|di|degli|delle/g, '')
        .replace(/[^a-z0-9]/g, '')
        .trim()
    : '';
};

/**
 * Performs fuzzy matching between two university names
 * Returns true if the names are considered a match
 */
export const fuzzyMatchUniversityNames = (str1: string, str2: string): boolean => {
  const normalized1 = normalizeUniversityName(str1);
  const normalized2 = normalizeUniversityName(str2);

  // Exact match
  if (normalized1 === normalized2) return true;

  // One contains the other
  if (normalized1.includes(normalized2) || normalized2.includes(normalized1)) return true;

  // Check for significant character overlap
  const commonChars = normalized1.split('').filter(char => normalized2.includes(char));

  // If more than 70% of characters match, consider it a match
  const similarity = commonChars.length / Math.max(normalized1.length, normalized2.length);
  return similarity > 0.7;
};

/**
 * Formats a deadline date string into a readable format
 */
export const formatDeadline = (deadline?: string): string => {
  if (!deadline) return 'Not specified';

  try {
    return new Date(deadline).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  } catch {
    return deadline;
  }
};

/**
 * Determines the status of a deadline (upcoming, soon, passed, unknown)
 */
export const getDeadlineStatus = (deadline?: string): 'upcoming' | 'soon' | 'passed' | 'unknown' => {
  if (!deadline) return 'unknown';

  try {
    const deadlineDate = new Date(deadline);
    const now = new Date();
    const diffDays = Math.ceil((deadlineDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));

    if (diffDays < 0) return 'passed';
    if (diffDays <= 30) return 'soon';
    return 'upcoming';
  } catch {
    return 'unknown';
  }
};

/**
 * Gets CSS classes for deadline status styling
 */
export const getDeadlineStatusColor = (status: string): string => {
  switch (status) {
    case 'upcoming': return 'text-blue-600 bg-blue-100 border-blue-200';
    case 'soon': return 'text-orange-600 bg-orange-100 border-orange-200';
    case 'passed': return 'text-red-600 bg-red-100 border-red-200';
    default: return 'text-gray-600 bg-gray-100 border-gray-200';
  }
};

/**
 * Parses tuition fee string and returns numeric value for sorting
 */
export const parseTuitionFee = (tuitionStr?: string): number => {
  if (!tuitionStr) return 0;
  const numbers = tuitionStr.replace(/[^\d]/g, '');
  return parseInt(numbers) || 0;
};

/**
 * Creates a display name from a slug
 */
export const slugToDisplayName = (slug: string): string => {
  return slug
    .replace(/-/g, ' ')
    .replace(/\b\w/g, l => l.toUpperCase());
};

/**
 * Validates if a university name is meaningful (not empty or generic)
 */
export const isValidUniversityName = (name: string): boolean => {
  if (!name || name.trim().length < 3) return false;

  const genericNames = ['university', 'università', 'college', 'institute', 'istituto'];
  const normalizedName = normalizeUniversityName(name);

  return !genericNames.some(generic => normalizedName === generic);
};

/**
 * Extracts the main university name from a full name
 * Removes common prefixes and suffixes
 */
export const extractMainUniversityName = (fullName: string): string => {
  return fullName
    .replace(/^(università\s+|university\s+of\s+|college\s+of\s+)/i, '')
    .replace(/\s+(university|università|college|institute|istituto)$/i, '')
    .trim();
};