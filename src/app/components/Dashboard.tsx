"use client";

import { useState, useEffect, useRef } from "react";

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

interface DashboardProps {
  user: { id: string; email: string; username: string };
  initialWorkouts: Workout[];
  onLogout: () => void;
}

const MUSCLES = [
  { id: "chest", name: "Chest", icon: "💪" },
  { id: "back", name: "Back", icon: "🔙" },
  { id: "shoulders", name: "Shoulders", icon: "🏋️" },
  { id: "arms", name: "Arms", icon: "💪" },
  { id: "legs", name: "Legs", icon: "🦵" },
  { id: "core", name: "Core", icon: "⚡" },
  { id: "cardio", name: "Cardio", icon: "🏃" },
  { id: "fullbody", name: "Full Body", icon: "🔥" },
];

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

export default function Dashboard({ user, initialWorkouts, onLogout }: DashboardProps) {
  const [activePage, setActivePage] = useState<"today" | "history" | "stats">("today");
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  
  // Today's Session State
  const [currentSessionExercises, setCurrentSessionExercises] = useState<{
    [exId: string]: Set[];
  }>({});
  
  // Sets Editing Drawer State
  const [panelExId, setPanelExId] = useState<string | null>(null);
  const [panelSets, setPanelSets] = useState<Set[]>([]);
  const setsListRef = useRef<HTMLDivElement>(null);

  // Expanded History Days State
  const [expandedHistoryDays, setExpandedHistoryDays] = useState<{ [key: number]: boolean }>({});

  // Toast State
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: "" });
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  // Sync today's cached workout from initial database fetch if any
  useEffect(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const existingToday = workouts.find((w) => w.date === todayStr);
    if (existingToday) {
      const initialSession: { [key: string]: Set[] } = {};
      existingToday.exercises.forEach((ex) => {
        initialSession[ex.exId] = ex.sets;
      });
      setCurrentSessionExercises(initialSession);
    }
  }, [workouts]);

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => {
      setToast({ show: false, msg: "" });
    }, 2200);
  };

  const renderDateHeader = () => {
    const d = new Date();
    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()} ${d.getFullYear()}`;
  };

  // Sets Drawer Actions
  const openPanel = (exId: string) => {
    setPanelExId(exId);
    const existing = currentSessionExercises[exId];
    if (existing) {
      setPanelSets(JSON.parse(JSON.stringify(existing)));
    } else {
      setPanelSets([{ weight: "", reps: "", unit: "kg" }]);
    }
  };

  const closePanel = () => {
    setPanelExId(null);
  };

  const addSet = () => {
    const lastWeight = panelSets.length > 0 ? panelSets[panelSets.length - 1].weight : "";
    setPanelSets([...panelSets, { weight: lastWeight, reps: "", unit: "kg" }]);
    setTimeout(() => {
      if (setsListRef.current) {
        setsListRef.current.scrollTop = setsListRef.current.scrollHeight;
      }
    }, 50);
  };

  const removeSet = (index: number) => {
    const updated = panelSets.filter((_, i) => i !== index);
    setPanelSets(updated.length === 0 ? [{ weight: "", reps: "", unit: "kg" }] : updated);
  };

  const updateSetInput = (index: number, field: "weight" | "reps", value: string) => {
    const updated = [...panelSets];
    updated[index] = { ...updated[index], [field]: value };
    setPanelSets(updated);
  };

  const saveExerciseSets = () => {
    if (!panelExId) return;
    const validSets = panelSets.filter((s) => s.reps !== "");
    if (validSets.length === 0) {
      showToast("Add at least 1 set!");
      return;
    }

    setCurrentSessionExercises({
      ...currentSessionExercises,
      [panelExId]: validSets,
    });
    closePanel();
    showToast("Sets saved ✓");
  };

  const deleteExFromSession = (exId: string) => {
    const updated = { ...currentSessionExercises };
    delete updated[exId];
    setCurrentSessionExercises(updated);
  };

  // Workout DB Sync Actions
  const saveWorkout = async () => {
    const keys = Object.keys(currentSessionExercises);
    if (keys.length === 0) {
      showToast("No exercises logged!");
      return;
    }

    const todayKey = new Date().toISOString().slice(0, 10);
    const musclesList = Array.from(
      new Set(
        keys.map((id) => {
          const ex = getExById(id);
          return ex?.muscle || "";
        })
      )
    ).filter(Boolean);

    const workoutPayload = {
      date: todayKey,
      muscles: musclesList,
      exercises: keys.map((id) => ({
        exId: id,
        sets: currentSessionExercises[id],
      })),
    };

    try {
      const res = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(workoutPayload),
      });

      if (!res.ok) throw new Error("Failed to save workout to cloud");

      // Reload workouts list
      const fetchRes = await fetch("/api/workouts");
      const fetchData = await fetchRes.json();
      if (fetchData.workouts) {
        setWorkouts(fetchData.workouts);
      }

      setCurrentSessionExercises({});
      setSelectedMuscle(null);
      showToast("Workout synced to Cloud! 💪");
    } catch (err: any) {
      showToast(err.message || "Error syncing workout");
    }
  };

  const deleteWorkout = async (dateStr: string) => {
    try {
      const res = await fetch(`/api/workouts?date=${dateStr}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete workout");

      setWorkouts(workouts.filter((w) => w.date !== dateStr));
      showToast("Workout deleted");
    } catch (err: any) {
      showToast(err.message || "Error deleting workout");
    }
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        onLogout();
      }
    } catch (err) {
      showToast("Logout failed");
    }
  };

  // Analytics Helpers
  const getPreviousWeekData = () => {
    const todayKey = new Date().toISOString().slice(0, 10);
    const today = new Date(todayKey);

    const targetWorkouts = workouts.filter((w) => {
      if (w.date === todayKey) return false;
      const d = new Date(w.date);
      const diff = (today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24);
      return diff >= 6 && diff <= 8; // target 7 days ago +/- 1 day
    });

    const map: { [key: string]: Set[] } = {};
    targetWorkouts.forEach((w) => {
      w.exercises.forEach((ex) => {
        map[ex.exId] = ex.sets;
      });
    });
    return map;
  };

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

  const toggleHistoryDay = (index: number) => {
    setExpandedHistoryDays({
      ...expandedHistoryDays,
      [index]: !expandedHistoryDays[index],
    });
  };

  const stats = getStats();
  const prevWeekData = getPreviousWeekData();
  const selectedExs = selectedMuscle ? EXERCISES[selectedMuscle] || [] : [];
  const currentSessionKeys = Object.keys(currentSessionExercises);

  return (
    <div className="flex flex-col flex-1 items-center justify-start min-h-screen bg-bg text-text pb-20 select-none">
      
      {/* Toast Alert */}
      <div
        className={`fixed bottom-[74px] left-1/2 -translate-x-1/2 bg-accent text-bg px-5 py-2.5 rounded-custom font-sans font-bold text-xs uppercase tracking-widest z-[200] transition-all duration-300 pointer-events-none ${
          toast.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {toast.msg}
      </div>

      {/* Main Container simulating web-app shell */}
      <div className="w-full max-w-md bg-bg flex flex-col min-h-screen relative border-x border-border/20 shadow-2xl">
        
        {/* Header bar (sticky) */}
        <header className="sticky top-0 bg-bg border-b border-border/80 p-4 pb-3.5 z-40 flex items-center justify-between">
          <div>
            <span className="text-[10px] tracking-widest text-text2 font-bold uppercase block mb-0.5">
              {activePage === "today" && "Today's Lift Session"}
              {activePage === "history" && "History Logs"}
              {activePage === "stats" && "Progress Analytics"}
            </span>
            <h1 className="font-sans font-extrabold text-2xl tracking-wider text-text leading-none uppercase">
              {activePage === "today" && (
                <>
                  IRON <span className="text-accent">LOG</span>
                </>
              )}
              {activePage === "history" && (
                <>
                  PAST <span className="text-accent">SESSIONS</span>
                </>
              )}
              {activePage === "stats" && (
                <>
                  ATHLETE <span className="text-accent">STATS</span>
                </>
              )}
            </h1>
          </div>
          <button
            onClick={handleLogout}
            className="border border-border text-[9px] hover:border-accent2 hover:text-accent2 text-text2 uppercase tracking-widest py-1.5 px-3.5 rounded-custom font-bold transition-all active:scale-95 cursor-pointer bg-bg2"
          >
            Logout
          </button>
        </header>

        {/* Dynamic page content */}
        <main className="flex-1 flex flex-col p-4">
          
          {/* TODAY PAGE */}
          {activePage === "today" && (
            <div className="flex flex-col gap-4">
              
              {/* Hello user, date */}
              <div className="flex justify-between items-center bg-bg2 border border-border p-3.5 rounded-custom">
                <div>
                  <h2 className="text-sm font-extrabold tracking-wide uppercase">
                    Hello, <span className="text-accent">{user.username}</span>
                  </h2>
                  <p className="text-[10px] text-text3 font-semibold uppercase mt-0.5 tracking-wider">
                    {renderDateHeader()}
                  </p>
                </div>
                <div className="w-8 h-8 rounded-full bg-accent/10 border border-accent/20 flex items-center justify-center text-sm">
                  💪
                </div>
              </div>

              {/* Muscle Selector */}
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-text3 uppercase block mb-2">
                  Select Muscle Group
                </span>
                <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none">
                  {MUSCLES.map((m) => (
                    <button
                      key={m.id}
                      onClick={() => setSelectedMuscle(selectedMuscle === m.id ? null : m.id)}
                      className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 border rounded-custom font-sans font-bold text-xs uppercase tracking-wide transition-all active:scale-95 cursor-pointer ${
                        selectedMuscle === m.id
                          ? "bg-accent border-accent text-bg"
                          : "bg-card border-border text-text2 hover:text-text"
                      }`}
                    >
                      <span>{m.icon}</span>
                      {m.name}
                    </button>
                  ))}
                </div>
              </div>

              {/* Exercises list based on selected muscle */}
              {selectedMuscle && (
                <div>
                  <span className="text-[10px] font-extrabold tracking-widest text-text3 uppercase block mb-2">
                    Available Exercises
                  </span>
                  <div className="grid grid-cols-2 gap-2.5">
                    {selectedExs.map((ex) => {
                      const setsLogged = currentSessionExercises[ex.id];
                      const isLogged = !!setsLogged;
                      return (
                        <div
                          key={ex.id}
                          onClick={() => openPanel(ex.id)}
                          className={`bg-card border rounded-custom p-3.5 flex flex-col items-center justify-center text-center cursor-pointer transition-all active:scale-97 relative overflow-hidden group ${
                            isLogged ? "border-accent/40 bg-accent/[0.02]" : "border-border"
                          }`}
                        >
                          <div className="text-3xl mb-2 bg-bg3 w-12 h-12 flex items-center justify-center rounded-custom group-hover:scale-105 transition-transform">
                            {ex.icon}
                          </div>
                          <span className="font-sans font-bold text-[11px] tracking-wide uppercase leading-tight text-text">
                            {ex.name}
                          </span>
                          <span className="text-[9px] text-text3 uppercase tracking-wider mt-0.5">
                            {ex.muscle}
                          </span>
                          
                          {/* Count badge */}
                          {isLogged && (
                            <div className="absolute top-1.5 right-1.5 w-5 h-5 bg-accent text-bg rounded-full flex items-center justify-center font-extrabold text-[10px]">
                              {setsLogged.length}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Today's logged session list */}
              {currentSessionKeys.length > 0 && (
                <div className="mt-2">
                  <span className="text-[10px] font-extrabold tracking-widest text-text3 uppercase block mb-2.5">
                    Today's Session Log
                  </span>
                  <div className="flex flex-col gap-2">
                    {currentSessionKeys.map((exId) => {
                      const ex = getExById(exId);
                      const sets = currentSessionExercises[exId];
                      const totalVol = sets.reduce(
                        (acc, s) => acc + (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0),
                        0
                      );

                      // Last week comparison
                      const prevSets = prevWeekData[exId];
                      let comparisonBadge = null;
                      if (prevSets) {
                        const prevVol = prevSets.reduce(
                          (acc, s) => acc + (parseFloat(s.weight) || 0) * (parseFloat(s.reps) || 0),
                          0
                        );
                        if (totalVol > prevVol) {
                          comparisonBadge = (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-accent/10 text-accent uppercase tracking-wider">
                              ▲ vs last
                            </span>
                          );
                        } else if (totalVol < prevVol) {
                          comparisonBadge = (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-accent2/10 text-accent2 uppercase tracking-wider">
                              ▼ vs last
                            </span>
                          );
                        } else {
                          comparisonBadge = (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.5 rounded bg-bg4 text-text3 uppercase tracking-wider">
                              = same
                            </span>
                          );
                        }
                      }

                      return (
                        <div key={exId} className="bg-card border border-border rounded-custom overflow-hidden">
                          <div
                            onClick={() => openPanel(exId)}
                            className="p-3.5 flex items-center justify-between cursor-pointer border-b border-border/40 hover:bg-bg2/40 transition-colors"
                          >
                            <div className="flex items-center gap-3">
                              <div className="text-xl bg-bg3 w-10 h-10 flex items-center justify-center rounded-custom">
                                {ex?.icon || "🏋️"}
                              </div>
                              <div>
                                <h3 className="font-sans font-bold text-xs uppercase tracking-wide flex items-center gap-1.5">
                                  {ex?.name || exId}
                                  {comparisonBadge}
                                </h3>
                                <p className="text-[10px] text-text2 uppercase tracking-wider mt-0.5">
                                  {sets.length} Sets • {totalVol > 0 ? `${totalVol}kg Volume` : "Bodyweight"}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                deleteExFromSession(exId);
                              }}
                              className="w-8 h-8 text-text3 hover:text-accent2 flex items-center justify-center rounded-custom hover:bg-bg3 transition-all cursor-pointer"
                            >
                              🗑
                            </button>
                          </div>
                          <div className="p-3 bg-bg2/30 flex flex-wrap gap-1.5">
                            {sets.map((s, idx) => (
                              <span
                                key={idx}
                                className="text-[10px] bg-bg3 border border-border/80 px-2.5 py-1.5 rounded-custom font-sans font-semibold text-text2 uppercase tracking-wide"
                              >
                                Set {idx + 1}: {s.weight || "0"}kg × {s.reps}
                              </span>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Finish workout button */}
              <button
                onClick={saveWorkout}
                className={`w-full mt-4 bg-accent hover:bg-accent/95 text-bg py-4 font-sans font-extrabold tracking-widest text-sm uppercase rounded-custom transition-all duration-300 active:scale-98 cursor-pointer shadow-lg shadow-accent/10 ${
                  currentSessionKeys.length > 0 ? "scale-100 opacity-100" : "scale-95 opacity-0 pointer-events-none h-0 mt-0 py-0"
                }`}
              >
                ✓ Finish Session & Save
              </button>
            </div>
          )}

          {/* HISTORY PAGE */}
          {activePage === "history" && (
            <div className="flex flex-col gap-3">
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
          )}

          {/* STATS PAGE */}
          {activePage === "stats" && (
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
          )}
        </main>

        {/* BOTTOM NAVIGATION (fixed to shell container) */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-bg2 border-t border-border flex z-50">
          <button
            onClick={() => {
              setActivePage("today");
              closePanel();
            }}
            className={`flex-1 py-3 px-1 flex flex-col items-center gap-1 cursor-pointer font-sans font-bold text-[9px] uppercase tracking-wider transition-colors active:scale-95 ${
              activePage === "today" ? "text-accent" : "text-text3 hover:text-text2"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5.5 h-5.5 stroke-[1.8]">
              <rect x="3" y="3" width="8" height="8" rx="1" />
              <rect x="13" y="3" width="8" height="8" rx="1" />
              <rect x="3" y="13" width="8" height="8" rx="1" />
              <rect x="13" y="13" width="8" height="8" rx="1" />
            </svg>
            Today
          </button>

          <button
            onClick={() => {
              setActivePage("history");
              closePanel();
            }}
            className={`flex-1 py-3 px-1 flex flex-col items-center gap-1 cursor-pointer font-sans font-bold text-[9px] uppercase tracking-wider transition-colors active:scale-95 ${
              activePage === "history" ? "text-accent" : "text-text3 hover:text-text2"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5.5 h-5.5 stroke-[1.8]">
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            History
          </button>

          <button
            onClick={() => {
              setActivePage("stats");
              closePanel();
            }}
            className={`flex-1 py-3 px-1 flex flex-col items-center gap-1 cursor-pointer font-sans font-bold text-[9px] uppercase tracking-wider transition-colors active:scale-95 ${
              activePage === "stats" ? "text-accent" : "text-text3 hover:text-text2"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5.5 h-5.5 stroke-[1.8]">
              <path d="M3 17l5-5 4 4 9-10" />
            </svg>
            Stats
          </button>
        </nav>

        {/* SETS LOGGING DRAWER (Bottom Panel) */}
        <div
          className={`fixed bottom-[60px] left-0 right-0 max-w-md mx-auto bg-bg2 border-t-2 border-accent p-5 pb-6 z-[60] transition-transform duration-300 ease-out shadow-2xl flex flex-col gap-4 ${
            panelExId ? "translate-y-0" : "translate-y-full"
          }`}
        >
          {panelExId && (
            <>
              {/* Drawer Header */}
              <div className="flex justify-between items-center">
                <h3 className="font-sans font-extrabold text-lg uppercase tracking-wide flex items-center gap-2">
                  <span>{getExById(panelExId)?.icon}</span>
                  <span>{getExById(panelExId)?.name}</span>
                </h3>
                <button
                  onClick={closePanel}
                  className="w-7 h-7 text-text3 hover:text-accent2 flex items-center justify-center rounded-custom hover:bg-bg3 font-bold transition-all cursor-pointer"
                >
                  ✕
                </button>
              </div>

              {/* Sets Rows */}
              <div ref={setsListRef} className="max-h-[220px] overflow-y-auto flex flex-col gap-2 scrollbar-thin pr-1">
                {panelSets.map((set, idx) => (
                  <div key={idx} className="grid grid-cols-[32px_1fr_1fr_36px] gap-2.5 items-center bg-bg3 border border-border/40 rounded-custom p-2">
                    <div className="font-sans font-black text-lg text-text3 text-center">
                      {idx + 1}
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] text-text3 font-extrabold uppercase tracking-wider">
                        Weight (kg)
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        value={set.weight}
                        onChange={(e) => updateSetInput(idx, "weight", e.target.value)}
                        className="bg-bg4 border border-border focus:border-accent text-text text-sm font-bold text-center rounded px-2 py-2 outline-none w-full"
                      />
                    </div>

                    <div className="flex flex-col gap-0.5">
                      <span className="text-[8px] text-text3 font-extrabold uppercase tracking-wider">
                        Reps
                      </span>
                      <input
                        type="number"
                        placeholder="0"
                        value={set.reps}
                        onChange={(e) => updateSetInput(idx, "reps", e.target.value)}
                        className="bg-bg4 border border-border focus:border-accent text-text text-sm font-bold text-center rounded px-2 py-2 outline-none w-full"
                      />
                    </div>

                    <button
                      onClick={() => removeSet(idx)}
                      className="w-7 h-7 text-text3 hover:text-accent2 hover:bg-bg4 border border-border/30 rounded flex items-center justify-center font-bold text-xs transition-all cursor-pointer self-end"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex gap-2">
                <button
                  onClick={addSet}
                  className="flex-1 bg-bg3 border border-border text-text2 hover:text-text font-sans font-bold text-xs uppercase tracking-wider py-3 rounded-custom transition-all active:scale-97 cursor-pointer"
                >
                  + Add Set
                </button>
                <button
                  onClick={saveExerciseSets}
                  className="flex-1 bg-accent hover:bg-accent/95 text-bg font-sans font-bold text-xs uppercase tracking-wider py-3 rounded-custom transition-all active:scale-97 cursor-pointer"
                >
                  Save Sets
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
