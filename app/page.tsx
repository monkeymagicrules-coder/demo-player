'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

export default function Home() {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [fileName, setFileName] = useState('');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    return () => {
      wavesurferRef.current?.destroy();
      wavesurferRef.current = null;
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !waveformRef.current) return;

    setFileName(file.name);

    if (wavesurferRef.current) {
      wavesurferRef.current.destroy();
      wavesurferRef.current = null;
    }

    const reader = new FileReader();
    reader.onload = () => {
      const arrayBuffer = reader.result;
      if (!arrayBuffer) return;

      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current!,
        waveColor: '#ddd',
        progressColor: '#3B8686',
        height: 80,
        normalize: true,
        cursorColor: '#FF0000',
      });

      wavesurferRef.current.loadBlob(new Blob([arrayBuffer]));

      wavesurferRef.current.on('ready', () => {
        setDuration(wavesurferRef.current!.getDuration());
        setCurrentTime(0);
        setIsPlaying(false);
      });

      wavesurferRef.current.on('audioprocess', () => {
        setCurrentTime(wavesurferRef.current!.getCurrentTime());
      });

      wavesurferRef.current.on('finish', () => {
        setIsPlaying(false);
        setCurrentTime(0);
      });
    };

    reader.readAsArrayBuffer(file);
  };

  const togglePlay = () => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.playPause();
    setIsPlaying(!isPlaying);
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = Math.floor(seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: '0 auto' }}>
      <h1>Demo 音频播放器</h1>

      {/* 文件选择，兼容 iOS */}
      <input
        id="audio-upload"
        type="file"
        accept="audio/mp3,audio/wav,audio/mpeg,audio/*"
        onChange={handleFileChange}
        style={{ display: 'none' }}
      />
      <label
        htmlFor="audio-upload"
        style={{
          display: 'block',
          padding: 10,
          border: '1px solid #ccc',
          borderRadius: 4,
          textAlign: 'center',
          cursor: 'pointer',
          userSelect: 'none',
          marginBottom: 20,
        }}
      >
        {fileName || '点击选择音频文件 (MP3/WAV)'}
      </label>

      {/* 波形容器 */}
      <div ref={waveformRef} style={{ width: '100%', marginBottom: 10 }} />

      {/* 播放 / 暂停按钮和时间轴 */}
      {wavesurferRef.current && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <button
            onClick={togglePlay}
            style={{
              padding: '8px 16px',
              cursor: 'pointer',
              borderRadius: 4,
              border: '1px solid #3B8686',
              backgroundColor: '#fff',
              color: '#3B8686',
            }}
          >
            {isPlaying ? '暂停 ⏸' : '播放 ▶️'}
          </button>
          <span>
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      )}
    </div>
  );
}
