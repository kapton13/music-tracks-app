import { useCallback } from 'react'
import { useDispatch } from 'react-redux'
import { toast } from 'react-toastify'

import {
  createTrack,
  updateTrack,
  uploadAudioFile,
  deleteTracksBulk,
  deleteTrackFile,
  deleteTrack,
  fetchTracks,
  removeTrackOptimistic,
} from '../features/tracks/tracksSlice'

import { AppDispatch } from '../app/store'
import { Track, TrackFormData, QueryParams } from '../features/tracks/types'
import { ALLOWED_AUDIO_TYPES, MAX_AUDIO_FILE_SIZE } from '../utils/constants'

interface Params {
  queryParams: QueryParams
  setEditingTrack: (track: Track | null) => void
  setModalOpen: (open: boolean) => void
  fileInputRef: React.RefObject<HTMLInputElement | null>
  pendingUploadId: string | null
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
  setUploading,
  setSelectedIds,
  setSelectionMode
}: Params) => {
  const dispatch = useDispatch<AppDispatch>()

  const handleCreateOrUpdate = useCallback(async (
    formData: TrackFormData,
    editingTrack: Track | null
  ): Promise<Track | undefined> => {
    try {
      let createdTrack: Track
      if (editingTrack) {
        createdTrack = await dispatch(updateTrack({ id: editingTrack.id, data: formData })).unwrap()
        toast.success('Track updated!')
      } else {
        createdTrack = await dispatch(createTrack(formData)).unwrap()
        toast.success('Track created!')
      }

      if (createdTrack && fileInputRef.current?.files?.[0]) {
        const file = fileInputRef.current.files[0]

        if (!ALLOWED_AUDIO_TYPES.includes(file.type)) {
          toast.error('Only .mp3 and .wav files are allowed')
          return createdTrack
        }

        if (file.size > MAX_AUDIO_FILE_SIZE) {
          toast.error('File size must be 20MB or less')
          return createdTrack
        }

        setUploading(true)
        await dispatch(uploadAudioFile({ id: createdTrack.id, file })).unwrap()
        setUploading(false)
        toast.success('Audio uploaded!')
      }

      await dispatch(fetchTracks(queryParams))
      setModalOpen(false)
      setEditingTrack(null)

      return createdTrack
    } catch (e) {
      toast.error(`Error: ${String(e)}`)
      return undefined
    }
  }, [dispatch, queryParams, fileInputRef, setEditingTrack, setModalOpen, setUploading])

  const handleDelete = useCallback(async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete this track?')
    if (!confirmed) return

    dispatch(removeTrackOptimistic(id))
    try {
      await dispatch(deleteTrack(id)).unwrap()
      toast.success('Track deleted!')
    } catch (e) {
      await dispatch(fetchTracks(queryParams))
      toast.error(`Error: ${String(e)}`)
    }
  }, [dispatch, queryParams])

  const handleFileUpload = useCallback((file: File) => {
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
    dispatch(uploadAudioFile({ id: pendingUploadId, file }))
      .unwrap()
      .then(() => toast.success('Audio uploaded!'))
      .catch(err => toast.error(String(err)))
      .finally(() => setUploading(false))
  }, [dispatch, pendingUploadId, setUploading])

  const handleBulkDelete = useCallback(async (ids: string[]) => {
    const backup = [...ids]
    backup.forEach(id => dispatch(removeTrackOptimistic(id)))
  
    try {
      await dispatch(deleteTracksBulk(ids)).unwrap()
      toast.success('Tracks deleted!')
      setSelectedIds([]) 
      setSelectionMode(false)
  
    } catch (e) {
      toast.error(`Bulk delete failed: ${String(e)}`)
      await dispatch(fetchTracks(queryParams))
    }
  }, [dispatch, queryParams, setSelectedIds, setSelectionMode])

  const handleDeleteFile = useCallback(async (id: string) => {
    const confirmed = window.confirm('Are you sure you want to delete the audio file?')
    if (!confirmed) return

    try {
      await dispatch(deleteTrackFile(id)).unwrap()
      await dispatch(fetchTracks(queryParams))
      toast.success('Audio file deleted!')
    } catch (e) {
      toast.error(`Error: ${String(e)}`)
    }
  }, [dispatch, queryParams])

  return {
    handleCreateOrUpdate,
    handleDelete,
    handleFileUpload,
    handleBulkDelete,
    handleDeleteFile,
  }
}