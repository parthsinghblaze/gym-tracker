"use client";

import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";

interface DashboardLayoutClientProps {
  children: React.ReactNode;
}

export default function DashboardLayoutClient({ children }: DashboardLayoutClientProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [toast, setToast] = useState<{ show: boolean; msg: string }>({ show: false, msg: "" });

  const showToast = (msg: string) => {
    setToast({ show: true, msg });
    setTimeout(() => {
      setToast({ show: false, msg: "" });
    }, 2200);
  };

  const handleLogout = async () => {
    try {
      const res = await fetch("/api/auth/logout", { method: "POST" });
      if (res.ok) {
        router.push("/login");
        router.refresh();
      }
    } catch {
      showToast("Logout failed");
    }
  };

  // Determine header titles based on route
  let activePageTitle = "Today's Lift Session";
  let titleMarkup = (
    <>
      IRON <span className="text-accent">LOG</span>
    </>
  );

  if (pathname === "/history") {
    activePageTitle = "History Logs";
    titleMarkup = (
      <>
        PAST <span className="text-accent">SESSIONS</span>
      </>
    );
  } else if (pathname === "/stats") {
    activePageTitle = "Progress Analytics";
    titleMarkup = (
      <>
        ATHLETE <span className="text-accent">STATS</span>
      </>
    );
  }

  return (
    <div className="flex flex-col flex-1 items-center justify-start min-h-screen bg-bg text-text pb-20 select-none w-full">
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
              {activePageTitle}
            </span>
            <h1 className="font-sans font-extrabold text-2xl tracking-wider text-text leading-none uppercase">
              {titleMarkup}
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
          {children}
        </main>

        {/* BOTTOM NAVIGATION */}
        <nav className="fixed bottom-0 left-0 right-0 max-w-md mx-auto bg-bg2 border-t border-border flex z-50">
          <Link
            href="/"
            className={`flex-1 py-3 px-1 flex flex-col items-center gap-1 cursor-pointer font-sans font-bold text-[9px] uppercase tracking-wider transition-colors active:scale-95 ${
              pathname === "/" ? "text-accent" : "text-text3 hover:text-text2"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5.5 h-5.5 stroke-[1.8]">
              <rect x="3" y="3" width="8" height="8" rx="1" />
              <rect x="13" y="3" width="8" height="8" rx="1" />
              <rect x="3" y="13" width="8" height="8" rx="1" />
              <rect x="13" y="13" width="8" height="8" rx="1" />
            </svg>
            Today
          </Link>

          <Link
            href="/history"
            className={`flex-1 py-3 px-1 flex flex-col items-center gap-1 cursor-pointer font-sans font-bold text-[9px] uppercase tracking-wider transition-colors active:scale-95 ${
              pathname === "/history" ? "text-accent" : "text-text3 hover:text-text2"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5.5 h-5.5 stroke-[1.8]">
              <path d="M12 8v4l3 3" />
              <circle cx="12" cy="12" r="9" />
            </svg>
            History
          </Link>

          <Link
            href="/stats"
            className={`flex-1 py-3 px-1 flex flex-col items-center gap-1 cursor-pointer font-sans font-bold text-[9px] uppercase tracking-wider transition-colors active:scale-95 ${
              pathname === "/stats" ? "text-accent" : "text-text3 hover:text-text2"
            }`}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" className="w-5.5 h-5.5 stroke-[1.8]">
              <path d="M3 17l5-5 4 4 9-10" />
            </svg>
            Stats
          </Link>
        </nav>
      </div>
    </div>
  );
}
