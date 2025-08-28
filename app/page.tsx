"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Shield, ArrowRight, Phone, Mail, MessageSquare, Search, MapPin } from "lucide-react"
import Link from "next/link"
import { supabase } from "@/lib/supabase"
import type { User, InterpreterProfile, TrustScore } from "@/lib/supabase"

interface InterpreterWithProfile extends User {
  interpreter_profiles: InterpreterProfile[]
  trust_scores: TrustScore[]
}

export default function HomePage() {
  const [pros, setPros] = useState<InterpreterWithProfile[]>([])
  const [loading, setLoading] = useState(true)
  const [searchLocation, setSearchLocation] = useState("")
  const [serviceType, setServiceType] = useState("")
  const [stats, setStats] = useState({
    totalInterpreters: 0,
    verifiedInterpreters: 0,
    averageRating: 0,
    totalServices: 0,
  })

  useEffect(() => {
    fetchPros()
    fetchStats()
  }, [])

  const fetchPros = async () => {
    try {
      const { data, error } = await supabase
        .from("users")
        .select(`
          *,
          interpreter_profiles(*),
          trust_scores(*)
        `)
        .eq("user_type", "interpreter")
        .eq("is_active", true)
        .neq("trust_scores.trust_level", "unverified")
        .limit(6)

      if (error) throw error
      setPros(data || [])
    } catch (error) {
      console.error("Error fetching PROS:", error)
    } finally {
      setLoading(false)
    }
  }

  const fetchStats = async () => {
    try {
      // Get total PROS
      const { count: totalCount } = await supabase
        .from("users")
        .select("*", { count: "exact", head: true })
        .eq("user_type", "interpreter")

      // Get verified PROS
      const { count: verifiedCount } = await supabase
        .from("trust_scores")
        .select("*", { count: "exact", head: true })
        .neq("trust_level", "unverified")

      // Get average rating
      const { data: feedbackData } = await supabase.from("community_feedback").select("rating").eq("is_verified", true)

      const avgRating = feedbackData?.length
        ? feedbackData.reduce((sum, f) => sum + f.rating, 0) / feedbackData.length
        : 0

      // Get total services
      const { count: servicesCount } = await supabase
        .from("service_bookings")
        .select("*", { count: "exact", head: true })

      setStats({
        totalInterpreters: totalCount || 0, // Keep the property name for now
        verifiedInterpreters: verifiedCount || 0,
        averageRating: Math.round(avgRating * 10) / 10,
        totalServices: servicesCount || 0,
      })
    } catch (error) {
      console.error("Error fetching stats:", error)
    }
  }

  const searchPros = async () => {
    if (!searchLocation && !serviceType) {
      fetchPros()
      return
    }

    try {
      setLoading(true)
      let query = supabase
        .from("users")
        .select(`
          *,
          interpreter_profiles(*),
          trust_scores(*)
        `)
        .eq("user_type", "interpreter")
        .eq("is_active", true)
        .neq("trust_scores.trust_level", "unverified")

      if (searchLocation) {
        query = query.contains("interpreter_profiles.service_areas", [searchLocation])
      }

      const { data, error } = await query.limit(6)

      if (error) throw error
      setPros(data || [])
    } catch (error) {
      console.error("Error searching PROS:", error)
    } finally {
      setLoading(false)
    }
  }

  const getTrustLevelColor = (level: string) => {
    switch (level) {
      case "platinum":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      case "gold":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "silver":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30"
      case "bronze":
        return "bg-orange-500/20 text-orange-300 border-orange-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  const getTrustLevelEmoji = (level: string) => {
    switch (level) {
      case "platinum":
        return "🟢"
      case "gold":
        return "🔵"
      case "silver":
        return "🟡"
      case "bronze":
        return "🟠"
      default:
        return "🔴"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900">
      {/* Navigation */}
      <nav className="border-b border-white/10 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Fibonrose</span>
                <div className="text-xs text-blue-300">Trust Verification System</div>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-8">
              <Link href="#verification" className="text-gray-300 hover:text-white transition-colors">
                Verification
              </Link>
              <Link href="#pros" className="text-gray-300 hover:text-white transition-colors">
                Find PROS
              </Link>
              <Link href="#services" className="text-gray-300 hover:text-white transition-colors">
                Services
              </Link>
              <Link href="#contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
              <Link href="/auth">
                <Button
                  variant="outline"
                  className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white bg-transparent"
                >
                  Sign In
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <Badge variant="secondary" className="mb-4 bg-blue-500/20 text-blue-300 border-blue-500/30">
            🛡️ Trusted by DEAF FIRST Platform
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-6">
            Comprehensive Verification
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
              & Trust System
            </span>
          </h1>
          <p className="text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
            Authenticating ASL interpreter skills and deaf community experience. Building trust, preventing exclusion,
            ensuring quality interpretation services.
          </p>

          {/* Live Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8 max-w-2xl mx-auto">
            <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-blue-400">{stats.totalInterpreters}</div>
              <div className="text-sm text-gray-400">Total PROS</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-green-400">{stats.verifiedInterpreters}</div>
              <div className="text-sm text-gray-400">Verified</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-yellow-400">{stats.averageRating}</div>
              <div className="text-sm text-gray-400">Avg Rating</div>
            </div>
            <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm">
              <div className="text-2xl font-bold text-purple-400">{stats.totalServices}</div>
              <div className="text-sm text-gray-400">Services</div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/auth?mode=signup">
              <Button
                size="lg"
                className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
              >
                Start Verification Process
                <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
            </Link>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              onClick={() => document.getElementById("pros")?.scrollIntoView({ behavior: "smooth" })}
            >
              Find Verified PROS
            </Button>
          </div>
        </div>
      </section>

      {/* Interpreter Search */}
      <section id="pros" className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Find Verified PROS</h2>
            <p className="text-gray-400 text-lg">Search our network of trusted, verified ASL professionals</p>
          </div>

          {/* Search Form */}
          <div className="max-w-4xl mx-auto mb-12">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6">
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Location</label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Enter city or state"
                        value={searchLocation}
                        onChange={(e) => setSearchLocation(e.target.value)}
                        className="pl-10 bg-white/5 border-white/10 text-white placeholder:text-gray-400"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-300">Service Type</label>
                    <Select value={serviceType} onValueChange={setServiceType}>
                      <SelectTrigger className="bg-white/5 border-white/10 text-white">
                        <SelectValue placeholder="Select service" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="real_estate">Real Estate</SelectItem>
                        <SelectItem value="tax_preparation">Tax Preparation</SelectItem>
                        <SelectItem value="insurance">Insurance</SelectItem>
                        <SelectItem value="financial_planning">Financial Planning</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="flex items-end">
                    <Button onClick={searchPros} className="w-full bg-blue-500 hover:bg-blue-600">
                      <Search className="w-4 h-4 mr-2" />
                      Search
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Interpreter Results */}
          {loading ? (
            <div className="text-center text-gray-400">Loading PROS...</div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {pros.map((pro) => {
                const profile = pro.interpreter_profiles?.[0]
                const trustScore = pro.trust_scores?.[0]

                return (
                  <Card
                    key={pro.id}
                    className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div>
                          <CardTitle className="text-white text-lg">{pro.full_name}</CardTitle>
                          <CardDescription className="text-gray-400">
                            {profile?.asl_proficiency} ASL • {profile?.years_experience} years
                          </CardDescription>
                        </div>
                        {trustScore && (
                          <Badge className={getTrustLevelColor(trustScore.trust_level)}>
                            {getTrustLevelEmoji(trustScore.trust_level)} {trustScore.trust_level}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-3">
                        {trustScore && (
                          <div className="flex items-center justify-between">
                            <span className="text-gray-400 text-sm">Trust Score</span>
                            <span className="text-white font-semibold">{trustScore.overall_score}/100</span>
                          </div>
                        )}

                        {profile?.specializations && profile.specializations.length > 0 && (
                          <div>
                            <div className="text-gray-400 text-sm mb-2">Specializations</div>
                            <div className="flex flex-wrap gap-1">
                              {profile.specializations.slice(0, 3).map((spec, index) => (
                                <Badge key={index} variant="outline" className="text-xs border-gray-600 text-gray-300">
                                  {spec}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        )}

                        {profile?.service_areas && profile.service_areas.length > 0 && (
                          <div>
                            <div className="text-gray-400 text-sm mb-2">Service Areas</div>
                            <div className="text-gray-300 text-sm">
                              {profile.service_areas.slice(0, 2).join(", ")}
                              {profile.service_areas.length > 2 && ` +${profile.service_areas.length - 2} more`}
                            </div>
                          </div>
                        )}

                        {profile?.hourly_rate && (
                          <div className="flex items-center justify-between pt-2 border-t border-white/10">
                            <span className="text-gray-400 text-sm">Rate</span>
                            <span className="text-green-400 font-semibold">${profile.hourly_rate}/hour</span>
                          </div>
                        )}

                        <Button className="w-full mt-4 bg-blue-500 hover:bg-blue-600">View Profile & Book</Button>
                      </div>
                    </CardContent>
                  </Card>
                )
              })}
            </div>
          )}

          {!loading && pros.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 mb-4">No PROS found matching your criteria</div>
              <Button
                onClick={() => {
                  setSearchLocation("")
                  setServiceType("")
                  fetchPros()
                }}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Trust Scoring System */}
      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Fibonrose Trust Score System</h2>
            <p className="text-gray-400 text-lg">Comprehensive scoring from 0-100 based on verified competencies</p>
          </div>

          <div className="grid md:grid-cols-5 gap-4">
            <Card className="bg-gradient-to-b from-green-500/20 to-green-600/20 border-green-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-400 mb-2">🟢 90-100</div>
                <div className="text-white font-semibold">Platinum Trust</div>
                <div className="text-green-300 text-sm">Highest verification, priority placement</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-blue-500/20 to-blue-600/20 border-blue-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-400 mb-2">🔵 80-89</div>
                <div className="text-white font-semibold">Gold Trust</div>
                <div className="text-blue-300 text-sm">High verification, complex services</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-yellow-500/20 to-yellow-600/20 border-yellow-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-yellow-400 mb-2">🟡 70-79</div>
                <div className="text-white font-semibold">Silver Trust</div>
                <div className="text-yellow-300 text-sm">Standard verification, routine services</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-orange-500/20 to-orange-600/20 border-orange-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-400 mb-2">🟠 60-69</div>
                <div className="text-white font-semibold">Bronze Trust</div>
                <div className="text-orange-300 text-sm">Basic verification, supervised services</div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-b from-red-500/20 to-red-600/20 border-red-500/30">
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-red-400 mb-2">🔴 Below 60</div>
                <div className="text-white font-semibold">Unverified</div>
                <div className="text-red-300 text-sm">Not recommended for services</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Coverage */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">DEAF FIRST Platform Services</h2>
            <p className="text-gray-400 text-lg">Verified PROS for essential life services</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Real Estate", desc: "Property buying, selling, management", count: "150+ PROS" },
              { title: "Tax Preparation", desc: "Individual and business tax services", count: "120+ PROS" },
              {
                title: "Insurance Services",
                desc: "Policy acquisition, claims, consultations",
                count: "95+ PROS",
              },
              {
                title: "Financial Planning",
                desc: "Investment advice, banking, wealth management",
                count: "80+ PROS",
              },
            ].map((service, index) => (
              <Card
                key={index}
                className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <CardHeader>
                  <CardTitle className="text-white text-lg">{service.title}</CardTitle>
                  <CardDescription className="text-gray-400">{service.desc}</CardDescription>
                  <div className="text-blue-400 text-sm font-medium">{service.count}</div>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-8">Get Started with Verification</h2>

          <div className="grid md:grid-cols-3 gap-6 mb-12">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Mail className="w-8 h-8 text-blue-400 mx-auto mb-4" />
                <div className="text-white font-semibold mb-2">Email Support</div>
                <div className="text-gray-400 text-sm">verify@fibonrosetrust.pinksync.io</div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Phone className="w-8 h-8 text-green-400 mx-auto mb-4" />
                <div className="text-white font-semibold mb-2">Video Phone</div>
                <div className="text-gray-400 text-sm">VP Available</div>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <MessageSquare className="w-8 h-8 text-purple-400 mx-auto mb-4" />
                <div className="text-white font-semibold mb-2">Text Support</div>
                <div className="text-gray-400 text-sm">SMS Available</div>
              </CardContent>
            </Card>
          </div>

          <div className="grid md:grid-cols-2 gap-6 mb-12">
            <div>
              <h3 className="text-xl font-bold text-white mb-4">For PROS</h3>
              <p className="text-gray-400 mb-4">Get verified and build trust in the deaf community</p>
              <Link href="/auth?mode=signup&type=interpreter">
                <Button className="bg-blue-500 hover:bg-blue-600 w-full">Start PRO Verification</Button>
              </Link>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">For Deaf Professionals</h3>
              <p className="text-gray-400 mb-4">Document your community experience and skills</p>
              <Link href="/auth?mode=signup&type=deaf_professional">
                <Button className="bg-green-500 hover:bg-green-600 w-full">Verify Community Experience</Button>
              </Link>
            </div>
          </div>

          <div className="text-center">
            <p className="text-gray-400 mb-4">Platform: https://fibonrose.pinksync.io</p>
            <p className="text-sm text-gray-500">
              Ensuring authentic interpretation, preventing exclusion, building trust - one verification at a time.
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/10 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-3 mb-4 md:mb-0">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold text-white">Fibonrose</span>
                <div className="text-xs text-blue-300">Trust Verification System</div>
              </div>
            </div>
            <div className="flex flex-col items-center md:items-end">
              <div className="text-gray-400 text-sm mb-2">ADA Compliant • Privacy Protected • Community Focused</div>
              <div className="text-gray-500 text-xs">© 2024 Fibonrose Trust System. All rights reserved.</div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
