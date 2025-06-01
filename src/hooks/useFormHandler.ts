import { useEffect, useCallback } from 'react';

interface UseFormHandlerProps {
  onFormSubmit: (formData: string) => void;
  messageId: string;
}

export const useFormHandler = ({ onFormSubmit, messageId }: UseFormHandlerProps) => {
  
  const handleFormSubmission = useCallback((event: Event) => {
    event.preventDefault();
    
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    
    // Convertir FormData en objet lisible
    const data: Record<string, any> = {};
    
    formData.forEach((value, key) => {
      if (data[key]) {
        // Si la clé existe déjà, convertir en array (pour les checkboxes multiples)
        if (Array.isArray(data[key])) {
          data[key].push(value);
        } else {
          data[key] = [data[key], value];
        }
      } else {
        data[key] = value;
      }
    });
    
    // Formater les données pour l'envoi
    const formattedData = formatFormData(data, form);
    
    // Envoyer les données au chat
    onFormSubmit(formattedData);
    
    // Optionnel : réinitialiser le formulaire
    form.reset();
    
  }, [onFormSubmit]);

  const formatFormData = (data: Record<string, any>, form: HTMLFormElement): string => {
    const formTitle = form.getAttribute('data-title') || 'Formulaire soumis';
    
    let formatted = `📋 **${formTitle}**\n\n`;
    
    Object.entries(data).forEach(([key, value]) => {
      // Nettoyer le nom du champ (enlever les underscores, capitaliser)
      const fieldName = key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, l => l.toUpperCase());
      
      if (Array.isArray(value)) {
        formatted += `**${fieldName}:** ${value.join(', ')}\n`;
      } else {
        formatted += `**${fieldName}:** ${value}\n`;
      }
    });
    
    return formatted;
  };

  const attachFormListeners = useCallback(() => {
    // Attacher les listeners aux formulaires dans ce message spécifique
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    
    if (messageElement) {
      const forms = messageElement.querySelectorAll('form');
      
      forms.forEach(form => {
        // Enlever les listeners existants pour éviter les doublons
        form.removeEventListener('submit', handleFormSubmission);
        // Ajouter le nouveau listener
        form.addEventListener('submit', handleFormSubmission);
        
        // Ajouter un attribut pour identifier le formulaire
        if (!form.hasAttribute('data-chat-form')) {
          form.setAttribute('data-chat-form', 'true');
        }
      });
    }
  }, [messageId, handleFormSubmission]);

  const detachFormListeners = useCallback(() => {
    const messageElement = document.querySelector(`[data-message-id="${messageId}"]`);
    
    if (messageElement) {
      const forms = messageElement.querySelectorAll('form[data-chat-form]');
      forms.forEach(form => {
        form.removeEventListener('submit', handleFormSubmission);
      });
    }
  }, [messageId, handleFormSubmission]);

  useEffect(() => {
    // Attacher les listeners après le rendu
    const timer = setTimeout(attachFormListeners, 100);
    
    return () => {
      clearTimeout(timer);
      detachFormListeners();
    };
  }, [attachFormListeners, detachFormListeners]);

  return {
    attachFormListeners,
    detachFormListeners
  };
}; 