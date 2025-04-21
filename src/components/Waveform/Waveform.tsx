import { useEffect, useRef, useState } from 'react'
import WaveSurfer from 'wavesurfer.js'

import styles from './Waveform.module.css'

interface WaveformProps {
  audioUrl: string
  isPlaying: boolean
  onPlay: (id: string, forcePause?: boolean) => void
  trackId: string
}

const Waveform = ({ audioUrl, isPlaying, onPlay, trackId }: WaveformProps) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const waveRef = useRef<WaveSurfer | null>(null)
  const [volume, setVolume] = useState(1)

  useEffect(() => {
    if (!containerRef.current) return

    waveRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: '#ccc',
      progressColor: '#3b82f6',
      barWidth: 2,
      height: 64,
      normalize: true,
      cursorColor: '#3b82f6',
    })

    waveRef.current.load(audioUrl)

    waveRef.current.on('ready', () => {
      waveRef.current?.setVolume(volume)
      if (isPlaying) waveRef.current?.play()
    })

    waveRef.current.on('finish', () => {
      waveRef.current?.seekTo(0)
      onPlay(trackId, true) // поставити у "paused" зверху
    })

    return () => {
      waveRef.current?.destroy()
    }
  }, [audioUrl])

  useEffect(() => {
    if (!waveRef.current) return
    if (isPlaying) {
        waveRef.current?.play()
      } else {
        waveRef.current?.pause()
      }
  }, [isPlaying])

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
    waveRef.current?.setVolume(newVolume)
  }

  const handleTogglePlay = () => {
    if (isPlaying) {
      onPlay(trackId, true) // пауза
    } else {
      onPlay(trackId) // відтворення
    }
  }

  return (
    <div className={styles.wrapper}>
      <div ref={containerRef} className={styles.waveContainer} />

      <div className={styles.controls}>
        <button
          onClick={handleTogglePlay}
          aria-label={isPlaying ? 'Pause' : 'Play'}
          className={styles.playButton}
        >
          {isPlaying ? '⏸' : '▶️'}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          aria-label="Volume"
        />
      </div>
    </div>
  )
}

export default Waveform
