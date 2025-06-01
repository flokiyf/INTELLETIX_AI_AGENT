// Fonction Netlify dédiée pour l'API chat
exports.handler = async function(event, context) {
  // Autoriser uniquement les requêtes POST
  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      body: JSON.stringify({ error: 'Méthode non autorisée' }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }

  try {
    console.log('Fonction Netlify chat.js appelée');
    
    // Réponse statique pour tester
    const responseMessage = {
      role: "assistant",
      content: "Bonjour! Je suis l'assistant statique de l'annuaire des entreprises de Sudbury. Cette réponse provient d'une fonction Netlify dédiée pour tester le déploiement. Comment puis-je vous aider aujourd'hui?"
    };
    
    // Retourner la réponse avec les en-têtes CORS appropriés
    return {
      statusCode: 200,
      body: JSON.stringify({ message: responseMessage }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  } catch (error) {
    console.error('Erreur dans la fonction Netlify chat:', error);
    
    // Même en cas d'erreur, retourner une réponse
    return {
      statusCode: 200,
      body: JSON.stringify({ 
        message: {
          role: "assistant",
          content: "Désolé, une erreur s'est produite. Ceci est une réponse de secours de la fonction Netlify."
        }
      }),
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Content-Type'
      }
    };
  }
}; 