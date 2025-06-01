import DOMPurify from 'dompurify';

// Configuration pour permettre les éléments interactifs
const ALLOWED_TAGS = [
  'div', 'span', 'p', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'strong', 'em', 'b', 'i', 'u',
  'form', 'input', 'button', 'select', 'option', 'textarea', 'label',
  'table', 'thead', 'tbody', 'tr', 'td', 'th',
  'a', 'img', 'br', 'hr',
  'blockquote', 'code', 'pre',
  'section', 'article', 'header', 'footer', 'nav'
];

const ALLOWED_ATTRIBUTES = [
  'class', 'id', 'style',
  'type', 'name', 'value', 'placeholder', 'required', 'disabled',
  'href', 'target', 'rel',
  'src', 'alt', 'width', 'height',
  'data-*'
];

export const sanitizeHTML = (html: string): string => {
  if (typeof window === 'undefined') {
    // Server-side: retourner le HTML brut (sera nettoyé côté client)
    return html;
  }

  // Configuration DOMPurify
  const config = {
    ALLOWED_TAGS,
    ALLOWED_ATTR: ALLOWED_ATTRIBUTES,
    KEEP_CONTENT: true,
    ALLOW_DATA_ATTR: true,
  };

  return DOMPurify.sanitize(html, config);
};

export const enhanceHTML = (html: string): string => {
  // Améliorer le HTML avec des classes Tailwind par défaut
  let enhancedHTML = html;

  // Ajouter des classes par défaut si elles n'existent pas
  const enhancements = [
    // Boutons
    {
      regex: /<button(?![^>]*class=)/g,
      replacement: '<button class="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"'
    },
    // Inputs
    {
      regex: /<input(?![^>]*class=)/g,
      replacement: '<input class="border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-black"'
    },
    // Formulaires
    {
      regex: /<form(?![^>]*class=)/g,
      replacement: '<form class="space-y-4"'
    },
    // Listes
    {
      regex: /<ul(?![^>]*class=)/g,
      replacement: '<ul class="space-y-2"'
    },
    // Titres
    {
      regex: /<h1(?![^>]*class=)/g,
      replacement: '<h1 class="text-2xl font-bold mb-4"'
    },
    {
      regex: /<h2(?![^>]*class=)/g,
      replacement: '<h2 class="text-xl font-bold mb-3"'
    },
    {
      regex: /<h3(?![^>]*class=)/g,
      replacement: '<h3 class="text-lg font-bold mb-2"'
    },
    // Paragraphes
    {
      regex: /<p(?![^>]*class=)/g,
      replacement: '<p class="mb-2"'
    }
  ];

  enhancements.forEach(({ regex, replacement }) => {
    enhancedHTML = enhancedHTML.replace(regex, replacement);
  });

  return enhancedHTML;
};

export const processHTMLContent = (content: string): string => {
  // 1. Nettoyer le HTML
  const cleaned = sanitizeHTML(content);
  
  // 2. Améliorer avec des classes par défaut
  const enhanced = enhanceHTML(cleaned);
  
  return enhanced;
}; 