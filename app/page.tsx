"use client";

import { useState, useRef, useEffect } from "react";
import dynamic from "next/dynamic";

// 动态加载 WaveSurfer，避免 Next.js SSR 报错
const WaveSurfer = dynamic(() => import("wavesurfer.js"), { ssr: false });

export default function Home() {
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<any>(null);

  // 初始化 WaveSurfer
  useEffect(() => {
    if (waveformRef.current && !wavesurferRef.current) {
      wavesurferRef.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#d9dcff",
        progressColor: "#3B8686",
        height: 80,
        barWidth: 2,
        cursorWidth: 1,
      });
    }
  }, []);

  // 加载音频
  useEffect(() => {
    if (audioFile && wavesurferRef.current) {
      const url = URL.createObjectURL(audioFile);
      wavesurferRef.current.load(url);
    }
  }, [audioFile]);

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setAudioFile(file);
  };

  // iOS 点击按钮触发文件选择
  const fileInputRef = useRef<HTMLInputElement>(null);
  const handleSelectFile = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "auto" }}>
      <h1>兼容 iOS 的播放器</h1>
      <button
        onClick={handleSelectFile}
        style={{
          padding: "10px 20px",
          background: "#3B8686",
          color: "#fff",
          border: "none",
          borderRadius: "5px",
          marginBottom: "20px",
        }}
      >
        选择音频文件
      </button>
      <input
        type="file"
        ref={fileInputRef}
        accept="audio/*"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      <div ref={waveformRef}></div>
      {audioFile && (
        <p>
          当前文件: <strong>{audioFile.name}</strong>
        </p>
      )}
    </div>
  );
}
