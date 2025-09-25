'use client';

import React, { useRef, useState, useEffect } from 'react';
import WaveSurfer from 'wavesurfer.js';

export default function Home() {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (waveformRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        progressColor: '#3B8686',
        height: 80,
        normalize: true,
        cursorColor: '#FF0000',
      });

      wavesurferRef.current.on('ready', () => {
        setDuration(wavesurferRef.current!.getDuration());
      });

      wavesurferRef.current.on('audioprocess', () => {
        setCurrentTime(wavesurferRef.current!.getCurrentTime());
      });

      wavesurferRef.current.on('finish', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    }

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        wavesurferRef.current?.loadBlob(file);
        setIsPlaying(false);
        setCurrentTime(0);
      };
      reader.readAsArrayBuffer(file);
    }
  };

  const togglePlay = () => {
    wavesurferRef.current?.playPause();
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60)
      .toString()
      .padStart(2, '0');
    const s = Math.floor(seconds % 60)
      .toString()
      .padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h1>Demo 音乐播放器</h1>

      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        style={{ marginBottom: 10 }}
      />

      <div
        ref={waveformRef}
        style={{
          width: '100%',
          marginBottom: 10,
          border: '1px solid #ccc',
          borderRadius: 4,
        }}
      />

      <button onClick={togglePlay} style={{ marginRight: 10 }}>
        {isPlaying ? '暂停' : '播放'}
      </button>

      <span>
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
}
