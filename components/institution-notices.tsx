"use client";

import React, { useEffect, useState } from "react";
import { Megaphone } from "lucide-react";
import { apiJson } from "@/lib/api";

type Notice = {
  title: string;
  content: string;
  targetAudience?: string;
  createdAt?: string;
};

export default function InstitutionNotices() {
  const [items, setItems] = useState<Notice[]>([]);
  const [openId, setOpenId] = useState<string | null>(null);

  useEffect(() => {
    apiJson<{ data?: { items?: Notice[] } }>("institution-updates")
      .then((r) => setItems(r?.data?.items ?? []))
      .catch(() => setItems([]));
  }, []);

  if (!items.length) return null;

  return (
    <section className="rounded-xl border border-amber-500/30 bg-amber-500/5 p-4 dark:bg-amber-500/10">
      <h2 className="mb-3 flex items-center gap-2 text-sm font-semibold text-foreground">
        <Megaphone className="h-4 w-4 text-amber-600 dark:text-amber-400" />
        Updates from your institution
      </h2>
      <ul className="space-y-2">
        {items.map((n, i) => {
          const id = `${i}-${n.title?.slice(0, 12)}`;
          const expanded = openId === id;
          return (
            <li key={id} className="rounded-lg border border-border bg-card/80 px-3 py-2 text-sm">
              <button
                type="button"
                onClick={() => setOpenId(expanded ? null : id)}
                className="flex w-full items-start justify-between gap-2 text-left font-medium text-card-foreground"
              >
                <span>{n.title}</span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {expanded ? "Hide" : "Show"}
                </span>
              </button>
              {expanded && (
                <p className="mt-2 whitespace-pre-wrap text-muted-foreground leading-relaxed">
                  {n.content}
                </p>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
