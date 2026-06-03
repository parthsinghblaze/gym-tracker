"use client";

import { useState, useRef } from "react";
import { useRouter } from "next/navigation";

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

interface HistoryClientProps {
  initialWorkouts: Workout[];
}

const EXERCISES: { [key: string]: Array<{ id: string; name: string; icon: string; muscle: string }> } = {
  chest: [
    { id: "bench_press", name: "Bench Press", icon: "🏋️", muscle: "Chest" },
    { id: "incline_bench", name: "Incline Bench", icon: "📐", muscle: "Chest" },
    { id: "cable_fly", name: "Cable Fly", icon: "🔁", muscle: "Chest" },
    { id: "chest_dip", name: "Chest Dip", icon: "⬇️", muscle: "Chest" },
    { id: "push_up", name: "Push Up", icon: "⬆️", muscle: "Chest" },
    { id: "pec_deck", name: "Pec Deck", icon: "🎯", muscle: "Chest" },
  ],
  back: [
    { id: "deadlift", name: "Deadlift", icon: "🏋️", muscle: "Back" },
    { id: "pull_up", name: "Pull Up", icon: "⬆️", muscle: "Back" },
    { id: "bent_row", name: "Bent Over Row", icon: "↩️", muscle: "Back" },
    { id: "lat_pulldown", name: "Lat Pulldown", icon: "⬇️", muscle: "Back" },
    { id: "seated_cable", name: "Seated Cable Row", icon: "🔁", muscle: "Back" },
    { id: "tbar_row", name: "T-Bar Row", icon: "🔤", muscle: "Back" },
  ],
  shoulders: [
    { id: "ohp", name: "Overhead Press", icon: "🔝", muscle: "Shoulders" },
    { id: "lateral_raise", name: "Lateral Raise", icon: "↔️", muscle: "Shoulders" },
    { id: "front_raise", name: "Front Raise", icon: "⬆️", muscle: "Shoulders" },
    { id: "face_pull", name: "Face Pull", icon: "😤", muscle: "Shoulders" },
    { id: "shrug", name: "Shrugs", icon: "🤷", muscle: "Shoulders" },
    { id: "arnold_press", name: "Arnold Press", icon: "🌀", muscle: "Shoulders" },
  ],
  arms: [
    { id: "barbell_curl", name: "Barbell Curl", icon: "💪", muscle: "Biceps" },
    { id: "hammer_curl", name: "Hammer Curl", icon: "🔨", muscle: "Biceps" },
    { id: "tricep_push", name: "Tricep Pushdown", icon: "⬇️", muscle: "Triceps" },
    { id: "skull_crusher", name: "Skull Crusher", icon: "💀", muscle: "Triceps" },
    { id: "dip", name: "Dips", icon: "⬇️", muscle: "Triceps" },
    { id: "preacher_curl", name: "Preacher Curl", icon: "🙏", muscle: "Biceps" },
  ],
  legs: [
    { id: "squat", name: "Squat", icon: "🦵", muscle: "Quads" },
    { id: "leg_press", name: "Leg Press", icon: "🔄", muscle: "Quads" },
    { id: "rdl", name: "Romanian DL", icon: "🏋️", muscle: "Hamstrings" },
    { id: "lunges", name: "Lunges", icon: "🚶", muscle: "Quads" },
    { id: "leg_curl", name: "Leg Curl", icon: "🌀", muscle: "Hamstrings" },
    { id: "calf_raise", name: "Calf Raise", icon: "👟", muscle: "Calves" },
  ],
  core: [
    { id: "plank", name: "Plank", icon: "⬜", muscle: "Core" },
    { id: "crunch", name: "Crunches", icon: "↩️", muscle: "Core" },
    { id: "leg_raise", name: "Leg Raise", icon: "⬆️", muscle: "Core" },
    { id: "russian_twist", name: "Russian Twist", icon: "🌀", muscle: "Core" },
    { id: "cable_crunch", name: "Cable Crunch", icon: "🔁", muscle: "Core" },
    { id: "ab_wheel", name: "Ab Wheel", icon: "⚙️", muscle: "Core" },
  ],
  cardio: [
    { id: "treadmill", name: "Treadmill", icon: "🏃", muscle: "Cardio" },
    { id: "cycling", name: "Cycling", icon: "🚴", muscle: "Cardio" },
    { id: "rowing", name: "Rowing", icon: "🚣", muscle: "Cardio" },
    { id: "jump_rope", name: "Jump Rope", icon: "🪢", muscle: "Cardio" },
    { id: "stair_climb", name: "Stair Climb", icon: "🪜", muscle: "Cardio" },
    { id: "hiit", name: "HIIT", icon: "⚡", muscle: "Cardio" },
  ],
  fullbody: [
    { id: "clean_jerk", name: "Clean & Jerk", icon: "🏋️", muscle: "Full" },
    { id: "snatch", name: "Snatch", icon: "⬆️", muscle: "Full" },
    { id: "burpee", name: "Burpees", icon: "🔥", muscle: "Full" },
    { id: "thruster", name: "Thrusters", icon: "🚀", muscle: "Full" },
    { id: "kb_swing", name: "KB Swing", icon: "🔔", muscle: "Full" },
    { id: "box_jump", name: "Box Jump", icon: "📦", muscle: "Full" },
  ],
};

function getExById(id: string) {
  for (const g of Object.values(EXERCISES)) {
    const f = g.find((e) => e.id === id);
    if (f) return f;
  }
  return null;
}

