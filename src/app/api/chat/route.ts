import { Configuration, OpenAIApi } from 'openai';
import { NextRequest, NextResponse } from 'next/server';

// Configurer l'API OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
  // Ajouter des en-têtes CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  try {
    // Extraire les messages de la requête
    const { messages } = await req.json();
    
    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400, headers }
      );
    }

    // Nettoyer les messages
    const cleanedMessages = messages.map(msg => ({
      role: msg.role || 'user',
      content: msg.content || '',
    }));

    // Ajouter le message système
    const systemMessage = {
      role: 'system',
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

    const allMessages = [systemMessage, ...cleanedMessages];

    // Log pour le débogage
    console.log('Appel à l\'API OpenAI avec', allMessages.length, 'messages');

    // Appeler l'API OpenAI avec une gestion des timeouts
    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error('Timeout de l\'API OpenAI')), 25000)
    );

    // @ts-ignore - Types TS pas tout à fait à jour
    const openaiPromise = openai.createChatCompletion({
      model: 'gpt-3.5-turbo',
      messages: allMessages,
      max_tokens: 800,
      temperature: 0.7,
    });

    const response = await Promise.race([openaiPromise, timeoutPromise]);

    // @ts-ignore - On sait que la réponse a le format attendu
    const assistantMessage = response.data.choices[0]?.message;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'No response generated' },
        { status: 500, headers }
      );
    }

    return NextResponse.json({ message: assistantMessage }, { headers });
  } catch (error) {
    console.error('Error in chat API:', error);
    let errorMessage = 'Internal server error';
    
    if (error instanceof Error) {
      errorMessage = error.message;
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: 500, headers }
    );
  }
}

// Gérer les requêtes OPTIONS pour CORS
export async function OPTIONS() {
  return new Response(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
} 