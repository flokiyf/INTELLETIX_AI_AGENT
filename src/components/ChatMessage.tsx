'use client';

import { Message } from '@/types/chat';
import DOMPurify from 'dompurify';
import { format } from 'date-fns';
import { useEffect, useRef } from 'react';

interface ChatMessageProps {
  message: Message;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const contentRef = useRef<HTMLDivElement>(null);

  // Fonction de nettoyage du HTML pour éviter les failles XSS
  const sanitizeHTML = (html: string) => {
    return DOMPurify.sanitize(html, {
      ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'a', 'p', 'h1', 'h2', 'h3', 'h4', 'ul', 'ol', 'li', 'br', 'span', 'div', 'code', 'pre'],
      ALLOWED_ATTR: ['href', 'target', 'class'],
    });
  };

  // Pour gérer le HTML inséré après le rendu
  useEffect(() => {
    if (contentRef.current && message.role === 'assistant') {
      // Si le message contient des balises HTML, on les rend
      if (/<[a-z][\s\S]*>/i.test(message.content)) {
        contentRef.current.innerHTML = sanitizeHTML(message.content);
      } else {
        // Sinon, on affiche le texte brut
        contentRef.current.textContent = message.content;
      }
    }
  }, [message.content, message.role]);

  const isUser = message.role === 'user';
  const isError = message.isError === true;

  // Déterminer les classes CSS en fonction du type de message
  const containerClass = isUser
    ? 'flex justify-end mb-4'
    : 'flex justify-start mb-4';

  const messageClass = isUser
    ? 'bg-primary text-white rounded-lg py-2 px-4 max-w-[80%]'
    : isError
      ? 'bg-red-100 text-red-800 rounded-lg py-2 px-4 max-w-[80%] border border-red-300'
      : 'bg-gray-200 text-gray-800 rounded-lg py-2 px-4 max-w-[80%]';

  const timeFormatted = format(message.timestamp, 'HH:mm');

  return (
    <div className={containerClass}>
      <div>
        <div className={messageClass}>
          {isUser ? (
            <p>{message.content}</p>
          ) : (
            <div
              ref={contentRef}
              className={`prose prose-sm max-w-none ${isError ? 'prose-red' : ''}`}
            >
              {/* Le contenu sera injecté via useEffect */}
            </div>
          )}
        </div>
        <div className="text-xs text-gray-500 mt-1 ml-2">
          {timeFormatted}
        </div>
      </div>
    </div>
  );
};

export default ChatMessage; 