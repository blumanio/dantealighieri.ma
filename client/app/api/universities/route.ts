// app/api/universities/route.ts
import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import University, { IUniversity } from '@/lib/models/University'; // Adjust path as needed

// --- GET Handler ---
export async function GET(request: NextRequest) {
  const requestUrl = request.url;
  console.log(`[API/UNIVERSITIES] GET request received for ${requestUrl}`);

  try {
    await dbConnect();

    const { searchParams } = new URL(requestUrl);
    const page = parseInt(searchParams.get('page') || '1', 10);
    const limit = parseInt(searchParams.get('limit') || '20', 10);
    const searchQuery = searchParams.get('search') || '';
    const name = searchParams.get('name') || '';
    const city = searchParams.get('city') || '';
    const region = searchParams.get('region') || '';
    const status = searchParams.get('status') || '';
    const scholarship = searchParams.get('scholarship'); // 'true' or 'false'
    const id = searchParams.get('id'); // For fetching a single university by ID

    const query: any = {};

    if (id) {
      console.log(`[API/UNIVERSITIES] Filtering by specific ID: "${id}"`);
      query._id = id;
    } else {
      if (searchQuery) {
        query.$or = [
          { name: { $regex: searchQuery, $options: 'i' } },
          { city: { $regex: searchQuery, $options: 'i' } },
          { region: { $regex: searchQuery, $options: 'i' } },
          // Add other fields you want to include in the text search
        ];
        console.log(`[API/UNIVERSITIES] Applying search query: "${searchQuery}"`);
      }
      if (name) {
        query.name = { $regex: `^${name}$`, $options: 'i' };
        console.log(`[API/UNIVERSITIES] Filtering by name: "${name}"`);
        if (city) {
          query.city = { $regex: `^${city}$`, $options: 'i' };
          console.log(`[API/UNIVERSITIES] Filtering by city: "${city}"`);
        }
        if (region) {
          query.region = { $regex: `^${region}$`, $options: 'i' };
          console.log(`[API/UNIVERSITIES] Filtering by region: "${region}"`);
        }
        if (status) {
          query.status = { $regex: `^${status}$`, $options: 'i' };
          console.log(`[API/UNIVERSITIES] Filtering by status: "${status}"`);
        }
        if (scholarship === 'true') {
          query.scholarship_available = true;
          console.log(`[API/UNIVERSITIES] Filtering by scholarship_available: true`);
        } else if (scholarship === 'false') {
          query.scholarship_available = false;
          console.log(`[API/UNIVERSITIES] Filtering by scholarship_available: false`);
        }
      }


      console.log("[API/UNIVERSITIES] Executing University.find with query:", JSON.stringify(query));

      if (id) { // Request for a single university
        const university = await University.findById(id).lean();
        if (!university) {
          console.log(`[API/UNIVERSITIES] University with ID "${id}" not found.`);
          return NextResponse.json({ message: "University not found" }, { status: 404 });
        }
        console.log(`[API/UNIVERSITIES] Found 1 university for ID query.`);
        return NextResponse.json({ success: true, data: university }, { status: 200 });
      } else { // Request for multiple universities with pagination
        const skip = (page - 1) * limit;
        const universities = await University.find(query)
          .sort({ name: 1 }) // Default sort by name
          .skip(skip)
          .limit(limit)
          .lean();

        const totalUniversities = await University.countDocuments(query);
        const totalPages = Math.ceil(totalUniversities / limit);

        console.log(`[API/UNIVERSITIES] Found ${universities.length} universities for query.`);

        return NextResponse.json({
          success: true,
          data: universities,
          pagination: {
            currentPage: page,
            totalPages,
            totalUniversities,
            limit,
          },
        }, { status: 200 });
      }
    }
  } catch (err: any) {
    console.error(`[API/UNIVERSITIES] Error fetching universities for URL ${requestUrl}:`, err);
    return NextResponse.json(
      { message: "Failed to fetch universities", error: err.message },
      { status: 500 }
    );
  }
}

// --- POST Handler (Admin: Create University) ---
export async function POST(request: NextRequest) {
  const requestUrl = request.url;
  console.log(`[API/UNIVERSITIES] POST request received for ${requestUrl} to create university`);

  try {
    await dbConnect();
    const body: IUniversity = await request.json();

    // **IMPORTANT**: Add validation for the body here (e.g., using Zod or Joi)
    // Example: const validationResult = universitySchema.safeParse(body);
    // if (!validationResult.success) {
    //   return NextResponse.json({ message: "Invalid input", errors: validationResult.error.issues }, { status: 400 });
    // }

    console.log("[API/UNIVERSITIES] Creating new university with data:", JSON.stringify(body));
    const newUniversity = await University.create(body);
    console.log("[API/UNIVERSITIES] Successfully created new university with ID:", newUniversity._id);

    return NextResponse.json({ success: true, message: "University created successfully", data: newUniversity }, { status: 201 });

  } catch (err: any) {
    console.error(`[API/UNIVERSITIES] Error creating university for URL ${requestUrl}:`, err);
    // Handle specific MongoDB errors like duplicate key
    if (err.code === 11000) {
      return NextResponse.json(
        { message: "Failed to create university: Duplicate key error.", error: err.keyValue },
        { status: 409 } // Conflict
      );
    }
    return NextResponse.json(
      { message: "Failed to create university", error: err.message },
      { status: 400 } // Bad Request, possibly validation error or other issues
    );
  }
}

