'use client'

// import { useEffect, useState } from 'react'
// import { Container } from '@/components/Container'
// import Link from 'next/link'
// import Header from '../components/Header'
// import Footer from '../components/Footer'
// import ClientThemeProvider from './[lng]/theme_provider'
// import { fallbackLng, cookieName, languages } from './i18n/settings'

// // Función para obtener el valor de una cookie por su nombre
// function getCookie(name: string): string | undefined {
//   if (typeof document === 'undefined') return undefined;
  
//   const cookies = document.cookie.split(';');
//   for (let i = 0; i < cookies.length; i++) {
//     const cookie = cookies[i].trim();
//     // ¿La cookie tiene el nombre que estamos buscando?
//     if (cookie.substring(0, name.length + 1) === (name + '=')) {
//       return decodeURIComponent(cookie.substring(name.length + 1));
//     }
//   }
//   return undefined;
// }

// export default function Error({
//   error,
//   reset,
// }: {
//   error: Error & { digest?: string }
//   reset: () => void
// }) {
//   // En el cliente, tenemos que obtener el idioma de otra manera
//   const [lng, setLng] = useState(fallbackLng);
  
//   useEffect(() => {
//     // Log the error to an error reporting service
//     console.error(error);
    
//     // Obtener el idioma del cliente
//     const cookieLang = getCookie(cookieName);
//     if (cookieLang && languages.includes(cookieLang)) {
//       setLng(cookieLang);
//     }
//   }, [error]);

//   return (
//     <ClientThemeProvider>
//       <div className="relative">
//         <Header lng={lng} />
//         <div className="bg-orange-100 dark:bg-amber-800 min-h-screen flex items-center">
//           <Container className="flex h-full items-center pt-16 sm:pt-32">
//             <div className="flex flex-col items-center">
//               <p className="text-base font-semibold text-zinc-400 dark:text-zinc-500">
//                 Error
//               </p>
//               <h1 className="mt-4 text-4xl font-bold tracking-tight text-zinc-800 sm:text-5xl dark:text-zinc-100">
//                 Algo salió mal
//               </h1>
//               <p className="mt-4 text-base text-zinc-600 dark:text-zinc-400">
//                 Ha ocurrido un error inesperado.
//               </p>
//               <button
//                 className="mt-6 rounded-md bg-zinc-900 px-4 py-2 text-sm text-white transition hover:bg-zinc-700 dark:bg-zinc-700 dark:hover:bg-zinc-600"
//                 onClick={() => reset()}
//               >
//                 Intentar de nuevo
//               </button>
//             </div>
//           </Container>
//         </div>
//         <Footer lng={lng} />
//       </div>
//     </ClientThemeProvider>
//   )
// } 