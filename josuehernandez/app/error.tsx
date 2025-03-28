'use client'

import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from '@/components/layout/Container';
import { ReloadIcon } from '@/components/icons/Icons';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function Error({ error, reset }: ErrorProps) {
  const { t } = useTranslation();

  useEffect(() => {
    // Log the error to an error reporting service
    console.error('Error:', error);
  }, [error]);

  return (
    <div className="relative min-h-screen bg-orange-100 dark:bg-amber-900">
      <Container className="flex h-full items-center pt-16 sm:pt-32">
        <div className="flex flex-col items-center text-center">
          <div className="animate-fade-in">
            <ReloadIcon className="h-24 w-24 text-zinc-400 dark:text-zinc-500" />
          </div>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            {t('error.title')}
          </h1>
          <p className="mt-4 max-w-xl text-base text-zinc-600 dark:text-zinc-400">
            {t('error.description')}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <button
              onClick={reset}
              className="inline-flex items-center justify-center rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-800 dark:hover:bg-zinc-200"
            >
              {t('error.tryAgain')}
            </button>
            <button
              onClick={() => window.location.href = '/'}
              className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              {t('error.goHome')}
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
} 