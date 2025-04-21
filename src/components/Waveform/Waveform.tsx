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
  const [duration, setDuration] = useState(0)
  const [currentTime, setCurrentTime] = useState(0)
  const [isRepeat, setIsRepeat] = useState(false)
  const isRepeatRef = useRef(isRepeat)

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
    const s = Math.floor(seconds % 60)
    return `${m}:${s < 10 ? '0' + s : s}`
  }

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
      setDuration(waveRef.current?.getDuration() || 0)
      waveRef.current?.setVolume(volume)
    })

    waveRef.current.on('audioprocess', () => {
      if (waveRef.current?.isPlaying()) {
        setCurrentTime(waveRef.current.getCurrentTime())
      }
    })

    waveRef.current.on('interaction', () => {
      setCurrentTime(waveRef.current?.getCurrentTime() || 0)
    })

    waveRef.current.on('finish', () => {
        if (isRepeatRef.current) {
          waveRef.current?.play()
        } else {
          waveRef.current?.seekTo(0)
          onPlay(trackId, true)
        }
      })

    return () => {
      waveRef.current?.destroy()
    }
  }, [audioUrl])

  // Play / Pause control
  useEffect(() => {
    if (!waveRef.current) return
    if (isPlaying) {
      waveRef.current?.play()
    } else {
      waveRef.current?.pause()
    }
  }, [isPlaying])

  // Volume control
  useEffect(() => {
    waveRef.current?.setVolume(volume)
  }, [volume])

  // Автопауза при згортанні
  useEffect(() => {
    const handleVisibility = () => {
      if (document.hidden) {
        onPlay(trackId, true)
      }
    }
    document.addEventListener('visibilitychange', handleVisibility)
    return () => document.removeEventListener('visibilitychange', handleVisibility)
  }, [trackId, onPlay])

  // Контроль повтору
  useEffect(() => {
    isRepeatRef.current = isRepeat
  }, [isRepeat])

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVolume = parseFloat(e.target.value)
    setVolume(newVolume)
  }

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value)
    const percent = newTime / duration
    waveRef.current?.seekTo(percent)
    setCurrentTime(newTime)
  }

  const handleTogglePlay = () => {
    if (isPlaying) {
        onPlay(trackId, true)
      } else {
        onPlay(trackId)
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

        <span>{formatTime(currentTime)}</span>

        <input
          type="range"
          min={0}
          max={duration}
          step={0.01}
          value={currentTime}
          onChange={handleSeek}
          className={styles.seekBar}
        />

        <span>{formatTime(duration)}</span>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={handleVolumeChange}
          aria-label="Volume"
        />

        <button
          onClick={() => setIsRepeat(prev => !prev)}
          className={styles.repeatButton}
          aria-label="Repeat"
        >
          🔁 {isRepeat ? 'on' : 'off'}
        </button>
      </div>
    </div>
  )
}

export default Waveform
