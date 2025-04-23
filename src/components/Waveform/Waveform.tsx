import React, { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

import { PlayIcon, PauseIcon, RepeatIcon } from '../Icons/Icons';

import styles from './Waveform.module.css';

interface WaveformProps {
  audioUrl: string;
  isPlaying: boolean;
  onPlay: (id: string, forcePause?: boolean) => void;
  trackId: string;
}

const Waveform: React.FC<WaveformProps> = ({ audioUrl, isPlaying, onPlay, trackId }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const waveRef = useRef<WaveSurfer | null>(null);

  const [volume, setVolume] = useState(1);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [isRepeat, setIsRepeat] = useState(false);
  const isRepeatRef = useRef(isRepeat);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${m}:${sec < 10 ? '0' + sec : sec}`;
  };

  useEffect(() => {
    if (!containerRef.current) return;
    waveRef.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: 'rgba(0,255,255,0.4)',
      progressColor: '#0ff',
      barWidth: 2,
      height: 80,
      normalize: true,
      cursorColor: '#0ff',
    });
    waveRef.current.load(audioUrl);

    waveRef.current.on('ready', () => {
      setDuration(waveRef.current!.getDuration());
      waveRef.current!.setVolume(volume);
    });
    waveRef.current.on('audioprocess', () => {
      if (waveRef.current!.isPlaying()) {
        setCurrentTime(waveRef.current!.getCurrentTime());
      }
    });
    waveRef.current.on('finish', () => {
      if (isRepeatRef.current) waveRef.current!.play();
      else {
        waveRef.current!.seekTo(0);
        onPlay(trackId, true);
      }
    });

    return () => void waveRef.current!.destroy();
  }, [audioUrl]);

  useEffect(() => {
    waveRef.current?.[isPlaying ? 'play' : 'pause']();
  }, [isPlaying]);

  useEffect(() => {
    waveRef.current?.setVolume(volume);
  }, [volume]);

  useEffect(() => {
    isRepeatRef.current = isRepeat;
  }, [isRepeat]);

  const handlePlay = () => onPlay(trackId, isPlaying ? true : undefined);
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const t = parseFloat(e.target.value);
    waveRef.current!.seekTo(t / duration);
    setCurrentTime(t);
  };
  const handleRepeat = () => setIsRepeat(prev => !prev);
  const handleVolume = (e: React.ChangeEvent<HTMLInputElement>) => setVolume(parseFloat(e.target.value));

  return (
    <div className={styles.wrapper}>
      <div className={styles.waveRow}>
        <div ref={containerRef} className={styles.waveContainer} />
        <div className={styles.volumeContainer}>
          <input
            type="range"
            min="0"
            max="1"
            step="0.01"
            value={volume}
            onChange={handleVolume}
            className={styles.volumeSlider}
            aria-label="Volume"
          />
        </div>
      </div>

      <div className={styles.controlsRow}>
        <div className={styles.playBlock}>
          <button
            onClick={handlePlay}
            disabled={!duration}
            aria-label={isPlaying ? 'Pause' : 'Play'}
            className={styles.playButton}
          >
            {isPlaying ? <PauseIcon className={styles.icon} /> : <PlayIcon className={styles.icon} />}
          </button>
          <span className={styles.time}>{formatTime(currentTime)}</span>
        </div>

        <input
          type="range"
          min={0}
          max={duration}
          step="0.01"
          value={currentTime}
          onChange={handleSeek}
          className={styles.seekBar}
        />

        <div className={styles.repeatBlock}>
          <button
            onClick={handleRepeat}
            aria-label="Repeat"
            className={`${styles.repeatButton} ${isRepeat ? styles.repeatActive : ''}`}
          >
            <RepeatIcon className={styles.icon} />
          </button>
          <span className={styles.time}>{formatTime(duration)}</span>
        </div>
      </div>
    </div>
  );
};

export default Waveform;