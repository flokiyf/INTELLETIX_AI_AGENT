const { Configuration, OpenAIApi } = require("openai");

// Configuration de l'API OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.handler = async function (event, context) {
  // Ajouter des en-têtes CORS pour permettre les requêtes cross-origin
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Content-Type": "application/json",
  };

  // Pour les requêtes OPTIONS (pré-vol CORS)
  if (event.httpMethod === "OPTIONS") {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ message: "CORS préflight réussi" }),
    };
  }

  // Journaliser pour le débogage
  console.log("Fonction OpenAI Proxy appelée");
  console.log("Méthode HTTP:", event.httpMethod);
  console.log("Clé API définie:", !!process.env.OPENAI_API_KEY);
  console.log("Chemin:", event.path);
  console.log("En-têtes:", JSON.stringify(event.headers));

  // Autoriser uniquement les requêtes POST
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: "Méthode non autorisée" }),
    };
  }

  try {
    // Parser le corps de la requête
    let body;
    try {
      body = JSON.parse(event.body);
      console.log("Corps de la requête parsé avec succès");
    } catch (parseError) {
      console.error("Erreur de parsing JSON:", parseError);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Format JSON invalide" }),
      };
    }

    const { messages } = body;
    console.log("Nombre de messages reçus:", messages?.length || 0);

    // Valider les messages
    if (!messages || !Array.isArray(messages)) {
      console.error("Messages invalides:", messages);
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ error: "Messages array is required" }),
      };
    }

    // Nettoyer les messages pour s'assurer qu'ils ont le bon format
    const cleanedMessages = messages.map(msg => ({
      role: msg.role || "user",
      content: msg.content || "",
    }));

    // Système de prompt pour le chatbot
    const systemMessage = {
      role: "system",
      content: `Tu es un agent d'annuaire d'entreprises pour la ville de Sudbury, appelé "Sudbury Business Directory". 
Tu aides les utilisateurs à trouver des entreprises et services locaux à Sudbury en fonction de leurs besoins.

INSTRUCTIONS IMPORTANTES :
- Tu as accès à une base de données d'entreprises locales à Sudbury avec leurs coordonnées, services et informations clés.
- Ton rôle est d'aider les utilisateurs à trouver les entreprises qui correspondent à leurs besoins spécifiques.
- Tu peux suggérer des entreprises par catégorie (restaurants, automobile, services, etc.).
- Tu dois fournir des informations précises et complètes sur les entreprises (adresse, téléphone, horaires, services, etc.).
- Réponds en français, sauf si l'utilisateur s'adresse à toi en anglais.
- Adapte ta réponse en fonction de la requête spécifique de l'utilisateur.
- Utilise le HTML pour structurer tes réponses de manière claire et attractive.
- Assure-toi que tes réponses sont toujours complètes, détaillées et parfaitement adaptées à la demande.

PRÉSENTATION DES RÉSULTATS :
- Utilise des sections clairement délimitées avec <h2>, <h3>, etc.
- Utilise des listes <ul> ou <ol> pour présenter les résultats de façon organisée.
- Mets en valeur les informations importantes avec <strong> ou <em>.
- Utilise du HTML structuré pour présenter les informations de contact.
- Structure tes réponses pour qu'elles soient faciles à lire et à comprendre.

RÉPONSES PARFAITES ET COMPLÈTES :
- Fournis toujours toutes les informations pertinentes concernant les entreprises demandées.
- Veille à ce que tes réponses soient exhaustives et ne nécessitent pas de questions supplémentaires.
- Anticipe les besoins des utilisateurs en fournissant des informations complémentaires utiles.
- Organise tes réponses de manière logique et intuitive.
- N'hésite pas à suggérer des alternatives ou des options supplémentaires pertinentes.

Réponds toujours de façon utile, courtoise et professionnelle, en mettant l'accent sur la précision et l'exhaustivité des informations fournies.

IMPORTANT: Tu n'as pas besoin de t'excuser de ne pas avoir accès en temps réel à Internet, car tu as déjà une base de données complète des entreprises de Sudbury.`,
    };

    // Compléter les messages avec le message système
    const allMessages = [systemMessage, ...cleanedMessages];

    try {
      console.log("Appel à l'API OpenAI avec", allMessages.length, "messages");
      
      // Appeler l'API OpenAI avec une gestion des timeouts
      const timeoutPromise = new Promise((_, reject) => {
        setTimeout(() => reject(new Error("Timeout de l'API OpenAI")), 25000);
      });
      
      const openaiPromise = openai.createChatCompletion({
        model: "gpt-3.5-turbo",
        messages: allMessages,
        max_tokens: 800,
        temperature: 0.7,
      });
      
      const response = await Promise.race([openaiPromise, timeoutPromise]);

      console.log("Réponse OpenAI reçue");
      const assistantMessage = response.data.choices[0]?.message;

      if (!assistantMessage) {
        console.log("Erreur: pas de message dans la réponse");
        return {
          statusCode: 500,
          headers,
          body: JSON.stringify({ error: "Aucune réponse générée" }),
        };
      }

      console.log("Envoi de la réponse au client");
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: assistantMessage }),
      };
    } catch (openaiError) {
      console.error("Erreur API OpenAI spécifique:", openaiError);
      let errorDetails = "Détails non disponibles";
      
      if (openaiError.response) {
        errorDetails = `Statut: ${openaiError.response.status}, Données: ${JSON.stringify(openaiError.response.data)}`;
      } else if (openaiError.message) {
        errorDetails = openaiError.message;
      }
      
      console.error("Détails de l'erreur OpenAI:", errorDetails);
      
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({
          error: `Erreur lors de l'appel à OpenAI: ${errorDetails}`,
        }),
      };
    }
  } catch (error) {
    console.error("Erreur générale de traitement:", error);
    let errorMessage = "Erreur inconnue";
    if (error instanceof Error) {
      errorMessage = error.message;
      console.error("Stack trace:", error.stack);
    }
    
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        error: `Erreur lors de la génération de la réponse: ${errorMessage}`,
      }),
    };
  }
}; 