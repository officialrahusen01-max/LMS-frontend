"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  LogIn, UserPlus, BookOpen, Award, Mail, MessageSquare,
  Send, User, FileCheck, Users, GraduationCap, Circle,
  Phone, ChevronLeft, ChevronRight, Star, TrendingUp, Zap, Shield, Calendar, Tag,
  Menu, X
} from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";
import { useTranslationHook } from "@/lib/translations";
import { apiJson } from "@/lib/api";

const WISE_SLIDE_KEYS = ["slide1", "slide2", "slide3"] as const;
const WISE_SLIDE_IMAGES = [
  "/images/exchange.png",
  "/images/studentBanner.png",
  "/images/certificate.png",
] as const;

const TEACHERS = [
  { id: 1, name: "Dr. Sarah Mitchell",  role: "Data Science & ML",      online: true,  courses: 12, students: 2840 },
  { id: 2, name: "James Chen",          role: "Web Development",         online: true,  courses: 8,  students: 1920 },
  { id: 3, name: "Emily Rodriguez",     role: "Design & UX",             online: false, courses: 6,  students: 1150 },
  { id: 4, name: "Prof. David Kumar",   role: "Business & Strategy",     online: true,  courses: 10, students: 3200 },
  { id: 5, name: "Lisa Park",           role: "Digital Marketing",       online: false, courses: 7,  students: 980  },
  { id: 6, name: "Michael Foster",      role: "Cloud & DevOps",          online: true,  courses: 9,  students: 2100 },
];

const STATS = [
  { value: "50,000+", label: "Students Enrolled", icon: GraduationCap },
  { value: "150+",    label: "Expert Instructors", icon: Star },
  { value: "98%",     label: "Success Rate",       icon: TrendingUp },
  { value: "500+",    label: "Courses Available",  icon: Zap },
];

const INITIALS = (name: string) =>
  name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();

// Global flag to prevent duplicate fetches in dev (StrictMode double mount)
let isFetchingBlogs = false;

