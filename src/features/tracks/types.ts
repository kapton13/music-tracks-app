export interface Track {
  id: string
  title: string
  artist: string
  album?: string
  genres: string[]
  slug: string
  coverImage?: string
  audioFile?: string
  createdAt: string
  updatedAt: string
}

export type TrackFormData = {
  title: string
  artist: string
  album?: string
  genres: string[]
  coverImage?: string
}