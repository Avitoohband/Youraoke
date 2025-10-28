import { createClient } from '@/utils/supabase/server'
import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { DashboardClient } from '@/components/DashboardClient'
import type { SingerWithSongs } from '@/types/database.types'

export default async function DashboardPage() {
  const cookieStore = await cookies()
  const supabase = createClient(cookieStore)

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Fetch singers with their songs
  const { data: singers } = await supabase
    .from('singers')
    .select(`
      id,
      name,
      image_url,
      user_id,
      created_at,
      updated_at,
      songs (
        id,
        title,
        language,
        singer_id,
        created_at,
        updated_at
      )
    `)
    .order('name', { ascending: true })

  const singersWithSongs: SingerWithSongs[] = (singers || []).map((singer) => ({
    ...singer,
    songs: Array.isArray(singer.songs) ? singer.songs : [],
  }))

  return <DashboardClient initialSingers={singersWithSongs} userEmail={user.email || ''} />
}

