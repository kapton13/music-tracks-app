import { useEffect, useRef, useState, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { nanoid } from 'nanoid'

import { AppDispatch, RootState } from '../../app/store'
import {
  fetchTracks,
  fetchAllArtists,
  addTrackOptimistic,
  replaceTempTrack,
  removeTrackOptimistic,
} from '../../features/tracks/tracksSlice'
import { fetchGenres } from '../../features/genres/genresSlice'
import { Track, TrackFormData, QueryParams, SortOption, SortOrder } from '../../features/tracks/types'
import useDebounce from '../../hooks/useDebounce'
import { useTracksHandlers } from '../../hooks/useTracksHandlers'
import { useTracksSelection } from '../../hooks/useTracksSelection'

import TrackFormModal from '../../components/TrackFormModal/TrackFormModal'
import TrackForm from '../../components/TrackFormModal/TrackForm'
import TrackCard from '../../components/TrackCard/TrackCard'
import PaginationControls from '../../components/PaginationControls/PaginationControls'
import Header from '../../components/Header/Header'


import styles from './TracksPage.module.css'

const TracksPage = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list, loading, error, metadata, artists } = useSelector((state: RootState) => state.tracks)
  const { list: genres, loading: genresLoading } = useSelector((state: RootState) => state.genres)

  const [isModalOpen, setModalOpen] = useState(false)
  const [editingTrack, setEditingTrack] = useState<Track | null>(null)

  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')  
  const debouncedSearch = useDebounce(searchInput, 400)
  const [sort, setSort] = useState<SortOption>('title')
  const [order, setOrder] = useState<SortOrder>('asc')
  const [genreFilter, setGenreFilter] = useState('')
  const [artistFilter, setArtistFilter] = useState('')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const trackIdRef = useRef<string | null>(null)
  const [pendingUploadId, setPendingUploadId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectionMode, setSelectionMode] = useState(false)

  const queryParams: QueryParams = useMemo(() => ({
    page,
    search: debouncedSearch,
    sort,
    order,
    genre: genreFilter || undefined,
    artist: artistFilter || undefined,
  }), [page, debouncedSearch, sort, order, genreFilter, artistFilter])

  const {
    handleCreateOrUpdate,
    handleDelete,
    handleFileUpload,
    handleBulkDelete,
    handleDeleteFile
  } = useTracksHandlers({
    queryParams,
    setEditingTrack,
    setModalOpen,
    fileInputRef,
    pendingUploadId,
    setUploading,
    setSelectedIds,
    setSelectionMode,
  })

  const {
    handleToggleSelect,
    handleSelectAll,
    handleTogglePlay,
  } = useTracksSelection(
    list.map(track => track.id),
    setSelectedIds,
    setCurrentlyPlayingId
  )

  useEffect(() => {
    dispatch(fetchGenres())
    dispatch(fetchAllArtists())
  }, [dispatch])

  useEffect(() => {
    dispatch(fetchTracks(queryParams))
  }, [dispatch, queryParams])

  useEffect(() => {
    setPage(1)
  }, [debouncedSearch])

  const handleUpload = (id: string) => {
    trackIdRef.current = id
    setPendingUploadId(id)
    fileInputRef.current?.click()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      handleFileUpload(file)
    }
  }

  const handleFormSubmit = async (formData: TrackFormData) => {
    if (!editingTrack) {
      const tempId = nanoid()
      const optimisticTrack: Track = {
        id: tempId,
        title: formData.title,
        artist: formData.artist,
        album: formData.album || '',
        genres: formData.genres,
        coverImage: formData.coverImage || '',
        slug: '',
        audioFile: '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }
  
      dispatch(addTrackOptimistic(optimisticTrack))
  
      try {
        const response = await handleCreateOrUpdate(formData, null)
        if (response) {
          dispatch(replaceTempTrack({ tempId, track: response }))
        }
      } catch {
        dispatch(removeTrackOptimistic(tempId))
      }
    } else {
      handleCreateOrUpdate(formData, editingTrack)
    }
  }

  return (
    <div className={styles.pageWrapper}>
      <Header
        search={searchInput}
        onSearchChange={setSearchInput}
        genreFilter={genreFilter}
        onGenreChange={setGenreFilter}
        artistFilter={artistFilter}
        onArtistChange={setArtistFilter}
        sort={sort}
        order={order}
        onSortChange={setSort}
        onOrderToggle={() => setOrder(prev => prev === 'asc' ? 'desc' : 'asc')}
        genres={genres}
        artists={artists}
        onCreate={() => {
          setEditingTrack(null)
          setModalOpen(true)
        }}
        selectionMode={selectionMode}
        onToggleSelectionMode={() => setSelectionMode(prev => !prev)}
        selectedIds={selectedIds}
        onSelectAll={handleSelectAll}
        onBulkDelete={() => handleBulkDelete(selectedIds)}
        genresLoading={genresLoading}
        listLength={list.length}
      />

      {loading ? (
        <div data-testid="loading-tracks">Loading tracks...</div>
      ) : error ? (
        <div className={styles.error}>Error: {error}</div>
      ) : list.length === 0 ? (
        <div>No tracks found</div>
      ) : (
        <div className={styles.trackList}>
          {list.map(track => (
            <TrackCard
              key={track.id}
              track={track}
              isPlaying={currentlyPlayingId === track.id}
              selectionMode={selectionMode}
              isSelected={selectedIds.includes(track.id)}
              onToggleSelect={() => handleToggleSelect(track.id)}
              onPlay={handleTogglePlay}
              onUpload={handleUpload}
              onDeleteFile={handleDeleteFile}
              onEdit={() => {
                setEditingTrack(track)
                setModalOpen(true)
              }}
              onDelete={() => handleDelete(track.id)}
            />
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
        <PaginationControls
          page={page}
          totalPages={metadata.totalPages}
          onPageChange={(newPage) => setPage(newPage)}
        />
      )}

      <TrackFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingTrack(null)
        }}
      >
        <TrackForm
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setModalOpen(false);
            setEditingTrack(null);
          }}
          defaultValues={editingTrack || undefined}
        />
        {uploading && <p className={styles.uploading}>Uploading file...</p>}
      </TrackFormModal>
    </div>
  )
}

export default TracksPage