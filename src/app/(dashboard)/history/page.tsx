import { getSessionUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { redirect } from "next/navigation";
import HistoryClient from "./HistoryClient";

export const dynamic = "force-dynamic";

interface Set {
  weight: string;
  reps: string;
  unit: string;
}

interface WorkoutExercise {
  exId: string;
  sets: Set[];
}

interface Workout {
  id?: string;
  date: string;
  muscles: string[];
  exercises: WorkoutExercise[];
}

export default async function HistoryPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  let workouts: Workout[] = [];
  try {
    const db = await getDb();
    const rawWorkouts = await db
      .collection("workouts")
      .find({ userId: user.id })
      .sort({ date: -1 })
      .toArray();

    workouts = rawWorkouts.map((w) => ({
      id: w._id.toString(),
      date: w.date,
      muscles: w.muscles || [],
      exercises: w.exercises || [],
    }));
  } catch (error) {
    console.error("Error fetching workouts on HistoryPage:", error);
  }

  return <HistoryClient initialWorkouts={workouts} />;
}
