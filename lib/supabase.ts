import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  full_name: string
  user_type: "interpreter" | "deaf_professional" | "service_provider" | "admin"
  phone?: string
  video_phone?: string
  preferred_contact?: string
  profile_image_url?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface InterpreterProfile {
  id: string
  user_id: string
  asl_proficiency: "beginner" | "intermediate" | "advanced" | "native"
  years_experience: number
  specializations: string[]
  certifications: any[]
  languages: string[]
  service_areas: string[]
  hourly_rate?: number
  availability: any
  bio?: string
  website_url?: string
  linkedin_url?: string
  created_at: string
  updated_at: string
}

export interface TrustScore {
  id: string
  user_id: string
  overall_score: number
  skills_proficiency: number
  experience_verification: number
  community_standing: number
  performance_rating: number
  trust_level: "unverified" | "bronze" | "silver" | "gold" | "platinum"
  last_calculated: string
  expires_at?: string
  created_at: string
  updated_at: string
}

export interface CommunityFeedback {
  id: string
  reviewer_id: string
  reviewee_id: string
  service_type?: "real_estate" | "tax_preparation" | "insurance" | "financial_planning"
  rating: number
  feedback_text?: string
  cultural_competency_rating?: number
  communication_rating?: number
  professionalism_rating?: number
  would_recommend: boolean
  is_verified: boolean
  service_date?: string
  created_at: string
  updated_at: string
}
