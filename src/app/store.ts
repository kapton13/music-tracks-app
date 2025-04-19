import { configureStore } from '@reduxjs/toolkit'
import tracksReducer from '../features/tracks/tracksSlice'

export const store = configureStore({
  reducer: {
    tracks: tracksReducer,
  },
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch