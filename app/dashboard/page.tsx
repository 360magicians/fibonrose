"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Shield, User, LogOut, Settings, Star, Calendar, FileText } from "lucide-react"
import { useAuth } from "@/hooks/useAuth"

export default function DashboardPage() {
  const { user, profile, loading, signOut } = useAuth()
  const router = useRouter()
  const [dashboardLoading, setDashboardLoading] = useState(true)

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/auth")
      } else {
        setDashboardLoading(false)
      }
    }
  }, [user, loading, router])

  const handleSignOut = async () => {
    try {
      await signOut()
      router.push("/")
    } catch (error) {
      console.error("Sign out error:", error)
    }
  }

  if (loading || dashboardLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  const getUserTypeColor = (type: string) => {
    switch (type) {
      case "interpreter":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "deaf_professional":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "service_provider":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "admin":
        return "bg-red-500/20 text-red-300 border-red-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getUserTypeLabel = (type: string) => {
    switch (type) {
      case "interpreter":
        return "ASL PRO"
      case "deaf_professional":
        return "Deaf Professional"
      case "service_provider":
        return "Service Provider"
      case "admin":
        return "Administrator"
      default:
        return "User"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Header */}
      <nav className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Fibonrose</span>
                <div className="text-xs text-blue-300">Dashboard</div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <div className="text-white font-medium">{profile?.full_name || user.email}</div>
                <Badge className={getUserTypeColor(profile?.user_type)}>{getUserTypeLabel(profile?.user_type)}</Badge>
              </div>
              <Button
                onClick={handleSignOut}
                variant="outline"
                size="sm"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Welcome back, {profile?.full_name || user.email?.split("@")[0]}!
          </h1>
          <p className="text-gray-400">Manage your verification status, bookings, and profile settings.</p>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Trust Score</p>
                  <p className="text-2xl font-bold text-white">--</p>
                </div>
                <Star className="w-8 h-8 text-yellow-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Verification Status</p>
                  <p className="text-lg font-bold text-orange-400">Pending</p>
                </div>
                <Shield className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Bookings</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
                <Calendar className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Reviews</p>
                  <p className="text-2xl font-bold text-white">0</p>
                </div>
                <FileText className="w-8 h-8 text-purple-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Section */}
          <div className="lg:col-span-2">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  Profile Information
                </CardTitle>
                <CardDescription className="text-gray-400">
                  Your account details and verification status
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-gray-400 text-sm">Full Name</label>
                    <div className="text-white">{profile?.full_name || "Not provided"}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Email</label>
                    <div className="text-white">{user.email}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Phone</label>
                    <div className="text-white">{profile?.phone || "Not provided"}</div>
                  </div>
                  <div>
                    <label className="text-gray-400 text-sm">Video Phone</label>
                    <div className="text-white">{profile?.video_phone || "Not provided"}</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-white/10">
                  <Button className="bg-blue-500 hover:bg-blue-600">
                    <Settings className="w-4 h-4 mr-2" />
                    Edit Profile
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div>
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white">Quick Actions</CardTitle>
                <CardDescription className="text-gray-400">Common tasks and shortcuts</CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start bg-green-500/20 hover:bg-green-500/30 text-green-300 border-green-500/30">
                  Start Verification Process
                </Button>
                <Button className="w-full justify-start bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 border-blue-500/30">
                  View Available Services
                </Button>
                <Button className="w-full justify-start bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border-purple-500/30">
                  Update Availability
                </Button>
                <Button className="w-full justify-start bg-orange-500/20 hover:bg-orange-500/30 text-orange-300 border-orange-500/30">
                  View Community Feedback
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
