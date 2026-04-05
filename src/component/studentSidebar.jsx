"use client";

import React from "react";
import useStudentNavStore from "@/src/store/useStudentNavStore";

const StudentSidebar = () => {
  const { nav, activeComponent, setActiveComponent } = useStudentNavStore();

  return (
    <aside className="w-60 lg:w-64 h-screen border-r bg-white/90 backdrop-blur-sm shadow-sm flex flex-col">
      <div className="px-4 py-4 border-b">
        <h2 className="text-sm font-semibold text-slate-700 tracking-wide">
          Student Panel
        </h2>
        <p className="text-xs text-slate-400">Navigate your LMS</p>
      </div>

      <nav className="flex-1 overflow-y-auto py-3">
        <ul className="space-y-1 px-2">
          {nav.map((item) => {
            const isActive = activeComponent === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => setActiveComponent(item.id)}
                  className={`w-full flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors ${
                    isActive
                      ? "bg-slate-900 text-white shadow-sm"
                      : "text-slate-600 hover:bg-slate-100"
                  }`}
                >
                  <span className="text-slate-500">{item.icon}</span>
                  <span>{item.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </aside>
  );
};

export default StudentSidebar;

