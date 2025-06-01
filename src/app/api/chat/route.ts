import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

// Vérification de la présence de la clé API
if (!process.env.OPENAI_API_KEY) {
  console.error('ERREUR: La clé API OpenAI n\'est pas définie dans les variables d\'environnement');
}

// Initialisation du client OpenAI avec la nouvelle syntaxe
const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Cache simple en mémoire pour les requêtes fréquentes (en production, utiliser Redis ou similaire)
const responseCache = new Map();
const CACHE_TTL = 1000 * 60 * 60; // 1 heure en ms

// Structure pour le rate limiting (à remplacer par Redis en production)
const rateLimitStore = new Map();
const RATE_LIMIT_MAX = 50; // Requêtes maximales par IP
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // Fenêtre de 1 heure en ms

// Fonction de validation des messages
function validateMessages(messages: any[]): boolean {
  if (!Array.isArray(messages)) return false;
  return messages.every(msg => 
    msg && 
    typeof msg === 'object' && 
    (msg.role === 'user' || msg.role === 'assistant') && 
    typeof msg.content === 'string' &&
    msg.content.length < 4000 // Limite raisonnable pour éviter les abus
  );
}

export async function POST(req: NextRequest) {
  try {
    // Récupération de l'IP pour le rate limiting
    const ip = req.headers.get('x-forwarded-for') || 'unknown-ip';
    
    // Vérification du rate limit
    const now = Date.now();
    const userRateLimit = rateLimitStore.get(ip) || { count: 0, resetAt: now + RATE_LIMIT_WINDOW };
    
    // Réinitialisation du compteur si la fenêtre est passée
    if (userRateLimit.resetAt < now) {
      userRateLimit.count = 0;
      userRateLimit.resetAt = now + RATE_LIMIT_WINDOW;
    }
    
    // Vérification si le quota est dépassé
    if (userRateLimit.count >= RATE_LIMIT_MAX) {
      return NextResponse.json(
        { error: 'Quota de requêtes dépassé. Veuillez réessayer plus tard.' },
        { status: 429 }
      );
    }
    
    // Extraction et validation du corps de la requête
    let messages;
    try {
      const body = await req.json();
      messages = body.messages;
    } catch (e) {
      return NextResponse.json(
        { error: 'Format de requête invalide' },
        { status: 400 }
      );
    }

    if (!messages || !validateMessages(messages)) {
      return NextResponse.json(
        { error: 'Format de messages invalide ou manquant' },
        { status: 400 }
      );
    }

    // Génération d'une clé de cache basée sur les messages
    const cacheKey = JSON.stringify(messages);
    
    // Vérification du cache
    const cachedResponse = responseCache.get(cacheKey);
    if (cachedResponse && cachedResponse.expiry > Date.now()) {
      return NextResponse.json({ message: cachedResponse.data });
    }

    // Incrémentation du compteur de rate limit
    userRateLimit.count++;
    rateLimitStore.set(ip, userRateLimit);

    // Définition du timeout pour éviter les requêtes infinies
    const abortController = new AbortController();
    const timeoutId = setTimeout(() => abortController.abort(), 30000); // 30 secondes

    try {
      // Appel à l'API OpenAI avec la nouvelle syntaxe
      const completion = await openai.chat.completions.create({
        model: 'gpt-4',
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
      }, {
        signal: abortController.signal
      });

      // Nettoyage du timeout
      clearTimeout(timeoutId);

      const assistantMessage = completion.choices[0]?.message;

      if (!assistantMessage) {
        return NextResponse.json(
          { error: 'Aucune réponse générée' },
          { status: 500 }
        );
      }

      // Mise en cache de la réponse
      responseCache.set(cacheKey, {
        data: assistantMessage,
        expiry: Date.now() + CACHE_TTL
      });

      return NextResponse.json({ message: assistantMessage });
    } catch (error: any) {
      // Nettoyage du timeout en cas d'erreur
      clearTimeout(timeoutId);
      
      // Propagation de l'erreur pour être traitée dans le bloc catch extérieur
      throw error;
    }
  } catch (error: any) {
    console.error('Erreur API OpenAI:', error);
    
    // Gestion des différentes erreurs possibles
    if (error.name === 'AbortError') {
      return NextResponse.json(
        { error: 'La requête a pris trop de temps. Veuillez réessayer.' },
        { status: 408 }
      );
    } else if (error.status === 429) {
      return NextResponse.json(
        { error: 'Quota OpenAI dépassé. Veuillez réessayer plus tard.' },
        { status: 429 }
      );
    } else if (error.code === 'ECONNRESET' || error.code === 'ETIMEDOUT') {
      return NextResponse.json(
        { error: 'Problème de connexion avec le service OpenAI. Veuillez réessayer.' },
        { status: 503 }
      );
    }
    
    return NextResponse.json(
      { error: 'Erreur lors de la génération de la réponse' },
      { status: 500 }
    );
  }
} 