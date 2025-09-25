"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export default function Page() {
  const [file, setFile] = useState<File | null>(null);
  const waveformRef = useRef<WaveSurfer | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (!selectedFile) return;
    setFile(selectedFile);

    if (waveformRef.current) {
      waveformRef.current.destroy();
      waveformRef.current = null;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const arrayBuffer = event.target?.result;
      if (!arrayBuffer || !containerRef.current) return;

      waveformRef.current = WaveSurfer.create({
        container: containerRef.current,
        waveColor: "#ddd",
        progressColor: "#3B8686",
        height: 80,
      });

      waveformRef.current.loadBlob(new Blob([arrayBuffer]));
    };
    reader.readAsArrayBuffer(selectedFile);
  };

  useEffect(() => {
    return () => {
      if (waveformRef.current) {
        waveformRef.current.destroy();
        waveformRef.current = null;
      }
    };
  }, []);

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h1>Demo 音频播放器</h1>

      {/* 隐藏的 input，通过 label 点击触发，兼容 iOS */}
      <input
        id="audio-upload"
        type="file"
        accept="audio/*,audio/mpeg,audio/wav,audio/mp3"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <label
        htmlFor="audio-upload"
        style={{
          display: "block",
          padding: 10,
          border: "1px solid #ccc",
          borderRadius: 4,
          textAlign: "center",
          cursor: "pointer",
          userSelect: "none",
          marginBottom: 20,
        }}
      >
        {file ? file.name : "点击选择音频文件 (MP3/WAV)"}
      </label>

      {/* 播放器容器 */}
      <div ref={containerRef} style={{ width: "100%" }} />

      {/* 播放/暂停按钮 */}
      {file && waveformRef.current && (
        <button
          style={{
            marginTop: 10,
            padding: "8px 16px",
            cursor: "pointer",
            borderRadius: 4,
            border: "1px solid #3B8686",
            backgroundColor: "#fff",
            color: "#3B8686",
          }}
          onClick={() => waveformRef.current?.isPlaying() ? waveformRef.current.pause() : waveformRef.current.play()}
        >
          {waveformRef.current.isPlaying() ? "暂停" : "播放"}
        </button>
      )}
    </div>
  );
}
