'use client';

import { useEffect } from 'react';
import { setupErrorHandling } from '@/utils/errorReporting';

/**
 * Composant client qui initialise le monitoring d'erreurs
 * Ce composant n'affiche rien visuellement, mais configure les écouteurs d'erreurs
 */
export default function ErrorMonitoring() {
  useEffect(() => {
    // Configuration du gestionnaire d'erreurs global
    setupErrorHandling();

    // Log de la session utilisateur
    console.log('[SESSION] Application chargée', {
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      language: navigator.language,
    });
  }, []);

  // Ce composant ne rend rien visuellement
  return null;
} 