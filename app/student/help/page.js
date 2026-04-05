"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { BookOpen, MessageCircle, Award, User, HelpCircle } from "lucide-react";

const FAQ = [
  {
    q: "How do I enroll in a course?",
    a: "Go to Courses, pick a published course, and tap Enroll. Free courses enroll instantly. Paid checkout will be added later.",
  },
  {
    q: "Where do I continue my lessons?",
    a: "Open My Learning on the dashboard and use Continue learning, or open the course from the Courses page.",
  },
  {
    q: "How do certificates work?",
    a: "Complete a course per its rules to earn a certificate. View them under My certificates and share the public verify link.",
  },
  {
    q: "How do I change my profile photo?",
    a: "Profile: use the camera on your avatar or Choose photo when editing profile. Server needs Cloudinary configured.",
  },
  {
    q: "Who can I contact for support?",
    a: "Use the chat widget or WhatsApp, or email officialrahusen01@gmail.com.",
  },
];

export default function StudentHelpPage() {
  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-10 text-center"
      >
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/10 text-primary">
          <HelpCircle className="h-8 w-8" />
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">Help and FAQ</h1>
        <p className="mt-2 text-muted-foreground">
          Quick answers for AiNextro LMS. Payment later.
        </p>
      </motion.div>

      <div className="mb-10 grid gap-3 sm:grid-cols-2">
        <Link
          href="/student/cours"
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/30"
        >
          <BookOpen className="h-8 w-8 shrink-0 text-primary" />
          <div>
            <p className="font-semibold text-foreground">Browse courses</p>
            <p className="text-xs text-muted-foreground">Catalog and enroll</p>
          </div>
        </Link>
        <Link
          href="/student/certificates"
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/30"
        >
          <Award className="h-8 w-8 shrink-0 text-primary" />
          <div>
            <p className="font-semibold text-foreground">Certificates</p>
            <p className="text-xs text-muted-foreground">View and verify</p>
          </div>
        </Link>
        <Link
          href="/student/profile"
          className="flex items-center gap-3 rounded-2xl border border-border bg-card p-4 shadow-sm transition hover:border-primary/30"
        >
          <User className="h-8 w-8 shrink-0 text-primary" />
          <div>
            <p className="font-semibold text-foreground">Profile</p>
            <p className="text-xs text-muted-foreground">Name, photo, password</p>
          </div>
        </Link>
        <div className="flex items-center gap-3 rounded-2xl border border-dashed border-border bg-muted/20 p-4">
          <MessageCircle className="h-8 w-8 shrink-0 text-primary" />
          <div>
            <p className="font-semibold text-foreground">Live help</p>
            <p className="text-xs text-muted-foreground">Chat bubble bottom-right</p>
          </div>
        </div>
      </div>

      <h2 className="mb-4 text-lg font-bold text-foreground">Frequently asked</h2>
      <Accordion type="single" collapsible className="w-full rounded-2xl border border-border bg-card px-2">
        {FAQ.map((item, i) => (
          <AccordionItem key={i} value={`item-${i}`} className="border-border/80">
            <AccordionTrigger className="text-left text-sm font-semibold hover:no-underline">
              {item.q}
            </AccordionTrigger>
            <AccordionContent className="text-sm leading-relaxed text-muted-foreground">
              {item.a}
            </AccordionContent>
          </AccordionItem>
        ))}
      </Accordion>

      <div className="mt-10 text-center">
        <Button asChild variant="outline" className="rounded-xl">
          <Link href="/student/dashboard">Back to My Learning</Link>
        </Button>
      </div>
    </div>
  );
}
