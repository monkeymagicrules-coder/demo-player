"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export default function AudioPlayer() {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const [file, setFile] = useState<File | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#a0a0a0",
      progressColor: "#3B8686",
      height: 80,
      responsive: true, // WaveSurfer v6+ 有可能需要其他方式实现响应式
    });

    return () => wavesurferRef.current?.destroy();
  }, []);

  useEffect(() => {
    if (file && wavesurferRef.current) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const arrayBuffer = e.target?.result;
        if (arrayBuffer) {
          wavesurferRef.current!.loadBlob(new Blob([arrayBuffer]));
        }
      };
      reader.readAsArrayBuffer(file);
    }
  }, [file]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = e.target.files?.[0];
    if (selected) {
      setFile(selected);
    }
  };

  const togglePlay = () => {
    if (!wavesurferRef.current) return;
    wavesurferRef.current.playPause();
    setIsPlaying(!isPlaying);
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Audio Player Demo</h2>

      <div
        style={{
          position: "relative",
          width: "100%",
          height: 50,
          border: "1px solid #ccc",
          borderRadius: 4,
          marginBottom: 10,
        }}
      >
        <input
          type="file"
          accept="audio/*,.mp3,.wav"
          onChange={handleFileChange}
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            opacity: 0,
            cursor: "pointer",
          }}
        />
        <span
          style={{
            position: "absolute",
            top: 12,
            left: 10,
            pointerEvents: "none",
            color: "#666",
          }}
        >
          {file ? file.name : "点击选择音频文件 (MP3/WAV)"}
        </span>
      </div>

      <div ref={waveformRef}></div>

      <button
        onClick={togglePlay}
        style={{
          marginTop: 10,
          padding: "6px 12px",
          borderRadius: 4,
          border: "none",
          background: "#3B8686",
          color: "#fff",
          cursor: "pointer",
        }}
      >
        {isPlaying ? "暂停" : "播放"}
      </button>
    </div>
  );
}
