"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Award, Copy, Check, Loader2, ExternalLink, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { apiJson } from "@/lib/api";

function formatDate(val) {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default function StudentCertificatesPage() {
  const [list, setList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedId, setCopiedId] = useState(null);

  useEffect(() => {
    apiJson("certificates/me")
      .then((r) => {
        const rows = Array.isArray(r?.data) ? r.data : [];
        setList(rows);
      })
      .catch((e) => setError(e?.message || "Failed to load certificates"))
      .finally(() => setLoading(false));
  }, []);

  const verifyPageUrl = (hash) => {
    if (typeof window === "undefined" || !hash) return "";
    return `${window.location.origin}/certificates/verify/${encodeURIComponent(hash)}`;
  };

  const copyVerify = async (hash, mongoId) => {
    const url = verifyPageUrl(hash);
    if (!url) return;
    try {
      await navigator.clipboard.writeText(url);
      setCopiedId(String(mongoId));
      setTimeout(() => setCopiedId(null), 2000);
    } catch {
      /* ignore */
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          My certificates
        </h1>
        <p className="mt-1 text-muted-foreground">
          Certificates you earn after completing courses. Share the verify link to prove authenticity.
        </p>
      </motion.div>

      {loading ? (
        <div className="flex flex-col items-center justify-center py-16">
          <Loader2 className="h-10 w-10 animate-spin text-primary" />
          <p className="mt-4 text-sm text-muted-foreground">Loading…</p>
        </div>
      ) : error ? (
        <div className="rounded-xl border border-destructive/40 bg-destructive/10 p-4 text-destructive">
          {error}
        </div>
      ) : list.length === 0 ? (
        <Card className="border-dashed">
          <CardContent className="flex flex-col items-center py-14 text-center">
            <Award className="h-14 w-14 text-muted-foreground/50" />
            <p className="mt-4 font-medium text-foreground">No certificates yet</p>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Complete a course (and meet certificate rules) to get your first certificate.
            </p>
            <Button asChild className="mt-6">
              <Link href="/student/cours">Browse courses</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <ul className="space-y-4">
          {list.map((c) => {
            const id = c?._id ?? c?.id;
            const title = c?.course?.title ?? "Course";
            const certId = c?.certificateId ?? "—";
            const hash = c?.verificationHash;
            return (
              <motion.li
                key={String(id)}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <Card className="overflow-hidden border-border/80 shadow-sm">
                  <CardHeader className="flex flex-row items-start gap-3 space-y-0 border-b border-border/60 bg-muted/20 pb-4">
                    <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h2 className="font-semibold text-foreground">{title}</h2>
                      <p className="mt-1 text-xs text-muted-foreground">
                        ID: <span className="font-mono">{certId}</span>
                      </p>
                      <p className="text-xs text-muted-foreground">
                        Issued: {formatDate(c?.issuedAt)}
                      </p>
                    </div>
                  </CardHeader>
                  <CardContent className="flex flex-col gap-3 pt-4 sm:flex-row sm:flex-wrap sm:items-center">
                    {hash && (
                      <>
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-lg"
                          onClick={() => copyVerify(hash, id)}
                        >
                          {copiedId === String(id) ? (
                            <>
                              <Check className="mr-2 h-4 w-4" />
                              Copied link
                            </>
                          ) : (
                            <>
                              <Copy className="mr-2 h-4 w-4" />
                              Copy verify link
                            </>
                          )}
                        </Button>
                        <Button asChild variant="ghost" size="sm" className="rounded-lg">
                          <Link href={`/certificates/verify/${encodeURIComponent(hash)}`}>
                            <ExternalLink className="mr-2 h-4 w-4" />
                            Open verify page
                          </Link>
                        </Button>
                      </>
                    )}
                  </CardContent>
                </Card>
              </motion.li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
