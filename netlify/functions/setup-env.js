// Script pour configurer automatiquement les variables d'environnement
const https = require('https');
const querystring = require('querystring');

exports.handler = async function(event, context) {
  console.log("🔧 Configuration automatique des variables d'environnement...");

  // Si la clé API est déjà configurée, ne rien faire
  if (process.env.OPENAI_API_KEY) {
    console.log("✅ La clé API OpenAI est déjà configurée.");
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "La clé API OpenAI est déjà configurée",
        status: "success"
      })
    };
  }

  // Vérifier si une clé OpenAI existe dans les variables de déploiement
  const netlifyApiKey = process.env.NETLIFY_API_KEY;
  const siteId = process.env.SITE_ID;

  if (!netlifyApiKey || !siteId) {
    console.log("⚠️ Variables Netlify API manquantes. Impossible de configurer automatiquement.");
    return {
      statusCode: 400,
      body: JSON.stringify({
        message: "Variables Netlify API manquantes. Ajoutez NETLIFY_API_KEY et SITE_ID.",
        status: "error"
      })
    };
  }

  try {
    // Informations pour le prompt utilisateur sur la configuration manuelle
    console.log(`
      =============================================================
      CONFIGURATION MANUELLE REQUISE
      =============================================================
      
      Pour configurer manuellement la variable d'environnement OpenAI:
      
      1. Accédez à https://app.netlify.com/sites/${siteId}/settings/env
      2. Ajoutez une nouvelle variable:
         - Clé: OPENAI_API_KEY
         - Valeur: Votre clé API OpenAI
      3. Cochez "Sensitive" pour protéger la clé
      4. Cliquez sur "Save"
      5. Redéployez votre site
      
      =============================================================
    `);

    // Fournir des instructions détaillées pour la configuration manuelle
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Configuration manuelle requise. Veuillez consulter les logs de déploiement pour les instructions.",
        instructions: "Accédez à votre tableau de bord Netlify pour configurer la variable OPENAI_API_KEY.",
        status: "warning",
        netlifySettingsUrl: `https://app.netlify.com/sites/${siteId}/settings/env`
      })
    };
  } catch (error) {
    console.error("❌ Erreur lors de la configuration des variables d'environnement:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Erreur lors de la configuration des variables d'environnement",
        error: error.message,
        status: "error"
      })
    };
  }
}; 