"use client"

import { Button } from "@/components/ui/button"
import { useRouter } from "next/navigation"

interface AniListAuthButtonProps {
  className?: string
}

export function AniListAuthButton({ className }: AniListAuthButtonProps) {
  const router = useRouter()

  const handleLogin = () => {
    router.push("/api/auth/anilist/login")
  }

  return (
    <Button onClick={handleLogin} className={`bg-blue-600 hover:bg-blue-700 text-white ${className}`}>
      Login with AniList
    </Button>
  )
}