// --- PUT Handler (Admin: Update University) ---
export async function PUT(request: NextRequest) {
  const requestUrl = request.url;
  console.log(`[API/UNIVERSITIES] PUT request received for ${requestUrl} to update university`);

  try {
    await dbConnect();
    const { searchParams } = new URL(requestUrl);
    const id = searchParams.get('id');

    if (!id) {
      console.log("[API/UNIVERSITIES] Missing university ID for PUT request.");
      return NextResponse.json({ message: "University ID is required for update" }, { status: 400 });
    }

    const body: Partial<IUniversity> = await request.json();

    // **IMPORTANT**: Add validation for the body here
    // if (Object.keys(body).length === 0) {
    //   return NextResponse.json({ message: "Request body cannot be empty for update" }, { status: 400 });
    // }

    console.log(`[API/UNIVERSITIES] Updating university with ID "${id}" with data:`, JSON.stringify(body));
    const updatedUniversity = await University.findByIdAndUpdate(id, body, { new: true, runValidators: true }).lean();

    if (!updatedUniversity) {
      console.log(`[API/UNIVERSITIES] University with ID "${id}" not found for update.`);
      return NextResponse.json({ message: "University not found" }, { status: 404 });
    }

    console.log(`[API/UNIVERSITIES] Successfully updated university with ID "${id}".`);
    return NextResponse.json({ success: true, message: "University updated successfully", data: updatedUniversity }, { status: 200 });

  } catch (err: any) {
    console.error(`[API/UNIVERSITIES] Error updating university for URL ${requestUrl}:`, err);
    if (err.kind === 'ObjectId') {
      return NextResponse.json({ message: "Invalid University ID format" }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Failed to update university", error: err.message },
      { status: 500 }
    );
  }
}

// --- DELETE Handler (Admin: Delete University) ---
export async function DELETE(request: NextRequest) {
  const requestUrl = request.url;
  console.log(`[API/UNIVERSITIES] DELETE request received for ${requestUrl} to delete university`);

  try {
    await dbConnect();
    const { searchParams } = new URL(requestUrl);
    const id = searchParams.get('id');

    if (!id) {
      console.log("[API/UNIVERSITIES] Missing university ID for DELETE request.");
      return NextResponse.json({ message: "University ID is required for deletion" }, { status: 400 });
    }

    console.log(`[API/UNIVERSITIES] Deleting university with ID "${id}".`);
    const deletedUniversity = await University.findByIdAndDelete(id).lean();

    if (!deletedUniversity) {
      console.log(`[API/UNIVERSITIES] University with ID "${id}" not found for deletion.`);
      return NextResponse.json({ message: "University not found" }, { status: 404 });
    }

    console.log(`[API/UNIVERSITIES] Successfully deleted university with ID "${id}".`);
    // You might want to remove associated courses or perform other cleanup here
    return NextResponse.json({ success: true, message: "University deleted successfully", data: { _id: id } }, { status: 200 });
    // Alternatively, return 204 No Content:
    // return new NextResponse(null, { status: 204 });

  } catch (err: any) {
    console.error(`[API/UNIVERSITIES] Error deleting university for URL ${requestUrl}:`, err);
    if (err.kind === 'ObjectId') {
      return NextResponse.json({ message: "Invalid University ID format" }, { status: 400 });
    }
    return NextResponse.json(
      { message: "Failed to delete university", error: err.message },
      { status: 500 }
    );
  }
}

/*
Important considerations for Admin Routes (POST, PUT, DELETE):

1.  **Authentication & Authorization**:
    * These admin routes should be protected. Ensure that only authenticated users with administrative privileges can access them.
    * You might use NextAuth.js or a similar library to handle sessions and role-based access control.
    * Inside each admin handler, you'd typically check the user's session and role before proceeding.

2.  **Input Validation**:
    * Always validate incoming data from `request.json()` before saving it to the database. Libraries like Zod or Joi are excellent for this. I've added comments as placeholders.

3.  **Error Handling**:
    * The provided error handling is basic. You might want to add more specific error codes or messages based on the type of error (e.g., validation errors, database errors).
    * For duplicate key errors (like unique university names), a 409 Conflict status code is more appropriate than a 400. (Added example in POST)

4.  **ID for PUT/DELETE**:
    * Using a query parameter `?id=` for PUT and DELETE is functional for a single route file.
    * A more RESTful approach for operations on a specific resource is to use path parameters (e.g., `app/api/universities/[id]/route.ts`). If you refactor to this structure, you'd get the `id` from the `params` argument of the handler function.

5.  **Cascade Deletes/Updates**:
    * When deleting a university, consider if you need to delete or update related data (e.g., courses associated with that university). This logic would go into the DELETE handler.

6.  **Logging**:
    * The detailed logging added is good for development and debugging. For production, you might want to adjust log levels or use a more structured logging solution.
*/