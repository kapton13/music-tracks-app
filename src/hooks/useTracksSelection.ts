import { useCallback } from 'react'

export const useTracksSelection = (
  listIds: string[],
  setSelectedIds: React.Dispatch<React.SetStateAction<string[]>>,
  setCurrentlyPlayingId: React.Dispatch<React.SetStateAction<string | null>>
) => {
  const handleToggleSelect = useCallback((id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    )
  }, [setSelectedIds])

  const handleSelectAll = useCallback(() => {
    setSelectedIds(prev =>
      prev.length === listIds.length ? [] : [...listIds]
    )
  }, [listIds, setSelectedIds])

  const handleTogglePlay = useCallback((id: string, forcePause = false) => {
    setCurrentlyPlayingId(prev => (forcePause || prev === id ? null : id))
  }, [setCurrentlyPlayingId])

  return {
    handleToggleSelect,
    handleSelectAll,
    handleTogglePlay,
  }
}
