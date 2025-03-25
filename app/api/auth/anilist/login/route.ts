import { type NextRequest, NextResponse } from "next/server"

export async function GET(request: NextRequest) {
  const clientId = "25111"
  // Get the full URL for the redirect URI
  const redirectUri = `http://localhost:3000/api/auth/anilist/callback`

  // Construct the authorization URL
  const authUrl = new URL("https://anilist.co/api/v2/oauth/authorize")
  authUrl.searchParams.append("client_id", clientId!)
  authUrl.searchParams.append("redirect_uri", redirectUri)
  authUrl.searchParams.append("response_type", "code")

  // Redirect the user to the AniList authorization page
  return NextResponse.redirect(authUrl)
}

