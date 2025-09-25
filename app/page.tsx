'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

export default function Home() {
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const waveformRef = useRef<HTMLDivElement | null>(null);
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
        responsive: true,
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
  }, []);

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !wavesurferRef.current) return;
    const objectUrl = URL.createObjectURL(file);
    wavesurferRef.current.load(objectUrl);
    setIsPlaying(false);
    setCurrentTime(0);
  };

  const togglePlay = () => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.playPause();
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
    <div style={{ padding: 20 }}>
      {/* 保留你原来的文件选择逻辑 */}
      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        style={{ marginBottom: 20 }}
      />

      {/* 波形 */}
      <div ref={waveformRef} style={{ marginBottom: 10 }} />

      {/* 播放/暂停按钮 */}
      <button onClick={togglePlay} style={{ marginRight: 10 }}>
        {isPlaying ? '暂停 ⏸' : '播放 ▶️'}
      </button>

      {/* 时间轴 */}
      <span>
        {formatTime(currentTime)} / {formatTime(duration)}
      </span>
    </div>
  );
}
