import { getSessionUser } from "@/lib/auth";
import { getDb } from "@/lib/db";
import HomeClient from "./HomeClient";

// Opt into dynamic rendering to ensure cookies can be read on every request
export const dynamic = "force-dynamic";

export default async function Home() {
  const user = await getSessionUser();
  let workouts: any[] = [];

  if (user) {
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
      console.error("Error fetching workouts during SSR:", error);
    }
  }

  return <HomeClient initialUser={user} initialWorkouts={workouts} />;
}
