import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Shield, User, Bot, Database, Mic, Brain, Cloud, Settings, Activity, CheckCircle, Users } from "lucide-react"

export default function AdminDashboard() {
  const serviceAccounts = [
    {
      name: "Compute Engine Default",
      email: "281102402842-compute@developer.gserviceaccount.com",
      role: "Editor",
      type: "system",
      status: "active",
      description: "Default compute service account",
      permissions: ["Compute Engine", "General Editor Access"],
    },
    {
      name: "Pinky Collie",
      email: "360magicians@gmail.com",
      role: "Owner",
      type: "user",
      status: "active",
      description: "Project owner and administrator",
      permissions: ["Full Project Access", "Billing", "IAM Management"],
    },
    {
      name: "Fibonrose Admin",
      email: "fibonrose-admin@fibonrose.iam.gserviceaccount.com",
      role: "Editor",
      type: "service",
      status: "active",
      description: "Main administrative service account",
      permissions: ["Project Management", "Resource Administration"],
    },
    {
      name: "Fibonrose AI Service",
      email: "fibonrose-ai@fibonrose.iam.gserviceaccount.com",
      role: "AI Services",
      type: "ai",
      status: "active",
      description: "AI and machine learning operations",
      permissions: ["BigQuery Data Viewer", "Cloud Run Admin", "Cloud Speech Client", "Vertex AI User"],
    },
    {
      name: "Fibonrose Trust Service",
      email: "fibonrose-trust@fibonrose.iam.gserviceaccount.com",
      role: "Trust Operations",
      type: "trust",
      status: "active",
      description: "Trust verification and scoring system",
      permissions: ["BigQuery Data Viewer", "Cloud Run Admin", "Cloud Speech Client", "Vertex AI User"],
    },
    {
      name: "PinkSync API Service",
      email: "pinksync-api@pinksync.iam.gserviceaccount.com",
      role: "Service Account User",
      type: "api",
      status: "active",
      description: "API integration service",
      permissions: ["Service Account User"],
    },
  ]

  const getAccountIcon = (type: string) => {
    switch (type) {
      case "user":
        return <User className="w-5 h-5" />
      case "ai":
        return <Brain className="w-5 h-5" />
      case "trust":
        return <Shield className="w-5 h-5" />
      case "api":
        return <Settings className="w-5 h-5" />
      case "system":
        return <Cloud className="w-5 h-5" />
      default:
        return <Bot className="w-5 h-5" />
    }
  }

  const getAccountColor = (type: string) => {
    switch (type) {
      case "user":
        return "from-purple-500 to-pink-500"
      case "ai":
        return "from-blue-500 to-cyan-500"
      case "trust":
        return "from-green-500 to-emerald-500"
      case "api":
        return "from-orange-500 to-red-500"
      case "system":
        return "from-gray-500 to-slate-500"
      default:
        return "from-indigo-500 to-purple-500"
    }
  }

  const getRoleBadgeColor = (role: string) => {
    switch (role) {
      case "Owner":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30"
      case "Editor":
        return "bg-blue-500/20 text-blue-300 border-blue-500/30"
      case "AI Services":
        return "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
      case "Trust Operations":
        return "bg-green-500/20 text-green-300 border-green-500/30"
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-green-500 rounded-lg flex items-center justify-center">
              <Shield className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Fibonrose Admin Dashboard</h1>
              <p className="text-gray-400">Google Cloud Platform Infrastructure Management</p>
            </div>
          </div>
        </div>

        {/* Stats Overview */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Total Accounts</p>
                  <p className="text-2xl font-bold text-white">{serviceAccounts.length}</p>
                </div>
                <Users className="w-8 h-8 text-blue-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">AI Services</p>
                  <p className="text-2xl font-bold text-white">2</p>
                </div>
                <Brain className="w-8 h-8 text-cyan-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Active Status</p>
                  <p className="text-2xl font-bold text-green-400">100%</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-400 text-sm">Security Score</p>
                  <p className="text-2xl font-bold text-green-400">A+</p>
                </div>
                <Shield className="w-8 h-8 text-green-400" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Service Accounts */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Service Accounts & IAM Roles</h2>
          <div className="grid gap-6">
            {serviceAccounts.map((account, index) => (
              <Card key={index} className="bg-white/5 border-white/10 backdrop-blur-sm">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center space-x-4">
                      <div
                        className={`w-12 h-12 bg-gradient-to-r ${getAccountColor(account.type)} rounded-lg flex items-center justify-center`}
                      >
                        {getAccountIcon(account.type)}
                      </div>
                      <div>
                        <CardTitle className="text-white text-lg">{account.name}</CardTitle>
                        <CardDescription className="text-gray-400 font-mono text-sm">{account.email}</CardDescription>
                        <p className="text-gray-500 text-sm mt-1">{account.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge className={getRoleBadgeColor(account.role)}>{account.role}</Badge>
                      <Badge className="bg-green-500/20 text-green-300 border-green-500/30">{account.status}</Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div>
                    <p className="text-gray-400 text-sm mb-2">Permissions:</p>
                    <div className="flex flex-wrap gap-2">
                      {account.permissions.map((permission, permIndex) => (
                        <Badge key={permIndex} variant="outline" className="text-xs border-gray-600 text-gray-300">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Infrastructure Services */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-white mb-6">Active GCP Services</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Database className="w-8 h-8 text-blue-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">BigQuery</h3>
                <p className="text-gray-400 text-sm">Data analytics and verification records</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Cloud className="w-8 h-8 text-green-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Cloud Run</h3>
                <p className="text-gray-400 text-sm">Containerized application hosting</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Mic className="w-8 h-8 text-purple-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Cloud Speech</h3>
                <p className="text-gray-400 text-sm">ASL and speech processing</p>
              </CardContent>
            </Card>

            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
              <CardContent className="p-6 text-center">
                <Brain className="w-8 h-8 text-cyan-400 mx-auto mb-3" />
                <h3 className="text-white font-semibold mb-2">Vertex AI</h3>
                <p className="text-gray-400 text-sm">Machine learning and AI models</p>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Security & Compliance */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">Security & Compliance Status</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="bg-green-500/10 border-green-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <CheckCircle className="w-5 h-5 mr-2 text-green-400" />
                  Security Compliance
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-gray-300">
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    ADA Compliance Standards Met
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Data Privacy Regulations
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    Professional Ethics Standards
                  </li>
                  <li className="flex items-center">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400" />
                    State Interpreter Certification
                  </li>
                </ul>
              </CardContent>
            </Card>

            <Card className="bg-blue-500/10 border-blue-500/20 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="text-white flex items-center">
                  <Activity className="w-5 h-5 mr-2 text-blue-400" />
                  System Health
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Trust Verification System</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Operational</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">AI Processing Services</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Operational</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">Data Analytics</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Operational</Badge>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-300">API Gateway</span>
                    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">Operational</Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