export default function HistoryClient({ initialWorkouts }: HistoryClientProps) {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [expandedHistoryDays, setExpandedHistoryDays] = useState<{ [key: number]: boolean }>({});
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: "" });
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast({ show: false, msg: "" });
    }, 2200);
  };

  const toggleHistoryDay = (index: number) => {
    setExpandedHistoryDays({
      ...expandedHistoryDays,
      [index]: !expandedHistoryDays[index],
    });
  };

  const deleteWorkout = async (dateStr: string) => {
    try {
      const res = await fetch(`/api/workouts?date=${dateStr}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete workout");

      // Refresh server components and update local workouts state
      router.refresh();
      setWorkouts(workouts.filter((w) => w.date !== dateStr));
      showToast("Workout deleted");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error deleting workout";
      showToast(message);
    }
  };

  return (
    <div className="flex flex-col gap-3 relative">
      {/* Toast Alert */}
      <div
        className={`fixed bottom-[74px] left-1/2 -translate-x-1/2 bg-accent text-bg px-5 py-2.5 rounded-custom font-sans font-bold text-xs uppercase tracking-widest z-[200] transition-all duration-300 pointer-events-none ${
          toast.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {toast.msg}
      </div>

      {workouts.length === 0 ? (
        <div className="text-center py-16 text-text3 border border-dashed border-border rounded-custom bg-card">
          <div className="text-5xl opacity-40 mb-3">📅</div>
          <h3 className="font-sans font-bold text-sm uppercase tracking-wider text-text2">
            No logged history
          </h3>
          <p className="text-[10px] uppercase tracking-widest mt-1">
            Complete your first workout to see logs!
          </p>
        </div>
      ) : (
        workouts.map((w, wIdx) => {
          const d = new Date(w.date);
          const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
          const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
          const dateString = `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
          
          const isToday = w.date === new Date().toISOString().slice(0, 10);
          const totalSets = w.exercises.reduce((acc, ex) => acc + ex.sets.length, 0);
          const totalVol = w.exercises.reduce((acc, ex) => {
            return (
              acc +
              ex.sets.reduce(
                (setsAcc, s) => setsAcc + (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0),
                0
              )
            );
          }, 0);

          // Volume comparison against historical same weekday
          const prevSameDay = workouts.find((pw, pi) => {
            if (pi <= wIdx) return false;
            return new Date(pw.date).getDay() === d.getDay();
          });

          return (
            <div key={w.date} className="border border-border rounded-custom bg-card overflow-hidden">
              <div
                onClick={() => toggleHistoryDay(wIdx)}
                className="p-4 flex items-center justify-between cursor-pointer bg-bg2/40 hover:bg-bg2/80 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-sans font-bold text-xs uppercase tracking-wide">
                      {dateString}
                    </span>
                    {isToday && (
                      <span className="bg-accent text-bg text-[8px] font-extrabold px-1 py-0.5 rounded uppercase tracking-widest">
                        Today
                      </span>
                    )}
                  </div>
                  <p className="text-[10px] text-text2 mt-1 uppercase tracking-wider">
                    {w.exercises.length} Exercises • {totalSets} Sets{" "}
                    {totalVol > 0 && `• ${totalVol}kg Vol`}
                  </p>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {w.muscles.map((m) => (
                      <span
                        key={m}
                        className="text-[9px] bg-bg3 border border-border/50 text-text3 px-2 py-0.5 rounded font-bold uppercase tracking-wider"
                      >
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="flex items-center gap-3.5">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      deleteWorkout(w.date);
                    }}
                    className="text-[9px] border border-border/80 hover:border-accent2 hover:text-accent2 text-text3 uppercase font-bold py-1 px-2.5 rounded transition-all cursor-pointer"
                  >
                    Delete
                  </button>
                  <span
                    className={`text-sm transition-transform ${
                      expandedHistoryDays[wIdx] ? "rotate-180" : ""
                    }`}
                  >
                    ▼
                  </span>
                </div>
              </div>

              {expandedHistoryDays[wIdx] && (
                <div className="p-4 bg-bg2/10 border-t border-border/30 flex flex-col gap-4">
                  {w.exercises.map((e) => {
                    const ex = getExById(e.exId);
                    const vol = e.sets.reduce(
                      (acc, s) => acc + (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0),
                      0
                    );

                    let compLabel = null;
                    if (prevSameDay) {
                      const pe = prevSameDay.exercises.find((pex) => pex.exId === e.exId);
                      if (pe) {
                        const pvol = pe.sets.reduce(
                          (acc, s) => acc + (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0),
                          0
                        );
                        if (vol > pvol) {
                          compLabel = (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-accent/10 text-accent uppercase tracking-wider">
                              ▲ +{(vol - pvol).toFixed(0)}kg
                            </span>
                          );
                        } else if (vol < pvol) {
                          compLabel = (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-accent2/10 text-accent2 uppercase tracking-wider">
                              ▼ -{(pvol - vol).toFixed(0)}kg
                            </span>
                          );
                        } else {
                          compLabel = (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-bg4 text-text3 uppercase tracking-wider">
                              =
                            </span>
                          );
                        }
                      }
                    }

                    return (
                      <div key={e.exId} className="flex flex-col gap-1.5">
                        <div className="font-sans font-bold text-xs uppercase tracking-wide flex items-center gap-2">
                          <span>{ex?.icon || "🏋️"}</span>
                          <span>{ex?.name || e.exId}</span>
                          {compLabel}
                        </div>
                        <div className="flex flex-wrap gap-1">
                          {e.sets.map((s, sIdx) => (
                            <span
                              key={sIdx}
                              className="text-[10px] bg-bg3 border border-border/40 text-text2 px-2 py-1 rounded font-semibold uppercase tracking-wide"
                            >
                              S{sIdx + 1}: {s.weight || "0"}×{s.reps}
                            </span>
                          ))}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          );
        })
      )}
    </div>
  );
}
