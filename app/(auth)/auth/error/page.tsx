import { Button } from "@/components/ui/button"
import Link from "next/link"

export default async function AuthErrorPage({
  searchParams,
}: {
  searchParams: { error?: string; details?: string }
}) {
  const errorMessages: Record<string, string> = {
    missing_code: "Authorization code is missing from the callback.",
    token_exchange: "Failed to exchange authorization code for access token.",
    database_error: "Failed to store the access token in the database.",
    server_error: "An unexpected error occurred during authentication.",
  }

  const errorMessage = searchParams.error
    ? errorMessages[searchParams.error] || "An unknown error occurred."
    : "An unknown error occurred."

  const details = searchParams.details ? JSON.parse(decodeURIComponent(searchParams.details)) : null

  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-4">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md dark:bg-gray-800">
        <h1 className="mb-4 text-2xl font-bold text-center text-red-600 dark:text-red-400">Authentication Error</h1>
        <p className="mb-6 text-center text-gray-700 dark:text-gray-300">{errorMessage}</p>
        {details && (
          <div className="mb-6 p-3 bg-gray-100 dark:bg-gray-700 rounded overflow-auto">
            <pre className="text-xs">{JSON.stringify(details, null, 2)}</pre>
          </div>
        )}
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/">Return to browsing anime</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}

