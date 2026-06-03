import { NextResponse } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const db = await getDb();
    const workoutsCollection = db.collection("workouts");

    // Fetch user workouts, sorted by date descending
    const workouts = await workoutsCollection
      .find({ userId: user.id })
      .sort({ date: -1 })
      .toArray();

    // Map _id to string for JSON safety
    const formattedWorkouts = workouts.map((w) => ({
      ...w,
      id: w._id.toString(),
      _id: undefined,
    }));

    return NextResponse.json({ workouts: formattedWorkouts });
  } catch (error: any) {
    console.error("GET workouts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to fetch workouts" },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { date, muscles, exercises } = await request.json();

    if (!date || !exercises) {
      return NextResponse.json(
        { error: "Date and exercises are required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const workoutsCollection = db.collection("workouts");

    // Update or insert the workout for this user on this date
    await workoutsCollection.updateOne(
      { userId: user.id, date },
      {
        $set: {
          userId: user.id,
          date,
          muscles: muscles || [],
          exercises: exercises || [],
          updatedAt: new Date(),
        },
      },
      { upsert: true }
    );

    return NextResponse.json({ success: true, message: "Workout saved successfully" });
  } catch (error: any) {
    console.error("POST workouts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to save workout" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const user = await getSessionUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const date = searchParams.get("date");

    if (!date) {
      return NextResponse.json(
        { error: "Date parameter is required" },
        { status: 400 }
      );
    }

    const db = await getDb();
    const workoutsCollection = db.collection("workouts");

    const result = await workoutsCollection.deleteOne({
      userId: user.id,
      date,
    });

    if (result.deletedCount === 0) {
      return NextResponse.json(
        { error: "Workout not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, message: "Workout deleted successfully" });
  } catch (error: any) {
    console.error("DELETE workouts error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete workout" },
      { status: 500 }
    );
  }
}
