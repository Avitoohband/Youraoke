'use server'

import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'

export async function login(email: string, password: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

export async function signup(email: string, password: string) {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const { error } = await supabase.auth.signUp({
    email,
    password,
  })

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

export async function logout() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  await supabase.auth.signOut()
}

