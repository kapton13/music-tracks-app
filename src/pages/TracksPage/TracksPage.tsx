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
import useDebounce from '../../hooks/useDebounce'

import TrackFormModal from '../../components/TrackFormModal/TrackFormModal'
import TrackForm from '../../components/TrackFormModal/TrackForm'

import styles from './TracksPage.module.css'

const TracksPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list, loading, error, metadata } = useSelector((state: RootState) => state.tracks)

  const [isModalOpen, setModalOpen] = useState(false)
  const [editingTrack, setEditingTrack] = useState<Track | null>(null)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'title' | 'artist' | 'album' | 'createdAt'>('title')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')

  const debouncedSearch = useDebounce(search, 400)

  useEffect(() => {
    dispatch(fetchTracks({ page, search: debouncedSearch, sort, order }))
  }, [dispatch, page, debouncedSearch, sort, order])

  const handleCreateOrUpdate = async (formData: any) => {
    try {
      if (editingTrack) {
        await dispatch(updateTrack({ id: editingTrack.id, data: formData })).unwrap()
        alert('Track updated!')
      } else {
        await dispatch(createTrack(formData)).unwrap()
        alert('Track created!')
      }

      await dispatch(fetchTracks({ page, search: debouncedSearch, sort, order }))
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
      await dispatch(fetchTracks({ page, search: debouncedSearch, sort, order }))
      alert('Track deleted!')
    } catch (e: any) {
      alert(`Error: ${e}`)
    }
  }

  return (
    <div className={styles.container}>
      <h1 data-testid="tracks-header">Music Tracks</h1>

      <div className={styles.controls}>
        <input
          data-testid="search-input"
          type="text"
          placeholder="Search by title, artist, album..."
          value={search}
          onChange={e => {
            setPage(1)
            setSearch(e.target.value)
          }}
        />

        <div className={styles.sortGroup}>
          <select
            data-testid="sort-select"
            value={sort}
            onChange={e => {
              setPage(1)
              setSort(e.target.value as typeof sort)
            }}
          >
            <option value="title">Title</option>
            <option value="artist">Artist</option>
            <option value="album">Album</option>
            <option value="createdAt">Created At</option>
          </select>

          <button
            className={styles.sortButton}
            onClick={() => setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
          >
            {order === 'asc' ? '↑' : '↓'}
          </button>
        </div>

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
      </div>

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

      {metadata.totalPages > 1 && (
        <div data-testid="pagination" className={styles.pagination}>
          <button
            data-testid="pagination-prev"
            onClick={() => setPage(prev => Math.max(1, prev - 1))}
            disabled={page <= 1}
          >
            Prev
          </button>

          <span>
            Page {page} / {metadata.totalPages}
          </span>

          <button
            data-testid="pagination-next"
            onClick={() => setPage(prev => Math.min(metadata.totalPages, prev + 1))}
            disabled={page >= metadata.totalPages}
          >
            Next
          </button>
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
