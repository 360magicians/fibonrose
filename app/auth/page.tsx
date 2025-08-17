"use client"

import type React from "react"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, User, Users, Building } from "lucide-react"
import { supabase } from "@/lib/supabase"
import Link from "next/link"

export default function AuthPage() {
  const searchParams = useSearchParams()
  const [mode, setMode] = useState(searchParams.get("mode") || "signin")
  const [userType, setUserType] = useState(searchParams.get("type") || "interpreter")
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    fullName: "",
    phone: "",
    videoPhone: "",
  })

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      // Sign up with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            full_name: formData.fullName,
            user_type: userType,
          },
        },
      })

      if (authError) throw authError

      if (authData.user) {
        // Create user profile
        const { error: profileError } = await supabase.from("users").insert({
          id: authData.user.id,
          email: formData.email,
          full_name: formData.fullName,
          user_type: userType,
          phone: formData.phone,
          video_phone: formData.videoPhone,
        })

        if (profileError) throw profileError

        setMessage("Account created successfully! Please check your email to verify your account.")
      }
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password,
      })

      if (error) throw error

      setMessage("Signed in successfully!")
      // Redirect to dashboard
      window.location.href = "/dashboard"
    } catch (error: any) {
      setMessage(error.message)
    } finally {
      setLoading(false)
    }
  }

  const getUserTypeIcon = (type: string) => {
    switch (type) {
      case "interpreter":
        return <User className="w-5 h-5" />
      case "deaf_professional":
        return <Users className="w-5 h-5" />
      case "service_provider":
        return <Building className="w-5 h-5" />
      default:
        return <User className="w-5 h-5" />
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center space-x-3 mb-6">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-2xl font-bold text-white">Fibonrose</span>
              <div className="text-sm text-blue-300">Trust Verification System</div>
            </div>
          </Link>
        </div>

        <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="text-white text-center">{mode === "signin" ? "Sign In" : "Create Account"}</CardTitle>
            <CardDescription className="text-gray-400 text-center">
              {mode === "signin" ? "Access your verification dashboard" : "Join the trusted interpreter network"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={mode === "signin" ? handleSignIn : handleSignUp} className="space-y-4">
              {mode === "signup" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="userType" className="text-gray-300">
                      Account Type
                    </Label>
                    <Select value={userType} onValueChange={setUserType}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="interpreter">
                          <div className="flex items-center space-x-2">
                            <User className="w-4 h-4" />
                            <span>ASL Interpreter</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="deaf_professional">
                          <div className="flex items-center space-x-2">
                            <Users className="w-4 h-4" />
                            <span>Deaf Professional</span>
                          </div>
                        </SelectItem>
                        <SelectItem value="service_provider">
                          <div className="flex items-center space-x-2">
                            <Building className="w-4 h-4" />
                            <span>Service Provider</span>
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="fullName" className="text-gray-300">
                      Full Name
                    </Label>
                    <Input
                      id="fullName"
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                      placeholder="Enter your full name"
                    />
                  </div>
                </>
              )}

              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-300">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  placeholder="Enter your email"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-300">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                  placeholder="Enter your password"
                />
              </div>

              {mode === "signup" && (
                <>
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-gray-300">
                      Phone (Optional)
                    </Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                      placeholder="Enter your phone number"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="videoPhone" className="text-gray-300">
                      Video Phone (Optional)
                    </Label>
                    <Input
                      id="videoPhone"
                      type="text"
                      value={formData.videoPhone}
                      onChange={(e) => setFormData({ ...formData, videoPhone: e.target.value })}
                      className="bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                      placeholder="Enter your VP number"
                    />
                  </div>
                </>
              )}

              {message && (
                <div
                  className={`text-sm p-3 rounded ${
                    message.includes("successfully")
                      ? "bg-green-500/20 text-green-300 border border-green-500/30"
                      : "bg-red-500/20 text-red-300 border border-red-500/30"
                  }`}
                >
                  {message}
                </div>
              )}

              <Button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              >
                {loading ? "Processing..." : mode === "signin" ? "Sign In" : "Create Account"}
              </Button>
            </form>

            <div className="mt-6 text-center">
              <button
                onClick={() => setMode(mode === "signin" ? "signup" : "signin")}
                className="text-blue-400 hover:text-blue-300 text-sm"
              >
                {mode === "signin" ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
              </button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
