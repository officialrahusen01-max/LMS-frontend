"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  BookOpen,
  Menu,
  X,
  Award,
  Mail,
  Phone,
  Loader2,
  User,
  Home,
  LayoutDashboard,
  FileText,
  Users,
  Sparkles,
  HelpCircle,
  ChevronDown,
  ArrowUpRight,
  GraduationCap,
} from "lucide-react";
import StudentChatWidget from "@/components/student-chat-widget";
import { StudentThemeToggle } from "@/components/student-theme-toggle";
import { StudentNotifications } from "@/components/student-notifications";
import {
  StudentLearnMegaMenuDesktop,
  StudentLearnMegaMenuMobile,
} from "@/components/student-learn-mega-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

/** Top bar: essentials only — logo already = Home */
const primaryNavLinks = [
  { label: "My Learning", href: "/student/dashboard", Icon: LayoutDashboard },
  { label: "Courses", href: "/student/cours", Icon: BookOpen },
  { label: "Certificates", href: "/student/certificates", Icon: Award },
];

const moreNavLinks = [
  { label: "Blog", href: "/student/blogs", Icon: FileText },
  { label: "Help", href: "/student/help", Icon: HelpCircle },
  { label: "Students", href: "/student/studentlist", Icon: Users },
];

/** Mobile drawer: full list */
const mobileNavLinks = [
  { label: "Home", href: "/student", Icon: Home },
  ...primaryNavLinks,
  ...moreNavLinks,
];

const profileNav = { label: "Profile", href: "/student/profile", Icon: User };

