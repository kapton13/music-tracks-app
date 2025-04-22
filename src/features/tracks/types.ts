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
export interface QueryParams {
  page: number
  search: string
  sort: 'title' | 'artist' | 'album' | 'createdAt'
  order: 'asc' | 'desc'
  genre?: string
  artist?: string
}

export type SortOption = 'title' | 'artist' | 'album' | 'createdAt';
export type SortOrder = 'asc' | 'desc';