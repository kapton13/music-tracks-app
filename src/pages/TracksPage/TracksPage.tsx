import React, { useEffect, useState, useMemo, useRef } from 'react'
import { useDispatch, useSelector } from 'react-redux'

import { AppDispatch, RootState } from '../../app/store'
import { fetchTracks, fetchAllArtists } from '../../features/tracks/tracksSlice'
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

const TracksPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { list, loading, error, metadata, artists } = useSelector((s: RootState) => s.tracks)
  const { list: genres, loading: genresLoading } = useSelector((s: RootState) => s.genres)

  const [isModalOpen, setModalOpen] = useState(false)
  const [editingTrack, setEditingTrack] = useState<Track | null>(null)

  const [page, setPage] = useState(1)
  const [searchInput, setSearchInput] = useState('')
  const debouncedSearch = useDebounce(searchInput, 400)
  const [sort, setSort] = useState<SortOption>('title')
  const [order, setOrder] = useState<SortOrder>('asc')
  const [genreFilter, setGenreFilter] = useState('')
  const [artistFilter, setArtistFilter] = useState('')

  const [pendingUploadId, setPendingUploadId] = useState<string | null>(null)
  const [uploading, setUploading] = useState(false)
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [selectionMode, setSelectionMode] = useState(false)
  const [currentlyPlayingId, setCurrentlyPlayingId] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  const queryParams: QueryParams = useMemo(
    () => ({
      page,
      search: debouncedSearch,
      sort,
      order,
      genre: genreFilter || undefined,
      artist: artistFilter || undefined,
    }),
    [page, debouncedSearch, sort, order, genreFilter, artistFilter]
  )

  const {
    handleCreateOrUpdate,
    handleDelete,
    handleUploadNewFile,
    handleReplaceFile,
    handleFileUpload,
    handleBulkDelete,
    handleDeleteFile,
  } = useTracksHandlers({
    queryParams,
    setEditingTrack,
    setModalOpen,
    fileInputRef,
    pendingUploadId,
    setPendingUploadId,
    setUploading,
    setSelectedIds,
    setSelectionMode
  })

  const { handleToggleSelect, handleSelectAll, handleTogglePlay } = useTracksSelection(
    list.map(t => t.id),
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileUpload(file)
  }

  const handleFormSubmit = async (data: TrackFormData) => {
    await handleCreateOrUpdate(data, editingTrack)
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
        onOrderToggle={() => setOrder(prev => (prev === 'asc' ? 'desc' : 'asc'))}
        genres={genres}
        artists={artists}
        onCreate={() => {
          setEditingTrack(null)
          setModalOpen(true)
        }}
        selectionMode={selectionMode}
        onToggleSelectionMode={() => setSelectionMode(prev => !prev)}
        selectedIds={selectedIds}
        onSelectAll={() => handleSelectAll()}
        onBulkDelete={() => handleBulkDelete(selectedIds)}
        genresLoading={genresLoading}
        listLength={list.length}
      />

      {loading ? (
        <div data-testid="loading-tracks">Loading tracks…</div>
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
              onUpload={() => handleUploadNewFile(track.id)}
              onDeleteFile={() => handleDeleteFile(track.id)}
              onReplaceFile={() => handleReplaceFile(track.id)}
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
        <PaginationControls page={page} totalPages={metadata.totalPages} onPageChange={setPage} />
      )}

      <TrackFormModal
        isOpen={isModalOpen}
        onClose={() => {
          setModalOpen(false)
          setEditingTrack(null)
        }}
      >
        <TrackForm
          defaultValues={editingTrack || undefined}
          onSubmit={handleFormSubmit}
          onCancel={() => {
            setModalOpen(false)
            setEditingTrack(null)
          }}
        />
        {uploading && <p className={styles.uploading}>Uploading file…</p>}
      </TrackFormModal>
    </div>
  )
}

export default TracksPage