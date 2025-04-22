import React from 'react'

import { SortOption, SortOrder } from '../../features/tracks/types'

import styles from './Header.module.css'

interface HeaderProps {
  search: string
  onSearchChange: (value: string) => void
  genreFilter: string
  onGenreChange: (value: string) => void
  artistFilter: string
  onArtistChange: (value: string) => void
  sort: SortOption
  order: SortOrder
  onSortChange: (value: SortOption) => void
  onOrderToggle: () => void
  genres: string[]
  artists: string[]
  onCreate: () => void
  selectionMode: boolean
  onToggleSelectionMode: () => void
  selectedIds: string[]
  onSelectAll: () => void
  onBulkDelete: () => void
  genresLoading: boolean
  listLength: number
}

const Header: React.FC<HeaderProps> = ({
  search,
  onSearchChange,
  genreFilter,
  onGenreChange,
  artistFilter,
  onArtistChange,
  sort,
  order,
  onSortChange,
  onOrderToggle,
  genres,
  artists,
  onCreate,
  selectionMode,
  onToggleSelectionMode,
  selectedIds,
  onSelectAll,
  onBulkDelete,
  genresLoading,
  listLength,
}) => {
  return (
    <div className={styles.wrapper}>
      <h1 data-testid="tracks-header" className={styles.header}>Music Tracks</h1>

      <div className={styles.searchWrapper}>
        <input
          data-testid="search-input"
          type="text"
          placeholder="Search by title, artist, album..."
          value={search}
          onChange={e => onSearchChange(e.target.value)}
          className={styles.input}
        />
      </div>

      <div className={styles.controls}>
        <div className={styles.filtersRow}>
          <select
            data-testid="filter-genre"
            value={genreFilter}
            onChange={e => onGenreChange(e.target.value)}
            className={styles.select}
          >
            <option value="">All Genres</option>
            {genresLoading ? <option disabled>Loading...</option> : genres.map(genre => (
              <option key={genre} value={genre}>{genre}</option>
            ))}
          </select>

          <select
            data-testid="filter-artist"
            value={artistFilter}
            onChange={e => onArtistChange(e.target.value)}
            className={styles.select}
          >
            <option value="">All Artists</option>
            {artists.map(artist => (
              <option key={artist} value={artist}>{artist}</option>
            ))}
          </select>

          <div className={styles.sortGroup}>
            <select
              data-testid="sort-select"
              value={sort}
              onChange={e => onSortChange(e.target.value as SortOption)}
              className={styles.select}
            >
              <option value="title">Title</option>
              <option value="artist">Artist</option>
              <option value="album">Album</option>
              <option value="createdAt">Created At</option>
            </select>
            <button
              data-testid="sort-order-toggle"
              onClick={onOrderToggle}
              className={styles.sortButton}
            >
              {order === 'asc' ? '↑' : '↓'}
            </button>
          </div>
        </div>

        <div className={styles.actionsRow}>
          <button
            data-testid="create-track-button"
            onClick={onCreate}
            className={styles.button}
          >
            Create Track
          </button>

          <button
            data-testid="select-mode-toggle"
            onClick={onToggleSelectionMode}
            className={styles.button}
          >
            {selectionMode ? 'Cancel Selection' : 'Select Multiple'}
          </button>

          {selectionMode && (
            <>
              <button
                data-testid="select-all"
                onClick={onSelectAll}
                className={styles.button}
              >
                {selectedIds.length === listLength ? 'Deselect All' : 'Select All'}
              </button>
              <div className={styles.placeholder} />
              {selectedIds.length > 0 && (
                <button
                  data-testid="bulk-delete-button"
                  onClick={onBulkDelete}
                  className={styles.danger}
                >
                  Delete selected ({selectedIds.length})
                </button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header;