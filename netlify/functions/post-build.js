// Script exécuté après chaque build pour vérifier les problèmes courants
const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  console.log('🔍 Vérification post-déploiement en cours...');
  
  const siteUrl = process.env.URL || 'http://localhost:8888';
  const results = {
    timestamp: new Date().toISOString(),
    checks: {
      homepage: { status: 'pending' },
      api: { status: 'pending' },
      env: { status: 'pending' }
    }
  };

  // Vérification des variables d'environnement
  try {
    if (process.env.OPENAI_API_KEY) {
      results.checks.env.status = 'success';
      results.checks.env.message = 'Variables d\'environnement configurées';
    } else {
      results.checks.env.status = 'warning';
      results.checks.env.message = 'Clé API OpenAI manquante';
    }
  } catch (error) {
    results.checks.env.status = 'error';
    results.checks.env.message = 'Erreur lors de la vérification des variables d\'environnement';
  }

  // Vérification de la page d'accueil
  try {
    const homepageResponse = await fetch(siteUrl);
    if (homepageResponse.ok) {
      results.checks.homepage.status = 'success';
      results.checks.homepage.message = `Page d'accueil accessible (${homepageResponse.status})`;
    } else {
      results.checks.homepage.status = 'error';
      results.checks.homepage.message = `Page d'accueil inaccessible (${homepageResponse.status})`;
    }
  } catch (error) {
    results.checks.homepage.status = 'error';
    results.checks.homepage.message = `Erreur lors de l'accès à la page d'accueil: ${error.message}`;
  }

  // Vérification de l'API
  try {
    const apiResponse = await fetch(`${siteUrl}/api/health`);
    if (apiResponse.ok) {
      const apiData = await apiResponse.json();
      results.checks.api.status = 'success';
      results.checks.api.message = `API accessible (${apiData.status})`;
      results.checks.api.details = apiData;
    } else {
      results.checks.api.status = 'error';
      results.checks.api.message = `API inaccessible (${apiResponse.status})`;
    }
  } catch (error) {
    results.checks.api.status = 'error';
    results.checks.api.message = `Erreur lors de l'accès à l'API: ${error.message}`;
  }

  // Résumé des résultats
  const hasErrors = Object.values(results.checks).some(check => check.status === 'error');
  const hasWarnings = Object.values(results.checks).some(check => check.status === 'warning');
  
  if (hasErrors) {
    results.status = 'error';
    results.message = 'Des erreurs critiques ont été détectées';
    console.log('❌ Vérification post-déploiement: ÉCHEC');
  } else if (hasWarnings) {
    results.status = 'warning';
    results.message = 'Des avertissements ont été détectés';
    console.log('⚠️ Vérification post-déploiement: AVERTISSEMENTS');
  } else {
    results.status = 'success';
    results.message = 'Toutes les vérifications ont réussi';
    console.log('✅ Vérification post-déploiement: SUCCÈS');
  }

  // Afficher les résultats dans la console
  console.log(JSON.stringify(results, null, 2));

  return {
    statusCode: 200,
    body: JSON.stringify(results)
  };
}; 