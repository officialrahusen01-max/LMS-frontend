"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, Eye, EyeOff } from "lucide-react"
import AuthLayout from "@/components/auth-layout"
import { getBaseUrl } from "@/lib/api"
import { useAuthStore } from "@/lib/auth-store"

export default function LoginPage() {
  const router = useRouter()
  const setAuth = useAuthStore((s) => s.setAuth)
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated())
  const primaryRole = useAuthStore((s) => s.primaryRole())

  useEffect(() => {
    if (isAuthenticated && primaryRole) {
      if (primaryRole === "student") {
        router.replace("/student")
      } else {
        router.replace(`/dashboard/${primaryRole}`)
      }
    }
  }, [isAuthenticated, primaryRole, router])

  const [formData, setFormData] = useState({ publicUsername: "", password: "" })
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(null)

    if (!formData.publicUsername) {
      setSubmitError("Please enter your public username.")
      return
    }

    if (!formData.password) {
      setSubmitError("Please enter your password.")
      return
    }

    if (!formData.publicUsername.trim()) {
      setSubmitError("Please enter a valid public username.")
      return
    }

    setIsLoading(true)
    try {
      const base = getBaseUrl()
      const res = await fetch(`${base}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          publicUsername: formData.publicUsername,
          password: formData.password,
        }),
      })

      const data = await res.json().catch(() => ({}))
      if (!res.ok) {
        const message = (data && typeof data.message === "string") ? data.message : "Login failed"
        throw new Error(message)
      }

      const accessToken = data?.data?.accessToken
      const refreshToken = data?.data?.refreshToken
      if (!accessToken) throw new Error("Login response invalid")

      setAuth(null, accessToken, refreshToken)

      const profileRes = await fetch(`${base}/auth/getStudentProfile`, {
        headers: { Authorization: `Bearer ${accessToken}` },
      })
      let user = null
      if (profileRes.ok) {
        const profileData = await profileRes.json()
        user = profileData?.data ?? null
        if (user) setAuth(user, accessToken, refreshToken)
      }
      const roles = user?.roles ?? []
      const role = roles.includes("admin") ? "admin" : roles.includes("instructor") ? "instructor" : "student"
      setSubmitSuccess("Logged in successfully.")
      if (role === "student") {
        router.push("/student")
      } else {
        router.push(`/dashboard/${role}`)
      }
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message || "Login failed. Please try again."
          : "Login failed. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AuthLayout
      mode="login"
      title="Sign In"
      subtitle="Please enter your credentials to access your account."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Public Username */}
        <div className="space-y-1.5">
          <label htmlFor="publicUsername" className="block text-sm font-medium text-card-foreground">
            Public Username
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="publicUsername"
              type="text"
              name="publicUsername"
              placeholder="Enter your public username"
              value={formData.publicUsername}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-input bg-background px-4 py-2.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Password */}
        <div className="space-y-1.5">
          <label htmlFor="password" className="block text-sm font-medium text-card-foreground">
            Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="password"
              type={showPassword ? "text" : "password"}
              name="password"
              placeholder="Enter your password"
              value={formData.password}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-input bg-background px-4 py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Remember me & Forgot */}
        <div className="flex items-center justify-between">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              className="h-3.5 w-3.5 rounded border-input accent-primary cursor-pointer"
            />
            <span className="text-xs text-muted-foreground">Remember me</span>
          </label>
          <button type="button" className="text-xs text-primary font-medium hover:underline">
            Forgot Password?
          </button>
        </div>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !formData.publicUsername || !formData.password || !formData.publicUsername.trim()}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>

        {(submitError || submitSuccess) && (
          <p
            className={`text-sm ${
              submitError ? "text-destructive" : "text-emerald-500"
            } text-center`}
          >
            {submitError || submitSuccess}
          </p>
        )}

        {/* Divider */}
        <div className="flex items-center gap-3">
          <div className="flex-1 h-px bg-border" />
          <span className="text-xs text-muted-foreground/60 uppercase tracking-wider">or</span>
          <div className="flex-1 h-px bg-border" />
        </div>

        {/* SSO */}
        <button
          type="button"
          className="w-full rounded-md border border-border bg-secondary px-4 py-2.5 text-sm font-medium text-secondary-foreground transition-colors hover:bg-accent focus:outline-none focus:ring-2 focus:ring-primary/20"
        >
          Sign In with Organization SSO
        </button>

        {/* Links */}
        <div className="flex justify-center gap-4 text-xs">
          <button type="button" className="text-primary hover:underline font-medium">
            Forgot Username
          </button>
          <span className="text-border">|</span>
          <button type="button" className="text-primary hover:underline font-medium">
            Forgot Password
          </button>
        </div>

        {/* Register link */}
        <p className="text-center text-sm text-muted-foreground pt-2">
          {"Don't have an account? "}
          <Link
            href="/register"
            className="text-primary font-medium hover:underline transition-colors"
          >
            Create Account
          </Link>
        </p>

        <p className="text-center text-xs text-muted-foreground pt-1">
          <Link href="/admin/login" className="text-primary font-medium hover:underline">
            Admin login (email + OTP)
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
