"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { AuthService } from "@/lib/auth-service"

export default function AuthCallbackPage() {
  const router = useRouter()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const urlParams = new URLSearchParams(window.location.search)
        const tokenHash = urlParams.get("token_hash")
        const type = urlParams.get("type")

        if (tokenHash && type) {
          await AuthService.verifyEmail(tokenHash, type)
          router.push("/dashboard?verified=true")
        } else {
          router.push("/auth")
        }
      } catch (error) {
        console.error("Auth callback error:", error)
        router.push("/auth?error=verification_failed")
      }
    }

    handleAuthCallback()
  }, [router])

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center">
      <div className="text-white text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto mb-4"></div>
        <p>Verifying your account...</p>
      </div>
    </div>
  )
}
