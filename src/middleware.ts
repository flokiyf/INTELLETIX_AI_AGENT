import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Obtenez la réponse
  const response = NextResponse.next();

  // Ajoutez des en-têtes de sécurité
  response.headers.set('X-DNS-Prefetch-Control', 'on');
  response.headers.set('Strict-Transport-Security', 'max-age=63072000; includeSubDomains; preload');
  response.headers.set('X-XSS-Protection', '1; mode=block');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('Referrer-Policy', 'origin-when-cross-origin');
  response.headers.set('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');

  // Ajoutez CSP pour plus de sécurité, mais permettez les connexions API
  response.headers.set(
    'Content-Security-Policy',
    `default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self' data:; connect-src 'self' https://api.openai.com;`
  );

  return response;
}

// Spécifiez les chemins sur lesquels le middleware doit s'exécuter
export const config = {
  matcher: [
    /*
     * Correspondre à toutes les routes d'accès, sauf :
     * 1. /api (routes API)
     * 2. /_next (ressources Next.js)
     * 3. /_static (généralement images statiques)
     * 4. /_vercel (ressources internes de Vercel)
     */
    '/((?!api|_next|_static|_vercel).*)',
  ],
}; 