import { createAsyncThunk, createSlice } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchGenres = createAsyncThunk('genres/fetchGenres', async () => {
  const response = await axios.get<string[]>('http://localhost:8000/api/genres')
  return response.data
})

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
