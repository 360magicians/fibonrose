import { supabase } from "./supabase"
import type { User, InterpreterProfile, CommunityFeedback } from "./supabase"

// User management functions
export async function createUser(userData: Partial<User>) {
  const { data, error } = await supabase.from("users").insert(userData).select().single()

  if (error) throw error
  return data
}

export async function getUserProfile(userId: string) {
  const { data, error } = await supabase
    .from("users")
    .select(`
      *,
      interpreter_profiles(*),
      deaf_professional_profiles(*),
      trust_scores(*)
    `)
    .eq("id", userId)
    .single()

  if (error) throw error
  return data
}

// Interpreter functions
export async function getVerifiedInterpreters(serviceType?: string, location?: string) {
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

  if (location) {
    query = query.contains("interpreter_profiles.service_areas", [location])
  }

  const { data, error } = await query

  if (error) throw error
  return data
}

export async function createInterpreterProfile(profileData: Partial<InterpreterProfile>) {
  const { data, error } = await supabase.from("interpreter_profiles").insert(profileData).select().single()

  if (error) throw error
  return data
}

// Trust score functions
export async function calculateTrustScore(userId: string) {
  const { data, error } = await supabase.rpc("calculate_trust_score", { user_uuid: userId })

  if (error) throw error
  return data
}

export async function getTrustScore(userId: string) {
  const { data, error } = await supabase.from("trust_scores").select("*").eq("user_id", userId).single()

  if (error) throw error
  return data
}

// Community feedback functions
export async function submitFeedback(feedbackData: Partial<CommunityFeedback>) {
  const { data, error } = await supabase.from("community_feedback").insert(feedbackData).select().single()

  if (error) throw error

  // Recalculate trust score after feedback submission
  await calculateTrustScore(feedbackData.reviewee_id!)

  return data
}

export async function getFeedbackForUser(userId: string) {
  const { data, error } = await supabase
    .from("community_feedback")
    .select(`
      *,
      reviewer:reviewer_id(full_name)
    `)
    .eq("reviewee_id", userId)
    .eq("is_verified", true)
    .order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// Verification functions
export async function submitVerificationRequest(requestData: any) {
  const { data, error } = await supabase.from("verification_requests").insert(requestData).select().single()

  if (error) throw error
  return data
}

export async function getVerificationRequests(userId?: string, status?: string) {
  let query = supabase.from("verification_requests").select(`
      *,
      user:user_id(full_name, email),
      reviewer:reviewer_id(full_name)
    `)

  if (userId) {
    query = query.eq("user_id", userId)
  }

  if (status) {
    query = query.eq("status", status)
  }

  const { data, error } = await query.order("created_at", { ascending: false })

  if (error) throw error
  return data
}

// Service booking functions
export async function createServiceBooking(bookingData: any) {
  const { data, error } = await supabase.from("service_bookings").insert(bookingData).select().single()

  if (error) throw error
  return data
}

export async function getServiceBookings(userId: string, userType: string) {
  let query = supabase.from("service_bookings").select(`
      *,
      client:client_id(full_name, email),
      interpreter:interpreter_id(full_name, email),
      service_provider:service_provider_id(full_name, email)
    `)

  if (userType === "interpreter") {
    query = query.eq("interpreter_id", userId)
  } else if (userType === "service_provider") {
    query = query.eq("service_provider_id", userId)
  } else {
    query = query.eq("client_id", userId)
  }

  const { data, error } = await query.order("appointment_date", { ascending: true })

  if (error) throw error
  return data
}
