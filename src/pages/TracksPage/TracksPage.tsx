import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, RootState } from '../../app/store'
import { fetchTracks, createTrack } from '../../features/tracks/tracksSlice'

import TrackFormModal from '../../components/TrackFormModal/TrackFormModal'
import TrackForm from '../../components/TrackFormModal/TrackForm'

import styles from './TracksPage.module.css'

const TracksPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list, loading, error } = useSelector((state: RootState) => state.tracks)
  const [isModalOpen, setModalOpen] = useState(false)

  const handleCreateTrack = async (data: any) => {
    try {
      await dispatch(createTrack(data)).unwrap()
      setModalOpen(false)
      alert('Track created successfully!')
    } catch (e) {
      console.error('Create failed:', e)
      alert('Failed to create track.')
    }
  }

  useEffect(() => {
    dispatch(fetchTracks())
  }, [dispatch])

  return (
    <div className={styles.container}>
      <h1 data-testid="tracks-header">Music Tracks</h1>
      <button
        className={styles.createButton}
        data-testid="create-track-button"
        onClick={() => setModalOpen(true)}
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

      <TrackFormModal isOpen={isModalOpen} onClose={() => setModalOpen(false)}>
        <TrackForm onSubmit={handleCreateTrack} />
      </TrackFormModal>
    </div>
  )
}

export default TracksPage
