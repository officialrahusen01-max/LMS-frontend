"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  LogOut,
  FolderOpen,
  User,
  Award,
  FileText,
  PlusCircle,
  List,
  HelpCircle,
  GraduationCap,
  Users,
  Megaphone,
} from "lucide-react";
import { useAuthStore } from "@/lib/auth-store";
import { cn } from "@/lib/utils";

type Role = "student" | "instructor" | "admin";

/** Same asset as marketing header (`app/page.tsx`, about, contact). */
const PROJECT_LOGO_SRC = "/images/logo2.png";

/** Matches `app/student/layout.js` navbar texture (primary bar + subtle grid). */
const STUDENT_NAV_PATTERN_BG = `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`;

const dashboardHomeByRole: Record<Role, string> = {
  student: "/student/dashboard",
  instructor: "/dashboard/instructor",
  admin: "/dashboard/admin",
};

const navByRole: Record<Role, { name: string; href: string; icon: React.ReactNode }[]> = {
  student: [
    { name: "Dashboard", href: "/student/dashboard", icon: <LayoutDashboard size={20} /> },
    { name: "My Courses", href: "/student/cours", icon: <BookOpen size={20} /> },
    { name: "Browse Courses", href: "/dashboard/courses", icon: <FolderOpen size={20} /> },
    { name: "Certificates", href: "/student/certificates", icon: <Award size={20} /> },
    { name: "Blogs", href: "/student/blogs", icon: <FileText size={20} /> },
    { name: "Help", href: "/student/help", icon: <HelpCircle size={20} /> },
    { name: "Profile", href: "/student/profile", icon: <User size={20} /> },
  ],
  instructor: [
    { name: "Dashboard", href: "/dashboard/instructor", icon: <LayoutDashboard size={20} /> },
    { name: "My teaching", href: "/dashboard/my-courses", icon: <BookOpen size={20} /> },
    { name: "Create Course", href: "/dashboard/courses/new", icon: <PlusCircle size={20} /> },
    { name: "Browse Courses", href: "/dashboard/courses", icon: <FolderOpen size={20} /> },
    { name: "My Blogs", href: "/dashboard/blogs/mine", icon: <List size={20} /> },
    { name: "Blogs", href: "/dashboard/blogs", icon: <FileText size={20} /> },
    { name: "Student view", href: "/student", icon: <GraduationCap size={20} /> },
    { name: "Profile", href: "/dashboard/profile", icon: <User size={20} /> },
  ],
  admin: [
    { name: "Dashboard", href: "/dashboard/admin", icon: <LayoutDashboard size={20} /> },
    { name: "Instructors", href: "/dashboard/admin/instructors", icon: <Users size={20} /> },
    { name: "Students", href: "/dashboard/admin/students", icon: <GraduationCap size={20} /> },
    { name: "Certificates", href: "/dashboard/admin/certificates", icon: <Award size={20} /> },
    { name: "Institution updates", href: "/dashboard/admin/institution-updates", icon: <Megaphone size={20} /> },
    { name: "All courses", href: "/dashboard/courses", icon: <FolderOpen size={20} /> },
    { name: "Blogs", href: "/dashboard/blogs", icon: <FileText size={20} /> },
    { name: "Profile", href: "/dashboard/profile", icon: <User size={20} /> },
  ],
};

/** Longest matching nav href wins (e.g. /dashboard/blogs/mine over /dashboard/blogs). */
function getActiveNavHref(pathname: string, items: { href: string }[]): string | null {
  let best: string | null = null;
  for (const { href } of items) {
    if (pathname === href || pathname.startsWith(`${href}/`)) {
      if (!best || href.length > best.length) best = href;
    }
  }
  return best;
}

export default function DashboardSidebar() {
  const pathname = usePathname();
  const user = useAuthStore((s) => s.user);
  const logout = useAuthStore((s) => s.logout);
  const primaryRole = useAuthStore((s) => s.primaryRole()) ?? "student";
  const nav = navByRole[primaryRole as Role] ?? navByRole.student;
  const activeHref = getActiveNavHref(pathname, nav);
  const homeHref = dashboardHomeByRole[primaryRole as Role] ?? dashboardHomeByRole.student;

  return (
    <aside className="relative flex h-screen w-60 shrink-0 flex-col overflow-hidden border-r border-primary-foreground/10 shadow-[4px_0_30px_-4px_rgba(0,0,0,0.22)] lg:w-64">
      <div className="absolute inset-0 bg-primary" aria-hidden />
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{ backgroundImage: STUDENT_NAV_PATTERN_BG }}
        aria-hidden
      />
      <div
        className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary-foreground/[0.12] via-transparent to-primary-foreground/[0.06]"
        aria-hidden
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/[0.14] to-transparent" aria-hidden />
      <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-foreground/20 to-transparent" aria-hidden />

      <div className="relative z-10 flex min-h-0 flex-1 flex-col">
        <div className="border-b border-primary-foreground/10 px-4 py-4">
          <Link href={homeHref} className="group/logo mb-3 block" aria-label="AiNextro LMS — home">
            <div className="rounded-2xl bg-gradient-to-br from-primary-foreground/35 via-primary-foreground/15 to-primary-foreground/8 p-[2px] shadow-[0_8px_28px_-8px_rgba(0,0,0,0.45)] ring-1 ring-primary-foreground/10 transition-shadow group-hover/logo:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.5)]">
              <div className="relative overflow-hidden rounded-[14px] bg-gradient-to-b from-black/55 via-black/40 to-black/30 px-3 py-2 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.12)] ring-1 ring-primary-foreground/25 backdrop-blur-sm">
                <div className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent" aria-hidden />
                <div className="relative mx-auto h-8 w-full max-w-[200px]">
                  <Image
                    src={PROJECT_LOGO_SRC}
                    alt=""
                    fill
                    className="object-contain object-left brightness-110 contrast-105 drop-shadow-[0_1px_2px_rgba(0,0,0,0.85)] transition-transform duration-300 group-hover/logo:scale-[1.03]"
                    sizes="224px"
                    priority
                  />
                </div>
              </div>
            </div>
          </Link>
          <div className="min-w-0">
            <h2 className="text-sm font-semibold tracking-wide text-primary-foreground">
              {primaryRole === "admin" ? "Admin" : primaryRole === "instructor" ? "Instructor" : "Student"} Panel
            </h2>
            <p className="mt-0.5 truncate text-xs text-primary-foreground/75">
              {user?.fullName || user?.publicUsername || "LMS"}
            </p>
          </div>
        </div>

        <nav className="min-h-0 flex-1 overflow-y-auto py-3">
          <ul className="space-y-1 px-2">
            {nav.map((item) => {
              const isActive = activeHref === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-primary-foreground text-primary shadow-md shadow-black/15"
                        : "text-primary-foreground/90 hover:bg-primary-foreground/14 hover:text-primary-foreground",
                    )}
                  >
                    <span className="shrink-0 opacity-95 [&_svg]:stroke-[2]">{item.icon}</span>
                    <span>{item.name}</span>
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <div className="border-t border-primary-foreground/10 p-2">
          <button
            type="button"
            onClick={() => logout()}
            className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-primary-foreground/85 transition-colors hover:bg-red-500/15 hover:text-red-100"
          >
            <LogOut size={20} className="shrink-0 opacity-95" strokeWidth={2} />
            Logout
          </button>
        </div>
      </div>
    </aside>
  );
}
