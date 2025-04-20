import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import styles from './TrackFormModal.module.css'

const genreOptions = ['Rock', 'Pop', 'Hip-hop', 'Jazz', 'Electronic']

const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  artist: z.string().min(1, 'Artist is required'),
  album: z.string().optional(),
  coverImage: z
    .string()
    .url('Invalid URL')
    .optional()
    .or(z.literal('')),
  genres: z.array(z.string()).min(1, 'At least one genre must be selected'),
})

type FormData = z.infer<typeof schema>

const TrackForm = ({ onSubmit }: { onSubmit: (data: FormData) => void }) => {
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
    },
  })

  const selectedGenres = watch('genres')

  const toggleGenre = (genre: string) => {
    const current = watch('genres') || []
    if (current.includes(genre)) {
      setValue('genres', current.filter(g => g !== genre))
    } else {
      setValue('genres', [...current, genre])
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} data-testid="track-form" className={styles.form}>
      <label>
        Title*
        <input {...register('title')} data-testid="input-title" />
        {errors.title && <div data-testid="error-title" className={styles.error}>{errors.title.message}</div>}
      </label>

      <label>
        Artist*
        <input {...register('artist')} data-testid="input-artist" />
        {errors.artist && <div data-testid="error-artist" className={styles.error}>{errors.artist.message}</div>}
      </label>

      <label>
        Album
        <input {...register('album')} data-testid="input-album" />
      </label>

      <label>
        Cover Image URL
        <input {...register('coverImage')} data-testid="input-cover-image" />
        {errors.coverImage && <div data-testid="error-coverImage" className={styles.error}>{errors.coverImage.message}</div>}
      </label>

      <div data-testid="genre-selector" className={styles.genres}>
        Genres:
        {genreOptions.map(genre => (
          <button
            key={genre}
            type="button"
            className={`${styles.genre} ${selectedGenres.includes(genre) ? styles.selected : ''}`}
            onClick={() => toggleGenre(genre)}
          >
            {genre} {selectedGenres.includes(genre) && '×'}
          </button>
        ))}
        {errors.genres && <div data-testid="error-genre" className={styles.error}>{errors.genres.message}</div>}
      </div>

      <button type="submit" data-testid="submit-button">Save</button>
    </form>
  )
}

export default TrackForm
