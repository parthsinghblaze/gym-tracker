"use client";

import { useState } from "react";

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

interface StatsClientProps {
  initialWorkouts: Workout[];
}

export default function StatsClient({ initialWorkouts }: StatsClientProps) {
  const [workouts] = useState<Workout[]>(initialWorkouts);

  const getStats = () => {
    const totalWorkouts = workouts.length;
    let totalSets = 0;
    let totalVol = 0;

    workouts.forEach((w) => {
      w.exercises.forEach((ex) => {
        totalSets += ex.sets.length;
        ex.sets.forEach((s) => {
          const wNum = parseFloat(s.weight) || 0;
          const rNum = parseFloat(s.reps) || 0;
          totalVol += wNum * rNum;
        });
      });
    });

    // Streak
    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const dateSet = new Set(workouts.map((w) => w.date));
    for (let i = 0; i < 365; i++) {
      const d = new Date(today);
      d.setDate(d.getDate() - i);
      const dStr = d.toISOString().slice(0, 10);
      if (dateSet.has(dStr)) {
        streak++;
      } else {
        // If they haven't logged today yet, let the streak continue from yesterday
        if (i === 0) continue;
        break;
      }
    }

    // Last 7 days volume chart
    const days = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];
    const last7 = Array.from({ length: 7 }, (_, i) => {
      const d = new Date(today);
      d.setDate(d.getDate() - (6 - i));
      const key = d.toISOString().slice(0, 10);
      const w = workouts.find((work) => work.date === key);
      let vol = 0;
      if (w) {
        w.exercises.forEach((ex) => {
          ex.sets.forEach((s) => {
            vol += (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0);
          });
        });
      }
      return { label: days[d.getDay()], vol, active: !!w };
    });

    const maxVol = Math.max(...last7.map((d) => d.vol), 1);

    // Most trained muscle
    const muscleCount: { [key: string]: number } = {};
    workouts.forEach((w) => {
      w.muscles.forEach((m) => {
        muscleCount[m] = (muscleCount[m] || 0) + 1;
      });
    });
    const sortedMuscles = Object.entries(muscleCount).sort((a, b) => b[1] - a[1]);
    const topMuscle = sortedMuscles.length > 0 ? sortedMuscles[0] : null;

    return {
      totalWorkouts,
      totalSets,
      totalVol,
      streak,
      last7,
      maxVol,
      topMuscle,
    };
  };

  const stats = getStats();

  return (
    <div className="flex flex-col gap-4">
      {workouts.length === 0 ? (
        <div className="text-center py-16 text-text3 border border-dashed border-border rounded-custom bg-card">
          <div className="text-5xl opacity-40 mb-3">📊</div>
          <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-text2">
            No stats available
          </h3>
          <p className="text-[10px] uppercase tracking-widest mt-1">
            Log workout sessions to unlock analytics!
          </p>
        </div>
      ) : (
        <>
          {/* Streak Card */}
          <div className="bg-gradient-to-br from-accent/10 to-accent/5 border border-accent/20 rounded-custom p-5 flex items-center gap-5">
            <span className="text-5xl animate-bounce">🔥</span>
            <div>
              <span className="text-5xl font-sans font-black text-accent tracking-tighter block leading-none">
                {stats.streak}
              </span>
              <span className="text-[10px] text-text2 font-bold uppercase tracking-widest mt-1 block">
                Day Workout Streak
              </span>
            </div>
          </div>

          {/* Grid stats */}
          <div className="grid grid-cols-2 gap-3">
            <div className="bg-card border border-border rounded-custom p-4 flex flex-col justify-between">
              <span className="text-[9px] text-text3 font-extrabold uppercase tracking-widest block">
                Workouts
              </span>
              <span className="text-4xl font-sans font-black text-accent tracking-tight block mt-1.5 leading-none">
                {stats.totalWorkouts}
              </span>
              <span className="text-[10px] text-text2 block mt-1 uppercase tracking-wide">
                Total Sessions
              </span>
            </div>

            <div className="bg-card border border-border rounded-custom p-4 flex flex-col justify-between">
              <span className="text-[9px] text-text3 font-extrabold uppercase tracking-widest block">
                Total Sets
              </span>
              <span className="text-4xl font-sans font-black text-accent tracking-tight block mt-1.5 leading-none">
                {stats.totalSets}
              </span>
              <span className="text-[10px] text-text2 block mt-1 uppercase tracking-wide">
                All-Time Logs
              </span>
            </div>

            <div className="bg-card border border-border rounded-custom p-4 flex flex-col justify-between">
              <span className="text-[9px] text-text3 font-extrabold uppercase tracking-widest block">
                Est. Volume
              </span>
              <span className="text-4xl font-sans font-black text-accent tracking-tight block mt-1.5 leading-none">
                {stats.totalVol > 999
                  ? `${(stats.totalVol / 1000).toFixed(1)}k`
                  : stats.totalVol.toFixed(0)}
              </span>
              <span className="text-[10px] text-text2 block mt-1 uppercase tracking-wide">
                kg Lifted Total
              </span>
            </div>

            <div className="bg-card border border-border rounded-custom p-4 flex flex-col justify-between">
              <span className="text-[9px] text-text3 font-extrabold uppercase tracking-widest block">
                Top Muscle
              </span>
              <span className="text-2xl font-sans font-black text-accent tracking-tight block mt-1.5 leading-none truncate uppercase">
                {stats.topMuscle ? stats.topMuscle[0] : "—"}
              </span>
              <span className="text-[10px] text-text2 block mt-1 uppercase tracking-wide">
                {stats.topMuscle ? `${stats.topMuscle[1]} Sessions` : "No sessions logged"}
              </span>
            </div>
          </div>

          {/* Volume Chart */}
          <div className="bg-card border border-border rounded-custom p-4.5">
            <span className="text-[10px] text-text2 font-bold uppercase tracking-wider block mb-4">
              Last 7 Days — Volume (kg)
            </span>
            <div className="flex items-end gap-2.5 h-[100px] pb-1 border-b border-border/40">
              {stats.last7.map((d, index) => {
                const h = (d.vol / stats.maxVol) * 80;
                return (
                  <div key={index} className="flex-1 flex flex-col items-center gap-1.5 group">
                    <div className="w-full relative flex flex-col justify-end h-[80px]">
                      {/* Volume tooltip */}
                      {d.vol > 0 && (
                        <div className="absolute bottom-full left-1/2 -translate-x-1/2 bg-accent text-bg font-bold text-[8px] px-1 rounded opacity-0 group-hover:opacity-100 transition-opacity mb-1 pointer-events-none whitespace-nowrap z-10">
                          {d.vol.toFixed(0)}kg
                        </div>
                      )}
                      <div
                        style={{ height: `${Math.max(4, h)}px` }}
                        className={`w-full rounded-t-sm transition-all duration-500 ${
                          d.active ? "bg-accent" : "bg-bg4"
                        }`}
                      />
                    </div>
                    <span className="text-[9px] text-text3 font-bold uppercase tracking-wider">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
