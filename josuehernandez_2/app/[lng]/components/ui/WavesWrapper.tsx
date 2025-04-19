"use client";

import Waves from "./Waves";

export default function WavesWrapper() {
  return (
    <Waves
      lineColor="currentColor"
      backgroundColor="transparent"
      waveSpeedX={0.015}
      waveSpeedY={0.01}
      waveAmpX={30}
      waveAmpY={15}
      friction={0.92}
      tension={0.008}
      maxCursorMove={100}
      xGap={24}
      yGap={48}
      className="text-black/[0.03] dark:text-orante-500"
    />
  );
} 