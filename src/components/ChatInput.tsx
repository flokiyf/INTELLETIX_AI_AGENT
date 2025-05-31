'use client';

import { useState, KeyboardEvent } from 'react';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  disabled?: boolean;
}

const ChatInput = ({ onSendMessage, disabled = false }: ChatInputProps) => {
  const [message, setMessage] = useState('');
  const [isFocused, setIsFocused] = useState(false);

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
      {/* Background gradient container */}
      <div className="absolute inset-0 bg-gradient-to-r from-gray-50 via-white to-gray-50 rounded-3xl"></div>
      
      <div className={`relative bg-white rounded-3xl p-4 shadow-xl border-2 transition-all duration-300 ${
        isFocused ? 'border-black shadow-2xl scale-[1.02]' : 'border-gray-100 hover:border-gray-200'
      }`}>
        <div className="flex items-end space-x-4">
          {/* Input container with enhanced styling */}
          <div className="flex-1 relative">
            {/* Floating character count */}
            {message.length > 0 && (
              <div className="absolute -top-8 right-2 text-xs text-gray-400 bg-white px-2 py-1 rounded-full shadow-sm border border-gray-100 animate-fadeInUp">
                {message.length} / 2000
              </div>
            )}
            
            <div className="relative">
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyDown={handleKeyPress}
                onFocus={() => setIsFocused(true)}
                onBlur={() => setIsFocused(false)}
                placeholder="💭 Partagez vos pensées avec l'IA..."
                disabled={disabled}
                rows={1}
                maxLength={2000}
                className="w-full resize-none bg-transparent px-6 py-4 text-black placeholder-gray-400 focus:outline-none disabled:cursor-not-allowed transition-all duration-300 font-medium text-base leading-relaxed"
                style={{
                  minHeight: '60px',
                  maxHeight: '160px',
                }}
              />
              
              {/* Animated border indicator */}
              <div className={`absolute bottom-0 left-6 right-6 h-0.5 bg-gradient-to-r from-transparent via-black to-transparent transition-all duration-500 ${
                isFocused ? 'opacity-100 scale-x-100' : 'opacity-0 scale-x-0'
              }`}></div>
              
              {/* Typing indicator */}
              {message.length > 0 && !isFocused && (
                <div className="absolute bottom-3 right-4 flex space-x-1">
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                  <div className="w-1.5 h-1.5 bg-gray-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
                </div>
              )}
            </div>
          </div>
          
          {/* Premium send button */}
          <button
            onClick={handleSubmit}
            disabled={disabled || !message.trim()}
            className={`group relative overflow-hidden rounded-2xl p-4 font-bold transition-all duration-300 transform active:scale-95 shadow-lg ${
              disabled || !message.trim()
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800 hover:scale-110 hover:rotate-3 shadow-xl hover:shadow-2xl'
            }`}
          >
            {/* Button background effects */}
            <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-black to-gray-900 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-10 transition-opacity duration-300"></div>
            
            {/* Ripple effect */}
            <div className="absolute inset-0 rounded-2xl bg-white opacity-0 group-active:opacity-30 transform scale-0 group-active:scale-100 transition-all duration-200"></div>
            
            {/* Icon container */}
            <div className="relative z-10 flex items-center justify-center w-6 h-6">
              {disabled ? (
                <div className="animate-spin rounded-full h-5 w-5 border-2 border-gray-400 border-t-transparent"></div>
              ) : (
                <svg 
                  className="w-6 h-6 transform transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2.5} 
                    d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" 
                  />
                </svg>
              )}
            </div>
            
            {/* Glow effect */}
            <div className={`absolute -inset-2 rounded-2xl opacity-0 group-hover:opacity-20 transition-opacity duration-300 ${
              !disabled && message.trim() ? 'bg-black blur-xl' : ''
            }`}></div>
          </button>
        </div>
        
        {/* Bottom status bar */}
        <div className="flex items-center justify-between mt-3 px-2">
          <div className="flex items-center space-x-3 text-xs text-gray-500">
            <span className="flex items-center space-x-1">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></span>
              <span>IA en ligne</span>
            </span>
            <span>•</span>
            <span>Shift + Entrée pour nouvelle ligne</span>
          </div>
          
          {message.trim() && (
            <div className="text-xs text-gray-400 animate-fadeInUp">
              Appuyez sur Entrée pour envoyer
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatInput; 