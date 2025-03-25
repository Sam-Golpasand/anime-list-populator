import { type NextRequest, NextResponse } from "next/server"
import { createClient } from "@/utils/supabase/server"

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url)
  const code = searchParams.get("code")

  if (!code) {
    return NextResponse.redirect(new URL("/auth/error?error=missing_code", request.url))
  }

  try {
    const redirectUri = `http://localhost:3000/api/auth/anilist/callback`

    // Exchange the authorization code for an access token
    const tokenResponse = await fetch("https://anilist.co/api/v2/oauth/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        grant_type: "authorization_code",
        client_id: "25111",
        client_secret: "4d9fRWRGT4TUq8m5q6rXslOAtkJYwEEMpKMHdT6W",
        redirect_uri: redirectUri,
        code,
      }),
    })

    if (!tokenResponse.ok) {
      const errorText = await tokenResponse.text()
      let errorData
      try {
        errorData = JSON.parse(errorText)
      } catch (e) {
        errorData = { text: errorText }
      }
      console.error("Token exchange error:", errorData)

      // Simplified error URL to avoid issues with complex JSON in URL
      return NextResponse.redirect(new URL(`/auth/error?error=token_exchange`, request.url))
    }

    const tokenData = await tokenResponse.json()
    const access_token = tokenData.access_token

    // Get the authenticated user from Supabase
    const supabase = await createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      // If not authenticated with Supabase, redirect to login
      return NextResponse.redirect(new URL("/login?message=Please login first", request.url))
    }

    // Store the token in the database
    const { data, error } = await supabase
      .from('tokens')
      .insert([
        { user_id: user.id, access_token: access_token },
      ])
      .select()

    if (error) {
      console.error("Error storing token:", error)
      return NextResponse.redirect(new URL("/auth/error?error=database_error", request.url))
    }

    // Redirect to success page or dashboard
    return NextResponse.redirect(new URL("/?message=Successfully connected AniList", request.url))
  } catch (error) {
    console.error("Callback error:", error)
    return NextResponse.redirect(new URL("/auth/error?error=server_error", request.url))
  }
}

