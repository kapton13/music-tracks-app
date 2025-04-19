import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, RootState } from '../../app/store'
import { fetchTracks } from '../../features/tracks/tracksSlice'

import styles from './TracksPage.module.css'

const TracksPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list, loading, error } = useSelector((state: RootState) => state.tracks)
  console.log('TracksPage -> list', list);

  useEffect(() => {
    dispatch(fetchTracks())
  }, [dispatch])

  return (
    <div className={styles.container}>
      <h1 data-testid="tracks-header">Music Tracks</h1>
      <button
        className={styles.createButton}
        data-testid="create-track-button"
        onClick={() => {}}
      >
        Create Track
      </button>

      {loading ? (
        <div data-testid="loading-tracks">Loading tracks...</div>
      ) : error ? (
        <div className={styles.error}>Error: {error}</div>
      ) : (
        <div className={styles.trackList}>
          {list.map(track => (
            <div key={track.id} className={styles.trackItem} data-testid={`track-item-${track.id}`}>
              <div data-testid={`track-item-${track.id}-title`}>Title: {track.title}</div>
              <div data-testid={`track-item-${track.id}-artist`}>Artist: {track.artist}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default TracksPage
