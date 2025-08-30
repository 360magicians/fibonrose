import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, Users, CheckCircle, Star, ArrowRight, Phone, Mail, MessageSquare } from "lucide-react"
import Link from "next/link"

export default function HomePage() {
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
              <Link href="#services" className="text-gray-300 hover:text-white transition-colors">
                Services
              </Link>
              <Link href="#community" className="text-gray-300 hover:text-white transition-colors">
                Community
              </Link>
              <Link href="#contact" className="text-gray-300 hover:text-white transition-colors">
                Contact
              </Link>
              <Button
                variant="outline"
                className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white bg-transparent"
              >
                Get Verified
              </Button>
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
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-500 to-green-500 hover:from-blue-600 hover:to-green-600"
            >
              Start Verification Process
              <ArrowRight className="ml-2 w-4 h-4" />
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
            >
              Learn More About Trust Scores
            </Button>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">The Problems We Solve</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            <Card className="bg-red-500/10 border-red-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Shield className="w-5 h-5 mr-2 text-red-400" />
                  Interpreter Issues
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <ul className="space-y-2">
                  <li>• False ASL proficiency claims</li>
                  <li>• Resume fraud and inflated qualifications</li>
                  <li>• Cultural incompetence</li>
                  <li>• Lack of accountability systems</li>
                  <li>• Service exclusion for deaf individuals</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-orange-500/10 border-orange-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Users className="w-5 h-5 mr-2 text-orange-400" />
                  Deaf Employment Barriers
                </CardTitle>
              </CardHeader>
              <CardContent className="text-gray-300">
                <ul className="space-y-2">
                  <li>• Invisible work history in deaf community</li>
                  <li>• Undervalued volunteer contributions</li>
                  <li>• Documentation gaps in experience</li>
                  <li>• Career advancement barriers</li>
                  <li>• Skills underestimation by employers</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Verification Standards */}
      <section id="verification" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">DEAF FIRST Verification Standards</h2>
            <p className="text-gray-400 text-lg max-w-3xl mx-auto">
              Comprehensive assessment covering technical skills, cultural competency, and community standing
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg flex items-center justify-center mb-4">
                  <CheckCircle className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Technical Proficiency</CardTitle>
                <CardDescription className="text-gray-400">
                  ASL fluency levels, specialized vocabulary, interpretation modes, and technology integration
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg flex items-center justify-center mb-4">
                  <Users className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Cultural Competency</CardTitle>
                <CardDescription className="text-gray-400">
                  Deaf culture understanding, communication preferences, community connections, and sensitivity training
                </CardDescription>
              </CardHeader>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardHeader>
                <div className="w-12 h-12 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center mb-4">
                  <Star className="w-6 h-6 text-white" />
                </div>
                <CardTitle className="text-white">Professional Experience</CardTitle>
                <CardDescription className="text-gray-400">
                  Verified work history, client references, continuing education, and ethical standards adherence
                </CardDescription>
              </CardHeader>
            </Card>
          </div>
        </div>
      </section>

      {/* Trust Scoring System */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-white/5">
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
                <div className="text-2xl font-bold text-red-400 mb-2">🔴 60</div>
                <div className="text-white font-semibold">Unverified</div>
                <div className="text-red-300 text-sm">Not recommended for services</div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Services Coverage */}
      <section id="services" className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">DEAF FIRST Platform Services</h2>
            <p className="text-gray-400 text-lg">Verified Professionals for essential life services</p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              { title: "Real Estate", desc: "Property buying, selling, management" },
              { title: "Tax Preparation", desc: "Individual and business tax services" },
              { title: "Insurance Services", desc: "Policy acquisition, claims, consultations" },
              { title: "Financial Planning", desc: "Investment advice, banking, wealth management" },
            ].map((service, index) => (
              <Card
                key={index}
                className="bg-white/5 border-white/10 backdrop-blur-sm hover:bg-white/10 transition-colors"
              >
                <CardHeader>
                  <CardTitle className="text-white text-lg">{service.title}</CardTitle>
                  <CardDescription className="text-gray-400">{service.desc}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 px-4 sm:px-6 lg:px-8 bg-white/5">
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
              <h3 className="text-xl font-bold text-white mb-4">For Interpreters</h3>
              <p className="text-gray-400 mb-4">Get verified and build trust in the deaf community</p>
              <Button className="bg-blue-500 hover:bg-blue-600 w-full">Start Interpreter Verification</Button>
            </div>
            <div>
              <h3 className="text-xl font-bold text-white mb-4">For Deaf Professionals</h3>
              <p className="text-gray-400 mb-4">Document your community experience and skills</p>
              <Button className="bg-green-500 hover:bg-green-600 w-full">Verify Community Experience</Button>
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
