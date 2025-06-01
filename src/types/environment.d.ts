declare global {
  namespace NodeJS {
    interface ProcessEnv {
      // Variables d'environnement requises
      OPENAI_API_KEY: string;
      
      // Variables d'environnement optionnelles
      NODE_ENV: 'development' | 'production' | 'test';
      NEXT_PUBLIC_API_URL?: string;
      NEXT_PUBLIC_SITE_URL?: string;
      NEXT_PUBLIC_DEPLOYMENT_ENV?: 'development' | 'staging' | 'production';
      
      // Variables Netlify
      NETLIFY?: string;
      NETLIFY_SITE_ID?: string;
      CONTEXT?: 'production' | 'deploy-preview' | 'branch-deploy';
    }
  }
}

// Convertir ce fichier en module ES
export {}; 