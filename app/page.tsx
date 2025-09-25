'use client'; // ⚠️ 记得这一行，确保 React Hooks 可以在客户端使用

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

export default function HomePage() {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [fileName, setFileName] = useState<string>('');

  useEffect(() => {
    if (waveformRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#A8DBA8',
        progressColor: '#3B8686',
        height: 80,
        responsive: true,
      });
    }

    return () => {
      wavesurferRef.current?.destroy();
      wavesurferRef.current = null;
    };
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result;
      if (arrayBuffer && wavesurferRef.current) {
        wavesurferRef.current.loadBlob(new Blob([arrayBuffer]));
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const togglePlay = () => {
    wavesurferRef.current?.playPause();
  };

  return (
    <div style={{ padding: 20, fontFamily: 'sans-serif' }}>
      <h1>本地音频播放器</h1>

      <input
        type="file"
        accept="audio/*"
        onChange={handleFileChange}
        style={{ marginBottom: 10 }}
      />
      {fileName && <p>当前文件: {fileName}</p>}

      <div ref={waveformRef} style={{ marginBottom: 10 }} />

      <button onClick={togglePlay} style={{ padding: '6px 12px' }}>
        播放 / 暂停
      </button>
    </div>
  );
}
