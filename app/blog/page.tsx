"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { BookOpen, Calendar } from "lucide-react";
import { useTranslationHook } from "@/lib/translations";
import { apiJson } from "@/lib/api";

// Global flag to prevent duplicate fetches in dev (StrictMode double mount)
let isFetchingBlogs = false;

export default function BlogPage() {
  const { t } = useTranslationHook();
  const [blogs, setBlogs] = useState<any[]>([]);
  const [blogsLoading, setBlogsLoading] = useState(false);
  const [blogsError, setBlogsError] = useState<string | null>(null);
  const [hasFetchedBlogs, setHasFetchedBlogs] = useState(false);

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
      {/* Global styles - copy from main page if needed */}
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

        .gold-rule { width: 48px; height: 2px; background: linear-gradient(90deg, var(--gold), var(--gold-light)); }

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

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>

      {/* Header - simple back to home */}
      <header style={{ 
        background: "rgba(11,20,38,.96)", 
        backdropFilter: "blur(18px)", 
        padding: "18px 24px", 
        position: "sticky", 
        top: 0, 
        zIndex: 100 
      }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Link href="/" style={{ textDecoration: "none", color: "#E8C97A", fontWeight: 600 }}>
            ← Back to Home
          </Link>
          <h1 style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: "1.5rem", color: "#fff" }}>Blog</h1>
          <div></div> {/* Spacer */}
        </div>
      </header>

      {/* Blog Section */}
      <section style={{ background: "#FAF6EE", padding: "96px 24px", minHeight: "100vh" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: 56 }}>
            <div style={{ display: "inline-flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <div className="gold-rule" />
              <span style={{ fontSize: ".75rem", fontWeight: 700, color: "#C9A84C", letterSpacing: ".12em", textTransform: "uppercase" }}>Latest Articles</span>
              <div className="gold-rule" />
            </div>
            <h2 className="display" style={{ fontSize: "clamp(2rem,4vw,3.2rem)", fontWeight: 700, color: "#0B1426", lineHeight: 1.15 }}>
              {t("home.blog.title") || "Learn From Expert Insights"}
            </h2>
            <p style={{ color: "#64748B", fontSize: "1.05rem", maxWidth: 460, margin: "16px auto 0", lineHeight: 1.7 }}>
              {t("home.blog.subtitle") || "Read articles shared by our instructors to enhance your learning journey."}
            </p>
          </div>

          {blogsLoading && (
            <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "60px 24px" }}>
              <div style={{ 
                width: 40, 
                height: 40, 
                border: "3px solid rgba(201,168,76,.2)", 
                borderTopColor: "#C9A84C", 
                borderRadius: "50%", 
                animation: "spin 1s linear infinite" 
              }} />
            </div>
          )}

          {blogsError && (
            <div style={{ 
              background: "#fef2f2", 
              border: "1px solid #fca5a5", 
              color: "#b91c1c", 
              borderRadius: 12, 
              padding: "20px 24px", 
              textAlign: "center"
            }}>
              {blogsError}
            </div>
          )}

          {!blogsLoading && !blogsError && blogs.length === 0 && (
            <div style={{ 
              background: "#f1f5f9", 
              borderRadius: 12, 
              padding: "40px 24px", 
              textAlign: "center",
              color: "#64748B"
            }}>
              <BookOpen size={48} style={{ margin: "0 auto 16px", opacity: 0.5 }} />
              <p style={{ fontSize: "1rem" }}>No blogs published yet. Check back soon!</p>
            </div>
          )}

          {!blogsLoading && blogs.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(320px,1fr))", gap: 28 }}>
              {blogs.map((blog: any) => (
                <Link 
                  key={blog._id} 
                  href={`/blog/${blog.slug ?? blog._id}`}
                  style={{ textDecoration: "none" }}
                >
                  <div className="light-card" style={{ 
                    padding: "24px", 
                    display: "flex", 
                    flexDirection: "column", 
                    height: "100%",
                    cursor: "pointer"
                  }}>
                    <div style={{ 
                      background: "linear-gradient(135deg,#C9A84C,#E8C97A)", 
                      height: 200, 
                      borderRadius: 12, 
                      marginBottom: 20,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "#0B1426"
                    }}>
                      <BookOpen size={48} />
                    </div>
                    <h3 className="display" style={{ 
                      fontSize: "1.2rem", 
                      fontWeight: 700, 
                      color: "#0B1426", 
                      marginBottom: 12,
                      lineHeight: 1.4
                    }}>
                      {blog.title}
                    </h3>
                    <p style={{ 
                      color: "#64748B", 
                      fontSize: ".95rem", 
                      lineHeight: 1.6, 
                      marginBottom: 16,
                      flex: 1
                    }}>
                      {blog.excerpt ?? "No excerpt available"}
                    </p>
                    <div style={{ 
                      display: "flex", 
                      alignItems: "center", 
                      gap: 12, 
                      paddingTop: 16, 
                      borderTop: "1px solid rgba(201,168,76,.15)"
                    }}>
                      <Calendar size={14} color="#C9A84C" />
                      <span style={{ fontSize: ".85rem", color: "#94A3B8" }}>
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : "Recently"}
                      </span>
                      {blog.likes !== undefined && (
                        <>
                          <span style={{ color: "#E2E8F0" }}>·</span>
                          <span style={{ fontSize: ".85rem", color: "#94A3B8" }}>
                            {blog.likes} likes
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </>
  );
}