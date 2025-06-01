import businessData from '@/data/sudbury_businesses.json';

export interface Business {
  id: string;
  name: string;
  category: string;
  subcategory: string;
  address: string;
  phone: string;
  email: string;
  website: string;
  hours: string;
  description: string;
  services: string[];
  languages: string[];
}

// Récupérer toutes les entreprises
export const getAllBusinesses = (): Business[] => {
  return businessData.businesses as Business[];
};

// Récupérer toutes les catégories
export const getAllCategories = (): string[] => {
  return businessData.categories as string[];
};

// Récupérer les entreprises par catégorie
export const getBusinessesByCategory = (category: string): Business[] => {
  return getAllBusinesses().filter(business => 
    business.category.toLowerCase() === category.toLowerCase()
  );
};

// Récupérer une entreprise par ID
export const getBusinessById = (id: string): Business | undefined => {
  return getAllBusinesses().find(business => business.id === id);
};

// Rechercher des entreprises par terme de recherche
export const searchBusinesses = (searchTerm: string): Business[] => {
  const term = searchTerm.toLowerCase();
  
  return getAllBusinesses().filter(business => 
    business.name.toLowerCase().includes(term) ||
    business.description.toLowerCase().includes(term) ||
    business.category.toLowerCase().includes(term) ||
    business.subcategory.toLowerCase().includes(term) ||
    business.services.some(service => service.toLowerCase().includes(term))
  );
};

// Recherche avancée avec plusieurs critères
export interface SearchCriteria {
  term?: string;
  category?: string;
  language?: string;
  service?: string;
}

export const advancedSearch = (criteria: SearchCriteria): Business[] => {
  let results = getAllBusinesses();
  
  if (criteria.term) {
    const term = criteria.term.toLowerCase();
    results = results.filter(business => 
      business.name.toLowerCase().includes(term) ||
      business.description.toLowerCase().includes(term) ||
      business.subcategory.toLowerCase().includes(term)
    );
  }
  
  if (criteria.category) {
    results = results.filter(business => 
      business.category.toLowerCase() === criteria.category?.toLowerCase()
    );
  }
  
  if (criteria.language) {
    results = results.filter(business => 
      business.languages.some(lang => 
        lang.toLowerCase() === criteria.language?.toLowerCase()
      )
    );
  }
  
  if (criteria.service) {
    results = results.filter(business => 
      business.services.some(service => 
        service.toLowerCase().includes(criteria.service?.toLowerCase() || '')
      )
    );
  }
  
  return results;
};

// Formater une entreprise pour l'affichage
export const formatBusinessInfo = (business: Business): string => {
  return `
    <h2>${business.name}</h2>
    <p><strong>Catégorie:</strong> ${business.category} - ${business.subcategory}</p>
    <p><strong>Adresse:</strong> ${business.address}</p>
    <p><strong>Téléphone:</strong> ${business.phone}</p>
    <p><strong>Email:</strong> ${business.email}</p>
    <p><strong>Site web:</strong> ${business.website}</p>
    <p><strong>Horaires:</strong> ${business.hours}</p>
    <p><strong>Description:</strong> ${business.description}</p>
    <p><strong>Services:</strong> ${business.services.join(', ')}</p>
    <p><strong>Langues parlées:</strong> ${business.languages.join(', ')}</p>
  `;
};

// Suggérer des entreprises en fonction d'un besoin ou d'une requête
export const suggestBusinesses = (userQuery: string): Business[] => {
  // Liste de mots-clés associés à différentes catégories
  const keywordMap: Record<string, string[]> = {
    'Restaurant': ['manger', 'restaurant', 'nourriture', 'cuisine', 'repas', 'dîner', 'déjeuner', 'petit-déjeuner'],
    'Automobile': ['voiture', 'auto', 'véhicule', 'réparation', 'mécanique', 'garage', 'concessionnaire'],
    'Services': ['service', 'réparation', 'entretien', 'plomberie'],
    'Beauté': ['coiffure', 'cheveux', 'beauté', 'coupe', 'salon'],
    'Commerce': ['magasin', 'acheter', 'achat', 'shopping', 'librairie', 'livre', 'quincaillerie'],
    'Santé': ['médecin', 'docteur', 'santé', 'clinique', 'médical'],
    'Technologie': ['informatique', 'ordinateur', 'tech', 'réparation', 'web'],
    'Alimentation': ['nourriture', 'aliment', 'épicerie', 'boulangerie', 'pain'],
    'Services juridiques': ['avocat', 'juridique', 'légal', 'droit', 'notaire'],
    'Éducation': ['école', 'garderie', 'enfant', 'éducation', 'apprentissage'],
    'Arts et loisirs': ['danse', 'art', 'loisir', 'cours', 'activité'],
    'Finance': ['banque', 'argent', 'prêt', 'hypothèque', 'finance']
  };

  const query = userQuery.toLowerCase();
  const matchedCategories: string[] = [];

  // Rechercher des mots-clés dans la requête de l'utilisateur
  Object.entries(keywordMap).forEach(([category, keywords]) => {
    if (keywords.some(keyword => query.includes(keyword.toLowerCase()))) {
      matchedCategories.push(category);
    }
  });

  // Si des catégories correspondent, renvoyer les entreprises de ces catégories
  if (matchedCategories.length > 0) {
    return getAllBusinesses().filter(business => 
      matchedCategories.includes(business.category)
    );
  }

  // Si aucune correspondance par mot-clé, faire une recherche générale
  return searchBusinesses(userQuery);
}; 