function isNavActive(pathname, href) {
  if (!pathname || !href) return false;
  if (href === "/student") return pathname === "/student";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function StudentLayout({ children }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [allowed, setAllowed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const token = typeof window !== "undefined" ? localStorage.getItem("accessToken") : null;
    if (!token) {
      router.replace("/login");
      return;
    }
    setAllowed(true);
  }, [router]);

  if (!allowed) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background gap-4">
        <Loader2 className="h-10 w-10 animate-spin text-primary" />
        <p className="text-sm text-muted-foreground">Checking login…</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-background font-sans overflow-x-hidden">
      <header className="fixed top-0 left-0 right-0 z-[70] border-b border-primary-foreground/10 shadow-[0_4px_30px_-4px_rgba(0,0,0,0.25)]">
        <div className="absolute inset-0 bg-primary" />
        <div
          className="absolute inset-0 opacity-[0.06]"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-br from-primary-foreground/[0.12] via-transparent to-primary-foreground/[0.06] pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/[0.12] to-transparent pointer-events-none" />
        <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-primary-foreground/25 to-transparent pointer-events-none" />

        <div className="relative z-10 mx-auto w-full max-w-[1600px] px-4 sm:px-6 lg:px-10">
          <div className="flex h-16 w-full items-center gap-4 sm:h-[4.75rem] lg:h-20 lg:gap-6">
            {/* Left: logo (home) — fixed width, no overlap */}
            <div className="flex shrink-0 items-center">
              <Link href="/student" className="group/logo flex shrink-0 items-center gap-2.5 sm:gap-3">
                {/* Logo — gradient frame + glass + hover shimmer */}
                <div className="relative">
                  <div
                    className="absolute -inset-1.5 rounded-2xl bg-gradient-to-br from-primary-foreground/30 via-primary-foreground/12 to-primary-foreground/5 opacity-70 blur-lg transition-all duration-500 group-hover/logo:opacity-100 group-hover/logo:blur-xl"
                    aria-hidden
                  />
                  <div className="relative rounded-2xl bg-gradient-to-br from-primary-foreground/40 via-primary-foreground/18 to-primary-foreground/8 p-[2px] shadow-[0_12px_40px_-12px_rgba(0,0,0,0.45)] ring-1 ring-primary-foreground/10 transition-shadow duration-300 group-hover/logo:shadow-[0_16px_48px_-8px_rgba(0,0,0,0.5)] group-hover/logo:ring-primary-foreground/20">
                    {/* Dark inner well — light / white logo text clearly readable on primary nav */}
                    <div className="relative flex items-center justify-center overflow-hidden rounded-[14px] bg-gradient-to-b from-black/55 via-black/40 to-black/30 px-3 py-2 shadow-[inset_0_1px_0_rgb(255_255_255_/_0.14),inset_0_-1px_0_rgb(0_0_0_/_0.35)] ring-1 ring-primary-foreground/25 backdrop-blur-md sm:px-4 sm:py-2.5 lg:rounded-[15px] lg:py-3">
                      <div
                        className="pointer-events-none absolute inset-x-3 top-0 h-px bg-gradient-to-r from-transparent via-white/35 to-transparent"
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute -bottom-8 left-1/2 h-16 w-32 -translate-x-1/2 rounded-full bg-primary-foreground/8 blur-2xl"
                        aria-hidden
                      />
                      <div
                        className="pointer-events-none absolute -left-1/2 top-0 h-full w-1/2 skew-x-[-18deg] bg-gradient-to-r from-transparent via-white/15 to-transparent opacity-0 transition-all duration-700 ease-out group-hover/logo:translate-x-[220%] group-hover/logo:opacity-100"
                        aria-hidden
                      />
                      <img
                        src="/images/logo2.png"
                        alt="AiNextro LMS"
                        className="relative z-10 h-9 w-32 object-contain brightness-110 contrast-105 drop-shadow-[0_1px_2px_rgba(0,0,0,0.9),0_0_1px_rgba(255,255,255,0.35)] transition-transform duration-300 group-hover/logo:scale-[1.04] sm:h-11 sm:w-40 lg:h-12 lg:w-44"
                      />
                    </div>
                  </div>
                </div>
                <span className="hidden lg:inline-flex items-center gap-1.5 rounded-full border border-primary-foreground/25 bg-primary-foreground/12 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground shadow-sm shadow-black/10 backdrop-blur-sm">
                  <Sparkles className="h-3 w-3 shrink-0 text-primary-foreground/90 drop-shadow-sm" />
                  Student
                </span>
              </Link>
            </div>

            {/* Center: Learn + main links + More — khula spacing, no cramped scroll */}
            <nav className="relative hidden min-w-0 flex-1 items-center justify-center md:flex">
              <div className="flex flex-wrap items-center justify-center gap-2 lg:gap-4 xl:gap-5">
                <StudentLearnMegaMenuDesktop />
                {primaryNavLinks.map((item) => {
                  const active = isNavActive(pathname, item.href);
                  const Icon = item.Icon;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={cn(
                        "flex shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 lg:px-5 lg:py-3 lg:text-[15px]",
                        active
                          ? "bg-primary-foreground text-primary shadow-md shadow-black/15"
                          : "text-primary-foreground/90 hover:bg-primary-foreground/14 hover:text-primary-foreground",
                      )}
                    >
                      <Icon className="h-[18px] w-[18px] shrink-0 opacity-95 lg:h-5 lg:w-5" strokeWidth={2} />
                      <span className="whitespace-nowrap">{item.label}</span>
                    </Link>
                  );
                })}

                <DropdownMenu>
                  <DropdownMenuTrigger
                    className={cn(
                      "flex shrink-0 items-center gap-1.5 rounded-full border border-primary-foreground/20 bg-primary-foreground/8 px-4 py-2.5 text-sm font-medium text-primary-foreground/95 outline-none transition-all hover:bg-primary-foreground/14 lg:px-5 lg:py-3 lg:text-[15px] data-[state=open]:bg-primary-foreground/18",
                    )}
                  >
                    More
                    <ChevronDown className="h-4 w-4 opacity-90" strokeWidth={2} />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="center"
                    className="z-[80] min-w-[11rem] rounded-xl border-border p-1.5 shadow-xl"
                  >
                    {moreNavLinks.map((item) => {
                      const Icon = item.Icon;
                      return (
                        <DropdownMenuItem key={item.href} asChild className="rounded-lg cursor-pointer">
                          <Link href={item.href} className="flex items-center gap-2">
                            <Icon className="h-4 w-4" />
                            {item.label}
                          </Link>
                        </DropdownMenuItem>
                      );
                    })}
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </nav>

            {/* Right: profile, then notifications, theme last — pinned to edge */}
            <div className="ml-auto flex shrink-0 items-center gap-2 border-l border-primary-foreground/20 pl-3 sm:gap-3 sm:pl-4 lg:pl-6">
              <Link
                href={profileNav.href}
                aria-label="Profile"
                className={cn(
                  "hidden md:flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-200 lg:h-11 lg:w-11",
                  isNavActive(pathname, profileNav.href)
                    ? "border-primary-foreground bg-primary-foreground/20 text-primary-foreground shadow-[0_0_0_2px_rgba(255,255,255,0.1)]"
                    : "border-primary-foreground/30 bg-primary-foreground/10 text-primary-foreground/95 hover:border-primary-foreground/50 hover:bg-primary-foreground/18",
                )}
              >
                <User className="h-[18px] w-[18px] lg:h-5 lg:w-5" strokeWidth={2} />
              </Link>
              <StudentNotifications />
              <StudentThemeToggle />
              <button
                type="button"
                onClick={() => setMobileMenuOpen((o) => !o)}
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground transition-colors hover:bg-primary-foreground/18 md:hidden"
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={mobileMenuOpen}
              >
                {mobileMenuOpen ? <X size={22} strokeWidth={2} /> : <Menu size={22} strokeWidth={2} />}
              </button>
            </div>
          </div>

          {mobileMenuOpen && (
            <div className="animate-in fade-in slide-in-from-top-2 md:hidden border-t border-primary-foreground/15 duration-200">
              <div className="mx-0 mt-3 mb-4 rounded-2xl border border-primary-foreground/15 bg-primary-foreground/[0.08] p-2 shadow-inner backdrop-blur-md">
                <nav className="flex flex-col gap-0.5">
                  <StudentLearnMegaMenuMobile onNavigate={() => setMobileMenuOpen(false)} />
                  {mobileNavLinks.map((item) => {
                    const active = isNavActive(pathname, item.href);
                    const Icon = item.Icon;
                    return (
                      <Link
                        key={item.href}
                        href={item.href}
                        onClick={() => setMobileMenuOpen(false)}
                        className={cn(
                          "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                          active
                            ? "bg-primary-foreground text-primary"
                            : "text-primary-foreground/90 hover:bg-primary-foreground/10",
                        )}
                      >
                        <Icon className="h-5 w-5 shrink-0 opacity-90" />
                        {item.label}
                      </Link>
                    );
                  })}
                  <Link
                    href={profileNav.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-semibold transition-colors",
                      isNavActive(pathname, profileNav.href)
                        ? "bg-primary-foreground text-primary"
                        : "text-primary-foreground/90 hover:bg-primary-foreground/10",
                    )}
                  >
                    <User className="h-5 w-5 shrink-0 opacity-90" />
                    {profileNav.label}
                  </Link>
                  <Link
                    href="/"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mt-1 flex items-center gap-3 rounded-xl border border-primary-foreground/15 px-3 py-3 text-sm font-medium text-primary-foreground/85 hover:bg-primary-foreground/10"
                  >
                    Main site
                  </Link>
                </nav>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* pt = header bar height (h-16 / sm:4.75rem / lg:5rem) — gap nahi */}
      <main className="relative flex-1 pt-16 sm:pt-[4.75rem] lg:pt-20">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-10 bg-gradient-to-b from-primary/[0.12] via-primary/[0.04] to-transparent sm:h-12"
        />
        <div className="pointer-events-none absolute inset-x-0 top-0 z-[1] h-px bg-gradient-to-r from-transparent via-primary/25 to-transparent opacity-60" />
        <div className="relative z-0">{children}</div>
      </main>

      <footer className="relative mt-auto shrink-0 overflow-hidden border-t border-primary/10 bg-gradient-to-b from-muted/45 via-card to-card dark:from-muted/12 dark:via-card dark:to-card">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.2] dark:opacity-[0.12]"
          aria-hidden
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23000' fill-opacity='0.06'%3E%3Cpath d='M20 20h20v20H20zM0 0h20v20H0z'/%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
        <div
          className="pointer-events-none absolute -left-32 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-primary/15 blur-3xl dark:bg-primary/10"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute -right-24 bottom-0 h-48 w-48 rounded-full bg-primary/10 blur-3xl dark:bg-primary/8"
          aria-hidden
        />
        <div className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-14 lg:px-8 lg:py-16">
          <div className="grid gap-10 sm:gap-12 lg:grid-cols-12 lg:gap-10">
            {/* Brand */}
            <div className="lg:col-span-4">
              <div className="rounded-2xl border border-border/80 bg-gradient-to-br from-card via-card to-muted/25 p-6 shadow-md ring-1 ring-primary/5 dark:to-muted/15">
                <div className="flex items-start gap-4">
                  <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/30">
                    <GraduationCap className="h-7 w-7" strokeWidth={2} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-lg font-bold tracking-tight text-foreground sm:text-xl">AiNextro LMS</p>
                    <p className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/8 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-widest text-primary dark:bg-primary/15">
                      <Sparkles className="h-3 w-3" />
                      Student hub
                    </p>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-relaxed text-muted-foreground">
                  <span className="font-semibold text-foreground">Learn · Grow · Certify.</span> Courses, progress, and
                  certificates — one calm place to level up your skills.
                </p>
              </div>
            </div>

            {/* Contact */}
            <div className="lg:col-span-4">
              <h4 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                <span className="h-px w-8 bg-gradient-to-r from-primary/60 to-transparent" aria-hidden />
                Contact
              </h4>
              <ul className="space-y-2.5">
                <li>
                  <a
                    href="tel:+919772609110"
                    className="group flex items-center gap-3 rounded-xl border border-transparent bg-muted/40 px-4 py-3 text-sm text-foreground transition-all hover:border-primary/20 hover:bg-muted/60 dark:bg-muted/20 dark:hover:bg-muted/30"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary group-hover:bg-primary/18">
                      <Phone className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="font-medium">9772609110</span>
                  </a>
                </li>
                <li>
                  <a
                    href="tel:+919660439686"
                    className="group flex items-center gap-3 rounded-xl border border-transparent bg-muted/40 px-4 py-3 text-sm text-foreground transition-all hover:border-primary/20 hover:bg-muted/60 dark:bg-muted/20 dark:hover:bg-muted/30"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary group-hover:bg-primary/18">
                      <Phone className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="font-medium">9660439686</span>
                  </a>
                </li>
                <li>
                  <a
                    href="mailto:officialrahusen01@gmail.com"
                    className="group flex items-center gap-3 rounded-xl border border-transparent bg-muted/40 px-4 py-3 text-sm text-foreground transition-all hover:border-primary/20 hover:bg-muted/60 dark:bg-muted/20 dark:hover:bg-muted/30"
                  >
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary group-hover:bg-primary/18">
                      <Mail className="h-4 w-4" strokeWidth={2} />
                    </span>
                    <span className="min-w-0 break-all font-medium leading-snug">officialrahusen01@gmail.com</span>
                  </a>
                </li>
              </ul>
            </div>

            {/* Quick links — two tidy columns */}
            <div className="lg:col-span-4">
              <h4 className="mb-5 flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-muted-foreground">
                <span className="h-px w-8 bg-gradient-to-r from-primary/60 to-transparent" aria-hidden />
                Quick links
              </h4>
              <div className="grid grid-cols-2 gap-8 sm:gap-10">
                <div>
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-primary/90">Learning</p>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    <li>
                      <Link
                        href="/student"
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground hover:underline decoration-primary/40 underline-offset-4"
                      >
                        Home
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/student/dashboard"
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground hover:underline decoration-primary/40 underline-offset-4"
                      >
                        My Learning
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/student/cours"
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground hover:underline decoration-primary/40 underline-offset-4"
                      >
                        Courses
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/student/certificates"
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground hover:underline decoration-primary/40 underline-offset-4"
                      >
                        Certificates
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/student/blogs"
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground hover:underline decoration-primary/40 underline-offset-4"
                      >
                        Blog
                      </Link>
                    </li>
                  </ul>
                </div>
                <div>
                  <p className="mb-3 text-[11px] font-bold uppercase tracking-wider text-primary/90">More</p>
                  <ul className="space-y-2.5 text-sm text-muted-foreground">
                    <li>
                      <Link
                        href="/student/help"
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground hover:underline decoration-primary/40 underline-offset-4"
                      >
                        Help &amp; FAQ
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/student/profile"
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground hover:underline decoration-primary/40 underline-offset-4"
                      >
                        Profile
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/login"
                        className="inline-flex items-center gap-1 transition-colors hover:text-foreground hover:underline decoration-primary/40 underline-offset-4"
                      >
                        Login
                      </Link>
                    </li>
                    <li>
                      <Link
                        href="/"
                        className="inline-flex items-center gap-1 font-medium text-foreground/90 transition-colors hover:text-primary"
                      >
                        Main site
                        <ArrowUpRight className="h-3.5 w-3.5 opacity-70" />
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/80 pt-8 sm:flex-row sm:pt-10">
            <p className="text-center text-sm text-muted-foreground sm:text-left">
              © {new Date().getFullYear()}{" "}
              <span className="font-semibold text-foreground">AiNextro LMS</span>. All rights reserved.
            </p>
            <div className="flex items-center gap-2 rounded-full border border-primary/15 bg-primary/8 px-4 py-2 text-sm font-medium text-primary dark:bg-primary/12">
              <Award className="h-4 w-4 shrink-0" strokeWidth={2} />
              Empowering careers through learning
            </div>
          </div>
        </div>
      </footer>

      <StudentChatWidget />
    </div>
  );
}
