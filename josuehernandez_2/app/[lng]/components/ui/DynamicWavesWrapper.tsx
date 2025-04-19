'use client';

import dynamic from 'next/dynamic';

const WavesWrapper = dynamic(() => import('./WavesWrapper'), {
  ssr: false,
  loading: () => (
    <div className="fixed inset-0 bg-gradient-to-b from-white to-gray-100 dark:from-zinc-900 dark:to-zinc-800" />
  ),
});

export default function DynamicWavesWrapper() {
  return <WavesWrapper />;
} 