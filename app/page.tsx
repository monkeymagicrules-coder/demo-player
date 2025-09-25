"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export default function DemoPlayer() {
  const waveformRef = useRef<HTMLDivElement>(null);
  const wavesurferRef = useRef<WaveSurfer | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [currentFile, setCurrentFile] = useState<File | null>(null);

  // 初始化 WaveSurfer
  useEffect(() => {
    if (!waveformRef.current) return;

    wavesurferRef.current = WaveSurfer.create({
      container: waveformRef.current,
      waveColor: "#A8DBA8",
      progressColor: "#3B8686",
      height: 80,
    });

    return () => {
      wavesurferRef.current?.destroy();
    };
  }, []);

  // 文件选择后加载音频
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    setCurrentFile(file);

    const reader = new FileReader();
    reader.onload = function (event) {
      const result = event.target?.result;
      if (typeof result === "string" || result instanceof ArrayBuffer) {
        wavesurferRef.current?.loadBlob(file);
      }
    };
    reader.readAsArrayBuffer(file);
  };

  const triggerFileSelect = () => {
    fileInputRef.current?.click();
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>Demo 音乐播放器</h2>

      {/* 按钮触发文件选择 */}
      <button
        onClick={triggerFileSelect}
        style={{
          padding: "10px 20px",
          backgroundColor: "#3B8686",
          color: "#fff",
          border: "none",
          borderRadius: 6,
          cursor: "pointer",
          marginBottom: 20,
        }}
      >
        选择音频文件
      </button>

      {/* 隐藏 input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="audio/*" // ✅ iOS 兼容
        onChange={handleFileChange}
        style={{ display: "none" }}
      />

      {/* WaveSurfer 容器 */}
      <div ref={waveformRef} style={{ width: "100%", marginTop: 20 }} />

      {currentFile && (
        <div style={{ marginTop: 10 }}>
          <strong>当前文件:</strong> {currentFile.name}
        </div>
      )}

      {/* 播放 / 暂停 控制 */}
      <div style={{ marginTop: 20 }}>
        <button
          onClick={() => wavesurferRef.current?.playPause()}
          style={{
            padding: "8px 16px",
            backgroundColor: "#FF6B6B",
            color: "#fff",
            border: "none",
            borderRadius: 4,
            cursor: "pointer",
          }}
        >
          播放 / 暂停
        </button>
      </div>
    </div>
  );
}
