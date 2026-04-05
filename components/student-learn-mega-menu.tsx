"use client";

import React, { useCallback, useRef, useState } from "react";
import Link from "next/link";
import { ChevronDown, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

/** Same structure as reference mega-menu; links route into student app catalog. */
const MEGA_COLUMNS: {
  title: string;
  links: { label: string; href: string }[];
  viewAll?: { label: string; href: string };
  sections?: { title: string; links: { label: string; href: string }[] }[];
}[] = [
  {
    title: "Browse by topic",
    links: [
      { label: "Artificial intelligence", href: "/student/cours" },
      { label: "Computer science", href: "/student/cours" },
      { label: "Data analysis", href: "/student/cours" },
      { label: "Finance", href: "/student/cours" },
      { label: "Leadership", href: "/student/cours" },
    ],
    viewAll: { label: "View all topics", href: "/student/cours" },
    sections: [
      {
        title: "Popular",
        links: [
          { label: "CS50 courses from Harvard", href: "/student/cours" },
          { label: "Spanish", href: "/student/cours" },
          { label: "English", href: "/student/cours" },
        ],
      },
      {
        title: "For beginners",
        links: [
          { label: "Python for beginners", href: "/student/cours" },
          { label: "Excel for beginners", href: "/student/cours" },
          { label: "Cybersecurity for beginners", href: "/student/cours" },
        ],
      },
    ],
  },
  {
    title: "Earn a certificate",
    links: [
      { label: "Artificial intelligence", href: "/student/cours" },
      { label: "Business & management", href: "/student/cours" },
      { label: "Data analysis & statistics", href: "/student/cours" },
      { label: "Project management", href: "/student/cours" },
      { label: "My certificates", href: "/student/certificates" },
    ],
    viewAll: { label: "View all certificate programs", href: "/student/certificates" },
    sections: [
      {
        title: "Popular",
        links: [
          { label: "AI under 3 months", href: "/student/cours" },
          { label: "Real estate under 3 months", href: "/student/cours" },
          { label: "Healthcare under 3 months", href: "/student/cours" },
          { label: "Leadership under 3 months", href: "/student/cours" },
          { label: "Information technology", href: "/student/cours" },
        ],
      },
    ],
  },
  {
    title: "Earn a degree",
    links: [
      { label: "Bachelor's programs", href: "/student/cours" },
      { label: "Master's programs", href: "/student/cours" },
      { label: "Doctorate programs", href: "/student/cours" },
    ],
    sections: [
      {
        title: "Popular",
        links: [
          { label: "Online MBA", href: "/student/cours" },
          { label: "AI master's", href: "/student/cours" },
          { label: "Healthcare master's", href: "/student/cours" },
          { label: "Computer science master's", href: "/student/cours" },
          { label: "Computer & data science bachelor's", href: "/student/cours" },
        ],
      },
    ],
  },
];

const EDUCATOR_BLOCK = {
  title: "Browse by educator",
  links: [
    { label: "Harvard University", href: "/student/cours" },
    { label: "MIT", href: "/student/cours" },
    { label: "London School of Economics", href: "/student/cours" },
    { label: "Google", href: "/student/cours" },
    { label: "IBM", href: "/student/cours" },
    { label: "Microsoft", href: "/student/cours" },
  ],
  viewAll: { label: "View all educators", href: "/student/cours" },
};

const CAREER_BLOCK = {
  title: "Explore career resources",
  links: [
    { label: "Software developer", href: "/student/cours" },
    { label: "Social media manager", href: "/student/cours" },
    { label: "AI engineer", href: "/student/cours" },
    { label: "Data scientist", href: "/student/cours" },
    { label: "Cybersecurity analyst", href: "/student/cours" },
  ],
  viewAll: { label: "View all careers", href: "/student/cours" },
};

function MegaLink({
  href,
  className,
  children,
  onNavigate,
}: {
  href: string;
  className?: string;
  children: React.ReactNode;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "block text-sm leading-relaxed text-foreground/90 transition-colors hover:text-primary",
        className,
      )}
    >
      {children}
    </Link>
  );
}

function ViewAllLink({
  href,
  label,
  onNavigate,
}: {
  href: string;
  label: string;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className="mt-3 inline-block text-sm font-medium text-primary underline underline-offset-4 decoration-primary/50 hover:decoration-primary"
    >
      {label}
    </Link>
  );
}

