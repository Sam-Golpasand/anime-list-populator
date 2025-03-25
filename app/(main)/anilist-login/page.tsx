import { createClient } from "@/utils/supabase/server"
import { redirect } from "next/navigation"
import { AniListAuthButton } from "@/components/AniListAuthButton"

export default async function ConnectAniListPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect("/login?message=Please login first")
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="mb-6 text-2xl font-bold text-center">Connect AniList Account</h1>
        <p className="mb-6 text-gray-600 dark:text-gray-300">
          Connect your AniList account to access your anime and manga lists.
        </p>
        <div className="flex justify-center">
          <AniListAuthButton className="w-full" />
        </div>
      </div>
    </div>
  )
}

