import { type EmailOtpType } from '@supabase/supabase-js'
import { type NextRequest } from 'next/server'

import { createClient } from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

export async function GET(request: NextRequest) {
  const supabase = await createClient()
  const { searchParams } = new URL(request.url)
  const access_token = searchParams.get('access_token')

  console.log(access_token)
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return new Response(JSON.stringify({ error: 'User not authenticated' }), { status: 401 })
  }
  try {
    const { data, error } = await supabase
      .from('tokens')
      .insert([{ user_id: user.id, access_token: access_token }])
      .select()

    if (error) {
      throw error
    }

    return new Response(JSON.stringify({ success: true, data }), { status: 200 })
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { status: 500 })
  }

 }