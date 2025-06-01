import { NextRequest, NextResponse } from 'next/server';
import { 
  getAllBusinesses, 
  getBusinessesByCategory, 
  getBusinessById, 
  searchBusinesses,
  advancedSearch,
  SearchCriteria
} from '@/utils/businessDirectory';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    
    // Récupérer les paramètres de recherche
    const id = searchParams.get('id');
    const category = searchParams.get('category');
    const term = searchParams.get('term');
    const language = searchParams.get('language');
    const service = searchParams.get('service');
    
    // Recherche par ID (priorité la plus élevée)
    if (id) {
      const business = getBusinessById(id);
      if (business) {
        return NextResponse.json({ business });
      } else {
        return NextResponse.json(
          { error: 'Entreprise non trouvée' },
          { status: 404 }
        );
      }
    }
    
    // Recherche avancée si plusieurs critères sont fournis
    if ((term && (category || language || service)) || (category && language) || (category && service) || (language && service)) {
      const criteria: SearchCriteria = {};
      if (term) criteria.term = term;
      if (category) criteria.category = category;
      if (language) criteria.language = language;
      if (service) criteria.service = service;
      
      const results = advancedSearch(criteria);
      return NextResponse.json({ businesses: results });
    }
    
    // Recherche par catégorie
    if (category) {
      const businesses = getBusinessesByCategory(category);
      return NextResponse.json({ businesses });
    }
    
    // Recherche par terme
    if (term) {
      const businesses = searchBusinesses(term);
      return NextResponse.json({ businesses });
    }
    
    // Si aucun paramètre spécifique, renvoyer toutes les entreprises
    const businesses = getAllBusinesses();
    return NextResponse.json({ businesses });
    
  } catch (error) {
    console.error('Erreur API Businesses:', error);
    return NextResponse.json(
      { error: 'Erreur lors de la recherche d\'entreprises' },
      { status: 500 }
    );
  }
} 