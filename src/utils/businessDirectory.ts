// Utiliser un fetch pour accéder aux données en production, import statique en développement
import staticBusinessData from '@/data/sudbury_businesses.json';

// Fonction utilitaire pour le logging
const logToConsole = (message: string, data?: any) => {
  const timestamp = new Date().toISOString();
  console.log(`[BUSINESS-DIRECTORY ${timestamp}] ${message}`);
  if (data) {
    console.log(JSON.stringify(data, null, 2));
  }
};

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

// Variable pour stocker les données
let businessData: { businesses: Business[], categories: string[] } = {
  businesses: [],
  categories: []
};

// Fonction pour charger les données
const loadBusinessData = async () => {
  logToConsole('Début du chargement des données des entreprises');
  logToConsole(`Environnement: ${process.env.NODE_ENV}`);
  
  try {
    // En production (Netlify), charger le fichier depuis l'URL publique
    if (process.env.NODE_ENV === 'production') {
      // Utilisez une URL absolue pour éviter les problèmes de parsing
      const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://intelletix-ai-agent.netlify.app';
      const jsonUrl = `${baseUrl}/data/sudbury_businesses.json`;
      
      logToConsole(`Tentative de chargement depuis URL: ${jsonUrl}`);
      
      try {
        const response = await fetch(jsonUrl);
        
        if (!response.ok) {
          logToConsole(`Erreur HTTP lors du chargement: ${response.status} ${response.statusText}`);
          throw new Error(`Erreur lors du chargement des données: ${response.status}`);
        }
        
        const contentType = response.headers.get('content-type');
        logToConsole(`Type de contenu reçu: ${contentType}`);
        
        const data = await response.json();
        logToConsole('Données JSON analysées avec succès', {
          businessCount: data.businesses?.length,
          categoryCount: data.categories?.length
        });
        
        businessData = data;
        logToConsole('Données chargées depuis l\'URL publique');
      } catch (fetchError: any) {
        logToConsole('Erreur fetch détaillée', {
          name: fetchError.name,
          message: fetchError.message,
          cause: fetchError.cause,
          stack: fetchError.stack
        });
        throw fetchError;
      }
    } else {
      // En développement, utiliser l'import statique
      businessData = staticBusinessData;
      logToConsole('Données chargées depuis l\'import statique', {
        businessCount: businessData.businesses?.length,
        categoryCount: businessData.categories?.length
      });
    }
  } catch (error: any) {
    logToConsole('Erreur lors du chargement des données des entreprises', {
      name: error.name,
      message: error.message,
      stack: error.stack,
      cause: error.cause
    });
    
    // Utiliser les données statiques comme fallback en cas d'erreur
    logToConsole('Utilisation des données statiques comme fallback');
    businessData = staticBusinessData;
  }
};

// Charger les données immédiatement
loadBusinessData();

// Récupérer toutes les entreprises
export const getAllBusinesses = async (): Promise<Business[]> => {
  // Si les données ne sont pas encore chargées, attendre leur chargement
  if (businessData.businesses.length === 0) {
    logToConsole('Données manquantes, rechargement...');
    await loadBusinessData();
  }
  
  logToConsole(`Retour de ${businessData.businesses.length} entreprises`);
  return businessData.businesses as Business[];
};

// Récupérer toutes les catégories
export const getAllCategories = async (): Promise<string[]> => {
  // Si les données ne sont pas encore chargées, attendre leur chargement
  if (businessData.categories.length === 0) {
    logToConsole('Catégories manquantes, rechargement...');
    await loadBusinessData();
  }
  
  logToConsole(`Retour de ${businessData.categories.length} catégories`);
  return businessData.categories as string[];
};

// Récupérer les entreprises par catégorie
export const getBusinessesByCategory = async (category: string): Promise<Business[]> => {
  logToConsole(`Recherche d'entreprises par catégorie: ${category}`);
  const businesses = await getAllBusinesses();
  const results = businesses.filter(business => 
    business.category.toLowerCase() === category.toLowerCase()
  );
  logToConsole(`Trouvé ${results.length} entreprises pour la catégorie ${category}`);
  return results;
};

// Récupérer une entreprise par ID
export const getBusinessById = async (id: string): Promise<Business | undefined> => {
  logToConsole(`Recherche d'entreprise par ID: ${id}`);
  const businesses = await getAllBusinesses();
  const result = businesses.find(business => business.id === id);
  logToConsole(`Entreprise trouvée: ${result ? 'Oui' : 'Non'}`);
  return result;
};

// Rechercher des entreprises par terme de recherche
export const searchBusinesses = async (searchTerm: string): Promise<Business[]> => {
  logToConsole(`Recherche par terme: ${searchTerm}`);
  const businesses = await getAllBusinesses();
  const term = searchTerm.toLowerCase();
  
  const results = businesses.filter(business => 
    business.name.toLowerCase().includes(term) ||
    business.description.toLowerCase().includes(term) ||
    business.category.toLowerCase().includes(term) ||
    business.subcategory.toLowerCase().includes(term) ||
    business.services.some(service => service.toLowerCase().includes(term))
  );
  
  logToConsole(`Trouvé ${results.length} résultats pour le terme "${searchTerm}"`);
  return results;
};

// Recherche avancée avec plusieurs critères
export interface SearchCriteria {
  term?: string;
  category?: string;
  language?: string;
  service?: string;
}

export const advancedSearch = async (criteria: SearchCriteria): Promise<Business[]> => {
  logToConsole('Recherche avancée avec critères', criteria);
  let results = await getAllBusinesses();
  
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
  
  logToConsole(`Résultats de la recherche avancée: ${results.length} entreprises`);
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
export const suggestBusinesses = async (userQuery: string): Promise<Business[]> => {
  logToConsole(`Suggestion d'entreprises pour la requête: "${userQuery}"`);
  
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

  const businesses = await getAllBusinesses();
  const query = userQuery.toLowerCase();
  const matchedCategories: string[] = [];

  // Rechercher des mots-clés dans la requête de l'utilisateur
  Object.entries(keywordMap).forEach(([category, keywords]) => {
    if (keywords.some(keyword => query.includes(keyword.toLowerCase()))) {
      matchedCategories.push(category);
    }
  });

  logToConsole(`Catégories correspondantes: ${matchedCategories.join(', ') || 'Aucune'}`);

  // Si des catégories correspondent, renvoyer les entreprises de ces catégories
  if (matchedCategories.length > 0) {
    const results = businesses.filter(business => 
      matchedCategories.includes(business.category)
    );
    logToConsole(`Trouvé ${results.length} entreprises par catégories correspondantes`);
    return results;
  }

  // Si aucune correspondance par mot-clé, faire une recherche générale
  logToConsole('Aucune catégorie correspondante, recours à la recherche générale');
  return searchBusinesses(userQuery);
}; 