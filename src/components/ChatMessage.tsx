'use client';

import { Message } from '@/types/chat';
import { formatDistanceToNow } from 'date-fns';
import { fr } from 'date-fns/locale';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage = ({ message }: ChatMessageProps) => {
  const isUser = message.role === 'user';
  
  return (
    <div className={`flex ${isUser ? 'justify-end animate-slideInRight' : 'justify-start animate-slideInLeft'} mb-8`}>
      <div className={`flex max-w-lg ${isUser ? 'flex-row-reverse' : 'flex-row'} items-end space-x-4`}>
        {/* Avatar */}
        <div className={`flex-shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center font-black text-lg shadow-lg transition-all duration-300 hover:scale-110 ${
          isUser 
            ? 'bg-black text-white transform rotate-3 hover:rotate-6' 
            : 'bg-white text-black border-2 border-black transform -rotate-3 hover:-rotate-6'
        }`}>
          {isUser ? (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
            </svg>
          )}
        </div>
        
        {/* Message Bubble */}
        <div className={`relative rounded-2xl px-6 py-4 shadow-lg transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${
          isUser 
            ? 'bg-black text-white ml-4 rounded-br-md' 
            : 'bg-white text-black border border-gray-200 mr-4 rounded-bl-md'
        }`}>
          {/* Message pointer */}
          <div className={`absolute bottom-0 w-4 h-4 transform rotate-45 ${
            isUser 
              ? 'bg-black -right-2' 
              : 'bg-white border-r border-b border-gray-200 -left-2'
          }`}></div>
          
          <p className="text-sm leading-relaxed whitespace-pre-wrap font-medium relative z-10">
            {message.content}
          </p>
          
          <div className={`flex items-center justify-between mt-3 pt-2 border-t relative z-10 ${
            isUser ? 'border-gray-700' : 'border-gray-100'
          }`}>
            <p className={`text-xs font-medium ${
              isUser ? 'text-gray-300' : 'text-gray-500'
            }`}>
              {formatDistanceToNow(message.timestamp, { 
                addSuffix: true, 
                locale: fr 
              })}
            </p>
            
            {/* Status indicator with pulse animation */}
            <div className={`w-2 h-2 rounded-full animate-pulse-subtle ${
              isUser ? 'bg-green-400' : 'bg-blue-400'
            }`}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 