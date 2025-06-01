/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true, // Ignorer les erreurs TypeScript lors du build
  },
  eslint: {
    ignoreDuringBuilds: true, // Ignorer ESLint lors du build
  },
  // Utilisation optimisée des ressources statiques
  images: {
    domains: ['your-domain.com'], // Ajoutez les domaines si nécessaire
    // Configurez les tailles d'image pour l'optimisation
    deviceSizes: [640, 750, 828, 1080, 1200, 1920, 2048, 3840],
  },
  // Autres configurations utiles pour la production
  productionBrowserSourceMaps: false, // Désactiver les source maps en prod pour des performances améliorées
  poweredByHeader: false, // Supprimer l'en-tête X-Powered-By pour la sécurité
};

module.exports = nextConfig; 