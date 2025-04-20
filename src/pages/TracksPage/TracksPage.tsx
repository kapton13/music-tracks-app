import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { AppDispatch, RootState } from '../../app/store'

import {
  fetchTracks,
  createTrack,
  updateTrack,
  deleteTrack,
} from '../../features/tracks/tracksSlice'
import { Track } from '../../features/tracks/types'

import TrackFormModal from '../../components/TrackFormModal/TrackFormModal'
import TrackForm from '../../components/TrackFormModal/TrackForm'

import styles from './TracksPage.module.css'

const TracksPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list, loading, error } = useSelector((state: RootState) => state.tracks)
  const [isModalOpen, setModalOpen] = useState(false)
  const [editingTrack, setEditingTrack] = useState<Track | null>(null)

  useEffect(() => {
    dispatch(fetchTracks())
  }, [dispatch])

  const handleCreateOrUpdate = async (formData: any) => {
    try {
      if (editingTrack) {
        await dispatch(updateTrack({ id: editingTrack.id, data: formData })).unwrap()
        alert('Track updated!')
      } else {
        await dispatch(createTrack(formData)).unwrap()
        alert('Track created!')
      }

      setModalOpen(false)
      setEditingTrack(null)
    } catch (e: any) {
      alert(`Error: ${e}`)
    }
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this track?')
    if (!confirmed) return
  
    try {
      await dispatch(deleteTrack(id)).unwrap()
      alert('Track deleted!')
    } catch (e: any) {
      alert(`Error: ${e}`)
    }
  }

  return (
    <div className={styles.container}>
      <h1 data-testid="tracks-header">Music Tracks</h1>

      <button
        className={styles.createButton}
        data-testid="create-track-button"
        onClick={() => {
          setEditingTrack(null)
          setModalOpen(true)
        }}
      >
        Create Track
      </button>

      {loading ? (
        <div data-testid="loading-tracks">Loading tracks...</div>
      ) : error ? (
        <div className={styles.error}>Error: {error}</div>
      ) : list.length === 0 ? (
        <div>No tracks found</div>
      ) : (
        <div className={styles.trackList}>
          {list.map(track => (
            <div key={track.id} className={styles.trackItem} data-testid={`track-item-${track.id}`}>
              <div data-testid={`track-item-${track.id}-title`}>Title: {track.title}</div>
              <div data-testid={`track-item-${track.id}-artist`}>Artist: {track.artist}</div>
              <button
                data-testid={`edit-track-${track.id}`}
                onClick={() => {
                  setEditingTrack(track)
                  setModalOpen(true)
                }}
              >
                Edit
              </button>
              <button
                data-testid={`delete-track-${track.id}`}
                onClick={() => handleDelete(track.id)}
              >
                Delete
              </button>
            </div>
          ))}
        </div>
      )}

      <TrackFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingTrack(null)
        }}
      >
        <TrackForm
          onSubmit={handleCreateOrUpdate}
          defaultValues={editingTrack || undefined}
        />
      </TrackFormModal>
    </div>
  )
}

export default TracksPage
