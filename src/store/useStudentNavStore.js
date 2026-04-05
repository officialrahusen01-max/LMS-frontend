"use client";

import React from "react";
import { create } from "zustand";
import { LayoutDashboard, BookOpen, FileText, Users } from "lucide-react";

const useStudentNavStore = create((set) => ({
  nav: [
    { name: "Dashboard", id: "dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "Courses", id: "cours", icon: <BookOpen size={20} /> },
    { name: "Blog", id: "bloog", icon: <FileText size={20} /> },
    { name: "Student List", id: "studentlist", icon: <Users size={20} /> },
  ],
  activeComponent: "dashboard",
  setActiveComponent: (id) => set({ activeComponent: id }),
}));

export default useStudentNavStore;

