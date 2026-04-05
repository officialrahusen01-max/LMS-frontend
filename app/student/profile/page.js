"use client";

import React, { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  User,
  Mail,
  AtSign,
  Save,
  Lock,
  Loader2,
  Calendar,
  Settings,
  LogOut,
  ChevronRight,
  ServerCog,
  Sparkles,
  ShieldCheck,
  Camera,
} from "lucide-react";
import { apiJson, apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";

// Backend: GET /v1/auth/getStudentProfile → { data: user }
// PUT /v1/auth/updateProfile → body: { fullName?, bio?, avatarUrl? }
// POST /v1/auth/change-password → body: { oldPassword, newPassword }

function formatDate(val) {
  if (!val) return "—";
  return new Date(val).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

const inputClass =
  "mt-1.5 w-full rounded-xl border border-input/80 bg-muted/30 px-3.5 py-2.5 text-sm text-foreground shadow-sm transition-all placeholder:text-muted-foreground/70 focus:border-primary/40 focus:bg-background focus:outline-none focus:ring-2 focus:ring-primary/20";

const AVATAR_MAX_BYTES = 5 * 1024 * 1024;
const AVATAR_MIME = ["image/jpeg", "image/png", "image/gif", "image/webp"];

export default function StudentProfilePage() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);

  const [edit, setEdit] = useState({ fullName: "", bio: "", avatarUrl: "" });
  const [password, setPassword] = useState({
    oldPassword: "",
    newPassword: "",
    confirm: "",
  });
  const [settingsSection, setSettingsSection] = useState(null);
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const menuRef = useRef(null);
  const avatarFileRef = useRef(null);
  const router = useRouter();
  const logout = useAuthStore((s) => s.logout);

  useEffect(() => {
    apiJson("auth/getStudentProfile")
      .then((r) => {
        const u = r?.data ?? r;
        setUser(u);
        setEdit({
          fullName: u?.fullName ?? "",
          bio: u?.bio ?? "",
          avatarUrl: u?.avatarUrl ?? "",
        });
      })
      .catch((e) => setError(e?.message || "Failed to load profile"))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!showSettingsMenu) return;
    const onDown = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowSettingsMenu(false);
      }
    };
    document.addEventListener("mousedown", onDown);
    return () => document.removeEventListener("mousedown", onDown);
  }, [showSettingsMenu]);

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    setMsg(null);
    setSaving(true);
    try {
      const res = await apiFetch("auth/updateProfile", {
        method: "PUT",
        body: JSON.stringify({
          fullName: edit.fullName,
          bio: edit.bio || undefined,
          avatarUrl: edit.avatarUrl || undefined,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Update failed");
      const updated = data?.data ?? { ...user, ...edit };
      setUser(updated);
      const { accessToken, refreshToken } = useAuthStore.getState();
      if (accessToken) useAuthStore.getState().setAuth(updated, accessToken, refreshToken);
      setMsg({ type: "ok", text: "Profile updated." });
    } catch (e) {
      setMsg({ type: "err", text: e?.message || "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (password.newPassword !== password.confirm) {
      setMsg({ type: "err", text: "New passwords do not match." });
      return;
    }
    if (password.newPassword.length < 6) {
      setMsg({ type: "err", text: "New password must be at least 6 characters." });
      return;
    }
    setMsg(null);
    setSaving(true);
    try {
      const res = await apiFetch("auth/change-password", {
        method: "POST",
        body: JSON.stringify({
          oldPassword: password.oldPassword,
          newPassword: password.newPassword,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Change failed");
      setMsg({ type: "ok", text: "Password changed successfully." });
      setPassword({ oldPassword: "", newPassword: "", confirm: "" });
    } catch (e) {
      setMsg({ type: "err", text: e?.message || "Change failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = async () => {
    await logout();
    router.replace("/login");
  };

  /** Upload to Cloudinary via Lib `POST /v1/upload/image`, then save `avatarUrl` on profile. */
  const handleAvatarFileChange = async (e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    if (!AVATAR_MIME.includes(file.type)) {
      setMsg({
        type: "err",
        text: "Please use JPG, PNG, GIF, or WebP.",
      });
      return;
    }
    if (file.size > AVATAR_MAX_BYTES) {
      setMsg({ type: "err", text: "Photo must be 5MB or smaller." });
      return;
    }
    setAvatarUploading(true);
    setMsg(null);
    try {
      const fd = new FormData();
      fd.append("file", file);
      const up = await apiFetch("upload/image", { method: "POST", body: fd });
      const upJson = await up.json().catch(() => ({}));
      if (!up.ok) throw new Error(upJson?.message || "Upload failed");
      const url = upJson?.data?.url;
      if (!url || typeof url !== "string") {
        throw new Error("No image URL returned from server");
      }
      const res = await apiFetch("auth/updateProfile", {
        method: "PUT",
        body: JSON.stringify({
          fullName: edit.fullName,
          bio: edit.bio || undefined,
          avatarUrl: url,
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data?.message || "Could not save profile photo");
      const updated = data?.data ?? { ...user, ...edit, avatarUrl: url };
      setUser(updated);
      setEdit((p) => ({ ...p, avatarUrl: url }));
      const { accessToken, refreshToken } = useAuthStore.getState();
      if (accessToken) useAuthStore.getState().setAuth(updated, accessToken, refreshToken);
      setMsg({ type: "ok", text: "Profile photo updated." });
    } catch (err) {
      setMsg({
        type: "err",
        text: err?.message || "Photo upload failed. Check Cloudinary config on server.",
      });
    } finally {
      setAvatarUploading(false);
    }
  };

  if (loading) {
    return (
      <div className="relative mx-auto flex min-h-[50vh] max-w-3xl flex-col items-center justify-center px-4 py-16">
        <div
          className="pointer-events-none absolute inset-0 -z-10 opacity-40 dark:opacity-25"
          aria-hidden
        >
          <div className="absolute left-1/4 top-0 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        </div>
        <div className="flex flex-col items-center rounded-3xl border border-border/60 bg-card/80 px-10 py-12 shadow-xl backdrop-blur-sm">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="mt-5 text-sm font-medium text-muted-foreground">Loading your profile…</p>
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-destructive/30 bg-destructive/10 p-6 text-center shadow-lg"
        >
          <p className="font-semibold text-destructive">{error || "Profile not found"}</p>
          <Button variant="outline" className="mt-4" onClick={() => router.push("/student/dashboard")}>
            Back to dashboard
          </Button>
        </motion.div>
      </div>
    );
  }

  const initials = (user?.fullName || "U")
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const roles = Array.isArray(user?.roles) ? user.roles : [];

  const fadeUp = {
    initial: { opacity: 0, y: 14 },
    animate: { opacity: 1, y: 0 },
  };

  return (
    <div className="relative mx-auto max-w-3xl px-4 pb-16 pt-6 sm:px-6 lg:px-8">
      {/* ambient */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
        <div className="absolute -left-20 top-20 h-80 w-80 rounded-full bg-primary/[0.12] blur-3xl dark:bg-primary/[0.08]" />
        <div className="absolute bottom-32 right-0 h-72 w-72 rounded-full bg-primary/[0.1] blur-3xl dark:bg-primary/[0.06]" />
      </div>

      {/* header row */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.35 }}
        className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"
      >
        <div>
          <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold uppercase tracking-widest text-primary dark:bg-primary/10">
            <Sparkles className="h-3.5 w-3.5" />
            Your space
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
            Profile
          </h1>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-muted-foreground">
            Fine-tune how you show up on AiNextro — name, bio, avatar, and account security in one
            place.
          </p>
        </div>
        <div className="relative shrink-0" ref={menuRef}>
          <Button
            type="button"
            size="icon"
            variant="outline"
            className="h-11 w-11 rounded-2xl border-border/80 bg-card/80 shadow-md backdrop-blur-sm transition-all hover:border-primary/25 hover:shadow-lg"
            onClick={() => setShowSettingsMenu((v) => !v)}
            aria-label="Profile settings"
            aria-expanded={showSettingsMenu}
          >
            <Settings size={20} className="text-foreground" />
          </Button>
          {showSettingsMenu && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 z-30 mt-3 w-64 overflow-hidden rounded-2xl border border-border/80 bg-card/95 py-2 shadow-2xl shadow-primary/10 backdrop-blur-xl"
            >
              <p className="px-4 pb-2 pt-1 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Account
              </p>
              <button
                type="button"
                onClick={() => {
                  setSettingsSection("profile");
                  setShowSettingsMenu(false);
                }}
                className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/70"
              >
                <span className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <User size={16} />
                  </span>
                  Update profile
                </span>
                <ChevronRight size={16} className="text-muted-foreground opacity-60" />
              </button>
              <button
                type="button"
                onClick={() => {
                  setSettingsSection("password");
                  setShowSettingsMenu(false);
                }}
                className="flex w-full items-center justify-between gap-2 px-4 py-2.5 text-left text-sm font-medium text-foreground transition-colors hover:bg-muted/70"
              >
                <span className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-primary/10 text-primary">
                    <Lock size={16} />
                  </span>
                  Change password
                </span>
                <ChevronRight size={16} className="text-muted-foreground opacity-60" />
              </button>
              <div className="mx-3 my-2 h-px bg-border" />
              <button
                type="button"
                onClick={() => {
                  setShowSettingsMenu(false);
                  handleLogout();
                }}
                className="flex w-full items-center gap-2.5 px-4 py-2.5 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
              >
                <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-destructive/10">
                  <LogOut size={16} />
                </span>
                Log out
              </button>
            </motion.div>
          )}
        </div>
      </motion.div>

      {/* Hero profile card */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.38, delay: 0.06 }}
        className="overflow-hidden rounded-3xl border border-border/60 bg-card shadow-xl shadow-primary/[0.06] dark:shadow-none"
      >
        <div className="relative h-36 overflow-hidden bg-gradient-to-br from-primary via-primary/90 to-primary/70 sm:h-40 dark:from-primary/90 dark:via-primary/70 dark:to-primary/50">
          <div
            className="absolute inset-0 opacity-[0.18] dark:opacity-[0.12]"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/25 to-transparent dark:from-black/40" />
          <div className="absolute bottom-4 left-6 flex items-center gap-2 text-primary-foreground/95">
            <ShieldCheck className="h-4 w-4 opacity-90" />
            <span className="text-xs font-semibold tracking-wide">
              {user?.isEmailVerified ? "Verified learner" : "Learner"}
            </span>
          </div>
        </div>

        <div className="relative px-4 pb-8 pt-0 sm:px-8">
          <div className="-mt-16 flex flex-col items-center gap-5 text-center sm:-mt-[4.75rem]">
            <div className="relative shrink-0 mx-auto">
              <input
                ref={avatarFileRef}
                type="file"
                accept={AVATAR_MIME.join(",")}
                className="sr-only"
                onChange={handleAvatarFileChange}
                aria-hidden
              />
              <Avatar className="h-28 w-28 border-4 border-card shadow-2xl ring-4 ring-primary/15 sm:h-32 sm:w-32">
                <AvatarImage src={user?.avatarUrl || edit?.avatarUrl} alt={user?.fullName} />
                <AvatarFallback className="bg-gradient-to-br from-primary/20 to-primary/5 text-2xl font-bold text-primary">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <button
                type="button"
                disabled={avatarUploading}
                onClick={() => avatarFileRef.current?.click()}
                className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-2xl border-2 border-card bg-primary text-primary-foreground shadow-lg transition-all hover:opacity-95 disabled:cursor-not-allowed disabled:opacity-60"
                aria-label="Upload profile photo"
                title="Change photo"
              >
                {avatarUploading ? (
                  <Loader2 className="h-5 w-5 animate-spin" />
                ) : (
                  <Camera className="h-5 w-5" />
                )}
              </button>
            </div>
            <div className="w-full max-w-xl pb-1">
              <div className="flex flex-wrap items-center justify-center gap-2">
                <h2 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
                  {user?.fullName || "—"}
                </h2>
                {/* {roles.length > 0 &&
                  roles.map((r) => (
                    <Badge
                      key={r}
                      variant="secondary"
                      className="rounded-lg border-0 bg-primary/10 font-semibold capitalize text-primary dark:bg-primary/15"
                    >
                      {r}
                    </Badge>
                  ))} */}
              </div>
              <p className="mt-2 text-sm text-muted-foreground">
                @{user?.publicUsername || "username"}
              </p>
            </div>
          </div>

          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {[
              {
                icon: Mail,
                label: "Email",
                value: user?.email,
              },
              {
                icon: AtSign,
                label: "Public username",
                value: user?.publicUsername,
              },
              {
                icon: ServerCog,
                label: "Sign-in method",
                value: user?.provider ? String(user.provider) : "—",
              },
              {
                icon: Calendar,
                label: "Last login",
                value: user?.lastLoginAt ? formatDate(user.lastLoginAt) : "—",
              },
            ].map((row) => (
              <div
                key={row.label}
                className="flex items-start gap-3 rounded-2xl border border-border/50 bg-muted/20 p-4 transition-colors hover:border-primary/20 hover:bg-muted/30 dark:bg-muted/10"
              >
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                  <row.icon size={18} />
                </span>
                <div className="min-w-0">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    {row.label}
                  </p>
                  <p className="mt-0.5 truncate text-sm font-medium text-foreground">{row.value}</p>
                </div>
              </div>
            ))}
          </div>

          {user?.bio && (
            <div className="mt-6 rounded-2xl border border-dashed border-border/70 bg-muted/15 px-4 py-3 text-sm leading-relaxed text-muted-foreground dark:bg-muted/10">
              <span className="font-semibold text-foreground">Bio · </span>
              {user.bio}
            </div>
          )}
        </div>
      </motion.div>

      {/* Quick actions */}
      <motion.div
        {...fadeUp}
        transition={{ duration: 0.35, delay: 0.12 }}
        className="mt-6 grid gap-3 sm:grid-cols-2"
      >
        <button
          type="button"
          onClick={() => setSettingsSection(settingsSection === "profile" ? null : "profile")}
          className={`group flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
            settingsSection === "profile"
              ? "border-primary/40 bg-primary/5 shadow-md ring-1 ring-primary/20"
              : "border-border/60 bg-card/80 hover:border-primary/25 hover:shadow-md"
          }`}
        >
          <span className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25 transition-transform group-hover:scale-105">
              <User size={20} />
            </span>
            <span>
              <span className="block font-semibold text-foreground">Edit profile</span>
              <span className="text-xs text-muted-foreground">Name, bio & avatar</span>
            </span>
          </span>
          <ChevronRight
            className={`h-5 w-5 text-muted-foreground transition-transform ${settingsSection === "profile" ? "rotate-90 text-primary" : "group-hover:translate-x-0.5"}`}
          />
        </button>
        <button
          type="button"
          onClick={() => setSettingsSection(settingsSection === "password" ? null : "password")}
          className={`group flex items-center justify-between rounded-2xl border p-4 text-left transition-all ${
            settingsSection === "password"
              ? "border-primary/40 bg-primary/5 shadow-md ring-1 ring-primary/20"
              : "border-border/60 bg-card/80 hover:border-primary/25 hover:shadow-md"
          }`}
        >
          <span className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl border-2 border-primary/30 bg-background text-primary transition-transform group-hover:scale-105">
              <Lock size={20} />
            </span>
            <span>
              <span className="block font-semibold text-foreground">Security</span>
              <span className="text-xs text-muted-foreground">Update password</span>
            </span>
          </span>
          <ChevronRight
            className={`h-5 w-5 text-muted-foreground transition-transform ${settingsSection === "password" ? "rotate-90 text-primary" : "group-hover:translate-x-0.5"}`}
          />
        </button>
      </motion.div>

      {/* Update profile form */}
      {settingsSection === "profile" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <Card className="overflow-hidden rounded-3xl border-border/60 shadow-lg">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-4 dark:bg-muted/10">
              <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <User size={20} className="text-primary" />
                Update profile
              </h2>
              <p className="text-sm text-muted-foreground">
                Changes appear across your dashboard and certificates.
              </p>
            </CardHeader>
            <CardContent className="space-y-5 pt-6">
              <form onSubmit={handleSaveProfile} className="space-y-5">
                <div>
                  <label className="text-sm font-semibold text-foreground">Full name</label>
                  <input
                    type="text"
                    value={edit.fullName}
                    onChange={(e) => setEdit((p) => ({ ...p, fullName: e.target.value }))}
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground">Bio</label>
                  <textarea
                    value={edit.bio}
                    onChange={(e) => setEdit((p) => ({ ...p, bio: e.target.value }))}
                    rows={4}
                    placeholder="A short line about your learning goals…"
                    className={`${inputClass} resize-none`}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground">Profile photo</label>
                  <p className="mt-1 text-xs text-muted-foreground">
                    Upload JPG, PNG, GIF or WebP — max 5MB. Or paste an image URL below.
                  </p>
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="rounded-xl"
                      disabled={avatarUploading}
                      onClick={() => avatarFileRef.current?.click()}
                    >
                      {avatarUploading ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Uploading…
                        </>
                      ) : (
                        <>
                          <Camera className="mr-2 h-4 w-4" />
                          Choose photo
                        </>
                      )}
                    </Button>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground">Avatar image URL (optional)</label>
                  <input
                    type="url"
                    value={edit.avatarUrl}
                    onChange={(e) => setEdit((p) => ({ ...p, avatarUrl: e.target.value }))}
                    placeholder="https://…"
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button type="submit" disabled={saving} className="rounded-xl px-6 shadow-md">
                    {saving ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Saving…
                      </>
                    ) : (
                      <>
                        <Save size={16} className="mr-2" />
                        Save changes
                      </>
                    )}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-xl"
                    onClick={() => setSettingsSection(null)}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Change password */}
      {settingsSection === "password" && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mt-6"
        >
          <Card className="overflow-hidden rounded-3xl border-border/60 shadow-lg">
            <CardHeader className="border-b border-border/50 bg-muted/20 pb-4 dark:bg-muted/10">
              <h2 className="flex items-center gap-2 text-lg font-bold text-foreground">
                <Lock size={20} className="text-primary" />
                Change password
              </h2>
              <p className="text-sm text-muted-foreground">
                Use a strong password you don&apos;t reuse elsewhere.
              </p>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handleChangePassword} className="mx-auto max-w-md space-y-5">
                <div>
                  <label className="text-sm font-semibold text-foreground">Current password</label>
                  <input
                    type="password"
                    value={password.oldPassword}
                    onChange={(e) =>
                      setPassword((p) => ({ ...p, oldPassword: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground">New password</label>
                  <input
                    type="password"
                    value={password.newPassword}
                    onChange={(e) =>
                      setPassword((p) => ({ ...p, newPassword: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
                <div>
                  <label className="text-sm font-semibold text-foreground">Confirm new password</label>
                  <input
                    type="password"
                    value={password.confirm}
                    onChange={(e) =>
                      setPassword((p) => ({ ...p, confirm: e.target.value }))
                    }
                    className={inputClass}
                  />
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-2">
                  <Button type="submit" disabled={saving} variant="outline" className="rounded-xl border-primary/30">
                    {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : "Update password"}
                  </Button>
                  <Button
                    type="button"
                    variant="ghost"
                    className="rounded-xl"
                    onClick={() => {
                      setSettingsSection(null);
                      setPassword({ oldPassword: "", newPassword: "", confirm: "" });
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {msg && (
        <motion.div
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          className={`mt-6 flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm font-medium shadow-sm ${
            msg.type === "ok"
              ? "border-primary/25 bg-primary/5 text-primary dark:bg-primary/10"
              : "border-destructive/30 bg-destructive/10 text-destructive"
          }`}
        >
          {msg.type === "ok" ? (
            <Sparkles className="h-4 w-4 shrink-0" />
          ) : (
            <span className="h-2 w-2 shrink-0 rounded-full bg-destructive" />
          )}
          {msg.text}
        </motion.div>
      )}
    </div>
  );
}
