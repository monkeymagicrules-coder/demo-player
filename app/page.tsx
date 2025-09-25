"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";

export default function Home() {
  const waveformRef = useRef<HTMLDivElement | null>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [fileName, setFileName] = useState<string>("");

  // 初始化 WaveSurfer
  useEffect(() => {
    if (waveformRef.current && !wavesurfer.current) {
      wavesurfer.current = WaveSurfer.create({
        container: waveformRef.current,
        waveColor: "#ddd",
        progressColor: "#ff5500",
        cursorColor: "#333",
        height: 80,
      });
    }

    return () => {
      wavesurfer.current?.destroy();
      wavesurfer.current = null;
    };
  }, []);

  // 处理文件选择
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFileName(file.name);
      wavesurfer.current?.loadBlob(file);
    }
  };

  // 播放 / 暂停
  const handlePlayPause = () => {
    wavesurfer.current?.playPause();
  };

  // 停止播放
  const handleStop = () => {
    wavesurfer.current?.stop();
  };

  return (
    <div style={{ padding: "20px", fontFamily: "sans-serif" }}>
      <h1>本地 Demo 播放器</h1>
      <input type="file" accept="audio/*" onChange={handleFileChange} />
      {fileName && <p>已选择文件：{fileName}</p>}
      <div style={{ marginTop: "10px" }}>
        <button onClick={handlePlayPause} style={{ marginRight: "10px" }}>
          播放 / 暂停
        </button>
        <button onClick={handleStop}>停止</button>
      </div>
      <div
        ref={waveformRef}
        style={{
          marginTop: "20px",
          border: "1px solid #ccc",
          borderRadius: "4px",
        }}
      ></div>
    </div>
  );
}
