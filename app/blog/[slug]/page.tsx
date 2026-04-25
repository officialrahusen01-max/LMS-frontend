"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Calendar, User, ArrowLeft } from "lucide-react";
import { apiJson } from "@/lib/api";

export default function BlogDetailPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;
    
    const fetchBlog = async () => {
      try {
        setLoading(true);
        // Try fetching by slug first
        const res = await apiJson<{ data: any }>(
          `blogs/slug/${slug}`
        );
        setBlog(res.data);
        setError(null);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load blog"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          background: "#FAF6EE",
        }}
      >
        <div
          style={{
            width: 40,
            height: 40,
            border: "3px solid rgba(201,168,76,.2)",
            borderTopColor: "#C9A84C",
            borderRadius: "50%",
            animation: "spin 1s linear infinite",
          }}
        />
        <style>{`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div style={{ background: "#FAF6EE", minHeight: "100vh", padding: "40px 24px" }}>
        <div style={{ maxWidth: 800, margin: "0 auto" }}>
          <Link
            href="/blog"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              color: "#C9A84C",
              textDecoration: "none",
              marginBottom: 32,
              fontSize: ".95rem",
            }}
          >
            <ArrowLeft size={16} /> Back to Blogs
          </Link>
          <div
            style={{
              background: "#fef2f2",
              border: "1px solid #fca5a5",
              color: "#b91c1c",
              borderRadius: 12,
              padding: "20px 24px",
              textAlign: "center",
            }}
          >
            {error || "Blog not found"}
          </div>
        </div>
      </div>
    );
  }

  return (
    <>
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

        body {
          font-family: 'DM Sans', sans-serif;
          background: var(--cream);
          color: var(--navy);
        }

        .display { font-family: 'Cormorant Garamond', serif; }

        .blog-content {
          line-height: 1.8;
          font-size: 1.05rem;
          color: #333;
        }

        .blog-content h1,
        .blog-content h2,
        .blog-content h3 {
          font-family: 'Cormorant Garamond', serif;
          margin-top: 1.5em;
          margin-bottom: 0.75em;
          color: #0B1426;
        }

        .blog-content h1 { font-size: 2rem; }
        .blog-content h2 { font-size: 1.5rem; }
        .blog-content h3 { font-size: 1.25rem; }

        .blog-content p {
          margin-bottom: 1em;
        }

        .blog-content ul,
        .blog-content ol {
          margin-left: 1.5em;
          margin-bottom: 1em;
        }

        .blog-content li {
          margin-bottom: 0.5em;
        }

        .blog-content blockquote {
          border-left: 4px solid #C9A84C;
          padding-left: 1.5em;
          margin: 1.5em 0;
          color: #64748B;
          font-style: italic;
        }

        .blog-content code {
          background: #f5f5f5;
          padding: 0.2em 0.4em;
          border-radius: 4px;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
        }

        .blog-content pre {
          background: #f5f5f5;
          padding: 1em;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1.5em 0;
        }

        .blog-content pre code {
          background: none;
          padding: 0;
        }

        .blog-content a {
          color: #C9A84C;
          text-decoration: underline;
        }

        .blog-content a:hover {
          color: #E8C97A;
        }

        .blog-content img {
          max-width: 100%;
          height: auto;
          border-radius: 8px;
          margin: 1.5em 0;
        }
      `}</style>

      <div style={{ background: "#FAF6EE", minHeight: "100vh" }}>
        {/* Header */}
        <header
          style={{
            background: "rgba(11,20,38,.96)",
            backdropFilter: "blur(18px)",
            padding: "18px 24px",
            position: "sticky",
            top: 0,
            zIndex: 100,
          }}
        >
          <div
            style={{
              maxWidth: 1280,
              margin: "0 auto",
              display: "flex",
              alignItems: "center",
              gap: 16,
            }}
          >
            <Link
              href="/blog"
              style={{ textDecoration: "none", color: "#E8C97A" }}
            >
              <ArrowLeft size={20} />
            </Link>
            <h1
              style={{
                fontFamily: "'Cormorant Garamond', serif",
                fontSize: "1.5rem",
                color: "#fff",
              }}
            >
              Blog
            </h1>
          </div>
        </header>

        {/* Content */}
        <article style={{ padding: "60px 24px" }}>
          <div style={{ maxWidth: 800, margin: "0 auto" }}>
            {/* Featured Image */}
            {blog.featuredImage && (
              <div
                style={{
                  marginBottom: 40,
                  borderRadius: 16,
                  overflow: "hidden",
                  height: 400,
                }}
              >
                <img
                  src={blog.featuredImage}
                  alt={blog.title}
                  style={{ width: "100%", height: "100%", objectFit: "cover" }}
                />
              </div>
            )}

            {/* Title */}
            <h1
              className="display"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.2rem)",
                fontWeight: 700,
                color: "#0B1426",
                marginBottom: 24,
                lineHeight: 1.2,
              }}
            >
              {blog.title}
            </h1>

            {/* Meta Info */}
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 24,
                paddingBottom: 24,
                borderBottom: "1px solid rgba(201,168,76,.2)",
                marginBottom: 40,
                color: "#64748B",
                fontSize: ".95rem",
              }}
            >
              {blog.author && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <User size={16} />
                  <span>{blog.author.fullName || "Author"}</span>
                </div>
              )}
              {blog.createdAt && (
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <Calendar size={16} />
                  <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
                </div>
              )}
              {blog.categories && blog.categories.length > 0 && (
                <div>
                  <span>
                    {blog.categories.map((cat: string) => (
                      <span
                        key={cat}
                        style={{
                          display: "inline-block",
                          background: "rgba(201,168,76,.1)",
                          color: "#C9A84C",
                          padding: "4px 12px",
                          borderRadius: 20,
                          marginRight: 8,
                          fontSize: ".85rem",
                        }}
                      >
                        {cat}
                      </span>
                    ))}
                  </span>
                </div>
              )}
            </div>

            {/* Excerpt */}
            {blog.excerpt && (
              <p
                style={{
                  fontSize: "1.1rem",
                  color: "#64748B",
                  fontStyle: "italic",
                  marginBottom: 40,
                  lineHeight: 1.8,
                }}
              >
                {blog.excerpt}
              </p>
            )}

            {/* Content */}
            <div
              className="blog-content"
              dangerouslySetInnerHTML={{ __html: blog.content }}
            />

            {/* Tags */}
            {blog.tags && blog.tags.length > 0 && (
              <div
                style={{
                  marginTop: 40,
                  paddingTop: 40,
                  borderTop: "1px solid rgba(201,168,76,.2)",
                }}
              >
                <p style={{ marginBottom: 12, color: "#64748B", fontSize: ".9rem" }}>
                  Tags:
                </p>
                <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
                  {blog.tags.map((tag: string) => (
                    <span
                      key={tag}
                      style={{
                        background: "#fff",
                        border: "1px solid rgba(201,168,76,.3)",
                        color: "#C9A84C",
                        padding: "6px 16px",
                        borderRadius: 20,
                        fontSize: ".85rem",
                      }}
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Back Link */}
            <div style={{ marginTop: 60 }}>
              <Link
                href="/blog"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 8,
                  color: "#C9A84C",
                  textDecoration: "none",
                  fontSize: ".95rem",
                }}
              >
                <ArrowLeft size={16} /> Back to All Blogs
              </Link>
            </div>
          </div>
        </article>
      </div>
    </>
  );
}
