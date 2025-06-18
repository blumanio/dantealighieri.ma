import { auth, currentUser } from "@clerk/nextjs/server";
import { User } from "@clerk/nextjs/server";

export async function getCurrentUser(): Promise<User | null> {
  try {
    const user = await currentUser();
    return user;
  } catch (error) {
    console.error("Error fetching current user:", error);
    return null;
  }
}

export async function getCurrentUserId(): Promise<string | null> {
  try {
    const { userId } = await auth();
    return userId;
  } catch (error) {
    console.error("Error fetching current user ID:", error);
    return null;
  }
}

export async function getCurrentUserAuth() {
  try {
    const authData = auth();
    return authData;
  } catch (error) {
    console.error("Error fetching auth data:", error);
    return null;
  }
}

// Helper function to check if user is authenticated
export async function isUserAuthenticated(): Promise<boolean> {
  try {
    const { userId } = await auth();
    return !!userId;
  } catch (error) {
    console.error("Error checking authentication:", error);
    return false;
  }
}

// Get user with additional error handling and type safety
export async function getUserProfile() {
  try {
    const user = await currentUser();
    
    if (!user) {
      return null;
    }

    return {
      id: user.id,
      email: user.emailAddresses[0]?.emailAddress || null,
      firstName: user.firstName,
      lastName: user.lastName,
      fullName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      imageUrl: user.imageUrl,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };
  } catch (error) {
    console.error("Error fetching user profile:", error);
    return null;
  }
}