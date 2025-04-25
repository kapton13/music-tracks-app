import { useCallback } from 'react'
import { useAppDispatch } from './useAppHooks';
import { toast } from 'react-toastify'
import {
  createTrack,
  updateTrack,
  uploadAudioFile,
  deleteTracksBulk,
  deleteTrackFile,
  deleteTrack,
  fetchTracks,
  fetchAllArtists,
  removeTrackOptimistic,
} from '../features/tracks/tracksSlice'
import { Track, TrackFormData, QueryParams } from '../features/tracks/types'
import { ALLOWED_AUDIO_TYPES, MAX_AUDIO_FILE_SIZE } from '../utils/constants'

interface Params {
  queryParams: QueryParams
  setEditingTrack: (track: Track | null) => void
  setModalOpen: (open: boolean) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  pendingUploadId: string | null
  setPendingUploadId: React.Dispatch<React.SetStateAction<string | null>>
  setUploading: (state: boolean) => void
  setSelectedIds: (ids: string[]) => void
  setSelectionMode: (value: boolean) => void
}

export const useTracksHandlers = ({
  queryParams,
  setEditingTrack,
  setModalOpen,
  fileInputRef,
  pendingUploadId,
  setPendingUploadId,
  setUploading,
  setSelectedIds,
  setSelectionMode,
}: Params) => {
  const dispatch = useAppDispatch()

  const handleCreateOrUpdate = useCallback(
    async (formData: TrackFormData, editingTrack: Track | null): Promise<Track | undefined> => {
      try {
        let result: Track
  
        if (editingTrack) {
          result = await dispatch(
            updateTrack({ id: editingTrack.id, data: formData })
          ).unwrap()
          toast.success('Track updated!')
        } else {
          result = await dispatch(createTrack(formData)).unwrap()
          toast.success('Track created!')
        }
  
        await dispatch(fetchTracks(queryParams))
        await dispatch(fetchAllArtists())
        setModalOpen(false)
        setEditingTrack(null)
  
        return result
      } catch (error: unknown) {
        toast.error(`Error: ${String(error)}`)
        return undefined
      }
    },
    [dispatch, queryParams, setModalOpen, setEditingTrack]
  )

  const handleDelete = useCallback(
    async (id: string) => {
      if (!window.confirm('Are you sure you want to delete this track?')) return
      dispatch(removeTrackOptimistic(id))
      try {
        await dispatch(deleteTrack(id)).unwrap()
        toast.success('Track deleted!')
        await dispatch(fetchAllArtists())
      } catch (error: unknown) {
        toast.error(`Error: ${String(error)}`)
        await dispatch(fetchTracks(queryParams))
      }
    },
    [dispatch, queryParams]
  )

  const handleUploadNewFile = useCallback(
    (id: string) => {
      setPendingUploadId(id)
      fileInputRef.current?.click()
    },
    [setPendingUploadId, fileInputRef]
  )

  const handleReplaceFile = handleUploadNewFile

  const handleFileUpload = useCallback(
    async (file: File) => {
      if (!pendingUploadId) return
      if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
        toast.error('Only .mp3 and .wav files are allowed')
        return
      }
      if (file.size > MAX_AUDIO_FILE_SIZE) {
        toast.error('File size must be 20MB or less')
        return
      }
      setUploading(true)
      try {
        await dispatch(uploadAudioFile({ id: pendingUploadId, file })).unwrap()
        toast.success('Audio uploaded!')
        await dispatch(fetchAllArtists())
      } catch (error: unknown) {
        toast.error(`Error: ${String(error)}`)
      } finally {
        setUploading(false)
      }
    },
    [dispatch, pendingUploadId, setUploading]
  )

  const handleBulkDelete = useCallback(
    async (ids: string[]) => {
      const backup = [...ids]
      backup.forEach(id => dispatch(removeTrackOptimistic(id)))
      try {
        const { success } = await dispatch(deleteTracksBulk(ids)).unwrap()
        toast.success(`Deleted ${success.length} tracks`)
        setSelectedIds([])
        setSelectionMode(false)
        await dispatch(fetchAllArtists())
      } catch (error: unknown) {
        toast.error(`Bulk delete failed: ${String(error)}`)
        await dispatch(fetchTracks(queryParams))
      }
    },
    [dispatch, queryParams, setSelectedIds, setSelectionMode]
  )

  const handleDeleteFile = useCallback(
    async (id: string) => {
      if (!window.confirm('Are you sure you want to delete the audio file?')) return
      try {
        await dispatch(deleteTrackFile(id)).unwrap()
        toast.success('Audio file deleted!')
        await dispatch(fetchTracks(queryParams))
        await dispatch(fetchAllArtists())
      } catch (error: unknown) {
        toast.error(`Error: ${String(error)}`)
      }
    },
    [dispatch, queryParams]
  )

  return {
    handleCreateOrUpdate,
    handleDelete,
    handleUploadNewFile,
    handleReplaceFile,
    handleFileUpload,
    handleBulkDelete,
    handleDeleteFile,
  }
}