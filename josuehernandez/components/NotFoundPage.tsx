'use client';

import Link from 'next/link';
import { useTranslation } from 'react-i18next';
import { Container } from './layout/Container';
import { NotFoundIcon } from './icons/Icons';
import { COMPONENT_ANIMATIONS, COMPONENT_TRANSITIONS } from '@/constants/components';

interface CustomMessage {
  title: string;
  description: string;
  goBack: string;
  goBackPrevious: string;
}

interface NotFoundPageProps {
  lng: string;
  customMessage?: CustomMessage;
}

export function NotFoundPage({ lng, customMessage }: NotFoundPageProps) {
  const { t } = useTranslation();
  const message = customMessage || {
    title: t('notFound.title'),
    description: t('notFound.description'),
    goBack: t('notFound.goBack'),
    goBackPrevious: t('notFound.goBackPrevious')
  };

  return (
    <div className="relative min-h-screen bg-orange-100 dark:bg-blue-900">
      <Container className="flex h-full items-center pt-16 sm:pt-32">
        <div className="flex flex-col items-center text-center">
          <div className="animate-fade-in">
            <NotFoundIcon className="h-24 w-24 text-zinc-400 dark:text-zinc-500" />
          </div>
          <p className="mt-4 text-base font-semibold text-zinc-400 dark:text-zinc-500">
            404
          </p>
          <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
            {message.title}
          </h1>
          <p className="mt-4 max-w-xl text-base text-zinc-600 dark:text-zinc-400">
            {message.description}
          </p>
          <div className="mt-8 flex flex-col gap-4 sm:flex-row">
            <Link
              href={`/${lng}`}
              className="inline-flex items-center justify-center rounded-md bg-zinc-800 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700 dark:bg-zinc-100 dark:text-zinc-800 dark:hover:bg-zinc-200"
            >
              {message.goBack}
            </Link>
            <button
              onClick={() => window.history.back()}
              className="inline-flex items-center justify-center rounded-md border border-zinc-300 bg-white px-4 py-2 text-sm font-medium text-zinc-700 transition-colors hover:bg-zinc-50 dark:border-zinc-700 dark:bg-zinc-800 dark:text-zinc-100 dark:hover:bg-zinc-700"
            >
              {message.goBackPrevious}
            </button>
          </div>
        </div>
      </Container>
    </div>
  );
} 