export default function WelcomePage() {
  const { t } = useTranslationHook();
  const [current, setCurrent] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const teachersScrollRef = useRef<HTMLDivElement>(null);
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsError, setBlogsError] = useState<string | null>(null);
  const [hasFetchedBlogs, setHasFetchedBlogs] = useState(false);

  const next = useCallback(() => setCurrent((c) => (c + 1) % WISE_SLIDE_KEYS.length), []);

  useEffect(() => {
    const id = setInterval(next, 5500);
    return () => clearInterval(id);
  }, [next]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile menu on outside click
  useEffect(() => {
    if (!mobileMenuOpen) return;
    const handler = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      if (!target.closest(".mobile-menu") && !target.closest(".mobile-menu-toggle")) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [mobileMenuOpen]);

  // Fetch blogs for the welcome page
  useEffect(() => {
    if (!isFetchingBlogs && !hasFetchedBlogs && !blogsLoading && !blogsError) {
      isFetchingBlogs = true;
      setBlogsLoading(true);
      apiJson<{ data: any[] }>("blogs?limit=20")
        .then((res) => {
          setBlogs(res?.data ?? []);
          setBlogsError(null);
          setHasFetchedBlogs(true);
        })
        .catch((e) => {
          setBlogsError(e instanceof Error ? e.message : "Failed to load blogs");
          setBlogs([]);
          setHasFetchedBlogs(true);
        })
        .finally(() => {
          setBlogsLoading(false);
          isFetchingBlogs = false;
        });
    }
  }, [hasFetchedBlogs, blogsLoading, blogsError]);

  return (
    <>
      {/* ── GLOBAL STYLES ── */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;0,700;1,400;1,600&family=DM+Sans:wght@300;400;500;600&display=swap');

        :root {
          --navy:      #0B1426;
          --navy-mid:  #14213D;
          --navy-soft: #1E3A5F;
          --gold:      #C9A84C;
          --gold-light:#E8C97A;
          --gold-pale: #F5E6C0;
          --cream:     #FAF6EE;
          --white:     #FFFFFF;
          --text-muted:#94A3B8;
          --border:    rgba(201,168,76,0.18);
        }

        * { box-sizing: border-box; margin: 0; padding: 0; }

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          color: var(--navy);
          overflow-x: hidden;
        }

        .display { font-family: 'Cormorant Garamond', serif; }

        /* Grain overlay */
        .grain::after {
          content: '';
          position: fixed; inset: 0; z-index: 9999;
          pointer-events: none;
          background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
          opacity: .5;
        }

        /* ── HEADER ── */
        .site-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 200;
          transition: background .4s, box-shadow .4s, padding .3s;
        }
        .site-header.solid {
          background: rgba(11,20,38,.96);
          backdrop-filter: blur(18px);
          box-shadow: 0 1px 0 var(--border), 0 8px 32px rgba(0,0,0,.35);
        }
        .site-header.transparent { background: transparent; }

        .header-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 18px 24px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 16px;
        }

        /* Logo */
        .logo { display: flex; align-items: center; gap: 14px; }
        .logo-icon {
          width: 40px; height: 40px; border-radius: 10px;
          background: linear-gradient(135deg,#C9A84C,#E8C97A);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 14px rgba(201,168,76,.4);
          flex-shrink: 0;
        }
        .logo-text {
          font-family: 'Cormorant Garamond', serif;
          font-weight: 700; font-size: 1.25rem;
          color: #fff; line-height: 1.1;
        }
        .logo-subtitle {
          font-size: .65rem; color: rgba(201,168,76,.85);
          letter-spacing: .12em; text-transform: uppercase;
        }

        /* Desktop nav */
        .desktop-nav {
          display: flex;
          align-items: center;
          gap: 32px;
          flex: 1;
          justify-content: center;
        }
        .nav-link {
          color: rgba(255,255,255,.78);
          font-size: .88rem; font-weight: 500;
          text-decoration: none;
          letter-spacing: .02em;
          transition: color .2s;
        }
        .nav-link:hover { color: #E8C97A; }

        /* Desktop CTA buttons */
        .desktop-cta {
          display: flex;
          align-items: center;
          gap: 12px;
          flex-shrink: 0;
        }

        /* Hamburger — hidden on desktop */
        .hamburger-btn {
          display: none;
          background: transparent;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 8px;
          border-radius: 8px;
          transition: background .2s;
          flex-shrink: 0;
        }
        .hamburger-btn:hover { background: rgba(255,255,255,.08); }

        /* Mobile dropdown menu */
        .mobile-menu {
          display: none;
          position: fixed;
          top: 68px;
          left: 12px;
          right: 12px;
          background: rgba(11,20,38,.98);
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 20px;
          padding: 16px;
          flex-direction: column;
          gap: 4px;
          z-index: 300;
          box-shadow: 0 24px 50px rgba(0,0,0,.4);
          backdrop-filter: blur(20px);
        }
        .mobile-menu.open { display: flex; }

        .mobile-nav-link {
          color: rgba(255,255,255,.85);
          text-decoration: none;
          font-weight: 500;
          font-size: .95rem;
          padding: 12px 16px;
          border-radius: 12px;
          transition: background .2s, color .2s;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        .mobile-nav-link:hover {
          background: rgba(255,255,255,.08);
          color: #E8C97A;
        }

        .mobile-menu-divider {
          height: 1px;
          background: rgba(255,255,255,.1);
          margin: 8px 0;
        }

        .mobile-cta-row {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding-top: 4px;
        }

        /* ── RESPONSIVE: hide/show at 768px ── */
        @media (max-width: 768px) {
          .desktop-nav  { display: none !important; }
          .desktop-cta  { display: none !important; }
          .hamburger-btn { display: flex !important; align-items: center; justify-content: center; }
          .header-inner { padding: 14px 16px; }
        }

        /* Gold rule */
        .gold-rule { width: 48px; height: 2px; background: linear-gradient(90deg, var(--gold), var(--gold-light)); }

        /* Hero */
        .hero { position: relative; min-height: 100vh; overflow: hidden; }
        .hero-slide {
          position: absolute; inset: 0;
          transition: opacity .8s cubic-bezier(.4,0,.2,1);
        }
        .hero-overlay {
          position: absolute; inset: 0;
          background: linear-gradient(
            135deg,
            rgba(11,20,38,.92) 0%,
            rgba(11,20,38,.72) 50%,
            rgba(11,20,38,.50) 100%
          );
        }

        /* Slide-in text */
        @keyframes fadeUp {
          from { opacity:0; transform:translateY(28px); }
          to   { opacity:1; transform:translateY(0); }
        }
        .anim-1 { animation: fadeUp .7s .15s both; }
        .anim-2 { animation: fadeUp .7s .32s both; }
        .anim-3 { animation: fadeUp .7s .48s both; }
        .anim-4 { animation: fadeUp .7s .62s both; }

        /* Cards */
        .premium-card {
          background: rgba(255,255,255,.035);
          border: 1px solid var(--border);
          backdrop-filter: blur(14px);
          border-radius: 20px;
          transition: transform .3s, box-shadow .3s, border-color .3s;
        }
        .premium-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 20px 48px rgba(0,0,0,.18), 0 0 0 1px rgba(201,168,76,.28);
          border-color: rgba(201,168,76,.38);
        }
        .light-card {
          background: #fff;
          border: 1px solid rgba(201,168,76,.2);
          border-radius: 20px;
          transition: transform .3s, box-shadow .3s, border-color .3s;
          box-shadow: 0 2px 16px rgba(11,20,38,.06);
        }
        .light-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 16px 48px rgba(11,20,38,.12), 0 0 0 1.5px rgba(201,168,76,.35);
          border-color: rgba(201,168,76,.45);
        }

        /* Buttons */
        .btn-gold {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          color: var(--navy);
          font-family: 'DM Sans', sans-serif;
          font-weight: 600; font-size: .9rem;
          padding: 14px 28px; border-radius: 12px;
          border: none; cursor: pointer; text-decoration: none;
          transition: transform .2s, box-shadow .2s;
          box-shadow: 0 4px 20px rgba(201,168,76,.4);
          letter-spacing: .02em;
        }
        .btn-gold:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(201,168,76,.55); }

        .btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          background: transparent;
          color: var(--gold-light);
          font-family: 'DM Sans', sans-serif;
          font-weight: 500; font-size: .9rem;
          padding: 13px 26px; border-radius: 12px;
          border: 1.5px solid rgba(201,168,76,.45); cursor: pointer;
          text-decoration: none;
          transition: background .2s, border-color .2s, transform .2s;
        }
        .btn-ghost:hover {
          background: rgba(201,168,76,.08);
          border-color: rgba(201,168,76,.7);
          transform: translateY(-2px);
        }

        .btn-navy {
          display: inline-flex; align-items: center; gap: 8px;
          background: var(--navy); color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600; font-size: .9rem;
          padding: 14px 28px; border-radius: 12px;
          border: none; cursor: pointer; text-decoration: none;
          transition: transform .2s, box-shadow .2s;
          box-shadow: 0 4px 20px rgba(11,20,38,.3);
          letter-spacing: .02em;
        }
        .btn-navy:hover { transform: translateY(-2px); box-shadow: 0 8px 32px rgba(11,20,38,.45); }

        /* Mobile full-width button variant */
        .btn-gold-full  { width: 100%; justify-content: center; }
        .btn-ghost-full { width: 100%; justify-content: center; }

        /* Stats strip */
        .stats-strip { background: var(--gold); }

        /* Instructor avatar */
        .avatar-ring {
          width: 64px; height: 64px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          font-family: 'Cormorant Garamond', serif;
          font-size: 1.3rem; font-weight: 600;
          background: linear-gradient(135deg, var(--navy-soft), var(--navy-mid));
          color: var(--gold-light);
          border: 2px solid rgba(201,168,76,.4);
          flex-shrink: 0;
        }

        /* Dots */
        .hero-dot {
          width: 8px; height: 8px; border-radius: 50%;
          transition: all .3s; cursor: pointer;
          border: none;
        }
        .hero-dot.active { width: 32px; border-radius: 4px; background: var(--gold-light) !important; }

        /* Form elements */
        .form-input {
          width: 100%;
          background: #f8f5ef;
          border: 1.5px solid rgba(201,168,76,.25);
          border-radius: 12px;
          padding: 13px 14px 13px 44px;
          font-family: 'DM Sans', sans-serif;
          font-size: .9rem; color: var(--navy);
          outline: none;
          transition: border-color .2s, box-shadow .2s;
        }
        .form-input:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,.12); }

        .form-textarea {
          width: 100%;
          background: #f8f5ef;
          border: 1.5px solid rgba(201,168,76,.25);
          border-radius: 12px;
          padding: 13px 14px;
          font-family: 'DM Sans', sans-serif;
          font-size: .9rem; color: var(--navy);
          outline: none; resize: vertical; min-height: 130px;
          transition: border-color .2s, box-shadow .2s;
        }
        .form-textarea:focus { border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,.12); }

        .form-label {
          font-size: .82rem; font-weight: 600;
          color: var(--navy); letter-spacing: .04em;
          text-transform: uppercase; margin-bottom: 8px; display: block;
        }

        /* Scroll track */
        .scroll-track { scrollbar-width: thin; scrollbar-color: rgba(201,168,76,.3) transparent; }
        .scroll-track::-webkit-scrollbar { height: 4px; }
        .scroll-track::-webkit-scrollbar-thumb { background: rgba(201,168,76,.35); border-radius: 2px; }

        /* Why icon */
        .why-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: linear-gradient(135deg, var(--navy), var(--navy-soft));
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 8px 24px rgba(11,20,38,.15);
        }

        /* Badges */
        .badge-online  { background: #ecfdf5; color: #065f46; border: 1px solid #a7f3d0; }
        .badge-offline { background: #f1f5f9; color: #64748b; border: 1px solid #e2e8f0; }

        /* Footer */
        .site-footer { background: var(--navy); color: rgba(255,255,255,.7); }

        /* Hero card — hidden on mobile */
        .hero-card-col { display: flex; }
        @media (max-width: 900px) {
          .hero-card-col { display: none; }
        }

        /* Stats responsive */
        @media (max-width: 600px) {
          .stats-grid-inner { grid-template-columns: repeat(2,1fr) !important; }
        }

        /* Instructors section responsive */
        @media (max-width: 768px) {
          .instructors-outer { padding: 40px 16px !important; }
        }

        /* Footer responsive */
        @media (max-width: 640px) {
          .footer-grid { grid-template-columns: 1fr !important; }
        }

        /* Shimmer on gold */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position:  200% center; }
        }
        .gold-shimmer {
          background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 40%, var(--gold) 60%, var(--gold-light) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }

        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>

      <div className="grain" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* ══════════════════ HEADER ══════════════════ */}
        <header className={`site-header ${scrolled ? "solid" : "transparent"}`}>
          <div className="header-inner">

            {/* Logo */}
            <Link href="/" className="logo" style={{ textDecoration: "none" }}>
              <div className="logo-icon">
                <GraduationCap size={22} color="#0B1426" />
              </div>
              <div>
                <div className="logo-text">AiNextro</div>
                <div className="logo-subtitle">Learning Management</div>
              </div>
            </Link>

            {/* Desktop Nav (hidden on mobile) */}
            <nav className="desktop-nav">
              {[["Home","/"],["About","/about"],["Contact","/contact"],["Blog","/blog"]].map(([label,href])=>(
                <Link key={href} href={href} className="nav-link">{label}</Link>
              ))}
            </nav>

            {/* Desktop CTA (hidden on mobile) */}
            <div className="desktop-cta">
              <Link href="/login" className="btn-ghost" style={{ padding: "10px 20px", fontSize: ".85rem" }}>
                <LogIn size={16} /> Sign In
              </Link>
              <Link href="/register" className="btn-gold" style={{ padding: "10px 20px", fontSize: ".85rem" }}>
                <UserPlus size={16} /> Enroll Free
              </Link>
            </div>

            {/* Hamburger (visible only on mobile) */}
            <button
              className="hamburger-btn mobile-menu-toggle"
              onClick={() => setMobileMenuOpen((o) => !o)}
              aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>

          </div>

          {/* Mobile Dropdown Menu */}
          <div className={`mobile-menu ${mobileMenuOpen ? "open" : ""}`}>
            {[
              { label: "Home",    href: "/" },
              { label: "About",   href: "/about" },
              { label: "Contact", href: "/contact" },
              { label: "Blog",    href: "/blog" },
            ].map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                className="mobile-nav-link"
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </Link>
            ))}

            <div className="mobile-menu-divider" />

            <div className="mobile-cta-row">
              <Link
                href="/login"
                className="btn-ghost btn-ghost-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <LogIn size={16} /> Sign In
              </Link>
              <Link
                href="/register"
                className="btn-gold btn-gold-full"
                onClick={() => setMobileMenuOpen(false)}
              >
                <UserPlus size={16} /> Enroll Free
              </Link>
            </div>
          </div>
        </header>

        {/* ══════════════════ HERO ══════════════════ */}
        <section className="hero">
          {WISE_SLIDE_KEYS.map((key, i) => (
            <div key={key} className="hero-slide" style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}>
              <Image src={WISE_SLIDE_IMAGES[i]} alt="" fill className="object-cover object-center" sizes="100vw" priority={i === 0} />
              <div className="hero-overlay" />
            </div>
          ))}

          {/* Decorative grid */}
          <div style={{ position:"absolute",inset:0,zIndex:2,backgroundImage:"linear-gradient(rgba(201,168,76,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.04) 1px,transparent 1px)",backgroundSize:"80px 80px",pointerEvents:"none" }} />

          {/* Content */}
          <div style={{ position:"relative",zIndex:3,minHeight:"100vh",display:"flex",alignItems:"center",maxWidth:1280,margin:"0 auto",padding:"100px 24px 60px",gap:48 }}>

            {/* Left text */}
            <div style={{ flex:1,minWidth:0 }}>
              <div className="anim-1" style={{ display:"inline-flex",alignItems:"center",gap:8,background:"rgba(201,168,76,.12)",border:"1px solid rgba(201,168,76,.3)",borderRadius:999,padding:"6px 16px",marginBottom:24 }}>
                <span style={{ width:6,height:6,borderRadius:"50%",background:"#4ADE80",display:"inline-block" }} />
                <span style={{ color:"#E8C97A",fontSize:".78rem",fontWeight:500,letterSpacing:".08em",textTransform:"uppercase" }}>India's Premier Coaching Platform</span>
              </div>

              <h1 className="anim-2 display" style={{ fontSize:"clamp(2.8rem,6vw,5.2rem)",fontWeight:700,color:"#fff",lineHeight:1.05,marginBottom:20 }}>
                {t(`home.hero.${WISE_SLIDE_KEYS[current]}.title`) || "Unlock Your"}
                <br />
                <span className="gold-shimmer">Full Potential</span>
              </h1>

              <p className="anim-3" style={{ color:"rgba(255,255,255,.78)",fontSize:"1.1rem",lineHeight:1.7,maxWidth:520,marginBottom:36 }}>
                {t(`home.hero.${WISE_SLIDE_KEYS[current]}.subtitle`) || "Expert-led courses, live sessions, and certifications designed to accelerate your career to new heights."}
              </p>

              <div className="anim-4" style={{ display:"flex",gap:14,flexWrap:"wrap" }}>
                <Link href="/register" className="btn-gold"><UserPlus size={18} /> Start Learning Free</Link>
                <Link href="/login"    className="btn-ghost"><LogIn    size={18} /> Sign In</Link>
              </div>

              {/* Slide dots */}
              <div style={{ display:"flex",gap:8,marginTop:48 }}>
                {WISE_SLIDE_KEYS.map((_,i)=>(
                  <button
                    key={i}
                    onClick={()=>setCurrent(i)}
                    className={`hero-dot ${i===current?"active":""}`}
                    style={{ background:i===current?undefined:"rgba(255,255,255,.3)",cursor:"pointer" }}
                    aria-label={`Slide ${i+1}`}
                  />
                ))}
              </div>
            </div>

            {/* Right login card — hidden on mobile */}
            <div style={{ width:400,flexShrink:0,alignItems:"center" }} className="hero-card-col">
              <div style={{ width:"100%",background:"rgba(10,18,35,.82)",border:"1px solid rgba(201,168,76,.25)",borderRadius:24,padding:"40px 36px",backdropFilter:"blur(24px)",boxShadow:"0 32px 80px rgba(0,0,0,.45)" }}>
                <div style={{ marginBottom:8 }}>
                  <div className="gold-rule" style={{ marginBottom:16 }} />
                  <div className="display" style={{ color:"#fff",fontSize:"1.8rem",fontWeight:700,lineHeight:1.2 }}>Begin Your Journey</div>
                  <p style={{ color:"rgba(255,255,255,.55)",fontSize:".88rem",marginTop:8,lineHeight:1.6 }}>Join thousands of learners transforming their futures</p>
                </div>
                <div style={{ display:"flex",flexDirection:"column",gap:14,marginTop:32 }}>
                  <Link href="/login" className="btn-gold" style={{ justifyContent:"center",padding:"15px 24px",fontSize:".95rem" }}>
                    <LogIn size={18} /> Sign In to Your Account
                  </Link>
                  <div style={{ display:"flex",alignItems:"center",gap:12,margin:"4px 0" }}>
                    <div style={{ flex:1,height:1,background:"rgba(255,255,255,.1)" }} />
                    <span style={{ color:"rgba(255,255,255,.35)",fontSize:".78rem",textTransform:"uppercase",letterSpacing:".08em" }}>or</span>
                    <div style={{ flex:1,height:1,background:"rgba(255,255,255,.1)" }} />
                  </div>
                  <Link href="/register" className="btn-ghost" style={{ justifyContent:"center",padding:"14px 24px",fontSize:".95rem" }}>
                    <UserPlus size={18} /> Create Free Account
                  </Link>
                </div>
                <div style={{ marginTop:28,paddingTop:24,borderTop:"1px solid rgba(255,255,255,.08)" }}>
                  <p style={{ color:"rgba(255,255,255,.4)",fontSize:".75rem",textTransform:"uppercase",letterSpacing:".08em",marginBottom:14 }}>
                    <Shield size={11} style={{ display:"inline",marginRight:5,verticalAlign:"middle" }} />Quick Guide
                  </p>
                  <p style={{ color:"rgba(255,255,255,.55)",fontSize:".84rem",lineHeight:1.65 }}>
                    <strong style={{ color:"rgba(255,255,255,.85)" }}>New here?</strong> Register for free and explore 200+ curated courses.
                  </p>
                  <p style={{ color:"rgba(255,255,255,.55)",fontSize:".84rem",lineHeight:1.65,marginTop:8 }}>
                    <strong style={{ color:"rgba(255,255,255,.85)" }}>Already enrolled?</strong> Sign in and resume right where you left off.
                  </p>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* ══════════════════ STATS STRIP ══════════════════ */}
        <div className="stats-strip" style={{ background:"linear-gradient(135deg,#C9A84C,#E8C97A)",padding:"28px 24px" }}>
          <div className="stats-grid-inner" style={{ maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(160px,1fr))",gap:8 }}>
            {STATS.map(({ value,label,icon:Icon })=>(
              <div key={label} style={{ textAlign:"center",padding:"10px 8px" }}>
                <Icon size={20} color="rgba(11,20,38,.6)" style={{ marginBottom:6 }} />
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"2rem",color:"#0B1426",lineHeight:1 }}>{value}</div>
                <div style={{ fontSize:".8rem",fontWeight:600,color:"rgba(11,20,38,.65)",letterSpacing:".04em",marginTop:4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════ EXPERTS SCROLL ══════════════════ */}
        <section className="instructors-outer" style={{ background:"#fff",padding:"52px 0",borderBottom:"1px solid rgba(201,168,76,.12)" }}>
          <p style={{ textAlign:"center",fontSize:".75rem",fontWeight:700,color:"#94A3B8",letterSpacing:".14em",textTransform:"uppercase",marginBottom:28 }}>
            Learn From World-Class Experts
          </p>
          <div style={{ display:"flex",alignItems:"center",gap:12,padding:"0 24px",maxWidth:1280,margin:"0 auto" }}>
            <button
              onClick={()=>teachersScrollRef.current?.scrollBy({left:-260,behavior:"smooth"})}
              style={{ width:40,height:40,borderRadius:"50%",border:"1.5px solid rgba(201,168,76,.35)",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all .2s" }}
              onMouseEnter={e=>{(e.currentTarget.style.background="#C9A84C");(e.currentTarget.style.borderColor="#C9A84C");}}
              onMouseLeave={e=>{(e.currentTarget.style.background="#fff");(e.currentTarget.style.borderColor="rgba(201,168,76,.35)");}}
            >
              <ChevronLeft size={18} color="#C9A84C" />
            </button>

            {/* FIX: single className, ref correctly applied */}
            <div ref={teachersScrollRef} className="scroll-track" style={{ flex:1,overflowX:"auto",paddingBottom:4 }}>
              <div style={{ display:"flex",gap:36,width:"max-content",padding:"4px 4px" }}>
                {[...TEACHERS,...TEACHERS].map((teacher,i)=>(
                  <div key={`${teacher.id}-${i}`} style={{ display:"flex",flexDirection:"column",alignItems:"center",gap:10,flexShrink:0 }}>
                    <div style={{ width:72,height:72,borderRadius:"50%",background:"linear-gradient(135deg,#14213D,#1E3A5F)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:"1.4rem",fontWeight:700,color:"#E8C97A",border:"2px solid rgba(201,168,76,.3)",boxShadow:"0 4px 16px rgba(11,20,38,.1)" }}>
                      {INITIALS(teacher.name)}
                    </div>
                    <div style={{ textAlign:"center" }}>
                      <div style={{ fontSize:".82rem",fontWeight:600,color:"#0B1426",whiteSpace:"nowrap" }}>{teacher.name.split(" ")[0]}</div>
                      <div style={{ fontSize:".72rem",color:"#94A3B8",marginTop:1 }}>{teacher.role.split(" ")[0]}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <button
              onClick={()=>teachersScrollRef.current?.scrollBy({left:260,behavior:"smooth"})}
              style={{ width:40,height:40,borderRadius:"50%",border:"1.5px solid rgba(201,168,76,.35)",background:"#fff",display:"flex",alignItems:"center",justifyContent:"center",cursor:"pointer",flexShrink:0,transition:"all .2s" }}
              onMouseEnter={e=>{(e.currentTarget.style.background="#C9A84C");(e.currentTarget.style.borderColor="#C9A84C");}}
              onMouseLeave={e=>{(e.currentTarget.style.background="#fff");(e.currentTarget.style.borderColor="rgba(201,168,76,.35)");}}
            >
              <ChevronRight size={18} color="#C9A84C" />
            </button>
          </div>
        </section>

        {/* ══════════════════ WHY US ══════════════════ */}
        <section style={{ background:"var(--cream)",padding:"96px 24px" }}>
          <div style={{ maxWidth:1280,margin:"0 auto" }}>
            <div style={{ textAlign:"center",marginBottom:64 }}>
              <div style={{ display:"inline-flex",alignItems:"center",gap:10,marginBottom:16 }}>
                <div className="gold-rule" />
                <span style={{ fontSize:".75rem",fontWeight:700,color:"#C9A84C",letterSpacing:".12em",textTransform:"uppercase" }}>Why Choose Us</span>
                <div className="gold-rule" />
              </div>
              <h2 className="display" style={{ fontSize:"clamp(2rem,4vw,3.2rem)",fontWeight:700,color:"#0B1426",lineHeight:1.15 }}>
                {t("home.why.title") || "Excellence in Every Lesson"}
              </h2>
              <p style={{ color:"#64748B",fontSize:"1.05rem",maxWidth:540,margin:"16px auto 0",lineHeight:1.7 }}>
                {t("home.why.subtitle") || "We combine world-class pedagogy with cutting-edge technology to deliver transformative learning experiences."}
              </p>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:28 }}>
              {[
                { icon:BookOpen, title:t("home.why.card1.title")||"Curated Curriculum",   desc:t("home.why.card1.desc")||"Every course is built by industry veterans and refined through learner feedback for maximum impact." },
                { icon:FileCheck,title:t("home.why.card2.title")||"Certified Outcomes",   desc:t("home.why.card2.desc")||"Earn recognised certificates that employers trust, boosting your career prospects from day one." },
                { icon:Users,    title:t("home.why.card3.title")||"Community & Mentorship",desc:t("home.why.card3.desc")||"Join a vibrant cohort of motivated peers and get direct guidance from your instructors." },
              ].map(({ icon:Icon,title,desc })=>(
                <div key={title} className="light-card" style={{ padding:"40px 36px" }}>
                  <div className="why-icon"><Icon size={24} color="#C9A84C" /></div>
                  <h3 style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"1.45rem",color:"#0B1426",marginBottom:12,lineHeight:1.25 }}>{title}</h3>
                  <p style={{ color:"#64748B",fontSize:".93rem",lineHeight:1.7 }}>{desc}</p>
                  <div style={{ marginTop:24,display:"flex",alignItems:"center",gap:8,color:"#C9A84C",fontSize:".83rem",fontWeight:600,letterSpacing:".04em" }}>
                    <span>Learn more</span><ChevronRight size={14} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ INSTRUCTORS ══════════════════ */}
        <section style={{ background:"#0B1426",padding:"96px 24px" }}>
          <div style={{ maxWidth:1280,margin:"0 auto" }}>
            <div style={{ textAlign:"center",marginBottom:64 }}>
              <div style={{ display:"inline-flex",alignItems:"center",gap:10,marginBottom:16 }}>
                <div className="gold-rule" />
                <span style={{ fontSize:".75rem",fontWeight:700,color:"#C9A84C",letterSpacing:".12em",textTransform:"uppercase" }}>Our Faculty</span>
                <div className="gold-rule" />
              </div>
              <h2 className="display" style={{ fontSize:"clamp(2rem,4vw,3.2rem)",fontWeight:700,color:"#fff",lineHeight:1.15 }}>
                {t("home.instructors.title") || "Meet Your Mentors"}
              </h2>
              <p style={{ color:"rgba(255,255,255,.55)",fontSize:"1.05rem",maxWidth:520,margin:"16px auto 0",lineHeight:1.7 }}>
                {t("home.instructors.subtitle") || "Seasoned professionals who've excelled in their fields — now dedicated to your growth."}
              </p>
            </div>
            <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(300px,1fr))",gap:24 }}>
              {TEACHERS.map((teacher)=>(
                <div key={teacher.id} className="premium-card" style={{ padding:"32px 28px" }}>
                  <div style={{ display:"flex",alignItems:"flex-start",gap:18 }}>
                    <div style={{ width:60,height:60,borderRadius:"50%",background:"linear-gradient(135deg,#C9A84C,#E8C97A)",display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"'Cormorant Garamond',serif",fontSize:"1.25rem",fontWeight:700,color:"#0B1426",flexShrink:0 }}>
                      {INITIALS(teacher.name)}
                    </div>
                    <div style={{ flex:1,minWidth:0 }}>
                      <div style={{ color:"#fff",fontWeight:600,fontSize:"1rem",lineHeight:1.3 }}>{teacher.name}</div>
                      <div style={{ color:"rgba(201,168,76,.8)",fontSize:".82rem",marginTop:3 }}>{teacher.role}</div>
                      <span className={teacher.online?"badge-online":"badge-offline"} style={{ display:"inline-flex",alignItems:"center",gap:5,borderRadius:999,padding:"3px 10px",fontSize:".72rem",fontWeight:600,marginTop:10 }}>
                        <Circle size={6} fill="currentColor" />
                        {teacher.online?"Available Now":"Offline"}
                      </span>
                    </div>
                  </div>
                  <div style={{ marginTop:24,paddingTop:20,borderTop:"1px solid rgba(255,255,255,.06)",display:"grid",gridTemplateColumns:"1fr 1fr",gap:12 }}>
                    {[{val:teacher.courses,lbl:"Courses"},{val:teacher.students.toLocaleString(),lbl:"Students"}].map(({val,lbl})=>(
                      <div key={lbl} style={{ textAlign:"center",background:"rgba(255,255,255,.04)",borderRadius:12,padding:"14px 8px",border:"1px solid rgba(255,255,255,.06)" }}>
                        <div style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"1.6rem",color:"#E8C97A",lineHeight:1 }}>{val}</div>
                        <div style={{ color:"rgba(255,255,255,.4)",fontSize:".75rem",marginTop:4,letterSpacing:".04em" }}>{lbl}</div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ BLOG SECTION ══════════════════ */}
        <section style={{ background:"#FAF6EE",padding:"96px 24px" }}>
          <div style={{ maxWidth:1280,margin:"0 auto" }}>
            <div style={{ textAlign:"center",marginBottom:56 }}>
              <div style={{ display:"inline-flex",alignItems:"center",gap:10,marginBottom:16 }}>
                <div className="gold-rule" />
                <span style={{ fontSize:".75rem",fontWeight:700,color:"#C9A84C",letterSpacing:".12em",textTransform:"uppercase" }}>Latest Articles</span>
                <div className="gold-rule" />
              </div>
              <h2 className="display" style={{ fontSize:"clamp(2rem,4vw,3.2rem)",fontWeight:700,color:"#0B1426",lineHeight:1.15 }}>
                {t("home.blog.title") || "Learn From Expert Insights"}
              </h2>
              <p style={{ color:"#64748B",fontSize:"1.05rem",maxWidth:460,margin:"16px auto 0",lineHeight:1.7 }}>
                {t("home.blog.subtitle") || "Read articles shared by our instructors to enhance your learning journey."}
              </p>
            </div>

            {blogsLoading && (
              <div style={{ display:"flex",alignItems:"center",justifyContent:"center",padding:"60px 24px" }}>
                <div style={{ width:40,height:40,border:"3px solid rgba(201,168,76,.2)",borderTopColor:"#C9A84C",borderRadius:"50%",animation:"spin 1s linear infinite" }} />
              </div>
            )}

            {blogsError && (
              <div style={{ background:"#fef2f2",border:"1px solid #fca5a5",color:"#b91c1c",borderRadius:12,padding:"20px 24px",textAlign:"center" }}>
                {blogsError}
              </div>
            )}

            {!blogsLoading && !blogsError && blogs.length === 0 && (
              <div style={{ background:"#f1f5f9",borderRadius:12,padding:"40px 24px",textAlign:"center",color:"#64748B" }}>
                <BookOpen size={48} style={{ margin:"0 auto 16px",opacity:0.5,display:"block" }} />
                <p style={{ fontSize:"1rem" }}>No blogs published yet. Check back soon!</p>
              </div>
            )}

            {!blogsLoading && blogs.length > 0 && (
              <div style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(320px,1fr))",gap:28 }}>
                {blogs.map((blog:any)=>(
                  <Link key={blog._id} href={`/blog/${blog.slug??blog._id}`} style={{ textDecoration:"none" }}>
                    <div className="light-card" style={{ padding:"24px",display:"flex",flexDirection:"column",height:"100%",cursor:"pointer" }}>
                      <div style={{ background:"linear-gradient(135deg,#C9A84C,#E8C97A)",height:200,borderRadius:12,marginBottom:20,display:"flex",alignItems:"center",justifyContent:"center",color:"#0B1426" }}>
                        <BookOpen size={48} />
                      </div>
                      <h3 className="display" style={{ fontSize:"1.2rem",fontWeight:700,color:"#0B1426",marginBottom:12,lineHeight:1.4 }}>{blog.title}</h3>
                      <p style={{ color:"#64748B",fontSize:".95rem",lineHeight:1.6,marginBottom:16,flex:1 }}>
                        {blog.excerpt??"No excerpt available"}
                      </p>
                      <div style={{ display:"flex",alignItems:"center",gap:12,paddingTop:16,borderTop:"1px solid rgba(201,168,76,.15)" }}>
                        <Calendar size={14} color="#C9A84C" />
                        <span style={{ fontSize:".85rem",color:"#94A3B8" }}>
                          {blog.createdAt?new Date(blog.createdAt).toLocaleDateString():"Recently"}
                        </span>
                        {blog.likes!==undefined&&(
                          <>
                            <span style={{ color:"#E2E8F0" }}>·</span>
                            <span style={{ fontSize:".85rem",color:"#94A3B8" }}>{blog.likes} likes</span>
                          </>
                        )}
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            )}

            {!blogsLoading && blogs.length > 0 && (
              <div style={{ textAlign:"center",marginTop:48 }}>
                <Link
                  href="/blog"
                  style={{ display:"inline-flex",alignItems:"center",gap:8,background:"linear-gradient(135deg,#C9A84C,#E8C97A)",color:"#0B1426",fontWeight:600,padding:"14px 28px",borderRadius:12,textDecoration:"none",transition:"transform .2s" }}
                  onMouseEnter={e=>e.currentTarget.style.transform="translateY(-2px)"}
                  onMouseLeave={e=>e.currentTarget.style.transform="translateY(0)"}
                >
                  View All Blogs
                </Link>
              </div>
            )}
          </div>
        </section>

        {/* ══════════════════ FOOTER ══════════════════ */}
        <footer className="site-footer">
          <div style={{ maxWidth:1280,margin:"0 auto",padding:"64px 24px 32px" }}>
            <div className="footer-grid" style={{ display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(200px,1fr))",gap:40,marginBottom:48 }}>
              <div>
                <div style={{ display:"flex",alignItems:"center",gap:12,marginBottom:16 }}>
                  <div style={{ width:36,height:36,borderRadius:9,background:"linear-gradient(135deg,#C9A84C,#E8C97A)",display:"flex",alignItems:"center",justifyContent:"center" }}>
                    <GraduationCap size={18} color="#0B1426" />
                  </div>
                  <span style={{ fontFamily:"'Cormorant Garamond',serif",fontWeight:700,fontSize:"1.2rem",color:"#fff" }}>AiNextro LMS</span>
                </div>
                <p style={{ fontSize:".85rem",lineHeight:1.7,maxWidth:240 }}>
                  {t("common.footer.tagline")||"Transforming careers through world-class education and expert mentorship."}
                </p>
              </div>
              <div>
                <h4 style={{ color:"#C9A84C",fontSize:".72rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",marginBottom:20 }}>Contact</h4>
                <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                  {[
                    { icon:<Phone size={14}/>,text:"9772609110",href:"tel:+919772609110" },
                    { icon:<Phone size={14}/>,text:"9660439686",href:"tel:+919660439686" },
                    { icon:<Mail  size={14}/>,text:"officialrahusen01@gmail.com",href:"mailto:officialrahusen01@gmail.com" },
                  ].map(({icon,text,href})=>(
                    <a key={href} href={href} style={{ display:"flex",alignItems:"flex-start",gap:10,color:"rgba(255,255,255,.55)",fontSize:".85rem",textDecoration:"none",transition:"color .2s" }}
                      onMouseEnter={e=>(e.currentTarget.style.color="#E8C97A")}
                      onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,.55)")}
                    >
                      <span style={{ marginTop:2,flexShrink:0 }}>{icon}</span> {text}
                    </a>
                  ))}
                </div>
              </div>
              <div>
                <h4 style={{ color:"#C9A84C",fontSize:".72rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",marginBottom:20 }}>Quick Links</h4>
                <div style={{ display:"flex",flexDirection:"column",gap:12 }}>
                  {[["About Us","/about"],["Contact","/#contact"],["Sign In","/login"],["Register","/register"]].map(([label,href])=>(
                    <Link key={href} href={href} style={{ color:"rgba(255,255,255,.55)",fontSize:".85rem",textDecoration:"none",transition:"color .2s" }}
                      onMouseEnter={e=>(e.currentTarget.style.color="#E8C97A")}
                      onMouseLeave={e=>(e.currentTarget.style.color="rgba(255,255,255,.55)")}
                    >{label}</Link>
                  ))}
                </div>
              </div>
              <div>
                <h4 style={{ color:"#C9A84C",fontSize:".72rem",fontWeight:700,letterSpacing:".12em",textTransform:"uppercase",marginBottom:20 }}>Newsletter</h4>
                <p style={{ fontSize:".85rem",lineHeight:1.6,marginBottom:16 }}>Get weekly learning tips and new course alerts.</p>
                <div style={{ display:"flex",borderRadius:12,overflow:"hidden",border:"1px solid rgba(201,168,76,.25)" }}>
                  <input type="email" placeholder="your@email.com" style={{ flex:1,background:"rgba(255,255,255,.05)",border:"none",padding:"11px 14px",color:"#fff",fontSize:".85rem",outline:"none",fontFamily:"'DM Sans',sans-serif" }} />
                  <button style={{ background:"linear-gradient(135deg,#C9A84C,#E8C97A)",border:"none",padding:"0 16px",cursor:"pointer" }}>
                    <Send size={14} color="#0B1426" />
                  </button>
                </div>
              </div>
            </div>
            <div style={{ borderTop:"1px solid rgba(255,255,255,.08)",paddingTop:28,display:"flex",flexWrap:"wrap",justifyContent:"space-between",alignItems:"center",gap:12 }}>
              <p style={{ fontSize:".82rem" }}>© {new Date().getFullYear()} AiNextro LMS. {t("common.footer.copyright")||"All rights reserved."}</p>
              <p style={{ fontSize:".82rem",display:"flex",alignItems:"center",gap:8 }}>
                <Award size={14} color="#C9A84C" /> {t("common.footer.empowering")||"Empowering learners across India"}
              </p>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}