"use client"

import React, { useState, useEffect } from "react"
import Link from "next/link"
import { Mail, Lock, User, Eye, EyeOff } from "lucide-react"
import AuthLayout from "@/components/auth-layout"
import { getBaseUrl } from "@/lib/api"

type RegisterRole = "student" | "instructor"

export default function RegisterPage() {
  const [selectedRole, setSelectedRole] = useState<RegisterRole>("student")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [agreed, setAgreed] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState<string | null>(null)
  const [usernameStatus, setUsernameStatus] = useState<
    "idle" | "checking" | "available" | "taken" | "error"
  >("idle")
  const [usernameMessage, setUsernameMessage] = useState<string>("")
  const [formData, setFormData] = useState({
    fullName: "",
    publicUsername: "",
    email: "",
    password: "",
    confirmPassword: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (name === "publicUsername") {
      setUsernameStatus("idle")
      setUsernameMessage("")
    }
  }

  useEffect(() => {
    const username = formData.publicUsername.trim()

    if (!username) {
      setUsernameStatus("idle")
      setUsernameMessage("")
      return
    }

    setUsernameStatus("checking")
    setUsernameMessage("Checking username availability...")

    const timeoutId = setTimeout(() => {
      const checkUsername = async () => {
        try {
          const res = await fetch(`${getBaseUrl()}/auth/verify-username`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ publicUsername: username }),
          })

          if (!res.ok) {
            const errorText = await res.text()
            throw new Error(errorText || "Failed to verify username")
          }

          const data = await res.json()

          if (formData.publicUsername.trim() !== username) return

          // Expected success response:
          // { status: true, message: 'User name is available', data: true }
          if (data?.data === true) {
            setUsernameStatus("available")
            setUsernameMessage(data.message || "User name is available")
          } else {
            setUsernameStatus("taken")
            setUsernameMessage(
              typeof data?.message === "string"
                ? data.message
                : "Username is already taken"
            )
          }
        } catch (error) {
          if (formData.publicUsername.trim() !== username) return

          const message =
            error instanceof Error ? error.message : "Could not verify username. Please try again."

          // If backend sends conflict with "Username already registered"
          if (typeof message === "string" && message.includes("Username already registered")) {
            setUsernameStatus("taken")
            setUsernameMessage("Username is already taken")
          } else {
            setUsernameStatus("error")
            setUsernameMessage("Could not verify username. Please try again.")
          }
        }
      }

      checkUsername()
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [formData.publicUsername])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(null)

    if (formData.password !== formData.confirmPassword) {
      setSubmitError("Passwords do not match.")
      return
    }

    if (usernameStatus !== "available") {
      setSubmitError("Please choose an available username before registering.")
      return
    }

    setIsLoading(true)
    try {
      const res = await fetch(`${getBaseUrl()}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName,
          publicUsername: formData.publicUsername,
          email: formData.email,
          password: formData.password,
          roles: [selectedRole],
        }),
      })

      if (!res.ok) {
        const errorText = await res.text()
        throw new Error(errorText || "Registration failed")
      }

      setSubmitSuccess("Account created successfully.")
      setFormData({
        fullName: "",
        publicUsername: "",
        email: "",
        password: "",
        confirmPassword: "",
      })
      setAgreed(false)
      setUsernameStatus("idle")
      setUsernameMessage("")
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message || "Registration failed. Please try again."
          : "Registration failed. Please try again."
      )
    } finally {
      setIsLoading(false)
    }
  }

  const isValid =
    formData.fullName &&
    formData.publicUsername &&
    formData.email &&
    formData.password &&
    formData.confirmPassword &&
    formData.password === formData.confirmPassword &&
    agreed &&
    usernameStatus === "available"

  return (
    <AuthLayout
      mode="register"
      title="Create Account"
      subtitle="Fill in the details below to register your account."
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Role selection */}
        <div className="space-y-2">
          <label className="block text-sm font-medium text-card-foreground">
            Register as
          </label>
          <div className="grid grid-cols-2 gap-3">
            {(["student", "instructor"] as const).map((role) => (
              <button
                key={role}
                type="button"
                onClick={() => setSelectedRole(role)}
                className={`rounded-md border px-4 py-3 text-sm font-medium transition-all focus:outline-none ${
                  selectedRole === role
                    ? "border-primary bg-primary text-primary-foreground shadow-sm"
                    : "border-border bg-secondary text-secondary-foreground hover:bg-accent"
                }`}
              >
                <span className="block text-sm font-medium">
                  {role.charAt(0).toUpperCase() + role.slice(1)}
                </span>
                <span className={`block text-xs mt-0.5 ${
                  selectedRole === role ? "text-primary-foreground/70" : "text-muted-foreground"
                }`}>
                  {role === "student" ? "Learn courses" : "Create courses"}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Full Name */}
        <div className="space-y-1.5">
          <label htmlFor="fullName" className="block text-sm font-medium text-card-foreground">
            Full Name
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <User className="h-4 w-4" />
            </div>
            <input
              id="fullName"
              type="text"
              name="fullName"
              placeholder="John Doe"
              value={formData.fullName}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-input bg-background px-4 py-2.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
        </div>

        {/* Public Username */}
        <div className="space-y-1.5">
          <label htmlFor="publicUsername" className="block text-sm font-medium text-card-foreground">
            Public Username
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <User className="h-4 w-4" />
            </div>
            <input
              id="publicUsername"
              type="text"
              name="publicUsername"
              placeholder="john_doe"
              value={formData.publicUsername}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-input bg-background px-4 py-2.5 pl-10 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
          </div>
          {usernameMessage && (
            <p
              className={`text-xs ${
                usernameStatus === "available"
                  ? "text-emerald-500"
                  : usernameStatus === "checking"
                  ? "text-muted-foreground"
                  : "text-destructive"
              }`}
            >
              {usernameMessage}
            </p>
          )}
        </div>

        {/* Email */}
        <div className="space-y-1.5">
          <label htmlFor="email" className="block text-sm font-medium text-card-foreground">
            Email Address
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Mail className="h-4 w-4" />
            </div>
            <input
              id="email"
              type="email"
              name="email"
              placeholder="you@example.com"
              value={formData.email}
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
              placeholder="Min 8 chars, 1 uppercase, 1 number"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
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
          <p className="text-xs text-muted-foreground/70">
            Must be at least 8 characters with uppercase and number
          </p>
        </div>

        {/* Confirm Password */}
        <div className="space-y-1.5">
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-card-foreground">
            Confirm Password
          </label>
          <div className="relative">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">
              <Lock className="h-4 w-4" />
            </div>
            <input
              id="confirmPassword"
              type={showConfirm ? "text" : "password"}
              name="confirmPassword"
              placeholder="Re-enter your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
              className="w-full rounded-md border border-input bg-background px-4 py-2.5 pl-10 pr-10 text-sm text-foreground placeholder:text-muted-foreground/50 transition-colors focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <button
              type="button"
              onClick={() => setShowConfirm(!showConfirm)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
            <p className="text-xs text-destructive">Passwords do not match</p>
          )}
        </div>

        {/* Terms */}
        <label className="flex items-start gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(e) => setAgreed(e.target.checked)}
            className="mt-0.5 h-3.5 w-3.5 rounded border-input accent-primary cursor-pointer"
          />
          <span className="text-xs text-muted-foreground leading-relaxed">
            {"I agree to the "}
            <button type="button" className="text-primary font-medium hover:underline">
              Terms of Service
            </button>
            {" and "}
            <button type="button" className="text-primary font-medium hover:underline">
              Privacy Policy
            </button>
          </span>
        </label>

        {/* Submit */}
        <button
          type="submit"
          disabled={isLoading || !isValid}
          className="w-full rounded-md bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-primary/30 focus:ring-offset-2"
        >
          {isLoading ? (
            <span className="flex items-center justify-center gap-2">
              <span className="h-4 w-4 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full animate-spin" />
              Creating Account...
            </span>
          ) : (
            "Create Account"
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

        {/* Login link */}
        <p className="text-center text-sm text-muted-foreground">
          {"Already have an account? "}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline transition-colors"
          >
            Sign in here
          </Link>
        </p>
      </form>
    </AuthLayout>
  )
}
