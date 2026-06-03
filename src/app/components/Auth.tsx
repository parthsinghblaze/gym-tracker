"use client";

import { useState } from "react";

interface AuthProps {
  onSuccess: (user: { id: string; email: string; username: string }) => void;
}

export default function Auth({ onSuccess }: AuthProps) {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email || !password) {
      setError("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setLoading(true);

    try {
      const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Authentication failed");
      }

      if (data.success && data.user) {
        onSuccess(data.user);
      }
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col flex-1 items-center justify-center min-h-screen bg-bg text-text px-4">
      {/* Container simulating a mobile device layout on desktop */}
      <div className="w-full max-w-md bg-bg2 border border-border rounded-custom p-6 shadow-2xl relative overflow-hidden flex flex-col justify-between min-h-[580px]">
        
        {/* Sleek background gradient glow */}
        <div className="absolute top-[-100px] left-[-100px] w-[300px] height-[300px] bg-accent/5 rounded-full blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[-100px] right-[-100px] w-[300px] height-[300px] bg-accent2/5 rounded-full blur-[80px] pointer-events-none" />

        {/* Brand Header */}
        <div className="text-center my-6">
          <h1 className="font-sans font-extrabold text-5xl tracking-widest text-text leading-none uppercase">
            IRON <span className="text-accent">LOG</span>
          </h1>
          <p className="text-[10px] tracking-[0.3em] uppercase text-text3 mt-2">
            Track. Lift. Progress.
          </p>
        </div>

        {/* Motivational Tagline */}
        <div className="bg-bg3 border border-border/50 rounded-custom p-3 text-center my-2">
          <p className="text-xs text-text2 italic">
            {isLogin
              ? "“The only bad workout is the one that didn't happen.”"
              : "“Success isn't given. It's earned. In the gym. With sweat.”"}
          </p>
        </div>

        {/* Auth Forms */}
        <form onSubmit={handleSubmit} className="flex-1 flex flex-col justify-center gap-4 mt-4">
          {error && (
            <div className="bg-accent2/10 border border-accent2/20 text-accent2 text-xs rounded-custom p-3 font-semibold text-center animate-pulse">
              ⚠️ {error}
            </div>
          )}

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold tracking-wider uppercase text-text3">
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. lifter@iron.com"
              className="w-full bg-bg4 border border-border focus:border-accent text-text rounded-custom px-3 py-3 outline-none text-sm transition-all placeholder:text-text3"
              required
              disabled={loading}
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[10px] font-bold tracking-wider uppercase text-text3">
              Password (Min 8 Chars)
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-bg4 border border-border focus:border-accent text-text rounded-custom px-3 py-3 outline-none text-sm transition-all placeholder:text-text3"
              required
              disabled={loading}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 bg-accent hover:bg-accent/90 disabled:bg-accent/50 text-bg py-3.5 font-bold tracking-wider rounded-custom uppercase text-sm shadow-lg shadow-accent/15 transition-all active:scale-[0.98] cursor-pointer flex items-center justify-center gap-2"
          >
            {loading ? (
              <span className="w-4 h-4 border-2 border-bg border-t-transparent rounded-full animate-spin" />
            ) : isLogin ? (
              "Access Account"
            ) : (
              "Create Profile"
            )}
          </button>
        </form>

        {/* Toggle Login/Signup */}
        <div className="mt-8 text-center border-t border-border/40 pt-4">
          <p className="text-xs text-text2">
            {isLogin ? "New to the iron temple?" : "Already a member of the guild?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsLogin(!isLogin);
                setError("");
              }}
              className="text-accent hover:underline font-bold focus:outline-none bg-none border-none p-0 cursor-pointer"
            >
              {isLogin ? "Sign Up Now" : "Log In"}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
