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

// Version ultra-simplifiée de l'API chat pour réduire les erreurs
export async function POST(req: NextRequest) {
  logToConsole('Nouvelle requête chat reçue');
  
  try {
    // Extraction simple du corps de la requête
    const body = await req.json();
    const messages = body.messages || [];
    
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { error: 'Messages invalides ou manquants' },
        { status: 400 }
      );
    }
    
    logToConsole(`Traitement de ${messages.length} messages`);

    // Version très simplifiée de l'appel à OpenAI pour minimiser les erreurs
    try {
      // Réponse statique de secours au cas où OpenAI échoue
      const fallbackResponse = {
        role: "assistant",
        content: "Bonjour! Je suis l'assistant de l'annuaire des entreprises de Sudbury. Comment puis-je vous aider aujourd'hui?"
      };
      
      // Tentative d'appel à OpenAI avec un timeout court
      const completion = await Promise.race([
        openai.chat.completions.create({
          model: 'gpt-3.5-turbo',
          messages: [
            {
              role: 'system',
              content: 'Tu es un assistant pour l\'annuaire des entreprises de Sudbury.'
            },
            ...messages
          ],
          max_tokens: 256,
          temperature: 0.7,
        }),
        new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout')), 10000)
        )
      ]) as any;
      
      logToConsole('Réponse OpenAI reçue');
      const assistantMessage = completion.choices[0]?.message || fallbackResponse;
      
      return NextResponse.json({ message: assistantMessage });
    } catch (error: any) {
      logToConsole(`Erreur OpenAI: ${error.message}`);
      
      // En cas d'erreur, on renvoie une réponse par défaut pour éviter de casser l'interface
      return NextResponse.json({
        message: {
          role: "assistant",
          content: "Je suis désolé, je rencontre actuellement des difficultés techniques. Veuillez réessayer dans quelques instants."
        }
      });
    }
  } catch (error: any) {
    logToConsole(`Erreur générale: ${error.message}`);
    
    return NextResponse.json(
      { error: 'Une erreur est survenue lors du traitement de votre demande.' },
      { status: 500 }
    );
  }
} 