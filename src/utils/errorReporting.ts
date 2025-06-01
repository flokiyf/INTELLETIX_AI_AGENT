/**
 * Utilitaire de rapport d'erreurs
 * 
 * Ce module fournit des fonctions pour capturer et journaliser les erreurs
 * En production, ces erreurs pourraient être envoyées à un service comme Sentry ou LogRocket
 */

// Fonction pour capturer les erreurs non gérées
export function setupErrorHandling() {
  if (typeof window !== 'undefined') {
    // Gestionnaire d'erreurs non gérées
    window.addEventListener('error', (event) => {
      captureError(event.error || new Error(event.message), {
        type: 'unhandled',
        location: event.filename,
        line: event.lineno,
        column: event.colno
      });
      
      // Ne pas empêcher le comportement par défaut
      return false;
    });

    // Gestionnaire de rejets de promesses non gérés
    window.addEventListener('unhandledrejection', (event) => {
      captureError(event.reason || new Error('Rejet de promesse non géré'), {
        type: 'unhandledrejection'
      });
    });
  }
}

// Interface pour les métadonnées d'erreur
interface ErrorMetadata {
  type: string;
  location?: string;
  line?: number;
  column?: number;
  context?: Record<string, any>;
  [key: string]: any;
}

// Fonction principale pour capturer les erreurs
export function captureError(error: Error, metadata: ErrorMetadata = { type: 'manual' }) {
  // Journaliser l'erreur dans la console
  console.error('[ERROR]', error, metadata);

  // En production, envoyer à un service de monitoring
  if (process.env.NODE_ENV === 'production') {
    // Ici, vous intégreriez un service comme Sentry
    // Exemple: Sentry.captureException(error, { extra: metadata });
    
    // Pour l'instant, nous simulons un envoi à un service
    try {
      sendErrorToMonitoring(error, metadata);
    } catch (e) {
      // Éviter les erreurs en cascade
      console.error('Échec de l\'envoi de l\'erreur au service de monitoring', e);
    }
  }
}

// Fonction d'envoi au service de monitoring (simulation)
function sendErrorToMonitoring(error: Error, metadata: ErrorMetadata) {
  // En production, remplacer par un appel réel à un service de monitoring
  if (process.env.NODE_ENV === 'production') {
    // Exemple d'implémentation future:
    // 
    // - Avec Sentry:
    // import * as Sentry from '@sentry/nextjs';
    // Sentry.captureException(error, { extra: metadata });
    //
    // - Avec une API personnalisée:
    // fetch('/api/log-error', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({
    //     message: error.message,
    //     stack: error.stack,
    //     metadata
    //   })
    // });
  }
}

// Fonction pour capturer des événements utilisateur importants (analytics)
export function logUserEvent(eventName: string, data: Record<string, any> = {}) {
  // Journaliser l'événement
  console.log(`[EVENT] ${eventName}`, data);

  // En production, envoyer à un service d'analytics
  if (process.env.NODE_ENV === 'production') {
    // Intégration future avec un service d'analytics
    // Exemple: analytics.track(eventName, data);
  }
}

// Exportation d'une fonction qui retourne un objet d'erreur formaté
export function createErrorObject(code: string, message: string, details?: any) {
  return {
    error: true,
    code,
    message,
    details,
    timestamp: new Date().toISOString()
  };
} 