import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  console.log('Middleware exécuté pour:', request.url);
  
  // Journaliser les informations de la requête pour les appels API
  if (request.nextUrl.pathname.startsWith('/api/')) {
    console.log('Requête API interceptée:', request.nextUrl.pathname);
    console.log('Méthode:', request.method);
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/:path*',
  ],
}; 