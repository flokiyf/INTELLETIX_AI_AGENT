// Health check function pour le monitoring de l'application
exports.handler = async function(event, context) {
  // Vérifier la disponibilité des variables d'environnement essentielles
  const hasOpenAIKey = !!process.env.OPENAI_API_KEY;

  // Détails à retourner dans la réponse
  const healthDetails = {
    status: "healthy",
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
    version: process.env.npm_package_version || '0.1.0',
    services: {
      openai: hasOpenAIKey ? "configured" : "missing"
    }
  };

  // Si une clé API essentielle est manquante, changer le statut
  if (!hasOpenAIKey) {
    healthDetails.status = "degraded";
  }

  // Options pour CORS
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify(healthDetails)
  };
}; 