"use client";

import React from "react";
import { Globe } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useLanguage, LANGUAGE_OPTIONS, type Locale } from "@/lib/language-store";
import { cn } from "@/lib/utils";

/** UK (Union Jack) flag icon */
function FlagUK({ className }: { className?: string }) {
  const id = React.useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 60 30" className={cn("shrink-0", className)} aria-hidden>
      <defs>
        <clipPath id={`uk-${id}`}>
          <path d="M0,0 v30 h60 v-30 z" />
        </clipPath>
      </defs>
      <g clipPath={`url(#uk-${id})`}>
        <path d="M0,0 v30 h60 v-30 z" fill="#012169" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#fff" strokeWidth="6" />
        <path d="M0,0 L60,30 M60,0 L0,30" stroke="#C8102E" strokeWidth="4" />
        <path d="M30,0 v30 M0,15 h60" stroke="#fff" strokeWidth="10" />
        <path d="M30,0 v30 M0,15 h60" stroke="#C8102E" strokeWidth="6" />
      </g>
    </svg>
  );
}

/** Spain flag icon */
function FlagSpain({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 40" className={cn("shrink-0", className)} aria-hidden>
      <rect width="60" height="40" fill="#C60B1E" />
      <rect y="10" width="60" height="20" fill="#FFC400" />
    </svg>
  );
}

function FlagIcon({ locale }: { locale: Locale }) {
  if (locale === "en") return <FlagUK className="h-4 w-5 rounded-sm overflow-hidden" />;
  return <FlagSpain className="h-4 w-5 rounded-sm overflow-hidden" />;
}

type LanguageSelectorProps = {
  className?: string;
  /** Use when inside header with primary-foreground text (e.g. welcome header) */
  variant?: "default" | "header";
};

export function LanguageSelector({ className, variant = "default" }: LanguageSelectorProps) {
  const { locale, setLocale } = useLanguage();
  const current = LANGUAGE_OPTIONS.find((o) => o.value === locale) ?? LANGUAGE_OPTIONS[0];

  const isHeader = variant === "header";

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
          isHeader
            ? "border-primary-foreground/20 bg-primary-foreground/10 text-primary-foreground hover:bg-primary-foreground/20"
            : "border-border bg-background text-foreground hover:bg-muted",
          className
        )}
        aria-label="Select language"
      >
        <Globe size={18} className="shrink-0" />
        <span>{current.label}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="end"
        className="min-w-[11rem] rounded-lg border border-border bg-white py-1 shadow-lg dark:bg-card"
      >
        {LANGUAGE_OPTIONS.map((opt, i) => (
          <React.Fragment key={opt.value}>
            {i > 0 && <DropdownMenuSeparator className="bg-border" />}
            <DropdownMenuItem
              onClick={() => setLocale(opt.value as Locale)}
              className={cn(
                "flex cursor-pointer items-center gap-3 px-3 py-2.5 text-sm text-foreground focus:bg-muted dark:text-card-foreground",
                locale === opt.value && "bg-muted font-medium"
              )}
            >
              <FlagIcon locale={opt.value as Locale} />
              <span>{opt.label}</span>
            </DropdownMenuItem>
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu> 
  );
}
