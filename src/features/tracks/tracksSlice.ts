import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios, { AxiosError } from 'axios'

import { Track } from './types'

interface TracksState {
  list: Track[]
  metadata: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
  loading: boolean
  error: string | null
  artists: string[]
}

const initialState: TracksState = {
  list: [],
  metadata: {
    total: 0,
    page: 1,
    limit: 10,
    totalPages: 0,
  },
  loading: false,
  error: null,
  artists: [],
}

export const fetchTracks = createAsyncThunk(
  'tracks/fetchTracks',
  async (
    params: {
      page?: number
      limit?: number
      search?: string
      sort?: 'title' | 'artist' | 'album' | 'createdAt'
      order?: 'asc' | 'desc'
      genre?: string
      artist?: string
    } = {}
  ) => {
    const query = new URLSearchParams({
      page: String(params.page || 1),
      limit: String(params.limit || 10),
      search: params.search || '',
      sort: params.sort || '',
      order: params.order || '',
      genre: params.genre || '',
      artist: params.artist || '',
    })

    const response = await axios.get(`http://localhost:8000/api/tracks?${query.toString()}`)
    return response.data
  }
)

export const fetchAllArtists = createAsyncThunk(
  'tracks/fetchAllArtists',
  async () => {
    const response = await axios.get('http://localhost:8000/api/tracks?limit=10000')
    const data = response.data.data as Track[]
    const artists = Array.from(new Set(data.map(t => t.artist))).sort((a, b) => a.localeCompare(b))
    return artists
  }
)

export const createTrack = createAsyncThunk<
  Track,
  {
    title: string
    artist: string
    album?: string
    genres: string[]
    coverImage?: string
  },
  { rejectValue: string }
>(
  'tracks/createTrack',
  async (trackData, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8000/api/tracks', {
        ...trackData,
        album: trackData.album || '',
      })
      return response.data
    } catch (error) {
      const err = error as AxiosError<{ error: string }>
      return rejectWithValue(err.response?.data?.error || 'Unexpected error')
    }
  }
)

export const updateTrack = createAsyncThunk<
  Track,
  { id: string; data: Partial<Track> },
  { rejectValue: string }
>(
  'tracks/updateTrack',
  async ({ id, data }, { rejectWithValue }) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/tracks/${id}`, data)
      return response.data
    } catch (error) {
      const err = error as AxiosError<{ error: string }>
      return rejectWithValue(err.response?.data?.error || 'Update failed')
    }
  }
)

export const deleteTrack = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>(
  'tracks/deleteTrack',
  async (id, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:8000/api/tracks/${id}`)
      return id
    } catch (error) {
      const err = error as AxiosError<{ error: string }>
      return rejectWithValue(err.response?.data?.error || 'Delete failed')
    }
  }
)

export const uploadAudioFile = createAsyncThunk<
  Track,
  { id: string; file: File },
  { rejectValue: string }
>(
  'tracks/uploadAudioFile',
  async ({ id, file }, { rejectWithValue }) => {
    try {
      const formData = new FormData()
      formData.append('file', file)

      const res = await axios.post(`http://localhost:8000/api/tracks/${id}/upload`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })

      return res.data
    } catch (error) {
      const err = error as AxiosError<{ error: string }>
      return rejectWithValue(err.response?.data?.error || 'Upload failed')
    }
  }
)

const tracksSlice = createSlice({
  name: 'tracks',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTracks.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchTracks.fulfilled, (state, action) => {
        console.log(action.payload);
        
        state.list = action.payload.data
        state.metadata = action.payload.meta
        state.loading = false
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to load tracks'
      })
      .addCase(fetchAllArtists.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchAllArtists.fulfilled, (state, action) => {
        state.artists = action.payload
        state.loading = false
      })
      .addCase(fetchAllArtists.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch artists'
      })
      .addCase(uploadAudioFile.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(uploadAudioFile.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t.id === action.payload.id)
        if (index !== -1) {
          state.list[index] = action.payload
        }
        state.loading = false
      })
      .addCase(uploadAudioFile.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to upload audio file'
      })
      .addCase(createTrack.pending, state => {
        state.loading = true
      })
      .addCase(createTrack.fulfilled, (state, action) => {
        state.loading = false
        state.list.unshift(action.payload)
      })
      .addCase(createTrack.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to create track'
      })
      .addCase(updateTrack.fulfilled, (state, action) => {
        const index = state.list.findIndex(t => t.id === action.payload.id)
        if (index !== -1) {
          state.list[index] = action.payload
        }
      })
      .addCase(deleteTrack.fulfilled, (state, action) => {
        state.list = state.list.filter(track => track.id !== action.payload)
      })
  },
})

export default tracksSlice.reducer