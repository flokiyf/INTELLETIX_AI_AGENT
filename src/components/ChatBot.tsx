'use client';

import { useState, useRef, useEffect } from 'react';
import { Message } from '@/types/chat';
import ChatMessage from './ChatMessage';
import ChatInput from './ChatInput';
import { v4 as uuidv4 } from 'uuid';

const ChatBot = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: uuidv4(),
      role: 'assistant',
      content: 'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui ?',
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
      id: uuidv4(),
      role: 'user',
      content: content.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages: [...messages, userMessage].map(msg => ({
            role: msg.role,
            content: msg.content
          }))
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi du message');
      }

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      const assistantMessage: Message = {
        id: uuidv4(),
        role: 'assistant',
        content: data.message.content,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Une erreur est survenue');
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        id: uuidv4(),
        role: 'assistant',
        content: 'Bonjour ! Je suis votre assistant IA. Comment puis-je vous aider aujourd\'hui ?',
        timestamp: new Date()
      }
    ]);
    setError(null);
  };

  return (
    <div className="flex flex-col h-screen max-w-5xl mx-auto bg-white shadow-2xl">
      {/* Premium Header */}
      <div className="relative bg-white border-b border-gray-100 p-8 shadow-lg overflow-hidden">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Ccircle cx='7' cy='7' r='1'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        <div className="relative flex justify-between items-center">
          <div className="flex items-center space-x-6">
            {/* Sophisticated logo */}
            <div className="relative group">
              <div className="absolute -inset-2 bg-gradient-to-r from-black via-gray-800 to-black rounded-2xl opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-sm"></div>
              <div className="relative w-16 h-16 bg-black rounded-2xl flex items-center justify-center shadow-xl transform group-hover:scale-105 transition-all duration-300">
                {/* Geometric AI logo */}
                <div className="relative">
                  <svg className="w-9 h-9 text-white" viewBox="0 0 40 40" fill="none">
                    {/* Neural network inspired design */}
                    <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.8"/>
                    <circle cx="28" cy="12" r="3" fill="currentColor" opacity="0.8"/>
                    <circle cx="20" cy="28" r="3" fill="currentColor"/>
                    <circle cx="8" cy="28" r="2" fill="currentColor" opacity="0.6"/>
                    <circle cx="32" cy="28" r="2" fill="currentColor" opacity="0.6"/>
                    
                    {/* Connecting lines */}
                    <path d="M12 15 L20 25" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
                    <path d="M28 15 L20 25" stroke="currentColor" strokeWidth="1.5" opacity="0.7"/>
                    <path d="M15 12 L25 12" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                    <path d="M11 26 L17 26" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                    <path d="M23 26 L29 26" stroke="currentColor" strokeWidth="1" opacity="0.5"/>
                  </svg>
                  
                  {/* Pulsing dot */}
                  <div className="absolute top-1 right-1 w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
              </div>
            </div>
            
            {/* Brand text */}
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <h1 className="text-4xl font-black text-black tracking-tight bg-gradient-to-r from-black to-gray-700 bg-clip-text">
                  ChatBot IA
                </h1>
                <div className="px-3 py-1 bg-black text-white text-xs font-bold rounded-full">
                  PREMIUM
                </div>
              </div>
              <p className="text-gray-500 font-medium flex items-center space-x-2">
                <span>Assistant intelligent nouvelle génération</span>
                <span className="flex items-center space-x-1 text-green-600">
                  <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                  <span className="text-xs font-bold">ACTIF</span>
                </span>
              </p>
            </div>
          </div>
          
          {/* Enhanced action button */}
          <button
            onClick={clearChat}
            className="group relative bg-white border-2 border-black text-black hover:bg-black hover:text-white px-8 py-3 rounded-xl font-bold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl overflow-hidden"
          >
            {/* Button background effect */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-gray-100 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform -skew-x-12 translate-x-full group-hover:translate-x-0"></div>
            
            <span className="relative z-10 flex items-center space-x-2">
              <svg className="w-5 h-5 transform group-hover:rotate-180 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              <span>Nouveau Chat</span>
            </span>
          </button>
        </div>
        
        {/* Status indicators */}
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
          <div className="flex items-center space-x-6 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></div>
              <span>GPT-3.5 Turbo</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>Connexion sécurisée</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-500 rounded-full animate-pulse"></div>
              <span>{messages.length - 1} messages échangés</span>
            </div>
          </div>
          
          <div className="text-xs text-gray-400">
            Powered by OpenAI
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div className="flex-1 overflow-y-auto p-8 space-y-8 bg-gradient-to-b from-gray-50 to-white">
        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
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
                <span className="text-black font-semibold">L'assistant réfléchit...</span>
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

      {/* Premium Input Area */}
      <div className="border-t border-gray-100 bg-gradient-to-r from-gray-50 via-white to-gray-50 p-8">
        <ChatInput onSendMessage={sendMessage} disabled={isLoading} />
      </div>
    </div>
  );
};

export default ChatBot; 