"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Loader2,
  XCircle,
  Award,
  ShieldCheck,
  Sparkles,
  Copy,
  Check,
  GraduationCap,
  Download,
  Share2,
  Printer,
} from "lucide-react";
import { getBaseUrl } from "@/lib/api";
import { Button } from "@/components/ui/button";

function formatDate(val) {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function pdfFileName(data) {
  const id = data?.certificateId ?? "verified-certificate";
  return `AiNextro-certificate-${String(id).replace(/[^a-zA-Z0-9-_]/g, "_")}.pdf`;
}

/** Enrollment start → certificate issued (same as on-screen “course duration”). */
function formatCourseDurationRange(data) {
  const fromVal = data?.courseDurationStart ?? data?.enrolledAt;
  const toVal = data?.courseDurationEnd ?? data?.issuedAt;
  const from = fromVal ? formatDate(fromVal) : "—";
  const to = toVal ? formatDate(toVal) : "—";
  return `${from} — ${to}`;
}

/**
 * Dark “certificate card” PDF — matches verify page look (no html2canvas).
 */
async function buildCertificatePdfBlob(data, verifyUrl) {
  const { jsPDF } = await import("jspdf");
  const pdf = new jsPDF({
    orientation: "portrait",
    unit: "mm",
    format: "a4",
    compress: true,
  });
  const pageW = pdf.internal.pageSize.getWidth();
  const pageH = pdf.internal.pageSize.getHeight();

  const pad = 10;
  const cardX = pad;
  const cardY = pad;
  const cardW = pageW - pad * 2;
  const cardH = pageH - pad * 2;
  /** Inner content box — all lines & text align to this (no stray cardX+4 rects). */
  const margin = 7;
  const ix = cardX + margin;
  const iy = cardY + margin;
  const innerW = cardW - margin * 2;
  const cx = pageW / 2;
  const cornerR = 5;
  const innerInset = 3;

  // Page + card
  pdf.setFillColor(12, 10, 8);
  pdf.rect(0, 0, pageW, pageH, "F");
  pdf.setFillColor(23, 20, 18);
  pdf.roundedRect(cardX, cardY, cardW, cardH, cornerR, cornerR, "F");

  // Outer border (single clean stroke on rounded card)
  pdf.setDrawColor(217, 119, 6);
  pdf.setLineWidth(0.55);
  pdf.roundedRect(cardX, cardY, cardW, cardH, cornerR, cornerR, "S");

  // Inner border — inset matches on all sides (no shifted look)
  pdf.setDrawColor(180, 83, 9);
  pdf.setLineWidth(0.22);
  pdf.roundedRect(
    cardX + innerInset,
    cardY + innerInset,
    cardW - innerInset * 2,
    cardH - innerInset * 2,
    Math.max(2, cornerR - 1),
    Math.max(2, cornerR - 1),
    "S"
  );

  // Watermark (behind text)
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(44, 40, 38);
  pdf.setFontSize(50);
  pdf.text("VERIFIED", cx, cardY + cardH * 0.52, { angle: 34, align: "center" });
  pdf.setFontSize(17);
  pdf.setTextColor(50, 46, 44);
  pdf.text("AiNextro LMS", cx, cardY + cardH * 0.44, { angle: -7, align: "center" });

  // Corner brackets — same inset from physical card edges
  const L = 9;
  const o = 8;
  pdf.setDrawColor(251, 191, 36);
  pdf.setLineWidth(0.38);
  pdf.line(cardX + o, cardY + o + L, cardX + o, cardY + o);
  pdf.line(cardX + o, cardY + o, cardX + o + L, cardY + o);
  pdf.line(cardX + cardW - o, cardY + o + L, cardX + cardW - o, cardY + o);
  pdf.line(cardX + cardW - o, cardY + o, cardX + cardW - o - L, cardY + o);
  pdf.line(cardX + o, cardY + cardH - o - L, cardX + o, cardY + cardH - o);
  pdf.line(cardX + o, cardY + cardH - o, cardX + o + L, cardY + cardH - o);
  pdf.line(cardX + cardW - o, cardY + cardH - o - L, cardX + cardW - o, cardY + cardH - o);
  pdf.line(cardX + cardW - o, cardY + cardH - o, cardX + cardW - o - L, cardY + cardH - o);

  // Top rules — only lines, inside ix/iy (no filled bars that break rounded corners)
  pdf.setDrawColor(217, 119, 6);
  pdf.setLineWidth(0.28);
  pdf.line(ix + 3, iy + 4, ix + innerW - 3, iy + 4);
  pdf.setLineWidth(0.12);
  pdf.setDrawColor(251, 191, 36);
  pdf.line(ix + 3, iy + 5.4, ix + innerW - 3, iy + 5.4);

  // Side guides — vertical span aligned to inner box
  const vTop = iy + 12;
  const vBot = cardY + cardH - margin - 8;
  const vxL = ix + 1.5;
  const vxR = ix + innerW - 1.5;
  pdf.setDrawColor(180, 83, 9);
  pdf.setLineWidth(0.18);
  pdf.line(vxL, vTop, vxL, vBot);
  pdf.line(vxR, vTop, vxR, vBot);

  let y = iy + 16;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.5);
  pdf.setTextColor(251, 191, 36);
  pdf.text("AiNextro LMS | Official record", cx, y, { align: "center" });
  y += 9;

  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(22);
  pdf.setTextColor(255, 255, 255);
  pdf.text("Certificate verified", cx, y, { align: "center" });
  y += 9;

  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(168, 162, 158);
  const intro =
    "This is an authentic digital credential on file with AiNextro LMS. The particulars below match our official issuance records and may be validated at any time using the verification link.";
  const introLines = pdf.splitTextToSize(intro, innerW - 12);
  pdf.text(introLines, cx, y, { align: "center" });
  y += introLines.length * 4.2 + 8;

  // Pill
  const pillW = Math.min(innerW - 14, innerW - 10);
  const pillX = cx - pillW / 2;
  pdf.setFillColor(41, 37, 36);
  pdf.setDrawColor(180, 83, 9);
  pdf.setLineWidth(0.12);
  pdf.roundedRect(pillX, y - 3.5, pillW, 9, 3, 3, "FD");
  pdf.setFontSize(7);
  pdf.setTextColor(214, 211, 209);
  pdf.text("Credential authenticity confirmed | On-file with AiNextro LMS", cx, y + 1.5, { align: "center" });
  y += 15;

  // Divider (ASCII only — jsPDF built-in fonts cannot render ◆ U+25C6)
  pdf.setDrawColor(217, 119, 6);
  pdf.setLineWidth(0.2);
  pdf.line(ix, y, ix + innerW * 0.32, y);
  pdf.line(ix + innerW * 0.68, y, ix + innerW, y);
  pdf.setFontSize(7.5);
  pdf.setTextColor(251, 191, 36);
  pdf.text("*  AWARD  *", cx, y + 0.5, { align: "center" });
  y += 8;

  // Awarded block (taller for extra copy)
  const boxH = 88;
  pdf.setFillColor(28, 25, 23);
  pdf.setDrawColor(217, 119, 6);
  pdf.setLineWidth(0.15);
  pdf.roundedRect(ix, y, innerW, boxH, 3, 3, "FD");
  let by = y + 9;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.setTextColor(251, 191, 36);
  pdf.text("CERTIFICATE OF ACHIEVEMENT", cx, by, { align: "center" });
  by += 7;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.5);
  pdf.setTextColor(120, 113, 108);
  pdf.text("AWARDED TO", cx, by, { align: "center" });
  by += 8;
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(17);
  pdf.setTextColor(255, 255, 255);
  const name = String(data?.studentName ?? "—");
  const nameLines = pdf.splitTextToSize(name, innerW - 14);
  pdf.text(nameLines, cx, by, { align: "center" });
  by += nameLines.length * 6.2 + 4;
  pdf.setDrawColor(245, 158, 11);
  pdf.setLineWidth(0.25);
  pdf.line(cx - 18, by, cx + 18, by);
  by += 7;
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(10.5);
  pdf.setTextColor(231, 229, 228);
  const course = String(data?.course ?? "—");
  const courseLines = pdf.splitTextToSize(course, innerW - 14);
  pdf.text(courseLines, cx, by, { align: "center" });
  by += courseLines.length * 4.8 + 3;
  pdf.setFontSize(8);
  pdf.setTextColor(120, 113, 108);
  pdf.text("for successful completion of the program", cx, by, { align: "center" });
  by += 6;
  pdf.setFontSize(7.5);
  pdf.setTextColor(140, 130, 125);
  const credNote =
    "This credential confirms mastery of the stated program curriculum and compliance with AiNextro LMS completion standards.";
  const credLines = pdf.splitTextToSize(credNote, innerW - 18);
  pdf.text(credLines, cx, by, { align: "center" });
  y += boxH + 9;

  // Official particulars divider
  pdf.setDrawColor(87, 83, 78);
  pdf.setLineWidth(0.15);
  pdf.line(ix, y, ix + innerW * 0.28, y);
  pdf.line(ix + innerW * 0.72, y, ix + innerW, y);
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.setTextColor(168, 162, 158);
  pdf.text("OFFICIAL PARTICULARS", cx, y + 0.5, { align: "center" });
  y += 7;

  // Two meta cells
  const gap = 4;
  const cellW = (innerW - gap) / 2;
  const cellH = 22;
  const drawMetaCell = (x, label, value, mono) => {
    pdf.setFillColor(41, 37, 36);
    pdf.setDrawColor(55, 55, 55);
    pdf.roundedRect(x, y, cellW, cellH, 2, 2, "FD");
    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(7);
    pdf.setTextColor(120, 113, 108);
    pdf.text(label, x + 3, y + 5);
    pdf.setFont(mono ? "courier" : "helvetica", mono ? "normal" : "normal");
    pdf.setFontSize(mono ? 8 : 9);
    pdf.setTextColor(254, 243, 199);
    if (mono) pdf.setTextColor(253, 230, 138);
    const vl = pdf.splitTextToSize(String(value ?? "—"), cellW - 6);
    pdf.text(vl, x + 3, y + 10);
  };
  drawMetaCell(ix, "CERTIFICATE ID", data?.certificateId ?? "—", true);
  drawMetaCell(ix + cellW + gap, "DATE ISSUED", formatDate(data?.issuedAt), false);
  y += cellH + gap;

  // Course duration full width
  const durH = 22;
  pdf.setFillColor(41, 37, 36);
  pdf.setDrawColor(55, 55, 55);
  pdf.roundedRect(ix, y, innerW, durH, 2, 2, "FD");
  pdf.setFont("helvetica", "bold");
  pdf.setFontSize(7);
  pdf.setTextColor(120, 113, 108);
  pdf.text("COURSE DURATION (FROM - TO)", ix + 3, y + 5);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(9);
  pdf.setTextColor(231, 229, 228);
  const durText = formatCourseDurationRange(data);
  const durLines = pdf.splitTextToSize(durText, innerW - 6);
  pdf.text(durLines, ix + 3, y + 10);
  y += durH + 8;

  // Digital seal ring (visual weight)
  const sealCx = cx;
  const sealCy = y + 12;
  const sealR = 11;
  pdf.setDrawColor(217, 119, 6);
  pdf.setLineWidth(0.35);
  pdf.circle(sealCx, sealCy, sealR, "S");
  pdf.setLineWidth(0.15);
  pdf.circle(sealCx, sealCy, sealR - 1.5, "S");
  pdf.setFontSize(6.5);
  pdf.setTextColor(251, 191, 36);
  pdf.text("DIGITAL", sealCx, sealCy - 2, { align: "center" });
  pdf.text("SEAL", sealCx, sealCy + 3.5, { align: "center" });
  y += 26;

  // Bottom gold double line (mirror top — keeps frame balanced)
  pdf.setDrawColor(217, 119, 6);
  pdf.setLineWidth(0.28);
  pdf.line(ix + 3, y, ix + innerW - 3, y);
  pdf.setLineWidth(0.12);
  pdf.setDrawColor(251, 191, 36);
  pdf.line(ix + 3, y + 1.4, ix + innerW - 3, y + 1.4);
  y += 5;

  pdf.setDrawColor(68, 64, 60);
  pdf.setLineWidth(0.2);
  pdf.setLineDashPattern([1, 2], 0);
  pdf.line(ix, y, ix + innerW, y);
  pdf.setLineDashPattern([], 0);
  y += 8;

  pdf.setDrawColor(87, 83, 78);
  pdf.line(ix, y + 12, ix + 28, y + 12);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.5);
  pdf.setTextColor(120, 113, 108);
  pdf.text("Authorized issuer", ix, y + 16);
  pdf.setFont("helvetica", "bold");
  pdf.setTextColor(214, 211, 209);
  pdf.text("AiNextro LMS", ix, y + 21);
  pdf.setFont("helvetica", "normal");
  pdf.setFontSize(7.5);
  pdf.setTextColor(120, 113, 108);
  pdf.text("Trusted learning credential", ix + innerW - 3, y + 18, { align: "right" });

  y += 28;
  pdf.setFontSize(7.5);
  pdf.setTextColor(147, 197, 253);
  pdf.text("Public verification link:", ix, y);
  y += 4;
  pdf.setTextColor(186, 230, 253);
  const urlLines = pdf.splitTextToSize(String(verifyUrl || ""), innerW - 4);
  pdf.text(urlLines, ix, y);

  return pdf.output("blob");
}

