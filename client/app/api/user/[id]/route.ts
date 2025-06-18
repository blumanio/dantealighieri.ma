// client/app/api/user/[id]/route.ts
import { clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";

// Define the structure for the dynamic route parameters
interface RouteContext {
  params: Promise<{
    id: string;
  }>;
}

export async function GET(
  request: Request,
  context: RouteContext // Use a clear name for the second argument containing params
) {
  // Await the params before destructuring
  const { id } = await context.params;

  // Log to check if clerkClient and its properties are available
  // console.log("CLERK_SECRET_KEY is set:", !!process.env.CLERK_SECRET_KEY); // Check if the env var is loaded (don't log the key itself)
  // console.log("Imported clerkClient:", typeof clerkClient);
  // if (clerkClient) {
  //   console.log("clerkClient.users:", typeof clerkClient.users);
  //   console.log("clerkClient.users.getUser:", typeof clerkClient.users?.getUser);
  // }

  if (!id || typeof id !== "string") {
    console.error("API Error: Invalid user ID provided - ", id);
    return NextResponse.json({ message: "Invalid user ID" }, { status: 400 });
  }

  try {
    // Get the actual Clerk client instance
    const clerk = await clerkClient();

    // Explicitly check if clerk and the necessary methods are available
    if (!clerk || typeof clerk.users?.getUser !== 'function') {
      console.error("API Error: Clerk client is not initialized correctly or 'users.getUser' is not available.");
      // This often indicates missing CLERK_SECRET_KEY environment variable
      return NextResponse.json(
        { message: "Server configuration error with authentication provider." },
        { status: 500 }
      );
    }

    const user = await clerk.users.getUser(id);

    const publicUser = {
      id: user.id,
      userFullName: user.firstName|| user.fullName || user.username || 'Unknown User',
      email: user.primaryEmailAddress?.emailAddress || '',
      imageUrl: user.imageUrl,
      userRole: user.publicMetadata?.role || null,
    };

    return NextResponse.json(publicUser, { status: 200 });
  } catch (error: any) {
    console.error(`API Error fetching user ${id}:`, error.message, error.stack); // Log full error and stack

    let status = 500;
    let message = "Error fetching user data";
    let detail = error.message;

    // Check for Clerk's specific "resource not found" error
    if (error.errors && Array.isArray(error.errors) && error.errors.some((e: any) => e.code === 'resource_not_found')) {
      status = 404;
      message = "User not found";
      detail = error.errors[0].message;
    } else if (error.status === 404) { // Some Clerk errors might have a status property
      status = 404;
      message = "User not found";
    }
   
    return NextResponse.json({ message, detail }, { status });
  }
}