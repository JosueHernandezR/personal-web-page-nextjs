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
}

module.exports = nextConfig
