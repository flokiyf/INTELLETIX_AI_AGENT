'use client';

import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
  placeholder?: string;
  isLoading?: boolean;
}

const ChatInput = ({ 
  onSendMessage, 
  disabled = false, 
  placeholder = "Partagez vos pensées avec l'IA...",
  isLoading = false
}: ChatInputProps) => {
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 md:space-x-4 bg-white rounded-2xl md:rounded-3xl shadow-2xl border-2 border-gray-100 hover:border-gray-200 transition-all duration-300 p-2 md:p-4">
        {/* Input field */}
        <div className="flex-1 relative">
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={placeholder}
            disabled={disabled || isLoading}
            rows={1}
            className="w-full resize-none border-none outline-none text-sm md:text-base text-gray-800 placeholder-gray-400 bg-transparent font-medium leading-relaxed disabled:opacity-50 disabled:cursor-not-allowed"
            style={{ minHeight: '20px', maxHeight: '120px' }}
          />
          
          {/* Character counter for longer messages */}
          {message.length > 100 && (
            <div className="absolute -bottom-1 right-0 text-xs text-gray-400">
              {message.length}/500
            </div>
          )}
        </div>

        {/* Send button */}
        <button
          onClick={handleSubmit}
          disabled={disabled || isLoading || message.trim() === ''}
          className={`group relative flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-xl md:rounded-2xl flex items-center justify-center font-bold transition-all duration-300 transform active:scale-95 shadow-lg ${
            disabled || isLoading || message.trim() === ''
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-black text-white hover:bg-gray-800 hover:scale-110 shadow-xl hover:shadow-2xl'
          }`}
        >
          {/* Button glow effect */}
          {!disabled && !isLoading && message.trim() !== '' && (
            <div className="absolute inset-0 bg-gradient-to-r from-black via-gray-700 to-black rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 blur-sm"></div>
          )}
          
          <div className="relative z-10">
            {isLoading ? (
              <div className="flex space-x-0.5">
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-1 h-1 md:w-1.5 md:h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            ) : (
              <svg className="w-4 h-4 md:w-5 md:h-5 transform group-hover:translate-x-0.5 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            )}
          </div>
        </button>
      </div>

      {/* Enhanced hints */}
      <div className="flex items-center justify-between mt-2 md:mt-3 px-2 md:px-4">
        <div className="flex items-center space-x-3 md:space-x-4 text-xs text-gray-500">
          <span className="flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono">Enter</kbd>
            <span className="hidden md:inline">pour envoyer</span>
            <span className="md:hidden">envoyer</span>
          </span>
          <span className="flex items-center space-x-1">
            <kbd className="px-1.5 py-0.5 bg-gray-100 border border-gray-200 rounded text-xs font-mono">Shift+Enter</kbd>
            <span className="hidden md:inline">nouvelle ligne</span>
            <span className="md:hidden">retour</span>
          </span>
        </div>
        
        <div className="flex items-center space-x-2 text-xs text-gray-400">
          <div className="flex items-center space-x-1">
            <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></div>
            <span className="hidden md:inline">Prêt à répondre</span>
            <span className="md:hidden">Prêt</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatInput; 