/** Public page — outside student layout so shared verify links work without login. */
export default function VerifyCertificatePage() {
  const params = useParams();
  const hash = typeof params?.hash === "string" ? params.hash : "";
  const [state, setState] = useState({ loading: true, ok: false, data: null, message: "" });
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(null); // "pdf" | "share" | null
  const [actionError, setActionError] = useState("");

  useEffect(() => {
    if (!hash) {
      setState({ loading: false, ok: false, data: null, message: "Invalid link." });
      return;
    }
    const base = getBaseUrl().replace(/\/$/, "");
    const path = `${base}/certificates/verify/${encodeURIComponent(hash)}`;
    fetch(path, { method: "GET", credentials: "omit" })
      .then(async (res) => {
        const body = await res.json().catch(() => ({}));
        if (!res.ok) {
          setState({
            loading: false,
            ok: false,
            data: null,
            message: body?.message || "Certificate could not be verified.",
          });
          return;
        }
        setState({
          loading: false,
          ok: true,
          data: body?.data ?? body,
          message: body?.message || "Verified",
        });
      })
      .catch(() =>
        setState({
          loading: false,
          ok: false,
          data: null,
          message: "Network error. Try again later.",
        })
      );
  }, [hash]);

  const copyPageLink = useCallback(async () => {
    if (typeof window === "undefined") return;
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2200);
    } catch {
      /* ignore */
    }
  }, []);

  const handleDownloadPdf = useCallback(async () => {
    if (!state.data) return;
    setBusy("pdf");
    setActionError("");
    try {
      const verifyUrl = typeof window !== "undefined" ? window.location.href : "";
      const blob = await buildCertificatePdfBlob(state.data, verifyUrl);
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = pdfFileName(state.data);
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      setActionError("Could not create PDF. Use \"Print / Save as PDF\" below.");
    } finally {
      setBusy(null);
    }
  }, [state.data]);

  const handlePrintCertificate = useCallback(() => {
    if (typeof window === "undefined") return;
    setActionError("");
    window.print();
  }, []);

  const handleShare = useCallback(async () => {
    if (typeof window === "undefined") return;
    const pageUrl = window.location.href;
    const title = "Certificate verified — AiNextro LMS";
    const text = `${state.data?.studentName ?? "Student"} — ${state.data?.course ?? "Course"}\n${pageUrl}`;
    setBusy("share");
    setActionError("");
    try {
      if (navigator.share) {
        let files;
        if (state.data && navigator.canShare) {
          try {
            const blob = await buildCertificatePdfBlob(state.data, pageUrl);
            const name = pdfFileName(state.data);
            files = [new File([blob], name, { type: "application/pdf" })];
          } catch {
            files = undefined;
          }
        }
        if (files?.length && navigator.canShare?.({ files })) {
          await navigator.share({ title, text, files });
          return;
        }
        await navigator.share({ title, text, url: pageUrl });
        return;
      }
      await copyPageLink();
      setActionError("Sharing isn’t available here — verify link copied to clipboard.");
    } catch (e) {
      if (e?.name === "AbortError") return;
      try {
        await copyPageLink();
        setActionError("Share failed — verify link copied to clipboard.");
      } catch {
        setActionError("Couldn’t share or copy — copy the address bar manually.");
      }
    } finally {
      setBusy(null);
    }
  }, [state.data, copyPageLink]);

  return (
    <div className="certificate-verify-page relative flex min-h-screen flex-col overflow-hidden bg-[#0c0a09] text-stone-100 print:min-h-0 print:flex print:flex-col print:items-stretch print:bg-white print:overflow-visible">
      {/* Ambient */}
      <div
        className="cert-verify-no-print pointer-events-none absolute inset-0 opacity-90 print:hidden"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -20%, rgba(251, 191, 36, 0.18), transparent), radial-gradient(ellipse 60% 40% at 100% 50%, rgba(139, 92, 246, 0.12), transparent), radial-gradient(ellipse 50% 30% at 0% 80%, rgba(59, 130, 246, 0.1), transparent)",
        }}
      />
      <div
        className="cert-verify-no-print pointer-events-none absolute inset-0 opacity-[0.07] print:hidden"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative mx-auto max-w-2xl px-4 py-10 print:w-full print:max-w-none print:px-3 print:py-0 sm:px-6 sm:py-16 print:sm:py-1">
        {state.loading ? (
          <div className="flex flex-col items-center justify-center rounded-2xl border border-white/10 bg-white/[0.03] px-8 py-24 backdrop-blur-sm">
            <div className="relative">
              <div className="absolute inset-0 animate-ping rounded-full bg-amber-400/20" />
              <Loader2 className="relative h-14 w-14 animate-spin text-amber-400" />
            </div>
            <p className="mt-6 text-sm font-medium tracking-wide text-stone-400">
              Verifying credential…
            </p>
          </div>
        ) : state.ok ? (
          <div className="relative">
            {/* Glow ring */}
            <div className="cert-verify-no-print absolute -inset-px rounded-[1.35rem] bg-gradient-to-br from-amber-400/50 via-amber-600/20 to-violet-600/40 blur-sm print:hidden" />
            <div className="certificate-verify-card relative flex min-h-0 flex-col overflow-hidden rounded-3xl border border-amber-500/25 bg-gradient-to-b from-stone-900 via-stone-950 to-[#0a0908] shadow-[0_0_0_1px_rgba(251,191,36,0.08),0_25px_80px_-12px_rgba(0,0,0,0.7)] print:min-h-[278mm] print:w-full print:max-w-none print:shadow-none">
              {/* Inner ornate border */}
              <div className="pointer-events-none absolute inset-3 rounded-2xl border border-amber-500/15" />
              <div className="pointer-events-none absolute left-6 top-6 h-14 w-14 border-l-2 border-t-2 border-amber-400/35 rounded-tl-xl" />
              <div className="pointer-events-none absolute right-6 top-6 h-14 w-14 border-r-2 border-t-2 border-amber-400/35 rounded-tr-xl" />
              <div className="pointer-events-none absolute bottom-6 left-6 h-14 w-14 border-b-2 border-l-2 border-amber-400/35 rounded-bl-xl" />
              <div className="pointer-events-none absolute bottom-6 right-6 h-14 w-14 border-b-2 border-r-2 border-amber-400/35 rounded-br-xl" />

              {/* Rich fill — watermark, texture, gold rails (screen + print) */}
              <div
                className="cert-rich-layer pointer-events-none absolute inset-0 overflow-hidden rounded-3xl print:rounded-2xl"
                aria-hidden
              >
                <div
                  className="absolute inset-0 opacity-[0.14] print:opacity-20"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at center, rgba(251,191,36,0.45) 1px, transparent 1.5px)",
                    backgroundSize: "16px 16px",
                  }}
                />
                <div className="absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r from-transparent via-amber-500/55 to-transparent print:h-2 print:via-amber-500/70" />
                <div className="absolute inset-x-8 top-3 h-px bg-amber-500/20 print:inset-x-10" />
                <div className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-amber-600/45 to-transparent" />
                <div className="absolute left-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-amber-500/25 to-transparent print:left-1 print:via-amber-500/35" />
                <div className="absolute right-0 top-1/4 h-1/2 w-px bg-gradient-to-b from-transparent via-amber-500/25 to-transparent print:right-1" />
                <p className="absolute left-1/2 top-[42%] -translate-x-1/2 -translate-y-1/2 select-none whitespace-nowrap font-serif text-[6.5rem] font-bold uppercase leading-none tracking-tighter text-amber-500/[0.07] print:top-[40%] print:text-[5.5rem] print:text-amber-500/[0.11] sm:text-[7.5rem]">
                  Verified
                </p>
                <p className="absolute -right-6 top-28 rotate-90 select-none font-serif text-4xl font-bold uppercase tracking-widest text-amber-400/[0.06] print:top-36 print:text-3xl print:text-amber-400/10">
                  AiNextro
                </p>
                <p className="absolute -left-2 bottom-36 -rotate-90 select-none font-serif text-3xl font-bold uppercase tracking-widest text-amber-400/[0.06] print:bottom-40 print:text-2xl print:text-amber-400/10">
                  LMS
                </p>
              </div>

              <div className="certificate-verify-inner relative z-[1] flex min-h-0 flex-1 flex-col px-6 pb-10 pt-12 print:flex-1 print:px-6 print:pb-5 print:pt-6 sm:px-12 sm:pb-12 sm:pt-14 print:sm:px-10 print:sm:pb-5 print:sm:pt-6">
                <div className="cert-print-body min-h-0 print:flex-1">
                {/* Seal */}
                <div className="mx-auto flex w-fit origin-top justify-center print:scale-95">
                  <div className="relative">
                    <div className="absolute inset-0 rounded-full bg-amber-400/20 blur-xl print:hidden" />
                    <div className="relative flex h-20 w-20 items-center justify-center rounded-full border-2 border-amber-400/60 bg-gradient-to-br from-amber-500/20 to-amber-700/10 shadow-lg shadow-amber-900/40 print:h-16 print:w-16">
                      <Award className="h-9 w-9 text-amber-300" strokeWidth={1.25} />
                    </div>
                    <div className="absolute -right-1 -top-1 flex h-7 w-7 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg ring-2 ring-stone-950">
                      <ShieldCheck className="h-4 w-4" strokeWidth={2.5} />
                    </div>
                  </div>
                </div>

                <p className="mt-8 print:mt-3 text-center text-[10px] font-semibold uppercase tracking-[0.35em] text-amber-500/90">
                  AiNextro LMS · Official record
                </p>
                <h1 className="mt-3 print:mt-1 text-center font-serif text-3xl font-bold tracking-tight text-white print:text-2xl sm:text-4xl print:sm:text-2xl">
                  Certificate verified
                </h1>
                <p className="mx-auto mt-3 print:mt-1 max-w-md text-center text-sm print:text-xs leading-relaxed text-stone-400">
                  This is an authentic digital credential on file with our platform. The details below match our
                  issuance records.
                </p>

                <div className="mx-auto mt-8 print:mt-3 flex items-center justify-center gap-2 rounded-full border border-amber-500/25 bg-stone-800/70 px-5 py-2.5 text-xs font-medium text-stone-200 shadow-inner shadow-black/20 print:border-amber-500/30 print:py-2">
                  <Sparkles className="h-3.5 w-3.5 shrink-0 text-amber-400" />
                  <span>Credential authenticity confirmed · On-file with AiNextro LMS</span>
                </div>

                <div className="mx-auto mt-7 flex max-w-md items-center gap-3 print:mt-5 print:max-w-lg">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent via-amber-500/50 to-amber-500/30" />
                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.45em] text-amber-500/90 print:tracking-[0.35em]">
                    * Award *
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent via-amber-500/50 to-amber-500/30" />
                </div>

                {/* Name block — hero */}
                <div className="relative mt-8 print:mt-5 overflow-hidden rounded-2xl border border-amber-500/35 bg-gradient-to-b from-amber-950/40 via-stone-900/80 to-stone-950/90 px-6 py-9 text-center shadow-[inset_0_1px_0_rgba(251,191,36,0.15)] print:border-amber-500/40 print:py-6 sm:px-10">
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,transparent_35%,rgba(251,191,36,0.08)_50%,transparent_65%)]" />
                  <div className="pointer-events-none absolute inset-x-4 top-2 h-px bg-amber-500/20" />
                  <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-amber-500/80">Certificate of achievement</p>
                  <p className="mt-2 text-xs font-medium uppercase tracking-[0.2em] text-stone-500">Awarded to</p>
                  <p className="mt-3 font-serif text-3xl font-bold leading-tight text-white print:text-2xl sm:text-[2rem]">
                    {state.data?.studentName ?? "—"}
                  </p>
                  <div className="mx-auto mt-4 h-px w-24 bg-gradient-to-r from-transparent via-amber-500/60 to-transparent" />
                  <p className="mt-4 text-base font-medium text-stone-200 print:text-sm sm:text-lg">
                    {state.data?.course ?? "—"}
                  </p>
                  <p className="mt-2 text-sm text-stone-400 print:text-xs">for successful completion of the program</p>
                  <p className="mx-auto mt-3 max-w-sm text-xs leading-relaxed text-stone-500 print:mt-2 print:max-w-md print:text-[10px]">
                    This credential confirms mastery of the stated program curriculum and compliance with AiNextro LMS
                    completion standards.
                  </p>
                </div>

                <div className="mx-auto mt-7 flex max-w-md items-center gap-3 print:mt-5">
                  <div className="h-px flex-1 bg-gradient-to-r from-transparent to-stone-600/50" />
                  <span className="shrink-0 text-[10px] font-semibold uppercase tracking-[0.3em] text-stone-500">
                    Official particulars
                  </span>
                  <div className="h-px flex-1 bg-gradient-to-l from-transparent to-stone-600/50" />
                </div>

                {/* Meta grid */}
                <dl className="mt-5 print:mt-4 grid gap-3 print:gap-2 sm:grid-cols-2">
                  <div className="rounded-xl border border-amber-500/15 bg-stone-800/70 px-4 py-3.5 shadow-sm shadow-black/20 print:border-amber-500/25 print:py-2.5">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                      Certificate ID
                    </dt>
                    <dd className="mt-1 font-mono text-sm text-amber-100/90 break-all">
                      {state.data?.certificateId ?? "—"}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-amber-500/15 bg-stone-800/70 px-4 py-3.5 shadow-sm shadow-black/20 print:border-amber-500/25 print:py-2.5">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                      Date issued
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-stone-200">
                      {formatDate(state.data?.issuedAt)}
                    </dd>
                  </div>
                  <div className="rounded-xl border border-amber-500/15 bg-stone-800/70 px-4 py-3.5 shadow-sm shadow-black/20 print:border-amber-500/25 print:py-2.5 sm:col-span-2">
                    <dt className="text-[10px] font-semibold uppercase tracking-wider text-stone-500">
                      Course duration
                    </dt>
                    <dd className="mt-1 text-sm font-medium text-stone-200">
                      {formatCourseDurationRange(state.data)}
                    </dd>
                    <p className="mt-1 text-xs text-stone-500">
                      Enrollment date through certificate issued date
                    </p>
                  </div>
                </dl>
                </div>

                {/* Signature strip */}
                <div className="cert-print-push-bottom mt-10 flex flex-col items-center justify-between gap-6 border-t border-dashed border-white/10 pt-8 print:mt-auto print:gap-4 print:pt-6 sm:flex-row sm:items-end">
                  <div className="text-center sm:text-left">
                    <div className="mx-auto h-px w-32 bg-stone-600 sm:mx-0" />
                    <p className="mt-2 text-xs text-stone-500">Authorized issuer</p>
                    <p className="text-sm font-semibold text-stone-300">AiNextro LMS</p>
                  </div>
                  <div className="flex items-center gap-2 text-stone-500">
                    <GraduationCap className="h-5 w-5 text-amber-500/70" />
                    <span className="text-xs">Trusted learning credential</span>
                  </div>
                </div>

                <div className="cert-verify-actions mt-8 space-y-3 print:hidden">
                  <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-center">
                    <Button
                      type="button"
                      disabled={busy !== null}
                      onClick={() => void handleDownloadPdf()}
                      className="w-full rounded-xl border-0 bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 shadow-lg shadow-amber-900/30 hover:from-amber-400 hover:to-amber-500 sm:w-auto sm:min-w-[160px]"
                    >
                      {busy === "pdf" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          PDF…
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={busy !== null}
                      onClick={() => handlePrintCertificate()}
                      className="w-full rounded-xl border-sky-500/40 bg-sky-500/10 text-sky-100 hover:bg-sky-500/20 hover:text-white sm:w-auto sm:min-w-[160px]"
                    >
                      <Printer className="mr-2 h-4 w-4" />
                      Print / Save as PDF
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={busy !== null}
                      onClick={() => void handleShare()}
                      className="w-full rounded-xl border-emerald-500/40 bg-emerald-500/10 text-emerald-100 hover:bg-emerald-500/20 hover:text-white sm:w-auto sm:min-w-[160px]"
                    >
                      {busy === "share" ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Share…
                        </>
                      ) : (
                        <>
                          <Share2 className="mr-2 h-4 w-4" />
                          Share
                        </>
                      )}
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={busy !== null}
                      onClick={() => void copyPageLink()}
                      className="w-full rounded-xl border-white/20 bg-white/[0.05] text-stone-200 hover:bg-white/10 hover:text-white sm:w-auto sm:min-w-[160px]"
                    >
                      {copied ? (
                        <>
                          <Check className="mr-2 h-4 w-4" />
                          Link copied
                        </>
                      ) : (
                        <>
                          <Copy className="mr-2 h-4 w-4" />
                          Copy verify link
                        </>
                      )}
                    </Button>
                    <Button
                      asChild
                      variant="outline"
                      className="w-full rounded-xl border-white/20 bg-white/[0.05] text-stone-200 hover:bg-white/10 hover:text-white sm:w-auto"
                    >
                      <Link href="/student">Student hub</Link>
                    </Button>
                  </div>
                  {actionError ? (
                    <p className="text-center text-xs text-amber-200/90">{actionError}</p>
                  ) : null}
                  <div className="cert-verify-footer-links flex justify-center gap-4 pt-1 text-center text-sm print:hidden">
                    <Link href="/" className="text-stone-500 underline-offset-4 hover:text-stone-300 hover:underline">
                      Home
                    </Link>
                    <span className="text-stone-700">·</span>
                    <Link
                      href="/login"
                      className="text-stone-500 underline-offset-4 hover:text-stone-300 hover:underline"
                    >
                      Login
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative overflow-hidden rounded-3xl border border-red-500/30 bg-stone-900/90 px-8 py-14 text-center shadow-2xl">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-500/15 ring-2 ring-red-500/40">
              <XCircle className="h-9 w-9 text-red-400" />
            </div>
            <h1 className="mt-6 font-serif text-2xl font-bold text-white">Not verified</h1>
            <p className="mx-auto mt-3 max-w-sm text-sm text-red-200/80">{state.message}</p>
            <div className="mt-8 flex flex-col gap-2 sm:flex-row sm:justify-center">
              <Button asChild variant="outline" className="rounded-xl border-white/20 bg-white/5 text-stone-200">
                <Link href="/">Home</Link>
              </Button>
              <Button asChild variant="ghost" className="rounded-xl text-stone-400 hover:text-white">
                <Link href="/login">Login</Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
