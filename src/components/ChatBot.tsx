'use client';

import { useState, useRef, useEffect, useId, useCallback } from 'react';
import { Message } from '@/types/chat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { v4 as uuidv4 } from 'uuid';

// Fonction pour générer un ID stable côté client et serveur
const generateStableId = (prefix: string, index: number): string => {
  return `${prefix}-${index}`;
};

// Constantes pour la gestion des erreurs
const MAX_RETRIES = 3;
const RETRY_DELAY = 1500; // 1.5 secondes entre les tentatives

const ChatBot = () => {
  // Utiliser useId pour obtenir un préfixe stable pour ce composant
  const idPrefix = useId().replace(/:/g, '');
  const [messageIdCounter, setMessageIdCounter] = useState(0);
  
  // Générer un nouvel ID stable
  const getNextMessageId = () => {
    const nextId = `msg-${idPrefix}-${messageIdCounter}`;
    setMessageIdCounter(prev => prev + 1);
    return nextId;
  };
  
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome-message', // ID stable pour le message d'accueil
      role: 'assistant',
      content: 'Bonjour ! Je suis l\'agent de l\'annuaire des entreprises de Sudbury. Je peux vous aider à trouver des entreprises locales en fonction de vos besoins. Veuillez utiliser le formulaire ci-dessous pour préciser votre recherche :',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCount, setRetryCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [connectionLost, setConnectionLost] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Vérifier la connectivité lors du chargement initial
  useEffect(() => {
    const checkConnectivity = () => {
      setConnectionLost(!navigator.onLine);
    };

    // Vérifier immédiatement
    checkConnectivity();

    // Ajouter des écouteurs d'événements pour les changements de connectivité
    window.addEventListener('online', () => setConnectionLost(false));
    window.addEventListener('offline', () => setConnectionLost(true));

    return () => {
      window.removeEventListener('online', () => setConnectionLost(false));
      window.removeEventListener('offline', () => setConnectionLost(true));
    };
  }, []);

  const sendMessageWithRetry = useCallback(async (
    messages: any[], 
    userMessageId: string, 
    retryAttempt = 0
  ): Promise<any> => {
    try {
      console.log(`Mode statique activé - génération d'une réponse locale`);
      
      // Obtenir le dernier message utilisateur
      const lastUserMessage = messages.filter(m => m.role === 'user').pop();
      const userContent = lastUserMessage?.content.toLowerCase() || '';
      
      // Créer une réponse statique basée sur le contenu du message
      let responseContent = "Bonjour! Je suis l'assistant statique de l'annuaire des entreprises de Sudbury. Comment puis-je vous aider aujourd'hui?";
      
      // Détecter des mots-clés pour personnaliser la réponse
      if (userContent.includes('restaurant') || userContent.includes('manger') || userContent.includes('cuisine')) {
        responseContent = `
          <h2>Restaurants à Sudbury</h2>
          <p>Voici quelques restaurants populaires à Sudbury :</p>
          <ul>
            <li><strong>La Table Sudbury</strong> - Restaurant français, 123 Rue Principale, 705-123-4567</li>
            <li><strong>Pizza Nord</strong> - Pizzeria italienne, 456 Avenue du Commerce, 705-234-5678</li>
            <li><strong>Le Bistro Local</strong> - Cuisine locale, 789 Boulevard des Pins, 705-345-6789</li>
          </ul>
          <p>Ces restaurants offrent une variété de cuisine et sont bien notés par les clients locaux.</p>
        `;
      } else if (userContent.includes('garage') || userContent.includes('voiture') || userContent.includes('auto') || userContent.includes('véhicule') || userContent.includes('vehicule')) {
        responseContent = `
          <h2>Garages et concessionnaires automobiles à Sudbury</h2>
          <p>Voici quelques garages et concessionnaires à Sudbury :</p>
          <ul>
            <li><strong>Garage Express</strong> - Réparation générale, 123 Rue des Mécaniciens, 705-123-4567</li>
            <li><strong>Concessionnaire LuxAuto</strong> - Vente de véhicules neufs et d'occasion, 456 Boulevard Auto, 705-234-5678</li>
            <li><strong>Centre Service Auto</strong> - Entretien et réparation, 789 Avenue des Véhicules, 705-345-6789</li>
          </ul>
          <p>Ces établissements offrent des services de qualité pour l'entretien et la réparation de vos véhicules.</p>
        `;
      } else if (userContent.includes('coiffeur') || userContent.includes('salon') || userContent.includes('beauté') || userContent.includes('beaute') || userContent.includes('cheveux')) {
        responseContent = `
          <h2>Salons de coiffure et de beauté à Sudbury</h2>
          <p>Voici quelques salons de coiffure et de beauté à Sudbury :</p>
          <ul>
            <li><strong>Salon Élégance</strong> - Coiffure et esthétique, 123 Rue de la Beauté, 705-123-4567</li>
            <li><strong>Coiffure Moderne</strong> - Coiffure pour hommes et femmes, 456 Avenue du Style, 705-234-5678</li>
            <li><strong>Spa Détente</strong> - Services complets de spa et beauté, 789 Boulevard Zen, 705-345-6789</li>
          </ul>
          <p>Ces établissements offrent des services professionnels pour prendre soin de vous.</p>
        `;
      } else if (userContent.includes('magasin') || userContent.includes('shopping') || userContent.includes('achat') || userContent.includes('boutique')) {
        responseContent = `
          <h2>Commerces et boutiques à Sudbury</h2>
          <p>Voici quelques commerces et boutiques à Sudbury :</p>
          <ul>
            <li><strong>Centre Commercial Sudbury</strong> - Centre commercial avec diverses boutiques, 123 Plaza Centrale</li>
            <li><strong>Boutique Mode</strong> - Vêtements et accessoires, 456 Rue du Shopping, 705-234-5678</li>
            <li><strong>Librairie Page</strong> - Livres et papeterie, 789 Avenue Culturelle, 705-345-6789</li>
          </ul>
          <p>Ces commerces offrent une variété de produits pour tous vos besoins.</p>
        `;
      } else if (userContent.includes('santé') || userContent.includes('sante') || userContent.includes('médecin') || userContent.includes('medecin') || userContent.includes('clinique')) {
        responseContent = `
          <h2>Services de santé à Sudbury</h2>
          <p>Voici quelques services de santé à Sudbury :</p>
          <ul>
            <li><strong>Clinique Médicale Centrale</strong> - Médecine générale, 123 Rue de la Santé, 705-123-4567</li>
            <li><strong>Centre Dentaire Sourire</strong> - Soins dentaires, 456 Avenue du Bien-être, 705-234-5678</li>
            <li><strong>Pharmacie Santé+</strong> - Produits pharmaceutiques et conseils, 789 Boulevard Médical, 705-345-6789</li>
          </ul>
          <p>Ces établissements offrent des services de santé de qualité pour prendre soin de vous et votre famille.</p>
        `;
      } else if (userContent.includes('bonjour') || userContent.includes('salut') || userContent.includes('hello') || userContent.includes('hi')) {
        responseContent = `
          <h2>Bienvenue sur le Sudbury Business Directory!</h2>
          <p>Bonjour! Je suis votre assistant virtuel pour trouver des entreprises à Sudbury. Je peux vous aider à trouver:</p>
          <ul>
            <li>Des restaurants et services de restauration</li>
            <li>Des garages et concessionnaires automobiles</li>
            <li>Des salons de beauté et de coiffure</li>
            <li>Des commerces et boutiques</li>
            <li>Des services de santé</li>
            <li>Et bien d'autres entreprises locales!</li>
          </ul>
          <p>Comment puis-je vous aider aujourd'hui?</p>
        `;
      }
      
      // Simuler un délai réseau pour un effet plus réaliste
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Retourner la réponse au format attendu
      return {
        message: {
          role: "assistant",
          content: responseContent
        }
      };
      
    } catch (err) {
      // En cas d'erreur, retourner une réponse par défaut
      console.error("Erreur dans le mode statique:", err);
      return {
        message: {
          role: "assistant",
          content: "Je suis désolé, je ne peux pas traiter votre demande en ce moment. L'application fonctionne en mode statique pour éviter les erreurs 502 sur Netlify."
        }
      };
    }
  }, []);

  const sendMessage = async (content: string) => {
    if (content.trim() === '' || isLoading) return;

    const userMessage: Message = {
      id: getNextMessageId(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);
    setRetryCount(0);

    // Supprimer tout message système précédent
    setMessages(prev => prev.filter(m => m.id !== 'retry-message' && m.id !== 'error-message'));

    try {
      // Vérifier la connectivité
      if (!navigator.onLine) {
        throw new Error('Vous êtes hors ligne. Veuillez vérifier votre connexion internet.');
      }

      const allMessages = [...messages, userMessage];
      const data = await sendMessageWithRetry(allMessages, userMessage.id);
      
      if (data.error) {
        throw new Error(data.error);
      }

      // Supprimer le message de tentative de reconnexion s'il existe
      setMessages(prev => prev.filter(m => m.id !== 'retry-message'));

      const assistantMessage: Message = {
        id: getNextMessageId(),
        role: 'assistant',
        content: data.message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Une erreur est survenue';
      setError(errorMessage);
      
      // Ajouter un message d'erreur visible dans la conversation
      setMessages(prev => [
        ...prev.filter(m => m.id !== 'error-message' && m.id !== 'retry-message'),
        {
          id: 'error-message',
          role: 'system',
          content: `⚠️ <strong>Erreur:</strong> ${errorMessage}<br/>Veuillez réessayer votre demande.`,
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  // Fonction corrigée pour traiter les données de formulaire HTML
  const handleFormSubmit = async (formData: string) => {
    try {
      // Analyser les données du formulaire (format "name: value" par ligne)
      const formEntries: Record<string, string> = {};
      const formLines = formData.split('\n').filter(line => line.trim() !== '');
      
      // Extraire toutes les paires clé-valeur, même celles avec des noms non standards
      formLines.forEach(line => {
        const separatorIndex = line.indexOf(':');
        if (separatorIndex > 0) {
          const key = line.substring(0, separatorIndex).trim();
          const value = line.substring(separatorIndex + 1).trim();
          if (value && value !== '') {
            formEntries[key.toLowerCase()] = value;
          }
        }
      });
      
      // Déterminer le type de recherche basé sur les champs du formulaire
      let formType = "recherche générale";
      
      // Vérifier s'il s'agit d'une recherche de concessionnaire/automobile
      if (formEntries['marque de voiture souhaitée'] || 
          formEntries['marque'] || 
          formEntries['type de véhicule'] || 
          formEntries['véhicule']) {
        formType = "concessionnaire automobile";
      }
      
      // Construire une requête naturelle basée sur tous les champs fournis
      let searchQuery = `Je recherche ${formType === "concessionnaire automobile" ? "un concessionnaire automobile" : "des entreprises"}`;
      const criteria: string[] = [];
      
      // Parcourir toutes les entrées et les ajouter à la requête
      Object.entries(formEntries).forEach(([key, value]) => {
        const normalizedKey = key.toLowerCase();
        
        // Traitement spécifique selon le type de champ
        if (normalizedKey.includes('marque') && value) {
          criteria.push(`qui vend des ${value}`);
        }
        else if (normalizedKey.includes('type') && value && value !== 'tous types') {
          criteria.push(`spécialisé en ${value}`);
        }
        else if (normalizedKey.includes('langue') && value) {
          criteria.push(`qui parle ${value}`);
        }
        else if (normalizedKey.includes('catégorie') || normalizedKey.includes('categorie')) {
          criteria.push(`dans la catégorie "${value}"`);
        }
        else if (normalizedKey.includes('service')) {
          criteria.push(`offrant le service "${value}"`);
        }
        else if (normalizedKey.includes('mot-clé') || normalizedKey.includes('mot clé') || normalizedKey.includes('motcle')) {
          criteria.push(`avec le mot-clé "${value}"`);
        }
        // Ajouter des critères pour tout autre champ non reconnu
        else if (value && !normalizedKey.includes('rechercher') && !normalizedKey.includes('submit')) {
          criteria.push(`avec ${key} = "${value}"`);
        }
      });
      
      // Assembler la requête finale
      if (criteria.length > 0) {
        searchQuery += " " + criteria.join(" et ");
      }
      
      // Ajouter une localisation si non spécifiée
      if (!searchQuery.toLowerCase().includes('sudbury')) {
        searchQuery += " à Sudbury";
      }
      
      // Envoyer la requête
      await sendMessage(`📋 **Recherche d'entreprises**\n\n${searchQuery}.\n\nMerci de me fournir les résultats détaillés.`);
      
    } catch (error) {
      // En cas d'erreur, utiliser la méthode simple
      console.error("Erreur de traitement du formulaire:", error);
      await sendMessage(`📋 **Recherche d'entreprises**\n\n${formData}\n\nPeux-tu me trouver des entreprises correspondant à ces critères ?`);
    }
  };

  const clearChat = () => {
    // Réinitialiser le compteur de messages
    setMessageIdCounter(0);
    
    setMessages([
      {
        id: 'welcome-message', // ID stable pour le message d'accueil
        role: 'assistant',
        content: 'Bonjour ! Je suis l\'agent de l\'annuaire des entreprises de Sudbury. Je peux vous aider à trouver des entreprises locales en fonction de vos besoins. Veuillez utiliser le formulaire ci-dessous pour préciser votre recherche :',
        timestamp: new Date()
      }
    ]);
    setError(null);
  };

  // Afficher une alerte si la connexion est perdue
  if (connectionLost) {
    return (
      <div className="flex flex-col h-screen max-w-5xl mx-auto bg-white shadow-2xl">
        <div className="flex-grow flex items-center justify-center p-6">
          <div className="text-center p-8 bg-red-50 rounded-lg border border-red-200 max-w-md">
            <svg className="w-16 h-16 mx-auto text-red-500 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
            <h2 className="text-xl font-bold text-red-700 mb-2">Connexion perdue</h2>
            <p className="text-gray-700 mb-4">Vous semblez être hors ligne. Veuillez vérifier votre connexion internet et recharger la page.</p>
            <button
              onClick={() => window.location.reload()}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
            >
              Recharger la page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto bg-white shadow-2xl">
      {/* Header */}
      <div className="relative bg-white border-b border-gray-100 p-3 md:p-8 shadow-lg overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative flex justify-between items-center">
          <div className="flex items-center space-x-3 md:space-x-6">
            {/* Logo */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-black via-gray-800 to-black rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-sm"></div>
              <div className="relative w-10 h-10 md:w-16 md:h-16 bg-black rounded-xl md:rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-105 transition-all duration-300">
                {/* Building/Directory Logo */}
                <div className="relative">
                  <svg className="w-5 h-5 md:w-9 md:h-9 text-white" viewBox="0 0 40 40" fill="none">
                    {/* Building-inspired design */}
                    <rect x="10" y="6" width="20" height="28" fill="currentColor" opacity="0.8"/>
                    <rect x="13" y="10" width="4" height="4" fill="white" opacity="0.9"/>
                    <rect x="23" y="10" width="4" height="4" fill="white" opacity="0.9"/>
                    <rect x="13" y="18" width="4" height="4" fill="white" opacity="0.9"/>
                    <rect x="23" y="18" width="4" height="4" fill="white" opacity="0.9"/>
                    <rect x="16" y="26" width="8" height="8" fill="white" opacity="0.9"/>
                  </svg>
                  
                  {/* Pulsing dot */}
                  <div className="absolute top-0.5 right-0.5 md:top-1 md:right-1 w-1.5 h-1.5 md:w-2 md:h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Brand text */}
            <div className="space-y-1">
              <div className="flex items-center space-x-2 md:space-x-3">
                <h1 className="text-xl md:text-4xl font-black text-black tracking-tight bg-gradient-to-r from-black to-gray-700 bg-clip-text">
                  Sudbury Business Directory
                </h1>
                <div className="px-2 py-0.5 md:px-3 md:py-1 bg-black text-white text-xs font-bold rounded-full">
                  OFFICIEL
                </div>
              </div>
              <p className="text-gray-500 font-medium text-xs md:text-sm flex items-center space-x-2">
                <span className="hidden md:inline">Votre guide des entreprises locales à Sudbury</span>
                <span className="md:hidden">Guide des entreprises locales</span>
                <span className="flex items-center space-x-1 text-green-600">
                  <span className="w-1 h-1 md:w-1.5 md:h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-bold">EN LIGNE</span>
                </span>
              </p>
            </div>
          </div>
          
          {/* Reset button */}
          <button
            onClick={clearChat}
            className="group relative bg-white border-2 border-black text-black hover:bg-black hover:text-white px-3 py-2 md:px-8 md:py-3 rounded-lg md:rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden text-xs md:text-sm"
          >
            {/* Button background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-full group-hover:translate-x-0"></div>
            
            <span className="relative z-10 flex items-center space-x-1 md:space-x-2">
              <svg className="w-3 h-3 md:w-5 md:h-5 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span className="hidden md:inline">Nouvelle Recherche</span>
              <span className="md:hidden">Reset</span>
            </span>
          </button>
        </div>
        
        {/* Status indicators */}
        <div className="flex items-center justify-between mt-2 md:mt-4 pt-2 md:pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-3 md:space-x-6 text-xs md:text-sm text-gray-600">
            <div className="flex items-center space-x-1 md:space-x-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>Annuaire</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-green-500 rounded-full"></div>
              <span className="hidden md:inline">Recherche avancée</span>
              <span className="md:hidden">Recherche</span>
            </div>
            <div className="flex items-center space-x-1 md:space-x-2">
              <div className="w-1.5 h-1.5 md:w-2 md:h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>{messages.length - 1}</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-400">
            <span className="hidden md:inline">Ville de Sudbury</span>
            <span className="md:hidden">Sudbury</span>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-3 md:p-8 space-y-4 md:space-y-8 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
            onFormSubmit={handleFormSubmit}
          />
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <div className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <div className="animate-spin rounded-full h-6 w-6 border-2 border-gray-300 border-t-black"></div>
                </div>
                <div className="flex space-x-1">
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-2 h-2 bg-black rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
                <span className="text-black font-semibold">Recherche des entreprises en cours...</span>
              </div>
            </div>
          </div>
        )}
        {error && (
          <div className="bg-white border-l-4 border-black text-black px-6 py-4 rounded-r-xl shadow-lg">
            <div className="flex items-center space-x-3">
              <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd"/>
              </svg>
              <div>
                <strong className="font-bold">Erreur:</strong> <span className="font-medium">{error}</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 via-white to-gray-50 p-3 md:p-8">
        <ChatInput 
          onSendMessage={sendMessage} 
          disabled={isLoading} 
          placeholder="Rechercher une entreprise à Sudbury..."
        />
      </div>
    </div>
  );
};

export default ChatBot; 