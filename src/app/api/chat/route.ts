import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Fonction utilitaire pour le logging
const logToConsole = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[CHAT-API ${timestamp}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
};

// Vérification de la présence de la clé API
if (!process.env.OPENAI_API_KEY) {
  logToConsole('ERREUR: La clé API OpenAI n\'est pas définie dans les variables d\'environnement');
} else {
  logToConsole('Clé API OpenAI correctement configurée');
}

// Initialisation du client OpenAI
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Version ultra-minimaliste de l'API pour tester le déploiement
export async function POST(req: NextRequest) {
  console.log('Requête API chat reçue - version statique minimaliste');
  
  try {
    // Réponse statique pour tester le déploiement
    const responseMessage = {
      role: "assistant",
      content: "Bonjour! Je suis l'assistant statique de l'annuaire des entreprises de Sudbury. Cette réponse est codée en dur pour tester le déploiement. Comment puis-je vous aider aujourd'hui?"
    };
    
    // Retourner toujours la même réponse statique pour tester
    return NextResponse.json({ message: responseMessage });
  } catch (error) {
    console.error('Erreur dans l\'API statique:', error);
    
    // Même en cas d'erreur, retourner une réponse statique
    return NextResponse.json({ 
      message: {
        role: "assistant",
        content: "Désolé, une erreur s'est produite. Ceci est une réponse de secours statique."
      }
    });
  }
} 