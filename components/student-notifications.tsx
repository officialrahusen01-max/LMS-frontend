"use client";

import * as React from "react";
import { Bell, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "ainextro-student-notifications-v1";

const SEED = [
  {
    id: "welcome",
    title: "Welcome to AiNextro LMS",
    body: "Explore courses, track progress, and earn certificates — payment options coming soon.",
    read: false,
    at: new Date().toISOString(),
  },
  {
    id: "tip-progress",
    title: "Tip: Continue where you left off",
    body: "Open My Learning and jump back into any enrolled course from your dashboard.",
    read: false,
    at: new Date().toISOString(),
  },
];

function loadState() {
  if (typeof window === "undefined") return SEED;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED));
      return SEED;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length ? parsed : SEED;
  } catch {
    return SEED;
  }
}

function saveState(items) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* ignore */
  }
}

export function StudentNotifications() {
  const [open, setOpen] = React.useState(false);
  const [items, setItems] = React.useState(SEED);
  const ref = React.useRef(null);

  React.useEffect(() => {
    setItems(loadState());
  }, []);

  React.useEffect(() => {
    if (!open) return;
    const onDown = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [open]);

  const unread = items.filter((x) => !x.read).length;

  const markAllRead = () => {
    const next = items.map((x) => ({ ...x, read: true }));
    setItems(next);
    saveState(next);
  };

  const dismiss = (id) => {
    const next = items.filter((x) => x.id !== id);
    setItems(next);
    saveState(next);
  };

  return (
    <div className="relative" ref={ref}>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="relative h-11 w-11 shrink-0 rounded-xl border border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/18"
        aria-label="Notifications"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </Button>
      {open && (
        <div className="absolute right-0 top-12 z-[80] w-[min(92vw,360px)] overflow-hidden rounded-2xl border border-border bg-card shadow-2xl">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="text-sm font-bold text-foreground">Notifications</span>
            {unread > 0 && (
              <button
                type="button"
                className="text-xs font-semibold text-primary hover:underline"
                onClick={markAllRead}
              >
                Mark all read
              </button>
            )}
          </div>
          <ul className="max-h-80 overflow-y-auto">
            {items.length === 0 ? (
              <li className="px-4 py-8 text-center text-sm text-muted-foreground">No notifications</li>
            ) : (
              items.map((n) => (
                <li
                  key={n.id}
                  className={cn(
                    "border-b border-border/80 px-3 py-3 last:border-0",
                    !n.read && "bg-primary/[0.04]"
                  )}
                >
                  <div className="flex gap-2">
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-semibold text-foreground">{n.title}</p>
                      <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">{n.body}</p>
                    </div>
                    <button
                      type="button"
                      className="shrink-0 rounded-lg p-1 text-muted-foreground hover:bg-muted hover:text-foreground"
                      aria-label="Dismiss"
                      onClick={() => dismiss(n.id)}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
