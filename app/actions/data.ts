'use server'

import { createClient } from '@/utils/supabase/server'
import type { Singer, Song } from '@/types/database.types'
import { fetchSingerImageFromWikipedia } from '@/utils/wikipedia'

export async function addSinger(
  singerName: string,
  songTitle: string,
  language: 'en' | 'he'
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: 'Not authenticated', singer: null, song: null }
  }

  // Fetch image from Wikipedia API
  let imageUrl: string | null = null
  try {
    imageUrl = await fetchSingerImageFromWikipedia(singerName)
  } catch (error) {
    console.error('Failed to fetch singer image:', error)
    // Continue without image if fetch fails
  }

  // Create singer with image URL
  const { data: singer, error: singerError } = await supabase
    .from('singers')
    .insert({
      user_id: user.id,
      name: singerName,
      image_url: imageUrl,
    })
    .select()
    .single()

  if (singerError || !singer) {
    return { error: singerError?.message || 'Failed to create singer', singer: null, song: null }
  }

  // Create song
  const { data: song, error: songError } = await supabase
    .from('songs')
    .insert({
      singer_id: singer.id,
      title: songTitle,
      language,
    })
    .select()
    .single()

  if (songError || !song) {
    // Rollback singer creation if song creation fails
    await supabase.from('singers').delete().eq('id', singer.id)
    return { error: songError?.message || 'Failed to create song', singer: null, song: null }
  }

  return { error: null, singer: singer as Singer, song: song as Song }
}

export async function addSong(
  singerId: string,
  songTitle: string,
  language: 'en' | 'he'
) {
  const supabase = await createClient()

  const { data: song, error } = await supabase
    .from('songs')
    .insert({
      singer_id: singerId,
      title: songTitle,
      language,
    })
    .select()
    .single()

  if (error || !song) {
    return { error: error?.message || 'Failed to create song', song: null }
  }

  return { error: null, song: song as Song }
}

export async function deleteSinger(singerId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('singers')
    .delete()
    .eq('id', singerId)

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

export async function deleteSong(songId: string) {
  const supabase = await createClient()

  const { error } = await supabase
    .from('songs')
    .delete()
    .eq('id', songId)

  if (error) {
    return { error: error.message }
  }

  return { error: null }
}

