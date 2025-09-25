'use client';

import { useEffect, useRef, useState } from 'react';
import WaveSurfer from 'wavesurfer.js';

export default function Home() {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [file, setFile] = useState<File | null>(null);

  useEffect(() => {
    if (waveformRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: '#A8DBA8',
        progressColor: '#3B8686',
        height: 80,
      });

      // 自适应容器宽度
      const resizeHandler = () => {
        if (wavesurferRef.current) {
          wavesurferRef.current.drawer.containerWidth = waveformRef.current!.clientWidth;
          wavesurferRef.current.drawBuffer();
        }
      };
      window.addEventListener('resize', resizeHandler);
      resizeHandler(); // 初始化

      return () => {
        window.removeEventListener('resize', resizeHandler);
        wavesurferRef.current?.destroy();
      };
    }
  }, []);

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    const reader = new FileReader();
    reader.onload = (ev) => {
      if (wavesurferRef.current && ev.target?.result) {
        wavesurferRef.current.loadBlob(new Blob([ev.target.result]));
      }
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '600px', margin: '0 auto' }}>
      <input
        type="file"
        accept=".mp3, .wav"
        onChange={handleFileChange}
        style={{ marginBottom: '10px' }}
      />
      <div
        id="waveform"
        ref={waveformRef}
        style={{ width: '100%', border: '1px solid #ccc' }}
      />
      {file && <p>正在播放: {file.name}</p>}
    </div>
  );
}
