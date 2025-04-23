import React, { useEffect, useState, useRef } from 'react'
import { useSelector } from 'react-redux'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

import { RootState } from '../../app/store'
import styles from './TrackFormModal.module.css'

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist is required'),
  album: z.string().optional(),
  coverImage: z
    .string()
    .url('Cover image must be a valid URL')
    .optional()
    .or(z.literal('')),
  genres: z.array(z.string()).min(1, 'At least one genre is required'),
})

type FormData = z.infer<typeof schema>

interface Props {
  onSubmit: (data: FormData) => void
  onCancel: () => void
  defaultValues?: Partial<FormData>
}

const TrackForm: React.FC<Props> = ({ onSubmit, onCancel, defaultValues }) => {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      title: '',
      artist: '',
      album: '',
      coverImage: '',
      genres: [],
      ...defaultValues,
    },
  })

  const genresFromStore = useSelector((state: RootState) => state.genres.list)
  const genresLoading = useSelector((state: RootState) => state.genres.loading)
  const genresError = useSelector((state: RootState) => state.genres.error)

  const selectedGenres = watch('genres') || []
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', onClickOutside)
    return () => document.removeEventListener('mousedown', onClickOutside)
  }, [])

  const available = genresFromStore.filter(g => !selectedGenres.includes(g))

  const addGenre = (g: string) => {
    setValue('genres', [...selectedGenres, g])
    setDropdownOpen(false)
  }

  const removeGenre = (g: string) => {
    setValue('genres', selectedGenres.filter(x => x !== g))
  }

  useEffect(() => {
    if (defaultValues?.genres) setValue('genres', defaultValues.genres)
  }, [defaultValues, setValue])

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="track-form" className={styles.form}>
      <label>
        Title
        <input data-testid="input-title" {...register('title')} />
        {errors.title && <span data-testid="error-title" className={styles.error}>{errors.title.message}</span>}
      </label>

      <label>
        Artist
        <input data-testid="input-artist" {...register('artist')} />
        {errors.artist && <span data-testid="error-artist" className={styles.error}>{errors.artist.message}</span>}
      </label>

      <label>
        Album
        <input data-testid="input-album" {...register('album')} />
      </label>

      <label>
        Cover Image URL
        <input data-testid="input-cover-image" {...register('coverImage')} />
        {errors.coverImage && <span data-testid="error-cover-image" className={styles.error}>{errors.coverImage.message}</span>}
      </label>

      <div data-testid="genre-selector" className={styles.genres}>
        <div className={styles.tagList}>
          Genres:
          {available.length > 0 && (
            <div ref={dropdownRef} className={styles.dropdown}>
              <button type="button" className={styles.addBtn} onClick={() => setDropdownOpen(prev => !prev)}>+</button>
              {dropdownOpen && (
                <ul className={styles.menu} data-testid="genre-dropdown">
                  {available.map(g => (
                    <li
                      key={g}
                      className={styles.menuItem}
                      onClick={() => addGenre(g)}
                      data-testid={`genre-item-${g}`}
                    >
                      {g}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}
          {selectedGenres.map(g => (
            <span key={g} className={styles.tag}>
              {g} <button type="button" onClick={() => removeGenre(g)}>×</button>
            </span>
          ))}
        </div>
        {errors.genres && <div data-testid="error-genre" className={styles.error}>{errors.genres.message}</div>}
        {genresLoading && <div>Loading genres...</div>}
        {genresError && <div className={styles.error}>{genresError}</div>}
      </div>

      <div className={styles.formActions}>
        <button type="button" data-testid="cancel-button" className={styles.cancel} onClick={onCancel}>Cancel</button>
        <button data-testid="submit-button" type="submit" className={styles.save}>Save</button>
      </div>
    </form>
  )
}

export default TrackForm
