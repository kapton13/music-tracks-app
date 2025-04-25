import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

import { api } from '../../services/api'

export const fetchGenres = createAsyncThunk<
  string[],
  void,
  { rejectValue: string }
>(
  'genres/fetchGenres',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<string[]>('/api/genres')
      return response.data
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        const data = err.response?.data as { message?: string }
        const message = data?.message ?? err.message
        return rejectWithValue(message)
      }
      if (err instanceof Error) {
        return rejectWithValue(err.message)
      }
      return rejectWithValue('Failed to fetch genres')
    }
  }
)

interface GenresState {
  list: string[]
  loading: boolean
  error: string | null
}

const initialState: GenresState = {
  list: [],
  loading: false,
  error: null,
}

const genresSlice = createSlice({
  name: 'genres',
  initialState,
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchGenres.pending, state => {
        state.loading = true
        state.error = null
      })
      .addCase(fetchGenres.fulfilled, (state, action) => {
        state.loading = false
        state.list = action.payload
      })
      .addCase(fetchGenres.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || 'Failed to fetch genres'
      })
  },
})

export default genresSlice.reducer
