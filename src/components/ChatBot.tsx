'use client';

import { useState, useRef, useEffect, useId } from 'react';
import { Message } from '@/types/chat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';

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
      content: 'Bonjour ! Je suis l\'agent de l\'annuaire des entreprises de Sudbury. Je peux vous aider à trouver des entreprises locales en fonction de vos besoins. Posez-moi simplement vos questions sur les entreprises et services disponibles à Sudbury.',
      timestamp: new Date()
    }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

    try {
      // Préparer les messages pour l'API
      const messageData = [...messages, userMessage].map(msg => ({
        role: msg.role,
        content: msg.content
      }));
      
      // Définir les points de terminaison API à essayer en ordre
      const endpoints = [
        // Fonction locale 
        '/.netlify/functions/openai-proxy',
        // Fonction sur le domaine principal
        'https://sudbury-directory-new.netlify.app/.netlify/functions/openai-proxy',
        // Route API Next.js (fallback)
        '/api/chat'
      ];
      
      let lastError = null;
      let success = false;
      
      // Essayer chaque point de terminaison jusqu'à ce qu'un fonctionne
      for (const endpoint of endpoints) {
        try {
          console.log(`Tentative avec le point de terminaison: ${endpoint}`);
          
          const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              messages: messageData
            }),
          });

          if (!response.ok) {
            const errorText = await response.text();
            console.error(`Erreur (${response.status}) avec ${endpoint}:`, errorText);
            throw new Error(`Erreur ${response.status}: ${errorText || 'Pas de détails'}`);
          }

          const data = await response.json();
          
          if (data.error) {
            throw new Error(data.error);
          }

          const assistantMessage: Message = {
            id: getNextMessageId(),
            role: 'assistant',
            content: data.message.content,
            timestamp: new Date()
          };

          setMessages(prev => [...prev, assistantMessage]);
          success = true;
          break; // Sortir de la boucle si réussi
        } catch (err) {
          console.error(`Échec avec ${endpoint}:`, err);
          lastError = err;
        }
      }

      if (!success) {
        throw lastError || new Error('Tous les points de terminaison API ont échoué');
      }
    } catch (err) {
      console.error('Erreur finale:', err);
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
      
      // Ajouter un message d'erreur à l'interface utilisateur
      const errorMessage: Message = {
        id: getNextMessageId(),
        role: 'assistant',
        content: 'Désolé, je ne peux pas répondre pour le moment. Veuillez réessayer plus tard.',
        timestamp: new Date(),
        isError: true
      };
      
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    // Réinitialiser le compteur de messages
    setMessageIdCounter(0);
    
    setMessages([
      {
        id: 'welcome-message', // ID stable pour le message d'accueil
        role: 'assistant',
        content: 'Bonjour ! Je suis l\'agent de l\'annuaire des entreprises de Sudbury. Je peux vous aider à trouver des entreprises locales en fonction de vos besoins. Posez-moi simplement vos questions sur les entreprises et services disponibles à Sudbury.',
        timestamp: new Date()
      }
    ]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-full max-h-[800px] bg-gray-50 rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 bg-primary text-white">
        <h2 className="text-xl font-semibold">Sudbury Business Directory</h2>
        <p className="text-sm opacity-90">Votre assistant virtuel pour trouver des entreprises à Sudbury</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50 space-y-4">
        {messages.map((message) => (
          <ChatMessage 
            key={message.id} 
            message={message} 
          />
        ))}
        {isLoading && (
          <div className="flex justify-center">
            <div className="bg-white rounded-lg p-3 shadow border border-gray-200">
              <div className="flex items-center space-x-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-gray-300 border-t-primary"></div>
                <span className="text-gray-600 text-sm">Recherche en cours...</span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {error && (
        <div className="p-2 bg-red-100 text-red-800 text-sm border-t border-red-200">
          <p>Erreur: {error}</p>
          <p className="text-xs mt-1">Essayez de rafraîchir la page ou de réessayer plus tard.</p>
        </div>
      )}
      
      <div className="p-4 border-t border-gray-200 bg-white">
        <ChatInput 
          onSendMessage={sendMessage} 
          disabled={isLoading} 
          isLoading={isLoading}
        />
        <p className="text-xs text-gray-500 mt-2 text-center">
          Posez des questions sur les entreprises et services disponibles à Sudbury
        </p>
      </div>
    </div>
  );
};

export default ChatBot; 