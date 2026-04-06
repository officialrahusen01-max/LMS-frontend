"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { LogIn, UserPlus, BookOpen, ArrowLeft, Users, Award, Target, TrendingUp, CheckCircle, Star, GraduationCap, Zap } from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";
import { useTranslationHook } from "@/lib/translations";

export default function AboutPage() {
  const { t, tArray } = useTranslationHook();
  const functionsList = tArray("about.functionsList");
  const standardsList = tArray("about.standardsList");

  return (
    <>
      {/* ══════════════════ GLOBAL STYLES (Same as Home) ══════════════════ */}
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

        /* Header */
        .site-header {
          position: fixed; top: 0; left: 0; right: 0; z-index: 100;
          transition: background .4s, box-shadow .4s, padding .3s;
        }
        .site-header.solid {
          background: rgba(11,20,38,.96);
          backdrop-filter: blur(18px);
          box-shadow: 0 1px 0 var(--border), 0 8px 32px rgba(0,0,0,.35);
        }
        .site-header.transparent { background: transparent; }

        /* Gold rule */
        .gold-rule { width: 48px; height: 2px; background: linear-gradient(90deg, var(--gold), var(--gold-light)); }

        /* Buttons */
        .btn-gold {
          display: inline-flex; align-items: center; gap: 8px;
          background: linear-gradient(135deg, var(--gold), var(--gold-light));
          color: var(--navy);
          font-family: 'DM Sans', sans-serif;
          font-weight: 600; font-size: .9rem;
          padding: 14px 28px; border-radius: 12px;
          border: none; cursor: pointer; text-decoration: none;
          transition: transform .2s, box-shadow .2s, opacity .2s;
          box-shadow: 0 4px 20px rgba(201,168,76,.4);
          letter-spacing: .02em;
        }
        .btn-gold:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(201,168,76,.55);
        }
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
          background: var(--navy);
          color: #fff;
          font-family: 'DM Sans', sans-serif;
          font-weight: 600; font-size: .9rem;
          padding: 14px 28px; border-radius: 12px;
          border: none; cursor: pointer; text-decoration: none;
          transition: transform .2s, box-shadow .2s;
          box-shadow: 0 4px 20px rgba(11,20,38,.3);
          letter-spacing: .02em;
        }
        .btn-navy:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 32px rgba(11,20,38,.45);
        }

        /* Card */
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

        /* Light card */
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

        /* Section bg alternation */
        .section-cream { background: var(--cream); }
        .section-navy  { background: var(--navy); }
        .section-white { background: #fff; }

        /* Why icon */
        .why-icon {
          width: 52px; height: 52px; border-radius: 14px;
          background: linear-gradient(135deg, var(--navy), var(--navy-soft));
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 24px;
          box-shadow: 0 8px 24px rgba(11,20,38,.15);
        }

        /* Avatar */
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

        /* Footer */
        .site-footer { background: var(--navy); color: rgba(255,255,255,.7); }

        /* Stats strip */
        .stats-strip { background: linear-gradient(135deg, #C9A84C, #E8C97A); }

        /* Shimmer on gold */
        @keyframes shimmer {
          0%   { background-position: -200% center; }
          100% { background-position: 200% center; }
        }
        .gold-shimmer {
          background: linear-gradient(90deg, var(--gold) 0%, var(--gold-light) 40%, var(--gold) 60%, var(--gold-light) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: shimmer 4s linear infinite;
        }

        /* Fade in animation */
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform:translateY(0); }
        }
        .fade-in { animation: fadeInUp 0.8s ease-out; }

        @media (max-width: 768px) {
          .hero-mobile-cta { display: flex !important; gap: 12px; flex-wrap: wrap; margin-top: 28px; }
        }
        @media (min-width: 769px) {
          .hero-mobile-cta { display: none !important; }
        }
      `}</style>

      <div className="grain" style={{ minHeight: "100vh", display: "flex", flexDirection: "column" }}>

        {/* ══════════════════ HEADER (Same as Home) ══════════════════ */}
        <header className="site-header solid">
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "18px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 16 }}>

            {/* Logo */}
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <div style={{ width: 40, height: 40, borderRadius: 10, background: "linear-gradient(135deg,#C9A84C,#E8C97A)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 14px rgba(201,168,76,.4)" }}>
                <GraduationCap size={22} color="#0B1426" />
              </div>
              <div>
                <div style={{ fontFamily: "'Cormorant Garamond', serif", fontWeight: 700, fontSize: "1.25rem", color: "#fff", lineHeight: 1.1 }}>AiNextro</div>
                <div style={{ fontSize: ".65rem", color: "rgba(201,168,76,.85)", letterSpacing: ".12em", textTransform: "uppercase" }}>Learning Management</div>
              </div>
            </div>

            {/* Nav */}
            <nav style={{ display: "flex", alignItems: "center", gap: 32 }}>
              <Link href="/" style={{ color: "rgba(255,255,255,.78)", fontSize: ".88rem", fontWeight: 500, textDecoration: "none", letterSpacing: ".02em", transition: "color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#E8C97A")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.78)")}
              >Home</Link>
              <Link href="/about" style={{ color: "#E8C97A", fontSize: ".88rem", fontWeight: 600, textDecoration: "none", letterSpacing: ".02em", borderBottom: "2px solid #E8C97A", paddingBottom: "4px" }}
              >About</Link>
              <Link href="/contact" style={{ color: "rgba(255,255,255,.78)", fontSize: ".88rem", fontWeight: 500, textDecoration: "none", letterSpacing: ".02em", transition: "color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#E8C97A")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.78)")}
              >Contact</Link>
            </nav>

            {/* CTAs */}
            <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
              <Link href="/login" className="btn-ghost" style={{ padding: "10px 20px", fontSize: ".85rem" }}>
                <LogIn size={16} /> Sign In
              </Link>
              <Link href="/register" className="btn-gold" style={{ padding: "10px 20px", fontSize: ".85rem" }}>
                <UserPlus size={16} /> Enroll Free
              </Link>
            </div>

          </div>
        </header>

        {/* ══════════════════ HERO SECTION ══════════════════ */}
        <section style={{ background: "linear-gradient(135deg, #0B1426, #14213D)", padding: "120px 24px 80px", position: "relative", overflow: "hidden" }}>
          {/* Background pattern */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(201,168,76,.04) 1px,transparent 1px),linear-gradient(90deg,rgba(201,168,76,.04) 1px,transparent 1px)", backgroundSize: "80px 80px", opacity: 0.3 }} />

          <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative", zIndex: 2 }}>
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="fade-in" style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(201,168,76,.12)", border: "1px solid rgba(201,168,76,.3)", borderRadius: 999, padding: "6px 16px", marginBottom: 24 }}>
                <span style={{ width: 6, height: 6, borderRadius: "50%", background: "#4ADE80", display: "inline-block" }} />
                <span style={{ color: "#E8C97A", fontSize: ".78rem", fontWeight: 500, letterSpacing: ".08em", textTransform: "uppercase" }}>About Our Academy</span>
              </div>

              <h1 className="display fade-in" style={{ fontSize: "clamp(2.8rem, 6vw, 5.2rem)", fontWeight: 700, color: "#fff", lineHeight: 1.05, marginBottom: 20 }}>
                Empowering Minds,<br />
                <span className="gold-shimmer">Shaping Futures</span>
              </h1>

              <p className="fade-in" style={{ color: "rgba(255,255,255,.78)", fontSize: "1.1rem", lineHeight: 1.7, maxWidth: 680, margin: "0 auto 36px" }}>
                Since our founding, we've been committed to delivering world-class education that transforms lives and builds successful careers across India and beyond.
              </p>

              <div className="fade-in hero-mobile-cta" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <Link href="/register" className="btn-gold">
                  <UserPlus size={18} /> Join Our Community
                </Link>
                <Link href="/contact" className="btn-ghost">
                  <BookOpen size={18} /> Learn More
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════ STATS STRIP ══════════════════ */}
        <div className="stats-strip" style={{ padding: "28px 24px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))", gap: 8 }}>
            {[
              { value: "10+", label: "Years Experience", icon: Award },
              { value: "50,000+", label: "Students Taught", icon: Users },
              { value: "98%", label: "Success Rate", icon: TrendingUp },
              { value: "500+", label: "Expert Faculty", icon: Star },
            ].map(({ value, label, icon: Icon }) => (
              <div key={label} style={{ textAlign: "center", padding: "10px 8px" }}>
                <Icon size={20} color="rgba(11,20,38,.6)" style={{ marginBottom: 6 }} />
                <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "2rem", color: "#0B1426", lineHeight: 1 }}>{value}</div>
                <div style={{ fontSize: ".8rem", fontWeight: 600, color: "rgba(11,20,38,.65)", letterSpacing: ".04em", marginTop: 4 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* ══════════════════ OUR STORY ══════════════════ */}
        <section style={{ background: "#fff", padding: "96px 24px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div className="gold-rule" />
                <span style={{ fontSize: ".75rem", fontWeight: 700, color: "#C9A84C", letterSpacing: ".12em", textTransform: "uppercase" }}>Our Story</span>
                <div className="gold-rule" />
              </div>
              <h2 className="display" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 700, color: "#0B1426", lineHeight: 1.15 }}>
                {t("about.title") || "A Legacy of Excellence"}
              </h2>
              <p style={{ color: "#64748B", fontSize: "1.05rem", maxWidth: 540, margin: "16px auto 0", lineHeight: 1.7 }}>
                {t("about.subtitle") || "From humble beginnings to India's premier educational institution"}
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 32, marginBottom: 64 }}>
              <div className="light-card" style={{ padding: "40px 36px" }}>
                <div className="why-icon">
                  <Target size={24} color="#C9A84C" />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.45rem", color: "#0B1426", marginBottom: 12, lineHeight: 1.25 }}>Our Mission</h3>
                <p style={{ color: "#64748B", fontSize: ".93rem", lineHeight: 1.7 }}>
                  To provide accessible, high-quality education that empowers individuals to achieve their full potential and contribute meaningfully to society.
                </p>
              </div>

              <div className="light-card" style={{ padding: "40px 36px" }}>
                <div className="why-icon">
                  <Zap size={24} color="#C9A84C" />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.45rem", color: "#0B1426", marginBottom: 12, lineHeight: 1.25 }}>Our Vision</h3>
                <p style={{ color: "#64748B", fontSize: ".93rem", lineHeight: 1.7 }}>
                  To be the leading educational platform in India, recognized globally for innovation, excellence, and transformative learning experiences.
                </p>
              </div>

              <div className="light-card" style={{ padding: "40px 36px" }}>
                <div className="why-icon">
                  <Award size={24} color="#C9A84C" />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.45rem", color: "#0B1426", marginBottom: 12, lineHeight: 1.25 }}>Our Values</h3>
                <p style={{ color: "#64748B", fontSize: ".93rem", lineHeight: 1.7 }}>
                  Integrity, innovation, inclusivity, and excellence guide everything we do, ensuring the best possible outcomes for our students.
                </p>
              </div>
            </div>

            {/* Story content */}
            <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
              <div style={{ color: "#64748B", fontSize: "1.05rem", lineHeight: 1.8, marginBottom: 32 }}>
                <p style={{ marginBottom: 20 }}>
                  Founded with a vision to democratize quality education, AiNextro has grown from a small coaching center to India's most trusted learning platform. Our journey began with a simple belief: that every student deserves access to world-class education, regardless of their background or location.
                </p>
                <p>
                  Today, we serve over 50,000 students across the country, offering comprehensive courses in competitive exams, professional development, and skill enhancement. Our faculty of 500+ expert educators brings decades of experience and a passion for teaching that inspires excellence in every student.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════ FUNCTIONS & STANDARDS ══════════════════ */}
        <section style={{ background: "var(--cream)", padding: "96px 24px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div className="gold-rule" />
                <span style={{ fontSize: ".75rem", fontWeight: 700, color: "#C9A84C", letterSpacing: ".12em", textTransform: "uppercase" }}>What We Offer</span>
                <div className="gold-rule" />
              </div>
              <h2 className="display" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 700, color: "#0B1426", lineHeight: 1.15 }}>
                Excellence in Education
              </h2>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 32 }}>
              <div className="light-card" style={{ padding: "40px 36px" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.45rem", color: "#0B1426", marginBottom: 20, lineHeight: 1.25 }}>
                  {t("about.functions") || "Our Functions"}
                </h3>
                <ul style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {(functionsList.length > 0 ? functionsList : [
                    "Comprehensive curriculum design and delivery",
                    "Personalized learning paths for every student",
                    "Advanced assessment and progress tracking",
                    "24/7 student support and mentorship",
                    "Industry-relevant skill development programs"
                  ]).map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <CheckCircle size={20} color="#4ADE80" style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ color: "#64748B", fontSize: ".93rem", lineHeight: 1.6 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="light-card" style={{ padding: "40px 36px" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.45rem", color: "#0B1426", marginBottom: 20, lineHeight: 1.25 }}>
                  {t("about.standards") || "Our Standards"}
                </h3>
                <ul style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                  {(standardsList.length > 0 ? standardsList : [
                    "Internationally recognized certifications",
                    "Industry-leading success rates (98%)",
                    "Expert faculty with proven track records",
                    "State-of-the-art learning technology",
                    "Continuous curriculum innovation"
                  ]).map((item, i) => (
                    <li key={i} style={{ display: "flex", alignItems: "flex-start", gap: 12 }}>
                      <CheckCircle size={20} color="#4ADE80" style={{ marginTop: 2, flexShrink: 0 }} />
                      <span style={{ color: "#64748B", fontSize: ".93rem", lineHeight: 1.6 }}>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════ LEADERSHIP ══════════════════ */}
        <section style={{ background: "#0B1426", padding: "96px 24px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div className="gold-rule" />
                <span style={{ fontSize: ".75rem", fontWeight: 700, color: "#C9A84C", letterSpacing: ".12em", textTransform: "uppercase" }}>Leadership</span>
                <div className="gold-rule" />
              </div>
              <h2 className="display" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 700, color: "#fff", lineHeight: 1.15 }}>
                Meet Our Founders
              </h2>
              <p style={{ color: "rgba(255,255,255,.55)", fontSize: "1.05rem", maxWidth: 520, margin: "16px auto 0", lineHeight: 1.7 }}>
                Visionary leaders driving educational excellence
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(300px,1fr))", gap: 24 }}>
              {[
                { name: "Dr. Rajesh Kumar", role: "Founder & CEO", desc: "Former IIT professor with 15+ years in education leadership" },
                { name: "Priya Sharma", role: "Co-Founder & COO", desc: "EdTech innovator with experience at top educational institutions" },
                { name: "Dr. Amit Patel", role: "Chief Academic Officer", desc: "PhD in Education Technology, curriculum design expert" },
              ].map((leader, i) => (
                <div key={i} className="premium-card" style={{ padding: "32px 28px" }}>
                  <div style={{ display: "flex", alignItems: "flex-start", gap: 18 }}>
                    <div className="avatar-ring">
                      {leader.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ color: "#fff", fontWeight: 600, fontSize: "1rem", lineHeight: 1.3 }}>{leader.name}</div>
                      <div style={{ color: "rgba(201,168,76,.8)", fontSize: ".82rem", marginTop: 3 }}>{leader.role}</div>
                      <div style={{ color: "rgba(255,255,255,.6)", fontSize: ".85rem", marginTop: 12, lineHeight: 1.5 }}>{leader.desc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ══════════════════ CTA SECTION ══════════════════ */}
        <section style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", padding: "80px 24px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <h2 className="display" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 700, color: "#0B1426", lineHeight: 1.15, marginBottom: 20 }}>
              Ready to Start Your Journey?
            </h2>
            <p style={{ color: "rgba(11,20,38,.7)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: 32 }}>
              Join thousands of successful students who have transformed their careers with us
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/register" className="btn-navy">
                <UserPlus size={18} /> Enroll Now
              </Link>
              <Link href="/contact" className="btn-ghost" style={{ borderColor: "rgba(11,20,38,.4)", color: "#0B1426" }}>
                <BookOpen size={18} /> Contact Us
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════ FOOTER (Same as Home) ══════════════════ */}
        <footer className="site-footer">
          <div style={{ maxWidth: 1280, margin: "0 auto", padding: "64px 24px 32px" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(200px,1fr))", gap: 40, marginBottom: 48 }}>
              <div>
                <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
                  <div style={{ width: 36, height: 36, borderRadius: 9, background: "linear-gradient(135deg,#C9A84C,#E8C97A)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <GraduationCap size={18} color="#0B1426" />
                  </div>
                  <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.25rem", color: "#fff", lineHeight: 1.1 }}>AiNextro</div>
                </div>
                <p style={{ fontSize: ".85rem", lineHeight: 1.7, maxWidth: 240 }}>
                  Empowering minds, shaping futures through world-class education and innovative learning solutions.
                </p>
              </div>
              <div>
                <h4 style={{ color: "#C9A84C", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 20 }}>Quick Links</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <Link href="/" style={{ color: "rgba(255,255,255,.7)", textDecoration: "none", fontSize: ".85rem", transition: "color .2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#E8C97A")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.7)")}
                  >Home</Link>
                  <Link href="/about" style={{ color: "rgba(255,255,255,.7)", textDecoration: "none", fontSize: ".85rem", transition: "color .2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#E8C97A")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.7)")}
                  >About Us</Link>
                  <Link href="/contact" style={{ color: "rgba(255,255,255,.7)", textDecoration: "none", fontSize: ".85rem", transition: "color .2s" }}
                    onMouseEnter={e => (e.currentTarget.style.color = "#E8C97A")}
                    onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.7)")}
                  >Contact</Link>
                </div>
              </div>
              <div>
                <h4 style={{ color: "#C9A84C", fontSize: ".72rem", fontWeight: 700, letterSpacing: ".12em", textTransform: "uppercase", marginBottom: 20 }}>Contact</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                    <div style={{ width: 16, height: 16, borderRadius: "50%", background: "#4ADE80", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <span style={{ fontSize: ".6rem", color: "#fff", fontWeight: 700 }}>●</span>
                    </div>
                    <span style={{ color: "rgba(255,255,255,.7)", fontSize: ".85rem" }}>Jaipur, Rajasthan</span>
                  </div>
                  <div style={{ color: "rgba(255,255,255,.7)", fontSize: ".85rem" }}>📧 officialrahusen01@gmail.com</div>
                  <div style={{ color: "rgba(255,255,255,.7)", fontSize: ".85rem" }}>📞 +91 9772609110</div>
                </div>
              </div>
            </div>
            <div style={{ borderTop: "1px solid rgba(255,255,255,.08)", paddingTop: 28, display: "flex", flexWrap: "wrap", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
              <div style={{ color: "rgba(255,255,255,.5)", fontSize: ".8rem" }}>
                © {new Date().getFullYear()} AiNextro. All rights reserved.
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, color: "rgba(255,255,255,.5)", fontSize: ".8rem" }}>
                <Award size={14} />
                <span>Empowering Education Since 2014</span>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
