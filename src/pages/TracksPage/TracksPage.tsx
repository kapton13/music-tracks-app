import { useEffect, useRef, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, RootState } from '../../app/store'
import {
  fetchTracks,
  createTrack,
  updateTrack,
  deleteTrack,
  uploadAudioFile,
  fetchAllArtists,
} from '../../features/tracks/tracksSlice'
import { fetchGenres } from '../../features/genres/genresSlice'
import { Track } from '../../features/tracks/types'
import useDebounce from '../../hooks/useDebounce'

import TrackFormModal from '../../components/TrackFormModal/TrackFormModal'
import TrackForm from '../../components/TrackFormModal/TrackForm'

import styles from './TracksPage.module.css'

const TracksPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list, loading, error, metadata, artists } = useSelector((state: RootState) => state.tracks)
  const { list: genres, loading: genresLoading } = useSelector((state: RootState) => state.genres)

  const [isModalOpen, setModalOpen] = useState(false)
  const [editingTrack, setEditingTrack] = useState<Track | null>(null)

  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<'title' | 'artist' | 'album' | 'createdAt'>('title')
  const [order, setOrder] = useState<'asc' | 'desc'>('asc')
  const [genreFilter, setGenreFilter] = useState('')
  const [artistFilter, setArtistFilter] = useState('')

  const debouncedSearch = useDebounce(search, 400)
  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const trackIdRef = useRef<string | null>(null)
  const audioRefs = useRef<Record<string, HTMLAudioElement | null>>({})
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null)

  useEffect(() => {
    dispatch(fetchGenres())
    dispatch(fetchAllArtists())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchTracks({
      page,
      search: debouncedSearch,
      sort,
      order,
      genre: genreFilter || undefined,
      artist: artistFilter || undefined,
    }))
  }, [dispatch, page, debouncedSearch, sort, order, genreFilter, artistFilter])

  const handleCreateOrUpdate = async (formData: any) => {
    try {
      if (editingTrack) {
        await dispatch(updateTrack({ id: editingTrack.id, data: formData })).unwrap()
        alert('Track updated!')
      } else {
        await dispatch(createTrack(formData)).unwrap()
        alert('Track created!')
      }

      await dispatch(fetchTracks({ page, search: debouncedSearch, sort, order, genre: genreFilter || undefined, artist: artistFilter || undefined }))
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
      await dispatch(fetchTracks({ page, search: debouncedSearch, sort, order, genre: genreFilter || undefined, artist: artistFilter || undefined }))
      alert('Track deleted!')
    } catch (e: any) {
      alert(`Error: ${e}`)
    }
  }

  const handleUpload = (id: string) => {
    trackIdRef.current = id
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && trackIdRef.current) {
      dispatch(uploadAudioFile({ id: trackIdRef.current, file }))
        .unwrap()
        .then(() => alert('Audio uploaded!'))
        .catch(err => alert(err))
    }
  }

  const handlePlay = (id: string) => {
    if (currentlyPlayingId && currentlyPlayingId !== id) {
      const prevAudio = audioRefs.current[currentlyPlayingId]
      if (prevAudio) prevAudio.pause()
    }
    setCurrentlyPlayingId(id)
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

        <select
          data-testid="filter-genre"
          value={genreFilter}
          onChange={e => {
            setPage(1)
            setGenreFilter(e.target.value)
          }}
        >
          <option value="">All Genres</option>
          {genresLoading ? (
            <option disabled>Loading genres...</option>
          ) : (
            genres.map(genre => (
              <option key={genre} value={genre}>
                {genre}
              </option>
            ))
          )}
        </select>

        <select
          data-testid="filter-artist"
          value={artistFilter}
          onChange={e => {
            setPage(1)
            setArtistFilter(e.target.value)
          }}
        >
          <option value="">All Artists</option>
          {artists.map(artist => (
            <option key={artist} value={artist}>
              {artist}
            </option>
          ))}
        </select>

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
              <div>Album: {track.album}</div>
              <div>Genres: {track.genres?.join(', ')}</div>

              {track.audioFile ? (
                <audio
                ref={el => {
                  audioRefs.current[track.id] = el
                }}
                  controls
                  data-testid={`audio-player-${track.id}`}
                  onPlay={() => handlePlay(track.id)}
                >
                  <source src={`http://localhost:8000/api/files/${track.audioFile}`} />
                  Your browser does not support the audio element.
                </audio>
              ) : (
                <button
                  data-testid={`upload-track-${track.id}`}
                  onClick={() => handleUpload(track.id)}
                >
                  Upload Audio
                </button>
              )}

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

      <input
        type="file"
        accept=".mp3,.wav"
        hidden
        ref={fileInputRef}
        onChange={handleFileChange}
      />

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
