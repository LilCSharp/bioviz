'use client';
import { useEffect, useRef } from 'react';

export default function ViewerCanvas({ splatId, assetUrl }: { splatId: string; assetUrl: string }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    // TODO: init WebGL/WebGPU viewer and load assetUrl
  }, [splatId, assetUrl]);

  return <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: 'block' }} />;
}
