/** @type {import('next').NextConfig} */
const nextConfig = {
  // Configuración para manejar páginas de error personalizadas
  // y asegurarnos de que la internacionalización funcione correctamente
  experimental: {
    // Habilitar el manejo de errores avanzado
    serverActions: {
      bodySizeLimit: '10mb',
    },
  },
  // Optimizaciones de rendimiento
  images: {
    domains: [], // Añade los dominios de imágenes que uses
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60,
  },
  // Optimizaciones de compilación
  swcMinify: true,
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production',
  },
  // Optimizaciones de caché
  generateEtags: true,
  compress: true,
  poweredByHeader: false,
}

module.exports = nextConfig
