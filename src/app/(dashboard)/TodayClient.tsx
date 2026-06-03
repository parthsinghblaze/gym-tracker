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

interface User {
  id: string;
  email: string;
  username: string;
}

interface TodayClientProps {
  user: User;
  initialWorkouts: Workout[];
}

const MUSCLES = [
  { id: "chest", name: "Chest", icon: "💪" },
  { id: "back", name: "Back", icon: "🔙" },
  { id: "shoulders", name: "Shoulders", icon: "🏋️" },
  { id: "biceps", name: "Biceps", icon: "💪" },
  { id: "triceps", name: "Triceps", icon: "🦾" },
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
  biceps: [
    { id: "barbell_curl", name: "Barbell Curl", icon: "💪", muscle: "Biceps" },
    { id: "hammer_curl", name: "Hammer Curl", icon: "🔨", muscle: "Biceps" },
    { id: "preacher_curl", name: "Preacher Curl", icon: "🙏", muscle: "Biceps" },
    { id: "concentration_curl", name: "Concentration Curl", icon: "🎯", muscle: "Biceps" },
    { id: "incline_curl", name: "Incline Curl", icon: "📐", muscle: "Biceps" },
    { id: "cable_curl", name: "Cable Curl", icon: "🔁", muscle: "Biceps" },
  ],
  triceps: [
    { id: "tricep_push", name: "Tricep Pushdown", icon: "⬇️", muscle: "Triceps" },
    { id: "skull_crusher", name: "Skull Crusher", icon: "💀", muscle: "Triceps" },
    { id: "dip", name: "Dips", icon: "⬇️", muscle: "Triceps" },
    { id: "overhead_ext", name: "Overhead Extension", icon: "🔝", muscle: "Triceps" },
    { id: "close_grip_bench", name: "Close Grip Bench", icon: "🏋️", muscle: "Triceps" },
    { id: "tricep_kickback", name: "Tricep Kickback", icon: "↩️", muscle: "Triceps" },
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

export default function TodayClient({ user, initialWorkouts }: TodayClientProps) {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>(initialWorkouts);
  const [selectedMuscle, setSelectedMuscle] = useState<string | null>(null);
  
  // Today's Session State
  const [currentSessionExercises, setCurrentSessionExercises] = useState<{
    [exId: string]: Set[];
  }>(() => {
    const todayStr = new Date().toISOString().slice(0, 10);
    const existingToday = initialWorkouts.find((w) => w.date === todayStr);
    if (existingToday) {
      const initialSession: { [key: string]: Set[] } = {};
      existingToday.exercises.forEach((ex) => {
        initialSession[ex.exId] = ex.sets;
      });
      return initialSession;
    }
    return {};
  });
  
  // Sets Editing Drawer State
  const [panelExId, setPanelExId] = useState<string | null>(null);
  const [lastExId, setLastExId] = useState<string | null>(null);
  const [panelSets, setPanelSets] = useState<Set[]>([]);
  const setsListRef = useRef<HTMLDivElement>(null);

  // Toast State
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: "" });
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

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
    setLastExId(exId);
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

      // Reload workouts list and refresh NextJS server components
      router.refresh();
      const fetchRes = await fetch("/api/workouts");
      const fetchData = await fetchRes.json();
      if (fetchData.workouts) {
        setWorkouts(fetchData.workouts);
      }

      setCurrentSessionExercises({});
      setSelectedMuscle(null);
      showToast("Workout synced to Cloud! 💪");
    } catch (err) {
      const message = err instanceof Error ? err.message : "Error syncing workout";
      showToast(message);
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

  const prevWeekData = getPreviousWeekData();
  const selectedExs = selectedMuscle ? EXERCISES[selectedMuscle] || [] : [];
  const currentSessionKeys = Object.keys(currentSessionExercises);

  return (
    <div className="flex flex-col gap-4 relative">
      
      {/* Toast Alert */}
      <div
        className={`fixed bottom-[74px] left-1/2 -translate-x-1/2 bg-accent text-bg px-5 py-2.5 rounded-custom font-sans font-bold text-xs uppercase tracking-widest z-[200] transition-all duration-300 pointer-events-none ${
          toast.show ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {toast.msg}
      </div>

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
            Today&apos;s Session Log
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

      {/* SETS LOGGING DRAWER (Bottom Panel) */}
      <div
        className={`fixed bottom-[60px] left-0 right-0 max-w-md mx-auto bg-bg2 border-t-2 border-accent p-5 pb-6 z-[60] transition-transform duration-300 ease-out shadow-2xl flex flex-col gap-4 ${
          panelExId ? "" : "pointer-events-none"
        }`}
        style={{
          transform: panelExId ? "translateY(0)" : "translateY(calc(100% + 60px))",
        }}
      >
        {(() => {
          const displayExId = panelExId || lastExId;
          const displayEx = displayExId ? getExById(displayExId) : null;
          if (!displayEx) return null;
          return (
            <>
              {/* Drawer Header */}
              <div className="flex justify-between items-center">
                <h3 className="font-sans font-extrabold text-lg uppercase tracking-wide flex items-center gap-2">
                  <span>{displayEx.icon}</span>
                  <span>{displayEx.name}</span>
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
          );
        })()}
      </div>
    </div>
  );
}
