"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { apiJson, apiFetch } from "@/lib/api";
import { useAuthStore } from "@/lib/auth-store";
import { User, Mail, AtSign, Save, Lock } from "lucide-react";

type ProfileUser = {
  _id: string;
  fullName: string;
  publicUsername: string;
  email: string;
  roles: string[];
  bio?: string;
  avatarUrl?: string;
};

export default function ProfilePage() {
  const setAuth = useAuthStore((s) => s.setAuth);
  const storeUser = useAuthStore((s) => s.user);
  const primaryRole = useAuthStore((s) => s.primaryRole());
  const [user, setUser] = useState<ProfileUser | null>(storeUser);
  const [loading, setLoading] = useState(!storeUser);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ type: "ok" | "err"; text: string } | null>(null);

  const [edit, setEdit] = useState({ fullName: "", bio: "" });
  const [password, setPassword] = useState({ oldPassword: "", newPassword: "", confirm: "" });

  useEffect(() => {
    apiJson<{ data: ProfileUser }>("auth/getStudentProfile")
      .then((r) => {
        setUser(r.data);
        setEdit({ fullName: r.data.fullName ?? "", bio: r.data.bio ?? "" });
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"))
      .finally(() => setLoading(false));
  }, []);

  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    setMsg(null);
    setSaving(true);
    try {
      const res = await apiFetch("auth/updateProfile", {
        method: "PUT",
        body: JSON.stringify({ fullName: edit.fullName, bio: edit.bio }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { message?: string }).message || "Update failed");
      const updated = data?.data ?? { ...user, fullName: edit.fullName, bio: edit.bio };
      setUser(updated);
      const tok = useAuthStore.getState();
      setAuth(updated, tok.accessToken, tok.refreshToken);
      setMsg({ type: "ok", text: "Profile updated." });
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Update failed" });
    } finally {
      setSaving(false);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.newPassword !== password.confirm) {
      setMsg({ type: "err", text: "New passwords do not match." });
      return;
    }
    setMsg(null);
    setSaving(true);
    try {
      const res = await apiFetch("auth/change-password", {
        method: "POST",
        body: JSON.stringify({ oldPassword: password.oldPassword, newPassword: password.newPassword }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error((data as { message?: string }).message || "Change failed");
      setMsg({ type: "ok", text: "Password changed." });
      setPassword({ oldPassword: "", newPassword: "", confirm: "" });
    } catch (e) {
      setMsg({ type: "err", text: e instanceof Error ? e.message : "Change failed" });
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <span className="h-8 w-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-4 text-destructive">
        {error || "Profile not found"}
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-card-foreground">Profile</h1>

      <form onSubmit={handleSaveProfile} className="space-y-4 rounded-lg border border-border bg-card p-6">
        <h2 className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
          <User size={18} /> Edit profile
        </h2>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Full name</label>
            <input
              type="text"
              value={edit.fullName}
              onChange={(e) => setEdit((p) => ({ ...p, fullName: e.target.value }))}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-muted-foreground">Bio</label>
            <input
              type="text"
              value={edit.bio}
              onChange={(e) => setEdit((p) => ({ ...p, bio: e.target.value }))}
              className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
            />
          </div>
        </div>
        <div className="flex gap-2 text-sm text-muted-foreground">
          <span className="flex items-center gap-1"><AtSign size={14} /> {user.publicUsername}</span>
          <span className="flex items-center gap-1"><Mail size={14} /> {user.email}</span>
        </div>
        <button
          type="submit"
          disabled={saving}
          className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
        >
          <Save size={16} /> Save profile
        </button>
      </form>

      {primaryRole === "admin" ? (
        <div className="rounded-lg border border-border bg-muted/30 p-6 text-sm text-muted-foreground leading-relaxed">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-card-foreground mb-2">
            <Lock size={18} /> Password
          </h2>
          <p>
            You signed in as <strong className="text-foreground">admin</strong> with{" "}
            <strong className="text-foreground">email + OTP</strong> (
            <Link href="/admin/login" className="text-primary font-medium hover:underline">
              Admin login
            </Link>
            ), so there is no password step in that flow.
          </p>
          <p className="mt-2">
            Your user record can still have a password for{" "}
            <Link href="/login" className="text-primary font-medium hover:underline">
              regular login
            </Link>{" "}
            (public username + password). We hide password change here to avoid confusion; if you need it, use{" "}
            <code className="rounded bg-muted px-1 text-xs text-foreground">/login</code> flow or ask a developer to
            reset the account password in the database.
          </p>
        </div>
      ) : (
        <form onSubmit={handleChangePassword} className="space-y-4 rounded-lg border border-border bg-card p-6">
          <h2 className="flex items-center gap-2 text-sm font-semibold text-card-foreground">
            <Lock size={18} /> Change password
          </h2>
          <div className="grid gap-4 sm:grid-cols-1 max-w-sm">
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Current password</label>
              <input
                type="password"
                value={password.oldPassword}
                onChange={(e) => setPassword((p) => ({ ...p, oldPassword: e.target.value }))}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">New password</label>
              <input
                type="password"
                value={password.newPassword}
                onChange={(e) => setPassword((p) => ({ ...p, newPassword: e.target.value }))}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-muted-foreground">Confirm new password</label>
              <input
                type="password"
                value={password.confirm}
                onChange={(e) => setPassword((p) => ({ ...p, confirm: e.target.value }))}
                className="mt-1 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90 disabled:opacity-50"
          >
            Change password
          </button>
        </form>
      )}

      {msg && (
        <p className={msg.type === "ok" ? "text-emerald-600" : "text-destructive"}>{msg.text}</p>
      )}
    </div>
  );
}
