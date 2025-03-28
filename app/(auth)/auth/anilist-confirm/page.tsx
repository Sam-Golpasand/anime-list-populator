"use client"

import { useEffect, useState } from "react"
import { createClient } from "@/utils/supabase/client"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { toast, Zoom } from "react-toastify"

export default function CallbackPage() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  useEffect(() => {
    async function handleAuth() {
      // Create the Supabase client
      const supabase = createClient()

      try {
        // 1. Get the access token from URL hash (implicit flow returns token in hash)
        const hashParams = new URLSearchParams(
          window.location.hash.substring(1), // Remove the # character
        )
        const access_token = hashParams.get("access_token")

        if (!access_token) {
          throw new Error("No access token found in URL")
        }

        // 2. Check if the user is logged in
        const { data, error: sessionError } = await supabase.auth.getSession()

        if (sessionError) {
          throw sessionError
        }

        // If no session, try to refresh it
        if (!data.session) {
          const { data: refreshData, error: refreshError } = await supabase.auth.refreshSession()

          if (refreshError || !refreshData.session) {
            // Redirect to login with a return URL
            toast.error("Your session has expired. Please log in again.", {
              position: "bottom-right",
              autoClose: 4000,
              hideProgressBar: true,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
              progress: undefined,
              theme: "dark",
              transition: Zoom,
            })

            // Store the AniList token in localStorage temporarily
            localStorage.setItem("pendingAnilistToken", access_token)

            // Redirect to login
            router.push("/login?returnTo=/finish-anilist-connection")
            return
          }
        }

        // At this point we should have a session
        const { error: updateError } = await supabase.auth.updateUser({
          data: { anilist_access_token: access_token },
        })

        if (updateError) throw updateError

        // Success! Show toast and redirect
        toast.success("AniList connected successfully!", {
          position: "bottom-right",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          transition: Zoom,
        })

        // Redirect to profile or home
        router.push("/profile")
      } catch (err: any) {
        console.error("Auth error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    handleAuth()
  }, [router])

  if (loading)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-red-500"></div>
      </div>
    )

  if (error)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-500/10 text-red-500 p-6 rounded-md max-w-md">
          <h2 className="font-bold text-lg mb-2">Authentication Error</h2>
          <p>{error}</p>
          <div className="flex gap-4 mt-6">
            <Button onClick={() => router.push("/login")} className="bg-red-500 hover:bg-red-600 text-white">
              Log In
            </Button>
            <Button
              onClick={() => router.push("/")}
              variant="outline"
              className="border-red-500 text-red-500 hover:bg-red-500/10"
            >
              Return Home
            </Button>
          </div>
        </div>
      </div>
    )

  return null // This should not be rendered as we redirect on success
}

