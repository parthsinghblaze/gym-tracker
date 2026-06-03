"use client";

import { useState } from "react";
import Auth from "./components/Auth";
import Dashboard from "./components/Dashboard";

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

interface User {
  id: string;
  email: string;
  username: string;
}

interface HomeClientProps {
  initialUser: User | null;
  initialWorkouts: Workout[];
}

export default function HomeClient({ initialUser, initialWorkouts }: HomeClientProps) {
  const [user, setUser] = useState<User | null>(initialUser);
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [loading, setLoading] = useState(false);

  const handleAuthSuccess = async (authenticatedUser: User) => {
    setUser(authenticatedUser);
    setLoading(true);
    try {
      const res = await fetch("/api/workouts");
      if (res.ok) {
        const data = await res.json();
        if (data.workouts) {
          setWorkouts(data.workouts);
        }
      }
    } catch (err) {
      console.error("Failed to load workouts after login:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setWorkouts([]);
  };

  if (loading) {
    return (
      <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-bg text-text">
        <div className="w-10 h-10 border-4 border-accent border-t-transparent rounded-full animate-spin mb-4" />
        <p className="text-xs uppercase tracking-widest text-text2 font-bold animate-pulse">
          Entering the Iron Temple...
        </p>
      </div>
    );
  }

  if (!user) {
    return <Auth onSuccess={handleAuthSuccess} />;
  }

  return (
    <Dashboard user={user} initialWorkouts={workouts} onLogout={handleLogout} />
  );
}
