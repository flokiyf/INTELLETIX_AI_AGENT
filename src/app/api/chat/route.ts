import { NextRequest, NextResponse } from 'next/server';
import { Configuration, OpenAIApi } from 'openai';

// Ensure the API key is properly loaded from environment variables
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY is not defined in environment variables');
}

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export async function POST(req: NextRequest) {
  try {
    if (!configuration.apiKey) {
      return NextResponse.json(
        { error: 'OpenAI API key not configured' },
        { status: 500 }
      );
    }

    const { messages } = await req.json();

    if (!messages || !Array.isArray(messages)) {
      return NextResponse.json(
        { error: 'Messages array is required' },
        { status: 400 }
      );
    }

    const completion = await openai.createChatCompletion({
      model: 'gpt-4-turbo',
      messages: [
        {
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

EXEMPLE DE DIALOGUE :
Utilisateur : "Bonjour"
Toi : [Message d'accueil complet présentant tes capacités]

Utilisateur : "Je cherche un restaurant à Sudbury"
Toi : [Liste détaillée des restaurants avec toutes leurs informations pertinentes]

RÉPONSES PARFAITES ET COMPLÈTES :
- Fournis toujours toutes les informations pertinentes concernant les entreprises demandées.
- Veille à ce que tes réponses soient exhaustives et ne nécessitent pas de questions supplémentaires.
- Anticipe les besoins des utilisateurs en fournissant des informations complémentaires utiles.
- Organise tes réponses de manière logique et intuitive.
- N'hésite pas à suggérer des alternatives ou des options supplémentaires pertinentes.

Réponds toujours de façon utile, courtoise et professionnelle, en mettant l'accent sur la précision et l'exhaustivité des informations fournies.

IMPORTANT: Tu n'as pas besoin de t'excuser de ne pas avoir accès en temps réel à Internet, car tu as déjà une base de données complète des entreprises de Sudbury.`
        },
        ...messages
      ],
      max_tokens: 800,
      temperature: 0.7,
    });

    const assistantMessage = completion.data.choices[0]?.message;

    if (!assistantMessage) {
      return NextResponse.json(
        { error: 'Aucune réponse générée' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: assistantMessage });
  } catch (error: any) {
    console.error('Erreur API OpenAI:', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de la génération de la réponse' },
      { status: 500 }
    );
  }
}