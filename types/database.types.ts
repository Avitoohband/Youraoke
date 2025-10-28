export type Singer = {
  id: string
  user_id: string
  name: string
  image_url: string | null
  created_at: string
  updated_at: string
}

export type Song = {
  id: string
  singer_id: string
  title: string
  language: 'en' | 'he'
  created_at: string
  updated_at: string
}

export type SingerWithSongs = Singer & {
  songs: Song[]
}

