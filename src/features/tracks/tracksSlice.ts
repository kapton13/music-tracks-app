import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

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
}

export const fetchTracks = createAsyncThunk('tracks/fetchTracks', async () => {
  const response = await axios.get('http://localhost:8000/api/tracks')
  return response.data
})

export const createTrack = createAsyncThunk(
  'tracks/createTrack',
  async (trackData: {
    title: string
    artist: string
    album?: string
    genres: string[]
    coverImage: string
  }, { rejectWithValue }) => {
    try {
      const response = await axios.post('http://localhost:8000/api/tracks', {
        ...trackData,
        album: trackData.album || '',
      })
      return response.data
    } catch (error: any) {
      if (error.response && error.response.data?.error) {
        return rejectWithValue(error.response.data.error)
      }
      return rejectWithValue('Unexpected error')
    }
  }
)

export const updateTrack = createAsyncThunk(
  'tracks/updateTrack',
  async (
    {
      id,
      data,
    }: { id: string; data: Partial<Track> },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.put(`http://localhost:8000/api/tracks/${id}`, data)
      return response.data
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Update failed')
    }
  }
)

export const deleteTrack = createAsyncThunk(
  'tracks/deleteTrack',
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`http://localhost:8000/api/tracks/${id}`)
      return id
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || 'Delete failed')
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
        state.list = action.payload.data
        state.metadata = action.payload.meta
        state.loading = false
      })
      .addCase(fetchTracks.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to load tracks'
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