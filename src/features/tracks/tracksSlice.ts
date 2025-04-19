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
  },
})

export default tracksSlice.reducer