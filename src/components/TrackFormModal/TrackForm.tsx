import { useEffect } from 'react'
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
  defaultValues?: Partial<FormData>
}

const TrackForm = ({ onSubmit, defaultValues }: Props) => {
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

  const toggleGenre = (genre: string) => {
    if (selectedGenres.includes(genre)) {
      setValue(
        'genres',
        selectedGenres.filter(g => g !== genre)
      )
    } else {
      setValue('genres', [...selectedGenres, genre])
    }
  }

  useEffect(() => {

    if (defaultValues?.genres) {
      setValue('genres', defaultValues.genres)
    }
  }, [defaultValues?.genres, setValue])

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
      </label>

      <div data-testid="genre-selector" className={styles.genres}>
        Genres:
        {genresLoading && <div>Loading genres...</div>}
        {genresError && <div className={styles.error}>{genresError}</div>}
        {!genresLoading &&
          genresFromStore.map(genre => (
            <button
              key={genre}
              type="button"
              className={`${styles.genre} ${selectedGenres.includes(genre) ? styles.selected : ''}`}
              onClick={() => toggleGenre(genre)}
            >
              {genre} {selectedGenres.includes(genre) && '×'}
            </button>
          ))}
        {errors.genres && (
          <div data-testid="error-genre" className={styles.error}>
            {errors.genres.message}
          </div>
        )}
      </div>

      <button data-testid="submit-button" type="submit">
        Save
      </button>
    </form>
  )
}

export default TrackForm
