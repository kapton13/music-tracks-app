import React from 'react'
import Waveform from '../Waveform/Waveform'

import { EditIcon, TrashIcon, ReplaceIcon, UploadIcon } from '../Icons/Icons'
import { Track } from '../../features/tracks/types'
import defaultCover from '../../assets/default-cover.png'

import styles from './TrackCard.module.css'

interface Props {
  track: Track
  isPlaying: boolean
  selectionMode: boolean
  isSelected: boolean
  onToggleSelect: () => void
  onPlay: (id: string, forcePause?: boolean) => void
  onUpload: (id: string) => void
  onDeleteFile: (id: string) => void
  onReplaceFile: (id: string) => void
  onEdit: () => void
  onDelete: () => void
}

const TrackCard: React.FC<Props> = ({
  track,
  isPlaying,
  selectionMode,
  isSelected,
  onToggleSelect,
  onPlay,
  onUpload,
  onDeleteFile,
  onReplaceFile,
  onEdit,
  onDelete,
}) => {
  const coverSrc = track.coverImage?.trim() ? track.coverImage : defaultCover

  return (
    <div className={styles.card} data-testid={`track-item-${track.id}`}>
      <div className={styles.topRow}>
        {selectionMode && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={onToggleSelect}
            data-testid={`track-checkbox-${track.id}`}
          />
        )}
        <img
          src={coverSrc}
          alt={`${track.title} cover`}
          className={styles.coverImage}
          data-testid={`track-item-${track.id}-cover`}
        />
        <div className={styles.meta}>
          <div className={styles.text}><strong>Title:</strong> {track.title}</div>
          <div className={styles.text}><strong>Artist:</strong> {track.artist}</div>
          {track.album && (
            <div className={styles.text}><strong>Album:</strong> {track.album}</div>
          )}
          <div className={styles.text}>
            <strong>Genres:</strong> {track.genres?.join(', ')}
          </div>
        </div>
      </div>

      <div className={styles.actions}>
        <button
          onClick={onEdit}
          data-testid={`edit-track-${track.id}`}
          className={styles.iconButton}
        >
          <EditIcon />
        </button>
        <button
          onClick={onDelete}
          data-testid={`delete-track-${track.id}`}
          className={styles.iconButton}
        >
          <TrashIcon />
        </button>
      </div>

      {track.audioFile ? (
        <>
          <Waveform
            trackId={track.id}
            audioUrl={`http://localhost:8000/api/files/${track.audioFile}`}
            isPlaying={isPlaying}
            onPlay={onPlay}
          />
          <div className={styles.fileButtons}>
            <button
              onClick={() => onDeleteFile(track.id)}
              data-testid={`delete-audio-${track.id}`}
              className={styles.deleteFileButton}
            >
              Delete Audio File
            </button>
            <button
              onClick={() => onReplaceFile(track.id)}
              data-testid={`replace-audio-${track.id}`}
              className={styles.replaceFileButton}
            >
              <ReplaceIcon />
              Replace Audio File
            </button>
          </div>
        </>
      ) : (
        <button
          onClick={() => onUpload(track.id)}
          data-testid={`upload-track-${track.id}`}
          className={styles.button}
        >
          <UploadIcon />
          Upload Audio
        </button>
      )}
    </div>
  )
}

export default TrackCard
