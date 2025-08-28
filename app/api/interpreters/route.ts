// This file should be renamed to app/api/pros/route.ts

import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const serviceType = searchParams.get("serviceType")
    const location = searchParams.get("location")
    const minTrustLevel = searchParams.get("minTrustLevel") || "bronze"

    const { data, error } = await supabase.rpc("get_available_interpreters", {
      service_type_param: serviceType,
      location_param: location,
      min_trust_level: minTrustLevel,
    })

    if (error) {
      console.error("PRO search error:", error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json(data)
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