function ColumnBlock({
  col,
  onNavigate,
}: {
  col: (typeof MEGA_COLUMNS)[number];
  onNavigate?: () => void;
}) {
  return (
    <div className="min-w-0">
      <p className="text-[13px] font-bold tracking-tight text-foreground">{col.title}</p>
      <ul className="mt-3 space-y-2.5">
        {col.links.map((l) => (
          <li key={l.label}>
            <MegaLink href={l.href} onNavigate={onNavigate}>
              {l.label}
            </MegaLink>
          </li>
        ))}
      </ul>
      {col.viewAll && (
        <ViewAllLink href={col.viewAll.href} label={col.viewAll.label} onNavigate={onNavigate} />
      )}
      {col.sections?.map((sec) => (
        <div key={sec.title} className="mt-5">
          <p className="text-xs font-bold uppercase tracking-wide text-foreground">{sec.title}</p>
          <ul className="mt-2 space-y-2">
            {sec.links.map((l) => (
              <li key={l.label}>
                <MegaLink href={l.href} onNavigate={onNavigate} className="text-[13px]">
                  {l.label}
                </MegaLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

function FourthColumn({ onNavigate }: { onNavigate?: () => void }) {
  return (
    <div className="min-w-0 space-y-8">
      <div>
        <p className="text-[13px] font-bold tracking-tight text-foreground">{EDUCATOR_BLOCK.title}</p>
        <ul className="mt-3 space-y-2.5">
          {EDUCATOR_BLOCK.links.map((l) => (
            <li key={l.label}>
              <MegaLink href={l.href} onNavigate={onNavigate}>
                {l.label}
              </MegaLink>
            </li>
          ))}
        </ul>
        <ViewAllLink
          href={EDUCATOR_BLOCK.viewAll.href}
          label={EDUCATOR_BLOCK.viewAll.label}
          onNavigate={onNavigate}
        />
      </div>
      <div>
        <p className="text-[13px] font-bold tracking-tight text-foreground">{CAREER_BLOCK.title}</p>
        <ul className="mt-3 space-y-2.5">
          {CAREER_BLOCK.links.map((l) => (
            <li key={l.label}>
              <MegaLink href={l.href} onNavigate={onNavigate}>
                {l.label}
              </MegaLink>
            </li>
          ))}
        </ul>
        <ViewAllLink
          href={CAREER_BLOCK.viewAll.href}
          label={CAREER_BLOCK.viewAll.label}
          onNavigate={onNavigate}
        />
      </div>
    </div>
  );
}

/**
 * Desktop: hover opens mega panel (wide card under “Learn”, centered on trigger).
 * Wrap in `<nav className="relative ...">` so stacking/z-index stays correct.
 */
export function StudentLearnMegaMenuDesktop() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearClose = useCallback(() => {
    if (closeTimer.current) {
      clearTimeout(closeTimer.current);
      closeTimer.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearClose();
    closeTimer.current = setTimeout(() => setOpen(false), 200);
  }, [clearClose]);

  const openNow = useCallback(() => {
    clearClose();
    setOpen(true);
  }, [clearClose]);

  return (
    <div
      className="relative shrink-0"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
    >
      <button
        type="button"
        aria-expanded={open}
        aria-haspopup="true"
        className={cn(
          "flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-medium transition-all duration-200 lg:gap-2 lg:px-5 lg:py-3 lg:text-[15px]",
          open
            ? "bg-primary-foreground text-primary shadow-md shadow-black/10"
            : "text-primary-foreground/85 hover:bg-primary-foreground/12 hover:text-primary-foreground",
        )}
      >
        <span className="whitespace-nowrap">Learn</span>
        <ChevronDown
          className={cn(
            "h-4 w-4 shrink-0 opacity-90 transition-transform duration-200",
            open && "rotate-180",
          )}
          strokeWidth={2}
        />
      </button>

      {open && (
        <div
          className="absolute left-1/2 top-full z-[70] w-[min(calc(100vw-1.5rem),80rem)] max-w-[calc(100vw-1.5rem)] -translate-x-1/2 pt-2"
          role="menu"
          aria-label="Learn menu"
        >
          <div className="rounded-2xl border border-border bg-card text-card-foreground shadow-[0_24px_48px_-12px_rgba(0,0,0,0.25)] ring-1 ring-black/[0.04] dark:ring-white/[0.06]">
            <div className="grid grid-cols-1 gap-8 p-6 sm:grid-cols-2 lg:grid-cols-4 lg:gap-10 lg:p-8">
              {MEGA_COLUMNS.map((col) => (
                <ColumnBlock key={col.title} col={col} onNavigate={() => setOpen(false)} />
              ))}
              <FourthColumn onNavigate={() => setOpen(false)} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

/** Mobile: accordion-style Learn section inside drawer */
export function StudentLearnMegaMenuMobile({ onNavigate }: { onNavigate?: () => void }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="rounded-xl border border-primary-foreground/15 bg-primary-foreground/[0.06] overflow-hidden">
      <button
        type="button"
        onClick={() => setExpanded((e) => !e)}
        className="flex w-full items-center justify-between gap-2 px-3 py-3 text-sm font-semibold text-primary-foreground/95"
        aria-expanded={expanded}
      >
        Learn
        <ChevronRight className={cn("h-5 w-5 shrink-0 transition-transform", expanded && "rotate-90")} />
      </button>
      {expanded && (
        <div className="border-t border-primary-foreground/15 bg-background/95 px-3 py-4 text-foreground max-h-[min(70vh,520px)] overflow-y-auto">
          <div className="space-y-8">
            {MEGA_COLUMNS.map((col) => (
              <ColumnBlock key={col.title} col={col} onNavigate={onNavigate} />
            ))}
            <FourthColumn onNavigate={onNavigate} />
          </div>
        </div>
      )}
    </div>
  );
}
