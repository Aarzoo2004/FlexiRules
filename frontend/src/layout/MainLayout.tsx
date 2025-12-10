// src/layout/MainLayout.tsx
import React from "react";

type MainLayoutProps = {
  children: React.ReactNode;
};

const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="bg-gradient-to-r from-indigo-950 via-indigo-700 to-indigo-500 text-white shadow">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-xl md:text-2xl font-semibold tracking-tight">
              Rules Engine Admin
            </h1>
            <p className="text-xs md:text-sm text-indigo-100 mt-1">
              Configure business rules without changing backend code.
            </p>
          </div>

          {/* Simple nav placeholder */}
          <nav className="hidden md:flex items-center gap-2 text-sm">
            <button className="px-3 py-1 rounded-full bg-white/10 border border-white/20 hover:bg-white/15 transition">
              Rules
            </button>
            <button className="px-3 py-1 rounded-full border border-white/20 hover:bg-white/10 transition">
              Create Rule
            </button>
            <button className="px-3 py-1 rounded-full border border-pink-300/60 text-pink-100 hover:bg-pink-500/20 transition">
              Test Engine
            </button>
          </nav>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-5xl mx-auto px-4 py-6 md:py-8">
        {/* Little “page frame” card */}
        <div className="bg-white shadow-sm rounded-2xl border border-slate-200/80 p-4 md:p-6">
          {children}
        </div>
      </main>
    </div>
  );
};

export default MainLayout;
