import React from 'react'

import { SortOption, SortOrder } from '../../features/tracks/types'

import CustomDropdown from '../CustomDropdown/CustomDropdown'

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
  listLength
}) => {
  const sortOptions: SortOption[] = ['title', 'artist', 'album', 'createdAt']

  const genreItems = ['' as string, ...genres]
  const artistItems = ['' as string, ...artists]

  return (
    <div className={styles.wrapper}>
      <div className={styles.headerRow}>
        <h1 data-testid="tracks-header" className={styles.header}>Music Tracks</h1>

        <button
            data-testid="create-track-button"
            onClick={onCreate}
            className={styles.createButton}
          >Create Track</button>
      </div>
      

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
          <CustomDropdown
            items={genreItems}
            selected={genreFilter}
            onChange={onGenreChange}
            labelKey={g => g || 'All Genres'}
            valueKey={g => g}
            loading={genresLoading}
            placeholder="All Genres"
          />

          <CustomDropdown
            items={artistItems}
            selected={artistFilter}
            onChange={onArtistChange}
            labelKey={a => a || 'All Artists'}
            valueKey={a => a}
            loading={false}
            placeholder="All Artists"
          />

          <CustomDropdown
            items={sortOptions}
            selected={sort}
            onChange={onSortChange}
            labelKey={opt => `${opt.charAt(0).toUpperCase() + opt.slice(1)}`}
            valueKey={opt => opt}
          />
          <button
            data-testid="sort-order-toggle"
            onClick={onOrderToggle}
            className={styles.sortButton}
          >
            {order === 'asc' ? 'Sort by ↑' : 'Sort by ↓'}
          </button>
        </div>

        <div className={styles.actionsRow}>
          <button
            data-testid="select-mode-toggle"
            onClick={onToggleSelectionMode}
            className={styles.button}
          >{selectionMode ? 'Cancel Selection' : 'Select Multiple'}</button>

          {selectionMode && (
            <> 
              <button
                data-testid="select-all"
                onClick={onSelectAll}
                className={styles.button}
              >{selectedIds.length === listLength ? 'Deselect All' : 'Select All'}</button>

              <div className={styles.placeholder} />

              {selectedIds.length > 0 && (
                <button
                  data-testid="bulk-delete-button"
                  onClick={onBulkDelete}
                  className={styles.danger}
                >Delete selected ({selectedIds.length})</button>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Header
