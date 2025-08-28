import { createClient, type SupabaseClient } from "@supabase/supabase-js"

// Authentication Service Configuration
export interface AuthConfig {
  mode: "local" | "remote"
  endpoint?: string
}

export const AUTH_CONFIG: AuthConfig = {
  mode: "local",
  endpoint: process.env.AUTH_SERVICE_ENDPOINT,
}

// Enhanced Authentication Service Interface
export const AuthService = {
  // Lazy-initialized Supabase client
  _supabase: null as SupabaseClient | null,

  // Initialize Supabase client with lazy loading
  getSupabaseClient(): SupabaseClient {
    if (!this._supabase) {
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        throw new Error("Supabase URL and Anon Key must be configured")
      }

      this._supabase = createClient(supabaseUrl, supabaseAnonKey)
    }
    return this._supabase
  },

  // Local Authentication Methods
  async localAuthenticate(credentials: {
    username: string
    password: string
    options?: {
      persistSession?: boolean
      captchaToken?: string
    }
  }) {
    const supabase = this.getSupabaseClient()

    try {
      // Attempt sign-in with email/password
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.username, // Assuming username is email
        password: credentials.password,
        options: {
          persistSession: credentials.options?.persistSession ?? true,
          captchaToken: credentials.options?.captchaToken,
        },
      })

      if (error) {
        // Detailed error handling
        switch (error.message) {
          case "Invalid login credentials":
            throw new Error("Incorrect username or password")
          case "User not found":
            throw new Error("No account exists with this email")
          case "Email not confirmed":
            throw new Error("Please confirm your email before logging in")
          default:
            throw new Error(`Authentication failed: ${error.message}`)
        }
      }

      // Get user profile data
      if (data.user) {
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", data.user.id)
          .single()

        if (profileError) {
          console.warn("Could not fetch user profile:", profileError)
        }

        return {
          user: data.user,
          session: data.session,
          profile: profileData,
          authenticated: true,
        }
      }

      // Successful authentication
      return {
        user: data.user,
        session: data.session,
        authenticated: true,
      }
    } catch (err) {
      // Catch any unexpected errors
      console.error("Local authentication error:", err)
      throw err
    }
  },

  // Enhanced Sign Up with Profile Creation
  async signUp(credentials: {
    email: string
    password: string
    options?: {
      data?: {
        full_name?: string
        user_type?: "interpreter" | "deaf_professional" | "service_provider" | "admin"
        phone?: string
        video_phone?: string
        [key: string]: any
      }
      emailRedirectTo?: string
    }
  }) {
    const supabase = this.getSupabaseClient()

    try {
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: credentials.options?.data,
          emailRedirectTo: credentials.options?.emailRedirectTo || `${window.location.origin}/auth/callback`,
        },
      })

      if (error) {
        throw new Error(`Sign up failed: ${error.message}`)
      }

      // Create user profile if sign up was successful
      if (data.user && credentials.options?.data) {
        try {
          const { error: profileError } = await supabase.from("users").insert({
            id: data.user.id,
            email: credentials.email,
            full_name: credentials.options.data.full_name || "",
            user_type: credentials.options.data.user_type || "interpreter",
            phone: credentials.options.data.phone,
            video_phone: credentials.options.data.video_phone,
          })

          if (profileError) {
            console.error("Profile creation error:", profileError)
            // Don't throw here as auth was successful
          }
        } catch (profileErr) {
          console.error("Profile creation failed:", profileErr)
        }
      }

      return {
        user: data.user,
        session: data.session,
      }
    } catch (err) {
      console.error("Sign up error:", err)
      throw err
    }
  },

  // Password Reset
  async resetPassword(email: string) {
    const supabase = this.getSupabaseClient()

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: process.env.PASSWORD_RESET_REDIRECT_URL || `${window.location.origin}/auth/reset-password`,
      })

      if (error) {
        throw new Error(`Password reset failed: ${error.message}`)
      }

      return { success: true, message: "Password reset email sent" }
    } catch (err) {
      console.error("Password reset error:", err)
      throw err
    }
  },

  // Update Password
  async updatePassword(newPassword: string) {
    const supabase = this.getSupabaseClient()

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      })

      if (error) {
        throw new Error(`Password update failed: ${error.message}`)
      }

      return { success: true, message: "Password updated successfully" }
    } catch (err) {
      console.error("Password update error:", err)
      throw err
    }
  },

  // Get Current User
  async getCurrentUser() {
    const supabase = this.getSupabaseClient()

    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser()

      if (error) {
        throw new Error(`Failed to get current user: ${error.message}`)
      }

      if (user) {
        // Get user profile
        const { data: profileData, error: profileError } = await supabase
          .from("users")
          .select("*")
          .eq("id", user.id)
          .single()

        if (profileError) {
          console.warn("Could not fetch user profile:", profileError)
        }

        return {
          user,
          profile: profileData,
        }
      }

      return { user: null, profile: null }
    } catch (err) {
      console.error("Get current user error:", err)
      throw err
    }
  },

  // Get Current Session
  async getCurrentSession() {
    const supabase = this.getSupabaseClient()

    try {
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession()

      if (error) {
        throw new Error(`Failed to get current session: ${error.message}`)
      }

      return session
    } catch (err) {
      console.error("Get current session error:", err)
      throw err
    }
  },

  // Listen to Auth Changes
  onAuthStateChange(callback: (event: string, session: any) => void) {
    const supabase = this.getSupabaseClient()
    return supabase.auth.onAuthStateChange(callback)
  },

  // Logout
  async logout() {
    const supabase = this.getSupabaseClient()

    try {
      const { error } = await supabase.auth.signOut()

      if (error) {
        throw new Error(`Logout failed: ${error.message}`)
      }

      return { success: true }
    } catch (err) {
      console.error("Logout error:", err)
      throw err
    }
  },

  // Verify Email
  async verifyEmail(token: string, type: string) {
    const supabase = this.getSupabaseClient()

    try {
      const { data, error } = await supabase.auth.verifyOtp({
        token_hash: token,
        type: type as any,
      })

      if (error) {
        throw new Error(`Email verification failed: ${error.message}`)
      }

      return {
        user: data.user,
        session: data.session,
      }
    } catch (err) {
      console.error("Email verification error:", err)
      throw err
    }
  },
}

// Usage Example
export async function exampleAuthentication() {
  try {
    // Sign In
    const loginResult = await AuthService.localAuthenticate({
      username: "user@example.com",
      password: "securepassword",
      options: {
        persistSession: true,
      },
    })

    // Sign Up
    const signUpResult = await AuthService.signUp({
      email: "newuser@example.com",
      password: "newpassword",
      options: {
        data: {
          full_name: "John Doe",
          user_type: "interpreter",
          phone: "555-0123",
          video_phone: "vp-555-0123",
        },
      },
    })

    // Password Reset
    await AuthService.resetPassword("user@example.com")

    // Logout
    await AuthService.logout()
  } catch (error) {
    console.error("Authentication process failed:", error)
  }
}
