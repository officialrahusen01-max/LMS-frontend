"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { LogIn, UserPlus, Mail, MessageSquare, Send, User, Phone, MapPin, Clock, CheckCircle, GraduationCap, Award } from "lucide-react";
import { LanguageSelector } from "@/components/language-selector";
import { useTranslationHook } from "@/lib/translations";

export default function ContactPage() {
  const { t } = useTranslationHook();
  const [form, setForm] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim() || !form.message.trim()) {
      setError("Please fill in all required fields.");
      return;
    }
    setSending(true);
    setError(null);
    setSent(false);
    try {
      await new Promise((r) => setTimeout(r, 800));
      setSent(true);
      setForm({ name: "", email: "", subject: "", message: "" });
    } catch {
      setError("Failed to send message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      {/* ══════════════════ GLOBAL STYLES (Same as Home/About) ══════════════════ */}
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
          background: rgba(255,255,255,.95);
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

        /* Contact card */
        .contact-card {
          background: rgba(255,255,255,.95);
          border: 1px solid rgba(201,168,76,.25);
          border-radius: 20px;
          transition: transform .3s, box-shadow .3s, border-color .3s;
          box-shadow: 0 4px 24px rgba(11,20,38,.08);
        }
        .contact-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 20px 48px rgba(11,20,38,.15), 0 0 0 2px rgba(201,168,76,.4);
          border-color: rgba(201,168,76,.5);
        }

        /* Section bg alternation */
        .section-cream { background: var(--cream); }
        .section-navy  { background: var(--navy); }
        .section-white { background: #fff; }

        /* Contact icon */
        .contact-icon {
          width: 56px; height: 56px; border-radius: 16px;
          background: linear-gradient(135deg, var(--navy), var(--navy-soft));
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 20px;
          box-shadow: 0 8px 24px rgba(11,20,38,.15);
        }

        /* Footer */
        .site-footer { background: var(--navy); color: rgba(255,255,255,.7); }

        /* Form styling */
        .form-input {
          width: 100%; border-radius: 12px; border: 1px solid rgba(201,168,76,.3);
          background: rgba(255,255,255,.9); padding: 14px 16px; font-size: .9rem;
          transition: border-color .2s, box-shadow .2s;
        }
        .form-input:focus {
          outline: none; border-color: var(--gold); box-shadow: 0 0 0 3px rgba(201,168,76,.15);
        }
        .form-textarea {
          resize: vertical; min-height: 120px;
        }

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

        {/* ══════════════════ HEADER (Same as Home/About) ══════════════════ */}
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
              <Link href="/about" style={{ color: "rgba(255,255,255,.78)", fontSize: ".88rem", fontWeight: 500, textDecoration: "none", letterSpacing: ".02em", transition: "color .2s" }}
                onMouseEnter={e => (e.currentTarget.style.color = "#E8C97A")}
                onMouseLeave={e => (e.currentTarget.style.color = "rgba(255,255,255,.78)")}
              >About</Link>
              <Link href="/contact" style={{ color: "#E8C97A", fontSize: ".88rem", fontWeight: 600, textDecoration: "none", letterSpacing: ".02em", borderBottom: "2px solid #E8C97A", paddingBottom: "4px" }}
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
                <span style={{ color: "#E8C97A", fontSize: ".78rem", fontWeight: 500, letterSpacing: ".08em", textTransform: "uppercase" }}>Get In Touch</span>
              </div>

              <h1 className="display fade-in" style={{ fontSize: "clamp(2.8rem, 6vw, 5.2rem)", fontWeight: 700, color: "#fff", lineHeight: 1.05, marginBottom: 20 }}>
                Contact Our<br />
                <span className="gold-shimmer">Expert Team</span>
              </h1>

              <p className="fade-in" style={{ color: "rgba(255,255,255,.78)", fontSize: "1.1rem", lineHeight: 1.7, maxWidth: 680, margin: "0 auto 36px" }}>
                Have questions about our courses? Need guidance on your learning journey? We're here to help you succeed.
              </p>

              <div className="fade-in hero-mobile-cta" style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
                <a href="#contact-form" className="btn-gold">
                  <MessageSquare size={18} /> Send Message
                </a>
                <a href="tel:+919772609110" className="btn-ghost">
                  <Phone size={18} /> Call Now
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════ CONTACT METHODS ══════════════════ */}
        <section style={{ background: "#fff", padding: "96px 24px" }}>
          <div style={{ maxWidth: 1280, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div className="gold-rule" />
                <span style={{ fontSize: ".75rem", fontWeight: 700, color: "#C9A84C", letterSpacing: ".12em", textTransform: "uppercase" }}>Contact Methods</span>
                <div className="gold-rule" />
              </div>
              <h2 className="display" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 700, color: "#0B1426", lineHeight: 1.15 }}>
                Multiple Ways to Reach Us
              </h2>
              <p style={{ color: "#64748B", fontSize: "1.05rem", maxWidth: 540, margin: "16px auto 0", lineHeight: 1.7 }}>
                Choose the method that works best for you
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(280px,1fr))", gap: 32 }}>
              <div className="contact-card" style={{ padding: "40px 32px", textAlign: "center" }}>
                <div className="contact-icon" style={{ margin: "0 auto 20px" }}>
                  <Phone size={28} color="#C9A84C" />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.45rem", color: "#0B1426", marginBottom: 12, lineHeight: 1.25 }}>Phone Support</h3>
                <p style={{ color: "#64748B", fontSize: ".93rem", lineHeight: 1.6, marginBottom: 20 }}>
                  Speak directly with our education consultants for personalized guidance.
                </p>
                <div style={{ color: "#0B1426", fontWeight: 600, fontSize: "1.1rem", marginBottom: 8 }}>📞 +91 9772609110</div>
                <div style={{ color: "#64748B", fontSize: ".85rem" }}>Mon-Fri: 9AM-8PM IST</div>
              </div>

              <div className="contact-card" style={{ padding: "40px 32px", textAlign: "center" }}>
                <div className="contact-icon" style={{ margin: "0 auto 20px" }}>
                  <Mail size={28} color="#C9A84C" />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.45rem", color: "#0B1426", marginBottom: 12, lineHeight: 1.25 }}>Email Support</h3>
                <p style={{ color: "#64748B", fontSize: ".93rem", lineHeight: 1.6, marginBottom: 20 }}>
                  Send us detailed inquiries and we'll respond within 24 hours.
                </p>
                <div style={{ color: "#0B1426", fontWeight: 600, fontSize: "1.1rem", marginBottom: 8 }}>📧 officialrahusen01@gmail.com</div>
                <div style={{ color: "#64748B", fontSize: ".85rem" }}>Response within 24 hours</div>
              </div>

              <div className="contact-card" style={{ padding: "40px 32px", textAlign: "center" }}>
                <div className="contact-icon" style={{ margin: "0 auto 20px" }}>
                  <MapPin size={28} color="#C9A84C" />
                </div>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.45rem", color: "#0B1426", marginBottom: 12, lineHeight: 1.25 }}>Visit Our Office</h3>
                <p style={{ color: "#64748B", fontSize: ".93rem", lineHeight: 1.6, marginBottom: 20 }}>
                  Located in the heart of Jaipur, Rajasthan. Schedule a visit for in-person consultation.
                </p>
                <div style={{ color: "#0B1426", fontWeight: 600, fontSize: "1.1rem", marginBottom: 8 }}>📍 Jaipur, Rajasthan</div>
                <div style={{ color: "#64748B", fontSize: ".85rem" }}>By appointment only</div>
              </div>
            </div>
          </div>
        </section>

        {/* ══════════════════ CONTACT FORM ══════════════════ */}
        <section id="contact-form" style={{ background: "var(--cream)", padding: "96px 24px" }}>
          <div style={{ maxWidth: 1000, margin: "0 auto" }}>
            <div style={{ textAlign: "center", marginBottom: 64 }}>
              <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
                <div className="gold-rule" />
                <span style={{ fontSize: ".75rem", fontWeight: 700, color: "#C9A84C", letterSpacing: ".12em", textTransform: "uppercase" }}>Send Message</span>
                <div className="gold-rule" />
              </div>
              <h2 className="display" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 700, color: "#0B1426", lineHeight: 1.15 }}>
                Ready to Start Your Learning Journey?
              </h2>
              <p style={{ color: "#64748B", fontSize: "1.05rem", maxWidth: 540, margin: "16px auto 0", lineHeight: 1.7 }}>
                Fill out the form below and our team will get back to you within 24 hours
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(500px,1fr))", gap: 48, alignItems: "start" }}>

              {/* Form */}
              <div className="contact-card" style={{ padding: "40px 36px" }}>
                <h3 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.6rem", color: "#0B1426", marginBottom: 24, textAlign: "center" }}>
                  Send Us a Message
                </h3>

                {sent && (
                  <div style={{ marginBottom: 24, padding: "16px", background: "rgba(74,222,128,.1)", border: "1px solid rgba(74,222,128,.3)", borderRadius: 12, display: "flex", alignItems: "center", gap: 12 }}>
                    <CheckCircle size={20} color="#22C55E" />
                    <span style={{ color: "#16A34A", fontWeight: 500 }}>Thank you! Your message has been sent successfully.</span>
                  </div>
                )}

                {error && (
                  <div style={{ marginBottom: 24, padding: "16px", background: "rgba(239,68,68,.1)", border: "1px solid rgba(239,68,68,.3)", borderRadius: 12, display: "flex", alignItems: "center", gap: 12 }}>
                    <span style={{ color: "#DC2626", fontWeight: 500 }}>{error}</span>
                  </div>
                )}

                <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div>
                      <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, color: "#0B1426", marginBottom: 8 }}>
                        Full Name *
                      </label>
                      <div style={{ position: "relative" }}>
                        <User size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748B" }} />
                        <input
                          name="name"
                          type="text"
                          value={form.name}
                          onChange={handleChange}
                          placeholder="Your full name"
                          required
                          className="form-input"
                          style={{ paddingLeft: 44 }}
                        />
                      </div>
                    </div>
                    <div>
                      <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, color: "#0B1426", marginBottom: 8 }}>
                        Email Address *
                      </label>
                      <div style={{ position: "relative" }}>
                        <Mail size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748B" }} />
                        <input
                          name="email"
                          type="email"
                          value={form.email}
                          onChange={handleChange}
                          placeholder="your.email@example.com"
                          required
                          className="form-input"
                          style={{ paddingLeft: 44 }}
                        />
                      </div>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, color: "#0B1426", marginBottom: 8 }}>
                      Subject
                    </label>
                    <div style={{ position: "relative" }}>
                      <MessageSquare size={18} style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", color: "#64748B" }} />
                      <select
                        name="subject"
                        value={form.subject}
                        onChange={handleChange}
                        className="form-input"
                        style={{ paddingLeft: 44, backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='%2364748B'%3E%3Cpath stroke-linecap='round' stroke-linejoin='round' stroke-width='2' d='M19 9l-7 7-7-7'/%3E%3C/svg%3E\")", backgroundPosition: "right 14px center", backgroundRepeat: "no-repeat", backgroundSize: "16px", paddingRight: 44 }}
                      >
                        <option value="">Select a topic</option>
                        <option value="general">General Inquiry</option>
                        <option value="courses">Course Information</option>
                        <option value="support">Technical Support</option>
                        <option value="feedback">Feedback</option>
                        <option value="partnership">Partnership</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label style={{ display: "block", fontSize: ".85rem", fontWeight: 600, color: "#0B1426", marginBottom: 8 }}>
                      Message *
                    </label>
                    <textarea
                      name="message"
                      value={form.message}
                      onChange={handleChange}
                      placeholder="Tell us how we can help you..."
                      required
                      rows={5}
                      className="form-input form-textarea"
                      style={{ paddingLeft: 16 }}
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={sending}
                    className="btn-gold"
                    style={{ alignSelf: "flex-start", marginTop: 8 }}
                  >
                    {sending ? (
                      <>
                        <span style={{ width: 16, height: 16, border: "2px solid rgba(11,20,38,.3)", borderTop: "2px solid #0B1426", borderRadius: "50%", display: "inline-block", animation: "spin 1s linear infinite", marginRight: 8 }} />
                        Sending...
                      </>
                    ) : (
                      <>
                        <Send size={18} /> Send Message
                      </>
                    )}
                  </button>
                </form>
              </div>

              {/* Info Sidebar */}
              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                <div className="contact-card" style={{ padding: "32px 28px" }}>
                  <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.3rem", color: "#0B1426", marginBottom: 16 }}>
                    Why Choose AiNextro?
                  </h4>
                  <ul style={{ display: "flex", flexDirection: "column", gap: 12 }}>
                    {[
                      "Expert faculty with 10+ years experience",
                      "98% student success rate",
                      "Personalized learning paths",
                      "24/7 student support",
                      "Industry-recognized certifications"
                    ].map((item, i) => (
                      <li key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                        <CheckCircle size={16} color="#22C55E" style={{ flexShrink: 0 }} />
                        <span style={{ color: "#64748B", fontSize: ".85rem", lineHeight: 1.5 }}>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="contact-card" style={{ padding: "32px 28px" }}>
                  <h4 style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.3rem", color: "#0B1426", marginBottom: 16 }}>
                    Quick Stats
                  </h4>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.8rem", color: "#C9A84C" }}>50K+</div>
                      <div style={{ color: "#64748B", fontSize: ".75rem", fontWeight: 500 }}>Students</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.8rem", color: "#C9A84C" }}>500+</div>
                      <div style={{ color: "#64748B", fontSize: ".75rem", fontWeight: 500 }}>Faculty</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.8rem", color: "#C9A84C" }}>98%</div>
                      <div style={{ color: "#64748B", fontSize: ".75rem", fontWeight: 500 }}>Success</div>
                    </div>
                    <div style={{ textAlign: "center" }}>
                      <div style={{ fontFamily: "'Cormorant Garamond',serif", fontWeight: 700, fontSize: "1.8rem", color: "#C9A84C" }}>10+</div>
                      <div style={{ color: "#64748B", fontSize: ".75rem", fontWeight: 500 }}>Years</div>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ══════════════════ CTA SECTION ══════════════════ */}
        <section style={{ background: "linear-gradient(135deg, #C9A84C, #E8C97A)", padding: "80px 24px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }}>
            <h2 className="display" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 700, color: "#0B1426", lineHeight: 1.15, marginBottom: 20 }}>
              Ready to Transform Your Future?
            </h2>
            <p style={{ color: "rgba(11,20,38,.7)", fontSize: "1.05rem", lineHeight: 1.7, marginBottom: 32 }}>
              Join thousands of successful students who have achieved their dreams with AiNextro
            </p>
            <div style={{ display: "flex", gap: 16, justifyContent: "center", flexWrap: "wrap" }}>
              <Link href="/register" className="btn-navy">
                <UserPlus size={18} /> Enroll Today
              </Link>
              <Link href="/" className="btn-ghost" style={{ borderColor: "rgba(11,20,38,.4)", color: "#0B1426" }}>
                <GraduationCap size={18} /> Explore Courses
              </Link>
            </div>
          </div>
        </section>

        {/* ══════════════════ FOOTER (Same as Home/About) ══════════════════ */}
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
