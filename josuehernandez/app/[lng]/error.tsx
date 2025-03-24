'use client'

// import { useEffect } from 'react'
// import { Container } from '@/components/Container'
// import Link from 'next/link'
// import { useTranslation } from '../i18n/client'

// interface ErrorProps {
//   error: Error & { digest?: string }
//   reset: () => void
//   params: { lng: string }
// }

// export default function LngError({ error, reset, params: { lng } }: ErrorProps) {
//   const { t } = useTranslation(lng)
  
//   useEffect(() => {
//     // Log the error to an error reporting service
//     console.error(error)
//   }, [error])

//   return (
//     <div className="bg-orange-100 dark:bg-amber-800 min-h-screen flex items-center">
//       <Container className="flex h-full items-center pt-16 sm:pt-32">
//         <div className="flex flex-col items-center">
//           <p className="text-base font-semibold text-zinc-400 dark:text-zinc-500">
//             Error
//           </p>
//           <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
//             {t('error.title', 'Algo salió mal')}
//           </h1>
//           <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
//             {t('error.description', 'Ha ocurrido un error inesperado.')}
//           </p>
//           <button
//             className="mt-6 rounded-md bg-zinc-900 px-4 py-2 text-sm text-white transition hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600"
//             onClick={() => reset()}
//           >
//             {t('error.retry', 'Intentar de nuevo')}
//           </button>
//         </div>
//       </Container>
//     </div>
//   )
// } 