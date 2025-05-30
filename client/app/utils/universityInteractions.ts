// lib/utils/universityInteractions.ts

export interface UniversityInteractionCounts {
  viewCount: number;
  favoriteCount: number;
  trackedCount: number;
}

export interface UserInteractionStatus {
  isFavorite: boolean;
  isTracked: boolean;
  favoriteId: string | null;
  trackingId: string | null;
}

// API call utilities for university interactions
export class UniversityInteractionService {
  
  // Track university view
  static async trackView(universityId: string, userId: string): Promise<{ viewCount: number }> {
    const response = await fetch(`/api/universities/${universityId}/view`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ userId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to track view: ${response.statusText}`);
    }

    return response.json();
  }

  // Add to favorites
  static async addToFavorites(universityId: string, userId: string): Promise<{ favoriteId: string; favoriteCount: number }> {
    const response = await fetch('/api/favorites/university', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ universityId, userId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to add to favorites: ${response.statusText}`);
    }

    return response.json();
  }

  // Remove from favorites
  static async removeFromFavorites(favoriteId: string): Promise<{ favoriteCount: number }> {
    const response = await fetch(`/api/favorites/university/${favoriteId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to remove from favorites: ${response.statusText}`);
    }

    return response.json();
  }

  // Start tracking
  static async startTracking(universityId: string, userId: string): Promise<{ trackingId: string; trackedCount: number }> {
    const response = await fetch('/api/tracking/university', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ universityId, userId }),
    });

    if (!response.ok) {
      throw new Error(`Failed to start tracking: ${response.statusText}`);
    }

    return response.json();
  }

  // Stop tracking
  static async stopTracking(trackingId: string): Promise<{ trackedCount: number }> {
    const response = await fetch(`/api/tracking/university/${trackingId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to stop tracking: ${response.statusText}`);
    }

    return response.json();
  }

  // Get user's favorites
  static async getUserFavorites(userId: string) {
    const response = await fetch(`/api/favorites/university?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch favorites: ${response.statusText}`);
    }

    return response.json();
  }

  // Get user's tracked universities
  static async getUserTracking(userId: string) {
    const response = await fetch(`/api/tracking/university?userId=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch tracking: ${response.statusText}`);
    }

    return response.json();
  }
}

// Helper function for updating university data in local state
export const updateUniversityInteractionCounts = (
  universities: any[],
  universityId: number | string,
  updates: Partial<UniversityInteractionCounts & UserInteractionStatus>
) => {
  return universities.map(university => {
    if (university.id === universityId || university._id === universityId) {
      return {
        ...university,
        ...updates
      };
    }
    return university;
  });
};

// Validation helpers
export const validateInteractionData = (data: any): UniversityInteractionCounts => {
  return {
    viewCount: Math.max(0, parseInt(data.viewCount) || 0),
    favoriteCount: Math.max(0, parseInt(data.favoriteCount) || 0),
    trackedCount: Math.max(0, parseInt(data.trackedCount) || 0),
  };
};

// Error handling helper
export const handleInteractionError = (error: any, action: string): string => {
  console.error(`University interaction error (${action}):`, error);
  
  if (error.message?.includes('fetch')) {
    return 'Network error. Please check your connection and try again.';
  }
  
  if (error.message?.includes('401') || error.message?.includes('unauthorized')) {
    return 'Please sign in to perform this action.';
  }
  
  if (error.message?.includes('404')) {
    return 'University not found.';
  }
  
  return `Failed to ${action.toLowerCase()}. Please try again.`;
};